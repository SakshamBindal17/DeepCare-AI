# Step 11: Risk Visualization & Dashboard

## Objective
Display the "Traffic Light" status and FAERS charts.

## Actions

1.  **Traffic Light Component**:
    *   Create a visual indicator (Circle/Badge).
    *   Logic: Change color (Red/Yellow/Green) based on the API response `risk_level`.
    *   Animation: Add a CSS pulse animation if the status is RED.

2.  **Nurse Action Plan**:
    *   Display the recommended text from the API.

3.  **FAERS Chart (Optional/Bonus)**:
    *   Use a library like Chart.js.
    *   Render a simple bar chart comparing the patient's symptom frequency vs. other common side effects.

## Verification
*   Test with a "Red" scenario (mock data). Verify the red light pulses.
*   Test with a "Green" scenario. Verify it is static green.
