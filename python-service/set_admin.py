import firebase_admin
from firebase_admin import credentials, auth
import os

key_path = r"C:\Users\ssake\Desktop\Coding Files\Project Files\Anthem Enzyme Website\anthem-enzyme-website-firebase-adminsdk-fbsvc-cfda9652d0.json"

if not os.path.exists(key_path):
    print("Service account key not found!")
    exit(1)

cred = credentials.Certificate(key_path)
firebase_admin.initialize_app(cred)

try:
    user = auth.get_user_by_email("ssakethram@gmail.com")
    print(f"Found user with UID: {user.uid}")
    auth.set_custom_user_claims(user.uid, {"role": "admin"})
    print("Successfully assigned 'admin' custom claim to user!")
except Exception as e:
    print(f"Error: {e}")
