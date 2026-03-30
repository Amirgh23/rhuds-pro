/**
 * RHUDS Theme Configuration
 * Neon-inspired theme with glow effects
 */

import type { ChartTheme } from '../../engine/types/index';

export interface RhudsThemeConfig extends ChartTheme {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
  shadowColor: string;
  effects: ChartTheme['effects'] & {
    shadowBlur: number;
  };
}

export const RhudsTheme: RhudsThemeConfig = {
  variant: 'r-huds',
  colors: {
    primary: '#29F2DF',
    secondary: '#1C7FA6',
    accent: '#FF006E',
    background: 'rgba(0, 20, 40, 0.8)',
    text: '#29F2DF',
    grid: 'rgba(41, 242, 223, 0.1)',
    border: '#1C7FA6',
  },
  backgroundColor: 'rgba(0, 20, 40, 0.8)',
  textColor: '#29F2DF',
  borderColor: '#1C7FA6',
  glowColor: '#29F2DF',
  shadowColor: 'rgba(41, 242, 223, 0.3)',
  fonts: {
    family: "'Courier New', monospace",
    size: 12,
    weight: 400,
    lineHeight: 1.5,
  },
  animation: {
    duration: 750,
    easing: 'easeInOutQuart',
    delay: 0,
  },
  effects: {
    glow: true,
    glowIntensity: 0.5,
    neonPulse: true,
    scanlines: false,
    scanlinesIntensity: 'low',
    lightTrail: false,
    phosphorBurn: false,
    radarSweep: false,
    shadowBlur: 15,
  },
};

export const getRhudsChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    duration: RhudsTheme.animation.duration,
    easing: RhudsTheme.animation.easing,
  },
  plugins: {
    legend: {
      display: true,
      labels: {
        color: RhudsTheme.textColor,
        font: {
          family: RhudsTheme.fonts.family,
          size: RhudsTheme.fonts.size,
        },
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: RhudsTheme.backgroundColor,
      borderColor: RhudsTheme.borderColor,
      textColor: RhudsTheme.textColor,
    },
    title: {
      display: false,
      color: RhudsTheme.textColor,
      font: {
        family: RhudsTheme.fonts.family,
        size: 16,
        weight: 'bold',
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: RhudsTheme.textColor,
      },
      grid: {
        color: 'rgba(41, 242, 223, 0.1)',
      },
    },
    y: {
      ticks: {
        color: RhudsTheme.textColor,
      },
      grid: {
        color: 'rgba(41, 242, 223, 0.1)',
      },
    },
  },
});

export default RhudsTheme;
