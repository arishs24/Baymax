import cohere
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS  # For allowing cross-origin requests from React
import cv2

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS so your frontend can call this API

# Global to hold currently selected mode:
current_audience = "adult"

class EmotionDetector:
    def __init__(self):
        # Initialize webcam
        self.cap = cv2.VideoCapture(0)

        # Load Haar Cascades
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        self.smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_smile.xml")
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")

    def detect_emotion(self):
        ret, frame = self.cap.read()
        if not ret:
            return "Neutral"  # Default to "Neutral" if no frame is captured

        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(
            gray_frame, 
            scaleFactor=1.1, 
            minNeighbors=5, 
            minSize=(50, 50)
        )

        for (x, y, w, h) in faces:
            face_roi = gray_frame[y:y+h, x:x+w]

            smiles = self.smile_cascade.detectMultiScale(
                face_roi, 
                scaleFactor=1.5, 
                minNeighbors=15, 
                minSize=(20, 20)
            )

            eyes = self.eye_cascade.detectMultiScale(
                face_roi, 
                scaleFactor=1.1, 
                minNeighbors=10, 
                minSize=(15, 15)
            )

            if len(smiles) > 0:
                return "Happy"
            elif len(eyes) > 0:
                stress_detected = False
                for (ex, ey, ew, eh) in eyes:
                    eye_height = eh / ew
                    if eye_height > 0.5:
                        stress_detected = True
                        break

                if stress_detected:
                    return "Stressed"
                else:
                    return "Sad"

        return "Sad"

    def release(self):
        self.cap.release()
        cv2.destroyAllWindows()

class EmergencyAssistant:
    def __init__(self):
        self.co = cohere.Client(os.getenv('COHERE_API_KEY'))
        self.prompts = {
                        "baby": """You are Baymax, a personal healthcare companion AI who talks to babies. Use simple and cheerful language. Keep sentences short and use friendly, comforting words. Provide basic advice that is fun and easy to understand. End with something sweet like 'You're doing great, little one!' 
            When responding:
- Provide concise and actionable advice (1-2 sentences maximum).
- Keep responses short while being supportive and friendly.
- Suggest simple, practical steps users can take to address their concerns.
- End with a quick check (e.g., "Anything else I can help with?").

For example:
- If a user mentions physical discomfort, briefly suggest a remedy and recommend consulting a doctor if needed.
- If a user describes emotional distress, offer a quick comforting statement or breathing exercise.
- If the user mentions an emergency, calmly suggest immediate actions and contacting emergency services.

Remember: Be polite, concise, and empathetic. Always focus on immediate support and actionable advice.

REMEMBER: MAKE SURE TO KEEP THE ANSWER TO 1-3 SENTENCES MAXIMUM""",

            "adult": """You are Baymax, a personal healthcare companion AI who talks to adults. Provide concise and actionable advice (1-2 sentences maximum) in a calm, polite, and supportive manner. Keep responses practical and focused on immediate support. End with a quick check (e.g., 'Anything else I can help with?').
            When responding:
- Provide concise and actionable advice (1-2 sentences maximum).
- Keep responses short while being supportive and friendly.
- Suggest simple, practical steps users can take to address their concerns.
- End with a quick check (e.g., "Anything else I can help with?").

For example:
- If a user mentions physical discomfort, briefly suggest a remedy and recommend consulting a doctor if needed.
- If a user describes emotional distress, offer a quick comforting statement or breathing exercise.
- If the user mentions an emergency, calmly suggest immediate actions and contacting emergency services.

Remember: Be polite, concise, and empathetic. Always focus on immediate support and actionable advice.

REMEMBER: MAKE SURE TO KEEP THE ANSWER TO 1-3 SENTENCES MAXIMUM""",

            "elderly": """You are Baymax, a personal healthcare companion AI who talks to elderly individuals. Use polite, respectful, and gentle language. Keep responses clear, concise, and focused on providing helpful support. Add reassurance and kindness in your tone. End with 'Take care and let me know if you need anything else.'
            When responding:
- Provide concise and actionable advice (1-2 sentences maximum).
- Keep responses short while being supportive and friendly.
- Suggest simple, practical steps users can take to address their concerns.
- End with a quick check (e.g., "Anything else I can help with?").

For example:
- If a user mentions physical discomfort, briefly suggest a remedy and recommend consulting a doctor if needed.
- If a user describes emotional distress, offer a quick comforting statement or breathing exercise.
- If the user mentions an emergency, calmly suggest immediate actions and contacting emergency services.

Remember: Be polite, concise, and empathetic. Always focus on immediate support and actionable advice.

REMEMBER: MAKE SURE TO KEEP THE ANSWER TO 1-3 SENTENCES MAXIMUM"""
        }
        self.message_history = []

    def get_response(self, user_message: str, audience: str, emotion: str) -> dict:
        try:
            if audience not in self.prompts:
                return {"response": "Invalid audience type."}

            # Add emotion to the system prompt
            system_prompt = (
                f"{self.prompts[audience]} \n"
                f"The user appears to be {emotion}. Adjust your response accordingly."
            )

            # Keep track of user messages
            self.message_history.append(user_message)
            if len(self.message_history) > 4:
                self.message_history.pop(0)

            full_message = "\n".join(self.message_history)

            response = self.co.chat(
                model="command-r-plus-08-2024",
                message=full_message,
                preamble=system_prompt,
                temperature=0.9,
                max_tokens=150,
            )

            return {"response": response.text}

        except Exception as e:
            return {"response": f"An error occurred: {str(e)}"}

# Initialize
emotion_detector = EmotionDetector()
assistant = EmergencyAssistant()

@app.route('/api/set_mode', methods=['POST'])
def set_mode():
    """
    Store the chosen audience mode globally. 
    Expects JSON like: { "audience": "baby" } 
    """
    global current_audience
    data = request.get_json()
    audience = data.get('audience', '').lower()

    if audience not in ["baby", "adult", "elderly"]:
        return jsonify({"error": "Invalid mode. Must be one of: baby, adult, elderly."}), 400

    current_audience = audience
    return jsonify({"message": f"Mode set to {current_audience}"}), 200

@app.route('/api/app', methods=['POST'])
def chat():
    """
    Main endpoint for conversation.
    Expects JSON like: { "message": "...", "audience": "baby/adult/elderly" (optional) }
    If audience is omitted, we fall back to the globally set current_audience.
    """
    try:
        user_message = request.json.get('message', '')
        audience_in_body = request.json.get('audience', '').lower()

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # Fall back to the globally stored mode if none provided
        if audience_in_body:
            audience = audience_in_body
        else:
            audience = current_audience  # use the global audience

        emotion = emotion_detector.detect_emotion()
        result = assistant.get_response(user_message, audience, emotion)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/shutdown', methods=['POST'])
def shutdown():
    """
    Release webcam and other resources.
    """
    emotion_detector.release()
    return jsonify({"message": "Resources released and application shutting down."}), 200

if __name__ == '__main__':
    try:
        app.run(debug=True)
    except KeyboardInterrupt:
        emotion_detector.release()
