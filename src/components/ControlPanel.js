import React from 'react';

// Import all your sound files
import Clap from '../sounds/Clap.wav';
import Electronic1 from '../sounds/electronic1.wav';
import Electronic2 from '../sounds/electronic2.wav';
import Hihats from '../sounds/Hihats.wav';
import Kick from '../sounds/kick.wav';
import Melody1 from '../sounds/Melody1.wav';
import Melody2 from '../sounds/Melody2.wav';
import Snares from '../sounds/snares.wav';

export default function ControlPanel({
    onProc,
    onPlay,
    onProcPlay,
    onStop,
    preset,
    onPresetChange,
    isHushed,
    onHushToggle,
    onRandomPreset,
    darkMode,
    onThemeToggle,
    volume,
    onVolumeChange,
    onPlaySound,
    activePads = [],          // [{id, name}] array
    onStopSinglePad      // function to stop individual pad
}) {
    const tunes = [
        { name: 'soulful_tune', label: 'soulful_tune' },
        { name: 'melody_tune', label: 'Melody Tune' },
        { name: 'dance_monkey_tune', label: 'Dance Monkey Tune' },
    ];

    const sounds = [
        { name: 'Clap', file: Clap },
        { name: 'Electronic 1', file: Electronic1 },
        { name: 'Electronic 2', file: Electronic2 },
        { name: 'Hi-Hat', file: Hihats },
        { name: 'Kick', file: Kick },
        { name: 'Melody 1', file: Melody1 },
        { name: 'Melody 2', file: Melody2 },
        { name: 'Snare', file: Snares },
    ];

    return (
        <div className="col-md-4">
            {/* Playback Buttons */}
            <button className="btn btn-outline-primary mb-1" onClick={onProc}>
                Preprocess
            </button>
            <button className="btn btn-outline-primary mb-1" onClick={onProcPlay}>
                Proc & Play
            </button>
            <br />
            <button className="btn btn-outline-primary mb-3" onClick={onPlay}>
                Play
            </button>
            <button className="btn btn-outline-primary mb-3" onClick={onStop}>
                Stop
            </button>
            <br />

            {/* Preset Dropdown */}
            <label htmlFor="presetSelect">Select Preset Tune:</label>
            <select
                id="presetSelect"
                className="form-select mb-3"
                value={preset}
                onChange={(e) => onPresetChange(e.target.value)}
            >
                {tunes.map((t) => (
                    <option key={t.name} value={t.name}>
                        {t.label}
                    </option>
                ))}
            </select>

            {/* Volume Slider */}
            <label htmlFor="volumeSlider">Volume: {volume.toFixed(2)}</label>
            <input
                type="range"
                id="volumeSlider"
                className="form-range mb-3"
                min="0"
                max="2"
                step="0.01"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            />

            {/* HUSH/ON Radio Buttons */}
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="hushToggle"
                    id="radioOn"
                    checked={!isHushed}
                    onChange={() => onHushToggle(false)}
                />
                <label
                    className="form-check-label"
                    htmlFor="radioOn"
                    style={{
                        color: !isHushed ? 'green' : 'inherit',
                        fontWeight: !isHushed ? 'bold' : 'normal',
                    }}
                >
                    p1: ON
                </label>
            </div>

            <div className="form-check mb-3">
                <input
                    className="form-check-input"
                    type="radio"
                    name="hushToggle"
                    id="radioHush"
                    checked={isHushed}
                    onChange={() => onHushToggle(true)}
                />
                <label
                    className="form-check-label"
                    htmlFor="radioHush"
                    style={{
                        color: isHushed ? 'red' : 'inherit',
                        fontWeight: isHushed ? 'bold' : 'normal',
                    }}
                >
                    p1: HUSH
                </label>
            </div>

            {/* Random Preset */}
            <button className="btn btn-outline-info mb-3" onClick={onRandomPreset}>
                Random Preset
            </button>
            <br />

            {/* Sound Buttons */}
            <div className="mb-3">
                <label>Play Individual Sounds:</label>
                <div className="d-flex flex-wrap gap-2 mt-1">
                    {sounds.map((s) => (
                        <button
                            key={s.name}
                            className="btn btn-outline-success btn-sm"
                            onClick={() => onPlaySound(s.file, s.name)}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>

                {/* Active Pads with Stop button */}
                {activePads.length > 0 && (
                    <div className="mt-2">
                        <label>Active Pads:</label>
                        <div className="d-flex flex-wrap gap-2 mt-1">
                            {activePads.map((pad) => (
                                <button
                                    key={pad.id}
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => onStopSinglePad(pad.id)}
                                >
                                    Stop {pad.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Theme Toggle */}
            <button
                className="btn btn-outline-secondary mt-2"
                onClick={() => onThemeToggle(!darkMode)}
            >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
        </div>
    );
}
