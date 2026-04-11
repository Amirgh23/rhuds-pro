/**
 * Input Components Index
 *
 * Exports all input variants including:
 * - Base Input component
 * - Theme-specific variants (Hacker, AI HUD, Holo, etc.)
 * - Specialized inputs (Bash, Gradient, Floating, etc.)
 */

// Base Input
export { Input } from './Input';
export type { InputProps } from './Input';

// HUD Inputs
export { AiHudInput } from './AiHudInput';
export type { AiHudInputProps } from './AiHudInput';

export { HudInput } from './HudInput';
export type { HudInputProps } from './HudInput';

// Hacker/Terminal Inputs
export { HackerInput } from './HackerInput';
export type { HackerInputProps } from './HackerInput';

export { BashInput } from './BashInput';
export type { BashInputProps } from './BashInput';

// Holo Inputs
export { HoloInput } from './HoloInput';
export type { HoloInputProps } from './HoloInput';

export { HoloGlitchInput } from './HoloGlitchInput';
export type { HoloGlitchInputProps } from './HoloGlitchInput';

// Specialized Inputs
export { FuturisticInput } from './FuturisticInput';
export type { FuturisticInputProps } from './FuturisticInput';

export { CyberpunkAccessInput } from './CyberpunkAccessInput';
export type { CyberpunkAccessInputProps } from './CyberpunkAccessInput';

export { GradientSearchInput } from './GradientSearchInput';
export type { GradientSearchInputProps } from './GradientSearchInput';

export { FloatingLabelInput } from './FloatingLabelInput';
export type { FloatingLabelInputProps } from './FloatingLabelInput';

export { AddFriendInput } from './AddFriendInput';
export type { AddFriendInputProps } from './AddFriendInput';

export { VerificationCodeInput } from './VerificationCodeInput';
export type { VerificationCodeInputProps } from './VerificationCodeInput';

// Cold War Inputs
export { ColdWarInput } from './ColdWarInput';
export type { ColdWarInputProps } from './ColdWarInput';

export { ColdWarSearchInput } from './ColdWarSearchInput';
export type { ColdWarSearchInputProps } from './ColdWarSearchInput';

export { ColdWarHackerInput } from './ColdWarHackerInput';
export type { ColdWarHackerInputProps } from './ColdWarHackerInput';

export { ColdWarAiInput } from './ColdWarAiInput';
export type { ColdWarAiInputProps } from './ColdWarAiInput';

export { ColdWarHoloInput } from './ColdWarHoloInput';
export type { ColdWarHoloInputProps } from './ColdWarHoloInput';

export { ColdWarHoloInputAdvanced } from './ColdWarHoloInputAdvanced';
export type { ColdWarHoloInputAdvancedProps } from './ColdWarHoloInputAdvanced';

export { ColdWarFuturisticInput } from './ColdWarFuturisticInput';
export type { ColdWarFuturisticInputProps } from './ColdWarFuturisticInput';

export { ColdWarBashInput } from './ColdWarBashInput';
export type { ColdWarBashInputProps } from './ColdWarBashInput';

export { ColdWarFloatingInput } from './ColdWarFloatingInput';
export type { ColdWarFloatingInputProps } from './ColdWarFloatingInput';

export { ColdWarAccessInput } from './ColdWarAccessInput';
export type { ColdWarAccessInputProps } from './ColdWarAccessInput';

export { ColdWarFriendInput } from './ColdWarFriendInput';
export type { ColdWarFriendInputProps } from './ColdWarFriendInput';

export { ColdWarCodeInput } from './ColdWarCodeInput';
export type { ColdWarCodeInputProps } from './ColdWarCodeInput';

// Wrapper Components (Phase 4)
export {
  Input as InputWrapper,
  HackerInput as HackerInputWrapper,
  AiHudInput as AiHudInputWrapper,
  HoloInput as HoloInputWrapper,
  BashInput as BashInputWrapper,
  ColdWarInput as ColdWarInputWrapper,
  CyberpunkAccessInput as CyberpunkAccessInputWrapper,
  FloatingLabelInput as FloatingLabelInputWrapper,
  GradientSearchInput as GradientSearchInputWrapper,
} from './Input.wrapper';
