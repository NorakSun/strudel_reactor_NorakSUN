import React from 'react';

export default function ControlPanel({ onProc, onPlay, onProcPlay, onStop }) {
    return (
        <div className="col-md-4">
            <button className="btn btn-outline-primary" onClick={onProc}> Preprocess</button>
            <button className="btn btn-outline-primary" onClick={onProcPlay}> Proc $ Play</button>
            <br />
            <button className="btn btn-outline-primary" onClick={onPlay}> Play</button>
            <button className="btn btn-outline-primary" onClick={onStop}>Stop</button>

        </div>
    );
}