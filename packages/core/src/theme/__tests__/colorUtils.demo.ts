/**
 * Demonstration of color manipulation functions
 * This file shows practical examples of using the color utilities
 * Requirements: 2.1-2.4
 */

import {
  lighten,
  darken,
  saturate,
  desaturate,
  generateColorVariations,
  alpha,
  createAlphaFunction,
  createGradient,
  interpolateColor,
  createColorTransitionKeyframes,
  animateGradient,
} from '../colorUtils';

// ============================================================================
// Color Variation Examples (Requirement 2.1)
// ============================================================================

console.log('=== Color Variation Examples ===\n');

const primaryColor = '#29F2DF';
console.log(`Base color: ${primaryColor}`);
console.log(`Lighter (+20): ${lighten(primaryColor, 20)}`);
console.log(`Darker (-20): ${darken(primaryColor, 20)}`);
console.log(`More saturated (+20): ${saturate(primaryColor, 20)}`);
console.log(`Less saturated (-20): ${desaturate(primaryColor, 20)}`);

console.log('\nGenerate 5 lighter variations:');
const lighterVariations = generateColorVariations(primaryColor, {
  steps: 5,
  type: 'lighter',
  amount: 10,
});
lighterVariations.forEach((color, i) => {
  console.log(`  Step ${i}: ${color}`);
});

// ============================================================================
// Alpha Channel Examples (Requirement 2.2)
// ============================================================================

console.log('\n=== Alpha Channel Examples ===\n');

console.log(`Color with 50% opacity: ${alpha(primaryColor, 0.5)}`);
console.log(`Color with 25% opacity: ${alpha(primaryColor, 0.25)}`);
console.log(`Color with 75% opacity: ${alpha(primaryColor, 0.75)}`);

const primaryAlpha = createAlphaFunction(primaryColor);
console.log('\nUsing alpha function:');
console.log(`  10% opacity: ${primaryAlpha(0.1)}`);
console.log(`  50% opacity: ${primaryAlpha(0.5)}`);
console.log(`  90% opacity: ${primaryAlpha(0.9)}`);

// ============================================================================
// Gradient Examples (Requirement 2.3)
// ============================================================================

console.log('\n=== Gradient Examples ===\n');

const linearGradient = createGradient({
  type: 'linear',
  angle: 45,
  stops: [
    { color: '#29F2DF', position: 0 },
    { color: '#1C7FA6', position: 100 },
  ],
});
console.log('Linear gradient:');
console.log(`  ${linearGradient}`);

const radialGradient = createGradient({
  type: 'radial',
  stops: [
    { color: '#29F2DF', position: 0 },
    { color: '#1C7FA6', position: 50 },
    { color: '#ff0055', position: 100 },
  ],
});
console.log('\nRadial gradient:');
console.log(`  ${radialGradient}`);

const conicGradient = createGradient({
  type: 'conic',
  angle: 0,
  stops: [
    { color: '#29F2DF', position: 0 },
    { color: '#1C7FA6', position: 33 },
    { color: '#ff0055', position: 66 },
    { color: '#29F2DF', position: 100 },
  ],
});
console.log('\nConic gradient:');
console.log(`  ${conicGradient}`);

// ============================================================================
// Animated Color Transition Examples (Requirement 2.4)
// ============================================================================

console.log('\n=== Animated Color Transition Examples ===\n');

console.log('Color interpolation:');
console.log(`  0% progress: ${interpolateColor('#29F2DF', '#1C7FA6', 0)}`);
console.log(`  25% progress: ${interpolateColor('#29F2DF', '#1C7FA6', 0.25)}`);
console.log(`  50% progress: ${interpolateColor('#29F2DF', '#1C7FA6', 0.5)}`);
console.log(`  75% progress: ${interpolateColor('#29F2DF', '#1C7FA6', 0.75)}`);
console.log(`  100% progress: ${interpolateColor('#29F2DF', '#1C7FA6', 1)}`);

const keyframes = createColorTransitionKeyframes('primaryFade', {
  from: '#29F2DF',
  to: '#1C7FA6',
  duration: 1000,
  easing: 'ease-in-out',
});
console.log('\nCSS Keyframes:');
console.log(keyframes);

console.log('\nGradient animation:');
const gradientFrom = {
  type: 'linear' as const,
  angle: 0,
  stops: [
    { color: '#29F2DF', position: 0 },
    { color: '#1C7FA6', position: 100 },
  ],
};

const gradientTo = {
  type: 'linear' as const,
  angle: 180,
  stops: [
    { color: '#ff0055', position: 0 },
    { color: '#00ff9f', position: 100 },
  ],
};

const animatedGradient50 = animateGradient(gradientFrom, gradientTo, 0.5);
console.log(`  50% progress: ${createGradient(animatedGradient50)}`);

// ============================================================================
// Practical Use Case: Theme Color Palette Generation
// ============================================================================

console.log('\n=== Practical Example: Generate Theme Palette ===\n');

function generateThemePalette(baseColor: string) {
  return {
    main: baseColor,
    light: lighten(baseColor, 20),
    lighter: lighten(baseColor, 40),
    dark: darken(baseColor, 20),
    darker: darken(baseColor, 40),
    alpha50: alpha(baseColor, 0.5),
    alpha25: alpha(baseColor, 0.25),
    alpha75: alpha(baseColor, 0.75),
  };
}

const themePalette = generateThemePalette('#29F2DF');
console.log('Generated theme palette:');
Object.entries(themePalette).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});

// ============================================================================
// Practical Use Case: Animated Button Hover Effect
// ============================================================================

console.log('\n=== Practical Example: Button Hover Animation ===\n');

const buttonColor = '#29F2DF';
const hoverColor = lighten(buttonColor, 15);

const buttonHoverKeyframes = createColorTransitionKeyframes('buttonHover', {
  from: buttonColor,
  to: hoverColor,
  duration: 200,
  easing: 'ease-out',
});

console.log('Button hover animation:');
console.log(buttonHoverKeyframes);

console.log('\n=== Demo Complete ===');
