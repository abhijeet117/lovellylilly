import React, { useState } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Button from '../../../components/ui/Button';
import { Globe, Code, Eye, Sparkles, Smartphone, Monitor } from 'lucide-react';

const WebsiteBuilderPage = () => {
  const [prompt, setPrompt] = useState('');
  const [viewMode, setViewMode] = useState('desktop');
  const [activeTab, setActiveTab] = useState('preview');
  const [generating, setGenerating] = useState(false);
  const [websiteHash, setWebsiteHash] = useState(null);

  const handleCreate = () => {
    if (!prompt) return;
    setGenerating(true);
    setTimeout(() => { setWebsiteHash('demo-site-123'); setGenerating(false); }, 2500);
  };

  return (
    <AppShell>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', overflow: 'hidden', flexWrap: 'wrap' }}>
        {/* Left */}
        <div style={{ width: 'min(420px, 100%)', background: 'var(--clr-surface)', borderRight: '1px solid var(--clr-border)', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--clr-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-bg)' }}>
              <Globe size={20} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--f-syne)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>Website Builder</h1>
              <p style={{ fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)', letterSpacing: '1px' }}>AI LOW-CODE STUDIO</p>
            </div>
          </div>

          <div>
            <label className="fl" style={{ marginBottom: '6px', display: 'block' }}>Describe your website</label>
            <textarea className="fi" style={{ width: '100%', height: '140px', resize: 'none' }}
              placeholder="A modern dark-themed landing page for a SaaS company..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>

          <div style={{ padding: '12px', background: 'color-mix(in srgb, var(--clr-accent) 5%, transparent)', border: '1px solid color-mix(in srgb, var(--clr-accent) 15%, transparent)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: 'var(--f-cotham)', letterSpacing: '1px', color: 'var(--clr-accent)', marginBottom: '8px' }}>
              <Sparkles size={12} /> AUTO-CONFIGURED
            </h4>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['Tailwind CSS', 'Responsive', 'Lucide Icons'].map(t => (
                <span key={t} style={{ padding: '3px 8px', background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', fontSize: '10px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)', letterSpacing: '0.5px' }}>{t}</span>
              ))}
            </div>
          </div>

          <Button className="w-full" onClick={handleCreate} loading={generating}>
            {websiteHash ? 'Update Site' : 'Generate Site'}
          </Button>

          {websiteHash && (
            <div style={{ paddingTop: '14px', borderTop: '1px solid var(--clr-border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p className="fl">Modifications</p>
              {['Add pricing table', 'Change header to sticky', 'Use blue brand color'].map((item, i) => (
                <button key={i} style={{
                  textAlign: 'left', padding: '8px 10px', background: 'var(--clr-card)', border: '1px solid var(--clr-border)',
                  fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', cursor: 'pointer',
                }}>
                  + {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ flex: 1, background: 'var(--clr-bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ height: '52px', borderBottom: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
            <div style={{ display: 'flex', gap: '3px', border: '1px solid var(--clr-border)', padding: '2px' }}>
              {[{ label: 'PREVIEW', icon: Eye, tab: 'preview' }, { label: 'CODE', icon: Code, tab: 'code' }].map(t => (
                <button key={t.tab} onClick={() => setActiveTab(t.tab)} style={{
                  padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '10px', fontFamily: 'var(--f-cotham)', letterSpacing: '1px', border: 'none', cursor: 'pointer',
                  background: activeTab === t.tab ? 'var(--clr-card)' : 'transparent',
                  color: activeTab === t.tab ? 'var(--clr-accent)' : 'var(--clr-muted)',
                }}>
                  <t.icon size={11} /> {t.label}
                </button>
              ))}
            </div>

            {activeTab === 'preview' && (
              <div style={{ display: 'flex', gap: '2px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', padding: '2px' }}>
                <button onClick={() => setViewMode('desktop')} style={{ padding: '4px 6px', border: 'none', cursor: 'pointer', background: viewMode === 'desktop' ? 'var(--clr-card)' : 'transparent', color: viewMode === 'desktop' ? 'var(--clr-accent)' : 'var(--clr-muted)' }}>
                  <Monitor size={13} />
                </button>
                <button onClick={() => setViewMode('mobile')} style={{ padding: '4px 6px', border: 'none', cursor: 'pointer', background: viewMode === 'mobile' ? 'var(--clr-card)' : 'transparent', color: viewMode === 'mobile' ? 'var(--clr-accent)' : 'var(--clr-muted)' }}>
                  <Smartphone size={13} />
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '6px' }}>
              <Button variant="ghost" size="sm">Live Link</Button>
              <Button size="sm">Publish</Button>
            </div>
          </div>

          <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
            {!websiteHash && !generating ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <Globe size={40} style={{ color: 'var(--clr-muted)', marginBottom: '18px' }} />
                <h2 style={{ fontFamily: 'var(--f-groote)', fontSize: '32px', color: 'var(--clr-text)', marginBottom: '10px' }}>
                  Your next project starts <em style={{ color: 'var(--clr-accent)' }}>here.</em>
                </h2>
                <p style={{ color: 'var(--clr-muted)', maxWidth: '400px', fontFamily: 'var(--f-lunchtype)' }}>Enter a description to generate a responsive website.</p>
              </div>
            ) : generating ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '48px', height: '48px', border: '3px solid var(--clr-border)', borderTopColor: 'var(--clr-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '18px' }} />
                <h3 style={{ fontFamily: 'var(--f-syne)', color: 'var(--clr-text)' }}>Generating...</h3>
              </div>
            ) : activeTab === 'preview' ? (
              <div
                style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: '6px', margin: '0 auto', overflow: 'hidden', width: viewMode === 'desktop' ? '100%' : 'min(100%, 375px)', height: viewMode === 'desktop' ? '100%' : '667px' }}>
                <div style={{ width: '100%', height: '44px', background: '#f8f8f8', borderBottom: '1px solid #e5e5e5' }} />
                <div style={{ padding: '24px' }}>
                  <div style={{ width: '50%', height: '24px', background: '#e5e5e5', borderRadius: '4px', marginBottom: '12px' }} />
                  <div style={{ width: '75%', height: '12px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px' }} />
                  <div style={{ width: '60%', height: '12px', background: '#f0f0f0', borderRadius: '4px' }} />
                </div>
              </div>
            ) : (
              <div
                style={{ width: '100%', height: '100%', background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', padding: '20px', fontFamily: 'monospace', fontSize: '13px', color: 'var(--clr-accent)', overflow: 'auto' }}>
                <pre>{`<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <nav class="p-6 flex justify-between">
      <div class="font-bold text-xl">Brand</div>
      <button class="bg-blue-600 text-white px-4 py-2">Sign Up</button>
    </nav>
    ...
  </body>
</html>`}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default WebsiteBuilderPage;
