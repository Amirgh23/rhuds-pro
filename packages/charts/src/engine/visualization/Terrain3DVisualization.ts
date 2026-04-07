/**
 * 3D Terrain Visualization
 * Visualize geographic and terrain data in 3D
 *
 * تصور سه بعدی زمین
 * تصور داده های جغرافیایی و زمین در سه بعد
 */

import { EventEmitter } from 'events';

export interface TerrainData {
  id: string;
  width: number;
  height: number;
  heightMap: number[][];
  textureMap?: Uint8Array;
  metadata?: Record<string, any>;
}

export interface TerrainMesh {
  vertices: Float32Array;
  indices: Uint32Array;
  normals: Float32Array;
  texCoords: Float32Array;
}

export interface LightingConfig {
  ambientLight: { r: number; g: number; b: number };
  directionalLight: {
    direction: { x: number; y: number; z: number };
    color: { r: number; g: number; b: number };
  };
  specularLight: { r: number; g: number; b: number };
}

export interface CameraConfig {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  fov: number;
  near: number;
  far: number;
}

export class Terrain3DVisualization extends EventEmitter {
  private terrains: Map<string, TerrainData> = new Map();
  private meshes: Map<string, TerrainMesh> = new Map();
  private lighting: LightingConfig;
  private camera: CameraConfig;
  private renderScale: number = 1;

  constructor() {
    super();
    this.lighting = {
      ambientLight: { r: 0.5, g: 0.5, b: 0.5 },
      directionalLight: {
        direction: { x: 1, y: 1, z: 1 },
        color: { r: 1, g: 1, b: 1 },
      },
      specularLight: { r: 0.5, g: 0.5, b: 0.5 },
    };

    this.camera = {
      position: { x: 0, y: 50, z: 50 },
      target: { x: 0, y: 0, z: 0 },
      fov: 45,
      near: 0.1,
      far: 1000,
    };
  }

  /**
   * Load terrain data
   */
  loadTerrain(terrainData: TerrainData): void {
    this.terrains.set(terrainData.id, terrainData);
    this.generateMesh(terrainData.id);
    this.emit('terrain:loaded', { id: terrainData.id });
  }

  /**
   * Generate mesh from height map
   */
  private generateMesh(terrainId: string): void {
    const terrain = this.terrains.get(terrainId);
    if (!terrain) return;

    const { width, height, heightMap } = terrain;
    const vertexCount = width * height;
    const vertices = new Float32Array(vertexCount * 3);
    const normals = new Float32Array(vertexCount * 3);
    const texCoords = new Float32Array(vertexCount * 2);

    // Generate vertices
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        const h = heightMap[y][x];

        vertices[index * 3] = x;
        vertices[index * 3 + 1] = h;
        vertices[index * 3 + 2] = y;

        texCoords[index * 2] = x / width;
        texCoords[index * 2 + 1] = y / height;
      }
    }

    // Calculate normals
    this.calculateNormals(vertices, normals, width, height);

    // Generate indices
    const indexCount = (width - 1) * (height - 1) * 6;
    const indices = new Uint32Array(indexCount);
    let indexIdx = 0;

    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
        const a = y * width + x;
        const b = a + 1;
        const c = a + width;
        const d = c + 1;

        indices[indexIdx++] = a;
        indices[indexIdx++] = c;
        indices[indexIdx++] = b;

        indices[indexIdx++] = b;
        indices[indexIdx++] = c;
        indices[indexIdx++] = d;
      }
    }

    this.meshes.set(terrainId, {
      vertices,
      indices,
      normals,
      texCoords,
    });

    this.emit('mesh:generated', { id: terrainId, vertexCount });
  }

  /**
   * Calculate normals
   */
  private calculateNormals(
    vertices: Float32Array,
    normals: Float32Array,
    width: number,
    height: number
  ): void {
    for (let i = 0; i < normals.length; i++) {
      normals[i] = 0;
    }

    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
        const a = y * width + x;
        const b = a + 1;
        const c = a + width;

        const v1 = [
          vertices[b * 3] - vertices[a * 3],
          vertices[b * 3 + 1] - vertices[a * 3 + 1],
          vertices[b * 3 + 2] - vertices[a * 3 + 2],
        ];

        const v2 = [
          vertices[c * 3] - vertices[a * 3],
          vertices[c * 3 + 1] - vertices[a * 3 + 1],
          vertices[c * 3 + 2] - vertices[a * 3 + 2],
        ];

        const normal = this.crossProduct(v1, v2);
        this.normalize(normal);

        for (const idx of [a, b, c]) {
          normals[idx * 3] += normal[0];
          normals[idx * 3 + 1] += normal[1];
          normals[idx * 3 + 2] += normal[2];
        }
      }
    }

    for (let i = 0; i < normals.length; i += 3) {
      const n = [normals[i], normals[i + 1], normals[i + 2]];
      this.normalize(n);
      normals[i] = n[0];
      normals[i + 1] = n[1];
      normals[i + 2] = n[2];
    }
  }

  /**
   * Cross product
   */
  private crossProduct(a: number[], b: number[]): number[] {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }

  /**
   * Normalize vector
   */
  private normalize(v: number[]): void {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (len > 0) {
      v[0] /= len;
      v[1] /= len;
      v[2] /= len;
    }
  }

  /**
   * Set lighting
   */
  setLighting(config: Partial<LightingConfig>): void {
    this.lighting = { ...this.lighting, ...config };
    this.emit('lighting:updated', this.lighting);
  }

  /**
   * Set camera
   */
  setCamera(config: Partial<CameraConfig>): void {
    this.camera = { ...this.camera, ...config };
    this.emit('camera:updated', this.camera);
  }

  /**
   * Get mesh
   */
  getMesh(terrainId: string): TerrainMesh | null {
    return this.meshes.get(terrainId) || null;
  }

  /**
   * Get terrain
   */
  getTerrain(terrainId: string): TerrainData | null {
    return this.terrains.get(terrainId) || null;
  }

  /**
   * Get lighting
   */
  getLighting(): LightingConfig {
    return { ...this.lighting };
  }

  /**
   * Get camera
   */
  getCamera(): CameraConfig {
    return { ...this.camera };
  }

  /**
   * Set render scale
   */
  setRenderScale(scale: number): void {
    this.renderScale = Math.max(0.1, Math.min(2, scale));
    this.emit('render-scale:changed', { scale: this.renderScale });
  }

  /**
   * Remove terrain
   */
  removeTerrain(terrainId: string): void {
    this.terrains.delete(terrainId);
    this.meshes.delete(terrainId);
    this.emit('terrain:removed', { id: terrainId });
  }
}
