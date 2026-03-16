import React from 'react'
export default function SegmentedControl({ options, value, onChange }) {
  return (
    <div style={{ 
      display: 'flex', background: '#0D1017',
      border: '1px solid #1A2030', borderRadius: '8px', 
      padding: '4px', gap: '4px' 
    }}>
      {options.map(opt => (
        <button key={opt.value || opt}
          onClick={() => onChange(opt.value || opt)}
          style={{ 
            flex: 1, padding: '8px 12px', borderRadius: '6px',
            border: 'none', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', transition: 'all 150ms',
            background: (value === (opt.value || opt)) 
              ? 'linear-gradient(135deg, #4F7EFF, #7C5CFC)' 
              : 'transparent',
            color: (value === (opt.value || opt)) 
              ? '#fff' : '#8B91AE',
          }}
        >
          {opt.label || opt}
        </button>
      ))}
    </div>
  )
}
