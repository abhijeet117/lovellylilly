import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import PasswordStrengthMeter from '../../../components/ui/PasswordStrengthMeter';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const SignupPage = () => {
  const [firstName, setFirstName]           = useState('');
  const [lastName, setLastName]             = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms]         = useState(false);
  const [loading, setLoading]               = useState(false);
  const [googleLoading, setGoogleLoading]   = useState(false);
  const [error, setError]                   = useState('');
  const { signup, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields'); return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match'); return;
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service'); return;
    }
    setLoading(true);
    setError('');
    try {
      const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
      const response = await signup({ name, email, password });
      if (response.user || !response.requiresVerification) {
        navigate('/dashboard');
      } else {
        // Navigate to verify page with email in state so resend works immediately
        navigate('/verify-email', { state: { email } });
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!agreeTerms) { setError('Please agree to the Terms of Service first'); return; }
    setGoogleLoading(true);
    setError('');
    try {
      const result = await googleSignIn();
      if (result?.user) navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Google sign-up failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      headline={<>Your<br/><em>Thinking</em><br/>Starts Here.</>}
      tagline="Join the minds who prefer depth. First conversation always free."
    >
      <div className="prog-row">
        <div className="prog-seg done" />
        <div className="prog-seg cur" />
        <div className="prog-seg" />
        <span className="prog-lbl">Step 1 of 3</span>
      </div>

      <div className="auth-form-h">Create Account</div>
      <p className="auth-form-sub">Already have an account? <Link to="/login">Sign in →</Link></p>

      {error && (
        <div style={{ padding: '10px 14px', marginBottom: '18px', background: 'color-mix(in srgb, var(--color-danger) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-danger) 22%, transparent)', color: 'var(--color-danger)', fontSize: '13px', fontFamily: 'var(--f-lunchtype)', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      <button className="oauth-btn" type="button" onClick={handleGoogleSignup} disabled={loading || googleLoading}>
        {googleLoading
          ? <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid var(--clr-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          : <GoogleIcon />}
        {googleLoading ? 'Connecting…' : 'Sign up with Google'}
      </button>

      <div className="fdiv"><div className="fdiv-line" /><span className="fdiv-txt">or create with email</span><div className="fdiv-line" /></div>

      <form onSubmit={handleSubmit}>
        <div className="frow2">
          <div className="fg"><label className="fl">First Name</label><input className="fi" type="text" placeholder="Amara" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" /></div>
          <div className="fg"><label className="fl">Last Name</label><input className="fi" type="text" placeholder="Osei" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" /></div>
        </div>
        <div className="fg"><label className="fl">Email Address</label><input className="fi" type="email" placeholder="amara@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
        <div className="fg">
          <label className="fl">Password</label>
          <input className="fi" type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          <PasswordStrengthMeter password={password} />
        </div>
        <div className="fg"><label className="fl">Confirm Password</label><input className="fi" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" /></div>

        <div className="fcheck">
          <input type="checkbox" className="fcb" id="tc" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
          <label className="fcheck-lbl" htmlFor="tc">I agree to LovellyLilly's <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>. I understand my data will never be sold.</label>
        </div>
        <div className="fcheck">
          <input type="checkbox" className="fcb" id="nl" />
          <label className="fcheck-lbl" htmlFor="nl">Send me occasional feature updates. (Optional)</label>
        </div>

        <button type="submit" className="f-submit" disabled={loading || googleLoading}>
          {loading ? 'Creating account…' : 'Create My Account →'}
        </button>
      </form>

      <p style={{ fontFamily: 'var(--f-lunchtype)', fontSize: '13px', color: 'var(--clr-muted)', textAlign: 'center', marginTop: '16px', lineHeight: '1.6' }}>
        A verification email will be sent. No credit card required.
      </p>
    </AuthLayout>
  );
};

export default SignupPage;
