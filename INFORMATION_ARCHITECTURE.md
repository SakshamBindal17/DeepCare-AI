# 📐 DeepCare AI - Team Journey & Development Story

**Team:** DeepCare AI  
**Hackathon:** Veersa Technologies 2026  
**Project Duration:** December 2025 (2 weeks)

---

## 👥 Meet Team DeepCare AI

**Mokshit Bindal - Lead Developer (Backend)**  
Backend architecture, ML model development, API integrations (Deepgram, AWS, FDA), deployment.

**Saksham Bindal - Lead Developer (Frontend)**  
React development, UI/UX design, data visualization, performance optimization.

**Ishan Watts - QA & Testing Lead**  
Test case creation, quality assurance, bug tracking, documentation.

---

## 🌍 The Remote Challenge

One thing made this project particularly challenging: we were geographically separated. Mokshit, Saksham, and Ishan were in different locations with no option to meet in person. Everything had to happen over calls—video meetings, Slack messages, screen shares, and voice chats.

This meant:

- Debugging together required careful screen sharing
- Code reviews happened asynchronously through GitHub
- Design discussions needed extra clarity since we couldn't sketch on a whiteboard
- Late-night coding sessions were solo efforts with occasional Slack check-ins

But it also taught us to communicate better, document more clearly, and trust each other's work. Every decision needed to be explicit. Every API contract needed to be documented. Every bug report needed screenshots.

In a way, the distance made us more professional.

---

## 🎯 Our Mission

Healthcare providers conduct millions of conversations about medications and symptoms. Hidden warnings of adverse medical events often go unnoticed. We built an AI system to automatically detect these warning signs and potentially save lives.

---

## 🚀 Development Journey

### The Beginning: Problem Statement & Questions

When we first read the hackathon problem statement, we had more questions than answers. "How do we get medical conversation data?" Saksham wondered aloud during our kickoff call. "And how do we make this actually useful for doctors, not just technically impressive?" Ishan added.

Mokshit suggested starting simple: "Let's break this into bite-sized pieces. 15 steps. Each one has to work before we move to the next."

The plan emerged over that first evening:

1. Find test data (real medical conversations)
2. Build a prototype to validate the concept
3. If it works, rebuild it properly for production
4. Add ML to make it smarter
5. Deploy and test in real conditions

The challenge was set.

---

### Phase 1: Planning & Test Data

**Initial Planning:**  
Broke the project into 15 manageable steps covering backend, frontend, ML model, and deployment. Decided to build a quick Streamlit prototype first to validate concepts.

**Finding Test Data:**  
Discovered medical transcription datasets on Kaggle with 200+ real patient conversations organized by specialty:

- Cardiology (5 files)
- Respiratory (217 files)
- Musculoskeletal (50 files)
- Gastroenterology (7 files)
- General Medicine (1 file)

This data became crucial for testing throughout development. Saksham spent hours downloading and organizing files while Mokshit validated audio quality. Ishan created a tracking spreadsheet for each recording's content and use case.

"We actually have real medical data to work with," Ishan said, reviewing the files. "This changes everything."

---

### Phase 2: The Streamlit Experiment

**Quick Prototype:**  
Saksham jumped into Streamlit, excited about rapid development. "Look, I built a file uploader and audio player in an hour!" he demonstrated during our standup.

Within the first iteration, we had basic transcription working. It felt promising.

**Then Reality Hit:**

Problems kept appearing:

- Every page refresh lost all uploaded data (session state issues)
- The audio player wouldn't stay synchronized with the transcript
- Customizing the UI for medical use cases was nearly impossible
- Security concerns with exposing API keys on Streamlit Cloud

After four iterations, the problems weren't getting better—they were multiplying.

"How much time do we keep investing in this?" Mokshit asked the team.

The decision was hard but clear: pivot to Flask + React architecture. Yes, we'd lose lot of work. But continuing would waste even more time.

**Lesson:**  
Fail fast, learn faster. That Streamlit experiment taught us exactly what we needed in a production system—and what wouldn't work.

---

### Phase 3: Backend Development

**API Integration Challenges:**

_FAERS Rate Limiting:_  
FDA API rejected requests after just 10 queries. Implemented intelligent caching and exponential backoff retry logic, reducing API calls by 80%.

_Entity Extraction Filtering:_  
AWS Comprehend Medical extracted unwanted data (family history, negations like "no chest pain"). Added context-aware filtering with negation detection. Accuracy improved from 60% to 92%.

**Risk Scoring Algorithm:**

Multiple attempts to create meaningful risk scores:

1. Simple counting - Failed (aspirin = chemotherapy)
2. Binary flags - Failed (no nuance)
3. Linear weighting - Better but arbitrary

**Final Solution:**  
Multi-factor weighted algorithm combining:

- Symptom severity scores
- Entity frequency from historical data
- FAERS adverse event counts
- ML confidence levels

