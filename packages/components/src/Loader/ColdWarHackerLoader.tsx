/**
 * Cold War Hacker Loader
 * Typing text animation with cursor - terminal-style loading
 */

import React, { CSSProperties, useState } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS, getComponentChamferClip, useTimeout } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarHackerLoaderProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  size?: 'sm' | 'md' | 'lg';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showTechCode?: boolean;
  showCorners?: boolean;
  messages?: string[];
  typingSpeed?: number;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_MESSAGES = [
  'INITIALIZING SYSTEM...',
  'CONNECTING TO SERVER...',
  'DECRYPTING DATA...',
  'ACCESS GRANTED',
];

export const ColdWarHackerLoader: React.FC<ColdWarHackerLoaderProps> = ({
  theme = 'perseus',
  size = 'md',
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showTechCode = true,
  showCorners = true,
  messages = DEFAULT_MESSAGES,
  typingSpeed = 50,
  className = '',
  style = {},
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const sizeMap = {
    sm: { width: 250, height: 80, fontSize: '11px' },
    md: { width: 350, height: 100, fontSize: '13px' },
    lg: { width: 450, height: 120, fontSize: '15px' },
  };
  const sizes = sizeMap[size];

  const currentMessage = messages[currentMessageIndex];
  const isTyping = currentCharIndex < currentMessage.length;

  useTimeout(
    () => {
      if (isTyping) {
        setDisplayText(currentMessage.substring(0, currentCharIndex + 1));
        setCurrentCharIndex(currentCharIndex + 1);
      } else {
        setCurrentMessageIndex((currentMessageIndex + 1) % messages.length);
        setCurrentCharIndex(0);
        setDisplayText('');
      }
    },
    isTyping ? typingSpeed : 1000
  );

  const containerStyles: CSSProperties = {
    position: 'relative',
    width: `${sizes.width}px`,
    height: `${sizes.height}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(10, 10, 20, 0.95)',
    border: `1px solid ${themeColors.primary}`,
    clipPath: getComponentChamferClip('card'),
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    overflow: 'hidden',
    ...style,
  };

  const textContainerStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    fontSize: sizes.fontSize,
    color: themeColors.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 500,
    textShadow: glow ? `0 0 10px rgba(${rgb}, 0.8)` : 'none',
  };

  const cursorStyles: CSSProperties = {
    display: 'inline-block',
    width: '8px',
    height: sizes.fontSize,
    backgroundColor: themeColors.primary,
    marginLeft: '4px',
    animation: 'blink 1s step-end infinite',
  };

  const cornerStyles: CSSProperties = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    border: `1px solid ${themeColors.primary}`,
  };

  const techCodeStyles: CSSProperties = {
    position: 'absolute',
    top: '8px',
    left: '12px',
    fontSize: '10px',
    color: themeColors.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 500,
    opacity: 0.7,
  };

  return (
    <div
      className={className}
      style={containerStyles}
      role="status"
      aria-label="Loading"
      aria-live="polite"
    >
      {showCorners && (
        <>
          <div
            style={{ ...cornerStyles, top: 0, left: 0, borderRight: 'none', borderBottom: 'none' }}
          />
          <div
            style={{ ...cornerStyles, top: 0, right: 0, borderLeft: 'none', borderBottom: 'none' }}
          />
          <div
            style={{ ...cornerStyles, bottom: 0, left: 0, borderRight: 'none', borderTop: 'none' }}
          />
          <div
            style={{ ...cornerStyles, bottom: 0, right: 0, borderLeft: 'none', borderTop: 'none' }}
          />
        </>
      )}

      <div style={textContainerStyles}>
        <span>{displayText}</span>
        <span style={cursorStyles} />
      </div>

      {showTechCode && <div style={techCodeStyles}>{generateTechCode('HCK')}</div>}

      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ColdWarHackerLoader;
