# 🔧 راهنمای دیباگ صفحه Cold War Charts

## ✅ وضعیت فعلی پیاده‌سازی

### فایل‌های ایجاد شده:

1. ✅ `packages/demo-app/src/pages/ColdWarChartsPage.tsx` - صفحه اصلی با 75+ چارت
2. ✅ `packages/demo-app/src/pages/ColdWarChartsPage.css` - استایل کامل Cold War HUD
3. ✅ `packages/demo-app/src/components/ColdWarChartRenderer.ts` - توابع رسم چارت (16 تابع)
4. ✅ `packages/demo-app/src/components/TacticalMotionBackground.tsx` - پس‌زمینه متحرک
5. ✅ `packages/demo-app/src/components/TacticalMotionBackground.css` - استایل پس‌زمینه
6. ✅ `packages/demo-app/src/App.tsx` - مسیر `/coldwar-charts` اضافه شده
7. ✅ `packages/demo-app/src/components/Navbar.tsx` - لینک "Cold War Charts" اضافه شده
8. ✅ `test-coldwar-charts.html` - فایل تست مستقل HTML

---

## 🐛 مشکل: صفحه سفید نمایش می‌دهد

### علل احتمالی:

#### 1️⃣ خطای JavaScript در کنسول مرورگر

**راه حل:**

```bash
# باز کردن Developer Tools در مرورگر
# Chrome/Edge: F12 یا Ctrl+Shift+I
# Firefox: F12 یا Ctrl+Shift+K

# بررسی تب Console برای خطاها
```

#### 2️⃣ مشکل در import کامپوننت‌ها

**بررسی:**

- آیا `ColdWarCard` به درستی import شده؟
- آیا `TacticalMotionBackground` به درستی import شده؟
- آیا `COLD_WAR_HUD_COLORS` از `@rhuds/core` در دسترس است؟

#### 3️⃣ مشکل در build

**راه حل:**

```bash
# پاک کردن cache و rebuild
cd packages/demo-app
rm -rf node_modules/.cache
pnpm run build

# یا از root directory
pnpm run build
```

#### 4️⃣ مشکل در dev server

**راه حل:**

```bash
# متوقف کردن dev server فعلی (Ctrl+C)
# شروع مجدد
cd packages/demo-app
pnpm run dev
```

---

## 🧪 تست‌های دیباگ

### تست 1: فایل HTML مستقل

```bash
# باز کردن فایل test-coldwar-charts.html در مرورگر
# این فایل باید 4 چارت را نمایش دهد:
# - Line Chart
# - Bar Chart
# - Pie Chart
# - Radar Chart

# اگر این فایل کار کرد، مشکل در React است
# اگر کار نکرد، مشکل در توابع رسم چارت است
```

### تست 2: بررسی مسیر در مرورگر

```
http://localhost:3000/coldwar-charts
```

### تست 3: بررسی Navbar

- آیا لینک "Cold War Charts" در Navbar نمایش داده می‌شود؟
- آیا کلیک روی آن به صفحه می‌رود؟

### تست 4: بررسی Network Tab

```bash
# در Developer Tools:
# 1. رفتن به تب Network
# 2. رفرش صفحه (F5)
# 3. بررسی:
#    - آیا ColdWarChartsPage.tsx لود می‌شود؟
#    - آیا ColdWarChartsPage.css لود می‌شود؟
#    - آیا خطای 404 وجود دارد؟
```

---

## 🔍 دستورات دیباگ

### بررسی وضعیت build:

```bash
# از root directory
pnpm run build

# بررسی خروجی برای خطاها
```

### بررسی TypeScript errors:

```bash
cd packages/demo-app
pnpm run type-check
```

### بررسی ESLint errors:

```bash
cd packages/demo-app
pnpm run lint
```

### پاک کردن کامل و rebuild:

```bash
# از root directory
rm -rf node_modules
rm -rf packages/*/node_modules
rm -rf packages/*/.turbo
rm -rf .turbo

pnpm install
pnpm run build
cd packages/demo-app
pnpm run dev
```

---

## 📋 چک‌لیست دیباگ

