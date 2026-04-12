import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import '../components/ui/Button.css';
import '../components/ui/Card.css';
import './FeaturesPage.css';

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.rv,.rv-sc,.rv-sl').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const CATEGORIES = [
  { id: 'ai', label: 'AI Core' },
  { id: 'security', label: 'Security' },
  { id: 'studio', label: 'Studio' },
  { id: 'docs', label: 'Documents' },
  { id: 'dev', label: 'Developer' },
];

const FEATURES = {
  ai: [
    {
      title: 'Persistent Context Memory',
      desc: "Every message you've ever sent is remembered. No more repeating yourself. Lilly builds a rich mental model of your preferences, communication style, and history across every session.",
      tags: ['Core', 'Always On'],
      accent: true,
    },
    {
      title: 'Multi-Model Intelligence',
      desc: 'Access Gemini, Mistral, and Anthropic models through a single interface. Switch models mid-conversation or let Lilly automatically select the best one for your task.',
      tags: ['Pro', 'API'],
    },
    {
      title: 'Async Thread Management',
      desc: 'Branch conversations, pick up old threads, and manage dozens of active discussions without losing context. Think of it as a git history for your thoughts.',
      tags: ['Core'],
    },
    {
      title: 'Real-Time Streaming',
      desc: 'Responses stream token-by-token via WebSocket. Sub-200ms time-to-first-token ensures the conversation feels instant and alive.',
      tags: ['Core', 'Socket.io'],
    },
    {
      title: 'Tone & Style Adaptation',
      desc: 'Formal analysis, casual brainstorming, creative fiction, technical deep-dives — Lilly reads the room and adapts its communication style to match your intent.',
      tags: ['Core'],
    },
    {
      title: 'Citation & Source Grounding',
      desc: 'When Lilly draws on external knowledge, it attributes sources. No hallucinated citations — every reference traceable and honest.',
      tags: ['Pro'],
    },
  ],
  security: [
    {
      title: 'JWT + HttpOnly Cookies',
      desc: 'Authentication tokens are stored exclusively in httpOnly cookies — never exposed to JavaScript. XSS attacks cannot steal your session.',
      tags: ['Always On'],
      accent: true,
    },
    {
      title: 'Account Lockout Protection',
      desc: '5 failed login attempts triggers a 15-minute lockout with per-user tracking. Brute-force attacks are rendered mathematically impractical.',
      tags: ['Always On'],
    },
    {
      title: 'Input Sanitisation Stack',
      desc: 'NoSQL injection prevention via mongo-sanitize, XSS stripping via xss-clean, and HTTP Parameter Pollution blocking via hpp — applied to every request.',
      tags: ['Always On'],
    },
    {
      title: 'Layered Rate Limiting',
      desc: 'Auth endpoints: 15 req/15min. AI generation: 30 req/hr. Documents: 50 req/hr. Per-user keying when authenticated, per-IP when anonymous.',
      tags: ['Always On'],
    },
    {
      title: 'IDOR Prevention',
      desc: 'All user data mutations go through a strict allowlist whitelist. Fields like role, isBanned, isEmailVerified, and password are blocked at the controller layer.',
      tags: ['Always On'],
    },
    {
      title: 'Security Event Logging',
      desc: 'Winston-powered logging pipeline captures every auth event, 5xx error, and suspicious request. Structured JSON logs for production monitoring.',
      tags: ['Pro'],
    },
  ],
  studio: [
    {
      title: 'AI Image Generation',
      desc: 'Text-to-image via Cloudflare and Pollinations.ai. Free tier included. No quota anxiety — generate reference images, concepts, and art directly in your workflow.',
      tags: ['Studio'],
      accent: true,
    },
    {
      title: 'AI Video Creation',
      desc: 'Prompt-to-video pipeline powered by state-of-the-art diffusion models. Create short clips, product demos, and visual concepts without leaving the platform.',
      tags: ['Studio', 'Pro'],
    },
    {
      title: 'Website Builder',
      desc: 'Describe a website. Get back fully-functional, styled HTML/CSS/JS ready to deploy. Complete with iframe preview and live editing — no code required.',
      tags: ['Studio'],
    },
    {
      title: 'SEO Intelligence',
      desc: 'Paste a URL and get a full SEO audit: meta analysis, keyword density, readability scores, structured data validation, and actionable recommendations.',
      tags: ['Studio', 'Pro'],
    },
  ],
  docs: [
    {
      title: 'Document Upload & Parsing',
      desc: 'Drag-and-drop PDF, DOCX, and text file uploads. Lilly parses, indexes, and makes your documents immediately queryable via natural language.',
      tags: ['Documents'],
      accent: true,
    },
    {
      title: 'Document Chat',
      desc: 'Ask questions about your documents — "summarise chapter 3", "what are the key risks in this contract?", "find all mentions of the client name". Instant, accurate answers.',
      tags: ['Documents'],
    },
    {
      title: 'GridFS Storage',
      desc: 'Documents are stored in MongoDB GridFS — distributed, redundant, and scalable. No file size bottlenecks, no expiry surprises.',
      tags: ['Infrastructure'],
    },
    {
      title: 'Processing Status Tracking',
      desc: 'Real-time document processing status with auto-polling. Know exactly when your document is ready to query — no manual refreshing.',
      tags: ['Documents'],
    },
  ],
  dev: [
    {
      title: 'REST API Access',
      desc: 'Every feature available via documented REST endpoints. Build integrations, custom clients, and automations using the same API that powers the web app.',
      tags: ['API', 'Pro'],
      accent: true,
    },
    {
      title: 'API Key Management',
      desc: 'Generate, rotate, and revoke personal API keys from your settings dashboard. Fine-grained control over programmatic access.',
      tags: ['API'],
    },
    {
      title: 'Sandboxed Code Execution',
      desc: 'Execute JavaScript in a secure, resource-limited sandbox. CPU time-limited to 5 seconds, memory capped at 32MB — safe for production deployments.',
      tags: ['Developer'],
    },
    {
      title: 'WebSocket Events',
      desc: 'Real-time Socket.io events for message streaming, typing indicators, and connection status. Build reactive UIs on top of LovellyLilly with zero polling.',
      tags: ['Developer', 'Pro'],
    },
  ],
};

