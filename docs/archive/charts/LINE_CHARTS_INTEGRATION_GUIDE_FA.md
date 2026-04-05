# راهنمای Integration - Line Chart Variants

## 🎯 هدف

اضافه کردن 6 نوع Line Chart variant به ChartsShowcase.tsx

---

## 📋 فایل‌های آماده شده

1. ✅ `LINE_CHARTS_ALL_FUNCTIONS.ts` - تمام 6 تابع drawing
2. ✅ `LINE_CHARTS_JSX_CARDS.tsx` - JSX cards برای نمایش
3. ✅ `LINE_CHARTS_USEEFFECT.ts` - useEffect calls
4. ✅ `LINE_CHARTS_VARIANTS_COMPLETE_FA.md` - مستندات فارسی
5. ✅ `LINE_CHARTS_INTEGRATION_GUIDE_FA.md` - این راهنما

---

## 🔧 مراحل Integration (گام‌به‌گام)

### مرحله 1: اضافه کردن Drawing Functions ✅

**فایل**: `packages/demo-app/src/pages/ChartsShowcase.tsx`
**محل**: قبل از تابع `drawMixedChart` (خط 2080)

**مراحل**:

1. فایل `LINE_CHARTS_ALL_FUNCTIONS.ts` را باز کنید
2. تمام محتوای آن را کپی کنید (Ctrl+A, Ctrl+C)
3. فایل `ChartsShowcase.tsx` را باز کنید
4. به خط 2079 بروید (یک خط قبل از `const drawMixedChart`)
5. یک خط خالی ایجاد کنید
6. محتوای کپی شده را paste کنید (Ctrl+V)
7. فایل را ذخیره کنید (Ctrl+S)

**نتیجه**: 6 تابع جدید قبل از `drawMixedChart` اضافه می‌شوند (~510 خط)

---

### مرحله 2: اضافه کردن useEffect Calls ⏳

**فایل**: `packages/demo-app/src/pages/ChartsShowcase.tsx`
**محل**: در useEffect که chart ها را render می‌کند

**مراحل**:

1. فایل `LINE_CHARTS_USEEFFECT.ts` را باز کنید
2. تمام محتوای آن را کپی کنید
3. فایل `ChartsShowcase.tsx` را باز کنید
4. useEffect اصلی را پیدا کنید (جایی که `drawLineChart`, `drawBarChart` و غیره صدا زده می‌شوند)
5. به انتهای useEffect بروید (قبل از `}, [animationProgress, ...])`)
6. محتوای کپی شده را paste کنید
7. فایل را ذخیره کنید

**نتیجه**: 6 chart جدید در هر render رسم می‌شوند

---

### مرحله 3: اضافه کردن JSX Cards ⏳

**فایل**: `packages/demo-app/src/pages/ChartsShowcase.tsx`
**محل**: در بخش JSX، بعد از Bar Chart variants

**مراحل**:

1. فایل `LINE_CHARTS_JSX_CARDS.tsx` را باز کنید
2. تمام محتوای آن را کپی کنید
3. فایل `ChartsShowcase.tsx` را باز کنید
4. به بخش JSX بروید (return statement)
5. بخش Bar Chart variants را پیدا کنید
6. بعد از آخرین `</div>` از Bar Charts، محتوای کپی شده را paste کنید
7. فایل را ذخیره کنید

**نتیجه**: 6 chart card جدید در UI نمایش داده می‌شوند

---

### مرحله 4: تست و بررسی ⏳

**مراحل**:

1. فایل را ذخیره کنید
2. به terminal بروید
3. دستور زیر را اجرا کنید:

```bash
npm run dev
```

4. مرورگر را باز کنید: `http://localhost:5173`
5. به صفحه Charts Showcase بروید
6. scroll کنید و Line Chart Variants را ببینید
7. بررسی کنید که همه 6 chart به درستی نمایش داده می‌شوند
8. انیمیشن‌ها را بررسی کنید
9. دکمه‌های Export و Copy را تست کنید

---

### مرحله 5: بررسی Errors ⏳

**دستور**:

```bash
npm run lint
```

اگر error وجود داشت، آن را برطرف کنید.

---

## 🎨 انواع Line Chart اضافه شده

1. **Line Interpolation** - Linear, Smooth, Step
2. **Multi Axis Line** - دو محور Y
3. **Point Styling** - 7 شکل مختلف
4. **Segment Styling** - رنگ‌های متفاوت
5. **Stepped Line** - Step-before, Step-after, Step-middle
6. **Line Styling** - Solid, Dashed, Dotted

---

## 📊 آمار

- **توابع جدید**: 6
- **خطوط کد**: ~510
- **JSX cards**: 6
- **useEffect calls**: 6
- **Refs**: 6 (قبلاً اضافه شده)

---

## ✅ Checklist

- [x] Refs اضافه شدند
- [x] Drawing functions نوشته شدند
- [ ] Drawing functions به فایل اصلی اضافه شوند
- [ ] useEffect calls اضافه شوند
- [ ] JSX cards اضافه شوند
- [ ] تست و بررسی
- [ ] بررسی errors
- [ ] مستندات نهایی

---

## 🚀 بعد از Integration

وقتی تمام مراحل انجام شد:

1. Screenshot از charts بگیرید
2. مستند نهایی ایجاد کنید
3. به کاربر گزارش دهید
4. به مرحله بعدی بروید (Area Charts, Radar Charts, etc.)

---

## 💡 نکات مهم

1. **Refs قبلاً اضافه شدند** - نیازی به اضافه کردن مجدد نیست
2. **Drawing functions باید قبل از drawMixedChart باشند** - ترتیب مهم است
3. **useEffect calls باید در useEffect اصلی باشند** - نه در useEffect جداگانه
4. **JSX cards باید در charts-grid باشند** - برای responsive layout
5. **همه chart ها باید canvas ref داشته باشند** - برای rendering

---

## 🎊 پایان

با انجام این مراحل، 6 نوع Line Chart variant به پروژه اضافه می‌شوند!

**پیشرفت کلی**: 93% → 95% (با integration کامل)
