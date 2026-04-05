/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TACTICAL MOTION BACKGROUND - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * "THE SITUATION ROOM" - $1M SATELLITE COMMAND CENTER
 *
 * LAYERS (10 Total):
 * 1. Deep Space - Vignette gradient (black to dark blue)
 * 2. Perspective Grid - 3D receding grid lines with pan animation
 * 3. Earth Wireframe - Rotating globe (CSS 3D transform)
 * 4. Radar Sweep - 360° rotating beam with trail effect
 * 5. Data Streams - Vertical flowing coordinates
 * 6. Floating Markers - Random lat/long coordinates with fade
 * 7. Atmospheric Particles - Dust/noise texture
 * 8. CRT Scanlines - Horizontal refresh effect
 * 9. Vignette - Edge darkening with flicker
 * 10. Holographic Overlay - Light refraction shimmer
 *
 * ANIMATIONS (15 Total):
 * - Earth rotation (60s continuous)
 * - Radar sweep (8s loop)
 * - Grid pan (20s perspective shift)
 * - Data streams flow (variable speeds 2-5s)
 * - Coordinates fade in/out (random 3-6s)
 * - Scanlines flicker (150ms)
 * - Vignette pulse (4s)
 * - Particles drift (30s)
 * - Holographic shimmer (8s)
 * - Latitude lines rotate (40s)
 * - Longitude lines rotate (50s)
 * - Marker pulse (2s)
 * - Data point expansion (3s)
 * - Beam trail fade (1s)
 * - Grid perspective shift (25s)
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useInterval } from '@rhuds/core';
import './TacticalMotionBackground.css';

