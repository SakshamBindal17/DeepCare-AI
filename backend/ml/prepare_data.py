"""
Quick Data Collection from FAERS API
Collects 500-1000 samples for training
"""
import requests
import pandas as pd
import time

def collect_faers_samples(num_pairs=50):
    """Quickly collect training data from FAERS API"""
    
    # Top drugs and symptoms to query
    drugs = [
        "aspirin", "lisinopril", "metformin", "warfarin", "ibuprofen",
        "atorvastatin", "amlodipine", "omeprazole", "levothyroxine", "albuterol",
        "metoprolol", "losartan", "gabapentin", "hydrochlorothiazide", "sertraline"
    ]
    
    symptoms = [
        "chest pain", "dizziness", "nausea", "rash", "headache",
        "shortness of breath", "vomiting", "fatigue", "fever", "diarrhea",
        "palpitations", "bleeding", "confusion", "seizure", "stroke"
    ]
    
    samples = []
    base_url = "https://api.fda.gov/drug/event.json"
    
    print(f"Collecting data for {len(drugs)} drugs × {len(symptoms)} symptoms...")
    count = 0
    
    for drug in drugs:
        for symptom in symptoms:
            count += 1
            print(f"  [{count}/{len(drugs)*len(symptoms)}] Querying {drug} + {symptom}...")
            
            query = f'patient.drug.medicinalproduct:"{drug}" AND patient.reaction.reactionmeddrapt:"{symptom}"'
            params = {
                'search': query,
                'limit': 1
            }
            
            try:
                response = requests.get(base_url, params=params, timeout=10)
                data = response.json()
                
                if 'meta' in data and 'results' in data['meta']:
                    report_count = data['meta']['results']['total']
                    
                    # Simple labeling logic
                    if report_count > 500:
                        label = 2  # Critical
                    elif report_count > 100:
                        label = 1  # Moderate
                    else:
                        label = 0  # Low
                    
                    samples.append({
                        'drug': drug,
                        'symptom': symptom,
                        'faers_reports': report_count,
                        'label': label
                    })
                    
                time.sleep(0.1)  # Rate limiting
                
            except Exception as e:
                print(f"    Error: {e}")
                continue
    
    df = pd.DataFrame(samples)
    print(f"\n✅ Collected {len(df)} samples")
    print(f"   - Critical (2): {len(df[df['label']==2])}")
    print(f"   - Moderate (1): {len(df[df['label']==1])}")
    print(f"   - Low (0): {len(df[df['label']==0])}")
    
    return df

if __name__ == '__main__':
    import os
    os.makedirs('../analysis/results', exist_ok=True)
    
    df = collect_faers_samples()
    df.to_csv('../analysis/results/training_data.csv', index=False)
    print(f"\n💾 Saved to analysis/results/training_data.csv")
