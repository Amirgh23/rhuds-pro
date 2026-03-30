import * as THREE from 'three';

export interface FallbackConfig {
  enableMouse?: boolean;
  enableTouch?: boolean;
  enableKeyboard?: boolean;
}

export class FallbackRenderer {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private config: Required<FallbackConfig>;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private touchX: number = 0;
  private touchY: number = 0;
  private keys: Set<string> = new Set();

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    config: FallbackConfig = {}
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.config = {
      enableMouse: config.enableMouse !== false,
      enableTouch: config.enableTouch !== false,
      enableKeyboard: config.enableKeyboard !== false,
    };

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const canvas = this.renderer.domElement;

    if (this.config.enableMouse) {
      canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
      canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
      canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    }

    if (this.config.enableTouch) {
      canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
      canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
      canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
    }

    if (this.config.enableKeyboard) {
      document.addEventListener('keydown', (e) => this.onKeyDown(e));
      document.addEventListener('keyup', (e) => this.onKeyUp(e));
    }
  }

  private onMouseMove(event: MouseEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private onMouseDown(event: MouseEvent): void {
    // Handle mouse down
  }

  private onMouseUp(event: MouseEvent): void {
    // Handle mouse up
  }

  private onTouchMove(event: TouchEvent): void {
    if (event.touches.length > 0) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      const touch = event.touches[0];
      this.touchX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      this.touchY = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
    }
  }

  private onTouchStart(event: TouchEvent): void {
    // Handle touch start
  }

  private onTouchEnd(event: TouchEvent): void {
    // Handle touch end
  }

  private onKeyDown(event: KeyboardEvent): void {
    this.keys.add(event.key.toLowerCase());
  }

  private onKeyUp(event: KeyboardEvent): void {
    this.keys.delete(event.key.toLowerCase());
  }

  updateCamera(): void {
    const moveSpeed = 0.1;
    const rotateSpeed = 0.01;

    if (this.keys.has('w')) {
      this.camera.position.z -= moveSpeed;
    }
    if (this.keys.has('s')) {
      this.camera.position.z += moveSpeed;
    }
    if (this.keys.has('a')) {
      this.camera.position.x -= moveSpeed;
    }
    if (this.keys.has('d')) {
      this.camera.position.x += moveSpeed;
    }

    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y -= this.mouseX * rotateSpeed;
    this.camera.rotation.x -= this.mouseY * rotateSpeed;

    this.mouseX *= 0.9;
    this.mouseY *= 0.9;
  }

  render(): void {
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
  }

  getMousePosition(): { x: number; y: number } {
    return { x: this.mouseX, y: this.mouseY };
  }

  getTouchPosition(): { x: number; y: number } {
    return { x: this.touchX, y: this.touchY };
  }

  isKeyPressed(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  dispose(): void {
    this.keys.clear();
  }
}
