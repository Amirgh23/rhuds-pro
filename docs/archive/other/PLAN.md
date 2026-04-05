# نقشه جامع پیاده‌سازی Cold War Charts

## مقدمه

این سند شامل نقشه کامل و جزئیات پیاده‌سازی صفحه Cold War Charts است که شامل 75+ چارت با استایل واقعی Call of Duty: Cold War HUD می‌باشد.

## فاز 1: آماده‌سازی و تحلیل

### 1.1 بررسی چارت‌های موجود

تمام چارت‌های موجود در `ChartsShowcase.tsx`:

**چارت‌های پایه (8 عدد):**

1. Line Chart - خط‌نمودار
2. Bar Chart - نمودار میله‌ای
3. Pie Chart - نمودار دایره‌ای
4. Doughnut Chart - نمودار حلقه‌ای
5. Radar Chart - نمودار رادار
6. Polar Chart - نمودار قطبی
7. Bubble Chart - نمودار حبابی
8. Scatter Chart - نمودار پراکندگی

**چارت‌های پیشرفته میله‌ای (5 عدد):** 9. Bar Chart with Border Radius 10. Floating Bars 11. Horizontal Bar Chart 12. Stacked Bar Chart 13. Stacked Grouped Bar Chart

**چارت‌های پیشرفته خطی (6 عدد):** 14. Line Interpolation (Cubic) 15. Multi Axis Line Chart 16. Point Styling 17. Segment Styling 18. Stepped Line Chart 19. Line Styling (Dashed/Dotted)

**چارت‌های ترکیبی (7 عدد):** 20. Combo Bar/Line Chart 21. Multi Series Pie Chart 22. Polar Area Chart 23. Polar Area Centered Labels 24. Radar Skip Points 25. Scatter Multi Axis 26. Stacked Bar/Line Chart

**چارت‌های ناحیه‌ای (6 عدد):** 27. Area Chart 28. Line with Boundaries 29. Line Multiple Datasets 30. Line with Time Axis 31. Stacked Line Chart 32. Stacked Radar Chart

**چارت‌های Scale (8 عدد):** 33. Linear Scale Min-Max 34. Linear Scale Suggested 35. Linear Scale Step Size 36. Log Scale 37. Stacked Linear/Category 38. Time Scale 39. Time Scale Max Span 40. Time Scale Combo

**چارت‌های Scriptable (6 عدد):** 41. Scriptable Bar Chart 42. Scriptable Bubble Chart 43. Scriptable Line Chart 44. Scriptable Pie Chart 45. Scriptable Polar Area 46. Scriptable Radar Chart

**چارت‌های دیگر (29+ عدد):**
47-75+ سایر انواع چارت‌ها

### 1.2 رنگ‌های Cold War HUD

از فایل `coldWarHudColors.ts`:

```typescript
// رنگ‌های اصلی
MENU_YELLOW: '#F0A000'; // نارنجی طلایی
TECH_GREEN: '#009797'; // سبز تکنولوژی
TECH_GREEN_DARK: '#057771'; // سبز تیره
RED: '#E03232'; // قرمز
BLUE: '#5DB6E5'; // آبی
ORANGE: '#FF8555'; // نارنجی
GREEN: '#72CC72'; // سبز
YELLOW: '#F0C850'; // زرد
PURPLE: '#8466E2'; // بنفش

// رنگ‌های منو
MENU_GREY: '#8C8C8C';
MENU_GREY_DARK: '#3C3C3C';
MENU_HIGHLIGHT: '#1E1E1E';
MENU_DIMMED: '#4B4B4B';

// رنگ‌های ویژه
BRONZE: '#B48261';
SILVER: '#9699A1';
GOLD: '#D6B563';
PLATINUM: '#A6DDBE';
```

## فاز 2: طراحی معماری

### 2.1 ساختار فایل‌ها

```
packages/demo-app/src/
├── pages/
│   ├── ColdWarChartsPage.tsx           # صفحه اصلی
│   └── ColdWarChartsPage.css           # استایل‌های صفحه
├── components/
│   ├── charts/
│   │   ├── ColdWarChartRenderer.ts     # توابع رسم اصلی
│   │   ├── ColdWarChartTooltip.tsx     # کامپوننت Tooltip
│   │   ├── ColdWarChartLegend.tsx      # کامپوننت Legend
│   │   └── ColdWarChartUtils.ts        # توابع کمکی
│   └── hud/
│       ├── HudFrame.tsx                # فریم HUD
│       ├── HudCorners.tsx              # گوشه‌های HUD
│       └── HudScanlines.tsx            # Scanlines
```

### 2.2 کامپوننت‌های اصلی

#### A. ColdWarChartCard

```typescript
interface ColdWarChartCardProps {
  title: string;
  description: string;
  chartType: ChartType;
  data: ChartData;
  width?: number;
  height?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
  showCorners?: boolean;
  scanlines?: boolean;
}
```

#### B. ColdWarTooltip

```typescript
interface TooltipProps {
  x: number;
  y: number;
  data: {
    label: string;
    value: number;
    color: string;
  };
  visible: boolean;
}
```

## فاز 3: پیاده‌سازی مرحله به مرحله

### مرحله 1: ایجاد سیستم رنگ (30 دقیقه)

