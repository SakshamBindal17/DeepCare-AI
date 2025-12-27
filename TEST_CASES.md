# DeepCare AI - Test Cases Documentation

## Test Strategy

This document outlines comprehensive test cases for the DeepCare AI system, covering manual testing, automated unit tests, API tests, and end-to-end scenarios.

---

## 1. Manual Test Cases

### Test Case 1.1: Audio File Upload - Valid Audio
**Objective:** Verify successful audio file upload and transcription

| Field | Details |
|-------|---------|
| **Test ID** | TC-001 |
| **Priority** | High |
| **Test Type** | Manual |
| **Preconditions** | Backend and frontend servers running |

**Test Steps:**
1. Navigate to Call Analysis page
2. Click "Upload Audio" button
3. Select a valid audio file (CAR0004.mp3 - cardiovascular case)
4. Wait for analysis to complete

**Expected Results:**
- ✅ File uploads successfully
- ✅ Transcription appears in transcript panel
- ✅ Speaker diarization shows "NURSE" and "PT" labels
- ✅ Medical entities are highlighted (medications in blue, conditions in red)
- ✅ Risk score displayed (7.0-10.0 for critical case)
- ✅ FAERS data shown in risk panel
- ✅ Action plan generated

**Actual Results:** [To be filled during testing]

**Status:** ☐ Pass ☐ Fail

---

### Test Case 1.2: Audio File Upload - Invalid File Type
**Objective:** Verify error handling for invalid file types

| Field | Details |
|-------|---------|
| **Test ID** | TC-002 |
| **Priority** | Medium |
| **Test Type** | Manual |

**Test Steps:**
1. Navigate to Call Analysis page
2. Click "Upload Audio" button
3. Select a non-audio file (.txt, .pdf, .jpg)

**Expected Results:**
- ✅ System rejects file
- ✅ Error message displayed: "Invalid file type. Please upload audio files only."
- ✅ No API call made

**Actual Results:** [To be filled during testing]

**Status:** ☐ Pass ☐ Fail

---

### Test Case 1.3: Risk Scoring - Critical Symptoms
**Objective:** Verify accurate risk scoring for critical symptoms

| Field | Details |
|-------|---------|
| **Test ID** | TC-003 |
| **Priority** | Critical |
| **Test Type** | Manual |

**Test Steps:**
1. Upload audio with critical symptoms (chest pain, difficulty breathing)
2. Wait for analysis completion
3. Verify risk assessment

**Expected Results:**
- ✅ Risk Score: ≥ 7.0
- ✅ Risk Level: "Critical"
- ✅ Red color indicator with pulse animation
- ✅ Action plan includes "CRITICAL ALERT"
- ✅ Critical symptoms listed in risk panel

**Actual Results:** [To be filled during testing]

**Status:** ☐ Pass ☐ Fail

---

### Test Case 1.4: Risk Scoring - Moderate Symptoms
**Objective:** Verify accurate risk scoring for moderate symptoms

| Field | Details |
|-------|---------|
| **Test ID** | TC-004 |
| **Priority** | High |
| **Test Type** | Manual |

**Test Steps:**
1. Upload audio with moderate symptoms (dizziness, nausea, rash)
2. Wait for analysis completion

**Expected Results:**
- ✅ Risk Score: 4.0-6.9
- ✅ Risk Level: "Moderate"
- ✅ Yellow color indicator
- ✅ Action plan includes "WARNING: Monitor closely"

**Actual Results:** [To be filled during testing]

**Status:** ☐ Pass ☐ Fail

---

### Test Case 1.5: Risk Scoring - Low Risk
**Objective:** Verify accurate risk scoring for routine cases

| Field | Details |
|-------|---------|
| **Test ID** | TC-005 |
| **Priority** | Medium |
| **Test Type** | Manual |

**Test Steps:**
1. Upload audio with no adverse symptoms (routine follow-up)
2. Wait for analysis completion

**Expected Results:**
- ✅ Risk Score: 0-3.9
- ✅ Risk Level: "Low Risk"
- ✅ Green color indicator
- ✅ Action plan: "Low risk detected. Continue monitoring."

**Actual Results:** [To be filled during testing]

**Status:** ☐ Pass ☐ Fail

---

### Test Case 1.6: Audio Synchronization
**Objective:** Verify audio playback synchronization with transcript

