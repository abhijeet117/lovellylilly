import React from 'react'
export default function PasswordStrengthMeter({ password = '' }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const colors = ['#1A2030', '#FF4F6A', '#F5A623', '#EDF0FF', '#22D3A0']
  const labels = ['', 'Too weak', 'Could be stronger', 
                  'Getting there', 'Strong password']
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ 
            flex: 1, height: '4px', borderRadius: '2px',
            background: i < score ? colors[score] : '#1A2030',
            transition: 'background 300ms'
          }} />
        ))}
      </div>
      {password && (
        <span style={{ fontSize: '12px', color: colors[score], 
                       marginTop: '4px', display: 'block' }}>
          {labels[score]}
        </span>
      )}
    </div>
  )
}
