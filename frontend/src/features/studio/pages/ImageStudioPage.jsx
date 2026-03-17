import React, { useState } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import {
  Image as ImageIcon, Settings2, Download, Share2, Trash2,
  Maximize2, Sparkles, Layers, History, Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageStudioPage = () => {
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedAspect, setSelectedAspect] = useState('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = () => {
    if (!prompt) return;
    setIsLoading(true);
    setTimeout(() => {
      setResults(prev => [{
        id: Date.now(),
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
        prompt, aspect: selectedAspect
      }, ...prev]);
      setIsLoading(false);
      setPrompt('');
    }, 2000);
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Left: Settings */}
          <div style={{ width: '400px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'var(--clr-accent)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'var(--clr-bg)',
              }}>
                <ImageIcon size={20} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--f-syne)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>Image Studio</h1>
                <p style={{ fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)', letterSpacing: '1px' }}>GEMINI IMAGEN 3</p>
              </div>
            </div>

            <Card style={{ padding: '20px' }}>
              <h3 className="fl" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} style={{ color: 'var(--clr-accent)' }} /> Generate Image
              </h3>
              <textarea
                className="fi"
                style={{ width: '100%', height: '120px', resize: 'none', marginBottom: '12px' }}
                placeholder="A futuristic city with floating neon structures..."
                value={prompt} onChange={(e) => setPrompt(e.target.value)}
              />
              <label className="fl" style={{ marginBottom: '6px', display: 'block' }}>Aspect Ratio</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '14px' }}>
                {['1:1', '16:9', '9:16'].map(r => (
                  <button key={r} onClick={() => setSelectedAspect(r)} style={{
                    padding: '8px', border: '1px solid', fontSize: '12px',
                    fontFamily: 'var(--f-lunchtype)', cursor: 'pointer',
                    borderColor: selectedAspect === r ? 'var(--clr-accent)' : 'var(--clr-border)',
                    background: selectedAspect === r ? 'color-mix(in srgb, var(--clr-accent) 10%, transparent)' : 'var(--clr-surface)',
                    color: selectedAspect === r ? 'var(--clr-accent)' : 'var(--clr-muted)',
                  }}>
                    {r}
                  </button>
                ))}
              </div>
              <Button className="w-full" onClick={handleGenerate} loading={isLoading}>Generate</Button>
            </Card>

            <Card style={{ padding: '20px' }}>
              <h3 className="fl" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Settings2 size={14} style={{ color: 'var(--clr-accent)' }} /> Advanced
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--clr-muted)' }}>Quality</span>
                <span style={{ color: 'var(--clr-text)', fontFamily: 'monospace' }}>Standard</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--clr-muted)' }}>Safety Filter</span>
                <span style={{ fontSize: '10px', color: 'var(--color-success)', fontFamily: 'var(--f-cotham)', letterSpacing: '1px' }}>ACTIVE</span>
              </div>
            </Card>
          </div>

          {/* Right: Results */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '4px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', padding: '3px' }}>
                {['Recent', 'Collection'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab === 'Recent' ? 'generate' : 'history')} style={{
                    padding: '6px 14px', fontSize: '12px', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--f-lunchtype)',
                    background: (tab === 'Recent' ? activeTab === 'generate' : activeTab === 'history') ? 'var(--clr-card)' : 'transparent',
                    color: (tab === 'Recent' ? activeTab === 'generate' : activeTab === 'history') ? 'var(--clr-text)' : 'var(--clr-muted)',
                  }}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {results.length === 0 ? (
              <div style={{
                height: '500px', border: '2px dashed var(--clr-border)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              }}>
                <ImageIcon size={32} style={{ color: 'var(--clr-muted)', marginBottom: '14px' }} />
                <h3 style={{ fontFamily: 'var(--f-syne)', fontSize: '18px', color: 'var(--clr-text)', marginBottom: '8px' }}>No images yet</h3>
                <p style={{ color: 'var(--clr-muted)', fontSize: '14px', fontFamily: 'var(--f-lunchtype)', maxWidth: '300px' }}>Enter a prompt to start creating.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                <AnimatePresence>
                  {results.map((img) => (
                    <motion.div key={img.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', border: '1px solid var(--clr-border)' }}
                    >
                      <img src={img.url} alt={img.prompt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                        opacity: 0, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <button style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Download size={14} /></button>
                          <button style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Share2 size={14} /></button>
                        </div>
                        <p style={{ color: 'white', fontSize: '12px' }}>{img.prompt}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default ImageStudioPage;
