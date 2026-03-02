import { useState, useCallback } from 'react';

export type AnimatorState = 'entering' | 'entered' | 'exiting' | 'exited';

export interface UseAnimatorReturn {
  state: AnimatorState;
  setState: (state: AnimatorState) => void;
  enter: () => void;
  exit: () => void;
}

export function useAnimator(initialState: AnimatorState = 'exited'): UseAnimatorReturn {
  const [state, setState] = useState<AnimatorState>(initialState);

  const enter = useCallback(() => {
    setState('entering');
  }, []);

  const exit = useCallback(() => {
    setState('exiting');
  }, []);

  return {
    state,
    setState,
    enter,
    exit,
  };
}