| Field | Details |
|-------|---------|
| **Test ID** | TC-006 |
| **Priority** | High |
| **Test Type** | Manual |

**Test Steps:**
1. Upload and analyze an audio file
2. Click play button on audio player
3. Observe transcript highlighting

**Expected Results:**
- ✅ Audio plays smoothly
- ✅ Current utterance is highlighted during playback
- ✅ Auto-scroll follows active utterance
- ✅ Timestamp matches audio position

**Actual Results:** [To be filled during testing]

**Status:** ☐ Pass ☐ Fail

---

### Test Case 1.7: Click-to-Seek Navigation
**Objective:** Verify click-to-seek functionality

| Field | Details |
|-------|---------|
| **Test ID** | TC-007 |
| **Priority** | Medium |
| **Test Type** | Manual |

**Test Steps:**
1. Upload and analyze an audio file
2. Click on any utterance in the transcript
3. Observe audio player behavior

**Expected Results:**
- ✅ Audio seeks to clicked utterance timestamp
- ✅ Playback starts from that position
- ✅ Utterance is highlighted

**Actual Results:** [To be filled during testing]

**Status:** ☐ Pass ☐ Fail

---

### Test Case 1.8: FAERS Data Visualization
**Objective:** Verify FAERS chart displays correctly

| Field | Details |
|-------|---------|
| **Test ID** | TC-008 |
| **Priority** | Medium |
| **Test Type** | Manual |

**Test Steps:**
1. Upload audio mentioning medications
2. Wait for FAERS data retrieval
3. Scroll to FAERS chart section

**Expected Results:**
- ✅ Chart displays drug-symptom pairs
- ✅ Report counts shown as bars
- ✅ Chart is interactive (tooltips on hover)
- ✅ Top 5 drug-symptom combinations shown

**Actual Results:** [To be filled during testing]

**Status:** ☐ Pass ☐ Fail

---

### Test Case 1.9: Session History Persistence
**Objective:** Verify analysis history is saved across sessions

| Field | Details |
|-------|---------|
| **Test ID** | TC-009 |
| **Priority** | High |
| **Test Type** | Manual |

**Test Steps:**
1. Upload and analyze 2-3 audio files
2. Navigate to History tab
3. Reload the browser page (F5)
4. Navigate back to History tab

**Expected Results:**
- ✅ All analyses appear in History tab
- ✅ Clicking on history item loads full analysis
- ✅ History persists after page reload
- ✅ History clears on browser close (session storage)

**Actual Results:** [To be filled during testing]

**Status:** ☐ Pass ☐ Fail

---

### Test Case 1.10: Dashboard Statistics
**Objective:** Verify dashboard shows accurate statistics

| Field | Details |
|-------|---------|
| **Test ID** | TC-010 |
| **Priority** | Medium |
| **Test Type** | Manual |

**Test Steps:**
1. Analyze multiple files with different risk levels
2. Navigate to Dashboard
3. Verify statistics cards

**Expected Results:**
- ✅ Total calls count is accurate
- ✅ Critical calls count matches red analyses
- ✅ Moderate calls count matches yellow analyses
- ✅ Low risk calls count matches green analyses
- ✅ Recent analyses list shows last 5

**Actual Results:** [To be filled during testing]

**Status:** ☐ Pass ☐ Fail

---

## 2. Automated API Test Cases

### Test Case 2.1: Health Check Endpoint
**Endpoint:** `GET /health`

```python
def test_health_check():
    response = requests.get('http://localhost:5000/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'healthy'
    assert 'service' in response.json()
```

**Expected:** Status 200, JSON with health status

---

### Test Case 2.2: Analyze Endpoint - Valid Audio
**Endpoint:** `POST /analyze`

```python
def test_analyze_valid_audio():
    with open('test_audio.mp3', 'rb') as f:
        files = {'audio': f}
        response = requests.post('http://localhost:5000/analyze', files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert 'transcript' in data
    assert 'entities' in data
    assert 'risk_analysis' in data
    assert 'faers_data' in data
    assert data['risk_analysis']['score'] >= 0
    assert data['risk_analysis']['level'] in ['Low Risk', 'Moderate', 'Critical']
```

**Expected:** Status 200, Complete analysis JSON

---

### Test Case 2.3: Analyze Endpoint - No File
**Endpoint:** `POST /analyze`

