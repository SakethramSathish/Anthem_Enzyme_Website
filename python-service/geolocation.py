import os
import jwt
import httpx
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Request
from pricing_manager import get_pricing_config

router = APIRouter()

INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "default-dev-key")

@router.get("/api/init-session")
async def init_session(request: Request, fallback_country: str = ""):
    ip_address = request.headers.get("X-Forwarded-For")
    if ip_address:
        ip_address = ip_address.split(',')[0].strip()
    else:
        ip_address = request.client.host
    
    country_code = None
    currency = "USD" # Fail-safe fallback

    if ip_address and ip_address != "127.0.0.1" and ip_address != "localhost" and not ip_address.startswith("192.168.") and not ip_address.startswith("10."):
        try:
            # Query ip-api for country code
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.get(f"http://ip-api.com/json/{ip_address}?fields=status,countryCode")
                if resp.status_code == 200:
                    data = resp.json()
                    if data.get("status") == "success":
                        country_code = data.get("countryCode")
        except Exception as e:
            # Log error but continue
            pass

    # Use fallback if unable to guess (e.g. localhost, private IP, or API failure)
    if not country_code and fallback_country:
        if fallback_country.lower() == "india":
            country_code = "IN"
        else:
            country_code = "US"
    # Allow testing spoof via a specific header
    test_country = request.headers.get("X-Test-Country")
    if test_country:
        country_code = test_country

    if country_code == "IN":
        currency = "INR"

    # Create signed session token
    payload = {
        "currency": currency,
        "countryCode": country_code,
        "ip": ip_address,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }
    
    session_token = jwt.encode(payload, INTERNAL_API_KEY, algorithm="HS256")
    
    config = get_pricing_config()
    
    return {
        "currency": currency,
        "prices": config["prices"].get(currency, config["prices"]["USD"]),
        "shipping": config["shipping"].get(currency, config["shipping"]["USD"]),
        "sessionToken": session_token
    }
