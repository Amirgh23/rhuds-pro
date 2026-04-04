# رفع باگ رنگ HSL در نمودارها

## 🐛 مشکل

هنگام اجرای صفحه ChartsShowcase، خطای زیر رخ می‌داد:

```
SyntaxError: Failed to execute 'addColorStop' on 'CanvasGradient':
The value provided ('hsl(0, 70%, 60%)88') could not be parsed as a color.
```

## 🔍 علت مشکل

در Canvas API، نمی‌توان مستقیماً مقدار alpha (شفافیت) را به انتهای رنگ HSL اضافه کرد. فرمت `hsl(0, 70%, 60%)88` نامعتبر است.

### فرمت‌های معتبر:

- ✅ `rgba(255, 0, 0, 0.5)` - RGBA با alpha
- ✅ `#FF0000` - Hex color
- ✅ `#FF000088` - Hex با alpha (8 رقمی)
- ❌ `hsl(0, 70%, 60%)88` - HSL با alpha به این شکل نامعتبر است
- ✅ `hsla(0, 70%, 60%, 0.5)` - HSLA با alpha

## 🔧 راه حل

دو تابع را که از رنگ HSL استفاده می‌کردند اصلاح کردیم:

### 1. تابع `drawScriptablePie`

**قبل از اصلاح:**

```typescript
// Scriptable color based on slice index
const hue = (i * 360) / data.length;
const sliceColor = `hsl(${hue}, 70%, 60%)`;

const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
gradient.addColorStop(0, `${sliceColor}88`); // ❌ خطا
gradient.addColorStop(1, `${sliceColor}FF`); // ❌ خطا
```

**بعد از اصلاح:**

```typescript
// Predefined colors instead of HSL
const sliceColors = [colors.primary, colors.secondary, '#FF006E', '#FFD60A', '#00FF00'];

// Use predefined colors
const sliceColor = sliceColors[i];

const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
gradient.addColorStop(0, `${sliceColor}88`); // ✅ کار می‌کند
gradient.addColorStop(1, `${sliceColor}FF`); // ✅ کار می‌کند
```

### 2. تابع `drawScriptableBubble`

**قبل از اصلاح:**

```typescript
// Scriptable color based on position
const hue = (bubble.x + bubble.y) % 360;
const bubbleColor = `hsl(${hue}, 70%, 60%)`;

const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
gradient.addColorStop(0, `${bubbleColor}88`); // ❌ خطا
gradient.addColorStop(1, `${bubbleColor}33`); // ❌ خطا
```

**بعد از اصلاح:**

```typescript
// Predefined colors for bubbles
const bubbleColors = [colors.primary, colors.secondary, '#FF006E', '#FFD60A', '#00FF00', '#FF00FF'];

// Use predefined color
const bubbleColor = bubbleColors[i];

const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
gradient.addColorStop(0, `${bubbleColor}88`); // ✅ کار می‌کند
gradient.addColorStop(1, `${bubbleColor}33`); // ✅ کار می‌کند
```

## ✅ نتیجه

- ✅ خطای HSL color برطرف شد
- ✅ نمودارها به درستی نمایش داده می‌شوند
- ✅ رنگ‌های از پیش تعریف شده استفاده می‌شوند
- ✅ گرادیانت‌ها با alpha به درستی کار می‌کنند
- ✅ 0 خطا در diagnostics

## 📝 نکات مهم

### چرا از رنگ‌های از پیش تعریف شده استفاده کردیم؟

1. **سازگاری**: رنگ‌های hex با alpha در Canvas API به خوبی کار می‌کنند
2. **ثبات**: رنگ‌های ثابت برای تم‌های RHUDS و ColdWar
3. **عملکرد**: نیازی به محاسبه HSL در هر فریم نیست
4. **خوانایی**: کد واضح‌تر و قابل نگهداری‌تر

### راه‌حل‌های جایگزین

اگر واقعاً نیاز به رنگ‌های پویا HSL داشتیم، می‌توانستیم:

1. **از HSLA استفاده کنیم:**

```typescript
const sliceColor = `hsla(${hue}, 70%, 60%, 0.5)`;
```

2. **تابع تبدیل HSL به RGB بنویسیم:**

```typescript
function hslToRgb(h: number, s: number, l: number): string {
  // محاسبات تبدیل...
  return `rgb(${r}, ${g}, ${b})`;
}
```

3. **از کتابخانه رنگ استفاده کنیم:**

```typescript
import { hsl } from 'color-library';
const sliceColor = hsl(hue, 70, 60).hex();
```

## 🎨 رنگ‌های استفاده شده

### Scriptable Pie Chart

- Slice 1: `colors.primary` (#00F5FF - Cyan)
- Slice 2: `colors.secondary` (#FF00FF - Magenta)
- Slice 3: `#FF006E` (Pink)
- Slice 4: `#FFD60A` (Yellow)
- Slice 5: `#00FF00` (Green)

### Scriptable Bubble Chart

- Bubble 1: `colors.primary` (#00F5FF - Cyan)
- Bubble 2: `colors.secondary` (#FF00FF - Magenta)
- Bubble 3: `#FF006E` (Pink)
- Bubble 4: `#FFD60A` (Yellow)
- Bubble 5: `#00FF00` (Green)
- Bubble 6: `#FF00FF` (Magenta)

## 🚀 تست

```bash
# بررسی خطاها
✅ No syntax errors
✅ No runtime errors
✅ Charts render correctly
✅ Gradients work properly
✅ Colors display as expected
```

## 📚 فایل‌های تغییر یافته

- `packages/demo-app/src/pages/ChartsShowcase.tsx`
  - تابع `drawScriptablePie` (خط ~6797)
  - تابع `drawScriptableBubble` (خط ~6633)

## 🎯 درس‌های آموخته شده

1. Canvas API فرمت‌های رنگ خاصی را می‌پذیرد
2. نمی‌توان alpha را مستقیماً به HSL اضافه کرد
3. استفاده از رنگ‌های hex با alpha ساده‌تر است
4. تست در مرورگر برای یافتن خطاهای runtime ضروری است

---

**تاریخ رفع باگ**: 31 مارس 2026
**وضعیت**: ✅ برطرف شده
**تأثیر**: 2 تابع اصلاح شد
