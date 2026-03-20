import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import Input from '../../../components/ui/Input';
import { toast } from 'react-hot-toast';
import { forgotPassword } from '../services/auth.api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Reset link sent!');
    } catch {
      toast.error('Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout
        headline={<>Check Your<br/><em>Inbox.</em></>}
        tagline="We've sent a password reset link to your email."
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: '28px',
          }}>
            OK
          </div>
          <h2 className="auth-form-h">Reset Link Sent</h2>
          <p className="auth-form-sub">Check your email for the password reset link.</p>
          <Link
            to="/login"
            className="f-submit"
            style={{ width: '100%', justifyContent: 'center', display: 'inline-flex', textDecoration: 'none', background: 'var(--clr-card)', color: 'var(--clr-text)', border: '1px solid var(--clr-border)', clipPath: 'none' }}
          >
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      headline={<>Reset Your<br/><em>Password.</em></>}
      tagline="Enter your email and we'll send a reset link."
    >
      <h2 className="auth-form-h">Forgot Password</h2>
      <p className="auth-form-sub">
        Remember it? <Link to="/login">Sign in instead</Link>
      </p>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="f-submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
