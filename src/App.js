import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useRef, useEffect, useState } from "react";

import EditorPanel from "./components/EditorPanel";
import ControlPanel from "./components/ControlPanel";
import D3LogViewer from "./components/D3LogViewer";
import EventFrequencyChart from "./components/EventFrequencyChart";

import useStrudelPlayer from './hooks/useStrudelPlayer';
import useRainbowBackground from './components/useRainbowBackground';
import SettingsManager from './components/SettingsManager';

export default function App() {
    const appRef = useRef(null);

    const {
        text, setText,
        preset, setPreset,
        volume, setVolume,
        isPlayingTune, isHushed, setIsHushed,
        darkMode, setDarkMode,
        activePads, setActivePads,
        handlePlay, handleStop,
        handleProc, handleProcPlay,
        handleVolumeChange, handlePresetChange,
        handleDJPad, handleStopSinglePad, handleRandomPreset,
        setIsPlayingTune,
        globalEditor,
        addVolumeToTune,
        TUNES
    } = useStrudelPlayer(false);

    const { saveSettings, loadSettings } = SettingsManager({
        volume,
        preset,
        darkMode,
        setVolume,
        setPreset,
        setDarkMode,
        setIsPlayingTune,
        globalEditor,
        activePads,
        setActivePads,
        addVolumeToTune,
        TUNES, setText
    });

    // Rainbow background + HUSH effect
    useRainbowBackground({
        isPlayingTune,
        isHushed,
        darkMode,
        appRef,
        globalEditor,
        setIsPlayingTune,
        activePads,
        setActivePads
    });

    const [logs, setLogs] = useState([]);

    // Setup emitD3
    useEffect(() => {
        if (!window.emitD3) {
            window.emitD3 = (data) => document.dispatchEvent(new CustomEvent("d3Data", { detail: data }));
        }
    }, []);

    // Log D3 events
    useEffect(() => {
        const handleD3Data = (event) => {
            try {
                const safeString = JSON.stringify({
                    ...event.detail,
                    hush: isHushed // attach current hush state
                }, (key, value) => {
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
    }, [isHushed]);

    return (
        <div
            ref={appRef}
            className={`container-fluid p-3 ${darkMode ? 'dark-mode' : ''}`}
            style={{
                minHeight: '100vh',
                backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                color: darkMode ? '#eee' : '#000'
            }}
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
                    onRandomPreset={handleRandomPreset}
                    onHushToggle={(val) => {
                        setIsHushed(val);
                        window.emitD3?.({
                            event: val ? "HUSH ON" : "HUSH OFF",
                            time: new Date().toLocaleTimeString()
                        });
                    }}

                    onPlaySound={handleDJPad}
                    onStopSinglePad={handleStopSinglePad}
                    activePads={activePads}
                    darkMode={darkMode}
                    onThemeToggle={setDarkMode}
                    onSaveSettings={saveSettings}
                    onLoadSettings={loadSettings}
                />
            </main>
            <div className="row mt-3">
                <div className="col-md-8">
                    <div id="editor" />
                    <br />
                    <EventFrequencyChart logs={logs} width={800} height={300} />
                    <D3LogViewer logs={logs} />
                </div>
            </div>
        </div>
    );
}
