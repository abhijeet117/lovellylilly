import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // We'll customize this later
import { Copy, Check, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../../../components/ui/Badge';

const MessageBubble = ({ message, isAi, isStreaming }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-4 ${isAi ? 'flex-row' : 'flex-row-reverse'} max-w-[860px] mx-auto w-full`}
    >
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-brand-glow ${isAi ? 'bg-brand-gradient mt-1' : 'bg-bg-chat-user mt-1 border border-border-default'}`}>
        {isAi ? 'LA' : 'US'}
      </div>

      <div className={`flex-1 flex flex-col gap-2 ${isAi ? '' : 'items-end'}`}>
        {isAi && isStreaming && (
          <Badge variant="think" className="animate-pulse w-fit">
            🧠 Thinking...
          </Badge>
        )}

        <div className={`relative px-5 py-4 rounded-xl border ${isAi ? 'bg-bg-chat-ai border-border-subtle rounded-tl-sm' : 'bg-bg-chat-user border-border-default rounded-tr-sm max-w-[85%]'}`}>
          <div className="prose prose-invert max-w-none text-[15px] leading-relaxed">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeHighlight]}
              components={{
                p: ({children}) => <p className="mb-4 last:mb-0">{children}</p>,
                code: ({node, inline, className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline ? (
                    <div className="relative group my-4 rounded-lg overflow-hidden border border-border-subtle">
                       <div className="flex items-center justify-between px-4 py-2 bg-[#0B0E18] border-b border-border-subtle">
                          <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">{match ? match[1] : 'code'}</span>
                          <button onClick={handleCopy} className="text-text-muted hover:text-text-primary transition-colors">
                            {copied ? <Check size={14} className="text-semantic-success" /> : <Copy size={14} />}
                          </button>
                       </div>
                       <pre className="p-4 bg-bg-code overflow-x-auto m-0">
                          <code className={className} {...props}>
                            {children}
                          </code>
                       </pre>
                    </div>
                  ) : (
                    <code className="bg-bg-code border border-border-subtle rounded px-1.5 py-0.5 text-semantic-success text-[13px] font-mono" {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {message.content + (isStreaming ? ' |' : '')}
            </ReactMarkdown>
          </div>

          {isAi && !isStreaming && (
             <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-subtle">
                <div className="flex items-center gap-3">
                   <span className="text-[11px] text-text-muted">12:45 PM</span>
                   <Badge variant="system" className="text-[9px] px-1.5 py-0">v1.0</Badge>
                </div>
                <button onClick={handleCopy} className="p-1 px-2 rounded-sm hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-all flex items-center gap-1.5 text-[11px]">
                   {copied ? <Check size={12} /> : <Copy size={12} />}
                   {copied ? 'Copied' : 'Copy'}
                </button>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
