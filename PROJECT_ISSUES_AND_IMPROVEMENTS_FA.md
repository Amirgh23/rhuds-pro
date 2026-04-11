# لیست جامع مشکلات و بهبودهای پروژه RHUDS Pro

**تاریخ تهیه**: 8 آپریل 2026  
**وضعیت**: تحت بررسی و بهبود

---

## 📊 خلاصه اجمالی

| دسته‌بندی               | شدت       | تعداد               | تأثیر                             |
| ----------------------- | --------- | ------------------- | --------------------------------- |
| ایمنی نوع (Type Safety) | 🔴 بحرانی | 10+ فایل            | خطاهای runtime، پشتیبانی IDE ضعیف |
| تکرار کد (Duplication)  | 🔴 بحرانی | 100+ متغیر          | مشکل نگهداری، افزایش حجم بسته     |
| مستندات                 | 🔴 بحرانی | گمشده               | مشکل توسعه، مانع پذیرش            |
| تست                     | 🟡 متوسط  | ناقص                | کیفیت کد نامعلوم                  |
| عملکرد                  | 🟡 متوسط  | نمی‌شود اندازه‌گیری | کندی احتمالی                      |
| دسترسی‌پذیری            | 🟡 متوسط  | تأیید نشده          | ریسک انطباق                       |
| پیکربندی ساخت           | 🟡 متوسط  | ناسازگار            | مشکل استقرار                      |

---

## 🔴 مشکلات بحرانی

### 1. ایمنی نوع (Type Safety) - 🔴 بحرانی

#### مشکلات شناسایی‌شده:

- **استفاده بیش‌ازحد از `any`**:
  - `packages/webgl/src/RHUDSWebGLRenderer.ts` (خط 70)
  - `packages/hooks/src/useFormField.ts` (چندین مورد)
  - `packages/core/src/types/styled.d.ts` (کل فایل)
  - فایل‌های تست (برای mocking)

- **تعریف‌های نوع ناقص**:
  - برخی کامپوننت‌ها فاقد TypeScript types مناسب
  - پوشش نوع ناقص در تست‌ها

- **TypeScript Strict Mode غیرفعال**:
  - تمام پکیج‌ها باید در حالت strict باشند

#### راه‌حل مرحله‌ای:

**مرحله 1: تشخیص و ثبت** (1-2 روز)

```bash
# تمام استفاده‌های any را پیدا کنید
grep -r "any" packages/*/src --include="*.ts" --include="*.tsx"

# فایل‌های بدون تعریف نوع را شناسایی کنید
find packages -name "*.ts" -o -name "*.tsx" | xargs grep -L "export type\|export interface"
```

**مرحله 2: فعال‌کردن Strict Mode** (1 روز)

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

**مرحله 3: جایگزینی `any`** (3-5 روز)

- شروع از `packages/core`
- سپس `packages/components`
- سپس `packages/webgl`
- نهایتاً `packages/hooks`

**مرحله 4: اضافه‌کردن ESLint Rules** (1 روز)

```json
{
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-unsafe-assignment": "error",
  "@typescript-eslint/no-unsafe-member-access": "error"
}
```

---

### 2. تکرار کد (Component Duplication) - 🔴 بحرانی

#### مشکلات شناسایی‌شده:

**تکرار شدید**:

- 100+ متغیر کامپوننت (ColdWar*, Neon*, Glitch*, Cyber*)
- مثال: ColdWarButton, ColdWarHudButton, ColdWarGlitchButton, ColdWarNeonButton, ColdWarGridButton, ColdWarFingerprintButton, ColdWarGlitchHoverButton, ColdWarSliderButton, ColdWarSubscribeButton, ColdWarBorderButton
- همین الگو برای Input، Form، Loader، و غیره تکرار می‌شود

**نتایج منفی**:

- حجم بسته 2-3 برابر بیشتر
- نگهداری دشوار (تغییر یک باگ = تغییر 10+ فایل)
- صادرات index.ts 696 خط (ناخوانا)

#### راه‌حل مرحله‌ای:

**مرحله 1: ایجاد سیستم Theme-Aware** (3-5 روز)

```typescript
// packages/core/src/theme/ThemeProvider.tsx
interface ThemeConfig {
  name: 'rhuds' | 'coldwar' | 'cyberpunk';
  colors: ColorPalette;
  variants: ComponentVariants;
}

// استفاده:
<ThemeProvider theme="coldwar">
  <Button variant="primary" />
</ThemeProvider>
```

