import React from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children, headline, tagline, quote, quoteAuthor }) => {
  return (
    <div className="auth-ov show vis">
      <div className="auth-left">
        <div className="al-inner">
          <a className="auth-brand" href="/">
            Lovelly<em>Lilly</em>
          </a>
          <h2 className="auth-hl">
            {headline || <>Welcome<br/><em>Back.</em></>}
          </h2>
          <p className="auth-tl">
            {tagline || 'Your conversations are waiting.\nPick up exactly where you left off.'}
          </p>
          <div style={{ display: 'flex', gap: '36px', marginBottom: 'var(--sp-8)' }}>
            <div>
              <div style={{ fontFamily: 'var(--f-doll)', fontSize: '2rem', letterSpacing: '2px', color: 'var(--clr-accent)' }}>148K</div>
              <div style={{ fontFamily: 'var(--f-cotham)', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-muted)', marginTop: '3px' }}>Active Minds</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--f-doll)', fontSize: '2rem', letterSpacing: '2px', color: 'var(--clr-accent)' }}>2.4M</div>
              <div style={{ fontFamily: 'var(--f-cotham)', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--clr-muted)', marginTop: '3px' }}>Conversations</div>
            </div>
          </div>
          <div className="auth-quote">
            <p className="aq-txt">
              {quote || "\"Lilly doesn't just answer. She thinks with you. It's the first AI I've actually argued with - and been grateful for it.\""}
            </p>
            <div className="aq-auth">
              {quoteAuthor || '- Dr. S. Achebe, Research Fellow, Lagos'}
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
