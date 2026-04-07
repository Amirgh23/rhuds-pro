# راهنمای شروع سریع - RHUDS Pro

**زمان مطالعه**: 10 دقیقه  
**سطح**: مبتدی تا متوسط  
**آخرین به‌روزرسانی**: 13 ژوئن 2026

---

## 🚀 شروع در 5 دقیقه

### 1️⃣ نصب

```bash
# کلون کردن مخزن
git clone https://github.com/rhuds/rhuds-pro.git
cd rhuds-pro

# نصب وابستگی‌ها
npm install

# اجرای برنامه نمایشی
npm run dev
```

### 2️⃣ اولین جزء

```tsx
import { HudButton } from '@rhuds/components';

export function App() {
  return <HudButton onClick={() => alert('سلام!')}>کلیک کنید</HudButton>;
}
```

### 3️⃣ تم‌بندی

```tsx
import { useThemeManager } from '@rhuds/core';

export function ThemedApp() {
  const { theme, setTheme } = useThemeManager();

  return (
    <div>
      <button onClick={() => setTheme('dark')}>تاریک</button>
      <button onClick={() => setTheme('coldwar')}>جنگ سرد</button>
    </div>
  );
}
```

---

## 📚 اجزای محبوب

### دکمه‌ها

```tsx
import {
  HudButton,
  NeonHoverButton,
  GlitchHoverButton,
  ColdWarButton
} from '@rhuds/components';

<HudButton>HUD دکمه</HudButton>
<NeonHoverButton>نئون</NeonHoverButton>
<GlitchHoverButton>Glitch</GlitchHoverButton>
<ColdWarButton>جنگ سرد</ColdWarButton>
```

### کارت‌ها

```tsx
import {
  CyberCard,
  GlassCard,
  ColdWarCard,
  HudNotificationCard
} from '@rhuds/components';

<CyberCard title="عنوان">محتوا</CyberCard>
<GlassCard>محتوای شیشه‌ای</GlassCard>
<ColdWarCard>محتوای جنگ سرد</ColdWarCard>
<HudNotificationCard>اطلاع</HudNotificationCard>
```

### ورودی‌ها

```tsx
import {
  HudInput,
  CyberpunkAccessInput,
  BashInput,
  GradientSearchInput
} from '@rhuds/components';

<HudInput placeholder="HUD ورودی" />
<CyberpunkAccessInput />
<BashInput />
<GradientSearchInput />
```

### بارگذار‌ها

```tsx
import {
  BinaryLoader,
  Cube3DLoader,
  ColdWarWaveLoader,
  AIMatrixLoader
} from '@rhuds/components';

<BinaryLoader />
<Cube3DLoader />
<ColdWarWaveLoader />
<AIMatrixLoader />
```

---

## 🎨 تم‌های دسترسی‌پذیر

### تم‌های موجود

```
✅ light      - روشن
✅ dark       - تاریک
✅ coldwar    - جنگ سرد
✅ cyberpunk  - سایبرپانک
✅ hud        - HUD
✅ neon       - نئون
```

### تغییر تم

```tsx
import { useThemeManager } from '@rhuds/core';

function ThemeSwitcher() {
  const { setTheme } = useThemeManager();

  return (
    <div>
      <button onClick={() => setTheme('light')}>روشن</button>
      <button onClick={() => setTheme('dark')}>تاریک</button>
      <button onClick={() => setTheme('coldwar')}>جنگ سرد</button>
    </div>
  );
}
```

---

## 🎬 انیمیشن‌ها

### استفاده از Hooks

```tsx
import { useAnimation, useSpring } from '@rhuds/hooks';

function AnimatedComponent() {
  const animation = useAnimation({
    duration: 1000,
    easing: 'easeInOut',
    delay: 0,
  });

  const spring = useSpring({
    tension: 170,
    friction: 26,
  });

  return <div>محتوای متحرک</div>;
}
```

### استفاده از Animator

```tsx
import { useAnimator } from '@rhuds/hooks';

function AnimatorComponent() {
  const animator = useAnimator();

  return (
    <div>
      <button onClick={() => animator.play()}>شروع</button>
      <button onClick={() => animator.pause()}>توقف</button>
    </div>
  );
}
```

---

## 📊 نمودارها

### نمودار ساده

```tsx
import { Chart } from '@rhuds/charts';

function MyChart() {
  const data = {
    labels: ['ژانویه', 'فوریه', 'مارس'],
    datasets: [
      {
        label: 'فروش',
        data: [12, 19, 3],
      },
    ],
  };

  return <Chart type="line" data={data} />;
}
```

### انواع نمودارها

