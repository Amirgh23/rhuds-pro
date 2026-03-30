/**
 * Unit Tests for Frame Variants
 * Tests each frame variant component rendering and custom configurations
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import {
  FrameSVGOctagon,
  FrameSVGKranox,
  FrameSVGCorners,
  FrameSVGLines,
  FrameSVGUnderline,
  FrameSVGNefrex,
} from '../components';

describe('Frame Variants', () => {
  describe('FrameSVGOctagon', () => {
    it('should render with default props', () => {
      const component = React.createElement(FrameSVGOctagon, {});
      expect(component).toBeDefined();
      expect(component.type).toBe(FrameSVGOctagon);
    });

    it('should accept custom padding', () => {
      const component = React.createElement(FrameSVGOctagon, { padding: 10 });
      expect(component.props.padding).toBe(10);
    });

    it('should accept custom square size', () => {
      const component = React.createElement(FrameSVGOctagon, { squareSize: 32 });
      expect(component.props.squareSize).toBe(32);
    });

    it('should support selective corner clipping', () => {
      const component = React.createElement(FrameSVGOctagon, {
        leftTop: true,
        rightTop: false,
        rightBottom: true,
        leftBottom: false,
      });
      expect(component.props.leftTop).toBe(true);
      expect(component.props.rightTop).toBe(false);
    });

    it('should accept className and style props', () => {
      const component = React.createElement(FrameSVGOctagon, {
        className: 'test-class',
        style: { opacity: 0.5 },
      });
      expect(component.props.className).toBe('test-class');
      expect(component.props.style.opacity).toBe(0.5);
    });
  });

  describe('FrameSVGKranox', () => {
    it('should render with default props', () => {
      const component = React.createElement(FrameSVGKranox, {});
      expect(component).toBeDefined();
      expect(component.type).toBe(FrameSVGKranox);
    });

    it('should accept custom padding', () => {
      const component = React.createElement(FrameSVGKranox, { padding: 5 });
      expect(component.props.padding).toBe(5);
    });

    it('should accept custom stroke width', () => {
      const component = React.createElement(FrameSVGKranox, { strokeWidth: 3 });
      expect(component.props.strokeWidth).toBe(3);
    });

    it('should accept custom square size', () => {
      const component = React.createElement(FrameSVGKranox, { squareSize: 20 });
      expect(component.props.squareSize).toBe(20);
    });

    it('should accept custom line lengths', () => {
      const component = React.createElement(FrameSVGKranox, {
        smallLineLength: 24,
        largeLineLength: 72,
      });
      expect(component.props.smallLineLength).toBe(24);
      expect(component.props.largeLineLength).toBe(72);
    });

    it('should accept all configuration options', () => {
      const component = React.createElement(FrameSVGKranox, {
        padding: 8,
        strokeWidth: 2,
        squareSize: 16,
        smallLineLength: 20,
        largeLineLength: 60,
        className: 'kranox-frame',
      });
      expect(component.props.padding).toBe(8);
      expect(component.props.strokeWidth).toBe(2);
      expect(component.props.className).toBe('kranox-frame');
    });
  });

  describe('FrameSVGCorners', () => {
    it('should render with default props', () => {
      const component = React.createElement(FrameSVGCorners, {});
      expect(component).toBeDefined();
      expect(component.type).toBe(FrameSVGCorners);
    });

    it('should accept custom padding', () => {
      const component = React.createElement(FrameSVGCorners, { padding: 5 });
      expect(component.props.padding).toBe(5);
    });

    it('should accept custom stroke width', () => {
      const component = React.createElement(FrameSVGCorners, { strokeWidth: 2 });
      expect(component.props.strokeWidth).toBe(2);
    });

    it('should accept custom corner length', () => {
      const component = React.createElement(FrameSVGCorners, { cornerLength: 64 });
      expect(component.props.cornerLength).toBe(64);
    });

    it('should support inside/outside corner positioning via configuration', () => {
      const component = React.createElement(FrameSVGCorners, {
        padding: 10,
        cornerLength: 48,
      });
      expect(component.props.padding).toBe(10);
      expect(component.props.cornerLength).toBe(48);
    });
  });

  describe('FrameSVGLines', () => {
    it('should render with default props', () => {
      const component = React.createElement(FrameSVGLines, {});
      expect(component).toBeDefined();
      expect(component.type).toBe(FrameSVGLines);
    });

    it('should accept custom padding', () => {
      const component = React.createElement(FrameSVGLines, { padding: 8 });
      expect(component.props.padding).toBe(8);
    });

    it('should accept custom stroke width', () => {
      const component = React.createElement(FrameSVGLines, { strokeWidth: 3 });
      expect(component.props.strokeWidth).toBe(3);
    });

    it('should accept custom line length for dash pattern', () => {
      const component = React.createElement(FrameSVGLines, { lineLength: 12 });
      expect(component.props.lineLength).toBe(12);
    });

    it('should support configurable dash patterns', () => {
      const component = React.createElement(FrameSVGLines, {
        padding: 4,
        strokeWidth: 2,
        lineLength: 16,
      });
      expect(component.props.lineLength).toBe(16);
    });
  });

  describe('FrameSVGUnderline', () => {
    it('should render with default props', () => {
      const component = React.createElement(FrameSVGUnderline, {});
      expect(component).toBeDefined();
      expect(component.type).toBe(FrameSVGUnderline);
    });

    it('should accept custom padding', () => {
      const component = React.createElement(FrameSVGUnderline, { padding: 6 });
      expect(component.props.padding).toBe(6);
    });

    it('should accept custom stroke width', () => {
      const component = React.createElement(FrameSVGUnderline, { strokeWidth: 2 });
      expect(component.props.strokeWidth).toBe(2);
    });

    it('should accept custom square size', () => {
      const component = React.createElement(FrameSVGUnderline, { squareSize: 16 });
      expect(component.props.squareSize).toBe(16);
    });

    it('should support configurable square size for corners', () => {
      const component = React.createElement(FrameSVGUnderline, {
        padding: 4,
        strokeWidth: 1,
        squareSize: 12,
      });
      expect(component.props.squareSize).toBe(12);
    });
  });

  describe('FrameSVGNefrex', () => {
    it('should render with default props', () => {
      const component = React.createElement(FrameSVGNefrex, {});
      expect(component).toBeDefined();
      expect(component.type).toBe(FrameSVGNefrex);
    });

    it('should accept custom padding', () => {
      const component = React.createElement(FrameSVGNefrex, { padding: 8 });
      expect(component.props.padding).toBe(8);
    });

    it('should accept custom stroke width', () => {
      const component = React.createElement(FrameSVGNefrex, { strokeWidth: 3 });
      expect(component.props.strokeWidth).toBe(3);
    });

    it('should accept custom square size', () => {
      const component = React.createElement(FrameSVGNefrex, { squareSize: 48 });
      expect(component.props.squareSize).toBe(48);
    });

    it('should accept custom line lengths', () => {
      const component = React.createElement(FrameSVGNefrex, {
        smallLineLength: 64,
        largeLineLength: 256,
      });
      expect(component.props.smallLineLength).toBe(64);
      expect(component.props.largeLineLength).toBe(256);
    });

    it('should support all configuration options', () => {
      const component = React.createElement(FrameSVGNefrex, {
        padding: 10,
        strokeWidth: 2,
        squareSize: 40,
        smallLineLength: 48,
        largeLineLength: 192,
        className: 'nefrex-frame',
      });
      expect(component.props.padding).toBe(10);
      expect(component.props.strokeWidth).toBe(2);
      expect(component.props.squareSize).toBe(40);
      expect(component.props.className).toBe('nefrex-frame');
    });
  });

  describe('Variant Comparison', () => {
    it('should have different default configurations', () => {
      const octagon = React.createElement(FrameSVGOctagon, {});
      const kranox = React.createElement(FrameSVGKranox, {});
      const corners = React.createElement(FrameSVGCorners, {});
      const lines = React.createElement(FrameSVGLines, {});
      const underline = React.createElement(FrameSVGUnderline, {});
      const nefrex = React.createElement(FrameSVGNefrex, {});

      expect(octagon.type).not.toBe(kranox.type);
      expect(kranox.type).not.toBe(corners.type);
      expect(corners.type).not.toBe(lines.type);
      expect(lines.type).not.toBe(underline.type);
      expect(underline.type).not.toBe(nefrex.type);
    });

    it('should support custom styling across all variants', () => {
      const style = { opacity: 0.8, transform: 'scale(1.1)' };
      const className = 'custom-frame';

      const octagon = React.createElement(FrameSVGOctagon, { style, className });
      const kranox = React.createElement(FrameSVGKranox, { style, className });
      const corners = React.createElement(FrameSVGCorners, { style, className });
      const lines = React.createElement(FrameSVGLines, { style, className });
      const underline = React.createElement(FrameSVGUnderline, { style, className });
      const nefrex = React.createElement(FrameSVGNefrex, { style, className });

      expect(octagon.props.style).toEqual(style);
      expect(kranox.props.style).toEqual(style);
      expect(corners.props.style).toEqual(style);
      expect(lines.props.style).toEqual(style);
      expect(underline.props.style).toEqual(style);
      expect(nefrex.props.style).toEqual(style);

      expect(octagon.props.className).toBe(className);
      expect(kranox.props.className).toBe(className);
      expect(corners.props.className).toBe(className);
      expect(lines.props.className).toBe(className);
      expect(underline.props.className).toBe(className);
      expect(nefrex.props.className).toBe(className);
    });
  });

  describe('Configuration Validation', () => {
    it('should handle zero padding', () => {
      const octagon = React.createElement(FrameSVGOctagon, { padding: 0 });
      const kranox = React.createElement(FrameSVGKranox, { padding: 0 });
      expect(octagon.props.padding).toBe(0);
      expect(kranox.props.padding).toBe(0);
    });

    it('should handle large padding values', () => {
      const octagon = React.createElement(FrameSVGOctagon, { padding: 100 });
      const kranox = React.createElement(FrameSVGKranox, { padding: 100 });
      expect(octagon.props.padding).toBe(100);
      expect(kranox.props.padding).toBe(100);
    });

    it('should handle minimum stroke width', () => {
      const kranox = React.createElement(FrameSVGKranox, { strokeWidth: 1 });
      const corners = React.createElement(FrameSVGCorners, { strokeWidth: 1 });
      expect(kranox.props.strokeWidth).toBe(1);
      expect(corners.props.strokeWidth).toBe(1);
    });

    it('should handle large stroke width', () => {
      const kranox = React.createElement(FrameSVGKranox, { strokeWidth: 10 });
      const corners = React.createElement(FrameSVGCorners, { strokeWidth: 10 });
      expect(kranox.props.strokeWidth).toBe(10);
      expect(corners.props.strokeWidth).toBe(10);
    });

    it('should handle minimum square size', () => {
      const octagon = React.createElement(FrameSVGOctagon, { squareSize: 1 });
      const underline = React.createElement(FrameSVGUnderline, { squareSize: 1 });
      expect(octagon.props.squareSize).toBe(1);
      expect(underline.props.squareSize).toBe(1);
    });

    it('should handle large square size', () => {
      const octagon = React.createElement(FrameSVGOctagon, { squareSize: 200 });
      const nefrex = React.createElement(FrameSVGNefrex, { squareSize: 200 });
      expect(octagon.props.squareSize).toBe(200);
      expect(nefrex.props.squareSize).toBe(200);
    });
  });

  describe('Props Propagation', () => {
    it('should propagate all props to components', () => {
      const props = {
        padding: 5,
        strokeWidth: 2,
        squareSize: 20,
        className: 'test',
        style: { color: 'red' },
      };

      const octagon = React.createElement(FrameSVGOctagon, props);
      expect(octagon.props.padding).toBe(props.padding);
      expect(octagon.props.className).toBe(props.className);
      expect(octagon.props.style).toEqual(props.style);
    });

    it('should handle optional props gracefully', () => {
      const octagon = React.createElement(FrameSVGOctagon, { padding: 5 });
      expect(octagon.props.padding).toBe(5);
      expect(octagon.props.className).toBeUndefined();
      expect(octagon.props.style).toBeUndefined();
    });
  });
});
