import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, User, Bot } from 'lucide-react';
import { askQuestion } from '../services/api';

const ChatBox = ({ transcript }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I have analyzed the video. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await askQuestion(userMessage, transcript);
      setMessages(prev => [...prev, { role: 'assistant', content: response.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error while processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.7s', display: 'flex', flexDirection: 'column', height: '500px' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <MessageSquare size={20} color="var(--accent-color)" />
        Chat with Video
      </h3>
      
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              background: msg.role === 'user' ? 'var(--accent-color)' : 'var(--panel-bg)',
              border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none'
            }}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} color="var(--accent-color)" />}
            </div>
            <div style={{
              background: msg.role === 'user' ? 'var(--accent-color)' : 'rgba(0,0,0,0.2)',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              borderTopRightRadius: msg.role === 'user' ? '0' : '12px',
              borderTopLeftRadius: msg.role === 'assistant' ? '0' : '12px',
              maxWidth: '80%',
              lineHeight: '1.5',
              border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
             <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--panel-bg)', border: '1px solid var(--border-color)' }}>
              <Bot size={16} color="var(--accent-color)" />
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: '12px', borderTopLeftRadius: '0', border: '1px solid var(--border-color)' }}>
              <span className="pulse-text">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Ask a question about the video..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="btn" disabled={isLoading || !input.trim()} style={{ padding: '0.75rem' }}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