interface TacticalMotionBackgroundProps {
  variant?: 'satellite' | 'perimeter';
  showEarth?: boolean;
  showDataStreams?: boolean;
  showCoordinates?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS - MAXIMUM COMPLEXITY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate random coordinate string
 * Simulates real-world latitude/longitude
 */
function generateCoordinate(): string {
  const lat = (Math.random() * 180 - 90).toFixed(4);
  const lon = (Math.random() * 360 - 180).toFixed(4);
  const latDir = parseFloat(lat) >= 0 ? 'N' : 'S';
  const lonDir = parseFloat(lon) >= 0 ? 'E' : 'W';
  return `${Math.abs(parseFloat(lat))}° ${latDir}, ${Math.abs(parseFloat(lon))}° ${lonDir}`;
}

/**
 * Generate random data stream content
 * Simulates intelligence data flow
 */
function generateDataStream(): string[] {
  const types = ['SIGINT', 'HUMINT', 'IMINT', 'MASINT', 'OSINT'];
  const classifications = ['TS', 'S', 'C', 'U'];
  const operations = ['PERSEUS', 'REDLIGHT', 'GREENLIGHT', 'FRACTURE'];

  return Array.from({ length: 8 }, () => {
    const type = types[Math.floor(Math.random() * types.length)];
    const classification = classifications[Math.floor(Math.random() * classifications.length)];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const code = Math.floor(Math.random() * 9000) + 1000;
    return `[${classification}] ${type}/${operation}-${code}`;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const TacticalMotionBackground: React.FC<TacticalMotionBackgroundProps> = ({
  variant = 'perimeter',
  showEarth = true,
  showDataStreams = true,
  showCoordinates = true,
  intensity = 'medium',
}) => {
  // ═══════════════════════════════════════════════════════════════════════════
  // STATE & REFS - Complex state management
  // ═══════════════════════════════════════════════════════════════════════════

  const dataPointsRef = useRef<HTMLDivElement>(null);
  const [dataPoints, setDataPoints] = useState<
    Array<{ id: string; x: number; y: number; duration: number }>
  >([]);
  const [coordinates, setCoordinates] = useState<
    Array<{ id: string; x: number; y: number; coord: string; duration: number }>
  >([]);
  const [dataStreams] = useState(() => [
    { id: 'stream-1', x: 15, data: generateDataStream(), speed: 3 },
    { id: 'stream-2', x: 35, data: generateDataStream(), speed: 4 },
    { id: 'stream-3', x: 65, data: generateDataStream(), speed: 3.5 },
    { id: 'stream-4', x: 85, data: generateDataStream(), speed: 4.5 },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // COLOR SCHEME based on variant
  // ═══════════════════════════════════════════════════════════════════════════

  const colors = useMemo(() => {
    return variant === 'satellite'
      ? {
          primary: '#00ccff',
          primaryRgb: '0, 204, 255',
          secondary: '#0066cc',
          accent: '#ffb000',
        }
      : {
          primary: '#ffb000',
          primaryRgb: '255, 176, 0',
          secondary: '#ffd633',
          accent: '#0066cc',
        };
  }, [variant]);

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERATE DATA POINTS - Continuous surveillance markers
  // ═══════════════════════════════════════════════════════════════════════════

  const generateDataPoint = () => {
    const id = Math.random().toString(36).substring(2, 11);
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = 2 + Math.random() * 2; // 2-4 seconds
    return { id, x, y, duration };
  };

  useEffect(() => {
    // Initial batch
    const initialCount = intensity === 'low' ? 2 : intensity === 'medium' ? 3 : 5;
    setDataPoints(Array.from({ length: initialCount }, generateDataPoint));
  }, [intensity]);

  const intervalTime = intensity === 'low' ? 2000 : intensity === 'medium' ? 1500 : 1000;

  useInterval(() => {
    setDataPoints((prev) => {
      const newPoints = [...prev, generateDataPoint()];
      const maxPoints = intensity === 'low' ? 6 : intensity === 'medium' ? 8 : 12;
      return newPoints.slice(-maxPoints);
    });
  }, intervalTime);

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERATE FLOATING COORDINATES - Random location markers
  // ═══════════════════════════════════════════════════════════════════════════

  const generateCoordinateMarker = () => {
    const id = Math.random().toString(36).substring(2, 11);
    const x = 10 + Math.random() * 80; // Keep away from edges
    const y = 10 + Math.random() * 80;
    const coord = generateCoordinate();
    const duration = 3 + Math.random() * 3; // 3-6 seconds
    return { id, x, y, coord, duration };
  };

  useEffect(() => {
    if (!showCoordinates) return;
    // Initial batch
    setCoordinates(Array.from({ length: 4 }, generateCoordinateMarker));
  }, [showCoordinates]);

  useInterval(
    () => {
      setCoordinates((prev) => {
        const newCoords = [...prev, generateCoordinateMarker()];
        return newCoords.slice(-6); // Keep only last 6
      });
    },
    showCoordinates ? 4000 : null
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER - 10 LAYERS OF CINEMATIC COMPLEXITY
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="tactical-motion-background" data-variant={variant}>
      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 1: DEEP SPACE - Vignette gradient
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="deep-space-layer" />

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 2: PERSPECTIVE GRID - 3D receding grid lines
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid-layer" />

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 3: EARTH WIREFRAME - Rotating globe (if enabled)
          ═══════════════════════════════════════════════════════════════════ */}
      {showEarth && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '400px',
            height: '400px',
            marginLeft: '-200px',
            marginTop: '-200px',
            zIndex: 3,
            opacity: 0.15,
            pointerEvents: 'none',
          }}
        >
          {/* Latitude lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={`lat-${i}`}
              style={{
                position: 'absolute',
                top: `${i * 25}%`,
                left: 0,
                width: '100%',
                height: '1px',
                background: `linear-gradient(90deg, transparent 0%, ${colors.primary} 50%, transparent 100%)`,
                opacity: 0.6,
                animation: `latitude-rotate-${i} ${40 + i * 2}s linear infinite`,
              }}
            />
          ))}
          {/* Longitude lines */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={`lon-${i}`}
              style={{
                position: 'absolute',
                top: 0,
                left: `${i * 12.5}%`,
                width: '1px',
                height: '100%',
                background: `linear-gradient(180deg, transparent 0%, ${colors.primary} 50%, transparent 100%)`,
                opacity: 0.6,
                animation: `longitude-rotate-${i} ${50 + i * 2}s linear infinite`,
              }}
            />
          ))}
          {/* Equator highlight */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              height: '2px',
              background: colors.primary,
              opacity: 0.8,
              boxShadow: `0 0 10px ${colors.primary}`,
              animation: 'equator-pulse 4s ease-in-out infinite',
            }}
          />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 4: DATA POINTS - Surveillance markers
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="data-points-layer" ref={dataPointsRef}>
        {dataPoints.map((point) => (
          <div
            key={point.id}
            className="data-point"
            style={
              {
                left: `${point.x}%`,
                top: `${point.y}%`,
                '--duration': `${point.duration}s`,
                '--primary-color': colors.primary,
              } as React.CSSProperties & { '--duration': string; '--primary-color': string }
            }
          />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 5: RADAR SWEEP - 360° rotating beam
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="radar-layer" />

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 6: DATA STREAMS - Vertical flowing intelligence data
          ═══════════════════════════════════════════════════════════════════ */}
      {showDataStreams && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 5,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {dataStreams.map((stream) => (
            <div
              key={stream.id}
              style={{
                position: 'absolute',
                left: `${stream.x}%`,
                top: 0,
                width: '200px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                animation: `data-stream-flow ${stream.speed}s linear infinite`,
                opacity: 0.3,
              }}
            >
              {stream.data.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '9px',
                    color: colors.primary,
                    textShadow: `0 0 4px ${colors.primary}`,
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.05em',
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 7: FLOATING COORDINATES - Random location markers
          ═══════════════════════════════════════════════════════════════════ */}
      {showCoordinates && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 6,
            pointerEvents: 'none',
          }}
        >
          {coordinates.map((marker) => (
            <div
              key={marker.id}
              style={{
                position: 'absolute',
                left: `${marker.x}%`,
                top: `${marker.y}%`,
                transform: 'translate(-50%, -50%)',
                animation: `coordinate-fade ${marker.duration}s ease-out forwards`,
              }}
            >
              {/* Crosshair */}
              <div
                style={{
                  position: 'absolute',
                  width: '20px',
                  height: '20px',
                  left: '-10px',
                  top: '-10px',
                  border: `1px solid ${colors.primary}`,
                  borderRadius: '50%',
                  opacity: 0.6,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '1px',
                    height: '100%',
                    left: '50%',
                    background: colors.primary,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '1px',
                    top: '50%',
                    background: colors.primary,
                  }}
                />
              </div>
              {/* Coordinate text */}
              <div
                style={{
                  position: 'absolute',
                  top: '15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '8px',
                  color: colors.primary,
                  textShadow: `0 0 4px ${colors.primary}`,
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.05em',
                  opacity: 0.7,
                }}
              >
                {marker.coord}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 8: ATMOSPHERIC PARTICLES - Dust/noise texture
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="particles-layer" />

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 9: CRT SCANLINES - Horizontal refresh effect
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="scanlines-layer" />

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 10: VIGNETTE & FLICKER - Edge darkening
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="vignette-layer" />

      {/* ═══════════════════════════════════════════════════════════════════════
          INLINE KEYFRAMES - Additional animations
          ═══════════════════════════════════════════════════════════════════ */}
      <style>
        {`
          @keyframes data-stream-flow {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          
          @keyframes coordinate-fade {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          }
          
          @keyframes equator-pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }
          
          @keyframes latitude-rotate-0 {
            0% { transform: rotateX(0deg); }
            100% { transform: rotateX(360deg); }
          }
          
          @keyframes latitude-rotate-1 {
            0% { transform: rotateX(0deg); }
            100% { transform: rotateX(360deg); }
          }
          
          @keyframes latitude-rotate-2 {
            0% { transform: rotateX(0deg); }
            100% { transform: rotateX(360deg); }
          }
          
          @keyframes latitude-rotate-3 {
            0% { transform: rotateX(0deg); }
            100% { transform: rotateX(360deg); }
          }
          
          @keyframes latitude-rotate-4 {
            0% { transform: rotateX(0deg); }
            100% { transform: rotateX(360deg); }
          }
          
          @keyframes longitude-rotate-0 {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
          
          @keyframes longitude-rotate-1 {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
          
          @keyframes longitude-rotate-2 {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
          
          @keyframes longitude-rotate-3 {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
          
          @keyframes longitude-rotate-4 {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
          
          @keyframes longitude-rotate-5 {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
          
          @keyframes longitude-rotate-6 {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
          
          @keyframes longitude-rotate-7 {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
          
          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default TacticalMotionBackground;
