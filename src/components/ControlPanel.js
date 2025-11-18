import React from "react";
import { Card, Accordion, Tooltip, OverlayTrigger } from "react-bootstrap";

// Import sounds
import Clap from "../sounds/Clap.wav";
import Electronic1 from "../sounds/electronic1.wav";
import Electronic2 from "../sounds/electronic2.wav";
import Hihats from "../sounds/Hihats.wav";
import Kick from "../sounds/kick.wav";
import Melody1 from "../sounds/Melody1.wav";
import Melody2 from "../sounds/Melody2.wav";
import Snares from "../sounds/snares.wav";

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
    activePads = [],
    onStopSinglePad,
    onSaveSettings,
    onLoadSettings,
}) {
    const tunes = [
        { name: "soulful_tune", label: "Soulful Tune" },
        { name: "melody_tune", label: "Melody Tune" },
        { name: "dance_monkey_tune", label: "Dance Monkey Tune" },
    ];

    const sounds = [
        { name: "Clap", file: Clap },
        { name: "Electronic 1", file: Electronic1 },
        { name: "Electronic 2", file: Electronic2 },
        { name: "Hi-Hat", file: Hihats },
        { name: "Kick", file: Kick },
        { name: "Melody 1", file: Melody1 },
        { name: "Melody 2", file: Melody2 },
        { name: "Snare", file: Snares },
    ];

    const renderTooltip = (props, text) => <Tooltip {...props}>{text}</Tooltip>;

    return (
        <div className="col-12 col-md-4">
            {/* Playback Controls */}
            <Card className="mb-3">
                <Card.Header>Playback</Card.Header>
                <Card.Body className="d-flex flex-wrap gap-2">
                    <OverlayTrigger overlay={(props) => renderTooltip(props, "Preprocess the tune")} placement="top">
                        <button className="btn btn-primary flex-fill" onClick={onProc}>Preprocess</button>
                    </OverlayTrigger>

                    <OverlayTrigger overlay={(props) => renderTooltip(props, "Preprocess and play")} placement="top">
                        <button className="btn btn-primary flex-fill" onClick={onProcPlay}>Proc & Play</button>
                    </OverlayTrigger>

                    <OverlayTrigger overlay={(props) => renderTooltip(props, "Play the tune")} placement="top">
                        <button className="btn btn-primary flex-fill" onClick={onPlay}>Play</button>
                    </OverlayTrigger>

                    <OverlayTrigger overlay={(props) => renderTooltip(props, "Stop playback")} placement="top">
                        <button className="btn btn-primary flex-fill" onClick={onStop}>Stop</button>
                    </OverlayTrigger>
                </Card.Body>
            </Card>

            {/* Presets & Volume */}
            <Card className="mb-3">
                <Card.Header>Presets & Settings</Card.Header>
                <Card.Body>
                    <label htmlFor="presetSelect" className="form-label">Select Preset Tune:</label>
                    <select
                        id="presetSelect"
                        className="form-select mb-2"
                        value={preset}
                        onChange={(e) => onPresetChange(e.target.value)}
                    >
                        {tunes.map(t => <option key={t.name} value={t.name}>{t.label}</option>)}
                    </select>

                    <button className="btn btn-info w-100 mb-2" onClick={onRandomPreset}>Random Preset</button>

                    <label htmlFor="volumeSlider" className="form-label">Volume: {volume.toFixed(2)}</label>
                    <input
                        type="range"
                        id="volumeSlider"
                        className="form-range mb-2"
                        min="0"
                        max="2"
                        step="0.01"
                        value={volume}
                        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    />

                    <button className="btn btn-success w-100 mb-1" onClick={onSaveSettings}>Save Settings</button>
                    <button className="btn btn-secondary w-100 mb-2" onClick={onLoadSettings}>Load Settings</button>
                </Card.Body>
            </Card>

            {/* HUSH */}
            <Card className="mb-3">
                <Card.Header>HUSH Mode</Card.Header>
                <Card.Body>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="hushToggle" checked={!isHushed} onChange={() => onHushToggle(false)} />
                        <label className="form-check-label" style={{ color: !isHushed ? "green" : "inherit", fontWeight: !isHushed ? "bold" : "normal" }}>ON</label>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="radio" name="hushToggle" checked={isHushed} onChange={() => onHushToggle(true)} />
                        <label className="form-check-label" style={{ color: isHushed ? "red" : "inherit", fontWeight: isHushed ? "bold" : "normal" }}>HUSH</label>
                    </div>
                </Card.Body>
            </Card>

            {/* DJ Pads */}
            <Accordion defaultActiveKey="0" className="mb-3">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>DJ Pads</Accordion.Header>
                    <Accordion.Body>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                            {sounds.map(s => (
                                <button key={s.name} className="btn btn-warning btn-sm flex-fill" onClick={() => onPlaySound(s.file, s.name)}>{s.name}</button>
                            ))}
                        </div>

                        {activePads.length > 0 && (
                            <div>
                                <label>Active Pads:</label>
                                <div className="d-flex flex-wrap gap-2 mt-1">
                                    {activePads.map(pad => (
                                        <span
                                            key={pad.id}
                                            className={`badge ${darkMode ? "bg-light text-dark" : "bg-danger"}`}
                                            style={{ cursor: "pointer", borderRadius: "6px", padding: "5px 8px" }}
                                            onClick={() => onStopSinglePad(pad.id)}
                                        >
                                            {pad.name} ×
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <button className="btn btn-secondary w-100" onClick={() => onThemeToggle(!darkMode)}>
                {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
        </div>
    );
}
