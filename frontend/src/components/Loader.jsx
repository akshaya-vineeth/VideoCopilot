import React from 'react';

const Loader = () => {
  return (
    <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', textAlign: 'center' }}>
      <style>
        {`
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid var(--border-color);
            border-top-color: var(--accent-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1.5rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .pulse-text {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            color: var(--text-secondary);
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
          }
        `}
      </style>
      <div className="spinner"></div>
      <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Processing Video</h3>
      <p className="pulse-text">Extracting audio, transcribing, and generating insights...</p>
      <p className="pulse-text" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>This may take a few minutes depending on the video length.</p>
    </div>
  );
};

export default Loader;
