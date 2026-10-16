import type { MouseEvent } from 'react';

// Pages are real links, which search engines follow and a long press can share; a plain tap
// opens the page inside the app.
export const inApp = (open: () => void) => (event: MouseEvent) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  open();
};
