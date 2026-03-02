import { useState, useEffect } from 'react';

export function useKeyPress(targetKey: string): boolean {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setIsPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setIsPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [targetKey]);

  return isPressed;
}
