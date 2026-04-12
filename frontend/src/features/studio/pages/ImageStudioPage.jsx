import React, { useState, useEffect, useCallback } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { generateImage, getImages, deleteImage } from '../services/studio.api';
import { Image as ImageIcon, Settings2, Download, Trash2, Sparkles, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const STYLES = ['realistic', 'cinematic', 'anime', 'oil-painting', 'digital-art', 'watercolor'];
const ASPECTS = ['1:1', '16:9', '9:16'];

const ImageStudioPage = () => {
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedAspect, setSelectedAspect] = useState('1:1');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchGallery = useCallback(async () => {
    setLoadingGallery(true);
    try {
      const res = await getImages();
      setGallery(res.data?.images || []);
    } catch {
      // silent
    } finally {
      setLoadingGallery(false);
    }
  }, []);

  useEffect(() => { fetchGallery(); }, [fetchGallery]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const res = await generateImage({ prompt, aspectRatio: selectedAspect, style: selectedStyle });
      const img = res.data?.image;
      if (img) {
        setResults(prev => [img, ...prev]);
        setGallery(prev => [img, ...prev]);
        toast.success('Image generated!');
        setPrompt('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteImage(id);
      setGallery(prev => prev.filter(i => i._id !== id));
      setResults(prev => prev.filter(i => i._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (url, id) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `lovelylilly-${id}.jpg`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const displayImages = activeTab === 'generate' ? results : gallery;

  return (
    <AppShell>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ width: 'min(400px, 100%)', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--clr-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-bg)' }}>
                <ImageIcon size={20} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>Image Studio</h1>
                <p style={{ fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)', letterSpacing: '1px' }}>CLOUDFLARE AI · FLUX SCHNELL</p>
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
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleGenerate(); }}
              />
              <label className="fl" style={{ marginBottom: '6px', display: 'block' }}>Aspect Ratio</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '14px' }}>
                {ASPECTS.map(r => (
                  <button key={r} onClick={() => setSelectedAspect(r)} style={{
                    padding: '8px', border: '1px solid', fontSize: '12px', fontFamily: 'var(--f-lunchtype)', cursor: 'pointer',
                    borderColor: selectedAspect === r ? 'var(--clr-accent)' : 'var(--clr-border)',
                    background: selectedAspect === r ? 'color-mix(in srgb, var(--clr-accent) 10%, transparent)' : 'var(--clr-surface)',
                    color: selectedAspect === r ? 'var(--clr-accent)' : 'var(--clr-muted)',
                  }}>{r}</button>
                ))}
              </div>
              <label className="fl" style={{ marginBottom: '6px', display: 'block' }}>Style</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '14px' }}>
                {STYLES.map(s => (
                  <button key={s} onClick={() => setSelectedStyle(s)} style={{
                    padding: '7px 4px', border: '1px solid', fontSize: '10px', fontFamily: 'var(--f-cotham)', cursor: 'pointer', letterSpacing: '0.3px', textTransform: 'uppercase',
                    borderColor: selectedStyle === s ? 'var(--clr-accent)' : 'var(--clr-border)',
                    background: selectedStyle === s ? 'color-mix(in srgb, var(--clr-accent) 10%, transparent)' : 'var(--clr-surface)',
                    color: selectedStyle === s ? 'var(--clr-accent)' : 'var(--clr-muted)',
                  }}>{s}</button>
                ))}
              </div>
              <Button className="w-full" onClick={handleGenerate} loading={isLoading} disabled={!prompt.trim()}>
                {isLoading ? 'Generating…' : 'Generate Image'}
              </Button>
              <p style={{ fontSize: '11px', color: 'var(--clr-muted)', textAlign: 'center', marginTop: '8px', fontFamily: 'var(--f-cotham)' }}>Ctrl+Enter · Cloudflare FLUX → Pollinations fallback</p>
            </Card>

            <Card style={{ padding: '20px' }}>
              <h3 className="fl" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Settings2 size={14} style={{ color: 'var(--clr-accent)' }} /> Stats
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--clr-muted)' }}>Total saved</span>
                <span style={{ color: 'var(--clr-text)' }}>{gallery.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--clr-muted)' }}>Active style</span>
                <span style={{ color: 'var(--clr-text)', fontFamily: 'monospace', textTransform: 'capitalize' }}>{selectedStyle}</span>
              </div>
            </Card>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '4px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', padding: '3px' }}>
                {[['Recent', 'generate'], ['Collection', 'history']].map(([label, tab]) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding: '6px 14px', fontSize: '12px', border: 'none', cursor: 'pointer', fontFamily: 'var(--f-lunchtype)',
                    background: activeTab === tab ? 'var(--clr-card)' : 'transparent',
                    color: activeTab === tab ? 'var(--clr-text)' : 'var(--clr-muted)',
                  }}>{label}</button>
                ))}
              </div>
              {activeTab === 'history' && (
                <button onClick={fetchGallery} disabled={loadingGallery} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontFamily: 'var(--f-lunchtype)' }}>
                  <RefreshCw size={14} style={loadingGallery ? { animation: 'spin 1s linear infinite' } : {}} /> Refresh
                </button>
              )}
            </div>

            {displayImages.length === 0 ? (
              <div style={{ height: '500px', border: '2px dashed var(--clr-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <ImageIcon size={32} style={{ color: 'var(--clr-muted)', marginBottom: '14px' }} />
                <h3 style={{ fontFamily: 'var(--f-groote)', fontSize: '18px', color: 'var(--clr-text)', marginBottom: '8px' }}>
                  {activeTab === 'generate' ? 'No images yet' : 'No saved images'}
                </h3>
                <p style={{ color: 'var(--clr-muted)', fontSize: '14px', fontFamily: 'var(--f-lunchtype)', maxWidth: '300px' }}>
                  {activeTab === 'generate' ? 'Enter a prompt and click Generate.' : 'Generated images are saved here automatically.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {displayImages.map((img, idx) => (
                  <div key={img._id || idx} style={{ overflow: 'hidden', border: '1px solid var(--clr-border)', borderRadius: '4px', background: 'var(--clr-surface)' }}>
                    <div style={{ aspectRatio: img.aspectRatio === '16:9' ? '16/9' : img.aspectRatio === '9:16' ? '9/16' : '1/1', overflow: 'hidden', background: 'var(--clr-bg)' }}>
                      <img src={img.imageUrl} alt={img.prompt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                    </div>
                    <div style={{ padding: '10px 12px', borderTop: '1px solid var(--clr-border)' }}>
                      <p style={{ fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: '8px' }}>
                        {img.prompt}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                          {img.style} · {img.aspectRatio}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button onClick={() => handleDownload(img.imageUrl, img._id || idx)}
                            style={{ padding: '4px 8px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--clr-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'var(--f-lunchtype)' }}>
                            <Download size={12} /> Save
                          </button>
                          {img._id && (
                            <button onClick={() => handleDelete(img._id)} disabled={deletingId === img._id}
                              style={{ padding: '4px 8px', background: 'color-mix(in srgb, var(--color-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-danger) 30%, transparent)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-danger)', display: 'flex', alignItems: 'center' }}>
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default ImageStudioPage;
