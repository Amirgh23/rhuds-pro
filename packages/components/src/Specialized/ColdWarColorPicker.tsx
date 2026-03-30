/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR COLOR PICKER - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarColorPickerProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  value?: string;
  onChange?: (color: string) => void;
  presetColors?: string[];
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showCorners?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarColorPicker: React.FC<ColdWarColorPickerProps> = ({
  theme = 'perseus',
  value = '#ffb000',
  onChange,
  presetColors = ['#ffb000', '#33ff00', '#00ccff', '#ff3333', '#ff00ff', '#ffff00'],
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showCorners = true,
  className = '',
  style = {},
}) => {
  const [selectedColor, setSelectedColor] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [techCode] = useState(() => generateTechCode('CLR'));
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onChange?.(color);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbValues = hexToRgb(selectedColor);

  const containerStyles: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    ...style,
  };

  const swatchStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: themeColors.primary,
    background: `rgba(${rgb}, 0.1)`,
    border: `1px solid rgba(${rgb}, 0.3)`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('input'),
    cursor: 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
  };

  const pickerStyles: CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '8px',
    minWidth: '280px',
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    background: `linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(10, 10, 20, 0.95) 100())`,
    border: `1px solid rgba(${rgb}, 0.5)`,
    boxShadow: `inset 0 0 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(${rgb}, 0.4), 0 8px 16px rgba(0, 0, 0, 0.5)`,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
    transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    zIndex: 1000,
    overflow: 'hidden',
  };

  return (
    <div className={className} style={containerStyles}>
      <div
        style={swatchStyles}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `rgba(${rgb}, 0.2)`;
          e.currentTarget.style.boxShadow = `0 0 10px rgba(${rgb}, 0.3)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `rgba(${rgb}, 0.1)`;
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            background: selectedColor,
            border: `1px solid ${themeColors.primary}`,
            boxShadow: `0 0 10px ${selectedColor}`,
          }}
        />
        <span>{selectedColor.toUpperCase()}</span>
      </div>

      <div style={pickerStyles}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            borderBottom: `1px solid rgba(${rgb}, 0.3)`,
            fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: themeColors.primary,
            background: `rgba(${rgb}, 0.1)`,
          }}
        >
          <span>COLOR PICKER</span>
          <span style={{ fontSize: '8px', opacity: 0.5 }}>{techCode}</span>
        </div>

        {/* Native Color Input */}
        <div style={{ padding: '16px' }}>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorChange(e.target.value)}
            style={{
              width: '100%',
              height: '60px',
              border: `1px solid ${themeColors.primary}`,
              cursor: 'pointer',
            }}
          />
        </div>

        {/* RGB Display */}
        {rgbValues && (
          <div
            style={{
              padding: '12px',
              borderTop: `1px solid rgba(${rgb}, 0.2)`,
              borderBottom: `1px solid rgba(${rgb}, 0.2)`,
              fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
              fontSize: '11px',
              color: themeColors.text,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
            }}
          >
            <div>R: {rgbValues.r}</div>
            <div>G: {rgbValues.g}</div>
            <div>B: {rgbValues.b}</div>
          </div>
        )}

        {/* Preset Colors */}
        <div style={{ padding: '12px' }}>
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
            PRESETS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
            {presetColors.map((color) => (
              <div
                key={color}
                onClick={() => handleColorChange(color)}
                style={{
                  width: '32px',
                  height: '32px',
                  background: color,
                  border:
                    selectedColor === color
                      ? `2px solid ${themeColors.primary}`
                      : `1px solid rgba(${rgb}, 0.3)`,
                  cursor: 'pointer',
                  transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
                  boxShadow: selectedColor === color ? `0 0 10px ${color}` : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            ))}
          </div>
        </div>

        {showCorners && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                width: '8px',
                height: '8px',
                borderTop: `1px solid ${themeColors.primary}`,
                borderLeft: `1px solid ${themeColors.primary}`,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderTop: `1px solid ${themeColors.primary}`,
                borderRight: `1px solid ${themeColors.primary}`,
                opacity: 0.5,
              }}
            />
          </>
        )}
        {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
        {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}
      </div>

      {isOpen && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ColdWarColorPicker;
