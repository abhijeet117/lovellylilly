import React from 'react'
export default function SegmentedControl({ options, value, onChange }) {
  return (
    <div style={{
      display: 'flex', background: 'var(--clr-bg)',
      border: '1px solid var(--clr-border)', borderRadius: '8px',
      padding: '4px', gap: '4px'
    }}>
      {options.map(opt => (
        <button key={opt.value || opt}
          onClick={() => onChange(opt.value || opt)}
          style={{
            flex: 1, padding: '8px 12px', borderRadius: '6px',
            border: 'none', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', transition: 'background 0.15s, color 0.15s',
            fontFamily: 'var(--f-lunchtype)',
            background: (value === (opt.value || opt))
              ? 'var(--clr-accent)'
              : 'transparent',
            color: (value === (opt.value || opt))
              ? 'var(--clr-bg)' : 'var(--clr-muted)',
          }}
        >
          {opt.label || opt}
        </button>
      ))}
    </div>
  )
}
