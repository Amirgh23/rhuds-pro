/**
 * GeometricWrapper Component
 * Wraps content with HUD-style geometric frame shapes
 * Maintains original size while adding sci-fi geometric borders
 */

import React, { CSSProperties } from 'react';

export interface GeometricWrapperProps {
  children: React.ReactNode;
  variant?: 'default' | 'cut-corners' | 'angled' | 'notched' | 'complex';
  color?: string;
  glowIntensity?: 'none' | 'low' | 'medium' | 'high';
  style?: CSSProperties;
  className?: string;
}

export const GeometricWrapper: React.FC<GeometricWrapperProps> = ({
  children,
  variant = 'default',
  color = '#29F2DF',
  glowIntensity = 'low',
  style,
  className,
}) => {
  const getClipPath = () => {
    switch (variant) {
      case 'cut-corners':
        return 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)';
      case 'angled':
        return 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))';
      case 'notched':
        return 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)';
      case 'complex':
        return 'polygon(0 8px, 8px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 20px 100%, 0 calc(100% - 20px))';
      default:
        return 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)';
    }
  };

  const getBoxShadow = () => {
    const shadows = {
      none: 'none',
      low: `0 0 10px ${color}20, inset 0 0 20px ${color}10`,
      medium: `0 0 20px ${color}40, inset 0 0 30px ${color}15`,
      high: `0 0 30px ${color}60, inset 0 0 40px ${color}20`,
    };
    return shadows[glowIntensity];
  };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        clipPath: getClipPath(),
        background: style?.background || 'rgba(0, 0, 0, 0.3)',
        border: `1px solid ${color}40`,
        boxShadow: getBoxShadow(),
        ...style,
      }}
    >
      {/* Corner accents */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '20px',
          height: '2px',
          background: `linear-gradient(90deg, ${color}, transparent)`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '2px',
          height: '20px',
          background: `linear-gradient(180deg, ${color}, transparent)`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '20px',
          height: '2px',
          background: `linear-gradient(270deg, ${color}, transparent)`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '20px',
          height: '2px',
          background: `linear-gradient(270deg, ${color}, transparent)`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '2px',
          height: '20px',
          background: `linear-gradient(0deg, ${color}, transparent)`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '20px',
          height: '2px',
          background: `linear-gradient(90deg, ${color}, transparent)`,
          opacity: 0.6,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
};

GeometricWrapper.displayName = 'GeometricWrapper';
