"""
Integration Tests
End-to-end testing of the complete pipeline
"""
import requests
import os
import time
import pytest

BASE_URL = 'http://localhost:5000'

class TestIntegration:
    """Integration tests for complete workflows"""
    
    @pytest.fixture
    def test_audio_path(self):
        """Path to test audio file"""
        # Adjust path based on your project structure
        audio_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'conversations', 'Audio_Recordings')
        
        # Try multiple possible audio files
        possible_files = ['CAR0001.mp3', 'CAR0004.mp3', 'GAS0001.mp3']
        
        for filename in possible_files:
            path = os.path.join(audio_dir, filename)
            if os.path.exists(path):
                return path
        
        pytest.skip("No test audio file found")
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = requests.get(f'{BASE_URL}/health')
        
        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'healthy'
        assert 'service' in data
    
    def test_complete_pipeline(self, test_audio_path):
        """Test complete audio analysis pipeline"""
        # Upload audio file
        with open(test_audio_path, 'rb') as f:
            files = {'audio': f}
            start_time = time.time()
            response = requests.post(f'{BASE_URL}/analyze', files=files, timeout=120)
            elapsed_time = time.time() - start_time
        
        # Verify response
        assert response.status_code == 200
        data = response.json()
        
        # Verify performance
        assert elapsed_time < 60, f"Analysis took too long: {elapsed_time}s"
        
        # Verify all components present
        assert 'transcript' in data, "Missing transcript"
        assert 'utterances' in data, "Missing utterances"
        assert 'entities' in data, "Missing entities"
        assert 'risk_analysis' in data, "Missing risk analysis"
        assert 'faers_data' in data, "Missing FAERS data"
        
        # Verify transcript
        assert len(data['transcript']) > 0, "Transcript is empty"
        assert isinstance(data['utterances'], list), "Utterances should be a list"
        
        # Verify entities
        assert isinstance(data['entities'], list), "Entities should be a list"
        if len(data['entities']) > 0:
            entity = data['entities'][0]
            assert 'Text' in entity
            assert 'Category' in entity
            assert 'Score' in entity
            assert 'Frequency' in entity
        
        # Verify risk analysis
        risk = data['risk_analysis']
        assert 'score' in risk
        assert 'level' in risk
        assert 'action_plan' in risk
        assert risk['level'] in ['Low Risk', 'Moderate', 'Critical']
        assert isinstance(risk['score'], (int, float))
        assert 0 <= risk['score'] <= 10
        
        # Verify FAERS data
        faers = data['faers_data']
        assert 'total_reports' in faers
        assert 'details' in faers
        assert isinstance(faers['total_reports'], int)
        
        print(f"\n✅ Pipeline completed in {elapsed_time:.2f}s")
        print(f"   Transcript length: {len(data['transcript'])} chars")
        print(f"   Entities found: {len(data['entities'])}")
        print(f"   Risk score: {risk['score']}")
        print(f"   Risk level: {risk['level']}")
        print(f"   FAERS reports: {faers['total_reports']}")
    
    def test_analyze_without_file(self):
        """Test analyze endpoint without file upload"""
        response = requests.post(f'{BASE_URL}/analyze')
        
        assert response.status_code == 400
        data = response.json()
        assert 'error' in data
    
    def test_analyze_with_empty_file(self):
        """Test analyze endpoint with empty file"""
        files = {'audio': ('empty.mp3', b'', 'audio/mpeg')}
        response = requests.post(f'{BASE_URL}/analyze', files=files, timeout=30)
        
        # Should handle gracefully
        assert response.status_code in [400, 500]
    
    def test_concurrent_requests(self, test_audio_path):
        """Test system under concurrent load"""
        from concurrent.futures import ThreadPoolExecutor
        
        def analyze_audio():
            try:
                with open(test_audio_path, 'rb') as f:
                    files = {'audio': f}
                    response = requests.post(f'{BASE_URL}/analyze', files=files, timeout=120)
                return response.status_code
            except Exception as e:
                print(f"Request failed: {e}")
                return 500
        
        with ThreadPoolExecutor(max_workers=3) as executor:
            results = list(executor.map(lambda _: analyze_audio(), range(3)))
        
        # All requests should succeed
        success_count = sum(1 for status in results if status == 200)
        assert success_count >= 2, f"Only {success_count}/3 requests succeeded"
    
    def test_response_structure(self, test_audio_path):
        """Test response JSON structure is consistent"""
        with open(test_audio_path, 'rb') as f:
            files = {'audio': f}
            response = requests.post(f'{BASE_URL}/analyze', files=files, timeout=120)
        
        assert response.status_code == 200
        data = response.json()
        
        # Check all required keys
        required_keys = ['transcript', 'utterances', 'entities', 'risk_analysis', 'faers_data']
        for key in required_keys:
            assert key in data, f"Missing required key: {key}"
        
        # Check utterance structure
        if len(data['utterances']) > 0:
            utterance = data['utterances'][0]
            assert 'speaker' in utterance
            assert 'start' in utterance
            assert 'end' in utterance
            assert 'text' in utterance
        
        # Check entity structure
        if len(data['entities']) > 0:
            entity = data['entities'][0]
            assert 'Text' in entity
            assert 'Category' in entity
            assert 'Type' in entity
            assert 'Score' in entity
            assert 'Frequency' in entity
    
    def test_ml_integration(self, test_audio_path):
        """Test ML service integration if available"""
        with open(test_audio_path, 'rb') as f:
            files = {'audio': f}
            response = requests.post(f'{BASE_URL}/analyze', files=files, timeout=120)
        
        assert response.status_code == 200
        data = response.json()
        
        # Check if ML analysis is present
        if 'ml_analysis' in data:
            ml = data['ml_analysis']
            assert 'ml_prediction' in ml
            assert 'ml_confidence' in ml
            assert 'ml_probabilities' in ml
            assert ml['ml_prediction'] in ['Low Risk', 'Moderate', 'Critical']
            assert 0 <= ml['ml_confidence'] <= 1
            
            print(f"\n✅ ML prediction: {ml['ml_prediction']}")
            print(f"   Confidence: {ml['ml_confidence']:.2%}")


if __name__ == '__main__':
    pytest.main([__file__, '-v', '-s'])
