import React from 'react';

const AuthLayout = ({ children, headline, tagline, quote, quoteAuthor }) => {
  return (
    <div
      className="min-h-screen grid auth-layout"
      style={{
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--clr-bg)',
      }}
    >
      {/* Left — Editorial Panel */}
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
          <div className="flex gap-9 mb-sp-8" style={{ marginBottom: 'var(--sp-8)' }}>
            <div>
              <div style={{ fontFamily: 'var(--f-doll)', fontSize: '2rem', letterSpacing: '2px', color: 'var(--clr-accent)' }}>148K</div>
              <div className="fl" style={{ marginTop: '3px' }}>Active Minds</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--f-doll)', fontSize: '2rem', letterSpacing: '2px', color: 'var(--clr-accent)' }}>2.4M</div>
              <div className="fl" style={{ marginTop: '3px' }}>Conversations</div>
            </div>
          </div>
          <div className="auth-quote">
            <p className="aq-txt">
              {quote || "\"Lilly doesn't just answer. She thinks with you. It's the first AI I've actually argued with — and been grateful for it.\""}
            </p>
            <div className="aq-auth">
              {quoteAuthor || '— Dr. S. Achebe, Research Fellow, Lagos'}
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          {children}
        </div>
      </div>

      {/* Mobile: auth-left is hidden at 768px via CSS */}
      <style>{`
        @media (max-width: 768px) {
          .auth-layout { grid-template-columns: 1fr !important; }
          .auth-left { display: none !important; }
          .auth-right { padding: 56px 24px !important; }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
