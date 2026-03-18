# ساختار دقیق کامپوننت‌های RHUDS Pro

## خلاصه آماری

| دسته          | تعداد     | توضیح                  |
| ------------- | --------- | ---------------------- |
| Button        | 3         | دکمه‌های مختلف         |
| Input         | 6         | ورودی‌های متنوع        |
| Form          | 15+       | فرم‌ها و عناصر فرم     |
| Layout        | 8         | کامپوننت‌های چیدمان    |
| Navigation    | 6         | کامپوننت‌های ناوبری    |
| DataDisplay   | 20+       | جداول و کارت‌ها        |
| Feedback      | 6         | مودال‌ها و اطلاع‌رسانی |
| Utility       | 4         | کامپوننت‌های کمکی      |
| Advanced      | 5         | کامپوننت‌های پیشرفته   |
| Specialized   | 4         | کامپوننت‌های تخصصی     |
| Visualization | 1         | نمودارها               |
| Loader        | 3         | بارگذارها              |
| Icon          | 1         | آیکون‌ها               |
| Text          | 1         | متن                    |
| Select        | 1         | انتخاب‌کننده           |
| **کل**        | **~100+** | **کامپوننت کامل**      |

---

## 1️⃣ Button (دکمه‌ها)

```
Button/
├── Button.tsx              # دکمه استاندارد
├── HudButton.tsx           # دکمه HUD
├── GlitchButton.tsx        # دکمه Glitch
├── types.ts                # تعریف Props
└── index.ts                # Export
```

### کامپوننت‌ها:

- `Button` - دکمه پایه‌ای
- `HudButton` - دکمه سایبرپانک
- `GlitchButton` - دکمه با افکت Glitch

---

## 2️⃣ Input (ورودی‌ها)

```
Input/
├── Input.tsx               # ورودی استاندارد
├── HackerInput.tsx         # ورودی هکر
├── AiHudInput.tsx          # ورودی AI HUD
├── HoloGlitchInput.tsx     # ورودی Holo Glitch
├── HoloInput.tsx           # ورودی Holo
├── FuturisticInput.tsx     # ورودی آینده‌نگر
├── types.ts                # تعریف Props
└── index.ts                # Export
```

### کامپوننت‌ها:

- `Input` - ورودی پایه‌ای
- `HackerInput` - ورودی با استایل هکر
- `AiHudInput` - ورودی AI HUD
- `HoloGlitchInput` - ورودی Holo Glitch
- `HoloInput` - ورودی Holo
- `FuturisticInput` - ورودی آینده‌نگر

---

## 3️⃣ Form (فرم‌ها)

```
Form/
├── Checkbox.tsx            # چک‌باکس
├── HoloCheckbox.tsx        # چک‌باکس Holo
├── Radio.tsx               # رادیو
├── GlitchRadio.tsx         # رادیو Glitch
├── NeonRadio.tsx           # رادیو Neon
├── Switch.tsx              # سوئیچ
├── GlitchLoginForm.tsx     # فرم لاگین Glitch
├── HudFormControl.tsx      # کنترل فرم HUD
├── HudFormElements.tsx     # عناصر فرم HUD
├── useForm.ts              # Hook فرم
├── types.ts                # تعریف Props
└── index.ts                # Export
```

### کامپوننت‌های استاندارد:

- `Checkbox` - چک‌باکس
- `Radio` / `RadioGroup` - رادیو
- `Switch` - سوئیچ

### کامپوننت‌های HUD:

- `HudInput` - ورودی HUD
- `HudTextarea` - متن‌باکس HUD
- `HudSelect` - انتخاب‌کننده HUD
- `HudRange` - رنج HUD
- `HudCheckbox` - چک‌باکس HUD
- `HudRadio` - رادیو HUD
- `HudSwitch` - سوئیچ HUD
- `HudFile` - آپلود فایل HUD
- `HudFormGrid` - شبکه فرم HUD
- `HudFormHelpText` - متن کمکی HUD
- `HudInputGroup` - گروه ورودی HUD
- `HudFormFeedback` - بازخورد فرم HUD
- `HudInputValidated` - ورودی تایید‌شده HUD
- `HudSelectValidated` - انتخاب‌کننده تایید‌شده HUD
- `HudTextareaValidated` - متن‌باکس تایید‌شده HUD

### کامپوننت‌های تخصصی:

- `GlitchLoginForm` - فرم لاگین Glitch
- `HoloCheckbox` - چک‌باکس Holo
- `GlitchRadio` - رادیو Glitch
- `NeonRadio` - رادیو Neon

### Hooks:

- `useForm` - مدیریت فرم

---

## 4️⃣ Layout (چیدمان)

