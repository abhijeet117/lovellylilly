import React from 'react';
import { ArrowRight } from 'lucide-react';

const FollowUpChips = ({ suggestions = [], onSelect }) => {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {suggestions.map((suggestion, i) => (
        <button
          key={i}
          onClick={() => onSelect?.(suggestion)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary bg-bg-elevated border border-border-subtle rounded-full hover:border-brand-primary/40 hover:text-brand-primary transition-all"
        >
          {suggestion}
          <ArrowRight size={12} />
        </button>
      ))}
    </div>
  );
};

export default FollowUpChips;
