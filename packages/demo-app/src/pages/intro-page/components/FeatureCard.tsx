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
          clipPath: `polygon(
            0 2%,
            3% 0,
            8% 1%,
            12% 0,
            18% 2%,
            25% 0,
            32% 1%,
            40% 0,
            48% 3%,
            55% 0,
            62% 1%,
            70% 0,
            78% 2%,
            85% 0,
            92% 1%,
            97% 0,
            100% 3%,
            100% 10%,
            98% 18%,
            100% 25%,
            97% 32%,
            100% 40%,
            98% 48%,
            100% 55%,
            97% 62%,
            100% 70%,
            98% 78%,
            100% 85%,
            97% 92%,
            100% 100%,
            97% 100%,
            92% 98%,
            85% 100%,
            78% 97%,
            70% 100%,
            62% 98%,
            55% 100%,
            48% 97%,
            40% 100%,
            32% 98%,
            25% 100%,
            18% 97%,
            12% 100%,
            8% 98%,
            3% 100%,
            0 97%,
            0 90%,
            2% 82%,
            0 75%,
            3% 68%,
            0 60%,
            2% 52%,
            0 45%,
            3% 38%,
            0 30%,
            2% 22%,
            0 15%,
            3% 8%
          )`,
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
