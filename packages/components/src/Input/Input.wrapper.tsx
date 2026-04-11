/**
 * Input Component Wrapper
 * Maintains backward compatibility by wrapping BaseInput
 * Consolidates all input variants into a single component
 */

import React from 'react';
import { BaseInput, type BaseInputProps } from '../core/BaseInput';

/**
 * Input Component - Backward compatible wrapper
 * Replaces: Input, HackerInput, AiHudInput, HoloInput, etc.
 */
export const Input = React.forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
  return <BaseInput ref={ref} inputTheme="rhuds" {...props} />;
});

Input.displayName = 'Input';

/**
 * HackerInput - Hacker theme variant
 */
export const HackerInput = React.forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
  return <BaseInput ref={ref} inputTheme="hacker" {...props} />;
});

HackerInput.displayName = 'HackerInput';

/**
 * AiHudInput - RHUDS theme variant
 */
export const AiHudInput = React.forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
  return <BaseInput ref={ref} inputTheme="rhuds" {...props} />;
});

AiHudInput.displayName = 'AiHudInput';

/**
 * HoloInput - Holo theme variant
 */
export const HoloInput = React.forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
  return <BaseInput ref={ref} inputTheme="holo" {...props} />;
});

HoloInput.displayName = 'HoloInput';

/**
 * BashInput - Bash theme variant
 */
export const BashInput = React.forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
  return <BaseInput ref={ref} inputTheme="bash" {...props} />;
});

BashInput.displayName = 'BashInput';

/**
 * ColdWarInput - ColdWar theme variant
 */
export const ColdWarInput = React.forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
  return <BaseInput ref={ref} inputTheme="coldwar" {...props} />;
});

ColdWarInput.displayName = 'ColdWarInput';

/**
 * CyberpunkAccessInput - Cyberpunk theme variant
 */
export const CyberpunkAccessInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (props, ref) => {
    return <BaseInput ref={ref} inputTheme="cyberpunk" {...props} />;
  }
);

CyberpunkAccessInput.displayName = 'CyberpunkAccessInput';

/**
 * FloatingLabelInput - Floating theme variant
 */
export const FloatingLabelInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (props, ref) => {
    return <BaseInput ref={ref} inputTheme="floating" {...props} />;
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';

/**
 * GradientSearchInput - Gradient theme variant
 */
export const GradientSearchInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (props, ref) => {
    return <BaseInput ref={ref} inputTheme="gradient" {...props} />;
  }
);

GradientSearchInput.displayName = 'GradientSearchInput';
