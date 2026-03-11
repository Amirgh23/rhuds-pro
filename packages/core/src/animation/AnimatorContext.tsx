/**
 * Animator Context
 * Provides parent-child animator relationships and state propagation
 */

import React from 'react';

/**
 * Animator control interface
 */
interface AnimatorControl {
  flow: {
    entered: boolean;
    entering: boolean;
  };
}

/**
 * Animator context for parent-child relationships
 */
interface AnimatorContextValue {
  parentControl?: AnimatorControl;
  depth: number;
}

const AnimatorContext = React.createContext<AnimatorContextValue>({
  depth: 0,
});

/**
 * Hook to access parent animator control
 */
export function useParentAnimator(): AnimatorControl | undefined {
  const context = React.useContext(AnimatorContext);
  return context.parentControl;
}

/**
 * Hook to get animator depth in hierarchy
 */
export function useAnimatorDepth(): number {
  const context = React.useContext(AnimatorContext);
  return context.depth;
}

/**
 * Provider for animator context
 */
interface AnimatorProviderProps {
  control: AnimatorControl;
  children: React.ReactNode;
}

export const AnimatorProvider: React.FC<AnimatorProviderProps> = ({ control, children }) => {
  const parentContext = React.useContext(AnimatorContext);

  const value = React.useMemo(
    () => ({
      parentControl: control,
      depth: parentContext.depth + 1,
    }),
    [control, parentContext.depth]
  );

  return <AnimatorContext.Provider value={value}>{children}</AnimatorContext.Provider>;
};

/**
 * Hook to determine if animator should activate based on parent state
 */
export function useParentActivation(
  localActivate: boolean = true,
  propagateFromParent: boolean = true
): boolean {
  const parentControl = useParentAnimator();

  if (!propagateFromParent || !parentControl) {
    return localActivate;
  }

  // Child should only activate if parent is entered or entering
  const parentActive = parentControl.flow.entered || parentControl.flow.entering;

  return localActivate && parentActive;
}
