/**
 * Checkbox Component Wrapper
 * Maintains backward compatibility by wrapping BaseCheckbox
 * Consolidates all checkbox variants into a single component
 */

import React from 'react';
import { BaseCheckbox, type BaseCheckboxProps } from '../core/BaseCheckbox';

/**
 * Checkbox Component - Backward compatible wrapper
 * Replaces: Checkbox, NeonCheckbox, GlowingNeonCheckbox, etc.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, BaseCheckboxProps>((props, ref) => {
  return <BaseCheckbox ref={ref} checkboxTheme="rhuds" {...props} />;
});

Checkbox.displayName = 'Checkbox';

/**
 * NeonCheckbox - Neon theme variant
 */
export const NeonCheckbox = React.forwardRef<HTMLInputElement, BaseCheckboxProps>((props, ref) => {
  return <BaseCheckbox ref={ref} checkboxTheme="neon" {...props} />;
});

NeonCheckbox.displayName = 'NeonCheckbox';

/**
 * GlowingNeonCheckbox - Glow theme variant
 */
export const GlowingNeonCheckbox = React.forwardRef<HTMLInputElement, BaseCheckboxProps>(
  (props, ref) => {
    return <BaseCheckbox ref={ref} checkboxTheme="glow" {...props} />;
  }
);

GlowingNeonCheckbox.displayName = 'GlowingNeonCheckbox';

/**
 * CyberpunkCheckbox - Cyberpunk theme variant
 */
export const CyberpunkCheckbox = React.forwardRef<HTMLInputElement, BaseCheckboxProps>(
  (props, ref) => {
    return <BaseCheckbox ref={ref} checkboxTheme="cyberpunk" {...props} />;
  }
);

CyberpunkCheckbox.displayName = 'CyberpunkCheckbox';

/**
 * BubbleCheckbox - Bubble theme variant
 */
export const BubbleCheckbox = React.forwardRef<HTMLInputElement, BaseCheckboxProps>(
  (props, ref) => {
    return <BaseCheckbox ref={ref} checkboxTheme="bubble" {...props} />;
  }
);

BubbleCheckbox.displayName = 'BubbleCheckbox';

/**
 * ColdWarCheckbox - ColdWar theme variant
 */
export const ColdWarCheckbox = React.forwardRef<HTMLInputElement, BaseCheckboxProps>(
  (props, ref) => {
    return <BaseCheckbox ref={ref} checkboxTheme="coldwar" {...props} />;
  }
);

ColdWarCheckbox.displayName = 'ColdWarCheckbox';

/**
 * GlitchCheckbox - Glitch theme variant
 */
export const GlitchCheckbox = React.forwardRef<HTMLInputElement, BaseCheckboxProps>(
  (props, ref) => {
    return <BaseCheckbox ref={ref} checkboxTheme="glitch" {...props} />;
  }
);

GlitchCheckbox.displayName = 'GlitchCheckbox';

/**
 * HoloCheckbox - Holo theme variant
 */
export const HoloCheckbox = React.forwardRef<HTMLInputElement, BaseCheckboxProps>((props, ref) => {
  return <BaseCheckbox ref={ref} checkboxTheme="holo" {...props} />;
});

HoloCheckbox.displayName = 'HoloCheckbox';
