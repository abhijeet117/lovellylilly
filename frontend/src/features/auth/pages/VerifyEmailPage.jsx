import React, { useState, useEffect } from 'react';
import AuthLayout from '../../../components/layout/AuthLayout';
import Button from '../../../components/ui/Button';
import { Mail } from 'lucide-react';
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
    <AuthLayout title="Check your inbox">
      <div className="flex flex-col items-center text-center">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-full bg-brand-gradient flex items-center justify-center mb-8 shadow-brand-glow"
        >
          <Mail size={40} className="text-white" />
        </motion.div>
        
        <p className="text-[15px] text-text-secondary leading-relaxed mb-8 max-w-[320px]">
          We sent a verification link to your email address. Click it to activate your LovellyLilly AI account.
        </p>
        
        <Button 
          variant="ghost" 
          className="w-full h-12"
          onClick={handleResend}
          disabled={cooldown > 0}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Email'}
        </Button>
        
        <p className="text-[13px] text-text-muted mt-6">
          Can't find it? Check your spam or junk folder.
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
