import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import '../components/ui/Button.css';
import '../components/ui/Card.css';
import './CareersPage.css';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv,.rv-sc');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const DEPARTMENTS = ['All', 'Engineering', 'Design', 'Product', 'Security', 'Operations'];

const ROLES = [
  {
    title: 'Senior Backend Engineer — AI Infrastructure',
    dept: 'Engineering',
    location: 'Remote (UTC-8 to UTC+2)',
    type: 'Full-time',
    level: 'Senior',
    desc: "You'll own the systems that make Lilly's memory and multi-model routing work at scale. Node.js, MongoDB, Redis, and a healthy obsession with latency.",
  },
  {
    title: 'Staff Frontend Engineer — Core Product',
    dept: 'Engineering',
    location: 'Remote (UTC-8 to UTC+2)',
    type: 'Full-time',
    level: 'Staff',
    desc: "The UI layer that millions of conversations flow through. React, Framer Motion, CSS that actually makes sense. You care about pixels and you care about performance.",
  },
  {
    title: 'Product Designer — Conversation Interface',
    dept: 'Design',
    location: 'Remote / San Francisco',
    type: 'Full-time',
    level: 'Mid',
    desc: "Designing the space where humans think with AI. You've shipped interfaces that felt inevitable. You understand typography, motion, and interaction at a deep level.",
  },
  {
    title: 'Security Engineer — Application Security',
    dept: 'Security',
    location: 'Remote',
    type: 'Full-time',
    level: 'Senior',
    desc: 'We ship security features, not security theatre. Own our threat model, run pentests, and architect defences that hold up under real pressure.',
  },
  {
    title: 'ML Engineer — Retrieval & Memory',
    dept: 'Engineering',
    location: 'Remote (UTC-8 to UTC+2)',
    type: 'Full-time',
    level: 'Senior',
    desc: 'The intelligence behind how Lilly remembers. Embedding models, vector search, retrieval augmented generation — and making it fast enough to feel real.',
  },
  {
    title: 'Product Manager — Developer Platform',
    dept: 'Product',
    location: 'Remote / San Francisco',
    type: 'Full-time',
    level: 'Senior',
    desc: "Define and ship the API platform that developers build on. You've shipped developer tools before and know what makes an API actually enjoyable to use.",
  },
  {
    title: 'Head of Operations',
    dept: 'Operations',
    location: 'San Francisco (preferred)',
    type: 'Full-time',
    level: 'Lead',
    desc: "Scale the infrastructure that makes a 20-person company work like a 200-person one. Finance, legal ops, vendor management, and the systems that keep us running.",
  },
  {
    title: 'Motion Designer — Brand & Product',
    dept: 'Design',
    location: 'Remote',
    type: 'Contract',
    level: 'Mid',
    desc: 'Framer Motion, Lottie, and raw CSS transitions. Bring the product to life with motion that feels considered rather than decorative.',
  },
];

const PERKS = [
  { icon: '🌍', title: 'Fully Remote', desc: 'Work from anywhere within our time zone windows. We care about overlap, not location.' },
  { icon: '💸', title: 'Competitive Equity', desc: "Early-stage equity with a fair strike price. You're building this company with us." },
  { icon: '🏥', title: 'Full Health Coverage', desc: 'Medical, dental, and vision. 100% covered for you, 80% for dependants.' },
  { icon: '📚', title: '$3K Learning Budget', desc: 'Courses, conferences, books, hardware. Spend it on growth — no receipts audit.' },
  { icon: '🧘', title: 'Async by Default', desc: 'Meetings are optional. We write things down. Deep work is protected.' },
  { icon: '✈️', title: 'Twice-Yearly Offsites', desc: 'We fly the whole company together twice a year. Work, eat, think, and actually meet.' },
];

const LEVEL_COLORS = { Senior: 'sr', Staff: 'stf', Mid: 'mid', Lead: 'lead' };
const TYPE_COLORS = { 'Full-time': 'ft', Contract: 'ct' };

