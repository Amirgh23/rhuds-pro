/**
 * WebGL Buffer Management System
 * Efficient buffer creation and management
 */

export interface BufferConfig {
  usage?: number;
  dynamic?: boolean;
}

export interface BufferData {
  vertices?: Float32Array;
  colors?: Float32Array;
  indices?: Uint32Array;
  normals?: Float32Array;
  texCoords?: Float32Array;
}

/**
 * Buffer manager for WebGL
 */
export class WebGLBuffers {
  private gl: WebGLRenderingContext;
  private buffers: Map<string, WebGLBuffer> = new Map();
  private bufferData: Map<string, BufferData> = new Map();
  private vertexArrays: Map<string, WebGLVertexArrayObject> = new Map();

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
  }

  /**
   * Create buffer
   */
  createBuffer(name: string, data: BufferData, config: BufferConfig = {}): WebGLBuffer {
    const usage = config.usage || this.gl.STATIC_DRAW;

    // Create vertex array object
    const vao = (this.gl as any).createVertexArray?.();
    if (vao) {
      (this.gl as any).bindVertexArray(vao);
      this.vertexArrays.set(name, vao);
    }

    // Create vertex buffer
    if (data.vertices) {
      const vbo = this.createBufferObject(data.vertices, usage);
      this.buffers.set(`${name}_vertices`, vbo);
    }

    // Create color buffer
    if (data.colors) {
      const cbo = this.createBufferObject(data.colors, usage);
      this.buffers.set(`${name}_colors`, cbo);
    }

    // Create index buffer
    if (data.indices) {
      const ibo = this.gl.createBuffer();
      if (!ibo) throw new Error('Failed to create index buffer');

      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, data.indices, usage);
      this.buffers.set(`${name}_indices`, ibo);
    }

    // Create normal buffer
    if (data.normals) {
      const nbo = this.createBufferObject(data.normals, usage);
      this.buffers.set(`${name}_normals`, nbo);
    }

    // Create texture coordinate buffer
    if (data.texCoords) {
      const tbo = this.createBufferObject(data.texCoords, usage);
      this.buffers.set(`${name}_texCoords`, tbo);
    }

    this.bufferData.set(name, data);

    const mainBuffer = this.buffers.get(`${name}_vertices`);
    if (!mainBuffer) throw new Error('Failed to create main buffer');

    return mainBuffer;
  }

  /**
   * Create buffer object
   */
  private createBufferObject(data: Float32Array | Uint32Array, usage: number): WebGLBuffer {
    const buffer = this.gl.createBuffer();
    if (!buffer) throw new Error('Failed to create buffer');

    const target =
      data instanceof Uint32Array ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER;
    this.gl.bindBuffer(target, buffer);
    this.gl.bufferData(target, data, usage);

    return buffer;
  }

  /**
   * Update buffer data
   */
  updateBuffer(name: string, data: Partial<BufferData>): void {
    const existingData = this.bufferData.get(name);
    if (!existingData) throw new Error(`Buffer not found: ${name}`);

    const updatedData = { ...existingData, ...data };

    if (data.vertices) {
      const buffer = this.buffers.get(`${name}_vertices`);
      if (buffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, data.vertices);
      }
    }

    if (data.colors) {
      const buffer = this.buffers.get(`${name}_colors`);
      if (buffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, data.colors);
      }
    }

    this.bufferData.set(name, updatedData);
  }

  /**
   * Bind buffer
   */
  bindBuffer(name: string): void {
    const vao = this.vertexArrays.get(name);
    if (vao) {
      (this.gl as any).bindVertexArray(vao);
    }

    const buffer = this.buffers.get(`${name}_vertices`);
    if (buffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    }
  }

  /**
   * Bind attribute
   */
  bindAttribute(
    program: WebGLProgram,
    name: string,
    attributeName: string,
    size: number,
    type: number = this.gl.FLOAT
  ): void {
    const buffer = this.buffers.get(`${name}_${attributeName}`);
    if (!buffer) return;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

    const location = this.gl.getAttribLocation(program, attributeName);
    if (location === -1) return;

    this.gl.vertexAttribPointer(location, size, type, false, 0, 0);
    this.gl.enableVertexAttribArray(location);
  }

  /**
   * Get buffer
   */
  getBuffer(name: string): WebGLBuffer | undefined {
    return this.buffers.get(name);
  }

  /**
   * Get buffer data
   */
  getBufferData(name: string): BufferData | undefined {
    return this.bufferData.get(name);
  }

  /**
   * Delete buffer
   */
  deleteBuffer(name: string): void {
    const vao = this.vertexArrays.get(name);
    if (vao) {
      (this.gl as any).deleteVertexArray(vao);
      this.vertexArrays.delete(name);
    }

    const keys = Array.from(this.buffers.keys()).filter((k) => k.startsWith(name));
    keys.forEach((key) => {
      const buffer = this.buffers.get(key);
      if (buffer) {
        this.gl.deleteBuffer(buffer);
        this.buffers.delete(key);
      }
    });

    this.bufferData.delete(name);
  }

  /**
   * Clear all buffers
   */
  clear(): void {
    this.buffers.forEach((buffer) => {
      this.gl.deleteBuffer(buffer);
    });
    this.vertexArrays.forEach((vao) => {
      (this.gl as any).deleteVertexArray(vao);
    });
    this.buffers.clear();
    this.vertexArrays.clear();
    this.bufferData.clear();
  }

  /**
   * Get memory usage
   */
  getMemoryUsage(): number {
    let total = 0;
    this.bufferData.forEach((data) => {
      if (data.vertices) total += data.vertices.byteLength;
      if (data.colors) total += data.colors.byteLength;
      if (data.indices) total += data.indices.byteLength;
      if (data.normals) total += data.normals.byteLength;
      if (data.texCoords) total += data.texCoords.byteLength;
    });
    return total;
  }
}

export default WebGLBuffers;
