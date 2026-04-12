import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import '../components/ui/Button.css';
import '../components/ui/Card.css';
import './BlogPage.css';

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

const CATEGORIES = ['All', 'Engineering', 'Product', 'Security', 'Design', 'Company'];

const POSTS = [
  {
    slug: 'persistent-memory-architecture',
    category: 'Engineering',
    title: 'How We Built Persistent Memory That Actually Scales',
    excerpt: "Most AI memory systems are either shallow or slow. Here's the architecture behind Lilly's context engine — and the trade-offs we made to get sub-200ms retrieval at scale.",
    author: 'Luca Ferrara',
    authorInitials: 'LF',
    date: 'Apr 8, 2025',
    readTime: '9 min read',
    featured: true,
  },
  {
    slug: 'security-by-design',
    category: 'Security',
    title: 'Security by Design: Why We Over-Engineer Auth',
    excerpt: 'JWT in httpOnly cookies. Account lockouts. IDOR prevention. We explain every security decision we made and why we went further than required.',
    author: 'James Osei',
    authorInitials: 'JO',
    date: 'Mar 28, 2025',
    readTime: '7 min read',
  },
  {
    slug: 'design-system-tokens',
    category: 'Design',
    title: 'Building a Design System That Feels Like the Product',
    excerpt: "Design tokens, CSS custom properties, and a color palette that adapts to dark mode without compromise. How we built Lilly's visual identity from first principles.",
    author: 'Priya Nair',
    authorInitials: 'PN',
    date: 'Mar 14, 2025',
    readTime: '6 min read',
  },
  {
    slug: 'multimodel-routing',
    category: 'Engineering',
    title: 'Multi-Model Routing: Choosing the Right Brain for Every Task',
    excerpt: "Not every question needs GPT-4. We built a lightweight routing layer that dispatches to Gemini, Mistral, or Anthropic based on task complexity, cost, and latency targets.",
    author: 'Luca Ferrara',
    authorInitials: 'LF',
    date: 'Feb 27, 2025',
    readTime: '11 min read',
  },
  {
    slug: 'rate-limiting-strategy',
    category: 'Engineering',
    title: 'Rate Limiting at Scale: Lessons from 10M Monthly Requests',
    excerpt: 'Per-user, per-endpoint, tiered rate limiting with Redis. What we learned, what broke, and how we redesigned the system to handle 10x growth.',
    author: 'Marcus Webb',
    authorInitials: 'MW',
    date: 'Feb 10, 2025',
    readTime: '8 min read',
  },
  {
    slug: 'product-v2-announcement',
    category: 'Product',
    title: "v2.0: Everything We've Been Building Toward",
    excerpt: 'Document vault, image studio, website builder, SEO intelligence — v2.0 is the platform we always wanted to build. Here is what changed and why.',
    author: 'Sofia Reyes',
    authorInitials: 'SR',
    date: 'Jan 30, 2025',
    readTime: '5 min read',
  },
  {
    slug: 'why-we-built-this',
    category: 'Company',
    title: 'Why We Started LovellyLilly',
    excerpt: 'Every AI tool felt like a product demo, not a thinking partner. This is the story of the frustration that became a company — and the conviction that brought a team together.',
    author: 'Aria Chen',
    authorInitials: 'AC',
    date: 'Oct 1, 2024',
    readTime: '4 min read',
  },
  {
    slug: 'gridfs-document-storage',
    category: 'Engineering',
    title: 'Why We Use GridFS for Document Storage',
    excerpt: 'S3 was the obvious choice. We chose MongoDB GridFS instead. The reasoning is less obvious than you think — and the performance numbers might surprise you.',
    author: 'Marcus Webb',
    authorInitials: 'MW',
    date: 'Jan 12, 2025',
    readTime: '6 min read',
  },
];

const CATEGORY_COLORS = {
  Engineering: 'eng',
  Product: 'prod',
  Security: 'sec',
  Design: 'des',
  Company: 'co',
};

export default function BlogPage() {
  useReveal();
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const filtered = activeCategory === 'All'
    ? POSTS
    : POSTS.filter((p) => p.category === activeCategory);

  const featured = filtered.find((p) => p.featured) || filtered[0];
  const rest = filtered.filter((p) => p !== featured);

  return (
    <div className="blog-page">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bl-hero">
        <div className="bl-hero-glow" />
        <div className="wrap bl-hero-inner">
          <motion.div
            className="pp-eyebrow rv d1"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            <span className="pp-eyebrow-line" />
            <span className="pp-eyebrow-txt">The LovellyLilly Blog</span>
          </motion.div>
          <h1 className="bl-h1 rv d2">
            Writing that<br /><em>respects your time.</em>
          </h1>
          <p className="bl-sub rv d3">
            Deep dives into engineering, product thinking, security architecture, and design craft. No fluff. No growth-hack content. Just the work.
          </p>
        </div>
      </section>

      {/* ── Filter tabs ───────────────────────────────────────────────── */}
      <div className="bl-filters-bar">
        <div className="wrap bl-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`bl-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Featured post ──────────────────────────────────────────────── */}
      {featured && (
        <section className="bl-featured-section">
          <div className="wrap">
            <div className="bl-featured rv d1">
              <div className="bl-featured-meta">
                <span className={`bl-tag bl-tag-${CATEGORY_COLORS[featured.category] || 'co'}`}>
                  {featured.category}
                </span>
                <span className="bl-meta-date">{featured.date} · {featured.readTime}</span>
              </div>
              <h2 className="bl-featured-title">{featured.title}</h2>
              <p className="bl-featured-excerpt">{featured.excerpt}</p>
              <div className="bl-featured-author">
                <div className="bl-author-avatar">{featured.authorInitials}</div>
                <span className="bl-author-name">{featured.author}</span>
                <button className="btn" style={{ marginLeft: 'auto' }}>Read Article</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Post grid ─────────────────────────────────────────────────── */}
      <section className="bl-grid-section">
        <div className="wrap">
          <div className="bl-grid">
            {rest.map((post, i) => (
              <div key={post.slug} className={`bl-card rv d${(i % 3) + 1}`}>
                <div className="bl-card-meta">
                  <span className={`bl-tag bl-tag-${CATEGORY_COLORS[post.category] || 'co'}`}>
                    {post.category}
                  </span>
                  <span className="bl-meta-date">{post.readTime}</span>
                </div>
                <h3 className="bl-card-title">{post.title}</h3>
                <p className="bl-card-excerpt">{post.excerpt}</p>
                <div className="bl-card-footer">
                  <div className="bl-author-avatar sm">{post.authorInitials}</div>
                  <div className="bl-card-author-info">
                    <span className="bl-author-name">{post.author}</span>
                    <span className="bl-meta-date">{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ─────────────────────────────────────────────────── */}
      <section className="bl-newsletter rv d1">
        <div className="wrap">
          <div className="bl-nl-inner">
            <div className="bl-nl-text">
              <h3 className="bl-nl-h">Stay in the loop.</h3>
              <p className="bl-nl-sub">New posts every two weeks. Unsubscribe any time.</p>
            </div>
            <div className="bl-nl-form">
              <input className="bl-nl-input" type="email" placeholder="your@email.com" />
              <button className="btn">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="ab-foot">
        <div className="wrap">
          <span className="ab-foot-copy">© 2025 LovellyLilly AI Inc.</span>
          <div className="ab-foot-links">
            <a href="/about">About</a>
            <a href="/careers">Careers</a>
            <a href="/press">Press</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
