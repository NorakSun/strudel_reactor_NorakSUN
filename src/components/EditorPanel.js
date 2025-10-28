import React from 'react';

export default function EditorPanel({ text, setText }) {
    return (
        <div className="col-md-8" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <label className="form-label">Text to preprocess:</label>
            <textarea className="form-control" rows="15" value={text}
                onChange={(e) => setText(e.target.value)} />
        </div>
    );
}