"""
ML Service Test Cases
Tests for machine learning prediction service
"""
import sys
import os
import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.ml_service import MLPredictionService

class TestMLService:
    """Test ML prediction service functionality"""
    
    @pytest.fixture
    def ml_service(self):
        """Create ML service instance"""
        try:
            service = MLPredictionService()
            if not service.available:
                pytest.skip("ML model not available")
            return service
        except Exception as e:
            pytest.skip(f"ML service initialization failed: {e}")
    
    def test_ml_service_initialization(self, ml_service):
        """Test ML service initializes correctly"""
        assert ml_service is not None
        assert ml_service.available is True
        assert ml_service.model is not None
        assert ml_service.drug_encoder is not None
        assert ml_service.symptom_encoder is not None
    
    def test_predict_risk_with_valid_data(self, ml_service):
        """Test ML prediction with valid medication and symptom"""
        entities = [
            {'Text': 'aspirin', 'Category': 'MEDICATION', 'Frequency': 1},
            {'Text': 'dizziness', 'Category': 'MEDICAL_CONDITION', 'Frequency': 1}
        ]
        faers_data = {'total_reports': 500}
        
        result = ml_service.predict_risk(entities, faers_data)
        
        assert result is not None
        assert 'ml_prediction' in result
        assert result['ml_prediction'] in ['Low Risk', 'Moderate', 'Critical']
        assert 'ml_confidence' in result
        assert 0 <= result['ml_confidence'] <= 1
        assert 'ml_probabilities' in result
        assert 'low' in result['ml_probabilities']
        assert 'moderate' in result['ml_probabilities']
        assert 'critical' in result['ml_probabilities']
    
    def test_predict_risk_high_faers_count(self, ml_service):
        """Test ML prediction with high FAERS report count"""
        entities = [
            {'Text': 'lisinopril', 'Category': 'MEDICATION', 'Frequency': 1},
            {'Text': 'chest pain', 'Category': 'MEDICAL_CONDITION', 'Frequency': 2}
        ]
        faers_data = {'total_reports': 5000}
        
        result = ml_service.predict_risk(entities, faers_data)
        
        assert result is not None
        assert result['ml_prediction'] in ['Moderate', 'Critical']
    
    def test_predict_risk_no_medications(self, ml_service):
        """Test ML prediction with no medications detected"""
        entities = [
            {'Text': 'headache', 'Category': 'MEDICAL_CONDITION', 'Frequency': 1}
        ]
        faers_data = {'total_reports': 100}
        
        result = ml_service.predict_risk(entities, faers_data)
        
        # Should return None when no medications present
        assert result is None
    
    def test_predict_risk_no_symptoms(self, ml_service):
        """Test ML prediction with no symptoms detected"""
        entities = [
            {'Text': 'aspirin', 'Category': 'MEDICATION', 'Frequency': 1}
        ]
        faers_data = {'total_reports': 100}
        
        result = ml_service.predict_risk(entities, faers_data)
        
        # Should return None when no symptoms present
        assert result is None
    
    def test_predict_risk_unknown_drug(self, ml_service):
        """Test ML prediction with drug not in training data"""
        entities = [
            {'Text': 'unknownmedication123', 'Category': 'MEDICATION', 'Frequency': 1},
            {'Text': 'nausea', 'Category': 'MEDICAL_CONDITION', 'Frequency': 1}
        ]
        faers_data = {'total_reports': 50}
        
        # Should handle gracefully with fallback
        result = ml_service.predict_risk(entities, faers_data)
        
        # May return result with fallback or None
        assert result is None or 'ml_prediction' in result
    
    def test_predict_risk_multiple_medications(self, ml_service):
        """Test ML prediction with multiple medications"""
        entities = [
            {'Text': 'aspirin', 'Category': 'MEDICATION', 'Frequency': 1},
            {'Text': 'lisinopril', 'Category': 'MEDICATION', 'Frequency': 1},
            {'Text': 'metformin', 'Category': 'MEDICATION', 'Frequency': 1},
            {'Text': 'dizziness', 'Category': 'MEDICAL_CONDITION', 'Frequency': 1}
        ]
        faers_data = {'total_reports': 300}
        
        result = ml_service.predict_risk(entities, faers_data)
        
        # Should use first medication
        assert result is not None
        assert 'ml_prediction' in result
    
    def test_predict_risk_zero_faers_reports(self, ml_service):
        """Test ML prediction with zero FAERS reports"""
        entities = [
            {'Text': 'aspirin', 'Category': 'MEDICATION', 'Frequency': 1},
            {'Text': 'headache', 'Category': 'MEDICAL_CONDITION', 'Frequency': 1}
        ]
        faers_data = {'total_reports': 0}
        
        result = ml_service.predict_risk(entities, faers_data)
        
        assert result is not None
        # Should predict Low Risk with zero reports
        assert result['ml_prediction'] == 'Low Risk'
    
    def test_probability_sum_equals_one(self, ml_service):
        """Test that prediction probabilities sum to 1"""
        entities = [
            {'Text': 'aspirin', 'Category': 'MEDICATION', 'Frequency': 1},
            {'Text': 'dizziness', 'Category': 'MEDICAL_CONDITION', 'Frequency': 1}
        ]
        faers_data = {'total_reports': 500}
        
        result = ml_service.predict_risk(entities, faers_data)
        
        if result:
            prob_sum = (result['ml_probabilities']['low'] + 
                       result['ml_probabilities']['moderate'] + 
                       result['ml_probabilities']['critical'])
            assert abs(prob_sum - 1.0) < 0.01  # Allow small floating point error
    
    def test_ml_available_flag(self, ml_service):
        """Test ml_available flag is set correctly in result"""
        entities = [
            {'Text': 'aspirin', 'Category': 'MEDICATION', 'Frequency': 1},
            {'Text': 'headache', 'Category': 'MEDICAL_CONDITION', 'Frequency': 1}
        ]
        faers_data = {'total_reports': 100}
        
        result = ml_service.predict_risk(entities, faers_data)
        
        if result:
            assert 'ml_available' in result
            assert result['ml_available'] is True


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
