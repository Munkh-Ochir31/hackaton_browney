'use client';
import { useEffect } from 'react';
import { useVoice } from '../hooks/useVoice';
import { theme } from '../lib/theme';

export default function VoiceButton({ onTranscript, style = {} }) {
  const { transcript, isListening, startListening, stopListening, supported } = useVoice();

  useEffect(() => {
    if (transcript && onTranscript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!supported) return null;

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: theme.borderRadius.full,
        backgroundColor: isListening ? theme.colors.error : theme.colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        animation: isListening ? 'pulse 1.5s infinite' : 'none',
        transition: 'background-color 0.3s ease',
        ...style
      }}
      aria-label="Дуу хоолойгоор хайх"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
      </svg>
    </button>
  );
}
