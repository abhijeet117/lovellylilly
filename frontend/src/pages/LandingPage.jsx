import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { DUR, SPRING, SPRING_SNAPPY } from '../lib/animations/tokens';
import { useLandingPageMotion } from '../lib/animations/useLandingPageMotion';
import '../components/ui/Button.css';
import '../components/ui/Card.css';
import './LandingPage.css';

const HERO_MESSAGES = [
  { user: true, text: 'What is the relationship between language and thought?' },
  {
    user: false,
    text: 'Philosophers have debated this for centuries. Sapir-Whorf argues language shapes the very boundaries of cognition...',
  },
  { user: true, text: 'Is that deterministic or probabilistic?' },
  {
    user: false,
    text: 'The strong version is largely discredited. Linguistic relativity - the weak form - has solid empirical grounding...',
  },
  { user: true, text: 'Give me a concrete example involving colour perception.' },
  {
    user: false,
    text: 'Russian speakers have "siniy" and "goluboy" for dark and light blue, and they detect shade differences meaningfully faster...',
  },
];

const TICKER_ITEMS = [
  'Contextual Memory',
  '-',
  'Async Threads',
  '-',
  'E2E Security',
  '-',
  'Live Intelligence',
  '-',
  'Admin Dashboard',
  '-',
  'Model Transparency',
  '-',
  'Deep Conversations',
  '-',
];

const FEATURE_CARDS = [
  {
    number: '01',
    title: 'Contextual Memory',
    body: 'Retains full conversation context across sessions. No repetition. Pure continuity. Lilly picks up exactly where you left off.',
    className: 'bc accent-bc b-7 rv-sc d1 grid-item',
    minHeight: '290px',
    rust: true,
    icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  },
  {
    number: '02',
    title: 'Async Threads',
    body: 'Manage dozens of parallel conversation threads. Bookmark, rename, revisit at will. Your intellectual archive, always accessible.',
    className: 'bc b-5 rv-sc d2 grid-item',
    minHeight: '290px',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </>
    ),
  },
  {
    number: '03',
    title: 'E2E Security',
    body: 'Military-grade encryption. Your conversations stay yours - always private, never sold or trained on.',
    className: 'bc b-4 rv-sc d3 grid-item',
    minHeight: '220px',
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
  {
    number: '04',
    title: 'Live Intelligence',
    body: "Up-to-date knowledge. LovellyLilly doesn't get stale - she stays sharp on current events and research.",
    className: 'bc b-4 rv-sc d4 grid-item',
    minHeight: '220px',
    icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  },
  {
    number: '05',
    title: 'Admin Dashboard',
    body: 'Full platform visibility - user stats, activity logs, and system health at a glance for team accounts.',
    className: 'bc b-4 rv-sc d5 grid-item',
    minHeight: '220px',
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    number: '06',
    title: 'Model Transparency',
    body: 'Know exactly which model powers your session. No black boxes. Full audit trail. Every response attributed to its source.',
    className: 'bc b-8 rv-sc d6 grid-item',
    minHeight: '160px',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </>
    ),
  },
];

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Create Your Account',
    body: 'Register in under 60 seconds. Verify your email and your intellectual space is ready. No credit card required to explore the free tier.',
  },
  {
    number: '02',
    title: 'Start a Conversation Thread',
    body: 'Open a chat. Name it. Give Lilly context. She remembers everything within the thread - no repetition, no context resets mid-conversation.',
  },
  {
    number: '03',
    title: 'Go Deep',
    body: 'Ask complex questions, iterate, push back, explore tangents. Bookmark conversations that matter. The archive grows with your thinking.',
  },
  {
    number: '04',
    title: 'Manage Your Archive',
    body: 'Rename, save, delete, or export threads. Your intellectual history is fully in your control - not ours. Delete everything, anytime, instantly.',
  },
];

