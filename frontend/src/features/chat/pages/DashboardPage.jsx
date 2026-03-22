import React, { useState, useEffect, useRef } from 'react';
import AppShell from '../../../components/layout/AppShell';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';
import { useSocket } from '../../../context/SocketContext';
import toast from 'react-hot-toast';
import './DashboardPage.css';

const DashboardPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  
  const [activeSkills, setActiveSkills] = useState([]);
  const [agentStatus, setAgentStatus] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [lastAiResponse, setLastAiResponse] = useState('');

  const { socket, connected } = useSocket();
  const messagesEndRef = useRef(null);
  const messageIdRef = useRef(0);
  const currentResponseRef = useRef('');
  
  const voiceEnabledRef = useRef(voiceEnabled);
  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  useEffect(() => {
    if (!socket) return;

    const handleChunk = (chunk) => {
      const nextPart = chunk?.content || '';
      setCurrentResponse((prev) => {
        const next = prev + nextPart;
        currentResponseRef.current = next;
        return next;
      });
    };

    const handleDone = (data) => {
      const finalResponse = currentResponseRef.current.trim();
      if (!finalResponse) {
        setIsLoading(false);
        return;
      }

      setMessages((prev) => [...prev, {
        id: ++messageIdRef.current,
        content: finalResponse,
        isAi: true,
        sources: data.sources,
        suggestions: data.followUpSuggestions,
      }]);
      setCurrentResponse('');
      currentResponseRef.current = '';
      setIsLoading(false);

      if (voiceEnabledRef.current) {
        setLastAiResponse(finalResponse);
      }
    };

    const handleError = (data) => {
      currentResponseRef.current = '';
      setIsLoading(false);
      setAgentStatus('');
      
      const errorMessage = data?.message || "An error occurred with the AI service. Please check API keys.";
      toast.error(errorMessage, { 
        duration: 5000, 
        position: 'top-center' 
      });
    };

    const handleSkills = (data) => setActiveSkills(data.skills || []);
    const handleAgent = (data) => setAgentStatus(data.active ? data.message : '');

    socket.on('stream_chunk', handleChunk);
    socket.on('stream_done', handleDone);
    socket.on('error', handleError);
    socket.on('skills_activated', handleSkills);
    socket.on('agent_status', handleAgent);

    return () => {
      socket.off('stream_chunk', handleChunk);
      socket.off('stream_done', handleDone);
      socket.off('error', handleError);
      socket.off('skills_activated', handleSkills);
      socket.off('agent_status', handleAgent);
    };
  }, [socket]);

  const handleSend = (text) => {
    if (!text.trim() || !connected) return;
    const userMessage = { id: ++messageIdRef.current, content: text, isAi: false };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentResponse('');
    currentResponseRef.current = '';

    setActiveSkills([]);
    setAgentStatus('');
    setLastAiResponse('');

    socket.emit('send_message', { content: text, useWebSearch, chatId: 'new' });
  };

  return (
    <AppShell showSidebar={true}>
      <div className="dashboard-container" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
          <button 
            type="button"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              padding: '6px 12px', background: 'var(--clr-surface)', 
              border: '1px solid var(--clr-border)', borderRadius: '20px', 
              fontSize: '13px', color: 'var(--clr-text)', cursor: 'pointer',
              fontFamily: 'var(--f-cotham)',
              transition: 'all 0.2s ease'
            }}
          >
            {voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
          </button>
        </div>
        <div className="dashboard-messages">
          {messages.length === 0 && !currentResponse && !agentStatus && (
            <div className="dashboard-empty">
              <h2 className="dashboard-empty-title">
                What do you want to <em>know?</em>
              </h2>
              <p className="dashboard-empty-desc">
                Ask anything. Search the web. Create. Build. Analyse documents.
              </p>

              <div className="dashboard-suggestions">
                {[
                  'Latest AI research papers 2024',
                  'How does quantum computing work?',
                  'Write me a Python REST API',
                  "Summarize today's top tech news",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(suggestion)}
                    className="dashboard-suggestion-btn"
                  >
                    {suggestion}
                    <span className="dashboard-suggestion-try">
                      Try this prompt {'->'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isAi={msg.isAi} />
          ))}

          {activeSkills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '8px 16px 16px' }}>
              {activeSkills.map((skill, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: '20px', fontSize: '13px', color: 'var(--clr-text)', fontFamily: 'var(--f-cotham)' }}>
                  <span style={{ fontSize: '16px' }}>{skill.icon}</span> <span>{skill.name}</span>
                </div>
              ))}
            </div>
          )}

          {agentStatus && (
            <div style={{ margin: '0 16px 16px', padding: '12px 16px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderLeft: '3px solid var(--clr-accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--clr-text)', fontFamily: 'var(--f-lunchtype)' }}>
              <div style={{ width: '16px', height: '16px', border: '2px solid var(--clr-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              {agentStatus}
            </div>
          )}

          {currentResponse && (
            <MessageBubble
              message={{ content: currentResponse }}
              isAi={true}
              isStreaming={true}
            />
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="dashboard-input-wrapper">
          <ChatInput
            onSend={handleSend}
            isLoading={isLoading}
            useWebSearch={useWebSearch}
            setUseWebSearch={setUseWebSearch}
            textToSpeak={lastAiResponse}
            autoSpeak={voiceEnabled}
          />
        </div>
      </div>
    </AppShell>
  );
};

export default DashboardPage;