- [ ] Dev server در حال اجرا است (`pnpm run dev`)
- [ ] مرورگر به `http://localhost:3000/coldwar-charts` رفته است
- [ ] کنسول مرورگر هیچ خطایی ندارد
- [ ] فایل `test-coldwar-charts.html` به درستی کار می‌کند
- [ ] لینک "Cold War Charts" در Navbar نمایش داده می‌شود
- [ ] Build بدون خطا انجام شده است
- [ ] تمام import ها صحیح هستند

---

## 🎯 مراحل حل مشکل (به ترتیب اولویت)

### مرحله 1: تست فایل HTML

```bash
# باز کردن test-coldwar-charts.html در مرورگر
# اگر کار کرد → مشکل در React است
# اگر کار نکرد → مشکل در توابع رسم است
```

### مرحله 2: بررسی کنسول مرورگر

```bash
# F12 → Console
# یادداشت کردن تمام خطاها
```

### مرحله 3: Rebuild

```bash
cd packages/demo-app
rm -rf node_modules/.cache
pnpm run build
pnpm run dev
```

### مرحله 4: بررسی imports

```typescript
// در ColdWarChartsPage.tsx
// آیا این import ها کار می‌کنند؟
import { ColdWarCard } from '@rhuds/components';
import { TacticalMotionBackground } from '../components/TacticalMotionBackground';
import { drawLineChart, drawBarChart, ... } from '../components/ColdWarChartRenderer';
```

### مرحله 5: اضافه کردن console.log

```typescript
// در ColdWarChartsPage.tsx
export const ColdWarChartsPage: React.FC = () => {
  console.log('ColdWarChartsPage rendered');
  console.log('CHART_CONFIGS:', CHART_CONFIGS.length);

  // ... rest of code
```

---

## 🚀 راه حل سریع

اگر همه چیز درست است اما صفحه سفید است:

```bash
# 1. متوقف کردن dev server (Ctrl+C)

# 2. پاک کردن cache
cd packages/demo-app
rm -rf node_modules/.cache
rm -rf .turbo

# 3. شروع مجدد
pnpm run dev

# 4. باز کردن در مرورگر
# http://localhost:3000/coldwar-charts

# 5. Hard refresh (Ctrl+Shift+R یا Ctrl+F5)
```

---

## 📊 وضعیت پیاده‌سازی

### ✅ کامل شده:

- صفحه اصلی با 75+ تعریف چارت
- سیستم دسته‌بندی (11 دسته)
- سیستم جستجو
- استایل کامل Cold War HUD
- پس‌زمینه متحرک Tactical Motion
- 16 تابع رسم چارت پایه
- مسیریابی و Navbar

### ⏳ در حال انجام:

- 59 تابع رسم چارت باقی‌مانده
- سیستم Tooltip
- HUD Frame برای چارت‌ها

### 📝 نکات مهم:

1. تمام چارت‌ها با Canvas API رسم می‌شوند (نه Chart.js)
2. رنگ‌ها از `COLD_WAR_HUD_COLORS` استفاده می‌کنند
3. انیمیشن‌ها با `requestAnimationFrame` پیاده‌سازی شده‌اند
4. طراحی Responsive است

---

## 🆘 اگر مشکل حل نشد

لطفاً اطلاعات زیر را ارائه دهید:

1. **خطاهای کنسول مرورگر** (عکس یا متن)
2. **نسخه Node.js**: `node --version`
3. **نسخه pnpm**: `pnpm --version`
4. **سیستم عامل**: Windows/Mac/Linux
5. **مرورگر**: Chrome/Firefox/Edge
6. **آیا `test-coldwar-charts.html` کار می‌کند؟**
7. **خروجی دستور**: `pnpm run build`

---

## 📞 مراحل بعدی

پس از حل مشکل صفحه سفید:

1. ✅ تست تمام 16 چارت موجود
2. 🔄 پیاده‌سازی 59 چارت باقی‌مانده
3. 🎨 اضافه کردن سیستم Tooltip
4. 🖼️ اضافه کردن HUD Frame
5. 🎬 بهینه‌سازی انیمیشن‌ها
6. 📱 تست Responsive
7. ♿ تست Accessibility

---

**تاریخ ایجاد:** 2026-04-04  
**وضعیت:** در حال دیباگ  
**اولویت:** بالا 🔴
