import React from 'react';
import { Globe, Brain, BookOpen } from 'lucide-react';

const modeConfig = {
  web: { icon: Globe, label: 'Web Search', color: 'text-blue-400 bg-blue-400/10' },
  ai: { icon: Brain, label: 'AI Chat', color: 'text-purple-400 bg-purple-400/10' },
  docs: { icon: BookOpen, label: 'Document Q&A', color: 'text-green-400 bg-green-400/10' },
};

const QueryModeBadge = ({ mode = 'ai' }) => {
  const config = modeConfig[mode] || modeConfig.ai;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};

export default QueryModeBadge;
