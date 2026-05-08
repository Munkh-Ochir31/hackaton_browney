'use client';
import { useState, useEffect, useCallback } from 'react';

export const useVoice = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = 'mn-MN';

        recog.onresult = (event) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          setIsListening(false);
        };

        recog.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          if (event.error === 'language-not-supported') {
            recog.lang = 'en-US'; // Fallback
          } else {
             setIsListening(false);
          }
        };

        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      setTranscript('');
      setIsListening(true);
      try {
        recognition.start();
      } catch (e) {
         setIsListening(false);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  return { transcript, isListening, startListening, stopListening, supported };
};