```
Layout/
├── Grid.tsx                # شبکه
├── Container.tsx           # ظرف
├── Stack.tsx               # پشته
├── HudBox.tsx              # جعبه HUD (18 variant)
├── HudFrame.tsx            # فریم HUD
├── NeonLine.tsx            # خط Neon
├── GlitchFrame.tsx         # فریم Glitch
├── TitleBox.tsx            # جعبه عنوان
├── types.ts                # تعریف Props
└── index.ts                # Export
```

### کامپوننت‌ها:

- `Grid` - شبکه Flexbox
- `Container` - ظرف
- `Stack` - پشته (Flexbox)
- `HudBox` - جعبه HUD (18 variant)
- `HudFrame` - فریم HUD
- `NeonLine` - خط Neon
- `GlitchFrame` - فریم Glitch
- `TitleBox` - جعبه عنوان

---

## 5️⃣ Navigation (ناوبری)

```
Navigation/
├── Navbar.tsx              # نوار ناوبری
├── Sidebar.tsx             # نوار کناری
├── Breadcrumb.tsx          # مسیر
├── Tabs.tsx                # تب‌ها
├── Menu.tsx                # منو
├── Pagination.tsx          # صفحه‌بندی
├── types.ts                # تعریف Props
└── index.ts                # Export
```

### کامپوننت‌ها:

- `Navbar` - نوار ناوبری
- `Sidebar` - نوار کناری
- `Breadcrumb` - مسیر
- `Tabs` - تب‌ها
- `Menu` - منو
- `Pagination` - صفحه‌بندی

---

## 6️⃣ DataDisplay (نمایش داده)

```
DataDisplay/
├── Table.tsx               # جدول استاندارد
├── DataGrid.tsx            # شبکه داده
├── Tree.tsx                # درخت
├── CyberCard.tsx           # کارت سایبرپانک
├── GlitchProfileCard.tsx   # کارت پروفایل Glitch
├── RadarHud.tsx            # رادار HUD
├── PipBoy.tsx              # PipBoy
├── PipBoySimple.tsx        # PipBoy ساده
├── HudTableBasic.tsx       # جدول HUD پایه
├── HudTableBorderless.tsx  # جدول بدون حاشیه
├── HudTableHoverable.tsx   # جدول با Hover
├── HudTableStriped.tsx     # جدول راه‌راه
├── HudTableDark.tsx        # جدول تیره
├── HudTableBordered.tsx    # جدول با حاشیه
├── HudTableContextual.tsx  # جدول متنی
├── HudTableCaption.tsx     # جدول با عنوان
├── HudTableSmall.tsx       # جدول کوچک
├── HudTableResponsive.tsx  # جدول واکنش‌پذیر
├── types.ts                # تعریف Props
└── index.ts                # Export
```

### جداول:

- `Table` - جدول استاندارد
- `DataGrid` - شبکه داده
- `HudTableBasic` - جدول HUD پایه
- `HudTableBorderless` - جدول بدون حاشیه
- `HudTableHoverable` - جدول با Hover
- `HudTableStriped` - جدول راه‌راه
- `HudTableDark` - جدول تیره
- `HudTableBordered` - جدول با حاشیه
- `HudTableContextual` - جدول متنی
- `HudTableCaption` - جدول با عنوان
- `HudTableSmall` - جدول کوچک
- `HudTableResponsive` - جدول واکنش‌پذیر

### کارت‌ها و نمایش‌ها:

- `CyberCard` - کارت سایبرپانک
- `GlitchProfileCard` - کارت پروفایل Glitch
- `RadarHud` - رادار HUD
- `PipBoy` - PipBoy (Fallout style)
- `PipBoySimple` - PipBoy ساده
- `Tree` - درخت

---

## 7️⃣ Feedback (بازخورد)

```
Feedback/
├── Modal.tsx               # مودال
├── Dialog.tsx              # دیالوگ
├── Notification.tsx        # اطلاع‌رسانی
├── NotificationProvider.tsx # فراهم‌کننده اطلاع‌رسانی
├── GradientAlert.tsx       # هشدار گرادیان
├── HudToastProvider.tsx    # فراهم‌کننده Toast HUD
├── types.ts                # تعریف Props
└── index.ts                # Export
```

### کامپوننت‌ها:

- `Modal` - مودال
- `Dialog` - دیالوگ
- `Notification` - اطلاع‌رسانی
- `NotificationProvider` - فراهم‌کننده اطلاع‌رسانی
- `GradientAlert` - هشدار گرادیان
- `HudToastProvider` - فراهم‌کننده Toast HUD

---

## 8️⃣ Utility (کمکی)

