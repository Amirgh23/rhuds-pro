# مرجع API کامل - RHUDS Pro

**نسخه**: 1.0.0  
**آخرین به‌روزرسانی**: 13 ژوئن 2026  
**وضعیت**: ✅ کامل

---

## 📋 فهرست

- [اجزای رابط کاربری](#اجزای-رابط-کاربری)
- [Hooks](#hooks)
- [سیستم تم‌بندی](#سیستم-تم‌بندی)
- [سیستم انیمیشن](#سیستم-انیمیشن)
- [سیستم صوتی](#سیستم-صوتی)
- [نمودارها](#نمودارها)
- [WebGL](#webgl)
- [ابزارها](#ابزارها)

---

## 🎨 اجزای رابط کاربری

### دکمه‌ها

#### HudButton

```tsx
import { HudButton } from '@rhuds/components';

<HudButton onClick={() => {}} disabled={false} size="md" variant="primary" className="custom-class">
  متن دکمه
</HudButton>;
```

**Props:**

- `onClick?: () => void` - تابع کلیک
- `disabled?: boolean` - غیرفعال
- `size?: 'sm' | 'md' | 'lg'` - اندازه
- `variant?: 'primary' | 'secondary'` - نوع
- `className?: string` - کلاس سفارشی

#### NeonHoverButton

```tsx
<NeonHoverButton color="cyan" intensity={1} onClick={() => {}}>
  نئون دکمه
</NeonHoverButton>
```

**Props:**

- `color?: string` - رنگ
- `intensity?: number` - شدت
- `onClick?: () => void` - تابع کلیک

#### GlitchHoverButton

```tsx
<GlitchHoverButton glitchIntensity={0.5} onClick={() => {}}>
  Glitch دکمه
</GlitchHoverButton>
```

**Props:**

- `glitchIntensity?: number` - شدت Glitch
- `onClick?: () => void` - تابع کلیک

#### ColdWarButton

```tsx
<ColdWarButton variant="tactical" onClick={() => {}}>
  جنگ سرد
</ColdWarButton>
```

**Props:**

- `variant?: 'tactical' | 'standard'` - نوع
- `onClick?: () => void` - تابع کلیک

---

### کارت‌ها

#### CyberCard

```tsx
<CyberCard title="عنوان" subtitle="زیرعنوان" icon={<Icon />} onClick={() => {}}>
  محتوا
</CyberCard>
```

**Props:**

- `title?: string` - عنوان
- `subtitle?: string` - زیرعنوان
- `icon?: ReactNode` - آیکون
- `onClick?: () => void` - تابع کلیک
- `children?: ReactNode` - محتوا

#### GlassCard

```tsx
<GlassCard blur={10} opacity={0.8} className="custom">
  محتوای شیشه‌ای
</GlassCard>
```

**Props:**

- `blur?: number` - میزان تار
- `opacity?: number` - شفافیت
- `className?: string` - کلاس سفارشی

#### ColdWarCard

```tsx
<ColdWarCard title="عنوان" scanlines={true} glitch={false}>
  محتوای جنگ سرد
</ColdWarCard>
```

**Props:**

- `title?: string` - عنوان
- `scanlines?: boolean` - خطوط اسکن
- `glitch?: boolean` - Glitch

#### HudNotificationCard

```tsx
<HudNotificationCard type="info" title="اطلاع" message="پیام" onClose={() => {}}>
  محتوا
</HudNotificationCard>
```

**Props:**

- `type?: 'info' | 'success' | 'warning' | 'error'` - نوع
- `title?: string` - عنوان
- `message?: string` - پیام
- `onClose?: () => void` - تابع بستن

---

### ورودی‌ها

#### HudInput

```tsx
<HudInput
  placeholder="متن راهنما"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  disabled={false}
  type="text"
  size="md"
/>
```

**Props:**

- `placeholder?: string` - متن راهنما
- `value?: string` - مقدار
- `onChange?: (e: ChangeEvent) => void` - تابع تغییر
- `disabled?: boolean` - غیرفعال
- `type?: string` - نوع
- `size?: 'sm' | 'md' | 'lg'` - اندازه

#### CyberpunkAccessInput

```tsx
<CyberpunkAccessInput
  placeholder="رمز عبور"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  accessLevel={3}
/>
```

**Props:**

- `placeholder?: string` - متن راهنما
- `value?: string` - مقدار
- `onChange?: (e: ChangeEvent) => void` - تابع تغییر
- `accessLevel?: number` - سطح دسترسی

#### BashInput

```tsx
<BashInput
  prompt="$"
  value={command}
  onChange={(e) => setCommand(e.target.value)}
  onSubmit={(cmd) => executeCommand(cmd)}
/>
```

**Props:**

- `prompt?: string` - پرومپت
- `value?: string` - مقدار
- `onChange?: (e: ChangeEvent) => void` - تابع تغییر
- `onSubmit?: (cmd: string) => void` - تابع ارسال

#### GradientSearchInput

```tsx
<GradientSearchInput
  placeholder="جستجو..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  gradient="cyan-to-purple"
/>
```

**Props:**

- `placeholder?: string` - متن راهنما
- `value?: string` - مقدار
- `onChange?: (e: ChangeEvent) => void` - تابع تغییر
- `gradient?: string` - گرادیان

---

### بارگذار‌ها

#### BinaryLoader

```tsx
<BinaryLoader size={40} speed={1} color="cyan" />
```

**Props:**

- `size?: number` - اندازه
- `speed?: number` - سرعت
- `color?: string` - رنگ

#### Cube3DLoader

```tsx
<Cube3DLoader size={50} speed={1.5} color="lime" />
```

**Props:**

- `size?: number` - اندازه
- `speed?: number` - سرعت
- `color?: string` - رنگ

#### ColdWarWaveLoader

```tsx
<ColdWarWaveLoader size={60} speed={1} color="amber" />
```

**Props:**

- `size?: number` - اندازه
- `speed?: number` - سرعت
- `color?: string` - رنگ

#### AIMatrixLoader

```tsx
<AIMatrixLoader size={50} speed={1} color="green" />
```

**Props:**

- `size?: number` - اندازه
- `speed?: number` - سرعت
- `color?: string` - رنگ

---

## 🎣 Hooks

### useAnimation

```tsx
import { useAnimation } from '@rhuds/hooks';

const animation = useAnimation({
  duration: 1000,
  easing: 'easeInOut',
  delay: 0,
  loop: false,
  autoPlay: true,
});

// استفاده
animation.play();
animation.pause();
animation.reset();
animation.progress; // 0-1
```

**Options:**

- `duration?: number` - مدت (میلی‌ثانیه)
- `easing?: string` - تابع easing
- `delay?: number` - تاخیر
- `loop?: boolean` - تکرار
- `autoPlay?: boolean` - شروع خودکار

### useSpring

```tsx
import { useSpring } from '@rhuds/hooks';

const spring = useSpring({
  tension: 170,
  friction: 26,
  mass: 1,
  clamp: false,
});

// استفاده
spring.set(100);
spring.value; // مقدار فعلی
```

**Options:**

- `tension?: number` - کشش
- `friction?: number` - اصطکاک
- `mass?: number` - جرم
- `clamp?: boolean` - محدود کردن

### useAnimator

```tsx
import { useAnimator } from '@rhuds/hooks';

const animator = useAnimator();

// استفاده
animator.play();
animator.pause();
animator.stop();
animator.isPlaying; // boolean
```

**Methods:**

- `play()` - شروع
- `pause()` - توقف
- `stop()` - ایست
- `reset()` - بازنشانی

### usePrevious

```tsx
import { usePrevious } from '@rhuds/hooks';

const prevValue = usePrevious(value);

// استفاده
if (value !== prevValue) {
  console.log('مقدار تغییر کرد');
}
```

---

## 🎨 سیستم تم‌بندی

### useThemeManager

```tsx
import { useThemeManager } from '@rhuds/core';

const {
  theme, // تم فعلی
  setTheme, // تغییر تم
  themes, // تمام تم‌ها
  colors, // رنگ‌های تم
  isDark, // آیا تاریک است
} = useThemeManager();

// استفاده
setTheme('dark');
console.log(colors.primary);
```

### تم‌های موجود

```
✅ light       - روشن
✅ dark        - تاریک
✅ coldwar     - جنگ سرد
✅ cyberpunk   - سایبرپانک
✅ hud         - HUD
✅ neon        - نئون
```

### رنگ‌های تم

```tsx
const colors = {
  primary: '#00ff00',
  secondary: '#ff00ff',
  background: '#000000',
  text: '#ffffff',
  accent: '#00ffff',
  success: '#00ff00',
  warning: '#ffff00',
  error: '#ff0000',
  info: '#00ffff',
};
```

---

## 🎬 سیستم انیمیشن

### createAnimation

```tsx
import { createAnimation } from '@rhuds/core';

const animation = createAnimation({
  duration: 1000,
  easing: 'easeInOut',
  from: 0,
  to: 100,
  onUpdate: (value) => console.log(value),
});

animation.play();
```

### Easing Functions

```
✅ linear
✅ easeIn
✅ easeOut
✅ easeInOut
✅ easeInQuad
✅ easeOutQuad
✅ easeInOutQuad
✅ easeInCubic
✅ easeOutCubic
✅ easeInOutCubic
```

---

## 🔊 سیستم صوتی

### useBleepManager

```tsx
import { useBleepManager } from '@rhuds/core';

const bleepManager = useBleepManager();

// استفاده
bleepManager.play('click');
bleepManager.play('success');
bleepManager.play('error');
bleepManager.stop();
bleepManager.setVolume(0.5);
```

### صوت‌های موجود

```
✅ click       - کلیک
✅ success     - موفقیت
✅ error       - خطا
✅ warning     - هشدار
✅ info        - اطلاع
✅ hover       - هاور
✅ select      - انتخاب
```

---

## 📊 نمودارها

### Chart Component

```tsx
import { Chart } from '@rhuds/charts';

<Chart
  type="line"
  data={{
    labels: ['ژانویه', 'فوریه', 'مارس'],
    datasets: [
      {
        label: 'فروش',
        data: [12, 19, 3],
        borderColor: '#00ff00',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
      },
    ],
  }}
  options={{
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true },
    },
  }}
/>;
```

**Props:**

- `type?: 'line' | 'bar' | 'pie' | 'doughnut' | 'bubble' | 'scatter'` - نوع
- `data?: ChartData` - داده‌ها
- `options?: ChartOptions` - گزینه‌ها

### انواع نمودارها

```
✅ line       - خطی
✅ bar        - میله‌ای
✅ pie        - دایره‌ای
✅ doughnut   - حلقه‌ای
✅ bubble     - حباب
✅ scatter    - پراکنده
✅ radar      - رادار
✅ polar      - قطبی
```

---

## 🎮 WebGL

### Scene3D

```tsx
import { Scene3D } from '@rhuds/webgl';

<Scene3D width={800} height={600} backgroundColor={0x000000} enableLights={true}>
  <Mesh3D geometry="box" material="standard" position={[0, 0, 0]} />
</Scene3D>;
```

**Props:**

- `width?: number` - عرض
- `height?: number` - ارتفاع
- `backgroundColor?: number` - رنگ پس‌زمینه
- `enableLights?: boolean` - روشنایی

### Mesh3D

```tsx
<Mesh3D
  geometry="box"
  material="standard"
  position={[0, 0, 0]}
  rotation={[0, 0, 0]}
  scale={[1, 1, 1]}
  color={0x00ff00}
/>
```

**Props:**

- `geometry?: string` - هندسه
- `material?: string` - ماده
- `position?: [x, y, z]` - موقعیت
- `rotation?: [x, y, z]` - چرخش
- `scale?: [x, y, z]` - مقیاس
- `color?: number` - رنگ

---

## 🛠️ ابزارها

### usePerformanceMonitoring

```tsx
import { usePerformanceMonitoring } from '@rhuds/core';

const metrics = usePerformanceMonitoring();

// استفاده
console.log(metrics.fps); // FPS
console.log(metrics.memoryUsage); // استفاده حافظه
console.log(metrics.renderTime); // زمان رندر
```

### useResourceOptimization

```tsx
import { useResourceOptimization } from '@rhuds/core';

const optimizer = useResourceOptimization();

// استفاده
optimizer.optimizeImages();
optimizer.optimizeCSS();
optimizer.optimizeJavaScript();
```

### usePredictiveCaching

```tsx
import { usePredictiveCaching } from '@rhuds/core';

const cache = usePredictiveCaching();

// استفاده
cache.prefetch('/api/data');
cache.preload('/image.jpg');
cache.get('/api/data');
```

---

## 📝 نمونه‌های کامل

### مثال 1: فرم ورود

```tsx
import { useState } from 'react';
import { HudButton, HudInput, CyberCard } from '@rhuds/components';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log({ email, password });
  };

  return (
    <CyberCard title="ورود">
      <div className="space-y-4">
        <HudInput placeholder="ایمیل" value={email} onChange={(e) => setEmail(e.target.value)} />
        <HudInput
          placeholder="رمز عبور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <HudButton onClick={handleSubmit}>ورود</HudButton>
      </div>
    </CyberCard>
  );
}
```

### مثال 2: داشبورد

```tsx
import { Chart } from '@rhuds/charts';
import { HudNotificationCard } from '@rhuds/components';

export function Dashboard() {
  const chartData = {
    labels: ['هفته 1', 'هفته 2', 'هفته 3'],
    datasets: [
      {
        label: 'فروش',
        data: [100, 150, 200],
      },
    ],
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Chart type="line" data={chartData} />
      <HudNotificationCard type="success" title="موفقیت" message="داده‌ها به‌روز شدند" />
    </div>
  );
}
```

### مثال 3: صفحه متحرک

```tsx
import { useAnimation } from '@rhuds/hooks';
import { useThemeManager } from '@rhuds/core';

export function AnimatedPage() {
  const animation = useAnimation({
    duration: 2000,
    easing: 'easeInOut',
    loop: true,
  });

  const { theme, setTheme } = useThemeManager();

  return (
    <div>
      <h1>صفحه متحرک</h1>
      <button onClick={() => animation.play()}>شروع انیمیشن</button>
      <button onClick={() => setTheme('dark')}>تم تاریک</button>
    </div>
  );
}
```

---

## 🔗 لینک‌های مفید

- **[مستندات کامل](./README_FA.md)**
- **[راهنمای شروع سریع](./QUICK_START_GUIDE_FA.md)**
- **[API اجزا](./packages/components/COMPONENTS_API.md)**
- **[API Hooks](./packages/hooks/HOOKS_API.md)**

---

**آخرین به‌روزرسانی**: 13 ژوئن 2026  
**نسخه**: 1.0.0  
**وضعیت**: ✅ کامل
