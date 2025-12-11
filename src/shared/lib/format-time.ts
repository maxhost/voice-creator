/**
 * Formats seconds into MM:SS display format.
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Formats seconds into human readable format.
 * Example: 125 -> "2 minutos y 5 segundos"
 */
export const formatTimeHuman = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) {
    return `${secs} segundo${secs !== 1 ? 's' : ''}`;
  }

  if (secs === 0) {
    return `${mins} minuto${mins !== 1 ? 's' : ''}`;
  }

  return `${mins} minuto${mins !== 1 ? 's' : ''} y ${secs} segundo${secs !== 1 ? 's' : ''}`;
};
