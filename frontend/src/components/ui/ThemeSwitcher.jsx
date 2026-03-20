import React, { useEffect } from 'react';

const THEMES = {
  dark:  {'--clr-bg':'#070605','--clr-surface':'#0e0c09','--clr-card':'#161310','--clr-text':'#f0ebe0','--clr-muted':'#786e5e','--clr-border':'rgba(201,168,76,0.12)','--clr-accent':'#c9a84c','--clr-accent2':'#e8b050'},
  light: {'--clr-bg':'#f7f3ea','--clr-surface':'#ede8d8','--clr-card':'#ffffff','--clr-text':'#1a1208','--clr-muted':'#7a6a50','--clr-border':'rgba(0,0,0,0.09)','--clr-accent':'#9a7020','--clr-accent2':'#b88830'},
  sand:  {'--clr-bg':'#e6d8b8','--clr-surface':'#dccfa8','--clr-card':'#eddfc4','--clr-text':'#221606','--clr-muted':'#8a6a40','--clr-border':'rgba(0,0,0,0.11)','--clr-accent':'#a84e10','--clr-accent2':'#c86020'},
  ocean: {'--clr-bg':'#030c18','--clr-surface':'#061422','--clr-card':'#091e30','--clr-text':'#c8e8f4','--clr-muted':'#406878','--clr-border':'rgba(60,160,220,0.10)','--clr-accent':'#30b8d0','--clr-accent2':'#18a0b8'},
}

const setTheme = (key) => {
  if (!THEMES[key]) return;

  const html = document.documentElement;
  const root = document.documentElement.style;

  html.setAttribute('data-theme', key);
  Object.entries(THEMES[key]).forEach(([k, v]) => root.setProperty(k, v));
  document.querySelectorAll('.sw').forEach((s) => s.classList.toggle('on', s.dataset.t === key));
  try { localStorage.setItem('ll-theme', key); } catch { return; }
};

const ThemeSwitcher = ({ id, className = '' }) => {
  useEffect(() => {
    const saved = (()=>{ try{return localStorage.getItem('ll-theme')}catch{return null} })()
    if(saved && THEMES[saved]) setTheme(saved)
  }, [])

  const handleThemeChange = (key, event) => {
    const button = event.currentTarget;
    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    );

    const applyTheme = () => setTheme(key);

    if (typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    const transition = document.startViewTransition(() => {
      applyTheme();
    });

    const ready = transition?.ready;
    if (ready && typeof ready.then === "function") {
      ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 400,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    }
  };

  return (
    <div id={id} className={`swatches ${className}`}>
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
        ::view-transition-old(root) {
          z-index: 1;
        }
        ::view-transition-new(root) {
          z-index: 2;
        }
      `}</style>
      <button className="sw on" data-t="dark" style={{ background: '#1a1208' }} title="Dark" aria-label="Switch to Dark theme" onClick={(e) => handleThemeChange('dark', e)} />
      <button className="sw" data-t="light" style={{ background: '#f0ece4' }} title="Light" aria-label="Switch to Light theme" onClick={(e) => handleThemeChange('light', e)} />
      <button className="sw" data-t="sand" style={{ background: '#ddd0b0' }} title="Sand" aria-label="Switch to Sand theme" onClick={(e) => handleThemeChange('sand', e)} />
      <button className="sw" data-t="ocean" style={{ background: '#071828' }} title="Ocean" aria-label="Switch to Ocean theme" onClick={(e) => handleThemeChange('ocean', e)} />
    </div>
  );
};

export default ThemeSwitcher;
