import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import '../components/ui/Button.css';
import '../components/ui/Card.css';
import './ChangelogPage.css';

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.rv,.rv-sc').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const TAG_COLORS = {
  Feature: 'accent',
  Fix: 'fix',
  Security: 'security',
  Improvement: 'improve',
  Breaking: 'breaking',
  API: 'api',
};

const RELEASES = [
  {
    version: 'v2.4.0',
    date: 'April 2025',
    title: 'Firebase OAuth & Security Hardening',
    summary: 'Google and GitHub social login, complete security audit, and 6 major vulnerability patches.',
    items: [
      { tag: 'Feature', text: 'Google and GitHub OAuth via Firebase. One-click sign-in with popup flow and backend token verification.' },
      { tag: 'Security', text: 'Account lockout after 5 failed attempts — 15-minute cooldown with per-user tracking.' },
      { tag: 'Security', text: 'JWT tokens moved exclusively to httpOnly cookies. Tokens never exposed to JavaScript.' },
      { tag: 'Security', text: 'Added express-mongo-sanitize, xss-clean, and hpp middleware to every request.' },
      { tag: 'Security', text: 'IDOR prevention — field allowlisting in all user data mutation endpoints.' },
      { tag: 'Feature', text: 'Resend email verification with 60-second cooldown and rate limiting (3/15min).' },
      { tag: 'Improvement', text: 'Layered rate limiting: auth (15/15min), AI (30/hr), documents (50/hr), general (300/hr).' },
      { tag: 'Improvement', text: 'Winston security event logger in production. Structured JSON to logs/security.log.' },
    ],
  },
  {
    version: 'v2.3.0',
    date: 'March 2025',
    title: 'AI Studio Suite',
    summary: 'Complete AI content generation studio: images, videos, and full website builder with live preview.',
    items: [
      { tag: 'Feature', text: 'Image Studio: text-to-image via Cloudflare AI and Pollinations.ai free tier. Gallery, download, and regenerate.' },
      { tag: 'Feature', text: 'Video Studio: AI-powered short video generation from natural language prompts.' },
      { tag: 'Feature', text: 'Website Builder: describe → get full HTML/CSS/JS. Live iframe preview. Edit and export.' },
      { tag: 'Feature', text: 'SEO Intelligence: URL audit with meta analysis, keyword density, readability scores, and structured data validation.' },
      { tag: 'Improvement', text: 'AI rate limiting at 30 requests/hr per user to prevent abuse on expensive endpoints.' },
      { tag: 'Fix', text: 'Image generation timeout improved from 15s to 45s with proper error messaging.' },
    ],
  },
  {
    version: 'v2.2.0',
    date: 'February 2025',
    title: 'Document Intelligence',
    summary: 'Upload documents and chat with your knowledge base. PDF, DOCX, and text parsing via LangChain.',
    items: [
      { tag: 'Feature', text: 'Document upload: PDF, DOCX, TXT. GridFS storage — no file size limits.' },
      { tag: 'Feature', text: 'Document Chat: ask questions about your uploaded docs with full LangChain RAG pipeline.' },
      { tag: 'Feature', text: 'Document Vault: manage all uploads, view processing status, delete documents.' },
      { tag: 'Improvement', text: 'Real-time processing status with 3-second auto-poll. No manual refresh needed.' },
      { tag: 'Fix', text: 'Fixed broken document stat counter showing toString() instead of count.' },
      { tag: 'Improvement', text: 'DocChat z-index fixed — no longer clips behind modal overlays.' },
    ],
  },
  {
    version: 'v2.1.0',
    date: 'January 2025',
    title: 'Design System Overhaul',
    summary: 'Complete UI rebuild. New design token system, 4 themes, bento layout, and scroll animations.',
    items: [
      { tag: 'Feature', text: 'New design token system: CSS custom properties for all colours, spacing, typography, and radii.' },
      { tag: 'Feature', text: '4 themes: Dark, Light, Sand, Ocean — persisted to localStorage, no flash on load.' },
      { tag: 'Feature', text: 'Bento grid layout in Features section — responsive 12-column grid system.' },
      { tag: 'Improvement', text: 'Replaced blanket * transition rule with scoped interactive element selectors for better performance.' },
      { tag: 'Fix', text: 'Resolved --f-syne undefined variable across 7+ files. Renamed to --f-groote.' },
      { tag: 'Improvement', text: 'Skeleton shimmer animation using CSS custom properties — theme-aware gradients.' },
      { tag: 'Improvement', text: 'Modal, SegmentedControl, and Skeleton components fully migrated to CSS variables.' },
    ],
  },
  {
    version: 'v2.0.0',
    date: 'December 2024',
    title: 'LovellyLilly 2.0',
    summary: 'Complete platform rebuild. Multi-model AI, real-time conversations, admin dashboard, and full API.',
    items: [
      { tag: 'Feature', text: 'Multi-model AI support: Gemini, Mistral, Anthropic, OpenAI — switchable per conversation.' },
      { tag: 'Feature', text: 'Real-time streaming via Socket.io — responses appear token-by-token.' },
      { tag: 'Feature', text: 'Admin dashboard with user management, ban/unban, and conversation oversight.' },
      { tag: 'Feature', text: 'API key management — generate, view, and revoke personal API keys.' },
      { tag: 'Feature', text: 'Sandboxed code execution with 5s CPU limit and 32MB memory cap.' },
      { tag: 'Breaking', text: 'Auth cookie renamed from token to auth_token. Existing sessions invalidated on upgrade.' },
      { tag: 'API', text: 'Full REST API documented. All dashboard features accessible programmatically.' },
    ],
  },
  {
    version: 'v1.0.0',
    date: 'October 2024',
    title: 'Initial Launch',
    summary: 'First public release of LovellyLilly AI.',
    items: [
      { tag: 'Feature', text: 'Conversational AI with full message history persistence.' },
      { tag: 'Feature', text: 'User authentication: email/password with bcrypt hashing.' },
      { tag: 'Feature', text: 'Basic user settings and profile management.' },
      { tag: 'Feature', text: 'Mobile-responsive layout across all pages.' },
    ],
  },
];

