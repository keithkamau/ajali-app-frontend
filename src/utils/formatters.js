// src/utils/formatters.js

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format time to readable string
 */
export const formatTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format date and time together
 */
export const formatDateTime = (date) => {
  if (!date) return "";
  return `${formatDate(date)} at ${formatTime(date)}`;
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  // Format: 0712345678 -> 0712 345 678
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Mask email for display (e.g., j***@example.com)
 */
export const maskEmail = (email) => {
  if (!email) return "";
  const [local, domain] = email.split("@");
  if (local.length <= 2) return email;
  return `${local[0]}${"*".repeat(Math.min(local.length - 2, 3))}${local.slice(-1)}@${domain}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Generate random reference number
 */
export const generateReference = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `A/J-${year}-${random}`;
};
