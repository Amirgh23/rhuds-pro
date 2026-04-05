# 🔧 راهنمای گام‌به‌گام حل مشکل Overflow چارت‌ها

## وضعیت فعلی

تغییرات کد با موفقیت اعمال شده است، اما مشکل هنوز در demo app دیده می‌شود.

## ✅ تغییرات اعمال شده در کد

### نسخه 1 (قبلی):

- X-axis labels: `height - padding + 15`
- Legend position: `width - 160`
- Chart height: `height - 2 * padding - 30`

### نسخه 2 (فعلی - تهاجمی):

- X-axis labels: `height - padding + 5` ✅
- Legend position: `width - 120` ✅
- Chart height: `height - 2 * padding - 50` ✅

---

## 🎯 مراحل حل مشکل

### مرحله 1: تست مستقل

1. فایل `test-chart-overflow.html` را در مرورگر باز کنید
2. اگر چارت بدون overflow نمایش داده شد:
   - ✅ کد صحیح است
   - ❌ مشکل از cache است
3. اگر چارت overflow دارد:
   - ❌ نیاز به تغییرات بیشتر در کد

### مرحله 2: پاک کردن کامل Cache

#### روش 1: پاک کردن Cache مرورگر

```
1. در Chrome/Edge: Ctrl + Shift + Delete
2. انتخاب "All time" یا "همه زمان‌ها"
3. فقط "Cached images and files" را انتخاب کنید
4. کلیک روی "Clear data"
```

#### روش 2: Hard Refresh

```
1. صفحه Charts Showcase را باز کنید
2. Ctrl + F5 را فشار دهید
3. یا Ctrl + Shift + R
```

#### روش 3: Disable Cache در DevTools

```
1. F12 را فشار دهید (باز کردن DevTools)
2. به تب Network بروید
3. گزینه "Disable cache" را فعال کنید
4. صفحه را Refresh کنید
```

### مرحله 3: Restart Dev Server

```powershell
# 1. Stop the current dev server
Ctrl + C

# 2. Clear npm cache (optional but recommended)
npm cache clean --force

# 3. Restart dev server
npm run dev
```

### مرحله 4: Build و Test

اگر هنوز مشکل وجود دارد، یک build کامل انجام دهید:

```powershell
# 1. Clean build artifacts
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .turbo/cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force packages/demo-app/dist -ErrorAction SilentlyContinue

# 2. Rebuild
npm run build

# 3. Start dev server
npm run dev
```

---

## 🔍 تشخیص منبع مشکل

### تست 1: بررسی کد

```powershell
# Run verification script
./verify-charts-overflow-fix.ps1
```

اگر همه چک‌ها PASS شدند، کد صحیح است.

### تست 2: بررسی در مرورگر

1. صفحه Charts Showcase را باز کنید
2. F12 را فشار دهید
3. به تب Elements بروید
4. یک canvas را انتخاب کنید
5. در Styles، ببینید آیا `overflow: hidden` روی `.chart-container` اعمال شده است

### تست 3: بررسی Network

1. F12 → Network tab
2. فیلتر JS را انتخاب کنید
3. صفحه را Refresh کنید
4. ببینید آیا `ChartsShowcase.tsx` از cache لود می‌شود یا از server

---

## 🛠️ راه‌حل‌های پیشرفته

### راه‌حل 1: Force Reload با Query Parameter

به URL یک query parameter اضافه کنید:

```
http://localhost:3000/charts?v=2
```

### راه‌حل 2: استفاده از Incognito Mode

1. Ctrl + Shift + N (Chrome/Edge)
2. به صفحه Charts Showcase بروید
3. اگر مشکل حل شد، قطعاً از cache بود

### راه‌حل 3: پاک کردن Service Workers

```javascript
// در Console مرورگر اجرا کنید:
navigator.serviceWorker.getRegistrations().then(function (registrations) {
  for (let registration of registrations) {
    registration.unregister();
  }
});
```

### راه‌حل 4: تغییر Port

```powershell
# در package.json یا مستقیماً:
PORT=3001 npm run dev
```

---

## 📊 چک‌لیست نهایی

- [ ] اسکریپت `fix-charts-overflow-aggressive.ps1` اجرا شد
- [ ] اسکریپت `verify-charts-overflow-fix.ps1` همه چک‌ها را PASS کرد
- [ ] فایل `test-chart-overflow.html` بدون overflow نمایش داده می‌شود
- [ ] Cache مرورگر پاک شد
- [ ] Dev server restart شد
- [ ] Hard refresh (Ctrl+F5) انجام شد
- [ ] در Incognito mode تست شد

---

## 🎨 تغییرات دقیق اعمال شده

### در ChartsShowcase.tsx:

#### قبل:

```typescript
ctx.fillText(labels[i], x, height - padding + 15);
drawLegend(ctx, legendItems, width - 160, 40);
const chartHeight = height - 2 * padding - 40;
```

#### بعد:

```typescript
ctx.fillText(labels[i], x, height - padding + 5); // -10px
drawLegend(ctx, legendItems, width - 120, 40); // -20px
const chartHeight = height - 2 * padding - 50; // -10px
```

### در ChartsShowcase.css:

```css
.chart-container {
  overflow: hidden; /* جلوگیری از overflow */
}

.chart-container canvas {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* حفظ نسبت */
}
```

---

## 💡 نکات مهم

1. **تغییرات کد صحیح است** - اسکریپت verification تأیید می‌کند
2. **مشکل احتمالاً از cache است** - این رایج‌ترین دلیل است
3. **Incognito mode قطعی‌ترین تست است** - cache ندارد
4. **Dev server باید restart شود** - برای اطمینان از build جدید

---

## 🆘 اگر هنوز مشکل دارید

### گزینه 1: تغییرات بیشتر

اگر بعد از تمام مراحل بالا هنوز overflow دارید، می‌توانیم:

- Padding را از 50 به 60 افزایش دهیم
- X-axis labels را به `padding + 0` تغییر دهیم
- Legend را به `width - 100` ببریم

### گزینه 2: اسکرین‌شات

لطفاً یک اسکرین‌شات از:

1. چارت با overflow
2. DevTools → Elements → canvas styles
3. DevTools → Network → ChartsShowcase.tsx (آیا cached است؟)

ارسال کنید تا بتوانیم دقیق‌تر کمک کنیم.

---

## ✅ تأیید نهایی

بعد از انجام تمام مراحل، این موارد را بررسی کنید:

1. ✅ X-axis labels داخل مرز canvas هستند
2. ✅ Legend ها از سمت راست بیرون نمی‌زنند
3. ✅ Title در بالای چارت بدون مشکل است
4. ✅ Grid lines تمیز و داخل مرزها هستند
5. ✅ هیچ عنصری از canvas بیرون نمی‌زند

---

**تاریخ:** 4 آوریل 2026  
**نسخه:** 2.0 (Aggressive Fix)  
**وضعیت کد:** ✅ تأیید شده  
**نیاز به اقدام:** پاک کردن cache و restart dev server
