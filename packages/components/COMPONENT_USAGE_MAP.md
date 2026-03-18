# نقشه‌ی استفاده کامپوننت‌های RHUDS Pro

## 🎯 انتخاب کامپوننت صحیح

### 1. برای دکمه‌ها

```
┌─────────────────────────────────────┐
│         نیاز دارید دکمه؟            │
└─────────────────────────────────────┘
         │
    ┌────┴────┐
    │          │
   ✅ معمولی   ✅ HUD    ✅ Glitch
    │          │          │
    ▼          ▼          ▼
  Button   HudButton  GlitchButton
```

**استفاده:**

```tsx
import { Button, HudButton, GlitchButton } from '@rhuds/components';

// دکمه معمولی
<Button variant="primary" size="md">Click</Button>

// دکمه HUD
<HudButton variant="primary">HUD Style</HudButton>

// دکمه Glitch
<GlitchButton>Glitch Effect</GlitchButton>
```

---

### 2. برای ورودی‌ها

```
┌─────────────────────────────────────┐
│      نیاز دارید ورودی متنی؟        │
└─────────────────────────────────────┘
         │
    ┌────┴────┬────────┬────────┬──────────┐
    │         │        │        │          │
  معمولی   هکر    AI HUD   Holo   Holo Glitch
    │         │        │        │          │
    ▼         ▼        ▼        ▼          ▼
  Input  HackerInput AiHudInput HoloInput HoloGlitchInput
```

**استفاده:**

```tsx
import {
  Input,
  HackerInput,
  AiHudInput,
  HoloInput,
  HoloGlitchInput,
  FuturisticInput
} from '@rhuds/components';

<Input placeholder="Standard" />
<HackerInput placeholder="Hacker" />
<AiHudInput placeholder="AI HUD" />
<HoloInput placeholder="Holo" />
<HoloGlitchInput placeholder="Holo Glitch" />
<FuturisticInput placeholder="Futuristic" />
```

---

### 3. برای فرم‌ها

```
┌─────────────────────────────────────┐
│      نیاز دارید عنصر فرم؟          │
└─────────────────────────────────────┘
         │
    ┌────┴────┬────────┬────────┬──────────┐
    │         │        │        │          │
  چک‌باکس   رادیو   سوئیچ   ورودی   انتخاب
    │         │        │        │          │
    ▼         ▼        ▼        ▼          ▼
 Checkbox  Radio   Switch   HudInput   HudSelect
```

**استفاده:**

```tsx
import {
  Checkbox,
  Radio,
  Switch,
  HudInput,
  HudSelect,
  useForm
} from '@rhuds/components';

// استفاده از Hook
const { values, handleChange, errors } = useForm({
  email: '',
  password: '',
  remember: false
});

// عناصر فرم
<HudInput
  name="email"
  value={values.email}
  onChange={handleChange}
/>

<HudSelect
  name="role"
  options={[
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' }
  ]}
/>

<Checkbox
  name="remember"
  checked={values.remember}
  onChange={handleChange}
/>

<Switch
  name="notifications"
  checked={values.notifications}
  onChange={handleChange}
/>
```

---

### 4. برای چیدمان

```
┌─────────────────────────────────────┐
│      نیاز دارید چیدمان؟            │
└─────────────────────────────────────┘
         │
    ┌────┴────┬────────┬────────┬──────────┐
    │         │        │        │          │
  شبکه    ظرف    پشته   جعبه   فریم
    │         │        │        │          │
    ▼         ▼        ▼        ▼          ▼
  Grid   Container  Stack   HudBox   HudFrame
```

**استفاده:**

```tsx
import { Grid, Container, Stack, HudBox, HudFrame } from '@rhuds/components';

// شبکه
<Grid columns={3} gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// ظرف
<Container maxWidth="lg">
  <p>Content</p>
</Container>

// پشته
<Stack direction="column" spacing="lg">
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>

// جعبه HUD
<HudBox variant="primary" padding="lg">
  <p>HUD Content</p>
</HudBox>

// فریم HUD
<HudFrame title="Title">
  <p>Frame Content</p>
</HudFrame>
```

---

### 5. برای ناوبری

```
┌─────────────────────────────────────┐
│      نیاز دارید ناوبری؟            │
└─────────────────────────────────────┘
         │
    ┌────┴────┬────────┬────────┬──────────┐
    │         │        │        │          │
  نوار    کناری   مسیر   تب‌ها  صفحه‌بندی
    │         │        │        │          │
    ▼         ▼        ▼        ▼          ▼
 Navbar  Sidebar Breadcrumb Tabs Pagination
```

**استفاده:**

```tsx
import { Navbar, Sidebar, Breadcrumb, Tabs, Pagination } from '@rhuds/components';

// نوار ناوبری
<Navbar
  items={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' }
  ]}
/>

// نوار کناری
<Sidebar
  items={[
    { label: 'Dashboard', icon: 'dashboard' },
    { label: 'Settings', icon: 'settings' }
  ]}
/>

// مسیر
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Details' }
  ]}
/>

// تب‌ها
<Tabs
  items={[
    { label: 'Tab 1', content: <div>Content 1</div> },
    { label: 'Tab 2', content: <div>Content 2</div> }
  ]}
/>

// صفحه‌بندی
<Pagination
  total={100}
  current={1}
  onPageChange={(page) => console.log(page)}
/>
```

