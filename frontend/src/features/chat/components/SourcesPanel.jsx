import React from 'react';
import { ExternalLink, X } from 'lucide-react';

const SourcesPanel = ({ sources = [], isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="w-[320px] border-l border-border-subtle bg-bg-surface h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border-subtle">
        <h3 className="text-sm font-bold text-text-primary">Sources</h3>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sources.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">No sources available for this response.</p>
        ) : (
          sources.map((source, i) => (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-bg-elevated rounded-lg border border-border-subtle hover:border-brand-primary/40 transition-colors group"
            >
              <div className="flex items-start gap-2">
                <ExternalLink size={14} className="text-text-muted mt-0.5 shrink-0 group-hover:text-brand-primary" />
                <div>
                  <p className="text-sm font-medium text-text-primary line-clamp-2">{source.title || source.url}</p>
                  <p className="text-xs text-text-muted mt-1 line-clamp-1">{source.url}</p>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default SourcesPanel;
