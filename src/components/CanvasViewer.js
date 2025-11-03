import React, { useEffect } from 'react';

export default function CanvasViewer({ canvasRef, activeNotes = [] }) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;

            // 🌈 Gradient background
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#ff9a9e');
            gradient.addColorStop(0.3, '#fad0c4');
            gradient.addColorStop(0.6, '#a1c4fd');
            gradient.addColorStop(1, '#c2e9fb');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // 🎹 Draw colorful notes
            activeNotes.forEach((note, i) => {
                const x = (i * 40) % width;
                const y = height - (note.pitch % height);
                const noteWidth = 35;
                const noteHeight = 20;

                // Color based on note pitch
                const hue = (note.pitch * 10) % 360;
                ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;

                ctx.beginPath();
                ctx.roundRect(x, y - noteHeight, noteWidth, noteHeight, 8);
                ctx.fill();

                // Optional glow effect
                ctx.shadowColor = `hsl(${hue}, 90%, 70%)`;
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // ✨ Gentle overlay for shine
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            ctx.fillRect(0, 0, width, height);
        };

        draw();
    }, [activeNotes]);

    return (
        <canvas
            ref={canvasRef}
            id="roll"
            width="800"
            height="240"
            style={{
                width: '100%',
                height: '240px',
                borderRadius: '12px',
                boxShadow: '0 0 15px rgba(0,0,0,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
            }}
        />
    );
}
