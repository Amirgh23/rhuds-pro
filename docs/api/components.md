# Components API

Complete reference for all RHUDS components.

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

## Specialized Components

### Slider

Range slider component.

```tsx
import { Slider } from '@rhuds/components';

<Slider
  value={value}
  onChange={setValue}
  min={0}
  max={100}
  step={1}
/>
```

---

### DatePicker

Date picker component.

```tsx
import { DatePicker } from '@rhuds/components';

<DatePicker
  value={date}
  onChange={setDate}
/>
```

---

### ColorPicker

Color picker component.

```tsx
import { ColorPicker } from '@rhuds/components';

<ColorPicker
  value={color}
  onChange={setColor}
/>
```

---

## Layout Components

### Container

Responsive container component.

```tsx
import { Container } from '@rhuds/components';

<Container maxWidth="1200px">
  <YourContent />
</Container>
```

---

### Grid

CSS Grid layout component.

```tsx
import { Grid } from '@rhuds/components';

<Grid columns={3} gap={2}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

---

### Stack

Flexbox stack layout component.

```tsx
import { Stack } from '@rhuds/components';

<Stack direction="column" gap="1rem">
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>
```
