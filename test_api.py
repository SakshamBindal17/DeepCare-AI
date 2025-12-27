import requests
import os

# Configuration
url = "http://localhost:5000/analyze"
file_path = r"D:\Veersa Hackathon\DeepCare-AI\Audio_Recordings\CAR0004.mp3"

def test_analyze_endpoint():
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    print(f"Sending {file_path} to {url}...")
    
    try:
        with open(file_path, 'rb') as f:
            files = {'audio': f}
            response = requests.post(url, files=files)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("Response JSON:")
            print(response.json())
        else:
            print("Error Response:")
            print(response.text)
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_analyze_endpoint()
