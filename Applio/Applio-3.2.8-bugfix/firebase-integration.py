import firebase_admin
from firebase_admin import credentials, firestore

# Path to your service account key JSON
cred = credentials.Certificate("/baymax-d74b8-firebase-adminsdk-fbsvc-8ba22725fa.json")

# Initialize the Admin SDK app once at the start of your script
firebase_admin.initialize_app(cred)

db = firestore.client()

def get_patient_data(user_id: str) -> dict:
    """
    Retrieve the patient data from Firestore for a given user ID (Auth0 user.sub).
    Returns a dictionary of the data if found, or an empty dict if none.
    """
    doc_ref = db.collection("patients").document(user_id)
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    return {}
