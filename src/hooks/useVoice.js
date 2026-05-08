'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { blobToWav } from '../lib/audioToWav';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useVoice = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' &&
        !!navigator.mediaDevices?.getUserMedia &&
        !!window.MediaRecorder) {
      setSupported(true);
    }
  }, []);

  const startListening = useCallback(async () => {
    if (isListening) return;
    setError(null);
    setTranscript('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        const rawBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (rawBlob.size < 1000) {
          setError('Дуу хэт богино байна');
          setIsListening(false);
          return;
        }

        try {
          const wavBlob = await blobToWav(rawBlob, 16000);

          const fd = new FormData();
          fd.append('audio', wavBlob, 'voice.wav');

          const token = localStorage.getItem('auth_token');
          const headers = {};
          if (token) headers.Authorization = `Bearer ${token}`;

          const res = await fetch(`${API_URL}/api/voice/stt`, {
            method: 'POST',
            headers,
            body: fd,
          });
          const data = await res.json();

          if (!res.ok) {
            setError(data.message || 'STT амжилтгүй');
          } else {
            const text = data.data?.text || data.text;
            if (text) {
              setTranscript(text);
            } else {
              setError('Уг ярианаас текст танигдсангүй');
            }
          }
        } catch (err) {
          setError('Сүлжээний алдаа: ' + err.message);
        } finally {
          setIsListening(false);
        }
      };

      recorder.start();
      setIsListening(true);
    } catch (err) {
      setError('Микрофон ашиглах эрх алга: ' + err.message);
      setIsListening(false);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
    } else if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setIsListening(false);
    }
  }, []);

  return { transcript, isListening, startListening, stopListening, supported, error };
};
