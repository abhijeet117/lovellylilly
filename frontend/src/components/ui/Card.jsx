import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useAnimationConfig } from '../../lib/animations/useAnimationConfig';
import './Card.css';

const Card = ({ children, className = '', hover = true, accent = false, style, ...props }) => {
  const animation = useAnimationConfig();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (event) => {
    if (!hover || animation.reducedMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`bc ${accent ? 'accent-bc' : ''} ${hover ? '' : 'no-hover'} ${className}`}
      layout
      variants={animation.cardInteraction}
      initial="rest"
      animate="rest"
      whileHover={hover ? 'hover' : undefined}
      whileTap={hover ? 'tap' : undefined}
      transition={{ layout: animation.transitions.heavy }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        hover && !animation.reducedMotion
          ? {
              ...style,
              perspective: 1000,
              rotateX,
              rotateY,
            }
          : style
      }
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
