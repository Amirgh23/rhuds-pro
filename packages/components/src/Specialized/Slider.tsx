import React, { useState, useRef } from 'react';
import { useTheme } from '@rhuds/core';

// Helper to safely access theme tokens
const getTokens = (theme: any) => {
  return (theme as any)?.currentMode?.tokens || theme;
};

export interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  marks?: { value: number; label: string }[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Slider({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = true,
  marks = [],
  orientation = 'horizontal',
  className = '',
}: SliderProps) {
  const theme = useTheme();
  const [currentValue, setCurrentValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleChange = (newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue));
    const steppedValue = Math.round(clampedValue / step) * step;
    setCurrentValue(steppedValue);
    onChange?.(steppedValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled) return;
    updateValue(e as any);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e: React.MouseEvent | MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    let percentage: number;

    if (orientation === 'horizontal') {
      percentage = (e.clientX - rect.left) / rect.width;
    } else {
      percentage = 1 - (e.clientY - rect.top) / rect.height;
    }

    const newValue = min + percentage * (max - min);
    handleChange(newValue);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const percentage = ((currentValue - min) / (max - min)) * 100;
  const isHorizontal = orientation === 'horizontal';
  const tokens = getTokens(theme);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'column' : 'row',
        gap: '8px',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'relative',
          width: isHorizontal ? '100%' : '8px',
          height: isHorizontal ? '8px' : '200px',
          backgroundColor: tokens.colors?.surface || '#2a2a2a',
          borderRadius: '4px',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {/* Track fill */}
        <div
          style={{
            position: 'absolute',
            [isHorizontal ? 'left' : 'bottom']: 0,
            [isHorizontal ? 'width' : 'height']: `${percentage}%`,
            [isHorizontal ? 'height' : 'width']: '100%',
            backgroundColor: tokens.colors?.primary || '#29F2DF',
            borderRadius: '4px',
            transition: isDragging ? 'none' : 'all 0.2s',
          }}
        />

        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            [isHorizontal ? 'left' : 'bottom']: `${percentage}%`,
            [isHorizontal ? 'top' : 'left']: '50%',
            transform: isHorizontal ? 'translate(-50%, -50%)' : 'translate(-50%, 50%)',
            width: '20px',
            height: '20px',
            backgroundColor: tokens.colors?.primary || '#29F2DF',
            borderRadius: '50%',
            border: `2px solid ${tokens.colors?.background || '#0A1225'}`,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: isDragging ? 'none' : 'all 0.2s',
          }}
        />

        {/* Marks */}
        {marks.map((mark) => {
          const markPercentage = ((mark.value - min) / (max - min)) * 100;
          return (
            <div
              key={mark.value}
              style={{
                position: 'absolute',
                [isHorizontal ? 'left' : 'bottom']: `${markPercentage}%`,
                [isHorizontal ? 'top' : 'left']: '100%',
                transform: isHorizontal ? 'translateX(-50%)' : 'translateY(50%)',
                [isHorizontal ? 'marginTop' : 'marginLeft']: '8px',
              }}
            >
              <div
                style={{
                  width: '2px',
                  height: '8px',
                  backgroundColor: tokens.colors?.border || '#444',
                  marginBottom: '4px',
                }}
              />
              <span style={{ fontSize: '12px', color: tokens.colors?.text || '#ffffff', whiteSpace: 'nowrap' }}>
                {mark.label}
              </span>
            </div>
          );
        })}
      </div>

      {showValue && (
        <div
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: tokens.colors?.text || '#ffffff',
            minWidth: '40px',
            textAlign: 'center',
          }}
        >
          {currentValue}
        </div>
      )}
    </div>
  );
}