**مرحله 2: ایجاد Base Components** (5-7 روز)

```typescript
// packages/components/src/Button/BaseButton.tsx
interface BaseButtonProps {
  theme?: 'rhuds' | 'coldwar';
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

// سپس:
export const Button = (props) => <BaseButton {...props} theme="rhuds" />;
export const ColdWarButton = (props) => <BaseButton {...props} theme="coldwar" />;
```

**مرحله 3: حذف کامپوننت‌های تکراری** (3-5 روز)

- حفظ تنها Base Components
- ایجاد Theme Variants
- بروزرسانی صادرات

**مرحله 4: بهینه‌سازی Bundle** (2-3 روز)

- حذف 50-60% کد تکراری
- کاهش حجم بسته از ~500KB به ~200KB

---

### 3. مستندات - 🔴 بحرانی

#### مشکلات شناسایی‌شده:

**مستندات گمشده**:

- API Reference ناقص یا منسوخ
- راهنمای کامپوننت‌های انفرادی وجود ندارد
- راهنمای Theme نیست
- راهنمای مهاجرت نیست
- مستندات انطباق WCAG نیست

**مستندات بی‌نظم**:

- 100+ فایل markdown در root
- بدون سایت مستندات متمرکز
- بدون تولید خودکار API docs
- بدون Storybook

#### راه‌حل مرحله‌ای:

**مرحله 1: سازماندهی مستندات** (2-3 روز)

```
docs/
├── getting-started.md
├── installation.md
├── api/
│   ├── components.md
│   ├── hooks.md
│   ├── core.md
│   └── charts.md
├── guides/
│   ├── theming.md
│   ├── animation.md
│   ├── accessibility.md
│   └── performance.md
├── components/
│   ├── button.md
│   ├── input.md
│   └── ...
└── examples/
    ├── basic-usage.md
    └── advanced-patterns.md
```

**مرحله 2: ایجاد Storybook** (5-7 روز)

```bash
npx storybook@latest init
# برای هر کامپوننت: ComponentName.stories.tsx
```

**مرحله 3: تولید API Docs** (2-3 روز)

```bash
# استفاده از TypeDoc
npx typedoc --out docs/api packages/*/src/index.ts
```

**مرحله 4: ایجاد راهنمای‌های تخصصی** (5-7 روز)

- راهنمای Theming
- راهنمای Animation
- راهنمای Accessibility
- راهنمای Performance

---

## 🟡 مشکلات متوسط

### 4. تست (Testing) - 🟡 متوسط

#### مشکلات شناسایی‌شده:

- پوشش تست ناقص (بسیاری از کامپوننت‌ها بدون تست)
- بدون تست E2E
- بدون تست بازگشت بصری
- بدون تست دسترسی‌پذیری

#### راه‌حل مرحله‌ای:

**مرحله 1: تعیین حداقل پوشش** (1 روز)

```json
// vitest.config.ts
{
  "coverage": {
    "provider": "v8",
    "reporter": ["text", "json", "html"],
    "lines": 70,
    "functions": 70,
    "branches": 70,
    "statements": 70
  }
}
```

**مرحله 2: اضافه‌کردن تست‌های واحد** (7-10 روز)

- تست کامپوننت‌های اساسی
- تست Hooks
- تست Utilities

**مرحله 3: اضافه‌کردن تست E2E** (5-7 روز)

```bash
npm install -D @playwright/test
# یا
npm install -D cypress
```

**مرحله 4: تست دسترسی‌پذیری** (3-5 روز)

```bash
npm install -D @axe-core/playwright
```

---

### 5. عملکرد (Performance) - 🟡 متوسط

#### مشکلات شناسایی‌شده:

- بدون نظارت عملکرد
- حجم بسته نامعلوم
- بدون Code Splitting
- بدون تحلیل تصویر
- عملکرد CSS-in-JS ممکن است مشکل‌ساز باشد

#### راه‌حل مرحله‌ای:

**مرحله 1: اضافه‌کردن Bundle Analysis** (1-2 روز)

```bash
npm install -D size-limit @size-limit/webpack
```

**مرحله 2: اضافه‌کردن Performance Monitoring** (2-3 روز)

