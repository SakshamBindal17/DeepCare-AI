# DeepCare AI - Adverse Medical Event Prediction System

[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-black.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A clinical safety tool that automatically analyzes patient-nurse phone conversations to detect adverse drug reactions using AI-powered transcription, medical NLP, and FDA adverse event data.

---

## 🎯 Overview

DeepCare AI addresses a critical healthcare challenge: identifying adverse medical events from recorded patient consultations. The system combines:

- **Speech-to-Text** (Deepgram Nova-2)
- **Medical NLP** (AWS Comprehend Medical)
- **Safety Database** (FDA FAERS API)
- **Risk Scoring Engine** (Multi-factor analysis)
- **Interactive UI** (Real-time audio sync & visualization)

---

## ✨ Key Features

### 🎙️ Audio Processing

- Medical-grade transcription with speaker diarization
- Timestamped utterances for precise tracking
- Smart formatting for medical terminology
- Click-to-seek audio synchronization

### 🧠 Medical Intelligence

- Automatic extraction of medications, symptoms, and diagnoses
- Context-aware filtering (removes negations and family history)
- Frequency-weighted risk scoring
- Real-time FAERS database cross-referencing

### 🚦 Risk Assessment

- **Traffic Light System**: Critical (Red) / Moderate (Yellow) / Low Risk (Green)
- Visual pulse animations for critical alerts
- AI-generated clinical recommendations
- Detailed action plans for medical staff

### 📊 Data Visualization

- Interactive FAERS bar charts
- Collapsible risk sections with custom scrollbars
- Color-coded entity highlighting in transcripts
- Session statistics dashboard

### 💾 Session Management

- Persistent analysis history (survives page reloads)
- Quick access to previous analyses
- Session statistics tracking
- Clean state management

---

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- Node.js 18+
- API Keys:
  - Deepgram API Key
  - AWS Access Key & Secret Key

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/SakshamBindal17/DeepCare-AI.git
cd DeepCare-AI
```

2. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env and add your API keys:
# DEEPGRAM_API_KEY=your_key_here
# AWS_ACCESS_KEY_ID=your_key_here
# AWS_SECRET_ACCESS_KEY=your_key_here
# AWS_REGION=us-east-1
```

3. **Backend Setup**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Backend runs on `http://localhost:5000`

4. **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📁 Project Structure

```
DeepCare-AI/
├── backend/
│   ├── app.py                    # Main Flask application
│   ├── ml_service.py             # ML prediction service
│   ├── requirements.txt          # Python dependencies
│   ├── logic/
│   │   └── risk_engine.py        # Risk scoring logic
│   ├── services/
│   │   ├── transcription_service.py  # Deepgram integration
│   │   ├── nlp_service.py            # AWS Comprehend Medical
│   │   └── safety_service.py         # FAERS API integration
│   └── ml/
│       ├── prepare_data.py       # FAERS data collection
│       └── train_model.py        # ML model training
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main React component
│   │   ├── components/
│   │   │   ├── CallAnalysis.jsx  # Audio analysis view
│   │   │   ├── Dashboard.jsx     # Session overview
│   │   │   ├── History.jsx       # Analysis history
│   │   │   ├── FAERSChart.jsx    # Data visualization
│   │   │   ├── Header.jsx        # App header
│   │   │   └── Sidebar.jsx       # Navigation
│   │   └── utils/
│   │       └── sessionManager.js # Session storage
│   ├── package.json              # Node dependencies
│   └── vite.config.js            # Build configuration
├── tests/
│   ├── test_logic.py             # Risk engine tests
│   ├── test_api.py               # API endpoint tests
│   └── manual_verification.md   # QA test cases
├── analysis/
│   ├── FAERS_Analysis_Report.md  # Data analysis template
│   └── ML_Implementation_Guide.md # ML model guide
├── Project_Roadmap/
│   ├── Project_Status.md         # Implementation tracker
│   └── Step_XX_*.md              # Step-by-step guides
├── FEATURES_DOCUMENTATION.md     # Detailed feature docs
├── IMPLEMENTATION_SUMMARY.md     # Implementation overview
├── FINAL_CHECKLIST.md            # Completion checklist
└── README.md                     # This file
```

---

## 🔧 Technology Stack

### Backend

- **Framework**: Flask 3.0.0
- **Transcription**: Deepgram SDK (Nova-2 model)
- **NLP**: AWS Boto3 (Comprehend Medical)
- **Data**: FDA openFDA API (FAERS database)
- **ML**: Scikit-learn (Random Forest classifier)
- **Concurrency**: ThreadPoolExecutor (parallel processing)
- **Caching**: functools.lru_cache

### Frontend

- **Framework**: React 18.2
- **Build Tool**: Vite 5.1
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11.0
- **Charts**: Chart.js 4.5 + react-chartjs-2
- **Icons**: Lucide React 0.344
- **State**: Session Storage API

---

## 📖 Documentation

### For Users

- **[Quick Start Guide](./data/QUICKSTART.md)** - Get started in 5 minutes
- **[Sample Audio Guide](./data/SAMPLE_AUDIO_GUIDE.md)** - Test files and scenarios

### For Developers

- **[Features Documentation](./FEATURES_DOCUMENTATION.md)** - Complete feature reference (50+ features)
- **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - Development overview
- **[Project Roadmap](./Project_Roadmap/)** - Step-by-step implementation guides
- **[ML Implementation Guide](./analysis/ML_Implementation_Guide.md)** - Machine learning setup

### For QA

- **[Manual Verification](./tests/manual_verification.md)** - Test scenarios
- **[Final Checklist](./FINAL_CHECKLIST.md)** - Completion verification

---

## 🎨 Key Features in Detail

### Audio Synchronization (Karaoke Effect)

- Real-time transcript highlighting as audio plays
- Auto-scroll to keep active speech in view
- Click any transcript bubble to jump to that moment
- Smooth animations and visual feedback

### Entity Highlighting

- **Medications**: Blue badges
- **Symptoms**: Red badges
- **Anatomy**: Green badges
- Inline highlighting preserves text flow

### Risk Scoring

- **Frequency Weighting**: Repeated symptoms increase score
- **FAERS Multipliers**: Database reports influence severity
- **Three-Tier Logic**: Critical/Moderate/General paths
- **Dynamic Thresholds**: Context-aware risk levels

### Session Management

- Persists across page reloads
- Clears on browser close
- Stores full analysis data
- Quick access to history

---

## 🧪 Testing

### Run Unit Tests

```bash
cd backend
python -m pytest tests/
```

### Manual Testing

See [tests/manual_verification.md](./tests/manual_verification.md) for detailed test scenarios.

### Test Cases

1. Critical symptoms detection
2. Low-quality audio handling
3. Routine consultation flow
4. Multiple medications analysis
5. Session persistence

---

## 🔐 Security & Privacy

- API keys stored in `.env` file (not committed)
- Session data stored locally (not on server)
- No audio files permanently stored
- AWS IAM roles for secure access
- CORS configured for frontend origin

---

## 📊 Performance

- **Parallel Processing**: Up to 10 concurrent FAERS queries
- **Caching**: LRU cache for repeated API calls
- **Optimized Rendering**: React refs for direct DOM access
- **Code Splitting**: Vite for efficient bundling
- **CSS Purging**: Tailwind removes unused styles

---

## 🤝 Contributing

This project was developed as part of a hackathon. For future contributions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👥 Team

- **Saksham Bindal** - Lead Developer (Backend & Integration)
- **Mokshit** - UI/UX Designer (Frontend)
- **Ishan** - QA & Research (Testing & Data Analysis)

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Deepgram** - Medical-grade speech-to-text
- **AWS** - Comprehend Medical NLP
- **FDA** - openFDA FAERS database
- **Chart.js** - Data visualization
- **Framer Motion** - Animation library
- **Tailwind CSS** - Styling framework

---

## 📞 Support

For questions or issues:

- Check [FEATURES_DOCUMENTATION.md](./FEATURES_DOCUMENTATION.md)
- Review [Project_Roadmap/](./Project_Roadmap/)
- Open an issue on GitHub

---

## 🚀 Deployment

### Backend (Production)

```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend (Production)

```bash
cd frontend
npm run build
# Deploy dist/ folder to hosting service
```

### Recommended Services

- **Backend**: AWS EC2, Google Cloud Run, Heroku
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: Not required (stateless API)

---

## 📈 Future Enhancements

- [ ] Real-time streaming transcription
- [ ] Multi-language support
- [ ] Historical trend analysis
- [ ] Integration with EMR systems
- [ ] Mobile app development
- [ ] Advanced ML model training
- [ ] Export to PDF reports

---

**Built with ❤️ for safer healthcare**

_Last Updated: December 27, 2025_
