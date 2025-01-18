import cv2
import numpy as np
from keras.models import load_model

# Load pre-trained emotion detection model
model = load_model("emotion_model.h5")  # Make sure you have a trained model
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Initialize the webcam
cap = cv2.VideoCapture(0)

# Check if the webcam opened successfully
if not cap.isOpened():
    print("Error: Could not access the webcam.")
    exit()

# Load Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def preprocess_face(face):
    """Preprocess the face image for the model."""
    face_gray = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
    face_resized = cv2.resize(face_gray, (48, 48))  # Resize to 48x48
    face_normalized = face_resized / 255.0  # Normalize pixel values
    face_reshaped = np.reshape(face_normalized, (1, 48, 48, 1))  # Reshape for the model
    return face_reshaped

def detect_emotion(face):
    """Detect emotion from a given face."""
    processed_face = preprocess_face(face)
    predictions = model.predict(processed_face)
    return predictions[0]  # Return all emotion predictions for debugging

print("Starting Emotion Detection...")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture image.")
        break

    # Detect faces in the frame
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5)

    if len(faces) > 0:
        print(f"Faces detected: {len(faces)}")
    else:
        print("No faces detected.")

    for (x, y, w, h) in faces:
        face = frame[y:y+h, x:x+w]
        
        try:
            # Get emotion predictions
            emotion_probs = detect_emotion(face)

            # Get the index with the highest confidence score
            emotion_index = np.argmax(emotion_probs)
            emotion = emotion_labels[emotion_index]
            confidence = emotion_probs[emotion_index]

            # Display the detected emotion and confidence
            label = f"{emotion} ({confidence*100:.2f}%)"
            print(f"Confidence for all emotions: {list(zip(emotion_labels, emotion_probs))}")  # Print all emotions for debugging

            cv2.putText(frame, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

        except Exception as e:
            print(f"Error during emotion detection: {e}")

    # Show the frame with emotion labels
    cv2.imshow("Emotion Detection", frame)

    # Exit on pressing 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
