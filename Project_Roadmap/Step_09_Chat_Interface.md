# Step 09: Frontend - Chat Interface

## Objective
Build the interactive chat interface that displays the transcript.

## Actions

1.  **HTML Structure**:
    *   Create a container for chat messages.
    *   Create templates for "Patient Bubble" (Left, Gray) and "Nurse Bubble" (Right, Blue).

2.  **JavaScript Logic (`frontend/app.js`)**:
    *   Fetch data from the backend `/analyze` endpoint.
    *   Parse the transcript.
    *   Dynamically generate HTML bubbles based on the speaker.
    *   **Highlighting**: Use the NLP data to wrap medical terms in `<span>` tags with specific classes (e.g., `.highlight-drug`, `.highlight-symptom`).

## Verification
*   Mock the API response in JS.
*   Ensure the chat bubbles render correctly with different colors for speakers.
*   Ensure medical terms are bolded/colored.
