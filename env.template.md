# Environment Configurations Template

To maintain our Zero-Trust architecture, secrets must be strictly separated between the frontend (client-side) and backend (server-side) environments. Never expose backend secrets to the frontend build process.

## 1. Frontend Environment (`frontend/.env`)
These variables are bundled with your React app and exposed to the user's browser. They should **only** contain public identifiers or scoped client keys.

```env
# Vite environment prefix
VITE_API_URL=http://localhost:8000

# Firebase Client Configuration (Public Identifiers)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc

# Razorpay Public Client Key (Safe to expose)
VITE_RAZORPAY_KEY_ID=rzp_test_12345

# App Check (Optional but recommended)
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

## 2. Python Backend Environment (`python-service/.env`)
These variables must remain strictly on your server. They grant administrative privileges over your database and payment gateway.

```env
# Internal API Security
INTERNAL_API_KEY=your_secure_internal_bootstrap_key

# Firebase Admin SDK Initialization
# Absolute path to the downloaded service-account.json file from Firebase Console
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=/absolute/path/to/serviceAccountKey.json
# Alternatively, Google Cloud automatically uses:
# GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/serviceAccountKey.json

# Razorpay Server Credentials (CRITICAL: KEEP SECRET)
RAZORPAY_KEY_ID=rzp_test_12345
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Razorpay Webhook Signature Verification
RAZORPAY_WEBHOOK_SECRET=your_custom_secure_webhook_secret_string
```

# SMTP Email Service (for contact form)
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

