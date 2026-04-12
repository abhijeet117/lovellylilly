import React, { useState, useEffect, useRef, useCallback } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { getDocuments, uploadDocument, deleteDocument, chatWithDocument } from '../services/documents.api';
import {
  FileText, Upload, Search, Trash2, FileCode, FileBox,
  MessageSquare, Filter, X, Send, RefreshCw, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const getFileIcon = (type) => {
  if (!type) return <FileBox size={18} style={{ color: 'var(--clr-accent)' }} />;
  if (type.includes('pdf')) return <FileText size={18} style={{ color: 'var(--color-danger)' }} />;
  if (type.includes('sheet') || type.includes('csv')) return <FileCode size={18} style={{ color: 'var(--color-success)' }} />;
  return <FileBox size={18} style={{ color: 'var(--clr-accent)' }} />;
};

const getTypeBadge = (mimeType) => {
  if (!mimeType) return 'FILE';
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('word')) return 'DOCX';
  if (mimeType.includes('sheet')) return 'XLSX';
  if (mimeType.includes('plain')) return 'TXT';
  return 'FILE';
};

const formatBytes = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ── Chat Sidebar ─────────────────────────────────────────────────────────────
const DocChat = ({ doc, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);
    try {
      const res = await chatWithDocument(doc._id, question);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data?.answer || 'No answer received.' }]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Chat failed');
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Failed to get answer. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(440px, 100vw)', background: 'var(--clr-surface)', borderLeft: '1px solid var(--clr-border)', display: 'flex', flexDirection: 'column', zIndex: 'var(--z-modal, 800)' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '15px', color: 'var(--clr-text)', marginBottom: '2px' }}>Chat with Document</h3>
          <p style={{ fontSize: '11px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>{doc.originalName}</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-muted)', padding: '4px' }}><X size={18} /></button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--clr-muted)', fontSize: '13px', fontFamily: 'var(--f-lunchtype)', padding: '32px 0' }}>
            <MessageSquare size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            Ask anything about <strong style={{ color: 'var(--clr-text)' }}>{doc.originalName}</strong>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '85%', padding: '10px 14px', background: msg.role === 'user' ? 'var(--clr-accent)' : 'var(--clr-card)', borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '2px 12px 12px 12px', border: '1px solid var(--clr-border)' }}>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: msg.role === 'user' ? 'var(--clr-bg)' : 'var(--clr-text)', fontFamily: 'var(--f-lunchtype)', margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--clr-card)', border: '1px solid var(--clr-border)', borderRadius: '2px 12px 12px 12px', width: 'fit-content' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--clr-accent)', animation: 'pulse 1s infinite' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--clr-accent)', animation: 'pulse 1s infinite 0.2s' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--clr-accent)', animation: 'pulse 1s infinite 0.4s' }} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--clr-border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input className="fi" style={{ flex: 1 }} placeholder="Ask a question about this document..."
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            disabled={loading || doc.status !== 'ready'} />
          <button onClick={handleSend} disabled={!input.trim() || loading || doc.status !== 'ready'}
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--clr-accent)', border: 'none', cursor: 'pointer', color: 'var(--clr-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!input.trim() || loading || doc.status !== 'ready') ? 0.4 : 1, flexShrink: 0 }}>
            <Send size={16} />
          </button>
        </div>
        {doc.status !== 'ready' && (
          <p style={{ fontSize: '11px', color: 'var(--color-warning, #f59e0b)', fontFamily: 'var(--f-cotham)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={11} /> Document is still processing…
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const DocumentVaultPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [chatDoc, setChatDoc] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);

  const fetchDocs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await getDocuments();
      setDocuments(res.data?.documents || []);
    } catch {
      if (!silent) toast.error('Failed to load documents');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  // Auto-refresh while any document is still processing
  useEffect(() => {
    const hasProcessing = documents.some(d => d.status === 'processing');
    if (!hasProcessing) return;
    const interval = setInterval(() => fetchDocs(true), 3000);
    return () => clearInterval(interval);
  }, [documents, fetchDocs]);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Unsupported file type. Use PDF, DOCX, XLSX, or TXT.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      const res = await uploadDocument(formData);
      const doc = res.data?.document;
      if (doc) {
        setDocuments(prev => [doc, ...prev]);
        toast.success(`${file.name} uploaded! Processing…`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteDocument(id);
      setDocuments(prev => prev.filter(d => d._id !== id));
      if (chatDoc?._id === id) setChatDoc(null);
      toast.success('Document deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = documents.filter(d =>
    !searchQuery || d.originalName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSize = documents.reduce((acc, d) => acc + (d.sizeBytes || 0), 0);

  return (
    <AppShell>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--f-groote)', fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--clr-text)', marginBottom: '4px' }}>
              Document <em style={{ color: 'var(--clr-accent)' }}>Vault</em>
            </h1>
            <p style={{ color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', fontSize: '14px' }}>Secure storage and AI analysis for your research files.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={fetchDocs} disabled={loading} style={{ padding: '8px 14px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', cursor: 'pointer', color: 'var(--clr-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontFamily: 'var(--f-lunchtype)' }}>
              <RefreshCw size={14} style={loading ? { animation: 'spin 1s linear infinite' } : {}} /> Refresh
            </button>
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.xlsx,.txt" style={{ display: 'none' }} onChange={handleFileSelect} />
            <Button size="lg" icon={Upload} onClick={() => fileInputRef.current?.click()} loading={isUploading}>
              {isUploading ? 'Uploading…' : 'Upload Document'}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-muted)' }} size={16} />
            <input type="text" placeholder="Search documents..." className="fi" style={{ paddingLeft: '36px', width: '100%' }}
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total Files', val: documents.length.toString() },
            { label: 'Storage Used', val: formatBytes(totalSize) },
            { label: 'AI Ready', val: documents.filter(d => d.status === 'ready').length.toString() },
            { label: 'Processing', val: documents.filter(d => d.status === 'processing').length.toString() },
          ].map((stat, i) => (
            <Card key={i} style={{ padding: '14px' }}>
              <p className="fl" style={{ marginBottom: '3px' }}>{stat.label}</p>
              <p style={{ fontFamily: 'var(--f-doll)', fontSize: '22px', color: 'var(--clr-text)', letterSpacing: '1px' }}>{stat.val}</p>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card>
          {loading && documents.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid var(--clr-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              Loading documents…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--clr-muted)' }}>
              <FileBox size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ fontFamily: 'var(--f-lunchtype)', fontSize: '15px', color: 'var(--clr-text)', marginBottom: '6px' }}>
                {searchQuery ? 'No matching documents' : 'No documents yet'}
              </p>
              <p style={{ fontFamily: 'var(--f-lunchtype)', fontSize: '13px' }}>
                {searchQuery ? 'Try a different search term.' : 'Upload a PDF, DOCX, XLSX, or TXT file to get started.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--clr-border)' }}>
                    {['File Name', 'Size', 'Date Added', 'Status', 'Actions'].map(h => (
                      <th key={h} className="fl" style={{ padding: '12px 18px', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((doc) => (
                      <motion.tr key={doc._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ borderBottom: '1px solid var(--clr-border)' }}>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {getFileIcon(doc.mimeType)}
                            <div>
                              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--clr-text)', fontFamily: 'var(--f-lunchtype)' }}>{doc.originalName}</span>
                              {doc.wordCount && <p style={{ fontSize: '11px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)', marginTop: '2px' }}>{doc.wordCount.toLocaleString()} words</p>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>{formatBytes(doc.sizeBytes)}</td>
                        <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>{formatDate(doc.createdAt)}</td>
                        <td style={{ padding: '14px 18px' }}>
                          <Badge variant={doc.status === 'ready' ? 'success' : doc.status === 'failed' ? 'danger' : 'info'}>
                            {doc.status === 'ready' ? 'Ready' : doc.status === 'failed' ? 'Failed' : 'Processing'}
                          </Badge>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => setChatDoc(doc)}
                              disabled={doc.status !== 'ready'}
                              title="Chat with document"
                              style={{ padding: '5px 10px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: '4px', cursor: doc.status === 'ready' ? 'pointer' : 'not-allowed', color: doc.status === 'ready' ? 'var(--clr-accent)' : 'var(--clr-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'var(--f-lunchtype)', opacity: doc.status !== 'ready' ? 0.5 : 1 }}>
                              <MessageSquare size={12} /> Chat
                            </button>
                            <button
                              onClick={() => handleDelete(doc._id)}
                              disabled={deletingId === doc._id}
                              title="Delete"
                              style={{ padding: '5px 8px', background: 'color-mix(in srgb, var(--color-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-danger) 30%, transparent)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-danger)', display: 'flex', alignItems: 'center' }}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Chat Sidebar */}
      <AnimatePresence>
        {chatDoc && <DocChat doc={chatDoc} onClose={() => setChatDoc(null)} />}
      </AnimatePresence>
    </AppShell>
  );
};

export default DocumentVaultPage;
