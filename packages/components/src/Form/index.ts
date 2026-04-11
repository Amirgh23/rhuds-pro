/**
 * Form Components Index
 *
 * Exports all form variants including:
 * - Base Checkbox, Radio, Toggle components
 * - Theme-specific variants (Neon, Cyberpunk, Bubble, etc.)
 * - Form utilities and providers
 */

// Base Form Components
export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { Radio } from './Radio';
export type { RadioProps, RadioOption } from './Radio';

export { ToggleSwitch } from './ToggleSwitch';
export type { ToggleSwitchProps } from './ToggleSwitch';

export { Switch } from './Switch';
export type { SwitchProps } from './Switch';

export { useForm } from './useForm';
export type { UseFormProps, FormState, FormValidationRule } from './types';

// Neon Form Components
export { NeonCheckbox } from './NeonCheckbox';
export type { NeonCheckboxProps } from './NeonCheckbox';

export { NeonRadio } from './NeonRadio';
export type { NeonRadioProps, NeonRadioOption } from './NeonRadio';

export { NeonSlider } from './NeonSlider';
export type { NeonSliderProps } from './NeonSlider';

// Holo Form Components
export { HoloCheckbox } from './HoloCheckbox';
export type { HoloCheckboxProps } from './HoloCheckbox';

// Cyberpunk Form Components
export { CyberpunkCheckbox } from './CyberpunkCheckbox';
export type { CyberpunkCheckboxProps } from './CyberpunkCheckbox';

export { CyberpunkRadio } from './CyberpunkRadio';
export type { CyberpunkRadioProps, CyberpunkRadioOption } from './CyberpunkRadio';

export { CyberpunkToggle } from './CyberpunkToggle';
export type { CyberpunkToggleProps } from './CyberpunkToggle';

// Glitch Form Components
export { GlitchRadio } from './GlitchRadio';
export type { GlitchRadioProps, GlitchRadioOption } from './GlitchRadio';

export { GlitchLoginForm } from './GlitchLoginForm';
export type { GlitchLoginFormProps } from './GlitchLoginForm';

export { GlitchLoginFormAnimated } from './GlitchLoginFormAnimated';
export type { GlitchLoginFormAnimatedProps } from './GlitchLoginFormAnimated';

// Bubble Form Components
export { BubbleCheckbox } from './BubbleCheckbox';
export type { BubbleCheckboxProps } from './BubbleCheckbox';

// Glow Form Components
export { GlowingNeonCheckbox } from './GlowingNeonCheckbox';
export type { GlowingNeonCheckboxProps } from './GlowingNeonCheckbox';

// Specialized Form Components
export { LockSwitch } from './LockSwitch';
export type { LockSwitchProps } from './LockSwitch';

export { CyberLoginForm } from './CyberLoginForm';
export type { CyberLoginFormProps } from './types';

// HUD Form Elements
export {
  HudInput,
  HudTextarea,
  HudSelect,
  HudRange,
  HudCheckbox,
  HudRadio,
  HudSwitch,
  HudFile,
  HudFormGrid,
  HudFormHelpText,
  HudInputGroup,
  HudFormFeedback,
  HudInputValidated,
  HudSelectValidated,
  HudTextareaValidated,
} from './HudFormElements';

export { HudFormControl } from './HudFormControl';

// Cold War Form Components
export { ColdWarCheckbox } from './ColdWarCheckbox';
export type { ColdWarCheckboxProps } from './ColdWarCheckbox';

export { ColdWarRadio } from './ColdWarRadio';
export type { ColdWarRadioProps } from './ColdWarRadio';

export { ColdWarSwitch } from './ColdWarSwitch';
export type { ColdWarSwitchProps } from './ColdWarSwitch';

export { ColdWarHoloCheckbox } from './ColdWarHoloCheckbox';
export type { ColdWarHoloCheckboxProps } from './ColdWarHoloCheckbox';

export { ColdWarCyberpunkCheckbox } from './ColdWarCyberpunkCheckbox';
export type { ColdWarCyberpunkCheckboxProps } from './ColdWarCyberpunkCheckbox';

export { ColdWarBubbleCheckbox } from './ColdWarBubbleCheckbox';
export type { ColdWarBubbleCheckboxProps } from './ColdWarBubbleCheckbox';

export { ColdWarNeonCheckbox } from './ColdWarNeonCheckbox';
export type { ColdWarNeonCheckboxProps } from './ColdWarNeonCheckbox';

export { ColdWarGlowingCheckbox } from './ColdWarGlowingCheckbox';
export type { ColdWarGlowingCheckboxProps } from './ColdWarGlowingCheckbox';

export { ColdWarGlitchRadio } from './ColdWarGlitchRadio';
export type { ColdWarGlitchRadioProps } from './ColdWarGlitchRadio';

export { ColdWarCyberpunkRadio } from './ColdWarCyberpunkRadio';
export type { ColdWarCyberpunkRadioProps } from './ColdWarCyberpunkRadio';

export { ColdWarNeonRadio } from './ColdWarNeonRadio';
export type { ColdWarNeonRadioProps } from './ColdWarNeonRadio';

export { ColdWarToggleSwitch } from './ColdWarToggleSwitch';
export type { ColdWarToggleSwitchProps } from './ColdWarToggleSwitch';

export { ColdWarCyberpunkToggle } from './ColdWarCyberpunkToggle';
export type { ColdWarCyberpunkToggleProps } from './ColdWarCyberpunkToggle';

export { ColdWarLockSwitch } from './ColdWarLockSwitch';
export type { ColdWarLockSwitchProps } from './ColdWarLockSwitch';

export { ColdWarNeonSlider } from './ColdWarNeonSlider';
export type { ColdWarNeonSliderProps } from './ColdWarNeonSlider';

export { ColdWarSlider } from './ColdWarSlider';
export type { ColdWarSliderProps } from './ColdWarSlider';

// Cold War Login Forms
export { ColdWarLoginForm } from './ColdWarLoginForm';
export type { ColdWarLoginFormProps } from './ColdWarLoginForm';

export { ColdWarCyberLoginForm } from './ColdWarCyberLoginForm';
export type { ColdWarCyberLoginFormProps } from './ColdWarCyberLoginForm';

export { ColdWarAnimatedLoginForm } from './ColdWarAnimatedLoginForm';
export type { ColdWarAnimatedLoginFormProps } from './ColdWarAnimatedLoginForm';

// Wrapper Components (Phase 4)
export {
  Checkbox as CheckboxWrapper,
  NeonCheckbox as NeonCheckboxWrapper,
  GlowingNeonCheckbox as GlowingNeonCheckboxWrapper,
  CyberpunkCheckbox as CyberpunkCheckboxWrapper,
  BubbleCheckbox as BubbleCheckboxWrapper,
  ColdWarCheckbox as ColdWarCheckboxWrapper,
  GlitchCheckbox as GlitchCheckboxWrapper,
  HoloCheckbox as HoloCheckboxWrapper,
} from './Checkbox.wrapper';
