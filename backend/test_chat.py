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
    
    # No prompt for audience here. 
    # Assume the backend is already set to baby/adult/elderly via the website.

    while True:
        print("\nYou: (speak now)")
        user_input = get_voice_input()
        
        if user_input:
            # Quit check
            if user_input.lower() == 'quit':
                print("Exiting the chat.")
                speak_text("Goodbye! Take care.")
                break
            
            # Since the backend is already configured with the audience from the website,
            # we do NOT need to pass `audience` in the request body.
            # The backend’s global 'current_audience' will be used instead.
            response = requests.post(
                'http://localhost:5000/api/app',
                json={'message': user_input},
                headers={'Content-Type': 'application/json'}
            )

            if response.status_code == 200:
                assistant_response = response.json().get('response', '')
                print(f"\nAssistant says: {assistant_response}")
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
