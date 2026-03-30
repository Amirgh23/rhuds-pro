import * as THREE from 'three';

export interface SpatialUIPanelConfig {
  width?: number;
  height?: number;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  backgroundColor?: number;
  borderColor?: number;
  borderWidth?: number;
}

export class SpatialUIPanel {
  private mesh: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private config: Required<SpatialUIPanelConfig>;

  constructor(config: SpatialUIPanelConfig = {}) {
    this.config = {
      width: config.width || 1,
      height: config.height || 1,
      position: config.position || new THREE.Vector3(0, 0, -2),
      rotation: config.rotation || new THREE.Euler(0, 0, 0),
      backgroundColor: config.backgroundColor || 0x1a1a1a,
      borderColor: config.borderColor || 0x00ff00,
      borderWidth: config.borderWidth || 2,
    };

    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 512;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      // Fallback for test environment
      this.context = {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        fillRect: () => {},
        strokeRect: () => {},
        fillText: () => {},
        font: '',
        textAlign: 'left',
        textBaseline: 'top',
      } as any;
    } else {
      this.context = ctx;
    }

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.minFilter = THREE.LinearFilter;

    const geometry = new THREE.PlaneGeometry(this.config.width, this.config.height);
    const material = new THREE.MeshBasicMaterial({ map: this.texture });
    this.mesh = new THREE.Mesh(geometry, material);

    this.mesh.position.copy(this.config.position);
    this.mesh.rotation.copy(this.config.rotation);

    this.drawBackground();
  }

  private drawBackground(): void {
    const ctx = this.context;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = `#${this.config.backgroundColor.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = `#${this.config.borderColor.toString(16).padStart(6, '0')}`;
    ctx.lineWidth = this.config.borderWidth;
    ctx.strokeRect(0, 0, w, h);

    this.texture.needsUpdate = true;
  }

  drawText(text: string, x: number = 10, y: number = 30, fontSize: number = 20): void {
    const ctx = this.context;
    ctx.fillStyle = '#00ff00';
    ctx.font = `${fontSize}px monospace`;
    ctx.fillText(text, x, y);
    this.texture.needsUpdate = true;
  }

  clear(): void {
    this.drawBackground();
  }

  getMesh(): THREE.Mesh {
    return this.mesh;
  }

  setPosition(position: THREE.Vector3): void {
    this.mesh.position.copy(position);
  }

  setRotation(rotation: THREE.Euler): void {
    this.mesh.rotation.copy(rotation);
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.texture.dispose();
  }
}

export class SpatialButton extends SpatialUIPanel {
  private label: string;
  private onClick?: () => void;
  private isHovered: boolean = false;

  constructor(label: string, config: SpatialUIPanelConfig = {}) {
    super(config);
    this.label = label;
    this.drawButton();
  }

  private drawButton(): void {
    this.clear();
    const ctx = this.context;
    const w = this.canvas.width;
    const h = this.canvas.height;

    const bgColor = this.isHovered ? '#00ff00' : '#1a1a1a';
    const textColor = this.isHovered ? '#000000' : '#00ff00';

    ctx.fillStyle = bgColor;
    ctx.fillRect(10, 10, w - 20, h - 20);

    ctx.fillStyle = textColor;
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.label, w / 2, h / 2);

    this.getMesh().material = new THREE.MeshBasicMaterial({
      map:
        this.getMesh().material instanceof THREE.MeshBasicMaterial
          ? this.getMesh().material.map
          : undefined,
    });
  }

  setHovered(hovered: boolean): void {
    this.isHovered = hovered;
    this.drawButton();
  }

  setOnClick(callback: () => void): void {
    this.onClick = callback;
  }

  click(): void {
    this.onClick?.();
  }
}
