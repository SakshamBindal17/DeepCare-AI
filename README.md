#  DeepCare AI - Adverse Medical Event Prediction System

[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **An intelligent AI-powered system that analyzes nurse-patient conversations to detect and predict adverse medical events in real-time.**

##  Live Demo

- **Frontend Application:** [https://deepcare-ai.onrender.com](https://deepcare-ai.onrender.com)
- **Backend API:** [https://deepcare-ai-backend.onrender.com](https://deepcare-ai-backend.onrender.com)

---

##  Project Overview

**DeepCare AI** addresses a critical gap in telehealth: identifying adverse drug reactions during patient consultations. While patients describe symptoms to nurses, subtle signs of adverse events can be missed. 

Our system acts as an **AI Safety Layer**, listening to the conversation, extracting medical entities, and cross-referencing them with the **FDA FAERS database** to flag potential risks immediately.

---

##  Key Features

###  Audio Intelligence
- **Medical-Grade Transcription:** Powered by **Deepgram Nova-2** for high-accuracy medical speech recognition.
- **Speaker Diarization:** Automatically distinguishes between Nurse and Patient.
- **Smart Formatting:** Correctly capitalizes and formats drug names and medical terms.

###  Medical NLP & Safety
- **Entity Extraction:** Uses **AWS Comprehend Medical** to identify:
  -  Medications (Generic & Brand)
  -  Medical Conditions
  -  Symptoms
- **Context Awareness:** Filters out negated terms (e.g., "no chest pain") and family history.

###  Risk Assessment Engine
- **Traffic Light System:**
  -  **Critical (Score  7):** Immediate intervention required.
  -  **Moderate (Score 4-7):** Monitor closely.
  -  **Low (Score < 4):** Routine follow-up.
- **Scoring Logic:** Weighted algorithm based on symptom severity, drug-reaction frequency, and FDA report counts.

###  Machine Learning
- **Predictive Model:** Random Forest Classifier trained on **5,000+ FDA adverse event cases**.
- **Confidence Scores:** Provides a probability percentage for the predicted risk level.

---

##  System Architecture

The system follows a microservices-based architecture with a Flask backend acting as an orchestrator between AI services.

`mermaid
graph TD
    subgraph Frontend_Layer
        UI[React Dashboard] -->|Upload Audio| API[Flask API Gateway]
    end

    subgraph Backend_Layer
        API -->|1. Transcribe| TS[Transcription Service]
        API -->|2. Extract Entities| NLP[NLP Service]
        API -->|3. Check Safety| SS[Safety Service]
        API -->|4. Predict Risk| ML[ML Service]
        
        TS -->|Deepgram Nova-2| DG[Deepgram API]
        NLP -->|Detect Entities| AWS[AWS Comprehend Medical]
        SS -->|Query Events| FDA[FDA FAERS Database]
        ML -->|Classify| RF[Random Forest Model]
    end

    subgraph Data_Flow
        DG -->|Transcript| TS
        AWS -->|Medications & Symptoms| NLP
        FDA -->|Adverse Event Stats| SS
        RF -->|Risk Probability| ML
    end
    
    ML -->|Final Analysis JSON| API
    API -->|Real-time Results| UI
` 

---

##  Technology Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Chart.js, Framer Motion |
| **Backend** | Flask 3.0, Python 3.13, Gunicorn |
| **AI Services** | Deepgram SDK (Speech), AWS Boto3 (NLP) |
| **Data Science** | Scikit-learn, Pandas, NumPy |
| **External Data** | FDA OpenFDA API (FAERS) |

---

##  Installation & Setup

### Prerequisites
- Python 3.12+
- Node.js 18+
- API Keys: **Deepgram**, **AWS** (Comprehend Medical)

### 1. Clone the Repository
`ash
git clone https://github.com/SakshamBindal17/DeepCare-AI.git
cd DeepCare-AI
` 

### 2. Backend Setup
`ash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "DEEPGRAM_API_KEY=your_key" > .env
echo "AWS_ACCESS_KEY_ID=your_key" >> .env
echo "AWS_SECRET_ACCESS_KEY=your_key" >> .env
echo "AWS_REGION=us-east-1" >> .env

python app.py
` 

### 3. Frontend Setup
`ash
cd frontend
npm install
npm run dev
` 

---

##  API Reference

### POST /analyze`nUploads an audio file for full analysis.

**Request:** multipart/form-data with udio file.

**Response:**
`json
{
  "transcript": "Patient reported headache...",
  "risk_analysis": {
    "score": 8.5,
    "level": "Critical",
    "action_plan": "Immediate ER referral recommended..."
  },
  "entities": [...]
}
` 

---

**Veersa Hackathon 2026**
