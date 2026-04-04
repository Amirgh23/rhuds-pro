/**
 * Default Dataset Controllers
 * Implementations for all standard chart types
 */

export { DatasetController } from './DatasetController';
import { DatasetController } from './DatasetController';
import {
  PointElement,
  LineElement,
  ArcElement,
  RectangleElement,
  BarElement,
} from '../elements/index';
import type { Chart, ChartDataset, ElementStyle, UpdateMode } from '../types/index';

/**
 * Line Chart Controller
 * Renders data as connected line segments with points
 */
class LineController extends DatasetController {
  constructor(chart: Chart, index: number) {
    super(chart, index, 'line');
  }

  initialize(): void {
    // Initialize line-specific properties
    this.meta.data = [];
  }

  parse(start: number, count: number): void {
    const dataset = this.dataset;
    const meta = this.meta;

    for (let i = start; i < start + count; i++) {
      if (i >= dataset.data.length) break;

      const value = dataset.data[i];
      if (value === null || value === undefined) {
        meta.parsed[i] = null;
        meta.data[i] = null;
        continue;
      }

      meta.parsed[i] = {
        x: i,
        y: typeof value === 'number' ? value : 0,
      };

      // Create point element if not exists
      if (!meta.data[i]) {
        meta.data[i] = new PointElement();
      }
    }
  }

  update(mode: UpdateMode): void {
    if (mode === 'default' || mode === 'reset') {
      this.parse(0, this.dataset.data.length);
    }

    // Update element positions and styles
    const xScale = this.chart.scales.get('x');
    const yScale = this.chart.scales.get('y');
    const chartArea = this.chart.chartArea;

    if (!xScale || !yScale || !chartArea) return;

    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      const parsed = this.meta.parsed[i];

      if (!element || !parsed) continue;

      // Get normalized positions (0-1)
      const normalizedX = xScale.getPixelForValue(parsed.x);
      const normalizedY = yScale.getPixelForValue(parsed.y);

      // Convert to actual pixel coordinates within chartArea
      element.x = chartArea.left + normalizedX * chartArea.width;
      element.y = chartArea.bottom - normalizedY * chartArea.height;

      const style = this.getStyle(i, mode === 'active');
      element.options = style;
      if (style.radius) {
        (element as PointElement).radius = style.radius as number;
      }
    }

    this.meta.updated = true;
  }

  draw(): void {
    const ctx = this.chart.ctx;
    if (!ctx) return;

    const dataset = this.dataset;
    const tension = (dataset as any).tension || 0;

    ctx.save();

    // Draw line connecting points
    if (this.meta.data.length > 1 && tension === 0) {
      const borderColor = dataset.borderColor || '#29F2DF';
      const borderWidth = (dataset.borderWidth as any) || 2;

      ctx.strokeStyle = borderColor as string;
      ctx.lineWidth = borderWidth as number;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      let firstPoint = true;

      for (let i = 0; i < this.meta.data.length; i++) {
        const element = this.meta.data[i];
        if (!element) continue;

        if (firstPoint) {
          ctx.moveTo(element.x, element.y);
          firstPoint = false;
        } else {
          ctx.lineTo(element.x, element.y);
        }
      }

      ctx.stroke();
    }

    // Draw points
    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      if (element) {
        element.draw(ctx);
      }
    }

    ctx.restore();
  }

  getStyle(index: number, active: boolean): ElementStyle {
    const dataset = this.dataset;
    const bgColor = dataset.backgroundColor || '#29F2DF';
    const borderCol = dataset.borderColor || '#29F2DF';
    const borderW = dataset.borderWidth || 2;
    const radius = active ? dataset.pointHoverRadius || 5 : dataset.pointRadius || 3;
    return {
      backgroundColor: bgColor as any,
      borderColor: borderCol as any,
      borderWidth: borderW as any,
      radius: radius as any,
    };
  }
}

/**
 * Bar Chart Controller
 * Renders data as rectangular bars
 */
class BarController extends DatasetController {
  constructor(chart: Chart, index: number) {
    super(chart, index, 'bar');
  }

  initialize(): void {
    // Initialize bar-specific properties
    this.meta.data = [];
  }

