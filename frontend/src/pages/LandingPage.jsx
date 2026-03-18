import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import CustomCursor from '../components/ui/CustomCursor';
import '../components/ui/Button.css';
import '../components/ui/Card.css';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <>
      <CustomCursor />
      <Navbar />

      <section id="hero">
        <div className="hero-glow" />
        <div className="hero-grid-bg" />

        <div>
          <div className="hero-eyebrow rv d1">
            <div className="eyebrow-pulse" />
            <span className="lbl">LovellyLilly AI � v2.4.1 � Online</span>
          </div>

          <h1 className="hero-h1 rv d2">
            Conversational
            <em>Intelligence.</em>
          </h1>

          <p className="hero-desc rv d3">
            LovellyLilly is not another chatbot. It is a thinking companion -
            built for depth, nuance, and genuine intellectual exchange.
          </p>

          <div className="hero-actions rv d4">
            <a className="btn-primary" id="hero-reg" href="#" onClick={handleSignup}>
              Begin Conversation
              <svg style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a className="btn-ghost" href="#how">
              See How It Works
              <svg style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </a>
          </div>

          <div className="hero-proof rv d5">
            <div className="proof-ava">
              <div className="av" style={{ background: 'var(--clr-accent)' }} />
              <div className="av" style={{ background: 'var(--clr-accent2)' }} />
              <div className="av" style={{ background: '#28b0d0' }} />
              <div className="av" style={{ background: '#7a5020' }} />
            </div>
            <span className="proof-txt">Trusted by <strong>148K+</strong> thinking minds worldwide</span>
          </div>
        </div>

        <div className="rv d3">
          <div className="hero-terminal">
            <div className="t-bar">
              <span className="t-dot r" /><span className="t-dot y" /><span className="t-dot g" />
              <span className="t-ttl">LovellyLilly AI - Session #4821</span>
            </div>
            <div className="t-body" id="t-body" />
          </div>
        </div>

        <div className="scroll-cue">
          <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </section>

      <div className="ticker">
        <div className="ticker-track" id="ticker" />
      </div>

      <section id="features" className="pad">
        <div className="wrap">
          <div className="sec-head center">
            <span className="lbl sec-tag rv">Platform</span>
            <h2 className="sec-h2 rv d1">Engineered for<br/>Depth of Thought.</h2>
            <p className="sec-sub rv d2">Six capabilities that set LovellyLilly apart from the noise.</p>
          </div>

          <div className="bento">
            <div className="bc accent-bc b-7 rv-sc d1" style={{ minHeight: '290px' }}>
              <div className="bc-icon"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
              <div className="bc-n">01</div>
              <h3 className="bc-title">Contextual Memory</h3>
              <p className="bc-desc">Retains full conversation context across sessions. No repetition. Pure continuity. Lilly picks up exactly where you left off.</p>
            </div>

            <div className="bc b-5 rv-sc d2" style={{ minHeight: '290px' }}>
              <div className="bc-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg></div>
              <div className="bc-n">02</div>
              <h3 className="bc-title">Async Threads</h3>
              <p className="bc-desc">Manage dozens of parallel conversation threads. Bookmark, rename, revisit at will. Your intellectual archive, always accessible.</p>
            </div>

            <div className="bc b-4 rv-sc d3" style={{ minHeight: '220px' }}>
              <div className="bc-icon"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
              <div className="bc-n">03</div>
              <h3 className="bc-title">E2E Security</h3>
              <p className="bc-desc">Military-grade encryption. Your conversations stay yours - always private, never sold or trained on.</p>
            </div>

            <div className="bc b-4 rv-sc d4" style={{ minHeight: '220px' }}>
              <div className="bc-icon"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
              <div className="bc-n">04</div>
              <h3 className="bc-title">Live Intelligence</h3>
              <p className="bc-desc">Up-to-date knowledge. LovellyLilly doesn't get stale - she stays sharp on current events and research.</p>
            </div>

            <div className="bc b-4 rv-sc d5" style={{ minHeight: '220px' }}>
              <div className="bc-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <div className="bc-n">05</div>
              <h3 className="bc-title">Admin Dashboard</h3>
              <p className="bc-desc">Full platform visibility - user stats, activity logs, and system health at a glance for team accounts.</p>
            </div>

            <div className="bc b-8 rv-sc d6" style={{ minHeight: '160px' }}>
              <div className="bc-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div>
              <div className="bc-n">06</div>
              <h3 className="bc-title">Model Transparency</h3>
              <p className="bc-desc">Know exactly which model powers your session. No black boxes. Full audit trail. Every response attributed to its source.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="pad">
        <div className="wrap">
          <div className="sec-head rv">
            <span className="lbl sec-tag">Process</span>
            <h2 className="sec-h2">How Lilly Thinks.</h2>
            <p className="sec-sub">Four deliberate steps from prompt to profound understanding.</p>
          </div>

          <div className="how-layout">
            <div className="how-sticky rv">
              <div className="how-box">
                <div className="vis-lbl">Live Session Preview</div>
                <div className="chat-flow">
                  <div className="cf">
                    <div className="cf-av">U</div>
                    <div className="cf-bub">Help me think through the ethical implications of AI in healthcare decision-making.</div>
                  </div>
                  <div className="cf ai">
                    <div className="cf-av" style={{ background: 'rgba(201,168,76,.15)', borderColor: 'var(--clr-accent)' }}>L</div>
                    <div className="cf-bub">This is a rich question. Let me frame three tensions worth holding simultaneously...</div>
                  </div>
                  <div className="cf">
                    <div className="cf-av">U</div>
                    <div className="cf-bub">Focus on physician autonomy vs. algorithmic efficiency.</div>
                  </div>
                  <div className="cf ai">
                    <div className="cf-av" style={{ background: 'rgba(201,168,76,.15)', borderColor: 'var(--clr-accent)' }}>L</div>
                    <div className="cf-bub">When we optimise for efficiency, we embed particular value hierarchies into algorithmic outputs that physicians may feel compelled to defer to...</div>
                  </div>
                </div>
                <div className="online-row">
                  <div className="online-dot" />
                  <span className="online-txt">LovellyLilly AI � Model Active � <span style={{ color: 'var(--clr-accent)' }}>status: online</span></span>
                </div>
              </div>
            </div>

            <div className="how-steps">
              <div className="how-step rv d1">
                <div className="step-bar" />
                <div className="step-n">01</div>
                <div>
                  <div className="step-title">Create Your Account</div>
                  <p className="step-desc">Register in under 60 seconds. Verify your email and your intellectual space is ready. No credit card required to explore the free tier.</p>
                </div>
              </div>
              <div className="how-step rv d2">
                <div className="step-bar" />
                <div className="step-n">02</div>
                <div>
                  <div className="step-title">Start a Conversation Thread</div>
                  <p className="step-desc">Open a chat. Name it. Give Lilly context. She remembers everything within the thread - no repetition, no context resets mid-conversation.</p>
                </div>
              </div>
              <div className="how-step rv d3">
                <div className="step-bar" />
                <div className="step-n">03</div>
                <div>
                  <div className="step-title">Go Deep</div>
                  <p className="step-desc">Ask complex questions, iterate, push back, explore tangents. Bookmark conversations that matter. The archive grows with your thinking.</p>
                </div>
              </div>
              <div className="how-step rv d4">
                <div className="step-bar" />
                <div className="step-n">04</div>
                <div>
                  <div className="step-title">Manage Your Archive</div>
                  <p className="step-desc">Rename, save, delete, or export threads. Your intellectual history is fully in your control - not ours. Delete everything, anytime, instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="metrics">
        <div className="wrap">
          <div className="metrics-row">
            <div className="rv-sc d1">
              <div className="metric-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <div className="metric-n">148K</div>
              <div className="metric-l">Active Minds</div>
            </div>
            <div className="rv-sc d2">
              <div className="metric-icon"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
              <div className="metric-n">2.4M</div>
              <div className="metric-l">Conversations</div>
            </div>
            <div className="rv-sc d3">
              <div className="metric-icon"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
              <div className="metric-n">99.7%</div>
              <div className="metric-l">Uptime SLA</div>
            </div>
            <div className="rv-sc d4">
              <div className="metric-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
              <div className="metric-n">&lt;0.8s</div>
              <div className="metric-l">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="pad">
        <div className="wrap">
          <div className="sec-head center">
            <span className="lbl sec-tag rv">Plans</span>
            <h2 className="sec-h2 rv d1">Honest Pricing.<br/>No Dark Patterns.</h2>
            <p className="sec-sub rv d2">Choose the depth that matches your practice.</p>
          </div>

          <div className="price-row">
            <div className="pc rv-sc d1">
              <div className="pc-tier">Observer</div>
              <div className="pc-amt">$0</div>
              <div className="pc-period">/ forever free</div>
              <div className="pc-div" />
              <ul className="pc-feats">
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>20 messages per day</li>
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>3 saved threads</li>
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Standard response speed</li>
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Email verification &amp; auth</li>
                <li style={{ opacity: .4 }}><svg className="chk" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Conversation bookmarking</li>
                <li style={{ opacity: .4 }}><svg className="chk" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Priority model access</li>
              </ul>
              <button className="pc-btn" onClick={() => navigate('/signup')}>Start Free</button>
            </div>

            <div className="pc pop rv-sc d2">
              <div className="pop-badge">Most Popular</div>
              <div className="pc-tier">Practitioner</div>
              <div className="pc-amt">$19</div>
              <div className="pc-period">/ per month</div>
              <div className="pc-div" />
              <ul className="pc-feats">
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Unlimited conversations</li>
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Unlimited saved threads</li>
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Priority response speed</li>
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Full conversation bookmarking</li>
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Export conversation history</li>
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Advanced model access</li>
              </ul>
              <button className="pc-btn" onClick={() => navigate('/signup')}>Start Practitioner</button>
            </div>

            <div className="pc accent-pc rv-sc d3">
              <div className="pc-tier">Architect</div>
              <div className="pc-amt">$79</div>
              <div className="pc-period">/ per month</div>
              <div className="pc-div" />
              <ul className="pc-feats">
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Everything unlimited</li>
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Admin dashboard access</li>
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Full audit &amp; query logs</li>
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>User management console</li>
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>API rate limit expansion</li>
                <li><svg className="chk" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Dedicated support channel</li>
              </ul>
              <button className="pc-btn" onClick={() => navigate('/signup')}>Start Architect</button>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="pad">
        <div className="wrap">
          <div className="about-grid">
            <div>
              <span className="lbl rv-sl d1" style={{ display: 'block', marginBottom: '22px' }}>Philosophy</span>
              <blockquote className="about-pull rv-sl d2">
                "Intelligence should be <em>intimate</em>, not industrial.
                A conversation is a relationship, not a transaction."
              </blockquote>
              <span className="about-attr rv-sl d3">- Maya Chen, Founder � LovellyLilly AI</span>
            </div>

            <div>
              <p className="about-p rv d1">We built LovellyLilly because we were tired of AI systems that optimise for speed over substance, volume over depth. Most tools reward shallow questions and punish nuance.</p>
              <p className="about-p rv d2">Lilly is designed for the opposite impulse: for people who want to think slowly, carefully, in conversation with something that doesn't rush them toward a conclusion.</p>
              <p className="about-p rv d3">The API behind Lilly exposes only what matters - clean authentication, persistent conversation history, a health endpoint that speaks plainly. No bloat. No surveillance.</p>
              <div className="vals rv d4">
                <div className="val"><div className="val-t">Privacy First</div><div className="val-d">Your data never trains third-party models.</div></div>
                <div className="val"><div className="val-t">Honest Limits</div><div className="val-d">Lilly tells you what she doesn't know.</div></div>
                <div className="val"><div className="val-t">User Control</div><div className="val-d">Delete your account and all data, instantly.</div></div>
                <div className="val"><div className="val-t">Open Architecture</div><div className="val-d">Clean REST API. Documented routes. No black boxes.</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta">
        <div className="cta-glow" />
        <div className="cta-inner" style={{ position: 'relative', zIndex: 2 }}>
          <div className="cta-spark rv d1">
            <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <h2 className="cta-h2 rv d2">
            Start Thinking<br/>with <em>Lilly.</em>
          </h2>
          <p className="cta-p rv d3">Join 148,000+ thinkers, writers, researchers, and builders who chose depth over noise.</p>
          <div className="cta-actions rv d4">
            <a className="btn-primary" href="#" onClick={handleSignup}>
              Create Free Account
              <svg style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a className="btn-ghost" href="#" onClick={handleLogin}>
              Sign In
              <svg style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
            </a>
          </div>
          <div className="cta-nums rv d5">
            <div><div className="cn-n">2.4M+</div><div className="cn-l">Total Chats</div></div>
            <div><div className="cn-n">148K</div><div className="cn-l">Active Users</div></div>
            <div><div className="cn-n">4.9?</div><div className="cn-l">Avg Rating</div></div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="foot-logo">Lovelly<em>Lilly</em></div>
              <p className="foot-tag">Conversational intelligence for the discerning mind.</p>
              <div className="foot-socials">
                <a className="soc" href="#" title="GitHub"><svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a>
                <a className="soc" href="#" title="Twitter"><svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
                <a className="soc" href="#" title="LinkedIn"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
              </div>
            </div>
            <div>
              <div className="foot-col-h">Product</div>
              <div className="foot-links">
                <a className="foot-link" href="#features">Features</a>
                <a className="foot-link" href="#pricing">Pricing</a>
                <a className="foot-link" href="#">Changelog</a>
                <a className="foot-link" href="#">API Docs</a>
              </div>
            </div>
            <div>
              <div className="foot-col-h">Company</div>
              <div className="foot-links">
                <a className="foot-link" href="#about">About</a>
                <a className="foot-link" href="#">Blog</a>
                <a className="foot-link" href="#">Careers</a>
                <a className="foot-link" href="#">Press</a>
              </div>
            </div>
            <div>
              <div className="foot-col-h">Resources</div>
              <div className="foot-links">
                <a className="foot-link" href="#">Documentation</a>
                <a className="foot-link" href="#">Community</a>
                <a className="foot-link" href="#">Status</a>
                <a className="foot-link" href="#">System Health</a>
              </div>
            </div>
            <div>
              <div className="foot-col-h">Legal</div>
              <div className="foot-links">
                <a className="foot-link" href="#">Privacy</a>
                <a className="foot-link" href="#">Terms</a>
                <a className="foot-link" href="#">Security</a>
                <a className="foot-link" href="#">Cookies</a>
              </div>
            </div>
          </div>
          <div className="foot-bottom">
            <span className="foot-copy">� 2025 LovellyLilly AI Inc. All rights reserved.</span>
            <span className="foot-madena">Intimacy at scale.</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
