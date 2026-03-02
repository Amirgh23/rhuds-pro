/**
 * @rhuds/webgl
 * 
 * WebGL and 3D components with Three.js integration
 */

export { Scene3D } from './Scene3D';
export { Mesh3D } from './Mesh3D';
export { Light } from './Light';
export { ShaderManager, commonShaders } from './ShaderManager';

export type {
  Scene3DProps,
  Mesh3DProps,
  LightConfig,
  CameraConfig,
  MaterialConfig,
  ShaderConfig,
} from './types';

export const version = '0.1.0';
