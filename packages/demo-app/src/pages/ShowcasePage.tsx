import React, { useState, useRef } from 'react';
import { useTheme } from '@rhuds/core';
import {
  Text, Button, Icon, Input, Select, Grid, Stack,
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
  HudFrameWithControls,
  useFrameSVGAssemblingAnimation,
  createFrameOctagonClip,
  createFrameKranoxClip,
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
            <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
              <Text>Content in container</Text>
            </div>
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
            <div style={{ position: 'relative', border: '1px solid rgba(0, 246, 255, 0.3)', borderRadius: '4px', overflow: 'hidden' }}>
              <Navbar items={navItems} position="static" />
            </div>
          </ComponentSection>
          <ComponentSection title="17. Sidebar">
            <div style={{ height: '300px', position: 'relative', border: '1px solid rgba(0, 246, 255, 0.3)', borderRadius: '4px', overflow: 'hidden' }}>
              <Sidebar items={navItems} position="relative" />
            </div>
          </ComponentSection>
          <ComponentSection title="18. Breadcrumb">
            <Breadcrumb items={breadcrumbItems} />
          </ComponentSection>
          <ComponentSection title="19. Tabs">
            <Text>Tabs component (you're using it now!)</Text>
          </ComponentSection>
          <ComponentSection title="20. Menu">
            <div style={{ position: 'relative', minHeight: '200px', padding: '1rem', border: '1px solid rgba(0, 246, 255, 0.3)', borderRadius: '4px' }}>
              <Menu items={navItems} />
            </div>
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
      label: 'Frames (7)',
      content: <FramesTabContent />,
    },
  ];

  return (
    <div style={{ 
      padding: 0,
      background: 'linear-gradient(180deg, #000814 0%, #001d3d 50%, #000814 100%)',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    }}>
      <div style={{ 
        padding: 'clamp(1rem, 3vw, 2rem) clamp(0.5rem, 2vw, 1rem)',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <Text
            variant="h1"
            style={{
              color: '#00f6ff',
              marginBottom: '1rem',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              fontWeight: 800,
              textShadow: '0 0 20px rgba(0, 246, 255, 0.6), 0 0 40px rgba(0, 246, 255, 0.3)',
            }}
          >
            🎮 COMPONENT SHOWCASE
          </Text>
          <Text variant="body" style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
            opacity: 0.9,
            color: '#00f6ff',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            51 Production-Ready Components
          </Text>
        </div>

        <div style={{ 
          width: '100%', 
          maxWidth: '100%', 
          boxSizing: 'border-box',
        }}>
          <Tabs items={tabItems} activeIndex={activeTab} onChange={setActiveTab} />
        </div>

        <div
          style={{
            marginTop: 'clamp(2rem, 4vw, 3rem)',
            padding: 'clamp(1rem, 3vw, 2rem)',
            background: 'rgba(0, 246, 255, 0.05)',
            borderRadius: '8px',
            border: `2px solid rgba(0, 246, 255, 0.3)`,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 246, 255, 0.2)',
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflowX: 'hidden',
          }}
        >
          <Text
            variant="h2"
            style={{ 
              color: '#00f6ff', 
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textShadow: '0 0 15px rgba(0, 246, 255, 0.6)',
            }}
          >
            📦 COMPLETE COMPONENT LIBRARY
          </Text>
          <Grid columns={4} gap={2} style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100px, 100%), 1fr))',
            maxWidth: '100%',
            width: '100%',
          }}>
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
            <StatCard title="7" subtitle="Frames" color="#00f6ff" />
          </Grid>
          <Text
            variant="h1"
            style={{
              color: '#00f6ff',
              marginTop: '2rem',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              fontWeight: 900,
              textShadow: '0 0 20px rgba(0, 246, 255, 0.8)',
            }}
          >
            51 COMPONENTS
          </Text>
        </div>
      </div>
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
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        background: 'rgba(0, 10, 20, 0.4)',
        borderRadius: '4px',
        border: `1px solid rgba(0, 246, 255, 0.2)`,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 246, 255, 0.1)',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <Text
        variant="h3"
        style={{ 
          marginBottom: '1.5rem', 
          color: '#00f6ff',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontSize: '1.1rem',
          fontWeight: 700,
          textShadow: '0 0 10px rgba(0, 246, 255, 0.5)',
        }}
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
  <div style={{
    padding: 'clamp(0.75rem, 2vw, 1.5rem)',
    background: `linear-gradient(135deg, ${color}15, ${color}05)`,
    border: `1px solid ${color}40`,
    borderRadius: '4px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    boxShadow: `0 4px 20px ${color}20`,
    transition: 'all 0.3s ease',
  }}>
    <Text variant="h3" style={{ 
      color,
      fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
      fontWeight: 800,
      marginBottom: '0.5rem',
      textShadow: `0 0 15px ${color}80`,
    }}>
      {title}
    </Text>
    <Text variant="body" style={{ 
      color: color,
      opacity: 0.9,
      fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: 600,
    }}>
      {subtitle}
    </Text>
  </div>
);

