import React from 'react'
export default function Skeleton({ width = '100%', height = '20px', 
                                    rounded = false }) {
  return (
    <div className="motion-skeleton" style={{ 
      width, height, borderRadius: rounded ? '9999px' : '8px',
      background: 'linear-gradient(90deg, #131824 25%, #1A2030 50%, #131824 75%)',
      backgroundSize: '200% 100%',
      willChange: 'transform, opacity',
    }} />
  )
}
