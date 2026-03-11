# صفحه اینترو جدید با Framer Motion

## تغییرات انجام شده

### 1. طراحی کاملاً جدید

- استفاده از Framer Motion برای انیمیشن‌های پیشرفته
- طراحی فوتوریستیک و جذاب مثل بازی‌های آینده‌نگر
- افکت‌های holographic و glitch

### 2. انیمیشن‌های پیشرفته

- **Grid Background متحرک**: پس‌زمینه شبکه‌ای با انیمیشن مداوم
- **Floating Particles**: 20 ذره شناور با حرکات تصادفی
- **Glitch Effect**: افکت glitch روی لوگو
- **Typing Effect**: افکت تایپ برای subtitle
- **Holographic Layers**: لایه‌های هولوگرافیک روی لوگو
- **Gradient Animation**: انیمیشن gradient روی متن
- **Shine Effect**: افکت درخشش روی دکمه‌ها
- **Parallax Scrolling**: افکت parallax هنگام اسکرول

### 3. المان‌های بصری جذاب

- **Clipped Corners**: گوشه‌های بریده شده برای دکمه‌ها و کارت‌ها
- **Neon Glow**: افکت نئون روی المان‌ها
- **Backdrop Blur**: افکت blur روی کارت‌ها
- **Animated Borders**: border های متحرک
- **Hover Effects**: افکت‌های hover پیشرفته

### 4. بهبود تجربه کاربری

- **Responsive Design**: طراحی واکنش‌گرا برای تمام سایزها
- **Smooth Transitions**: انتقال‌های نرم بین حالت‌ها
- **Interactive Elements**: المان‌های تعاملی با فیدبک بصری
- **Scroll Indicator**: نشانگر اسکرول متحرک

### 5. استفاده از Framer Motion

```tsx
- motion.div برای انیمیشن‌های پیشرفته
- useScroll و useTransform برای parallax
- AnimatePresence برای انیمیشن ورود/خروج
- whileHover و whileTap برای تعاملات
- variants برای انیمیشن‌های پیچیده
```

## فایل‌های ایجاد شده

- `packages/demo-app/src/pages/IntroPageNew.tsx` - صفحه اینترو جدید

## فایل‌های به‌روزرسانی شده

- `packages/demo-app/src/App.tsx` - استفاده از IntroPageNew

## نصب Dependencies

```bash
npm install framer-motion --workspace=packages/demo-app
```

## ویژگی‌های کلیدی

### Hero Section

- لوگو با افکت holographic و glitch
- Gradient متحرک روی متن
- دکمه‌های CTA با افکت shine
- Tech stack badges با انیمیشن

### Features Section

- کارت‌های feature با hover effects
- Border های متحرک
- Clipped corners برای ظاهر فوتوریستیک
- انیمیشن ورود با whileInView

### Background Effects

- Grid متحرک
- Floating particles با حرکات تصادفی
- Radial gradient background

## اجرا

```bash
npm run dev --workspace=packages/demo-app
```

صفحه اینترو جدید در آدرس `/` در دسترس است.
