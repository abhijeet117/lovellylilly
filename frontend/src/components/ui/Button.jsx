import React from 'react';
import { Loader2 } from 'lucide-react';

const variantStyles = {
  primary: {
    background: '#4285F4',
    color: '#ffffff',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: '#8B92AE',
    border: '1px solid #1E2540',
  },
  danger: {
    background: 'rgba(255, 79, 106, 0.12)',
    color: '#FF4F6A',
    border: '1px solid rgba(255, 79, 106, 0.3)',
  },
  icon: {
    background: 'transparent',
    color: '#8B92AE',
    border: 'none',
  },
};

const hoverClasses = {
  primary: 'hover:shadow-[0_0_20px_rgba(66,133,244,0.35)]',
  ghost: 'hover:border-[#4285F4] hover:text-[#4285F4]',
  danger: 'hover:bg-[rgba(255,79,106,0.2)]',
  icon: 'hover:bg-[#131828]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-[13px]',
  md: 'px-6 py-3 text-[15px]',
  lg: 'px-8 py-3.5 text-[15px]',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  fullWidth = false,
  className = '',
  disabled = false,
  style: userStyle = {},
  ...props
}) => {
  const isIcon = variant === 'icon';
  const vs = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      style={{ ...vs, ...userStyle }}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        rounded-[10px] transition-all duration-150 ease-out cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${hoverClasses[variant] || ''}
        ${isIcon ? 'w-9 h-9 p-0 rounded-[10px]' : sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={isIcon ? 18 : 16} />
      ) : null}
      {!isIcon && children}
    </button>
  );
};

export default Button;
