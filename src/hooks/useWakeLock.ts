import { useEffect } from 'react';

// Keeps the screen on while `active`, where the browser supports it.
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;
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
