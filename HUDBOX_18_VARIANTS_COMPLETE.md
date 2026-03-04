# HudBox - 18 مدل Asymmetrical کامل

## خلاصه نهایی

کامپوننت HudBox اکنون دارای 18 مدل (variant) مختلف با اضلاع نامتقارن است که تمام نیازهای طراحی رابط کاربری HUD را پوشش می‌دهد.

## دسته‌بندی کامل مدل‌ها

### 1. مدل‌های استاندارد (3 مدل)

#### Compact
- ابعاد: 200px × 150px
- کاربرد: کارت‌های کوچک، آیکون‌ها

#### Default
- ابعاد: 300px × 250px
- شکل نامتقارن پیچیده با بریدگی‌های چندگانه
- کاربرد: محتوای عمومی

#### Wide
- ابعاد: 400px × 200px
- کاربرد: محتوای پهن

### 2. مدل‌های هندسی (7 مدل)

#### Hexagon (شش‌ضلعی)
- ابعاد: 280px × 240px
- شکل شش‌ضلعی متقارن
- کاربرد: آیکون‌ها، نمایش مرکزی

#### Octagon (هشت‌ضلعی)
- ابعاد: 300px × 260px
- شکل هشت‌ضلعی متقارن
- کاربرد: دکمه‌های خاص، نشان‌ها

#### Diagonal (مورب)
- ابعاد: 320px × 220px
- گوشه‌های مورب بریده شده
- کاربرد: کارت‌های دینامیک

#### Corner Cut (بریدگی گوشه)
- ابعاد: 300px × 200px
- بریدگی مثلثی در گوشه‌ها
- کاربرد: پنل‌های مدرن

#### Tech Panel (پنل تکنولوژی)
- ابعاد: 350px × 180px
- بریدگی چند مرحله‌ای
- کاربرد: پنل‌های کنترل

#### Arrow Right (فلش راست)
- ابعاد: 340px × 200px
- شکل فلش به سمت راست
- کاربرد: دکمه‌های Next، پیشروی

#### Chevron (شورون)
- ابعاد: 320px × 210px
- شکل شورون با نوک تیز
- کاربرد: نشانگرها، دکمه‌های جهت‌دار

### 3. مدل‌های Portrait - عمودی (4 مدل)

#### Portrait Tall (عمودی بلند)
- ابعاد: 250px × 400px
- بریدگی‌های نامتقارن در لبه راست
- کاربرد: منوهای عمودی، لیست‌های بلند، تایم‌لاین

#### Portrait Slim (عمودی باریک)
- ابعاد: 200px × 350px
- بریدگی‌های مورب در گوشه‌ها
- کاربرد: نوار کناری، پنل تنظیمات، فیلترها

#### Portrait Card (کارت عمودی)
- ابعاد: 280px × 380px
- بریدگی در پایین
- کاربرد: کارت‌های پروفایل، کارت محصول

#### Portrait Banner (بنر عمودی)
- ابعاد: 220px × 320px
- بریدگی‌های متقارن در بالا و پایین
- کاربرد: بنرهای جانبی، تبلیغات عمودی

### 4. مدل‌های Landscape - افقی (4 مدل)

#### Landscape Wide (افقی پهن)
- ابعاد: 450px × 180px
- بریدگی‌های متقارن در لبه بالا
- کاربرد: هدر، فوتر، نوار ناوبری

#### Landscape Ultra (افقی فوق‌پهن)
- ابعاد: 500px × 150px
- بریدگی‌های نامتقارن در لبه‌های چپ و راست
- کاربرد: بنرهای افقی، نوار اطلاعات

#### Landscape Bar (نوار افقی)
- ابعاد: 550px × 120px
- بریدگی‌های ظریف در لبه راست
- کاربرد: نوار وضعیت، نوار پیشرفت، نوار ابزار

#### Landscape Ribbon (روبان افقی)
- ابعاد: 480px × 140px
- شکل روبان با نوک‌های تیز
- کاربرد: نوار اعلان، نوار پیام، روبان‌های تزئینی

