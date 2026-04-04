# راهنمای کامل رفع مشکلات Charts Showcase

## 🎯 خلاصه مشکلات و راه‌حل‌ها

### مشکل 1: Tooltip نمایش داده نمی‌شود

**علت**: Mouse event handlers به canvas elements اضافه نشده‌اند
**راه‌حل**: اضافه کردن `onMouseMove` و `onMouseLeave` به تمام canvas elements

### مشکل 2: Hit Detection وجود ندارد

**علت**: توابع تشخیص موقعیت mouse پیاده‌سازی نشده‌اند
**راه‌حل**: اضافه کردن توابع `detectHit` برای هر نوع نمودار

### مشکل 3: Tooltip Component نمایش داده نمی‌شود

**علت**: JSX برای نمایش tooltip وجود ندارد
**راه‌حل**: اضافه کردن tooltip component به JSX

## 📝 تغییرات مورد نیاز

### تغییر 1: تکمیل تابع `handleMouseMove`

**مکان**: خط ~980 (بعد از تعریف `easeInOutCubic`)

**کد فعلی** (ناقص):

```typescript
const handleMouseMove = (
  event: React.MouseEvent<HTMLCanvasElement>,
  chartType: string,
  data: any[],
  labels?: string[]
) => {
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Hit detection based on chart type
  const hitResult = detectHit(canvas, mouseX, mouseY, chartType, data, labels);

  if (hitResult) {
    setTooltip({
      x: event.clientX,
      y: event.clientY,
```

**کد جدید** (کامل):

```typescript
// Mouse event handlers for tooltip
const handleMouseMove = (
  event: React.MouseEvent<HTMLCanvasElement>,
  chartType: string,
  data: any,
  labels: string[] = []
) => {
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Hit detection based on chart type
  const hitResult = detectHit(canvas, mouseX, mouseY, chartType, data, labels);

  if (hitResult) {
    setTooltip({
      x: event.clientX,
      y: event.clientY,
      label: hitResult.label,
      value:
        typeof hitResult.value === 'object'
          ? `X: ${hitResult.value.x}, Y: ${hitResult.value.y}`
          : hitResult.value.toString(),
      color: hitResult.color,
      visible: true,
    });
  } else {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }
};

const handleMouseLeave = () => {
  setTooltip((prev) => ({ ...prev, visible: false }));
};
```

### تغییر 2: اضافه کردن تابع `detectHit`

**مکان**: بعد از `handleMouseLeave` (خط ~1010)

**کد جدید**:

