// src/utils/validators.js

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate password strength
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const validatePasswordStrength = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return errors;
};

/**
 * Get password strength level
 * - weak: 0-1 criteria met
 * - medium: 2-3 criteria met
 * - strong: all 4 criteria met
 */
export const getPasswordStrength = (password) => {
  if (!password) return { level: "none", score: 0 };

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;

  let level = "weak";
  if (score >= 4) level = "strong";
  else if (score >= 2) level = "medium";

  return { level, score };
};

/**
 * Validate phone number (Kenyan format)
 */
export const validatePhoneNumber = (phone) => {
  const re = /^(?:\+254|0)[17]\d{8}$/;
  return re.test(phone);
};

/**
 * Validate full name
 */
export const validateFullName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
};

/**
 * Check if passwords match
 */
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Get validation error messages
 */
export const getValidationErrors = (field, value) => {
  const errors = {};

  switch (field) {
    case "email":
      if (!value) errors.email = "Email is required";
      else if (!validateEmail(value))
        errors.email = "Please enter a valid email address";
      break;

    case "password":
      if (!value) errors.password = "Password is required";
      else {
        const strengthErrors = validatePasswordStrength(value);
        if (strengthErrors.length > 0) {
          errors.password = strengthErrors[0]; // Return first error
        }
      }
      break;

    case "fullName":
      if (!value) errors.fullName = "Full name is required";
      else if (!validateFullName(value))
        errors.fullName = "Name must be between 2 and 100 characters";
      break;

    case "phoneNumber":
      if (value && !validatePhoneNumber(value)) {
        errors.phoneNumber =
          "Please enter a valid Kenyan phone number (e.g., 0712345678)";
      }
      break;

    case "confirmPassword":
      if (value && value !== "") {
        // Will be checked against password in component
      }
      break;
  }

  return errors;
};
