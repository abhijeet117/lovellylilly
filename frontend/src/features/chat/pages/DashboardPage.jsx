import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';
import FollowUpChips from '../components/FollowUpChips';
import VoiceModeOverlay from '../../../features/voice/components/VoiceModeOverlay';
import QueryModeBadge from '../components/QueryModeBadge';
import ThemeSwitcher from '../../../components/ui/ThemeSwitcher';
import { useSocket } from '../../../context/SocketContext';
import { useAuth } from '../../auth/hooks/useAuth';
import { getConversations, getMessages, deleteConversation, renameConversation, toggleSaveConversation } from '../services/chat.api';
import { getLenis } from '../../../lib/animations/lenis';
import toast from 'react-hot-toast';
import {
  Bookmark, BookmarkCheck, Pencil, Check, X, Download, ExternalLink,
  Globe, Mic, MessageSquare, Image, Video, FileText, BarChart3, Settings,
  Plus, Search, LogOut,
} from 'lucide-react';
import './DashboardPage.css';

// ── Nav items ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Chat', path: '/dashboard', icon: MessageSquare },
  { label: 'Image Studio', path: '/studio/image', icon: Image },
  { label: 'Video Studio', path: '/studio/video', icon: Video },
  { label: 'Website Builder', path: '/studio/website', icon: Globe },
  { label: 'Documents', path: '/documents', icon: FileText },
  { label: 'SEO Analyzer', path: '/seo', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

// ── Inline media renderers ─────────────────────────────────────────────────────
const ImageResult = ({ imageUrl, prompt }) => (
  <div className="media-card">
    <img src={imageUrl} alt={prompt} loading="lazy" />
    <div className="media-card-footer">
      <span style={{ fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prompt}</span>
      <a href={imageUrl} download target="_blank" rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'var(--clr-card)', border: '1px solid var(--clr-border)', borderRadius: '4px', fontSize: '11px', color: 'var(--clr-text)', fontFamily: 'var(--f-lunchtype)', textDecoration: 'none', flexShrink: 0 }}>
        <Download size={12} /> Save
      </a>
    </div>
  </div>
);

const VideoResult = ({ videoUrl, operationId, status, prompt }) => (
  <div className="media-card">
    {videoUrl ? (
      <video src={videoUrl} controls style={{ maxHeight: '320px' }} />
    ) : (
      <div style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--clr-muted)', background: 'var(--clr-bg)' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid var(--clr-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '12px', fontFamily: 'var(--f-lunchtype)' }}>
          {status === 'pending' || status === 'processing' ? 'Video processing… check Video Studio for status.' : 'Generation complete — visit Video Studio to view.'}
        </span>
      </div>
    )}
    <div className="media-card-footer">
      <span style={{ fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prompt}</span>
      <a href="/studio/video" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'var(--clr-card)', border: '1px solid var(--clr-border)', borderRadius: '4px', fontSize: '11px', color: 'var(--clr-text)', fontFamily: 'var(--f-lunchtype)', textDecoration: 'none', flexShrink: 0 }}>
        <ExternalLink size={12} /> Studio
      </a>
    </div>
  </div>
);

