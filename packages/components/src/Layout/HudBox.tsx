/**
 * HudBox Component
 * Asymmetrical HUD-style container with animated borders
 */

import React from 'react';
import styled from 'styled-components';

export interface HudBoxProps {
  children?: React.ReactNode;
  className?: string;
  width?: string;
  height?: string;
  color?: string;
  animated?: boolean;
  variant?: 'default' | 'compact' | 'wide' | 'hexagon' | 'diagonal' | 'corner-cut' | 'tech-panel' | 
            'octagon' | 'arrow-right' | 'chevron' | 
            'portrait-tall' | 'portrait-slim' | 'portrait-card' | 'portrait-banner' |
            'landscape-wide' | 'landscape-ultra' | 'landscape-bar' | 'landscape-ribbon';
}

const getClipPath = (variant: string) => {
  switch (variant) {
    case 'hexagon':
      return 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';
    case 'diagonal':
      return 'polygon(0 0, 90% 0, 100% 10%, 100% 100%, 10% 100%, 0 90%)';
    case 'corner-cut':
      return 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)';
    case 'tech-panel':
      return 'polygon(0 0, 100% 0, 100% 80%, 95% 85%, 90% 100%, 0 100%)';
    case 'octagon':
      return 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)';
    case 'arrow-right':
      return 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)';
    case 'chevron':
      return 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%, 10% 50%)';
    case 'portrait-tall':
      return 'polygon(0 0, 100% 0, 100% 5%, 95% 8%, 100% 12%, 100% 88%, 95% 92%, 100% 95%, 100% 100%, 0 100%)';
    case 'portrait-slim':
      return 'polygon(0 0, 85% 0, 100% 3%, 100% 97%, 85% 100%, 0 100%, 0 97%, 15% 94%, 0 90%)';
    case 'portrait-card':
      return 'polygon(0 0, 100% 0, 100% 90%, 95% 93%, 90% 100%, 10% 100%, 5% 97%, 0 93%)';
    case 'portrait-banner':
      return 'polygon(10% 0, 90% 0, 100% 5%, 100% 95%, 90% 100%, 10% 100%, 0 95%, 0 5%)';
    case 'landscape-wide':
      return 'polygon(0 0, 5% 0, 8% 15%, 12% 0, 88% 0, 92% 15%, 95% 0, 100% 0, 100% 100%, 0 100%)';
    case 'landscape-ultra':
      return 'polygon(0 0, 97% 0, 100% 15%, 97% 30%, 100% 45%, 100% 100%, 3% 100%, 0 85%, 3% 70%, 0 55%)';
    case 'landscape-bar':
      return 'polygon(0 0, 100% 0, 100% 70%, 98% 80%, 100% 90%, 100% 100%, 0 100%)';
    case 'landscape-ribbon':
      return 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)';
    default:
      return 'polygon(0 0, 85% 0, 100% 14%, 100% 60%, 92% 65%, 93% 77%, 99% 80%, 99% 90%, 89% 100%, 0 100%)';
  }
};

