import unittest
import sys
import os

# Add project root to path to import backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.logic.risk_engine import RiskEngine

class TestRiskEngine(unittest.TestCase):
    def setUp(self):
        self.engine = RiskEngine()

    def test_critical_symptom_red(self):
        nlp_entities = [
            {'Text': 'severe chest pain', 'Category': 'MEDICAL_CONDITION'}
        ]
        faers_data = {'total_reports': 50}
        
        result = self.engine.calculate_risk(nlp_entities, faers_data)
        
        self.assertEqual(result['level'], 'RED')
        self.assertIn('chest pain', result['details']['critical_symptoms'][0])
        self.assertIn('CRITICAL ALERT', result['action_plan'])

    def test_moderate_symptom_yellow(self):
        nlp_entities = [
            {'Text': 'mild rash', 'Category': 'MEDICAL_CONDITION'}
        ]
        faers_data = {'total_reports': 10}
        
        result = self.engine.calculate_risk(nlp_entities, faers_data)
        
        self.assertEqual(result['level'], 'YELLOW')
        self.assertIn('rash', result['details']['moderate_symptoms'][0])
        self.assertIn('WARNING', result['action_plan'])

    def test_high_faers_impact(self):
        # No critical symptoms, but very high FAERS count
        nlp_entities = [
            {'Text': 'headache', 'Category': 'MEDICAL_CONDITION'} # Moderate symptom (5 pts)
        ]
        faers_data = {'total_reports': 2000} # > 1000 threshold (+5 pts)
        
        # Score should be 5 + 5 = 10 -> RED
        result = self.engine.calculate_risk(nlp_entities, faers_data)
        
        self.assertEqual(result['level'], 'RED')
        self.assertGreaterEqual(result['score'], 10)

    def test_low_risk_green(self):
        nlp_entities = [
            {'Text': 'feeling fine', 'Category': 'PROTECTED_HEALTH_INFORMATION'}
        ]
        faers_data = {'total_reports': 0}
        
        result = self.engine.calculate_risk(nlp_entities, faers_data)
        
        self.assertEqual(result['level'], 'GREEN')
        self.assertIn('Low risk', result['action_plan'])

if __name__ == '__main__':
    unittest.main()
