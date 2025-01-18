import requests

def main():
    print("Emergency Assistant Chat (type 'quit' to exit)")
    print("------------------------------------------------")
    print("Target Audience Options: baby, adult, elderly")
    audience = input("\nSelect the target audience: ").strip().lower()

    if audience not in ["baby", "adult", "elderly"]:
        print("Invalid audience type. Please restart and choose from: baby, adult, elderly.")
        return

    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == 'quit':
            break

        # Send request to Flask endpoint
        response = requests.post(
            'http://localhost:5000/api/app',
            json={'message': user_input, 'audience': audience},
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print(f"\nAssistant ({audience}): {response.json()['response']}")
        else:
            print(f"\nError: {response.json().get('error', 'Unknown error occurred')}")

if __name__ == "__main__":
    main()