  parse(start: number, count: number): void {
    const dataset = this.dataset;
    const meta = this.meta;

    for (let i = start; i < start + count; i++) {
      if (i >= dataset.data.length) break;

      const value = dataset.data[i];
      if (value === null || value === undefined) {
        meta.parsed[i] = null;
        meta.data[i] = null;
        continue;
      }

      meta.parsed[i] = {
        x: i,
        y: typeof value === 'number' ? value : 0,
      };

      // Create bar element if not exists
      if (!meta.data[i]) {
        meta.data[i] = new BarElement();
      }
    }
  }

  update(mode: UpdateMode): void {
    if (mode === 'default' || mode === 'reset') {
      this.parse(0, this.dataset.data.length);
    }

    // Update element positions and styles
    const xScale = this.chart.scales.get('x');
    const yScale = this.chart.scales.get('y');
    const chartArea = this.chart.chartArea;

    if (!xScale || !yScale || !chartArea) return;

    const barWidth = 20; // Default bar width
    const yMin = yScale.min || 0;

    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      const parsed = this.meta.parsed[i];

      if (!element || !parsed) continue;

      // Get normalized positions
      const normalizedX = xScale.getPixelForValue(parsed.x);
      const normalizedY = yScale.getPixelForValue(parsed.y);
      const normalizedYMin = yScale.getPixelForValue(yMin);

      // Convert to actual pixel coordinates
      const xPos = chartArea.left + normalizedX * chartArea.width;
      const yPos = chartArea.bottom - normalizedY * chartArea.height;
      const yMinPos = chartArea.bottom - normalizedYMin * chartArea.height;

      (element as BarElement).x = xPos - barWidth / 2;
      (element as BarElement).y = Math.min(yPos, yMinPos);
      (element as BarElement).width = barWidth;
      (element as BarElement).height = Math.abs(yMinPos - yPos);

      const style = this.getStyle(i, mode === 'active');
      element.options = style;
    }

    this.meta.updated = true;
  }

  draw(): void {
    const ctx = this.chart.ctx;
    if (!ctx) return;

    ctx.save();

    // Draw bars
    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      if (element) {
        element.draw(ctx);
      }
    }

    ctx.restore();
  }

  getStyle(index: number, active: boolean): ElementStyle {
    const dataset = this.dataset;
    const colors = Array.isArray(dataset.backgroundColor)
      ? dataset.backgroundColor
      : [dataset.backgroundColor || '#29F2DF'];
    const bgColor = colors[index % colors.length];
    const borderCol = dataset.borderColor || '#1C7FA6';
    const borderW = dataset.borderWidth || 1;
    return {
      backgroundColor: bgColor as any,
      borderColor: borderCol as any,
      borderWidth: borderW as any,
    };
  }
}

/**
 * Pie Chart Controller
 * Renders data as pie slices
 */
class PieController extends DatasetController {
  constructor(chart: Chart, index: number) {
    super(chart, index, 'pie');
  }

  initialize(): void {
    // Initialize pie-specific properties
    this.meta.data = [];
  }

  parse(start: number, count: number): void {
    const dataset = this.dataset;
    const meta = this.meta;

    for (let i = start; i < start + count; i++) {
      if (i >= dataset.data.length) break;

      const value = dataset.data[i];
      if (value === null || value === undefined) {
        meta.parsed[i] = null;
        meta.data[i] = null;
        continue;
      }

      meta.parsed[i] = {
        value: typeof value === 'number' ? value : 0,
      };

      // Create arc element if not exists
      if (!meta.data[i]) {
        meta.data[i] = new ArcElement();
      }
    }
  }

  update(mode: UpdateMode): void {
    if (mode === 'default' || mode === 'reset') {
      this.parse(0, this.dataset.data.length);
    }

    // Calculate total and angles
    let total = 0;
    for (let i = 0; i < this.meta.parsed.length; i++) {
      const parsed = this.meta.parsed[i];
      if (parsed) {
        total += parsed.value || 0;
      }
    }

    // Get chart center and radius
    const chartArea = this.chart.chartArea;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const radius =
      Math.min((chartArea.right - chartArea.left) / 2, (chartArea.bottom - chartArea.top) / 2) *
      0.8;

    let currentAngle = -Math.PI / 2; // Start at top

    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      const parsed = this.meta.parsed[i];

      if (!element || !parsed) continue;

      const sliceAngle = (parsed.value / total) * Math.PI * 2;
      const arc = element as ArcElement;

      arc.centerX = centerX;
      arc.centerY = centerY;
      arc.outerRadius = radius;
      arc.innerRadius = 0;
      arc.startAngle = currentAngle;
      arc.endAngle = currentAngle + sliceAngle;

      const style = this.getStyle(i, mode === 'active');
      element.options = style;

      currentAngle += sliceAngle;
    }

