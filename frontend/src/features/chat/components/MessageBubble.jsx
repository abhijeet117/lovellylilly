import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Copy, Check } from 'lucide-react';

const MessageBubble = ({ message, isAi, isStreaming }) => {
  const [copied, setCopied] = React.useState(false);

  // Real timestamp from message or current time as fallback
  const timeLabel = React.useMemo(() => {
    const d = message?.createdAt ? new Date(message.createdAt) : new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [message?.createdAt]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content || '').catch(() => {});
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
      {/* Avatar */}
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '10px', fontFamily: 'var(--f-doll)', fontWeight: 'bold',
        color: isAi ? 'var(--clr-bg)' : 'var(--clr-text)',
        background: isAi ? 'var(--clr-accent)' : 'var(--clr-card)',
        border: isAi ? 'none' : '1px solid var(--clr-border)',
        marginTop: '4px',
      }}>
        {isAi ? 'LL' : 'ME'}
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px', alignItems: isAi ? 'flex-start' : 'flex-end' }}>
        {/* Streaming indicator */}
        {isAi && isStreaming && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '3px 10px',
            fontSize: '10px', fontFamily: 'var(--f-cotham)',
            letterSpacing: '1.5px', textTransform: 'uppercase',
            color: 'var(--clr-accent)',
            background: 'color-mix(in srgb, var(--clr-accent) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--clr-accent) 22%, transparent)',
            borderRadius: 'var(--radius-sm)',
            animation: 'pulse 2s infinite',
          }}>
            ✦ Thinking…
          </div>
        )}

        {/* Bubble */}
        <div style={{
          position: 'relative', padding: '14px 18px',
          background: isAi ? 'var(--clr-card)' : 'var(--clr-surface)',
          border: '1px solid var(--clr-border)',
          borderRadius: isAi ? '2px 12px 12px 12px' : '12px 2px 12px 12px',
          maxWidth: isAi ? '100%' : '82%',
          minWidth: 0,
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        }}>
          <div style={{ fontSize: '15px', lineHeight: '1.75', color: 'var(--clr-text)', fontFamily: 'var(--f-lunchtype)' }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                p: ({ children }) => (
                  <p style={{ marginBottom: '10px' }}>{children}</p>
                ),
                ul: ({ children }) => (
                  <ul style={{ paddingLeft: '20px', marginBottom: '10px', listStyleType: 'disc' }}>{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol style={{ paddingLeft: '20px', marginBottom: '10px', listStyleType: 'decimal' }}>{children}</ol>
                ),
                li: ({ children }) => (
                  <li style={{ marginBottom: '4px' }}>{children}</li>
                ),
                h1: ({ children }) => (
                  <h1 style={{ fontFamily: 'var(--f-groote)', fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: 'var(--clr-text)' }}>{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 style={{ fontFamily: 'var(--f-groote)', fontSize: '17px', fontWeight: 700, marginBottom: '8px', color: 'var(--clr-text)' }}>{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{ fontFamily: 'var(--f-groote)', fontSize: '15px', fontWeight: 700, marginBottom: '6px', color: 'var(--clr-text)' }}>{children}</h3>
                ),
                blockquote: ({ children }) => (
                  <blockquote style={{ borderLeft: '3px solid var(--clr-accent)', paddingLeft: '14px', margin: '10px 0', color: 'var(--clr-muted)', fontStyle: 'italic' }}>{children}</blockquote>
                ),
                table: ({ children }) => (
                  <div style={{ overflowX: 'auto', marginBottom: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th style={{ padding: '8px 12px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', textAlign: 'left', fontFamily: 'var(--f-cotham)', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--clr-muted)' }}>{children}</th>
                ),
                td: ({ children }) => (
                  <td style={{ padding: '8px 12px', border: '1px solid var(--clr-border)' }}>{children}</td>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-accent)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>{children}</a>
                ),
                hr: () => (
                  <hr style={{ border: 'none', borderTop: '1px solid var(--clr-border)', margin: '14px 0' }} />
                ),
                code: ({ inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline ? (
                    <div style={{ position: 'relative', margin: '12px 0', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--clr-border)' }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '6px 12px', background: 'var(--clr-bg)', borderBottom: '1px solid var(--clr-border)',
                      }}>
                        <span style={{ fontSize: '10px', fontFamily: 'var(--f-cotham)', color: 'var(--clr-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                          {match ? match[1] : 'code'}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopy}
                          aria-label="Copy code"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-muted)', padding: '2px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'var(--f-cotham)' }}
                        >
                          {copied ? <Check size={13} style={{ color: 'var(--color-success)' }} /> : <Copy size={13} />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre style={{ padding: '14px', background: 'var(--clr-bg)', overflow: 'auto', margin: 0, fontSize: '13px', lineHeight: 1.6 }}>
                        <code className={className} {...props}>{children}</code>
                      </pre>
                    </div>
                  ) : (
                    <code style={{
                      background: 'var(--clr-bg)', border: '1px solid var(--clr-border)',
                      borderRadius: '4px', padding: '1px 6px', fontSize: '13px',
                      fontFamily: 'monospace', color: 'var(--clr-accent)',
                    }} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {(message.content || '') + (isStreaming ? ' ▍' : '')}
            </ReactMarkdown>
          </div>

          {/* Footer — only on completed AI messages */}
          {isAi && !isStreaming && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--clr-border)',
              gap: '8px',
            }}>
              <span style={{ fontSize: '10px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)', letterSpacing: '0.5px' }}>
                {timeLabel}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? 'Copied' : 'Copy response'}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--clr-muted)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px',
                  fontFamily: 'var(--f-cotham)', letterSpacing: '0.5px', padding: '2px 4px',
                  borderRadius: '4px', transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--clr-text)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--clr-muted)'}
              >
                {copied ? <Check size={12} style={{ color: 'var(--color-success)' }} /> : <Copy size={12} />}
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
