export default function SettingsManager({
    volume, preset, darkMode, setVolume, setPreset, setDarkMode,
    globalEditor, activePads, setActivePads,
    setIsPlayingTune
}) {
    const saveSettings = () => {
        const settings = { volume, preset, darkMode };
        localStorage.setItem("strudelSettings", JSON.stringify(settings));
        window.emitD3?.({ event: "settings_saved", settings, time: new Date().toLocaleTimeString() });
        alert("Settings saved!");
    };

    const loadSettings = () => {
        const saved = localStorage.getItem("strudelSettings");
        if (!saved) return alert("No saved settings!");
        const settings = JSON.parse(saved);

        // Stop playback
        globalEditor?.current?.stop();
        if (setIsPlayingTune) setIsPlayingTune(false);

        // Stop DJ pads
        activePads.forEach(pad => {
            pad.audio.pause();
            pad.audio.currentTime = 0;
        });
        setActivePads([]);

        // Restore values
        if (settings.volume !== undefined) setVolume(settings.volume);
        if (settings.preset !== undefined) setPreset(settings.preset);
        if (settings.darkMode !== undefined) setDarkMode(settings.darkMode);

        // Restore editor code without auto-play
        if (settings.preset && globalEditor?.current) {
            const tuneWithVol = globalEditor.current.addVolumeToTune
                ? globalEditor.current.addVolumeToTune(settings.preset, settings.volume)
                : settings.preset;
            globalEditor.current.setCode(tuneWithVol);
        }

        window.emitD3?.({
            event: "settings_loaded",
            settings,
            time: new Date().toLocaleTimeString()
        });
    };

    return { saveSettings, loadSettings };
}
