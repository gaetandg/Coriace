import { useEffect, useRef } from 'react';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { isNativeApp } from '../lib/native';

// French text-to-speech: the phone's own engine in the Android app (the app's web view has
// none), the browser's built-in voices otherwise.
export function useSpeech(enabled: boolean) {
  const browserVoices = !isNativeApp && typeof window !== 'undefined' && 'speechSynthesis' in window;
  const supported = isNativeApp || browserVoices;
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!browserVoices) return;
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
  }, [browserVoices]);

  // A new phrase cuts the previous one so cues stay on time.
  const speak = (text: string, force = false) => {
    if (!supported || (!enabled && !force) || !text) return;
    if (isNativeApp) {
      // Each new phrase flushes the queue (the default), so it cuts the previous one.
      TextToSpeech.speak({ text, lang: 'fr-FR', rate: 1.05 }).catch(() => {});
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.rate = 1.05;
    synth.speak(utterance);
  };

  const cancel = () => {
    if (isNativeApp) TextToSpeech.stop().catch(() => {});
    else if (browserVoices) window.speechSynthesis.cancel();
  };

  return { supported, speak, cancel };
}
