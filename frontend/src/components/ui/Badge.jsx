import React from 'react';
import { Globe, Brain, Sparkles, FileText, Check, AlertTriangle, XCircle, Info } from 'lucide-react';

const modeVariants = {
  search:   { bg: 'bg-quantum-mint/10',   text: 'text-quantum-mint',   icon: Globe },
  think:    { bg: 'bg-ion-blue/10',       text: 'text-ion-blue',       icon: Brain },
  create:   { bg: 'bg-gravity-pink/10',   text: 'text-gravity-pink',   icon: Sparkles },
  document: { bg: 'bg-color-warning/10',  text: 'text-color-warning',  icon: FileText },
};

const statusVariants = {
  success: { bg: 'bg-quantum-mint/10',  text: 'text-quantum-mint',  icon: Check },
  warning: { bg: 'bg-color-warning/10', text: 'text-color-warning', icon: AlertTriangle },
  danger:  { bg: 'bg-color-danger/10',  text: 'text-color-danger',  icon: XCircle },
  info:    { bg: 'bg-ion-blue/10',      text: 'text-ion-blue',      icon: Info },
};

const Badge = ({ children, variant = 'info', mode, className = '', ...props }) => {
  const config = mode ? modeVariants[mode] : statusVariants[variant];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1
        rounded-full
        text-[11px] font-semibold uppercase tracking-wider
        ${config.bg} ${config.text}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={11} />}
      {children || (mode && mode.toUpperCase())}
    </span>
  );
};

export default Badge;
