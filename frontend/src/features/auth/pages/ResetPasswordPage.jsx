import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import Input from '../../../components/ui/Input';
import PasswordStrengthMeter from '../../../components/ui/PasswordStrengthMeter';
import { toast } from 'react-hot-toast';
import { resetPassword } from '../services/auth.api';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      return toast.error('Reset link is invalid');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setIsLoading(true);
    try {
      await resetPassword(token, password);
      toast.success('Password updated. Please sign in.');
      navigate('/login');
    } catch {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      headline={<>Create a New<br/><em>Password.</em></>}
      tagline="Choose a strong password for your account."
    >
      <h2 className="auth-form-h">New Password</h2>
      <p className="auth-form-sub">Choose something strong and memorable.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <Input
            label="New Password"
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordStrengthMeter password={password} />
        </div>
        <Input
          label="Confirm Password"
          type="password"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="f-submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;

