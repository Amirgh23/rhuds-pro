# راهنمای عیب‌یابی Charts Showcase

## 🔍 راهنمای حل مشکلات رایج

این مستند راهنمای کاملی برای شناسایی و رفع مشکلات احتمالی در Charts Showcase ارائه می‌دهد.

## 📋 فهرست مشکلات رایج

### 1. چارت‌ها نمایش داده نمی‌شوند

#### علائم:

- صفحه سفید یا خالی
- canvas elements خالی هستند
- هیچ نموداری رسم نمی‌شود

#### راه‌حل‌ها:

**A. بررسی Console Errors**

```javascript
// باز کردن Developer Tools
F12 یا Ctrl+Shift+I

// بررسی Console برای خطاها
```

**B. بررسی Refs**

```typescript
// اطمینان از تعریف همه refs
const lineChartRef = useRef<HTMLCanvasElement>(null);
const barChartRef = useRef<HTMLCanvasElement>(null);
// ... و بقیه refs
```

**C. بررسی useEffect**

```typescript
// اطمینان از فراخوانی همه drawing functions
useEffect(() => {
  if (lineChartRef.current) {
    drawLineChart(lineChartRef.current, animationProgress);
  }
  // ... و بقیه فراخوانی‌ها
}, [variant, animationProgress]);
```

**D. بررسی JSX**

```tsx
// اطمینان از وجود canvas elements
<canvas ref={lineChartRef}></canvas>
```

### 2. انیمیشن‌ها کار نمی‌کنند

#### علائم:

- چارت‌ها بدون انیمیشن نمایش داده می‌شوند
- دکمه Replay کار نمی‌کند
- Progress indicator حرکت نمی‌کند

#### راه‌حل‌ها:

**A. بررسی Animation State**

```typescript
// بررسی state های انیمیشن
const [isAnimating, setIsAnimating] = useState<boolean>(true);
const [isPaused, setIsPaused] = useState<boolean>(false);
const [animationProgress, setAnimationProgress] = useState<number>(0);
```

**B. بررسی Animation Loop**

```typescript
useEffect(() => {
  if (!isAnimating || isPaused) return;

  const animate = () => {
    const elapsed = Date.now() - startTimeRef.current - totalPausedTimeRef.current;
    const duration = 1500;
    const progress = Math.min(1, elapsed / duration);
    const easedProgress = easeOutQuart(progress);

    setAnimationProgress(easedProgress);

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
    }
  };

  animationFrameRef.current = requestAnimationFrame(animate);

  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
}, [isAnimating, isPaused]);
```

**C. بررسی Easing Function**

```typescript
// اطمینان از تعریف easeOutQuart
const easeOutQuart = (t: number): number => {
  return 1 - Math.pow(1 - t, 4);
};
```

### 3. تم‌ها تغییر نمی‌کنند

#### علائم:

- دکمه‌های تم کار نمی‌کنند
- رنگ‌ها تغییر نمی‌کنند
- همه چارت‌ها یک رنگ دارند

#### راه‌حل‌ها:

**A. بررسی Variant State**

```typescript
const [variant, setVariant] = useState<ChartVariant>('r-huds');
```

**B. بررسی Colors Object**

```typescript
const colors =
  variant === 'r-huds'
    ? {
        primary: '#29F2DF',
        secondary: '#FF006E',
        tertiary: '#8338EC',
        quaternary: '#FFBE0B',
        quinary: '#FB5607',
      }
    : {
        primary: '#00FF00',
        secondary: '#FFFF00',
        tertiary: '#FF0000',
        quaternary: '#00FFFF',
        quinary: '#FF00FF',
      };
```

**C. بررسی Theme Buttons**

```tsx
<button
  className={variant === 'r-huds' ? 'active' : ''}
  onClick={() => setVariant('r-huds')}
>
  RHUDS Theme
</button>
<button
  className={variant === 'coldwar' ? 'active' : ''}
  onClick={() => setVariant('coldwar')}
>
  ColdWar Theme
</button>
```

**D. بررسی useEffect Reset**

```typescript
// اطمینان از reset انیمیشن با تغییر تم
useEffect(() => {
  startTimeRef.current = Date.now();
  totalPausedTimeRef.current = 0;
  pausedTimeRef.current = 0;
  setAnimationProgress(0);
  setIsAnimating(true);
  setIsPaused(false);
}, [variant]);
```

