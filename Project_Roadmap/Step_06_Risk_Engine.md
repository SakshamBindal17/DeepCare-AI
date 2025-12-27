# Step 06: Risk Engine Logic

## Objective
Implement the "Traffic Light" logic that combines NLP results and FAERS data to assign a risk score.

## Actions

1.  **Create `backend/logic/risk_engine.py`**:
    *   Define a class `RiskEngine`.
    *   Implement `calculate_risk(nlp_entities, faers_data)`.
    *   **Logic**:
        *   **Frequency Weighting**: Multiply risk scores by the frequency of the symptom in the transcript (e.g., "pain" x3 = 30 points).
        *   **RED**: If symptom is in a "Critical List" (e.g., Chest Pain, Anaphylaxis) OR FAERS count is very high (> threshold).
        *   **YELLOW**: If symptom is in "Moderate List" (e.g., Rash, Vomiting).
        *   **GREEN**: No symptoms or minor known side effects.
    *   Return a dictionary: `{"score": 1-10, "level": "RED/YELLOW/GREEN", "action_plan": "..."}`.

2.  **Nurse Action Plan**:
    *   Add a helper to generate the text recommendation based on the level.

## Verification
*   Ensure your virtual environment is active (`.\venv\Scripts\activate`).
*   Write a unit test in `tests/test_logic.py`.
*   Mock the inputs and verify that "Chest Pain" returns RED.