```
✅ line       - خطی
✅ bar        - میله‌ای
✅ pie        - دایره‌ای
✅ doughnut   - حلقه‌ای
✅ bubble     - حباب
✅ scatter    - پراکنده
```

---

## 🔊 صوت

### استفاده از صوت

```tsx
import { useBleepManager } from '@rhuds/core';

function SoundComponent() {
  const bleepManager = useBleepManager();

  return <button onClick={() => bleepManager.play('click')}>صدا</button>;
}
```

---

## 🧪 تست‌کردن

### اجرای تست‌ها

```bash
# تمام تست‌ها
npm run test

# تست‌های خاص
npm run test -- components

# تست‌های با watch
npm run test:watch

# پوشش تست
npm run test:coverage
```

---

## 🔍 بررسی کیفیت کد

```bash
# ESLint
npm run lint

# Prettier
npm run format

# Type checking
npm run type-check
```

---

## 📦 ساخت

```bash
# ساخت تمام پکیج‌ها
npm run build

# ساخت پکیج خاص
npm run build -- --filter=@rhuds/components

# ساخت برای production
npm run build:prod
```

---

## 🌐 استقرار

### استقرار به Vercel

```bash
# نصب Vercel CLI
npm i -g vercel

# استقرار
vercel
```

### استقرار به Netlify

```bash
# نصب Netlify CLI
npm i -g netlify-cli

# استقرار
netlify deploy
```

---

## 🐛 حل مشکلات رایج

### مشکل: خطای نصب

```bash
# حل
rm -rf node_modules package-lock.json
npm install
```

### مشکل: خطای ساخت

```bash
# حل
npm run clean
npm run build
```

### مشکل: خطای تست

```bash
# حل
npm run test -- --clearCache
npm run test
```

### مشکل: خطای TypeScript

```bash
# حل
npm run type-check
# بررسی خطاها و اصلاح کنید
```

---

## 📖 مستندات بیشتر

- **[README_FA.md](./README_FA.md)** - راهنمای کامل
- **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)** - نصب تفصیلی
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - مشارکت
- **[packages/components/COMPONENTS_API.md](./packages/components/COMPONENTS_API.md)** - API اجزا

---

## 💡 نکات مفید

### استفاده از TypeScript

```tsx
import { HudButtonProps } from '@rhuds/components';

interface MyButtonProps extends HudButtonProps {
  customProp?: string;
}

export function MyButton({ customProp, ...props }: MyButtonProps) {
  return <HudButton {...props} />;
}
```

### استفاده از Tailwind

```tsx
export function StyledComponent() {
  return (
    <div className="flex items-center justify-center gap-4">
      <HudButton>دکمه</HudButton>
    </div>
  );
}
```

### استفاده از Context

```tsx
import { useThemeManager } from '@rhuds/core';

export function ContextComponent() {
  const { theme } = useThemeManager();

  return <div>تم فعلی: {theme}</div>;
}
```

---

## 🎯 مثال کامل

```tsx
import React, { useState } from 'react';
import { HudButton, CyberCard, HudInput } from '@rhuds/components';
import { useThemeManager } from '@rhuds/core';

export function CompleteExample() {
  const [name, setName] = useState('');
  const { theme, setTheme } = useThemeManager();

  return (
    <div className="p-8">
      <h1>خوش‌آمدید به RHUDS Pro</h1>

      <CyberCard title="تنظیمات">
        <div className="space-y-4">
          <HudInput
            placeholder="نام خود را وارد کنید"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex gap-2">
            <HudButton onClick={() => setTheme('light')}>روشن</HudButton>
            <HudButton onClick={() => setTheme('dark')}>تاریک</HudButton>
            <HudButton onClick={() => setTheme('coldwar')}>جنگ سرد</HudButton>
          </div>

          <p>تم فعلی: {theme}</p>
          <p>نام: {name}</p>
        </div>
      </CyberCard>
    </div>
  );
}
```

---

## 🚀 مراحل بعدی

1. **کاوش اجزا** - تمام 100+ جزء را بررسی کنید
2. **خواندن مستندات** - مستندات تفصیلی را بخوانید
3. **ساخت پروژه** - پروژه خود را شروع کنید
4. **مشارکت** - بازخورد و بهبودها را ارسال کنید

---

## 📞 کمک و پشتیبانی

- **Issues**: [GitHub Issues](https://github.com/rhuds/rhuds-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rhuds/rhuds-pro/discussions)
- **Email**: support@rhuds.dev

---

**آخرین به‌روزرسانی**: 13 ژوئن 2026  
**نسخه**: 1.0.0  
**وضعیت**: ✅ فعال
