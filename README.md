# Strudel Demo

Strudel Demo is a web-based music playground built with **Strudel**, **React**, and **WebAudio**, featuring live code editing,
audio synthesis, and a real-time piano roll visualization. Users can play preloaded tunes, adjust volume,
switch presets, use DJ pads, and see notes drawn live on a piano roll.

---

## Features
- **Live Code Editor**: Edit Strudel tunes directly in the browser.  
- **Audio Playback**: Play tunes using WebAudio and StrudelSynth.  
- **Volume Control**: Adjust volume dynamically.  
- **D3 Graph Visualizationn**: Tracks event frequency (play, stop, presets, Hush, volume changes) in real-time.  
- **DJ Pads**: Play independent sounds on demand.  
- **Hush Mode**: Instantly mute all sound.  
- **Preset Management**: Switch between `soulful_tune`, `melody_tune`, `dance_monkey_tune` or pick a random preset.  
- **Dark Mode Support**: Toggle between light and dark themes.  
- **Event Logging**: Tracks events (play, stop, volume changes, preset changes) via D3-style logs.
- **Save & Load Settings**:Persist user preferences (volume, preset, dark mode) locally and restore them at any time.

---
## Usage

1. Edit Code: Modify the tune in the live editor (EditorPanel).

2. Play / Stop: Use the Play or Stop buttons in ControlPanel.

3. Volume: Adjust the slider to control playback volume.

4. Presets: Switch between soulful_tune, melody_tune, dance_monkey_tune, or choose random.

5. Hush Mode: Toggle to mute all sound instantly.

6. DJ Pads: Play additional sounds independently.

7. Visualization: Monitor a live D3 bar chart showing the frequency of playback events.

8. Event Logs: Monitor actions in D3LogViewer.

9. Save Settings: Click Save Settings to store current volume, preset, and theme.

10. Load Settings: Click Load Settings to restore previously saved preferences

## Components

EditorPanel.js – Live code editor for modifying tunes.

ControlPanel.js – Handles playback, volume, presets, DJ pads, Hush/Dark mode toggles, and Save/Load Settings buttons.

EventFrequencyChart.js – Renders a live D3 bar chart of events.

D3LogViewer.js – Displays a live log of events (play, stop, preset changes).

utils/tunes.js – Preloaded tunes (soulful_tune, melody_tune, dance_monkey_tune).

utils/console-monkey-patch.js – Enhances console logging for better debugging.

SettingsManager.js – Saves and loads user settings (volume, preset, dark mode) to/from local storage.

## Utility Functions

1. addVolumeToTune(tune, volume) – Adds or updates the volume variable in a tune.

2. ProcessText(inputText) – Replaces <p1_Radio> placeholders with the selected preset.

3. generateRainbowColors(numColors) – Generates an array of HSL rainbow colors for background animation.

4. handleDJPad(soundFile, name) – Plays a single DJ pad sound.

5. handleStopSinglePad(id) – Stops a specific DJ pad sound by ID.

6. saveSettings() – Saves current volume, preset, and theme to local storage.

7. loadSettings() – Loads previously saved settings from local storage, updating the UI and playback state.

## AI Usage Guidelines 

DJpadFeature: 
Input: 
Explain the DJ Pad feature in my Strudel Demo. Include the inputs (like sound file and name), outputs (activePads state, audio playback)?

Output:
Provided a clear description of inputs: sound file URL, sound name, and volume.

Explained outputs: activePads array, Audio objects, D3 log events on play and stop.

Generated example input/output code snippets for documentation.

Clarified behavior notes: multiple pads can play simultaneously, pads are tracked with unique IDs, manual stop works via handleStopSinglePad(id).


Volume Slide:

Input:
I want to implement a volume slider in my React StrudelDemo app that changes the volume of the tune .
Output:
const handleVolumeChange = (v) => {
    setVolume(v);
    const codeWithVol = addVolumeToTune(text, v);
    setText(codeWithVol);

    if (!isHushed) {
        playTune(codeWithVol);
        window.emitD3({ event: "volume_change", volume: v });
    } else {
        window.emitD3({ event: "volume_change_ignored", volume: v, reason: "HUSH active" });
    }
}; 

## Music

For this project, I created an original beat called “Original Beat”, designed to be relaxing but with clear structure and layered textures.
While I reused some base samples from the Strudel bakery, I heavily modified and remixed them to ensure the track is fully unique.

Creative Process:

1. Bassline: I composed a custom ultra-soft bassline using a triangle wave and adjusted its postgain and lpf filters to create a smooth, relaxing foundation.
2. Melody: I added a gentle lead melody, also using a triangle wave, with carefully tuned ADSR envelopes for a soft attack and longer sustain.
3. Chords & Arpeggios: I layered slow, airy arpeggiated chords and applied delay and delayfeedback effects to create depth and atmosphere.
4. Drums: Minimal drum patterns were crafted from basic kick, snare, and hi-hat structures, with volume and postgain adjustments for subtlety and balance.
5.Volume & Dynamics: Every instrument’s volume is dynamically scaled based on the global volume variable, allowing interactive control via the React interface.

Technical Process:

1. Used Strudel.cc functions such as stack, note, pick, .sound(), .postgain(), .adsr(), .delay(), .room(), and .struct() to structure and manipulate the instruments.
2.Integrated React controls for volume, presets, and DJ pads to allow real-time playback adjustments.
3. Applied layering, envelope shaping, and filter adjustments to give the track depth and clarity.

Interactivity & Originality: 

1. The track responds to user input via volume sliders, preset selection, and HUSH mode, ensuring it is a living, interactive piece rather than a static copied beat.
2. Every melodic line, chord stack, and drum pattern has been custom adjusted, guaranteeing the track is fully original and not simply a pre-made Strudel bakery sample.

By carefully remixing, layering, and applying technical audio effects,this track demonstrates both creative intent and technical skill,
qualifying it for the GIGA HD bonus points.

## VideoDemo

Link: https://mymailunisaedu-my.sharepoint.com/:v:/g/personal/sunby008_mymail_unisa_edu_au/IQBQlrdOLuqwSr4FU73vArctAfCLtA5kUH_cBwZiqoySf2E?e=4MXHDt

## Installation & Quick Start

Ensure Node.js >= 18 and npm are installed:

git clone https://github.com/NorakSun/strudel_reactor_NorakSUN.git
npm install
npm start
