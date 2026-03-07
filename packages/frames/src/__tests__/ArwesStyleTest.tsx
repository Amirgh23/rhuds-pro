/**
 * Arwes Style Test - دقیقاً مثل کدهای Arwes
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  FrameSVGOctagon,
  FrameSVGKranox,
  FrameSVGCorners,
  FrameSVGLines,
  FrameSVGUnderline,
  FrameSVGNefrex,
  useFrameSVGAssemblingAnimation,
  createFrameOctagonClip,
  createFrameKranoxClip,
} from '../index';

// Test 1: ClipPath با CSS (مثل Arwes)
export const ClipPathTest: React.FC = () => {
  return (
    <div style={{ padding: 20, background: '#000' }}>
      <h2 style={{ color: '#29F2DF', marginBottom: 20 }}>1. ClipPath Test (CSS)</h2>
      
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: '#29F2DF', fontSize: '1rem', marginBottom: 10 }}>Octagon ClipPath</h3>
        <div
          style={{
            width: '200px',
            height: '100px',
            clipPath: createFrameOctagonClip({
              leftTop: true,
              rightTop: false,
              rightBottom: true,
              leftBottom: false,
            }),
            background: '#077',
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: '#29F2DF', fontSize: '1rem', marginBottom: 10 }}>Kranox ClipPath</h3>
        <div
          style={{
            width: '200px',
            height: '100px',
            clipPath: createFrameKranoxClip({ squareSize: '1rem' }),
            background: '#077',
          }}
        />
      </div>
    </div>
  );
};

// Test 2: SVG Frame بدون انیمیشن (مثل Arwes)
export const SVGFrameBasicTest: React.FC = () => {
  return (
    <div style={{ padding: 20, background: '#000' }}>
      <h2 style={{ color: '#29F2DF', marginBottom: 20 }}>2. SVG Frame Basic (No Animation)</h2>
      
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ color: '#29F2DF', fontSize: '1rem', marginBottom: 10 }}>FrameSVGOctagon</h3>
        <div
          style={{
            position: 'relative',
            width: 300,
            height: 150,
          }}
        >
          <style>
            {`
              .test-octagon [data-name=bg] {
                fill: hsl(180, 75%, 10%);
              }
              .test-octagon [data-name=line] {
                stroke: hsl(180, 75%, 50%);
                fill: none;
                stroke-width: 1;
              }
            `}
          </style>
          <div className="test-octagon">
            <FrameSVGOctagon padding={4} squareSize={16} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h3 style={{ color: '#29F2DF', fontSize: '1rem', marginBottom: 10 }}>FrameSVGKranox</h3>
        <div
          style={{
            position: 'relative',
            width: 300,
            height: 200,
          }}
        >
          <style>
            {`
              .test-kranox [data-name=bg] {
                fill: hsl(60, 75%, 10%);
              }
              .test-kranox [data-name=line] {
                stroke: hsl(60, 75%, 50%);
                fill: none;
                stroke-width: 2;
              }
            `}
          </style>
          <div className="test-kranox">
            <FrameSVGKranox
              padding={4}
              strokeWidth={2}
              squareSize={12}
              smallLineLength={12}
              largeLineLength={48}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Test 3: SVG Frame با انیمیشن (مثل Arwes)
const AnimatedOctagonFrame: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef, { duration: 1500 });

  return (
    <div
      style={{
        position: 'relative',
        width: 300,
        height: 150,
      }}
    >
      <style>
        {`
          .animated-octagon [data-name=bg] {
            fill: hsl(60, 75%, 10%);
            filter: drop-shadow(0 0 4px hsl(60, 75%, 10%));
          }
          .animated-octagon [data-name=line] {
            stroke: hsl(60, 75%, 50%);
            fill: none;
            stroke-width: 1;
            filter: drop-shadow(0 0 4px hsl(60, 75%, 50%));
          }
        `}
      </style>
      <div className="animated-octagon">
        <FrameSVGOctagon elementRef={svgRef} onRender={onRender} padding={4} squareSize={16} />
      </div>
    </div>
  );
};

const AnimatedKranoxFrame: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef, { duration: 2000 });

  return (
    <div
      style={{
        position: 'relative',
        width: 300,
        height: 200,
      }}
    >
      <style>
        {`
          .animated-kranox [data-name=bg] {
            fill: hsl(60, 75%, 10%);
            filter: drop-shadow(0 0 4px hsl(60, 75%, 10%));
          }
          .animated-kranox [data-name=line] {
            stroke: hsl(60, 75%, 50%);
            fill: none;
            stroke-width: 2;
            filter: drop-shadow(0 0 4px hsl(60, 75%, 50%));
          }
        `}
      </style>
      <div className="animated-kranox">
        <FrameSVGKranox
          elementRef={svgRef}
          onRender={onRender}
          padding={4}
          strokeWidth={2}
          squareSize={12}
          smallLineLength={12}
          largeLineLength={48}
        />
      </div>
    </div>
  );
};

export const SVGFrameAnimatedTest: React.FC = () => {
  return (
    <div style={{ padding: 20, background: '#000' }}>
      <h2 style={{ color: '#29F2DF', marginBottom: 20 }}>3. SVG Frame Animated (با انیمیشن)</h2>
      
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ color: '#29F2DF', fontSize: '1rem', marginBottom: 10 }}>FrameSVGOctagon با انیمیشن</h3>
        <AnimatedOctagonFrame />
      </div>

      <div style={{ marginBottom: 40 }}>
        <h3 style={{ color: '#29F2DF', fontSize: '1rem', marginBottom: 10 }}>FrameSVGKranox با انیمیشن</h3>
        <AnimatedKranoxFrame />
      </div>
    </div>
  );
};

// Test 4: همه کامپوننت‌ها با انیمیشن
export const AllFramesTest: React.FC = () => {
  return (
    <div style={{ padding: 40, background: '#000', minHeight: '100vh' }}>
      <h1 style={{ color: '#29F2DF', marginBottom: 40, fontSize: '2rem' }}>
        🎮 Arwes Frame Components - Complete Test
      </h1>

      <ClipPathTest />
      <SVGFrameBasicTest />
      <SVGFrameAnimatedTest />

      <div style={{ marginTop: 60, padding: 20, border: '1px solid #29F2DF', borderRadius: 4 }}>
        <p style={{ color: '#29F2DF', margin: 0, fontSize: '1.1rem' }}>
          ✅ همه تست‌ها دقیقاً مثل Arwes پیاده‌سازی شدند
        </p>
        <ul style={{ color: '#29F2DF', marginTop: 10, opacity: 0.8 }}>
          <li>ClipPath با CSS ✅</li>
          <li>SVG Rendering با paths ✅</li>
          <li>Assembling Animation ✅</li>
          <li>data-name styling ✅</li>
          <li>Percentage coordinates ✅</li>
        </ul>
      </div>
    </div>
  );
};

export default AllFramesTest;