const PRICING_PLANS = [
  {
    tier: 'Observer',
    amount: '$0',
    period: '/ forever free',
    cta: 'Start Free',
    className: 'pc rv-sc d1 grid-item',
    hover: { y: -6 },
    features: [
      { text: '20 messages per day', available: true },
      { text: '3 saved threads', available: true },
      { text: 'Standard response speed', available: true },
      { text: 'Email verification & auth', available: true },
      { text: 'Conversation bookmarking', available: false },
      { text: 'Priority model access', available: false },
    ],
  },
  {
    tier: 'Practitioner',
    amount: '$19',
    period: '/ per month',
    cta: 'Start Practitioner',
    className: 'pc pop rv-sc d2 grid-item',
    featured: true,
    hover: { y: -8, scale: 1.01 },
    features: [
      { text: 'Unlimited conversations', available: true },
      { text: 'Unlimited saved threads', available: true },
      { text: 'Priority response speed', available: true },
      { text: 'Full conversation bookmarking', available: true },
      { text: 'Export conversation history', available: true },
      { text: 'Advanced model access', available: true },
    ],
  },
  {
    tier: 'Architect',
    amount: '$79',
    period: '/ per month',
    cta: 'Start Architect',
    className: 'pc accent-pc rv-sc d3 grid-item',
    hover: { y: -6, rotate: 0.3 },
    features: [
      { text: 'Everything unlimited', available: true },
      { text: 'Admin dashboard access', available: true },
      { text: 'Full audit & query logs', available: true },
      { text: 'User management console', available: true },
      { text: 'API rate limit expansion', available: true },
      { text: 'Dedicated support channel', available: true },
    ],
  },
];

