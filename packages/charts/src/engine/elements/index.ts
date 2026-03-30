/**
 * Default Chart Elements
 * Visual primitives for rendering chart data
 */

import type { IChartElement, ElementOptions, Point } from '../types/index';

/**
 * Base Chart Element class
 */
export abstract class ChartElement implements IChartElement {
  x: number = 0;
  y: number = 0;
  options: ElementOptions = {};

  /**
   * Check if a coordinate is within the element's bounds
   */
  abstract inRange(mouseX: number, mouseY: number): boolean;

  /**
   * Check if a coordinate is within the element's X range
   */
  abstract inXRange(mouseX: number): boolean;

  /**
   * Check if a coordinate is within the element's Y range
   */
  abstract inYRange(mouseY: number): boolean;

  /**
   * Get the center point of the element
   */
  abstract getCenterPoint(): Point;

  /**
   * Get the tooltip position for this element
   */
  abstract tooltipPosition(): Point;

  /**
   * Draw the element to the canvas
   */
  abstract draw(ctx: CanvasRenderingContext2D): void;
}

/**
 * Point Element - represents a single data point
 */
export class PointElement extends ChartElement {
  radius: number = 3;

  inRange(mouseX: number, mouseY: number): boolean {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.radius + 2; // Add 2px tolerance
  }

  inXRange(mouseX: number): boolean {
    return Math.abs(mouseX - this.x) <= this.radius + 2;
  }

  inYRange(mouseY: number): boolean {
    return Math.abs(mouseY - this.y) <= this.radius + 2;
  }

  getCenterPoint(): Point {
    return { x: this.x, y: this.y };
  }

  tooltipPosition(): Point {
    return { x: this.x, y: this.y - this.radius - 5 };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const backgroundColor = (this.options.backgroundColor as any) || '#29F2DF';
    const borderColor = (this.options.borderColor as any) || '#1C7FA6';
    const borderWidth = (this.options.borderWidth as any) || 1;

    ctx.save();
    ctx.fillStyle = backgroundColor as string;
    ctx.strokeStyle = borderColor as string;
    ctx.lineWidth = borderWidth;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}

/**
 * Line Element - represents a line between two points
 */
export class LineElement extends ChartElement {
  x1: number = 0;
  y1: number = 0;
  x2: number = 0;
  y2: number = 0;

  inRange(mouseX: number, mouseY: number): boolean {
    // Simple line hit detection with tolerance
    const tolerance = 5;
    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) return false;

    const t = Math.max(
      0,
      Math.min(1, ((mouseX - this.x1) * dx + (mouseY - this.y1) * dy) / (length * length))
    );

    const closestX = this.x1 + t * dx;
    const closestY = this.y1 + t * dy;

    const distance = Math.sqrt(Math.pow(mouseX - closestX, 2) + Math.pow(mouseY - closestY, 2));

    return distance <= tolerance;
  }

  inXRange(mouseX: number): boolean {
    const minX = Math.min(this.x1, this.x2);
    const maxX = Math.max(this.x1, this.x2);
    return mouseX >= minX - 5 && mouseX <= maxX + 5;
  }

  inYRange(mouseY: number): boolean {
    const minY = Math.min(this.y1, this.y2);
    const maxY = Math.max(this.y1, this.y2);
    return mouseY >= minY - 5 && mouseY <= maxY + 5;
  }

  getCenterPoint(): Point {
    return {
      x: (this.x1 + this.x2) / 2,
      y: (this.y1 + this.y2) / 2,
    };
  }

  tooltipPosition(): Point {
    return this.getCenterPoint();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const borderColor = (this.options.borderColor as any) || '#29F2DF';
    const borderWidth = (this.options.borderWidth as any) || 2;

    ctx.save();
    ctx.strokeStyle = borderColor as string;
    ctx.lineWidth = borderWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();

    ctx.restore();
  }
}

/**
 * Arc Element - represents a circular arc (for pie/doughnut charts)
 */
