import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `
          radial-gradient(ellipse 60% 60% at 50% 40%, rgba(66,133,244,0.06) 0%, transparent 70%),
          var(--color-void)
        `
      }}
    >
      <div
        className="w-full max-w-[420px] bg-nebula border border-stardust rounded-xl p-12"
        style={{
          boxShadow: '0 0 60px rgba(66,133,244,0.07)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
