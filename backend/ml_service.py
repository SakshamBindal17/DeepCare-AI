"""
ML Prediction Service - Quick Version
Integrates trained model with existing pipeline
"""
import joblib
import numpy as np
import os

class MLPredictionService:
    def __init__(self):
        try:
            model_path = os.path.join(os.path.dirname(__file__), 'models', 'risk_classifier.pkl')
            drug_encoder_path = os.path.join(os.path.dirname(__file__), 'models', 'drug_encoder.pkl')
            symptom_encoder_path = os.path.join(os.path.dirname(__file__), 'models', 'symptom_encoder.pkl')
            
            self.model = joblib.load(model_path)
            self.drug_encoder = joblib.load(drug_encoder_path)
            self.symptom_encoder = joblib.load(symptom_encoder_path)
            self.available = True
            print("✅ ML Model loaded successfully")
        except Exception as e:
            self.available = False
            print(f"⚠️  ML model not loaded: {e}")
    
    def predict_risk(self, entities, faers_data):
        """
        Predict risk level using ML model
        
        Args:
            entities: List of medical entities from NLP
            faers_data: Dict with 'total_reports' key
            
        Returns:
            Dict with ML prediction results or None if unavailable
        """
        if not self.available:
            return None
        
        try:
            # Extract drugs and symptoms
            drugs = [e['Text'].lower() for e in entities if e.get('Category') == 'MEDICATION']
            symptoms = [e['Text'].lower() for e in entities if e.get('Category') == 'MEDICAL_CONDITION']
            
            if not drugs or not symptoms:
                return None
            
            # Use first drug and symptom (can be enhanced)
            drug = drugs[0]
            symptom = symptoms[0]
            
            # Encode (handle unknown values)
            drug_classes = self.drug_encoder.classes_
            symptom_classes = self.symptom_encoder.classes_
            
            # If drug/symptom not in training data, use closest match or return None
            if drug not in drug_classes or symptom not in symptom_classes:
                # Fallback: use most common values
                drug = drug_classes[0] if drug not in drug_classes else drug
                symptom = symptom_classes[0] if symptom not in symptom_classes else symptom
            
            drug_encoded = self.drug_encoder.transform([drug])[0]
            symptom_encoded = self.symptom_encoder.transform([symptom])[0]
            reports = faers_data.get('total_reports', 0)
            
            # Predict
            X = np.array([[drug_encoded, symptom_encoded, reports]])
            prediction = self.model.predict(X)[0]
            probabilities = self.model.predict_proba(X)[0]
            
            # Map prediction to risk levels
            risk_levels = ['Low Risk', 'Moderate', 'Critical']
            risk_level = risk_levels[prediction]
            
            return {
                'ml_prediction': risk_level,
                'ml_confidence': float(max(probabilities)),
                'ml_probabilities': {
                    'low': float(probabilities[0]),
                    'moderate': float(probabilities[1]),
                    'critical': float(probabilities[2])
                },
                'ml_available': True
            }
            
        except Exception as e:
            print(f"ML prediction error: {e}")
            return None
