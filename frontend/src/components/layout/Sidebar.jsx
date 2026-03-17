import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeSwitcher from '../ui/ThemeSwitcher';

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const items = [
    { label: '+ New Chat', path: '/dashboard', icon: '💬' },
    { label: 'Image Studio', path: '/studio/image', icon: '🖼' },
    { label: 'Video Studio', path: '/studio/video', icon: '🎬' },
    { label: 'Website Builder', path: '/studio/website', icon: '🌐' },
    { label: 'Documents', path: '/documents', icon: '📄' },
    { label: 'Settings', path: '/settings', icon: '⚙' },
  ];

  if (!isOpen) return null;

  return (
    <aside
      style={{
        width: '260px',
        background: 'var(--clr-surface)',
        borderRight: '1px solid var(--clr-border)',
        padding: 'var(--sp-2) var(--sp-2)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto',
      }}
    >
      {items.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? 'var(--clr-accent)' : 'var(--clr-muted)',
              fontFamily: 'var(--f-lunchtype)',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '2px',
              background: isActive ? 'var(--clr-card)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--clr-accent)' : '2px solid transparent',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minHeight: '44px',
            }}
            onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.background = 'var(--clr-card)';
            }}
            onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px' }}>{item.icon}</span>
            {item.label}
          </div>
        );
      })}

      {/* Bottom section: theme swatches */}
      <div style={{ marginTop: 'auto', paddingTop: 'var(--sp-3)', borderTop: '1px solid var(--clr-border)' }}>
        <div className="fl" style={{ marginBottom: '8px' }}>Theme</div>
        <ThemeSwitcher />
      </div>
    </aside>
  );
}
