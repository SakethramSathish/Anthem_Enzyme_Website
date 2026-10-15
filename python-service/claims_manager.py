import os
from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel, Field
import firebase_admin
from firebase_admin import auth, firestore
from typing import Optional

# Ensure Firebase is initialized
import firebase_admin_init

router = APIRouter()

class ClaimUpdateRequest(BaseModel):
    target_uid: str = Field(..., min_length=1, max_length=128)
    role: str = Field(..., pattern="^(admin|manager|product_manager|user|customer)$")

def verify_firebase_token(authorization: str = Header(None)):
    """
    Verifies the incoming Bearer token. Returns decoded claims for ANY authenticated user.
    Used by endpoints that need authentication but not a specific role (e.g., payments).
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized: Missing or invalid Authorization header")
    
    token = authorization.split("Bearer ")[1]
    
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Unauthorized: Token has expired. Please re-authenticate.")
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid token.")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Unauthorized: {str(e)}")

def verify_admin_token(authorization: str = Header(None)):
    """
    Verifies the incoming Bearer token AND ensures the caller has the 'admin' role.
    Checks Firestore `users/{uid}` as primary source of truth, revokes stale claims on demotion,
    and falls back to token claims if Firestore is unreachable.
    """
    decoded_token = verify_firebase_token(authorization)
    uid = decoded_token.get("uid")
    
    # Check Firestore `users/{uid}` as primary source of truth
    if uid:
        try:
            db = firestore.client()
            user_doc = db.collection("users").document(uid).get()
            if user_doc.exists:
                user_data = user_doc.to_dict() or {}
                firestore_role = str(user_data.get("role", "")).lower()
                if firestore_role != "admin":
                    # If Firestore explicitly shows user is not admin, revoke stale token claim if present
                    if decoded_token.get("role") == "admin":
                        try:
                            auth.set_custom_user_claims(uid, {"role": "user"})
                        except Exception:
                            pass
                    raise HTTPException(status_code=403, detail="Forbidden: Requires admin role")
                else:
                    # User is confirmed admin in Firestore
                    if decoded_token.get("role") != "admin":
                        try:
                            auth.set_custom_user_claims(uid, {"role": "admin"})
                        except Exception as claim_err:
                            print(f"Notice: Failed to auto-sync custom claim for admin {uid}: {claim_err}")
                    decoded_token["role"] = "admin"
                    return decoded_token
        except HTTPException:
            raise
        except Exception as e:
            print(f"Error checking Firestore admin role for {uid}: {e}")

    # Fallback check if Firestore document was not found
    role = decoded_token.get("role", "")
    if isinstance(role, str) and role.lower() == "admin":
        return decoded_token

    raise HTTPException(status_code=403, detail="Forbidden: Requires admin role")

@router.post("/api/admin/set-claim")
def set_user_claim(request: ClaimUpdateRequest, caller: dict = Depends(verify_admin_token)):
    """
    Securely updates a user's custom claims and Firestore document. Only accessible by admins.
    """
    valid_roles = ["admin", "manager", "product_manager", "user", "customer"]
    normalized_role = request.role.lower()
    if normalized_role not in valid_roles:
        raise HTTPException(status_code=400, detail="Invalid role specified")
    
    claim_role = "user" if normalized_role in ["user", "customer"] else normalized_role
    firestore_role = "Admin" if normalized_role == "admin" else ("Customer" if normalized_role in ["user", "customer"] else request.role)
    
    try:
        auth.set_custom_user_claims(request.target_uid, {"role": claim_role})
        
        # Also sync Firestore document to keep both layers unified
        try:
            db = firestore.client()
            db.collection("users").document(request.target_uid).set({"role": firestore_role}, merge=True)
        except Exception as fe:
            print(f"Notice: Failed to update Firestore role for {request.target_uid}: {fe}")

        return {"status": "success", "message": f"Successfully assigned role '{firestore_role}' to {request.target_uid}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update claim: {str(e)}")

# Added for initial setup/bootstrapping (must be protected by an internal secret, not just Firebase Auth)
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "default-dev-key")

def verify_internal_key(x_internal_key: str = Header(...)):
    if x_internal_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid Internal API Key")
    return x_internal_key

@router.post("/api/internal/bootstrap-admin")
def bootstrap_admin(request: ClaimUpdateRequest, x_internal_key: str = Depends(verify_internal_key)):
    """
    Used to grant the very first admin claim. Secured via a server-side internal secret.
    """
    try:
        auth.set_custom_user_claims(request.target_uid, {"role": "admin"})
        return {"status": "success", "message": "Admin bootstrapped successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to bootstrap admin: {str(e)}")
