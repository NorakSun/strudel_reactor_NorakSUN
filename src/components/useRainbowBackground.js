import { useEffect, useRef } from "react";

export default function useRainbowBackground({
    isPlayingTune,
    isHushed,
    darkMode,
    appRef,
    globalEditor,
    setIsPlayingTune,
    activePads,
    setActivePads
}) {
    const rainbowInterval = useRef(null);
    const prevHush = useRef(false);

    const generateRainbowColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const hue = (i * 360) / numColors;
            colors.push(`hsl(${hue}, 100%, 50%)`);
        }
        return colors;
    };

    // Stop everything if HUSH activated
    useEffect(() => {
        if (isHushed && !prevHush.current) {
            globalEditor?.current?.stop();
            setIsPlayingTune(false);

            activePads.forEach(pad => {
                pad.audio.pause();
                pad.audio.currentTime = 0;
            });
            setActivePads([]);

            if (appRef.current) {
                appRef.current.style.backgroundColor = darkMode ? '#1e1e1e' : '#fff';
            }

            window.emitD3?.({ event: "hush_activated", time: new Date().toLocaleTimeString() });
        }
        prevHush.current = isHushed;
    }, [isHushed]); // Only run on HUSH change

    // Rainbow effect
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
    }, [isPlayingTune, isHushed, darkMode, appRef]);
}
