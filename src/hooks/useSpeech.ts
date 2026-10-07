import { useEffect, useRef } from 'react';

// French text-to-speech with the browser's built-in voices.
export function useSpeech(enabled: boolean) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!supported) return;
    // Voices load asynchronously in some browsers.
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceRef.current =
        voices.find(v => v.lang === 'fr-FR' && v.localService) ||
        voices.find(v => v.lang === 'fr-FR') ||
        voices.find(v => v.lang.startsWith('fr')) ||
        null;
    };
    pickVoice();
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pickVoice);
  }, [supported]);

  // A new phrase cuts the previous one so cues stay on time.
  const speak = (text: string, force = false) => {
    if (!supported || (!enabled && !force) || !text) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.rate = 1.05;
    synth.speak(utterance);
  };

  const cancel = () => {
    if (supported) window.speechSynthesis.cancel();
  };

  return { supported, speak, cancel };
}
