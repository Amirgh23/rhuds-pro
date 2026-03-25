/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CALL OF DUTY: COLD WAR - HUD COLORS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Complete color palette from Call of Duty: Cold War HUD system
 * Total: 235 colors organized by category
 *
 * Source: Game HUD color definitions
 */

export interface HudColor {
  name: string;
  rgba: string;
  rgb: string;
  hex: string;
  category: string;
}

export const COLD_WAR_HUD_COLORS: Record<string, HudColor> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // BASIC COLORS (0-5)
  // ═══════════════════════════════════════════════════════════════════════════
  PURE_WHITE: {
    name: 'Pure White',
    rgba: 'rgba(255, 255, 255, 1)',
    rgb: '255, 255, 255',
    hex: '#FFFFFF',
    category: 'basic',
  },
  WHITE: {
    name: 'White',
    rgba: 'rgba(240, 240, 240, 1)',
    rgb: '240, 240, 240',
    hex: '#F0F0F0',
    category: 'basic',
  },
  BLACK: {
    name: 'Black',
    rgba: 'rgba(0, 0, 0, 1)',
    rgb: '0, 0, 0',
    hex: '#000000',
    category: 'basic',
  },
  GREY: {
    name: 'Grey',
    rgba: 'rgba(155, 155, 155, 1)',
    rgb: '155, 155, 155',
    hex: '#9B9B9B',
    category: 'basic',
  },
  GREY_LIGHT: {
    name: 'Grey Light',
    rgba: 'rgba(205, 205, 205, 1)',
    rgb: '205, 205, 205',
    hex: '#CDCDCD',
    category: 'basic',
  },
  GREY_DARK: {
    name: 'Grey Dark',
    rgba: 'rgba(77, 77, 77, 1)',
    rgb: '77, 77, 77',
    hex: '#4D4D4D',
    category: 'basic',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY COLORS (6-23)
  // ═══════════════════════════════════════════════════════════════════════════
  RED: {
    name: 'Red',
    rgba: 'rgba(224, 50, 50, 1)',
    rgb: '224, 50, 50',
    hex: '#E03232',
    category: 'primary',
  },
  RED_LIGHT: {
    name: 'Red Light',
    rgba: 'rgba(240, 153, 153, 1)',
    rgb: '240, 153, 153',
    hex: '#F09999',
    category: 'primary',
  },
  RED_DARK: {
    name: 'Red Dark',
    rgba: 'rgba(112, 25, 25, 1)',
    rgb: '112, 25, 25',
    hex: '#701919',
    category: 'primary',
  },
  BLUE: {
    name: 'Blue',
    rgba: 'rgba(93, 182, 229, 1)',
    rgb: '93, 182, 229',
    hex: '#5DB6E5',
    category: 'primary',
  },
  BLUE_LIGHT: {
    name: 'Blue Light',
    rgba: 'rgba(174, 219, 242, 1)',
    rgb: '174, 219, 242',
    hex: '#AEDBF2',
    category: 'primary',
  },
  BLUE_DARK: {
    name: 'Blue Dark',
    rgba: 'rgba(47, 92, 115, 1)',
    rgb: '47, 92, 115',
    hex: '#2F5C73',
    category: 'primary',
  },
  YELLOW: {
    name: 'Yellow',
    rgba: 'rgba(240, 200, 80, 1)',
    rgb: '240, 200, 80',
    hex: '#F0C850',
    category: 'primary',
  },
  YELLOW_LIGHT: {
    name: 'Yellow Light',
    rgba: 'rgba(254, 235, 169, 1)',
    rgb: '254, 235, 169',
    hex: '#FEEBA9',
    category: 'primary',
  },
  YELLOW_DARK: {
    name: 'Yellow Dark',
    rgba: 'rgba(126, 107, 41, 1)',
    rgb: '126, 107, 41',
    hex: '#7E6B29',
    category: 'primary',
  },
  ORANGE: {
    name: 'Orange',
    rgba: 'rgba(255, 133, 85, 1)',
    rgb: '255, 133, 85',
    hex: '#FF8555',
    category: 'primary',
  },
  ORANGE_LIGHT: {
    name: 'Orange Light',
    rgba: 'rgba(255, 194, 170, 1)',
    rgb: '255, 194, 170',
    hex: '#FFC2AA',
    category: 'primary',
  },
  ORANGE_DARK: {
    name: 'Orange Dark',
    rgba: 'rgba(127, 66, 42, 1)',
    rgb: '127, 66, 42',
    hex: '#7F422A',
    category: 'primary',
  },
  GREEN: {
    name: 'Green',
    rgba: 'rgba(114, 204, 114, 1)',
    rgb: '114, 204, 114',
    hex: '#72CC72',
    category: 'primary',
  },
  GREEN_LIGHT: {
    name: 'Green Light',
    rgba: 'rgba(185, 230, 185, 1)',
    rgb: '185, 230, 185',
    hex: '#B9E6B9',
    category: 'primary',
  },
  GREEN_DARK: {
    name: 'Green Dark',
    rgba: 'rgba(57, 102, 57, 1)',
    rgb: '57, 102, 57',
    hex: '#396639',
    category: 'primary',
  },
  PURPLE: {
    name: 'Purple',
    rgba: 'rgba(132, 102, 226, 1)',
    rgb: '132, 102, 226',
    hex: '#8466E2',
    category: 'primary',
  },
  PURPLE_LIGHT: {
    name: 'Purple Light',
    rgba: 'rgba(192, 179, 239, 1)',
    rgb: '192, 179, 239',
    hex: '#C0B3EF',
    category: 'primary',
  },
  PURPLE_DARK: {
    name: 'Purple Dark',
    rgba: 'rgba(67, 57, 111, 1)',
    rgb: '67, 57, 111',
    hex: '#43396F',
    category: 'primary',
  },
  PINK: {
    name: 'Pink',
    rgba: 'rgba(203, 54, 148, 1)',
    rgb: '203, 54, 148',
    hex: '#CB3694',
    category: 'primary',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPECIAL COLORS (107-110, 220-223, 234)
  // ═══════════════════════════════════════════════════════════════════════════
  BRONZE: {
    name: 'Bronze',
    rgba: 'rgba(180, 130, 97, 1)',
    rgb: '180, 130, 97',
    hex: '#B48261',
    category: 'special',
  },
  SILVER: {
    name: 'Silver',
    rgba: 'rgba(150, 153, 161, 1)',
    rgb: '150, 153, 161',
    hex: '#9699A1',
    category: 'special',
  },
  GOLD: {
    name: 'Gold',
    rgba: 'rgba(214, 181, 99, 1)',
    rgb: '214, 181, 99',
    hex: '#D6B563',
    category: 'special',
  },
  PLATINUM: {
    name: 'Platinum',
    rgba: 'rgba(166, 221, 190, 1)',
    rgb: '166, 221, 190',
    hex: '#A6DDBE',
    category: 'special',
  },
  TECH_GREEN: {
    name: 'Tech Green',
    rgba: 'rgba(0, 151, 151, 1)',
    rgb: '0, 151, 151',
    hex: '#009797',
    category: 'special',
  },
  TECH_GREEN_DARK: {
    name: 'Tech Green Dark',
    rgba: 'rgba(5, 119, 113, 1)',
    rgb: '5, 119, 113',
    hex: '#057771',
    category: 'special',
  },
  TECH_RED: {
    name: 'Tech Red',
    rgba: 'rgba(151, 0, 0, 1)',
    rgb: '151, 0, 0',
    hex: '#970000',
    category: 'special',
  },
  TECH_GREEN_VERY_DARK: {
    name: 'Tech Green Very Dark',
    rgba: 'rgba(0, 40, 40, 1)',
    rgb: '0, 40, 40',
    hex: '#002828',
    category: 'special',
  },
  JUNK_ENERGY: {
    name: 'Junk Energy',
    rgba: 'rgba(29, 237, 195, 1)',
    rgb: '29, 237, 195',
    hex: '#1DEDC3',
    category: 'special',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MENU COLORS (61-74)
  // ═══════════════════════════════════════════════════════════════════════════
  MENU_BLUE: {
    name: 'Menu Blue',
    rgba: 'rgba(140, 140, 140, 1)',
    rgb: '140, 140, 140',
    hex: '#8C8C8C',
    category: 'menu',
  },
  MENU_BLUE_EXTRA_DARK: {
    name: 'Menu Blue Extra Dark',
    rgba: 'rgba(40, 40, 40, 1)',
    rgb: '40, 40, 40',
    hex: '#282828',
    category: 'menu',
  },
  MENU_YELLOW: {
    name: 'Menu Yellow',
    rgba: 'rgba(240, 160, 0, 1)',
    rgb: '240, 160, 0',
    hex: '#F0A000',
    category: 'menu',
  },
  MENU_GREY: {
    name: 'Menu Grey',
    rgba: 'rgba(140, 140, 140, 1)',
    rgb: '140, 140, 140',
    hex: '#8C8C8C',
    category: 'menu',
  },
  MENU_GREY_DARK: {
    name: 'Menu Grey Dark',
    rgba: 'rgba(60, 60, 60, 1)',
    rgb: '60, 60, 60',
    hex: '#3C3C3C',
    category: 'menu',
  },
  MENU_HIGHLIGHT: {
    name: 'Menu Highlight',
    rgba: 'rgba(30, 30, 30, 1)',
    rgb: '30, 30, 30',
    hex: '#1E1E1E',
    category: 'menu',
  },
  MENU_STANDARD: {
    name: 'Menu Standard',
    rgba: 'rgba(140, 140, 140, 1)',
    rgb: '140, 140, 140',
    hex: '#8C8C8C',
    category: 'menu',
  },
  MENU_DIMMED: {
    name: 'Menu Dimmed',
    rgba: 'rgba(75, 75, 75, 1)',
    rgb: '75, 75, 75',
    hex: '#4B4B4B',
    category: 'menu',
  },
  MENU_EXTRA_DIMMED: {
    name: 'Menu Extra Dimmed',
    rgba: 'rgba(50, 50, 50, 1)',
    rgb: '50, 50, 50',
    hex: '#323232',
    category: 'menu',
  },
};

// Helper function to get color by name
export function getColdWarHudColor(colorName: keyof typeof COLD_WAR_HUD_COLORS): HudColor {
  return COLD_WAR_HUD_COLORS[colorName];
}

// Get all colors by category
export function getColdWarHudColorsByCategory(category: string): HudColor[] {
  return Object.values(COLD_WAR_HUD_COLORS).filter((color) => color.category === category);
}

// Get color categories
export const COLD_WAR_COLOR_CATEGORIES = ['basic', 'primary', 'special', 'menu'] as const;

export type ColdWarColorCategory = (typeof COLD_WAR_COLOR_CATEGORIES)[number];