// ==================== Frames Tab Content ====================

// Shared Frame Card Wrapper
const FrameCard: React.FC<{
  title: string;
  color: string;
  children: React.ReactNode;
  onReplay: () => void;
}> = ({ title, color, children, onReplay }) => {
  return (
    <div style={{
      background: 'rgba(0, 10, 20, 0.6)',
      border: `1px solid ${color}33`,
      borderRadius: '4px',
      padding: 'clamp(0.75rem, 2vw, 1rem)',
      backdropFilter: 'blur(10px)',
      boxShadow: `0 4px 20px ${color}15`,
    }}>
      <Text variant="caption" style={{ 
        marginBottom: '10px', 
        display: 'block',
        color: color,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
        fontWeight: 600,
      }}>
        {title}
      </Text>
      {children}
      <Button 
        onClick={onReplay} 
        variant="secondary" 
        style={{ 
          width: '100%', 
          fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)',
          background: `${color}1A`,
          border: `1px solid ${color}4D`,
          color: color,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          marginTop: '10px',
          padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${color}33`;
          e.currentTarget.style.borderColor = `${color}99`;
          e.currentTarget.style.boxShadow = `0 0 15px ${color}66`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `${color}1A`;
          e.currentTarget.style.borderColor = `${color}4D`;
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        🔄 REPLAY ANIMATION
      </Button>
    </div>
  );
};

const FramesTabContent: React.FC = () => {
  return (
    <Stack direction="column" gap="2rem" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
      {/* ClipPath Examples */}
      <ComponentSection title="CSS ClipPath Frames">
        <Text variant="body" style={{ marginBottom: '1rem', opacity: 0.8, color: '#00f6ff', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
          Using CSS clip-path for lightweight frame shapes (faster rendering)
        </Text>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))',
          gap: 'clamp(10px, 2vw, 20px)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}>
          <div>
            <Text variant="caption" style={{ marginBottom: '10px', display: 'block', color: '#00f6ff', textTransform: 'uppercase', fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)' }}>
              Octagon (All Corners)
            </Text>
            <div
              style={{
                width: '100%',
                height: 'clamp(80px, 15vw, 100px)',
                clipPath: createFrameOctagonClip({ squareSize: 16 }),
                background: 'linear-gradient(135deg, rgba(0, 246, 255, 0.2), rgba(0, 246, 255, 0.05))',
                border: '1px solid rgba(0, 246, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00f6ff',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
              }}
            >
              OCTAGON
            </div>
          </div>

          <div>
            <Text variant="caption" style={{ marginBottom: '10px', display: 'block', color: '#e91e63', textTransform: 'uppercase', fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)' }}>
              Octagon (Selective)
            </Text>
            <div
              style={{
                width: '100%',
                height: 'clamp(80px, 15vw, 100px)',
                clipPath: createFrameOctagonClip({
                  squareSize: 16,
                  leftTop: true,
                  rightTop: false,
                  rightBottom: true,
                  leftBottom: false,
                }),
                background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.2), rgba(233, 30, 99, 0.05))',
                border: '1px solid rgba(233, 30, 99, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e91e63',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
              }}
            >
              SELECTIVE
            </div>
          </div>

          <div>
            <Text variant="caption" style={{ marginBottom: '10px', display: 'block', color: '#ffeb3b', textTransform: 'uppercase', fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)' }}>
              Kranox
            </Text>
            <div
              style={{
                width: '100%',
                height: 'clamp(80px, 15vw, 100px)',
                clipPath: createFrameKranoxClip({ squareSize: 16 }),
                background: 'linear-gradient(135deg, rgba(255, 235, 59, 0.2), rgba(255, 235, 59, 0.05))',
                border: '1px solid rgba(255, 235, 59, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffeb3b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
              }}
            >
              KRANOX
            </div>
          </div>
        </div>
      </ComponentSection>

      {/* HUD Frame Generator */}
      <ComponentSection title="45. HUD Frame Generator">
        <Text variant="body" style={{ marginBottom: '1rem', opacity: 0.8, color: '#00f6ff', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
          Procedural HUD frame with randomized sci-fi borders
        </Text>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}>
          <div style={{ 
            width: '100%', 
            maxWidth: 'min(500px, 100%)',
            boxSizing: 'border-box',
          }}>
            <div style={{ 
              width: '100%',
              maxWidth: '100%',
              margin: '0 auto',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '100%',
                maxWidth: '384px',
                transform: 'scale(1)',
                transformOrigin: 'center',
              }}>
                <HudFrameWithControls
                  width={384}
                  height={150}
                  showControls={true}
                  showSeedInput={true}
                >
                  <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', lineHeight: '1.4', color: '#00f6ff' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      🎯 PROCEDURAL HUD FRAME
                    </p>
                    <p style={{ margin: '0', opacity: 0.8 }}>
                      Randomized borders with trapezoid features
                    </p>
                  </div>
                </HudFrameWithControls>
              </div>
            </div>
          </div>
        </div>
      </ComponentSection>

      {/* Animated Frames */}
      <ComponentSection title="SVG Frames with Assembling Animation">
        <Text variant="body" style={{ marginBottom: '1rem', opacity: 0.8, color: '#00f6ff', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
          All frames feature stroke-dasharray animation - lines appear gradually
        </Text>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', 
          gap: 'clamp(10px, 2vw, 20px)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}>
          <AnimatedOctagonFrame />
          <AnimatedKranoxFrame />
          <AnimatedCornersFrame />
          <AnimatedLinesFrame />
          <AnimatedUnderlineFrame />
          <AnimatedNefrexFrame />
        </div>
      </ComponentSection>

      {/* Usage Guide */}
      <ComponentSection title="📚 Usage Guide">
        <div style={{ 
          background: 'rgba(0, 246, 255, 0.05)', 
          padding: 'clamp(1rem, 3vw, 1.5rem)', 
          borderRadius: '4px',
          border: '1px solid rgba(0, 246, 255, 0.2)',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflowX: 'auto',
        }}>
          <Text variant="h4" style={{ marginBottom: '1rem', color: '#00f6ff', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
            Frame with Animation:
          </Text>
          <pre style={{
            background: '#000',
            padding: 'clamp(10px, 2vw, 15px)',
            borderRadius: '4px',
            overflowX: 'auto',
            fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
            border: '1px solid rgba(0, 246, 255, 0.3)',
            color: '#00f6ff',
            lineHeight: '1.6',
            maxWidth: '100%',
            boxSizing: 'border-box',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
{`import { FrameSVGOctagon, useFrameSVGAssemblingAnimation } from '@rhuds/frames';

const MyFrame = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef, { 
    duration: 1500 
  });
  
  return (
    <div style={{ position: 'relative', width: 300, height: 150 }}>
      <style>{\`
        [data-name=bg] { 
          fill: rgba(0, 246, 255, 0.08); 
          filter: drop-shadow(0 0 8px rgba(0, 246, 255, 0.4));
        }
        [data-name=line] { 
          stroke: #00f6ff; 
          filter: drop-shadow(0 0 8px rgba(0, 246, 255, 0.8));
        }
      \`}</style>
      <FrameSVGOctagon 
        elementRef={svgRef} 
        onRender={onRender} 
        padding={4} 
        squareSize={16}
      />
      <div style={{ position: 'absolute', inset: 30 }}>
        Your content here
      </div>
    </div>
  );
};`}
          </pre>
        </div>
      </ComponentSection>
    </Stack>
  );
};

// Animated Frame Components
const AnimatedOctagonFrame: React.FC = () => {
  const [key, setKey] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef, { duration: 1500 });

  React.useEffect(() => {
    setKey(prev => prev + 1);
  }, []);

  return (
    <FrameCard 
      title="46. FrameSVGOctagon" 
      color="#00f6ff"
      onReplay={() => setKey(prev => prev + 1)}
    >
      <div key={key} style={{ position: 'relative', width: '100%', height: 'clamp(150px, 30vw, 200px)' }}>
        <style>
          {`
            .frame-octagon-animated svg [data-name=bg] {
              fill: rgba(0, 246, 255, 0.08) !important;
              filter: drop-shadow(0 0 8px rgba(0, 246, 255, 0.4)) !important;
            }
            .frame-octagon-animated svg [data-name=line] {
              stroke: #00f6ff !important;
              fill: none !important;
              stroke-width: 1.5 !important;
              filter: drop-shadow(0 0 8px rgba(0, 246, 255, 0.8)) !important;
            }
          `}
        </style>
        <div className="frame-octagon-animated">
          <FrameSVGOctagon elementRef={svgRef} onRender={onRender} padding={4} squareSize={16} />
        </div>
        <div style={{
          position: 'absolute',
          inset: 'clamp(20px, 5vw, 30px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <Text variant="body" style={{ 
            color: '#00f6ff', 
            marginBottom: '5px',
            fontWeight: 600,
            textShadow: '0 0 10px rgba(0, 246, 255, 0.8)',
            textTransform: 'uppercase',
            letterSpacing: 'clamp(1px, 0.3vw, 2px)',
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          }}>
            OCTAGON
          </Text>
          <Text variant="caption" style={{ 
            opacity: 0.8, 
            color: '#00f6ff',
            fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Basic Style
          </Text>
        </div>
      </div>
    </FrameCard>
  );
};

const AnimatedKranoxFrame: React.FC = () => {
  const [key, setKey] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef, { duration: 2000 });

  React.useEffect(() => {
    setKey(prev => prev + 1);
  }, []);

  return (
    <FrameCard 
      title="47. FrameSVGKranox" 
      color="#ffeb3b"
      onReplay={() => setKey(prev => prev + 1)}
    >
      <div key={key} style={{ position: 'relative', width: '100%', height: 'clamp(150px, 30vw, 200px)' }}>
        <style>
          {`
            .frame-kranox-animated svg [data-name=bg] {
              fill: rgba(255, 235, 59, 0.08) !important;
              filter: drop-shadow(0 0 8px rgba(255, 235, 59, 0.4)) !important;
            }
            .frame-kranox-animated svg [data-name=line] {
              stroke: #ffeb3b !important;
              fill: none !important;
              stroke-width: 2 !important;
              filter: drop-shadow(0 0 8px rgba(255, 235, 59, 0.8)) !important;
            }
          `}
        </style>
        <div className="frame-kranox-animated">
          <FrameSVGKranox
            elementRef={svgRef}
            onRender={onRender}
            padding={4}
            strokeWidth={2}
            squareSize={12}
            smallLineLength={12}
            largeLineLength={48}
          />
        </div>
        <div style={{
          position: 'absolute',
          inset: 'clamp(20px, 5vw, 30px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <Text variant="body" style={{ 
            color: '#ffeb3b', 
            marginBottom: '5px',
            fontWeight: 600,
            textShadow: '0 0 10px rgba(255, 235, 59, 0.8)',
            textTransform: 'uppercase',
            letterSpacing: 'clamp(1px, 0.3vw, 2px)',
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          }}>
            KRANOX
          </Text>
          <Text variant="caption" style={{ 
            opacity: 0.8, 
            color: '#ffeb3b',
            fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Assembling Style
          </Text>
        </div>
      </div>
    </FrameCard>
  );
};

const AnimatedCornersFrame: React.FC = () => {
  const [key, setKey] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef, { duration: 1500 });

  React.useEffect(() => {
    setKey(prev => prev + 1);
  }, []);

  return (
    <FrameCard 
      title="48. FrameSVGCorners" 
      color="#4caf50"
      onReplay={() => setKey(prev => prev + 1)}
    >
      <div key={key} style={{ position: 'relative', width: '100%', height: 'clamp(150px, 30vw, 200px)' }}>
        <style>
          {`
            .frame-corners-animated svg [data-name=line] {
              stroke: #4caf50 !important;
              fill: none !important;
              stroke-width: 2 !important;
              filter: drop-shadow(0 0 8px rgba(76, 175, 80, 0.8)) !important;
            }
          `}
        </style>
        <div className="frame-corners-animated">
          <FrameSVGCorners elementRef={svgRef} onRender={onRender} padding={4} cornerLength={32} />
        </div>
        <div style={{
          position: 'absolute',
          inset: 'clamp(20px, 5vw, 30px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <Text variant="body" style={{ 
            color: '#4caf50', 
            marginBottom: '5px',
            fontWeight: 600,
            textShadow: '0 0 10px rgba(76, 175, 80, 0.8)',
            textTransform: 'uppercase',
            letterSpacing: 'clamp(1px, 0.3vw, 2px)',
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          }}>
            CORNERS
          </Text>
          <Text variant="caption" style={{ 
            opacity: 0.8, 
            color: '#4caf50',
            fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Corners Only
          </Text>
        </div>
      </div>
    </FrameCard>
  );
};

const AnimatedLinesFrame: React.FC = () => {
  const [key, setKey] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef, { duration: 1500 });

  React.useEffect(() => {
    setKey(prev => prev + 1);
  }, []);

  return (
    <FrameCard 
      title="49. FrameSVGLines" 
      color="#e91e63"
      onReplay={() => setKey(prev => prev + 1)}
    >
      <div key={key} style={{ position: 'relative', width: '100%', height: 'clamp(150px, 30vw, 200px)' }}>
        <style>
          {`
            .frame-lines-animated svg [data-name=line] {
              stroke: #e91e63 !important;
              fill: none !important;
              stroke-width: 2 !important;
              stroke-dasharray: 8 4 !important;
              filter: drop-shadow(0 0 8px rgba(233, 30, 99, 0.8)) !important;
            }
          `}
        </style>
        <div className="frame-lines-animated">
          <FrameSVGLines elementRef={svgRef} onRender={onRender} padding={4} strokeWidth={2} />
        </div>
        <div style={{
          position: 'absolute',
          inset: 'clamp(20px, 5vw, 30px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <Text variant="body" style={{ 
            color: '#e91e63', 
            marginBottom: '5px',
            fontWeight: 600,
            textShadow: '0 0 10px rgba(233, 30, 99, 0.8)',
            textTransform: 'uppercase',
            letterSpacing: 'clamp(1px, 0.3vw, 2px)',
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          }}>
            LINES
          </Text>
          <Text variant="caption" style={{ 
            opacity: 0.8, 
            color: '#e91e63',
            fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Dashed Lines
          </Text>
        </div>
      </div>
    </FrameCard>
  );
};

const AnimatedUnderlineFrame: React.FC = () => {
  const [key, setKey] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef, { duration: 1500 });

  React.useEffect(() => {
    setKey(prev => prev + 1);
  }, []);

  return (
    <FrameCard 
      title="50. FrameSVGUnderline" 
      color="#ff9800"
      onReplay={() => setKey(prev => prev + 1)}
    >
      <div key={key} style={{ position: 'relative', width: '100%', height: 'clamp(150px, 30vw, 200px)' }}>
        <style>
          {`
            .frame-underline-animated svg [data-name=bg] {
              fill: rgba(255, 152, 0, 0.3) !important;
            }
            .frame-underline-animated svg [data-name=line] {
              stroke: #ff9800 !important;
              fill: none !important;
              stroke-width: 2 !important;
              filter: drop-shadow(0 0 8px rgba(255, 152, 0, 0.8)) !important;
            }
          `}
        </style>
        <div className="frame-underline-animated">
          <FrameSVGUnderline elementRef={svgRef} onRender={onRender} padding={4} squareSize={8} />
        </div>
        <div style={{
          position: 'absolute',
          inset: 'clamp(20px, 5vw, 30px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <Text variant="body" style={{ 
            color: '#ff9800', 
            marginBottom: '5px',
            fontWeight: 600,
            textShadow: '0 0 10px rgba(255, 152, 0, 0.8)',
            textTransform: 'uppercase',
            letterSpacing: 'clamp(1px, 0.3vw, 2px)',
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          }}>
            UNDERLINE
          </Text>
          <Text variant="caption" style={{ 
            opacity: 0.8, 
            color: '#ff9800',
            fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            With Underline
          </Text>
        </div>
      </div>
    </FrameCard>
  );
};

const AnimatedNefrexFrame: React.FC = () => {
  const [key, setKey] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef, { duration: 2000 });

  React.useEffect(() => {
    setKey(prev => prev + 1);
  }, []);

  return (
    <FrameCard 
      title="51. FrameSVGNefrex" 
      color="#03a9f4"
      onReplay={() => setKey(prev => prev + 1)}
    >
      <div key={key} style={{ position: 'relative', width: '100%', height: 'clamp(150px, 30vw, 200px)' }}>
        <style>
          {`
            .frame-nefrex-animated svg [data-name=bg] {
              fill: rgba(3, 169, 244, 0.08) !important;
              filter: drop-shadow(0 0 8px rgba(3, 169, 244, 0.4)) !important;
            }
            .frame-nefrex-animated svg [data-name=line] {
              stroke: #03a9f4 !important;
              fill: none !important;
              stroke-width: 2 !important;
              filter: drop-shadow(0 0 8px rgba(3, 169, 244, 0.8)) !important;
            }
          `}
        </style>
        <div className="frame-nefrex-animated">
          <FrameSVGNefrex
            elementRef={svgRef}
            onRender={onRender}
            padding={4}
            strokeWidth={2}
            squareSize={32}
            smallLineLength={32}
            largeLineLength={128}
          />
        </div>
        <div style={{
          position: 'absolute',
          inset: 'clamp(30px, 8vw, 50px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <Text variant="body" style={{ 
            color: '#03a9f4', 
            marginBottom: '5px',
            fontWeight: 600,
            textShadow: '0 0 10px rgba(3, 169, 244, 0.8)',
            textTransform: 'uppercase',
            letterSpacing: 'clamp(1px, 0.3vw, 2px)',
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          }}>
            NEFREX
          </Text>
          <Text variant="caption" style={{ 
            opacity: 0.8, 
            color: '#03a9f4',
            fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Complex Style
          </Text>
        </div>
      </div>
    </FrameCard>
  );
};
