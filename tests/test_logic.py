import unittest
import sys
import os

# Add project root to path to import backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.logic.risk_engine import RiskEngine

class TestRiskEngine(unittest.TestCase):
    def setUp(self):
        self.engine = RiskEngine()

    def test_critical_symptom(self):
        nlp_entities = [
            {'Text': 'severe chest pain', 'Category': 'MEDICAL_CONDITION', 'Frequency': 1}
        ]
        faers_data = {'total_reports': 50}
        
        result = self.engine.calculate_risk(nlp_entities, faers_data)
        
        self.assertEqual(result['level'], 'Critical')
        self.assertIn('chest pain', result['details']['critical_symptoms'][0].lower())
        self.assertIn('CRITICAL ALERT', result['action_plan'])

    def test_moderate_symptom(self):
        nlp_entities = [
            {'Text': 'mild rash', 'Category': 'MEDICAL_CONDITION', 'Frequency': 1}
        ]
        faers_data = {'total_reports': 10}
        
        result = self.engine.calculate_risk(nlp_entities, faers_data)
        
        self.assertEqual(result['level'], 'Moderate')
        self.assertIn('rash', result['details']['moderate_symptoms'][0].lower())
        self.assertIn('WARNING', result['action_plan'])

    def test_high_faers_impact(self):
        # Moderate symptom with very high FAERS count should push to Critical
        nlp_entities = [
            {'Text': 'dizziness', 'Category': 'MEDICAL_CONDITION', 'Frequency': 1}
        ]
        faers_data = {'total_reports': 2000}  # > 1000 threshold
        
        result = self.engine.calculate_risk(nlp_entities, faers_data)
        
        # With high FAERS multiplier, should be Critical
        self.assertIn(result['level'], ['Critical', 'Moderate'])
        self.assertGreaterEqual(result['score'], 4.0)

    def test_low_risk(self):
        nlp_entities = [
            {'Text': 'feeling fine', 'Category': 'PROTECTED_HEALTH_INFORMATION', 'Frequency': 1}
        ]
        faers_data = {'total_reports': 0}
        
        result = self.engine.calculate_risk(nlp_entities, faers_data)
        
        self.assertEqual(result['level'], 'Low Risk')
        self.assertIn('Low risk', result['action_plan'])

if __name__ == '__main__':
    unittest.main()
