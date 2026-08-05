from fastapi import FastAPI, Depends, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import os
from dotenv import load_dotenv
from rate_limiter import limiter
from error_handler import GlobalErrorHandlerMiddleware
from audit_logger import setup_audit_logger

env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(dotenv_path=env_path)
load_dotenv() # Fallback for system / cPanel UI env vars

# Initialize audit logging
setup_audit_logger()

app = FastAPI(title="Anthem Enzyme Python Microservice")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Middleware stack (order matters: first added = outermost)
app.add_middleware(GlobalErrorHandlerMiddleware)
app.add_middleware(SlowAPIMiddleware)

# Strict CORS setup: Allow localhost only in development mode
is_dev = os.getenv("ENV", "development").lower() == "development"
origins = [
    "https://enterokinase.in",
    "https://www.enterokinase.in",
]

if is_dev:
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=".*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

import claims_manager
import payments
import chatbot
import geolocation
import contact
import pricing_manager

app.include_router(claims_manager.router)
app.include_router(payments.router)
app.include_router(chatbot.router)
app.include_router(geolocation.router)
app.include_router(contact.router)
app.include_router(pricing_manager.router)

INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "anthem-internal-secret-2026")

def verify_internal_key(x_internal_key: str = Header(...)):
    if x_internal_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid Internal API Key")
    return x_internal_key

@app.get("/")
def root():
    return {"status": "ok", "service": "Anthem Enzyme API", "version": "1.0.0"}

@app.get("/health")
@limiter.limit("5/minute")
def health_check(request: Request):
    return {"status": "ok", "service": "python-service"}

@app.post("/api/process-data", dependencies=[Depends(verify_internal_key)])
@limiter.limit("20/minute")
def process_data(request: Request, payload: dict):
    return {"status": "success", "processed": True, "original_payload": payload}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
