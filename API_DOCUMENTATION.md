# API Documentation - DeepCare AI

## Base Information

**Base URL:** `http://localhost:5000` (Development)  
**Production URL:** `[Add deployment URL]`  
**API Version:** 1.0  
**Content-Type:** `application/json` (except file uploads)

---

## Authentication

Currently, no authentication is required for API access. In production, implement:
- API Key authentication
- JWT tokens
- Rate limiting

---

## Endpoints

### 1. Health Check

Check if the API server is running and healthy.

**Endpoint:** `GET /health`

**Headers:** None required

**Response:**

```json
{
  "status": "healthy",
  "service": "DeepCare AI Backend"
}
```

**Status Codes:**
- `200 OK` - Service is healthy
- `500 Internal Server Error` - Service is down

**Example:**

```bash
curl -X GET http://localhost:5000/health
```

---

### 2. Analyze Audio File

Upload an audio file for comprehensive adverse event analysis.

**Endpoint:** `POST /analyze`

**Headers:**
- `Content-Type: multipart/form-data`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| audio | File | Yes | Audio file (MP3, WAV, M4A, FLAC) |

**File Constraints:**
- **Max Size:** 100 MB
- **Supported Formats:** MP3, WAV, M4A, FLAC, OGG
- **Recommended Duration:** 2-10 minutes
- **Sample Rate:** 16kHz+ recommended

**Response:**

```json
{
  "transcript": "Full conversation transcript text...",
  "utterances": [
    {
      "speaker": 0,
      "start": 0.5,
      "end": 3.2,
      "text": "Hello, what brings you in today?",
      "confidence": 0.98
    },
    {
      "speaker": 1,
      "start": 3.5,
      "end": 7.8,
      "text": "I've been experiencing severe chest pain.",
      "confidence": 0.95
    }
  ],
  "entities": [
    {
      "Text": "chest pain",
      "Category": "MEDICAL_CONDITION",
      "Type": "DX_NAME",
      "Score": 0.98,
      "Frequency": 3,
      "Traits": [
        {
          "Name": "SYMPTOM",
          "Score": 0.95
        }
      ]
    },
    {
      "Text": "Lisinopril",
      "Category": "MEDICATION",
      "Type": "GENERIC_NAME",
      "Score": 0.99,
      "Frequency": 2,
      "Traits": []
    },
    {
      "Text": "heart",
      "Category": "ANATOMY",
      "Type": "SYSTEM_ORGAN_SITE",
      "Score": 0.92,
      "Frequency": 1,
      "Traits": []
    }
  ],
  "faers_data": {
    "total_reports": 1250,
    "details": [
      {
        "drug": "Lisinopril",
        "symptom": "chest pain",
        "reports": 1250
      },
      {
        "drug": "Lisinopril",
        "symptom": "dizziness",
        "reports": 450
      }
    ]
  },
  "risk_analysis": {
    "score": 7.5,
    "level": "Critical",
    "action_plan": "CRITICAL ALERT: Detected chest pain (x3). Immediate medical attention required. FAERS data indicates 1250 related reports. Advise patient to go to ER immediately.",
    "details": {
      "critical_symptoms": ["chest pain (x3)"],
      "moderate_symptoms": ["dizziness (x1)"],
      "faers_reports": 1700
    }
  },
  "ml_analysis": {
    "ml_prediction": "Critical",
    "ml_confidence": 0.89,
    "ml_probabilities": {
      "low": 0.05,
      "moderate": 0.06,
      "critical": 0.89
    },
    "ml_available": true
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| transcript | String | Complete transcription of the conversation |
| utterances | Array | List of timestamped utterances with speaker info |
| entities | Array | Extracted medical entities (medications, symptoms, etc.) |
| faers_data | Object | FDA adverse event database query results |
| risk_analysis | Object | Comprehensive risk assessment |
| ml_analysis | Object | Machine learning predictions (optional) |

**Utterance Object:**

| Field | Type | Description |
|-------|------|-------------|
| speaker | Integer | Speaker ID (0 = Nurse, 1 = Patient) |
| start | Float | Start timestamp in seconds |
| end | Float | End timestamp in seconds |
| text | String | Utterance text |
| confidence | Float | Transcription confidence (0-1) |

**Entity Object:**

| Field | Type | Description |
|-------|------|-------------|
| Text | String | Entity text as found in transcript |
| Category | String | Entity category (MEDICATION, MEDICAL_CONDITION, ANATOMY, etc.) |
| Type | String | Specific entity type |
| Score | Float | Confidence score (0-1) |
| Frequency | Integer | Number of occurrences in transcript |
| Traits | Array | Additional entity attributes |

**Entity Categories:**
- `MEDICATION` - Drugs and medications
- `MEDICAL_CONDITION` - Symptoms, diseases, diagnoses
- `ANATOMY` - Body parts and anatomical structures
- `TEST_TREATMENT_PROCEDURE` - Medical tests and procedures
- `PROTECTED_HEALTH_INFORMATION` - PHI (filtered in production)

**Risk Analysis Object:**

| Field | Type | Description |
|-------|------|-------------|
| score | Float | Risk score (0-10 scale) |
| level | String | Risk level: "Low Risk", "Moderate", "Critical" |
| action_plan | String | AI-generated clinical recommendation |
| details | Object | Breakdown of detected risks |

**Risk Levels:**
- **Critical** (≥7.0): 🔴 Immediate medical attention required
- **Moderate** (4.0-6.9): 🟡 Close monitoring recommended
- **Low Risk** (<4.0): 🟢 Routine follow-up

**ML Analysis Object:**

| Field | Type | Description |
|-------|------|-------------|
| ml_prediction | String | ML model prediction |
| ml_confidence | Float | Model confidence (0-1) |
| ml_probabilities | Object | Probability distribution across classes |
| ml_available | Boolean | Whether ML model is loaded |

**Status Codes:**
- `200 OK` - Analysis successful
- `400 Bad Request` - Missing or invalid file
- `413 Payload Too Large` - File exceeds size limit
- `415 Unsupported Media Type` - Invalid file format
- `500 Internal Server Error` - Analysis pipeline error
- `503 Service Unavailable` - External API unavailable

**Error Response:**

```json
{
  "error": "Error description",
  "details": "Additional error information",
  "timestamp": "2025-12-27T10:30:00Z"
}
```

**Example - cURL:**

```bash
curl -X POST http://localhost:5000/analyze \
  -F "audio=@/path/to/recording.mp3" \
  -H "Accept: application/json"
