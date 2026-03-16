import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Globe, Mic, ArrowUp } from 'lucide-react';
import Button from '../../../components/ui/Button';

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
    <div className="max-w-[860px] mx-auto w-full p-4 pb-8">
      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Ask anything..."
          className="w-full bg-bg-surface border border-border-default rounded-[16px] py-4 pl-12 pr-14 text-[16px] text-text-primary placeholder:text-text-muted outline-none focus:border-brand-primary focus:shadow-[0_0_0_3px_rgba(79,126,255,0.12)] transition-all resize-none shadow-[0_0_40px_rgba(79,126,255,0.06)]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        {/* Left Actions */}
        <div className="absolute left-4 bottom-[14px] flex items-center gap-2">
          <button type="button" className="p-1.5 text-text-muted hover:text-text-primary transition-colors">
            <Paperclip size={18} />
          </button>
          <button 
            type="button" 
            onClick={() => setUseWebSearch(!useWebSearch)}
            className={`p-1.5 transition-all ${useWebSearch ? 'text-brand-primary drop-shadow-[0_0_8px_rgba(79,126,255,0.6)]' : 'text-text-muted hover:text-text-primary'}`}
          >
            <Globe size={18} />
          </button>
        </div>

        {/* Right Actions */}
        <div className="absolute right-3 bottom-[10px] flex items-center gap-2">
          <button type="button" className="p-1.5 text-text-muted hover:text-text-primary transition-colors">
            <Mic size={18} />
          </button>
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center text-white shadow-brand-glow disabled:opacity-40 disabled:shadow-none hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </form>
      <p className="text-center text-[12px] text-text-muted mt-3">
        LovellyLilly AI can make mistakes. Verify important information.
      </p>
    </div>
  );
};

export default ChatInput;
