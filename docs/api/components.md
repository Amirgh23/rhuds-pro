# Components API

Complete reference for all RHUDS components.

## Table of Contents

1. [Basic Components](#basic-components) - 7 components
2. [Layout Components](#layout-components) - 3 components
3. [Form Components](#form-components) - 5 components
4. [Navigation Components](#navigation-components) - 6 components
5. [Data Display Components](#data-display-components) - 3 components
6. [Feedback Components](#feedback-components) - 5 components
7. [Utility Components](#utility-components) - 4 components
8. [Advanced Components](#advanced-components) - 5 components
9. [Specialized Components](#specialized-components) - 4 components
10. [Visualization Components](#visualization-components) - 1 component

**Total: 43 Components**

---

## Basic Components

### Button

Interactive button component with multiple variants.

```tsx
import { Button } from '@rhuds/components';

<Button 
  variant="primary" 
  onClick={() => {}}
  disabled={false}
>
  Click Me
</Button>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning'` | `'primary'` | Button style variant |
| `onClick` | `() => void` | - | Click handler |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | - | Custom CSS class |
| `style` | `CSSProperties` | - | Inline styles |
| `children` | `ReactNode` | - | Button content |

#### Example

```tsx
<Button variant="primary" onClick={() => alert('Clicked!')}>
  Primary Button
</Button>

<Button variant="danger" disabled>
  Disabled Button
</Button>
```

---

### HudButton

Futuristic HUD-style button with glowing effects and neon aesthetics.

```tsx
import { HudButton } from '@rhuds/components';

<HudButton onClick={() => {}}>
  I'M READY
</HudButton>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onClick` | `(e: MouseEvent) => void` | - | Click handler |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | - | Custom CSS class |
| `children` | `ReactNode` | - | Button content |

#### Features

- Neon green (#1BFD9C) HUD aesthetic
- Glowing border and shadow effects
- Light wave animation on hover
- Integrated with Bleeps audio system
- Perfect for cyberpunk/futuristic UIs

#### Example

```tsx
<HudButton onClick={() => console.log('Launching...')}>
  LAUNCH SEQUENCE
</HudButton>

<HudButton disabled>
  OFFLINE
</HudButton>
```

#### Design Guidelines

- Use UPPERCASE text for maximum impact
- Best for primary actions in sci-fi/cyberpunk interfaces
- Pairs well with dark backgrounds
- Recommended for mission-critical actions

---

### GlitchButton

Retro glitch-style button with VT323 monospace font and RGB glitch effects.

```tsx
import { GlitchButton } from '@rhuds/components';

<GlitchButton onClick={() => {}}>
  // Hover me
</GlitchButton>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onClick` | `(e: MouseEvent) => void` | - | Click handler |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | - | Custom CSS class |
| `children` | `ReactNode` | `'// Hover me'` | Button content |

#### Features

- VT323 monospace font for retro terminal aesthetic
- RGB glitch animation on hover (magenta → green → blue → cyan)
- HUD-style cyan color (#00f6ff) visible on any background
- Glowing border and shadow effects
- Blinking text decoration and arrow (⇒)
- Integrated with Bleeps audio system
- Perfect for retro/terminal/hacker-themed UIs

#### Example

```tsx
<GlitchButton onClick={() => console.log('Executing...')}>
  // Execute command
</GlitchButton>

<GlitchButton disabled>
  // Disabled
</GlitchButton>
```

#### Design Guidelines

- Use comment-style text (// prefix) for terminal aesthetic
- Best for code execution, terminal commands, or hacker-themed actions
- Works well on light or dark backgrounds
- Recommended for retro/cyberpunk interfaces

---

### Text

Typography component for displaying text with variants.

```tsx
import { Text } from '@rhuds/components';

<Text variant="h1">Heading</Text>
<Text variant="body">Body text</Text>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'h1' \| 'h2' \| 'h3' \| 'body' \| 'caption'` | `'body'` | Text style variant |
| `className` | `string` | - | Custom CSS class |
| `style` | `CSSProperties` | - | Inline styles |
| `children` | `ReactNode` | - | Text content |

---

### Icon

Icon component with customizable size and color.

```tsx
import { Icon } from '@rhuds/components';

<Icon name="check" size={24} color="#00ff00" />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Icon name |
| `size` | `number` | `24` | Icon size in pixels |
| `color` | `string` | - | Icon color |
| `className` | `string` | - | Custom CSS class |

---

## Form Components

### Input

Text input field with label and error support.

```tsx
import { Input } from '@rhuds/components';

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter text..."
  label="Username"
  error="This field is required"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Input value |
| `onChange` | `(e: ChangeEvent) => void` | - | Change handler |
| `placeholder` | `string` | - | Placeholder text |
| `label` | `string` | - | Input label |
| `error` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Disabled state |
| `type` | `string` | `'text'` | Input type |

---

### HackerInput

Futuristic hacker-style input with glowing green effects, scanline animations, and glitch effects.

```tsx
import { HackerInput } from '@rhuds/components';

<HackerInput
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter command..."
  label="Enter Command"
  type="text"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Input value |
| `onChange` | `(e: ChangeEvent) => void` | - | Change handler |
| `placeholder` | `string` | - | Placeholder text |
| `label` | `string` | `'Enter Command'` | Floating label text |
| `type` | `string` | `'text'` | Input type |
| `className` | `string` | - | Custom CSS class |

#### Features

- Matrix-style green (#00ff00) color scheme
- Glowing border with enhanced glow on focus
- Animated scanline effect
- Blinking cursor animation
- Digital glitch effect on hover
- Floating label animation
- Monospace "Courier New" font
- Perfect for terminal/hacker-themed UIs

#### Example

```tsx
<HackerInput
  label="Access Code"
  placeholder="Enter access code..."
  type="password"
/>

<HackerInput
  label="System Command"
  placeholder="Type command..."
  value={command}
  onChange={(e) => setCommand(e.target.value)}
/>
```

---

### Select

Dropdown select component.

```tsx
import { Select } from '@rhuds/components';

<Select
  value={value}
  onChange={(value) => setValue(value)}
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ]}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | - | Selected value |
| `onChange` | `(value: string \| number) => void` | - | Change handler |
| `options` | `SelectOption[]` | - | Select options |
| `label` | `string` | - | Select label |
| `placeholder` | `string` | - | Placeholder text |
| `disabled` | `boolean` | `false` | Disabled state |

---

### Checkbox

Checkbox input component.

```tsx
import { Checkbox } from '@rhuds/components';

<Checkbox
  checked={checked}
  onChange={(checked) => setChecked(checked)}
  label="Accept terms"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Checked state |
| `onChange` | `(checked: boolean) => void` | - | Change handler |
| `label` | `string` | - | Checkbox label |
| `disabled` | `boolean` | `false` | Disabled state |

---

### RadioGroup

Radio button group component.

```tsx
import { RadioGroup } from '@rhuds/components';

<RadioGroup
  value={value}
  onChange={(value) => setValue(value)}
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ]}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | - | Selected value |
| `onChange` | `(value: string \| number) => void` | - | Change handler |
| `options` | `RadioOption[]` | - | Radio options |
| `label` | `string` | - | Group label |
| `disabled` | `boolean` | `false` | Disabled state |

---

### Switch

Toggle switch component.

```tsx
import { Switch } from '@rhuds/components';

<Switch
  checked={checked}
  onChange={(checked) => setChecked(checked)}
  label="Enable notifications"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Checked state |
| `onChange` | `(checked: boolean) => void` | - | Change handler |
| `label` | `string` | - | Switch label |
| `disabled` | `boolean` | `false` | Disabled state |

---

### useForm

Form validation hook for managing form state.

```tsx
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

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `values` | `Record<string, any>` | Form values |
| `errors` | `Record<string, string>` | Validation errors |
| `touched` | `Record<string, boolean>` | Touched fields |
| `handleChange` | `(e: ChangeEvent) => void` | Change handler |
| `handleSubmit` | `(e: FormEvent) => void` | Submit handler |
| `reset` | `() => void` | Reset form |

---

## Navigation Components

### Tabs

Tabbed navigation component.

```tsx
import { Tabs } from '@rhuds/components';

<Tabs
  items={[
    { label: 'Tab 1', content: <div>Content 1</div> },
    { label: 'Tab 2', content: <div>Content 2</div> },
  ]}
  activeIndex={activeTab}
  onChange={setActiveTab}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TabItem[]` | - | Tab items |
| `activeIndex` | `number` | `0` | Active tab index |
| `onChange` | `(index: number) => void` | - | Tab change handler |

---

### Pagination

Pagination component for data navigation.

```tsx
import { Pagination } from '@rhuds/components';

<Pagination
  total={100}
  perPage={10}
  currentPage={page}
  onPageChange={setPage}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `total` | `number` | - | Total items |
| `perPage` | `number` | `10` | Items per page |
| `currentPage` | `number` | `1` | Current page |
| `onPageChange` | `(page: number) => void` | - | Page change handler |

---

### Breadcrumb

Navigation breadcrumb trail component.

```tsx
import { Breadcrumb } from '@rhuds/components';

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Details', href: '/products/1' },
  ]}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | - | Breadcrumb items |
| `separator` | `string` | `'/'` | Item separator |

---

### Sidebar

Collapsible sidebar navigation component.

```tsx
import { Sidebar } from '@rhuds/components';

<Sidebar
  items={[
    { label: 'Dashboard', icon: '📊', href: '/' },
    { label: 'Settings', icon: '⚙️', href: '/settings' },
  ]}
  collapsible
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `NavItem[]` | - | Navigation items |
| `width` | `number \| string` | `250` | Sidebar width |
| `collapsible` | `boolean` | `false` | Enable collapse |
| `collapsed` | `boolean` | `false` | Collapsed state |

---

### Navbar

Responsive navigation bar component.

```tsx
import { Navbar } from '@rhuds/components';

<Navbar
  items={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ]}
  brand="RHUDS"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `NavItem[]` | - | Navigation items |
| `brand` | `string` | - | Brand name/logo |
| `position` | `'static' \| 'sticky' \| 'fixed'` | `'static'` | Position type |

---

### Menu

Dropdown menu component.

```tsx
import { Menu } from '@rhuds/components';

<Menu
  items={[
    { label: 'Profile', onClick: () => {} },
    { label: 'Settings', onClick: () => {} },
  ]}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `MenuItem[]` | - | Menu items |
| `trigger` | `ReactNode` | - | Trigger element |
| `onItemClick` | `(item: MenuItem) => void` | - | Item click handler |

---

## Data Display Components

### Table

Data table component.

```tsx
import { Table } from '@rhuds/components';

<Table
  columns={[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
  ]}
  data={[
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ]}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `TableColumn[]` | - | Table columns |
| `data` | `any[]` | - | Table data |
| `onRowClick` | `(row: any) => void` | - | Row click handler |

---

### DataGrid

Advanced data grid with virtual scrolling and editing.

```tsx
import { DataGrid } from '@rhuds/components';

<DataGrid
  data={data}
  columns={columns}
  rowHeight={40}
  visibleRows={10}
  selectionMode="multiple"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[]` | - | Grid data |
| `columns` | `DataGridColumn[]` | - | Grid columns |
| `rowHeight` | `number` | `40` | Row height |
| `visibleRows` | `number` | `10` | Visible rows |
| `selectionMode` | `'single' \| 'multiple' \| 'none'` | `'none'` | Selection mode |

---

### Tree

Hierarchical tree view component.

```tsx
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

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | - | Tree nodes |
| `expandedNodes` | `string[]` | - | Expanded node keys |
| `onExpand` | `(key: string) => void` | - | Expand handler |
| `onCollapse` | `(key: string) => void` | - | Collapse handler |
| `selectedNode` | `string` | - | Selected node key |

---

## Advanced Components

### Modal

Modal dialog component.

```tsx
import { Modal } from '@rhuds/components';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
>
  <p>Modal content</p>
</Modal>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Open state |
| `onClose` | `() => void` | - | Close handler |
| `title` | `string` | - | Modal title |
| `children` | `ReactNode` | - | Modal content |

---

### Dialog

Dialog with action buttons.

```tsx
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

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Open state |
| `onClose` | `() => void` | - | Close handler |
| `title` | `string` | - | Dialog title |
| `children` | `ReactNode` | - | Dialog content |
| `actions` | `DialogAction[]` | - | Action buttons |

---

### Notification

Toast notification component.

```tsx
import { Notification } from '@rhuds/components';

<Notification
  message="Success!"
  type="success"
  duration={3000}
  onClose={handleClose}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | - | Notification message |
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Notification type |
| `duration` | `number` | `3000` | Auto-close duration (ms) |
| `onClose` | `() => void` | - | Close handler |

---

### NotificationProvider

Context provider for notifications system.

```tsx
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

### HudLoader

Futuristic HUD-style loader component with SVG animations, grid, traces, and skeleton loaders.

```tsx
import { HudLoader } from '@rhuds/components';

<HudLoader text="Loading..." size={100} />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `'Loading...'` | Loading text to display |
| `size` | `number` | `100` | Loader size as percentage |
| `className` | `string` | - | Custom CSS class |

#### Features

- SVG-based grid animation with horizontal and vertical lines
- Browser frame simulation with HUD styling
- Skeleton loaders with pulse animation
- 4 trace flows with gradient effects and animations
- Cyan HUD color (#00ccff) with glow effects
- Customizable loading text and size
- Perfect for sci-fi/cyberpunk loading screens
- Pure SVG (no external dependencies)
- Smooth animations with CSS keyframes

#### Example

```tsx
import { HudLoader } from '@rhuds/components';
import { useState, useEffect } from 'react';

function MyComponent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 3000);
  }, []);

  if (loading) {
    return (
      <div style={{ height: '400px' }}>
        <HudLoader text="Loading data..." size={100} />
      </div>
    );
  }

  return <YourContent />;
}

// Custom text
<HudLoader text="Initializing System..." size={80} />

// Full screen loader
<div style={{ height: '100vh' }}>
  <HudLoader text="Please wait..." size={100} />
</div>
```

#### Design Guidelines

- Use for initial app loading or data fetching states
- Best for sci-fi, cyberpunk, or futuristic interfaces
- Recommended height: 300px-600px for optimal visibility
- Works well on dark backgrounds
- Pairs well with HudButton and GlitchButton components

#### Animation Details

- **Grid Lines**: Static grid with subtle color (#222)
- **Pulse Animation**: Skeleton elements fade between #2d2d2d and #505050 (1.8s)
- **Flow Animation**: Trace lines move with dash-offset animation (5s)
- **Gradients**: 4 unique gradient paths for trace flows
- **Drop Shadow**: Glow effects on browser frame and traces

---

### Accordion

Collapsible accordion component.

```tsx
import { Accordion } from '@rhuds/components';

<Accordion
  items={[
    { key: '1', title: 'Section 1', content: 'Content 1' },
    { key: '2', title: 'Section 2', content: 'Content 2' },
  ]}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `AccordionItem[]` | - | Accordion items |
| `expandedItems` | `string[]` | - | Expanded item keys |
| `allowMultiple` | `boolean` | `false` | Allow multiple open |

---

### Stepper

Step-by-step progress indicator component.

```tsx
import { Stepper } from '@rhuds/components';

<Stepper
  steps={[
    { key: 'step1', label: 'Step 1', description: 'First step' },
    { key: 'step2', label: 'Step 2', description: 'Second step' },
    { key: 'step3', label: 'Step 3', description: 'Final step' },
  ]}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
  orientation="horizontal"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepperStep[]` | - | Step items |
| `currentStep` | `number` | `0` | Current step index |
| `onStepChange` | `(index: number) => void` | - | Step change handler |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Stepper orientation |
| `showContent` | `boolean` | `false` | Show step content |

---

### Carousel

Image/content carousel with auto-play support.

```tsx
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

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `CarouselItem[]` | - | Carousel items |
| `currentIndex` | `number` | `0` | Current slide index |
| `onIndexChange` | `(index: number) => void` | - | Slide change handler |
| `autoPlayInterval` | `number` | - | Auto-play interval (ms) |
| `showDots` | `boolean` | `true` | Show navigation dots |
| `showArrows` | `boolean` | `true` | Show navigation arrows |

---

### CodeEditor

Code editor component with syntax highlighting.

```tsx
import { CodeEditor } from '@rhuds/components';

<CodeEditor
  value={code}
  onChange={setCode}
  language="javascript"
  theme="dark"
  lineNumbers
  readOnly={false}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Code content |
| `onChange` | `(value: string) => void` | - | Change handler |
| `language` | `string` | `'javascript'` | Programming language |
| `theme` | `'light' \| 'dark'` | `'dark'` | Editor theme |
| `lineNumbers` | `boolean` | `true` | Show line numbers |
| `readOnly` | `boolean` | `false` | Read-only mode |

---

### RichTextEditor

Rich text WYSIWYG editor component.

```tsx
import { RichTextEditor } from '@rhuds/components';

<RichTextEditor
  value={content}
  onChange={setContent}
  toolbar={['bold', 'italic', 'underline', 'link']}
  placeholder="Start typing..."
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | HTML content |
| `onChange` | `(value: string) => void` | - | Change handler |
| `toolbar` | `string[]` | - | Toolbar buttons |
| `placeholder` | `string` | - | Placeholder text |
| `readOnly` | `boolean` | `false` | Read-only mode |

---

### Dropdown

Dropdown menu component.

```tsx
import { Dropdown } from '@rhuds/components';

<Dropdown
  items={[
    { key: '1', label: 'Action 1', onClick: () => {} },
    { key: '2', label: 'Action 2', onClick: () => {} },
  ]}
>
  <Button>Open Menu</Button>
</Dropdown>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `DropdownItem[]` | - | Menu items |
| `children` | `ReactNode` | - | Trigger element |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Menu position |

---

### Tooltip

Tooltip component with configurable position.

```tsx
import { Tooltip } from '@rhuds/components';

<Tooltip content="Tooltip text" position="top">
  <button>Hover me</button>
</Tooltip>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string \| ReactNode` | - | Tooltip content |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Tooltip position |
| `children` | `ReactNode` | - | Trigger element |
| `showDelay` | `number` | `200` | Show delay (ms) |
| `hideDelay` | `number` | `0` | Hide delay (ms) |

---

### Popover

Popover component with title and content.

```tsx
import { Popover } from '@rhuds/components';

<Popover
  content="Popover content"
  title="Popover Title"
  position="bottom"
>
  <button>Click me</button>
</Popover>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ReactNode` | - | Popover content |
| `title` | `string` | - | Popover title |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Popover position |
| `children` | `ReactNode` | - | Trigger element |
| `closeOnOutsideClick` | `boolean` | `true` | Close on outside click |

---

### Portal

Portal component for rendering outside DOM hierarchy.

```tsx
import { Portal } from '@rhuds/components';

<Portal>
  <div>This renders at document.body</div>
</Portal>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to portal |
| `container` | `HTMLElement` | `document.body` | Target container |

---

## Specialized Components

### Slider

Range slider component with customizable min, max, and step values.

```tsx
import { Slider } from '@rhuds/components';

<Slider
  value={value}
  onChange={setValue}
  min={0}
  max={100}
  step={1}
  label="Volume"
  showValue
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Current value |
| `onChange` | `(value: number) => void` | - | Change handler |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `label` | `string` | - | Slider label |
| `showValue` | `boolean` | `true` | Show current value |
| `disabled` | `boolean` | `false` | Disabled state |

---

### DatePicker

Date picker component with calendar interface.

```tsx
import { DatePicker } from '@rhuds/components';

<DatePicker
  value={date}
  onChange={setDate}
  format="YYYY-MM-DD"
  minDate={new Date('2020-01-01')}
  maxDate={new Date('2030-12-31')}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| null` | - | Selected date |
| `onChange` | `(date: Date \| null) => void` | - | Change handler |
| `format` | `string` | `'YYYY-MM-DD'` | Date format |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `placeholder` | `string` | - | Placeholder text |
| `disabled` | `boolean` | `false` | Disabled state |

---

### ColorPicker

Color picker component with multiple input modes.

```tsx
import { ColorPicker } from '@rhuds/components';

<ColorPicker
  value={color}
  onChange={setColor}
  format="hex"
  showAlpha
  presets={['#ff0000', '#00ff00', '#0000ff']}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Color value |
| `onChange` | `(color: string) => void` | - | Change handler |
| `format` | `'hex' \| 'rgb' \| 'hsl'` | `'hex'` | Color format |
| `showAlpha` | `boolean` | `false` | Show alpha channel |
| `presets` | `string[]` | - | Preset colors |
| `disabled` | `boolean` | `false` | Disabled state |

---

### FileUpload

File upload component with drag and drop support.

```tsx
import { FileUpload } from '@rhuds/components';

<FileUpload
  onUpload={handleUpload}
  accept="image/*"
  maxSize={5 * 1024 * 1024}
  multiple
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onUpload` | `(files: File[]) => void` | - | Upload handler |
| `accept` | `string` | - | Accepted file types |
| `maxSize` | `number` | - | Max file size in bytes |
| `multiple` | `boolean` | `false` | Allow multiple files |
| `disabled` | `boolean` | `false` | Disabled state |

---

## Visualization Components

### Chart

Data visualization chart component with multiple chart types.

```tsx
import { Chart } from '@rhuds/components';

<Chart
  type="line"
  data={{
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Sales',
      data: [100, 200, 150]
    }]
  }}
  options={{
    responsive: true,
    maintainAspectRatio: false
  }}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'line' \| 'bar' \| 'pie' \| 'doughnut' \| 'radar'` | `'line'` | Chart type |
| `data` | `ChartData` | - | Chart data |
| `options` | `ChartOptions` | - | Chart options |
| `width` | `number \| string` | `'100%'` | Chart width |
| `height` | `number \| string` | `400` | Chart height |

---

## Layout Components

### Container

Responsive container component with max-width.

```tsx
import { Container } from '@rhuds/components';

<Container maxWidth="1200px">
  <YourContent />
</Container>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxWidth` | `string \| number` | `'1200px'` | Maximum width |
| `padding` | `string \| number` | `'1rem'` | Container padding |
| `children` | `ReactNode` | - | Container content |

---

### Grid

CSS Grid layout component with responsive columns.

```tsx
import { Grid } from '@rhuds/components';

<Grid columns={3} gap={2}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `number \| Record<string, number>` | `1` | Number of columns |
| `gap` | `string \| number` | `'1rem'` | Grid gap |
| `children` | `ReactNode` | - | Grid items |

---

### Stack

Flexbox stack layout component for vertical/horizontal layouts.

```tsx
import { Stack } from '@rhuds/components';

<Stack direction="column" gap="1rem" align="center">
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'row' \| 'column'` | `'column'` | Stack direction |
| `gap` | `string \| number` | `'1rem'` | Item spacing |
| `align` | `'flex-start' \| 'center' \| 'flex-end' \| 'stretch'` | `'stretch'` | Align items |
| `justify` | `'flex-start' \| 'center' \| 'flex-end' \| 'space-between'` | `'flex-start'` | Justify content |
| `children` | `ReactNode` | - | Stack items |

---

## Summary

RHUDS Pro includes 42 production-ready components organized into 10 categories:

- **Basic Components** (7): Text, Button, HudButton, GlitchButton, Icon, Input, Select
- **Layout Components** (3): Container, Grid, Stack
- **Form Components** (5): Checkbox, Radio, RadioGroup, Switch, useForm
- **Navigation Components** (6): Navbar, Sidebar, Breadcrumb, Tabs, Menu, Pagination
- **Data Display Components** (3): Table, DataGrid, Tree
- **Feedback Components** (4): Modal, Dialog, Notification, NotificationProvider
- **Utility Components** (4): Tooltip, Popover, Dropdown, Portal
- **Advanced Components** (5): Carousel, Accordion, Stepper, CodeEditor, RichTextEditor
- **Specialized Components** (4): Slider, DatePicker, ColorPicker, FileUpload
- **Visualization Components** (1): Chart

All components are fully typed with TypeScript, accessible, and integrate seamlessly with the RHUDS theme system.

