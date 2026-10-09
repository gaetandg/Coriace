import { useEffect } from 'react';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { isNativeApp } from '../lib/native';

// Keeps the screen on while `active`: always in the Android app, where the browser supports it otherwise.
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !isNativeApp) return;
    KeepAwake.keepAwake().catch(() => {});
    return () => { KeepAwake.allowSleep().catch(() => {}); };
  }, [active]);

  useEffect(() => {
    if (!active || isNativeApp || !('wakeLock' in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;

    const request = async () => {
      try {
        const sentinel = await navigator.wakeLock.request('screen');
        if (cancelled) sentinel.release();
        else lock = sentinel;
      } catch {
        // Refused (battery saver, hidden tab): the session still works.
      }
    };
    // The lock is dropped when the page is hidden; take it again on return.
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') request();
    };

    request();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      lock?.release();
    };
  }, [active]);
}
