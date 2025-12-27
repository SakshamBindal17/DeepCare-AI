# 🏗️ DeepCare AI - Architecture & Design Flow

## System Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend["Frontend Layer"]
        A[React Application]
        A --> A1[Dashboard Component]
        A --> A2[Call Analysis Component]
        A --> A3[History Component]
        A --> A4[Charts Component]
    end

    Frontend -->|HTTP POST /analyze| API

    subgraph API["API Gateway"]
        B["Flask Backend"]
        B --> B1["Health Endpoint"]
        B --> B2["Analyze Endpoint"]
    end

    API --> Services

    subgraph Services["Core Services Layer"]
        C[Transcription Service]
        C --> C1[Audio Processing]
        D[NLP Service]
        D --> D1[Entity Extraction]
        E[Safety Service]
        E --> E1[FAERS Lookup]
    end

    C1 -->|API Call| External1
    D1 -->|API Call| External2
    E1 -->|API Call| External3

    subgraph External["External Services"]
        External1[Deepgram API]
        External2[AWS Comprehend Medical]
        External3[FDA FAERS Database]
    end

    Services --> Logic

    subgraph Logic["Business Logic Layer"]
        F[Risk Engine]
        F --> F1[Risk Calculation]
        F --> F2[Severity Classification]
        G[ML Service]
        G --> G1[Random Forest Model]
        G --> G2[Prediction Service]
        H[Data Pipeline]
        H --> H1[Data Processing]
        H --> H2[Feature Engineering]
    end

    G --> Storage

    subgraph Storage["Data Storage"]
        L[ML Models]
        L --> L1[risk_classifier.pkl]
        L --> L2[drug_encoder.pkl]
        L --> L3[symptom_encoder.pkl]
    end

    Logic -->|Risk Score & Prediction| API
    API -->|JSON Response| Frontend

    style A fill:#3B82F6,stroke:#1E40AF,color:#fff
    style B fill:#10B981,stroke:#059669,color:#fff
    style External1 fill:#F59E0B,stroke:#D97706,color:#fff
    style External2 fill:#F59E0B,stroke:#D97706,color:#fff
    style External3 fill:#F59E0B,stroke:#D97706,color:#fff
    style L fill:#8B5CF6,stroke:#7C3AED,color:#fff
```

---

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Deepgram
    participant AWS
    participant FAERS
    participant ML Model

    User->>Frontend: Upload Audio File
    Frontend->>Backend: POST /analyze (audio file)

    Backend->>Deepgram: Transcribe Audio
    Deepgram-->>Backend: Transcript + Timestamps

    Backend->>AWS: Extract Medical Entities
    AWS-->>Backend: Medications, Symptoms, Conditions

    par FAERS Lookup
        Backend->>FAERS: Query Adverse Events (Drug 1)
        FAERS-->>Backend: Event Count + Reactions
        Backend->>FAERS: Query Adverse Events (Drug 2)
        FAERS-->>Backend: Event Count + Reactions
    end

    Backend->>Backend: Calculate Risk Score
    Backend->>ML Model: Predict Risk Level
    ML Model-->>Backend: Prediction + Confidence

    Backend-->>Frontend: Complete Analysis JSON
    Frontend-->>User: Display Results + Visualizations
```

---

## Component Architecture

```mermaid
graph LR
    subgraph "Frontend Components"
        UI[App.jsx]
        UI --> D[Dashboard.jsx]
        UI --> CA[CallAnalysis.jsx]
        UI --> H[History.jsx]
        UI --> V[Visualizations.jsx]

        CA --> AP[AudioPlayer.jsx]
        CA --> TC[TranscriptCard.jsx]
        CA --> RC[RiskCard.jsx]
        CA --> EC[EntitiesCard.jsx]
        CA --> FC[FAERSCard.jsx]
        CA --> MC[MLPredictionCard.jsx]
    end

    subgraph "Backend Services"
        API[app.py]
        API --> TS[transcription_service.py]
        API --> NS[nlp_service.py]
        API --> SS[safety_service.py]
        API --> RE[risk_engine.py]
        API --> MS[ml_service.py]
    end

    UI -->|HTTP Requests| API

    style UI fill:#61DAFB,stroke:#1E40AF
    style API fill:#000000,stroke:#4B5563,color:#fff
```

