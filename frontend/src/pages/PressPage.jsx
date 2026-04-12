import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import '../components/ui/Button.css';
import '../components/ui/Card.css';
import './PressPage.css';

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

const COVERAGE = [
  {
    outlet: 'TechCrunch',
    headline: "LovellyLilly wants to be the AI that actually remembers you",
    date: 'Feb 2025',
    excerpt: "Unlike most AI chat products, LovellyLilly's memory architecture persists context across sessions — a technical and product challenge most competitors have quietly avoided.",
    url: '#',
  },
  {
    outlet: 'The Verge',
    headline: "The AI assistant that treats security as a feature, not an afterthought",
    date: 'Mar 2025',
    excerpt: "In a category where security is an afterthought, LovellyLilly has built layered defences — httpOnly tokens, rate limiting, IDOR prevention — from day one.",
    url: '#',
  },
  {
    outlet: 'Wired',
    headline: "Is this the AI interface design finally got right?",
    date: 'Jan 2025',
    excerpt: "LovellyLilly represents a new kind of AI product: one where the design team clearly had equal standing with engineering from the very first commit.",
    url: '#',
  },
  {
    outlet: 'Product Hunt',
    headline: "#1 Product of the Day — LovellyLilly v2.0",
    date: 'Jan 2025',
    excerpt: "v2.0 launched with a document vault, image studio, website builder, and a redesigned conversation interface. The community voted it Product of the Day.",
    url: '#',
  },
  {
    outlet: 'Hacker News',
    headline: "Show HN: We built persistent AI memory without a vector database",
    date: 'Nov 2024',
    excerpt: "Our CTO wrote about the architecture behind context persistence. 400+ points and 200 comments — the thread that launched our first wave of users.",
    url: '#',
  },
  {
    outlet: 'Fast Company',
    headline: "These are the AI startups redefining what a chatbot can be",
    date: 'Apr 2025',
    excerpt: "LovellyLilly earns its place on this list by doing something few AI products manage: feeling genuinely useful rather than genuinely impressive.",
    url: '#',
  },
];

const ASSETS = [
  { label: 'Logo Pack (SVG + PNG)', size: '2.1 MB', icon: '🎨' },
  { label: 'Product Screenshots', size: '8.4 MB', icon: '🖥️' },
  { label: 'Founder Headshots', size: '5.2 MB', icon: '📷' },
  { label: 'Brand Guidelines PDF', size: '1.8 MB', icon: '📐' },
  { label: 'Company Fact Sheet', size: '320 KB', icon: '📋' },
  { label: 'Press Release Archive', size: '740 KB', icon: '📰' },
];

const FACTS = [
  { stat: '$4.2M', label: 'Seed Round' },
  { stat: '100K+', label: 'Registered Users' },
  { stat: '2023', label: 'Founded' },
  { stat: '18', label: 'Team Members' },
  { stat: '99.9%', label: 'Uptime SLA' },
  { stat: '<200ms', label: 'Median Response' },
];

