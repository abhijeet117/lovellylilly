import React, { useState, useEffect, useRef } from 'react';
import AppShell from '../../../components/layout/AppShell';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';
import { useSocket } from '../../../context/SocketContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');

  const { socket, connected } = useSocket();
  const messagesEndRef = useRef(null);
  const messageIdRef = useRef(0);
  const currentResponseRef = useRef('');

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
    };

    const handleError = () => {
      currentResponseRef.current = '';
      setIsLoading(false);
    };

    socket.on('stream_chunk', handleChunk);
    socket.on('stream_done', handleDone);
    socket.on('error', handleError);

    return () => {
      socket.off('stream_chunk', handleChunk);
      socket.off('stream_done', handleDone);
      socket.off('error', handleError);
    };
  }, [socket]);

  const handleSend = (text) => {
    if (!text.trim() || !connected) return;
    const userMessage = { id: ++messageIdRef.current, content: text, isAi: false };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentResponse('');
    currentResponseRef.current = '';
    socket.emit('send_message', { content: text, useWebSearch, chatId: 'new' });
  };

  return (
    <AppShell showSidebar={true}>
      <div className="dashboard-container">
        <div className="dashboard-messages">
          {messages.length === 0 && !currentResponse && (
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
          />
        </div>
      </div>
    </AppShell>
  );
};

export default DashboardPage;
