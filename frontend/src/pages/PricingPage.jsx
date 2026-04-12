import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import '../components/ui/Button.css';
import '../components/ui/Card.css';
import './PricingPage.css';

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

const PLANS = [
  {
    tier: 'Free',
    price: { monthly: '$0', annual: '$0' },
    period: 'forever',
    desc: 'Everything you need to explore LovellyLilly. No credit card required.',
    features: [
      '50 messages / day',
      'Persistent context (7-day window)',
      'Sandboxed code execution',
      'Basic chat themes',
      'Email support',
    ],
    cta: 'Get Started',
    pop: false,
    accent: false,
  },
  {
    tier: 'Pro',
    price: { monthly: '$18', annual: '$14' },
    period: 'per month',
    desc: 'Unlimited intelligence. The full studio. API access. Everything Lilly can do.',
    features: [
      'Unlimited messages',
      'Full persistent memory',
      'Image, video & website studio',
      'Document upload + chat',
      'Multi-model switching',
      'API access & key management',
      'SEO intelligence suite',
      'Priority response queue',
      'Priority support',
    ],
    cta: 'Start Pro',
    pop: true,
    accent: true,
  },
  {
    tier: 'Team',
    price: { monthly: '$52', annual: '$42' },
    period: 'per month · up to 5 seats',
    desc: 'Shared workspace, admin controls, and team-wide usage analytics.',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Admin dashboard',
      'Shared conversation threads',
      'Usage analytics',
      'Centralised billing',
      'SLA uptime guarantee',
      'Dedicated onboarding',
    ],
    cta: 'Contact Sales',
    pop: false,
    accent: false,
  },
];

const FAQS = [
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes. Upgrade or downgrade whenever you want. When upgrading, the new plan takes effect immediately and billing is prorated. Downgrades take effect at the end of the current billing cycle.',
  },
  {
    q: 'What counts as a "message"?',
    a: 'One message is one user turn — the question or prompt you send. Lilly\'s response does not count toward your limit. On Pro and Team, there are no limits.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes — all new accounts get a 7-day Pro trial automatically. No credit card required to start. You\'ll be prompted to enter payment details only if you choose to continue.',
  },
  {
    q: 'How does annual billing work?',
    a: 'Annual plans are billed once per year at the discounted rate. You save approximately 22% compared to monthly billing. Refunds for unused months are available within the first 30 days.',
  },
  {
    q: 'Do you offer student or non-profit discounts?',
    a: 'Yes. Students and qualifying non-profits can apply for a 50% discount. Email us with verification and we\'ll set it up within 48 hours.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'Your conversation history, documents, and generated content remain accessible for 90 days after cancellation. You can export everything as JSON before deletion.',
  },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  useReveal();

  return (
    <div className="pricing-page">
      <Navbar />

      {/* Hero */}
      <section className="prp-hero">
        <div className="prp-hero-glow" />
        <div className="wrap prp-hero-inner">
          <span className="vis-lbl rv">Pricing</span>
          <h1 className="prp-h1 rv d1">Simple pricing.<br /><em>No surprises.</em></h1>
          <p className="prp-desc rv d2">
            Start free. Upgrade when you're ready. Cancel any time. Every plan includes our full security stack — no safety corners cut.
          </p>

          {/* Billing toggle */}
          <div className="prp-toggle rv d3">
            <span className={`prp-tgl-lbl ${!annual ? 'active' : ''}`}>Monthly</span>
            <button
              className={`prp-tgl-btn ${annual ? 'on' : ''}`}
              onClick={() => setAnnual((p) => !p)}
              aria-label="Toggle annual billing"
            >
              <span className="prp-tgl-thumb" />
            </button>
            <span className={`prp-tgl-lbl ${annual ? 'active' : ''}`}>
              Annual
              <span className="prp-save-badge">Save 22%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="prp-plans pad">
        <div className="wrap">
          <div className="prp-grid">
            {PLANS.map((plan, i) => (
              <div key={plan.tier} className={`pc rv d${i + 1} ${plan.pop ? 'pop' : ''} ${plan.accent ? 'accent-pc' : ''}`}>
                {plan.pop && <span className="pop-badge">Most Popular</span>}

                <div className="pc-tier">{plan.tier}</div>
                <div className="pc-amt">{annual ? plan.price.annual : plan.price.monthly}</div>
                <div className="pc-period">{plan.period}{annual && plan.tier !== 'Free' ? ' · billed annually' : ''}</div>
                <p className="prp-plan-desc">{plan.desc}</p>
                <div className="pc-div" />

                <ul className="pc-feats">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className="pc-btn"
                  onClick={() => plan.tier === 'Team' ? null : navigate('/signup')}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise bar */}
      <div className="prp-ent-bar">
        <div className="wrap prp-ent-inner rv">
          <div>
            <div className="prp-ent-title">Need more than 5 seats?</div>
            <div className="prp-ent-desc">Enterprise plans with custom limits, SSO, SAML, dedicated infrastructure, and SLAs up to 99.99%.</div>
          </div>
          <button className="btn-ghost-sm" onClick={() => navigate('/signup')}>Talk to Sales →</button>
        </div>
      </div>

      {/* FAQ */}
      <section className="prp-faq pad">
        <div className="wrap">
          <div className="pp-section-head rv">
            <span className="vis-lbl">FAQ</span>
            <h2 className="prp-h2">Common questions.</h2>
          </div>
          <div className="prp-faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className={`prp-faq-item rv d${(i % 3) + 1}`}>
                <button
                  className={`prp-faq-q ${openFaq === i ? 'open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <svg className="prp-faq-ico" viewBox="0 0 24 24">
                    <path d={openFaq === i ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="prp-faq-a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px var(--sp-4)', textAlign: 'center', background: 'var(--clr-surface)', position: 'relative', overflow: 'hidden' }}>
        <div className="cta-glow" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="cta-h2">Start free.<br /><em>Think deeper.</em></h2>
          <p className="cta-p">No credit card. No commitment. Just intelligence on demand.</p>
          <div className="cta-actions">
            <button className="btn-primary" onClick={() => navigate('/signup')}>Create Free Account</button>
            <button className="btn-ghost" onClick={() => navigate('/features')}>See All Features</button>
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
