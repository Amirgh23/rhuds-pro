import * as THREE from 'three';
import { OrbitControls, OrbitControlsConfig } from './controls/OrbitControls';

export interface WebGLRendererConfig {
  width?: number;
  height?: number;
  antialias?: boolean;
  shadowMap?: boolean;
  shadowMapType?: THREE.ShadowMapType;
  pixelRatio?: number;
}

export class RHUDSWebGLRenderer {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private controls?: OrbitControls;
  private animationId?: number;
  private renderCallback?: (scene: THREE.Scene, camera: THREE.Camera, deltaTime: number) => void;
  private lastTime = 0;

  constructor(container: HTMLElement, config: WebGLRendererConfig = {}) {
    const width = config.width || container.clientWidth || 800;
    const height = config.height || container.clientHeight || 600;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: config.antialias ?? true,
      alpha: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(config.pixelRatio || window.devicePixelRatio);
    this.renderer.shadowMap.enabled = config.shadowMap ?? true;
    this.renderer.shadowMap.type = config.shadowMapType ?? THREE.PCFShadowMap;
    container.appendChild(this.renderer.domElement);

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize(container));
  }

  private onWindowResize(container: HTMLElement): void {
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    (this.camera as THREE.PerspectiveCamera).aspect = width / height;
    (this.camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  getCamera(): THREE.Camera {
    return this.camera;
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  /**
   * Setup orbit controls with optional configuration
   * @param config - OrbitControls configuration options
   * @returns The configured OrbitControls instance
   */
  setupOrbitControls(config?: OrbitControlsConfig): OrbitControls {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement, config);
    return this.controls;
  }

  setRenderCallback(
    callback: (scene: THREE.Scene, camera: THREE.Camera, deltaTime: number) => void
  ): void {
    this.renderCallback = callback;
  }

  start(): void {
    this.lastTime = performance.now();
    this.animate();
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    const now = performance.now();
    const deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;

    // Update controls
    if (this.controls) {
      this.controls.update();
    }

    // Call render callback
    if (this.renderCallback) {
      this.renderCallback(this.scene, this.camera, deltaTime);
    }

    // Render scene
    this.renderer.render(this.scene, this.camera);
  };

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  dispose(): void {
    this.stop();
    if (this.controls) {
      this.controls.dispose();
    }
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