```typescript
// packages/demo-app/src/hooks/usePerformanceMonitoring.ts
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`${entry.name}: ${entry.duration}ms`);
      }
    });
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  }, []);
};
```

**مرحله 3: Code Splitting** (3-5 روز)

```typescript
// استفاده از React.lazy
const ColdWarComponents = lazy(() => import('./ColdWar'));
const CyberpunkComponents = lazy(() => import('./Cyberpunk'));
```

**مرحله 4: تحسین CSS-in-JS** (2-3 روز)

- استفاده از Babel plugin برای styled-components
- یا مهاجرت به CSS Modules

---

### 6. دسترسی‌پذیری (Accessibility) - 🟡 متوسط

#### مشکلات شناسایی‌شده:

- بدون تدقیق WCAG
- برچسب‌های ARIA گمشده
- ناوبری صفحه‌کلید تأیید نشده
- نسبت تضاد رنگ تأیید نشده
- پشتیبانی Screen Reader تأیید نشده

#### راه‌حل مرحله‌ای:

**مرحله 1: اضافه‌کردن Automated Testing** (1-2 روز)

```bash
npm install -D @axe-core/react
```

**مرحله 2: اضافه‌کردن ARIA Labels** (3-5 روز)

```typescript
<button aria-label="بستن" aria-pressed={isOpen}>
  ✕
</button>
```

**مرحله 3: تست Keyboard Navigation** (2-3 روز)

- Tab navigation
- Enter/Space activation
- Escape to close

**مرحله 4: تست Screen Reader** (2-3 روز)

- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (Mac)

---

### 7. پیکربندی ساخت (Build Configuration) - 🟡 متوسط

#### مشکلات شناسایی‌شده:

- ناسازگاری Vite
- بدون تحلیل Tree-shaking
- بدون شناسایی وابستگی دایره‌ای
- بدون حد اندازه بسته

#### راه‌حل مرحله‌ای:

**مرحله 1: استاندارد‌سازی Vite Config** (1-2 روز)

```typescript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion', 'gsap'],
        },
      },
    },
  },
};
```

**مرحله 2: اضافه‌کردن Bundle Analysis** (1 روز)

```bash
npm install -D rollup-plugin-visualizer
```

**مرحله 3: شناسایی وابستگی‌های دایره‌ای** (1 روز)

```bash
npm install -D madge
npx madge --circular packages/*/src
```

**مرحله 4: تعیین حد اندازه** (1 روز)

```json
// .size-limit.json
[
  {
    "path": "packages/components/dist/index.js",
    "limit": "200 KB"
  }
]
```

---

## 🟢 بهبودهای کوتاه‌مدت (1-2 هفته)

### 8. تمیز‌کردن Root Directory

**مشکل**: 100+ فایل markdown در root

**راه‌حل**:

```bash
# ایجاد ساختار جدید
mkdir -p .archive/documentation
mv PHASE_*.md .archive/documentation/
mv WEEK_*.md .archive/documentation/
mv DEPLOYMENT_*.md .archive/documentation/
```

**فایل‌های مهم برای نگهداری**:

- README.md
- CONTRIBUTING.md
- ARCHITECTURE.md
- START_HERE.md

---

### 9. بهبود Export Management

**مشکل**: `packages/components/src/index.ts` 696 خط

**راه‌حل**:

```typescript
// packages/components/src/index.ts
// Barrel exports برای هر دسته
export * from './Button';
export * from './Input';
export * from './Form';
export * from './DataDisplay';
export * from './Feedback';
export * from './Navigation';
export * from './Layout';
export * from './Advanced';
export * from './Loader';
export * from './Utility';
export * from './Specialized';
export * from './Visualization';

// سپس در هر پوشه:
// packages/components/src/Button/index.ts
export { Button } from './Button';
export { HudButton } from './HudButton';
export { GlitchButton } from './GlitchButton';
// ... و غیره
```

---

### 10. اضافه‌کردن Pre-commit Hooks

**مشکل**: بدون تأیید کیفیت قبل از commit

**راه‌حل**:

```json
// .husky/pre-commit
#!/bin/sh
npm run type-check
npm run lint
npm run test:run
```

---

## 🟢 بهبودهای درمیان‌مدت (2-4 هفته)

### 11. ایجاد Design System Documentation

