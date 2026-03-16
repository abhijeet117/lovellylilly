import React, { useState, useEffect, useRef } from 'react';
import AppShell from '../../../components/layout/AppShell';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';
import { useSocket } from '../../../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../../components/ui/Logo';

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
      // Handle error
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

    socket.emit('send_message', {
      content: text,
      useWebSearch,
      chatId: 'new', // placeholder
    });
  };

  return (
    <AppShell showSidebar={true}>
      <div className="flex flex-col h-[calc(100vh-60px)]">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide">
          {messages.length === 0 && !currentResponse && (
             <div className="flex flex-col items-center justify-center h-full text-center">
                <Logo size="lg" className="mb-6 opacity-40 grayscale" />
                <h2 className="text-h2 gradient-text mb-4">What do you want to know?</h2>
                <p className="text-text-secondary max-w-[400px]">Ask anything. Search the web. Create. Build. Analyse documents.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-[600px]">
                   {[
                     "Latest AI research papers 2024",
                     "How does quantum computing work?",
                     "Write me a Python REST API",
                     "Summarize today's top tech news"
                   ].map((suggestion, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSend(suggestion)}
                        className="p-4 rounded-lg bg-bg-surface border border-border-subtle text-left text-sm text-text-secondary hover:border-brand-primary hover:text-text-primary transition-all group"
                      >
                         {suggestion}
                         <span className="block mt-2 text-[11px] text-text-muted group-hover:text-brand-primary">Try this prompt &rarr;</span>
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
        <div className="border-t border-border-subtle bg-bg-base/80 backdrop-blur-md">
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
