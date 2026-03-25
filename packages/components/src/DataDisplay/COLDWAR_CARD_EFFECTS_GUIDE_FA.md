# 🎬 راهنمای افکت‌های ColdWarCard

## خلاصه

کامپوننت `ColdWarCard` دارای 5 variant با افکت‌های CSS کاملاً متمایز است که هر کدام برای کاربرد خاصی طراحی شده‌اند.

---

## 🎯 1. TACTICAL - الگوی شبکه نظامی

### ویژگی‌های بصری:

- **Grid Pattern دوگانه**: یک شبکه درشت 10×10 پیکسل با رنگ accent و یک شبکه ریز 3×3 پیکسل
- **Mix Blend Mode**: استفاده از `screen` برای ترکیب بهتر با پس‌زمینه
- **Opacity**: 0.8 برای تعادل بین وضوح و افکت

### کد CSS:

```css
background:
  repeating-linear-gradient(
    0deg,
    transparent,
    transparent 9px,
    rgba(accent, 0.15) 9px,
    rgba(accent, 0.15) 10px
  ),
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 9px,
    rgba(accent, 0.15) 9px,
    rgba(accent, 0.15) 10px
  ),
  repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.03) 2px,
    rgba(255, 255, 255, 0.03) 3px
  ),
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.03) 2px,
    rgba(255, 255, 255, 0.03) 3px
  );
background-size:
  10px 10px,
  10px 10px,
  3px 3px,
  3px 3px;
mix-blend-mode: screen;
```

### کاربرد:

- اطلاعات محرمانه نظامی
- داشبوردهای تاکتیکی
- نقشه‌های عملیاتی

---

## 💎 2. GLASS - شیشه مات با شکست نور

### ویژگی‌های بصری:

- **Backdrop Filter**: blur(8px) + saturate(180%) + brightness(1.15)
- **Multiple Radial Gradients**: شبیه‌سازی نقاط نوری روی شیشه
- **Inset Shadows**: ایجاد عمق سه‌بعدی
- **Light Refraction**: شکست نور با gradient های diagonal

### کد CSS:

```css
backdrop-filter: blur(8px) saturate(180%) brightness(1.15);
background:
  radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
  radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
  linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.02) 50%,
    transparent 100%
  ),
  linear-gradient(225deg, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
box-shadow:
  inset 1px 1px 2px rgba(255, 255, 255, 0.3),
  inset -1px -1px 2px rgba(0, 0, 0, 0.2);
```

### کاربرد:

- UI های مدرن و شیک
- پنل‌های اطلاعاتی
- کارت‌های پروفایل

---

## ⚠️ 3. NOTIFICATION - هاله هشدار متحرک

### ویژگی‌های بصری:

- **3 Radial Gradients**: ایجاد هاله چندلایه
- **Pulse Animation**: انیمیشن 2 ثانیه‌ای برای جلب توجه
- **Multiple Inset Shadows**: افکت glow داخلی
- **Thick Left Border**: border چپ 4 پیکسلی برای تاکید

### کد CSS:

```css
background:
  radial-gradient(circle at 50% 50%, rgba(accent, 0.25) 0%, rgba(accent, 0.1) 40%, transparent 70%),
  radial-gradient(circle at 30% 30%, rgba(accent, 0.15) 0%, transparent 50%),
  radial-gradient(circle at 70% 70%, rgba(accent, 0.15) 0%, transparent 50%);
box-shadow:
  inset 0 0 40px rgba(accent, 0.3),
  inset 0 0 20px rgba(accent, 0.2),
  inset 4px 0 10px rgba(accent, 0.4);
animation: pulse-glow 2s ease-in-out infinite;
```

### انیمیشن:

```css
@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.85;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.2);
  }
}
```

### کاربرد:

- اعلان‌های مهم
- هشدارهای سیستم
- پیام‌های فوری

---

## 📊 4. DATA - خطوط اسکن CRT

### ویژگی‌های بصری:

- **Scanline Pattern**: الگوی 5 پیکسلی شبیه مانیتورهای CRT
- **Animated Sweep**: حرکت scanline با انیمیشن 3 ثانیه‌ای
- **Phosphor Glow**: افکت درخشش فسفری
- **Inset Shadow**: سایه داخلی برای عمق

### کد CSS:

```css
background:
  repeating-linear-gradient(
    0deg,
    rgba(accent, 0.08) 0px,
    rgba(accent, 0.08) 1px,
    transparent 1px,
    transparent 2px,
    rgba(accent, 0.12) 2px,
    rgba(accent, 0.12) 3px,
    transparent 3px,
    transparent 5px
  ),
  linear-gradient(0deg, transparent 0%, rgba(accent, 0.05) 50%, transparent 100%);
box-shadow: inset 0 0 25px rgba(accent, 0.15);
animation: scanline-sweep 3s linear infinite;
```

### انیمیشن:

```css
@keyframes scanline-sweep {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100px;
  }
}
```

### کاربرد:

- نمایش داده‌های فنی
- ترمینال‌ها و کنسول‌ها
- مانیتورهای سیستم

---

## ✨ 5. MINIMAL - دانه‌بندی فیلم ظریف

### ویژگی‌های بصری:

