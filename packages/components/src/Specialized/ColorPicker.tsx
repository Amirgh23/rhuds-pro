import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@rhuds/core';

export interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  disabled?: boolean;
  presets?: string[];
  showAlpha?: boolean;
  className?: string;
}

export function ColorPicker({
  value = '#000000',
  onChange,
  disabled = false,
  presets = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#000000', '#FFFFFF', '#808080', '#FFA500', '#800080', '#008000',
  ],
  showAlpha = false,
  className = '',
}: ColorPickerProps) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange?.(newColor);
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const rgb = hexToRgb(color);

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          border: `1px solid ${theme.currentMode.tokens.colors.border}`,
          borderRadius: '4px',
          backgroundColor: theme.currentMode.tokens.colors.background,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            backgroundColor: color,
            border: `1px solid ${theme.currentMode.tokens.colors.border}`,
          }}
        />
        <span style={{ color: theme.currentMode.tokens.colors.text }}>{color}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            backgroundColor: theme.currentMode.tokens.colors.surface,
            border: `1px solid ${theme.currentMode.tokens.colors.border}`,
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            minWidth: '280px',
          }}
        >
          {/* Color preview */}
          <div
            style={{
              width: '100%',
              height: '60px',
              borderRadius: '4px',
              backgroundColor: color,
              border: `1px solid ${theme.currentMode.tokens.colors.border}`,
              marginBottom: '16px',
            }}
          />

          {/* RGB sliders */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.currentMode.tokens.colors.text }}>
              Red: {rgb.r}
            </label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) => handleColorChange(rgbToHex(parseInt(e.target.value), rgb.g, rgb.b))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.currentMode.tokens.colors.text }}>
              Green: {rgb.g}
            </label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) => handleColorChange(rgbToHex(rgb.r, parseInt(e.target.value), rgb.b))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.currentMode.tokens.colors.text }}>
              Blue: {rgb.b}
            </label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) => handleColorChange(rgbToHex(rgb.r, rgb.g, parseInt(e.target.value)))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Hex input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.currentMode.tokens.colors.text }}>
              Hex
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(value)) {
                  handleColorChange(value);
                }
              }}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${theme.currentMode.tokens.colors.border}`,
                borderRadius: '4px',
                backgroundColor: theme.currentMode.tokens.colors.background,
                color: theme.currentMode.tokens.colors.text,
              }}
            />
          </div>

          {/* Presets */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.currentMode.tokens.colors.text }}>
              Presets
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleColorChange(preset)}
                  style={{
                    width: '100%',
                    height: '32px',
                    borderRadius: '4px',
                    backgroundColor: preset,
                    border: color === preset ? `2px solid ${theme.currentMode.tokens.colors.primary}` : `1px solid ${theme.currentMode.tokens.colors.border}`,
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

