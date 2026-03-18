# مرجع سریع کامپوننت‌های RHUDS Pro

## 🎯 انتخاب سریع

### دکمه‌ها

```tsx
import { Button, HudButton, GlitchButton } from '@rhuds/components';
<Button>Standard</Button>
<HudButton>HUD</HudButton>
<GlitchButton>Glitch</GlitchButton>
```

### ورودی‌ها

```tsx
import { Input, HackerInput, AiHudInput, HoloInput } from '@rhuds/components';
<Input placeholder="Standard" />
<HackerInput placeholder="Hacker" />
<AiHudInput placeholder="AI HUD" />
<HoloInput placeholder="Holo" />
```

### فرم‌ها

```tsx
import { Checkbox, Radio, Switch, useForm } from '@rhuds/components';
const { values, handleChange } = useForm({ email: '' });
<Checkbox name="agree" onChange={handleChange} />
<Radio name="option" onChange={handleChange} />
<Switch name="enabled" onChange={handleChange} />
```

### چیدمان

```tsx
import { Grid, Stack, HudBox, Container } from '@rhuds/components';
<Grid columns={3}><div>Item</div></Grid>
<Stack direction="column"><div>Item</div></Stack>
<HudBox variant="primary">Content</HudBox>
<Container maxWidth="lg">Content</Container>
```

### ناوبری

```tsx
import { Navbar, Tabs, Pagination, Breadcrumb } from '@rhuds/components';
<Navbar items={[]} />
<Tabs items={[]} />
<Pagination total={100} current={1} />
<Breadcrumb items={[]} />
```

### جداول

```tsx
import { Table, HudTableBasic, DataGrid } from '@rhuds/components';
<HudTableBasic columns={['Name']} data={[]} />
<Table columns={['Name']} data={[]} />
<DataGrid columns={['Name']} data={[]} />
```

### بازخورد

```tsx
import { Modal, Dialog, GradientAlert, useNotification } from '@rhuds/components';
const { notify } = useNotification();
<Modal isOpen={true}><p>Content</p></Modal>
<GradientAlert type="success">Success</GradientAlert>
notify({ message: 'Hello', type: 'info' });
```

### کمکی‌ها

```tsx
import { Tooltip, Dropdown, Popover, Portal } from '@rhuds/components';
<Tooltip content="Help">Button</Tooltip>
<Dropdown items={['Option 1']} />
<Popover content={<div>Content</div>}>Button</Popover>
<Portal><div>Content</div></Portal>
```

### پیشرفته

```tsx
import { Carousel, Accordion, Stepper } from '@rhuds/components';
<Carousel items={[]} autoPlay={true} />
<Accordion items={[]} />
<Stepper steps={['Step 1']} current={1} />
```

### تخصصی

```tsx
import { Slider, DatePicker, ColorPicker } from '@rhuds/components';
<Slider min={0} max={100} value={50} />
<DatePicker value={new Date()} />
<ColorPicker value="#FF0000" />
```

### بارگذاری

```tsx
import { AbstergoLoader, HackerLoader } from '@rhuds/components';
<AbstergoLoader />
<HackerLoader />
```

---

## 📊 جدول دسته‌ها

| دسته          | تعداد | مثال                |
| ------------- | ----- | ------------------- |
| Button        | 3     | Button, HudButton   |
| Input         | 6     | Input, HackerInput  |
| Form          | 15+   | Checkbox, Radio     |
| Layout        | 8     | Grid, HudBox        |
| Navigation    | 6     | Navbar, Tabs        |
| DataDisplay   | 20+   | Table, HudTable     |
| Feedback      | 6     | Modal, Alert        |
| Utility       | 4     | Tooltip, Dropdown   |
| Advanced      | 5     | Carousel, Accordion |
| Specialized   | 4     | Slider, DatePicker  |
| Visualization | 1     | Chart               |
| Loader        | 3     | AbstergoLoader      |
| Icon          | 1     | Icon                |
| Text          | 1     | Text                |
| Select        | 1     | Select              |

---

## 🎨 استایل‌ها

- **Standard**: Button, Input, Table
- **HUD**: HudButton, HudInput, HudBox
- **Glitch**: GlitchButton, GlitchRadio
- **Holo**: HoloInput, HoloCheckbox
- **Futuristic**: FuturisticInput, HackerLoader
