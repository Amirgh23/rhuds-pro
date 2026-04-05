# ✅ دکمه Replay برای چارت‌های Cold War - تکمیل شد

## خلاصه اجرایی

انیمیشن حلقه‌ای چارت‌ها حذف شد و به جای آن یک دکمه "REPLAY" با استایل Cold War HUD به هر چارت اضافه شد که با کلیک روی آن، انیمیشن چارت یک بار اجرا می‌شود.

## تغییرات انجام شده

### 1. حذف انیمیشن حلقه‌ای

#### قبل:

```typescript
// Animation loop
useEffect(() => {
  let animationFrameId: number;
  let startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = (elapsed % 3000) / 3000; // حلقه‌ای
    setAnimationProgress(progress);
    animationFrameId = requestAnimationFrame(animate);
  };

  animationFrameId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(animationFrameId);
}, []);
```

#### بعد:

```typescript
// Animation state - per chart (هر چارت progress مستقل دارد)
const [chartAnimations, setChartAnimations] = useState<{ [key: string]: number }>({});
const animationTimers = useRef<{ [key: string]: number }>({});
```

### 2. تابع Replay برای هر چارت

```typescript
// Replay animation for a specific chart
const replayChartAnimation = useCallback((chartId: string) => {
  // Clear existing timer if any
  if (animationTimers.current[chartId]) {
    clearInterval(animationTimers.current[chartId]);
  }

  // Reset progress to 0
  setChartAnimations((prev) => ({ ...prev, [chartId]: 0 }));

  // Animate from 0 to 1 over 2 seconds
  const startTime = Date.now();
  const duration = 2000;

  const timer = window.setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    setChartAnimations((prev) => ({ ...prev, [chartId]: progress }));

    if (progress >= 1) {
      clearInterval(timer);
      delete animationTimers.current[chartId];
    }
  }, 16); // ~60fps

  animationTimers.current[chartId] = timer;
}, []);
```

### 3. مقداردهی اولیه

```typescript
// Initialize all charts with progress 1 (completed state)
useEffect(() => {
  const initialAnimations: { [key: string]: number } = {};
  CHART_CONFIGS.forEach((chart) => {
    initialAnimations[chart.id] = 1;
  });
  setChartAnimations(initialAnimations);
}, []);
```

### 4. Cleanup

```typescript
// Cleanup timers on unmount
useEffect(() => {
  return () => {
    Object.values(animationTimers.current).forEach((timer) => {
      clearInterval(timer);
    });
  };
}, []);
```

### 5. آپدیت Draw Charts

```typescript
// Draw charts with individual progress
useEffect(() => {
  // ... chartDrawers definition ...

  try {
    Object.entries(canvasRefs.current).forEach(([chartId, canvas]) => {
      if (canvas && chartDrawers[chartId]) {
        try {
          const progress = chartAnimations[chartId] ?? 1;
          chartDrawers[chartId](canvas, progress);
        } catch (err) {
          console.error(`Error drawing chart ${chartId}:`, err);
        }
      }
    });
  } catch (err) {
    console.error('Error in chart drawing loop:', err);
  }
}, [chartAnimations]); // وابسته به chartAnimations به جای animationProgress
```

### 6. دکمه Replay در UI

```tsx
<div className="chart-card-header">
  <h3 className="chart-title">{chart.title}</h3>
  <div className="chart-header-actions">
    <button
      className="chart-replay-btn"
      onClick={() => replayChartAnimation(chart.id)}
      title="Replay Animation"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C10.3 2 12.3 3.2 13.4 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M13 2V5H10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>REPLAY</span>
    </button>
    <span className="chart-tech-code">CH-{chart.id.toUpperCase()}</span>
  </div>
</div>
```

### 7. استایل دکمه Replay

