# اصلاح نهایی Modal, Notification و Chart ✅

## مشکل

صفحات notification و chart به صفحه سفید می‌رسیدند (White Screen of Death) به دلیل:
1. استفاده از IIFE (Immediately Invoked Function Expression) در JSX
2. Type mismatch در Chart component
3. خطای onClick در Menu component

## راه‌حل

### 1. جداسازی کامپوننت‌ها

به جای استفاده از IIFE در JSX، کامپوننت‌های جداگانه ایجاد شدند:

#### NotificationDemo Component:
```tsx
const NotificationDemo: React.FC = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>>([]);
  const [counter, setCounter] = useState(0);

  const addNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    const id = counter;
    setCounter(counter + 1);
    const messages = {
      success: 'Operation completed successfully!',
      error: 'An error occurred!',
      warning: 'Warning: Please check your input!',
      info: 'Information: This is a notification.',
    };
    setNotifications([...notifications, { id, message: messages[type], type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  return (
    <>
      <Stack direction="row" gap="1rem" style={{ flexWrap: 'wrap' }}>
        <Button variant="success" onClick={() => addNotification('success')}>
          Show Success
        </Button>
        <Button variant="danger" onClick={() => addNotification('error')}>
          Show Error
        </Button>
        <Button variant="warning" onClick={() => addNotification('warning')}>
          Show Warning
        </Button>
        <Button variant="secondary" onClick={() => addNotification('info')}>
          Show Info
        </Button>
      </Stack>
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 10000 }}>
        {notifications.map(notif => (
          <Notification
            key={notif.id}
            message={notif.message}
            type={notif.type}
            duration={3000}
            onClose={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
          />
        ))}
      </div>
    </>
  );
};
```

#### ChartDemo Component:
```tsx
const ChartDemo: React.FC = () => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'area'>('bar');
  
  const chartData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 59 },
    { label: 'Mar', value: 80 },
    { label: 'Apr', value: 81 },
    { label: 'May', value: 56 },
    { label: 'Jun', value: 55 },
  ];

  return (
    <Stack direction="column" gap="1rem">
      <Stack direction="row" gap="1rem" style={{ flexWrap: 'wrap' }}>
        <Button 
          variant={chartType === 'line' ? 'primary' : 'secondary'}
          onClick={() => setChartType('line')}
        >
          Line
        </Button>
        <Button 
          variant={chartType === 'bar' ? 'primary' : 'secondary'}
          onClick={() => setChartType('bar')}
        >
          Bar
        </Button>
        <Button 
          variant={chartType === 'pie' ? 'primary' : 'secondary'}
          onClick={() => setChartType('pie')}
        >
          Pie
        </Button>
        <Button 
          variant={chartType === 'area' ? 'primary' : 'secondary'}
          onClick={() => setChartType('area')}
        >
          Area
        </Button>
      </Stack>
      <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '4px' }}>
        <Chart
          type={chartType}
          data={chartData}
          width={600}
          height={300}
          showGrid={true}
          showLegend={true}
        />
      </div>
    </Stack>
  );
};
```

#### ModalDemo Component:
```tsx
const ModalDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Modal"
      >
        <Stack direction="column" gap="1rem">
          <Text variant="body">This is a modal dialog with Portal rendering.</Text>
          <Text variant="body">It appears on top of the page content.</Text>
          <Input placeholder="Enter something..." />
          <Stack direction="row" gap="1rem">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
};
```

### 2. اصلاح Chart Types

**قبل** (اشتباه):
```tsx
const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'doughnut' | 'radar'>('line');

const chartData = {
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{ ... }]
};
```

**بعد** (درست):
```tsx
const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'area'>('bar');

const chartData = [
  { label: 'Jan', value: 65 },
  { label: 'Feb', value: 59 },
  // ...
];
```

Chart component فقط از این type ها پشتیبانی می‌کند:
- `'line'` - نمودار خطی
- `'bar'` - نمودار میله‌ای
- `'pie'` - نمودار دایره‌ای
- `'area'` - نمودار ناحیه‌ای

و data باید به صورت `ChartDataPoint[]` باشد:
```tsx
interface ChartDataPoint {
  label: string;
  value: number;
}
```

