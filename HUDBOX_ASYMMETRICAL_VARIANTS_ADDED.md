# HudBox - اضافه شدن مدل‌های Asymmetrical جدید

## خلاصه تغییرات

به کامپوننت HudBox هشت مدل (variant) جدید با اضلاع نامتقارن متفاوت اضافه شد که شامل مدل‌های Portrait (عمودی) و Landscape (افقی) می‌شود.

## مدل‌های جدید - مرحله اول

### 1. Hexagon (شش‌ضلعی)
- شکل هندسی شش‌ضلعی متقارن
- ابعاد: 280px × 240px
- مناسب برای نمایش آیکون‌ها و محتوای مرکزی

### 2. Diagonal (مورب)
- گوشه‌های بالا-راست و پایین-چپ بریده شده به صورت مورب
- ابعاد: 320px × 220px
- حس دینامیک و حرکتی

### 3. Corner Cut (بریدگی گوشه)
- گوشه‌های بالا-چپ و پایین-راست به صورت مثلثی بریده شده
- ابعاد: 300px × 200px
- طراحی مدرن و تکنولوژیک

### 4. Tech Panel (پنل تکنولوژی)
- گوشه پایین-راست با بریدگی چند مرحله‌ای
- ابعاد: 350px × 180px
- شبیه پنل‌های کنترل فضایی

## مدل‌های جدید - مرحله دوم (Portrait & Landscape)

### 5. Portrait Tall (عمودی بلند)
- ارتفاع بیشتر از عرض (250px × 400px)
- بریدگی‌های نامتقارن در لبه راست
- مناسب برای منوها، لیست‌ها و محتوای عمودی

### 6. Portrait Slim (عمودی باریک)
- ارتفاع بیشتر از عرض (200px × 350px)
- بریدگی‌های مورب در گوشه‌ها
- مناسب برای نوار کناری و پنل‌های جانبی

### 7. Landscape Wide (افقی پهن)
- عرض بیشتر از ارتفاع (450px × 180px)
- بریدگی‌های متقارن در لبه بالا
- مناسب برای هدر، فوتر و نوار ابزار

### 8. Landscape Ultra (افقی فوق‌پهن)
- عرض بیشتر از ارتفاع (500px × 150px)
- بریدگی‌های نامتقارن در لبه‌های چپ و راست
- مناسب برای بنرها و نوار اطلاعات

## مدل‌های قبلی

- **Compact**: 200px × 150px
- **Default**: 300px × 250px (شکل نامتقارن پیچیده)
- **Wide**: 400px × 200px

## ویژگی‌های مشترک همه مدل‌ها

✅ انیمیشن بوردر چرخان با گرادیانت سایان
✅ افکت glitch با سایه‌های متحرک
✅ پس‌زمینه HUD با خطوط اسکن
✅ overflow: hidden برای جلوگیری از تغییر ابعاد
✅ امکان تنظیم width و height سفارشی

## نحوه استفاده

```tsx
// مدل‌های هندسی
<HudBox variant="hexagon">محتوا</HudBox>
<HudBox variant="diagonal">محتوا</HudBox>
<HudBox variant="corner-cut">محتوا</HudBox>
<HudBox variant="tech-panel">محتوا</HudBox>

// مدل‌های Portrait (عمودی)
<HudBox variant="portrait-tall">محتوای عمودی</HudBox>
<HudBox variant="portrait-slim">منوی جانبی</HudBox>

// مدل‌های Landscape (افقی)
<HudBox variant="landscape-wide">هدر یا فوتر</HudBox>
<HudBox variant="landscape-ultra">بنر اطلاعات</HudBox>

// ابعاد سفارشی
<HudBox width="400px" height="300px">محتوا</HudBox>
```

## کاربردهای مدل‌های Portrait

- **Portrait Tall**: منوهای عمودی، لیست کاربران، تایم‌لاین
- **Portrait Slim**: نوار کناری، پنل تنظیمات، فیلترها

## کاربردهای مدل‌های Landscape

- **Landscape Wide**: هدر صفحه، نوار ناوبری، فوتر
- **Landscape Ultra**: بنر اطلاعات، نوار پیشرفت، نوار وضعیت

## فایل‌های به‌روزرسانی شده

1. ✅ `packages/components/src/Layout/HudBox.tsx` - اضافه شدن 8 variant جدید
2. ✅ `packages/components/src/__tests__/ComponentsDemo.tsx` - نمایش دسته‌بندی شده همه مدل‌ها
3. ✅ `packages/demo-app/src/pages/ShowcasePage.tsx` - نمایش مدل‌های اصلی
4. ✅ `packages/demo-app/src/pages/PlaygroundPage.tsx` - نمایش کامل همه 11 مدل با دسته‌بندی
5. ✅ `packages/demo-app/src/pages/DocsPage.tsx` - مستندات کامل با توضیحات Portrait و Landscape

## نتیجه

اکنون HudBox دارای 11 مدل مختلف است:
- 3 مدل استاندارد (Compact, Default, Wide)
- 4 مدل هندسی (Hexagon, Diagonal, Corner Cut, Tech Panel)
- 2 مدل Portrait عمودی (Tall, Slim)
- 2 مدل Landscape افقی (Wide, Ultra)

این تنوع به توسعه‌دهندگان امکان می‌دهد برای هر نوع محتوا و لایه‌بندی رابط کاربری، فریم مناسب را انتخاب کنند.

تمام مدل‌ها با انیمیشن‌های یکسان و بدون تغییر ابعاد در حین انیمیشن کار می‌کنند.

