# Step 10: Frontend - Audio Synchronization

## Objective

Implement the "Karaoke" effect where text highlights as audio plays.

## Actions

1.  **Audio Player**:

    - Add an `<audio>` element to the page.
    - Load the uploaded file into it.

2.  **Sync Logic**:

    - Listen to the `timeupdate` event on the audio player.
    - Loop through the word timestamps (from Deepgram).
    - Add an `.active` class to the word/bubble currently being spoken.
    - Auto-scroll the chat container to keep the active bubble in view.

3.  **Click-to-Seek**:
    - Add click event listeners to words/bubbles.
    - On click, set `audio.currentTime` to the word's start timestamp.

## Implemented Features (CallAnalysis.jsx)

### Audio Player Integration

- **Hidden Audio Element**: Audio element with `className="hidden"` for clean UI
- **Custom Controls**:
  - Play/Pause button with icon toggle
  - Current time display in MM:SS format
  - File name with smart truncation (max 25 chars)
- **Compact Design**: Audio controls in rounded pill-shaped container
- **Refs Used**: `audioRef` for programmatic audio control

### Karaoke Effect (Auto-Scroll Sync)

- **Time Tracking**: `timeupdate` event listener with `handleTimeUpdate()`
- **Active Bubble Detection**: Compares `currentTime` with utterance `start` and `end` timestamps
- **Visual Highlighting**:
  - Active bubble gets enhanced colors and 2px ring
  - Nurse active: `bg-green-100 border-green-300 ring-2 ring-green-200`
  - Patient active: `bg-blue-100 border-blue-300 ring-2 ring-blue-200`
- **Scale Animation**: Active bubble scales to 1.02x with smooth transition
- **Auto-Scroll**: Uses `activeBubbleRef.current.scrollIntoView()` with:
  ```javascript
  {
    behavior: "smooth",
    block: "center"
  }
  ```
- **Smooth Transitions**: `transition-all duration-300` for seamless highlighting

### Click-to-Seek Implementation

- **Function**: `handleJumpToTime(time)` sets audio position
- **Auto-Play**: Automatically starts playback if paused
- **Applied To**: Every transcript bubble has `onClick` handler
- **Cursor Feedback**: `cursor-pointer` class indicates interactivity

### State Management

- `currentTime`: Tracks audio playback position
- `isPlaying`: Controls play/pause button state
- `activeBubbleRef`: React ref for scroll targeting
- **Effect Hook**: Triggers scroll whenever `currentTime` changes

### File Name Display

- **Truncation Function**: `truncateFileName(name, maxLength = 25)`
- **Tooltip**: Full name visible on hover via `title` attribute
- **Format Display**: Shows filename without extension in header

## Verification

- Play the audio.
- Watch the text highlight in real-time.
- Click a word and verify the audio jumps to that point.
- Verify active bubble scrolls into view automatically.
- Check smooth transitions between highlighted bubbles.
- Test filename truncation with long filenames.