const ALL_TAGS = ['All', ...Object.keys(TAG_COLORS)];

export default function ChangelogPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  useReveal();

  const filtered = RELEASES.map((r) => ({
    ...r,
    items: filter === 'All' ? r.items : r.items.filter((i) => i.tag === filter),
  })).filter((r) => r.items.length > 0);

  return (
    <div className="changelog-page">
      <Navbar />

      {/* Hero */}
      <section className="clp-hero">
        <div className="clp-hero-glow" />
        <div className="wrap clp-hero-inner">
          <span className="vis-lbl rv">Changelog</span>
          <h1 className="clp-h1 rv d1">What's new in<br /><em>LovellyLilly.</em></h1>
          <p className="clp-desc rv d2">
            Every release, every fix, every improvement — documented. We ship often and we're transparent about what changes and why.
          </p>

          {/* Filter tags */}
          <div className="clp-filters rv d3">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                className={`clp-filter-btn ${filter === tag ? 'active' : ''} ${tag !== 'All' ? `clp-filter-${TAG_COLORS[tag] || ''}` : ''}`}
                onClick={() => setFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="clp-timeline-section pad">
        <div className="wrap">
          <div className="clp-timeline">
            {filtered.map((release, ri) => (
              <div key={release.version} className="clp-release rv d1">
                {/* Version marker */}
                <div className="clp-release-head">
                  <div className="clp-dot" />
                  <div className="clp-release-meta">
                    <span className="clp-version">{release.version}</span>
                    <span className="clp-date">{release.date}</span>
                  </div>
                  <h2 className="clp-release-title">{release.title}</h2>
                  <p className="clp-release-summary">{release.summary}</p>
                </div>

                {/* Items */}
                <div className="clp-items">
                  {release.items.map((item, ii) => (
                    <div key={ii} className="clp-item">
                      <span className={`clp-tag clp-tag-${TAG_COLORS[item.tag] || 'accent'}`}>{item.tag}</span>
                      <span className="clp-item-text">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="clp-empty">
                <p>No changes found for this filter.</p>
                <button className="btn-ghost-sm" onClick={() => setFilter('All')}>Show All</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px var(--sp-4)', textAlign: 'center', background: 'var(--clr-surface)', position: 'relative', overflow: 'hidden' }}>
        <div className="cta-glow" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="cta-h2">Stay at the<br /><em>cutting edge.</em></h2>
          <p className="cta-p">We ship improvements every week. Every Pro user gets every update, automatically.</p>
          <div className="cta-actions">
            <button className="btn-primary" onClick={() => navigate('/signup')}>Get Started Free</button>
            <button className="btn-ghost" onClick={() => navigate('/api-docs')}>API Docs</button>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap foot-bottom">
          <span className="foot-copy">© 2025 LovellyLilly AI. All rights reserved.</span>
          <span className="foot-madena">Intelligence, refined.</span>
        </div>
      </footer>
    </div>
  );
}
