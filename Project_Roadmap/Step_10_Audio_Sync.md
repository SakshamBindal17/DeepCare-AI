# Step 10: Frontend - Audio Synchronization

## Objective
Implement the "Karaoke" effect where text highlights as audio plays.

## Actions

1.  **Audio Player**:
    *   Add an `<audio>` element to the page.
    *   Load the uploaded file into it.

2.  **Sync Logic**:
    *   Listen to the `timeupdate` event on the audio player.
    *   Loop through the word timestamps (from Deepgram).
    *   Add an `.active` class to the word/bubble currently being spoken.
    *   Auto-scroll the chat container to keep the active bubble in view.

3.  **Click-to-Seek**:
    *   Add click event listeners to words/bubbles.
    *   On click, set `audio.currentTime` to the word's start timestamp.

## Verification
*   Play the audio.
*   Watch the text highlight in real-time.
*   Click a word and verify the audio jumps to that point.
