import React, { useState, useEffect } from 'react';

export type TextRenderMode = 'static' | 'animated' | 'typewriter';

export interface TextProps {
  children: string;
  mode?: TextRenderMode;
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

export const Text: React.FC<TextProps> = ({
  children,
  mode = 'static',
  duration = 1000,
  delay = 0,
  className = '',
  style = {},
  onComplete,
}) => {
  const [displayText, setDisplayText] = useState(mode === 'static' ? children : '');
  const [isComplete, setIsComplete] = useState(mode === 'static');

  useEffect(() => {
    if (mode === 'static') {
      setDisplayText(children);
      setIsComplete(true);
      return;
    }

    const startTime = Date.now() + delay;
    let animationId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (mode === 'typewriter') {
        const charCount = Math.floor(progress * children.length);
        setDisplayText(children.slice(0, charCount));
      } else if (mode === 'animated') {
        setDisplayText(children);
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        setDisplayText(children);
        setIsComplete(true);
        onComplete?.();
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [children, mode, duration, delay, onComplete]);

  return (
    <span className={className} style={style}>
      {displayText}
    </span>
  );
};
