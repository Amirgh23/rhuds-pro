# GlitchRadio Component Added ✅

## خلاصه (Summary)
کامپوننت GlitchRadio با افکت‌های glitch و pulse به بخش Form اضافه شد.

## کامپوننت جدید (New Component)

### GlitchRadio
**مسیر:** `packages/components/src/Form/GlitchRadio.tsx`

**ویژگی‌ها:**
- Radio button با افکت glitch در hover
- انیمیشن pulse برای گزینه انتخاب شده
- پشتیبانی از حالت disabled
- استایل cyberpunk/hacker با فونت monospace
- افکت text-shadow و glow برای گزینه فعال
- دو لایه pulse با تأخیر متفاوت

**Props:**
```typescript
interface GlitchRadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface GlitchRadioProps {
  name: string;                    // نام گروه radio
  options: GlitchRadioOption[];    // لیست گزینه‌ها
  value?: string;                  // مقدار انتخاب شده
  onChange?: (value: string) => void;  // تابع تغییر
  className?: string;              // کلاس CSS اضافی
}
```

**استفاده:**
```tsx
import { GlitchRadio } from '@rhuds/components';

const [protocol, setProtocol] = useState('tcp');

<GlitchRadio
  name="protocol"
  value={protocol}
  onChange={setProtocol}
  options={[
    { value: 'tcp', label: 'PROTOCOL_TCP' },
    { value: 'udp', label: 'PROTOCOL_UDP' },
    { value: 'legacy', label: '[LEGACY_SYSTEM]', disabled: true },
  ]}
/>
```

## ویژگی‌های فنی (Technical Features)

### انیمیشن‌ها
1. **Glitch Effect** - در hover روی label
   - استفاده از `clip-path` برای ایجاد افکت glitch
   - دو لایه pseudo-element (::before و ::after)
   - رنگ‌های متفاوت (cyan و purple)
   - مدت زمان: 0.4 ثانیه

2. **Pulse Wave** - برای گزینه انتخاب شده
   - دو لایه pulse با تأخیر 0s و 0.3s
   - انیمیشن scale از 1 به 2.5
   - fade out با opacity
   - تکرار بی‌نهایت

### استایل‌ها
- **رنگ اصلی:** #00f2ea (cyan)
- **رنگ ثانویه:** #a855f7 (purple)
- **فونت:** Fira Code, Consolas, Courier New
- **پس‌زمینه:** #050505 (تقریباً سیاه)
- **Border radius:** 1rem برای wrapper

### حالت‌ها (States)
1. **Normal** - حالت پیش‌فرض
2. **Checked** - گزینه انتخاب شده با:
   - Radio dot visible (scale: 1)
   - Text color: cyan
   - Text shadow: glow effect
   - Pulse animations active
3. **Hover** - افکت glitch روی label
4. **Disabled** - غیرفعال با:
   - Opacity: 0.5
   - Color: #555
   - Cursor: not-allowed
   - بدون افکت‌های hover

### Keyframes
```typescript
const glitchAnimText = keyframes`...`;  // افکت glitch
const pulseWave = keyframes`...`;       // افکت pulse
```

## یکپارچه‌سازی (Integration)

### ✅ Export از Index
```typescript
// packages/components/src/index.ts
export { GlitchRadio } from './Form/GlitchRadio';
export type { GlitchRadioProps, GlitchRadioOption } from './Form/GlitchRadio';
```

### ✅ اضافه شده به ShowcasePage
**بخش:** "Form (8)" - Section "10b. GlitchRadio (Glitch Style)"
- 3 گزینه: PROTOCOL_TCP, PROTOCOL_UDP, [LEGACY_SYSTEM]
- گزینه سوم disabled است
- مقدار پیش‌فرض: 'tcp'
- State: `glitchRadioValue`

### ✅ به‌روزرسانی تعداد کامپوننت‌ها
- تعداد Form از 7 به 8 افزایش یافت

## فایل‌های تغییر یافته (Modified Files)

1. ✅ `packages/components/src/Form/GlitchRadio.tsx` - ایجاد شد
2. ✅ `packages/components/src/index.ts` - export اضافه شد
3. ✅ `packages/demo-app/src/pages/ShowcasePage.tsx` - import، state و نمایش اضافه شد

## تأیید (Verification)

### ✅ بدون خطای TypeScript
```
packages/components/src/Form/GlitchRadio.tsx: No diagnostics found
packages/demo-app/src/pages/ShowcasePage.tsx: No diagnostics found
```

### ✅ Hot Module Reload
```
8:35:30 AM [vite] hmr update /src/pages/ShowcasePage.tsx (x4)
```

## مکان‌های نمایش (Demo Locations)

کاربران می‌توانند GlitchRadio را در این مکان‌ها ببینند:

1. **ShowcasePage** - Tab "Form (8)" → Section "10b. GlitchRadio (Glitch Style)"

## مثال‌های استفاده (Usage Examples)

### پایه
```tsx
<GlitchRadio
  name="option"
  options={[
    { value: '1', label: 'OPTION_1' },
    { value: '2', label: 'OPTION_2' },
  ]}
/>
```

### با State
```tsx
const [value, setValue] = useState('1');

<GlitchRadio
  name="option"
  value={value}
  onChange={setValue}
  options={[
    { value: '1', label: 'OPTION_1' },
    { value: '2', label: 'OPTION_2' },
  ]}
/>
```

### با Disabled
```tsx
<GlitchRadio
  name="option"
  options={[
    { value: '1', label: 'ACTIVE' },
    { value: '2', label: 'INACTIVE', disabled: true },
  ]}
/>
```

### سفارشی‌سازی
```tsx
<GlitchRadio
  name="protocol"
  value={protocol}
  onChange={setProtocol}
  className="my-custom-radio"
  options={[
    { value: 'http', label: 'HTTP/1.1' },
    { value: 'http2', label: 'HTTP/2.0' },
    { value: 'http3', label: 'HTTP/3.0' },
    { value: 'ftp', label: '[DEPRECATED]', disabled: true },
  ]}
/>
```

## مقایسه با Radio معمولی

| ویژگی | Radio | GlitchRadio |
|-------|-------|-------------|
| استایل | ساده | Cyberpunk/Glitch |
| انیمیشن | ندارد | Glitch + Pulse |
| فونت | Sans-serif | Monospace |
| افکت‌ها | ندارد | Glow + Shadow |
| پس‌زمینه | شفاف | مشکی |
| Wrapper | ندارد | دارد |

## CSS Variables

```css
--bg-color: #0d0d0d;
--primary-color: #00f2ea;
--secondary-color: #a855f7;
--text-color: #e5e5e5;
--disabled-color: #555;
--font-family: 'Fira Code', Consolas, 'Courier New', Courier, monospace;
--glitch-anim-duration: 0.4s;
```

## وضعیت: ✅ کامل (COMPLETE)

کامپوننت GlitchRadio به طور کامل پیاده‌سازی شده، به بخش Form اضافه شده، و در ShowcasePage نمایش داده می‌شود. سرور dev بدون خطا در حال اجرا است و تمام تغییرات hot-reload شده‌اند.
