import { useEffect, useRef } from 'react';
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import console_monkey_patch from '../utils/console-monkey-patch';

export default function useStrudel(canvasRef, editorRef, onD3Data) {
    const strudelEditor = useRef(null);

    useEffect(() => {
        console_monkey_patch();
        if (onD3Data) document.addEventListener("d3Data", onD3Data);

        const setup = async () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const drawTime = [-2, 2];

            strudelEditor.current = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: editorRef.current,
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx, drawTime, fold: 0 }),
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
        };

        setup();
        return () => {
            if (onD3Data) document.removeEventListener("d3Data", onD3Data);
        };
    }, [onD3Data, canvasRef, editorRef]);

    return strudelEditor;
}