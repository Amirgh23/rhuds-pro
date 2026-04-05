# تول‌تیپ‌های چارت Cold War - تشخیص دقیق نقاط داده ✅

## خلاصه تغییرات

تول‌تیپ‌ها اکنون **فقط هنگام هاور مستقیم روی نقاط داده** نمایش داده می‌شوند، دقیقاً مانند چارت‌های RHUDS.

## فایل‌های تغییر یافته

### 1. `ColdWarChartsTooltipLogic.ts` (جدید)

**مسیر**: `packages/demo-app/src/pages/ColdWarChartsTooltipLogic.ts`

فایل جدید حاوی منطق تشخیص دقیق نقاط:

```typescript
// تابع اصلی: isNearDataPoint
// بررسی می‌کند که آیا موس نزدیک یک نقطه داده واقعی است یا خیر
```

**منطق تشخیص برای هر نوع چارت:**

- **Bar Charts**: تشخیص فقط روی مستطیل‌های میله
- **Line Charts**: تشخیص در شعاع 10 پیکسل از نقاط داده
- **Pie/Doughnut**: تشخیص داخل برش‌های دایره
- **Radar/Polar**: تشخیص در شعاع 15 پیکسل از رئوس
- **Scatter/Bubble**: تشخیص داخل شعاع حباب‌ها

### 2. `ColdWarChartsPage.tsx` (به‌روزرسانی)

**مسیر**: `packages/demo-app/src/pages/ColdWarChartsPage.tsx`

**تغییرات:**

1. **Import جدید**:

```typescript
import { isNearDataPoint } from './ColdWarChartsTooltipLogic';
```

2. **حذف تابع `getTooltipContent` قدیمی** (120+ خط کد حذف شد)

3. **به‌روزرسانی `handleCanvasMouseMove`**:

```typescript
const handleCanvasMouseMove = useCallback(
  (e: React.MouseEvent<HTMLCanvasElement>, chartId: string) => {
    const canvas = e.currentTarget;
    const x = e.clientX;
    const y = e.clientY;

    // Get chart type from id
    const chartType = chartId as ChartType;

    // Check if mouse is near a data point (STRICT detection)
    const dataPoint = isNearDataPoint(chartId, chartType, x, y, canvas);

    if (dataPoint) {
      setTooltip({
        visible: true,
        x,
        y,
        label: dataPoint.label,
        value: dataPoint.value,
        color: dataPoint.color,
        chartId,
      });
    } else {
      setTooltip(null); // هیچ تول‌تیپی اگر روی نقطه داده نباشد
    }
  },
  []
);
```

4. **به‌روزرسانی JSX تول‌تیپ**:

```tsx
{tooltip && tooltip.visible && (
  <div className="chart-tooltip" style={{...}}>
    <div className="tooltip-label">{tooltip.label}</div>
    <div className="tooltip-value" style={{ color: tooltip.color }}>
      {tooltip.value}
    </div>
  </div>
)}
```

### 3. `ColdWarChartsPage.css` (به‌روزرسانی)

**مسیر**: `packages/demo-app/src/pages/ColdWarChartsPage.css`

**استایل‌های جدید برای label و value:**

```css
.tooltip-label {
  font-size: 10px;
  color: rgba(240, 160, 0, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.tooltip-value {
  font-size: 14px;
  font-weight: 700;
  color: #f0a000;
  text-shadow: 0 0 10px rgba(240, 160, 0, 0.5);
}
```

## رفتار جدید

### قبل از تغییرات ❌

- تول‌تیپ روی **هر نقطه از canvas** نمایش داده می‌شد
- مقادیر بر اساس موقعیت موس محاسبه می‌شد (نه داده واقعی)
- تول‌تیپ همیشه visible بود

### بعد از تغییرات ✅

- تول‌تیپ **فقط روی نقاط داده واقعی** نمایش داده می‌شود
- مقادیر از داده واقعی چارت می‌آیند
- تول‌تیپ فقط هنگام هاور روی data point ظاهر می‌شود
- ساختار مانند RHUDS: label جداگانه + value رنگی

## مثال‌های تشخیص

### Bar Chart

```
█████  ← تول‌تیپ فقط اینجا
█████
█████
─────
```

### Line Chart

```
    ●  ← تول‌تیپ در شعاع 10px
   /
  ●
 /
●
```

### Pie Chart

```
   ╱─╲
  │ ● │ ← تول‌تیپ داخل برش
   ╲─╱
```

## تست

✅ TypeScript: بدون خطا
✅ Import: صحیح
✅ منطق تشخیص: پیاده‌سازی شده برای همه انواع چارت
✅ استایل: مطابق با Cold War HUD

## نتیجه

تول‌تیپ‌ها اکنون دقیقاً مانند چارت‌های RHUDS عمل می‌کنند:

- تشخیص دقیق نقاط داده
- نمایش label و value جداگانه
- فقط روی داده‌های واقعی نمایش داده می‌شوند
- استایل Cold War HUD با رنگ طلایی و glow effect

**وضعیت**: ✅ کامل و آماده تست
