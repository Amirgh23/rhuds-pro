/**
 * WebGL Shader System
 * Advanced shader compilation and management
 */

export interface ShaderSource {
  vertex: string;
  fragment: string;
}

export interface ShaderUniforms {
  [key: string]: any;
}

/**
 * Shader compiler and manager
 */
export class WebGLShaders {
  private gl: WebGLRenderingContext;
  private programs: Map<string, WebGLProgram> = new Map();
  private shaders: Map<string, WebGLShader> = new Map();

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
  }

  /**
   * Create shader program
   */
  createProgram(name: string, source: ShaderSource): WebGLProgram {
    const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, source.vertex);
    const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, source.fragment);

    if (!vertexShader || !fragmentShader) {
      throw new Error(`Failed to compile shaders for program: ${name}`);
    }

    const program = this.gl.createProgram();
    if (!program) {
      throw new Error(`Failed to create program: ${name}`);
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const error = this.gl.getProgramInfoLog(program);
      throw new Error(`Failed to link program ${name}: ${error}`);
    }

    this.programs.set(name, program);
    return program;
  }

  /**
   * Compile shader
   */
  private compileShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const error = this.gl.getShaderInfoLog(shader);
      console.error(`Shader compilation error: ${error}`);
      return null;
    }

    return shader;
  }

  /**
   * Get program
   */
  getProgram(name: string): WebGLProgram | undefined {
    return this.programs.get(name);
  }

  /**
   * Set uniforms
   */
  setUniforms(program: WebGLProgram, uniforms: ShaderUniforms): void {
    this.gl.useProgram(program);

    for (const [name, value] of Object.entries(uniforms)) {
      const location = this.gl.getUniformLocation(program, name);
      if (!location) continue;

      if (typeof value === 'number') {
        this.gl.uniform1f(location, value);
      } else if (Array.isArray(value)) {
        if (value.length === 2) {
          this.gl.uniform2fv(location, value);
        } else if (value.length === 3) {
          this.gl.uniform3fv(location, value);
        } else if (value.length === 4) {
          this.gl.uniform4fv(location, value);
        } else if (value.length === 16) {
          this.gl.uniformMatrix4fv(location, false, value);
        }
      }
    }
  }

  /**
   * Delete program
   */
  deleteProgram(name: string): void {
    const program = this.programs.get(name);
    if (program) {
      this.gl.deleteProgram(program);
      this.programs.delete(name);
    }
  }

  /**
   * Clear all programs
   */
  clear(): void {
    this.programs.forEach((program) => {
      this.gl.deleteProgram(program);
    });
    this.programs.clear();
    this.shaders.clear();
  }
}

/**
 * Built-in shader sources
 */
export const BUILTIN_SHADERS = {
  // Basic line chart shader
  lineChart: {
    vertex: `
      attribute vec2 position;
      attribute vec4 color;
      uniform mat4 projection;
      uniform mat4 view;
      
      varying vec4 vColor;
      
      void main() {
        gl_Position = projection * view * vec4(position, 0.0, 1.0);
        vColor = color;
      }
    `,
    fragment: `
      precision mediump float;
      varying vec4 vColor;
      
      void main() {
        gl_FragColor = vColor;
      }
    `,
  },

  // Bar chart shader
  barChart: {
    vertex: `
      attribute vec2 position;
      attribute vec4 color;
      attribute float height;
      uniform mat4 projection;
      uniform mat4 view;
      
      varying vec4 vColor;
      
      void main() {
        vec2 pos = position;
        pos.y *= height;
        gl_Position = projection * view * vec4(pos, 0.0, 1.0);
        vColor = color;
      }
    `,
    fragment: `
      precision mediump float;
      varying vec4 vColor;
      
      void main() {
        gl_FragColor = vColor;
      }
    `,
  },

  // Scatter plot shader
  scatterPlot: {
    vertex: `
      attribute vec2 position;
      attribute vec4 color;
      attribute float size;
      uniform mat4 projection;
      uniform mat4 view;
      
      varying vec4 vColor;
      
      void main() {
        gl_Position = projection * view * vec4(position, 0.0, 1.0);
        gl_PointSize = size;
        vColor = color;
      }
    `,
    fragment: `
      precision mediump float;
      varying vec4 vColor;
      
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        gl_FragColor = vColor;
      }
    `,
  },

  // Heatmap shader
  heatmap: {
    vertex: `
      attribute vec2 position;
      attribute float value;
      uniform mat4 projection;
      uniform mat4 view;
      
      varying float vValue;
      
      void main() {
        gl_Position = projection * view * vec4(position, 0.0, 1.0);
        vValue = value;
      }
    `,
    fragment: `
      precision mediump float;
      varying float vValue;
      
      vec3 heatmapColor(float value) {
        if (value < 0.25) {
          return mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 1.0), value * 4.0);
        } else if (value < 0.5) {
          return mix(vec3(0.0, 1.0, 1.0), vec3(0.0, 1.0, 0.0), (value - 0.25) * 4.0);
        } else if (value < 0.75) {
          return mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), (value - 0.5) * 4.0);
        } else {
          return mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), (value - 0.75) * 4.0);
        }
      }
      
      void main() {
        gl_FragColor = vec4(heatmapColor(vValue), 1.0);
      }
    `,
  },

  // 3D shader
  shader3D: {
    vertex: `
      attribute vec3 position;
      attribute vec4 color;
      attribute vec3 normal;
      
      uniform mat4 projection;
      uniform mat4 view;
      uniform mat4 model;
      uniform vec3 lightDir;
      
      varying vec4 vColor;
      varying float vLight;
      
      void main() {
        gl_Position = projection * view * model * vec4(position, 1.0);
        
        vec3 worldNormal = normalize(mat3(model) * normal);
        vLight = max(dot(worldNormal, lightDir), 0.3);
        vColor = color;
      }
    `,
    fragment: `
      precision mediump float;
      varying vec4 vColor;
      varying float vLight;
      
      void main() {
        gl_FragColor = vec4(vColor.rgb * vLight, vColor.a);
      }
    `,
  },

  // Gradient shader
  gradient: {
    vertex: `
      attribute vec2 position;
      uniform mat4 projection;
      
      varying vec2 vPosition;
      
      void main() {
        gl_Position = projection * vec4(position, 0.0, 1.0);
        vPosition = position;
      }
    `,
    fragment: `
      precision mediump float;
      varying vec2 vPosition;
      
      void main() {
        vec3 color = mix(
          vec3(0.0, 0.5, 1.0),
          vec3(1.0, 0.0, 0.5),
          (vPosition.x + 1.0) * 0.5
        );
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  },
};

export default WebGLShaders;
