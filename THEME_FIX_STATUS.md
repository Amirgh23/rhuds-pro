# وضعیت اصلاح Theme Tokens

## کامپوننت‌های اصلاح شده ✅

### Basic Components
- ✅ Text
- ✅ Button  
- ✅ Icon

### Feedback Components
- ✅ Modal
- ✅ Dialog
- ✅ Notification

### Utility Components
- ✅ Tooltip
- ✅ Popover
- ✅ Dropdown

### Navigation Components
- ✅ Tabs

### Specialized Components
- ✅ Slider

## کامپوننت‌های نیاز به اصلاح ⚠️

### Form Components
- ⚠️ Input (packages/components/src/Input/Input.tsx)
- ⚠️ Select (packages/components/src/Select/Select.tsx)
- ⚠️ Checkbox (packages/components/src/Form/Checkbox.tsx)
- ⚠️ RadioGroup (packages/components/src/Form/Radio.tsx)
- ⚠️ Switch (packages/components/src/Form/Switch.tsx)

### Specialized Components
- ⚠️ DatePicker
- ⚠️ ColorPicker
- ⚠️ FileUpload

### Navigation Components
- ⚠️ Navbar
- ⚠️ Sidebar
- ⚠️ Breadcrumb
- ⚠️ Menu
- ⚠️ Pagination

### Data Display Components
- ⚠️ Table
- ⚠️ DataGrid
- ⚠️ Tree

### Advanced Components
- ⚠️ Accordion
- ⚠️ Stepper
- ⚠️ Carousel
- ⚠️ CodeEditor
- ⚠️ RichTextEditor

### Visualization Components
- ⚠️ Chart

### Layout Components
- ⚠️ Container
- ⚠️ Grid
- ⚠️ Stack

## راه‌حل

تمام کامپوننت‌های باقی‌مانده باید از utility function `getThemeTokens` استفاده کنند:

```typescript
import { getThemeTokens, DEFAULT_COLORS } from '../utils/themeHelpers';

// در کامپوننت:
const tokens = getThemeTokens(theme);
const primaryColor = tokens.colors?.primary || DEFAULT_COLORS.primary;
```

## توصیه

برای اصلاح سریع تمام کامپوننت‌ها:
1. از اسکریپت PowerShell یا Python استفاده کنید
2. یا به صورت دستی هر کامپوننت را هنگام استفاده اصلاح کنید
3. یا فقط کامپوننت‌هایی که در ShowcasePage استفاده می‌شوند را اصلاح کنید

## اولویت اصلاح

بر اساس استفاده در ShowcasePage:
1. **بالا**: Input, Select, Checkbox, RadioGroup, Switch (Form - تب 3)
2. **بالا**: Navbar, Sidebar, Breadcrumb, Menu, Pagination (Navigation - تب 4)
3. **متوسط**: Table, DataGrid, Tree (Data Display - تب 5)
4. **متوسط**: Accordion, Stepper, Carousel, CodeEditor, RichTextEditor (Advanced - تب 7)
5. **پایین**: DatePicker, ColorPicker, FileUpload (Specialized - تب 3)
6. **پایین**: Chart (Visualization - تب 8)
7. **پایین**: Container, Grid, Stack (Layout - تب 2)