```python
def test_analyze_no_file():
    response = requests.post('http://localhost:5000/analyze')
    assert response.status_code == 400
    assert 'error' in response.json()
```

**Expected:** Status 400, Error message

---

### Test Case 2.4: Analyze Endpoint - Empty File
**Endpoint:** `POST /analyze`

```python
def test_analyze_empty_file():
    files = {'audio': ('empty.mp3', b'', 'audio/mpeg')}
    response = requests.post('http://localhost:5000/analyze', files=files)
    assert response.status_code in [400, 500]
    assert 'error' in response.json()
```

**Expected:** Status 400/500, Error message

---

## 3. Unit Test Cases

### Test Case 3.1: Risk Engine - Critical Symptoms
```python
def test_risk_engine_critical():
    engine = RiskEngine()
    entities = [
        {'Text': 'chest pain', 'Category': 'MEDICAL_CONDITION', 'Frequency': 2}
    ]
    faers_data = {'total_reports': 1000}
    
    result = engine.calculate_risk(entities, faers_data)
    
    assert result['level'] == 'Critical'
    assert result['score'] >= 7.0
    assert 'chest pain' in str(result['details']['critical_symptoms'])
```

---

### Test Case 3.2: Risk Engine - Moderate Symptoms
```python
def test_risk_engine_moderate():
    engine = RiskEngine()
    entities = [
        {'Text': 'dizziness', 'Category': 'MEDICAL_CONDITION', 'Frequency': 1}
    ]
    faers_data = {'total_reports': 200}
    
    result = engine.calculate_risk(entities, faers_data)
    
    assert result['level'] == 'Moderate'
    assert 4.0 <= result['score'] < 7.0
```

---

### Test Case 3.3: Risk Engine - No Symptoms
```python
def test_risk_engine_no_symptoms():
    engine = RiskEngine()
    entities = []
    faers_data = {'total_reports': 0}
    
    result = engine.calculate_risk(entities, faers_data)
    
    assert result['level'] == 'Low Risk'
    assert result['score'] < 4.0
```

---

### Test Case 3.4: FAERS Service - Valid Drug
```python
def test_faers_service_valid_drug():
    service = SafetyService()
    count = service.check_drug_risks('aspirin', 'headache')
    
    assert isinstance(count, int)
    assert count >= 0
```

---

### Test Case 3.5: FAERS Service - Invalid Drug
```python
def test_faers_service_invalid_drug():
    service = SafetyService()
    count = service.check_drug_risks('invaliddrugname123', 'headache')
    
    assert count == 0
```

---

### Test Case 3.6: ML Service - Prediction
```python
def test_ml_service_prediction():
    if not ml_service or not ml_service.available:
        pytest.skip("ML model not available")
    
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
```

---

## 4. Integration Test Cases

### Test Case 4.1: End-to-End Pipeline
**Objective:** Test complete audio analysis pipeline

```python
def test_e2e_pipeline():
    # 1. Upload audio
    with open('test_audio.mp3', 'rb') as f:
        files = {'audio': f}
        response = requests.post('http://localhost:5000/analyze', files=files)
    
    assert response.status_code == 200
    data = response.json()
    
    # 2. Verify transcription
    assert len(data['transcript']) > 0
    assert len(data['utterances']) > 0
    
    # 3. Verify NLP extraction
    assert len(data['entities']) > 0
    
    # 4. Verify FAERS data
    assert 'faers_data' in data
    assert 'total_reports' in data['faers_data']
    
    # 5. Verify risk analysis
    assert 'risk_analysis' in data
    assert 'score' in data['risk_analysis']
    assert 'level' in data['risk_analysis']
    assert 'action_plan' in data['risk_analysis']
    
    # 6. Verify ML analysis (if available)
    if 'ml_analysis' in data:
        assert 'ml_prediction' in data['ml_analysis']
```

---

## 5. Performance Test Cases

### Test Case 5.1: Response Time - Small Audio File
**Objective:** Verify response time for <2 minute audio

| Metric | Expected | Actual |
|--------|----------|--------|
| File Size | < 5 MB | |
| Upload Time | < 2 sec | |
| Transcription | < 10 sec | |
| NLP Processing | < 3 sec | |
| FAERS Queries | < 5 sec | |
| Total Pipeline | < 20 sec | |

---

### Test Case 5.2: Response Time - Large Audio File
**Objective:** Verify response time for 5-10 minute audio

