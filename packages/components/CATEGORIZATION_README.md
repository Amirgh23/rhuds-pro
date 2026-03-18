# دسته‌بندی کامپوننت‌های RHUDS Pro

## 📖 مقدمه

این پوشه شامل **100+ کامپوننت React** است که به **15 دسته اصلی** تقسیم شده‌اند. هر دسته شامل کامپوننت‌های مرتبط و فایل‌های پشتیبانی است.

---

## 📁 ساختار دسته‌ها

### 1. **Button** - دکمه‌ها

- Button (استاندارد)
- HudButton (سایبرپانک)
- GlitchButton (Glitch)

### 2. **Input** - ورودی‌های متنی

- Input (استاندارد)
- HackerInput (هکر)
- AiHudInput (AI HUD)
- HoloGlitchInput (Holo Glitch)
- HoloInput (Holo)
- FuturisticInput (آینده‌نگر)

### 3. **Form** - عناصر فرم

- Checkbox, Radio, Switch (استاندارد)
- HudInput, HudSelect, HudRange (HUD)
- GlitchLoginForm, HoloCheckbox (تخصصی)
- useForm (Hook)

### 4. **Layout** - چیدمان

- Grid, Container, Stack (پایه‌ای)
- HudBox, HudFrame (HUD)
- NeonLine, GlitchFrame, TitleBox (تخصصی)

### 5. **Navigation** - ناوبری

- Navbar, Sidebar, Breadcrumb
- Tabs, Menu, Pagination

### 6. **DataDisplay** - نمایش داده

- Table, DataGrid, Tree (جداول)
- CyberCard, GlitchProfileCard (کارت‌ها)
- RadarHud, PipBoy (نمایش‌های خاص)
- HudTable\* (10 variant)

### 7. **Feedback** - بازخورد

- Modal, Dialog (مودال‌ها)
- Notification, GradientAlert (اطلاع‌رسانی)
- HudToastProvider (Toast)

### 8. **Utility** - کمکی‌ها

- Tooltip, Popover, Dropdown, Portal

### 9. **Advanced** - پیشرفته

- Carousel, Accordion, Stepper
- CodeEditor, RichTextEditor

### 10. **Specialized** - تخصصی

- Slider, DatePicker, ColorPicker, FileUpload

### 11. **Visualization** - تجسم داده

- Chart

### 12. **Loader** - بارگذاری

- AbstergoLoader, HeartRateLoader, HackerLoader

### 13. **Icon** - آیکون

- Icon

### 14. **Text** - متن

- Text

### 15. **Select** - انتخاب

- Select

---

## 🚀 شروع سریع

### نصب

```bash
npm install @rhuds/components
```

### استفاده

```tsx
import { Button, HudBox, Tabs } from '@rhuds/components';

export default function App() {
  return (
    <HudBox variant="primary">
      <Button>Click me</Button>
      <Tabs items={[]} />
    </HudBox>
  );
}
```

---

## 📚 فایل‌های راهنما

| فایل                            | توضیح                  |
| ------------------------------- | ---------------------- |
| COMPONENT_ORGANIZATION_GUIDE.md | راهنمای کامل دسته‌بندی |
| COMPONENT_STRUCTURE.md          | ساختار دقیق فایل‌ها    |
| COMPONENT_USAGE_MAP.md          | نقشه‌ی انتخاب کامپوننت |
| CATEGORIZATION_SUMMARY.md       | خلاصه‌ی دسته‌بندی      |
| QUICK_REFERENCE.md              | مرجع سریع              |
| CATEGORIZATION_README.md        | این فایل               |

---

## 🎯 نکات مهم

### 1. هر دسته دارای:

- فایل‌های کامپوننت (Component.tsx)
- فایل types.ts برای Props
- فایل index.ts برای Export

### 2. نام‌گذاری:

- کامپوننت‌ها: PascalCase
- فایل‌ها: PascalCase
- Hooks: camelCase

### 3. Export:

- تمام کامپوننت‌ها از `packages/components/src/index.ts` export می‌شوند
- هر دسته یک `index.ts` دارد برای export محلی

---

## 💡 بهترین‌های عملی

### ✅ درست

```tsx
import { Button, HudBox } from '@rhuds/components';
```

### ❌ نادرست

```tsx
import Button from '@rhuds/components/Button/Button';
```

---

## 📊 آمار

- **دسته‌های اصلی**: 15
- **کامپوننت‌های کل**: 100+
- **فایل‌های TypeScript**: 120+
- **فایل‌های تست**: 15+

---

## 🔗 لینک‌های مفید

- [COMPONENT_ORGANIZATION_GUIDE.md](./COMPONENT_ORGANIZATION_GUIDE.md)
- [COMPONENT_STRUCTURE.md](./COMPONENT_STRUCTURE.md)
- [COMPONENT_USAGE_MAP.md](./COMPONENT_USAGE_MAP.md)
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

---

## 📞 پشتیبانی

برای سؤالات و پیشنهادات، لطفاً مراجعه کنید:

- 📖 [داکومنتیشن](./COMPONENT_ORGANIZATION_GUIDE.md)
- 🐙 GitHub Issues
- 📧 Email