**فایل: `packages/demo-app/src/utils/coldWarChartColors.ts`**

```typescript
import { COLD_WAR_HUD_COLORS } from '@rhuds/core';

export const CHART_COLORS = {
  primary: COLD_WAR_HUD_COLORS.MENU_YELLOW.hex,
  secondary: COLD_WAR_HUD_COLORS.TECH_GREEN.hex,
  tertiary: COLD_WAR_HUD_COLORS.BLUE.hex,
  danger: COLD_WAR_HUD_COLORS.RED.hex,
  success: COLD_WAR_HUD_COLORS.GREEN.hex,
  warning: COLD_WAR_HUD_COLORS.ORANGE.hex,
  info: COLD_WAR_HUD_COLORS.PURPLE.hex,

  // پالت چارت
  palette: [
    COLD_WAR_HUD_COLORS.MENU_YELLOW.hex,
    COLD_WAR_HUD_COLORS.TECH_GREEN.hex,
    COLD_WAR_HUD_COLORS.BLUE.hex,
    COLD_WAR_HUD_COLORS.RED.hex,
    COLD_WAR_HUD_COLORS.ORANGE.hex,
    COLD_WAR_HUD_COLORS.GREEN.hex,
    COLD_WAR_HUD_COLORS.PURPLE.hex,
    COLD_WAR_HUD_COLORS.GOLD.hex,
  ],

  // رنگ‌های پس‌زمینه
  background: {
    main: 'rgba(10, 10, 12, 0.95)',
    card: 'rgba(20, 20, 24, 0.9)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },

  // رنگ‌های Grid
  grid: {
    main: 'rgba(240, 160, 0, 0.15)',
    secondary: 'rgba(0, 151, 151, 0.1)',
  },

  // رنگ‌های متن
  text: {
    primary: COLD_WAR_HUD_COLORS.MENU_YELLOW.hex,
    secondary: COLD_WAR_HUD_COLORS.MENU_GREY.hex,
    dimmed: COLD_WAR_HUD_COLORS.MENU_DIMMED.hex,
  },
};

export function getChartColor(index: number): string {
  return CHART_COLORS.palette[index % CHART_COLORS.palette.length];
}

export function getGradient(
  ctx: CanvasRenderingContext2D,
  color: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): CanvasGradient {
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, `${color}FF`);
  gradient.addColorStop(1, `${color}33`);
  return gradient;
}
```

### مرحله 2: ایجاد سیستم Tooltip (45 دقیقه)

**فایل: `packages/demo-app/src/components/charts/ColdWarChartTooltip.tsx`**

```typescript
import React from 'react';
import './ColdWarChartTooltip.css';

interface TooltipData {
  x: number;
  y: number;
  label: string;
  value: string | number;
  color: string;
  visible: boolean;
}

export const ColdWarChartTooltip: React.FC<TooltipData> = ({
  x,
  y,
  label,
  value,
  color,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div
      className="coldwar-chart-tooltip"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {/* Corner Brackets */}
      <div className="tooltip-corner tl" />
      <div className="tooltip-corner tr" />
      <div className="tooltip-corner bl" />
      <div className="tooltip-corner br" />

      {/* Content */}
      <div className="tooltip-content">
        <div className="tooltip-header">
          <div
            className="tooltip-color-indicator"
            style={{ backgroundColor: color }}
          />
          <span className="tooltip-label">{label}</span>
        </div>
        <div className="tooltip-value">{value}</div>
      </div>

      {/* Scanlines */}
      <div className="tooltip-scanlines" />
    </div>
  );
};
```

**فایل: `packages/demo-app/src/components/charts/ColdWarChartTooltip.css`**

```css
.coldwar-chart-tooltip {
  position: absolute;
  pointer-events: none;
  z-index: 1000;
  transform: translate(-50%, -120%);
  animation: tooltip-appear 0.2s ease-out;
}

.tooltip-content {
  position: relative;
  background: linear-gradient(135deg, rgba(10, 10, 12, 0.98) 0%, rgba(20, 20, 24, 0.95) 100%);
  border: 1px solid rgba(240, 160, 0, 0.6);
  padding: 8px 12px;
  min-width: 120px;
  box-shadow:
    0 0 20px rgba(240, 160, 0, 0.3),
    inset 0 0 10px rgba(0, 0, 0, 0.5);
}

.tooltip-corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: rgba(240, 160, 0, 0.8);
  border-style: solid;
}

.tooltip-corner.tl {
  top: 0;
  left: 0;
  border-width: 2px 0 0 2px;
}

.tooltip-corner.tr {
  top: 0;
  right: 0;
  border-width: 2px 2px 0 0;
}

.tooltip-corner.bl {
  bottom: 0;
  left: 0;
  border-width: 0 0 2px 2px;
}

.tooltip-corner.br {
  bottom: 0;
  right: 0;
  border-width: 0 2px 2px 0;
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.tooltip-color-indicator {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  box-shadow: 0 0 6px currentColor;
}

.tooltip-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  color: #f0a000;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tooltip-value {
  font-family: 'Share Tech Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 8px rgba(240, 160, 0, 0.5);
}

.tooltip-scanlines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(240, 160, 0, 0.03) 2px,
    rgba(240, 160, 0, 0.03) 4px
  );
  pointer-events: none;
}

@keyframes tooltip-appear {
  from {
    opacity: 0;
    transform: translate(-50%, -100%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -120%);
  }
}
```

