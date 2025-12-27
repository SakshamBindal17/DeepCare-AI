# Step 09: Frontend - Chat Interface

## Objective

Build the interactive chat interface that displays the transcript.

## Actions

1.  **HTML Structure**:

    - Create a container for chat messages.
    - Create templates for "Patient Bubble" (Left, Gray) and "Nurse Bubble" (Right, Blue).

2.  **JavaScript Logic (`frontend/app.js`)**:
    - Fetch data from the backend `/analyze` endpoint.
    - Parse the transcript.
    - Dynamically generate HTML bubbles based on the speaker.
    - **Highlighting**: Use the NLP data to wrap medical terms in `<span>` tags with specific classes (e.g., `.highlight-drug`, `.highlight-symptom`).

## Implemented Features (CallAnalysis.jsx)

### Entity Highlighting System

- **Color-Coded Inline Tags**: Medical entities are highlighted with color-coded badges
  - Medications: Blue (`bg-blue-100 text-blue-700 border-blue-200`)
  - Medical Conditions: Red (`bg-red-100 text-red-700 border-red-200`)
  - Anatomy: Green (`bg-green-100 text-green-700 border-green-200`)
- **Smart Text Parsing**: Uses `highlightEntities()` function to preserve text formatting
- **Prevents Duplicates**: Sorts entities by length to avoid nested highlighting

### Speaker Diarization

- **Visual Distinction**:
  - Nurse: Green bubbles (`bg-green-50 border-green-100`), "NURSE" label
  - Patient: Blue bubbles (`bg-blue-50 border-blue-100`), "PT" label
- **Alignment**: Nurse messages align left, patient messages align right
- **Avatar Badges**: Color-coded circular avatars with speaker labels

### Transcript Bubbles

- **Rounded Chat Style**: Messages use `rounded-2xl` with speaker-specific corner cut
- **Timestamp Display**: Shows start time in MM:SS format above each bubble
- **Max Width**: Messages constrained to 85% width for readability
- **Hover Effects**: Opacity change on hover to indicate clickability

### Empty State Handling

- Displays helpful message with icon when no transcript is available
- Prompts user to upload audio file

## Verification

- Mock the API response in JS.
- Ensure the chat bubbles render correctly with different colors for speakers.
- Ensure medical terms are bolded/colored.
- Verify entity highlighting works for all three categories.
- Check that speaker labels and colors are consistent.
