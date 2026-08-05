import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate(r"C:\Users\ssake\Desktop\Coding Files\Project Files\Anthem Enzyme Website\anthem-enzyme-website-firebase-adminsdk-fbsvc-cfda9652d0.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

orders = db.collection('orders').get()
print(f"Total orders found in database: {len(orders)}")
for order in orders:
    print(f"Order ID: {order.id}, Data: {order.to_dict().get('shipmentId')} - {order.to_dict().get('status')}")
