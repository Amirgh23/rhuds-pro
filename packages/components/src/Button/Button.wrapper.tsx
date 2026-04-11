/**
 * Button Component Wrapper
 * Maintains backward compatibility by wrapping BaseButton
 * Consolidates all button variants into a single component
 */

import React from 'react';
import { BaseButton, type BaseButtonProps } from '../core/BaseButton';

/**
 * Button Component - Backward compatible wrapper
 * Replaces: Button, HudButton, NeonButton, GlitchButton, etc.
 */
export const Button = React.forwardRef<HTMLButtonElement, BaseButtonProps>((props, ref) => {
  return <BaseButton ref={ref} buttonTheme="rhuds" {...props} />;
});

Button.displayName = 'Button';

/**
 * HudButton - ColdWar theme variant
 */
export const HudButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>((props, ref) => {
  return <BaseButton ref={ref} buttonTheme="coldwar" {...props} />;
});

HudButton.displayName = 'HudButton';

/**
 * NeonButton - Neon theme variant
 */
export const NeonButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>((props, ref) => {
  return <BaseButton ref={ref} buttonTheme="neon" {...props} />;
});

NeonButton.displayName = 'NeonButton';

/**
 * ColdWarButton - ColdWar theme variant
 */
export const ColdWarButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>((props, ref) => {
  return <BaseButton ref={ref} buttonTheme="coldwar" {...props} />;
});

ColdWarButton.displayName = 'ColdWarButton';

/**
 * GlitchButton - Glitch theme variant
 */
export const GlitchButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>((props, ref) => {
  return <BaseButton ref={ref} buttonTheme="glitch" {...props} />;
});

GlitchButton.displayName = 'GlitchButton';

/**
 * CyberpunkButton - Cyberpunk theme variant
 */
export const CyberpunkButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => {
    return <BaseButton ref={ref} buttonTheme="cyberpunk" {...props} />;
  }
);

CyberpunkButton.displayName = 'CyberpunkButton';

/**
 * GlowButton - Glow theme variant
 */
export const GlowButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>((props, ref) => {
  return <BaseButton ref={ref} buttonTheme="glow" {...props} />;
});

GlowButton.displayName = 'GlowButton';

/**
 * HoloButton - Holo theme variant
 */
export const HoloButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>((props, ref) => {
  return <BaseButton ref={ref} buttonTheme="holo" {...props} />;
});

HoloButton.displayName = 'HoloButton';
