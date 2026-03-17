import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Image as ImageIcon, Film, Code, MessageSquare, Search, CheckCircle, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import CustomCursor from '../components/ui/CustomCursor';
import './LandingPage.css';

const FeatureCard = ({ icon: Icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="bc"
  >
    <div className="bc-icon">
      <Icon />
    </div>
    <h4 className="bc-title">{title}</h4>
    <p className="bc-desc">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <>
      <CustomCursor />
      <Navbar />

      {/* ── HERO ── */}
      <section id="hero">
        <div className="hero-glow"></div>
        <div className="hero-grid-bg"></div>
        
        <div className="hero-content" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '720px', margin: '0 auto', gridColumn: '1 / -1' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="lbl" style={{ marginBottom: '28px' }}
          >
            LOVELYLILLY AI
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="sec-h2" style={{ marginBottom: '28px' }}
          >
            Search. Create.<br/><em>Think with AI.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hero-desc" style={{ margin: '0 auto 36px' }}
          >
            A Perplexity-style AI workspace. Real-time web search, image &amp; video generation,
            website building, and document intelligence — all in one studio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hero-actions" style={{ justifyContent: 'center' }}
          >
            <Link to="/signup">
              <button className="btn-primary">
                Start for Free
              </button>
            </Link>
            <button className="btn-ghost">
              <Play size={14} /> Watch Demo
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="lbl" style={{ color: 'var(--clr-muted)' }}
          >
            Powered by GPT-4o · Claude · Gemini
          </motion.p>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="pad" style={{ background: 'var(--clr-surface)' }}>
        <div className="wrap">
          <div className="sec-head center">
            <span className="lbl sec-tag">CAPABILITIES</span>
            <h2 className="sec-h2">
              Everything in one <em>workspace.</em>
            </h2>
            <p className="sec-sub" style={{ margin: '0 auto', maxWidth: '500px' }}>
              One platform for AI search, creation, and document intelligence.
            </p>
          </div>

          <div className="bento" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <FeatureCard icon={Globe} title="AI Chat + Web Search" description="Real-time web results with inline citations from trusted sources. Stream answers as they generate." index={0} />
            <FeatureCard icon={ImageIcon} title="Image Studio" description="Gemini Imagen 3 powered studio. Multiple aspect ratios, style presets, and history gallery." index={1} />
            <FeatureCard icon={Film} title="Video Studio" description="Generate cinematic video clips with Gemini Veo 2. Async polling with real-time status pipeline." index={2} />
            <FeatureCard icon={Code} title="Website Builder + Doc Chat" description="Build complete websites from text or chat with your PDFs, DOCX, and spreadsheets." index={3} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="pad">
        <div className="wrap">
          <div className="sec-head center">
            <span className="lbl sec-tag">HOW IT WORKS</span>
            <h2 className="sec-h2">
              From question to answer in <em>seconds.</em>
            </h2>
          </div>

          <div className="how-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {[
              { icon: MessageSquare, title: 'Ask or Upload', desc: 'Type your question or upload a document to analyze' },
              { icon: Search, title: 'AI Searches & Creates', desc: 'Langchain routes to the best model and searches the web' },
              { icon: CheckCircle, title: 'Get Sourced Results', desc: 'Receive cited, accurate, streaming answers instantly' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="how-box" style={{ padding: 'var(--sp-5)' }}
              >
                <div className="bc-icon" style={{ marginBottom: '20px', border: 'none', background: 'color-mix(in srgb, var(--clr-accent) 12%, transparent)' }}>
                  <step.icon size={26} style={{ color: 'var(--clr-accent)' }} />
                </div>
                <h4 className="step-title" style={{ fontSize: '18px' }}>
                  {step.title}
                </h4>
                <p className="step-desc" style={{ fontSize: '14px' }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="metrics">
        <div className="wrap">
          <div className="metrics-row">
            {[
              { val: '50M+', label: 'AI Queries Answered' },
              { val: '99.9%', label: 'Platform Uptime SLA' },
              { val: '<2s', label: 'Avg Response Time' },
              { val: '4', label: 'AI Studios' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="metric-icon" style={{ display: 'none' }}></div>
                <div className="metric-n">{stat.val}</div>
                <div className="metric-l">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta">
        <div className="cta-glow"></div>
        <div className="cta-spark"><svg viewBox="0 0 24 24"><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" /></svg></div>
        <h2 className="cta-h2">
          Your AI workspace starts <em>today.</em>
        </h2>
        <p className="cta-p">
          Free plan includes 100 queries/month. No credit card required.
        </p>
        <div className="cta-actions">
          <Link to="/signup">
            <button className="btn-primary">
              Create Free Account
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="wrap border-t border-[var(--clr-border)] pt-12">
          <div className="foot-grid">
            <div className="col-span-2">
              <a href="/" className="foot-logo" style={{ display: 'inline-block', marginBottom: '16px' }}>
                Lovelly<em>Lilly</em>
              </a>
              <p className="foot-tag">
                The ultimate workspace for AI productivity, creation, and research.
              </p>
            </div>
            {[
              { title: 'Product', links: ['AI Search', 'Studios', 'Doc Vault', 'Pricing'] },
              { title: 'Resources', links: ['Documentation', 'API', 'Community', 'Blog'] },
              { title: 'Legal', links: ['Terms', 'Privacy', 'Cookies'] },
            ].map((col, i) => (
              <div key={i}>
                <h5 className="foot-col-h">
                  {col.title}
                </h5>
                <ul className="foot-links">
                  {col.links.map(link => (
                    <a key={link} className="foot-link">
                      {link}
                    </a>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="foot-bottom">
            <p className="foot-copy">
              © 2025 LovellyLilly AI. All rights reserved.
            </p>
            <p className="foot-copy">
              Powered by <span style={{ color: 'var(--clr-text)' }}>Gemini &amp; Langchain</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
