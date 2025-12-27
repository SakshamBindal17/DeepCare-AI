# Step 03: Deepgram Transcription Service

## Objective
Implement the "Ears" of the pipeline. Create a service that takes an audio file and converts it to text using Deepgram's API.

## Actions

1.  **Create `backend/services/transcription_service.py`**:
    *   Import `DeepgramClient` from `deepgram-sdk`.
    *   Define a class `TranscriptionService`.
    *   Create a method `transcribe_audio(audio_file_path)` that:
        *   Reads the audio file.
        *   Sends it to Deepgram (Nova-2 model recommended).
        *   Enables `smart_format=True`, `diarize=True` (for speaker separation), and `punctuate=True`.
        *   Returns the full JSON response or a simplified transcript object.

2.  **Handling Diarization**:
    *   Ensure the output structure preserves who said what (Speaker 0 vs Speaker 1) and the timestamps for each word. This is crucial for the "Karaoke" effect later.

## Verification
*   Ensure your virtual environment is active (`.\venv\Scripts\activate`).
*   Create a temporary test script `test_deepgram.py`.
*   Call `TranscriptionService` with a sample audio file from `Audio_Recordings/`.
*   Print the transcript to the console.
*   Check if "Speaker 0" and "Speaker 1" are distinguished.
