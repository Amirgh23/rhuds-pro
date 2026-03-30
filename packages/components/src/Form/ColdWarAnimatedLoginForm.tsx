/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR ANIMATED LOGIN FORM - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Login form with glitch animations and tactical effects
 */

import React, { useState, FormEvent, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode, getMilitaryTimestamp } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';
import { ColdWarInput } from '../Input/ColdWarInput';
import { ColdWarButton } from '../Button/ColdWarButton';

export interface ColdWarAnimatedLoginFormProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  onSubmit?: (username: string, password: string) => void;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showCorners?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarAnimatedLoginForm: React.FC<ColdWarAnimatedLoginFormProps> = ({
  theme = 'perseus',
  onSubmit,
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showCorners = true,
  className = '',
  style = {},
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [techCode] = useState(() => generateTechCode('GLITCH'));
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  // Random glitch effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Trigger glitch effect on submit
    setGlitchActive(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    setGlitchActive(false);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    onSubmit?.(username, password);
    setIsLoading(false);
  };

  const containerStyles: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    background: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(${rgb}, 0.02) 2px,
        rgba(${rgb}, 0.02) 4px
      ),
      linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(10, 10, 20, 0.95) 100())
    `,
    border: `1px solid rgba(${rgb}, 0.3)`,
    boxShadow: `
      inset 0 0 30px rgba(0, 0, 0, 0.6),
      inset 0 0 10px rgba(${rgb}, 0.1),
      0 4px 12px rgba(0, 0, 0, 0.4)
    `,
    overflow: 'hidden',
    filter: glitchActive ? 'hue-rotate(90deg) saturate(2)' : 'none',
    transform: glitchActive ? 'skewX(2deg)' : 'none',
    transition: 'filter 0.1s, transform 0.1s',
    ...style,
  };

  const headerStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: `1px solid rgba(${rgb}, 0.3)`,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: themeColors.primary,
    background: `rgba(${rgb}, 0.1)`,
  };

  return (
    <div className={className} style={containerStyles}>
      {/* Glitch Overlay */}
      {glitchActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
            repeating-linear-gradient(
              0deg,
              rgba(${rgb}, 0.3) 0px,
              rgba(${rgb}, 0.3) 2px,
              transparent 2px,
              transparent 4px
            )
          `,
            pointerEvents: 'none',
            zIndex: 100,
            animation: 'glitch-scan 0.1s linear infinite',
          }}
        />
      )}

      {/* Header */}
      <div style={headerStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: themeColors.primary,
              boxShadow: `0 0 6px ${themeColors.primary}`,
              animation: 'led-pulse 1s ease-in-out infinite',
            }}
          />
          <span style={{ animation: glitchActive ? 'text-glitch 0.1s infinite' : 'none' }}>
            TACTICAL LOGIN
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '9px',
            opacity: 0.6,
          }}
        >
          <span>{techCode}</span>
          <span>{getMilitaryTimestamp()}</span>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}
      >
        <ColdWarInput
          theme={theme}
          label="USERNAME"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          scanlines={false}
          glow={glow}
          required
        />

        <ColdWarInput
          theme={theme}
          label="PASSWORD"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          scanlines={false}
          glow={glow}
          required
        />

        <ColdWarButton
          theme={theme}
          variant="primary"
          type="submit"
          isLoading={isLoading}
          scanlines={false}
          glow={glow}
          style={{ marginTop: '8px' }}
        >
          {isLoading ? 'AUTHENTICATING...' : 'LOGIN'}
        </ColdWarButton>
      </form>

      {showCorners && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              width: '12px',
              height: '12px',
              borderTop: `2px solid ${themeColors.primary}`,
              borderLeft: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '12px',
              height: '12px',
              borderTop: `2px solid ${themeColors.primary}`,
              borderRight: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              left: '4px',
              width: '12px',
              height: '12px',
              borderBottom: `2px solid ${themeColors.primary}`,
              borderLeft: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '12px',
              height: '12px',
              borderBottom: `2px solid ${themeColors.primary}`,
              borderRight: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
        </>
      )}

      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      <style>
        {`
          @keyframes led-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          
          @keyframes glitch-scan {
            0% { transform: translateY(0); }
            100% { transform: translateY(100%); }
          }
          
          @keyframes text-glitch {
            0% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            50% { transform: translateX(2px); }
            75% { transform: translateX(-1px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
};

export default ColdWarAnimatedLoginForm;
