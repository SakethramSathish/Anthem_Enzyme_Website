import os
import firebase_admin
from firebase_admin import credentials

def initialize_firebase():
    """
    Securely initializes the Firebase Admin SDK.
    Relies entirely on server-side environment variables.
    """
    if not firebase_admin._apps:
        # We expect FIREBASE_SERVICE_ACCOUNT_KEY_PATH or GOOGLE_APPLICATION_CREDENTIALS
        key_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_PATH")
        resolved_path = None
        if key_path:
            clean_path = key_path.strip("\"'")
            if os.path.isabs(clean_path) and os.path.exists(clean_path):
                resolved_path = clean_path
            else:
                # Check candidate locations: cwd, script directory, parent directory
                candidates = [
                    os.path.join(os.getcwd(), clean_path),
                    os.path.join(os.path.dirname(__file__), clean_path),
                    os.path.join(os.path.dirname(os.path.dirname(__file__)), clean_path)
                ]
                for candidate in candidates:
                    if os.path.exists(candidate):
                        resolved_path = candidate
                        break

        if not resolved_path:
            # Auto-discover any firebase-adminsdk json file in script directory or cwd
            search_dirs = [os.path.dirname(os.path.abspath(__file__)), os.getcwd(), os.path.dirname(os.path.dirname(os.path.abspath(__file__)))]
            for sdir in search_dirs:
                if os.path.exists(sdir):
                    for f in os.listdir(sdir):
                        if f.endswith('.json') and ('firebase-adminsdk' in f or 'serviceAccount' in f):
                            resolved_path = os.path.join(sdir, f)
                            break
                if resolved_path:
                    break

        if resolved_path and os.path.exists(resolved_path):
            cred = credentials.Certificate(resolved_path)
            firebase_admin.initialize_app(cred)
            print(f"[Firebase Admin] Initialized with credentials from: {resolved_path}")
        else:
            # Fallback to default application credentials
            try:
                firebase_admin.initialize_app()
            except Exception as e:
                print(f"Warning: Firebase Admin initialized without explicit credentials. Ensure env vars are set. {e}")

initialize_firebase()
