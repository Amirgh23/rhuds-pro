/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR LOGIN FORM - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, FormEvent, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode, getMilitaryTimestamp } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';
import { ColdWarInput } from '../Input/ColdWarInput';
import { ColdWarButton } from '../Button/ColdWarButton';

export interface ColdWarLoginFormProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  onSubmit?: (username: string, password: string) => void;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showCorners?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarLoginForm: React.FC<ColdWarLoginFormProps> = ({
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
  const [techCode] = useState(() => generateTechCode('AUTH'));
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
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

  const formStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '24px',
  };

  return (
    <div className={className} style={containerStyles}>
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
          <span>SECURE LOGIN</span>
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
      <form onSubmit={handleSubmit} style={formStyles}>
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

      {/* Corner Brackets */}
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

      {/* Scanlines */}
      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}

      {/* Glow */}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      {/* Animations */}
      <style>
        {`
          @keyframes led-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ColdWarLoginForm;
