/**
 * 3D Rendering Engine
 * WebGL-based 3D chart rendering
 */

import WebGLShaders, { BUILTIN_SHADERS } from './WebGLShaders';
import WebGLBuffers from './WebGLBuffers';

export interface Camera3D {
  position: [number, number, number];
  target: [number, number, number];
  up: [number, number, number];
  fov: number;
  near: number;
  far: number;
}

export interface Light3D {
  position: [number, number, number];
  color: [number, number, number];
  intensity: number;
}

export interface Mesh3D {
  vertices: Float32Array;
  colors: Float32Array;
  indices?: Uint32Array;
  normals?: Float32Array;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

/**
 * 3D Renderer for WebGL
 */
export class Renderer3D {
  private gl: WebGLRenderingContext;
  private shaders: WebGLShaders;
  private buffers: WebGLBuffers;
  private camera: Camera3D;
  private lights: Light3D[] = [];
  private meshes: Map<string, Mesh3D> = new Map();
  private projectionMatrix: Float32Array;
  private viewMatrix: Float32Array;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2');
    if (!gl) throw new Error('WebGL2 not supported');

    this.gl = gl;
    this.shaders = new WebGLShaders(gl);
    this.buffers = new WebGLBuffers(gl);

    this.camera = {
      position: [0, 0, 5],
      target: [0, 0, 0],
      up: [0, 1, 0],
      fov: 45,
      near: 0.1,
      far: 1000,
    };

    this.projectionMatrix = this.createProjectionMatrix(
      canvas.width,
      canvas.height,
      this.camera.fov,
      this.camera.near,
      this.camera.far
    );
    this.viewMatrix = this.createViewMatrix(
      this.camera.position,
      this.camera.target,
      this.camera.up
    );

    this.setupShaders();
    this.setupLighting();
  }

  /**
   * Setup shaders
   */
  private setupShaders(): void {
    this.shaders.createProgram('3d', BUILTIN_SHADERS.shader3D);
  }

  /**
   * Setup lighting
   */
  private setupLighting(): void {
    this.lights.push({
      position: [5, 5, 5],
      color: [1, 1, 1],
      intensity: 1,
    });
  }

  /**
   * Create projection matrix
   */
  private createProjectionMatrix(
    width: number,
    height: number,
    fov: number,
    near: number,
    far: number
  ): Float32Array {
    const f = 1 / Math.tan(fov / 2);
    const aspect = width / height;
    const nf = 1 / (near - far);

    return new Float32Array([
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (far + near) * nf,
      -1,
      0,
      0,
      2 * far * near * nf,
      0,
    ]);
  }

  /**
   * Create view matrix
   */
  private createViewMatrix(
    position: [number, number, number],
    target: [number, number, number],
    up: [number, number, number]
  ): Float32Array {
    const zAxis = this.normalize([
      position[0] - target[0],
      position[1] - target[1],
      position[2] - target[2],
    ]);

    const xAxis = this.normalize(this.cross(up, zAxis));
    const yAxis = this.cross(zAxis, xAxis);

    return new Float32Array([
      xAxis[0],
      yAxis[0],
      zAxis[0],
      0,
      xAxis[1],
      yAxis[1],
      zAxis[1],
      0,
      xAxis[2],
      yAxis[2],
      zAxis[2],
      0,
      -this.dot(xAxis, position),
      -this.dot(yAxis, position),
      -this.dot(zAxis, position),
      1,
    ]);
  }

