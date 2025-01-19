import requests
import speech_recognition as sr
import pyttsx3

# Initialize text-to-speech engine
engine = pyttsx3.init()

def speak_text(text):
    engine.say(text)
    engine.runAndWait()

def get_voice_input():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("\nListening...")
        try:
            audio = recognizer.listen(source)
            print("Processing...")
            return recognizer.recognize_google(audio)
        except sr.UnknownValueError:
            print("Sorry, I couldn't understand that. Please try again.")
            return None
        except sr.RequestError as e:
            print(f"Error with the recognition service: {str(e)}")
            return None

def main():
    print("Emergency Assistant Voice Chat (say 'quit' to exit)")
    print("---------------------------------------------------")
    print("Target Audience Options: baby, adult, elderly")
    speak_text("Welcome to Emergency Assistant Voice Chat. Please select your target audience: baby, adult, or elderly.")

    audience = None
    while not audience:
        audience_input = get_voice_input()
        if audience_input:
            audience = audience_input.strip().lower()
            if audience not in ["baby", "adult", "elderly"]:
                print("Invalid audience type. Please say: baby, adult, or elderly.")
                speak_text("Invalid audience type. Please say baby, adult, or elderly.")
                audience = None

    print(f"Selected audience: {audience}")
    speak_text(f"Selected audience is {audience}. You can start speaking now.")

    while True:
        print("\nYou: (speak now)")
        user_input = get_voice_input()
        if user_input:
            if user_input.lower() == 'quit':
                print("Exiting the chat.")
                speak_text("Goodbye! Take care.")
                break

            # Send request to Flask endpoint
            response = requests.post(
                'http://localhost:5000/api/app',
                json={'message': user_input, 'audience': audience},
                headers={'Content-Type': 'application/json'}
            )

            if response.status_code == 200:
                assistant_response = response.json()['response']
                print(f"\nAssistant ({audience}): {assistant_response}")
                speak_text(assistant_response)
            else:
                error_message = response.json().get('error', 'Unknown error occurred')
                print(f"\nError: {error_message}")
                speak_text(f"An error occurred: {error_message}")
        else:
            print("No input detected. Please try speaking again.")
            speak_text("No input detected. Please try again.")

if __name__ == "__main__":
    main()