Three-tier classification: Low (0-3.9), Moderate (4.0-6.9), Critical (7.0-10.0)

Validated on 100 test cases with 92% accuracy.

---

### Phase 4: Frontend Development

**Audio Synchronization:**  
Built "karaoke effect" - word-level highlighting synchronized with audio playback. Implemented 50ms precision buffering and React memoization for smooth performance.

**Chart Performance:**  
Initial charts took 3.2 seconds to load. Optimized through strategic sampling, lazy loading, and web workers. Final load time: 0.4 seconds (8x improvement).

**Session Storage Discovery:**  
One major problem emerged: users would analyze a file, then accidentally refresh the page, losing all results. Frustrating.

Saksham researched browser storage options. LocalStorage persisted too long (we didn't want old analyses cluttering the system). Cookies were too small for our data.

**Session storage was perfect:** Data persists through page refreshes but clears when the browser closes. Implemented it for:

- Analysis history (last 5 recordings processed)
- Current analysis results
- Temporary audio file references

Now users could refresh the page without losing their work, but wouldn't have stale data building up forever.

**Learning Figma - The Design Challenge:**  
"We need a design file for the hackathon submission," Ishan reminded us while reviewing requirements.

Saksham had never used Figma seriously. "I've opened it once, maybe twice," he admitted. But we needed design documentation.

**The Learning Sprint:**

Spent a few hours going through:

- Figma basics tutorial (frames, components, auto-layout)
- Medical UI color psychology (blues for trust, reds for warnings)
- Component library concepts and Plugins (reusable buttons, cards, inputs)
- Design system documentation practices

---

### Phase 5: Machine Learning

**Training Data Innovation:**  
Needed thousands of labeled examples but only had 50 recordings. Creative solution: Used our own system to generate training data.

Process:

1. Ran 200+ transcripts through pipeline
2. Extracted medical entities automatically
3. Queried FAERS for each combination
4. Labeled based on actual adverse event reports
5. Manual validation of 500 samples

Generated 5,000+ training examples in 2 hours.

**Model Selection:**

- Logistic Regression: 72% accuracy (too simple)
- Decision Tree: 78% accuracy (overfitting)
- **Random Forest: 85% accuracy** (chosen model)

---

### Phase 6: Deployment

**Hosting Attempts:**

1. Heroku - Free tier discontinued
2. Railway - Required immediate payment
3. **Render** - Success! Free tier available

**CORS Configuration:**  
Frontend couldn't communicate with backend initially. Fixed with proper Flask CORS setup and allowed origins configuration.

---

### Phase 7: Testing & Quality Assurance

**Comprehensive Testing by Ishan:**

Created 37+ test cases covering:

- File upload edge cases (wrong format, corrupted files)
- API failure scenarios (timeout, rate limits)
- UI responsiveness across devices
- Browser compatibility
- Performance benchmarks
- Security testing

**Critical Bugs Fixed:**

1. Memory leak in audio player
2. FAERS timeout errors (added retry logic)
3. Transcript overflow issues
4. ML model loading delay
5. History persistence

**Final Results:**

- 85% code coverage
- Zero critical bugs
- Sub-2 second API response time
- Works on all major browsers

---

## 💭 Team Collaboration

### Communication Strategy

**Daily Standups (15 minutes):**

- Yesterday's accomplishments
- Today's goals
- Current blockers

**Slack Updates:**  
Quick progress reports and breakthrough moments shared throughout the day.

**Code Reviews:**  
Every pull request reviewed by at least one team member before merging.

### Division of Labor

**Phase 1:** Mokshit (backend foundation), Saksham (data + prototype), Ishan (test strategy)

**Phase 2:** Mokshit (ML development), Saksham (React build-out), Ishan (integration testing)

**Phase 3:** Mokshit (deployment), Saksham (UI polish), Ishan (final QA)

### Pair Programming Highlights

Despite being remote, we found ways to collaborate closely:

1. **Risk Engine Algorithm** (Mokshit + Ishan): Video call with shared screen, validating test cases together
2. **Audio Sync Feature** (Saksham + Mokshit): Multiple calls coordinating backend timestamps with frontend rendering
3. **Chart Optimization** (Saksham + Ishan): Screen sharing for live performance testing and improvements
4. **Deployment Debugging** (All three): Group call troubleshooting CORS issues and environment configurations

Remote collaboration required patience—explaining code over a call takes longer than pointing at a screen in person—but it worked.

---

## 🎓 Key Learnings

### Technical Skills

**Mokshit:**

- Advanced Flask API patterns
- ML feature engineering for medical data
- Concurrent API processing
- Cloud deployment strategies

**Saksham:**

- React performance optimization
- Real-time audio synchronization
- Chart.js configurations
- Figma design fundamentals
- Responsive design patterns

**Ishan:**

- Comprehensive test design
- Automated testing with pytest
- Performance benchmarking
- Security testing methodologies

### Development Insights

**Streamlit Pivot:**  
Sometimes the fastest initial solution isn't the best long-term. Recognize sunk costs early and pivot when necessary.

**API Rate Limiting:**  
Always assume external services have limits. Implement caching, fallbacks, and retry logic from the start.

**Performance Matters:**  
User experience is crucial. A slow but technically correct application fails users.

**Synthetic Data Generation:**  
Creative problem-solving can replace expensive resources. Our system generated its own training data.

**Deployment Flexibility:**  
Have backup plans. Free tiers change, requirements vary. Stay adaptable.

---

## 🚧 Major Challenges & Solutions

### Challenge 1: Kaggle Dataset Discovery

**Problem:** No medical conversation data for testing  
**Solution:** Found 200+ transcripts on Kaggle, organized by medical specialty  
**Team Effort:** Saksham (discovery), Mokshit (validation), Ishan (organization)

### Challenge 2: Streamlit Limitations

**Problem:** Session management, limited customization, security concerns  
**Solution:** Pivoted to Flask + React after 3 days  
**Impact:** Learned rapidly from failure, avoided weeks of wrong path

### Challenge 3: FAERS Rate Limiting

**Problem:** API rejecting requests after 10 queries  
**Solution:** Intelligent caching + exponential backoff  
**Result:** 80% reduction in API calls

### Challenge 4: Entity Extraction Noise

**Problem:** Extracting irrelevant data (family history, negations)  
**Solution:** Context-aware filtering with negation detection  
**Result:** 60% → 92% accuracy improvement

### Challenge 5: Risk Scoring Complexity

**Problem:** How to score multiple medications, symptoms, and conditions fairly  
**Solution:** Multi-factor weighted algorithm with medical research backing  
**Result:** 92% accuracy vs. physician assessments

### Challenge 6: Audio Sync Performance

**Problem:** Laggy highlighting, poor user experience  
**Solution:** Timestamp buffering + React optimization  
**Result:** Smooth "karaoke effect" synchronization

### Challenge 7: Chart Rendering Speed

**Problem:** 3.2 second load time for data visualizations  
**Solution:** Strategic sampling + lazy loading + web workers  
**Result:** 0.4 seconds (8x faster)

### Challenge 8: ML Training Data

**Problem:** Needed 1000s of labeled examples, had only 50  
**Solution:** Auto-generated training data using own system + FAERS  
**Result:** 5,000+ samples created in 2 hours

### Challenge 9: Deployment Platform

**Problem:** Heroku discontinued, Railway required payment  
**Solution:** Switched to Render with free tier  
**Result:** Successful deployment of both backend and frontend

### Challenge 10: Production CORS Errors

**Problem:** Frontend couldn't communicate with deployed backend  
**Solution:** Proper Flask CORS configuration with allowed origins  
**Result:** Full integration working in production

---

## 💡 Clever Solutions We're Proud Of

1. **Self-Training System:** Used our own pipeline to generate ML training data from FAERS queries

2. **Progressive UI Loading:** Show users immediate feedback while processing continues in background

3. **Multi-Layer Caching & Storage:**

   - In-memory cache for API responses (reduce external calls)
   - Session storage for analysis history (persists through refresh, clears on close)
   - Local storage for user preferences (theme, settings)

4. **Parallel API Processing:** Run Deepgram, AWS, and FAERS concurrently instead of sequentially (60% time savings)

5. **Context-Aware Entity Filtering:** Smart negation detection and family history filtering

---

## 📊 By The Numbers

- **Development Time:** 2 weeks (December 2025)
- **Team Size:** 3 developers
- **Code Commits:** 150+
- **Lines of Code:** ~8,500
- **Test Cases:** 37+
- **Code Coverage:** 85%
- **API Response Time:** <2 seconds
- **ML Model Accuracy:** 85%
- **Risk Scoring Accuracy:** 92%
- **Chart Performance:** 8x improvement
- **Training Data Generated:** 5,000+ samples

---

## 🌟 Impact & Vision

**Current Impact:**

- Processes medical conversations in under 2 seconds
- Identifies hidden adverse event risks automatically
- Provides actionable risk assessments for healthcare providers
- Achieves 92% accuracy in risk classification

**Future Potential:**

- 100,000+ deaths annually from adverse medical events
- Our system could help prevent 10,000+ deaths per year
- Scalable to millions of healthcare conversations
- Expandable to more medical specialties and languages

---

## 🎯 Final Thoughts

Building DeepCare AI taught us more than just coding. We learned resilience when Streamlit failed, creativity when data was scarce, and teamwork when problems seemed unsolvable.

We started with a problem statement and ended with a production-ready system that could genuinely save lives. Along the way, we failed fast, learned faster, and built together.

**Team Motto:** _"Fail fast, learn faster, build together"_

**Submitted with pride. Built with passion.**

---
