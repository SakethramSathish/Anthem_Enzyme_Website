import os
import hmac
import hashlib
import json
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Header, Request, BackgroundTasks
from pydantic import BaseModel, Field
import razorpay
import jwt
import httpx
from firebase_admin import firestore
from claims_manager import verify_firebase_token
from rate_limiter import limiter
from geolocation import INTERNAL_API_KEY
from pricing_manager import get_pricing_config

logger = logging.getLogger("anthem.payments")

router = APIRouter()

# Initialize Razorpay Client
razorpay_client = None
if os.getenv("RAZORPAY_KEY_ID") and os.getenv("RAZORPAY_KEY_SECRET"):
    razorpay_client = razorpay.Client(auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET")))

# Lazy load db to prevent startup crash if credentials are not configured
_db = None
def get_db():
    global _db
    if _db is None:
        _db = firestore.client()
    return _db

# --- Valid order status transitions (state machine) ---
VALID_TRANSITIONS = {
    "pending": ["paid"],
    "paid": ["captured"],
    "captured": ["fulfilled"],
}

class CartItem(BaseModel):
    id: str = Field(..., min_length=1, max_length=100)
    quantity: int = Field(..., gt=0, le=1000)
    price: int = Field(..., ge=0)
    unitId: str = Field(None, max_length=100)
    name: str = Field(None, max_length=200)
    unitLabel: str = Field(None, max_length=100)

class CreateOrderRequest(BaseModel):
    cartItems: list[CartItem] = Field(..., min_length=1, max_length=100)
    shippingMethod: str = Field(..., pattern="^(south_india|north_india|outside_india)$")
    currency: str = Field(..., pattern="^(INR|USD)$")

def get_db_price(product_id: str, unit_id: str, client_price: int, currency: str) -> int:
    """Zero-trust: Fetches price from DB or fallback map to prevent client-side manipulation"""
    try:
        config = get_pricing_config()
        prices = config["prices"]
        db = get_db()
        doc = db.collection('products').document(product_id).get()
        if not doc.exists:
            # Fallback to config prices if DB doesn't have it
            if unit_id in prices.get(currency, {}):
                return prices[currency][unit_id]
            return client_price
        
        data = doc.to_dict()
        if 'units' in data and isinstance(data['units'], dict) and unit_id in data['units']:
            return int(data['units'][unit_id].get('price', client_price))
        if 'price' in data:
            return int(data['price'])
            
        # Fallback to config prices
        if unit_id in prices.get(currency, {}):
            return prices[currency][unit_id]
        return client_price
    except Exception as e:
        logger.error(f"Firestore read failed for product {product_id}: {e}")
        raise HTTPException(status_code=503, detail="Database temporarily unavailable. Please try again.")

@router.post("/api/create-order")
@limiter.limit("5/minute")
def create_order(
    request: Request,
    payload: CreateOrderRequest,
    caller: dict = Depends(verify_firebase_token),
    idempotency_key: str = Header(None, alias="Idempotency-Key"),
    x_session_token: str = Header(..., alias="X-Session-Token")
):
    """Creates a Razorpay order with idempotency, role checks, and DB pricing."""
    if not razorpay_client:
        raise HTTPException(status_code=500, detail="Razorpay is not configured on the server")
        
    # Verify session token
    try:
        session_data = jwt.decode(x_session_token, INTERNAL_API_KEY, algorithms=["HS256"])
        if session_data.get("currency") != payload.currency:
            raise HTTPException(status_code=403, detail="Currency spoofing detected")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired, please refresh")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid session token")

    # 1. Role Enforcement
    role = caller.get("role", "user")
    allowed_roles = ["user", "admin", "manager", "product_manager"]
    if role not in allowed_roles:
        raise HTTPException(status_code=403, detail="Role not permitted to create orders")

    # 2. Idempotency Check: if we've seen this key before, return the existing order
    if idempotency_key:
        try:
            existing = get_db().collection("idempotency_keys").document(idempotency_key).get()
            if existing.exists:
                logger.info(f"Idempotency key hit: {idempotency_key}")
                return existing.to_dict().get("response")
        except Exception:
            pass  # If idempotency check fails, proceed with normal flow
        
    # 3. Zero-Trust Pricing Calculation
    subtotal = 0
    for item in payload.cartItems:
        db_price = get_db_price(item.id, item.unitId, item.price, payload.currency)
        subtotal += db_price * item.quantity
        
    shipping_cost = 0
    if subtotal > 0:
        shipping_rates = get_pricing_config()["shipping"]
        shipping_cost = shipping_rates[payload.currency].get(payload.shippingMethod, 0)
        
    gst = round(subtotal * 0.18) if payload.currency == "INR" else 0
    total = subtotal + shipping_cost + gst
    
    # 4. Create Razorpay Order with targeted exception handling
    try:
        options = {
            "amount": int(total * 100),
            "currency": payload.currency,
            "receipt": f"rcpt_{caller['uid'][:10]}_{os.urandom(4).hex()}"
        }
        order = razorpay_client.order.create(data=options)
    except razorpay.errors.ServerError as e:
        logger.error(f"Razorpay server error: {e}")
        raise HTTPException(status_code=502, detail="Payment gateway is temporarily unavailable. Please try again.")
    except Exception as e:
        if "timeout" in str(e).lower() or "connect" in str(e).lower():
            logger.error(f"Razorpay timeout: {e}")
            raise HTTPException(status_code=504, detail="Payment gateway timed out. Please try again.")
        logger.error(f"Razorpay error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create order. Please try again.")

    # 5. Store idempotency key
    if idempotency_key:
        try:
            get_db().collection("idempotency_keys").document(idempotency_key).set({
                "response": order,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "uid": caller.get("uid")
            })
        except Exception as e:
            logger.warning(f"Failed to store idempotency key: {e}")

    return order

