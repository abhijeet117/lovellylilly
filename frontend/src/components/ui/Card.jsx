import React from 'react';
import './Card.css';

const Card = ({ children, className = '', hover = true, accent = false, ...props }) => {
  return (
    <div
      className={`bc ${accent ? 'accent-bc' : ''} ${hover ? '' : 'no-hover'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
