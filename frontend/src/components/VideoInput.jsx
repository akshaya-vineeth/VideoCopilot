import React, { useState, useRef } from 'react';
import { Play, Link as LinkIcon, UploadCloud } from 'lucide-react';

const VideoInput = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('english');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUrl('');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUrl('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onSubmit(file, language, true);
    } else if (url.trim()) {
      onSubmit(url.trim(), language, false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
        
        <div style={{
          border: dragActive ? '2px dashed var(--accent-color)' : '2px dashed var(--border-color)',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          backgroundColor: dragActive ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
          cursor: 'pointer'
        }} onClick={() => document.getElementById('file-upload').click()}>
          <UploadCloud size={48} style={{ margin: '0 auto 1rem', color: dragActive ? 'var(--accent-color)' : 'var(--text-secondary)' }} />
          <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 500 }}>
            {file ? file.name : "Drag and drop a video file here"}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            or click to browse
          </p>
          <input 
            id="file-upload" 
            type="file" 
            accept="video/*" 
            style={{ display: 'none' }} 
            onChange={handleFileChange} 
          />
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', position: 'relative' }}>
          <span style={{ backgroundColor: 'var(--bg-color)', padding: '0 10px', position: 'relative', zIndex: 1 }}>OR</span>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid var(--border-color)', zIndex: 0 }}></div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <LinkIcon size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Paste YouTube URL..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (e.target.value) setFile(null);
              }}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          
          <select 
            className="input-field" 
            style={{ width: 'auto' }}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="english">English</option>
            <option value="hinglish">Hinglish</option>
          </select>

          <button type="submit" className="btn" disabled={isLoading || (!url.trim() && !file)}>
            <Play size={20} />
            {isLoading ? 'Processing...' : 'Analyze'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoInput;
