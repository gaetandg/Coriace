import { useEffect, useRef } from 'react';

// The phone's back button walks back through the app instead of leaving it.
// Open screens and sheets register a handler; the most recent one runs on back. While any
// handler is registered the app keeps one extra history entry so the browser has somewhere to go.

const handlers: (() => void)[] = [];
let entryPushed = false;
let popsToIgnore = 0;
let syncScheduled = false;

// Batched to the end of the current task: moving from one screen to the next removes a
// handler and adds another in the same render, which must not touch history at all.
function scheduleSync() {
  if (syncScheduled) return;
  syncScheduled = true;
  setTimeout(() => {
    syncScheduled = false;
    syncHistory();
  }, 0);
}

function syncHistory() {
  if (handlers.length > 0 && !entryPushed) {
    window.history.pushState({ coriace: true }, '');
    entryPushed = true;
  } else if (handlers.length === 0 && entryPushed) {
    // Back at the home screen through the app itself: drop the extra entry.
    entryPushed = false;
    popsToIgnore++;
    window.history.back();
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    if (popsToIgnore > 0) {
      popsToIgnore--;
      return;
    }
    entryPushed = false;
    handlers[handlers.length - 1]?.();
    // A handler that keeps its screen open (e.g. pausing a session) needs the entry back.
    scheduleSync();
  });
}

export function useBackHandler(active: boolean, onBack: () => void) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!active) return;
    const handler = () => onBackRef.current();
    handlers.push(handler);
    // Pushed right away so a back press just after opening a screen is caught.
    syncHistory();
    return () => {
      handlers.splice(handlers.indexOf(handler), 1);
      scheduleSync();
    };
  }, [active]);
}