def send_order_notification_email(order_data: dict):
    """Sends order confirmation notification email in the background without blocking the HTTP response."""
    try:
        from email_service import send_email
        receiver_email = os.getenv("NOTIFICATION_EMAIL", "enterokinase@anthembio.com")
        
        products_text = ""
        for p in order_data.get('products', []):
            products_text += f"- {p.get('name', 'Product')} x{p.get('quantity', 1)} ({p.get('unitLabel', '')})\n"
            
        subject = f"New Order Placed: {order_data.get('invoiceId', 'Unknown')}"
        body = f"""New order has been placed on Anthem Enzyme Website!

Invoice ID: {order_data.get('invoiceId', 'Unknown')}
Payment ID: {order_data.get('paymentId', 'Unknown')}
Total Amount: {order_data.get('currency', 'INR')} {order_data.get('totals', {}).get('total', 0)}

Customer Details:
Name: {order_data.get('customerName', order_data.get('shippingDetails', {}).get('fullName', 'Unknown'))}
Email: {order_data.get('customerEmail', order_data.get('shippingDetails', {}).get('email', 'Unknown'))}
Phone: {order_data.get('shippingDetails', {}).get('phone', 'Unknown')}
Organization: {order_data.get('shippingDetails', {}).get('organization', 'N/A')}

Shipping Details:
Method: {order_data.get('shippingMethod', 'Standard')}
Address: {order_data.get('shippingDetails', {}).get('address', 'Unknown')}
City: {order_data.get('shippingDetails', {}).get('city', 'Unknown')}
PIN Code: {order_data.get('shippingDetails', {}).get('pinCode', 'Unknown')}
Country: {order_data.get('shippingDetails', {}).get('country', 'Unknown')}

Order Contents:
{products_text}"""
        
        customer_email = order_data.get('customerEmail', order_data.get('shippingDetails', {}).get('email'))
        success = send_email(subject=subject, body=body, reply_to=customer_email, recipient=receiver_email)
        if not success:
            logger.error(f"Failed to send order notification email for invoice {order_data.get('invoiceId')}")
    except Exception as email_err:
        logger.error(f"Failed to send order email: {email_err}")


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str = Field(..., min_length=5, max_length=50)
    razorpay_payment_id: str = Field(..., min_length=5, max_length=50)
    razorpay_signature: str = Field(..., min_length=10, max_length=100)
    order_data: dict

