import React from 'react'
export default function Avatar({ size = 32, initials = 'LA', imageUrl }) {
  if (imageUrl) {
    return (
      <img src={imageUrl} alt={initials}
        style={{ width: size, height: size, borderRadius: '50%',
                 objectFit: 'cover' }} />
    )
  }
  return (
    <div style={{ 
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #4F7EFF, #7C5CFC)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, 
      fontSize: `${Math.floor(size * 0.35)}px`,
      flexShrink: 0
    }}>
      {initials}
    </div>
  )
}
