import subprocess
import sys
import os

packages = [
    "setuptools<70",
    "fastapi==0.111.0",
    "uvicorn==0.29.0",
    "pydantic==2.7.1",
    "firebase-admin==6.5.0",
    "python-dotenv==1.0.1",
    "razorpay==1.4.1",
    "slowapi==0.1.9",
    "google-genai",
    "google-generativeai==0.8.3",
    "a2wsgi",
    "PyJWT",
    "httpx",
    "requests"
]

for pkg in packages:
    try:
        print(f"Installing {pkg}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])
    except Exception as e:
        print(f"Error installing {pkg}: {e}")

print("All dependencies installed successfully!")
