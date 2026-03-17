import React, { useState } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { Film, Play, Settings2, Download, Trash2, Sparkles, Clock, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoStudioPage = () => {
  const [prompt, setPrompt] = useState('');
  const [motionScale, setMotionScale] = useState(5);
  const [duration, setDuration] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = () => {
    if (!prompt) return;
    setIsLoading(true);
    setTimeout(() => {
      setResults(prev => [{ id: Date.now(), thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800', prompt, duration, motion: motionScale }, ...prev]);
      setIsLoading(false);
      setPrompt('');
    }, 3000);
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ width: '400px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--clr-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-bg)' }}>
                <Film size={20} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--f-syne)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>Video Studio</h1>
                <p style={{ fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)', letterSpacing: '1px' }}>GEMINI VEO 2</p>
              </div>
            </div>

            <Card style={{ padding: '20px' }}>
              <h3 className="fl" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} style={{ color: 'var(--clr-accent)' }} /> Create Video
              </h3>
              <textarea className="fi" style={{ width: '100%', height: '120px', resize: 'none', marginBottom: '12px' }}
                placeholder="Cinematic drone shot of an alpine lake..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />

              <label className="fl" style={{ marginBottom: '6px', display: 'block' }}>Motion ({motionScale})</label>
              <input type="range" min="1" max="10" value={motionScale} onChange={(e) => setMotionScale(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--clr-accent)', marginBottom: '12px' }} />

              <label className="fl" style={{ marginBottom: '6px', display: 'block' }}>Duration</label>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                {[4, 8].map(d => (
                  <button key={d} onClick={() => setDuration(d)} style={{
                    flex: 1, padding: '8px', border: '1px solid', fontSize: '12px', fontFamily: 'var(--f-lunchtype)', cursor: 'pointer',
                    borderColor: duration === d ? 'var(--clr-accent)' : 'var(--clr-border)',
                    background: duration === d ? 'color-mix(in srgb, var(--clr-accent) 10%, transparent)' : 'var(--clr-surface)',
                    color: duration === d ? 'var(--clr-accent)' : 'var(--clr-muted)',
                  }}>{d}s</button>
                ))}
              </div>
              <Button className="w-full" onClick={handleGenerate} loading={isLoading}>Generate Video</Button>
            </Card>

            <Card style={{ padding: '20px' }}>
              <h3 className="fl" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} style={{ color: 'var(--clr-accent)' }} /> Credits
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--f-cotham)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                <span style={{ color: 'var(--clr-muted)' }}>Monthly</span>
                <span style={{ color: 'var(--clr-text)' }}>45/100</span>
              </div>
              <div className="str-bar"><div className="str-fill" style={{ width: '45%', background: 'var(--clr-accent)' }} /></div>
            </Card>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: 'var(--f-syne)', fontWeight: 700, fontSize: '16px', color: 'var(--clr-text)', marginBottom: '16px' }}>Recent</h2>
            {results.length === 0 ? (
              <div style={{ height: '400px', border: '2px dashed var(--clr-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <Video size={32} style={{ color: 'var(--clr-muted)', marginBottom: '14px' }} />
                <h3 style={{ fontFamily: 'var(--f-syne)', fontSize: '18px', color: 'var(--clr-text)', marginBottom: '8px' }}>Create cinematic clips</h3>
                <p style={{ color: 'var(--clr-muted)', fontSize: '14px', fontFamily: 'var(--f-lunchtype)', maxWidth: '300px' }}>Generate up to 8s of AI video from prompts.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AnimatePresence>
                  {results.map(vid => (
                    <motion.div key={vid.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      style={{ border: '1px solid var(--clr-border)', overflow: 'hidden' }}>
                      <div style={{ position: 'relative', aspectRatio: '16/9', background: 'black' }}>
                        <img src={vid.thumbnail} alt={vid.prompt} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                            <Play size={24} />
                          </div>
                        </div>
                        <span style={{ position: 'absolute', bottom: '10px', left: '10px', padding: '2px 8px', background: 'rgba(0,0,0,0.5)', fontSize: '10px', color: 'white', fontFamily: 'monospace' }}>{vid.duration}s</span>
                      </div>
                      <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>{vid.prompt}</p>
                        <Download size={14} style={{ color: 'var(--clr-muted)', cursor: 'pointer' }} />
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

export default VideoStudioPage;