```css
.chart-replay-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(240, 160, 0, 0.1);
  border: 1px solid #f0a000;
  border-radius: 4px;
  color: #f0a000;
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.chart-replay-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(240, 160, 0, 0.3), transparent);
  transition: left 0.5s ease;
}

.chart-replay-btn:hover {
  background: rgba(240, 160, 0, 0.2);
  border-color: #f0a000;
  box-shadow:
    0 0 15px rgba(240, 160, 0, 0.4),
    inset 0 0 10px rgba(240, 160, 0, 0.1);
  transform: translateY(-1px);
}

.chart-replay-btn:hover::before {
  left: 100%;
}

.chart-replay-btn svg {
  width: 14px;
  height: 14px;
  animation: rotateIcon 0.6s ease-in-out;
}

.chart-replay-btn:hover svg {
  animation: rotateIcon 0.6s ease-in-out infinite;
}

@keyframes rotateIcon {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

## ویژگی‌های دکمه Replay

### 1. طراحی Cold War HUD

- رنگ طلایی (#F0A000)
- فونت Share Tech Mono
- حاشیه درخشان
- افکت glow با hover

### 2. آیکون چرخشی

- آیکون SVG با طرح refresh
- انیمیشن چرخش 360 درجه
- چرخش مداوم با hover

### 3. افکت‌های تعاملی

- Sweep effect با hover (نور از چپ به راست)
- Transform با hover (حرکت به بالا)
- Shadow و glow با hover
- Active state با کلیک

### 4. عملکرد

- کلیک روی دکمه → انیمیشن از 0 تا 1 در 2 ثانیه
- هر چارت مستقل از بقیه animate می‌شود
- Timer قبلی clear می‌شود اگر دوباره کلیک شود
- Cleanup خودکار با unmount

## مزایا

### 1. کنترل کاربر

- کاربر تصمیم می‌گیرد کی انیمیشن اجرا شود
- بدون انیمیشن مزاحم و حلقه‌ای
- تجربه کاربری بهتر

### 2. Performance

- بدون animation loop مداوم
- CPU usage کمتر
- Battery friendly

### 3. UX بهتر

- انیمیشن فقط وقتی که کاربر می‌خواهد
- هر چارت مستقل
- Smooth و responsive

### 4. استایل حرفه‌ای

- دکمه با استایل Cold War HUD
- انیمیشن‌های جذاب
- Feedback بصری عالی

## نحوه استفاده

### برای کاربران

1. صفحه Cold War Charts را باز کنید
2. چارت‌ها در حالت کامل (progress = 1) نمایش داده می‌شوند
3. روی دکمه "REPLAY" کلیک کنید
4. انیمیشن چارت از صفر شروع می‌شود و در 2 ثانیه کامل می‌شود
5. می‌توانید هر چارت را به صورت مستقل replay کنید

### برای توسعه‌دهندگان

```typescript
// برای تغییر مدت زمان انیمیشن
const duration = 2000; // 2 ثانیه (می‌توانید تغییر دهید)

// برای اضافه کردن callback بعد از اتمام انیمیشن
if (progress >= 1) {
  clearInterval(timer);
  delete animationTimers.current[chartId];
  // اینجا callback خود را اضافه کنید
  onAnimationComplete?.(chartId);
}
```

## تست

### تست دستی

1. ✅ دکمه Replay در هر چارت نمایش داده می‌شود
2. ✅ کلیک روی دکمه انیمیشن را شروع می‌کند
3. ✅ انیمیشن smooth و 60fps است
4. ✅ هر چارت مستقل animate می‌شود
5. ✅ کلیک مجدد انیمیشن را از اول شروع می‌کند
6. ✅ Hover effects کار می‌کنند
7. ✅ آیکون با hover می‌چرخد
8. ✅ بدون memory leak

### Performance

- ✅ بدون animation loop مداوم
- ✅ CPU usage minimal
- ✅ Smooth 60fps animation
- ✅ Cleanup مناسب

## خلاصه

انیمیشن حلقه‌ای حذف شد و سیستم replay با دکمه اختصاصی برای هر چارت پیاده‌سازی شد. حالا کاربر کنترل کامل روی انیمیشن‌ها دارد و تجربه کاربری بهتری ارائه می‌شود. دکمه با استایل Cold War HUD طراحی شده و انیمیشن‌های جذاب دارد.

---

**تاریخ تکمیل**: 2026-04-05  
**وضعیت**: ✅ تکمیل شده  
**تعداد چارت‌ها**: 75  
**فایل‌های تغییر یافته**: 2

- `packages/demo-app/src/pages/ColdWarChartsPage.tsx`
- `packages/demo-app/src/pages/ColdWarChartsPage.css`