### مرحله 3: ایجاد HUD Frame Components (30 دقیقه)

**فایل: `packages/demo-app/src/components/hud/HudChartFrame.tsx`**

```typescript
import React from 'react';
import './HudChartFrame.css';

interface HudChartFrameProps {
  children: React.ReactNode;
  title?: string;
  techCode?: string;
  showCorners?: boolean;
  scanlines?: boolean;
  className?: string;
}

export const HudChartFrame: React.FC<HudChartFrameProps> = ({
  children,
  title,
  techCode,
  showCorners = true,
  scanlines = true,
  className = '',
}) => {
  return (
    <div className={`hud-chart-frame ${className}`}>
      {/* Header */}
      {title && (
        <div className="hud-frame-header">
          <div className="header-left">
            <div className="status-led" />
            <span className="header-title">{title}</span>
          </div>
          {techCode && (
            <div className="header-right">
              <span className="tech-code">{techCode}</span>
              <span className="timestamp">{new Date().toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="hud-frame-content">
        {children}
      </div>

      {/* Corner Brackets */}
      {showCorners && (
        <>
          <div className="hud-corner tl" />
          <div className="hud-corner tr" />
          <div className="hud-corner bl" />
          <div className="hud-corner br" />
        </>
      )}

      {/* Scanlines */}
      {scanlines && <div className="hud-scanlines" />}

      {/* Glow Effect */}
      <div className="hud-glow" />
    </div>
  );
};
```

ادامه دارد...

**فایل: `packages/demo-app/src/components/hud/HudChartFrame.css`**

```css
.hud-chart-frame {
  position: relative;
  background: linear-gradient(135deg, rgba(10, 10, 12, 0.98) 0%, rgba(20, 20, 24, 0.95) 100%);
  border: 1px solid rgba(240, 160, 0, 0.4);
  overflow: hidden;
  transition: all 0.3s ease;
}

.hud-chart-frame:hover {
  border-color: rgba(240, 160, 0, 0.7);
  box-shadow: 0 0 30px rgba(240, 160, 0, 0.2);
}

.hud-frame-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(240, 160, 0, 0.1);
  border-bottom: 1px solid rgba(240, 160, 0, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-led {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f0a000;
  box-shadow: 0 0 10px #f0a000;
  animation: led-pulse 2s ease-in-out infinite;
}

@keyframes led-pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.header-title {
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #f0a000;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 8px rgba(240, 160, 0, 0.5);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  color: rgba(240, 160, 0, 0.6);
}

.hud-frame-content {
  position: relative;
  padding: 16px;
  z-index: 2;
}

.hud-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: rgba(240, 160, 0, 0.8);
  border-style: solid;
  z-index: 10;
}

.hud-corner.tl {
  top: 4px;
  left: 4px;
  border-width: 2px 0 0 2px;
}

.hud-corner.tr {
  top: 4px;
  right: 4px;
  border-width: 2px 2px 0 0;
}

.hud-corner.bl {
  bottom: 4px;
  left: 4px;
  border-width: 0 0 2px 2px;
}

.hud-corner.br {
  bottom: 4px;
  right: 4px;
  border-width: 0 2px 2px 0;
}

.hud-scanlines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(240, 160, 0, 0.02) 2px,
    rgba(240, 160, 0, 0.02) 4px
  );
  pointer-events: none;
  z-index: 1;
}

.hud-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(circle, rgba(240, 160, 0, 0.05) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
```

### مرحله 4: ایجاد توابع رسم چارت با HUD Style (2 ساعت)

**فایل: `packages/demo-app/src/components/charts/ColdWarChartRenderer.ts`**

این فایل شامل تمام 75+ تابع رسم چارت است. نمونه:

```typescript
import { CHART_COLORS, getChartColor, getGradient } from '../../utils/coldWarChartColors';

export interface ChartDrawOptions {
  canvas: HTMLCanvasElement;
  progress: number;
  onHover?: (data: TooltipData | null) => void;
}

export interface TooltipData {
  x: number;
  y: number;
  label: string;
  value: number;
  color: string;
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function drawHudGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  padding: number,
  options: {
    horizontal?: boolean;
    vertical?: boolean;
    color?: string;
    lineWidth?: number;
    dashPattern?: number[];
  } = {}
): void {
  const {
    horizontal = true,
    vertical = true,
    color = CHART_COLORS.grid.main,
    lineWidth = 1,
    dashPattern = [2, 2],
  } = options;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash(dashPattern);

  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  // Horizontal grid lines
  if (horizontal) {
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * chartHeight) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
  }

  // Vertical grid lines
  if (vertical) {
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i * chartWidth) / 5;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding - 40);
      ctx.stroke();
    }
  }

  ctx.restore();
}

export function drawHudAxes(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  padding: number,
  options: {
    color?: string;
    lineWidth?: number;
    showArrows?: boolean;
  } = {}
): void {
  const { color = CHART_COLORS.primary, lineWidth = 2, showArrows = true } = options;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  // Y axis
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding - 40);
  ctx.stroke();

  // X axis
  ctx.beginPath();
  ctx.moveTo(padding, height - padding - 40);
  ctx.lineTo(width - padding, height - padding - 40);
  ctx.stroke();

  // Arrows
  if (showArrows) {
    // Y axis arrow
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding - 4, padding + 8);
    ctx.lineTo(padding + 4, padding + 8);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // X axis arrow
    ctx.beginPath();
    ctx.moveTo(width - padding, height - padding - 40);
    ctx.lineTo(width - padding - 8, height - padding - 44);
    ctx.lineTo(width - padding - 8, height - padding - 36);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

export function drawHudLabels(
  ctx: CanvasRenderingContext2D,
  labels: string[],
  positions: { x: number; y: number }[],
  options: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
  } = {}
): void {
  const {
    color = CHART_COLORS.text.primary,
    fontSize = 10,
    fontFamily = "'Share Tech Mono', monospace",
    align = 'center',
    baseline = 'middle',
  } = options;

  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;

  labels.forEach((label, i) => {
    if (positions[i]) {
      ctx.fillText(label, positions[i].x, positions[i].y);
    }
  });

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// CHART 1: LINE CHART
// ═══════════════════════════════════════════════════════════════

export function drawLineChart(options: ChartDrawOptions): void {
  const { canvas, progress, onHover } = options;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [65, 59, 80, 81, 56, 55, 70];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  // Background
  ctx.fillStyle = CHART_COLORS.background.main;
  ctx.fillRect(0, 0, width, height);

  // Grid
  drawHudGrid(ctx, width, height, padding);

  // Axes
  drawHudAxes(ctx, width, height, padding);

  // Y-axis labels
  const yLabels = ['100', '80', '60', '40', '20', '0'];
  const yPositions = yLabels.map((_, i) => ({
    x: padding - 15,
    y: padding + (i * (height - 2 * padding - 40)) / 5,
  }));
  drawHudLabels(ctx, yLabels, yPositions, { align: 'right' });

  // X-axis labels
  const xPositions = labels.map((_, i) => ({
    x: padding + (i / (labels.length - 1)) * (width - 2 * padding),
    y: height - padding - 20,
  }));
  drawHudLabels(ctx, labels, xPositions);

  // Line
  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  ctx.save();
  ctx.strokeStyle = CHART_COLORS.primary;
  ctx.lineWidth = 3;
  ctx.shadowColor = CHART_COLORS.primary;
  ctx.shadowBlur = 10;
  ctx.beginPath();

  for (let i = 0; i < data.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = height - padding - 40 - (data[i] / 100) * chartHeight;

    if (i / (data.length - 1) <= easedProgress) {
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();

  // Points
  data.forEach((value, i) => {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (value / 100) * chartHeight;

      // Outer glow
      ctx.save();
      ctx.fillStyle = CHART_COLORS.primary;
      ctx.shadowColor = CHART_COLORS.primary;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Inner point
      ctx.fillStyle = CHART_COLORS.background.main;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Hover detection
      if (onHover) {
        canvas.addEventListener('mousemove', (e) => {
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));

          if (distance < 10) {
            onHover({
              x: mouseX,
              y: mouseY,
              label: labels[i],
              value: value,
              color: CHART_COLORS.primary,
            });
          }
        });
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// CHART 2: BAR CHART
// ═══════════════════════════════════════════════════════════════

export function drawBarChart(options: ChartDrawOptions): void {
  const { canvas, progress } = options;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [45, 55, 60, 70, 50, 65, 75];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Background
  ctx.fillStyle = CHART_COLORS.background.main;
  ctx.fillRect(0, 0, width, height);

  // Grid
  drawHudGrid(ctx, width, height, padding, { vertical: false });

  // Axes
  drawHudAxes(ctx, width, height, padding);

  // Labels
  const yLabels = ['100', '80', '60', '40', '20', '0'];
  const yPositions = yLabels.map((_, i) => ({
    x: padding - 15,
    y: padding + (i * (height - 2 * padding - 40)) / 5,
  }));
  drawHudLabels(ctx, yLabels, yPositions, { align: 'right' });

  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / data.length) * 0.7;

  // Bars
  data.forEach((value, i) => {
    const delay = i * 0.08;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);

    const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
    const barHeight = (value / 100) * chartHeight * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    // Gradient
    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, getChartColor(i));
    gradient.addColorStop(1, `${getChartColor(i)}66`);

    // Bar
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);

    // Border with glow
    ctx.save();
    ctx.strokeStyle = getChartColor(i);
    ctx.lineWidth = 2;
    ctx.shadowColor = getChartColor(i);
    ctx.shadowBlur = 10;
    ctx.strokeRect(x, y, barWidth, barHeight);
    ctx.restore();

    // Label
    ctx.fillStyle = CHART_COLORS.text.primary;
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, height - padding - 20);
  });
}

// ادامه برای 73 چارت دیگر...
```

ادامه دارد...

### مرحله 5: ایجاد صفحه اصلی (1 ساعت)

**فایل: `packages/demo-app/src/pages/ColdWarChartsPage.tsx`**