    this.meta.updated = true;
  }

  draw(): void {
    const ctx = this.chart.ctx;
    if (!ctx) return;

    ctx.save();

    // Draw slices
    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      if (element) {
        element.draw(ctx);
      }
    }

    ctx.restore();
  }

  getStyle(index: number, active: boolean): ElementStyle {
    const dataset = this.dataset;
    const colors = Array.isArray(dataset.backgroundColor)
      ? dataset.backgroundColor
      : [dataset.backgroundColor || '#29F2DF'];
    const bgColor = colors[index % colors.length];
    const borderCol = dataset.borderColor || '#1C7FA6';
    const borderW = dataset.borderWidth || 1;
    return {
      backgroundColor: bgColor as any,
      borderColor: borderCol as any,
      borderWidth: borderW as any,
    };
  }
}

/**
 * Doughnut Chart Controller
 * Extends PieChart with a center cutout
 */
class DoughnutController extends PieController {
  constructor(chart: Chart, index: number) {
    super(chart, index);
    this.type = 'doughnut';
  }

  update(mode: UpdateMode): void {
    if (mode === 'default' || mode === 'reset') {
      this.parse(0, this.dataset.data.length);
    }

    // Calculate total and angles
    let total = 0;
    for (let i = 0; i < this.meta.parsed.length; i++) {
      const parsed = this.meta.parsed[i];
      if (parsed) {
        total += parsed.value || 0;
      }
    }

    // Get chart center and radius
    const chartArea = this.chart.chartArea;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const outerRadius =
      Math.min((chartArea.right - chartArea.left) / 2, (chartArea.bottom - chartArea.top) / 2) *
      0.8;
    const cutoutPercentage = (this.dataset as any).cutout || 0.5;
    const innerRadius = outerRadius * cutoutPercentage;

    let currentAngle = -Math.PI / 2; // Start at top

    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      const parsed = this.meta.parsed[i];

      if (!element || !parsed) continue;

      const sliceAngle = (parsed.value / total) * Math.PI * 2;
      const arc = element as ArcElement;

      arc.centerX = centerX;
      arc.centerY = centerY;
      arc.outerRadius = outerRadius;
      arc.innerRadius = innerRadius;
      arc.startAngle = currentAngle;
      arc.endAngle = currentAngle + sliceAngle;

      const style = this.getStyle(i, mode === 'active');
      element.options = style;

      currentAngle += sliceAngle;
    }

    this.meta.updated = true;
  }
}

/**
 * Radar Chart Controller
 * Renders data as a radar/spider chart
 */
class RadarController extends DatasetController {
  constructor(chart: Chart, index: number) {
    super(chart, index, 'radar');
  }

  initialize(): void {
    // Initialize radar-specific properties
    this.meta.data = [];
  }

  parse(start: number, count: number): void {
    const dataset = this.dataset;
    const meta = this.meta;

    for (let i = start; i < start + count; i++) {
      if (i >= dataset.data.length) break;

      const value = dataset.data[i];
      if (value === null || value === undefined) {
        meta.parsed[i] = null;
        meta.data[i] = null;
        continue;
      }

      meta.parsed[i] = {
        value: typeof value === 'number' ? value : 0,
      };

      // Create point element if not exists
      if (!meta.data[i]) {
        meta.data[i] = new PointElement();
      }
    }
  }

