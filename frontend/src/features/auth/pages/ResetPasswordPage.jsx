import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import PasswordStrengthMeter from '../../../components/ui/PasswordStrengthMeter';
import { toast } from 'react-hot-toast';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setIsLoading(true);
    try {
      // API call placeholder
      toast.success('Password updated. Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create new password" 
      subtitle="Choose a strong password for your account."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Input 
            label="New Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <Input 
          label="Confirm Password" 
          type="password" 
          placeholder="••••••••" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading} className="h-12 w-full mt-2">
          Update Password
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