```typescript
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { HudChartFrame } from '../components/hud/HudChartFrame';
import { ColdWarChartTooltip } from '../components/charts/ColdWarChartTooltip';
import { TacticalMotionBackground } from '../components/TacticalMotionBackground';
import * as ChartRenderers from '../components/charts/ColdWarChartRenderer';
import './ColdWarChartsPage.css';

interface ChartConfig {
  id: string;
  title: string;
  description: string;
  category: 'basic' | 'advanced' | 'specialized' | 'scales' | 'scriptable';
  renderer: (options: ChartRenderers.ChartDrawOptions) => void;
  techCode: string;
}

const CHART_CONFIGS: ChartConfig[] = [
  // Basic Charts
  {
    id: 'line',
    title: 'Line Chart',
    description: 'خط‌نمودار پایه',
    category: 'basic',
    renderer: ChartRenderers.drawLineChart,
    techCode: 'LN-001',
  },
  {
    id: 'bar',
    title: 'Bar Chart',
    description: 'نمودار میله‌ای',
    category: 'basic',
    renderer: ChartRenderers.drawBarChart,
    techCode: 'BR-002',
  },
  // ... 73 چارت دیگر
];

export const ColdWarChartsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [animationProgress, setAnimationProgress] = useState(0);
  const [tooltip, setTooltip] = useState<ChartRenderers.TooltipData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});

  // Animation loop
  useEffect(() => {
    let animationFrameId: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % 3000) / 3000;
      setAnimationProgress(progress);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Draw charts
  useEffect(() => {
    Object.entries(canvasRefs.current).forEach(([chartId, canvas]) => {
      if (!canvas) return;

      const config = CHART_CONFIGS.find(c => c.id === chartId);
      if (!config) return;

      config.renderer({
        canvas,
        progress: animationProgress,
        onHover: setTooltip,
      });
    });
  }, [animationProgress]);

  const filteredCharts = CHART_CONFIGS.filter(chart => {
    const matchesCategory = selectedCategory === 'all' || chart.category === selectedCategory;
    const matchesSearch = chart.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chart.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Charts', count: CHART_CONFIGS.length },
    { id: 'basic', label: 'Basic', count: CHART_CONFIGS.filter(c => c.category === 'basic').length },
    { id: 'advanced', label: 'Advanced', count: CHART_CONFIGS.filter(c => c.category === 'advanced').length },
    { id: 'specialized', label: 'Specialized', count: CHART_CONFIGS.filter(c => c.category === 'specialized').length },
    { id: 'scales', label: 'Scales', count: CHART_CONFIGS.filter(c => c.category === 'scales').length },
    { id: 'scriptable', label: 'Scriptable', count: CHART_CONFIGS.filter(c => c.category === 'scriptable').length },
  ];

  return (
    <div className="coldwar-charts-page">
      <TacticalMotionBackground />

      {/* Header */}
      <div className="charts-header">
        <div className="header-content">
          <div className="header-title-section">
            <div className="status-indicator">
              <div className="led-pulse" />
              <span>SYSTEM ACTIVE</span>
            </div>
            <h1 className="page-title">TACTICAL DATA VISUALIZATION</h1>
            <p className="page-subtitle">
              75+ Chart Types • Cold War HUD Style • Real-time Rendering
            </p>
          </div>

          {/* Search */}
          <div className="header-search">
            <input
              type="text"
              placeholder="SEARCH CHARTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`tab-button ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="tab-label">{cat.label}</span>
            <span className="tab-count">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {filteredCharts.map(chart => (
          <HudChartFrame
            key={chart.id}
            title={chart.title}
            techCode={chart.techCode}
            showCorners
            scanlines
            className="chart-card"
          >
            <div className="chart-container">
              <canvas
                ref={el => { if (el) canvasRefs.current[chart.id] = el; }}
                width={600}
                height={400}
                className="chart-canvas"
              />
              <p className="chart-description">{chart.description}</p>
            </div>
          </HudChartFrame>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <ColdWarChartTooltip
          x={tooltip.x}
          y={tooltip.y}
          label={tooltip.label}
          value={tooltip.value}
          color={tooltip.color}
          visible={true}
        />
      )}

      {/* Stats Footer */}
      <div className="charts-footer">
        <div className="footer-stat">
          <span className="stat-label">Total Charts</span>
          <span className="stat-value">{CHART_CONFIGS.length}</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Displayed</span>
          <span className="stat-value">{filteredCharts.length}</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">FPS</span>
          <span className="stat-value">60</span>
        </div>
      </div>
    </div>
  );
};
```

### مرحله 6: استایل‌های صفحه (45 دقیقه)

**فایل: `packages/demo-app/src/pages/ColdWarChartsPage.css`**

```css
.coldwar-charts-page {
  position: relative;
  min-height: 100vh;
  background: #0a0a0c;
  color: #f0a000;
  font-family: 'Share Tech Mono', 'Roboto Mono', monospace;
  overflow-x: hidden;
}

/* ═══════════════════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════════════════ */

.charts-header {
  position: relative;
  z-index: 10;
  padding: 40px 40px 30px;
  background: linear-gradient(
    180deg,
    rgba(10, 10, 12, 0.98) 0%,
    rgba(20, 20, 24, 0.95) 50%,
    transparent 100%
  );
  border-bottom: 2px solid rgba(240, 160, 0, 0.3);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}

