import React, { useState, useEffect, useCallback } from 'react';

const THEMES = [
  { key: 'dark',  bg: '#1a1208', title: 'Dark' },
  { key: 'light', bg: '#f0ece4', title: 'Light' },
  { key: 'sand',  bg: '#ddd0b0', title: 'Sand' },
  { key: 'ocean', bg: '#071828', title: 'Ocean' },
];

const ThemeSwitcher = ({ className = '' }) => {
  const [active, setActive] = useState(() => {
    try { return localStorage.getItem('ll-theme') || 'dark'; } catch { return 'dark'; }
  });

  const applyTheme = useCallback((key) => {
    const html = document.documentElement;
    html.setAttribute('data-theme', key);
    try { localStorage.setItem('ll-theme', key); } catch {}
    setActive(key);
  }, []);

  const handleClick = useCallback((key, e) => {
    if (typeof document.startViewTransition === 'function') {
      const t = document.startViewTransition(() => applyTheme(key));
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxR = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y));
      t.ready?.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxR}px at ${x}px ${y}px)`] },
          { duration: 520, easing: 'cubic-bezier(0.22,1,0.36,1)', pseudoElement: '::view-transition-new(root)' }
        );
      });
    } else {
      applyTheme(key);
    }
  }, [applyTheme]);

  useEffect(() => {
    applyTheme(active);
  }, []);

  return (
    <div className={`swatches ${className}`}>
      {THEMES.map((t) => (
        <button
          key={t.key}
          className={`sw ${active === t.key ? 'on' : ''}`}
          style={{ background: t.bg }}
          title={t.title}
          onClick={(e) => handleClick(t.key, e)}
          aria-label={`Switch to ${t.title} theme`}
        />
      ))}
    </div>
  );
};

export default ThemeSwitcher;