```typescript
// Hit detection function
const detectHit = (
  canvas: HTMLCanvasElement,
  mouseX: number,
  mouseY: number,
  chartType: string,
  data: any,
  labels: string[]
): { index: number; value: any; label: string; color: string } | null => {
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  switch (chartType) {
    case 'line': {
      const maxValue = Math.max(...data, 100);
      const minValue = Math.min(...data, 0);
      const range = maxValue - minValue;
      const hitRadius = 10;

      for (let i = 0; i < data.length; i++) {
        const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
        const normalizedValue = (data[i] - minValue) / range;
        const y = height - padding - 30 - normalizedValue * (height - 2 * padding - 30);
        const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);

        if (distance <= hitRadius) {
          return {
            index: i,
            value: data[i],
            label: labels[i] || `Point ${i + 1}`,
            color: colors.primary,
          };
        }
      }
      break;
    }

    case 'bar': {
      const maxValue = Math.max(...data, 100);
      const barWidth = ((width - 2 * padding) / data.length) * 0.8;
      const barSpacing = (width - 2 * padding) / data.length;

      for (let i = 0; i < data.length; i++) {
        const x = padding + i * barSpacing + (barSpacing - barWidth) / 2;
        const barHeight = (data[i] / maxValue) * (height - 2 * padding - 30);
        const y = height - padding - 30 - barHeight;

        if (
          mouseX >= x &&
          mouseX <= x + barWidth &&
          mouseY >= y &&
          mouseY <= height - padding - 30
        ) {
          return {
            index: i,
            value: data[i],
            label: labels[i] || `Bar ${i + 1}`,
            color: colors.primary,
          };
        }
      }
      break;
    }

    case 'pie':
    case 'doughnut': {
      const centerX = width / 2;
      const centerY = height / 2 + 10;
      const outerRadius = Math.min(width, height) / 3;
      const innerRadius = chartType === 'doughnut' ? outerRadius * 0.6 : 0;

      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > outerRadius || distance < innerRadius) return null;

      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += 2 * Math.PI;
      angle = (angle + Math.PI / 2) % (2 * Math.PI);

      const total = data.reduce((sum: number, val: number) => sum + val, 0);
      let currentAngle = 0;

      for (let i = 0; i < data.length; i++) {
        const sliceAngle = (data[i] / total) * 2 * Math.PI;

        if (angle >= currentAngle && angle < currentAngle + sliceAngle) {
          const sliceColors = [colors.primary, colors.secondary, '#FF006E', '#FFD60A', '#00FF00'];
          return {
            index: i,
            value: data[i],
            label: labels[i] || `Slice ${i + 1}`,
            color: sliceColors[i % sliceColors.length],
          };
        }

        currentAngle += sliceAngle;
      }
      break;
    }

    case 'radar': {
      const centerX = width / 2;
      const centerY = height / 2 + 10;
      const radius = Math.min(width, height) / 3;
      const maxValue = Math.max(...data, 100);
      const hitRadius = 10;

      for (let i = 0; i < data.length; i++) {
        const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
        const distance = (data[i] / maxValue) * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        const dist = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);

        if (dist <= hitRadius) {
          return {
            index: i,
            value: data[i],
            label: labels[i] || `Point ${i + 1}`,
            color: colors.primary,
          };
        }
      }
      break;
    }

    case 'polar': {
      const centerX = width / 2;
      const centerY = height / 2 + 10;
      const maxRadius = Math.min(width, height) / 3;
      const maxValue = Math.max(...data, 100);

      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += 2 * Math.PI;
      angle = (angle + Math.PI / 2) % (2 * Math.PI);

      const segmentAngle = (2 * Math.PI) / data.length;
      const segmentIndex = Math.floor(angle / segmentAngle);

      if (segmentIndex >= 0 && segmentIndex < data.length) {
        const segmentRadius = (data[segmentIndex] / maxValue) * maxRadius;

        if (distance <= segmentRadius) {
          const segmentColors = [colors.primary, colors.secondary, '#FF006E', '#FFD60A', '#00FF00'];
          return {
            index: segmentIndex,
            value: data[segmentIndex],
            label: labels[segmentIndex] || `Segment ${segmentIndex + 1}`,
            color: segmentColors[segmentIndex % segmentColors.length],
          };
        }
      }
      break;
    }

    case 'bubble': {
      for (let i = 0; i < data.length; i++) {
        const bubble = data[i];
        const x = padding + (bubble.x / 100) * (width - 2 * padding);
        const y = height - padding - 30 - (bubble.y / 100) * (height - 2 * padding - 30);
        const r = (bubble.r / 30) * 20 + 5;
        const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);

        if (distance <= r) {
          return {
            index: i,
            value: bubble,
            label: bubble.label || `Bubble ${i + 1}`,
            color: colors.primary,
          };
        }
      }
      break;
    }

    case 'scatter': {
      const xValues = data.map((p: any) => p.x);
      const yValues = data.map((p: any) => p.y);
      const maxX = Math.max(...xValues);
      const maxY = Math.max(...yValues);
      const hitRadius = 10;

      for (let i = 0; i < data.length; i++) {
        const x = padding + (data[i].x / maxX) * (width - 2 * padding);
        const y = height - padding - 30 - (data[i].y / maxY) * (height - 2 * padding - 30);
        const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);

        if (distance <= hitRadius) {
          return {
            index: i,
            value: data[i],
            label: labels[i] || `Point ${i + 1}`,
            color: colors.primary,
          };
        }
      }
      break;
    }
  }

  return null;
};
```

### تغییر 3: اضافه کردن Tooltip Component به JSX

**مکان**: بعد از `</div>` اصلی component، قبل از `export default`

**کد جدید**:

```tsx
      {/* Tooltip Component */}
      {tooltip.visible && (
        <div
          className="chart-tooltip"
          style={{
            position: 'fixed',
            left: tooltip.x + 10,
            top: tooltip.y - 50,
            background: 'rgba(0, 0, 0, 0.95)',
            border: `2px solid ${tooltip.color}`,
            borderRadius: '6px',
            padding: '10px 14px',
            color: tooltip.color,
            fontSize: '13px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            pointerEvents: 'none',
            zIndex: 10000,
            boxShadow: `0 0 15px ${tooltip.color}66, 0 4px 6px rgba(0,0,0,0.3)`,
            backdropFilter: 'blur(4px)',
            animation: 'tooltipFadeIn 0.2s ease-out',
          }}
        >
          <div style={{ marginBottom: '4px', fontSize: '14px' }}>{tooltip.label}</div>
          <div style={{ opacity: 0.9 }}>Value: {tooltip.value}</div>
        </div>
      )}
    </div>
  );
};

export default ChartsShowcase;
```

### تغییر 4: اضافه کردن CSS برای Tooltip Animation