  update(mode: UpdateMode): void {
    if (mode === 'default' || mode === 'reset') {
      this.parse(0, this.dataset.data.length);
    }

    // Get chart center and radius
    const chartArea = this.chart.chartArea;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const radius =
      Math.min((chartArea.right - chartArea.left) / 2, (chartArea.bottom - chartArea.top) / 2) *
      0.8;

    // Find max value for scaling
    let maxValue = 0;
    for (let i = 0; i < this.meta.parsed.length; i++) {
      const parsed = this.meta.parsed[i];
      if (parsed && parsed.value > maxValue) {
        maxValue = parsed.value;
      }
    }

    const angleSlice = (Math.PI * 2) / this.meta.data.length;

    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      const parsed = this.meta.parsed[i];

      if (!element || !parsed) continue;

      const angle = angleSlice * i - Math.PI / 2;
      const distance = (parsed.value / maxValue) * radius;

      (element as PointElement).x = centerX + Math.cos(angle) * distance;
      (element as PointElement).y = centerY + Math.sin(angle) * distance;

      const style = this.getStyle(i, mode === 'active');
      element.options = style;
      if (style.radius) {
        (element as PointElement).radius = style.radius as number;
      }
    }

    this.meta.updated = true;
  }

  draw(): void {
    const ctx = this.chart.ctx;
    if (!ctx) return;

    const dataset = this.dataset;

    ctx.save();

    // Draw polygon connecting points
    if (this.meta.data.length > 1) {
      const borderColor = dataset.borderColor || '#29F2DF';
      const borderWidth = (dataset.borderWidth as any) || 2;
      const fillColor = dataset.backgroundColor || 'rgba(41, 242, 223, 0.1)';

      ctx.strokeStyle = borderColor as string;
      ctx.lineWidth = borderWidth as number;
      ctx.fillStyle = fillColor as string;

      ctx.beginPath();
      for (let i = 0; i < this.meta.data.length; i++) {
        const element = this.meta.data[i];
        if (!element) continue;

        if (i === 0) {
          ctx.moveTo(element.x, element.y);
        } else {
          ctx.lineTo(element.x, element.y);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw points
    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      if (element) {
        element.draw(ctx);
      }
    }

    ctx.restore();
  }

  getStyle(index: number, active: boolean): ElementStyle {
    const dataset = this.dataset;
    const bgColor = dataset.backgroundColor || '#29F2DF';
    const borderCol = dataset.borderColor || '#29F2DF';
    const borderW = dataset.borderWidth || 2;
    const radius = active ? dataset.pointHoverRadius || 5 : dataset.pointRadius || 3;
    return {
      backgroundColor: bgColor as any,
      borderColor: borderCol as any,
      borderWidth: borderW as any,
      radius: radius as any,
    };
  }
}

/**
 * Polar Area Chart Controller
 * Renders data as polar area segments
 */
class PolarAreaController extends DatasetController {
  constructor(chart: Chart, index: number) {
    super(chart, index, 'polarArea');
  }

  initialize(): void {
    // Initialize polar area-specific properties
    this.meta.data = [];
  }

  parse(start: number, count: number): void {
    const dataset = this.dataset;
    const meta = this.meta;

    for (let i = start; i < start + count; i++) {
      if (i >= dataset.data.length) break;

      const value = dataset.data[i];
      if (value === null || value === undefined) {
        meta.parsed[i] = null;
        meta.data[i] = null;
        continue;
      }

      meta.parsed[i] = {
        value: typeof value === 'number' ? value : 0,
      };

      // Create arc element if not exists
      if (!meta.data[i]) {
        meta.data[i] = new ArcElement();
      }
    }
  }

  update(mode: UpdateMode): void {
    if (mode === 'default' || mode === 'reset') {
      this.parse(0, this.dataset.data.length);
    }

    // Get chart center and radius
    const chartArea = this.chart.chartArea;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const maxRadius =
      Math.min((chartArea.right - chartArea.left) / 2, (chartArea.bottom - chartArea.top) / 2) *
      0.8;

    // Find max value for scaling
    let maxValue = 0;
    for (let i = 0; i < this.meta.parsed.length; i++) {
      const parsed = this.meta.parsed[i];
      if (parsed && parsed.value > maxValue) {
        maxValue = parsed.value;
      }
    }

    const angleSlice = (Math.PI * 2) / this.meta.data.length;

    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      const parsed = this.meta.parsed[i];

      if (!element || !parsed) continue;

      const radius = (parsed.value / maxValue) * maxRadius;
      const arc = element as ArcElement;

      arc.centerX = centerX;
      arc.centerY = centerY;
      arc.outerRadius = radius;
      arc.innerRadius = 0;
      arc.startAngle = angleSlice * i - Math.PI / 2;
      arc.endAngle = angleSlice * (i + 1) - Math.PI / 2;

      const style = this.getStyle(i, mode === 'active');
      element.options = style;
    }

    this.meta.updated = true;
  }

  draw(): void {
    const ctx = this.chart.ctx;
    if (!ctx) return;

    ctx.save();

    // Draw segments
    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      if (element) {
        element.draw(ctx);
      }
    }

    ctx.restore();
  }

  getStyle(index: number, active: boolean): ElementStyle {
    const dataset = this.dataset;
    const colors = Array.isArray(dataset.backgroundColor)
      ? dataset.backgroundColor
      : [dataset.backgroundColor || '#29F2DF'];
    const bgColor = colors[index % colors.length];
    const borderCol = dataset.borderColor || '#1C7FA6';
    const borderW = dataset.borderWidth || 1;
    return {
      backgroundColor: bgColor as any,
      borderColor: borderCol as any,
      borderWidth: borderW as any,
    };
  }
}