- **Diagonal Hatching**: دو الگوی diagonal متقاطع (45° و -45°)
- **Ultra-Subtle**: opacity بسیار کم (0.4) برای ظرافت
- **Contrast Filter**: افزایش کنتراست (1.1) برای وضوح
- **Dashed Border**: border خط‌چین برای سبک مینیمال

### کد CSS:

```css
background:
  repeating-linear-gradient(
    45deg,
    transparent,
    transparent 1px,
    rgba(255, 255, 255, 0.015) 1px,
    rgba(255, 255, 255, 0.015) 2px
  ),
  repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 1px,
    rgba(255, 255, 255, 0.01) 1px,
    rgba(255, 255, 255, 0.01) 2px
  );
background-size:
  3px 3px,
  3px 3px;
opacity: 0.4;
filter: contrast(1.1);
border-style: dashed;
```

### کاربرد:

- UI های مینیمال
- محتوای ثانویه
- placeholder ها

---

## 🎨 انتخاب Variant مناسب

| Variant          | حالت  | شدت بصری | کاربرد اصلی            |
| ---------------- | ----- | -------- | ---------------------- |
| **tactical**     | فعال  | متوسط    | اطلاعات نظامی/تاکتیکی  |
| **glass**        | مدرن  | کم       | UI های شیک و مدرن      |
| **notification** | هشدار | زیاد     | اعلان‌های مهم          |
| **data**         | فنی   | متوسط    | نمایش داده‌های تکنیکال |
| **minimal**      | ساده  | خیلی کم  | محتوای ثانویه          |

---

## 💡 نکات مهم

### Performance:

- همه افکت‌ها با CSS خالص پیاده‌سازی شده‌اند (بدون SVG filter)
- استفاده از `will-change` برای بهینه‌سازی
- انیمیشن‌ها GPU-accelerated هستند

### Browser Support:

- `backdrop-filter` در Safari و Chrome جدید
- Fallback برای مرورگرهای قدیمی‌تر
- Progressive enhancement

### Accessibility:

- تمام افکت‌ها قابل غیرفعال‌سازی با `prefers-reduced-motion`
- کنتراست رنگ مناسب برای خوانایی
- Focus states واضح

---

## 📦 مثال استفاده

```tsx
import { ColdWarCard } from '@rhuds/components';

// Tactical variant
<ColdWarCard variant="tactical" color="amber">
  <h3>CLASSIFIED INTEL</h3>
  <p>Operation Perseus - Status: Active</p>
</ColdWarCard>

// Glass variant
<ColdWarCard variant="glass" color="blue" elevation="medium">
  <h3>User Profile</h3>
  <p>Modern glassmorphism design</p>
</ColdWarCard>

// Notification variant
<ColdWarCard variant="notification" color="green">
  <h3>ALERT</h3>
  <p>System update available</p>
</ColdWarCard>

// Data variant
<ColdWarCard variant="data" color="blue" scanlines>
  <h3>SYSTEM MONITOR</h3>
  <p>CPU: 45% | RAM: 8.2GB</p>
</ColdWarCard>

// Minimal variant
<ColdWarCard variant="minimal" color="neutral">
  <h3>Notes</h3>
  <p>Simple and clean design</p>
</ColdWarCard>
```

---

## 🔧 Props

| Prop        | Type                                                             | Default      | Description               |
| ----------- | ---------------------------------------------------------------- | ------------ | ------------------------- |
| `variant`   | `'tactical' \| 'glass' \| 'notification' \| 'data' \| 'minimal'` | `'tactical'` | نوع افکت بصری             |
| `color`     | `'amber' \| 'green' \| 'blue' \| 'red' \| 'neutral'`             | `'amber'`    | رنگ accent                |
| `elevation` | `'none' \| 'low' \| 'medium' \| 'high'`                          | `'low'`      | سطح سایه                  |
| `scanlines` | `boolean`                                                        | `false`      | فعال‌سازی scanlines اضافی |
| `glow`      | `boolean`                                                        | `true`       | افکت glow روی متن         |
| `hoverable` | `boolean`                                                        | `true`       | فعال‌سازی hover effects   |

---

## 🎯 تست

برای مشاهده تمام افکت‌ها، فایل `ColdWarCard.test.html` را در مرورگر باز کنید:

```bash
# مسیر فایل
packages/components/src/DataDisplay/ColdWarCard.test.html
```

این فایل شامل:

- نمایش همه 5 variant
- توضیحات تکنیکال هر افکت
- مثال‌های کاربردی
- راهنمای انتخاب variant مناسب

---

## 📝 نتیجه‌گیری

کامپوننت ColdWarCard با 5 variant متمایز، طیف وسیعی از نیازهای UI را پوشش می‌دهد. هر variant با دقت طراحی شده تا:

1. **متمایز باشد**: هر افکت کاملاً قابل تشخیص از دیگری است
2. **کارآمد باشد**: استفاده از CSS خالص برای performance بهتر
3. **زیبا باشد**: توجه به جزئیات بصری و انیمیشن‌های smooth
4. **کاربردی باشد**: طراحی شده برای use case های واقعی

استفاده از این کامپوننت به شما امکان می‌دهد UI های حرفه‌ای با تم Cold War/Military را با سهولت ایجاد کنید.
