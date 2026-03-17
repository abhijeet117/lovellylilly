import React, { useState, useEffect } from 'react';
import AuthLayout from '../../../components/layout/AuthLayout';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const VerifyEmailPage = () => {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = () => {
    setCooldown(60);
    toast.success('Verification email sent!');
  };

  return (
    <AuthLayout
      headline={<>Almost<br/><em>There.</em></>}
      tagline="One more step to unlock your AI workspace."
    >
      <div style={{ textAlign: 'center' }}>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'rgba(var(--clr-accent-rgb), 0.12)',
            border: '1px solid var(--clr-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px', fontSize: '32px',
          }}
        >
          ✉
        </motion.div>

        <h2 className="auth-form-h">Check Your Inbox</h2>
        <p className="auth-form-sub" style={{ maxWidth: '340px', margin: '0 auto 28px' }}>
          We sent a verification link to your email address. Click it to activate your LovellyLilly AI account.
        </p>

        <button
          className="btn-ghost"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={handleResend}
          disabled={cooldown > 0}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Email'}
        </button>

        <p style={{
          fontSize: '12px', color: 'var(--clr-muted)', marginTop: '20px',
          fontFamily: 'var(--f-lunchtype)',
        }}>
          Can't find it? Check your spam or junk folder.
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
