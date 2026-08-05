import uuid
import logging
import traceback
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("anthem.errors")

class GlobalErrorHandlerMiddleware(BaseHTTPMiddleware):
    """
    Catches all unhandled exceptions and returns a uniform JSON error response.
    Prevents raw Python stack traces from leaking to the frontend.
    """
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as exc:
            reference_id = str(uuid.uuid4())[:8]
            
            # Log the full traceback internally
            logger.error(
                f"Unhandled exception [ref: {reference_id}] "
                f"on {request.method} {request.url.path}: {exc}\n"
                f"{traceback.format_exc()}"
            )
            
            return JSONResponse(
                status_code=500,
                content={
                    "error": {
                        "code": "INTERNAL_ERROR",
                        "message": "An unexpected server error occurred. Please try again or contact support.",
                        "reference_id": reference_id
                    }
                }
            )
