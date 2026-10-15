import os
import smtplib
import logging
import traceback
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger("anthem.email")

def send_email(subject: str, body: str, reply_to: str = None, recipient: str = None) -> bool:
    """
    Sends an email using configured SMTP credentials.
    Fully compatible with GoDaddy cPanel, Render, AWS, and local dev environments.
    Strategies:
    1. Port 465 SSL to smtp.gmail.com (GoDaddy allows 465 SSL for external SMTP)
    2. Port 587 TLS to smtp.gmail.com (Standard TLS)
    3. GoDaddy Internal Mail Relay (relay-hosting.secureserver.net / localhost port 25)
    """
    smtp_email = os.getenv("SMTP_EMAIL", "anthembiosciencesadmin@gmail.com").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "").strip()
    receiver_email = (recipient or os.getenv("NOTIFICATION_EMAIL", "enterokinase@anthembio.com")).strip()

    if not smtp_email:
        logger.error("SMTP_EMAIL environment variable is missing.")
        return False

    msg = MIMEMultipart()
    msg['From'] = smtp_email
    msg['To'] = receiver_email
    if reply_to:
        msg['Reply-To'] = reply_to.strip()
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    text = msg.as_string()

    # Strategy 1: Port 465 SSL (Allowed by GoDaddy firewall for external Gmail SMTP)
    if smtp_password:
        try:
            logger.info(f"Strategy 1: Attempting SMTP_SSL to smtp.gmail.com:465 (recipient: {receiver_email})...")
            with smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=12) as server:
                server.login(smtp_email, smtp_password)
                server.sendmail(smtp_email, receiver_email, text)
            logger.info(f"Email successfully sent via SSL (465) to {receiver_email}")
            return True
        except Exception as e1:
            logger.warning(f"Strategy 1 (SMTP_SSL 465) failed: {e1}")

        # Strategy 2: Port 587 TLS (STARTTLS)
        try:
            logger.info(f"Strategy 2: Attempting SMTP TLS to smtp.gmail.com:587 (recipient: {receiver_email})...")
            with smtplib.SMTP('smtp.gmail.com', 587, timeout=12) as server:
                server.starttls()
                server.login(smtp_email, smtp_password)
                server.sendmail(smtp_email, receiver_email, text)
            logger.info(f"Email successfully sent via TLS (587) to {receiver_email}")
            return True
        except Exception as e2:
            logger.warning(f"Strategy 2 (SMTP TLS 587) failed: {e2}")

    # Strategy 3: GoDaddy internal mail relay (relay-hosting.secureserver.net or localhost:25)
    # Native relay built into GoDaddy shared cPanel hosting servers
    godaddy_relays = ['localhost', 'relay-hosting.secureserver.net']
    for host in godaddy_relays:
        try:
            logger.info(f"Strategy 3: Attempting GoDaddy internal relay ({host}:25)...")
            with smtplib.SMTP(host, 25, timeout=10) as server:
                server.sendmail(smtp_email, receiver_email, text)
            logger.info(f"Email successfully sent via GoDaddy relay ({host}) to {receiver_email}")
            return True
        except Exception as e3:
            logger.warning(f"GoDaddy relay ({host}:25) failed: {e3}")

    logger.error("All email delivery strategies (Gmail SSL 465, TLS 587, and GoDaddy Relay) failed.")
    return False

