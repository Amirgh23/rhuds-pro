import * as THREE from 'three';

export interface Scene3DProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  fog?: {
    color: string;
    near: number;
    far: number;
  };
  width?: number;
  height?: number;
  camera?: CameraConfig;
  onRender?: (scene: THREE.Scene, camera: THREE.Camera) => void;
}

export interface CameraConfig {
  type?: 'perspective' | 'orthographic';
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
  position?: [number, number, number];
  lookAt?: [number, number, number];
}

export interface Mesh3DProps {
  geometry: 'box' | 'sphere' | 'cylinder' | 'plane' | 'torus';
  material?: MaterialConfig;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export interface MaterialConfig {
  type?: 'basic' | 'standard' | 'phong' | 'lambert';
  color?: string;
  metalness?: number;
  roughness?: number;
  transparent?: boolean;
  opacity?: number;
  wireframe?: boolean;
}

export interface LightConfig {
  type: 'ambient' | 'directional' | 'point' | 'spot';
  color?: string;
  intensity?: number;
  position?: [number, number, number];
  castShadow?: boolean;
}

export interface ShaderConfig {
  name: string;
  vertexShader: string;
  fragmentShader: string;
  uniforms?: Record<string, any>;
}
