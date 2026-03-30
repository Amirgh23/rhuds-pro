/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR CYBER LOGIN FORM - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Advanced login with biometric indicators and security features
 */

import React, { useState, FormEvent, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import {
  getRgbString,
  generateTechCode,
  getMilitaryTimestamp,
  generateCoordinates,
} from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';
import { ColdWarInput } from '../Input/ColdWarInput';
import { ColdWarButton } from '../Button/ColdWarButton';

export interface ColdWarCyberLoginFormProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  onSubmit?: (username: string, password: string, biometric: boolean) => void;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showCorners?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarCyberLoginForm: React.FC<ColdWarCyberLoginFormProps> = ({
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
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [securityLevel, setSecurityLevel] = useState(0);
  const [techCode] = useState(() => generateTechCode('CYBER'));
  const [coordinates] = useState(() => generateCoordinates());
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate security check
    for (let i = 0; i <= 100; i += 20) {
      setSecurityLevel(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    onSubmit?.(username, password, biometricEnabled);
    setIsLoading(false);
    setSecurityLevel(0);
  };

  const containerStyles: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '450px',
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
          <span>CYBER AUTHENTICATION</span>
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
        </div>
      </div>

      {/* Security Info */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid rgba(${rgb}, 0.2)`,
          fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
          fontSize: '10px',
          color: themeColors.text,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
        }}
      >
        <div>
          <span style={{ opacity: 0.6 }}>LOCATION:</span> {coordinates}
        </div>
        <div>
          <span style={{ opacity: 0.6 }}>TIME:</span> {getMilitaryTimestamp()}
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

        {/* Biometric Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: `rgba(${rgb}, 0.1)`,
            border: `1px solid rgba(${rgb}, 0.3)`,
          }}
        >
          <input
            type="checkbox"
            checked={biometricEnabled}
            onChange={(e) => setBiometricEnabled(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <span
            style={{
              fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: themeColors.primary,
            }}
          >
            ENABLE BIOMETRIC SCAN
          </span>
        </div>

        {/* Security Level Progress */}
        {isLoading && securityLevel > 0 && (
          <div style={{ marginTop: '8px' }}>
            <div
              style={{
                fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: themeColors.primary,
                marginBottom: '8px',
              }}
            >
              SECURITY CHECK: {securityLevel}%
            </div>
            <div
              style={{
                width: '100%',
                height: '4px',
                background: `rgba(${rgb}, 0.2)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${securityLevel}%`,
                  height: '100%',
                  background: themeColors.primary,
                  boxShadow: `0 0 10px ${themeColors.primary}`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}

        <ColdWarButton
          theme={theme}
          variant="primary"
          type="submit"
          isLoading={isLoading}
          scanlines={false}
          glow={glow}
          style={{ marginTop: '8px' }}
        >
          {isLoading ? 'AUTHENTICATING...' : 'SECURE LOGIN'}
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
        `}
      </style>
    </div>
  );
};

export default ColdWarCyberLoginForm;
