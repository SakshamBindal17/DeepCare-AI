import os
from deepgram import DeepgramClient

class TranscriptionService:
    def __init__(self):
        self.api_key = os.getenv("DEEPGRAM_API_KEY")
        if not self.api_key:
            raise ValueError("DEEPGRAM_API_KEY not found in environment variables")
        self.deepgram = DeepgramClient(api_key=self.api_key)

    def transcribe_audio(self, audio_file_path):
        """
        Transcribes the given audio file using Deepgram's Nova-2 model.
        Returns the full JSON response.
        """
        if not os.path.exists(audio_file_path):
            raise FileNotFoundError(f"Audio file not found: {audio_file_path}")

        try:
            with open(audio_file_path, "rb") as file:
                buffer_data = file.read()

            response = self.deepgram.listen.v1.media.transcribe_file(
                request=buffer_data,
                model="nova-2",
                smart_format=True,
                diarize=True,
                punctuate=True,
                utterances=True
            )
            return response

        except Exception as e:
            print(f"Transcription error: {e}")
            raise e
