import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Globe, ArrowUp, X, FileText, File } from 'lucide-react';
import { toast } from 'react-hot-toast';
import VoiceControl from '../../../components/voice/VoiceControl';
import { uploadDocument } from '../../documents/services/documents.api';

const ALLOWED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
];

const ALLOWED_EXT = ['.pdf', '.docx', '.xlsx', '.txt', '.csv'];

const fileIcon = (mime) => {
  if (mime?.includes('pdf')) return '📄';
  if (mime?.includes('word') || mime?.includes('docx')) return '📝';
  if (mime?.includes('sheet') || mime?.includes('xlsx')) return '📊';
  return '📎';
};

const ChatInput = ({ onSend, isLoading, useWebSearch, setUseWebSearch, textToSpeak, autoSpeak }) => {
  const [text, setText] = useState('');
  const [attachedDoc, setAttachedDoc] = useState(null);  // { name, documentId }
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [text]);

  const handleTranscript = (newText) => {
    setText((prev) => (prev ? prev + ' ' + newText : newText));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if ((!text.trim() && !attachedDoc) || isLoading) return;
    const payload = text.trim();
    // Prepend doc context hint if attached
    const finalText = attachedDoc
      ? `[Document: ${attachedDoc.name}]\n${payload || 'Summarise this document'}`
      : payload;
    onSend(finalText, attachedDoc?.documentId || null);
    setText('');
    setAttachedDoc(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!fileInputRef.current) return;
    fileInputRef.current.value = '';
    if (!file) return;

    if (!ALLOWED_MIME.includes(file.type)) {
      toast.error(`Unsupported file type. Allowed: ${ALLOWED_EXT.join(', ')}`);
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File must be smaller than 20MB');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${file.name}…`);
    try {
      const formData = new FormData();
      formData.append('document', file);
      const res = await uploadDocument(formData);
      const docId = res.data?.document?._id || res.data?._id;
      setAttachedDoc({ name: file.name, documentId: docId, mime: file.type });
      toast.success('Document attached', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const canSubmit = (text.trim() || attachedDoc) && !isLoading;

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', width: '100%', padding: '16px 16px 32px' }}>
      {/* Attached document chip */}
      {attachedDoc && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '5px 10px', marginBottom: '8px',
          background: 'color-mix(in srgb, var(--clr-accent) 10%, var(--clr-surface))',
          border: '1px solid color-mix(in srgb, var(--clr-accent) 25%, transparent)',
          borderRadius: '8px', fontSize: '12px', fontFamily: 'var(--f-lunchtype)',
          color: 'var(--clr-text)',
        }}>
          <span>{fileIcon(attachedDoc.mime)}</span>
          <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {attachedDoc.name}
          </span>
          <button onClick={() => setAttachedDoc(null)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--clr-muted)', padding: '0', display: 'flex', alignItems: 'center',
          }}>
            <X size={12} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={attachedDoc ? `Ask about ${attachedDoc.name}…` : 'Ask anything…'}
          style={{
            width: '100%',
            background: 'var(--clr-surface)',
            border: '1px solid var(--clr-border)',
            borderRadius: '16px',
            padding: '16px 56px 16px 88px',
            fontSize: '15px',
            fontFamily: 'var(--f-lunchtype)',
            color: 'var(--clr-text)',
            outline: 'none',
            resize: 'none',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box',
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          onFocus={(e) => e.target.style.borderColor = 'var(--clr-accent)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
        />

        {/* Left Actions */}
        <div style={{ position: 'absolute', left: '14px', bottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* File attachment */}
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_EXT.join(',')}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <button
            type="button"
            aria-label={isUploading ? 'Uploading…' : attachedDoc ? 'Document attached — click to replace' : 'Attach document (PDF, DOCX, XLSX, TXT, CSV)'}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Attach document (PDF, DOCX, XLSX, TXT, CSV)"
            style={{
              padding: '4px', background: 'none', border: 'none', cursor: isUploading ? 'wait' : 'pointer',
              color: attachedDoc ? 'var(--clr-accent)' : 'var(--clr-muted)',
              opacity: isUploading ? 0.5 : 1,
              transition: 'color 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {isUploading
              ? <div style={{ width: '18px', height: '18px', border: '2px solid var(--clr-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              : <Paperclip size={18} />
            }
          </button>

          {/* Web search toggle */}
          <button
            type="button"
            aria-label={useWebSearch ? 'Web search enabled — click to disable' : 'Web search disabled — click to enable'}
            onClick={() => setUseWebSearch(!useWebSearch)}
            title={useWebSearch ? 'Web search ON' : 'Web search OFF'}
            style={{
              padding: '4px', background: 'none', border: 'none', cursor: 'pointer',
              color: useWebSearch ? 'var(--clr-accent)' : 'var(--clr-muted)',
              filter: useWebSearch ? 'drop-shadow(0 0 8px var(--clr-accent))' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Globe size={18} />
          </button>
        </div>

        {/* Right Actions */}
        <div style={{ position: 'absolute', right: '12px', bottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <VoiceControl
            onTranscript={handleTranscript}
            textToSpeak={textToSpeak}
            autoSpeak={autoSpeak}
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!canSubmit}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--clr-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--clr-bg)', border: 'none', cursor: canSubmit ? 'pointer' : 'default',
              opacity: canSubmit ? 1 : 0.4,
              transition: 'opacity 0.15s ease, transform 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </form>

      <p style={{
        textAlign: 'center', fontSize: '11px', color: 'var(--clr-muted)',
        marginTop: '10px', fontFamily: 'var(--f-cotham)', letterSpacing: '0.5px',
      }}>
        LovellyLilly AI can make mistakes. Verify important information.
      </p>
    </div>
  );
};

export default ChatInput;
