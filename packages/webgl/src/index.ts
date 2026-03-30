/**
 * @rhuds/webgl
 *
 * WebGL and 3D components with Three.js integration
 */

export { Scene3D } from './Scene3D';
export { Mesh3D } from './Mesh3D';
export { Light } from './Light';
export { ShaderManager, commonShaders } from './ShaderManager';
export { RHUDSWebGLRenderer } from './RHUDSWebGLRenderer';
export { OrbitControls } from './controls/OrbitControls';
export { ModelLoader } from './loaders/ModelLoader';
export { EffectComposer } from './postprocessing/EffectComposer';

// XR/AR/VR
export { WebXRManager } from './xr/WebXRManager';
export { SpatialUIPanel, SpatialButton } from './xr/SpatialUIPanel';
export { StereoscopicRenderer } from './xr/StereoscopicRenderer';
export { FallbackRenderer } from './xr/FallbackRenderer';

// Shader effects
export {
  blurShader,
  bloomShader,
  chromaticAberrationShader,
  hologramShader,
  distortionShader,
  vignetteShader,
} from './shaders/effects';

export type {
  Scene3DProps,
  Mesh3DProps,
  LightConfig,
  CameraConfig,
  MaterialConfig,
  ShaderConfig,
} from './types';

export type { OrbitControlsConfig } from './controls/OrbitControls';
export type { LoaderOptions } from './loaders/ModelLoader';
export type { WebGLRendererConfig } from './RHUDSWebGLRenderer';
export type { EffectPass } from './postprocessing/EffectComposer';

// XR types
export type { WebXRSessionConfig, VRControllerState, HandTrackingData } from './xr/WebXRManager';
export type { SpatialUIPanelConfig } from './xr/SpatialUIPanel';
export type { StereoscopicConfig } from './xr/StereoscopicRenderer';
export type { FallbackConfig } from './xr/FallbackRenderer';

export const version = '0.1.0';
