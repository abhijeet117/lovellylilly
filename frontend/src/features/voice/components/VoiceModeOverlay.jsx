import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Volume2, BarChart3 } from 'lucide-react';

const NUM_BARS = 12;

const VoiceModeOverlay = ({ isOpen, onClose, onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [bars, setBars] = useState(Array(NUM_BARS).fill(4));
  const [error, setError] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  // Web Audio API refs
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const sourceRef = useRef(null);
  const animFrameRef = useRef(null);

  // Speech Recognition refs
  const recognitionRef = useRef(null);

  // ── cleanup helper ──────────────────────────────────────────────────────
  const stopAll = useCallback(() => {
    // Stop animation frame
    if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null; }
    // Stop microphone stream
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    // Disconnect audio nodes
    if (sourceRef.current) { try { sourceRef.current.disconnect(); } catch {} sourceRef.current = null; }
    // Close AudioContext
    if (audioCtxRef.current) { try { audioCtxRef.current.close(); } catch {} audioCtxRef.current = null; }
    // Stop speech recognition
    if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch {} recognitionRef.current = null; }
    setBars(Array(NUM_BARS).fill(4));
    setIsListening(false);
  }, []);

  // ── start listening ─────────────────────────────────────────────────────
  const startListening = useCallback(async () => {
    setError('');
    setTranscript('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Web Audio visualizer
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      const src = ctx.createMediaStreamSource(stream);
      sourceRef.current = src;
      src.connect(analyser);

      const dataArr = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(dataArr);
        const step = Math.floor(dataArr.length / NUM_BARS);
        setBars(Array.from({ length: NUM_BARS }, (_, i) => {
          const val = dataArr[i * step] / 255;
          return Math.max(4, Math.round(val * 60));
        }));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      animFrameRef.current = requestAnimationFrame(tick);

      // Speech Recognition (Web Speech API)
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        const recog = new SR();
        recognitionRef.current = recog;
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'en-US';
        recog.onresult = (e) => {
          let interimText = '';
          let finalText = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
            else interimText += e.results[i][0].transcript;
          }
          if (finalText && onTranscript) onTranscript(finalText.trim());
          setTranscript(finalText || interimText || '');
        };
        recog.onerror = (e) => {
          if (e.error !== 'aborted') setError('Speech recognition error: ' + e.error);
        };
        recog.start();
      }

      setIsListening(true);
    } catch (err) {
      setError(err.name === 'NotAllowedError'
        ? 'Microphone access denied. Please allow microphone access and try again.'
        : 'Could not access microphone: ' + err.message);
    }
  }, [onTranscript]);

  // ── start/stop when overlay opens/closes ────────────────────────────────
  useEffect(() => {
    if (isOpen) startListening();
    else stopAll();
    return () => stopAll();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── mute toggle ─────────────────────────────────────────────────────────
  const toggleMute = () => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach(t => { t.enabled = isMuted; });
    setIsMuted(v => !v);
  };

  // ── mic toggle (stop/restart) ────────────────────────────────────────────
  const toggleListening = () => {
    if (isListening) stopAll();
    else startListening();
  };

  // ── handle done — send transcript to chat ───────────────────────────────
  const handleDone = () => {
    if (transcript.trim() && onTranscript) onTranscript(transcript.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'color-mix(in srgb, var(--clr-bg) 96%, transparent)',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '24px',
        }}
      >
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '32px', right: '32px',
          width: '42px', height: '42px', borderRadius: '50%',
          background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--clr-muted)', cursor: 'pointer',
        }}>
          <X size={20} />
        </button>

        {/* Status badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px',
            background: 'color-mix(in srgb, var(--clr-accent) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--clr-accent) 20%, transparent)',
            borderRadius: '24px', marginBottom: '48px',
          }}
        >
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: isListening ? 'var(--clr-accent)' : 'var(--clr-muted)',
            animation: isListening ? 'pulse 1.2s infinite' : 'none',
          }} />
          <span style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
            color: 'var(--clr-accent)', fontFamily: 'var(--f-cotham)',
            textTransform: 'uppercase',
          }}>
            {isListening ? (isMuted ? 'Muted' : 'Listening…') : 'Paused'}
          </span>
        </motion.div>

        {/* Waveform visualizer */}
        <div style={{
          position: 'relative', width: '200px', height: '200px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '48px',
        }}>
          {/* Glow ring */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.22, 0.08] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'var(--clr-accent)', filter: 'blur(32px)',
            }}
          />
          {/* Circle */}
          <div style={{
            position: 'relative', width: '160px', height: '160px',
            borderRadius: '50%', border: '2px solid var(--clr-border)',
            background: 'var(--clr-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isListening ? '0 0 40px color-mix(in srgb, var(--clr-accent) 15%, transparent)' : 'none',
          }}>
            {/* Frequency bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '64px' }}>
              {bars.map((h, i) => (
                <div key={i} style={{
                  width: '6px', height: `${h}px`,
                  background: `color-mix(in srgb, var(--clr-accent) ${60 + (i / NUM_BARS) * 40}%, var(--clr-muted))`,
                  borderRadius: '3px',
                  transition: 'height 0.05s ease',
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center', marginBottom: '48px' }}>
          {error ? (
            <p style={{ fontSize: '13px', color: '#ef4444', fontFamily: 'var(--f-lunchtype)' }}>{error}</p>
          ) : (
            <>
              <h2 style={{
                fontSize: '20px', fontWeight: 500, color: 'var(--clr-text)',
                fontFamily: 'var(--f-groote)', lineHeight: 1.5, marginBottom: '8px',
                minHeight: '30px',
              }}>
                {transcript || 'Say something…'}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--clr-muted)', fontFamily: 'var(--f-lunchtype)' }}>
                {window.SpeechRecognition || window.webkitSpeechRecognition
                  ? 'Your words appear here in real time'
                  : 'Speech recognition not supported in this browser'}
              </p>
            </>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Mute */}
          <button onClick={toggleMute} style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isMuted ? '#ef4444' : 'var(--clr-muted)', cursor: 'pointer',
          }} title={isMuted ? 'Unmute' : 'Mute'}>
            <Volume2 size={20} />
          </button>

          {/* Mic toggle */}
          <button onClick={toggleListening} style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: isListening && !isMuted ? 'var(--clr-accent)' : '#ef4444',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            boxShadow: isListening && !isMuted
              ? '0 0 0 0 color-mix(in srgb, var(--clr-accent) 40%, transparent)'
              : 'none',
            animation: isListening && !isMuted ? 'pulse 2s infinite' : 'none',
            transition: 'background 0.2s ease',
          }} title={isListening ? 'Stop' : 'Start'}>
            {isListening ? <MicOff size={28} /> : <Mic size={28} />}
          </button>

          {/* Send transcript */}
          <button onClick={handleDone} disabled={!transcript.trim()} style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: transcript.trim() ? 'var(--clr-surface)' : 'transparent',
            border: '1px solid var(--clr-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: transcript.trim() ? 'var(--clr-accent)' : 'var(--clr-muted)',
            cursor: transcript.trim() ? 'pointer' : 'default',
            opacity: transcript.trim() ? 1 : 0.4,
          }} title="Send transcript to chat">
            <BarChart3 size={20} />
          </button>
        </div>

        {transcript.trim() && (
          <p style={{
            marginTop: '16px', fontSize: '12px', color: 'var(--clr-muted)',
            fontFamily: 'var(--f-lunchtype)',
          }}>
            Click the right button to send this to chat
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceModeOverlay;
