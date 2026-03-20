import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { verifyEmail } from '../services/auth.api';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [cooldown, setCooldown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(Boolean(token));
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [cooldown]);

  useEffect(() => {
    if (!token) return;

    const runVerification = async () => {
      setIsVerifying(true);
      setVerifyError('');
      try {
        await verifyEmail(token);
        setIsVerified(true);
        toast.success('Email verified. You can now sign in.');
      } catch (err) {
        setVerifyError(err.response?.data?.message || 'Verification link is invalid or expired.');
      } finally {
        setIsVerifying(false);
      }
    };

    runVerification();
  }, [token]);

  const handleResend = () => {
    setCooldown(60);
    toast('Resend is not available yet. Please re-register to receive a fresh link.');
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
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(var(--clr-accent-rgb), 0.12)',
            border: '1px solid var(--clr-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
            fontSize: '24px',
            fontWeight: 700,
            fontFamily: 'var(--f-cotham)',
          }}
        >
          @
        </motion.div>

        {isVerifying ? (
          <>
            <h2 className="auth-form-h">Verifying Your Email</h2>
            <p className="auth-form-sub" style={{ maxWidth: '340px', margin: '0 auto 28px' }}>
              Please wait while we validate your verification link.
            </p>
          </>
        ) : isVerified ? (
          <>
            <h2 className="auth-form-h">Email Verified</h2>
            <p className="auth-form-sub" style={{ maxWidth: '340px', margin: '0 auto 28px' }}>
              Your account is active now. Sign in to continue.
            </p>
            <Link to="/login" className="f-submit" style={{ display: 'inline-flex', justifyContent: 'center', textDecoration: 'none' }}>
              Go to Sign In
            </Link>
          </>
        ) : token ? (
          <>
            <h2 className="auth-form-h">Verification Failed</h2>
            <p className="auth-form-sub" style={{ maxWidth: '340px', margin: '0 auto 28px' }}>
              {verifyError || 'This verification link is no longer valid.'}
            </p>
            <button
              className="btn-ghost"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleResend}
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Get New Verification Link'}
            </button>
          </>
        ) : (
          <>
            <h2 className="auth-form-h">Check Your Inbox</h2>
            <p className="auth-form-sub" style={{ maxWidth: '340px', margin: '0 auto 28px' }}>
              We sent a verification link to your email address. Click it to activate your account.
            </p>
            <button
              className="btn-ghost"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleResend}
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Email'}
            </button>
          </>
        )}

        <p
          style={{
            fontSize: '12px',
            color: 'var(--clr-muted)',
            marginTop: '20px',
            fontFamily: 'var(--f-lunchtype)',
          }}
        >
          Can&apos;t find it? Check your spam or junk folder.
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
