/**
 * FrameSVGBasic - Base Arwes-style frame component
 * Supports all Arwes frame variants: basic, corners, assembling, lines, squareSize
 */

import React from 'react';

export interface FrameSVGBasicProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  variant?: 'basic' | 'corners' | 'assembling' | 'lines' | 'squareSize';
  cornerSize?: number;
  lineLength?: number;
  dashArray?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  animate?: boolean;
}

/**
 * FrameSVGBasic - Universal Arwes frame component
 */
export const FrameSVGBasic: React.FC<FrameSVGBasicProps> = ({
  width = 300,
  height = 150,
  color = 'rgba(18, 168, 255, 0.85)',
  strokeWidth = 1,
  variant = 'basic',
  cornerSize = 16,
  lineLength = 20,
  dashArray = '8,4',
  children,
  className,
  style,
  animate = false,
}) => {
  const w = width;
  const h = height;
  const c = cornerSize;
  const l = lineLength;

  const renderBasicFrame = () => (
    <>
      <rect
        x="0"
        y="0"
        width={w}
        height={h}
        fill="rgba(4, 22, 34, 0.6)"
        stroke={color}
        strokeWidth={strokeWidth}
        filter="url(#glow-basic)"
      />
    </>
  );

  const renderCornersFrame = () => (
    <>
      {/* Top left */}
      <path d={`M 0 ${c} L 0 0 L ${c} 0`} fill="none" stroke={color} strokeWidth={strokeWidth} filter="url(#glow-basic)" />
      <line x1="0" y1={c / 2} x2={c / 2} y2="0" stroke={color} strokeWidth={strokeWidth * 0.5} opacity="0.5" />
      {/* Top right */}
      <path d={`M ${w - c} 0 L ${w} 0 L ${w} ${c}`} fill="none" stroke={color} strokeWidth={strokeWidth} filter="url(#glow-basic)" />
      <line x1={w - c / 2} y1="0" x2={w} y2={c / 2} stroke={color} strokeWidth={strokeWidth * 0.5} opacity="0.5" />
      {/* Bottom right */}
      <path d={`M ${w} ${h - c} L ${w} ${h} L ${w - c} ${h}`} fill="none" stroke={color} strokeWidth={strokeWidth} filter="url(#glow-basic)" />
      <line x1={w} y1={h - c / 2} x2={w - c / 2} y2={h} stroke={color} strokeWidth={strokeWidth * 0.5} opacity="0.5" />
      {/* Bottom left */}
      <path d={`M ${c} ${h} L 0 ${h} L 0 ${h - c}`} fill="none" stroke={color} strokeWidth={strokeWidth} filter="url(#glow-basic)" />
      <line x1={c / 2} y1={h} x2="0" y2={h - c / 2} stroke={color} strokeWidth={strokeWidth * 0.5} opacity="0.5" />
    </>
  );

  const renderAssemblingFrame = () => (
    <>
      {/* Outer frame */}
      <rect
        x="0"
        y="0"
        width={w}
        height={h}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        filter="url(#glow-basic)"
      />
      {/* Corner assemblies */}
      <g opacity="0.8">
        {/* Top left */}
        <line x1="0" y1={l} x2={l} y2={l} stroke={color} strokeWidth={strokeWidth} />
        <line x1={l} y1="0" x2={l} y2={l} stroke={color} strokeWidth={strokeWidth} />
        {/* Top right */}
        <line x1={w - l} y1="0" x2={w - l} y2={l} stroke={color} strokeWidth={strokeWidth} />
        <line x1={w - l} y1={l} x2={w} y2={l} stroke={color} strokeWidth={strokeWidth} />
        {/* Bottom right */}
        <line x1={w} y1={h - l} x2={w - l} y2={h - l} stroke={color} strokeWidth={strokeWidth} />
        <line x1={w - l} y1={h - l} x2={w - l} y2={h} stroke={color} strokeWidth={strokeWidth} />
        {/* Bottom left */}
        <line x1={l} y1={h} x2={l} y2={h - l} stroke={color} strokeWidth={strokeWidth} />
        <line x1="0" y1={h - l} x2={l} y2={h - l} stroke={color} strokeWidth={strokeWidth} />
      </g>
      {/* Corner dots */}
      <circle cx={l} cy={l} r="2" fill={color} />
      <circle cx={w - l} cy={l} r="2" fill={color} />
      <circle cx={w - l} cy={h - l} r="2" fill={color} />
      <circle cx={l} cy={h - l} r="2" fill={color} />
    </>
  );

  const renderLinesFrame = () => (
    <>
      <rect
        x="0"
        y="0"
        width={w}
        height={h}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        filter="url(#glow-basic)"
      />
      {/* Inner glow line */}
      <rect
        x="2"
        y="2"
        width={w - 4}
        height={h - 4}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 0.5}
        strokeDasharray={dashArray}
        opacity="0.4"
      />
    </>
  );

  const renderSquareSizeFrame = () => (
    <>
      {/* Bottom line */}
      <line
        x1="0"
        y1={h}
        x2={w}
        y2={h}
        stroke={color}
        strokeWidth={strokeWidth}
        filter="url(#glow-basic)"
      />
      {/* Corner squares */}
      <rect x="0" y="0" width={c} height={c} fill={color} opacity="0.8" />
      <rect x={w - c} y="0" width={c} height={c} fill={color} opacity="0.8" />
      <rect x={w - c} y={h - c} width={c} height={c} fill={color} opacity="0.8" />
      <rect x="0" y={h - c} width={c} height={c} fill={color} opacity="0.8" />
      {/* Inner squares */}
      <rect x={c / 4} y={c / 4} width={c / 2} height={c / 2} fill="rgba(4, 22, 34, 0.8)" />
      <rect x={w - c + c / 4} y={c / 4} width={c / 2} height={c / 2} fill="rgba(4, 22, 34, 0.8)" />
      <rect x={w - c + c / 4} y={h - c + c / 4} width={c / 2} height={c / 2} fill="rgba(4, 22, 34, 0.8)" />
      <rect x={c / 4} y={h - c + c / 4} width={c / 2} height={c / 2} fill="rgba(4, 22, 34, 0.8)" />
    </>
  );

  const renderFrame = () => {
    switch (variant) {
      case 'corners':
        return renderCornersFrame();
      case 'assembling':
        return renderAssemblingFrame();
      case 'lines':
        return renderLinesFrame();
      case 'squareSize':
        return renderSquareSizeFrame();
      default:
        return renderBasicFrame();
    }
  };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        height,
        ...style,
      }}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <filter id="glow-basic" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {animate && (
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          )}
        </defs>
        {renderFrame()}
      </svg>
      {children && (
        <div style={{ position: 'relative', padding: '1rem', zIndex: 1 }}>
          {children}
        </div>
      )}
    </div>
  );
};

FrameSVGBasic.displayName = 'FrameSVGBasic';