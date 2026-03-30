import React, { useState, useEffect } from 'react';

export interface DecipherProps {
  children: string;
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

const CIPHER_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

export const Decipher: React.FC<DecipherProps> = ({
  children,
  duration = 1500,
  delay = 0,
  className = '',
  style = {},
  onComplete,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    const startTime = Date.now() + delay;
    let animationId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const charsToReveal = Math.floor(progress * children.length);

      const newRevealed = new Set<number>();
      for (let i = 0; i < charsToReveal; i++) {
        newRevealed.add(i);
      }
      setRevealedIndices(newRevealed);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        setRevealedIndices(new Set(Array.from({ length: children.length }, (_, i) => i)));
        onComplete?.();
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [children, duration, delay, onComplete]);

  const renderChar = (char: string, index: number) => {
    if (revealedIndices.has(index)) {
      return char;
    }
    return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
  };

  return (
    <span className={className} style={style}>
      {children.split('').map((char, index) => (
        <span key={index}>{renderChar(char, index)}</span>
      ))}
    </span>
  );
};
