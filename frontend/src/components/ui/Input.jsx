import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  icon: Icon,
  type = 'text',
  error,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-[13px] text-lunar-gray font-medium tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-crater-gray pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          style={{
            background: '#0D1120',
            borderColor: error ? '#FF4F6A' : '#1E2540',
            color: '#F0F4FF',
          }}
          className={`
            w-full rounded-[10px]
            px-4 py-3.5 text-[15px]
            placeholder:text-[#3E4666]
            outline-none border
            focus:!border-[#4285F4] focus:shadow-[0_0_0_3px_rgba(66,133,244,0.15)]
            transition-all duration-150
            ${Icon ? 'pl-11' : ''}
            ${isPassword ? 'pr-11' : ''}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-crater-gray hover:text-lunar-gray transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-[12px] text-color-danger">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
