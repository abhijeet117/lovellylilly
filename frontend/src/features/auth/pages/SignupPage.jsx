import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import { useAuth } from '../hooks/useAuth';

const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function pwStr(pw){
      const f=document.getElementById('str-fill')
      if(!f) return
      const s=[pw.length>=8,/[A-Z]/.test(pw),/[0-9]/.test(pw),/[^a-zA-Z0-9]/.test(pw)].filter(Boolean).length
      f.style.width=['0%','28%','55%','78%','100%'][s]
      f.style.background=['#c0392b','#e67e22','#f1c40f','#27ae60','#27ae60'][s]
    }
    window.pwStr=pwStr
    return () => {
      if (window.pwStr === pwStr) {
        delete window.pwStr
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
      const response = await signup({ name, email, password });
      if (response.user || response.token || !response.requiresVerification) {
        navigate('/dashboard');
      } else {
        navigate('/verify-email');
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
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
      <p className="auth-form-sub">Already have an account? <Link to="/login">Sign in -&gt;</Link></p>

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

      <button className="oauth-btn" type="button">
        <svg viewBox="0 0 24 24"><path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/></svg>
        Sign up with Google
      </button>

      <div className="fdiv"><div className="fdiv-line" /><span className="fdiv-txt">or create with email</span><div className="fdiv-line" /></div>

      <form onSubmit={handleSubmit}>
        <div className="frow2">
          <div className="fg"><label className="fl">First Name</label><input className="fi" type="text" placeholder="Amara" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
          <div className="fg"><label className="fl">Last Name</label><input className="fi" type="text" placeholder="Osei" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
        </div>
        <div className="fg"><label className="fl">Email Address</label><input className="fi" type="email" placeholder="amara@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="fg">
          <label className="fl">Password</label>
          <input className="fi" type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} onInput={(e) => window.pwStr(e.target.value)} />
          <div className="str-bar"><div className="str-fill" id="str-fill" /></div>
        </div>
        <div className="fg"><label className="fl">Confirm Password</label><input className="fi" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>

        <div className="fcheck">
          <input type="checkbox" className="fcb" id="tc" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
          <label className="fcheck-lbl" htmlFor="tc">I agree to LovellyLilly's <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>. I understand my data will never be sold.</label>
        </div>
        <div className="fcheck">
          <input type="checkbox" className="fcb" id="nl" />
          <label className="fcheck-lbl" htmlFor="nl">Send me occasional feature updates. (Optional)</label>
        </div>

        <button type="submit" className="f-submit" disabled={loading}>{loading ? 'Creating account...' : 'Create My Account ->'}</button>
      </form>

      <p style={{ fontFamily: 'var(--f-lunchtype)', fontSize: '13px', color: 'var(--clr-muted)', textAlign: 'center', marginTop: '16px', lineHeight: '1.6' }}>
        A verification email will be sent. No credit card required.
      </p>
    </AuthLayout>
  );
};

export default SignupPage;
