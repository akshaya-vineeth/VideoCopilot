import React, { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import VideoInput from './components/VideoInput';
import Dashboard from './components/Dashboard';
import ChatBox from './components/ChatBox';
import Loader from './components/Loader';
import { processVideo, uploadVideo } from './services/api';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);

  const handleProcessVideo = async (source, language, isFile = false) => {
    setIsLoading(true);
    setError(null);
    setVideoData(null);
    
    try {
      let data;
      if (isFile) {
        data = await uploadVideo(source, language);
      } else {
        data = await processVideo(source, language);
      }
      setVideoData(data);
    } catch (err) {
      setError(err.message || 'Failed to process video. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="animate-fade-in">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Sparkles color="var(--accent-color)" />
          AI Video Assistant
        </h1>
        <p>Your intelligent companion for video summarization and insights</p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <VideoInput onSubmit={handleProcessVideo} isLoading={isLoading} />
        
        {error && (
          <div className="glass-panel animate-fade-in" style={{ borderColor: 'var(--error-color)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {isLoading && <Loader />}

        {videoData && (
          <div className="grid grid-cols-2 gap-6" style={{ gridTemplateColumns: '1fr' }}>
            <Dashboard data={videoData} />
            <div style={{ marginTop: '2rem' }}>
              <ChatBox transcript={videoData.transcript} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
