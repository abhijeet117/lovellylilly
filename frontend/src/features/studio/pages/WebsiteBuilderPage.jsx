import React, { useState } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import {
   Globe,
   Code,
   Eye,
   Send,
   ExternalLink,
   Terminal,
   Layers,
   Sparkles,
   Smartphone,
   Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';

const WebsiteBuilderPage = () => {
  const [prompt, setPrompt] = useState('');
  const [viewMode, setViewMode] = useState('desktop'); // desktop, mobile
  const [activeTab, setActiveTab] = useState('preview'); // preview, code
  const [generating, setGenerating] = useState(false);
  const [websiteHash, setWebsiteHash] = useState(null);

  const handleCreate = () => {
    if (!prompt) return;
    setGenerating(true);
    setTimeout(() => {
      setWebsiteHash('demo-site-123');
      setGenerating(false);
    }, 2500);
  };

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-60px)] overflow-hidden">
        
        {/* Left Side: Controls */}
        <div className="w-[420px] bg-bg-surface border-r border-border-subtle flex flex-col p-6 overflow-y-auto">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-brand-gradient flex items-center justify-center text-white shadow-brand-glow">
                 <Globe size={22} />
              </div>
              <div>
                 <h1 className="text-h4">Website Builder</h1>
                 <p className="text-[13px] text-text-muted">AI-assisted low-code studio</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex flex-col gap-2">
                 <label className="text-[13px] text-text-secondary font-medium">Describe your website</label>
                 <textarea
                   className="w-full h-40 bg-bg-elevated border border-border-subtle rounded-sm p-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-primary transition-all resize-none shadow-inner"
                   placeholder="A modern dark-themed landing page for a SaaS company with pricing section and contact form..."
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                 />
              </div>

              <div className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-lg">
                 <h4 className="flex items-center gap-2 text-[13px] font-bold text-brand-primary mb-2">
                    <Sparkles size={14} />
                    Auto-Configured
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-bg-base border border-border-subtle rounded-sm text-[10px] text-text-secondary">Tailwind CSS</span>
                    <span className="px-2 py-1 bg-bg-base border border-border-subtle rounded-sm text-[10px] text-text-secondary">Responsive</span>
                    <span className="px-2 py-1 bg-bg-base border border-border-subtle rounded-sm text-[10px] text-text-secondary">Lucide Icons</span>
                 </div>
              </div>

              <Button 
                className="w-full h-12" 
                onClick={handleCreate}
                isLoading={generating}
                icon={Send}
              >
                {websiteHash ? 'Update Site' : 'Generate Site'}
              </Button>

              {websiteHash && (
                 <div className="space-y-3 pt-6 border-t border-border-subtle">
                    <p className="text-[12px] text-text-muted uppercase tracking-wider font-bold">Modifications</p>
                    {['Add pricing table', 'Change header to sticky', 'Use blue brand color'].map((item, i) => (
                       <button key={i} className="w-full text-left p-2.5 bg-bg-elevated hover:bg-bg-hover border border-border-subtle rounded-sm text-[12px] text-text-secondary transition-all">
                          &plus; {item}
                       </button>
                    ))}
                 </div>
              )}
           </div>
        </div>

        {/* Right Side: Preview/Code */}
        <div className="flex-1 bg-bg-base flex flex-col overflow-hidden">
           {/* Top Bar */}
           <div className="h-14 bg-bg-base border-b border-border-subtle flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                 <div className="flex border border-border-subtle rounded-sm overflow-hidden p-0.5">
                    <button 
                      onClick={() => setActiveTab('preview')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-sm flex items-center gap-1.5 transition-all ${activeTab === 'preview' ? 'bg-bg-elevated text-brand-primary' : 'text-text-muted hover:text-text-secondary'}`}
                    >
                      <Eye size={12} /> PREVIEW
                    </button>
                    <button 
                      onClick={() => setActiveTab('code')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-sm flex items-center gap-1.5 transition-all ${activeTab === 'code' ? 'bg-bg-elevated text-brand-primary' : 'text-text-muted hover:text-text-secondary'}`}
                    >
                      <Code size={12} /> CODE
                    </button>
                 </div>
              </div>

              {activeTab === 'preview' && (
                 <div className="flex items-center gap-1 bg-bg-elevated border border-border-subtle p-0.5 rounded-sm">
                    <button 
                      onClick={() => setViewMode('desktop')}
                      className={`p-1.5 rounded-sm transition-all ${viewMode === 'desktop' ? 'bg-bg-base text-brand-primary' : 'text-text-muted hover:text-text-primary'}`}
                    >
                      <Monitor size={14} />
                    </button>
                    <button 
                      onClick={() => setViewMode('mobile')}
                      className={`p-1.5 rounded-sm transition-all ${viewMode === 'mobile' ? 'bg-bg-base text-brand-primary' : 'text-text-muted hover:text-text-primary'}`}
                    >
                      <Smartphone size={14} />
                    </button>
                 </div>
              )}

              <div className="flex items-center gap-3">
                 <Button variant="ghost" size="sm" icon={ExternalLink}>Live Link</Button>
                 <Button variant="primary" size="sm">Publish</Button>
              </div>
           </div>

           {/* Viewport */}
           <div className="flex-1 p-8 overflow-y-auto bg-dot-pattern">
              {!websiteHash && !generating ? (
                 <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted mb-6">
                       <Globe size={40} />
                    </div>
                    <h2 className="text-h2 gradient-text mb-4">Your next project starts here.</h2>
                    <p className="text-text-secondary max-w-[420px]">Enter a description to generate a fully functional, responsive website in seconds.</p>
                 </div>
              ) : generating ? (
                 <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-6" />
                    <h2 className="text-h4 text-text-primary">Generating components...</h2>
                    <p className="text-text-muted text-sm mt-2">Connecting to Gemini Studio API</p>
                 </div>
              ) : activeTab === 'preview' ? (
                 <motion.div
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className={`bg-white border-2 border-border-subtle rounded-lg shadow-2xl mx-auto transition-all duration-500 overflow-hidden ${viewMode === 'desktop' ? 'w-full h-full' : 'w-[375px] h-[667px]'}`}
                 >
                    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-400 font-mono text-sm">
                       {/* Mock Preview Content */}
                       <div className="w-full h-12 bg-white border-b border-slate-200" />
                       <div className="flex-1 w-full p-8 space-y-4">
                          <div className="w-1/2 h-8 bg-slate-200 rounded animate-pulse" />
                          <div className="w-3/4 h-4 bg-slate-100 rounded animate-pulse" />
                          <div className="w-2/3 h-4 bg-slate-100 rounded animate-pulse" />
                          <div className="w-full aspect-video bg-slate-200 rounded mt-8 animate-pulse" />
                       </div>
                    </div>
                 </motion.div>
              ) : (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="w-full h-full bg-bg-code border border-border-subtle rounded-lg p-6 font-mono text-[13px] text-semantic-success overflow-auto"
                 >
                    <p className="mb-2 text-text-muted">// Generated index.html</p>
                    <pre>{`<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
  </head>
  <body class="font-['Inter']">
    <nav class="p-6 flex justify-between">
      <div class="font-bold text-xl">BrandName</div>
      <button class="bg-blue-600 text-white px-4 py-2 rounded">Sign Up</button>
    </nav>
    ...
  </body>
</html>`}</pre>
                 </motion.div>
              )}
           </div>
        </div>
      </div>
    </AppShell>
  );
};

export default WebsiteBuilderPage;
