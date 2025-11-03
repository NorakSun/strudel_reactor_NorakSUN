import './App.css';
import React, { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import {
    initAudioOnFirstClick,
    webaudioOutput,
    registerSynthSounds,
    getAudioContext
} from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { registerSoundfonts } from '@strudel/soundfonts';
import console_monkey_patch from './utils/console-monkey-patch';
import { melody_tune, stranger_tune, dance_monkey_tune } from './utils/tunes';

import EditorPanel from "./components/EditorPanel";
import ControlPanel from "./components/ControlPanel";
import CanvasViewer from "./components/CanvasViewer";
import D3LogViewer from "./components/D3LogViewer";

let globalEditor = null;

const TUNES = {
    stranger_tune,
    melody_tune,
    dance_monkey_tune
};

export default function StrudelDemo() {
    const [text, setText] = useState(stranger_tune);
    const [preset, setPreset] = useState("stranger_tune");
    const [isHushed, setIsHushed] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [activeNotes, setActiveNotes] = useState([]);
    const [logs, setLogs] = useState([]);
    const [volume, setVolume] = useState(0.7); // default 0..2

    const canvasRef = useRef(null);
    const hasRun = useRef(false);

    // --- D3 event emitter ---
    useEffect(() => {
        if (!window.emitD3) {
            window.emitD3 = (data) =>
                document.dispatchEvent(new CustomEvent("d3Data", { detail: data }));
        }
    }, []);

    // --- D3 log listener ---
    useEffect(() => {
        const handleD3Data = (event) => {
            setLogs(prev => [...prev.slice(-50), JSON.stringify(event.detail)]);
        };
        document.addEventListener("d3Data", handleD3Data);
        return () => document.removeEventListener("d3Data", handleD3Data);
    }, []);

    // --- HUSH stops playback ---
    useEffect(() => {
        if (isHushed && globalEditor) {
            globalEditor.stop();
            window.emitD3({ event: "hush_activated", time: new Date().toLocaleTimeString() });
        }
    }, [isHushed]);

    // --- Initialize StrudelMirror ---
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        console_monkey_patch();

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const drawTime = [-2, 2];

        globalEditor = new StrudelMirror({
            defaultOutput: webaudioOutput,
            getTime: () => getAudioContext().currentTime,
            transpiler,
            root: document.getElementById('editor'),
            drawTime,
            onDraw: (haps) => {
                drawPianoroll({ haps, ctx, drawTime, fold: 0 });
                setActiveNotes(haps.filter(h => h.velocity > 0));
                if (haps.length) {
                    window.emitD3({ event: "active_notes", notes: haps.map(n => n.pitch), time: getAudioContext().currentTime });
                }
            },
            prebake: async () => {
                initAudioOnFirstClick();
                const loadModules = evalScope(
                    import('@strudel/core'),
                    import('@strudel/draw'),
                    import('@strudel/mini'),
                    import('@strudel/tonal'),
                    import('@strudel/webaudio'),
                );
                await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
            },
        });

        // Set initial code with volume
        const initText = addVolumeToTune(stranger_tune, volume);
        globalEditor.setCode(initText);
        setText(initText);
        window.emitD3({ event: "init", message: "Strudel initialized" });
    }, []);

    // --- Helpers ---
    const addVolumeToTune = (tune, vol) =>
        tune.includes("const volume") ? tune.replace(/const volume = [0-9.]+/, `const volume = ${vol}`)
            : `const volume = ${vol}\n` + tune;

    const playTune = (tuneText) => {
        if (!globalEditor) return;
        initAudioOnFirstClick();
        globalEditor.stop();
        globalEditor.setCode(tuneText);
        globalEditor.evaluate();
    };

    // --- Handlers ---
    const handlePlay = () => {
        if (isHushed) {
            window.emitD3({ event: "play_ignored", reason: "HUSH active" });
            return;
        }
        const codeWithVol = addVolumeToTune(text, volume);
        setText(codeWithVol);
        playTune(codeWithVol);
        window.emitD3({ event: "play", preset, time: new Date().toLocaleTimeString() });
    };

    const handleStop = () => {
        globalEditor?.stop();
        window.emitD3({ event: "stop", time: new Date().toLocaleTimeString() });
    };

    const handleVolumeChange = (v) => {
        setVolume(v);
        const codeWithVol = addVolumeToTune(text, v);
        setText(codeWithVol);
        playTune(codeWithVol);
        window.emitD3({ event: "volume_change", volume: v });
    };

    const handlePresetChange = (newPreset) => {
        setPreset(newPreset);
        const selectedTune = TUNES[newPreset] || stranger_tune;
        const tuneWithVol = addVolumeToTune(selectedTune, volume);
        setText(tuneWithVol);

        // Do NOT play automatically
        window.emitD3({ event: "preset_changed", preset: newPreset });
    };



    const handleRandomPreset = () => {
        const keys = Object.keys(TUNES).filter(k => k !== preset); // avoid current
        const rand = keys[Math.floor(Math.random() * keys.length)];
        setPreset(rand);

        const selectedTune = TUNES[rand];
        const tuneWithVol = addVolumeToTune(selectedTune, volume);
        setText(tuneWithVol);

        // Auto-play only if not hushed
        if (!isHushed) {
            playTune(tuneWithVol);
            window.emitD3({ event: "random_play", preset: rand, time: new Date().toLocaleTimeString() });
        } else {
            window.emitD3({ event: "random_ignored", preset: rand, reason: "HUSH active" });
        }
    };



    // --- Render ---
    return (
        <div
            className={`container-fluid p-3 ${darkMode ? 'dark-mode' : ''}`}
            style={{
                backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                color: darkMode ? '#eee' : '#000',
                minHeight: '100vh'
            }}
        >
            <h2>Strudel Demo</h2>

            <main className="row">
                <EditorPanel text={text} setText={setText} />
                <ControlPanel
                    onPlay={handlePlay}
                    onStop={handleStop}
                    volume={volume}
                    onVolumeChange={handleVolumeChange}
                    preset={preset}
                    onPresetChange={handlePresetChange}
                    isHushed={isHushed}
                    onHushToggle={setIsHushed}
                    onRandomPreset={handleRandomPreset}
                    darkMode={darkMode}
                    onThemeToggle={setDarkMode}
                />
            </main>

            <div className="row mt-3">
                <div className="col-md-8">
                    <div id="editor" />
                    <CanvasViewer canvasRef={canvasRef} activeNotes={activeNotes} />
                    <D3LogViewer logs={logs} />
                </div>
            </div>
        </div>
    );
}
