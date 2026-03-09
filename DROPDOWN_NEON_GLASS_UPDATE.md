# Dropdown Neon Glass HUD Update ✨

## تغییرات اعمال شده

تمام dropdown ها و utility components با استایل شیشه‌ای نئون HUD به‌روزرسانی شدند.

### 1. Dropdown Component (`packages/components/src/Utility/Dropdown.tsx`)

**استایل‌های جدید:**

- **Background**: `rgba(10, 18, 37, 0.5)` - شفاف تر برای افکت شیشه‌ای
- **Backdrop Filter**: `blur(20px)` - افکت شیشه‌ای مدرن
- **Border**: `2px solid #29F2DF` - نئون سایبر
- **Border Radius**: `0px` - گوشه‌های تیز برای استایل HUD
- **Box Shadow**: چندین لایه برای نئون glow:
  - `0 0 20px #29F2DF40` - glow خارجی
  - `0 0 40px #29F2DF20` - glow دوم
  - `inset 0 0 20px #29F2DF15` - glow داخلی
  - `inset 0 0 40px rgba(41, 242, 223, 0.05)` - glow داخلی ضعیف

**Hover Effects:**

- Background: `#29F2DF20` - رنگ نئون شفاف
- Border Left: `3px solid #29F2DF` - خط نئون
- Box Shadow: `inset 0 0 15px #29F2DF30, 0 0 10px #29F2DF40` - glow بیشتر

**Dividers:**

- Box Shadow: `0 0 10px #29F2DF60` - نئون glow

### 2. Tooltip Component (`packages/components/src/Utility/Tooltip.tsx`)

**استایل‌های جدید:**

- **Background**: `rgba(10, 18, 37, 0.6)` - شفاف با blur
- **Backdrop Filter**: `blur(15px)` - افکت شیشه‌ای
- **Border**: `1px solid #29F2DF` - نئون
- **Color**: `#29F2DF` - متن نئون
- **Box Shadow**: `0 0 15px #29F2DF60, inset 0 0 10px #29F2DF20` - نئون glow

### 3. Popover Component (`packages/components/src/Utility/Popover.tsx`)

**استایل‌های جدید:**

- **Background**: `rgba(10, 18, 37, 0.5)` - شفاف
- **Backdrop Filter**: `blur(20px)` - افکت شیشه‌ای
- **Border**: `2px solid #29F2DF` - نئون
- **Box Shadow**: همانند Dropdown - نئون glow کامل
- **Header**: `inset 0 0 10px #29F2DF20` - glow داخلی

### 4. Select Component (`packages/components/src/Select/Select.tsx`)

**استایل‌های جدید:**

- **Dropdown**: همانند Dropdown - شیشه‌ای نئون
- **Search Input**: `rgba(10, 18, 37, 0.3)` با `inset 0 0 10px #29F2DF20`
- **Options Hover**: نئون glow effects
- **Error State**: رنگ magenta `#EF3EF1` برای validation

## ویژگی‌های کلیدی

✨ **Neon Glass Morphism**

- شفافیت و blur برای افکت شیشه‌ای مدرن
- نئون glow برای استایل سایبرپانک

🎮 **HUD Aesthetic**

- گوشه‌های تیز (0px border-radius)
- رنگ‌های نئون (#29F2DF و #EF3EF1)
- Glow effects برای عمق بصری

⚡ **Interactive Effects**

- Hover animations با نئون glow
- Border-left animation برای items
- Smooth transitions

## نحوه استفاده

```tsx
import { Dropdown, Tooltip, Popover, Select } from '@rhuds/components';

// Dropdown
<Dropdown
  items={[
    { key: 'item1', label: 'Profile', icon: '👤' },
    { key: 'item2', label: 'Settings', icon: '⚙️' },
  ]}
>
  <Button>Open Menu</Button>
</Dropdown>

// Tooltip
<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>

// Popover
<Popover content={<Text>Content</Text>} title="Title">
  <Button>Click me</Button>
</Popover>

// Select
<Select
  options={[
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
  ]}
  value={selected}
  onChange={setSelected}
/>
```

## فایل‌های تغییر یافته

- `packages/components/src/Utility/Dropdown.tsx`
- `packages/components/src/Utility/Tooltip.tsx`
- `packages/components/src/Utility/Popover.tsx`
- `packages/components/src/Select/Select.tsx`

## تست

برای دیدن تغییرات:

1. سرور dev را شروع کنید: `npm run dev` در `packages/demo-app`
2. به صفحه Playground یا Documentation بروید
3. Dropdown، Tooltip، Popover و Select components را test کنید

یا فایل HTML test را باز کنید:
`packages/components/src/Utility/dropdown-neon-test.html`

---

**Status**: ✅ Complete
**Date**: March 9, 2026
