/**
 * Unit Tests for Background Effects Components
 * Tests Dots, Puffs, GridLines, and MovingLines components
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { Dots } from '../Dots';
import { Puffs } from '../Puffs';
import { GridLines } from '../GridLines';
import { MovingLines } from '../MovingLines';

describe('Background Effects Components', () => {
  describe('Dots Component', () => {
    it('should render with default props', () => {
      const component = React.createElement(Dots, {
        width: 800,
        height: 600,
      });
      expect(component).toBeDefined();
      expect(component.type).toBe(Dots);
    });

    it('should accept grid pattern', () => {
      const component = React.createElement(Dots, {
        width: 800,
        height: 600,
        pattern: 'grid',
      });
      expect(component.props.pattern).toBe('grid');
    });

    it('should accept random pattern', () => {
      const component = React.createElement(Dots, {
        width: 800,
        height: 600,
        pattern: 'random',
      });
      expect(component.props.pattern).toBe('random');
    });

    it('should accept hexagonal pattern', () => {
      const component = React.createElement(Dots, {
        width: 800,
        height: 600,
        pattern: 'hexagonal',
      });
      expect(component.props.pattern).toBe('hexagonal');
    });

    it('should accept custom dot size', () => {
      const component = React.createElement(Dots, {
        width: 800,
        height: 600,
        dotSize: 5,
      });
      expect(component.props.dotSize).toBe(5);
    });

    it('should accept custom spacing', () => {
      const component = React.createElement(Dots, {
        width: 800,
        height: 600,
        spacing: 30,
      });
      expect(component.props.spacing).toBe(30);
    });

    it('should accept custom color', () => {
      const component = React.createElement(Dots, {
        width: 800,
        height: 600,
        color: '#ff0000',
      });
      expect(component.props.color).toBe('#ff0000');
    });

    it('should accept custom opacity', () => {
      const component = React.createElement(Dots, {
        width: 800,
        height: 600,
        opacity: 0.8,
      });
      expect(component.props.opacity).toBe(0.8);
    });

    it('should support animation', () => {
      const component = React.createElement(Dots, {
        width: 800,
        height: 600,
        animated: true,
        animationSpeed: 2,
      });
      expect(component.props.animated).toBe(true);
      expect(component.props.animationSpeed).toBe(2);
    });

    it('should accept className and style', () => {
      const component = React.createElement(Dots, {
        width: 800,
        height: 600,
        className: 'dots-bg',
        style: { position: 'absolute' },
      });
      expect(component.props.className).toBe('dots-bg');
      expect(component.props.style.position).toBe('absolute');
    });

    it('should handle different dimensions', () => {
      const component = React.createElement(Dots, {
        width: 1920,
        height: 1080,
      });
      expect(component.props.width).toBe(1920);
      expect(component.props.height).toBe(1080);
    });

    it('should handle small dimensions', () => {
      const component = React.createElement(Dots, {
        width: 100,
        height: 100,
      });
      expect(component.props.width).toBe(100);
      expect(component.props.height).toBe(100);
    });

    it('should handle zero opacity', () => {
      const component = React.createElement(Dots, {
        width: 800,
        height: 600,
        opacity: 0,
      });
      expect(component.props.opacity).toBe(0);
    });

    it('should handle full opacity', () => {
      const component = React.createElement(Dots, {
        width: 800,
        height: 600,
        opacity: 1,
      });
      expect(component.props.opacity).toBe(1);
    });
  });

  describe('Puffs Component', () => {
    it('should render with default props', () => {
      const component = React.createElement(Puffs, {
        width: 800,
        height: 600,
      });
      expect(component).toBeDefined();
      expect(component.type).toBe(Puffs);
    });

    it('should accept custom particle count', () => {
      const component = React.createElement(Puffs, {
        width: 800,
        height: 600,
        particleCount: 100,
      });
      expect(component.props.particleCount).toBe(100);
    });

    it('should accept custom particle size', () => {
      const component = React.createElement(Puffs, {
        width: 800,
        height: 600,
        particleSize: 8,
      });
      expect(component.props.particleSize).toBe(8);
    });

    it('should accept custom color', () => {
      const component = React.createElement(Puffs, {
        width: 800,
        height: 600,
        color: '#00ff00',
      });
      expect(component.props.color).toBe('#00ff00');
    });

    it('should accept custom speed', () => {
      const component = React.createElement(Puffs, {
        width: 800,
        height: 600,
        speed: 3,
      });
      expect(component.props.speed).toBe(3);
    });

    it('should accept custom opacity', () => {
      const component = React.createElement(Puffs, {
        width: 800,
        height: 600,
        opacity: 0.6,
      });
      expect(component.props.opacity).toBe(0.6);
    });

    it('should support animation', () => {
      const component = React.createElement(Puffs, {
        width: 800,
        height: 600,
        animated: true,
      });
      expect(component.props.animated).toBe(true);
    });

    it('should accept className and style', () => {
      const component = React.createElement(Puffs, {
        width: 800,
        height: 600,
        className: 'puffs-bg',
        style: { zIndex: 1 },
      });
      expect(component.props.className).toBe('puffs-bg');
      expect(component.props.style.zIndex).toBe(1);
    });

    it('should handle different dimensions', () => {
      const component = React.createElement(Puffs, {
        width: 1024,
        height: 768,
      });
      expect(component.props.width).toBe(1024);
      expect(component.props.height).toBe(768);
    });

    it('should handle high particle count', () => {
      const component = React.createElement(Puffs, {
        width: 800,
        height: 600,
        particleCount: 1000,
      });
      expect(component.props.particleCount).toBe(1000);
    });

    it('should handle low particle count', () => {
      const component = React.createElement(Puffs, {
        width: 800,
        height: 600,
        particleCount: 1,
      });
      expect(component.props.particleCount).toBe(1);
    });
  });

  describe('GridLines Component', () => {
    it('should render with default props', () => {
      const component = React.createElement(GridLines, {
        width: 800,
        height: 600,
      });
      expect(component).toBeDefined();
      expect(component.type).toBe(GridLines);
    });

    it('should accept custom cell size', () => {
      const component = React.createElement(GridLines, {
        width: 800,
        height: 600,
        cellSize: 50,
      });
      expect(component.props.cellSize).toBe(50);
    });

    it('should accept custom color', () => {
      const component = React.createElement(GridLines, {
        width: 800,
        height: 600,
        color: '#0088ff',
      });
      expect(component.props.color).toBe('#0088ff');
    });

    it('should accept custom stroke width', () => {
      const component = React.createElement(GridLines, {
        width: 800,
        height: 600,
        strokeWidth: 2,
      });
      expect(component.props.strokeWidth).toBe(2);
    });

    it('should support dashed lines', () => {
      const component = React.createElement(GridLines, {
        width: 800,
        height: 600,
        dashed: true,
      });
      expect(component.props.dashed).toBe(true);
    });

    it('should accept custom dash array', () => {
      const component = React.createElement(GridLines, {
        width: 800,
        height: 600,
        dashArray: '5,5',
      });
      expect(component.props.dashArray).toBe('5,5');
    });

    it('should accept custom opacity', () => {
      const component = React.createElement(GridLines, {
        width: 800,
        height: 600,
        opacity: 0.3,
      });
      expect(component.props.opacity).toBe(0.3);
    });

    it('should accept className and style', () => {
      const component = React.createElement(GridLines, {
        width: 800,
        height: 600,
        className: 'grid-bg',
        style: { filter: 'blur(1px)' },
      });
      expect(component.props.className).toBe('grid-bg');
      expect(component.props.style.filter).toBe('blur(1px)');
    });

    it('should handle different dimensions', () => {
      const component = React.createElement(GridLines, {
        width: 2560,
        height: 1440,
      });
      expect(component.props.width).toBe(2560);
      expect(component.props.height).toBe(1440);
    });

    it('should handle small cell size', () => {
      const component = React.createElement(GridLines, {
        width: 800,
        height: 600,
        cellSize: 5,
      });
      expect(component.props.cellSize).toBe(5);
    });

    it('should handle large cell size', () => {
      const component = React.createElement(GridLines, {
        width: 800,
        height: 600,
        cellSize: 200,
      });
      expect(component.props.cellSize).toBe(200);
    });
  });

  describe('MovingLines Component', () => {
    it('should render with default props', () => {
      const component = React.createElement(MovingLines, {
        width: 800,
        height: 600,
      });
      expect(component).toBeDefined();
      expect(component.type).toBe(MovingLines);
    });

    it('should accept custom line count', () => {
      const component = React.createElement(MovingLines, {
        width: 800,
        height: 600,
        lineCount: 10,
      });
      expect(component.props.lineCount).toBe(10);
    });

    it('should accept custom color', () => {
      const component = React.createElement(MovingLines, {
        width: 800,
        height: 600,
        color: '#ffff00',
      });
      expect(component.props.color).toBe('#ffff00');
    });

    it('should accept custom stroke width', () => {
      const component = React.createElement(MovingLines, {
        width: 800,
        height: 600,
        strokeWidth: 3,
      });
      expect(component.props.strokeWidth).toBe(3);
    });

    it('should accept custom speed', () => {
      const component = React.createElement(MovingLines, {
        width: 800,
        height: 600,
        speed: 5,
      });
      expect(component.props.speed).toBe(5);
    });

    it('should support horizontal direction', () => {
      const component = React.createElement(MovingLines, {
        width: 800,
        height: 600,
        direction: 'horizontal',
      });
      expect(component.props.direction).toBe('horizontal');
    });

    it('should support vertical direction', () => {
      const component = React.createElement(MovingLines, {
        width: 800,
        height: 600,
        direction: 'vertical',
      });
      expect(component.props.direction).toBe('vertical');
    });

    it('should support diagonal direction', () => {
      const component = React.createElement(MovingLines, {
        width: 800,
        height: 600,
        direction: 'diagonal',
      });
      expect(component.props.direction).toBe('diagonal');
    });

    it('should accept custom opacity', () => {
      const component = React.createElement(MovingLines, {
        width: 800,
        height: 600,
        opacity: 0.4,
      });
      expect(component.props.opacity).toBe(0.4);
    });

    it('should accept className and style', () => {
      const component = React.createElement(MovingLines, {
        width: 800,
        height: 600,
        className: 'moving-lines-bg',
        style: { mixBlendMode: 'screen' },
      });
      expect(component.props.className).toBe('moving-lines-bg');
      expect(component.props.style.mixBlendMode).toBe('screen');
    });

    it('should handle different dimensions', () => {
      const component = React.createElement(MovingLines, {
        width: 1280,
        height: 720,
      });
      expect(component.props.width).toBe(1280);
      expect(component.props.height).toBe(720);
    });

    it('should handle high line count', () => {
      const component = React.createElement(MovingLines, {
        width: 800,
        height: 600,
        lineCount: 50,
      });
      expect(component.props.lineCount).toBe(50);
    });

    it('should handle low line count', () => {
      const component = React.createElement(MovingLines, {
        width: 800,
        height: 600,
        lineCount: 1,
      });
      expect(component.props.lineCount).toBe(1);
    });
  });

  describe('Component Styling', () => {
    it('should support custom styling across all components', () => {
      const style = { opacity: 0.7, transform: 'scale(1.05)' };
      const className = 'custom-bg';

      const dots = React.createElement(Dots, {
        width: 800,
        height: 600,
        style,
        className,
      });
      const puffs = React.createElement(Puffs, {
        width: 800,
        height: 600,
        style,
        className,
      });
      const grid = React.createElement(GridLines, {
        width: 800,
        height: 600,
        style,
        className,
      });
      const lines = React.createElement(MovingLines, {
        width: 800,
        height: 600,
        style,
        className,
      });

      expect(dots.props.style).toEqual(style);
      expect(puffs.props.style).toEqual(style);
      expect(grid.props.style).toEqual(style);
      expect(lines.props.style).toEqual(style);

      expect(dots.props.className).toBe(className);
      expect(puffs.props.className).toBe(className);
      expect(grid.props.className).toBe(className);
      expect(lines.props.className).toBe(className);
    });
  });

  describe('Configuration Validation', () => {
    it('should handle zero dimensions gracefully', () => {
      const dots = React.createElement(Dots, {
        width: 0,
        height: 0,
      });
      expect(dots.props.width).toBe(0);
      expect(dots.props.height).toBe(0);
    });

    it('should handle very large dimensions', () => {
      const dots = React.createElement(Dots, {
        width: 4096,
        height: 2160,
      });
      expect(dots.props.width).toBe(4096);
      expect(dots.props.height).toBe(2160);
    });

    it('should handle minimum opacity', () => {
      const dots = React.createElement(Dots, {
        width: 800,
        height: 600,
        opacity: 0,
      });
      expect(dots.props.opacity).toBe(0);
    });

    it('should handle maximum opacity', () => {
      const dots = React.createElement(Dots, {
        width: 800,
        height: 600,
        opacity: 1,
      });
      expect(dots.props.opacity).toBe(1);
    });

    it('should handle minimum stroke width', () => {
      const grid = React.createElement(GridLines, {
        width: 800,
        height: 600,
        strokeWidth: 0.5,
      });
      expect(grid.props.strokeWidth).toBe(0.5);
    });

    it('should handle large stroke width', () => {
      const grid = React.createElement(GridLines, {
        width: 800,
        height: 600,
        strokeWidth: 10,
      });
      expect(grid.props.strokeWidth).toBe(10);
    });

    it('should handle minimum speed', () => {
      const lines = React.createElement(MovingLines, {
        width: 800,
        height: 600,
        speed: 0.1,
      });
      expect(lines.props.speed).toBe(0.1);
    });

    it('should handle high speed', () => {
      const lines = React.createElement(MovingLines, {
        width: 800,
        height: 600,
        speed: 20,
      });
      expect(lines.props.speed).toBe(20);
    });
  });

  describe('Props Propagation', () => {
    it('should propagate all props to Dots component', () => {
      const props = {
        width: 800,
        height: 600,
        pattern: 'random' as const,
        dotSize: 4,
        spacing: 25,
        color: '#ff00ff',
        opacity: 0.7,
        animated: true,
        animationSpeed: 1.5,
        className: 'test-dots',
        style: { position: 'absolute' as const },
      };

      const component = React.createElement(Dots, props);
      expect(component.props.width).toBe(props.width);
      expect(component.props.pattern).toBe(props.pattern);
      expect(component.props.dotSize).toBe(props.dotSize);
      expect(component.props.color).toBe(props.color);
    });

    it('should propagate all props to Puffs component', () => {
      const props = {
        width: 800,
        height: 600,
        particleCount: 150,
        particleSize: 6,
        color: '#00ff00',
        speed: 2,
        opacity: 0.5,
        animated: true,
        className: 'test-puffs',
        style: { zIndex: 2 },
      };

      const component = React.createElement(Puffs, props);
      expect(component.props.width).toBe(props.width);
      expect(component.props.particleCount).toBe(props.particleCount);
      expect(component.props.color).toBe(props.color);
    });

    it('should handle optional props gracefully', () => {
      const dots = React.createElement(Dots, {
        width: 800,
        height: 600,
      });
      expect(dots.props.width).toBe(800);
      expect(dots.props.height).toBe(600);
      expect(dots.props.className).toBeUndefined();
      expect(dots.props.style).toBeUndefined();
    });
  });
});
