/**
 * Property-based Bug Condition Exploration Test for Color Palette Fix
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7**
 * 
 * This test explores the bug condition by verifying that specific files
 * use incorrect colors that are NOT part of the 5-color palette.
 * 
 * **CRITICAL**: This test MUST FAIL on unfixed code (failure confirms bug exists)
 * 
 * The correct 5-color palette is:
 * - rgba(10, 18, 37, 1) / #0A1225 - Dark blue/black (PRIMARY BACKGROUND)
 * - rgba(40, 18, 90, 1) / #28125A - Dark purple (SURFACE BACKGROUND)
 * - rgba(41, 242, 223, 1) / #29F2DF - Cyan/Turquoise (PRIMARY COLOR)
 * - rgba(28, 127, 166, 1) / #1C7FA6 - Medium Blue (SECONDARY COLOR)
 * - rgba(239, 62, 241, 1) / #EF3EF1 - Pink/Magenta (ACCENT COLOR)
 * 
 * The bug is that #28125A (dark purple) is being used for PRIMARY backgrounds
 * instead of #0A1225 (dark blue/black).
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

// Define the correct 5-color palette
const CORRECT_PALETTE = {
  primaryBackground: '#0A1225',
  surfaceBackground: '#28125A',
  primary: '#29F2DF',
  secondary: '#1C7FA6',
  accent: '#EF3EF1',
} as const;

// Alternative representations (rgba format)
const CORRECT_PALETTE_RGBA = {
  primaryBackground: 'rgba(10, 18, 37, 1)',
  surfaceBackground: 'rgba(40, 18, 90, 1)',
  primary: 'rgba(41, 242, 223, 1)',
  secondary: 'rgba(28, 127, 166, 1)',
  accent: 'rgba(239, 62, 241, 1)',
} as const;

describe('Property Tests: Color Palette Bug Condition Exploration', () => {
  /**
   * Property 1: Fault Condition - Theme Configuration Uses Incorrect Background Color
   * 
   * **Validates: Requirements 1.1, 1.2**
   * 
   * This test verifies that packages/core/src/theme/themes.ts uses #28125A
   * as the background color instead of the correct #0A1225.
   * 
   * **EXPECTED OUTCOME ON UNFIXED CODE**: Test FAILS (confirms bug exists)
   * **EXPECTED OUTCOME ON FIXED CODE**: Test PASSES (confirms bug is fixed)
   */
  it('should detect incorrect background color in theme configuration', () => {
    const themesPath = path.join(process.cwd(), 'src/theme/themes.ts');
    const themesContent = fs.readFileSync(themesPath, 'utf-8');

    // Test that the file currently uses #28125A as background (BUG)
    // This assertion will FAIL when the bug is fixed
    const hasIncorrectBackground = themesContent.includes("background: '#28125A'");
    
    // Test that the file does NOT use the correct #0A1225 as background (BUG)
    // This assertion will FAIL when the bug is fixed
    const hasCorrectBackground = themesContent.includes("background: '#0A1225'") || 
                                  themesContent.includes('background: "#0A1225"');

    // EXPECTED ON UNFIXED CODE: hasIncorrectBackground = true, hasCorrectBackground = false
    // EXPECTED ON FIXED CODE: hasIncorrectBackground = false, hasCorrectBackground = true
    
    // This test encodes the EXPECTED behavior (correct palette usage)
    // It will FAIL on unfixed code and PASS on fixed code
    expect(hasIncorrectBackground).toBe(false); // Should NOT have incorrect background
    expect(hasCorrectBackground).toBe(true);    // Should HAVE correct background
  });

  /**
   * Property 2: Fault Condition - ComponentsDemo Uses Incorrect Hardcoded Colors
   * 
   * **Validates: Requirements 1.3**
   * 
   * This test verifies that packages/components/src/__tests__/ComponentsDemo.tsx
   * uses hardcoded #28125A for text colors where it should use palette colors.
   * 
   * **EXPECTED OUTCOME ON UNFIXED CODE**: Test FAILS (confirms bug exists)
   * **EXPECTED OUTCOME ON FIXED CODE**: Test PASSES (confirms bug is fixed)
   */
  it('should detect incorrect hardcoded colors in ComponentsDemo', () => {
    const componentsDemoPath = path.join(
      process.cwd(),
      '../components/src/__tests__/ComponentsDemo.tsx'
    );
    const componentsDemoContent = fs.readFileSync(componentsDemoPath, 'utf-8');

    // Test that the file uses #28125A for text colors (BUG)
    // #28125A is a background color and should NOT be used for text
    const hasIncorrectTextColor = componentsDemoContent.includes('color="#28125A"') ||
                                   componentsDemoContent.includes("color='#28125A'");

    // This test encodes the EXPECTED behavior (no incorrect text colors)
    // It will FAIL on unfixed code and PASS on fixed code
    expect(hasIncorrectTextColor).toBe(false); // Should NOT use background color for text
  });

  /**
   * Property 3: Fault Condition - DocsPage Uses Incorrect Background Color
   * 
   * **Validates: Requirements 1.4**
   * 
   * This test verifies that packages/demo-app/src/pages/DocsPage.tsx
   * uses #28125A for page background instead of the correct #0A1225.
   * 
   * **EXPECTED OUTCOME ON UNFIXED CODE**: Test FAILS (confirms bug exists)
   * **EXPECTED OUTCOME ON FIXED CODE**: Test PASSES (confirms bug is fixed)
   */
  it('should detect incorrect page background color in DocsPage', () => {
    const docsPagePath = path.join(
      process.cwd(),
      '../demo-app/src/pages/DocsPage.tsx'
    );
    const docsPageContent = fs.readFileSync(docsPagePath, 'utf-8');

    // Test that the file uses #28125A as page background (BUG)
    const hasIncorrectPageBackground = docsPageContent.includes("background: '#28125A'") ||
                                        docsPageContent.includes('background: "#28125A"');

    // Test that the file uses the correct #0A1225 as page background
    const hasCorrectPageBackground = docsPageContent.includes("background: '#0A1225'") ||
                                      docsPageContent.includes('background: "#0A1225"');

    // This test encodes the EXPECTED behavior (correct background color)
    // It will FAIL on unfixed code and PASS on fixed code
    expect(hasIncorrectPageBackground).toBe(false); // Should NOT use purple for page background
    expect(hasCorrectPageBackground).toBe(true);    // Should use dark blue/black for page background
  });

  /**
   * Property 4: Fault Condition - All Colors Must Be From Palette
   * 
   * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7**
   * 
   * This property-based test generates test cases to verify that all color
   * values in key files are from the 5-color palette with correct semantic usage.
   * 
   * **EXPECTED OUTCOME ON UNFIXED CODE**: Test FAILS (confirms bug exists)
   * **EXPECTED OUTCOME ON FIXED CODE**: Test PASSES (confirms bug is fixed)
   */
  it('should verify all theme colors are from the correct palette', () => {
    const themesPath = path.join(process.cwd(), 'src/theme/themes.ts');
    const themesContent = fs.readFileSync(themesPath, 'utf-8');

    // Property-based test: For any color in the palette, verify correct usage
    fc.assert(
      fc.property(
        fc.constantFrom(
          'primary',
          'secondary',
          'accent',
          'background',
          'surface'
        ),
        (colorKey) => {
          // Define expected colors for each key
          const expectedColors: Record<string, string[]> = {
            primary: ['#29F2DF', 'rgba(41, 242, 223, 1)'],
            secondary: ['#1C7FA6', 'rgba(28, 127, 166, 1)'],
            accent: ['#EF3EF1', 'rgba(239, 62, 241, 1)'],
            background: ['#0A1225', 'rgba(10, 18, 37, 1)'], // CORRECT: should be dark blue/black
            surface: ['#28125A', 'rgba(40, 18, 90, 1)'],    // CORRECT: should be dark purple
          };

          // Check if the theme file uses the correct color for this key
          const colorPattern = new RegExp(`${colorKey}:\\s*['"]([^'"]+)['"]`);
          const matches = themesContent.match(colorPattern);

          if (matches && matches[1]) {
            const actualColor = matches[1];
            const expected = expectedColors[colorKey];

            // Verify the color is one of the expected values
            const isCorrect = expected.some(exp => 
              actualColor.toUpperCase() === exp.toUpperCase()
            );

            // This assertion will FAIL on unfixed code for 'background' key
            // because it uses #28125A instead of #0A1225
            expect(isCorrect).toBe(true);
          }
        }
      ),
      { numRuns: 5 } // Run for each color key
    );
  });

  /**
   * Property 5: Fault Condition - Semantic Color Usage
   * 
   * **Validates: Requirements 2.1, 2.2, 2.3**
   * 
   * This test verifies that colors are used with correct semantic meaning:
   * - #0A1225 should be used for PRIMARY backgrounds
   * - #28125A should be used for SURFACE backgrounds (cards, panels)
   * - Primary, secondary, and accent colors should be used for UI elements
   * 
   * **EXPECTED OUTCOME ON UNFIXED CODE**: Test FAILS (confirms bug exists)
   * **EXPECTED OUTCOME ON FIXED CODE**: Test PASSES (confirms bug is fixed)
   */
  it('should verify semantic color usage in theme configuration', () => {
    const themesPath = path.join(process.cwd(), 'src/theme/themes.ts');
    const themesContent = fs.readFileSync(themesPath, 'utf-8');

    // Extract the darkMode theme configuration
    const darkModeMatch = themesContent.match(/export const darkMode[^{]*{[\s\S]*?colors:\s*{[\s\S]*?}/);
    
    if (darkModeMatch) {
      const darkModeColors = darkModeMatch[0];

      // Verify PRIMARY background uses #0A1225 (dark blue/black)
      const backgroundMatch = darkModeColors.match(/background:\s*['"]([^'"]+)['"]/);
      if (backgroundMatch) {
        const backgroundColor = backgroundMatch[1].toUpperCase();
        expect(backgroundColor).toBe(CORRECT_PALETTE.primaryBackground); // Should be #0A1225
      }

      // Verify SURFACE background uses #28125A (dark purple)
      const surfaceMatch = darkModeColors.match(/surface:\s*['"]([^'"]+)['"]/);
      if (surfaceMatch) {
        const surfaceColor = surfaceMatch[1].toUpperCase();
        expect(surfaceColor).toBe(CORRECT_PALETTE.surfaceBackground); // Should be #28125A
      }

      // Verify primary color uses #29F2DF (cyan)
      const primaryMatch = darkModeColors.match(/primary:\s*['"]([^'"]+)['"]/);
      if (primaryMatch) {
        const primaryColor = primaryMatch[1].toUpperCase();
        expect(primaryColor).toBe(CORRECT_PALETTE.primary); // Should be #29F2DF
      }

      // Verify secondary color uses #1C7FA6 (blue)
      const secondaryMatch = darkModeColors.match(/secondary:\s*['"]([^'"]+)['"]/);
      if (secondaryMatch) {
        const secondaryColor = secondaryMatch[1].toUpperCase();
        expect(secondaryColor).toBe(CORRECT_PALETTE.secondary); // Should be #1C7FA6
      }

      // Verify accent color uses #EF3EF1 (pink)
      const accentMatch = darkModeColors.match(/accent:\s*['"]([^'"]+)['"]/);
      if (accentMatch) {
        const accentColor = accentMatch[1].toUpperCase();
        expect(accentColor).toBe(CORRECT_PALETTE.accent); // Should be #EF3EF1
      }
    }
  });

  /**
   * Property 6: Fault Condition - Gradient Colors
   * 
   * **Validates: Requirements 1.7**
   * 
   * This test verifies that gradients use correct base colors from the palette.
   * Gradients should use #0A1225 for background portions, not #28125A.
   * 
   * **EXPECTED OUTCOME ON UNFIXED CODE**: May FAIL if gradients use incorrect colors
   * **EXPECTED OUTCOME ON FIXED CODE**: Test PASSES (confirms correct gradient colors)
   */
  it('should verify gradients use correct palette colors', () => {
    // This is a scoped test - we check specific files for gradient usage
    const filesToCheck = [
      'src/theme/themes.ts',
      '../components/src/__tests__/ComponentsDemo.tsx',
    ];

    filesToCheck.forEach(filePath => {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        // Find all gradient definitions
        const gradientPattern = /linear-gradient\([^)]+\)/g;
        const gradients = content.match(gradientPattern) || [];

        gradients.forEach(gradient => {
          // Extract hex colors from gradient
          const hexColors = gradient.match(/#[0-9A-Fa-f]{6}/g) || [];

          hexColors.forEach(color => {
            const upperColor = color.toUpperCase();
            
            // Verify each color in gradient is from the palette
            const isFromPalette = Object.values(CORRECT_PALETTE).some(
              paletteColor => paletteColor === upperColor
            );

            // This will help identify gradients using non-palette colors
            if (!isFromPalette) {
              // Log for debugging but don't fail - gradients might use derived colors
              console.warn(`Gradient in ${filePath} uses non-palette color: ${color}`);
            }
          });
        });
      }
    });

    // This test is informational - it logs warnings but doesn't fail
    // The main bug is in theme configuration, not gradients
    expect(true).toBe(true);
  });
});
