import boto3
import os

class MedicalNLPService:
    def __init__(self):
        self.client = boto3.client(
            service_name='comprehendmedical',
            region_name=os.getenv('AWS_REGION', 'us-east-1'),
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
        )

    def analyze_text(self, text):
        """
        Extracts medical entities from the given text using AWS Comprehend Medical.
        Returns a list of high-confidence entities.
        """
        if not text:
            return []

        try:
            response = self.client.detect_entities_v2(Text=text)
            entities = response.get('Entities', [])
            
            # Filter for high confidence and relevant types
            filtered_entities = []
            for entity in entities:
                if entity.get('Score', 0) > 0.7:
                    filtered_entities.append({
                        'Text': entity.get('Text'),
                        'Category': entity.get('Category'),
                        'Type': entity.get('Type'),
                        'Score': entity.get('Score'),
                        'Traits': entity.get('Traits', [])
                    })
            
            return filtered_entities

        except Exception as e:
            print(f"AWS Comprehend Error: {e}")
            # For development without valid AWS keys, we might want to return mock data
            # raise e
            return []
