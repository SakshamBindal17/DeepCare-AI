from backend.services.nlp_service import MedicalNLPService
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_nlp():
    print("Testing MedicalNLPService...")
    
    # Check for AWS credentials
    if not os.getenv('AWS_ACCESS_KEY_ID') or not os.getenv('AWS_SECRET_ACCESS_KEY'):
        print("Warning: AWS credentials not found in environment variables.")
        print("Please ensure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are set in .env")
    
    service = MedicalNLPService()
    text = "Patient reports severe chest pain after taking Lisinopril."
    
    print(f"Analyzing text: '{text}'")
    try:
        entities = service.analyze_text(text)
        
        print(f"Found {len(entities)} entities:")
        for entity in entities:
            print(f" - {entity['Text']} ({entity['Category']}/{entity['Type']}): {entity['Score']:.2f}")
            
        # Verification logic
        # Note: AWS Comprehend Medical might return 'Lisinopril' as MEDICATION and 'chest pain' as MEDICAL_CONDITION
        # We check if we got any results first
        if not entities:
            print("\nNo entities found. Check AWS credentials and permissions.")
            return

        medications = [e['Text'] for e in entities if e['Category'] == 'MEDICATION']
        conditions = [e['Text'] for e in entities if e['Category'] == 'MEDICAL_CONDITION']
        
        print(f"\nMedications found: {medications}")
        print(f"Conditions found: {conditions}")

        # Loose check
        has_med = any('Lisinopril' in m for m in medications)
        has_cond = any('chest pain' in c for c in conditions)
        
        if has_med and has_cond:
            print("\nSUCCESS: Detected expected entities.")
        else:
            print("\nWARNING: Did not detect all expected entities exactly.")
            
    except Exception as e:
        print(f"\nERROR: Failed to analyze text. {e}")

if __name__ == "__main__":
    test_nlp()