### 3. اصلاح Menu Component

**قبل** (اشتباه):
```tsx
<Menu
  items={[
    { label: 'Profile', onClick: () => alert('Profile') },
    { label: 'Settings', onClick: () => alert('Settings') },
  ]}
/>
```

**بعد** (درست):
```tsx
<Menu
  items={[
    { label: 'Profile', href: '#profile', icon: '👤' },
    { label: 'Settings', href: '#settings', icon: '⚙️' },
  ]}
  onItemClick={(item) => alert(`Clicked: ${item.label}`)}
/>
```

MenuItem interface:
```tsx
interface MenuItem {
  label: string;
  href?: string;
  icon?: string;
  children?: MenuItem[];
  divider?: boolean;
  disabled?: boolean;
}
```

## تغییرات در DocsPage.tsx

### 1. Import ها (بدون تغییر)
```tsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ... } from '@rhuds/components';
```

### 2. کامپوننت‌های جدید (اضافه شد)
- `NotificationDemo`
- `ChartDemo`
- `ModalDemo`

### 3. استفاده در JSX
```tsx
{selectedDoc === 'modal' && (
  <ComponentPlayground title="Modal Example" ...>
    <ModalDemo />
  </ComponentPlayground>
)}

{selectedDoc === 'notification' && (
  <ComponentPlayground title="Notification Example" ...>
    <NotificationDemo />
  </ComponentPlayground>
)}

{selectedDoc === 'chart' && (
  <ComponentPlayground title="Chart Example" ...>
    <ChartDemo />
  </ComponentPlayground>
)}
```

## مزایای این رویکرد

### 1. خوانایی بهتر
- کد تمیزتر و قابل فهم‌تر
- جداسازی منطق از JSX
- نام‌گذاری واضح

### 2. قابلیت نگهداری
- آسان‌تر برای debug
- قابل استفاده مجدد
- تست‌پذیری بهتر

### 3. Type Safety
- TypeScript errors برطرف شدند
- Type checking صحیح
- IntelliSense بهتر

### 4. Performance
- بدون IIFE overhead
- React reconciliation بهتر
- Re-render های بهینه‌تر

## خطاهای برطرف شده

✅ **TypeScript Errors**: 5 خطا برطرف شد
- Chart type mismatch
- Chart data type mismatch
- Menu onClick errors (3 مورد)

✅ **Runtime Errors**: صفحه سفید برطرف شد
- IIFE در JSX
- State management issues
- Component lifecycle problems

## تست

### 1. Modal:
```
URL: http://localhost:3001/docs/modal
```
- ✅ دکمه "Open Modal" کار می‌کند
- ✅ Modal باز و بسته می‌شود
- ✅ Input و دکمه‌ها کار می‌کنند
- ✅ بدون خطا

### 2. Notification:
```
URL: http://localhost:3001/docs/notification
```
- ✅ 4 دکمه کار می‌کنند
- ✅ Notifications نمایش داده می‌شوند
- ✅ Auto-dismiss بعد از 3 ثانیه
- ✅ Multiple notifications
- ✅ بدون خطا

### 3. Chart:
```
URL: http://localhost:3001/docs/chart
```
- ✅ 4 نوع نمودار (Line, Bar, Pie, Area)
- ✅ تعویض نوع کار می‌کند
- ✅ نمودار رندر می‌شود
- ✅ بدون خطا

### 4. Menu:
```
URL: http://localhost:3001/docs/menu
```
- ✅ Menu باز می‌شود
- ✅ Items نمایش داده می‌شوند
- ✅ Click handler کار می‌کند
- ✅ بدون خطا

## وضعیت نهایی

✅ **Modal**: کامل و بدون خطا
✅ **Notification**: کامل و بدون خطا
✅ **Chart**: کامل و بدون خطا
✅ **Menu**: اصلاح شد
✅ **TypeScript**: بدون خطا
✅ **Runtime**: بدون خطا

**تاریخ**: ۳ مارس ۲۰۲۶
**فایل**: `packages/demo-app/src/pages/DocsPage.tsx`
**وضعیت**: ✅ تمام مشکلات برطرف شد

🎉 **Modal, Notification و Chart کامل و بدون خطا هستند!**