export default function PressPage() {
  useReveal();

  return (
    <div className="press-page">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pr-hero">
        <div className="pr-hero-glow" />
        <div className="wrap pr-hero-inner">
          <motion.div
            className="pp-eyebrow rv d1"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            <span className="pp-eyebrow-line" />
            <span className="pp-eyebrow-txt">Press &amp; Media</span>
          </motion.div>
          <h1 className="pr-h1 rv d2">
            For journalists<br /><em>and storytellers.</em>
          </h1>
          <p className="pr-sub rv d3">
            Brand assets, company facts, press coverage, and a direct line to our media team. Everything you need to tell the LovellyLilly story accurately.
          </p>
          <div className="pr-contact-bar rv d4">
            <span className="pr-contact-label">Media enquiries:</span>
            <a className="pr-contact-email" href="mailto:press@lovellylilly.ai">press@lovellylilly.ai</a>
            <span className="pr-contact-note">We respond within 4 hours on weekdays.</span>
          </div>
        </div>
      </section>

      {/* ── Fast facts ────────────────────────────────────────────────────── */}
      <section className="pr-facts">
        <div className="wrap">
          <div className="pr-facts-grid">
            {FACTS.map((f, i) => (
              <div key={f.label} className={`pr-fact rv d${i + 1}`}>
                <span className="pr-fact-num">{f.stat}</span>
                <span className="pr-fact-lbl">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press Coverage ────────────────────────────────────────────────── */}
      <section className="pr-coverage">
        <div className="wrap">
          <div className="pr-sec-head rv d1">
            <span className="pr-section-label">In the News</span>
            <h2 className="pr-h2">How the world sees us.</h2>
          </div>
          <div className="pr-coverage-grid">
            {COVERAGE.map((item, i) => (
              <a
                key={item.headline}
                href={item.url}
                className={`pr-coverage-card rv d${(i % 3) + 1}`}
              >
                <div className="pr-coverage-top">
                  <span className="pr-outlet">{item.outlet}</span>
                  <span className="pr-cov-date">{item.date}</span>
                </div>
                <h3 className="pr-cov-headline">{item.headline}</h3>
                <p className="pr-cov-excerpt">{item.excerpt}</p>
                <span className="pr-read-link">Read article →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Assets ─────────────────────────────────────────────────── */}
      <section className="pr-assets">
        <div className="wrap">
          <div className="pr-sec-head rv d1">
            <span className="pr-section-label">Brand Assets</span>
            <h2 className="pr-h2">Everything you need.</h2>
            <p className="pr-assets-note rv d2">
              Use these assets in editorial coverage. Please do not modify logos or use brand assets for commercial purposes without written permission.
            </p>
          </div>
          <div className="pr-assets-grid rv d2">
            {ASSETS.map((asset) => (
              <div key={asset.label} className="pr-asset-row">
                <span className="pr-asset-icon">{asset.icon}</span>
                <div className="pr-asset-info">
                  <span className="pr-asset-name">{asset.label}</span>
                  <span className="pr-asset-size">{asset.size}</span>
                </div>
                <button className="btn btn-sm btn-ghost">Download</button>
              </div>
            ))}
          </div>
          <div className="pr-assets-bundle rv d3">
            <button className="btn">Download Full Press Kit</button>
          </div>
        </div>
      </section>

      {/* ── Boilerplate ────────────────────────────────────────────────────── */}
      <section className="pr-boilerplate">
        <div className="wrap">
          <div className="pr-sec-head rv d1">
            <span className="pr-section-label">Approved Language</span>
            <h2 className="pr-h2">Company boilerplate.</h2>
          </div>
          <div className="pr-boiler-card rv d2">
            <p className="pr-boiler-text">
              LovellyLilly is an AI-powered conversational intelligence platform built for depth, privacy, and speed. Founded in 2023, LovellyLilly provides persistent memory, multi-model AI routing, document intelligence, and a full creative studio — all behind a security-first architecture. Headquartered in San Francisco with a fully remote team of 18, LovellyLilly is backed by Horizon Ventures, Asymmetric Capital, and Calm Fund.
            </p>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigator.clipboard?.writeText(document.querySelector('.pr-boiler-text')?.textContent || '')}
            >
              Copy to clipboard
            </button>
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────────────────── */}
      <section className="pr-contact rv d1">
        <div className="wrap">
          <div className="pr-contact-card">
            <div className="pr-contact-left">
              <span className="pr-section-label">Media Contact</span>
              <h3 className="pr-contact-name">Sofia Reyes</h3>
              <span className="pr-contact-title">Head of Product &amp; Communications</span>
              <a className="pr-contact-email-link" href="mailto:press@lovellylilly.ai">
                press@lovellylilly.ai
              </a>
            </div>
            <div className="pr-contact-right">
              <p className="pr-contact-blurb">
                For interview requests, product briefings, embargoed announcements, and fact-checking, reach out directly. We aim to respond within 4 business hours and are happy to arrange calls on short notice for time-sensitive stories.
              </p>
              <a className="btn" href="mailto:press@lovellylilly.ai">Send a Media Request</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="ab-foot">
        <div className="wrap">
          <span className="ab-foot-copy">© 2025 LovellyLilly AI Inc.</span>
          <div className="ab-foot-links">
            <a href="/about">About</a>
            <a href="/blog">Blog</a>
            <a href="/careers">Careers</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
