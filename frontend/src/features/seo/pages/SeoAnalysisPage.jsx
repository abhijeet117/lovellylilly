import React, { useState, useEffect, useCallback } from 'react';
import AppShell from '../../../components/layout/AppShell';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { analyzeSeo, getSeoHistory } from '../services/seo.api';
import toast from 'react-hot-toast';
import {
  Search, Globe, AlertTriangle, AlertCircle, Info,
  CheckCircle, Clock, ChevronDown, ChevronUp, ExternalLink,
  BarChart3, RefreshCw, History
} from 'lucide-react';

// ── helpers ──────────────────────────────────────────────────────────────────
const gradeColor = (grade) => ({
  A: '#22c55e', B: '#84cc16', C: '#eab308', D: '#f97316', F: '#ef4444'
}[grade] || 'var(--clr-muted)');

const severityIcon = (sev) => {
  const s = { color: 'currentColor', width: 14, height: 14, flexShrink: 0 };
  if (sev === 'critical') return <AlertCircle {...s} style={{ ...s, color: '#ef4444' }} />;
  if (sev === 'high') return <AlertTriangle {...s} style={{ ...s, color: '#f97316' }} />;
  if (sev === 'medium') return <Info {...s} style={{ ...s, color: '#eab308' }} />;
  return <CheckCircle {...s} style={{ ...s, color: '#22c55e' }} />;
};

const severityBadge = (sev) => {
  const map = { critical: 'danger', high: 'warning', medium: 'info', low: 'success' };
  return <Badge variant={map[sev] || 'default'} style={{ fontSize: '10px' }}>{sev}</Badge>;
};

