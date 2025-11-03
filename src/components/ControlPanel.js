import React from 'react';

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
    onVolumeChange
}) {
    const tunes = [
        { name: 'stranger_tune', label: 'Stranger Tune' },
        { name: 'melody_tune', label: 'Melody Tune' },
        { name: 'dance_monkey_tune', label: 'Dance Monkey Tune' },
    ];

    return (
        <div className="col-md-4">
            {/* Playback Buttons */}
            <button className="btn btn-outline-primary mb-1" onClick={onProc}>Preprocess</button>
            <button className="btn btn-outline-primary mb-1" onClick={onProcPlay}>Proc & Play</button>
            <br />
            <button className="btn btn-outline-primary mb-3" onClick={onPlay}>Play</button>
            <button className="btn btn-outline-primary mb-3" onClick={onStop}>Stop</button>
            <br />

            {/* Preset Dropdown */}
            <label htmlFor="presetSelect">Select Preset Tune:</label>
            <select
                id="presetSelect"
                className="form-select mb-3"
                value={preset}
                onChange={(e) => onPresetChange(e.target.value)}
            >
                {tunes.map(t => <option key={t.name} value={t.name}>{t.label}</option>)}
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
                    style={{ color: !isHushed ? 'green' : 'inherit', fontWeight: !isHushed ? 'bold' : 'normal' }}
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
                    style={{ color: isHushed ? 'red' : 'inherit', fontWeight: isHushed ? 'bold' : 'normal' }}
                >
                    p1: HUSH
                </label>
            </div>

            {/* Random Preset */}
            <button className="btn btn-outline-info mb-3" onClick={onRandomPreset}>
                Random Preset
            </button>
            <br />

            {/* Theme Toggle */}
            <button className="btn btn-outline-secondary mt-2" onClick={() => onThemeToggle(!darkMode)}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
        </div>
    );
}
