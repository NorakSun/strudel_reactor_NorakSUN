import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { initAudioOnFirstClick, webaudioOutput, registerSynthSounds, getAudioContext } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { registerSoundfonts } from '@strudel/soundfonts';
import console_monkey_patch from '../utils/console-monkey-patch';
import { soulful_tune, melody_tune, dance_monkey_tune } from '../utils/tunes';

export const TUNES = { soulful_tune, melody_tune, dance_monkey_tune };

export default function useStrudelPlayer(darkModeInitial = false) {
    const [text, setText] = useState(soulful_tune);
    const [preset, setPreset] = useState("soulful_tune");
    const [volume, setVolume] = useState(0.7);
    const [isPlayingTune, setIsPlayingTune] = useState(false);
    const [isHushed, setIsHushed] = useState(false);
    const [darkMode, setDarkMode] = useState(darkModeInitial);
    const [activePads, setActivePads] = useState([]);

    const hasRun = useRef(false);
    const globalEditor = useRef(null);

    // --- Initialize StrudelMirror once ---
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        console_monkey_patch();

        globalEditor.current = new StrudelMirror({
            defaultOutput: webaudioOutput,
            getTime: () => getAudioContext().currentTime,
            transpiler,
            root: document.getElementById('editor'),
            theme: darkMode ? 'darcula' : 'light',
            lineNumbers: true,
            tabSize: 2,
            lineWrapping: true,
            autoCloseBrackets: true,
            styleActiveLine: true,
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
        globalEditor.current.setCode(initText);
        setText(initText);

        window.emitD3?.({ event: "init", message: "Strudel initialized" });
    }, [darkMode, volume]);

    // --- Utility: Add volume to tune ---
    const addVolumeToTune = (tune, vol) => {
        const safeVol = Math.max(0, vol);
        return tune.includes("const volume")
            ? tune.replace(/const volume = [0-9.]+/, `const volume = ${safeVol}`)
            : `const volume = ${safeVol}\n${tune}`;
    };

    // --- Core playback function ---
    const playTune = (code) => {
        if (!globalEditor.current || isHushed) return; // Block if HUSH
        initAudioOnFirstClick();
        globalEditor.current.stop();
        setIsPlayingTune(true);
        globalEditor.current.setCode(code);
        globalEditor.current.evaluate();
    };

    // --- HUSH effect: stop everything once ---
    useEffect(() => {
        // Triggered when hush toggled
        if (isHushed) {
            // Stop global editor
            globalEditor.current?.stop();
            setIsPlayingTune(false);

            // Stop DJ pads
            activePads.forEach(pad => {
                pad.audio.pause();
                pad.audio.currentTime = 0;
            });
            setActivePads([]);

            // Emit HUSH ON
            window.emitD3?.({ event: "HUSH", hush: true, time: new Date().toLocaleTimeString() });
        } else {
            // Emit HUSH OFF
            window.emitD3?.({ event: "HUSH", hush: false, time: new Date().toLocaleTimeString() });
        }
    }, [isHushed]);

    // --- Playback controls ---
    const handlePlay = () => {
        if (isHushed) return; // Clickable but blocked
        const codeWithVol = addVolumeToTune(text, volume);
        setText(codeWithVol);
        setIsPlayingTune(true);
        playTune(codeWithVol);
        window.emitD3?.({ event: "play", preset, time: new Date().toLocaleTimeString() });
    };

    const handleStop = () => {
        globalEditor.current?.stop();
        setIsPlayingTune(false);
        window.emitD3?.({ event: "stop", time: new Date().toLocaleTimeString() });
    };

    const handleProc = () => {
        if (isHushed) return;
        globalEditor.current?.setCode(text);
        window.emitD3?.({ event: "preprocess", preset, time: new Date().toLocaleTimeString() });
    };

    const handleProcPlay = () => {
        if (isHushed) return;
        playTune(text);
        window.emitD3?.({ event: "preprocess_play", preset, time: new Date().toLocaleTimeString() });
    };

    const handleVolumeChange = (v) => {
        setVolume(v);
        const codeWithVol = addVolumeToTune(text, v);
        setText(codeWithVol);
        if (!isHushed) playTune(codeWithVol);
        window.emitD3?.({ event: "volume_change", volume: v, time: new Date().toLocaleTimeString() });
    };

    const handlePresetChange = (p) => {
        const selectedTune = TUNES[p] || soulful_tune;
        const tuneWithVol = addVolumeToTune(selectedTune, volume);
        setPreset(p);
        setText(tuneWithVol);
        
        window.emitD3?.({ event: "preset_change", preset: p, time: new Date().toLocaleTimeString() });
    };

    const handleRandomPreset = () => {
        const keys = Object.keys(TUNES).filter(k => k !== preset);
        if (!keys.length) return;
        const rand = keys[Math.floor(Math.random() * keys.length)];
        const selectedTune = TUNES[rand];
        const tuneWithVol = addVolumeToTune(selectedTune, volume);
        setPreset(rand);
        setText(tuneWithVol);
        if (!isHushed) playTune(tuneWithVol);
        window.emitD3?.({ event: "random_play", preset: rand, time: new Date().toLocaleTimeString() });
    };

    // --- DJ Pads ---
    const handleDJPad = (soundFile, name) => {
        if (isHushed) return; // Block playback
        const audio = new Audio(soundFile);
        audio.volume = Math.min(1, volume);
        audio.play();
        const id = Date.now();
        setActivePads(prev => [...prev, { id, name, audio }]);
        audio.addEventListener("ended", () => setActivePads(prev => prev.filter(p => p.id !== id)));
        window.emitD3?.({ event: "dj_pad_play", sound: name, time: new Date().toLocaleTimeString() });
    };

    const handleStopSinglePad = (id) => {
        const pad = activePads.find(p => p.id === id);
        if (!pad) return;
        pad.audio.pause();
        pad.audio.currentTime = 0;
        setActivePads(prev => prev.filter(p => p.id !== id));
        window.emitD3?.({ event: "dj_pad_stop", sound: pad.name, time: new Date().toLocaleTimeString() });
    };

    // --- Return all state and handlers ---
    return {
        text, setText,
        preset, setPreset,
        volume, setVolume,
        isPlayingTune,
        isHushed, setIsHushed,
        darkMode, setDarkMode,
        activePads, setActivePads,
        handlePlay, handleStop,
        handleProc, handleProcPlay,
        handleVolumeChange,
        handlePresetChange,
        handleDJPad,
        handleStopSinglePad,
        handleRandomPreset,
        setIsPlayingTune,
        globalEditor,
        addVolumeToTune
    };
}
