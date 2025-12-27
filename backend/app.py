from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import Counter

# Import Services
from services.transcription_service import TranscriptionService
from services.nlp_service import MedicalNLPService
from services.safety_service import SafetyService
from logic.risk_engine import RiskEngine
from ml_service import MLPredictionService

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Services
# Note: Ensure environment variables are set for Deepgram and AWS
try:
    transcription_service = TranscriptionService()
except Exception as e:
    print(f"Warning: TranscriptionService failed to initialize: {e}")
    transcription_service = None

try:
    nlp_service = MedicalNLPService()
except Exception as e:
    print(f"Warning: MedicalNLPService failed to initialize: {e}")
    nlp_service = None

safety_service = SafetyService()
risk_engine = RiskEngine()

# Initialize ML Service (optional)
try:
    ml_service = MLPredictionService()
except Exception as e:
    print(f"Warning: MLPredictionService failed to initialize: {e}")
    ml_service = None

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "DeepCare AI Backend"})

@app.route('/analyze', methods=['POST'])
def analyze_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    
    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp:
        audio_file.save(temp.name)
        temp_path = temp.name

    try:
        # 1. Transcribe
        if not transcription_service:
            raise Exception("Transcription service is not available")
            
        transcript_response = transcription_service.transcribe_audio(temp_path)
        
        # Extract text from Deepgram response
        transcript_text = ""
        utterances = []
        if transcript_response and transcript_response.results:
             transcript_text = transcript_response.results.channels[0].alternatives[0].transcript
             if transcript_response.results.utterances:
                 for utt in transcript_response.results.utterances:
                     utterances.append({
                         "speaker": utt.speaker,
                         "text": utt.transcript,
                         "start": utt.start,
                         "end": utt.end,
                         "confidence": utt.confidence
                     })

        # 2. NLP Analysis
        raw_entities = []
        if nlp_service:
            raw_entities = nlp_service.analyze_text(transcript_text)

        # Filter Entities: Remove Negated and Family History items
        # We only want to analyze active symptoms/medications for the patient
        active_entities = []
        for entity in raw_entities:
            traits = [t.get('Name') for t in entity.get('Traits', [])]
            if 'NEGATION' in traits:
                continue
            if 'PERTAINS_TO_FAMILY' in traits:
                continue
            active_entities.append(entity)

        # Process Entities: Count frequencies and deduplicate
        # We normalize by text lowercased to count, but keep original casing for display
        entity_counts = Counter([e['Text'].lower() for e in active_entities])
        
        unique_entities_map = {}
        for entity in active_entities:
            text_lower = entity['Text'].lower()
            if text_lower not in unique_entities_map:
                entity['Frequency'] = entity_counts[text_lower]
                unique_entities_map[text_lower] = entity
        
        unique_entities = list(unique_entities_map.values())

        # 3. Safety Check (FAERS)
        # Extract drugs and symptoms for cross-check
        drugs = [e['Text'] for e in unique_entities if e.get('Category') == 'MEDICATION']
        symptoms = [e['Text'] for e in unique_entities if e.get('Category') == 'MEDICAL_CONDITION']
        
        total_reports = 0
        risk_details = []

        # Helper function for parallel execution
        def check_pair(drug, symptom):
            return safety_service.check_drug_risks(drug, symptom), drug, symptom

        # Use ThreadPoolExecutor for parallel API calls
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = []
            for drug in drugs:
                for symptom in symptoms:
                    futures.append(executor.submit(check_pair, drug, symptom))
            
            for future in as_completed(futures):
                try:
                    count, drug, symptom = future.result()
                    if count > 0:
                        total_reports += count
                        risk_details.append({
                            "drug": drug,
                            "symptom": symptom,
                            "reports": count
                        })
                except Exception as exc:
                    print(f"FAERS check generated an exception: {exc}")

        # 4. Risk Calculation
        # Pass unique entities (with Frequency) to Risk Engine
        risk_result = risk_engine.calculate_risk(unique_entities, {'total_reports': total_reports})

        # 5. ML Prediction (if available)
        ml_result = None
        if ml_service and ml_service.available:
            ml_result = ml_service.predict_risk(unique_entities, {'total_reports': total_reports})

        # 6. Response
        response = {
            "transcript": transcript_text,
            "utterances": utterances,
            "entities": unique_entities,
            "risk_analysis": risk_result,
            "faers_data": {
                "total_reports": total_reports,
                "details": risk_details
            }
        }
        
        # Add ML prediction if available
        if ml_result:
            response['ml_analysis'] = ml_result
        
        return jsonify(response)

    except Exception as e:
        print(f"Analysis Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
