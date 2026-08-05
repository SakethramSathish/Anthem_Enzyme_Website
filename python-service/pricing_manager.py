import os
import json
from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from claims_manager import verify_admin_token

router = APIRouter()

PRICING_FILE = os.path.join(os.path.dirname(__file__), 'pricing_config.json')

DEFAULT_PRICING = {
    "prices": {
        "INR": {
            "50": 180000,
            "100": 2700,
            "500": 6300,
            "5000": 40500
        },
        "USD": {
            "50": 2000,
            "100": 30,
            "500": 70,
            "5000": 450
        }
    },
    "shipping": {
        "INR": {
            "standard": 500,
            "express": 1200,
            "dry_ice": 1500
        },
        "USD": {
            "standard": 10,
            "express": 30,
            "dry_ice": 40
        }
    }
}

def get_pricing_config():
    """Reads pricing from the configuration file, creating it if it doesn't exist."""
    if not os.path.exists(PRICING_FILE):
        try:
            with open(PRICING_FILE, 'w') as f:
                json.dump(DEFAULT_PRICING, f, indent=4)
            return DEFAULT_PRICING
        except Exception as e:
            print(f"Failed to create pricing config: {e}")
            return DEFAULT_PRICING
            
    try:
        with open(PRICING_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Failed to read pricing config: {e}")
        return DEFAULT_PRICING

@router.get("/api/admin/pricing")
def get_pricing(caller: dict = Depends(verify_admin_token)):
    """Fetches the current pricing configuration. Accessible only by admins."""
    return get_pricing_config()

@router.post("/api/admin/pricing")
def update_pricing(payload: dict, caller: dict = Depends(verify_admin_token)):
    """Updates the pricing configuration. Accessible only by admins."""
    # Basic validation
    if "prices" not in payload or "shipping" not in payload:
        raise HTTPException(status_code=400, detail="Invalid pricing payload")
        
    try:
        with open(PRICING_FILE, 'w') as f:
            json.dump(payload, f, indent=4)
        return {"status": "success", "message": "Pricing updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save pricing config: {str(e)}")
