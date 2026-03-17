import React from 'react'
export default function PlaceholderPage({ title = 'Coming Soon' }) {
  return (
    <div className="placeholder-page" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: 'var(--clr-muted)', fontSize: '18px', fontWeight: 500}}>
      {title}
    </div>
  )
}
