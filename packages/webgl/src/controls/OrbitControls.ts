import * as THREE from 'three';

export interface OrbitControlsConfig {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableDamping?: boolean;
  dampingFactor?: number;
  enableZoom?: boolean;
  zoomSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
}

export class OrbitControls {
  private camera: THREE.Camera;
  private domElement: HTMLElement;
  private config: Required<OrbitControlsConfig>;
  private spherical = new THREE.Spherical();
  private sphericalDelta = new THREE.Spherical(0, 0, 0);
  private scale = 1;
  private target = new THREE.Vector3();
  private targetDelta = new THREE.Vector3();
  private isRotating = false;
  private previousPointer = new THREE.Vector2();

  constructor(camera: THREE.Camera, domElement: HTMLElement, config: OrbitControlsConfig = {}) {
    this.camera = camera;
    this.domElement = domElement;
    this.config = {
      autoRotate: config.autoRotate ?? false,
      autoRotateSpeed: config.autoRotateSpeed ?? 2,
      enableDamping: config.enableDamping ?? true,
      dampingFactor: config.dampingFactor ?? 0.05,
      enableZoom: config.enableZoom ?? true,
      zoomSpeed: config.zoomSpeed ?? 1,
      minDistance: config.minDistance ?? 0,
      maxDistance: config.maxDistance ?? Infinity,
      minPolarAngle: config.minPolarAngle ?? 0,
      maxPolarAngle: config.maxPolarAngle ?? Math.PI,
    };

    this.setupEventListeners();
    this.updateSpherical();
  }

  private setupEventListeners(): void {
    this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this), false);
  }

  private onMouseDown(event: MouseEvent): void {
    this.isRotating = true;
    this.previousPointer.set(event.clientX, event.clientY);
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isRotating) return;

    const deltaX = event.clientX - this.previousPointer.x;
    const deltaY = event.clientY - this.previousPointer.y;

    this.sphericalDelta.theta -= (deltaX * Math.PI) / this.domElement.clientWidth;
    this.sphericalDelta.phi -= (deltaY * Math.PI) / this.domElement.clientHeight;

    this.previousPointer.set(event.clientX, event.clientY);
  }

  private onMouseUp(): void {
    this.isRotating = false;
  }

  private onMouseWheel(event: WheelEvent): void {
    if (!this.config.enableZoom) return;

    event.preventDefault();
    this.scale += event.deltaY > 0 ? this.config.zoomSpeed : -this.config.zoomSpeed;
  }

  private updateSpherical(): void {
    const offset = new THREE.Vector3();
    offset.subVectors(this.camera.position, this.target);
    this.spherical.setFromVector3(offset);
  }

  update(): void {
    // Apply damping
    if (this.config.enableDamping) {
      this.sphericalDelta.theta *= 1 - this.config.dampingFactor;
      this.sphericalDelta.phi *= 1 - this.config.dampingFactor;
      this.scale = 1 + (this.scale - 1) * (1 - this.config.dampingFactor);
    }

    // Apply auto-rotate
    if (this.config.autoRotate) {
      this.sphericalDelta.theta += (this.config.autoRotateSpeed * Math.PI) / 180 / 60;
    }

    // Update spherical
    this.spherical.theta += this.sphericalDelta.theta;
    this.spherical.phi += this.sphericalDelta.phi;

    // Clamp angles
    this.spherical.phi = Math.max(
      this.config.minPolarAngle,
      Math.min(this.config.maxPolarAngle, this.spherical.phi)
    );

    // Apply zoom
    this.spherical.radius *= this.scale;
    this.spherical.radius = Math.max(
      this.config.minDistance,
      Math.min(this.config.maxDistance, this.spherical.radius)
    );

    // Update camera position
    const offset = new THREE.Vector3();
    offset.setFromSpherical(this.spherical);
    offset.add(this.target);
    this.camera.position.copy(offset);
    (this.camera as THREE.PerspectiveCamera).lookAt(this.target);

    // Reset deltas
    this.sphericalDelta.set(0, 0, 0);
    this.scale = 1;
    this.targetDelta.set(0, 0, 0);
  }

  dispose(): void {
    this.domElement.removeEventListener('mousedown', this.onMouseDown.bind(this));
    this.domElement.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.domElement.removeEventListener('mouseup', this.onMouseUp.bind(this));
    this.domElement.removeEventListener('wheel', this.onMouseWheel.bind(this));
  }
}
