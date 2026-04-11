/**
 * 3D Terrain Visualization Engine
 * Renders geographic and terrain data in 3D with height mapping, textures, and lighting
 */

export interface TerrainConfig {
  width: number;
  height: number;
  scale: number;
  heightScale: number;
  wireframe?: boolean;
  lighting?: boolean;
  textureUrl?: string;
}

export interface TerrainData {
  elevations: number[][];
  metadata?: Record<string, unknown>;
  colorMap?: Record<number, string>;
}

export interface TerrainMesh {
  vertices: Float32Array;
  indices: Uint32Array;
  normals: Float32Array;
  texCoords?: Float32Array;
}

export interface LightingConfig {
  ambientIntensity: number;
  directionalIntensity: number;
  direction: [number, number, number];
  shadowMap?: boolean;
}

export interface CameraControl {
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
  rotation: [number, number];
}

/**
 * Terrain3DVisualization - Advanced 3D terrain rendering
 */
export class Terrain3DVisualization {
  private config: TerrainConfig;
  private mesh: TerrainMesh | null = null;
  private lighting: LightingConfig;
  private camera: CameraControl;
  private textureCache: Map<string, unknown> = new Map();

  constructor(config: TerrainConfig) {
    this.config = {
      wireframe: false,
      lighting: true,
      ...config,
    };
    this.lighting = {
      ambientIntensity: 0.5,
      directionalIntensity: 0.8,
      direction: [1, 1, 1],
      shadowMap: false,
    };
    this.camera = {
      position: [0, 50, 50],
      target: [0, 0, 0],
      zoom: 1,
      rotation: [0, 0],
    };
  }

  /**
   * Generate mesh from elevation data
   */
  generateMesh(data: TerrainData): TerrainMesh {
    const { elevations } = data;
    const rows = elevations.length;
    const cols = elevations[0]?.length || 0;

    const vertices = new Float32Array(rows * cols * 3);
    const indices = new Uint32Array((rows - 1) * (cols - 1) * 6);
    const normals = new Float32Array(rows * cols * 3);

    // Generate vertices
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const idx = (i * cols + j) * 3;
        vertices[idx] = (j - cols / 2) * this.config.scale;
        vertices[idx + 1] = elevations[i][j] * this.config.heightScale;
        vertices[idx + 2] = (i - rows / 2) * this.config.scale;
      }
    }

    // Generate indices
    let indexCount = 0;
    for (let i = 0; i < rows - 1; i++) {
      for (let j = 0; j < cols - 1; j++) {
        const a = i * cols + j;
        const b = a + 1;
        const c = a + cols;
        const d = c + 1;

        indices[indexCount++] = a;
        indices[indexCount++] = c;
        indices[indexCount++] = b;
        indices[indexCount++] = b;
        indices[indexCount++] = c;
        indices[indexCount++] = d;
      }
    }

    // Calculate normals
    this.calculateNormals(vertices, indices, normals);

    this.mesh = { vertices, indices, normals };
    return this.mesh;
  }

  /**
   * Calculate vertex normals
   */
  private calculateNormals(
    vertices: Float32Array,
    indices: Uint32Array,
    normals: Float32Array
  ): void {
    // Initialize normals to zero
    normals.fill(0);

    // Accumulate face normals
    for (let i = 0; i < indices.length; i += 3) {
      const i0 = indices[i] * 3;
      const i1 = indices[i + 1] * 3;
      const i2 = indices[i + 2] * 3;

      const v0 = [vertices[i0], vertices[i0 + 1], vertices[i0 + 2]];
      const v1 = [vertices[i1], vertices[i1 + 1], vertices[i1 + 2]];
      const v2 = [vertices[i2], vertices[i2 + 1], vertices[i2 + 2]];

      const e1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
      const e2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];

      const normal = this.crossProduct(e1, e2);

      for (let j = 0; j < 3; j++) {
        normals[indices[i + j] * 3] += normal[0];
        normals[indices[i + j] * 3 + 1] += normal[1];
        normals[indices[i + j] * 3 + 2] += normal[2];
      }
    }

    // Normalize
    for (let i = 0; i < normals.length; i += 3) {
      const len = Math.sqrt(
        normals[i] * normals[i] + normals[i + 1] * normals[i + 1] + normals[i + 2] * normals[i + 2]
      );
      if (len > 0) {
        normals[i] /= len;
        normals[i + 1] /= len;
        normals[i + 2] /= len;
      }
    }
  }

  /**
   * Cross product of two vectors
   */
  private crossProduct(a: number[], b: number[]): number[] {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }

  /**
   * Apply height mapping with color
   */
  applyHeightMapping(data: TerrainData): Record<number, string> {
    const colorMap = data.colorMap || this.generateDefaultColorMap();
    return colorMap;
  }

  /**
   * Generate default color map based on elevation
   */
  private generateDefaultColorMap(): Record<number, string> {
    return {
      0: '#1a472a', // Deep water
      0.2: '#2d5a3d', // Shallow water
      0.4: '#8b7355', // Sand
      0.6: '#228b22', // Forest
      0.8: '#696969', // Mountain
      1.0: '#ffffff', // Snow
    };
  }

  /**
   * Configure lighting
   */
  setLighting(config: Partial<LightingConfig>): void {
    this.lighting = { ...this.lighting, ...config };
  }

  /**
   * Update camera position
   */
  setCameraPosition(position: [number, number, number]): void {
    this.camera.position = position;
  }

  /**
   * Update camera target
   */
  setCameraTarget(target: [number, number, number]): void {
    this.camera.target = target;
  }

  /**
   * Rotate camera
   */
  rotateCamera(deltaX: number, deltaY: number): void {
    this.camera.rotation[0] += deltaX;
    this.camera.rotation[1] += deltaY;
  }

  /**
   * Zoom camera
   */
  zoomCamera(factor: number): void {
    this.camera.zoom *= factor;
    this.camera.zoom = Math.max(0.1, Math.min(10, this.camera.zoom));
  }

  /**
   * Get current mesh
   */
  getMesh(): TerrainMesh | null {
    return this.mesh;
  }

  /**
   * Get camera state
   */
  getCamera(): CameraControl {
    return { ...this.camera };
  }

  /**
   * Get lighting configuration
   */
  getLighting(): LightingConfig {
    return { ...this.lighting };
  }

  /**
   * Load texture
   */
  async loadTexture(url: string): Promise<unknown> {
    if (this.textureCache.has(url)) {
      return this.textureCache.get(url);
    }

    try {
      const response = await fetch(url);
      const data = await response.blob();
      this.textureCache.set(url, data);
      return data;
    } catch (error) {
      console.error(`Failed to load texture: ${url}`, error);
      return null;
    }
  }

  /**
   * Clear texture cache
   */
  clearTextureCache(): void {
    this.textureCache.clear();
  }

  /**
   * Get mesh statistics
   */
  getStatistics(): Record<string, number> {
    if (!this.mesh) {
      return { vertices: 0, indices: 0, triangles: 0 };
    }

    return {
      vertices: this.mesh.vertices.length / 3,
      indices: this.mesh.indices.length,
      triangles: this.mesh.indices.length / 3,
    };
  }
}