// Issue card with expand/collapse
const IssueCard = ({ issue, severity }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: '1px solid var(--clr-border)', background: 'var(--clr-surface)',
      marginBottom: '8px', overflow: 'hidden',
    }}>
      <button onClick={() => setOpen(v => !v)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 14px', background: 'none', border: 'none',
        cursor: 'pointer', textAlign: 'left',
      }}>
        {severityIcon(severity)}
        <span style={{ flex: 1, fontSize: '13px', fontFamily: 'var(--f-lunchtype)', color: 'var(--clr-text)' }}>
          {issue.type}
        </span>
        {severityBadge(severity)}
        {open ? <ChevronUp size={14} style={{ color: 'var(--clr-muted)', flexShrink: 0 }} />
               : <ChevronDown size={14} style={{ color: 'var(--clr-muted)', flexShrink: 0 }} />}
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px 38px', borderTop: '1px solid var(--clr-border)' }}>
          {issue.current && (
            <div style={{ marginBottom: '10px', marginTop: '10px' }}>
              <p style={{ fontSize: '11px', color: 'var(--clr-muted)', marginBottom: '4px', fontFamily: 'var(--f-lunchtype)' }}>Current</p>
              <code style={{ fontSize: '12px', color: '#f97316', wordBreak: 'break-all' }}>{issue.current}</code>
            </div>
          )}
          {issue.impact && (
            <div style={{ marginBottom: '10px', marginTop: issue.current ? 0 : '10px' }}>
              <p style={{ fontSize: '11px', color: 'var(--clr-muted)', marginBottom: '4px', fontFamily: 'var(--f-lunchtype)' }}>Impact</p>
              <p style={{ fontSize: '12px', color: 'var(--clr-text)', fontFamily: 'var(--f-lunchtype)' }}>{issue.impact}</p>
            </div>
          )}
          {issue.fix && (
            <div>
              <p style={{ fontSize: '11px', color: 'var(--clr-muted)', marginBottom: '4px', fontFamily: 'var(--f-lunchtype)' }}>Suggested Fix</p>
              <pre style={{
                fontSize: '11px', color: '#22c55e', background: '#0d1117',
                padding: '8px', overflow: 'auto', whiteSpace: 'pre-wrap',
                wordBreak: 'break-word', fontFamily: 'monospace', margin: 0,
              }}>{issue.fix}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Score ring
const ScoreRing = ({ score, grade }) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ - (score / 100) * circ;
  const color = gradeColor(grade);
  return (
    <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--clr-border)" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={dash}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '32px', fontWeight: 700, color, fontFamily: 'var(--f-groote)' }}>{score}</span>
        <span style={{ fontSize: '13px', color, fontWeight: 700 }}>Grade {grade}</span>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const SeoAnalysisPage = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('analyze');

  const fetchHistory = useCallback(async (page = 1) => {
    setIsLoadingHistory(true);
    try {
      const res = await getSeoHistory(page, 10);
      setHistory(res.data || []);
      setHistoryTotal(res.pagination?.total || 0);
      setHistoryPage(page);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) { toast.error('Enter a URL to analyze'); return; }
    let normalized = trimmed;
    if (!/^https?:\/\//i.test(normalized)) normalized = 'https://' + normalized;

    setIsAnalyzing(true);
    setReport(null);
    try {
      const res = await analyzeSeo(normalized);
      if (!res.success) throw new Error(res.error);
      setReport(res.data);
      fetchHistory();
      toast.success('SEO analysis complete');
    } catch (err) {
      toast.error(err.message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const totalIssues = report
    ? (report.issues?.critical?.length || 0) + (report.issues?.high?.length || 0)
      + (report.issues?.medium?.length || 0) + (report.issues?.low?.length || 0)
    : 0;

  const tabs = [{ id: 'analyze', label: 'Analyze', icon: Search }, { id: 'history', label: 'History', icon: History }];

  return (
    <AppShell>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--f-groote)', fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--clr-text)', marginBottom: '6px' }}>
            SEO Analyzer
          </h1>
          <p style={{ color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', fontSize: '14px' }}>
            Audit any URL for SEO issues, missing tags, and optimization opportunities.
          </p>
        </div>

        {/* Tab nav */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', borderBottom: '1px solid var(--clr-border)', paddingBottom: '1px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', border: 'none', background: 'none',
              color: activeTab === t.id ? 'var(--clr-accent)' : 'var(--clr-muted)',
              borderBottom: activeTab === t.id ? '2px solid var(--clr-accent)' : '2px solid transparent',
              fontFamily: 'var(--f-lunchtype)', fontSize: '14px', cursor: 'pointer',
            }}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* ── ANALYZE TAB ── */}
        {activeTab === 'analyze' && (
          <>
            {/* URL input */}
            <Card style={{ padding: '24px', marginBottom: '24px' }}>
              <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                  <Globe size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-muted)' }} />
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    style={{
                      width: '100%', padding: '10px 12px 10px 36px', border: '1px solid var(--clr-border)',
                      background: 'var(--clr-surface)', color: 'var(--clr-text)', fontSize: '14px',
                      fontFamily: 'var(--f-lunchtype)', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <Button type="submit" loading={isAnalyzing}>
                  {isAnalyzing ? 'Analyzing…' : 'Analyze'}
                </Button>
              </form>
            </Card>

            {/* Loading state */}
            {isAnalyzing && (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--clr-muted)' }}>
                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '16px', color: 'var(--clr-accent)' }} />
                <p style={{ fontFamily: 'var(--f-lunchtype)', fontSize: '14px' }}>Crawling page and analyzing SEO signals…</p>
              </div>
            )}

            {/* Results */}
            {report && !isAnalyzing && (
              <>
                {/* Score overview */}
                <Card style={{ padding: '24px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <ScoreRing score={report.score || 0} grade={report.grade || 'F'} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <h2 style={{ fontFamily: 'var(--f-groote)', fontSize: '18px', fontWeight: 700, color: 'var(--clr-text)' }}>
                          {report.url || url}
                        </h2>
                        <a href={report.url || url} target="_blank" rel="noopener noreferrer"
                          style={{ color: 'var(--clr-muted)', display: 'flex' }}>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {[
                          { label: 'Critical', count: report.issues?.critical?.length || 0, color: '#ef4444' },
                          { label: 'High', count: report.issues?.high?.length || 0, color: '#f97316' },
                          { label: 'Medium', count: report.issues?.medium?.length || 0, color: '#eab308' },
                          { label: 'Low / Tips', count: report.issues?.low?.length || 0, color: '#22c55e' },
                        ].map(stat => (
                          <div key={stat.label}>
                            <p style={{ fontSize: '22px', fontWeight: 700, color: stat.color, fontFamily: 'var(--f-groote)' }}>{stat.count}</p>
                            <p style={{ fontSize: '11px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Summary / page info */}
                {report.summary && (
                  <Card style={{ padding: '20px', marginBottom: '20px' }}>
                    <h4 style={{ fontFamily: 'var(--f-groote)', fontWeight: 600, fontSize: '14px', color: 'var(--clr-text)', marginBottom: '12px' }}>
                      Page Information
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                      {Object.entries(report.summary).map(([k, v]) => v && (
                        <div key={k} style={{ background: 'var(--clr-surface)', padding: '10px 12px', border: '1px solid var(--clr-border)' }}>
                          <p style={{ fontSize: '10px', color: 'var(--clr-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', fontFamily: 'var(--f-lunchtype)' }}>
                            {k.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p style={{ fontSize: '13px', color: 'var(--clr-text)', fontFamily: 'var(--f-lunchtype)', wordBreak: 'break-word' }}>
                            {typeof v === 'boolean' ? (v ? '✓ Yes' : '✗ No') : String(v)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Issues by severity */}
                {totalIssues === 0 ? (
                  <Card style={{ padding: '32px', textAlign: 'center' }}>
                    <CheckCircle size={40} style={{ color: '#22c55e', marginBottom: '12px' }} />
                    <h3 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '18px', color: 'var(--clr-text)' }}>No Issues Found</h3>
                    <p style={{ fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>This page looks great from an SEO perspective!</p>
                  </Card>
                ) : (
                  ['critical', 'high', 'medium', 'low'].map(sev => {
                    const issues = report.issues?.[sev] || [];
                    if (issues.length === 0) return null;
                    const colors = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e' };
                    return (
                      <div key={sev} style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          {severityIcon(sev)}
                          <h4 style={{
                            fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '14px',
                            color: colors[sev], textTransform: 'capitalize',
                          }}>
                            {sev} Priority ({issues.length})
                          </h4>
                        </div>
                        {issues.map((issue, i) => (
                          <IssueCard key={i} issue={issue} severity={sev} />
                        ))}
                      </div>
                    );
                  })
                )}
              </>
            )}

            {/* Empty state */}
            {!report && !isAnalyzing && (
              <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--clr-muted)' }}>
                <BarChart3 size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                <h3 style={{ fontFamily: 'var(--f-groote)', fontWeight: 600, fontSize: '18px', color: 'var(--clr-text)', marginBottom: '8px' }}>
                  Audit any website
                </h3>
                <p style={{ fontFamily: 'var(--f-lunchtype)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                  Enter a URL above to get a full SEO report: meta tags, headings, images, schema markup, Core Web Vitals signals, and more.
                </p>
              </div>
            )}
          </>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === 'history' && (
          <Card style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--f-groote)', fontWeight: 700, fontSize: '16px', color: 'var(--clr-text)' }}>
                Past Reports ({historyTotal})
              </h3>
              <Button variant="ghost" size="sm" onClick={() => fetchHistory(1)} loading={isLoadingHistory}>
                <RefreshCw size={13} style={{ marginRight: '4px' }} /> Refresh
              </Button>
            </div>

            {isLoadingHistory && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ height: '60px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', animation: 'pulse 1.5s infinite' }} />
                ))}
              </div>
            )}

            {!isLoadingHistory && history.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--clr-muted)', fontSize: '13px', fontFamily: 'var(--f-lunchtype)' }}>
                No reports yet. Analyze a URL to get started.
              </div>
            )}

            {!isLoadingHistory && history.map(r => (
              <div key={r._id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px', marginBottom: '8px',
                background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
                flexWrap: 'wrap', gap: '10px',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '13px', fontWeight: 600, color: 'var(--clr-text)',
                    fontFamily: 'var(--f-lunchtype)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{r.url}</p>
                  <p style={{ fontSize: '11px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} /> {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {r.score != null && (
                    <span style={{ fontSize: '22px', fontWeight: 700, color: gradeColor(r.grade), fontFamily: 'var(--f-groote)' }}>
                      {r.score}
                    </span>
                  )}
                  {r.grade && (
                    <span style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: gradeColor(r.grade), color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 700,
                    }}>{r.grade}</span>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => { setUrl(r.url); setActiveTab('analyze'); }}>
                    Re-analyze
                  </Button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {historyTotal > 10 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                <Button variant="ghost" size="sm" disabled={historyPage <= 1} onClick={() => fetchHistory(historyPage - 1)}>← Prev</Button>
                <span style={{ fontSize: '13px', color: 'var(--clr-muted)', alignSelf: 'center', fontFamily: 'var(--f-lunchtype)' }}>
                  Page {historyPage} of {Math.ceil(historyTotal / 10)}
                </span>
                <Button variant="ghost" size="sm" disabled={historyPage >= Math.ceil(historyTotal / 10)} onClick={() => fetchHistory(historyPage + 1)}>Next →</Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </AppShell>
  );
};

export default SeoAnalysisPage;
