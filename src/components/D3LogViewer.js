import React from 'react';

export default function D3LogViewer({ logs }) {
    return (
        <div className="log-viewer mt-3 p-2" style={{
            maxHeight: '200px', overflowY: 'auto',
            background: '#1e1e1e', color: '#eee', borderRadius: 8
        }}>
            <h6 style={{ marginTop: 0 }}>D3 Data Log</h6>
            <pre style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>{logs.join('\n')}</pre>
        </div>
    );
}