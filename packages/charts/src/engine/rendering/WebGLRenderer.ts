/**
 * WebGL Rendering Engine
 * High-performance rendering for large datasets
 */

export interface WebGLConfig {
  canvas: HTMLCanvasElement;
  maxDataPoints?: number;
  enableAntialiasing?: boolean;
  preserveDrawingBuffer?: boolean;
}

export interface RenderContext {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  buffers: Map<string, WebGLBuffer>;
  textures: Map<string, WebGLTexture>;
}

/**
 * WebGL Renderer for high-performance chart rendering
 */
export class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private buffers: Map<string, WebGLBuffer> = new Map();
  private textures: Map<string, WebGLTexture> = new Map();
  private maxDataPoints: number = 1000000;
  private frameId: number | null = null;

  constructor(config: WebGLConfig) {
    this.canvas = config.canvas;
    this.maxDataPoints = config.maxDataPoints || 1000000;
    this.initializeWebGL(config);
  }

  /**
   * Initialize WebGL context
   */
  private initializeWebGL(config: WebGLConfig): void {
    const gl = this.canvas.getContext('webgl2', {
      antialias: config.enableAntialiasing !== false,
      preserveDrawingBuffer: config.preserveDrawingBuffer || false,
      alpha: true,
      depth: true,
    });

    if (!gl) {
      throw new Error('WebGL2 not supported');
    }

    this.gl = gl;
    this.setupProgram();
  }

  /**
   * Setup shader program
   */
  private setupProgram(): void {
    if (!this.gl) return;

    const vertexShader = this.createShader(
      this.gl.VERTEX_SHADER,
      `
        attribute vec2 position;
        attribute vec4 color;
        uniform mat4 projection;
        
        varying vec4 vColor;
        
        void main() {
          gl_Position = projection * vec4(position, 0.0, 1.0);
          vColor = color;
        }
      `
    );

    const fragmentShader = this.createShader(
      this.gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        varying vec4 vColor;
        
        void main() {
          gl_FragColor = vColor;
        }
      `
    );

    if (!vertexShader || !fragmentShader) {
      throw new Error('Failed to create shaders');
    }

    this.program = this.gl.createProgram();
    if (!this.program) {
      throw new Error('Failed to create program');
    }

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      throw new Error('Failed to link program');
    }

    this.gl.useProgram(this.program);
  }

  /**
   * Create shader
   */
  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;

    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  /**
   * Render data
   */
  public render(data: Float32Array, colors: Float32Array): void {
    if (!this.gl || !this.program) return;

    // Create buffers
    const positionBuffer = this.createBuffer(data);
    const colorBuffer = this.createBuffer(colors);

    if (!positionBuffer || !colorBuffer) return;

    // Set up attributes
    const positionLocation = this.gl.getAttribLocation(this.program, 'position');
    const colorLocation = this.gl.getAttribLocation(this.program, 'color');

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(positionLocation);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.gl.vertexAttribPointer(colorLocation, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(colorLocation);

    // Clear and draw
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.drawArrays(this.gl.LINE_STRIP, 0, data.length / 2);
  }

  /**
   * Create buffer
   */
  private createBuffer(data: Float32Array): WebGLBuffer | null {
    if (!this.gl) return null;

    const buffer = this.gl.createBuffer();
    if (!buffer) return null;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

    return buffer;
  }

  /**
   * Resize canvas
   */
  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;

    if (this.gl) {
      this.gl.viewport(0, 0, width, height);
    }
  }

  /**
   * Get performance metrics
   */
  public getMetrics(): any {
    if (!this.gl) return null;

    const ext = this.gl.getExtension('EXT_disjoint_timer_query_webgl2');
    if (!ext) return null;

    return {
      maxTextureSize: this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE),
      maxVertexAttribs: this.gl.getParameter(this.gl.MAX_VERTEX_ATTRIBS),
      maxVaryingVectors: this.gl.getParameter(this.gl.MAX_VARYING_VECTORS),
    };
  }

  /**
   * Destroy renderer
   */
  public destroy(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }

    this.buffers.forEach((buffer) => {
      if (this.gl) {
        this.gl.deleteBuffer(buffer);
      }
    });

    this.textures.forEach((texture) => {
      if (this.gl) {
        this.gl.deleteTexture(texture);
      }
    });

    if (this.program && this.gl) {
      this.gl.deleteProgram(this.program);
    }

    this.buffers.clear();
    this.textures.clear();
  }
}

export default WebGLRenderer;
