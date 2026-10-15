from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import os
import logging
from rate_limiter import limiter
from email_service import send_email

router = APIRouter()
logger = logging.getLogger(__name__)

class ContactMessage(BaseModel):
    name: str
    email: str
    organization: str
    subject: str
    message: str

@router.post("/api/contact")
@limiter.limit("5/minute")
async def send_contact_message(request: Request, data: ContactMessage):
    receiver_email = os.getenv("NOTIFICATION_EMAIL", "enterokinase@anthembio.com")

    subject = f"New Contact Submission: {data.subject}"
    body = f"""New message from the Anthem Enzyme Contact Form:

Name: {data.name}
Email: {data.email}
Organization: {data.organization}
Subject: {data.subject}

Message:
{data.message}
"""
    success = send_email(subject=subject, body=body, reply_to=data.email, recipient=receiver_email)

    if success:
        return {"success": True, "message": "Email sent successfully"}
    else:
        logger.error(f"Failed to send contact email for {data.email}")
        raise HTTPException(status_code=500, detail="Failed to send the email. Please try again later.")