### 4. Tooltip نمایش داده نمی‌شود

#### علائم:

- hover روی چارت‌ها tooltip نشان نمی‌دهد
- tooltip در جای اشتباه نمایش داده می‌شود
- محتوای tooltip خالی است

#### راه‌حل‌ها:

**A. بررسی Tooltip State**

```typescript
const [tooltip, setTooltip] = useState<TooltipData>({
  x: 0,
  y: 0,
  label: '',
  value: '',
  color: '',
  visible: false,
});
```

**B. بررسی Mouse Event Handlers**

```typescript
const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
  const canvas = e.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Hit detection logic
  // ...

  setTooltip({
    x: e.clientX,
    y: e.clientY,
    label: 'Label',
    value: 'Value',
    color: colors.primary,
    visible: true,
  });
};
```

**C. بررسی Tooltip Rendering**

```typescript
// در drawing function
if (progress > 0.7) {
  const tooltipAlpha = Math.min(1, (progress - 0.7) / 0.3);
  ctx.globalAlpha = tooltipAlpha;

  // Tooltip background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

  // Tooltip text
  ctx.fillStyle = colors.primary;
  ctx.fillText(label, tooltipX + tooltipWidth / 2, tooltipY + 20);

  ctx.globalAlpha = 1;
}
```

### 5. Export کار نمی‌کند

#### علائم:

- دکمه Export هیچ کاری نمی‌کند
- فایل دانلود نمی‌شود
- خطای "Failed to export" نمایش داده می‌شود

#### راه‌حل‌ها:

**A. بررسی Export Function**

```typescript
const exportToPNG = (canvasRef: React.RefObject<HTMLCanvasElement>, filename: string) => {
  if (!canvasRef.current) return;

  try {
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
    });
  } catch (error) {
    console.error('Export to PNG failed:', error);
  }
};
```

**B. بررسی Canvas Ref**

```typescript
// اطمینان از اینکه ref به canvas متصل است
if (!canvasRef.current) {
  console.error('Canvas ref is null');
  return;
}
```

**C. بررسی Browser Support**

```typescript
// بررسی پشتیبانی مرورگر از toBlob
if (!HTMLCanvasElement.prototype.toBlob) {
  console.error('Browser does not support canvas.toBlob()');
  return;
}
```

### 6. رنگ‌ها اشتباه نمایش داده می‌شوند

#### علائم:

- رنگ‌ها سیاه یا سفید هستند
- گرادیانت‌ها کار نمی‌کنند
- خطای "Failed to parse color" در console

#### راه‌حل‌ها:

**A. بررسی Color Format**

```typescript
// استفاده از فرمت صحیح رنگ
const color = '#00F5FF'; // ✅ Hex
const color = 'rgb(0, 245, 255)'; // ✅ RGB
const color = 'rgba(0, 245, 255, 0.5)'; // ✅ RGBA
const color = 'hsl(0, 70%, 60%)88'; // ❌ Invalid
```

**B. بررسی Gradient Creation**

```typescript
// ایجاد صحیح gradient
const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
gradient.addColorStop(0, `${colors.primary}88`); // ✅ با alpha
gradient.addColorStop(1, `${colors.primary}FF`); // ✅ با alpha
ctx.fillStyle = gradient;
```

**C. رفع باگ HSL**

```typescript
// به جای HSL از رنگ‌های از پیش تعریف شده استفاده کنید
const sliceColors = [colors.primary, colors.secondary, '#FF006E', '#FFD60A', '#00FF00'];
```

### 7. چارت‌ها Responsive نیستند

#### علائم:

- چارت‌ها با تغییر اندازه window resize نمی‌شوند
- چارت‌ها از container بیرون می‌زنند
- نسبت ابعاد حفظ نمی‌شود

#### راه‌حل‌ها:

**A. بررسی Resize Handler**

```typescript
useEffect(() => {
  const handleResize = () => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      setChartDimensions({ width, height: 300 });
    }
  };

  handleResize();
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

**B. بررسی Canvas Size**

```typescript
// در useEffect
if (lineChartRef.current) {
  lineChartRef.current.width = lineChartRef.current.parentElement?.clientWidth || 400;
  lineChartRef.current.height = 300;
  drawLineChart(lineChartRef.current, animationProgress);
}
```

**C. بررسی CSS**

```css
.chart-container {
  width: 100%;
  height: 300px;
  position: relative;
}

