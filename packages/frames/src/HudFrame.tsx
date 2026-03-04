/**
 * HudFrame Component
 * React wrapper for HUD Frame Generator
 */

import React, { useMemo, useState } from 'react';
import { generateHudFrameSVG } from './hudFrameGenerator';

export interface HudFrameProps {
  width?: number;
  height?: number;
  seed?: number;
  padding?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onSeedChange?: (seed: number) => void;
}

/**
 * HudFrame Component
 * Generates procedural sci-fi/HUD style SVG frames
 */
export const HudFrame: React.FC<HudFrameProps> = ({
  width = 384,
  height = 150,
  seed: controlledSeed,
  padding = 22,
  children,
  className,
  style,
  onSeedChange,
}) => {
  const [internalSeed, setInternalSeed] = useState(898766);
  
  const seed = controlledSeed !== undefined ? controlledSeed : internalSeed;

  const { svgMarkup, meta } = useMemo(() => {
    return generateHudFrameSVG({
      w: width,
      h: height,
      seed,
      pad: padding,
    });
  }, [width, height, seed, padding]);

  const randomize = () => {
    const newSeed = (seed + Math.floor(Math.random() * 9999) + 1) >>> 0;
    setInternalSeed(newSeed);
    onSeedChange?.(newSeed);
  };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: width,
        height: height,
        ...style,
      }}
    >
      {/* SVG Frame */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />

      {/* Content */}
      {children && (
        <div
          style={{
            position: 'relative',
            padding: '24px',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

HudFrame.displayName = 'HudFrame';

/**
 * HudFrameWithControls Component
 * HudFrame with built-in randomize controls
 */
export interface HudFrameWithControlsProps extends HudFrameProps {
  showControls?: boolean;
  showSeedInput?: boolean;
}

export const HudFrameWithControls: React.FC<HudFrameWithControlsProps> = ({
  showControls = true,
  showSeedInput = true,
  ...props
}) => {
  const [seed, setSeed] = useState(props.seed || 898766);
  const [seedInput, setSeedInput] = useState(String(seed));

  const handleRandomize = () => {
    const newSeed = (seed + Math.floor(Math.random() * 9999) + 1) >>> 0;
    setSeed(newSeed);
    setSeedInput(String(newSeed));
    props.onSeedChange?.(newSeed);
  };

  const handleApplySeed = () => {
    const v = Number(seedInput);
    if (Number.isFinite(v) && v >= 0) {
      const newSeed = v >>> 0;
      setSeed(newSeed);
      props.onSeedChange?.(newSeed);
    }
  };

  const handleDownloadSVG = () => {
    const { svgMarkup } = generateHudFrameSVG({
      w: props.width || 384,
      h: props.height || 150,
      seed,
      pad: props.padding || 22,
    });

    const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `hud-frame-${seed}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1rem',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    }}>
      {showControls && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'wrap',
            fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <button
            onClick={handleRandomize}
            style={{
              background: 'rgba(18, 168, 255, 0.12)',
              border: '1px solid rgba(18, 168, 255, 0.35)',
              color: '#cfefff',
              padding: 'clamp(0.4rem, 1vw, 0.5rem)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            Randomize
          </button>

          {showSeedInput && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>Seed:</span>
              <input
                value={seedInput}
                onChange={e => setSeedInput(e.target.value)}
                placeholder="seed"
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(18, 168, 255, 0.25)',
                  color: '#cfefff',
                  padding: 'clamp(0.4rem, 1vw, 0.5rem)',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  maxWidth: '6rem',
                  width: '100%',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                }}
              />
              <button
                onClick={handleApplySeed}
                style={{
                  background: 'rgba(18, 168, 255, 0.12)',
                  border: '1px solid rgba(18, 168, 255, 0.35)',
                  color: '#cfefff',
                  padding: 'clamp(0.4rem, 1vw, 0.5rem)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                Apply
              </button>
            </div>
          )}

          <button
            onClick={handleDownloadSVG}
            style={{
              background: 'rgba(18, 168, 255, 0.12)',
              border: '1px solid rgba(18, 168, 255, 0.35)',
              color: '#cfefff',
              padding: 'clamp(0.4rem, 1vw, 0.5rem)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            Save SVG
          </button>
        </div>
      )}

      <HudFrame {...props} seed={seed} onSeedChange={setSeed} />
    </div>
  );
};

HudFrameWithControls.displayName = 'HudFrameWithControls';
