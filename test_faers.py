import sys
import os
sys.path.append(os.getcwd())
from backend.services.safety_service import SafetyService
import json

def test_faers():
    drug = "Lisinopril"
    symptom = "Dizziness"
    
    print(f"Checking FAERS for {drug} + {symptom}...")
    
    service = SafetyService()
    count = service.check_drug_risks(drug, symptom)
    print(f"Total Reports: {count}")
    
    print(f"\nGetting profile for {drug}...")
    profile = service.get_drug_profile(drug)
    print(json.dumps(profile, indent=2))

if __name__ == "__main__":
    test_faers()
