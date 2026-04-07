/**
 * 3D Chart Controller
 * Renders charts in 3D space with perspective and rotation
 */

export interface Chart3DOptions {
  perspective?: number;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  scale?: number;
  enableLighting?: boolean;
  cameraDistance?: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
  color?: string;
  size?: number;
}

/**
 * 3D Chart Controller
 */
export class Chart3DController {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private options: Chart3DOptions;
  private points: Point3D[] = [];
  private animationFrame: number | null = null;
  private rotation = { x: 0, y: 0, z: 0 };

  constructor(canvas: HTMLCanvasElement, options: Chart3DOptions = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;

    this.options = {
      perspective: options.perspective || 500,
      rotationX: options.rotationX || 0,
      rotationY: options.rotationY || 0,
      rotationZ: options.rotationZ || 0,
      scale: options.scale || 1,
      enableLighting: options.enableLighting !== false,
      cameraDistance: options.cameraDistance || 1000,
    };

    this.rotation = {
      x: this.options.rotationX || 0,
      y: this.options.rotationY || 0,
      z: this.options.rotationZ || 0,
    };
  }

  /**
   * Add point to chart
   */
  public addPoint(point: Point3D): void {
    this.points.push(point);
  }

  /**
   * Add multiple points
   */
  public addPoints(points: Point3D[]): void {
    this.points.push(...points);
  }

  /**
   * Project 3D point to 2D
   */
  private project(point: Point3D): { x: number; y: number; z: number } {
    // Apply rotation
    let x = point.x;
    let y = point.y;
    let z = point.z;

    // Rotate around X axis
    const cosX = Math.cos(this.rotation.x);
    const sinX = Math.sin(this.rotation.x);
    let y1 = y * cosX - z * sinX;
    let z1 = y * sinX + z * cosX;

    // Rotate around Y axis
    const cosY = Math.cos(this.rotation.y);
    const sinY = Math.sin(this.rotation.y);
    let x2 = x * cosY + z1 * sinY;
    let z2 = -x * sinY + z1 * cosY;

    // Rotate around Z axis
    const cosZ = Math.cos(this.rotation.z);
    const sinZ = Math.sin(this.rotation.z);
    let x3 = x2 * cosZ - y1 * sinZ;
    let y3 = x2 * sinZ + y1 * cosZ;

    // Perspective projection
    const perspective = this.options.perspective || 500;
    const scale = perspective / (perspective + z2);

    return {
      x: x3 * scale * this.options.scale! + this.canvas.width / 2,
      y: y3 * scale * this.options.scale! + this.canvas.height / 2,
      z: z2,
    };
  }

  /**
   * Render chart
   */
  public render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Sort points by Z for proper depth rendering
    const sortedPoints = [...this.points].sort((a, b) => {
      const projA = this.project(a);
      const projB = this.project(b);
      return projA.z - projB.z;
    });

    // Draw points
    sortedPoints.forEach((point, index) => {
      const proj = this.project(point);

      // Draw point
      this.ctx.fillStyle = point.color || '#0ff';
      this.ctx.beginPath();
      this.ctx.arc(proj.x, proj.y, point.size || 3, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw line to next point
      if (index < sortedPoints.length - 1) {
        const nextProj = this.project(sortedPoints[index + 1]);
        this.ctx.strokeStyle = point.color || '#0ff';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(proj.x, proj.y);
        this.ctx.lineTo(nextProj.x, nextProj.y);
        this.ctx.stroke();
      }
    });
  }

  /**
   * Animate rotation
   */
  public animateRotation(
    targetX: number,
    targetY: number,
    targetZ: number,
    duration: number = 1000
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const startRotation = { ...this.rotation };

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        this.rotation.x = startRotation.x + (targetX - startRotation.x) * progress;
        this.rotation.y = startRotation.y + (targetY - startRotation.y) * progress;
        this.rotation.z = startRotation.z + (targetZ - startRotation.z) * progress;

        this.render();

        if (progress < 1) {
          this.animationFrame = requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }

  /**
   * Set rotation
   */
  public setRotation(x: number, y: number, z: number): void {
    this.rotation = { x, y, z };
    this.render();
  }

  /**
   * Get rotation
   */
  public getRotation(): { x: number; y: number; z: number } {
    return { ...this.rotation };
  }

  /**
   * Clear points
   */
  public clear(): void {
    this.points = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Destroy controller
   */
  public destroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.clear();
  }
}

export default Chart3DController;