---

### 6. برای نمایش داده

```
┌─────────────────────────────────────┐
│    نیاز دارید نمایش داده؟          │
└─────────────────────────────────────┘
         │
    ┌────┴────┬────────┬────────┬──────────┐
    │         │        │        │          │
  جدول    کارت   رادار   PipBoy   درخت
    │         │        │        │          │
    ▼         ▼        ▼        ▼          ▼
  Table  CyberCard RadarHud PipBoy   Tree
```

**استفاده:**

```tsx
import {
  Table,
  HudTableBasic,
  CyberCard,
  RadarHud,
  PipBoy
} from '@rhuds/components';

// جدول HUD
<HudTableBasic
  columns={['Name', 'Email', 'Status']}
  data={[
    { name: 'John', email: 'john@example.com', status: 'Active' },
    { name: 'Jane', email: 'jane@example.com', status: 'Inactive' }
  ]}
/>

// کارت سایبرپانک
<CyberCard
  title="Profile"
  image="avatar.jpg"
>
  <p>User information</p>
</CyberCard>

// رادار HUD
<RadarHud
  data={[
    { angle: 0, distance: 50 },
    { angle: 90, distance: 30 }
  ]}
/>

// PipBoy
<PipBoy
  sections={[
    { title: 'Stats', content: <div>Stats</div> },
    { title: 'Inventory', content: <div>Inventory</div> }
  ]}
/>
```

---

### 7. برای بازخورد

```
┌─────────────────────────────────────┐
│      نیاز دارید بازخورد؟           │
└─────────────────────────────────────┘
         │
    ┌────┴────┬────────┬────────┬──────────┐
    │         │        │        │          │
  مودال   دیالوگ  اطلاع   هشدار   Toast
    │         │        │        │          │
    ▼         ▼        ▼        ▼          ▼
  Modal   Dialog Notification Alert   Toast
```

**استفاده:**

```tsx
import {
  Modal,
  Dialog,
  GradientAlert,
  useNotification,
  useHudToast
} from '@rhuds/components';

// مودال
const [isOpen, setIsOpen] = useState(false);
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <p>Modal content</p>
</Modal>

// دیالوگ
<Dialog
  title="Confirm"
  onConfirm={() => console.log('Confirmed')}
  onCancel={() => console.log('Cancelled')}
>
  <p>Are you sure?</p>
</Dialog>

// هشدار
<GradientAlert type="success">
  Operation successful!
</GradientAlert>

// اطلاع‌رسانی
const { notify } = useNotification();
notify({
  message: 'Hello!',
  type: 'info',
  duration: 3000
});

// Toast HUD
const { toast } = useHudToast();
toast({
  message: 'HUD Toast',
  type: 'success'
});
```

---

### 8. برای کمکی‌ها

```
┌─────────────────────────────────────┐
│      نیاز دارید کمکی؟              │
└─────────────────────────────────────┘
         │
    ┌────┴────┬────────┬────────┐
    │         │        │        │
  نکته    پاپ‌اور  منو   پورتال
    │         │        │        │
    ▼         ▼        ▼        ▼
 Tooltip  Popover Dropdown Portal
```

**استفاده:**

```tsx
import { Tooltip, Popover, Dropdown, Portal } from '@rhuds/components';

// نکته‌ی ابزار
<Tooltip content="Help text" position="top">
  <button>Hover me</button>
</Tooltip>

// پاپ‌اور
<Popover
  content={<div>Popover content</div>}
  trigger="click"
>
  <button>Click me</button>
</Popover>

// منوی کشویی
<Dropdown
  items={['Option 1', 'Option 2', 'Option 3']}
  onSelect={(item) => console.log(item)}
>
  <button>Menu</button>
</Dropdown>

// پورتال
<Portal>
  <div>Content rendered outside DOM</div>
</Portal>
```

---

### 9. برای پیشرفته

```
┌─────────────────────────────────────┐
│      نیاز دارید پیشرفته؟           │
└─────────────────────────────────────┘
         │
    ┌────┴────┬────────┬────────┬──────────┐
    │         │        │        │          │
 کاروسل  آکاردئون  مراحل   کد   متن غنی
    │         │        │        │          │
    ▼         ▼        ▼        ▼          ▼
Carousel Accordion Stepper CodeEditor RichTextEditor
```

**استفاده:**

