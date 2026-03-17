import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CustomCursor from '../ui/CustomCursor';

export default function AppShell({ children, showSidebar = true }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--clr-bg)' }}>
      <CustomCursor />
      <Navbar onToggleSidebar={() => setSidebarOpen(p => !p)} showSidebar={showSidebar} />
      <div style={{ display: 'flex', flex: 1, paddingTop: '72px' }}>
        {showSidebar && <Sidebar isOpen={sidebarOpen} />}
        <main style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
