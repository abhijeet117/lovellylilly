import React from 'react';

const Logo = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: { fontSize: '14px' },
    md: { fontSize: '18px' },
    lg: { fontSize: '24px' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <a
      href="/"
      className={`nav-logo ${className}`}
      style={{ fontSize: s.fontSize, textDecoration: 'none' }}
    >
      Lovelly<em>Lilly</em>
    </a>
  );
};

export default Logo;
