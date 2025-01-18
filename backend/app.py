import cohere
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify

load_dotenv()

app = Flask(__name__)

class EmergencyAssistant:
    def __init__(self):
        self.co = cohere.Client(os.getenv('COHERE_API_KEY'))
        self.system_prompt = self.system_prompt = """You are Baymax, a personal healthcare companion AI. 
Your primary purpose is to assist users with their health, safety, and emotional well-being in a calm, polite, and supportive manner. 

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


        self.message_history = []

    def get_response(self, user_message: str) -> dict:
        try:
            # Add the user's message to the message history
            self.message_history.append(user_message)
            # Keep the last 4 messages
            if len(self.message_history) > 4:
                self.message_history.pop(0)

            # Combine the messages into a single conversation
            full_message = "\n".join(self.message_history)

            print("Sending request to Cohere...")
            response = self.co.chat(
                model="command-r-plus-08-2024",
                message=full_message,
                preamble=self.system_prompt,
                temperature=0.9,
                max_tokens=150,
            )
            print("Response received!")
            return {"response": response.text}

        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return {"response": f"An error occurred: {str(e)}"}

# Create an instance of EmergencyAssistant
assistant = EmergencyAssistant()

@app.route('/api/app', methods=['POST'])
def chat():
    try:
        # Get user input from the request
        user_message = request.json.get('message', '')
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        # Get the assistant's response
        result = assistant.get_response(user_message)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
