import React from 'react';
import { Mic, MicOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceModal = ({ isOpen, onClose, isListening, onToggle, transcript }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-bg-surface border border-border-subtle rounded-2xl p-8 w-[400px] text-center"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-primary">
              <X size={20} />
            </button>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-text-primary">Voice Input</h2>
              <p className="text-sm text-text-muted mt-1">
                {isListening ? 'Listening...' : 'Click the mic to start'}
              </p>
            </div>
            <button
              onClick={onToggle}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${
                isListening
                  ? 'bg-semantic-danger/20 text-semantic-danger shadow-[0_0_30px_rgba(255,79,106,0.3)]'
                  : 'bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30'
              }`}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </button>
            {transcript && (
              <div className="mt-6 p-4 bg-bg-elevated rounded-lg text-sm text-text-secondary text-left">
                {transcript}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceModal;