```

**Example - Python:**

```python
import requests

url = "http://localhost:5000/analyze"
files = {'audio': open('recording.mp3', 'rb')}

response = requests.post(url, files=files)
data = response.json()

print(f"Risk Score: {data['risk_analysis']['score']}")
print(f"Risk Level: {data['risk_analysis']['level']}")
```

**Example - JavaScript:**

```javascript
const formData = new FormData();
formData.append('audio', audioFile);

fetch('http://localhost:5000/analyze', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Risk Score:', data.risk_analysis.score);
  console.log('Risk Level:', data.risk_analysis.level);
});
```

**Processing Time:**
- Small files (<2 min): 15-25 seconds
- Medium files (2-5 min): 25-40 seconds
- Large files (5-10 min): 40-60 seconds

**Factors Affecting Speed:**
- Audio file size and duration
- Deepgram API response time
- AWS Comprehend Medical latency
- FAERS API query count
- Network conditions

---

## Rate Limiting

**Current Limits:**
- Development: No limits
- Production: TBD

**Recommended Limits:**
- 10 requests per minute per IP
- 100 requests per hour per API key

---

## Webhooks (Future)

Future support for webhooks to notify completion:

```json
{
  "event": "analysis.completed",
  "analysis_id": "abc123",
  "timestamp": "2025-12-27T10:30:00Z",
  "status": "success",
  "webhook_url": "https://your-app.com/webhook"
}
```

---

## Error Codes Reference

| Code | Meaning | Resolution |
|------|---------|------------|
| 400 | No audio file provided | Ensure 'audio' field is present in request |
| 400 | Empty file | Upload a non-empty audio file |
| 413 | File too large | Reduce file size or compress audio |
| 415 | Unsupported format | Use MP3, WAV, M4A, or FLAC |
| 500 | Transcription failed | Check Deepgram API key and quota |
| 500 | NLP analysis failed | Verify AWS credentials |
| 503 | FAERS unavailable | External API temporarily down, retry later |

---

## Best Practices

### 1. **File Preparation**
- Use high-quality audio recordings
- Ensure minimal background noise
- Prefer 16kHz+ sample rate
- Use lossless formats when possible (WAV, FLAC)

### 2. **Error Handling**
```python
try:
    response = requests.post(url, files=files, timeout=120)
    response.raise_for_status()
    data = response.json()
except requests.exceptions.Timeout:
    print("Request timed out, retry later")
except requests.exceptions.HTTPError as e:
    print(f"HTTP error: {e}")
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
```

### 3. **Timeout Configuration**
Set appropriate timeouts based on file size:
- Small files: 30-60 seconds
- Large files: 90-120 seconds

### 4. **Result Interpretation**
```python
risk_score = data['risk_analysis']['score']

if risk_score >= 7.0:
    alert_level = "CRITICAL"
    action = "Immediate medical attention"
elif risk_score >= 4.0:
    alert_level = "MODERATE"
    action = "Close monitoring"
else:
    alert_level = "LOW"
    action = "Routine follow-up"
```

---

## Testing

### Postman Collection

Import this collection for easy testing:

```json
{
  "info": {
    "name": "DeepCare AI API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/health"
      }
    },
    {
      "name": "Analyze Audio",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/analyze",
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "audio",
              "type": "file",
              "src": "/path/to/audio.mp3"
            }
          ]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000"
    }
  ]
}
```

---

## Support

**Issues:** Report bugs on [GitHub Issues](https://github.com/SakshamBindal17/DeepCare-AI/issues)  
**Email:** support@deepcare-ai.example.com  
**Documentation:** [Full Documentation](../README.md)

---

## Changelog

### Version 1.0 (December 2025)
- Initial API release
- Health check endpoint
- Audio analysis endpoint
- ML prediction integration
- FAERS data integration

---

<div align="center">

**DeepCare AI API v1.0**  
Built for Veersa Hackathon 2026

</div>
