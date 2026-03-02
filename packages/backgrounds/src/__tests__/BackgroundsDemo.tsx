/**
 * Background Effects Demo
 */

import React from 'react';
import { Dots, Puffs, GridLines, MovingLines, Nebula, StarField, AnimatedGradient, Plasma } from '../index';

export const BackgroundsDemo: React.FC = () => {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', background: '#000' }}>
      <h1 style={{ color: '#00ffff' }}>Background Effects Demo</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* Dots - Grid Pattern */}
        <div>
          <h2 style={{ color: '#00ffff' }}>Dots - Grid Pattern</h2>
          <div style={{ border: '1px solid #00ffff', position: 'relative', height: '300px' }}>
            <Dots
              width={400}
              height={300}
              pattern="grid"
              dotSize={2}
              spacing={20}
              color="#00ffff"
              opacity={0.6}
              animated={true}
              animationSpeed={1}
            />
          </div>
        </div>

        {/* Dots - Random Pattern */}
        <div>
          <h2 style={{ color: '#ff00ff' }}>Dots - Random Pattern</h2>
          <div style={{ border: '1px solid #ff00ff', position: 'relative', height: '300px' }}>
            <Dots
              width={400}
              height={300}
              pattern="random"
              dotSize={3}
              spacing={30}
              color="#ff00ff"
              opacity={0.5}
              animated={true}
              animationSpeed={0.5}
            />
          </div>
        </div>

        {/* Dots - Hexagonal Pattern */}
        <div>
          <h2 style={{ color: '#00ff00' }}>Dots - Hexagonal Pattern</h2>
          <div style={{ border: '1px solid #00ff00', position: 'relative', height: '300px' }}>
            <Dots
              width={400}
              height={300}
              pattern="hexagonal"
              dotSize={2}
              spacing={25}
              color="#00ff00"
              opacity={0.7}
              animated={true}
              animationSpeed={1.5}
            />
          </div>
        </div>

        {/* Puffs - Particle Effects */}
        <div>
          <h2 style={{ color: '#ffff00' }}>Puffs - Particle Effects</h2>
          <div style={{ border: '1px solid #ffff00', position: 'relative', height: '300px' }}>
            <Puffs
              width={400}
              height={300}
              particleCount={50}
              particleSize={4}
              color="#ffff00"
              speed={1}
              opacity={0.6}
              animated={true}
            />
          </div>
        </div>

        {/* GridLines - Static Grid */}
        <div>
          <h2 style={{ color: '#ff6600' }}>GridLines - Static Grid</h2>
          <div style={{ border: '1px solid #ff6600', position: 'relative', height: '300px' }}>
            <GridLines
              width={400}
              height={300}
              cellSize={50}
              color="#ff6600"
              strokeWidth={1}
              dashed={false}
              opacity={0.4}
            />
          </div>
        </div>

        {/* GridLines - Dashed Grid */}
        <div>
          <h2 style={{ color: '#00ccff' }}>GridLines - Dashed Grid</h2>
          <div style={{ border: '1px solid #00ccff', position: 'relative', height: '300px' }}>
            <GridLines
              width={400}
              height={300}
              cellSize={40}
              color="#00ccff"
              strokeWidth={1}
              dashed={true}
              dashArray="5,5"
              opacity={0.5}
            />
          </div>
        </div>

        {/* MovingLines - Horizontal */}
        <div>
          <h2 style={{ color: '#ff00cc' }}>MovingLines - Horizontal</h2>
          <div style={{ border: '1px solid #ff00cc', position: 'relative', height: '300px' }}>
            <MovingLines
              width={400}
              height={300}
              lineCount={8}
              color="#ff00cc"
              strokeWidth={2}
              speed={2}
              direction="horizontal"
              opacity={0.5}
            />
          </div>
        </div>

        {/* MovingLines - Vertical */}
        <div>
          <h2 style={{ color: '#00ffcc' }}>MovingLines - Vertical</h2>
          <div style={{ border: '1px solid #00ffcc', position: 'relative', height: '300px' }}>
            <MovingLines
              width={400}
              height={300}
              lineCount={8}
              color="#00ffcc"
              strokeWidth={2}
              speed={1.5}
              direction="vertical"
              opacity={0.5}
            />
          </div>
        </div>

        {/* MovingLines - Diagonal */}
        <div>
          <h2 style={{ color: '#ccff00' }}>MovingLines - Diagonal</h2>
          <div style={{ border: '1px solid #ccff00', position: 'relative', height: '300px' }}>
            <MovingLines
              width={400}
              height={300}
              lineCount={6}
              color="#ccff00"
              strokeWidth={2}
              speed={2}
              direction="diagonal"
              opacity={0.5}
            />
          </div>
        </div>

        {/* Nebula Effect */}
        <div>
          <h2 style={{ color: '#ff00ff' }}>Nebula Effect</h2>
          <div style={{ border: '1px solid #ff00ff', position: 'relative', height: '300px' }}>
            <Nebula
              width={400}
              height={300}
              colors={['#ff00ff', '#00ffff', '#ff0080']}
              scale={1}
              speed={1}
              opacity={0.6}
            />
          </div>
        </div>

        {/* StarField Effect */}
        <div>
          <h2 style={{ color: '#ffff00' }}>StarField Effect</h2>
          <div style={{ border: '1px solid #ffff00', position: 'relative', height: '300px' }}>
            <StarField
              width={400}
              height={300}
              starCount={200}
              speed={2}
              parallaxFactor={0.5}
              color="#ffff00"
            />
          </div>
        </div>

        {/* AnimatedGradient Effect */}
        <div>
          <h2 style={{ color: '#00ff00' }}>AnimatedGradient Effect</h2>
          <div style={{ border: '1px solid #00ff00', position: 'relative', height: '300px' }}>
            <AnimatedGradient
              width={400}
              height={300}
              colors={['#ff0080', '#00ffff', '#00ff00']}
              angle={0}
              speed={1}
              opacity={1}
            />
          </div>
        </div>

        {/* Plasma Effect */}
        <div>
          <h2 style={{ color: '#ff6600' }}>Plasma Effect</h2>
          <div style={{ border: '1px solid #ff6600', position: 'relative', height: '300px' }}>
            <Plasma
              width={400}
              height={300}
              color1="#ff0080"
              color2="#00ffff"
              speed={1}
              opacity={0.7}
            />
          </div>
        </div>
      </div>

      {/* Layered Background Example */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ color: '#00ffff' }}>Layered Background</h2>
        <div
          style={{
            border: '1px solid #00ffff',
            position: 'relative',
            height: '400px',
            background: '#000',
            overflow: 'hidden',
          }}
        >
          {/* Base grid */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <GridLines
              width={800}
              height={400}
              cellSize={50}
              color="#00ffff"
              strokeWidth={1}
              opacity={0.2}
            />
          </div>

          {/* Dots overlay */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Dots
              width={800}
              height={400}
              pattern="grid"
              dotSize={2}
              spacing={50}
              color="#00ffff"
              opacity={0.4}
              animated={true}
            />
          </div>

          {/* Particles */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Puffs
              width={800}
              height={400}
              particleCount={30}
              particleSize={3}
              color="#ff00ff"
              speed={0.5}
              opacity={0.3}
              animated={true}
            />
          </div>

          {/* Content */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#00ffff',
              fontSize: '24px',
              fontWeight: 'bold',
              textAlign: 'center',
              zIndex: 10,
            }}
          >
            Layered Background Effects
          </div>
        </div>
      </div>

      {/* Advanced Effects Showcase */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ color: '#00ffff' }}>Advanced Effects Showcase</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {/* Nebula + Dots */}
          <div
            style={{
              border: '1px solid #ff00ff',
              position: 'relative',
              height: '300px',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <Nebula
                width={400}
                height={300}
                colors={['#ff00ff', '#00ffff']}
                scale={1}
                speed={0.5}
                opacity={0.4}
              />
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <Dots
                width={400}
                height={300}
                pattern="grid"
                dotSize={2}
                spacing={40}
                color="#00ffff"
                opacity={0.5}
                animated={true}
              />
            </div>
          </div>

          {/* StarField + AnimatedGradient */}
          <div
            style={{
              border: '1px solid #00ff00',
              position: 'relative',
              height: '300px',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <AnimatedGradient
                width={400}
                height={300}
                colors={['#ff0080', '#00ff00']}
                angle={45}
                speed={0.5}
                opacity={0.6}
              />
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <StarField
                width={400}
                height={300}
                starCount={100}
                speed={1}
                parallaxFactor={0.3}
                color="#ffffff"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundsDemo;
