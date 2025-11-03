import './App.css';
import React, { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick, webaudioOutput, registerSynthSounds, getAudioContext } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { registerSoundfonts } from '@strudel/soundfonts';
import console_monkey_patch from './utils/console-monkey-patch';
import { melody_tune, stranger_tune, dance_monkey_tune } from './utils/tunes';

import EditorPanel from "./components/EditorPanel";
import ControlPanel from "./components/ControlPanel";
import CanvasViewer from "./components/CanvasViewer";
import D3LogViewer from "./components/D3LogViewer";

let globalEditor = null;

export default function StrudelDemo() {
    const [text, setText] = useState(stranger_tune);
    const [preset, setPreset] = useState("stranger_tune");
    const [isHushed, setIsHushed] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [activeNotes, setActiveNotes] = useState([]);
    const [logs, setLogs] = useState([]);

    const canvasRef = useRef(null);
    const hasRun = useRef(false);

    // D3 logs
    const handleD3Data = (event) => {
        setLogs(prev => [...prev.slice(-50), JSON.stringify(event.detail)]);
    };

    // Initialize StrudelMirror
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        document.addEventListener("d3Data", handleD3Data);
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
            onDraw: (haps, time) => {
                drawPianoroll({ haps, time, ctx, drawTime, fold: 0 });
                setActiveNotes(haps.filter(h => h.velocity > 0));
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

        globalEditor.setCode(stranger_tune);

        return () => {
            document.removeEventListener("d3Data", handleD3Data);
        };
    }, []);

    // Playback
    const handlePlay = () => {
        if (!globalEditor) return;
        if (isHushed) {
            globalEditor.stop();
            console.log("HUSH active, playback ignored");
            return;
        }
        globalEditor.stop();
        globalEditor.setCode(text);
        globalEditor.evaluate();
    };

    const handleStop = () => globalEditor?.stop();

    const handleProc = () => {
        if (!globalEditor) return;
        const replaced = text.replaceAll('<p1_Radio>', isHushed ? '_' : '');
        setText(replaced);
        globalEditor.setCode(replaced);
    };

    const handleProcPlay = () => {
        handleProc();
        handlePlay();
    };

    const handleHushToggle = (hushed) => {
        setIsHushed(hushed);
        if (hushed) globalEditor?.stop();
    };

    // Select preset from dropdown → only update editor (no auto-play)
    const handlePresetChange = (newPreset) => {
        setPreset(newPreset);

        let selectedTune;
        switch (newPreset) {
            case "melody_tune": selectedTune = melody_tune; break;
            case "dance_monkey_tune": selectedTune = dance_monkey_tune; break;
            default: selectedTune = stranger_tune;
        }

        setText(selectedTune);
        globalEditor?.setCode(selectedTune);
    };

    // Random preset → auto-play immediately
    const handleRandomPreset = () => {
        const presets = ["stranger_tune", "melody_tune", "dance_monkey_tune"];
        let random;
        do {
            random = presets[Math.floor(Math.random() * presets.length)];
        } while (random === preset && presets.length > 1);

        setPreset(random);

        let selectedTune;
        switch (random) {
            case "melody_tune": selectedTune = melody_tune; break;
            case "dance_monkey_tune": selectedTune = dance_monkey_tune; break;
            default: selectedTune = stranger_tune;
        }

        setText(selectedTune);
        globalEditor?.stop();
        globalEditor?.setCode(selectedTune);

        if (!isHushed) {
            globalEditor?.evaluate(); // auto-play only for random
        }
    };

    const handleThemeToggle = (mode) => setDarkMode(mode);

    return (
        <div
            className={`container-fluid p-3 ${darkMode ? 'dark-mode' : ''}`}
            style={{
                backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                color: darkMode ? '#eee' : '#000',
                minHeight: '100vh'
            }}
        >
            <h2>🎶 Strudel Demo</h2>

            <main className="row">
                <EditorPanel text={text} setText={setText} />
                <ControlPanel
                    onProc={handleProc}
                    onPlay={handlePlay}
                    onProcPlay={handleProcPlay}
                    onStop={handleStop}
                    preset={preset}
                    onPresetChange={handlePresetChange}
                    isHushed={isHushed}
                    onHushToggle={handleHushToggle}
                    onRandomPreset={handleRandomPreset}
                    darkMode={darkMode}
                    onThemeToggle={handleThemeToggle}
                />
            </main>

            <div className="row mt-3">
                <div className="col-md-8">
                    <div id="editor" />
                    <div id="output" />
                    <CanvasViewer canvasRef={canvasRef} activeNotes={activeNotes} />
                    <D3LogViewer logs={logs} />
                </div>
            </div>
        </div>
    );
}
