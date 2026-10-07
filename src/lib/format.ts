// Helper formatting mm:ss
export function formatTime(totalSecs: number) {
  const mins = Math.floor(totalSecs / 60);
  const secs = Math.round(totalSecs % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Countdown display, e.g. 0:24 or 1:00
export function formatClock(totalSecs: number) {
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// "1 séance", "3 séances"
export const plural = (count: number, word: string) => `${count} ${word}${count > 1 ? 's' : ''}`;