export class ArcElement extends ChartElement {
  startAngle: number = 0;
  endAngle: number = Math.PI * 2;
  innerRadius: number = 0;
  outerRadius: number = 50;
  centerX: number = 0;
  centerY: number = 0;

  inRange(mouseX: number, mouseY: number): boolean {
    const dx = mouseX - this.centerX;
    const dy = mouseY - this.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.innerRadius || distance > this.outerRadius) {
      return false;
    }

    const angle = Math.atan2(dy, dx);
    const normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle;

    const startAngle = this.startAngle < 0 ? this.startAngle + Math.PI * 2 : this.startAngle;
    const endAngle = this.endAngle < 0 ? this.endAngle + Math.PI * 2 : this.endAngle;

    if (startAngle <= endAngle) {
      return normalizedAngle >= startAngle && normalizedAngle <= endAngle;
    } else {
      return normalizedAngle >= startAngle || normalizedAngle <= endAngle;
    }
  }

  inXRange(mouseX: number): boolean {
    return mouseX >= this.centerX - this.outerRadius && mouseX <= this.centerX + this.outerRadius;
  }

  inYRange(mouseY: number): boolean {
    return mouseY >= this.centerY - this.outerRadius && mouseY <= this.centerY + this.outerRadius;
  }

  getCenterPoint(): Point {
    const midAngle = (this.startAngle + this.endAngle) / 2;
    const midRadius = (this.innerRadius + this.outerRadius) / 2;
    return {
      x: this.centerX + Math.cos(midAngle) * midRadius,
      y: this.centerY + Math.sin(midAngle) * midRadius,
    };
  }

  tooltipPosition(): Point {
    return this.getCenterPoint();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const backgroundColor = (this.options.backgroundColor as any) || '#29F2DF';
    const borderColor = (this.options.borderColor as any) || '#1C7FA6';
    const borderWidth = (this.options.borderWidth as any) || 1;

    ctx.save();
    ctx.fillStyle = backgroundColor as string;
    ctx.strokeStyle = borderColor as string;
    ctx.lineWidth = borderWidth;

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.outerRadius, this.startAngle, this.endAngle);
    ctx.lineTo(
      this.centerX + Math.cos(this.endAngle) * this.innerRadius,
      this.centerY + Math.sin(this.endAngle) * this.innerRadius
    );
    ctx.arc(this.centerX, this.centerY, this.innerRadius, this.endAngle, this.startAngle, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}

/**
 * Rectangle Element - represents a rectangular shape (for bar charts)
 */
export class RectangleElement extends ChartElement {
  width: number = 0;
  height: number = 0;

  inRange(mouseX: number, mouseY: number): boolean {
    const left = this.x;
    const right = this.x + this.width;
    const top = this.y;
    const bottom = this.y + this.height;

    return mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom;
  }

  inXRange(mouseX: number): boolean {
    return mouseX >= this.x && mouseX <= this.x + this.width;
  }

  inYRange(mouseY: number): boolean {
    return mouseY >= this.y && mouseY <= this.y + this.height;
  }

  getCenterPoint(): Point {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
  }

  tooltipPosition(): Point {
    return {
      x: this.x + this.width / 2,
      y: this.y - 5,
    };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const backgroundColor = (this.options.backgroundColor as any) || '#29F2DF';
    const borderColor = (this.options.borderColor as any) || '#1C7FA6';
    const borderWidth = (this.options.borderWidth as any) || 1;

    ctx.save();
    ctx.fillStyle = backgroundColor as string;
    ctx.strokeStyle = borderColor as string;
    ctx.lineWidth = borderWidth;

    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.restore();
  }
}

/**
 * Bar Element - extends Rectangle for bar-specific styling
 */
export class BarElement extends RectangleElement {
  // Bar-specific properties can be added here
}

export default {
  point: PointElement,
  line: LineElement,
  arc: ArcElement,
  rectangle: RectangleElement,
  bar: BarElement,
};
