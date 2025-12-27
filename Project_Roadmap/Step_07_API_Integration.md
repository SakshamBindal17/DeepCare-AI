# Step 07: Backend API Integration

## Objective

Connect all services into a unified API endpoint in `app.py`.

## Actions

1.  **Update `backend/app.py`**:
    - Import services: `TranscriptionService`, `MedicalNLPService`, `SafetyService`, `RiskEngine`.
    - Create a route `/analyze` (POST).
    - **Flow**:
      1.  Receive audio file from request.
      2.  Save temporarily.
      3.  `transcription = transcription_service.transcribe(file)`
      4.  `entities = nlp_service.analyze(transcription.text)`
      5.  **Context Filtering**: Remove entities marked as `NEGATION` (e.g., "No diabetes") or `PERTAINS_TO_FAMILY` (e.g., "Father had heart attack").
      6.  **Deduplication & Counting**: Count frequency of each unique entity.
      7.  **Parallel Safety Checks**: Use `ThreadPoolExecutor` to query FAERS for multiple drug-symptom pairs concurrently.
      8.  `final_score = risk_engine.calculate(entities, risks)` (incorporating frequency).
      9.  Return JSON with: Transcript (w/ timestamps), Entities (w/ frequency), Risk Score, Action Plan.

## Performance Improvements

- **Parallel Processing**: FAERS API calls run in parallel threads.
- **Caching**: Repeated API calls are cached.
- **Filtering**: Irrelevant entities are discarded early to save processing time.

## Implemented Features (app.py)

### Context Filtering

- **Negation Filter**: Skips entities with `NEGATION` trait (e.g., "no diabetes")
- **Family History Filter**: Skips entities with `PERTAINS_TO_FAMILY` trait
- **Result**: Only active, patient-specific symptoms analyzed

### Entity Deduplication & Frequency Counting

- **Case-Insensitive Counting**: Uses `Counter` with `.lower()` normalization
- **Original Case Preserved**: Stores first occurrence's original casing
- **Frequency Assignment**: Each unique entity gets `Frequency` field

### Parallel FAERS API Calls

- **ThreadPoolExecutor**: Concurrent processing with `max_workers=10`
- **Concurrent Execution**: All drug-symptom pairs checked simultaneously
- **Error Handling**: Single failures don't block entire pipeline

### FAERS Caching

- **LRU Cache**: `@lru_cache(maxsize=100)` on `check_drug_risks()`
- **Benefits**: Avoids redundant API calls, improves response time

## Verification

- Ensure your virtual environment is active (`.\venv\Scripts\activate`) and the server is running.
- Use Postman or a curl command to POST an audio file to `http://localhost:5000/analyze`.
- Verify the JSON response contains all the required data fields.
- Check that negated entities are filtered out.
- Verify entity frequencies are correctly counted.
