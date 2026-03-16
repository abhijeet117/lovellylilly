import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../../components/layout/AuthLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // API call placeholder
      setIsSubmitted(true);
      toast.success('Reset link sent!');
    } catch (err) {
      toast.error('Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout title="Reset link sent!">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-semantic-success/10 flex items-center justify-center mb-6 border border-semantic-success/20">
            <CheckCircle size={32} className="text-semantic-success" />
          </div>
          <p className="text-[15px] text-text-secondary mb-8">
            Check your email for the password reset link.
          </p>
          <Link to="/login" className="w-full">
            <Button variant="ghost" className="w-full h-12">Back to login</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset your password" 
      subtitle="Enter your email and we'll send a reset link."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input 
          label="Email address" 
          type="email" 
          placeholder="name@company.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" isLoading={isLoading} className="h-12 w-full">
          Send Reset Link
        </Button>
        <div className="text-center">
          <Link to="/login" className="text-[14px] text-text-secondary hover:text-text-primary transition-colors">
            Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
