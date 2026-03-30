/**
 * Cold War PipBoy Component
 * Tactical wrist-mounted computer interface
 */

import React, { CSSProperties, useState } from 'react';
import {
  getRgbString,
  generateTechCode,
  getMilitaryTimestamp,
  ThemeVariant,
} from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarPipBoyProps {
  hp?: { current: number; max: number };
  ap?: { current: number; max: number };
  time?: string;
  date?: string;
  rads?: number;
  inventory?: Array<{ name: string; weight: number; quantity?: number }>;
  radarStatus?: string;
  targets?: number;
  theme?: ThemeVariant;
  color?: 'amber' | 'green' | 'blue' | 'red';
  glow?: boolean;
  scanlines?: boolean;
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: { primary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  satelliteView: { primary: '#00CCFF', background: '#3a3a3e', surface: '#2a2a2e' },
};

const COLOR_MAP = { amber: '#FFB000', green: '#33FF00', blue: '#00CCFF', red: '#FF3333' };

type TabType = 'stat' | 'inv' | 'data';

export const ColdWarPipBoy: React.FC<ColdWarPipBoyProps> = ({
  hp = { current: 348, max: 450 },
  ap = { current: 67, max: 67 },
  time = '08:40',
  date = '02.23.2026',
  rads = 0,
  inventory = [
    { name: 'STIMPAK', weight: 0.5, quantity: 12 },
    { name: '10MM PISTOL', weight: 4.0 },
    { name: 'RADAWAY', weight: 0.5, quantity: 5 },
  ],
  radarStatus = 'SEARCHING...',
  targets = 1,
  theme = 'perseus',
  color = 'green',
  glow = true,
  scanlines = false,
  className = '',
  style = {},
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('stat');
  const themeColors = THEME_COLORS[theme];
  const pipColor = COLOR_MAP[color];
  const rgb = getRgbString(pipColor);
  const techCode = generateTechCode('PIP');

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
    minHeight: '450px',
    padding: '24px',
    backgroundColor: themeColors.background,
    border: `2px solid ${pipColor}`,
    clipPath:
      'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)',
    overflow: 'hidden',
    ...style,
  };

  const topBarStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
    fontSize: '12px',
    fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 700,
    color: pipColor,
  };

  const titleStyle: CSSProperties = {
    letterSpacing: '0.1em',
    minWidth: '120px',
  };

  const lineStyle: CSSProperties = {
    height: '2px',
    backgroundColor: pipColor,
    boxShadow: glow ? `0 0 8px rgba(${rgb}, 0.6)` : 'none',
    flex: 1,
    margin: '0 10px',
  };

  const statsStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
  };

  const contentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    minHeight: '300px',
    marginBottom: '24px',
  };

  const bottomBarStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 700,
  };

  const navButtonStyle = (isActive: boolean): CSSProperties => ({
    padding: '8px 16px',
    backgroundColor: isActive ? pipColor : 'transparent',
    color: isActive ? themeColors.background : pipColor,
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    transition: 'all 150ms ease',
    boxShadow: isActive && glow ? `0 0 15px rgba(${rgb}, 0.8)` : 'none',
  });

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '8px',
    color: pipColor,
    opacity: 0.5,
    zIndex: 15,
  };

  const renderContent = () => {
    if (activeTab === 'stat') {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: pipColor }}>
            <div>CND</div>
            <div>RAD</div>
            <div style={{ border: `2px solid ${pipColor}`, padding: '4px 8px', marginTop: '8px' }}>
              CLK
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                backgroundColor: pipColor,
                padding: '16px 32px',
                marginBottom: '8px',
                clipPath:
                  'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                boxShadow: glow ? `0 0 25px rgba(${rgb}, 0.8)` : 'none',
              }}
            >
              <div style={{ fontSize: '48px', fontWeight: 700, color: themeColors.background }}>
                {time}
              </div>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: pipColor }}>{date}</div>
          </div>
          <div style={{ fontSize: '12px', color: pipColor, textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>☢</div>
            <div>RADS</div>
            <div style={{ fontWeight: 700 }}>{rads}</div>
          </div>
        </div>
      );
    }

    if (activeTab === 'inv') {
      return (
        <div>
          {inventory.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px',
                borderBottom: `1px dashed rgba(${rgb}, 0.3)`,
                fontSize: '12px',
                fontFamily: "'Share Tech Mono', monospace",
                color: pipColor,
                cursor: 'pointer',
              }}
            >
              <span>
                {item.name}
                {item.quantity ? ` (${item.quantity})` : ''}
              </span>
              <span>WGT {item.weight.toFixed(1)}</span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <div
          style={{
            position: 'relative',
            width: '160px',
            height: '160px',
            backgroundColor: themeColors.surface,
            border: `2px solid ${pipColor}`,
            borderRadius: '50%',
            overflow: 'hidden',
          }}
        >
          <div style={circleStyle(80, rgb)} />
          <div style={circleStyle(40, rgb)} />
          <div style={circleStyle(120, rgb)} />
          <div style={scannerStyle(pipColor)} />
          {targets >= 1 && <div style={dotStyle('30%', '50%', pipColor)} />}
          {targets >= 2 && <div style={dotStyle('70%', '70%', pipColor)} />}
        </div>
        <div
          style={{ fontSize: '12px', fontFamily: "'Share Tech Mono', monospace", color: pipColor }}
        >
          {radarStatus}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @keyframes pipboyScan {
            0% { transform: translate(-50%, -100%) rotate(0deg); }
            100% { transform: translate(-50%, -100%) rotate(360deg); }
          }
        `}
      </style>
      <div className={className} style={containerStyle}>
        {scanlines && <ScanlinesOverlay intensity="medium" />}
        <span style={techCodeStyle}>{techCode}</span>

        <div style={topBarStyle}>
          <div style={titleStyle}>
            {activeTab === 'stat' && 'SYS_STATUS'}
            {activeTab === 'inv' && 'INVENTORY'}
            {activeTab === 'data' && 'DATA_LINK'}
          </div>
          <div style={lineStyle} />
          <div style={statsStyle}>
            <span>
              HP{' '}
              <strong>
                {hp.current}/{hp.max}
              </strong>
            </span>
            <span>
              AP{' '}
              <strong>
                {ap.current}/{ap.max}
              </strong>
            </span>
          </div>
        </div>

        <div style={contentStyle}>{renderContent()}</div>

        <div style={bottomBarStyle}>
          <button style={navButtonStyle(activeTab === 'stat')} onClick={() => setActiveTab('stat')}>
            STAT
          </button>
          <div style={lineStyle} />
          <button style={navButtonStyle(activeTab === 'inv')} onClick={() => setActiveTab('inv')}>
            INV
          </button>
          <div style={lineStyle} />
          <button style={navButtonStyle(activeTab === 'data')} onClick={() => setActiveTab('data')}>
            DATA
          </button>
        </div>
      </div>
    </>
  );
};

const circleStyle = (diameter: number, rgb: string): CSSProperties => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: `${diameter}px`,
  height: `${diameter}px`,
  border: `1px solid rgba(${rgb}, 0.3)`,
  borderRadius: '50%',
  transform: 'translate(-50%, -50%)',
});

const scannerStyle = (color: string): CSSProperties => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '2px',
  height: '80px',
  backgroundColor: color,
  transformOrigin: 'bottom center',
  animation: 'pipboyScan 3s linear infinite',
  boxShadow: `0 0 10px ${color}`,
});

const dotStyle = (top: string, left: string, color: string): CSSProperties => ({
  position: 'absolute',
  top,
  left,
  width: '6px',
  height: '6px',
  backgroundColor: color,
  borderRadius: '50%',
  boxShadow: `0 0 10px ${color}`,
});

export default ColdWarPipBoy;
