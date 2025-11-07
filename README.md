# Strudel Demo

Strudel Demo is a web-based music playground built with **Strudel**, **React**, and **WebAudio**, featuring live code editing,
audio synthesis, and a real-time piano roll visualization. Users can play preloaded tunes, adjust volume,
switch presets, use DJ pads, and see notes drawn live on a piano roll.

---

## Features
- **Live Code Editor**: Edit Strudel tunes directly in-browser.  
- **Audio Playback**: Play tunes using WebAudio and StrudelSynth.  
- **Volume Control**: Adjust volume dynamically.  
- **Piano Roll Visualization**: Real-time note rendering using `@strudel/draw`.  
- **DJ Pads**: Play independent sounds on demand.  
- **Hush Mode**: Instantly mute all sound.  
- **Preset Management**: Switch between `soulful_tune`, `melody_tune`, `dance_monkey_tune` or pick a random preset.  
- **Dark Mode Support**: Toggle between light and dark themes.  
- **Event Logging**: Tracks events (play, stop, volume changes, preset changes) via D3-style logs.

---
## Usage

1. Edit Code: Modify the tune in the live editor (EditorPanel).

2. Play / Stop: Use the Play or Stop buttons in ControlPanel.

3. Volume: Adjust the slider to control playback volume.

4. Presets: Switch between soulful_tune, melody_tune, dance_monkey_tune, or choose random.

5. Hush Mode: Toggle to mute all sound instantly.

6. DJ Pads: Play additional sounds independently.

7. Visualization: Watch active notes appear on the piano roll in CanvasViewer.

8. Event Logs: Monitor actions in D3LogViewer.

## Components

EditorPanel.js – Live code editor for modifying tunes.

ControlPanel.js – Play, stop, volume, preset, DJ pad controls, and Hush/Dark mode toggles.

CanvasViewer.js – Draws the piano roll for active notes.

D3LogViewer.js – Displays a live log of events (play, stop, preset changes).

utils/tunes.js – Preloaded tunes (soulful_tune, melody_tune, dance_monkey_tune).

utils/console-monkey-patch.js – Enhances console logging for better debugging.

## Utility Functions

addVolumeToTune(tune, volume) – Adds or updates the volume variable in a tune.

ProcessText(inputText) – Replaces <p1_Radio> placeholders with the selected preset.

generateRainbowColors(numColors) – Generates an array of HSL rainbow colors for background animation.

handleDJPad(soundFile, name) – Plays a single DJ pad sound.

handleStopSinglePad(id) – Stops a specific DJ pad sound by ID.

## AI Usage Guidelines 

DJpadFeature: 
Input: 
Explain the DJ Pad feature in my Strudel Demo. Include the inputs (like sound file and name), outputs (activePads state, audio playback)?

Output:
Provided a clear description of inputs: sound file URL, sound name, and volume.

Explained outputs: activePads array, Audio objects, D3 log events on play and stop.

Generated example input/output code snippets for documentation.

Clarified behavior notes: multiple pads can play simultaneously, pads are tracked with unique IDs, manual stop works via handleStopSinglePad(id).



## Installation & Quick Start

Ensure Node.js >= 18 and npm are installed:

git clone https://github.com/NorakSun/strudel_reactor_NorakSUN.git
npm install
npm start
