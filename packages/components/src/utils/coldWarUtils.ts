/**
 * Cold War Shared Utilities
 * Common functions and helpers for Cold War components
 */

import { THEME_VARIANTS } from '@rhuds/core';

export type ThemeVariant = 'perseus' | 'greenTerminal' | 'satelliteView';

/**
 * Convert hex color to RGB string
 */
export function getRgbString(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

/**
 * Generate random tech code
 */
export function generateTechCode(prefix: string = 'SYS'): string {
  const code = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${code}`;
}

/**
 * Generate random coordinates
 */
export function generateCoordinates(): string {
  const lat = (Math.random() * 180 - 90).toFixed(4);
  const lon = (Math.random() * 360 - 180).toFixed(4);
  const latDir = parseFloat(lat) >= 0 ? 'N' : 'S';
  const lonDir = parseFloat(lon) >= 0 ? 'E' : 'W';
  return `${Math.abs(parseFloat(lat))}° ${latDir}, ${Math.abs(parseFloat(lon))}° ${lonDir}`;
}

/**
 * Get current timestamp in military format
 */
export function getMilitaryTimestamp(): string {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

/**
 * Get theme colors
 */
export function getThemeColors(theme: ThemeVariant) {
  return THEME_VARIANTS[theme];
}