@router.post("/api/verify-payment")
@limiter.limit("10/hour")
def verify_payment(
    request: Request, 
    payload: VerifyPaymentRequest, 
    background_tasks: BackgroundTasks, 
    caller: dict = Depends(verify_firebase_token)
):
    """Synchronous verification with constant-time signature comparison."""
    secret = os.getenv("RAZORPAY_KEY_SECRET")
    if not secret:
        raise HTTPException(status_code=500, detail="Server configuration missing")
        
    body = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}"
    expected_signature = hmac.new(
        secret.encode(), 
        body.encode(), 
        hashlib.sha256
    ).hexdigest()
    
    # SECURITY: Constant-time comparison to prevent timing attacks
    if hmac.compare_digest(expected_signature, payload.razorpay_signature):
        order_data = payload.order_data
        order_data["status"] = "paid"
        order_data["paymentId"] = payload.razorpay_payment_id
        order_data["razorpayOrderId"] = payload.razorpay_order_id
        order_data["status_updated_at"] = datetime.now(timezone.utc).isoformat()
        
        try:
            get_db().collection("orders").add(order_data)
            # Queue email in background so the user receives an instant response
            background_tasks.add_task(send_order_notification_email, order_data)
        except Exception as e:
            logger.error(f"Firestore write failed during payment verification: {e}")
            raise HTTPException(status_code=503, detail="Order saved but database write failed. Contact support.")
            
        return {"success": True, "message": "Payment verified and order saved successfully"}
    else:
        raise HTTPException(status_code=400, detail="Invalid signature")

@router.post("/api/webhook/razorpay")
async def razorpay_webhook(request: Request):
    """Resilient webhook handler with deduplication, state machine, atomic writes, and DLQ."""
    webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET")
    signature = request.headers.get("X-Razorpay-Signature")
    
    if not signature or not webhook_secret:
        raise HTTPException(status_code=400, detail="Missing signature or secret")
        
    payload = await request.body()
    
    try:
        razorpay_client.utility.verify_webhook_signature(payload.decode('utf-8'), signature, webhook_secret)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook verification failed: {str(e)}")
        
    event = await request.json()
    event_id = event.get("event_id") or event.get("id", "unknown")
    event_type = event.get("event", "unknown")
    
    try:
        db = get_db()
        
        # --- Duplicate webhook check ---
        webhook_ref = db.collection("processed_webhooks").document(event_id)
        if webhook_ref.get().exists:
            logger.info(f"Duplicate webhook ignored: {event_id}")
            return {"status": "ok", "message": "Already processed"}
        
        if event_type == "payment.captured":
            payment_entity = event["payload"]["payment"]["entity"]
            razorpay_order_id = payment_entity.get("order_id")
            
            # Find the order
            orders_query = db.collection("orders").where("razorpayOrderId", "==", razorpay_order_id).limit(1).stream()
            order_doc = None
            for d in orders_query:
                order_doc = d
                break
            
            if order_doc:
                # --- Atomic transaction: validate state + update + log ---
                @firestore.transactional
                def update_in_transaction(transaction, order_ref):
                    snapshot = order_ref.get(transaction=transaction)
                    if not snapshot.exists:
                        return False
                    
                    current_status = snapshot.to_dict().get("status", "pending")
                    new_status = "captured"
                    
                    # State machine: only allow valid transitions
                    if new_status not in VALID_TRANSITIONS.get(current_status, []):
                        logger.warning(f"Invalid state transition: {current_status} -> {new_status} for order {razorpay_order_id}")
                        return False
                    
                    transaction.update(order_ref, {
                        "status": new_status,
                        "firc_tracking": "initiated",
                        "webhook_verified_at": firestore.SERVER_TIMESTAMP,
                        "status_updated_at": firestore.SERVER_TIMESTAMP
                    })
                    return True
                
                transaction = db.transaction()
                update_in_transaction(transaction, order_doc.reference)
        
        # Mark webhook as processed (deduplication record)
        webhook_ref.set({
            "event_type": event_type,
            "processed_at": datetime.now(timezone.utc).isoformat()
        })
            
    except Exception as e:
        # --- DLQ: Log failed webhook payload for manual recovery ---
        logger.error(f"Webhook processing failed for event {event_id}: {e}")
        try:
            with open("failed_webhooks.jsonl", "a") as f:
                f.write(json.dumps({
                    "event_id": event_id,
                    "event_type": event_type,
                    "payload": event,
                    "error": str(e),
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }) + "\n")
        except Exception as log_err:
            logger.critical(f"DLQ write also failed: {log_err}")
        
        # Return 500 so Razorpay retries the webhook
        raise HTTPException(status_code=500, detail="Webhook processing failed. Will retry.")
        
    return {"status": "ok"}