const VALUES = [
  { title: 'Privacy First', body: 'Your data never trains third-party models.' },
  { title: 'Honest Limits', body: "Lilly tells you what she doesn't know." },
  { title: 'User Control', body: 'Delete your account and all data, instantly.' },
  { title: 'Open Architecture', body: 'Clean REST API. Documented routes. No black boxes.' },
];

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Changelog', href: '#' },
      { label: 'API Docs', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Status', href: '#' },
      { label: 'System Health', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
];

const ZERO_DURATION = { duration: 0 };
const INITIAL_DESKTOP =
  typeof window === 'undefined' ? true : window.matchMedia('(min-width: 1024px)').matches;

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(INITIAL_DESKTOP);
  const { scrollYProgress } = useScroll();
  const heroCardY = useTransform(scrollYProgress, [0, 0.4], isDesktop && !reduce ? ['0px', '-40px'] : ['0px', '0px']);
  const heroTextY = useTransform(scrollYProgress, [0, 0.4], isDesktop && !reduce ? ['0px', '-20px'] : ['0px', '0px']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], isDesktop && !reduce ? [1, 0] : [1, 1]);

  const [visibleMessages, setVisibleMessages] = useState(0);

  useEffect(() => {
    let timeout;
    if (visibleMessages < HERO_MESSAGES.length) {
      timeout = setTimeout(() => {
        setVisibleMessages(prev => prev + 1);
      }, HERO_MESSAGES[visibleMessages].user ? 600 : 1500); // 600ms for user questions, 1.5s for AI responses
    }
    return () => clearTimeout(timeout);
  }, [visibleMessages]);

  useLandingPageMotion(containerRef);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const media = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event) => setIsDesktop(event.matches);

    media.addEventListener('change', handleChange);

    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, []);

  const handleSignup = (event) => {
    event.preventDefault();
    navigate('/signup');
  };

  const handleLogin = (event) => {
    event.preventDefault();
    navigate('/login');
  };

  return (
    <>
      <div ref={containerRef}>
        <Navbar />
        <motion.section id="hero" data-section="hero" style={isDesktop && !reduce ? { opacity: heroOpacity } : undefined}>
          <div className="hero-glow" data-parallax="12" />
          <div className="hero-grid-bg" data-parallax="8" />

          <motion.div data-hero-copy style={isDesktop && !reduce ? { y: heroTextY } : undefined}>
            <div className="hero-eyebrow rv d1" data-hero-eyebrow>
              <motion.div
                className="eyebrow-pulse"
                animate={reduce ? undefined : { opacity: [1, 0.4, 1], scale: [1, 1.18, 1] }}
                transition={reduce ? ZERO_DURATION : { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              />
              <span className="lbl">LovellyLilly AI - v2.4.1 - Online</span>
            </div>

            <h1 className="hero-h1 rv d2 hero-title">
              <span className="hero-line">
                <span className="hero-line-inner" data-hero-line="1">
                  Conversational
                </span>
              </span>
              <span className="hero-line">
                <em>
                  <span className="hero-line-inner" data-hero-line="2">
                    Intelligence.
                  </span>
                </em>
              </span>
            </h1>

            <p className="hero-desc rv d3" data-hero-body>
              LovellyLilly is not another chatbot. It is a thinking companion - built for depth, nuance, and genuine intellectual exchange.
            </p>

            <div className="hero-actions rv d4">
              <motion.a
                className="btn-primary"
                id="hero-reg"
                href="#"
                data-hero-cta="1"
                onClick={handleSignup}
                whileHover={reduce ? undefined : { scale: 1.04, y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.95 }}
                transition={reduce ? ZERO_DURATION : SPRING_SNAPPY}
              >
                Begin Conversation
                <svg style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.a>
              <motion.a
                className="btn-ghost"
                href="#how"
                data-hero-cta="2"
                whileHover={reduce ? undefined : { scale: 1.03, x: 3 }}
                whileTap={reduce ? undefined : { scale: 0.95 }}
                transition={reduce ? ZERO_DURATION : SPRING_SNAPPY}
              >
                See How It Works
                <svg style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </motion.a>
            </div>

            <div className="hero-proof rv d5" data-hero-powered>
              <div className="proof-ava">
                {['var(--clr-accent)', 'var(--clr-accent2)', '#28b0d0', '#7a5020'].map((background, index) => (
                  <motion.div
                    key={background}
                    className="av"
                    data-powered-dot
                    style={{ background }}
                    animate={reduce ? undefined : { scale: [1, 1.2, 1] }}
                    transition={
                      reduce
                        ? ZERO_DURATION
                        : {
                            repeat: Infinity,
                            duration: 2,
                            ease: 'easeInOut',
                            delay: index * 0.3,
                          }
                    }
                  />
                ))}
              </div>
              <span className="proof-txt">
                Trusted by <strong>148K+</strong> thinking minds worldwide
              </span>
            </div>
          </motion.div>

          <motion.div style={isDesktop && !reduce ? { y: heroCardY } : undefined}>
            <div className="hero-terminal" data-hero-card data-clip-reveal data-parallax="6">
              <div className="t-bar">
                <span className="t-dot r" />
                <span className="t-dot y" />
                <span className="t-dot g" />
                <span className="t-ttl">LovellyLilly AI - Session #4821</span>
              </div>
              <div className="t-body" id="t-body">
                {HERO_MESSAGES.map((line, idx) => (
                  <div key={line.text} className={`t-row ${idx < visibleMessages ? 'show' : ''}`} data-chat-message>
                    {line.user ? (
                      <>
                        <span className="t-prompt">&gt;</span>
                        <span className="t-user">{line.text}</span>
                      </>
                    ) : (
                      <>
                        <span className="t-llabel">L</span>
                        <span className="t-ai">{line.text}</span>
                      </>
                    )}
                  </div>
                ))}
                {visibleMessages >= HERO_MESSAGES.length && (
                  <div className="t-row show">
                    <span className="t-prompt">&gt;</span>
                    <span className="blink cursor-blink" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="scroll-cue">
            <svg viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </motion.section>

        <div className="ticker" data-ticker>
          <div
            className="ticker-track ticker-inner"
            data-ticker-inner
            style={reduce ? undefined : { animation: 'marquee 28s linear infinite', willChange: 'transform' }}
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
              <span key={`${item}-${index}`} className={item === '-' ? 'tk-sep' : 'tk-w'}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <section id="features" className="pad" data-section="features" data-features-section>
          <div className="wrap">
            <div className="sec-head center" data-reveal>
              <span className="lbl sec-tag rv" data-features-eyebrow>
                Platform
              </span>
              <h2 className="sec-h2 rv d1 split-text" data-features-h2>
                Engineered for
                <br />
                Depth of Thought.
              </h2>
              <p className="sec-sub rv d2" data-features-sub>
                Six capabilities that set LovellyLilly apart from the noise.
              </p>
            </div>

            <motion.div className="bento grid-container">
              {FEATURE_CARDS.map((card) => (
                <motion.div
                  key={card.number}
                  className={card.className}
                  style={{ minHeight: card.minHeight }}
                  data-feature-card
                  {...(card.rust ? { 'data-feature-card-rust': '' } : {})}
                  whileHover={
                    reduce
                      ? undefined
                      : card.rust
                        ? { y: -6, scale: 1.02, boxShadow: '8px 8px 0px 0px var(--clr-text)' }
                        : { y: -6, scale: 1.015 }
                  }
                  transition={reduce ? ZERO_DURATION : SPRING_SNAPPY}
                >
                  <div className="bc-icon">
                    <svg viewBox="0 0 24 24">{card.icon}</svg>
                  </div>
                  <motion.div
                    className="bc-n"
                    initial={reduce ? false : { opacity: 0, rotate: -8, y: 10 }}
                    whileInView={reduce ? undefined : { opacity: 1, rotate: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={reduce ? ZERO_DURATION : { ...SPRING, duration: DUR.base }}
                  >
                    {card.number}
                  </motion.div>
                  <h3 className="bc-title">{card.title}</h3>
                  <p className="bc-desc">{card.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="how" className="pad" data-section="how" data-process-section>
          <div className="wrap">
            <div className="sec-head rv" data-reveal>
              <span className="lbl sec-tag" data-process-eyebrow>
                Process
              </span>
              <h2 className="sec-h2 split-text" data-process-h2>
                How Lilly Thinks.
              </h2>
              <p className="sec-sub" data-process-sub>
                Four deliberate steps from prompt to profound understanding.
              </p>
            </div>

            <div className="how-layout">
              <div className="how-sticky rv" data-reveal>
                <div className="how-box" data-process-chat>
                  <div className="vis-lbl">Live Session Preview</div>
                  <div className="chat-flow">
                    <div className="cf" data-chat-message>
                      <div className="cf-av">U</div>
                      <div className="cf-bub">Help me think through the ethical implications of AI in healthcare decision-making.</div>
                    </div>
                    <div className="cf ai" data-chat-message>
                      <div className="cf-av" style={{ background: 'rgba(201,168,76,.15)', borderColor: 'var(--clr-accent)' }}>
                        L
                      </div>
                      <div className="cf-bub">This is a rich question. Let me frame three tensions worth holding simultaneously...</div>
                    </div>
                    <div className="cf" data-chat-message>
                      <div className="cf-av">U</div>
                      <div className="cf-bub">Focus on physician autonomy vs. algorithmic efficiency.</div>
                    </div>
                    <div className="cf ai" data-chat-message>
                      <div className="cf-av" style={{ background: 'rgba(201,168,76,.15)', borderColor: 'var(--clr-accent)' }}>
                        L
                      </div>
                      <div className="cf-bub">When we optimise for efficiency, we embed particular value hierarchies into algorithmic outputs that physicians may feel compelled to defer to...</div>
                    </div>
                  </div>
                  <div className="online-row">
                    <motion.div
                      className="online-dot"
                      animate={reduce ? undefined : { opacity: [1, 0.4, 1], scale: [1, 1.18, 1] }}
                      transition={reduce ? ZERO_DURATION : { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                    />
                    <span className="online-txt">
                      LovellyLilly AI - Model Active - <span style={{ color: 'var(--clr-accent)' }}>status: online</span>
                    </span>
                  </div>
                </div>
              </div>

              <motion.div className="how-steps">
                {PROCESS_STEPS.map((step, index) => (
                  <motion.div key={step.number} className={`how-step rv d${index + 1}`} data-process-step>
                    <div className="step-bar" />
                    <motion.div
                      className="step-n"
                      data-step-number
                      initial={reduce ? false : { opacity: 0, rotate: -8, y: 10 }}
                      whileInView={reduce ? undefined : { opacity: 1, rotate: 0, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={reduce ? ZERO_DURATION : { ...SPRING, duration: DUR.base }}
                    >
                      {step.number}
                    </motion.div>
                    <div>
                      <div className="step-title" data-step-title>
                        {step.title}
                      </div>
                      <p className="step-desc" data-step-body>
                        {step.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section id="metrics" data-stats-section>
          <div className="wrap">
            <motion.div className="metrics-row grid-container">
              <motion.div className="rv-sc d1 grid-item">
                <div className="metric-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="metric-n" data-stat-value data-count="148000" data-format="k" data-suffix="K">
                  148K
                </div>
                <div className="metric-l" data-stat-label>
                  Active Minds
                </div>
              </motion.div>
              <motion.div className="rv-sc d2 grid-item">
                <div className="metric-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="metric-n" data-stat-value data-count="2400000" data-format="m" data-decimals="1" data-suffix="M">
                  2.4M
                </div>
                <div className="metric-l" data-stat-label>
                  Conversations
                </div>
              </motion.div>
              <motion.div className="rv-sc d3 grid-item">
                <div className="metric-icon">
                  <svg viewBox="0 0 24 24">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div className="metric-n" data-stat-value data-count="99.7" data-decimals="1" data-suffix="%">
                  99.7%
                </div>
                <div className="metric-l" data-stat-label>
                  Uptime SLA
                </div>
              </motion.div>
              <motion.div className="rv-sc d4 grid-item">
                <div className="metric-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="metric-n" data-stat-value data-count="0.8" data-decimals="1" data-prefix="<" data-suffix="s">
                  &lt;0.8s
                </div>
                <div className="metric-l" data-stat-label>
                  Response Time
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="pricing" className="pad" data-section="pricing" data-pricing-section>
          <div className="wrap">
            <div className="sec-head center" data-reveal>
              <span className="lbl sec-tag rv">Plans</span>
              <h2 className="sec-h2 rv d1 split-text" data-pricing-h2>
                Honest Pricing.
                <br />
                No Dark Patterns.
              </h2>
              <p className="sec-sub rv d2">Choose the depth that matches your practice.</p>
            </div>

            <motion.div className="price-row grid-container">
              {PRICING_PLANS.map((plan) => (
                  <motion.div
                    key={plan.tier}
                    className={plan.className}
                    data-pricing-card
                    {...(plan.featured ? { 'data-pricing-featured': '' } : {})}
                    whileHover={reduce ? undefined : plan.hover}
                    transition={reduce ? ZERO_DURATION : SPRING_SNAPPY}
                  >
                  {plan.featured && (
                    <motion.div
                      className="pop-badge"
                      data-pricing-badge
                      initial={reduce ? false : { scale: 0, rotate: -8, opacity: 0 }}
                      whileInView={reduce ? undefined : { scale: 1, rotate: 0, opacity: 1 }}
                      transition={reduce ? ZERO_DURATION : { type: 'spring', stiffness: 480, damping: 22, delay: 0.9 }}
                      viewport={{ once: true }}
                    >
                      Most Popular
                    </motion.div>
                  )}
                  <div className="pc-tier">{plan.tier}</div>
                  <motion.div
                    className="pc-amt"
                    initial={reduce ? false : { scale: 0.7, opacity: 0 }}
                    whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
                    transition={reduce ? ZERO_DURATION : { type: 'spring', stiffness: 400, damping: 20 }}
                    viewport={{ once: true, amount: 0.6 }}
                  >
                    {plan.amount}
                  </motion.div>
                  <div className="pc-period">{plan.period}</div>
                  <div className="pc-div" />
                  <ul className="pc-feats">
                    {plan.features.map((feature, index) => (
                      <motion.li
                        key={feature.text}
                        data-pricing-check
                        style={feature.available ? undefined : { opacity: 0.4 }}
                        initial={reduce ? false : { x: -8, opacity: 0 }}
                        whileInView={reduce ? undefined : { x: 0, opacity: feature.available ? 1 : 0.4 }}
                        transition={reduce ? ZERO_DURATION : { ...SPRING, delay: index * 0.05 }}
                        viewport={{ once: true, amount: 0.5 }}
                      >
                        <svg className="chk" viewBox="0 0 24 24">
                          {feature.available ? (
                            <polyline points="20 6 9 17 4 12" />
                          ) : (
                            <>
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </>
                          )}
                        </svg>
                        {feature.text}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.button
                    className="pc-btn"
                    onClick={() => navigate('/signup')}
                    whileHover={reduce ? undefined : { scale: 1.03 }}
                    whileTap={reduce ? undefined : { scale: 0.95 }}
                    transition={reduce ? ZERO_DURATION : SPRING_SNAPPY}
                  >
                    {plan.cta}
                  </motion.button>
                  </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="about" className="pad" data-section="about" data-quote-section>
          <div className="wrap">
            <div className="about-grid">
              <div data-reveal>
                <span className="lbl rv-sl d1" style={{ display: 'block', marginBottom: '22px' }}>
                  Philosophy
                </span>
                <blockquote className="about-pull rv-sl d2" data-quote-mark data-quote-text>
                  Intelligence should be <em className="text-rust-word">intimate</em>, not industrial. A conversation is a{' '}
                  <em className="text-rust-word">relationship</em>, not a transaction.
                </blockquote>
                <span className="about-attr rv-sl d3" data-quote-attr>
                  - Maya Chen, Founder - LovellyLilly AI
                </span>
              </div>

              <div>
                <div data-philosophy-body>
                  <p className="about-p rv d1">We built LovellyLilly because we were tired of AI systems that optimise for speed over substance, volume over depth. Most tools reward shallow questions and punish nuance.</p>
                  <p className="about-p rv d2">Lilly is designed for the opposite impulse: for people who want to think slowly, carefully, in conversation with something that doesn't rush them toward a conclusion.</p>
                  <p className="about-p rv d3">The API behind Lilly exposes only what matters - clean authentication, persistent conversation history, a health endpoint that speaks plainly. No bloat. No surveillance.</p>
                </div>
                <motion.div className="vals rv d4" data-philosophy-grid>
                  {VALUES.map((value) => (
                    <motion.div
                      key={value.title}
                      className="val"
                      initial={reduce ? false : { scale: 0.92, opacity: 0, y: 16 }}
                      whileInView={reduce ? undefined : { scale: 1, opacity: 1, y: 0 }}
                      transition={reduce ? ZERO_DURATION : { duration: 0.55, ease: 'backOut' }}
                      viewport={{ once: true, amount: 0.5 }}
                    >
                      <div className="val-t">{value.title}</div>
                      <div className="val-d">{value.body}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" data-section="cta" data-cta-section>
          <div className="cta-glow" />
          <div className="cta-inner" style={{ position: 'relative', zIndex: 2 }}>
            <motion.div
              className="cta-spark rv d1"
              data-cta-icon
              initial={reduce ? false : { scale: 0, rotate: -180, opacity: 0 }}
              whileInView={reduce ? undefined : { scale: 1, rotate: 0, opacity: 1 }}
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={reduce ? ZERO_DURATION : { repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <svg viewBox="0 0 24 24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </motion.div>
            <h2 className="cta-h2 rv d2 split-text">
              <span className="hero-line">
                <span className="hero-line-inner" data-cta-line="1">
                  Start Thinking
                </span>
              </span>{' '}
              <span className="hero-line">
                <em>
                  <span className="hero-line-inner" data-cta-line="2">
                    with Lilly.
                  </span>
                </em>
              </span>
            </h2>
            <p className="cta-p rv d3" data-cta-sub>
              Join 148,000+ thinkers, writers, researchers, and builders who chose depth over noise.
            </p>
            <div className="cta-actions rv d4">
              <motion.a
                className="btn-primary"
                href="#"
                data-cta-btn="1"
                onClick={handleSignup}
                whileHover={reduce ? undefined : { scale: 1.03 }}
                whileTap={reduce ? undefined : { scale: 0.95 }}
                transition={reduce ? ZERO_DURATION : SPRING_SNAPPY}
              >
                Create Free Account
                <svg style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.a>
              <motion.a
                className="btn-ghost"
                href="#"
                data-cta-btn="2"
                onClick={handleLogin}
                whileHover={reduce ? undefined : { scale: 1.03 }}
                whileTap={reduce ? undefined : { scale: 0.95 }}
                transition={reduce ? ZERO_DURATION : SPRING_SNAPPY}
              >
                Sign In
                <svg style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
              </motion.a>
            </div>
            <div className="cta-nums rv d5" data-cta-stats>
              <div>
                <div className="cn-n" data-count="2400000" data-format="m" data-decimals="1" data-suffix="M+">
                  2.4M+
                </div>
                <div className="cn-l">Total Chats</div>
              </div>
              <div>
                <div className="cn-n" data-count="148000" data-format="k" data-suffix="K">
                  148K
                </div>
                <div className="cn-l">Active Users</div>
              </div>
              <div>
                <div className="cn-n" data-count="4.9" data-decimals="1" data-suffix="/5">
                  4.9/5
                </div>
                <div className="cn-l">Avg Rating</div>
              </div>
            </div>
          </div>
        </section>

        <footer data-footer>
          <div className="wrap">
            <div className="foot-grid">
              <div data-footer-col>
                <div className="foot-logo" data-footer-logo>
                  Lovelly<em>Lilly</em>
                </div>
                <p className="foot-tag">Conversational intelligence for the discerning mind.</p>
                <div className="foot-socials">
                  <a className="soc" href="#" title="GitHub">
                    <svg viewBox="0 0 24 24">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </a>
                  <a className="soc" href="#" title="Twitter">
                    <svg viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    </svg>
                  </a>
                  <a className="soc" href="#" title="LinkedIn">
                    <svg viewBox="0 0 24 24">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                </div>
              </div>

              {FOOTER_COLUMNS.map((column) => (
                <div key={column.title} data-footer-col>
                  <div className="foot-col-h">{column.title}</div>
                  <div className="foot-links">
                    {column.links.map((link) => (
                      <motion.a
                        key={link.label}
                        className="foot-link"
                        href={link.href}
                        whileHover={reduce ? undefined : { x: 3, opacity: 1 }}
                        transition={reduce ? ZERO_DURATION : { duration: DUR.micro }}
                      >
                        {link.label}
                      </motion.a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="foot-bottom" data-footer-bottom>
              <span className="foot-copy">(c) 2025 LovellyLilly AI Inc. All rights reserved.</span>
              <span className="foot-madena">Intimacy at scale.</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
