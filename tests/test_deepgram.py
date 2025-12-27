import os
import json
from dotenv import load_dotenv
import sys

# Add the current directory to sys.path to make backend importable
sys.path.append(os.getcwd())

from backend.services.transcription_service import TranscriptionService

# Load environment variables
load_dotenv()

def test_transcription():
    print("Testing Deepgram Transcription Service...")
    
    # Check API Key
    if not os.getenv("DEEPGRAM_API_KEY"):
        print("Error: DEEPGRAM_API_KEY not set in environment.")
        return

    try:
        service = TranscriptionService()
    except Exception as e:
        print(f"Failed to initialize service: {e}")
        return
    
    # Use one of the existing audio files
    audio_file = os.path.join("Audio_Recordings", "CAR0001.mp3")
    
    if not os.path.exists(audio_file):
        print(f"Error: Test file {audio_file} not found.")
        return

    try:
        print(f"Transcribing {audio_file}...")
        response = service.transcribe_audio(audio_file)
        
        # Print a summary of the response
        print("\nTranscription Result:")
        
        parsed_result = None
        if hasattr(response, 'to_json'):
             result_json = response.to_json()
             parsed_result = json.loads(result_json)
        elif hasattr(response, 'json') and callable(response.json):
             result_json = response.json()
             parsed_result = json.loads(result_json)
        elif hasattr(response, 'dict') and callable(response.dict):
             parsed_result = response.dict()
        elif hasattr(response, 'model_dump') and callable(response.model_dump):
             parsed_result = response.model_dump()
        else:
             # Fallback: try to access attributes directly if it's a Pydantic model or similar
             try:
                 # Assuming it might be a Pydantic v2 model or similar that supports dict()
                 parsed_result = response.dict()
             except:
                 print("Unknown response type:", type(response))
                 print(dir(response))
                 return
        
        # Check for results
        if parsed_result and 'results' in parsed_result and 'channels' in parsed_result['results']:
            channel = parsed_result['results']['channels'][0]
            alternatives = channel['alternatives'][0]
            transcript = alternatives['transcript']
            print(f"\nFull Transcript:\n{transcript[:200]}...") # Print first 200 chars
            
            # Check for diarization (words with speaker info)
            if 'words' in alternatives:
                print("\nDiarization Check (First 5 words):")
                for word in alternatives['words'][:5]:
                    speaker = word.get('speaker', 'Unknown')
                    print(f"Speaker {speaker}: {word['word']}")
            else:
                print("\nNo word-level details found.")
        else:
            print("\nUnexpected response structure.")
            # print(parsed_result) 

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_transcription()
