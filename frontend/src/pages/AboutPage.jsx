import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import '../components/ui/Button.css';
import '../components/ui/Card.css';
import './AboutPage.css';

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

const TEAM = [
  {
    name: 'Aria Chen',
    role: 'Co-founder & CEO',
    bio: 'Former ML researcher at DeepMind. Obsessed with making AI feel genuinely human.',
    initials: 'AC',
    accent: true,
  },
  {
    name: 'Marcus Webb',
    role: 'Co-founder & CTO',
    bio: 'Built distributed systems at Stripe for 6 years. Believes great infrastructure is invisible.',
    initials: 'MW',
  },
  {
    name: 'Priya Nair',
    role: 'Head of Design',
    bio: 'Designed interfaces at Figma and Linear. Every pixel either earns its place or gets cut.',
    initials: 'PN',
  },
  {
    name: 'James Osei',
    role: 'Head of Security',
    bio: 'Pentester turned defender. Has found vulnerabilities in systems most people thought were safe.',
    initials: 'JO',
  },
  {
    name: 'Sofia Reyes',
    role: 'Head of Product',
    bio: "Previously PM at Notion and Vercel. Thinks deeply about what users actually need vs. what they ask for.",
    initials: 'SR',
  },
  {
    name: 'Luca Ferrara',
    role: 'Lead AI Engineer',
    bio: 'Fine-tuned LLMs at Mistral. Passionate about context windows, memory architectures, and inference speed.',
    initials: 'LF',
  },
];

const VALUES = [
  {
    icon: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    ),
    title: 'Radical Honesty',
    body: "We tell users what Lilly can and can't do. We don't oversell. We don't hide limitations behind marketing language.",
  },
  {
    icon: (
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    ),
    title: 'Privacy by Design',
    body: 'Your conversations are yours. We architect around minimal data exposure — not because we have to, but because it is the right way to build.',
  },
  {
    icon: (
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    ),
    title: 'Speed as a Feature',
    body: "Latency is a UX problem. We obsess over time-to-first-token, streaming performance, and making every interaction feel instant.",
  },
  {
    icon: (
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />,
    ),
    title: 'Built for Humans',
    body: 'Not power users. Not developers. Not enterprises. Every design decision starts with the person who just wants help thinking more clearly.',
  },
];

export default function AboutPage() {
  useReveal();
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="ab-hero">
        <div className="ab-hero-glow" />
        <div className="ab-hero-grid" />
        <div className="wrap ab-hero-inner">
          <motion.div
            className="pp-eyebrow rv d1"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            <span className="pp-eyebrow-line" />
            <span className="pp-eyebrow-txt">About LovellyLilly</span>
          </motion.div>
          <h1 className="ab-h1 rv d2">
            We build AI<br />
            <em>worth trusting.</em>
          </h1>
          <p className="ab-sub rv d3">
            LovellyLilly started with a simple frustration: every AI tool felt like a product demo, not a thinking partner. We set out to fix that — with depth, with craft, and with no shortcuts on security.
          </p>
        </div>
      </section>

      {/* ── Mission ─────────────────────────────────────────────────────── */}
      <section className="ab-mission">
        <div className="wrap">
          <div className="ab-mission-grid">
            <div className="ab-mission-left rv d1">
              <span className="ab-section-label">Our Mission</span>
              <h2 className="ab-h2">Conversational intelligence for the discerning mind.</h2>
            </div>
            <div className="ab-mission-right rv d2">
              <p>
                Most AI products optimise for engagement metrics. We optimise for something harder: genuine usefulness. That means a memory system that persists, a security model that does not compromise, and an interface that respects your time and intelligence.
              </p>
              <p>
                We are a small team of researchers, engineers, and designers who believe that the most valuable technology disappears into the background — leaving only the clarity it creates.
              </p>
              <div className="ab-stat-row">
                <div className="ab-stat">
                  <span className="ab-stat-num">2023</span>
                  <span className="ab-stat-lbl">Founded</span>
                </div>
                <div className="ab-stat">
                  <span className="ab-stat-num">18</span>
                  <span className="ab-stat-lbl">Team members</span>
                </div>
                <div className="ab-stat">
                  <span className="ab-stat-num">100K+</span>
                  <span className="ab-stat-lbl">Users</span>
                </div>
                <div className="ab-stat">
                  <span className="ab-stat-num">4.9★</span>
                  <span className="ab-stat-lbl">Avg rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────────────────── */}
      <section className="ab-values">
        <div className="wrap">
          <div className="ab-sec-head rv d1">
            <span className="ab-section-label">What We Stand For</span>
            <h2 className="ab-h2">Principles, not platitudes.</h2>
          </div>
          <div className="ab-values-grid">
            {VALUES.map((v, i) => (
              <div key={v.title} className={`bc rv d${i + 1}`}>
                <div className="bc-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {v.icon}
                  </svg>
                </div>
                <h3 className="bc-title">{v.title}</h3>
                <p className="bc-body">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ────────────────────────────────────────────────────────── */}
      <section className="ab-team">
        <div className="wrap">
          <div className="ab-sec-head rv d1">
            <span className="ab-section-label">The Team</span>
            <h2 className="ab-h2">The people behind the product.</h2>
          </div>
          <div className="ab-team-grid">
            {TEAM.map((member, i) => (
              <div key={member.name} className={`ab-team-card rv d${(i % 3) + 1}`}>
                <div className={`ab-avatar ${member.accent ? 'accent' : ''}`}>
                  {member.initials}
                </div>
                <div className="ab-member-info">
                  <span className="ab-member-name">{member.name}</span>
                  <span className="ab-member-role">{member.role}</span>
                  <p className="ab-member-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Investors ───────────────────────────────────────────────────── */}
      <section className="ab-investors">
        <div className="wrap">
          <div className="ab-sec-head rv d1">
            <span className="ab-section-label">Backed By</span>
            <h2 className="ab-h2">Built to last.</h2>
            <p className="ab-inv-sub rv d2">
              We raised a $4.2M seed round from investors who share our conviction that AI should earn trust, not demand it.
            </p>
          </div>
          <div className="ab-inv-row rv d2">
            {['Horizon Ventures', 'Asymmetric Capital', 'Seed Club', 'Notion Capital', 'Calm Fund'].map((inv) => (
              <div key={inv} className="ab-inv-chip">{inv}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="ab-cta rv d1">
        <div className="wrap">
          <div className="ab-cta-inner">
            <h2 className="ab-cta-h">Want to build with us?</h2>
            <p className="ab-cta-sub">
              {"We're always looking for curious, principled engineers, designers, and researchers."}
            </p>
            <div className="ab-cta-btns">
              <button className="btn" onClick={() => navigate('/careers')}>See Open Roles</button>
              <button className="btn btn-ghost" onClick={() => navigate('/press')}>Press & Media</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="ab-foot">
        <div className="wrap">
          <span className="ab-foot-copy">© 2025 LovellyLilly AI Inc.</span>
          <div className="ab-foot-links">
            <a href="/careers">Careers</a>
            <a href="/press">Press</a>
            <a href="/blog">Blog</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
