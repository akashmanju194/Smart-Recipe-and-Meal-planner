/**
 * Convert HH:MM string to total minutes.
 * @param {string} time - e.g., "01:30"
 * @returns {number} Total minutes, e.g., 90
 */
export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert total minutes to HH:MM string.
 * @param {number} totalMinutes - e.g., 90
 * @returns {string} Formatted string, e.g., "01:30"
 */
export const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

/**
 * Format minutes into a human-readable string.
 * @param {number} minutes - e.g., 90
 * @returns {string} e.g., "1h 30m"
 */
export const formatCookingTime = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};
