import React from 'react';

const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      style={{
        background: '#0D1120',
        border: '1px solid #1E2540',
        borderRadius: '16px',
      }}
      className={`
        transition-all duration-150 ease-out
        ${hover ? 'hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_32px_rgba(66,133,244,0.10)] hover:border-[rgba(66,133,244,0.3)] hover:scale-[1.008]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