```tsx
import {
  Carousel,
  Accordion,
  Stepper,
  CodeEditor,
  RichTextEditor
} from '@rhuds/components';

// کاروسل
<Carousel
  items={[
    { image: 'img1.jpg', title: 'Slide 1' },
    { image: 'img2.jpg', title: 'Slide 2' }
  ]}
  autoPlay={true}
  interval={3000}
/>

// آکاردئون
<Accordion
  items={[
    { title: 'Section 1', content: <div>Content 1</div> },
    { title: 'Section 2', content: <div>Content 2</div> }
  ]}
/>

// مراحل
<Stepper
  steps={['Step 1', 'Step 2', 'Step 3']}
  current={1}
/>

// ویرایشگر کد
<CodeEditor
  language="javascript"
  value="console.log('Hello')"
  onChange={(code) => console.log(code)}
/>

// ویرایشگر متن غنی
<RichTextEditor
  value="<p>Hello</p>"
  onChange={(html) => console.log(html)}
/>
```

---

### 10. برای تخصصی

```
┌─────────────────────────────────────┐
│      نیاز دارید تخصصی؟             │
└─────────────────────────────────────┘
         │
    ┌────┴────┬────────┬────────┬──────────┐
    │         │        │        │          │
 لغزنده   تاریخ    رنگ    فایل
    │         │        │        │          │
    ▼         ▼        ▼        ▼          ▼
 Slider DatePicker ColorPicker FileUpload
```

**استفاده:**

```tsx
import {
  Slider,
  DatePicker,
  ColorPicker,
  FileUpload
} from '@rhuds/components';

// لغزنده
<Slider
  min={0}
  max={100}
  value={50}
  onChange={(value) => console.log(value)}
/>

// انتخاب‌کننده تاریخ
<DatePicker
  value={new Date()}
  onChange={(date) => console.log(date)}
/>

// انتخاب‌کننده رنگ
<ColorPicker
  value="#FF0000"
  onChange={(color) => console.log(color)}
/>

// آپلود فایل
<FileUpload
  accept=".pdf,.doc"
  onUpload={(files) => console.log(files)}
/>
```

---

### 11. برای تجسم داده

```
┌─────────────────────────────────────┐
│      نیاز دارید نمودار؟            │
└─────────────────────────────────────┘
         │
         ▼
       Chart
```

**استفاده:**

```tsx
import { Chart } from '@rhuds/components';

<Chart
  type="line"
  data={[
    { x: 1, y: 10 },
    { x: 2, y: 20 },
    { x: 3, y: 15 },
  ]}
  title="Sales"
/>;
```

---

### 12. برای بارگذاری

```
┌─────────────────────────────────────┐
│      نیاز دارید بارگذار؟           │
└─────────────────────────────────────┘
         │
    ┌────┴────┬────────┬──────────┐
    │         │        │          │
 Abstergo  ضربان   هکر
    │         │        │          │
    ▼         ▼        ▼          ▼
AbstergoLoader HeartRateLoader HackerLoader
```

**استفاده:**

```tsx
import {
  AbstergoLoader,
  HeartRateLoader,
  HackerLoader
} from '@rhuds/components';

<AbstergoLoader />
<HeartRateLoader />
<HackerLoader />
```

---

## 📊 جدول مقایسه

| نیاز         | کامپوننت      | استایل    | پیچیدگی |
| ------------ | ------------- | --------- | ------- |
| دکمه معمولی  | Button        | Standard  | ⭐      |
| دکمه HUD     | HudButton     | Cyberpunk | ⭐⭐    |
| دکمه Glitch  | GlitchButton  | Glitch    | ⭐⭐⭐  |
| ورودی معمولی | Input         | Standard  | ⭐      |
| ورودی HUD    | HudInput      | Cyberpunk | ⭐⭐    |
| جدول معمولی  | Table         | Standard  | ⭐⭐    |
| جدول HUD     | HudTableBasic | Cyberpunk | ⭐⭐    |
| فرم          | useForm       | -         | ⭐⭐⭐  |
| مودال        | Modal         | Standard  | ⭐⭐    |
| کاروسل       | Carousel      | Advanced  | ⭐⭐⭐  |

---

## 🎨 انتخاب بر اساس استایل

### استایل Standard

- Button
- Input
- Table
- Modal
- Dialog

### استایل Cyberpunk/HUD

- HudButton
- HudInput
- HudBox
- HudFrame
- HudTableBasic
- HudFormControl

### استایل Glitch

- GlitchButton
- GlitchRadio
- GlitchLoginForm
- GlitchProfileCard
- GlitchFrame

### استایل Holo

- HoloCheckbox
- HoloInput
- HoloGlitchInput
- NeonRadio

---

## 💡 نکات مهم

1. **استفاده از Hooks برای فرم‌ها**

   ```tsx
   const { values, handleChange, errors } = useForm(initialValues);
   ```

2. **استفاده از Providers برای بازخورد**

   ```tsx
   <NotificationProvider>
     <App />
   </NotificationProvider>
   ```

3. **استفاده از Portal برای مودال‌ها**

   ```tsx
   <Portal>
     <Modal>...</Modal>
   </Portal>
   ```

4. **استفاده از Grid برای چیدمان**
   ```tsx
   <Grid columns={3} gap="md">
     {items.map((item) => (
       <div key={item.id}>{item}</div>
     ))}
   </Grid>
   ```