export default function CareersPage() {
  useReveal();
  const [activeDept, setActiveDept] = useState('All');
  const [openRole, setOpenRole] = useState(null);

  const filtered = activeDept === 'All'
    ? ROLES
    : ROLES.filter((r) => r.dept === activeDept);

  return (
    <div className="careers-page">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="cr-hero">
        <div className="cr-hero-glow" />
        <div className="wrap cr-hero-inner">
          <motion.div
            className="pp-eyebrow rv d1"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            <span className="pp-eyebrow-line" />
            <span className="pp-eyebrow-txt">Careers at LovellyLilly</span>
          </motion.div>
          <h1 className="cr-h1 rv d2">
            Build something<br /><em>worth caring about.</em>
          </h1>
          <p className="cr-sub rv d3">
            We are a small team of engineers, designers, and researchers who believe the best products come from people who genuinely use what they build. We are hiring carefully.
          </p>
          <div className="cr-hero-chips rv d4">
            <span className="cr-chip">18 people</span>
            <span className="cr-chip">Fully remote</span>
            <span className="cr-chip">Series A in 2025</span>
            <span className="cr-chip">{filtered.length} open roles</span>
          </div>
        </div>
      </section>

      {/* ── Perks ─────────────────────────────────────────────────────────── */}
      <section className="cr-perks">
        <div className="wrap">
          <div className="cr-sec-head rv d1">
            <span className="cr-section-label">Why Join</span>
            <h2 className="cr-h2">{"What you'll get."}</h2>
          </div>
          <div className="cr-perks-grid">
            {PERKS.map((perk, i) => (
              <div key={perk.title} className={`bc rv d${(i % 3) + 1}`}>
                <div className="cr-perk-icon">{perk.icon}</div>
                <h3 className="bc-title">{perk.title}</h3>
                <p className="bc-body">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open roles ────────────────────────────────────────────────────── */}
      <section className="cr-roles">
        <div className="wrap">
          <div className="cr-sec-head rv d1">
            <span className="cr-section-label">Open Positions</span>
            <h2 className="cr-h2">{filtered.length} role{filtered.length !== 1 ? 's' : ''} open.</h2>
          </div>

          {/* Dept filter */}
          <div className="cr-dept-filters rv d2">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                className={`cr-dept-btn ${activeDept === dept ? 'active' : ''}`}
                onClick={() => setActiveDept(dept)}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="cr-roles-list">
            {filtered.map((role, i) => (
              <div
                key={role.title}
                className={`cr-role-row rv d${(i % 4) + 1} ${openRole === role.title ? 'open' : ''}`}
                onClick={() => setOpenRole(openRole === role.title ? null : role.title)}
              >
                <div className="cr-role-main">
                  <div className="cr-role-info">
                    <h3 className="cr-role-title">{role.title}</h3>
                    <div className="cr-role-meta">
                      <span className="cr-role-loc">📍 {role.location}</span>
                      <span className={`cr-badge cr-badge-${LEVEL_COLORS[role.level] || 'mid'}`}>{role.level}</span>
                      <span className={`cr-badge cr-badge-${TYPE_COLORS[role.type] || 'ft'}`}>{role.type}</span>
                    </div>
                  </div>
                  <div className="cr-role-chevron">{openRole === role.title ? '−' : '+'}</div>
                </div>
                {openRole === role.title && (
                  <div className="cr-role-body">
                    <p className="cr-role-desc">{role.desc}</p>
                    <div className="cr-role-actions">
                      <button className="btn">Apply Now</button>
                      <span className="cr-dept-tag">{role.dept}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ────────────────────────────────────────────────────────── */}
      <section className="cr-process">
        <div className="wrap">
          <div className="cr-sec-head rv d1">
            <span className="cr-section-label">The Process</span>
            <h2 className="cr-h2">What to expect.</h2>
          </div>
          <div className="cr-process-steps">
            {[
              { n: '01', title: 'Application', desc: 'Send us your work. We read every application personally. No ATS black holes.' },
              { n: '02', title: 'Intro Call', desc: '30 minutes with the hiring manager. We ask questions; you ask better ones.' },
              { n: '03', title: 'Work Sample', desc: 'A small, paid, relevant task. Usually 2-4 hours. We respect your time.' },
              { n: '04', title: 'Team Interviews', desc: 'Two conversations with people you would work with directly.' },
              { n: '05', title: 'Offer', desc: 'Transparent compensation breakdown, equity details, and a decision within 48 hours.' },
            ].map((step, i) => (
              <div key={step.n} className={`cr-step rv d${i + 1}`}>
                <span className="cr-step-n">{step.n}</span>
                <div className="cr-step-content">
                  <h4 className="cr-step-title">{step.title}</h4>
                  <p className="cr-step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="cr-cta rv d1">
        <div className="wrap">
          <div className="cr-cta-inner">
            <h2 className="cr-cta-h">{"Don't see a fit?"}</h2>
            <p className="cr-cta-sub">We hire for values and craft over job descriptions. Send us what you are working on.</p>
            <a className="btn" href="mailto:careers@lovellylilly.ai">Send an Introduction</a>
          </div>
        </div>
      </section>

      <footer className="ab-foot">
        <div className="wrap">
          <span className="ab-foot-copy">© 2025 LovellyLilly AI Inc.</span>
          <div className="ab-foot-links">
            <a href="/about">About</a>
            <a href="/blog">Blog</a>
            <a href="/press">Press</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
