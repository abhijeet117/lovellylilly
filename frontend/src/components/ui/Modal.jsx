import React, { useEffect } from 'react'
export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])
  if (!isOpen) return null
  return (
    <div 
      onClick={onClose}
      style={{ 
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(7,9,15,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', 
        justifyContent: 'center', padding: '24px' 
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ 
        background: '#131824', border: '1px solid #222840',
        borderRadius: '16px', padding: '32px',
        width: '100%', maxWidth: '480px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.7)'
      }}>
        {title && (
          <h3 style={{ color: '#EDF0FF', fontSize: '18px', 
                       fontWeight: 600, marginBottom: '16px' }}>
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  )
}
