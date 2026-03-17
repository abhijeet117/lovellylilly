import React from 'react';

export default function PasswordStrengthMeter({ password = '' }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const w = `${(score / 4) * 100}%`;
  const colors = ['var(--clr-border)', 'var(--color-danger)', 'var(--color-warning)', 'var(--clr-accent2)', 'var(--color-success)'];
  const labels = ['', 'Too weak', 'Could be stronger', 'Getting there', 'Strong password'];

  return (
    <div style={{ marginTop: '5px' }}>
      <div className="str-bar">
        <div className="str-fill" style={{ width: w, background: colors[score] }} />
      </div>
      {password && (
        <span style={{
          fontSize: '11px', color: colors[score],
          marginTop: '4px', display: 'block',
          fontFamily: 'var(--f-cotham)', letterSpacing: '1px', textTransform: 'uppercase',
        }}>
          {labels[score]}
        </span>
      )}
    </div>
  );
}
