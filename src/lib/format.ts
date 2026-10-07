// Helper formatting mm:ss
export function formatTime(totalSecs: number) {
  const mins = Math.floor(totalSecs / 60);
  const secs = Math.round(totalSecs % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
