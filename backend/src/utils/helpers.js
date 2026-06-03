/**
 * Shared utility functions for the backend.
 */

/**
 * Convert HH:MM string to total minutes.
 * @param {string} time - Time string in "HH:MM" format.
 * @returns {number} Total minutes.
 */
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert total minutes to HH:MM string.
 * @param {number} totalMinutes - Total minutes.
 * @returns {string} Time string in "HH:MM" format.
 */
const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

module.exports = { timeToMinutes, minutesToTime };