const StyledWrapper = styled.div<{ $width?: string; $height?: string; $variant: string; $color: string; $animated: boolean }>`
  --hud-color: ${props => props.$color};
  --hud-color-rgba: ${props => {
    const hex = props.$color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }};
  
  .hud-box-container {
    --shadow-r: ${props => {
      const hex = props.$color.replace('#', '');
      return parseInt(hex.substring(0, 2), 16);
    }};
    --shadow-g: ${props => {
      const hex = props.$color.replace('#', '');
      return parseInt(hex.substring(2, 4), 16);
    }};
    --shadow-b: ${props => {
      const hex = props.$color.replace('#', '');
      return parseInt(hex.substring(4, 6), 16);
    }};
    filter: ${props => {
      const hex = props.$color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `drop-shadow(0 8px 16px rgba(${r}, ${g}, ${b}, 0.4)) drop-shadow(0 4px 8px rgba(${r}, ${g}, ${b}, 0.25))`;
    }};
    animation: ${props => props.$animated ? 'hudBoxBlinkShadows 8s ease-in infinite' : 'none'};
    display: inline-block;
    overflow: hidden;
  }

  .hud-box-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2em;
    background-color: rgba(0, 20, 40, 0.95);
    width: ${props => {
      if (props.$width) return props.$width;
      switch (props.$variant) {
        case 'compact': return '200px';
        case 'wide': return '400px';
        case 'hexagon': return '280px';
        case 'diagonal': return '320px';
        case 'corner-cut': return '300px';
        case 'tech-panel': return '350px';
        case 'octagon': return '300px';
        case 'arrow-right': return '340px';
        case 'chevron': return '320px';
        case 'portrait-tall': return '250px';
        case 'portrait-slim': return '200px';
        case 'portrait-card': return '280px';
        case 'portrait-banner': return '220px';
        case 'landscape-wide': return '450px';
        case 'landscape-ultra': return '500px';
        case 'landscape-bar': return '550px';
        case 'landscape-ribbon': return '480px';
        default: return '300px';
      }
    }};
    height: ${props => {
      if (props.$height) return props.$height;
      switch (props.$variant) {
        case 'compact': return '150px';
        case 'wide': return '200px';
        case 'hexagon': return '240px';
        case 'diagonal': return '220px';
        case 'corner-cut': return '200px';
        case 'tech-panel': return '180px';
        case 'octagon': return '260px';
        case 'arrow-right': return '200px';
        case 'chevron': return '210px';
        case 'portrait-tall': return '400px';
        case 'portrait-slim': return '350px';
        case 'portrait-card': return '380px';
        case 'portrait-banner': return '320px';
        case 'landscape-wide': return '180px';
        case 'landscape-ultra': return '150px';
        case 'landscape-bar': return '120px';
        case 'landscape-ribbon': return '140px';
        default: return '250px';
      }
    }};
    -webkit-clip-path: ${props => getClipPath(props.$variant)};
    clip-path: ${props => getClipPath(props.$variant)};
    overflow: hidden;
  }

  .hud-box-content::before {
    content: "";
    position: absolute;
    inset: -3px;
    background: ${props => props.$animated 
      ? `conic-gradient(from var(--gradient-angle), ${props.$color}, ${props.$color}99, transparent 30%, transparent 60%, ${props.$color}99, ${props.$color})`
      : `linear-gradient(135deg, ${props.$color}, ${props.$color}CC, ${props.$color}99, ${props.$color}CC, ${props.$color})`
    };
    -webkit-clip-path: ${props => getClipPath(props.$variant)};
    clip-path: ${props => getClipPath(props.$variant)};
    z-index: -1;
    animation: ${props => props.$animated ? 'hudBoxBorderRotate 4s linear infinite' : 'none'};
  }
  
  @property --gradient-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }

  .hud-box-content::after {
    content: "";
    position: absolute;
    top: 1%;
    left: 1%;
    width: 98%;
    height: 98%;
    background: repeating-linear-gradient(to bottom, transparent 0%, ${props => props.$color}4D 1px, rgb(0, 10, 20) 3px, ${props => props.$color}33 5px, #001a2e 4px, transparent 0.5%),
      repeating-linear-gradient(to left, rgba(0, 20, 40, 0.95) 100%, rgba(0, 20, 40, 0.99) 100%);
    box-shadow: inset 0px 0px 30px 40px rgba(0, 20, 40, 0.95);
    -webkit-clip-path: ${props => getClipPath(props.$variant)};
    clip-path: ${props => getClipPath(props.$variant)};
    animation: hudBoxBackglitch 94ms linear infinite;
    z-index: -1;
  }

  .hud-box-inner {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.$color};
  }

  @keyframes hudBoxBackglitch {
    0% {
      box-shadow: inset 0px 20px 30px 40px rgba(0, 20, 40, 0.95);
    }
    50% {
      box-shadow: inset 0px -20px 30px 40px rgba(0, 30, 50, 0.95);
    }
    to {
      box-shadow: inset 0px 20px 30px 40px rgba(0, 20, 40, 0.95);
    }
  }

  @keyframes hudBoxBorderRotate {
    0% {
      --gradient-angle: 0deg;
    }
    100% {
      --gradient-angle: 360deg;
    }
  }

  @keyframes hudBoxBlinkShadows {
    0% {
      filter: drop-shadow(0 8px 16px rgba(var(--shadow-r), var(--shadow-g), var(--shadow-b), 0.45)) drop-shadow(0 4px 8px rgba(var(--shadow-r), var(--shadow-g), var(--shadow-b), 0.3));
    }
    25% {
      filter: drop-shadow(12px -6px 14px rgba(var(--shadow-r), var(--shadow-g), var(--shadow-b), 0.5)) drop-shadow(-8px 4px 10px rgba(var(--shadow-r), var(--shadow-g), var(--shadow-b), 0.25));
    }
    50% {
      filter: drop-shadow(0 10px 18px rgba(var(--shadow-r), var(--shadow-g), var(--shadow-b), 0.42)) drop-shadow(0 5px 10px rgba(var(--shadow-r), var(--shadow-g), var(--shadow-b), 0.28));
    }
    75% {
      filter: drop-shadow(-10px 6px 14px rgba(var(--shadow-r), var(--shadow-g), var(--shadow-b), 0.48)) drop-shadow(8px -4px 10px rgba(var(--shadow-r), var(--shadow-g), var(--shadow-b), 0.26));
    }
    to {
      filter: drop-shadow(0 8px 16px rgba(var(--shadow-r), var(--shadow-g), var(--shadow-b), 0.45)) drop-shadow(0 4px 8px rgba(var(--shadow-r), var(--shadow-g), var(--shadow-b), 0.3));
    }
  }
`;

export function HudBox({
  children,
  className = '',
  width,
  height,
  color = '#00f6ff',
  animated = true,
  variant = 'default',
}: HudBoxProps) {
  // Convert hex to RGB for CSS variables
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return (
    <StyledWrapper 
      key={`${variant}-${color}-${animated}`}
      className={className} 
      $width={width} 
      $height={height} 
      $variant={variant} 
      $color={color} 
      $animated={animated}
      style={{
        ['--hud-color' as any]: color,
        ['--shadow-r' as any]: r,
        ['--shadow-g' as any]: g,
        ['--shadow-b' as any]: b,
      }}
    >
      <div className="hud-box-container">
        <div className="hud-box-content">
          <div className="hud-box-inner">
            {children}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}