/**
 * Bubble Chart Controller
 * Renders data as bubbles with x, y, and radius values
 */
class BubbleController extends DatasetController {
  constructor(chart: Chart, index: number) {
    super(chart, index, 'bubble');
  }

  initialize(): void {
    // Initialize bubble-specific properties
    this.meta.data = [];
  }

  parse(start: number, count: number): void {
    const dataset = this.dataset;
    const meta = this.meta;

    for (let i = start; i < start + count; i++) {
      if (i >= dataset.data.length) break;

      const value = dataset.data[i];
      if (value === null || value === undefined) {
        meta.parsed[i] = null;
        meta.data[i] = null;
        continue;
      }

      if (typeof value === 'object' && value !== null) {
        meta.parsed[i] = {
          x: (value as any).x || 0,
          y: (value as any).y || 0,
          r: (value as any).r || 3,
        };
      } else {
        meta.parsed[i] = { x: 0, y: 0, r: 3 };
      }

      // Create point element if not exists
      if (!meta.data[i]) {
        meta.data[i] = new PointElement();
      }
    }
  }

  update(mode: UpdateMode): void {
    if (mode === 'default' || mode === 'reset') {
      this.parse(0, this.dataset.data.length);
    }

    // Update element positions and styles
    const xScale = this.chart.scales.get('x');
    const yScale = this.chart.scales.get('y');
    const chartArea = this.chart.chartArea;

    if (!xScale || !yScale || !chartArea) return;

    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      const parsed = this.meta.parsed[i];

      if (!element || !parsed) continue;

      // Get normalized positions
      const normalizedX = xScale.getPixelForValue(parsed.x);
      const normalizedY = yScale.getPixelForValue(parsed.y);

      // Convert to actual pixel coordinates
      element.x = chartArea.left + normalizedX * chartArea.width;
      element.y = chartArea.bottom - normalizedY * chartArea.height;

      const style = this.getStyle(i, mode === 'active');
      element.options = style;
      if (style.radius) {
        (element as PointElement).radius = style.radius as number;
      }
    }

    this.meta.updated = true;
  }

  draw(): void {
    const ctx = this.chart.ctx;
    if (!ctx) return;

    ctx.save();

    // Draw bubbles
    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      if (element) {
        element.draw(ctx);
      }
    }

    ctx.restore();
  }

  getStyle(index: number, active: boolean): ElementStyle {
    const dataset = this.dataset;
    const bgColor = dataset.backgroundColor || '#29F2DF';
    const borderCol = dataset.borderColor || '#1C7FA6';
    const borderW = dataset.borderWidth || 1;
    const radius = active ? dataset.pointHoverRadius || 5 : dataset.pointRadius || 3;
    return {
      backgroundColor: bgColor as any,
      borderColor: borderCol as any,
      borderWidth: borderW as any,
      radius: radius as any,
    };
  }
}

/**
 * Scatter Chart Controller
 * Renders data as scattered points
 */
class ScatterController extends DatasetController {
  constructor(chart: Chart, index: number) {
    super(chart, index, 'scatter');
  }

  initialize(): void {
    // Initialize scatter-specific properties
    this.meta.data = [];
  }