---

## Risk Assessment Flow

```mermaid
flowchart TD
    Start([User Uploads Audio]) --> Transcribe[Deepgram Transcription]
    Transcribe --> Extract[Extract Medical Entities]
    Extract --> Filter{Filter Entities}

    Filter -->|Valid Medications| Meds[Medications List]
    Filter -->|Valid Symptoms| Symptoms[Symptoms List]
    Filter -->|Remove Negations| Skip[Skip Invalid]

    Meds --> FAERS1[Query FAERS for Drug 1]
    Meds --> FAERS2[Query FAERS for Drug 2]
    Symptoms --> RiskCalc[Calculate Base Risk Score]

    FAERS1 --> Count1[Get Event Count]
    FAERS2 --> Count2[Get Event Count]

    Count1 --> RiskCalc
    Count2 --> RiskCalc

    RiskCalc --> BaseScore{Base Score}

    BaseScore -->|0-3.9| Low[Low Risk]
    BaseScore -->|4.0-6.9| Moderate[Moderate Risk]
    BaseScore -->|7.0-10| Critical[Critical Risk]

    Low --> ML[ML Prediction]
    Moderate --> ML
    Critical --> ML

    ML --> Confidence{Confidence > 70%}
    Confidence -->|Yes| Final[Final Risk Assessment]
    Confidence -->|No| Adjust[Adjust Classification]
    Adjust --> Final

    Final --> Response[Return JSON Response]
    Response --> Display([Display to User])

    style Start fill:#3B82F6,color:#fff
    style Display fill:#10B981,color:#fff
    style Critical fill:#EF4444,color:#fff
    style Moderate fill:#F59E0B,color:#fff
    style Low fill:#10B981,color:#fff
```

---

## ML Model Pipeline

```mermaid
flowchart TD
    subgraph Collection["Data Collection"]
        A[FAERS API]
        A -->|Query| B[15 Drugs × 15 Symptoms]
        B --> C[5000+ Samples]
    end

    subgraph Engineering["Feature Engineering"]
        D[Label Encoding]
        D --> E[Drug Encoder]
        D --> F[Symptom Encoder]
        G[FAERS Report Count]
    end

    subgraph Training["Model Training"]
        H[Feature Matrix]
        H --> I[Random Forest Classifier]
        I --> J[Cross-Validation]
        J --> K{Accuracy > 85%?}
        K -->|No| I
        K -->|Yes| L[Save Model]
    end

    subgraph Artifacts["Model Artifacts"]
        M[risk_classifier.pkl]
        N[drug_encoder.pkl]
        O[symptom_encoder.pkl]
    end

    subgraph Prediction["Prediction"]
        P[New Input]
        P --> Q[Encode Features]
        Q --> R[Risk Prediction]
        R --> S[Confidence Scores]
    end

    C --> D
    C --> G
    E --> H
    F --> H
    G --> H
    L --> M
    L --> N
    L --> O
    Q --> M

    style I fill:#8B5CF6,color:#fff
    style M fill:#10B981,color:#fff
```

---

## Entity Extraction Process