.chart-container canvas {
  width: 100%;
  height: 100%;
}
```

### 8. Performance مشکل دارد

#### علائم:

- انیمیشن‌ها لگ دارند
- صفحه کند است
- CPU usage بالا است

#### راه‌حل‌ها:

**A. بررسی Animation Frame**

```typescript
// استفاده از requestAnimationFrame
animationFrameRef.current = requestAnimationFrame(animate);

// Cleanup در return
return () => {
  if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current);
  }
};
```

**B. بررسی Drawing Optimization**

```typescript
// فقط زمانی که progress تغییر کند رسم کنید
useEffect(() => {
  // Drawing logic
}, [variant, animationProgress]); // Dependencies
```

**C. بررسی Data Decimation**

```typescript
// کاهش تعداد نقاط برای dataset های بزرگ
const decimateData = (data: number[], maxPoints: number = 100) => {
  if (data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0);
};
```

## 🛠️ ابزارهای عیب‌یابی

### 1. Chrome DevTools

**باز کردن:**

- F12 یا Ctrl+Shift+I (Windows/Linux)
- Cmd+Option+I (Mac)

**تب‌های مفید:**

- **Console**: برای دیدن خطاها و logs
- **Elements**: برای بررسی DOM و styles
- **Performance**: برای بررسی عملکرد
- **Network**: برای بررسی درخواست‌ها

### 2. React DevTools

**نصب:**

```bash
# Chrome Extension
https://chrome.google.com/webstore/detail/react-developer-tools/
```

**استفاده:**

- بررسی component tree
- بررسی props و state
- بررسی hooks

### 3. TypeScript Compiler

**بررسی خطاها:**

```bash
# در terminal
npm run type-check
# یا
tsc --noEmit
```

### 4. ESLint

**بررسی کیفیت کد:**

```bash
npm run lint
```

## 📊 چک‌لیست عیب‌یابی

قبل از گزارش مشکل، این موارد را بررسی کنید:

- [ ] Console errors بررسی شده
- [ ] همه refs تعریف شده‌اند
- [ ] همه drawing functions پیاده‌سازی شده‌اند
- [ ] useEffect dependencies صحیح هستند
- [ ] JSX elements کامل هستند
- [ ] CSS files import شده‌اند
- [ ] Browser cache پاک شده
- [ ] Node modules به‌روز هستند
- [ ] TypeScript errors رفع شده‌اند
- [ ] ESLint warnings بررسی شده‌اند

## 🔄 مراحل Reset کامل

اگر مشکل همچنان ادامه دارد:

```bash
# 1. پاک کردن node_modules
rm -rf node_modules

# 2. پاک کردن cache
npm cache clean --force

# 3. نصب مجدد dependencies
npm install

# 4. پاک کردن build
rm -rf dist

# 5. Build مجدد
npm run build

# 6. اجرای dev server
npm run dev
```

## 📞 دریافت کمک

اگر مشکل حل نشد:

1. **بررسی مستندات:**
   - `CHARTS_COMPLETE_STATUS_AND_GUIDE_FA.md`
   - `TOOLTIP_SCRIPTABLE_ANIMATIONS_COMPLETE_FA.md`
   - `CHARTS_HSL_COLOR_BUG_FIX_FA.md`

2. **جمع‌آوری اطلاعات:**
   - Screenshot از مشکل
   - Console errors
   - Browser و version
   - OS و version
   - مراحل بازتولید مشکل

3. **گزارش مشکل:**
   - توضیح دقیق مشکل
   - مراحل بازتولید
   - رفتار مورد انتظار
   - رفتار واقعی

## ✅ تست نهایی

برای اطمینان از عملکرد صحیح:

```typescript
// 1. بررسی تعداد refs
console.log('Total refs:', 75);

// 2. بررسی تعداد drawing functions
console.log('Total drawing functions:', 75);

// 3. بررسی تعداد JSX cards
console.log('Total JSX cards:', 75);

// 4. بررسی diagnostics
// 0 errors, 0 warnings

// 5. بررسی browser console
// No errors
```

---

**تاریخ**: 31 مارس 2026
**نسخه**: 1.0.0
**وضعیت**: ✅ آماده استفاده
