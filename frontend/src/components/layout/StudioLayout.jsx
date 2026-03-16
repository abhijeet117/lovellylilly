import React from 'react'
import AppShell from './AppShell'
export default function StudioLayout({ children }) {
  return (
    <AppShell>
      <div style={{ maxWidth: '1100px', margin: '0 auto', 
                    padding: '24px' }}>
        {children}
      </div>
    </AppShell>
  )
}