```mermaid
flowchart TD
    Input[Raw Transcript] --> AWS[AWS Comprehend Medical]
    AWS --> Entities[Detected Entities]

    Entities --> Check1{Entity Type?}

    Check1 -->|MEDICATION| Med[Medication Entity]
    Check1 -->|DX_NAME| Diag[Diagnosis Entity]
    Check1 -->|SYMPTOM| Symp[Symptom Entity]
    Check1 -->|TEST_NAME| Test[Test Entity]
    Check1 -->|Others| Skip1[Skip]

    Med --> Validate1{Validation}
    Diag --> Validate2{Validation}
    Symp --> Validate3{Validation}

    Validate1 -->|Check Negation| Neg1{Is Negated?}
    Validate2 -->|Check Context| Ctx1{Valid Context?}
    Validate3 -->|Check Severity| Sev1{Is Severe?}

    Neg1 -->|Yes| Skip2[Skip - Negation]
    Neg1 -->|No| Accept1[Accept Medication]

    Ctx1 -->|Family History| Skip3[Skip - Family]
    Ctx1 -->|Patient| Accept2[Accept Diagnosis]

    Sev1 -->|Low| Skip4[Skip - Minor]
    Sev1 -->|High| Accept3[Accept Symptom]

    Accept1 --> Final[Final Entity List]
    Accept2 --> Final
    Accept3 --> Final

    Final --> Output[Cleaned Entities for Analysis]

    style AWS fill:#FF9900,color:#fff
    style Output fill:#10B981,color:#fff
    style Skip2 fill:#EF4444,color:#fff
    style Skip3 fill:#EF4444,color:#fff
    style Skip4 fill:#EF4444,color:#fff
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Frontend - Netlify/Vercel"
            FE[React Build]
            FE --> CDN[Global CDN]
        end

        subgraph "Backend - Render/Railway"
            BE[Flask Application]
            BE --> WSGI[Gunicorn/Waitress]
        end

        subgraph "External APIs"
            DG[Deepgram API]
            AW[AWS Comprehend]
            FDA[FDA FAERS API]
        end

        subgraph "Static Assets"
            ML[ML Models .pkl]
            ENV[Environment Variables]
        end
    end

    User[End User] -->|HTTPS| CDN
    CDN -->|API Calls| WSGI
    WSGI --> DG
    WSGI --> AW
    WSGI --> FDA
    WSGI --> ML
    ENV -.->|Config| WSGI

    style User fill:#3B82F6,color:#fff
    style CDN fill:#10B981,color:#fff
    style WSGI fill:#000000,color:#fff
    style DG fill:#F59E0B,color:#fff
    style AW fill:#FF9900,color:#fff
    style FDA fill:#DC2626,color:#fff
```

---

## Technology Stack Layers

```mermaid
graph TD
    subgraph "Presentation Layer"
        A1[React 18.2]
        A2[Tailwind CSS]
        A3[Framer Motion]
        A4[Chart.js]
    end

    subgraph "Application Layer"
        B1[Flask 3.0]
        B2[Python 3.13]
        B3[RESTful API]
    end

    subgraph "Service Layer"
        C1[Deepgram SDK]
        C2[Boto3 AWS]
        C3[Requests HTTP]
    end

    subgraph "Machine Learning"
        D1[scikit-learn]
        D2[pandas]
        D3[numpy]
    end

    subgraph "External APIs"
        E1[Deepgram Nova-2]
        E2[AWS Comprehend Medical]
        E3[openFDA FAERS]
    end

    A1 --> B1
    B1 --> C1
    B1 --> C2
    B1 --> C3
    B1 --> D1
    C1 --> E1
    C2 --> E2
    C3 --> E3

    style A1 fill:#61DAFB
    style B1 fill:#000000,color:#fff
    style E1 fill:#F59E0B
    style E2 fill:#FF9900
    style E3 fill:#DC2626
```

---

## Error Handling Flow

```mermaid
flowchart TD
    Request[User Request] --> Validate{Input Valid?}

    Validate -->|No| E1[400 Bad Request]
    Validate -->|Yes| Process[Process Request]

    Process --> Try{Try Services}

    Try -->|Deepgram Fails| E2[Handle Transcription Error]
    Try -->|AWS Fails| E3[Handle NLP Error]
    Try -->|FAERS Fails| E4[Handle FAERS Error]
    Try -->|Success| Continue[Continue Processing]

    E2 --> Fallback1{Retry?}
    E3 --> Fallback2{Use Default?}
    E4 --> Fallback3{Skip FAERS?}

    Fallback1 -->|Yes| Retry1[Retry Deepgram]
    Fallback1 -->|No| Fail1[Return 503]

    Fallback2 -->|Yes| Default[Use Basic NLP]
    Fallback2 -->|No| Fail2[Return 500]

    Fallback3 -->|Yes| NoFAERS[Continue Without FAERS]
    Fallback3 -->|No| Fail3[Return Partial Data]

    Retry1 --> Try
    Default --> Continue
    NoFAERS --> Continue

    Continue --> Success[Return 200 OK]

    E1 --> Log[Log Error]
    Fail1 --> Log
    Fail2 --> Log
    Fail3 --> Log
    Success --> Log

    style Success fill:#10B981,color:#fff
    style E1 fill:#EF4444,color:#fff
    style Fail1 fill:#DC2626,color:#fff
    style Fail2 fill:#DC2626,color:#fff
    style Fail3 fill:#F59E0B,color:#fff
```
