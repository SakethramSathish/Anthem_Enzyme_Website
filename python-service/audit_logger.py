import os
import logging
import json
from logging.handlers import RotatingFileHandler
from datetime import datetime, timezone

# --- Structured JSON Formatter ---
class JSONFormatter(logging.Formatter):
    def _redact_pii(self, data):
        if not isinstance(data, dict):
            return data
        
        pii_fields = {"email", "phone", "address", "customername", "customeremail"}
        redacted = {}
        for k, v in data.items():
            if isinstance(v, dict):
                redacted[k] = self._redact_pii(v)
            elif k.lower() in pii_fields:
                redacted[k] = "[REDACTED]"
            else:
                redacted[k] = v
        return redacted

    def format(self, record):
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        # Add extra fields if present
        if hasattr(record, "audit_data"):
            log_entry.update(record.audit_data)
            
        # Mask PII
        log_entry = self._redact_pii(log_entry)
        
        return json.dumps(log_entry)

# --- Setup audit logger ---
def setup_audit_logger():
    """
    Configures a dedicated audit logger that writes structured JSON to audit.log.
    Rotates at 5MB, keeps 5 backup files.
    """
    audit_logger = logging.getLogger("anthem.audit")
    audit_logger.setLevel(logging.INFO)
    
    if not audit_logger.handlers:
        log_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audit.log")
        try:
            handler = RotatingFileHandler(log_file, maxBytes=5_000_000, backupCount=5)
            handler.setFormatter(JSONFormatter())
            audit_logger.addHandler(handler)
        except Exception:
            handler = logging.StreamHandler()
            handler.setFormatter(JSONFormatter())
            audit_logger.addHandler(handler)
    
    return audit_logger

# --- Convenience function for audit events ---
def log_audit_event(action: str, uid: str = "system", ip: str = "unknown", details: dict = None, success: bool = True):
    """
    Logs a structured audit event for compliance tracing.
    
    Args:
        action: The action performed (e.g., 'ORDER_CREATED', 'PAYMENT_VERIFIED')
        uid: The Firebase UID of the actor
        ip: The IP address of the request
        details: Additional context (order_id, role, etc.)
        success: Whether the action succeeded
    """
    audit_logger = logging.getLogger("anthem.audit")
    
    audit_data = {
        "audit_data": {
            "action": action,
            "actor_uid": uid,
            "client_ip": ip,
            "success": success,
            "details": details or {}
        }
    }
    
    audit_logger.info(
        f"{action} by {uid} from {ip}",
        extra=audit_data
    )
