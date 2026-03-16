import React from 'react';
import { Sparkles } from 'lucide-react';

const Logo = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: { icon: 16, text: 'text-[14px]' },
    md: { icon: 18, text: 'text-[16px]' },
    lg: { icon: 22, text: 'text-[20px]' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Sparkles size={s.icon} className="text-ion-blue" />
      <span className={`font-bold ${s.text} text-zero-white tracking-tight`}>
        LovellyLilly AI
      </span>
    </div>
  );
};

export default Logo;
