import React from 'react';

export default function CanvasViewer({ canvasRef }) {
    return <canvas ref={canvasRef} id="roll" width="800" height="240" style={{ width: '100%', height: '240px' }} />;