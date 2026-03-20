import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Copy, Check } from 'lucide-react';
import Badge from '../../../components/ui/Badge';

const MessageBubble = ({ message, isAi, isStreaming }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        display: 'flex', gap: '14px', maxWidth: '860px', margin: '0 auto', width: '100%',
        flexDirection: isAi ? 'row' : 'row-reverse',
      }}
    >
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '10px', fontFamily: 'var(--f-doll)', fontWeight: 'bold',
        color: isAi ? 'var(--clr-bg)' : 'var(--clr-text)',
        background: isAi ? 'var(--clr-accent)' : 'var(--clr-card)',
        border: isAi ? 'none' : '1px solid var(--clr-border)',
        marginTop: '4px',
      }}>
        {isAi ? 'LL' : 'US'}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', alignItems: isAi ? 'flex-start' : 'flex-end' }}>
        {isAi && isStreaming && (
          <Badge variant="info" style={{ animation: 'pulse 2s infinite' }}>
            Thinking...
          </Badge>
        )}

        <div style={{
          position: 'relative', padding: '16px 20px',
          background: isAi ? 'var(--clr-card)' : 'var(--clr-surface)',
          border: '1px solid var(--clr-border)',
          borderRadius: isAi ? '2px 12px 12px 12px' : '12px 2px 12px 12px',
          maxWidth: isAi ? '100%' : '85%',
        }}>
          <div style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--clr-text)', fontFamily: 'var(--f-lunchtype)' }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                p: ({ children }) => <p style={{ marginBottom: '12px' }}>{children}</p>,
                code: ({ inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline ? (
                    <div style={{ position: 'relative', margin: '12px 0', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--clr-border)' }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '6px 12px', background: 'var(--clr-bg)', borderBottom: '1px solid var(--clr-border)',
                      }}>
                        <span style={{ fontSize: '10px', fontFamily: 'var(--f-cotham)', color: 'var(--clr-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                          {match ? match[1] : 'code'}
                        </span>
                        <button onClick={handleCopy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-muted)', padding: '2px' }}>
                          {copied ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <pre style={{ padding: '14px', background: 'var(--clr-bg)', overflow: 'auto', margin: 0 }}>
                        <code className={className} {...props}>{children}</code>
                      </pre>
                    </div>
                  ) : (
                    <code style={{
                      background: 'var(--clr-bg)', border: '1px solid var(--clr-border)',
                      borderRadius: '3px', padding: '1px 5px', fontSize: '13px',
                      fontFamily: 'monospace', color: 'var(--clr-accent)',
                    }} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {(message.content || '') + (isStreaming ? ' |' : '')}
            </ReactMarkdown>
          </div>

          {isAi && !isStreaming && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--clr-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)' }}>12:45 PM</span>
                <Badge variant="system">v1.0</Badge>
              </div>
              <button onClick={handleCopy} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--clr-muted)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px',
                fontFamily: 'var(--f-cotham)', letterSpacing: '0.5px',
              }}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
