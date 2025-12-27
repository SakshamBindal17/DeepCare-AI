# Step 11: Risk Visualization & Dashboard

## Objective

Display the "Traffic Light" status and FAERS charts.

## Actions

1.  **Traffic Light Component**:

    - Create a visual indicator (Circle/Badge).
    - Logic: Change color (Red/Yellow/Green) based on the API response `risk_level`.
    - Animation: Add a CSS pulse animation if the status is RED.

2.  **Nurse Action Plan**:

    - Display the recommended text from the API.

3.  **FAERS Chart (Optional/Bonus)**:
    - Use a library like Chart.js.
    - Render a simple bar chart comparing the patient's symptom frequency vs. other common side effects.

## Implemented Features

### Traffic Light Component (Risk Assessment Section)

- **Circular Risk Badge**:
  - Large circular indicator (w-24 h-24) with 4px colored border
  - Score displayed in 3xl font size
  - Color coding:
    - Critical: Red (`border-red-500 bg-red-50 text-red-600`)
    - Moderate: Yellow (`border-yellow-500 bg-yellow-50 text-yellow-600`)
    - Low Risk: Green (`border-green-500 bg-green-50 text-green-600`)
- **Critical Alert Indicator**: Animated warning with pulsing text
- **Risk Details Cards**:
  - Condition level display
  - Urgency status (Immediate/Monitor/Routine)
  - Color-coded text matching risk level

### CSS Pulse Animations (in `index.css`)

```css
@keyframes pulse-critical {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes glow-critical {
  0%,
  100% {
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.4);
  }
}

.pulse-critical {
  animation: pulse-critical 2s ease-in-out infinite;
}
.glow-critical {
  animation: glow-critical 2s ease-in-out infinite;
}
```

### Recommended Actions Component

- **Enhanced Visual Design**:
  - Gradient background: `bg-gradient-to-br from-green-50 to-emerald-50`
  - 2px green border with shadow: `border-2 border-green-200 shadow-lg`
  - Decorative left accent line with gradient
  - White semi-transparent content box
- **AI Indicator**:
  - Pulsing green dot animation
  - "AI-Generated Clinical Guidance" label
- **Typography**: Enhanced with better font weights and spacing
- **Fallback Message**: Shows when no recommendations available

### FAERS Chart Component (FAERSChart.jsx)

- **Library**: Chart.js v4.5.1 + react-chartjs-2 v5.3.1
- **Chart Type**: Horizontal bar chart
- **Data Display**:
  - Top 5 drug-symptom pairs
  - Report counts from FAERS database
  - Patient symptom frequency overlay (when available)
- **Styling**:
  - Responsive design with aspect ratio maintenance
  - Custom colors matching theme
  - Tooltips with detailed information
- **Empty State**:
  - Shows helpful message when no FAERS data
  - Contextual text based on detected medications

### Collapsible Risk Sections

- **Custom Component**: `CollapsibleSection` with animation
- **Features**:
  - Expand/collapse with chevron icons
  - Count badges showing number of items
  - Color-coded section icons
  - Smooth height animations using Framer Motion
- **Sections**:
  - **FAERS Alerts**: Red theme, scrollable with custom scrollbar
  - **Detected Symptoms**: Orange theme, scrollable with custom scrollbar
- **Max Height**: 96 units (384px) with overflow scroll
- **Custom Scrollbar**: Applied via `custom-scrollbar` class

### Alert Cards

- **FAERS Alerts**:
  - Red background (`bg-red-50 border-red-100`)
  - "CRITICAL MATCH" label in uppercase
  - Shows drug + symptom combination
  - Report count display
- **Symptom Cards**:
  - Orange background (`bg-orange-50 border-orange-100`)
  - "SYMPTOM" label in uppercase
  - Frequency count display

### Risk Score Header Badge

- **Top Header Display**: Shows current risk score prominently
- **Dynamic Styling**: Matches current risk level
- **Icon Integration**: AlertTriangle icon for critical alerts
- **Animations**: Applies pulse-critical class when needed

## Verification

- Test with a "Red" scenario (mock data). Verify the red light pulses.
- Test with a "Green" scenario. Verify it is static green.
- Verify Chart.js renders FAERS data correctly.
- Check collapsible sections expand/collapse smoothly.
- Verify scrollbars work in FAERS and symptoms sections.
- Test recommended actions styling and AI indicator.
