from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import smtplib
import httpx
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging
from rate_limiter import limiter

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
    # Check if SMTP credentials are provided
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_PASSWORD")
    
    if not smtp_email or not smtp_password:
        logger.error("SMTP_EMAIL or SMTP_PASSWORD environment variables are not set.")
        raise HTTPException(status_code=500, detail="Server email configuration is missing.")

    # Email configuration
    sender_email = smtp_email
    receiver_email = "enterokinase@anthembio.com"

    # Create the email content
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = f"New Contact Submission: {data.subject}"

    body = f"""
New message from the Anthem Enzyme Contact Form:

Name: {data.name}
Email: {data.email}
Organization: {data.organization}
Subject: {data.subject}

Message:
{data.message}
"""
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Connect to Gmail SMTP server
        # If using another provider, these details would change
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, smtp_password)
        text = msg.as_string()
        server.sendmail(sender_email, receiver_email, text)
        server.quit()
        
        return {"success": True, "message": "Email sent successfully"}
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send the email.")
