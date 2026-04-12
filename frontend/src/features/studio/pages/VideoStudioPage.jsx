import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { generateVideo, getVideoStatus, getVideos, deleteVideo } from '../services/studio.api';
import { Film, Play, Download, Trash2, Sparkles, Clock, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VideoStudioPage = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedAspect, setSelectedAspect] = useState('16:9');
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const pollRefs = useRef({});

  const fetchVideos = useCallback(async () => {
    setLoadingVideos(true);
    try {
      const res = await getVideos();
      setVideos(res.data?.videos || []);
    } catch {
      // silent
    } finally {
      setLoadingVideos(false);
    }
  }, []);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  // Poll pending/processing videos
  const startPolling = useCallback((videoId) => {
    if (pollRefs.current[videoId]) return;
    pollRefs.current[videoId] = setInterval(async () => {
      try {
        const res = await getVideoStatus(videoId);
        const v = res.data?.video;
        if (v?.status === 'completed' || v?.status === 'failed') {
          clearInterval(pollRefs.current[videoId]);
          delete pollRefs.current[videoId];
          setVideos(prev => prev.map(vid => vid._id === videoId ? v : vid));
          if (v.status === 'completed') toast.success('Video ready!');
          else toast.error('Video generation failed');
        }
      } catch {
        clearInterval(pollRefs.current[videoId]);
        delete pollRefs.current[videoId];
      }
    }, 8000);
  }, []);

  useEffect(() => {
    videos.forEach(v => {
      if ((v.status === 'pending' || v.status === 'processing') && v._id) {
        startPolling(v._id);
      }
    });
    return () => {
      Object.values(pollRefs.current).forEach(clearInterval);
      pollRefs.current = {};
    };
  }, [videos, startPolling]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const res = await generateVideo({ prompt, aspectRatio: selectedAspect });
      const video = res.data?.video;
      if (video) {
        setVideos(prev => [video, ...prev]);
        toast.success('Video generation started! We\'ll notify you when ready.');
        setPrompt('');
        if (video._id) startPolling(video._id);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Video generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    clearInterval(pollRefs.current[id]);
    delete pollRefs.current[id];
    try {
      await deleteVideo(id);
      setVideos(prev => prev.filter(v => v._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const StatusBadge = ({ status }) => {
    const cfg = {
      pending:    { icon: Clock, color: '#f59e0b', label: 'Queued' },
      processing: { icon: RefreshCw, color: '#3b82f6', label: 'Processing' },
      completed:  { icon: CheckCircle, color: '#22c55e', label: 'Ready' },
      failed:     { icon: AlertCircle, color: '#ef4444', label: 'Failed' },
    }[status] || { icon: Clock, color: '#6b7280', label: status };
    const Icon = cfg.icon;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', background: `${cfg.color}15`, border: `1px solid ${cfg.color}40`, borderRadius: '20px', fontSize: '10px', fontFamily: 'var(--f-cotham)', color: cfg.color, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        <Icon size={10} style={status === 'processing' ? { animation: 'spin 1s linear infinite' } : {}} />
        {cfg.label}
      </span>
    );
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ width: 'min(400px, 100%)', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--clr-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-bg)' }}>
                <Film size={20} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>Video Studio</h1>
                <p style={{ fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-cotham)', letterSpacing: '1px' }}>POLLINATIONS · WAN MODEL</p>
              </div>
            </div>

            <Card style={{ padding: '20px' }}>
              <h3 className="fl" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} style={{ color: 'var(--clr-accent)' }} /> Create Video
              </h3>
              <textarea className="fi" style={{ width: '100%', height: '120px', resize: 'none', marginBottom: '12px' }}
                placeholder="Cinematic drone shot of an alpine lake at golden hour..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />

              <label className="fl" style={{ marginBottom: '6px', display: 'block' }}>Aspect Ratio</label>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                {['16:9', '9:16', '1:1'].map(r => (
                  <button key={r} onClick={() => setSelectedAspect(r)} style={{
                    flex: 1, padding: '8px', border: '1px solid', fontSize: '12px', fontFamily: 'var(--f-lunchtype)', cursor: 'pointer',
                    borderColor: selectedAspect === r ? 'var(--clr-accent)' : 'var(--clr-border)',
                    background: selectedAspect === r ? 'color-mix(in srgb, var(--clr-accent) 10%, transparent)' : 'var(--clr-surface)',
                    color: selectedAspect === r ? 'var(--clr-accent)' : 'var(--clr-muted)',
                  }}>{r}</button>
                ))}
              </div>

              <div style={{ padding: '10px 12px', background: 'color-mix(in srgb, #f59e0b 8%, transparent)', border: '1px solid color-mix(in srgb, #f59e0b 25%, transparent)', borderRadius: '4px', marginBottom: '14px', fontSize: '12px', color: '#f59e0b', fontFamily: 'var(--f-lunchtype)' }}>
                ⚡ Video generation takes 1–3 minutes. We poll automatically and notify you when ready.
              </div>

              <Button className="w-full" onClick={handleGenerate} loading={isLoading} disabled={!prompt.trim()}>
                {isLoading ? 'Submitting…' : 'Generate Video'}
              </Button>
            </Card>

            <Card style={{ padding: '20px' }}>
              <h3 className="fl" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} style={{ color: 'var(--clr-accent)' }} /> Queue
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--clr-muted)' }}>Total videos</span>
                <span style={{ color: 'var(--clr-text)' }}>{videos.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--clr-muted)' }}>Processing</span>
                <span style={{ color: 'var(--clr-text)' }}>{videos.filter(v => v.status === 'pending' || v.status === 'processing').length}</span>
              </div>
            </Card>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '16px', color: 'var(--clr-text)' }}>Your Videos</h2>
              <button onClick={fetchVideos} disabled={loadingVideos} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontFamily: 'var(--f-lunchtype)' }}>
                <RefreshCw size={14} style={loadingVideos ? { animation: 'spin 1s linear infinite' } : {}} /> Refresh
              </button>
            </div>

            {videos.length === 0 ? (
              <div style={{ height: '400px', border: '2px dashed var(--clr-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <Film size={32} style={{ color: 'var(--clr-muted)', marginBottom: '14px' }} />
                <h3 style={{ fontFamily: 'var(--f-groote)', fontSize: '18px', color: 'var(--clr-text)', marginBottom: '8px' }}>No videos yet</h3>
                <p style={{ color: 'var(--clr-muted)', fontSize: '14px', fontFamily: 'var(--f-lunchtype)', maxWidth: '300px' }}>Describe a scene to generate your first video.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {videos.map((vid) => (
                  <div key={vid._id} style={{ border: '1px solid var(--clr-border)', borderRadius: '4px', overflow: 'hidden', background: 'var(--clr-surface)' }}>
                    <div style={{ aspectRatio: '16/9', background: 'var(--clr-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {vid.status === 'completed' && vid.videoUrl ? (
                        <video src={vid.videoUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'var(--clr-muted)' }}>
                          {(vid.status === 'pending' || vid.status === 'processing') ? (
                            <>
                              <div style={{ width: '40px', height: '40px', border: '3px solid var(--clr-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                              <span style={{ fontSize: '12px', fontFamily: 'var(--f-lunchtype)' }}>Processing…</span>
                            </>
                          ) : (
                            <>
                              <Film size={32} />
                              <span style={{ fontSize: '12px', fontFamily: 'var(--f-lunchtype)' }}>Generation failed</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '10px 12px', borderTop: '1px solid var(--clr-border)' }}>
                      <p style={{ fontSize: '12px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: '8px' }}>
                        {vid.prompt}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <StatusBadge status={vid.status} />
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {vid.status === 'completed' && vid.videoUrl && (
                            <a href={vid.videoUrl} download target="_blank" rel="noopener noreferrer"
                              style={{ padding: '4px 8px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--clr-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'var(--f-lunchtype)', textDecoration: 'none' }}>
                              <Download size={12} /> Save
                            </a>
                          )}
                          <button onClick={() => handleDelete(vid._id)} disabled={deletingId === vid._id}
                            style={{ padding: '4px 8px', background: 'color-mix(in srgb, var(--color-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-danger) 30%, transparent)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-danger)', display: 'flex', alignItems: 'center' }}>
                            <Trash2 size={12} />
                          </button>
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

export default VideoStudioPage;
