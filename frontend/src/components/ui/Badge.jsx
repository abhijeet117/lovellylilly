import React from 'react';
import { Globe, Brain, Sparkles, FileText, Check, AlertTriangle, XCircle, Info } from 'lucide-react';

const modeVariants = {
  search:   { icon: Globe },
  think:    { icon: Brain },
  create:   { icon: Sparkles },
  document: { icon: FileText },
};

const statusVariants = {
  success: { color: 'var(--color-success)', icon: Check },
  warning: { color: 'var(--color-warning)', icon: AlertTriangle },
  danger:  { color: 'var(--color-danger)',  icon: XCircle },
  info:    { color: 'var(--clr-accent)',    icon: Info },
  system:  { color: 'var(--clr-muted)',     icon: null },
};

const Badge = ({ children, variant = 'info', mode, className = '', ...props }) => {
  const config = mode ? { ...modeVariants[mode], color: 'var(--clr-accent)' } : statusVariants[variant];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '3px 10px',
        fontSize: '10px', fontFamily: 'var(--f-cotham)',
        letterSpacing: '1.5px', textTransform: 'uppercase',
        color: config.color,
        background: `color-mix(in srgb, ${config.color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${config.color} 25%, transparent)`,
      }}
      className={className}
      {...props}
    >
      {Icon && <Icon size={10} />}
      {children || (mode && mode.toUpperCase())}
    </span>
  );
};

export default Badge;
