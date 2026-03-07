# تغییر پالت رنگی به 3 رنگ مشخص شده

## رنگ‌های جدید

تمام دموهای کامپوننت‌ها اکنون فقط از این 3 رنگ استفاده می‌کنند:

1. **Cyan (فیروزه‌ای روشن)**
   - RGBA: `rgba(41, 242, 223, 1)`
   - HEX: `#29F2DF`
   - استفاده: رنگ اصلی، متن‌ها، خطوط اصلی

2. **Magenta (صورتی/ارغوانی)**
   - RGBA: `rgba(239, 62, 241, 1)`
   - HEX: `#EF3EF1`
   - استفاده: رنگ تاکیدی، دکمه‌ها، هایلایت‌ها

3. **Blue (آبی تیره)**
   - RGBA: `rgba(28, 127, 166, 1)`
   - HEX: `#1C7FA6`
   - استفاده: رنگ ثانویه، پس‌زمینه‌ها، سایه‌ها

## فایل‌های به‌روزرسانی شده

### 1. ArwesFramesDemo.tsx ✅
- تمام رنگ‌های `#0ff` به `rgba(41, 242, 223, 1)` تبدیل شد
- تمام رنگ‌های `#ff0` به `rgba(239, 62, 241, 1)` تبدیل شد
- رنگ‌های HSL به RGBA تبدیل شدند
- 15 تغییر دستی انجام شد

### 2. demo.html ✅
- رنگ‌های `#0ff`, `#ff0`, `#0f0`, `#f0f`, `#fa0`, `#0af` جایگزین شدند
- 12 تغییر

### 3. glitch-login-demo.html ✅
- رنگ `#00f6ff` به `#29F2DF` تبدیل شد
- رنگ `rgba(0, 246, 255, ...)` به `rgba(41, 242, 223, ...)` تبدیل شد
- رنگ `#1BFD9C` به `#1C7FA6` تبدیل شد
- 27 تغییر

### 4. test-heartrate.html ✅
- رنگ‌های `#00f6ff`, `#1BFD9C`, `#DE6262` جایگزین شدند
- 8 تغییر

### 5. ComponentsDemo.tsx ✅
- رنگ `#DE6262` به `#EF3EF1` تبدیل شد
- 1 تغییر

## آمار کلی

- **تعداد فایل‌های به‌روزرسانی شده**: 5 فایل
- **تعداد کل تغییرات**: 61+ تغییر
- **فایل‌های دستی**: 1 فایل (ArwesFramesDemo.tsx)
- **فایل‌های خودکار**: 4 فایل (از طریق اسکریپت PowerShell)

## نحوه استفاده

برای اعمال این تغییرات در آینده، می‌توانید از اسکریپت `apply-3-color-palette.ps1` استفاده کنید:

```powershell
powershell -ExecutionPolicy Bypass -File apply-3-color-palette.ps1
```

## نتیجه

✅ تمام دموهای کامپوننت‌ها اکنون با پالت رنگی یکپارچه 3 رنگی کار می‌کنند
✅ ظاهر بصری سیستم طراحی یکدست و حرفه‌ای‌تر شده است
✅ رنگ‌ها به صورت استاندارد در تمام فایل‌ها استفاده می‌شوند

## فایل‌های باقی‌مانده

فایل‌های زیر قبلاً از همین 3 رنگ استفاده می‌کردند و نیازی به تغییر نداشتند:

- FramesDemo.tsx (قبلاً از #29F2DF, #EF3EF1, #1C7FA6 استفاده می‌کرد)
- HudButtonDemo.tsx
- GlitchButtonDemo.tsx
- FormDemo.tsx
- FeedbackDemo.tsx
- DataDisplayDemo.tsx
- AdvancedDemo.tsx
- UtilityDemo.tsx
- NavigationDemo.tsx
- AudioDemo.tsx
- AnimatorDemo.tsx
- AdvancedDemo.tsx (animation)
- BackgroundsDemo.tsx
- glitch-frame-demo.html
- pipboy-test.html

تاریخ: 7 مارس 2026
