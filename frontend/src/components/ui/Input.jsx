import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

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
    <div className="fg">
      {label && (
        <label className="fl">{label}</label>
      )}
      <div className="input-wrap" style={{ position: 'relative' }}>
        {Icon && (
          <div className="input-icon">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`fi ${error ? 'input-error' : ''} ${Icon ? 'has-icon' : ''} ${isPassword ? 'has-password' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="input-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p className="input-error-msg">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
