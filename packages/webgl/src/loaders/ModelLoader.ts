import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export interface LoaderOptions {
  onProgress?: (progress: ProgressEvent) => void;
  onError?: (error: ErrorEvent) => void;
}

export class ModelLoader {
  private gltfLoader = new GLTFLoader();
  private objLoader = new OBJLoader();

  async loadGLTF(url: string, options?: LoaderOptions): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          resolve(gltf.scene);
        },
        options?.onProgress,
        (error) => {
          reject(error);
          options?.onError?.(error as any);
        }
      );
    });
  }

  async loadOBJ(url: string, options?: LoaderOptions): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.objLoader.load(
        url,
        (object) => {
          resolve(object);
        },
        options?.onProgress,
        (error) => {
          reject(error);
          options?.onError?.(error as any);
        }
      );
    });
  }

  async loadModel(url: string, options?: LoaderOptions): Promise<THREE.Group> {
    const extension = url.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'gltf':
      case 'glb':
        return this.loadGLTF(url, options);
      case 'obj':
        return this.loadOBJ(url, options);
      default:
        throw new Error(`Unsupported model format: ${extension}`);
    }
  }

  dispose(): void {
    // Loaders don't need explicit disposal in Three.js
  }
}
