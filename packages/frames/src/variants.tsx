/**
 * Arwes-style Frame Components
 * Uses clip-path and CSS styling like original Arwes
 */

import React from 'react';
import {
  createFrameOctagonClip,
  createFrameCornersClip,
  createFrameAssemblingClip,
  createFrameLinesClip,
  createFrameUnderlineClip,
  createFrameNefrexClip,
  createFrameKranoxClip,
  FrameClipOptions
} from './clipPaths';

export interface ArwesFrameProps extends FrameClipOptions {
  width?: string | number;
  height?: string | number;
  background?: string;
  border?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Base Arwes Frame Component
 */
const ArwesFrameBase: React.FC<ArwesFrameProps & { clipPath: string; borderStyle?: React.CSSProperties }> = ({
  width = '200px',
  height = '100px',
  background = '#077',
  border,
  clipPath,
  borderStyle,
  children,
  className,
  style,
}) => {
  const frameStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    clipPath,
    background,
    border,
    position: 'relative',
    ...borderStyle,
    ...style,
  };

  return (
    <div className={className} style={frameStyle}>
      {children}
    </div>
  );
};

/**
 * FrameSVGOctagon - Arwes basic style with octagon clip
 */
export const FrameSVGOctagon: React.FC<ArwesFrameProps> = (props) => {
  const clipPath = createFrameOctagonClip(props);
  
  return (
    <ArwesFrameBase
      {...props}
      clipPath={clipPath}
      background={props.background || '#077'}
    />
  );
};

/**
 * FrameSVGCorners - Arwes corners style
 */
export const FrameSVGCorners: React.FC<ArwesFrameProps> = (props) => {
  const clipPath = createFrameCornersClip(props);
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Corner elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: props.cornerLength || '1rem',
          height: '2px',
          background: '#0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '2px',
          height: props.cornerLength || '1rem',
          background: '#0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      {/* Top right */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: props.cornerLength || '1rem',
          height: '2px',
          background: '#0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '2px',
          height: props.cornerLength || '1rem',
          background: '#0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      {/* Bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: props.cornerLength || '1rem',
          height: '2px',
          background: '#0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '2px',
          height: props.cornerLength || '1rem',
          background: '#0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      {/* Bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: props.cornerLength || '1rem',
          height: '2px',
          background: '#0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '2px',
          height: props.cornerLength || '1rem',
          background: '#0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      
      <ArwesFrameBase
        {...props}
        clipPath="none"
        background="transparent"
        style={{ ...props.style, zIndex: 1 }}
      />
    </div>
  );
};

/**
 * FrameSVGKranox - Arwes assembling style (Kranox)
 */
export const FrameSVGKranox: React.FC<ArwesFrameProps> = (props) => {
  const clipPath = createFrameKranoxClip(props);
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Assembly corner elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: props.cornerLength || '1.5rem',
          height: '1px',
          background: '#0ff',
          boxShadow: '0 0 2px #0ff',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1px',
          height: props.cornerLength || '1.5rem',
          background: '#0ff',
          boxShadow: '0 0 2px #0ff',
        }}
      />
      {/* Assembly dots */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          background: '#0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      
      {/* Repeat for other corners */}
      <ArwesFrameBase
        {...props}
        clipPath={clipPath}
        background={props.background || 'transparent'}
        border="1px solid #0ff"
        borderStyle={{
          boxShadow: '0 0 4px #0ff, inset 0 0 4px rgba(0, 255, 255, 0.1)',
        }}
      />
    </div>
  );
};

/**
 * FrameSVGLines - Arwes lines style
 */
export const FrameSVGLines: React.FC<ArwesFrameProps> = (props) => {
  const clipPath = createFrameLinesClip(props);
  
  return (
    <ArwesFrameBase
      {...props}
      clipPath={clipPath}
      background={props.background || 'transparent'}
      border="2px dashed #0ff"
      borderStyle={{
        boxShadow: '0 0 4px #0ff',
      }}
    />
  );
};

/**
 * FrameSVGUnderline - Arwes basic + squareSize style
 */
export const FrameSVGUnderline: React.FC<ArwesFrameProps> = (props) => {
  const clipPath = createFrameUnderlineClip(props);
  const squareSize = props.squareSize || '0.5rem';
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Corner squares */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: squareSize,
          height: squareSize,
          background: '#0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: squareSize,
          height: squareSize,
          background: '#0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: squareSize,
          height: squareSize,
          background: '#0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: squareSize,
          height: squareSize,
          background: '#0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      
      {/* Bottom underline */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '2px',
          background: '#0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      
      <ArwesFrameBase
        {...props}
        clipPath={clipPath}
        background={props.background || 'transparent'}
        style={{ ...props.style, zIndex: 1 }}
      />
    </div>
  );
};

/**
 * FrameSVGNefrex - Arwes basic + assembling style (Nefrex)
 */
export const FrameSVGNefrex: React.FC<ArwesFrameProps> = (props) => {
  const clipPath = createFrameNefrexClip(props);
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Full border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: '1px solid #0ff',
          boxShadow: '0 0 4px #0ff',
        }}
      />
      
      {/* Assembly elements in corners */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '12px',
          height: '1px',
          background: '#0ff',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '1px',
          height: '12px',
          background: '#0ff',
        }}
      />
      
      <ArwesFrameBase
        {...props}
        clipPath={clipPath}
        background={props.background || 'transparent'}
        style={{ ...props.style, zIndex: 1 }}
      />
    </div>
  );
};
