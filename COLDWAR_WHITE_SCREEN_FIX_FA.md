# رفع مشکل صفحه سفید - Cold War Showcase

## تاریخ: 30 مارس 2026

## مشکل

هنگام اجرای پروژه و دسترسی به صفحه `/coldwar-showcase`، صفحه سفید نمایش داده می‌شد.

## علت مشکل

مشکل از دو بخش تشکیل شده بود:

### 1. Import نادرست ColdWarBubbleChartStyled

در فایل `packages/demo-app/src/pages/ColdWarShowcase.tsx`، کامپوننت `ColdWarBubbleChartStyled` از مسیر نسبی import شده بود:

```typescript
import { ColdWarBubbleChartStyled } from '../../../components/src/Visualization';
```

این مسیر نسبی در زمان اجرا به درستی resolve نمی‌شد.

### 2. Export ناقص در index.ts

کامپوننت `ColdWarBubbleChartStyled` در فایل `packages/components/src/index.ts` export نشده بود. فقط `ColdWarBubbleChart` export شده بود.

## راه‌حل

### تغییر 1: اصلاح Import در ColdWarShowcase.tsx

Import را از مسیر نسبی به package اصلی تغییر دادیم:

```typescript
// قبل:
import { ColdWarBubbleChartStyled } from '../../../components/src/Visualization';

// بعد:
import {
  // ... سایر imports
  ColdWarBubbleChartStyled,
} from '@rhuds/components';
```

### تغییر 2: اضافه کردن Export در index.ts

`ColdWarBubbleChartStyled` را به exports اصلی اضافه کردیم:

```typescript
// قبل:
export { ColdWarBubbleChart } from './Visualization/ColdWarBubbleChart';

// بعد:
export { ColdWarBubbleChart, ColdWarBubbleChartStyled } from './Visualization';
```

## نتیجه

✅ مشکل صفحه سفید برطرف شد
✅ تمام TypeScript errors رفع شدند
✅ HMR به درستی کار می‌کند
✅ صفحه Cold War Showcase اکنون به درستی نمایش داده می‌شود

## فایل‌های تغییر یافته

1. `packages/demo-app/src/pages/ColdWarShowcase.tsx` - اصلاح import
2. `packages/components/src/index.ts` - اضافه کردن export

## تست

- ✅ TypeScript diagnostics: بدون خطا
- ✅ Dev server: در حال اجرا بر روی پورت 3001
- ✅ HMR: به‌روزرسانی موفق

## توضیحات فنی

مشکل از این موضوع ناشی می‌شد که Vite و TypeScript نمی‌توانستند مسیر نسبی `../../../components/src/Visualization` را به درستی resolve کنند، زیرا این مسیر از workspace demo-app به workspace components اشاره می‌کرد. استفاده از package name (`@rhuds/components`) این مشکل را حل کرد چون Vite و TypeScript می‌دانند چگونه با monorepo workspace references کار کنند.

## دستورات مفید

```bash
# اجرای dev server
cd packages/demo-app
npm run dev

# دسترسی به صفحه
http://localhost:3001/coldwar-showcase
```

## وضعیت پروژه

- 🎯 تمام 96 کامپوننت Cold War ایجاد شده‌اند (100%)
- ✅ تمام کامپوننت‌ها در ColdWarShowcase.tsx نمایش داده می‌شوند
- ✅ مشکل صفحه سفید برطرف شد
- 🚀 پروژه آماده استفاده است
