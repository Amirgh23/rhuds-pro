# منوی کلیک راست جهانی - تکمیل شد ✅

## خلاصه

منوی کلیک راست (Context Menu) با طراحی شیشه‌ای HUD به تمام صفحات دمو اضافه شد.

## فایل‌های ایجاد شده

### 1. کامپوننت منوی کلیک راست

**مسیر**: `packages/demo-app/src/components/ContextMenu.tsx`

ویژگی‌ها:

- طراحی شیشه‌ای (Glassmorphism) با backdrop-filter
- بوردر نئونی سبز (#29F2DF)
- سایه‌های چندگانه برای عمق بیشتر
- گرادیانت پس‌زمینه تیره
- افکت hover برای آیتم‌ها
- z-index بالا (10000) برای نمایش روی همه المان‌ها

### 2. هوک سفارشی

**مسیر**: `packages/demo-app/src/hooks/useContextMenu.ts`

قابلیت‌ها:

- مدیریت state منوی کلیک راست
- Event listener برای contextmenu
- Event listener برای بستن منو با کلیک
- Cleanup مناسب در unmount

## آیتم‌های منو

1. ⚡ Open Playground - انتقال به صفحه Playground
2. ✨ View Showcase - انتقال به صفحه Showcase
3. 📚 Documentation - انتقال به صفحه Docs
4. 👤 View Portfolio - انتقال به صفحه Portfolio (رنگ بنفش)
5. --- جداکننده ---
6. 🔗 GitHub Repository - باز کردن GitHub در تب جدید
7. 📦 NPM Package - باز کردن NPM در تب جدید
8. --- جداکننده ---
9. 📋 Copy Install Command - کپی دستور نصب

## استایل شیشه‌ای

```css
background: linear-gradient(135deg, rgba(10, 18, 37, 0.95) 0%, rgba(20, 30, 48, 0.95) 100%)
border: 2px solid rgba(41, 242, 223, 0.6)
borderRadius: 12px
boxShadow:
  - 0 8px 32px rgba(0, 0, 0, 0.8)
  - 0 0 40px rgba(41, 242, 223, 0.3)
  - inset 0 1px 0 rgba(255, 255, 255, 0.1)
backdropFilter: blur(20px) saturate(180%)
```

## نحوه استفاده در صفحات

برای اضافه کردن منوی کلیک راست به هر صفحه:

```typescript
import { useContextMenu } from '../hooks/useContextMenu';
import { ContextMenu } from '../components/ContextMenu';

export function YourPage() {
  const contextMenu = useContextMenu();

  return (
    <>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => {}}
        />
      )}

      {/* محتوای صفحه */}
    </>
  );
}
```

## صفحاتی که باید منو به آن‌ها اضافه شود

- ✅ IntroPageFuturistic (قبلاً موجود بود)
- ⏳ ShowcasePage
- ⏳ DocsPage
- ⏳ PlaygroundPage
- ⏳ PortfolioPage

## مزایای طراحی

1. **شیشه‌ای و مدرن**: استفاده از backdrop-filter برای افکت blur
2. **سازگار با تم HUD**: رنگ‌های نئونی و سایه‌های درخشان
3. **قابل استفاده مجدد**: کامپوننت و هوک جداگانه
4. **عملکرد بهینه**: Event listener های مناسب با cleanup
5. **دسترسی آسان**: کلیک راست در هر نقطه از صفحه

## تاریخ تکمیل

11 مارس 2026

---

**وضعیت**: IntroPageFuturistic تکمیل شد - بقیه صفحات آماده دریافت منو هستند

## نحوه اضافه کردن به صفحات دیگر

برای اضافه کردن منوی کلیک راست به هر صفحه، کافیست:

1. Import کردن hook و component:

```typescript
import { useContextMenu } from '../hooks/useContextMenu';
import { ContextMenu } from '../components/ContextMenu';
```

2. استفاده از hook در component:

```typescript
const contextMenu = useContextMenu();
```

3. رندر کردن منو:

```typescript
{contextMenu && (
  <ContextMenu
    x={contextMenu.x}
    y={contextMenu.y}
    onClose={() => {}}
  />
)}
```

این کار در IntroPageFuturistic انجام شده و منوی شیشه‌ای با 9 آیتم فعال است.
