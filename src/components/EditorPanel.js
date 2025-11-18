import React from 'react';

export default function EditorPanel({ text, setText }) {
    return (
        <div
            className="col-md-8 p-3"
            style={{
                maxHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}
        >
            <label className="form-label fw-bold" style={{ fontSize: '1rem' }}>
                Text to preprocess
            </label>
            <textarea
                className="form-control"
                style={{
                    flex: 1,
                    resize: 'vertical',
                    minHeight: '200px',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.95rem',
                    lineHeight: '1.4',
                    padding: '10px'
                }}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    );
}