.header-title-section {
  flex: 1;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 10px;
  color: rgba(240, 160, 0, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.led-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f0a000;
  box-shadow: 0 0 12px #f0a000;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #f0a000;
  text-shadow:
    0 0 20px rgba(240, 160, 0, 0.6),
    0 0 40px rgba(240, 160, 0, 0.3);
  animation: title-glow 3s ease-in-out infinite;
}

@keyframes title-glow {
  0%,
  100% {
    text-shadow:
      0 0 20px rgba(240, 160, 0, 0.6),
      0 0 40px rgba(240, 160, 0, 0.3);
  }
  50% {
    text-shadow:
      0 0 30px rgba(240, 160, 0, 0.8),
      0 0 60px rgba(240, 160, 0, 0.5);
  }
}

.page-subtitle {
  margin: 0;
  font-size: 12px;
  color: rgba(240, 160, 0, 0.6);
  letter-spacing: 0.05em;
}

.header-search {
  flex-shrink: 0;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(20, 20, 24, 0.8);
  border: 1px solid rgba(240, 160, 0, 0.3);
  color: #f0a000;
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: rgba(240, 160, 0, 0.4);
}

.search-input:focus {
  border-color: #f0a000;
  box-shadow:
    0 0 20px rgba(240, 160, 0, 0.3),
    inset 0 0 10px rgba(240, 160, 0, 0.1);
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY TABS
   ═══════════════════════════════════════════════════════════════ */

.category-tabs {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 8px;
  padding: 20px 40px;
  background: rgba(10, 10, 12, 0.8);
  border-bottom: 1px solid rgba(240, 160, 0, 0.2);
  overflow-x: auto;
}

.tab-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(240, 160, 0, 0.3);
  color: rgba(240, 160, 0, 0.6);
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(240, 160, 0, 0.1);
  transition: left 0.3s ease;
  z-index: -1;
}

.tab-button:hover {
  color: #f0a000;
  border-color: rgba(240, 160, 0, 0.6);
  box-shadow: 0 0 15px rgba(240, 160, 0, 0.2);
}

.tab-button:hover::before {
  left: 0;
}

.tab-button.active {
  color: #f0a000;
  border-color: #f0a000;
  background: rgba(240, 160, 0, 0.15);
  box-shadow:
    0 0 20px rgba(240, 160, 0, 0.4),
    inset 0 0 15px rgba(240, 160, 0, 0.1);
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 20px;
  padding: 0 6px;
  background: rgba(240, 160, 0, 0.2);
  border-radius: 10px;
  font-size: 9px;
  font-weight: 700;
}

.tab-button.active .tab-count {
  background: rgba(240, 160, 0, 0.3);
}

/* ═══════════════════════════════════════════════════════════════
   CHARTS GRID
   ═══════════════════════════════════════════════════════════════ */

.charts-grid {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  gap: 30px;
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.chart-card {
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(240, 160, 0, 0.3);
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-canvas {
  width: 100%;
  height: auto;
  display: block;
}

.chart-description {
  margin: 0;
  padding: 8px 0 0 0;
  font-size: 11px;
  color: rgba(240, 160, 0, 0.6);
  text-align: center;
  letter-spacing: 0.05em;
  border-top: 1px solid rgba(240, 160, 0, 0.1);
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════ */

.charts-footer {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  gap: 60px;
  padding: 30px 40px;
  background: rgba(10, 10, 12, 0.9);
  border-top: 2px solid rgba(240, 160, 0, 0.3);
}

.footer-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 9px;
  color: rgba(240, 160, 0, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #f0a000;
  text-shadow: 0 0 15px rgba(240, 160, 0, 0.6);
}

/* ═══════════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════════ */

@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  }
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .charts-header {
    padding: 30px 20px 20px;
  }

  .header-content {
    flex-direction: column;
  }

  .header-search {
    width: 100%;
  }

  .page-title {
    font-size: 24px;
  }

  .category-tabs {
    padding: 16px 20px;
  }

  .charts-footer {
    gap: 30px;
  }
}
```

ادامه دارد...

## فاز 4: لیست کامل 75+ چارت

### دسته 1: Basic Charts (8 چارت)

1. ✅ Line Chart - خط‌نمودار پایه
2. ✅ Bar Chart - نمودار میله‌ای عمودی
3. ✅ Pie Chart - نمودار دایره‌ای
4. ✅ Doughnut Chart - نمودار حلقه‌ای
5. ✅ Radar Chart - نمودار رادار
6. ✅ Polar Chart - نمودار قطبی
7. ✅ Bubble Chart - نمودار حبابی
8. ✅ Scatter Chart - نمودار پراکندگی

### دسته 2: Advanced Bar Charts (5 چارت)

9. ✅ Bar with Border Radius - میله با گوشه گرد
10. ✅ Floating Bars - میله‌های شناور
11. ✅ Horizontal Bar - میله افقی
12. ✅ Stacked Bar - میله انباشتی
13. ✅ Stacked Grouped Bar - میله انباشتی گروهی

### دسته 3: Advanced Line Charts (6 چارت)

14. ✅ Line Interpolation - خط با درون‌یابی
15. ✅ Multi Axis Line - خط چند محوره
16. ✅ Point Styling - استایل نقاط
17. ✅ Segment Styling - استایل بخش‌ها
18. ✅ Stepped Line - خط پله‌ای
19. ✅ Line Styling - خط با استایل‌های مختلف

### دسته 4: Combo Charts (7 چارت)

20. ✅ Combo Bar/Line - ترکیب میله و خط
21. ✅ Multi Series Pie - دایره چند سری
22. ✅ Polar Area - ناحیه قطبی
23. ✅ Polar Area Centered - ناحیه قطبی با برچسب مرکزی
24. ✅ Radar Skip Points - رادار با نقاط پرشی
25. ✅ Scatter Multi Axis - پراکندگی چند محوره
26. ✅ Stacked Bar/Line - میله/خط انباشتی

### دسته 5: Area Charts (6 چارت)

27. ✅ Area Chart - نمودار ناحیه‌ای
28. ✅ Line with Boundaries - خط با مرزها
29. ✅ Line Multiple Datasets - خط چند مجموعه داده
30. ✅ Line with Time Axis - خط با محور زمانی
31. ✅ Stacked Line - خط انباشتی
32. ✅ Stacked Radar - رادار انباشتی

### دسته 6: Scale Charts (8 چارت)

33. ✅ Linear Scale Min-Max - مقیاس خطی حداقل-حداکثر
34. ✅ Linear Scale Suggested - مقیاس خطی پیشنهادی
35. ✅ Linear Scale Step Size - مقیاس خطی با گام
36. ✅ Log Scale - مقیاس لگاریتمی
37. ✅ Stacked Linear/Category - مقیاس خطی/دسته‌ای انباشتی
38. ✅ Time Scale - مقیاس زمانی
39. ✅ Time Scale Max Span - مقیاس زمانی با بازه حداکثر
40. ✅ Time Scale Combo - مقیاس زمانی ترکیبی

### دسته 7: Scriptable Charts (6 چارت)

41. ✅ Scriptable Bar - میله با اسکریپت
42. ✅ Scriptable Bubble - حباب با اسکریپت
43. ✅ Scriptable Line - خط با اسکریپت
44. ✅ Scriptable Pie - دایره با اسکریپت
45. ✅ Scriptable Polar - قطبی با اسکریپت
46. ✅ Scriptable Radar - رادار با اسکریپت

### دسته 8: Animation Charts (6 چارت)

47. ✅ Progressive Line - خط پیشرونده
48. ✅ Delayed Bar - میله با تاخیر
49. ✅ Loop Animation - انیمیشن حلقه‌ای
50. ✅ Drop Animation - انیمیشن سقوط
51. ✅ Tension Animation - انیمیشن کشش
52. ✅ Easing Showcase - نمایش easing

### دسته 9: Interaction Charts (6 چارت)

53. ✅ Tooltip Callbacks - tooltip با callback
54. ✅ Custom Tooltip - tooltip سفارشی
55. ✅ Point Hit Detection - تشخیص کلیک نقطه
56. ✅ Nearest Point - نزدیک‌ترین نقطه
57. ✅ Axis Mode - حالت محور
58. ✅ Dataset Mode - حالت مجموعه داده

### دسته 10: Legend & Title Charts (6 چارت)

59. ✅ Legend Position - موقعیت راهنما
60. ✅ Legend Alignment - تراز راهنما
61. ✅ Legend Events - رویدادهای راهنما
62. ✅ Title Position - موقعیت عنوان
63. ✅ Title Alignment - تراز عنوان
64. ✅ Subtitle - زیرعنوان

### دسته 11: Grid & Axes Charts (6 چارت)

65. ✅ Grid Configuration - پیکربندی شبکه
66. ✅ Grid Styling - استایل شبکه
67. ✅ Axes Borders - مرزهای محورها
68. ✅ Tick Configuration - پیکربندی تیک‌ها
69. ✅ Axes Styling - استایل محورها
70. ✅ Multiple Y Axes - محورهای Y چندگانه

### دسته 12: Special Charts (5+ چارت)

71. ✅ Mixed Chart Types - انواع ترکیبی
72. ✅ Financial Chart - نمودار مالی
73. ✅ Gantt Chart - نمودار گانت
74. ✅ Waterfall Chart - نمودار آبشاری
75. ✅ Funnel Chart - نمودار قیفی
    76+ ✅ سایر انواع...

## فاز 5: چک‌لیست پیاده‌سازی

### مرحله 1: آماده‌سازی (1 ساعت)

- [ ] ایجاد فایل `coldWarChartColors.ts`
- [ ] ایجاد فایل `ColdWarChartTooltip.tsx`
- [ ] ایجاد فایل `ColdWarChartTooltip.css`
- [ ] ایجاد فایل `HudChartFrame.tsx`
- [ ] ایجاد فایل `HudChartFrame.css`

### مرحله 2: توابع رسم (4 ساعت)

- [ ] پیاده‌سازی 8 چارت Basic
- [ ] پیاده‌سازی 5 چارت Advanced Bar
- [ ] پیاده‌سازی 6 چارت Advanced Line
- [ ] پیاده‌سازی 7 چارت Combo
- [ ] پیاده‌سازی 6 چارت Area
- [ ] پیاده‌سازی 8 چارت Scale
- [ ] پیاده‌سازی 6 چارت Scriptable
- [ ] پیاده‌سازی 6 چارت Animation
- [ ] پیاده‌سازی 6 چارت Interaction
- [ ] پیاده‌سازی 6 چارت Legend
- [ ] پیاده‌سازی 6 چارت Grid
- [ ] پیاده‌سازی 5+ چارت Special

### مرحله 3: صفحه اصلی (2 ساعت)

- [ ] ایجاد `ColdWarChartsPage.tsx`
- [ ] ایجاد `ColdWarChartsPage.css`
- [ ] پیاده‌سازی سیستم فیلتر
- [ ] پیاده‌سازی سیستم جستجو
- [ ] پیاده‌سازی انیمیشن‌ها

### مرحله 4: یکپارچگی (30 دقیقه)

- [ ] اضافه کردن به `App.tsx`
- [ ] اضافه کردن به `Navbar.tsx`
- [ ] تست تمام چارت‌ها
- [ ] بهینه‌سازی عملکرد

### مرحله 5: مستندات (30 دقیقه)

- [ ] ایجاد فایل README
- [ ] ایجاد فایل GUIDE
- [ ] ایجاد نمونه‌های کد

## فاز 6: نکات مهم پیاده‌سازی

### 1. رنگ‌ها

```typescript
// همیشه از رنگ‌های Cold War HUD استفاده کنید
import { COLD_WAR_HUD_COLORS } from '@rhuds/core';

// نه این:
const color = '#FF0000';

// بلکه این:
const color = COLD_WAR_HUD_COLORS.RED.hex;
```

### 2. فونت‌ها

```css
/* همیشه از فونت‌های Monospace استفاده کنید */
font-family: 'Share Tech Mono', 'Roboto Mono', monospace;
```

### 3. انیمیشن‌ها

```typescript
// از easing functions استفاده کنید
const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);
```

### 4. Tooltip

```typescript
// همیشه tooltip را پیاده‌سازی کنید
onHover: (data: TooltipData | null) => void;
```

### 5. Grid

```typescript
// Grid باید با رنگ‌های HUD باشد
drawHudGrid(ctx, width, height, padding, {
  color: CHART_COLORS.grid.main,
  dashPattern: [2, 2],
});
```

### 6. Corner Brackets

```css
/* همیشه corner brackets اضافه کنید */
.hud-corner {
  border-color: rgba(240, 160, 0, 0.8);
  border-style: solid;
}
```

### 7. Scanlines

```css
/* Scanlines برای احساس HUD */
background: repeating-linear-gradient(
  0deg,
  transparent,
  transparent 2px,
  rgba(240, 160, 0, 0.02) 2px,
  rgba(240, 160, 0, 0.02) 4px
);
```

### 8. Glow Effects

```css
/* Glow برای عناصر مهم */
box-shadow: 0 0 20px rgba(240, 160, 0, 0.3);
text-shadow: 0 0 15px rgba(240, 160, 0, 0.6);
```

## فاز 7: تست و بهینه‌سازی

### تست‌های لازم

1. ✅ تست تمام 75+ چارت
2. ✅ تست Tooltip در تمام چارت‌ها
3. ✅ تست انیمیشن‌ها
4. ✅ تست Responsive
5. ✅ تست عملکرد (60 FPS)
6. ✅ تست در مرورگرهای مختلف

### بهینه‌سازی‌ها

1. ✅ استفاده از Canvas برای رسم
2. ✅ استفاده از RequestAnimationFrame
3. ✅ Debounce برای رویدادهای Mouse
4. ✅ Lazy Loading برای چارت‌ها
5. ✅ Memoization برای محاسبات

## فاز 8: مستندات نهایی

### فایل‌های مستندات

1. `COLDWAR_CHARTS_README.md` - راهنمای کلی
2. `COLDWAR_CHARTS_API.md` - مستندات API
3. `COLDWAR_CHARTS_EXAMPLES.md` - نمونه‌های کد
4. `COLDWAR_CHARTS_CUSTOMIZATION.md` - راهنمای سفارشی‌سازی

## خلاصه زمان‌بندی

| مرحله      | زمان تخمینی | توضیحات             |
| ---------- | ----------- | ------------------- |
| آماده‌سازی | 1 ساعت      | ایجاد فایل‌های پایه |
| توابع رسم  | 4 ساعت      | پیاده‌سازی 75+ چارت |
| صفحه اصلی  | 2 ساعت      | UI و UX             |
| یکپارچگی   | 30 دقیقه    | اتصال به سیستم      |
| تست        | 1 ساعت      | تست کامل            |
| مستندات    | 30 دقیقه    | نوشتن راهنماها      |
| **جمع کل** | **9 ساعت**  | **پیاده‌سازی کامل** |

## نتیجه‌گیری

این نقشه شامل تمام جزئیات لازم برای پیاده‌سازی کامل صفحه Cold War Charts است. با دنبال کردن این مراحل، یک صفحه حرفه‌ای و کامل با:

✅ 75+ نوع چارت مختلف
✅ استایل واقعی Cold War HUD
✅ Tooltip های تعاملی
✅ انیمیشن‌های صاف
✅ عملکرد بهینه
✅ Responsive Design
✅ مستندات کامل

خواهید داشت.

---

**آماده برای شروع پیاده‌سازی؟**

بیایید مرحله به مرحله پیش برویم! 🚀
