import React, { useState, useEffect, useCallback } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Button from '../../../components/ui/Button';
import { generateWebsite, getWebsites, deleteWebsite } from '../services/studio.api';
import { Globe, Code, Eye, Sparkles, Smartphone, Monitor, Trash2, ExternalLink, Clock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const TYPES = ['landing-page', 'portfolio', 'saas', 'blog', 'e-commerce', 'dashboard'];

const WebsiteBuilderPage = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState('landing-page');
  const [viewMode, setViewMode] = useState('desktop');
  const [activeTab, setActiveTab] = useState('preview');
  const [generating, setGenerating] = useState(false);
  const [currentWebsite, setCurrentWebsite] = useState(null);
  const [websites, setWebsites] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await getWebsites();
      setWebsites(res.data?.websites || []);
    } catch {
      // silent
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleCreate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setCurrentWebsite(null);
    try {
      const res = await generateWebsite({ prompt, type: selectedType });
      const site = res.data?.website;
      if (site) {
        setCurrentWebsite(site);
        setWebsites(prev => [site, ...prev.filter(s => s._id !== site._id)]);
        toast.success('Website generated!');
        setPrompt('');
        setActiveTab('preview');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteWebsite(id);
      setWebsites(prev => prev.filter(s => s._id !== id));
      if (currentWebsite?._id === id) setCurrentWebsite(null);
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const iframeWidth = viewMode === 'desktop' ? '100%' : viewMode === 'tablet' ? '768px' : '390px';

  return (
    <AppShell>
      <div style={{ display: 'flex', height: 'calc(100dvh - 72px)', overflow: 'hidden' }}>
        {/* Left Panel */}
        <div style={{ width: 'min(420px, 100%)', background: 'var(--clr-surface)', borderRight: '1px solid var(--clr-border)', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--clr-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-bg)' }}>
              <Globe size={20} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>Website Builder</h1>
              <p style={{ fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)', letterSpacing: '1px' }}>AI LOW-CODE STUDIO</p>
            </div>
          </div>

          <div>
            <label className="fl" style={{ marginBottom: '6px', display: 'block' }}>Site Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '12px' }}>
              {TYPES.map(t => (
                <button key={t} onClick={() => setSelectedType(t)} style={{
                  padding: '7px', border: '1px solid', fontSize: '10px', fontFamily: 'var(--f-cotham)', cursor: 'pointer', letterSpacing: '0.5px', textTransform: 'uppercase',
                  borderColor: selectedType === t ? 'var(--clr-accent)' : 'var(--clr-border)',
                  background: selectedType === t ? 'color-mix(in srgb, var(--clr-accent) 10%, transparent)' : 'transparent',
                  color: selectedType === t ? 'var(--clr-accent)' : 'var(--clr-muted)',
                }}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="fl" style={{ marginBottom: '6px', display: 'block' }}>Describe your website</label>
            <textarea className="fi" style={{ width: '100%', height: '140px', resize: 'none' }}
              placeholder="A modern dark-themed landing page for a SaaS company with pricing table..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>

          <div style={{ padding: '12px', background: 'color-mix(in srgb, var(--clr-accent) 5%, transparent)', border: '1px solid color-mix(in srgb, var(--clr-accent) 15%, transparent)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: 'var(--f-cotham)', letterSpacing: '1px', color: 'var(--clr-accent)', marginBottom: '8px' }}>
              <Sparkles size={12} /> AUTO-CONFIGURED
            </h4>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['Tailwind CSS', 'Responsive', 'Lucide Icons', 'Dark Theme'].map(t => (
                <span key={t} style={{ padding: '3px 8px', background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', fontSize: '10px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)', letterSpacing: '0.5px' }}>{t}</span>
              ))}
            </div>
          </div>

          <Button className="w-full" onClick={handleCreate} loading={generating} disabled={!prompt.trim()}>
            {generating ? 'Building…' : currentWebsite ? 'Regenerate Site' : 'Generate Site'}
          </Button>

          {/* History */}
          <div>
            <button onClick={() => setShowHistory(!showHistory)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-muted)', fontSize: '13px', fontFamily: 'var(--f-lunchtype)', marginBottom: '8px' }}>
              <Clock size={14} /> Past Sites ({websites.length})
              <RefreshCw size={12} style={{ marginLeft: 'auto', cursor: 'pointer', ...(loadingHistory ? { animation: 'spin 1s linear infinite' } : {}) }} onClick={(e) => { e.stopPropagation(); fetchHistory(); }} />
            </button>
            {showHistory && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
                {websites.map(site => (
                  <div key={site._id} onClick={() => { setCurrentWebsite(site); setActiveTab('preview'); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: currentWebsite?._id === site._id ? 'color-mix(in srgb, var(--clr-accent) 10%, transparent)' : 'var(--clr-card)', border: `1px solid ${currentWebsite?._id === site._id ? 'var(--clr-accent)' : 'var(--clr-border)'}`, cursor: 'pointer', borderRadius: '4px' }}>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--clr-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--f-lunchtype)' }}>{site.title}</p>
                      <p style={{ fontSize: '10px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{site.type}</p>
                    </div>
                    <button onClick={(e) => handleDelete(site._id, e)} disabled={deletingId === site._id}
                      style={{ flexShrink: 0, padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {websites.length === 0 && <p style={{ fontSize: '12px', color: 'var(--clr-muted)', textAlign: 'center', padding: '12px' }}>No sites yet</p>}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div style={{ flex: 1, minWidth: 0, background: 'var(--clr-bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Toolbar */}
          <div style={{ height: '52px', borderBottom: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '3px', border: '1px solid var(--clr-border)', padding: '2px' }}>
              {[{ label: 'PREVIEW', icon: Eye, tab: 'preview' }, { label: 'CODE', icon: Code, tab: 'code' }].map(t => (
                <button key={t.tab} onClick={() => setActiveTab(t.tab)} style={{
                  padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontFamily: 'var(--f-cotham)', letterSpacing: '1px', border: 'none', cursor: 'pointer',
                  background: activeTab === t.tab ? 'var(--clr-card)' : 'transparent',
                  color: activeTab === t.tab ? 'var(--clr-accent)' : 'var(--clr-muted)',
                }}>
                  <t.icon size={12} /> {t.label}
                </button>
              ))}
            </div>

            {activeTab === 'preview' && (
              <div style={{ display: 'flex', gap: '3px', border: '1px solid var(--clr-border)', padding: '2px' }}>
                {[{ icon: Monitor, mode: 'desktop' }, { icon: Smartphone, mode: 'mobile' }].map(({ icon: Icon, mode }) => (
                  <button key={mode} onClick={() => setViewMode(mode)} style={{
                    padding: '4px 8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    background: viewMode === mode ? 'var(--clr-card)' : 'transparent',
                    color: viewMode === mode ? 'var(--clr-accent)' : 'var(--clr-muted)',
                  }}><Icon size={14} /></button>
                ))}
              </div>
            )}

            {currentWebsite && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>{currentWebsite.title}</span>
                <button onClick={() => {
                  const blob = new Blob([currentWebsite.fullHtml], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${currentWebsite.title.replace(/\s+/g, '-').toLowerCase()}.html`;
                  a.click();
                  URL.revokeObjectURL(url);
                }} style={{ padding: '4px 10px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', fontSize: '11px', fontFamily: 'var(--f-lunchtype)', cursor: 'pointer', color: 'var(--clr-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ExternalLink size={12} /> Export HTML
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: activeTab === 'code' ? '0' : '16px', background: '#f3f4f6' }}>
            {!currentWebsite ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--clr-muted)', padding: '40px' }}>
                <Globe size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
                <h3 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '20px', color: 'var(--clr-text)', marginBottom: '8px' }}>No website loaded</h3>
                <p style={{ fontFamily: 'var(--f-lunchtype)', fontSize: '14px', maxWidth: '320px' }}>Describe your website and click Generate, or select a past site from the history panel.</p>
              </div>
            ) : activeTab === 'preview' ? (
              <div style={{ width: iframeWidth, maxWidth: '100%', height: '100%', transition: 'width 0.3s ease', boxShadow: '0 4px 32px rgba(0,0,0,0.2)' }}>
                <iframe
                  srcDoc={currentWebsite.fullHtml}
                  title="Website Preview"
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block', minHeight: '600px' }}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'var(--clr-bg)', overflow: 'auto' }}>
                <pre style={{ margin: 0, padding: '20px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--clr-text)', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {currentWebsite.fullHtml}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default WebsiteBuilderPage;
