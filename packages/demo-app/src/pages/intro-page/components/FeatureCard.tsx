import React, { useEffect, useRef } from 'react';
import { useFrameSVGAssemblingAnimation } from '@rhuds/frames';
import '../styles/FeatureCard.css';

export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  color: 'cyan' | 'magenta' | 'blue';
  animationDelay?: number;
  onClick?: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color,
  animationDelay = 0,
  onClick,
}) => {
  const frameRef = useRef<SVGSVGElement>(null);
  const { play } = useFrameSVGAssemblingAnimation(frameRef, {
    duration: 800,
    delay: animationDelay,
  });

  useEffect(() => {
    play();
  }, [play]);

  const colorMap = {
    cyan: '#29F2DF',
    magenta: '#EF3EF1',
    blue: '#1C7FA6',
  };

  const color_value = colorMap[color];

  return (
    <div
      className="feature-card"
      style={
        {
          '--card-color': color_value,
        } as React.CSSProperties
      }
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          onClick();
        }
      }}
    >
      <div className="feature-card__frame-container">
        <svg
          ref={frameRef}
          className="feature-card__frame"
          viewBox="0 0 300 400"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {/* Frame corners - octagon style */}
          <g className="frame-lines" stroke={color_value} strokeWidth="2" fill="none">
            {/* Top left corner */}
            <line x1="20" y1="0" x2="40" y2="0" />
            <line x1="0" y1="20" x2="0" y2="40" />
            <line x1="0" y1="0" x2="20" y2="20" />

            {/* Top right corner */}
            <line x1="260" y1="0" x2="280" y2="0" />
            <line x1="300" y1="20" x2="300" y2="40" />
            <line x1="300" y1="0" x2="280" y2="20" />

            {/* Bottom left corner */}
            <line x1="0" y1="360" x2="0" y2="380" />
            <line x1="20" y1="400" x2="40" y2="400" />
            <line x1="0" y1="400" x2="20" y2="380" />

            {/* Bottom right corner */}
            <line x1="300" y1="360" x2="300" y2="380" />
            <line x1="260" y1="400" x2="280" y2="400" />
            <line x1="300" y1="400" x2="280" y2="380" />

            {/* Side lines */}
            <line x1="0" y1="60" x2="0" y2="340" opacity="0.5" />
            <line x1="300" y1="60" x2="300" y2="340" opacity="0.5" />
            <line x1="40" y1="0" x2="260" y2="0" opacity="0.5" />
            <line x1="40" y1="400" x2="260" y2="400" opacity="0.5" />
          </g>

          {/* Glow effect */}
          <defs>
            <filter id={`glow-${color}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      <div className="feature-card__content">
        <div className="feature-card__icon" style={{ color: color_value }}>
          {icon}
        </div>
        <h3 className="feature-card__title" style={{ color: color_value }}>
          {title}
        </h3>
        <p className="feature-card__description">{description}</p>
      </div>

      {/* Hover glow effect */}
      <div
        className="feature-card__glow"
        style={{
          boxShadow: `0 0 30px ${color_value}40, 0 0 60px ${color_value}20`,
        }}
      />
    </div>
  );
};

FeatureCard.displayName = 'FeatureCard';