## ویژگی‌های مشترک

✅ انیمیشن بوردر چرخان با گرادیانت سایان (#00f6ff)
✅ افکت glitch با سایه‌های متحرک
✅ پس‌زمینه HUD با خطوط اسکن
✅ overflow: hidden برای جلوگیری از تغییر ابعاد
✅ امکان تنظیم width و height سفارشی
✅ رنگ‌بندی HUD یکپارچه

## نحوه استفاده

```tsx
// مدل‌های استاندارد
<HudBox variant="compact">محتوا</HudBox>
<HudBox variant="default">محتوا</HudBox>
<HudBox variant="wide">محتوا</HudBox>

// مدل‌های هندسی
<HudBox variant="hexagon">محتوا</HudBox>
<HudBox variant="octagon">محتوا</HudBox>
<HudBox variant="diagonal">محتوا</HudBox>
<HudBox variant="corner-cut">محتوا</HudBox>
<HudBox variant="tech-panel">محتوا</HudBox>
<HudBox variant="arrow-right">بعدی</HudBox>
<HudBox variant="chevron">ادامه</HudBox>

// مدل‌های Portrait (عمودی)
<HudBox variant="portrait-tall">منوی عمودی</HudBox>
<HudBox variant="portrait-slim">نوار کناری</HudBox>
<HudBox variant="portrait-card">کارت پروفایل</HudBox>
<HudBox variant="portrait-banner">بنر جانبی</HudBox>

// مدل‌های Landscape (افقی)
<HudBox variant="landscape-wide">هدر صفحه</HudBox>
<HudBox variant="landscape-ultra">بنر اطلاعات</HudBox>
<HudBox variant="landscape-bar">نوار وضعیت</HudBox>
<HudBox variant="landscape-ribbon">نوار اعلان</HudBox>

// ابعاد سفارشی
<HudBox width="600px" height="400px">محتوای سفارشی</HudBox>
```

## کاربردهای عملی

### رابط کاربری Dashboard
```tsx
<HudBox variant="landscape-bar">نوار بالا</HudBox>
<HudBox variant="portrait-slim">منوی کناری</HudBox>
<HudBox variant="default">محتوای اصلی</HudBox>
```

### صفحه پروفایل
```tsx
<HudBox variant="portrait-card">عکس و اطلاعات</HudBox>
<HudBox variant="landscape-wide">بیوگرافی</HudBox>
```

### سیستم ناوبری
```tsx
<HudBox variant="arrow-right">بعدی</HudBox>
<HudBox variant="chevron">ادامه</HudBox>
```

## فایل‌های به‌روزرسانی شده

1. ✅ `packages/components/src/Layout/HudBox.tsx` - 18 variant با helper function
2. ✅ `packages/components/src/__tests__/ComponentsDemo.tsx` - نمایش دسته‌بندی شده همه 18 مدل
3. ✅ `packages/demo-app/src/pages/ShowcasePage.tsx` - نمایش کامل با دسته‌بندی
4. ✅ `packages/demo-app/src/pages/PlaygroundPage.tsx` - نمایش تعاملی همه 18 مدل
5. ✅ `packages/demo-app/src/pages/DocsPage.tsx` - مستندات کامل با توضیحات

## بهینه‌سازی‌ها

- استفاده از helper function `getClipPath` برای جلوگیری از تکرار کد
- دسته‌بندی واضح مدل‌ها در interface
- نام‌گذاری معنادار برای هر variant

## نتیجه

HudBox اکنون یک کامپوننت کامل و جامع برای ایجاد رابط‌های کاربری HUD است با:
- 18 مدل از پیش طراحی شده
- پوشش کامل نیازهای Portrait و Landscape
- انعطاف‌پذیری کامل با ابعاد سفارشی
- انیمیشن‌های پایدار و بدون تغییر layout

این کامپوننت می‌تواند برای ساخت هر نوع رابط کاربری HUD، از داشبوردهای پیچیده تا منوهای ساده، استفاده شود.