**مکان**: فایل `ChartsShowcase.css`

**کد جدید**:

```css
@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chart-tooltip {
  transition: all 0.1s ease-out;
}
```

### تغییر 5: اضافه کردن Mouse Events به Canvas Elements

**مکان**: در JSX، برای هر canvas element

**مثال برای Line Chart**:

```tsx
<canvas
  ref={lineChartRef}
  onMouseMove={(e) =>
    handleMouseMove(e, 'line', [65, 59, 80, 81, 56, 55], ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'])
  }
  onMouseLeave={handleMouseLeave}
  style={{ cursor: 'crosshair' }}
></canvas>
```

**مثال برای Bar Chart**:

```tsx
<canvas
  ref={barChartRef}
  onMouseMove={(e) =>
    handleMouseMove(
      e,
      'bar',
      [12, 19, 3, 5, 2, 3],
      ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']
    )
  }
  onMouseLeave={handleMouseLeave}
  style={{ cursor: 'crosshair' }}
></canvas>
```

**مثال برای Pie Chart**:

```tsx
<canvas
  ref={pieChartRef}
  onMouseMove={(e) =>
    handleMouseMove(e, 'pie', [30, 50, 100, 40, 120], ['Red', 'Blue', 'Yellow', 'Green', 'Purple'])
  }
  onMouseLeave={handleMouseLeave}
  style={{ cursor: 'pointer' }}
></canvas>
```

## 🔧 تغییرات اضافی برای بهبود

### بهبود 1: اضافه کردن Data Arrays

**مکان**: بعد از تعریف `barDatasets`

```typescript
// Data arrays for charts
const lineData = [65, 59, 80, 81, 56, 55];
const lineLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const barData = [12, 19, 3, 5, 2, 3];
const barLabels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

const pieData = [30, 50, 100, 40, 120];
const pieLabels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple'];

const doughnutData = [30, 50, 100, 40, 120];
const doughnutLabels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple'];

const radarData = [65, 59, 90, 81, 56, 55, 40];
const radarLabels = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

const polarData = [11, 16, 7, 3, 14];
const polarLabels = ['Red', 'Green', 'Yellow', 'Grey', 'Blue'];

const bubbleData = [
  { x: 20, y: 30, r: 15, label: 'Bubble 1' },
  { x: 40, y: 10, r: 10, label: 'Bubble 2' },
  { x: 60, y: 50, r: 20, label: 'Bubble 3' },
  { x: 80, y: 70, r: 12, label: 'Bubble 4' },
  { x: 30, y: 80, r: 18, label: 'Bubble 5' },
];

const scatterData = [
  { x: 10, y: 20 },
  { x: 15, y: 10 },
  { x: 26, y: 12 },
  { x: 30, y: 25 },
  { x: 40, y: 30 },
  { x: 50, y: 45 },
  { x: 60, y: 40 },
  { x: 70, y: 55 },
  { x: 80, y: 60 },
  { x: 90, y: 70 },
];
const scatterLabels = scatterData.map((_, i) => `Point ${i + 1}`);
```

### بهبود 2: اضافه کردن Cursor Styles

**مکان**: در CSS

```css
.chart-container canvas {
  cursor: crosshair;
}

.chart-container canvas:hover {
  cursor: pointer;
}
```

## ✅ چک‌لیست پیاده‌سازی

- [ ] تکمیل تابع `handleMouseMove`
- [ ] اضافه کردن تابع `handleMouseLeave`
- [ ] اضافه کردن تابع `detectHit`
- [ ] اضافه کردن Tooltip Component به JSX
- [ ] اضافه کردن CSS Animation
- [ ] اضافه کردن Mouse Events به Line Chart
- [ ] اضافه کردن Mouse Events به Bar Chart
- [ ] اضافه کردن Mouse Events به Pie Chart
- [ ] اضافه کردن Mouse Events به Doughnut Chart
- [ ] اضافه کردن Mouse Events به Radar Chart
- [ ] اضافه کردن Mouse Events به Polar Chart
- [ ] اضافه کردن Mouse Events به Bubble Chart
- [ ] اضافه کردن Mouse Events به Scatter Chart
- [ ] تست در مرورگر
- [ ] بررسی Diagnostics

## 🎯 نتیجه نهایی

بعد از اعمال این تغییرات:

- ✅ Tooltip با hover روی نمودارها نمایش داده می‌شود
- ✅ Hit detection برای تمام انواع نمودارها کار می‌کند
- ✅ انیمیشن smooth برای tooltip
- ✅ Cursor style مناسب
- ✅ تجربه کاربری بهتر

---

**تاریخ**: 31 مارس 2026
**وضعیت**: 📋 آماده پیاده‌سازی
