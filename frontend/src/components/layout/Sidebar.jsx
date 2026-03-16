import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function Sidebar({ isOpen }) {
  const navigate = useNavigate()
  const items = [
    { label: '+ New Chat', path: '/dashboard' },
    { label: 'Image Studio', path: '/studio/image' },
    { label: 'Video Studio', path: '/studio/video' },
    { label: 'Website Builder', path: '/studio/website' },
    { label: 'Documents', path: '/documents' },
    { label: 'Settings', path: '/settings' },
  ]
  if (!isOpen) return null
  return (
    <aside style={{ 
      width: '260px', background: '#060810', 
      borderRight: '1px solid #1A2030',
      padding: '16px 12px', flexShrink: 0 
    }}>
      {items.map(item => (
        <div key={item.path}
          onClick={() => navigate(item.path)}
          style={{ 
            padding: '10px 12px', borderRadius: '8px',
            color: '#8B91AE', fontSize: '14px', 
            cursor: 'pointer', marginBottom: '4px' 
          }}
          onMouseEnter={e => e.currentTarget.style.background='#131824'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}
        >
          {item.label}
        </div>
      ))}
    </aside>
  )
}
