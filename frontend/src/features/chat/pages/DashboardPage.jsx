import React, { useState, useEffect, useRef } from 'react';
import AppShell from '../../../components/layout/AppShell';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';
import { useSocket } from '../../../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import './DashboardPage.css';

const DashboardPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');

  const { socket, connected } = useSocket();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  useEffect(() => {
    if (!socket) return;

    socket.on('stream_chunk', (chunk) => {
      setCurrentResponse(prev => prev + chunk.content);
    });

    socket.on('stream_done', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: currentResponse,
        isAi: true,
        sources: data.sources,
        suggestions: data.followUpSuggestions
      }]);
      setCurrentResponse('');
      setIsLoading(false);
    });

    socket.on('error', (err) => {
      setIsLoading(false);
    });

    return () => {
      socket.off('stream_chunk');
      socket.off('stream_done');
      socket.off('error');
    };
  }, [socket, currentResponse]);

  const handleSend = (text) => {
    if (!text.trim() || !connected) return;
    const userMessage = { id: Date.now(), content: text, isAi: false };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentResponse('');
    socket.emit('send_message', { content: text, useWebSearch, chatId: 'new' });
  };

  return (
    <AppShell showSidebar={true}>
      <div className="dashboard-container">
        {/* Messages */}
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
                  "Latest AI research papers 2024",
                  "How does quantum computing work?",
                  "Write me a Python REST API",
                  "Summarize today's top tech news"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(suggestion)}
                    className="dashboard-suggestion-btn"
                  >
                    {suggestion}
                    <span className="dashboard-suggestion-try">
                      Try this prompt →
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

        {/* Input Bar */}
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
