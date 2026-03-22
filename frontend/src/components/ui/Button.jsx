import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAnimationConfig } from '../../lib/animations/useAnimationConfig';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const animation = useAnimationConfig();
  const baseClass = variant === 'ghost' ? 'btn-ghost' : variant === 'danger' ? 'btn-ghost danger' : 'btn-primary';
  const motionVariants = children ? animation.buttonInteraction : animation.iconButtonInteraction;

  return (
    <motion.button
      className={`${baseClass} ${size === 'sm' ? 'btn-sm' : ''} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      variants={motionVariants}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="tap"
      transition={animation.transitions.default}
      {...props}
    >
      <span className="motion-button-shell">
        <AnimatePresence initial={false} mode="wait">
          {loading ? (
            <motion.span
              key="spinner"
              className="motion-button-item"
              initial={animation.loadingSpinner.initial}
              animate={animation.loadingSpinner.animate}
              exit={animation.loadingSpinner.exit}
            >
              <svg className="animate-spin" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="label"
              className="motion-button-item"
              initial={animation.loadingLabel.initial}
              animate={animation.loadingLabel.animate}
              exit={animation.loadingLabel.exit}
            >
              {Icon ? <Icon size={size === 'sm' ? 14 : 16} /> : null}
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
};

export default Button;
