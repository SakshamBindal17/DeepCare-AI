# Step 06: Risk Engine Logic

## Objective

Implement the "Traffic Light" logic that combines NLP results and FAERS data to assign a risk score.

## Actions

1.  **Create `backend/logic/risk_engine.py`**:

    - Define a class `RiskEngine`.
    - Implement `calculate_risk(nlp_entities, faers_data)`.
    - **Logic**:
      - **Frequency Weighting**: Multiply risk scores by the frequency of the symptom in the transcript (e.g., "pain" x3 = 30 points).
      - **RED**: If symptom is in a "Critical List" (e.g., Chest Pain, Anaphylaxis) OR FAERS count is very high (> threshold).
      - **YELLOW**: If symptom is in "Moderate List" (e.g., Rash, Vomiting).
      - **GREEN**: No symptoms or minor known side effects.
    - Return a dictionary: `{"score": 1-10, "level": "RED/YELLOW/GREEN", "action_plan": "..."}`.

2.  **Nurse Action Plan**:
    - Add a helper to generate the text recommendation based on the level.

## Implemented Features (risk_engine.py)

### Frequency-Weighted Scoring System

- **Entity Frequency**: Each entity has a `Frequency` field (count of occurrences)
- **Score Multipliers**:
  - Critical symptoms: `4.0 * min(frequency, 2)` - Capped at 2x impact
  - Moderate symptoms: `2.0 * min(frequency, 2)`
  - General conditions: `0.5 * min(frequency, 3)` - Capped at 3x impact
- **Prevents Inflation**: Frequency caps prevent single symptom from dominating score

### FAERS Data Integration

- **Multiplier Tiers**:
  - High risk (>1000 reports): 1.5x multiplier
  - Moderate (>500 reports): 1.3x multiplier
  - Some reports (>100): 1.15x multiplier
- **Applied to Raw Score**: FAERS multiplier scales entire calculated risk

### Three-Tier Risk Calculation

- **Critical Path**: Starts at score 7+, triggered by critical symptoms OR score ≥ 7
- **Moderate Path**: Starts at score 4+, triggered by moderate symptoms OR score ≥ 4
- **General Path**: Max score of 6 for non-critical cases

### Symptom Lists

- **Critical**: chest pain, anaphylaxis, shortness of breath, difficulty breathing, stroke, heart attack, severe bleeding, loss of consciousness, suicidal thoughts
- **Moderate**: rash, vomiting, dizziness, nausea, fever, headache, diarrhea, palpitations

## Verification

- Ensure your virtual environment is active (`.\venv\Scripts\activate`).
- Write a unit test in `tests/test_logic.py`.
- Mock the inputs and verify that "Chest Pain" returns RED.
- Test frequency weighting with repeated symptoms.
- Verify FAERS multipliers affect final scores.
