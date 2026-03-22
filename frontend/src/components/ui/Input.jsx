import React, { forwardRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAnimationConfig } from '../../lib/animations/useAnimationConfig';
import './Input.css';

const Input = forwardRef(({
  label,
  icon: Icon,
  type = 'text',
  error,
  className = '',
  onChange,
  onFocus,
  onBlur,
  value,
  defaultValue,
  ...props
}, ref) => {
  const animation = useAnimationConfig();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value ?? defaultValue ?? ''));
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const handleChange = (event) => {
    setHasValue(Boolean(event.target.value));
    onChange?.(event);
  };

  return (
    <div className="fg">
      {label && (
        <motion.label
          className="fl motion-input-label"
          animate={isFocused || hasValue ? { y: -2, scale: 0.98 } : { y: 0, scale: 1 }}
          transition={animation.transitions.snappy}
        >
          {label}
        </motion.label>
      )}
      <div className="input-wrap motion-input-wrap">
        {Icon && (
          <motion.div
            className="input-icon"
            animate={isFocused ? { scale: 1.08, rotate: 0 } : { scale: 1, rotate: 0 }}
            transition={animation.transitions.snappy}
          >
            <Icon size={16} />
          </motion.div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`fi ${error ? 'input-error' : ''} ${Icon ? 'has-icon' : ''} ${isPassword ? 'has-password' : ''} ${className}`}
          value={value}
          defaultValue={defaultValue}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            setHasValue(Boolean(event.target.value));
            onBlur?.(event);
          }}
          onChange={handleChange}
          {...props}
        />
        <motion.span
          className="motion-input-line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused || hasValue ? 1 : 0 }}
          transition={animation.transitions.snappy}
        />
        {isPassword && (
          <motion.button
            type="button"
            className="input-eye"
            onClick={() => setShowPassword(!showPassword)}
            variants={animation.iconButtonInteraction}
            initial="rest"
            animate="rest"
            whileHover="hover"
            whileTap="tap"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </motion.button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="input-error-msg"
            initial={animation.inputError.hidden}
            animate={animation.inputError.visible}
            exit={animation.inputError.exit}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
