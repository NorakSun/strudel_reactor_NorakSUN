import './App.css';
import React, { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import {
    initAudioOnFirstClick,
    webaudioOutput,
    registerSynthSounds,
    getAudioContext
} from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { registerSoundfonts } from '@strudel/soundfonts';
import console_monkey_patch from './utils/console-monkey-patch';
import { melody_tune, soulful_tune, dance_monkey_tune } from './utils/tunes';

import EditorPanel from "./components/EditorPanel";
import ControlPanel from "./components/ControlPanel";
import D3LogViewer from "./components/D3LogViewer";
import EventFrequencyChart from "./components/EventFrequencyChart";
// Global reference to StrudelMirror editor instance
let globalEditor = null;

// Available tune presets
const TUNES = { soulful_tune, melody_tune, dance_monkey_tune };

export default function StrudelDemo() {
    // --- React state ---
    const [text, setText] = useState(soulful_tune);
    const [preset, setPreset] = useState("soulful_tune");
    const [isHushed, setIsHushed] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [logs, setLogs] = useState([]);
    const [volume, setVolume] = useState(0.7);

    // --- Refs ---
    const hasRun = useRef(false);
    const [activePads, setActivePads] = useState([]);
    const [isPlayingTune, setIsPlayingTune] = useState(false);
    const appRef = useRef(null);
    const rainbowInterval = useRef(null);

    // --- D3 emitter ---
    useEffect(() => {
        if (!window.emitD3) {
            window.emitD3 = (data) => document.dispatchEvent(new CustomEvent("d3Data", { detail: data }));
        }
    }, []);

    // --- D3 log listener ---
    useEffect(() => {
        const handleD3Data = (event) => {
            try {
                const safeString = JSON.stringify(event.detail, (key, value) => {
                    if (value instanceof HTMLElement) return "[HTMLElement]";
                    if (typeof value === "function") return "[Function]";
                    return value;
                });
                setLogs(prev => [...prev.slice(-50), safeString]);
            } catch (err) {
                console.error("Failed to log D3 event:", err);
            }
        };
        document.addEventListener("d3Data", handleD3Data);
        return () => document.removeEventListener("d3Data", handleD3Data);
    }, []);

    // --- HUSH effect ---
    useEffect(() => {
        if (isHushed && globalEditor) {
            globalEditor.stop();
            setIsPlayingTune(false);
            if (appRef.current) appRef.current.style.backgroundColor = darkMode ? '#1e1e1e' : '#fff';
            window.emitD3({ event: "hush_activated", time: new Date().toLocaleTimeString() });
        }
    }, [isHushed, darkMode]);

    // --- Rainbow background effect ---
    useEffect(() => {
        const colors = generateRainbowColors(100);
        let index = 0;
        const stepTime = 2000 / colors.length;

        if (isPlayingTune && !isHushed) {
            rainbowInterval.current = setInterval(() => {
                if (appRef.current) appRef.current.style.backgroundColor = colors[index];
                index = (index + 1) % colors.length;
            }, stepTime);
        } else {
            clearInterval(rainbowInterval.current);
            if (appRef.current) appRef.current.style.backgroundColor = darkMode ? '#1e1e1e' : '#fff';
        }

        return () => clearInterval(rainbowInterval.current);
    }, [isPlayingTune, isHushed, darkMode]);

    // --- Initialize StrudelMirror editor ---
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        console_monkey_patch();

        globalEditor = new StrudelMirror({
            defaultOutput: webaudioOutput,
            getTime: () => getAudioContext().currentTime,
            transpiler,
            root: document.getElementById('editor'),
            prebake: async () => {
                initAudioOnFirstClick();
                const loadModules = evalScope(
                    import('@strudel/core'),
                    import('@strudel/draw'),
                    import('@strudel/mini'),
                    import('@strudel/tonal'),
                    import('@strudel/webaudio')
                );
                await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
            }
        });

        const initText = addVolumeToTune(soulful_tune, volume);
        globalEditor.setCode(initText);
        setText(initText);
        window.emitD3({ event: "init", message: "Strudel initialized" });
    }, []);

    // --- Helpers ---
    const addVolumeToTune = (tune, vol) => {
  const safeVol = Math.max(0, vol); // allow >1
  return tune.includes("const volume")
    ? tune.replace(/const volume = [0-9.]+/, `const volume = ${safeVol}`)
    : `const volume = ${safeVol}\n${tune}`;
};



    const ProcessText = (inputText) => inputText.replace(/<p1_Radio>/g, preset);

    const playTune = (initText) => {
        if (!globalEditor) return;
        initAudioOnFirstClick();
        globalEditor.stop();
        setIsPlayingTune(true);
        globalEditor.setCode(initText);
        globalEditor.evaluate();
    };

    // --- Event handlers ---
    const handlePlay = () => {
        if (isHushed) {
            window.emitD3({ event: "play_ignored", reason: "HUSH active", time: new Date().toLocaleTimeString() });
            return;
        }
        const codeWithVol = addVolumeToTune(text, volume);
        setText(codeWithVol);
        setIsPlayingTune(true);
        playTune(codeWithVol);
        window.emitD3({ event: "play", preset, time: new Date().toLocaleTimeString() });
    };

    const handleStop = () => {
        globalEditor?.stop();
        setIsPlayingTune(false);
        window.emitD3({ event: "stop", time: new Date().toLocaleTimeString() });
    };

    const handleProc = () => {
        const processedText = ProcessText(text);
        setText(processedText);
        globalEditor.setCode(processedText);
        window.emitD3({ event: "preprocess", preset, time: new Date().toLocaleTimeString() });
    };

    const handleProcPlay = () => {
        const processedText = ProcessText(text);
        setText(processedText);
        globalEditor.setCode(processedText);
        playTune(processedText);
        window.emitD3({ event: "preprocess_play", preset, time: new Date().toLocaleTimeString() });
    };

    const handleVolumeChange = (v) => {
        setVolume(v);
        const codeWithVol = addVolumeToTune(text, v);
        setText(codeWithVol);
        if (!isHushed) playTune(codeWithVol);
        window.emitD3({
            event: isHushed ? "volume_change_ignored" : "volume_change",
            volume: v,
            reason: isHushed ? "HUSH active" : undefined,
            time: new Date().toLocaleTimeString()
        });
    };

    const handlePresetChange = (newPreset) => {
        const selectedTune = TUNES[newPreset] || soulful_tune;
        const tuneWithVol = addVolumeToTune(selectedTune, volume);
        setPreset(newPreset);
        setText(tuneWithVol);
        window.emitD3({ event: "preset_changed", preset: newPreset, time: new Date().toLocaleTimeString() });
    };

    const handleRandomPreset = () => {
        const keys = Object.keys(TUNES).filter(k => k !== preset);
        if (keys.length === 0) return;
        const rand = keys[Math.floor(Math.random() * keys.length)];
        const selectedTune = TUNES[rand];
        const tuneWithVol = addVolumeToTune(selectedTune, volume);
        setPreset(rand);
        setText(tuneWithVol);
        if (!isHushed) playTune(tuneWithVol);
        window.emitD3({
            event: isHushed ? "random_ignored" : "random_play",
            preset: rand,
            reason: isHushed ? "HUSH active" : undefined,
            time: new Date().toLocaleTimeString()
        });
    };

    const handleDJPad = (soundFile, name) => {
        const audio = new Audio(soundFile);
        audio.volume = Math.min(1, volume); // browser-safe
        audio.play();
        const id = Date.now();
        setActivePads(prev => [...prev, { id, name, audio }]);
        audio.addEventListener("ended", () => setActivePads(prev => prev.filter(p => p.id !== id)));
        window.emitD3({ event: "dj_pad_play", sound: name, time: new Date().toLocaleTimeString() });
    };

    const handleStopSinglePad = (id) => {
        const pad = activePads.find(p => p.id === id);
        if (!pad) return;
        pad.audio.pause();
        pad.audio.currentTime = 0;
        setActivePads(prev => prev.filter(p => p.id !== id));
        window.emitD3({ event: "dj_pad_stop", sound: pad.name, time: new Date().toLocaleTimeString() });
    };


    const generateRainbowColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const hue = (i * 360) / numColors;
            colors.push(`hsl(${hue}, 100%, 50%)`);
        }
        return colors;
    };

    // --- Render ---
    return (
        <div
            ref={appRef}
            className={`container-fluid p-3 ${darkMode ? 'dark-mode' : ''} ${isPlayingTune && !isHushed ? 'playing' : ''}`}
            style={{ minHeight: '100vh', backgroundColor: darkMode ? '#1e1e1e' : '#fff', color: darkMode ? '#eee' : '#000' }}
        >
            <h2>Strudel Demo</h2>
            <main className="row">
                <EditorPanel text={text} setText={setText} />
                <ControlPanel
                    onPlay={handlePlay}
                    onStop={handleStop}
                    onProc={handleProc}
                    onProcPlay={handleProcPlay}
                    volume={volume}
                    onVolumeChange={handleVolumeChange}
                    preset={preset}
                    onPresetChange={handlePresetChange}
                    isHushed={isHushed}
                    onHushToggle={setIsHushed}
                    onRandomPreset={handleRandomPreset}
                    darkMode={darkMode}
                    onThemeToggle={setDarkMode}
                    onPlaySound={handleDJPad}
                    onStopSinglePad={handleStopSinglePad}
                    activePads={activePads}
                />
            </main>
            <div className="row mt-3">
                <div className="col-md-8">
                    <div id="editor" />
                 
                    {/* Replace piano roll with Event Frequency Bar Chart */}
                    {<br/> }
                    <EventFrequencyChart logs={logs} width={800} height={300} />
                    {/* D3 log viewer */}
                    <D3LogViewer logs={logs} />
                </div>
            </div>
        </div>
    );
}
