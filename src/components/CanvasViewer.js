import React, { useEffect } from 'react';
import { pianoroll } from '@strudel/draw';

export default function CanvasViewer({ canvasRef, activeNotes = [] }) {

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Make canvas pixel-perfect
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#101014');
        bgGrad.addColorStop(1, '#1a1a22');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Draw the piano roll if there are active notes
        if (activeNotes.length > 0) {
            pianoroll(activeNotes, {
                ctx,
                width,
                height,
                showKeys: true,
                keyColor: '#2c2c34',
                sharpKeyColor: '#0b0b10',
                noteColor: (n) => `hsl(${(n.pitch * 7) % 360}, 80%, 60%)`,
                noteBorderColor: 'rgba(255,255,255,0.3)',
                borderRadius: 5
            });
        } else {
            // Show message if no notes
            ctx.fillStyle = '#fff';
            ctx.font = '16px sans-serif';
            ctx.fillText('Waiting for notes...', 10, 30);
        }
    };

    // Redraw on resize
    useEffect(() => {
        const handleResize = () => draw();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeNotes]);

    // Redraw when activeNotes change
    useEffect(() => {
        draw();
    }, [activeNotes]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: '100%',
                height: '300px',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '10px'
            }}
        />
    );
}
