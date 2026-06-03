/**
 * Client-side form validation helpers.
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 30;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateScore = (score) => {
  const num = parseFloat(score);
  return !isNaN(num) && num >= 1 && num <= 5;
};

export const validateCalories = (calories) => {
  const num = parseInt(calories);
  return !isNaN(num) && num >= 0;
};