**اهداف**:

- مستندات رنگ‌ها
- مستندات Typography
- مستندات Spacing
- مستندات Animation

**فایل‌های مورد نیاز**:

```
docs/design-system/
├── colors.md
├── typography.md
├── spacing.md
├── animation.md
├── icons.md
└── patterns.md
```

---

### 12. بهبود Error Handling

**مشکل**: بدون Error Boundaries

**راه‌حل**:

```typescript
// packages/core/src/components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
    // ارسال به سرویس logging
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

### 13. اضافه‌کردن Logging System

**مشکل**: بدون سیستم logging مرکزی

**راه‌حل**:

```typescript
// packages/core/src/utils/logger.ts
export const logger = {
  info: (msg: string, data?: unknown) => console.log(msg, data),
  warn: (msg: string, data?: unknown) => console.warn(msg, data),
  error: (msg: string, error?: Error) => console.error(msg, error),
};
```

---

## 🟢 بهبودهای بلندمدت (1-3 ماه)

### 14. مهاجرت به Design Tokens

**هدف**: استاندارد‌سازی تمام مقادیر طراحی

```typescript
// packages/core/src/tokens/index.ts
export const tokens = {
  colors: {
    primary: '#00ff00',
    secondary: '#ff00ff',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
  typography: {
    h1: { size: '32px', weight: 700 },
    body: { size: '16px', weight: 400 },
  },
};
```

---

### 15. ایجاد Component Composition Patterns

**هدف**: الگوهای استاندارد برای ترکیب کامپوننت‌ها

```typescript
// Compound Components Pattern
<Card>
  <Card.Header>
    <Card.Title>عنوان</Card.Title>
  </Card.Header>
  <Card.Body>محتوا</Card.Body>
  <Card.Footer>پاورقی</Card.Footer>
</Card>
```

---

### 16. اضافه‌کردن Visual Regression Testing

**ابزارها**:

- Percy
- Chromatic
- Pixelmatch

---

### 17. بهبود Performance Monitoring

**ابزارها**:

- Sentry
- LogRocket
- New Relic

---

## 📋 برنامه اجرایی مرحله‌ای

### هفته 1: مشکلات بحرانی

- [ ] تشخیص و ثبت مشکلات Type Safety
- [ ] فعال‌کردن TypeScript Strict Mode
- [ ] شروع جایگزینی `any` types
- [ ] تمیز‌کردن Root Directory

### هفته 2: تکرار کد

- [ ] ایجاد Base Components
- [ ] ایجاد Theme System
- [ ] شروع حذف کامپوننت‌های تکراری
- [ ] بهینه‌سازی صادرات

### هفته 3: مستندات

- [ ] سازماندهی مستندات
- [ ] ایجاد Storybook
- [ ] نوشتن راهنمای‌های اساسی

### هفته 4: تست و عملکرد

- [ ] اضافه‌کردن تست‌های واحد
- [ ] اضافه‌کردن Bundle Analysis
- [ ] اضافه‌کردن Performance Monitoring

### هفته 5-6: دسترسی‌پذیری و بهبودهای دیگر

- [ ] اضافه‌کردن Accessibility Testing
- [ ] بهبود Error Handling
- [ ] اضافه‌کردن Logging System

---

## 🎯 معیارهای موفقیت

| معیار                 | هدف              | وضعیت فعلی          |
| --------------------- | ---------------- | ------------------- |
| Type Safety           | 0% `any`         | 10+ فایل            |
| Component Duplication | 0% تکرار         | 100+ متغیر          |
| Test Coverage         | 70%+             | نامعلوم             |
| Bundle Size           | <200KB           | نامعلوم             |
| Accessibility         | WCAG 2.1 AA      | تأیید نشده          |
| Documentation         | 100% کامپوننت‌ها | 10%                 |
| Performance           | LCP <2.5s        | نمی‌شود اندازه‌گیری |

---

## 📞 نکات مهم

1. **شروع از مشکلات بحرانی**: Type Safety و Duplication
2. **تدریجی بودن**: هر مرحله 1-2 هفته
3. **خودکارسازی**: تا جای ممکن خودکار کنید
4. **تست**: هر تغییر باید تست شود
5. **مستندات**: هر تغییر باید مستند شود

---

**آخرین بروزرسانی**: 8 آپریل 2026
