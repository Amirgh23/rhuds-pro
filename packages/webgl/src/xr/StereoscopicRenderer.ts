import * as THREE from 'three';

export interface StereoscopicConfig {
  eyeSeparation?: number;
  focalLength?: number;
  convergence?: number;
}

export class StereoscopicRenderer {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private config: Required<StereoscopicConfig>;
  private leftCamera: THREE.PerspectiveCamera;
  private rightCamera: THREE.PerspectiveCamera;
  private leftRenderTarget: THREE.WebGLRenderTarget;
  private rightRenderTarget: THREE.WebGLRenderTarget;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    config: StereoscopicConfig = {}
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.config = {
      eyeSeparation: config.eyeSeparation || 0.064,
      focalLength: config.focalLength || 1,
      convergence: config.convergence || 1,
    };

    const width = renderer.domElement.clientWidth;
    const height = renderer.domElement.clientHeight;

    this.leftRenderTarget = new THREE.WebGLRenderTarget(width, height);
    this.rightRenderTarget = new THREE.WebGLRenderTarget(width, height);

    this.leftCamera = this.createOffsetCamera(-this.config.eyeSeparation / 2);
    this.rightCamera = this.createOffsetCamera(this.config.eyeSeparation / 2);
  }

  private createOffsetCamera(offset: number): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
      this.camera.fov,
      this.camera.aspect,
      this.camera.near,
      this.camera.far
    );
    camera.position.copy(this.camera.position);
    camera.position.x += offset;
    camera.quaternion.copy(this.camera.quaternion);
    return camera;
  }

  render(): void {
    const width = this.renderer.domElement.clientWidth;
    const height = this.renderer.domElement.clientHeight;

    this.renderer.setRenderTarget(this.leftRenderTarget);
    this.renderer.render(this.scene, this.leftCamera);

    this.renderer.setRenderTarget(this.rightRenderTarget);
    this.renderer.render(this.scene, this.rightCamera);

    this.renderer.setRenderTarget(null);

    this.renderSideBySide(width, height);
  }

  private renderSideBySide(width: number, height: number): void {
    const ctx = this.renderer.getContext();
    if (!ctx) return;

    const halfWidth = width / 2;

    this.renderer.setViewport(0, 0, halfWidth, height);
    this.renderer.render(this.scene, this.leftCamera);

    this.renderer.setViewport(halfWidth, 0, halfWidth, height);
    this.renderer.render(this.scene, this.rightCamera);

    this.renderer.setViewport(0, 0, width, height);
  }

  updateCameraOffset(eyeSeparation: number): void {
    this.config.eyeSeparation = eyeSeparation;
    this.leftCamera.position.x = this.camera.position.x - eyeSeparation / 2;
    this.rightCamera.position.x = this.camera.position.x + eyeSeparation / 2;
  }

  dispose(): void {
    this.leftRenderTarget.dispose();
    this.rightRenderTarget.dispose();
    this.leftCamera = null as any;
    this.rightCamera = null as any;
  }
}
