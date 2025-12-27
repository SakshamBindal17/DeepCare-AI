# Manual Verification Log

This document tracks manual end-to-end testing of the DeepCare AI system.

---

## Test Case 1: Clear Audio with Critical Symptoms

**Test Date:** [To be filled during testing]

**Audio File:** `CAR0004.mp3` (Cardiovascular case)

**Expected Behavior:**

- Transcript should clearly separate Nurse (Speaker 0) and Patient (Speaker 1)
- Medical entities should be highlighted in the transcript
- Critical symptoms should be detected (e.g., chest pain, shortness of breath)
- Risk Score: 7.0-10.0 (Critical/Red)
- Action Plan: "CRITICAL ALERT" recommendation
- Audio sync: Text highlights as audio plays
- Click-to-seek: Clicking on text jumps to that point in audio

**Actual Results:**

- [ ] Transcription accurate
- [ ] Speaker diarization working
- [ ] Entity extraction correct
- [ ] Risk score in expected range
- [ ] Critical alert displayed with pulse animation
- [ ] Audio synchronization working
- [ ] Click-to-seek functional

**Notes:**

```
[Add observations here during testing]
```

---

## Test Case 2: Mumbled/Low Quality Audio

**Test Date:** [To be filled during testing]

**Audio File:** [Select a lower quality recording]

**Expected Behavior:**

- Deepgram should still transcribe with reasonable accuracy
- NLP might have lower confidence scores (>0.7 threshold should filter)
- System should handle partial/missing entities gracefully
- Risk assessment should work with available data
- No crashes or errors in UI

**Actual Results:**

- [ ] Transcription completed without errors
- [ ] Low confidence entities filtered out
- [ ] Risk engine handled partial data
- [ ] UI displayed appropriately
- [ ] No console errors

**Notes:**

```
[Add observations here during testing]
```

---

## Test Case 3: No Adverse Symptoms (Routine Follow-up)

**Test Date:** [To be filled during testing]

**Audio File:** [Select a routine/non-critical case]

**Expected Behavior:**

- Transcript shows conversation about general health
- Few or no medical conditions extracted
- Medications might be mentioned (routine prescriptions)
- Risk Score: 0-3.0 (Low Risk/Green)
- Action Plan: "Low risk detected. Continue monitoring."
- No critical alerts or animations

**Actual Results:**

- [ ] Transcription complete
- [ ] Minimal/no critical entities detected
- [ ] Risk score in low range
- [ ] Green status indicator shown
- [ ] Appropriate action plan displayed

**Notes:**

```
[Add observations here during testing]
```

---

## Test Case 4: Multiple Medications with Moderate Symptoms

**Test Date:** [To be filled during testing]

**Audio File:** [Select case with multiple drugs mentioned]

**Expected Behavior:**

- Multiple medication entities extracted
- Moderate symptoms detected (e.g., dizziness, nausea, rash)
- FAERS API queried for each drug-symptom pair
- Risk Score: 4.0-6.9 (Moderate/Yellow)
- FAERS alerts shown in the risk panel
- Action Plan: "WARNING: Monitor closely"

**Actual Results:**

- [ ] All medications extracted
- [ ] Symptoms correctly identified
- [ ] FAERS data retrieved and displayed
- [ ] Risk score in moderate range
- [ ] Yellow status indicator shown
- [ ] FAERS alerts collapsible section populated

**Notes:**

```
[Add observations here during testing]
```

---

## Test Case 5: File Upload & Session Persistence

**Test Date:** [To be filled during testing]

**Test Steps:**

1. Upload and analyze an audio file
2. Verify analysis results appear
3. Switch to Dashboard tab
4. Switch back to Call Analysis tab
5. Reload the browser page (F5)
6. Check if analysis persists

**Expected Behavior:**

- Analysis results remain visible after tab switching
- Session storage persists on page reload
- History component shows analyzed file
- Audio playback still works after reload (if audio URL persists)

**Actual Results:**

- [ ] Results persist across tab switches
- [ ] Session storage survives page reload
- [ ] History component updated
- [ ] Can re-view analysis from history

**Notes:**

```
[Add observations here during testing]
```

---

## System Requirements Verification

### Backend Services

- [ ] Flask server runs on `http://localhost:5000`
- [ ] `/health` endpoint returns `{"status": "healthy"}`
- [ ] `/analyze` endpoint accepts audio files
- [ ] Deepgram API key configured and working
- [ ] AWS Comprehend Medical credentials configured
- [ ] FAERS API accessible (no rate limiting issues)

### Frontend

- [ ] React app runs on `http://localhost:5173` (or Vite default)
- [ ] Sidebar navigation works (3 tabs)
- [ ] UI is responsive and clean
- [ ] No console errors in browser DevTools
- [ ] Animations smooth (pulse effect on Critical alerts)
- [ ] Colors match design system (Primary Blue: #2D5BFF)

### Performance

- [ ] Audio file upload completes in <5 seconds
- [ ] Transcription completes in <10 seconds
- [ ] NLP analysis completes in <3 seconds
- [ ] FAERS queries complete in <5 seconds (parallel execution)
- [ ] Total pipeline: <30 seconds for typical 2-3 minute audio

---

## Known Issues / Bugs

| Issue                                  | Severity        | Status     | Notes |
| -------------------------------------- | --------------- | ---------- | ----- |
| [Add issues discovered during testing] | High/Medium/Low | Open/Fixed |       |

---

## Browser Compatibility

Tested on:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Recommendations for Production

1. **Error Handling:**

   - Add user-friendly error messages for API failures
   - Handle network timeout gracefully
   - Show loading states for long operations

2. **Security:**

   - Validate audio file types and sizes
   - Sanitize uploaded filenames
   - Rate limit API endpoints

3. **UX Improvements:**

   - Add progress indicators for each pipeline stage
   - Allow users to cancel long-running analyses
   - Export analysis results as PDF

4. **Performance:**
   - Implement server-side caching for FAERS queries
   - Optimize audio file handling (streaming vs. full upload)
   - Consider WebSocket for real-time updates

---

**Tester Name:** [Your Name]  
**Date:** [Test Date]  
**Version:** 1.0