  parse(start: number, count: number): void {
    const dataset = this.dataset;
    const meta = this.meta;

    for (let i = start; i < start + count; i++) {
      if (i >= dataset.data.length) break;

      const value = dataset.data[i];
      if (value === null || value === undefined) {
        meta.parsed[i] = null;
        meta.data[i] = null;
        continue;
      }

      if (typeof value === 'object' && value !== null) {
        meta.parsed[i] = {
          x: (value as any).x || 0,
          y: (value as any).y || 0,
        };
      } else {
        meta.parsed[i] = { x: 0, y: 0 };
      }

      // Create point element if not exists
      if (!meta.data[i]) {
        meta.data[i] = new PointElement();
      }
    }
  }

  update(mode: UpdateMode): void {
    if (mode === 'default' || mode === 'reset') {
      this.parse(0, this.dataset.data.length);
    }

    // Update element positions and styles
    const xScale = this.chart.scales.get('x');
    const yScale = this.chart.scales.get('y');
    const chartArea = this.chart.chartArea;

    if (!xScale || !yScale || !chartArea) return;

    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      const parsed = this.meta.parsed[i];

      if (!element || !parsed) continue;

      // Get normalized positions
      const normalizedX = xScale.getPixelForValue(parsed.x);
      const normalizedY = yScale.getPixelForValue(parsed.y);

      // Convert to actual pixel coordinates
      element.x = chartArea.left + normalizedX * chartArea.width;
      element.y = chartArea.bottom - normalizedY * chartArea.height;

      const style = this.getStyle(i, mode === 'active');
      element.options = style;
      if (style.radius) {
        (element as PointElement).radius = style.radius as number;
      }
    }

    this.meta.updated = true;
  }

  draw(): void {
    const ctx = this.chart.ctx;
    if (!ctx) return;

    ctx.save();

    // Draw points
    for (let i = 0; i < this.meta.data.length; i++) {
      const element = this.meta.data[i];
      if (element) {
        element.draw(ctx);
      }
    }

    ctx.restore();
  }

  getStyle(index: number, active: boolean): ElementStyle {
    const dataset = this.dataset;
    const bgColor = dataset.backgroundColor || '#29F2DF';
    const borderCol = dataset.borderColor || '#1C7FA6';
    const borderW = dataset.borderWidth || 1;
    const radius = active ? dataset.pointHoverRadius || 5 : dataset.pointRadius || 3;
    return {
      backgroundColor: bgColor as any,
      borderColor: borderCol as any,
      borderWidth: borderW as any,
      radius: radius as any,
    };
  }
}

/**
 * Mixed Chart Controller
 * Supports multiple chart types in a single chart
 */
class MixedController extends DatasetController {
  private delegateController: DatasetController | null = null;

  constructor(chart: Chart, index: number) {
    super(chart, index, 'mixed');
  }

  initialize(): void {
    // Initialize mixed-specific properties
    this.meta.data = [];
    this.createDelegateController();
  }

  private createDelegateController(): void {
    const datasetType = (this.dataset as any).type || 'line';
    const ControllerClass = this.getControllerClass(datasetType);

    if (ControllerClass) {
      this.delegateController = new ControllerClass(this.chart, this.index);
      this.delegateController.initialize();
    }
  }

  private getControllerClass(type: string): any {
    const controllers: { [key: string]: any } = {
      line: LineController,
      bar: BarController,
      pie: PieController,
      doughnut: DoughnutController,
      radar: RadarController,
      polarArea: PolarAreaController,
      bubble: BubbleController,
      scatter: ScatterController,
    };
    return controllers[type] || LineController;
  }

  parse(start: number, count: number): void {
    if (this.delegateController) {
      this.delegateController.parse(start, count);
      this.meta = this.delegateController.getMeta();
    }
  }

  update(mode: UpdateMode): void {
    if (this.delegateController) {
      this.delegateController.update(mode);
      this.meta = this.delegateController.getMeta();
    }
  }

  draw(): void {
    if (this.delegateController) {
      this.delegateController.draw();
    }
  }

  getStyle(index: number, active: boolean): ElementStyle {
    if (this.delegateController) {
      return this.delegateController.getStyle(index, active);
    }
    return {};
  }
}

// Export all controller classes
export {
  LineController,
  BarController,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  BubbleController,
  ScatterController,
  MixedController,
};

export default {
  line: LineController,
  bar: BarController,
  pie: PieController,
  doughnut: DoughnutController,
  radar: RadarController,
  polarArea: PolarAreaController,
  bubble: BubbleController,
  scatter: ScatterController,
  mixed: MixedController,
};
