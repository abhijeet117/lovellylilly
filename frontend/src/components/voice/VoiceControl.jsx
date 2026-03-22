import React, { useState, useEffect, useRef } from 'react';
import { Mic, Disc, Volume2 } from 'lucide-react';

const VoiceControl = ({ onTranscript, textToSpeak, autoSpeak }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const windowSpeech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!windowSpeech) {
      // API not supported
      return;
    }

    const recognition = new windowSpeech();
    recognition.continuous = false; // Capture one phrase per hold
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error", e);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [onTranscript]);

  useEffect(() => {
    if (autoSpeak && textToSpeak && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [textToSpeak, autoSpeak]);

  const handleStartRecording = (e) => {
    e.preventDefault();
    if (!recognitionRef.current) {
      alert("Use Chrome or Edge for Voice Support.");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (!isRecording) {
      setIsRecording(true);
      try {
        recognitionRef.current.start();
      } catch (err) {}
    }
  };

  const handleStopRecording = (e) => {
    e.preventDefault();
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const stopSpeaking = (e) => {
    e.preventDefault();
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (isSpeaking) {
    return (
      <button 
        type="button" 
        onClick={stopSpeaking} 
        style={{ 
          padding: '4px', 
          color: 'var(--clr-accent)', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center' 
        }} 
        title="Stop speaking"
      >
        <Volume2 size={18} style={{ animation: 'pulse 1.5s infinite' }} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onMouseDown={handleStartRecording}
      onMouseUp={handleStopRecording}
      onMouseLeave={handleStopRecording}
      onTouchStart={handleStartRecording}
      onTouchEnd={handleStopRecording}
      style={{
        padding: '4px',
        color: isRecording ? '#ef4444' : 'var(--clr-muted)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'color 0.2s ease'
      }}
      title="Hold to speak"
    >
      {isRecording ? <Disc size={18} style={{ animation: 'pulse 1.5s infinite' }} /> : <Mic size={18} />}
    </button>
  );
};

export default VoiceControl;
