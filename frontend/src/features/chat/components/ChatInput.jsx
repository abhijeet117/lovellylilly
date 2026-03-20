import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Globe, Mic, ArrowUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ChatInput = ({ onSend, isLoading, useWebSearch, setUseWebSearch }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (text.trim() && !isLoading) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', width: '100%', padding: '16px 16px 32px' }}>
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Ask anything..."
          style={{
            width: '100%',
            background: 'var(--clr-surface)',
            border: '1px solid var(--clr-border)',
            borderRadius: '16px',
            padding: '16px 56px 16px 48px',
            fontSize: '15px',
            fontFamily: 'var(--f-lunchtype)',
            color: 'var(--clr-text)',
            outline: 'none',
            resize: 'none',
            transition: 'border-color 0.2s ease',
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
          <button type="button" onClick={() => toast('Attachments coming soon')} style={{ padding: '4px', color: 'var(--clr-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Paperclip size={18} />
          </button>
          <button
            type="button"
            onClick={() => setUseWebSearch(!useWebSearch)}
            style={{
              padding: '4px', background: 'none', border: 'none', cursor: 'pointer',
              color: useWebSearch ? 'var(--clr-accent)' : 'var(--clr-muted)',
              filter: useWebSearch ? 'drop-shadow(0 0 8px var(--clr-accent))' : 'none',
            }}
          >
            <Globe size={18} />
          </button>
        </div>

        {/* Right Actions */}
        <div style={{ position: 'absolute', right: '12px', bottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button type="button" onClick={() => toast('Voice mode coming soon')} style={{ padding: '4px', color: 'var(--clr-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Mic size={18} />
          </button>
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--clr-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--clr-bg)', border: 'none', cursor: 'pointer',
              opacity: !text.trim() || isLoading ? 0.4 : 1,
              transition: 'all 0.15s ease',
            }}
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
