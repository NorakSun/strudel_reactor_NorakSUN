export default function SettingsManager({
    volume,
    preset,
    darkMode,
    setVolume,
    setPreset,
    setDarkMode,
    globalEditor,
    activePads,
    setActivePads,
    setIsPlayingTune,
    addVolumeToTune,
    TUNES,
    setText
}) {
    const saveSettings = () => {
        const settings = { volume, preset, darkMode };
        localStorage.setItem("strudelSettings", JSON.stringify(settings));
        alert("Settings saved!");
        window.emitD3?.({ event: "settings_saved", settings, time: new Date().toLocaleTimeString() });
    };

    const loadSettings = () => {
        const saved = localStorage.getItem("strudelSettings");
        if (!saved) return alert("No saved settings!");

        const settings = JSON.parse(saved);

        // Stop current playback
        globalEditor?.current?.stop();
        setIsPlayingTune(false);

        activePads.forEach(pad => {
            pad.audio.pause();
            pad.audio.currentTime = 0;
        });
        setActivePads([]);

        // Restore volume and dark mode
        if (settings.volume !== undefined) setVolume(settings.volume);
        if (settings.darkMode !== undefined) setDarkMode(settings.darkMode);

        // Restore preset and load proper tune
        if (settings.preset && TUNES[settings.preset]) {
            setPreset(settings.preset);
            const tuneWithVol = addVolumeToTune(TUNES[settings.preset], settings.volume ?? volume);
            globalEditor.current.setCode(tuneWithVol);
            setIsPlayingTune(false);
            setText(tuneWithVol); 
            
        }

        alert("Settings loaded!");
        window.emitD3?.({ event: "settings_loaded", settings, time: new Date().toLocaleTimeString() });
    };

    return { saveSettings, loadSettings };
}
