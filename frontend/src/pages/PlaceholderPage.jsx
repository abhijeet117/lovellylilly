import React from 'react'
export default function PlaceholderPage({ title = 'Coming Soon' }) {
  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '400px', color: '#8B91AE', fontSize: '18px',
      fontWeight: 500
    }}>
      {title}
    </div>
  )
}