```
Utility/
├── Tooltip.tsx             # نکته‌ی ابزار
├── Popover.tsx             # پاپ‌اور
├── Dropdown.tsx            # منوی کشویی
├── Portal.tsx              # پورتال
├── types.ts                # تعریف Props
└── index.ts                # Export
```

### کامپوننت‌ها:

- `Tooltip` - نکته‌ی ابزار
- `Popover` - پاپ‌اور
- `Dropdown` - منوی کشویی
- `Portal` - پورتال (Teleport)

---

## 9️⃣ Advanced (پیشرفته)

```
Advanced/
├── Carousel.tsx            # کاروسل
├── Accordion.tsx           # آکاردئون
├── Stepper.tsx             # مراحل
├── CodeEditor.tsx          # ویرایشگر کد
├── RichTextEditor.tsx      # ویرایشگر متن غنی
├── types.ts                # تعریف Props
└── index.ts                # Export
```

### کامپوننت‌ها:

- `Carousel` - کاروسل
- `Accordion` - آکاردئون
- `Stepper` - مراحل
- `CodeEditor` - ویرایشگر کد
- `RichTextEditor` - ویرایشگر متن غنی

---

## 🔟 Specialized (تخصصی)

```
Specialized/
├── Slider.tsx              # لغزنده
├── DatePicker.tsx          # انتخاب‌کننده تاریخ
├── ColorPicker.tsx         # انتخاب‌کننده رنگ
├── FileUpload.tsx          # آپلود فایل
├── types.ts                # تعریف Props
└── index.ts                # Export
```

### کامپوننت‌ها:

- `Slider` - لغزنده
- `DatePicker` - انتخاب‌کننده تاریخ
- `ColorPicker` - انتخاب‌کننده رنگ
- `FileUpload` - آپلود فایل

---

## 1️⃣1️⃣ Visualization (تجسم داده)

```
Visualization/
├── Chart.tsx               # نمودار
├── types.ts                # تعریف Props
└── index.ts                # Export
```

### کامپوننت‌ها:

- `Chart` - نمودار

---

## 1️⃣2️⃣ Loader (بارگذاری)

```
Loader/
├── AbstergoLoader.tsx      # بارگذار Abstergo
├── HeartRateLoader.tsx     # بارگذار ضربان قلب
├── HackerLoader.tsx        # بارگذار هکر
└── index.ts                # Export
```

### کامپوننت‌ها:

- `AbstergoLoader` - بارگذار Abstergo
- `HeartRateLoader` - بارگذار ضربان قلب
- `HackerLoader` - بارگذار هکر

---

## 1️⃣3️⃣ Icon (آیکون)

```
Icon/
├── Icon.tsx                # آیکون
├── types.ts                # تعریف Props
└── index.ts                # Export
```

### کامپوننت‌ها:

- `Icon` - آیکون

---

## 1️⃣4️⃣ Text (متن)

```
Text/
├── Text.tsx                # متن
├── types.ts                # تعریف Props
└── index.ts                # Export
```

### کامپوننت‌ها:

- `Text` - متن

---

## 1️⃣5️⃣ Select (انتخاب)

```
Select/
├── Select.tsx              # انتخاب‌کننده
├── types.ts                # تعریف Props
└── index.ts                # Export
```

### کامپوننت‌ها:

- `Select` - انتخاب‌کننده

---

## 📁 ساختار کلی

```
packages/components/
├── src/
│   ├── Button/
│   ├── Input/
│   ├── Form/
│   ├── Layout/
│   ├── Navigation/
│   ├── DataDisplay/
│   ├── Feedback/
│   ├── Utility/
│   ├── Advanced/
│   ├── Specialized/
│   ├── Visualization/
│   ├── Loader/
│   ├── Icon/
│   ├── Text/
│   ├── Select/
│   ├── utils/
│   ├── __tests__/
│   └── index.ts
├── COMPONENT_ORGANIZATION_GUIDE.md
├── COMPONENT_STRUCTURE.md
├── COMPONENTS_API.md
├── README.md
└── package.json
```

---

## نکات مهم

✅ **هر دسته دارای:**

- فایل‌های کامپوننت
- فایل `types.ts` برای تعریف Props
- فایل `index.ts` برای Export

✅ **نام‌گذاری:**

- کامپوننت‌ها: PascalCase (Button, HudBox)
- فایل‌ها: PascalCase (Button.tsx, HudBox.tsx)
- Hooks: camelCase (useForm, useNotification)

✅ **Export:**

- تمام کامپوننت‌ها از `packages/components/src/index.ts` export می‌شوند
- هر دسته یک `index.ts` دارد برای export محلی
