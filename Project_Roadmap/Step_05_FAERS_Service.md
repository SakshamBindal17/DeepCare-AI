# Step 05: FAERS Safety Service

## Objective
Implement the "Brain" (Part 2). Cross-reference extracted data with the FDA Adverse Event Reporting System.

## Actions

1.  **Create `backend/services/safety_service.py`**:
    *   Define a class `SafetyService`.
    *   Create a method `check_drug_risks(drug_name, symptom_name)` that:
        *   Constructs a query to the openFDA API: `https://api.fda.gov/drug/event.json`.
        *   Query format: `search=patient.drug.medicinalproduct:{drug}+AND+patient.reaction.reactionmeddrapt:{symptom}`.
        *   Fetches the `meta.results.total` (count of reports).
    *   Create a method `get_drug_profile(drug_name)` to get common side effects for the charts.

3.  **Performance Optimization**:
    *   Use `functools.lru_cache` to cache API responses. This prevents redundant network calls for common drug-symptom pairs, significantly speeding up analysis.

2.  **Error Handling**:
    *   Handle cases where the drug or symptom is not found in the database.

## Verification
*   Ensure your virtual environment is active (`.\venv\Scripts\activate`).
*   Create a temporary test script `test_faers.py`.
*   Query "Lisinopril" and "Dizziness".
*   Ensure it returns a number (count of adverse events).
