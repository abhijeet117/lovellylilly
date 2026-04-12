import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import { toast } from 'react-hot-toast';
import { verifyEmail, resendVerification } from '../services/auth.api';
import { Mail, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const COOLDOWN_SECS = 60;

const VerifyEmailPage = () => {
  const { token }    = useParams();
  const location     = useLocation();
  const navigate     = useNavigate();

  // Email can come from: router state (after signup) or a manual input
  const [email, setEmail]           = useState(location.state?.email || '');
  const [showEmailInput, setShowEmailInput] = useState(false);

  const [isVerifying, setIsVerifying] = useState(Boolean(token));
  const [isVerified,  setIsVerified]  = useState(false);
  const [verifyError, setVerifyError] = useState('');

  const [cooldown,    setCooldown]    = useState(0);
  const [isSending,   setIsSending]   = useState(false);

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // ── Auto-verify when token param is present ───────────────────────────────
  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const runVerification = async () => {
      setIsVerifying(true);
      setVerifyError('');
      try {
        await verifyEmail(token);
        if (!cancelled) setIsVerified(true);
        toast.success('Email verified! You can now sign in.');
      } catch (err) {
        if (!cancelled) setVerifyError(err.response?.data?.message || 'Verification link is invalid or expired.');
      } finally {
        if (!cancelled) setIsVerifying(false);
      }
    };

    runVerification();
    return () => { cancelled = true; };
  }, [token]);

  // ── Resend handler ────────────────────────────────────────────────────────
  const handleResend = async () => {
    const targetEmail = email.trim();
    if (!targetEmail) {
      setShowEmailInput(true);
      return;
    }
    if (cooldown > 0 || isSending) return;

    setIsSending(true);
    try {
      await resendVerification(targetEmail);
      // Opaque message from backend — always show success to prevent enumeration
      toast.success('Verification email sent! Check your inbox (and spam folder).');
      setCooldown(COOLDOWN_SECS);
      setShowEmailInput(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const iconWrap = {
    width: '72px', height: '72px', borderRadius: '50%',
    background: 'color-mix(in srgb, var(--clr-accent) 12%, transparent)',
    border: '1px solid color-mix(in srgb, var(--clr-accent) 35%, transparent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 28px',
  };

  const resendBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    width: '100%', padding: '12px 20px',
    background: 'var(--clr-card)', color: 'var(--clr-text)',
    border: '1px solid var(--clr-border)', borderRadius: '10px',
    fontFamily: 'var(--f-lunchtype)', fontSize: '14px',
    cursor: cooldown > 0 || isSending ? 'default' : 'pointer',
    opacity: cooldown > 0 || isSending ? 0.6 : 1,
    transition: 'opacity 0.2s',
  };

  // ── States ────────────────────────────────────────────────────────────────

  if (isVerifying) return (
    <AuthLayout headline={<>Almost<br/><em>There.</em></>} tagline="One more step to unlock your AI workspace.">
      <div style={{ textAlign: 'center' }}>
        <div style={iconWrap}>
          <span style={{ width: 28, height: 28, border: '3px solid var(--clr-accent)', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
        </div>
        <h2 className="auth-form-h">Verifying Your Email</h2>
        <p className="auth-form-sub" style={{ maxWidth: '340px', margin: '0 auto' }}>
          Validating your link — just a second…
        </p>
      </div>
    </AuthLayout>
  );

  if (isVerified) return (
    <AuthLayout headline={<>You&apos;re<br/><em>In.</em></>} tagline="Your AI workspace is ready.">
      <div style={{ textAlign: 'center' }}>
        <div style={{ ...iconWrap, background: 'color-mix(in srgb, var(--color-success) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--color-success) 30%, transparent)' }}>
          <CheckCircle size={28} color="var(--color-success)" />
        </div>
        <h2 className="auth-form-h">Email Verified</h2>
        <p className="auth-form-sub" style={{ maxWidth: '340px', margin: '0 auto 28px' }}>
          Your account is active. Sign in to start your first conversation.
        </p>
        <Link to="/login" className="f-submit" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
          Go to Sign In
        </Link>
      </div>
    </AuthLayout>
  );

  if (token && verifyError) return (
    <AuthLayout headline={<>Almost<br/><em>There.</em></>} tagline="One more step to unlock your AI workspace.">
      <div style={{ textAlign: 'center' }}>
        <div style={{ ...iconWrap, background: 'color-mix(in srgb, var(--color-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)' }}>
          <XCircle size={28} color="var(--color-danger)" />
        </div>
        <h2 className="auth-form-h">Link Expired</h2>
        <p className="auth-form-sub" style={{ maxWidth: '340px', margin: '0 auto 28px' }}>
          {verifyError}
        </p>

        {showEmailInput && (
          <div className="fg" style={{ marginBottom: '12px', textAlign: 'left' }}>
            <label className="fl">Your email address</label>
            <input className="fi" type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleResend(); }} />
          </div>
        )}

        <button style={resendBtn} onClick={handleResend} disabled={cooldown > 0 || isSending}>
          <RefreshCw size={15} style={{ animation: isSending ? 'spin 0.8s linear infinite' : 'none' }} />
          {isSending ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Get New Verification Link'}
        </button>

        <p style={{ fontSize: '12px', color: 'var(--clr-muted)', marginTop: '16px', fontFamily: 'var(--f-lunchtype)' }}>
          Or <Link to="/signup" style={{ color: 'var(--clr-accent)' }}>create a new account</Link> if you&apos;re not registered yet.
        </p>
      </div>
    </AuthLayout>
  );

  // Default: no token — post-signup "check your inbox" screen
  return (
    <AuthLayout headline={<>Almost<br/><em>There.</em></>} tagline="One more step to unlock your AI workspace.">
      <div style={{ textAlign: 'center' }}>
        <div style={iconWrap}>
          <Mail size={28} color="var(--clr-accent)" />
        </div>

        <h2 className="auth-form-h">Check Your Inbox</h2>
        <p className="auth-form-sub" style={{ maxWidth: '360px', margin: '0 auto 28px' }}>
          We sent a verification link to <strong style={{ color: 'var(--clr-text)' }}>{email || 'your email address'}</strong>.
          Click the link to activate your account.
        </p>

        {showEmailInput && (
          <div className="fg" style={{ marginBottom: '12px', textAlign: 'left' }}>
            <label className="fl">Enter your email to resend</label>
            <input className="fi" type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleResend(); }} />
          </div>
        )}

        <button style={resendBtn} onClick={handleResend} disabled={cooldown > 0 || isSending}>
          <RefreshCw size={15} style={{ animation: isSending ? 'spin 0.8s linear infinite' : 'none' }} />
          {isSending ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
        </button>

        <p style={{ fontSize: '12px', color: 'var(--clr-muted)', marginTop: '16px', fontFamily: 'var(--f-lunchtype)', lineHeight: 1.6 }}>
          Can&apos;t find it? Check your <strong>spam or junk</strong> folder.
          <br />
          Already verified? <Link to="/login" style={{ color: 'var(--clr-accent)' }}>Sign in →</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