const WebsiteResult = ({ fullHtml, title, prompt }) => {
  const [showPreview, setShowPreview] = useState(false);
  return (
    <div className="media-card" style={{ maxWidth: '600px' }}>
      {showPreview ? (
        <iframe srcDoc={fullHtml} title={title} sandbox="allow-scripts allow-same-origin"
          style={{ width: '100%', height: '400px', border: 'none', display: 'block', background: '#fff' }} />
      ) : (
        <div style={{ height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'var(--clr-bg)', cursor: 'pointer' }} onClick={() => setShowPreview(true)}>
          <Globe size={32} style={{ color: 'var(--clr-accent)', opacity: 0.7 }} />
          <p style={{ fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>Click to preview: <strong style={{ color: 'var(--clr-text)' }}>{title}</strong></p>
        </div>
      )}
      <div className="media-card-footer">
        <span style={{ fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button onClick={() => setShowPreview(!showPreview)}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'var(--clr-card)', border: '1px solid var(--clr-border)', borderRadius: '4px', fontSize: '11px', color: 'var(--clr-text)', fontFamily: 'var(--f-lunchtype)', cursor: 'pointer' }}>
            {showPreview ? 'Hide' : 'Preview'}
          </button>
          <button onClick={() => {
            const blob = new Blob([fullHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `${title.replace(/\s+/g, '-')}.html`; a.click();
            URL.revokeObjectURL(url);
          }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'var(--clr-card)', border: '1px solid var(--clr-border)', borderRadius: '4px', fontSize: '11px', color: 'var(--clr-text)', fontFamily: 'var(--f-lunchtype)', cursor: 'pointer' }}>
            <Download size={12} /> Export
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Chat history item ──────────────────────────────────────────────────────────
const ChatHistoryItem = ({ chat, isActive, onSelect, onDelete, onRename, onToggleSave }) => {
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title || 'Untitled');
  const inputRef = useRef(null);

  useEffect(() => { if (renaming) inputRef.current?.focus(); }, [renaming]);

  const submitRename = async () => {
    if (newTitle.trim() && newTitle.trim() !== chat.title) {
      await onRename(chat._id, newTitle.trim());
    }
    setRenaming(false);
  };

  return (
    <div onClick={() => !renaming && onSelect(chat._id)}
      className={`chat-history-item ${isActive ? 'active' : ''}`}>
      {renaming ? (
        <input ref={inputRef} className="chat-rename-input" value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submitRename(); if (e.key === 'Escape') setRenaming(false); }}
          onClick={(e) => e.stopPropagation()} />
      ) : (
        <span className="chat-history-title">{chat.title || 'Untitled'}</span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
        {renaming ? (
          <>
            <button onClick={(e) => { e.stopPropagation(); submitRename(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-success)', padding: '2px' }}><Check size={12} /></button>
            <button onClick={(e) => { e.stopPropagation(); setRenaming(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-muted)', padding: '2px' }}><X size={12} /></button>
          </>
        ) : (
          <>
            <button onClick={(e) => { e.stopPropagation(); onToggleSave(chat._id, chat.isSaved); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: chat.isSaved ? 'var(--clr-accent)' : 'var(--clr-muted)', padding: '2px', opacity: 0, transition: 'opacity 0.15s' }}
              className="chat-history-action-btn">
              {chat.isSaved ? <BookmarkCheck size={11} /> : <Bookmark size={11} />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); setRenaming(true); setNewTitle(chat.title || ''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-muted)', padding: '2px', opacity: 0, transition: 'opacity 0.15s' }}
              className="chat-history-action-btn">
              <Pencil size={11} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(chat._id, e); }}
              className="chat-history-delete">×</button>
          </>
        )}
      </div>
    </div>
  );
};

// ── Main DashboardPage ──────────────────────────────────────────────────────────
const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');

  const [activeSkills, setActiveSkills] = useState([]);
  const [agentStatus, setAgentStatus] = useState('');
  const [queryMode, setQueryMode] = useState(null);
  const [messageStatus, setMessageStatus] = useState('');
  const [liveSources, setLiveSources] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [lastAiResponse, setLastAiResponse] = useState('');
  const [voiceOverlayOpen, setVoiceOverlayOpen] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatSearch, setChatSearch] = useState('');

  const { socket, connected } = useSocket();
  const messagesEndRef = useRef(null);
  const messageIdRef = useRef(0);
  const currentResponseRef = useRef('');
  const voiceEnabledRef = useRef(voiceEnabled);
  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);

  // Stop Lenis smooth scroll on dashboard — we manage scroll ourselves
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.stop();
    // Also prevent body from scrolling while on dashboard
    document.body.style.overflow = 'hidden';
    return () => {
      const l = getLenis();
      if (l) l.start();
      document.body.style.overflow = '';
    };
  }, []);

  // Load conversations
  useEffect(() => {
    getConversations()
      .then((res) => setConversations(res.data?.chats || []))
      .catch(() => {});
  }, []);

  const loadChat = useCallback(async (chatId) => {
    if (!chatId || chatId === currentChatId) return;
    try {
      const res = await getMessages(chatId);
      const msgs = (res.data?.messages || []).map((m, i) => ({
        id: i + 1,
        content: m.content,
        isAi: m.role === 'assistant',
        sources: m.sources || [],
        suggestions: m.followUpSuggestions || [],
      }));
      messageIdRef.current = msgs.length;
      setMessages(msgs);
      setCurrentChatId(chatId);
      setCurrentResponse('');
      currentResponseRef.current = '';
    } catch {
      toast.error('Failed to load conversation');
    }
  }, [currentChatId]);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setCurrentChatId(null);
    setCurrentResponse('');
    currentResponseRef.current = '';
    messageIdRef.current = 0;
    setActiveSkills([]);
    setAgentStatus('');
  }, []);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages, currentResponse]);

  // Socket events
  useEffect(() => {
    if (!socket) return;

    const handleChunk = (chunk) => {
      const next = chunk?.content || '';
      setCurrentResponse((prev) => {
        const updated = prev + next;
        currentResponseRef.current = updated;
        return updated;
      });
    };

    const handleDone = (data) => {
      const finalResponse = currentResponseRef.current.trim();

      if (data.mode === 'image' && data.imageUrl) {
        setMessages(prev => [...prev, {
          id: ++messageIdRef.current, isAi: true,
          content: `Generated image for: "${data.chatId}"`,
          mediaType: 'image', imageUrl: data.imageUrl, sources: [], suggestions: [],
        }]);
        setCurrentResponse(''); currentResponseRef.current = ''; setIsLoading(false);
        if (data.chatId) { setCurrentChatId(data.chatId); getConversations().then(r => setConversations(r.data?.chats || [])).catch(() => {}); }
        return;
      }

      if (data.mode === 'video') {
        setMessages(prev => [...prev, {
          id: ++messageIdRef.current, isAi: true, content: '', mediaType: 'video',
          videoUrl: data.videoUrl || null, operationId: data.operationId, status: data.status || 'pending', sources: [], suggestions: [],
        }]);
        setCurrentResponse(''); currentResponseRef.current = ''; setIsLoading(false);
        if (data.chatId) { setCurrentChatId(data.chatId); getConversations().then(r => setConversations(r.data?.chats || [])).catch(() => {}); }
        return;
      }

      if (data.mode === 'website' && data.fullHtml) {
        setMessages(prev => [...prev, {
          id: ++messageIdRef.current, isAi: true, content: '', mediaType: 'website',
          fullHtml: data.fullHtml, websiteTitle: data.title || 'Generated Website', sources: [], suggestions: [],
        }]);
        setCurrentResponse(''); currentResponseRef.current = ''; setIsLoading(false);
        if (data.chatId) { setCurrentChatId(data.chatId); getConversations().then(r => setConversations(r.data?.chats || [])).catch(() => {}); }
        return;
      }

      if (!finalResponse) { setIsLoading(false); return; }

      setMessages(prev => [...prev, {
        id: ++messageIdRef.current, content: finalResponse, isAi: true,
        sources: data.sources || [], suggestions: data.followUpSuggestions || [],
      }]);
      setCurrentResponse(''); currentResponseRef.current = ''; setIsLoading(false);

      if (data.chatId) {
        setCurrentChatId(data.chatId);
        getConversations().then(r => setConversations(r.data?.chats || [])).catch(() => {});
      }
      if (voiceEnabledRef.current && finalResponse) setLastAiResponse(finalResponse);
    };

    const handleError = (data) => {
      currentResponseRef.current = ''; setCurrentResponse(''); setIsLoading(false); setAgentStatus('');
      toast.error(data?.message || 'An error occurred', { duration: 5000, position: 'top-center' });
    };

    const handleSkills = (data) => setActiveSkills(data.skills || []);
    const handleAgent = (data) => setAgentStatus(data.active ? data.message : '');
    const handleQueryMode = (data) => setQueryMode(data.mode || null);
    const handleSources = (data) => setLiveSources(data.sources || []);
    const handleMessageStatus = (data) => {
      const labels = { detecting_mode: '🔍 Detecting mode…', searching_web: '🌐 Searching the web…', generating: '✨ Generating response…' };
      setMessageStatus(labels[data.status] || '');
    };

    socket.on('stream_chunk', handleChunk);
    socket.on('stream_done', handleDone);
    socket.on('error', handleError);
    socket.on('skills_activated', handleSkills);
    socket.on('agent_status', handleAgent);
    socket.on('query_mode', handleQueryMode);
    socket.on('sources', handleSources);
    socket.on('message_status', handleMessageStatus);

    return () => {
      socket.off('stream_chunk', handleChunk);
      socket.off('stream_done', handleDone);
      socket.off('error', handleError);
      socket.off('skills_activated', handleSkills);
      socket.off('agent_status', handleAgent);
      socket.off('query_mode', handleQueryMode);
      socket.off('sources', handleSources);
      socket.off('message_status', handleMessageStatus);
    };
  }, [socket]);

  const handleSend = useCallback((text, documentId = null) => {
    if (!text.trim() || !connected) return;
    const userMessage = { id: ++messageIdRef.current, content: text, isAi: false };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentResponse(''); currentResponseRef.current = '';
    setActiveSkills([]); setAgentStatus(''); setQueryMode(null);
    setMessageStatus(''); setLiveSources([]); setLastAiResponse('');
    const payload = { content: text, useWebSearch, chatId: currentChatId || 'new' };
    if (documentId) payload.documentId = documentId;
    socket.emit('send_message', payload);
  }, [connected, socket, useWebSearch, currentChatId]);

  const handleDeleteChat = async (chatId, e) => {
    e?.stopPropagation();
    try {
      await deleteConversation(chatId);
      setConversations(prev => prev.filter(c => c._id !== chatId));
      if (currentChatId === chatId) startNewChat();
    } catch { toast.error('Failed to delete conversation'); }
  };

  const handleRenameChat = async (chatId, newTitle) => {
    try {
      await renameConversation(chatId, newTitle);
      setConversations(prev => prev.map(c => c._id === chatId ? { ...c, title: newTitle } : c));
    } catch { toast.error('Failed to rename'); }
  };

  const handleToggleSave = async (chatId, isSaved) => {
    try {
      await toggleSaveConversation(chatId);
      setConversations(prev => prev.map(c => c._id === chatId ? { ...c, isSaved: !isSaved } : c));
      toast.success(isSaved ? 'Bookmark removed' : 'Conversation bookmarked');
    } catch { toast.error('Failed to update bookmark'); }
  };

  const filteredConversations = chatSearch.trim()
    ? conversations.filter(c => (c.title || '').toLowerCase().includes(chatSearch.toLowerCase()))
    : conversations;

  const renderMessage = (msg) => {
    if (msg.mediaType === 'image') {
      return (
        <div key={msg.id} style={{ display: 'flex', gap: '14px', maxWidth: '860px', margin: '0 auto', width: '100%' }}>
          <div className="ai-avatar">LL</div>
          <div style={{ flex: 1 }}><ImageResult imageUrl={msg.imageUrl} prompt={msg.content} /></div>
        </div>
      );
    }
    if (msg.mediaType === 'video') {
      return (
        <div key={msg.id} style={{ display: 'flex', gap: '14px', maxWidth: '860px', margin: '0 auto', width: '100%' }}>
          <div className="ai-avatar">LL</div>
          <div style={{ flex: 1 }}><VideoResult videoUrl={msg.videoUrl} operationId={msg.operationId} status={msg.status} prompt="Video generation" /></div>
        </div>
      );
    }
    if (msg.mediaType === 'website') {
      return (
        <div key={msg.id} style={{ display: 'flex', gap: '14px', maxWidth: '860px', margin: '0 auto', width: '100%' }}>
          <div className="ai-avatar">LL</div>
          <div style={{ flex: 1 }}><WebsiteResult fullHtml={msg.fullHtml} title={msg.websiteTitle} prompt="Website" /></div>
        </div>
      );
    }
    return (
      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
        <MessageBubble message={msg} isAi={msg.isAi} />
        {msg.isAi && msg.suggestions?.length > 0 && (
          <div style={{ maxWidth: '860px', margin: '0 auto', width: '100%', paddingLeft: '46px' }}>
            <FollowUpChips suggestions={msg.suggestions} onSelect={handleSend} />
          </div>
        )}
        {msg.isAi && msg.sources?.length > 0 && (
          <div style={{ maxWidth: '860px', margin: '4px auto 0', width: '100%', paddingLeft: '46px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {msg.sources.slice(0, 4).map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: '4px', fontSize: '11px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)', textDecoration: 'none', letterSpacing: '0.3px' }}>
                  <img src={s.favicon} alt="" style={{ width: '12px', height: '12px', borderRadius: '2px' }} />
                  {s.domain}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="db-shell">

      {/* ── Sidebar 1: Navigation ─────────────────────────────────────────── */}
      <aside className="db-nav-sidebar">
        {/* Logo */}
        <div className="db-nav-logo" onClick={() => navigate('/')}>
          Lovelly<em>Lilly</em>
        </div>

        {/* Nav items */}
        <nav className="db-nav-items">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`db-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Bottom: theme + user */}
        <div className="db-nav-bottom">
          <div style={{ marginBottom: '8px' }}>
            <p style={{ fontSize: '10px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Theme</p>
            <ThemeSwitcher />
          </div>
          {user && (
            <div className="db-nav-user" onClick={() => navigate('/settings')}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div className="db-nav-avatar">
                  {(user.name || user.email || 'U').slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="db-nav-username">
                {user.name || user.email?.split('@')[0] || 'Account'}
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* ── Sidebar 2: Conversations ──────────────────────────────────────── */}
      <aside className="db-conv-sidebar" data-lenis-prevent>
        {/* Header */}
        <div className="db-conv-header">
          <span className="db-conv-title">Conversations</span>
          <button onClick={startNewChat} className="db-new-chat-btn" title="New chat">
            <Plus size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="db-conv-search">
          <Search size={13} style={{ color: 'var(--clr-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search chats…"
            value={chatSearch}
            onChange={(e) => setChatSearch(e.target.value)}
            className="db-conv-search-input"
          />
        </div>

        {/* Bookmarked */}
        {filteredConversations.some(c => c.isSaved) && (
          <div>
            <p className="db-conv-section-label">Bookmarked</p>
            {filteredConversations.filter(c => c.isSaved).map(chat => (
              <ChatHistoryItem key={chat._id} chat={chat} isActive={currentChatId === chat._id}
                onSelect={loadChat} onDelete={handleDeleteChat} onRename={handleRenameChat} onToggleSave={handleToggleSave} />
            ))}
            <div style={{ height: '1px', background: 'var(--clr-border)', margin: '6px 12px' }} />
          </div>
        )}

        <p className="db-conv-section-label">Recent</p>
        <div className="db-conv-list">
          {filteredConversations.filter(c => !c.isSaved).map(chat => (
            <ChatHistoryItem key={chat._id} chat={chat} isActive={currentChatId === chat._id}
              onSelect={loadChat} onDelete={handleDeleteChat} onRename={handleRenameChat} onToggleSave={handleToggleSave} />
          ))}
          {filteredConversations.length === 0 && (
            <p className="chat-history-empty">
              {chatSearch ? 'No matching chats' : 'No conversations yet'}
            </p>
          )}
        </div>
      </aside>

      {/* ── Main Chat Area ────────────────────────────────────────────────── */}
      <main className="db-main">
        {/* Top-right controls */}
        <div className="db-main-topbar">
          <button type="button" onClick={() => setVoiceEnabled(!voiceEnabled)} className={`db-voice-toggle ${voiceEnabled ? 'active' : ''}`}>
            {voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
          </button>
          <button type="button" onClick={() => setVoiceOverlayOpen(true)} className="db-mic-btn" title="Voice input mode">
            <Mic size={15} />
          </button>
        </div>

        <VoiceModeOverlay isOpen={voiceOverlayOpen} onClose={() => setVoiceOverlayOpen(false)} />

        {/* Messages */}
        <div className="dashboard-messages" data-lenis-prevent>
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
                  'Latest AI research papers 2025',
                  'How does quantum computing work?',
                  'Write me a Python REST API',
                  '/seo https://example.com',
                ].map((suggestion, i) => (
                  <button key={i} onClick={() => handleSend(suggestion)} className="dashboard-suggestion-btn">
                    {suggestion}
                    <span className="dashboard-suggestion-try">Try this prompt {'→'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(renderMessage)}

          {/* Active skills */}
          {activeSkills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '8px 16px' }}>
              {activeSkills.map((skill, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: '20px', fontSize: '13px', color: 'var(--clr-text)', fontFamily: 'var(--f-cotham)' }}>
                  <span style={{ fontSize: '16px' }}>{skill.icon}</span> <span>{skill.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Agent status */}
          {agentStatus && (
            <div style={{ margin: '0 16px', padding: '12px 16px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderLeft: '3px solid var(--clr-accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--clr-text)', fontFamily: 'var(--f-lunchtype)' }}>
              <div style={{ width: '16px', height: '16px', border: '2px solid var(--clr-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
              {agentStatus}
            </div>
          )}

          {/* Query mode badge */}
          {isLoading && queryMode && (
            <div style={{ maxWidth: '860px', margin: '0 auto', width: '100%', paddingLeft: '46px' }}>
              <QueryModeBadge mode={queryMode} />
            </div>
          )}

          {/* Live sources */}
          {isLoading && liveSources.length > 0 && (
            <div style={{ maxWidth: '860px', margin: '4px auto 0', width: '100%', paddingLeft: '46px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {liveSources.slice(0, 5).map((src, i) => {
                const domain = (() => { try { return new URL(src.url || src).hostname.replace('www.', ''); } catch { return 'source'; } })();
                return (
                  <a key={i} href={src.url || src} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: '12px', fontSize: '11px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', textDecoration: 'none' }}>
                    <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=12`} width={12} height={12} alt="" />
                    {domain}
                  </a>
                );
              })}
            </div>
          )}

          {/* Streaming response */}
          {currentResponse && (
            <MessageBubble message={{ content: currentResponse }} isAi={true} isStreaming={true} />
          )}

          {/* Loading dots */}
          {isLoading && !currentResponse && !agentStatus && (
            <div style={{ maxWidth: '860px', margin: '0 auto', width: '100%', display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div className="ai-avatar">LL</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--clr-accent)', animation: 'pulse 1.2s infinite 0s' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--clr-accent)', animation: 'pulse 1.2s infinite 0.2s' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--clr-accent)', animation: 'pulse 1.2s infinite 0.4s' }} />
                </div>
                {messageStatus && (
                  <span style={{ fontSize: '11px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', animation: 'fadeIn 0.3s ease' }}>
                    {messageStatus}
                  </span>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
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
      </main>
    </div>
  );
};

export default DashboardPage;