export default function FeaturesPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState('ai');
  useReveal();

  const features = FEATURES[active] || [];

  return (
    <div className="features-page">
      <Navbar />

      {/* Hero */}
      <section className="fp-hero">
        <div className="fp-hero-glow" />
        <div className="wrap">
          <span className="vis-lbl rv">Features</span>
          <h1 className="fp-h1 rv d1">Built for depth.<br /><em>Designed for you.</em></h1>
          <p className="fp-desc rv d2">
            Every feature in LovellyLilly was built to solve a real frustration — with AI assistants, with creative tools, and with security. Here's what's under the hood.
          </p>
          <div className="fp-actions rv d3">
            <button className="btn-primary" onClick={() => navigate('/signup')}>Try It Free</button>
            <button className="btn-ghost" onClick={() => navigate('/api-docs')}>API Docs →</button>
          </div>
        </div>
      </section>

      {/* Tab nav */}
      <div className="fp-tabs-bar">
        <div className="wrap fp-tabs-inner">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`fp-tab ${active === cat.id ? 'active' : ''}`}
              onClick={() => setActive(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feature grid */}
      <section className="fp-grid-section pad">
        <div className="wrap">
          <div className="fp-grid">
            {features.map((feat, i) => (
              <div key={feat.title} className={`bc fp-feat rv d${(i % 4) + 1} ${feat.accent ? 'accent-bc' : ''}`}>
                <div className="fp-tags">
                  {feat.tags.map((t) => (
                    <span key={t} className={`fp-tag ${feat.accent ? 'fp-tag-inv' : ''}`}>{t}</span>
                  ))}
                </div>
                <div className="bc-title">{feat.title}</div>
                <div className="bc-desc">{feat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="fp-table-section pad">
        <div className="wrap">
          <div className="pp-section-head rv">
            <span className="vis-lbl">Overview</span>
            <h2 className="fp-h2">Feature availability<br /><em>by plan.</em></h2>
          </div>
          <div className="fp-table-wrap rv d1">
            <table className="fp-table">
              <thead>
                <tr>
                  <th className="fp-th-feat">Feature</th>
                  <th>Free</th>
                  <th className="fp-th-pop">Pro</th>
                  <th>Team</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Persistent context memory', true, true, true],
                  ['Unlimited conversations', false, true, true],
                  ['Multi-model switching', false, true, true],
                  ['Image & video studio', false, true, true],
                  ['Document upload & chat', false, true, true],
                  ['API access + keys', false, true, true],
                  ['SEO analysis', false, true, true],
                  ['Sandboxed code execution', true, true, true],
                  ['Admin dashboard', false, false, true],
                  ['Priority support', false, false, true],
                ].map(([feat, free, pro, team]) => (
                  <tr key={feat}>
                    <td className="fp-td-feat">{feat}</td>
                    <td>{free ? <Chk /> : <Dash />}</td>
                    <td className="fp-td-pop">{pro ? <Chk /> : <Dash />}</td>
                    <td>{team ? <Chk /> : <Dash />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="fp-table-cta rv d2">
            <button className="btn-primary" onClick={() => navigate('/pricing')}>View Pricing →</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px var(--sp-4)', textAlign: 'center', background: 'var(--clr-surface)', position: 'relative', overflow: 'hidden' }}>
        <div className="cta-glow" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="cta-h2">Every feature.<br /><em>One platform.</em></h2>
          <p className="cta-p">No integrations to configure. No third-party tools. Everything works out of the box.</p>
          <div className="cta-actions">
            <button className="btn-primary" onClick={() => navigate('/signup')}>Get Started Free</button>
            <button className="btn-ghost" onClick={() => navigate('/pricing')}>Compare Plans</button>
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

const Chk = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const Dash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-border)" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
