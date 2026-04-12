import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppShell({ children, showSidebar = true }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 1024);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 1024);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden', background: 'var(--clr-bg)' }}>
      <Navbar onToggleSidebar={() => setSidebarOpen(p => !p)} showSidebar={showSidebar} />
      <div style={{ display: 'flex', flex: 1, paddingTop: '72px', minHeight: 0 }}>
        {showSidebar && <Sidebar isOpen={sidebarOpen} isMobile={isMobile} />}
        {showSidebar && isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: '72px 0 0 0',
              background: 'rgba(0, 0, 0, 0.35)',
              zIndex: 620,
            }}
          />
        )}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
