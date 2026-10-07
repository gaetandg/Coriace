import { useRef } from 'react';

// Beeps synthesized with the Web Audio API.
export function useBeep(enabled: boolean) {
  // Audio Context Ref to preserve browser interaction policy
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    // Resume context if suspended (browser requirements)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const beep = (frequency: number, duration: number) => {
    if (!enabled) return;
    try {
      initAudio();
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Avoid clicking noises with sharp volume envelope
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Web Audio API is blocked or uninitialized. Tap anywhere to activate.", e);
    }
  };

  return { initAudio, beep };
}
