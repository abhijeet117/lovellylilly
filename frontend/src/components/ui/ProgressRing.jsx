import React from 'react'
export default function ProgressRing({ size = 80, color = '#F5A623' }) {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} 
         style={{ animation: 'spin 1.2s linear infinite' }}>
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke="#1A2030" strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
    </svg>
  )
}
