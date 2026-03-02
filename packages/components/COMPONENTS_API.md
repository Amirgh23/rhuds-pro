# RHUDS Components API Documentation

Complete API reference for all RHUDS Pro components.

---

## Table of Contents

1. [Basic Components](#basic-components)
2. [Layout Components](#layout-components)
3. [Form Components](#form-components)
4. [Navigation Components](#navigation-components)
5. [Data Display Components](#data-display-components)
6. [Feedback Components](#feedback-components)
7. [Utility Components](#utility-components)
8. [Advanced Components](#advanced-components)

---

## Basic Components

### Text

Display text with multiple variants and animations.

```typescript
import { Text } from '@rhuds/components';

<Text variant="h1">Heading 1</Text>
<Text variant="body">Body text</Text>
<Text truncate>Long text...</Text>
```

**Props:**
- `variant`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'code'
- `truncate`: boolean - Enable text truncation
- `className`: string
- `style`: React.CSSProperties

### Button

Interactive button with multiple variants and states.

```typescript
import { Button } from '@rhuds/components';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
<Button loading>Loading...</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `onClick`: (e: React.MouseEvent) => void
- `className`: string
- `style`: React.CSSProperties

### Icon

Display icons with customization options.

```typescript
import { Icon } from '@rhuds/components';

<Icon name="home" size={24} />
<Icon svg={customSVG} rotation={90} />
```

**Props:**
- `name`: string - Icon name
- `size`: number
- `rotation`: number - Rotation in degrees
- `flip`: 'horizontal' | 'vertical'
- `svg`: string - Custom SVG
- `className`: string
- `style`: React.CSSProperties

### Input

Text input with validation and error handling.

```typescript
import { Input } from '@rhuds/components';

<Input type="text" placeholder="Enter text" />
<Input type="email" error="Invalid email" />
```

**Props:**
- `type`: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'url'
- `placeholder`: string
- `value`: string
- `onChange`: (e: React.ChangeEvent) => void
- `error`: string
- `disabled`: boolean
- `className`: string
- `style`: React.CSSProperties

### Select

Dropdown select component with search and filtering.

```typescript
import { Select } from '@rhuds/components';

<Select
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ]}
  onChange={handleChange}
/>
```

**Props:**
- `options`: Array<{ value: string; label: string }>
- `value`: string
- `onChange`: (value: string) => void
- `placeholder`: string
- `searchable`: boolean
- `disabled`: boolean
- `className`: string
- `style`: React.CSSProperties

---

## Layout Components

### Grid

Responsive grid layout component.

```typescript
import { Grid } from '@rhuds/components';

<Grid columns={3} gap="1rem">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

**Props:**
- `columns`: number | Record<string, number>
- `gap`: string | number
- `children`: React.ReactNode
- `className`: string
- `style`: React.CSSProperties

### Container

Container with max-width and responsive padding.

```typescript
import { Container } from '@rhuds/components';

<Container maxWidth="1200px">
  <div>Content</div>
</Container>
```

**Props:**
- `maxWidth`: string | number
- `padding`: string | number
- `children`: React.ReactNode
- `className`: string
- `style`: React.CSSProperties

### Stack

Flexible stack layout (row or column).

```typescript
import { Stack } from '@rhuds/components';

<Stack direction="column" gap="1rem" align="center">
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>
```

**Props:**
- `direction`: 'row' | 'column'
- `gap`: string | number
- `align`: 'flex-start' | 'center' | 'flex-end' | 'stretch'
- `justify`: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
- `children`: React.ReactNode
- `className`: string
- `style`: React.CSSProperties

---

## Form Components

### Checkbox

Styled checkbox component.

```typescript
import { Checkbox } from '@rhuds/components';

<Checkbox label="Accept terms" checked={checked} onChange={setChecked} />
```

**Props:**
- `label`: string
- `checked`: boolean
- `onChange`: (checked: boolean) => void
- `disabled`: boolean
- `className`: string
- `style`: React.CSSProperties

### Radio

Radio button component.

```typescript
import { Radio, RadioGroup } from '@rhuds/components';

<RadioGroup value={selected} onChange={setSelected}>
  <Radio value="option1" label="Option 1" />
  <Radio value="option2" label="Option 2" />
</RadioGroup>
```

**Props (Radio):**
- `value`: string
- `label`: string
- `disabled`: boolean
- `className`: string
- `style`: React.CSSProperties

**Props (RadioGroup):**
- `value`: string
- `onChange`: (value: string) => void
- `children`: React.ReactNode
- `className`: string
- `style`: React.CSSProperties

### Switch

Animated toggle switch.

```typescript
import { Switch } from '@rhuds/components';

<Switch checked={enabled} onChange={setEnabled} label="Enable feature" />
```

**Props:**
- `checked`: boolean
- `onChange`: (checked: boolean) => void
- `label`: string
- `disabled`: boolean
- `className`: string
- `style`: React.CSSProperties

### useForm

Form validation hook.

```typescript
import { useForm } from '@rhuds/components';

const { values, errors, touched, handleChange, handleSubmit } = useForm({
  initialValues: { email: '', password: '' },
  onSubmit: (values) => console.log(values),
  validate: {
    email: [{ type: 'email' }],
    password: [{ type: 'required' }],
  },
});
```

**Props:**
- `initialValues`: Record<string, any>
- `onSubmit`: (values: Record<string, any>) => void
- `validate`: Record<string, FormValidationRule[]>

**Returns:**
- `values`: Record<string, any>
- `errors`: Record<string, string>
- `touched`: Record<string, boolean>
- `handleChange`: (e: React.ChangeEvent) => void
- `handleSubmit`: (e: React.FormEvent) => void
- `reset`: () => void

---

## Navigation Components

### Navbar

Responsive navigation bar.

```typescript
import { Navbar } from '@rhuds/components';

<Navbar
  items={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ]}
  brand="RHUDS"
/>
```

**Props:**
- `items`: NavItem[]
- `brand`: string
- `position`: 'static' | 'sticky' | 'fixed'
- `collapsible`: boolean
- `className`: string
- `style`: React.CSSProperties

### Sidebar

Collapsible sidebar navigation.

```typescript
import { Sidebar } from '@rhuds/components';

<Sidebar
  items={[
    { label: 'Dashboard', icon: '📊', href: '/' },
    { label: 'Settings', icon: '⚙️', href: '/settings' },
  ]}
  collapsible
/>
```

**Props:**
- `items`: NavItem[]
- `width`: number | string
- `collapsible`: boolean
- `collapsed`: boolean
- `onCollapsedChange`: (collapsed: boolean) => void
- `className`: string
- `style`: React.CSSProperties

### Breadcrumb

Navigation breadcrumb trail.

```typescript
import { Breadcrumb } from '@rhuds/components';

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Details', href: '/products/1' },
  ]}
/>
```

**Props:**
- `items`: BreadcrumbItem[]
- `separator`: string
- `className`: string
- `style`: React.CSSProperties

### Tabs

Tabbed content component.

```typescript
import { Tabs } from '@rhuds/components';

<Tabs
  items={[
    { label: 'Tab 1', content: 'Content 1' },
    { label: 'Tab 2', content: 'Content 2' },
  ]}
  activeIndex={0}
  variant="line"
/>
```

**Props:**
- `items`: TabItem[]
- `activeIndex`: number
- `onChange`: (index: number) => void
- `variant`: 'line' | 'card' | 'button'
- `className`: string
- `style`: React.CSSProperties

### Menu

Dropdown menu component.

```typescript
import { Menu } from '@rhuds/components';

<Menu
  items={[
    { label: 'Profile', onClick: () => {} },
    { label: 'Settings', onClick: () => {} },
  ]}
/>
```

**Props:**
- `items`: MenuItem[]
- `trigger`: React.ReactNode
- `onItemClick`: (item: MenuItem) => void
- `className`: string
- `style`: React.CSSProperties

### Pagination

Page navigation component.

```typescript
import { Pagination } from '@rhuds/components';

<Pagination
  total={250}
  perPage={10}
  currentPage={1}
  onPageChange={setPage}
  showPageSize
/>
```

**Props:**
- `total`: number
- `perPage`: number
- `currentPage`: number
- `onPageChange`: (page: number) => void
- `showPageSize`: boolean
- `pageSizeOptions`: number[]
- `className`: string
- `style`: React.CSSProperties

---

## Data Display Components

### Table

Data table with sorting and filtering.

```typescript
import { Table } from '@rhuds/components';

<Table
  data={data}
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
  ]}
  onSort={handleSort}
/>
```

**Props:**
- `data`: any[]
- `columns`: TableColumn[]
- `sortColumn`: string
- `sortDirection`: 'asc' | 'desc'
- `onSort`: (column: string, direction: 'asc' | 'desc') => void
- `onRowClick`: (row: any, index: number) => void
- `className`: string
- `style`: React.CSSProperties

### DataGrid

Advanced data grid with virtual scrolling.

```typescript
import { DataGrid } from '@rhuds/components';

<DataGrid
  data={data}
  columns={columns}
  rowHeight={40}
  visibleRows={10}
  selectionMode="multiple"
/>
```

**Props:**
- `data`: any[]
- `columns`: DataGridColumn[]
- `rowHeight`: number
- `visibleRows`: number
- `selectedRows`: (string | number)[]
- `selectionMode`: 'single' | 'multiple' | 'none'
- `onSelectionChange`: (rows: (string | number)[]) => void
- `onCellEdit`: (rowIndex: number, columnKey: string, value: any) => void
- `className`: string
- `style`: React.CSSProperties

### Tree

Hierarchical tree view.

```typescript
import { Tree } from '@rhuds/components';

<Tree
  nodes={[
    {
      key: 'root',
      label: 'Root',
      children: [
        { key: 'child1', label: 'Child 1' },
      ],
    },
  ]}
  expandedNodes={['root']}
/>
```

**Props:**
- `nodes`: TreeNode[]
- `expandedNodes`: string[]
- `onExpand`: (key: string) => void
- `onCollapse`: (key: string) => void
- `selectedNode`: string
- `onNodeSelect`: (key: string) => void
- `animationDuration`: number
- `className`: string
- `style`: React.CSSProperties

---

## Feedback Components

### Modal

Modal dialog component.

```typescript
import { Modal } from '@rhuds/components';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
>
  Modal content
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `children`: React.ReactNode
- `closeText`: string
- `showClose`: boolean
- `animationDuration`: number
- `className`: string
- `style`: React.CSSProperties

### Dialog

Dialog with action buttons.

```typescript
import { Dialog } from '@rhuds/components';

<Dialog
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm"
  actions={[
    { label: 'Cancel', onClick: handleClose },
    { label: 'Confirm', onClick: handleConfirm, variant: 'primary' },
  ]}
>
  Are you sure?
</Dialog>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `children`: React.ReactNode
- `actions`: DialogAction[]
- `showClose`: boolean
- `animationDuration`: number
- `className`: string
- `style`: React.CSSProperties

### Notification

Toast notification component.

```typescript
import { Notification } from '@rhuds/components';

<Notification
  message="Success!"
  type="success"
  duration={3000}
  onClose={handleClose}
/>
```

**Props:**
- `message`: string
- `type`: 'success' | 'error' | 'warning' | 'info'
- `duration`: number
- `onClose`: () => void
- `showClose`: boolean
- `icon`: string | React.ReactNode
- `animationDuration`: number
- `className`: string
- `style`: React.CSSProperties

### NotificationProvider & useNotification

Context provider for notifications.

```typescript
import { NotificationProvider, useNotification } from '@rhuds/components';

function App() {
  return (
    <NotificationProvider>
      <MyComponent />
    </NotificationProvider>
  );
}

function MyComponent() {
  const { success, error, warning, info } = useNotification();
  
  return (
    <button onClick={() => success('Success!')}>
      Show Notification
    </button>
  );
}
```

---

## Utility Components

### Tooltip

Tooltip component with configurable position.

```typescript
import { Tooltip } from '@rhuds/components';

<Tooltip content="Tooltip text" position="top">
  <button>Hover me</button>
</Tooltip>
```

**Props:**
- `content`: string | React.ReactNode
- `position`: 'top' | 'bottom' | 'left' | 'right'
- `children`: React.ReactNode
- `showDelay`: number
- `hideDelay`: number
- `animationDuration`: number
- `className`: string
- `style`: React.CSSProperties

### Popover

Popover component with title and content.

```typescript
import { Popover } from '@rhuds/components';

<Popover
  content="Popover content"
  title="Popover Title"
  position="bottom"
>
  <button>Click me</button>
</Popover>
```

**Props:**
- `content`: React.ReactNode
- `title`: string
- `position`: 'top' | 'bottom' | 'left' | 'right'
- `children`: React.ReactNode
- `isOpen`: boolean
- `onOpenChange`: (isOpen: boolean) => void
- `closeOnOutsideClick`: boolean
- `animationDuration`: number
- `className`: string
- `style`: React.CSSProperties

### Dropdown

Dropdown menu component.

```typescript
import { Dropdown } from '@rhuds/components';

<Dropdown
  items={[
    { key: 'item1', label: 'Item 1', icon: '📁' },
    { key: 'item2', label: 'Item 2', icon: '📄' },
  ]}
>
  <button>Menu</button>
</Dropdown>
```

**Props:**
- `items`: DropdownItem[]
- `children`: React.ReactNode
- `isOpen`: boolean
- `onOpenChange`: (isOpen: boolean) => void
- `onItemClick`: (item: DropdownItem) => void
- `position`: 'top' | 'bottom' | 'left' | 'right'
- `closeOnItemClick`: boolean
- `closeOnOutsideClick`: boolean
- `animationDuration`: number
- `className`: string
- `style`: React.CSSProperties

---

## Advanced Components

### Carousel

Image/content carousel with auto-play.

```typescript
import { Carousel } from '@rhuds/components';

<Carousel
  items={[
    { key: 'slide1', content: <img src="image1.jpg" /> },
    { key: 'slide2', content: <img src="image2.jpg" /> },
  ]}
  autoPlayInterval={5000}
  showDots
  showArrows
/>
```

**Props:**
- `items`: CarouselItem[]
- `currentIndex`: number
- `onIndexChange`: (index: number) => void
- `autoPlayInterval`: number
- `showDots`: boolean
- `showArrows`: boolean
- `animationDuration`: number
- `className`: string
- `style`: React.CSSProperties

### Accordion

Expandable accordion component.

```typescript
import { Accordion } from '@rhuds/components';

<Accordion
  items={[
    { key: 'item1', title: 'Item 1', content: 'Content 1' },
    { key: 'item2', title: 'Item 2', content: 'Content 2' },
  ]}
  allowMultiple
/>
```

**Props:**
- `items`: AccordionItem[]
- `expandedItems`: string[]
- `onExpand`: (key: string) => void
- `onCollapse`: (key: string) => void
- `allowMultiple`: boolean
- `animationDuration`: number
- `className`: string
- `style`: React.CSSProperties

### Stepper

Step-by-step progress indicator.

```typescript
import { Stepper } from '@rhuds/components';

<Stepper
  steps={[
    { key: 'step1', label: 'Step 1', description: 'First step' },
    { key: 'step2', label: 'Step 2', description: 'Second step' },
  ]}
  currentStep={0}
  orientation="horizontal"
  showContent
/>
```

**Props:**
- `steps`: StepperStep[]
- `currentStep`: number
- `onStepChange`: (index: number) => void
- `orientation`: 'horizontal' | 'vertical'
- `showContent`: boolean
- `stepContent`: React.ReactNode[]
- `animationDuration`: number
- `className`: string
- `style`: React.CSSProperties

---

## Common Props

All components support these common props:

- `className`: string - CSS class name
- `style`: React.CSSProperties - Inline styles
- `children`: React.ReactNode - Child elements (where applicable)

---

## Theme Integration

All components automatically integrate with the RHUDS theme system:

```typescript
import { useTheme } from '@rhuds/core';

const theme = useTheme();
// Access theme colors, typography, spacing, etc.
```

---

## Accessibility

All components follow accessibility best practices:

- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support

---

## Performance

Components are optimized for performance:

- Virtual scrolling for large datasets
- Memoization for expensive computations
- Efficient re-rendering
- CSS transitions for animations

---

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import { Button, ButtonProps } from '@rhuds/components';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

---

**Last Updated**: March 2, 2026  
**Version**: 0.1.0
