import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import '../components/ui/Button.css';
import '../components/ui/Card.css';
import './ProductPage.css';

/* ── Scroll-reveal hook ────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv,.rv-sc,.rv-sl');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Data ──────────────────────────────────────────────────────────────── */
const CAPABILITIES = [
  {
    icon: (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    ),
    title: 'Deep Conversations',
    desc: 'Full context retention across every exchange. Lilly remembers your threads, your preferences, and your style — no reset, ever.',
  },
  {
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
      </>
    ),
    title: 'Live Intelligence',
    desc: "Plugged into real-time data. Current events, live research, and up-to-the-minute facts — Lilly knows what's happening now.",
  },
  {
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </>
    ),
    title: 'Multi-Modal Studio',
    desc: 'Generate images, videos, and full websites from natural language. One platform — every creative output format.',
  },
  {
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </>
    ),
    title: 'End-to-End Security',
    desc: 'JWT auth, bcrypt hashing, rate limiting, XSS protection, and IDOR prevention. Your data stays yours — always.',
  },
  {
    icon: (
      <>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </>
    ),
    title: 'Code Execution',
    desc: 'Sandboxed, safe code runner for JS — validate logic, explore algorithms, and see results instantly in-chat.',
  },
  {
    icon: (
      <>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </>
    ),
    title: 'Document Intelligence',
    desc: 'Upload PDFs and docs — ask questions, extract insights, and chat with your knowledge base in real time.',
  },
];

const USE_CASES = [
  { label: 'Research', title: 'Academic & Deep Research', body: 'Ask complex questions, synthesise sources, and get cited, nuanced answers. Not just summaries — genuine intellectual work.', accent: true },
  { label: 'Creative', title: 'Writing & Creative Work', body: 'From story arcs to marketing copy — Lilly matches your voice and helps you write at your best.', accent: false },
  { label: 'Technical', title: 'Code & Engineering', body: 'Pair-programming, architecture reviews, debugging, and full code generation with sandboxed execution.', accent: false },
  { label: 'Business', title: 'Strategy & Analysis', body: 'Competitive analysis, product thinking, investment research — get a sharp mind on your toughest business problems.', accent: false },
];

const STATS = [
  { n: '99.9%', l: 'Uptime SLA' },
  { n: '<200ms', l: 'Avg Response' },
  { n: '100K+', l: 'Messages Daily' },
  { n: '4.9★', l: 'User Rating' },
];

/* ── Component ─────────────────────────────────────────────────────────── */
export default function ProductPage() {
  const navigate = useNavigate();
  useReveal();

  return (
    <div className="product-page">
      <Navbar />

      {/* ── HERO ── */}
      <section className="pp-hero">
        <div className="pp-hero-glow" />
        <div className="pp-hero-grid" />
        <div className="pp-hero-inner wrap">
          <motion.div
            className="pp-eyebrow rv d1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow-pulse" />
            <span className="pp-eyebrow-txt">The Product</span>
          </motion.div>

          <motion.h1
            className="pp-h1"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Intelligence<br /><em>that thinks</em><br />with you.
          </motion.h1>

          <motion.p
            className="pp-desc"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            LovellyLilly is not a chatbot. It is a thinking companion — built for depth, nuance, and genuine intellectual exchange. Every conversation is a collaboration.
          </motion.p>

          <motion.div
            className="pp-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              Start Free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
            <button className="btn-ghost" onClick={() => navigate('/features')}>
              Explore Features
            </button>
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="pp-stats-bar">
          {STATS.map((s) => (
            <div key={s.l} className="pp-stat">
              <span className="pp-stat-n">{s.n}</span>
              <span className="pp-stat-l">{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="pp-caps pad" id="capabilities">
        <div className="wrap">
          <div className="pp-section-head rv">
            <span className="vis-lbl">Capabilities</span>
            <h2 className="pp-h2">Everything you need.<br /><em>Nothing you don't.</em></h2>
            <p className="pp-section-desc">Six core pillars that make LovellyLilly the most complete AI companion available.</p>
          </div>
          <div className="pp-caps-grid">
            {CAPABILITIES.map((cap, i) => (
              <div key={cap.title} className={`bc rv d${(i % 6) + 1}`}>
                <div className="bc-icon">
                  <svg viewBox="0 0 24 24">{cap.icon}</svg>
                </div>
                <div className="bc-title">{cap.title}</div>
                <div className="bc-desc">{cap.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="pp-use pad" id="use-cases">
        <div className="wrap">
          <div className="pp-section-head rv">
            <span className="vis-lbl">Use Cases</span>
            <h2 className="pp-h2">Built for how<br /><em>you actually work.</em></h2>
          </div>
          <div className="pp-use-grid">
            {USE_CASES.map((uc, i) => (
              <div key={uc.title} className={`bc rv d${i + 1} ${uc.accent ? 'accent-bc' : ''}`}>
                <div className="pp-use-label">{uc.label}</div>
                <div className="bc-title">{uc.title}</div>
                <div className="bc-desc">{uc.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="pp-phil pad">
        <div className="wrap">
          <div className="pp-phil-inner how-box rv">
            <div className="pp-phil-q">
              <span className="vis-lbl">Philosophy</span>
              <blockquote className="about-pull">
                We believe intelligence should feel like a <em>partner</em>, not a tool.
                <span className="about-attr">— LovellyLilly Design Principle</span>
              </blockquote>
            </div>
            <div className="pp-phil-copy">
              <p className="about-p">
                Most AI systems optimise for speed. LovellyLilly optimises for depth. Every response is considered, contextualised, and crafted to advance the conversation — not just answer it.
              </p>
              <p className="about-p">
                We built Lilly to be the kind of thinking partner you actually want to talk to: one that challenges your assumptions, expands your perspective, and helps you arrive at better ideas.
              </p>
              <button className="btn-ghost-sm" onClick={() => navigate('/signup')} style={{ marginTop: '8px' }}>
                Experience It →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" style={{ padding: '120px var(--sp-4)', textAlign: 'center', background: 'var(--clr-surface)', position: 'relative', overflow: 'hidden' }}>
        <div className="cta-glow" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="cta-h2">Start thinking<br /><em>differently.</em></h2>
          <p className="cta-p">Join thousands of curious minds already using LovellyLilly to think deeper, create faster, and work smarter.</p>
          <div className="cta-actions">
            <button className="btn-primary" onClick={() => navigate('/signup')}>Get Started Free</button>
            <button className="btn-ghost" onClick={() => navigate('/pricing')}>See Pricing</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="wrap foot-bottom" style={{ justifyContent: 'space-between' }}>
          <span className="foot-copy">© 2025 LovellyLilly AI. All rights reserved.</span>
          <span className="foot-madena">Intelligence, refined.</span>
        </div>
      </footer>
    </div>
  );
}