  /**
   * Create model matrix
   */
  private createModelMatrix(
    position: [number, number, number],
    rotation: [number, number, number],
    scale: [number, number, number]
  ): Float32Array {
    const matrix = new Float32Array(16);

    // Translation
    matrix[12] = position[0];
    matrix[13] = position[1];
    matrix[14] = position[2];

    // Rotation (simplified - Euler angles)
    const rx = this.createRotationX(rotation[0]);
    const ry = this.createRotationY(rotation[1]);
    const rz = this.createRotationZ(rotation[2]);

    const rotated = this.multiplyMatrices(rx, ry);
    const rotated2 = this.multiplyMatrices(rotated, rz);

    // Scale
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        matrix[i * 4 + j] = rotated2[i * 4 + j] * scale[i];
      }
    }

    matrix[15] = 1;
    return matrix;
  }

  /**
   * Create rotation matrix X
   */
  private createRotationX(angle: number): Float32Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Float32Array([1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]);
  }

  /**
   * Create rotation matrix Y
   */
  private createRotationY(angle: number): Float32Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Float32Array([c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1]);
  }

  /**
   * Create rotation matrix Z
   */
  private createRotationZ(angle: number): Float32Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Float32Array([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  /**
   * Multiply matrices
   */
  private multiplyMatrices(a: Float32Array, b: Float32Array): Float32Array {
    const result = new Float32Array(16);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[i * 4 + k] * b[k * 4 + j];
        }
        result[i * 4 + j] = sum;
      }
    }

    return result;
  }

  /**
   * Vector operations
   */
  private normalize(v: number[]): number[] {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / len, v[1] / len, v[2] / len];
  }

  private cross(a: number[], b: number[]): number[] {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }

  private dot(a: number[], b: number[]): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  /**
   * Add mesh
   */
  addMesh(name: string, mesh: Mesh3D): void {
    this.meshes.set(name, mesh);
    this.buffers.createBuffer(name, {
      vertices: mesh.vertices,
      colors: mesh.colors,
      indices: mesh.indices,
      normals: mesh.normals,
    });
  }

  /**
   * Update camera
   */
  setCamera(camera: Partial<Camera3D>): void {
    this.camera = { ...this.camera, ...camera };
    this.viewMatrix = this.createViewMatrix(
      this.camera.position,
      this.camera.target,
      this.camera.up
    );
  }

  /**
   * Rotate camera
   */
  rotateCamera(x: number, y: number, z: number): void {
    const pos = this.camera.position;
    const angle = Math.sqrt(x * x + y * y);
    const radius = Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1] + pos[2] * pos[2]);

    this.camera.position = [
      radius * Math.sin(angle) * Math.cos(z),
      radius * Math.cos(angle),
      radius * Math.sin(angle) * Math.sin(z),
    ];

    this.viewMatrix = this.createViewMatrix(
      this.camera.position,
      this.camera.target,
      this.camera.up
    );
  }

  /**
   * Render scene
   */
  render(): void {
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);

    const program = this.shaders.getProgram('3d');
    if (!program) return;

    this.gl.useProgram(program);

    // Set matrices
    this.shaders.setUniforms(program, {
      projection: Array.from(this.projectionMatrix),
      view: Array.from(this.viewMatrix),
      lightDir: [0.5, 0.5, 0.5],
    });

    // Render meshes
    this.meshes.forEach((mesh, name) => {
      const modelMatrix = this.createModelMatrix(mesh.position, mesh.rotation, mesh.scale);

      this.shaders.setUniforms(program, {
        model: Array.from(modelMatrix),
      });

      this.buffers.bindBuffer(name);
      this.buffers.bindAttribute(program, name, 'position', 3);
      this.buffers.bindAttribute(program, name, 'color', 4);
      if (mesh.normals) {
        this.buffers.bindAttribute(program, name, 'normal', 3);
      }

      if (mesh.indices) {
        this.gl.drawElements(this.gl.TRIANGLES, mesh.indices.length, this.gl.UNSIGNED_INT, 0);
      } else {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.vertices.length / 3);
      }
    });
  }

  /**
   * Resize
   */
  resize(width: number, height: number): void {
    this.gl.viewport(0, 0, width, height);
    this.projectionMatrix = this.createProjectionMatrix(
      width,
      height,
      this.camera.fov,
      this.camera.near,
      this.camera.far
    );
  }

  /**
   * Destroy
   */
  destroy(): void {
    this.buffers.clear();
    this.shaders.clear();
    this.meshes.clear();
  }
}

export default Renderer3D;
