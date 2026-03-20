import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headline={<>Welcome<br/><em>Back.</em></>}
      tagline="Your conversations are waiting. Pick up exactly where you left off."
    >
      <div className="auth-form-h">Sign In</div>
      <p className="auth-form-sub">
        New to LovellyLilly? <Link to="/signup">Create an account -&gt;</Link>
      </p>

      {error && (
        <div style={{
          padding: '10px 14px',
          marginBottom: '18px',
          background: 'rgba(192,57,43,0.08)',
          border: '1px solid rgba(192,57,43,0.2)',
          color: 'var(--color-danger)',
          fontSize: '13px',
          fontFamily: 'var(--f-lunchtype)',
        }}>
          {error}
        </div>
      )}

      <button className="oauth-btn" type="button" onClick={() => toast('Google sign-in is coming soon')}>
        <svg viewBox="0 0 24 24"><path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/></svg>
        Continue with Google
      </button>
      <button className="oauth-btn" type="button" onClick={() => toast('GitHub sign-in is coming soon')}>
        <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
        Continue with GitHub
      </button>

      <div className="fdiv"><div className="fdiv-line" /><span className="fdiv-txt">or email</span><div className="fdiv-line" /></div>

      <form onSubmit={handleSubmit}>
        <div className="fg"><label className="fl">Email Address</label><input className="fi" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="fg">
          <label className="fl">Password</label>
          <input className="fi" type="password" placeholder="************" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="fhint"><Link to="/forgot-password">Forgot password?</Link></div>
        </div>

        <button type="submit" className="f-submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In to LovellyLilly'}</button>
      </form>

      <p style={{ fontFamily: 'var(--f-lunchtype)', fontSize: '13px', color: 'var(--clr-muted)', textAlign: 'center', marginTop: '16px', lineHeight: '1.6' }}>
        By signing in you agree to our <a href="/terms" style={{ color: 'var(--clr-accent)', textDecoration: 'none', cursor: 'none' }}>Terms</a> &amp; <a href="/privacy" style={{ color: 'var(--clr-accent)', textDecoration: 'none', cursor: 'none' }}>Privacy Policy</a>.
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
