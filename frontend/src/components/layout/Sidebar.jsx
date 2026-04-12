import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import { MessageSquarePlus, Image, Video, Globe, FileText, Settings, BarChart3 } from 'lucide-react';

export default function Sidebar({ isOpen, isMobile = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const items = [
    { label: '+ New Chat', path: '/dashboard', icon: MessageSquarePlus },
    { label: 'Image Studio', path: '/studio/image', icon: Image },
    { label: 'Video Studio', path: '/studio/video', icon: Video },
    { label: 'Website Builder', path: '/studio/website', icon: Globe },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'SEO Analyzer', path: '/seo', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
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
        position: isMobile ? 'fixed' : 'static',
        top: isMobile ? '72px' : 'auto',
        left: isMobile ? 0 : 'auto',
        bottom: isMobile ? 0 : 'auto',
        zIndex: isMobile ? 640 : 'auto',
        boxShadow: isMobile ? '0 10px 24px rgba(0,0,0,0.25)' : 'none',
      }}
    >
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
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
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = 'var(--clr-card)';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
          >
            <Icon size={14} />
            {item.label}
          </div>
        );
      })}

      <div style={{ marginTop: 'auto', paddingTop: 'var(--sp-3)', borderTop: '1px solid var(--clr-border)' }}>
        <div className="fl" style={{ marginBottom: '8px' }}>Theme</div>
        <ThemeSwitcher />
      </div>
    </aside>
  );
}
