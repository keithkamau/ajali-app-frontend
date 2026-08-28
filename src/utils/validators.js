export const validateEmail = (email) => {
  if (!email) return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  if (!phone) return true;
  const cleaned = phone.replace(/\s/g, "");
  const regex = /^(?:\+254|0)(7|1)\d{8}$/;
  return regex.test(cleaned);
};

export const validatePhoneNumber = validatePhone;

export const validateFullName = (name) => {
  if (!name) return false;
  return name.trim().length >= 2 && name.trim().length <= 100;
};

export const validateRequired = (value) => {
  if (!value || value.trim() === "") {
    return { valid: false, message: "This field is required" };
  }
  return { valid: true, message: "" };
};

export const validateMinLength = (value, min) => {
  if (!value || value.length < min) {
    return { valid: false, message: `Must be at least ${min} characters` };
  }
  return { valid: true, message: "" };
};

export const validateMaxLength = (value, max) => {
  if (value && value.length > max) {
    return { valid: false, message: `Must be at most ${max} characters` };
  }
  return { valid: true, message: "" };
};

export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one number",
    };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one special character",
    };
  }
  return { valid: true, message: "Password is strong" };
};

export const getPasswordStrength = (password) => {
  if (!password || password.length === 0) {
    return "weak";
  }
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 1;
  if (strength <= 2) return "weak";
  if (strength <= 4) return "medium";
  return "strong";
};

export const getPasswordStrengthColor = (password) => {
  const strength = getPasswordStrength(password);
  if (strength === "strong") return "#16a34a";
  if (strength === "medium") return "#d97706";
  return "#dc2626";
};

export const getPasswordStrengthLabel = (password) => {
  const strength = getPasswordStrength(password);
  if (strength === "strong") return "Strong password";
  if (strength === "medium") return "Medium password";
  return "Weak password";
};

export const validatePasswordsMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { valid: false, message: "Passwords do not match" };
  }
  return { valid: true, message: "" };
};

export const validateUrl = (url) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateLatitude = (lat) => {
  const num = parseFloat(lat);
  return !isNaN(num) && num >= -90 && num <= 90;
};

export const validateLongitude = (lng) => {
  const num = parseFloat(lng);
  return !isNaN(num) && num >= -180 && num <= 180;
};
