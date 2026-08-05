import os
from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel, Field
import firebase_admin
from firebase_admin import auth
from typing import Optional

# Ensure Firebase is initialized
import firebase_admin_init

router = APIRouter()

class ClaimUpdateRequest(BaseModel):
    target_uid: str = Field(..., min_length=1, max_length=128)
    role: str = Field(..., pattern="^(admin|manager|product_manager|user)$")

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
    Used by admin-only endpoints (e.g., set-claim, bootstrap).
    """
    decoded_token = verify_firebase_token(authorization)
    role = decoded_token.get("role", "")
    
    if not isinstance(role, str) or role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Forbidden: Requires admin role")
        
    return decoded_token

@router.post("/api/admin/set-claim")
def set_user_claim(request: ClaimUpdateRequest, caller: dict = Depends(verify_admin_token)):
    """
    Securely updates a user's custom claims. Only accessible by admins.
    """
    valid_roles = ["admin", "manager", "product_manager", "user"]
    if request.role not in valid_roles:
        raise HTTPException(status_code=400, detail="Invalid role specified")
    
    try:
        auth.set_custom_user_claims(request.target_uid, {"role": request.role})
        return {"status": "success", "message": f"Successfully assigned role '{request.role}' to {request.target_uid}"}
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
