import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Volume2, VolumeX, BarChart3, Waves } from 'lucide-react';

const VoiceModeOverlay = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsListening(true);
      // Mock volume animation
      const interval = setInterval(() => {
        setVolume(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setIsListening(false);
      setVolume(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-bg-base/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full bg-bg-surface hover:bg-bg-hover text-text-muted hover:text-text-primary transition-all border border-border-default"
        >
          <X size={24} />
        </button>

        {/* Status Badge */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full mb-12"
        >
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
          <span className="text-[12px] font-bold text-brand-primary uppercase tracking-widest">Listening...</span>
        </motion.div>

        {/* Visualization */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-16">
          <motion.div 
             animate={{ 
               scale: [1, 1.2, 1],
               opacity: [0.1, 0.3, 0.1]
             }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute inset-0 rounded-full bg-brand-primary/20 blur-3xl" 
          />
          <div className="relative z-10 w-48 h-48 rounded-full border-4 border-border-default flex items-center justify-center overflow-hidden bg-bg-surface shadow-[0_0_80px_rgba(79,126,255,0.15)]">
             <div className="flex items-end gap-1.5 h-16">
                {[...Array(12)].map((_, i) => (
                   <motion.div 
                     key={i}
                     animate={{ 
                        height: isListening ? [20, Math.random() * 60 + 20, 20] : 20 
                     }}
                     transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                     className="w-2 bg-brand-gradient rounded-full"
                   />
                ))}
             </div>
          </div>
        </div>

        {/* Transcript Area */}
        <div className="max-w-[600px] w-full text-center">
           <h2 className="text-2xl font-medium text-text-primary mb-4 leading-relaxed">
              {transcript || "How can I help you today?"}
           </h2>
           <p className="text-text-muted text-[15px]">
              {isListening ? "Try saying: 'What's the weather like?' or 'Create an image of a cat'" : "Tap the mic to start speaking"}
           </p>
        </div>

        {/* Controls */}
        <div className="mt-auto mb-12 flex items-center gap-6">
           <button className="p-4 rounded-full bg-bg-surface border border-border-default text-text-muted hover:text-text-primary transition-all">
              <Volume2 size={24} />
           </button>
           <button 
             onClick={() => setIsListening(!isListening)}
             className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-brand-glow transition-all active:scale-95 ${isListening ? 'bg-semantic-danger shadow-[0_0_30px_rgba(255,79,106,0.2)]' : 'bg-brand-primary'}`}
           >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
           </button>
           <button className="p-4 rounded-full bg-bg-surface border border-border-default text-text-muted hover:text-text-primary transition-all">
              <BarChart3 size={24} />
           </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceModeOverlay;