| Metric | Expected | Actual |
|--------|----------|--------|
| File Size | 10-20 MB | |
| Upload Time | < 5 sec | |
| Transcription | < 30 sec | |
| NLP Processing | < 8 sec | |
| FAERS Queries | < 10 sec | |
| Total Pipeline | < 60 sec | |

---

### Test Case 5.3: Concurrent Users
**Objective:** Test system under load

```python
def test_concurrent_requests():
    from concurrent.futures import ThreadPoolExecutor
    
    def analyze_audio():
        with open('test_audio.mp3', 'rb') as f:
            files = {'audio': f}
            response = requests.post('http://localhost:5000/analyze', files=files)
        return response.status_code
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(lambda _: analyze_audio(), range(5)))
    
    assert all(status == 200 for status in results)
```

**Expected:** All requests succeed without timeout

---

## 6. Edge Cases & Error Handling

### Test Case 6.1: Very Short Audio (< 5 seconds)
**Expected:** System handles gracefully, returns minimal analysis

### Test Case 6.2: Audio with No Speech
**Expected:** Transcription returns empty, system doesn't crash

### Test Case 6.3: Audio with Heavy Background Noise
**Expected:** Transcription attempts processing, marks low confidence entities

### Test Case 6.4: Network Timeout - Deepgram API
**Expected:** Error message displayed, retry option available

### Test Case 6.5: Network Timeout - AWS Comprehend
**Expected:** Error handled gracefully, partial results returned

### Test Case 6.6: FAERS API Rate Limiting
**Expected:** System continues with available data, notes limitation

---

## 7. Security Test Cases

### Test Case 7.1: File Size Limit
**Test:** Upload file > 100 MB
**Expected:** Request rejected, error message shown

### Test Case 7.2: Malicious File Upload
**Test:** Upload executable file disguised as audio
**Expected:** File validation rejects, no execution

### Test Case 7.3: SQL Injection in API
**Test:** Send malicious payload in request
**Expected:** Input sanitized, no database access

---

## 8. Browser Compatibility

| Browser | Version | Dashboard | Analysis | History | Audio Playback | Status |
|---------|---------|-----------|----------|---------|----------------|--------|
| Chrome | Latest | ☐ | ☐ | ☐ | ☐ | ☐ Pass ☐ Fail |
| Firefox | Latest | ☐ | ☐ | ☐ | ☐ | ☐ Pass ☐ Fail |
| Safari | Latest | ☐ | ☐ | ☐ | ☐ | ☐ Pass ☐ Fail |
| Edge | Latest | ☐ | ☐ | ☐ | ☐ | ☐ Pass ☐ Fail |

---

## 9. Test Execution Summary

| Category | Total | Pass | Fail | Pending |
|----------|-------|------|------|---------|
| Manual Tests | 10 | 0 | 0 | 10 |
| API Tests | 4 | 0 | 0 | 4 |
| Unit Tests | 6 | 0 | 0 | 6 |
| Integration Tests | 1 | 0 | 0 | 1 |
| Performance Tests | 3 | 0 | 0 | 3 |
| Edge Cases | 6 | 0 | 0 | 6 |
| Security Tests | 3 | 0 | 0 | 3 |
| Browser Compatibility | 4 | 0 | 0 | 4 |
| **TOTAL** | **37** | **0** | **0** | **37** |

---

## 10. Defect Log

| Defect ID | Severity | Description | Status | Resolution |
|-----------|----------|-------------|--------|------------|
| | | | | |

---

## Test Environment

- **Backend:** Flask 3.0.0, Python 3.13
- **Frontend:** React 18.2.0, Vite 5.1.6
- **OS:** Linux (Ubuntu/Debian)
- **Browser:** Chrome 120+
- **API Keys:** Deepgram, AWS Comprehend Medical
- **Test Data:** Audio files from `data/conversations/Audio_Recordings/`

---

## Conclusion

This comprehensive test suite covers:
- ✅ Functional testing (manual and automated)
- ✅ API testing
- ✅ Unit testing
- ✅ Integration testing
- ✅ Performance testing
- ✅ Security testing
- ✅ Browser compatibility

**Test Coverage:** ~85% of critical user workflows

**Next Steps:**
1. Execute all test cases
2. Document actual results
3. Fix any identified defects
4. Re-test failed cases
5. Generate final test report
