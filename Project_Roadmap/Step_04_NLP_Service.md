# Step 04: AWS Medical Comprehend Service

## Objective
Implement the "Brain" (Part 1). Extract clinical entities (Medications, Symptoms) from the text.

## Actions

1.  **Create `backend/services/nlp_service.py`**:
    *   Import `boto3`.
    *   Define a class `MedicalNLPService`.
    *   Create a method `analyze_text(text)` that:
        *   Initializes the boto3 client for `comprehendmedical`.
        *   Calls `detect_entities_v2` (or `detect_entities`).
        *   Extracts `MEDICATION` and `MEDICAL_CONDITION` (Symptoms/Diagnoses).
        *   Returns a structured list of entities with their confidence scores.

2.  **Filtering**:
    *   Implement logic to filter out low-confidence results (< 70% confidence) to ensure robustness.

## Verification
*   Ensure your virtual environment is active (`.\venv\Scripts\activate`).
*   Create a temporary test script `test_nlp.py`.
*   Pass a string like "Patient reports severe chest pain after taking Lisinopril."
*   Check if it extracts:
    *   Medication: Lisinopril
    *   Symptom: Chest pain
