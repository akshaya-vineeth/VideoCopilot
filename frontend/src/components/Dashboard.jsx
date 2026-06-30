import React from 'react';
import { FileText, ListTodo, Key, HelpCircle } from 'lucide-react';

const Dashboard = ({ data }) => {
  if (!data) return null;

  const { title, summary, action_items, key_decisions, open_questions } = data;

  const renderSection = (title, content, Icon, delay) => (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: delay, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', color: 'var(--accent-color)' }}>
        <Icon size={20} />
        {title}
      </h3>
      <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
        {content || "None provided."}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h2>
      </div>
      
      {renderSection("Summary", summary, FileText, "0.3s")}
      
      <div className="grid grid-cols-2 gap-6">
        {renderSection("Action Items", action_items, ListTodo, "0.4s")}
        {renderSection("Key Decisions", key_decisions, Key, "0.5s")}
      </div>
      
      {renderSection("Open Questions", open_questions, HelpCircle, "0.6s")}
    </div>
  );
};

export default Dashboard;
