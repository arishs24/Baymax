import cv2

# Initialize the webcam
cap = cv2.VideoCapture(0)

# Check if the webcam opened successfully
if not cap.isOpened():
    print("Error: Could not access the webcam.")
    exit()

# Load Haar Cascades for face, smile, and eye detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_smile.xml")
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")

print("Starting Emotion Detection...")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture image.")
        break

    # Convert the frame to grayscale for Haar Cascade
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the frame
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))

    for (x, y, w, h) in faces:
        # Extract the face region of interest (ROI)
        face_roi = gray_frame[y:y+h, x:x+w]
        color_face_roi = frame[y:y+h, x:x+w]

        # Detect smiles in the face ROI
        smiles = smile_cascade.detectMultiScale(
            face_roi,
            scaleFactor=1.5,
            minNeighbors=15,
            minSize=(20, 20)
        )

        # Detect eyes in the face ROI
        eyes = eye_cascade.detectMultiScale(
            face_roi,
            scaleFactor=1.1,
            minNeighbors=10,
            minSize=(15, 15)
        )

        # Determine emotion based on smile and eye detection
        if len(smiles) > 0:
            emotion = "Happy"
            color = (0, 255, 0)  # Green for happy
        elif len(eyes) > 0:
            # Check for stress based on eyes (e.g., tightly shut or squinting eyes)
            stress_detected = False
            for (ex, ey, ew, eh) in eyes:
                eye_height = eh / ew
                if eye_height > 0.5:  # Tightly shut or squinting eyes are taller relative to width
                    stress_detected = True
                    break

            if stress_detected:
                emotion = "Stressed"
                color = (0, 255, 255)  # Yellow for stressed
            else:
                emotion = "Sad"
                color = (0, 0, 255)  # Red for sad
        else:
            emotion = "Sad"
            color = (0, 0, 255)  # Red for sad

        # Display the detected emotion
        label = f"{emotion}"
        cv2.putText(frame, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)
        cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)

    # Show the frame with emotion labels
    cv2.imshow("Emotion Detection", frame)

    # Exit on pressing 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
