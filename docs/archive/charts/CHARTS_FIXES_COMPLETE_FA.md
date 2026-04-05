# چارت‌های رفع شده - خلاصه نهایی

## TASK 1: رفع Radar - Skip Points Chart

**STATUS**: ✅ COMPLETE

### مشکل

- نقاط null نباید رسم شوند اما خطوط باید بین تمام نقاط (شامل null positions) متصل شوند
- هر dataset باید 6 نقطه را نمایش دهد که یک 6 ضلعی را تشکیل دهند
- فقط نقاط غیر-null باید دارای dot marker باشند

### حل

تابع `drawRadarSkipPoints` بازنویسی شد:

- خطوط اکنون تمام 6 نقطه را متصل می‌کنند (null positions = 0 value)
- فقط نقاط غیر-null دارای dot markers هستند
- `closePath()` اضافه شد برای بستن شکل 6 ضلعی
- هر دو dataset (Player 1 و Player 2) به درستی نمایش داده می‌شوند

### تغییرات

- **فایل**: `packages/demo-app/src/pages/ChartsShowcase.tsx`
- **توابع**:
  - `drawRadarSkipPoints` (خط 355)
  - `drawRadarSkipPoints` (خط 3782 - داخل component)

---

## TASK 2: رفع Combo Bar/Line Chart Overflow

**STATUS**: ✅ COMPLETE

### مشکل

- Combo Bar/Line Chart از چارت بیرون زده از سمت پایین
- Bars با استفاده از `(barData.length - 1)` محاسبه می‌شد (مثل line chart)
- این باعث می‌شد bars در انتهای canvas بیرون بروند

### حل

تابع `drawComboBarLine` بازنویسی شد:

- Bar positioning تغییر کرد: `(i * chartWidth) / barData.length` به جای `(i * chartWidth) / (barData.length - 1)`
- Bar width محاسبه درست شد: `(chartWidth / barData.length) * 0.6`
- Line points اکنون با bars هماهنگ هستند
- `bottomPadding` از 40 به 60 تغییر کرد برای رفع overflow عمودی
- Label positioning اصلاح شد تا با bars هماهنگ باشد

### تغییرات

- **فایل**: `packages/demo-app/src/pages/ChartsShowcase.tsx`
- **توابع**:
  - `drawComboBarLine` (خط 7)
  - `drawComboBarLine` (خط 3433 - داخل component)

---

## نتیجه نهایی

✅ **Radar - Skip Points**: 6 نقطه متصل یک 6 ضلعی را تشکیل می‌دهند
✅ **Combo Bar/Line Chart**: بدون overflow، bars و lines هماهنگ هستند
✅ **هیچ Syntax Error**: تمام تغییرات بدون خطا اعمال شدند

---

## فایل‌های تغییر یافته

- `packages/demo-app/src/pages/ChartsShowcase.tsx`
