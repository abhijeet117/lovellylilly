import React from 'react'
export default function Skeleton({ width = '100%', height = '20px', 
                                    rounded = false }) {
  return (
    <div className="motion-skeleton" style={{ 
      width, height, borderRadius: rounded ? '9999px' : '8px',
      background: 'linear-gradient(90deg, var(--clr-surface) 25%, var(--clr-card) 50%, var(--clr-surface) 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-shimmer 1.6s ease-in-out infinite',
      willChange: 'background-position',
    }} />
  )
}
