/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * URL validation
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Number validation
 */
export function isValidNumber(value: string): boolean {
  return !isNaN(Number(value)) && value.trim() !== '';
}

/**
 * Check if number is in range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * String length validation
 */
export function isValidLength(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max;
}

/**
 * Check if string has special characters
 */
export function hasSpecialCharacters(str: string): boolean {
  const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
  return specialChars.test(str);
}

/**
 * Check if HEX color is valid
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}
