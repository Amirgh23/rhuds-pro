/**
 * Phase 11 Week 1 - WebGL & 3D Rendering Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import WebGLShaders, { BUILTIN_SHADERS } from '../../engine/rendering/WebGLShaders';
import WebGLBuffers from '../../engine/rendering/WebGLBuffers';
import Renderer3D from '../../engine/rendering/3DRenderer';
import Matrix from '../../engine/math/Matrix';

describe('Phase 11 Week 1 - WebGL & 3D Rendering', () => {
  let canvas: HTMLCanvasElement;
  let gl: WebGLRenderingContext;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    gl = canvas.getContext('webgl2') as WebGLRenderingContext;
  });

  afterEach(() => {
    canvas.remove();
  });

  describe('WebGL Shaders', () => {
    it('should create shader program', () => {
      const shaders = new WebGLShaders(gl);
      const program = shaders.createProgram('test', BUILTIN_SHADERS.lineChart);
      expect(program).toBeDefined();
    });

    it('should compile all builtin shaders', () => {
      const shaders = new WebGLShaders(gl);

      Object.entries(BUILTIN_SHADERS).forEach(([name, source]) => {
        expect(() => {
          shaders.createProgram(name, source);
        }).not.toThrow();
      });
    });

    it('should set uniforms', () => {
      const shaders = new WebGLShaders(gl);
      const program = shaders.createProgram('test', BUILTIN_SHADERS.lineChart);

      expect(() => {
        shaders.setUniforms(program, {
          projection: new Array(16).fill(0),
          view: new Array(16).fill(0),
        });
      }).not.toThrow();
    });

    it('should delete program', () => {
      const shaders = new WebGLShaders(gl);
      shaders.createProgram('test', BUILTIN_SHADERS.lineChart);
      expect(() => {
        shaders.deleteProgram('test');
      }).not.toThrow();
    });

    it('should clear all programs', () => {
      const shaders = new WebGLShaders(gl);
      shaders.createProgram('test1', BUILTIN_SHADERS.lineChart);
      shaders.createProgram('test2', BUILTIN_SHADERS.barChart);
      expect(() => {
        shaders.clear();
      }).not.toThrow();
    });
  });

  describe('WebGL Buffers', () => {
    it('should create buffer', () => {
      const buffers = new WebGLBuffers(gl);
      const vertices = new Float32Array([0, 0, 1, 1, 2, 0]);
      const colors = new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]);

      expect(() => {
        buffers.createBuffer('test', { vertices, colors });
      }).not.toThrow();
    });

    it('should create buffer with indices', () => {
      const buffers = new WebGLBuffers(gl);
      const vertices = new Float32Array([0, 0, 1, 1, 2, 0]);
      const colors = new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]);
      const indices = new Uint32Array([0, 1, 2]);

      expect(() => {
        buffers.createBuffer('test', { vertices, colors, indices });
      }).not.toThrow();
    });

    it('should update buffer data', () => {
      const buffers = new WebGLBuffers(gl);
      const vertices = new Float32Array([0, 0, 1, 1, 2, 0]);
      const colors = new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]);

      buffers.createBuffer('test', { vertices, colors });

      const newVertices = new Float32Array([0, 0, 2, 2, 4, 0]);
      expect(() => {
        buffers.updateBuffer('test', { vertices: newVertices });
      }).not.toThrow();
    });

    it('should get buffer data', () => {
      const buffers = new WebGLBuffers(gl);
      const vertices = new Float32Array([0, 0, 1, 1, 2, 0]);
      const colors = new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]);

      buffers.createBuffer('test', { vertices, colors });
      const data = buffers.getBufferData('test');

      expect(data).toBeDefined();
      expect(data?.vertices).toEqual(vertices);
      expect(data?.colors).toEqual(colors);
    });

    it('should calculate memory usage', () => {
      const buffers = new WebGLBuffers(gl);
      const vertices = new Float32Array([0, 0, 1, 1, 2, 0]);
      const colors = new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]);

      buffers.createBuffer('test', { vertices, colors });
      const usage = buffers.getMemoryUsage();

      expect(usage).toBeGreaterThan(0);
      expect(usage).toBe(vertices.byteLength + colors.byteLength);
    });

    it('should delete buffer', () => {
      const buffers = new WebGLBuffers(gl);
      const vertices = new Float32Array([0, 0, 1, 1, 2, 0]);
      const colors = new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]);

      buffers.createBuffer('test', { vertices, colors });
      expect(() => {
        buffers.deleteBuffer('test');
      }).not.toThrow();
    });

    it('should clear all buffers', () => {
      const buffers = new WebGLBuffers(gl);
      const vertices = new Float32Array([0, 0, 1, 1, 2, 0]);
      const colors = new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]);

      buffers.createBuffer('test1', { vertices, colors });
      buffers.createBuffer('test2', { vertices, colors });

      expect(() => {
        buffers.clear();
      }).not.toThrow();
    });
  });

  describe('3D Renderer', () => {
    it('should create 3D renderer', () => {
      expect(() => {
        new Renderer3D(canvas);
      }).not.toThrow();
    });

    it('should add mesh', () => {
      const renderer = new Renderer3D(canvas);
      const vertices = new Float32Array([-1, -1, 0, 1, -1, 0, 0, 1, 0]);
      const colors = new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]);

      expect(() => {
        renderer.addMesh('triangle', {
          vertices,
          colors,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        });
      }).not.toThrow();
    });

    it('should set camera', () => {
      const renderer = new Renderer3D(canvas);

      expect(() => {
        renderer.setCamera({
          position: [0, 0, 10],
          target: [0, 0, 0],
        });
      }).not.toThrow();
    });

    it('should rotate camera', () => {
      const renderer = new Renderer3D(canvas);

      expect(() => {
        renderer.rotateCamera(0.1, 0.2, 0.3);
      }).not.toThrow();
    });

    it('should render', () => {
      const renderer = new Renderer3D(canvas);
      const vertices = new Float32Array([-1, -1, 0, 1, -1, 0, 0, 1, 0]);
      const colors = new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]);

      renderer.addMesh('triangle', {
        vertices,
        colors,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      });

      expect(() => {
        renderer.render();
      }).not.toThrow();
    });

    it('should resize', () => {
      const renderer = new Renderer3D(canvas);

      expect(() => {
        renderer.resize(1024, 768);
      }).not.toThrow();
    });

    it('should destroy', () => {
      const renderer = new Renderer3D(canvas);

      expect(() => {
        renderer.destroy();
      }).not.toThrow();
    });
  });

  describe('Matrix Operations', () => {
    it('should create identity matrix', () => {
      const matrix = Matrix.identity();
      expect(matrix.length).toBe(16);
      expect(matrix[0]).toBe(1);
      expect(matrix[5]).toBe(1);
      expect(matrix[10]).toBe(1);
      expect(matrix[15]).toBe(1);
    });

    it('should create translation matrix', () => {
      const matrix = Matrix.translation(1, 2, 3);
      expect(matrix[12]).toBe(1);
      expect(matrix[13]).toBe(2);
      expect(matrix[14]).toBe(3);
    });

    it('should create scale matrix', () => {
      const matrix = Matrix.scale(2, 3, 4);
      expect(matrix[0]).toBe(2);
      expect(matrix[5]).toBe(3);
      expect(matrix[10]).toBe(4);
    });

    it('should create rotation matrices', () => {
      const rx = Matrix.rotationX(Math.PI / 4);
      const ry = Matrix.rotationY(Math.PI / 4);
      const rz = Matrix.rotationZ(Math.PI / 4);

      expect(rx.length).toBe(16);
      expect(ry.length).toBe(16);
      expect(rz.length).toBe(16);
    });

    it('should create perspective matrix', () => {
      const matrix = Matrix.perspective(45, 16 / 9, 0.1, 1000);
      expect(matrix.length).toBe(16);
    });

    it('should create orthographic matrix', () => {
      const matrix = Matrix.orthographic(-1, 1, -1, 1, 0.1, 1000);
      expect(matrix.length).toBe(16);
    });

    it('should create look-at matrix', () => {
      const matrix = Matrix.lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]);
      expect(matrix.length).toBe(16);
    });

    it('should multiply matrices', () => {
      const a = Matrix.identity();
      const b = Matrix.translation(1, 2, 3);
      const result = Matrix.multiply(a, b);

      expect(result.length).toBe(16);
      expect(result[12]).toBe(1);
      expect(result[13]).toBe(2);
      expect(result[14]).toBe(3);
    });

    it('should transpose matrix', () => {
      const matrix = Matrix.translation(1, 2, 3);
      const transposed = Matrix.transpose(matrix);

      expect(transposed[3]).toBe(1);
      expect(transposed[7]).toBe(2);
      expect(transposed[11]).toBe(3);
    });

    it('should invert matrix', () => {
      const matrix = Matrix.translation(1, 2, 3);
      const inverted = Matrix.invert(matrix);

      expect(inverted.length).toBe(16);
      expect(inverted[12]).toBe(-1);
      expect(inverted[13]).toBe(-2);
      expect(inverted[14]).toBe(-3);
    });

    it('should normalize vector', () => {
      const v = [3, 4, 0];
      const normalized = Matrix.normalize(v);

      expect(normalized[0]).toBeCloseTo(0.6);
      expect(normalized[1]).toBeCloseTo(0.8);
      expect(normalized[2]).toBe(0);
    });

    it('should calculate cross product', () => {
      const a = [1, 0, 0];
      const b = [0, 1, 0];
      const result = Matrix.cross(a, b);

      expect(result[0]).toBe(0);
      expect(result[1]).toBe(0);
      expect(result[2]).toBe(1);
    });

    it('should calculate dot product', () => {
      const a = [1, 2, 3];
      const b = [4, 5, 6];
      const result = Matrix.dot(a, b);

      expect(result).toBe(32);
    });

    it('should calculate vector length', () => {
      const v = [3, 4, 0];
      const length = Matrix.length(v);

      expect(length).toBe(5);
    });
  });

  describe('Performance Tests', () => {
    it('should handle large datasets efficiently', () => {
      const buffers = new WebGLBuffers(gl);
      const vertexCount = 100000;
      const vertices = new Float32Array(vertexCount * 2);
      const colors = new Float32Array(vertexCount * 4);

      for (let i = 0; i < vertexCount; i++) {
        vertices[i * 2] = Math.random();
        vertices[i * 2 + 1] = Math.random();
        colors[i * 4] = Math.random();
        colors[i * 4 + 1] = Math.random();
        colors[i * 4 + 2] = Math.random();
        colors[i * 4 + 3] = 1;
      }

      const start = performance.now();
      buffers.createBuffer('large', { vertices, colors });
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    });

    it('should render efficiently', () => {
      const renderer = new Renderer3D(canvas);
      const vertices = new Float32Array([-1, -1, 0, 1, -1, 0, 0, 1, 0]);
      const colors = new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]);

      renderer.addMesh('triangle', {
        vertices,
        colors,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      });

      const start = performance.now();
      for (let i = 0; i < 60; i++) {
        renderer.render();
      }
      const end = performance.now();

      const avgTime = (end - start) / 60;
      expect(avgTime).toBeLessThan(20); // Should average less than 20ms per frame
    });
  });
});
