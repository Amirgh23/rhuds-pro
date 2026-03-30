/**
 * ColdWar Theme Configuration
 * Tactical/military-inspired theme with scanlines
 */

import type { ChartTheme } from '../../engine/types/index';

export interface ColdWarThemeConfig extends ChartTheme {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  scanlineColor: string;
  shadowColor: string;
  effects: ChartTheme['effects'] & {
    tactical: boolean;
    shadowBlur: number;
  };
}

export const ColdWarTheme: ColdWarThemeConfig = {
  variant: 'coldwar',
  colors: {
    primary: '#00FF00',
    secondary: '#00AA00',
    accent: '#FFFF00',
    background: 'rgba(0, 0, 0, 0.5)',
    text: '#00FF00',
    grid: 'rgba(0, 255, 0, 0.1)',
    border: '#00AA00',
  },
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  textColor: '#00FF00',
  borderColor: '#00AA00',
  scanlineColor: 'rgba(0, 255, 0, 0.05)',
  shadowColor: 'rgba(0, 255, 0, 0.2)',
  fonts: {
    family: "'Courier New', monospace",
    size: 12,
    weight: 400,
    lineHeight: 1.5,
  },
  animation: {
    duration: 600,
    easing: 'linear',
    delay: 0,
  },
  effects: {
    glow: false,
    glowIntensity: 0,
    neonPulse: false,
    scanlines: true,
    scanlinesIntensity: 'medium',
    lightTrail: false,
    phosphorBurn: true,
    radarSweep: false,
    tactical: true,
    shadowBlur: 8,
  },
};

export const getColdWarChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    duration: ColdWarTheme.animation.duration,
    easing: ColdWarTheme.animation.easing,
  },
  plugins: {
    legend: {
      display: true,
      labels: {
        color: ColdWarTheme.textColor,
        font: {
          family: ColdWarTheme.fonts.family,
          size: ColdWarTheme.fonts.size,
        },
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: ColdWarTheme.backgroundColor,
      borderColor: ColdWarTheme.borderColor,
      textColor: ColdWarTheme.textColor,
    },
    title: {
      display: false,
      color: ColdWarTheme.textColor,
      font: {
        family: ColdWarTheme.fonts.family,
        size: 16,
        weight: 'bold',
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: ColdWarTheme.textColor,
      },
      grid: {
        color: 'rgba(0, 255, 0, 0.1)',
      },
    },
    y: {
      ticks: {
        color: ColdWarTheme.textColor,
      },
      grid: {
        color: 'rgba(0, 255, 0, 0.1)',
      },
    },
  },
});

export default ColdWarTheme;
