import React from 'react';
import { ArrowRight } from 'lucide-react';

const FollowUpChips = ({ suggestions = [], onSelect }) => {
  if (!suggestions.length) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
      {suggestions.map((suggestion, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect?.(suggestion)}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--clr-accent)';
            e.currentTarget.style.color = 'var(--clr-accent)';
            e.currentTarget.style.background = 'color-mix(in srgb, var(--clr-accent) 6%, var(--clr-card))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--clr-border)';
            e.currentTarget.style.color = 'var(--clr-muted)';
            e.currentTarget.style.background = 'var(--clr-card)';
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            fontSize: '12px',
            fontFamily: 'var(--f-lunchtype)',
            fontWeight: 500,
            color: 'var(--clr-muted)',
            background: 'var(--clr-card)',
            border: '1px solid var(--clr-border)',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            transition: 'border-color 0.15s, color 0.15s, background 0.15s',
            outline: 'none',
            whiteSpace: 'nowrap',
            maxWidth: '280px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{suggestion}</span>
          <ArrowRight size={11} style={{ flexShrink: 0 }} />
        </button>
      ))}
    </div>
  );
};

export default FollowUpChips;
