import React, { useState } from 'react';
import { useTheme } from '@rhuds/core';
import {
  Text, Button, Icon, Input, Select, Grid, Container, Stack,
  Checkbox, RadioGroup, Switch, Tabs, Pagination, Table,
  Modal, Dialog, Notification, Tooltip, Popover, Dropdown,
  Accordion, Stepper, Carousel, Slider, DatePicker, ColorPicker,
  FileUpload, Chart, DataGrid, Tree, Navbar, Sidebar, Breadcrumb,
  Menu, CodeEditor, RichTextEditor,
} from '@rhuds/components';
import {
  GridLines,
  Dots,
  Puffs,
  MovingLines,
  Nebula,
  StarField,
  AnimatedGradient,
  Plasma,
} from '@rhuds/backgrounds';
import {
  FrameSVGOctagon,
  FrameSVGKranox,
  FrameSVGCorners,
  FrameSVGLines,
  FrameSVGUnderline,
  FrameSVGNefrex,
} from '@rhuds/frames';

export const ShowcasePage: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  
  // Form states
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchValue, setSwitchValue] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [colorValue, setColorValue] = useState('#00f6ff');
  const [dateValue, setDateValue] = useState(new Date());
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // UI states
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [codeValue, setCodeValue] = useState('// Write your code\nconst hello = "world";');

  // Data
  const chartData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 78 },
    { label: 'Mar', value: 90 },
    { label: 'Apr', value: 81 },
    { label: 'May', value: 95 },
  ];

  const tableData = [
    { id: 1, name: 'Button', category: 'Basic', status: '✅' },
    { id: 2, name: 'Input', category: 'Form', status: '✅' },
    { id: 3, name: 'Modal', category: 'Feedback', status: '✅' },
  ];

  const treeData = [
    {
      key: '1',
      id: '1',
      label: 'Root',
      children: [
        { key: '1-1', id: '1-1', label: 'Child 1' },
        { key: '1-2', id: '1-2', label: 'Child 2', children: [
          { key: '1-2-1', id: '1-2-1', label: 'Grandchild' },
        ]},
      ],
    },
  ];

  const navItems = [
    { label: 'Home', onClick: () => {}, active: true },
    { label: 'About', onClick: () => {} },
  ];

  const breadcrumbItems = [
    { label: 'Home', onClick: () => {} },
    { label: 'Components', onClick: () => {} },
    { label: 'Showcase', active: true },
  ];

  const tabItems = [
    {
      label: 'Basic (5)',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="1. Text">
            <Stack direction="column" gap="0.5rem">
              <Text variant="h1">Heading 1</Text>
              <Text variant="h2">Heading 2</Text>
              <Text variant="body">Body text</Text>
            </Stack>
          </ComponentSection>
          <ComponentSection title="2. Button">
            <Stack direction="row" gap="1rem">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
            </Stack>
          </ComponentSection>
          <ComponentSection title="3. Icon">
            <Stack direction="row" gap="1rem">
              <Icon name="check" size={24} color={theme.currentMode.tokens.colors.success} />
              <Icon name="close" size={24} color={theme.currentMode.tokens.colors.error} />
            </Stack>
          </ComponentSection>
          <ComponentSection title="4. Input">
            <Input placeholder="Enter text..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          </ComponentSection>
          <ComponentSection title="5. Select">
            <Select
              value={selectValue}
              onChange={(v) => setSelectValue(String(v))}
              options={[
                { value: 'opt1', label: 'Option 1' },
                { value: 'opt2', label: 'Option 2' },
              ]}
            />
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Layout (3)',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="6. Grid">
            <Grid columns={3} gap={1}>
              <div style={{ padding: '1rem', background: 'rgba(0,246,255,0.2)' }}>1</div>
              <div style={{ padding: '1rem', background: 'rgba(0,246,255,0.2)' }}>2</div>
              <div style={{ padding: '1rem', background: 'rgba(0,246,255,0.2)' }}>3</div>
            </Grid>
          </ComponentSection>
          <ComponentSection title="7. Container">
            <Container maxWidth="600px">
              <Text>Content in container</Text>
            </Container>
          </ComponentSection>
          <ComponentSection title="8. Stack">
            <Stack direction="row" gap="1rem">
              <Button>A</Button>
              <Button>B</Button>
              <Button>C</Button>
            </Stack>
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Form (7)',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="9. Checkbox">
            <Checkbox checked={checkboxValue} onChange={setCheckboxValue} label="Accept" />
          </ComponentSection>
          <ComponentSection title="10. RadioGroup">
            <RadioGroup
              value={radioValue}
              onChange={(v) => setRadioValue(String(v))}
              options={[
                { label: 'Option 1', value: 'opt1' },
                { label: 'Option 2', value: 'opt2' },
              ]}
            />
          </ComponentSection>
          <ComponentSection title="11. Switch">
            <Switch checked={switchValue} onChange={setSwitchValue} label="Enable" />
          </ComponentSection>
          <ComponentSection title="12. Slider">
            <Slider value={sliderValue} onChange={setSliderValue} min={0} max={100} />
            <Text>Value: {sliderValue}</Text>
          </ComponentSection>
          <ComponentSection title="13. DatePicker">
            <DatePicker value={dateValue} onChange={setDateValue} />
          </ComponentSection>
          <ComponentSection title="14. ColorPicker">
            <ColorPicker value={colorValue} onChange={setColorValue} />
          </ComponentSection>
          <ComponentSection title="15. FileUpload">
            <FileUpload onUpload={setUploadedFiles} accept=".jpg,.png" />
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Navigation (6)',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="16. Navbar">
            <Navbar items={navItems} />
          </ComponentSection>
          <ComponentSection title="17. Sidebar">
            <div style={{ height: '200px', position: 'relative' }}>
              <Sidebar items={navItems} />
            </div>
          </ComponentSection>
          <ComponentSection title="18. Breadcrumb">
            <Breadcrumb items={breadcrumbItems} />
          </ComponentSection>
          <ComponentSection title="19. Tabs">
            <Text>Tabs component (you're using it now!)</Text>
          </ComponentSection>
          <ComponentSection title="20. Menu">
            <Menu items={navItems} />
          </ComponentSection>
          <ComponentSection title="21. Pagination">
            <Pagination total={100} perPage={10} currentPage={currentPage} onPageChange={setCurrentPage} />
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Data (3)',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="22. Table">
            <Table
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'category', label: 'Category' },
              ]}
              data={tableData}
            />
          </ComponentSection>
          <ComponentSection title="23. DataGrid">
            <DataGrid
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
              ]}
              data={tableData}
              selectedRows={selectedRows}
              onSelectionChange={(rows) => setSelectedRows(rows as number[])}
            />
          </ComponentSection>
          <ComponentSection title="24. Tree">
            <Tree nodes={treeData} onNodeClick={(node) => console.log(node)} />
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Feedback (3)',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="25. Modal">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Modal">
              <Text>Modal content</Text>
            </Modal>
          </ComponentSection>
          <ComponentSection title="26. Dialog">
            <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
            <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} title="Dialog">
              <Text>Dialog content</Text>
            </Dialog>
          </ComponentSection>
          <ComponentSection title="27. Notification">
            <Notification type="success" message="Success notification!" />
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Utility (3)',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="28. Tooltip">
            <Tooltip content="Helpful tip!">
              <Button>Hover me</Button>
            </Tooltip>
          </ComponentSection>
          <ComponentSection title="29. Popover">
            <Popover content={<Text>Popover content</Text>} title="Info">
              <Button>Click me</Button>
            </Popover>
          </ComponentSection>
          <ComponentSection title="30. Dropdown">
            <Dropdown
              items={[
                { key: '1', label: 'Action 1', onClick: () => {} },
                { key: '2', label: 'Action 2', onClick: () => {} },
              ]}
            >
              <Button>Menu</Button>
            </Dropdown>
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Advanced (5)',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="31. Accordion">
            <Accordion
              items={[
                { key: '1', title: 'Section 1', content: 'Content 1' },
                { key: '2', title: 'Section 2', content: 'Content 2' },
              ]}
            />
          </ComponentSection>
          <ComponentSection title="32. Stepper">
            <Stepper
              steps={[
                { key: '1', label: 'Step 1' },
                { key: '2', label: 'Step 2' },
                { key: '3', label: 'Step 3' },
              ]}
              currentStep={1}
            />
          </ComponentSection>
          <ComponentSection title="33. Carousel">
            <Carousel
              items={[
                { key: '1', content: <div style={{ padding: '2rem', background: 'rgba(0,246,255,0.1)' }}>Slide 1</div> },
                { key: '2', content: <div style={{ padding: '2rem', background: 'rgba(123,97,255,0.1)' }}>Slide 2</div> },
              ]}
              currentIndex={carouselIndex}
              onIndexChange={setCarouselIndex}
            />
          </ComponentSection>
          <ComponentSection title="34. CodeEditor">
            <CodeEditor value={codeValue} onChange={setCodeValue} language="javascript" />
          </ComponentSection>
          <ComponentSection title="35. RichTextEditor">
            <RichTextEditor value="<p>Rich text</p>" onChange={() => {}} />
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Visualization (1)',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="36. Chart">
            <Chart data={chartData} type="bar" width={600} height={300} />
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Backgrounds (8)',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="37. GridLines">
            <div style={{ position: 'relative', height: '200px', background: '#000' }}>
              <GridLines width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="38. Dots">
            <div style={{ position: 'relative', height: '200px', background: '#000' }}>
              <Dots width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="39. Puffs">
            <div style={{ position: 'relative', height: '200px', background: '#000' }}>
              <Puffs width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="40. MovingLines">
            <div style={{ position: 'relative', height: '200px', background: '#000' }}>
              <MovingLines width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="41. Nebula">
            <div style={{ position: 'relative', height: '200px', background: '#000' }}>
              <Nebula width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="42. StarField">
            <div style={{ position: 'relative', height: '200px', background: '#000' }}>
              <StarField width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="43. AnimatedGradient">
            <div style={{ position: 'relative', height: '200px' }}>
              <AnimatedGradient width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="44. Plasma">
            <div style={{ position: 'relative', height: '200px' }}>
              <Plasma width={600} height={200} />
            </div>
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Frames (6)',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="45-50. Frame Components">
            <Text variant="body">
              Frame components (FrameSVGOctagon, FrameSVGKranox, FrameSVGCorners, FrameSVGLines, FrameSVGUnderline, FrameSVGNefrex) 
              are available for creating futuristic UI borders with SVG-based rendering.
            </Text>
            <Text variant="caption" style={{ marginTop: '1rem', opacity: 0.7 }}>
              These components require specific configuration and are best used in custom layouts.
            </Text>
          </ComponentSection>
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Container maxWidth="1400px">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Text
            variant="h1"
            style={{
              color: theme.currentMode.tokens.colors.primary,
              marginBottom: '1rem',
              fontSize: '3rem',
            }}
          >
            🎮 Component Showcase
          </Text>
          <Text variant="body" style={{ fontSize: '1.2rem', opacity: 0.8 }}>
            50 Production-Ready Components
          </Text>
        </div>

        <Tabs items={tabItems} activeIndex={activeTab} onChange={setActiveTab} />

        <div
          style={{
            marginTop: '3rem',
            padding: '2rem',
            background: 'rgba(0, 246, 255, 0.1)',
            borderRadius: '8px',
            border: `2px solid ${theme.currentMode.tokens.colors.primary}`,
            textAlign: 'center',
          }}
        >
          <Text
            variant="h2"
            style={{ color: theme.currentMode.tokens.colors.primary, marginBottom: '1rem' }}
          >
            📦 Complete Component Library
          </Text>
          <Grid columns={4} gap={2}>
            <StatCard title="5" subtitle="Basic" color={theme.currentMode.tokens.colors.primary} />
            <StatCard title="3" subtitle="Layout" color={theme.currentMode.tokens.colors.success} />
            <StatCard title="7" subtitle="Form" color={theme.currentMode.tokens.colors.secondary} />
            <StatCard title="6" subtitle="Navigation" color={theme.currentMode.tokens.colors.warning} />
            <StatCard title="3" subtitle="Data Display" color={theme.currentMode.tokens.colors.error} />
            <StatCard title="3" subtitle="Feedback" color={theme.currentMode.tokens.colors.info} />
            <StatCard title="3" subtitle="Utility" color={theme.currentMode.tokens.colors.primary} />
            <StatCard title="5" subtitle="Advanced" color={theme.currentMode.tokens.colors.success} />
            <StatCard title="1" subtitle="Visualization" color={theme.currentMode.tokens.colors.secondary} />
            <StatCard title="8" subtitle="Backgrounds" color={theme.currentMode.tokens.colors.warning} />
            <StatCard title="6" subtitle="Frames" color={theme.currentMode.tokens.colors.error} />
          </Grid>
          <Text
            variant="h1"
            style={{
              color: theme.currentMode.tokens.colors.primary,
              marginTop: '2rem',
              fontSize: '4rem',
            }}
          >
            50 Components Total
          </Text>
        </div>
      </Container>
    </div>
  );
};

const ComponentSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const theme = useTheme();

  return (
    <div
      style={{
        padding: '2rem',
        background: 'rgba(26, 26, 26, 0.8)',
        borderRadius: '8px',
        border: `1px solid ${theme.currentMode.tokens.colors.primary}`,
      }}
    >
      <Text
        variant="h3"
        style={{ marginBottom: '1rem', color: theme.currentMode.tokens.colors.primary }}
      >
        {title}
      </Text>
      {children}
    </div>
  );
};

const StatCard: React.FC<{ title: string; subtitle: string; color: string }> = ({
  title,
  subtitle,
  color,
}) => (
  <div>
    <Text variant="h3" style={{ color }}>
      {title}
    </Text>
    <Text variant="body">{subtitle}</Text>
  </div>
);
