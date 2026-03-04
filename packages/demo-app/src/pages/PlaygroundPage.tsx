import React, { useState } from 'react';
import {
  Text, Stack, Button, HudButton, GlitchButton, Container, Input, HackerInput, Select, Checkbox, HoloCheckbox, Switch, Slider,
  Modal, Dialog, Tooltip, Popover, Dropdown, Table, Tabs, Accordion,
  Carousel, Stepper, DatePicker, ColorPicker, Radio, RadioGroup,
  Navbar, Sidebar, Breadcrumb, Menu, Pagination, Grid, CyberCard, GlitchProfileCard, HudBox, HudFrame,
  useNotification, NotificationProvider
} from '@rhuds/components';
import { ComponentPlayground } from '../components/ComponentPlayground';

const PlaygroundContent: React.FC = () => {
  const notification = useNotification();

  // States
  const [buttonVariant, setButtonVariant] = useState<'primary' | 'secondary' | 'success' | 'danger' | 'warning'>('primary');
  const [buttonText, setButtonText] = useState('Click Me');
  const [inputValue, setInputValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [holoCheckboxChecked, setHoloCheckboxChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#00f6ff');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState<string[]>(['item1']);
  const [currentStep, setCurrentStep] = useState(0);
  const [radioValue, setRadioValue] = useState('option1');
  const [hudBoxAnimated, setHudBoxAnimated] = useState(true);

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  ];

  return (
    <Container maxWidth="1400px" style={{ padding: '3rem 2rem' }}>
      <Text variant="h1" style={{ color: '#00f6ff', marginBottom: '1rem' }}>
        Interactive Playground
      </Text>
      <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '3rem' }}>
        Test and customize all components in real-time
      </Text>

      {/* Button */}
      <ComponentPlayground
        title="Button Component"
        description="Interactive buttons with multiple variants"
        code={`<Button variant="${buttonVariant}">${buttonText}</Button>`}
        props={[
          { name: 'variant', type: "'primary' | 'secondary' | 'success' | 'danger' | 'warning'", default: "'primary'", description: 'Button style variant' },
        ]}
      >
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', display: 'flex', justifyContent: 'center' }}>
              <Button variant={buttonVariant} onClick={() => notification.success('Clicked!')}>{buttonText}</Button>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Stack direction="column" gap="1rem">
              <Select label="Variant" value={buttonVariant} 
                onChange={(v: string | number) => setButtonVariant(String(v) as any)}
                options={[
                  { value: 'primary', label: 'Primary' },
                  { value: 'secondary', label: 'Secondary' },
                  { value: 'success', label: 'Success' },
                  { value: 'danger', label: 'Danger' },
                  { value: 'warning', label: 'Warning' },
                ]}
              />
              <Input label="Text" value={buttonText} onChange={(e: any) => setButtonText(e.target.value)} />
            </Stack>
          </div>
        </div>
      </ComponentPlayground>

      {/* HudButton */}
      <ComponentPlayground
        title="HudButton Component"
        description="Futuristic HUD-style button with glowing effects"
        code={`<HudButton>${buttonText}</HudButton>`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <HudButton onClick={() => notification.success('HUD Button Clicked!')}>I'M READY</HudButton>
          <HudButton onClick={() => notification.info('Launching...')}>LAUNCH</HudButton>
          <HudButton onClick={() => notification.success('Activated!')}>ACTIVATE</HudButton>
          <HudButton disabled>DISABLED</HudButton>
        </div>
      </ComponentPlayground>

      {/* GlitchButton */}
      <ComponentPlayground
        title="GlitchButton Component"
        description="Retro glitch-style button with VT323 monospace font"
        code={`<GlitchButton>// Hover me</GlitchButton>`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <GlitchButton onClick={() => notification.success('Glitch Button Clicked!')}>// Hover me</GlitchButton>
          <GlitchButton onClick={() => notification.info('Executing...')}>// Execute</GlitchButton>
          <GlitchButton onClick={() => notification.success('Running code!')}>// Run code</GlitchButton>
          <GlitchButton disabled>// Disabled</GlitchButton>
        </div>
      </ComponentPlayground>

      {/* Input */}
      <ComponentPlayground
        title="Input Component"
        description="Text input with validation"
        code={`<Input label="Username" placeholder="Enter username" />`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
          <Input label="Username" placeholder="Enter your username" value={inputValue} onChange={(e: any) => setInputValue(e.target.value)} />
        </div>
      </ComponentPlayground>

      {/* Modal & Dialog */}
      <ComponentPlayground
        title="Modal & Dialog"
        description="Overlay components with Portal rendering"
        code={`<Modal isOpen={isOpen} onClose={handleClose} title="Modal">Content</Modal>`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
          <Stack direction="row" gap="1rem">
            <Button variant="primary" onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Button variant="secondary" onClick={() => setDialogOpen(true)}>Open Dialog</Button>
          </Stack>
        </div>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Modal Title">
          <Text variant="body">This is a modal with Portal rendering!</Text>
        </Modal>
        <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} title="Confirm"
          actions={[
            { label: 'Cancel', onClick: () => setDialogOpen(false), variant: 'secondary' },
            { label: 'Confirm', onClick: () => { setDialogOpen(false); notification.success('Confirmed!'); }, variant: 'primary' },
          ]}
        >
          <Text variant="body">Are you sure?</Text>
        </Dialog>
      </ComponentPlayground>

      {/* Slider */}
      <ComponentPlayground
        title="Slider Component"
        description="Range slider"
        code={`<Slider value={${sliderValue}} onChange={setValue} />`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
          <Slider value={sliderValue} onChange={setSliderValue} min={0} max={100} step={1} />
          <Text variant="body" style={{ marginTop: '1rem', textAlign: 'center', color: '#00f6ff' }}>Value: {sliderValue}</Text>
        </div>
      </ComponentPlayground>

      {/* Checkbox & Switch */}
      <ComponentPlayground
        title="Checkbox & Switch"
        description="Toggle components"
        code={`<Checkbox checked={checked} onChange={setChecked} label="Accept" />`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
          <Stack direction="column" gap="1.5rem">
            <Checkbox checked={checkboxChecked} onChange={setCheckboxChecked} label="I accept terms" />
            <Switch checked={switchChecked} onChange={setSwitchChecked} label="Enable notifications" />
          </Stack>
        </div>
      </ComponentPlayground>

      {/* HoloCheckbox */}
      <ComponentPlayground
        title="HoloCheckbox (3D Holographic)"
        description="Futuristic holographic checkbox with 3D effects"
        code={`<HoloCheckbox checked={checked} onChange={setChecked} label="SYSTEM" />`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.9)', borderRadius: '8px', display: 'flex', justifyContent: 'center' }}>
          <HoloCheckbox checked={holoCheckboxChecked} onChange={setHoloCheckboxChecked} label="HOLOGRAPHIC SYSTEM" />
        </div>
      </ComponentPlayground>

      {/* Radio */}
      <ComponentPlayground
        title="Radio Component"
        description="Radio button group"
        code={`<RadioGroup value={value} onChange={setValue} options={options} />`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
          <RadioGroup 
            value={radioValue} 
            onChange={(v: string | number) => setRadioValue(String(v))}
            options={[
              { label: 'Option 1', value: 'option1' },
              { label: 'Option 2', value: 'option2' },
              { label: 'Option 3', value: 'option3' },
            ]}
          />
        </div>
      </ComponentPlayground>

      {/* Tabs */}
      <ComponentPlayground
        title="Tabs Component"
        description="Tabbed content"
        code={`<Tabs items={items} activeIndex={0} />`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
          <Tabs
            items={[
              { label: 'Overview', content: <Text variant="body">Overview content</Text> },
              { label: 'Details', content: <Text variant="body">Details content</Text> },
              { label: 'Settings', content: <Text variant="body">Settings content</Text> },
            ]}
            activeIndex={activeTab}
            onChange={setActiveTab}
            variant="line"
          />
        </div>
      </ComponentPlayground>

      {/* Table */}
      <ComponentPlayground
        title="Table Component"
        description="Data table with sorting"
        code={`<Table data={data} columns={columns} />`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
          <Table
            data={tableData}
            columns={[
              { key: 'name', label: 'Name', sortable: true },
              { key: 'email', label: 'Email', sortable: true },
              { key: 'role', label: 'Role' },
            ]}
            onRowClick={(row) => notification.info(`Clicked: ${row.name}`)}
          />
        </div>
      </ComponentPlayground>

      {/* Accordion */}
      <ComponentPlayground
        title="Accordion Component"
        description="Expandable sections"
        code={`<Accordion items={items} expandedItems={expanded} />`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
          <Accordion
            items={[
              { key: 'item1', title: 'Section 1', content: <Text variant="body">Content 1</Text> },
              { key: 'item2', title: 'Section 2', content: <Text variant="body">Content 2</Text> },
              { key: 'item3', title: 'Section 3', content: <Text variant="body">Content 3</Text> },
            ]}
            expandedItems={expandedAccordion}
            onExpand={(key) => {
              if (expandedAccordion.includes(key)) {
                setExpandedAccordion(expandedAccordion.filter(k => k !== key));
              } else {
                setExpandedAccordion([...expandedAccordion, key]);
              }
            }}
            allowMultiple
          />
        </div>
      </ComponentPlayground>

      {/* Stepper */}
      <ComponentPlayground
        title="Stepper Component"
        description="Step-by-step progress"
        code={`<Stepper steps={steps} currentStep={0} />`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
          <Stepper
            steps={[
              { key: 'step1', label: 'Account', description: 'Create account' },
              { key: 'step2', label: 'Profile', description: 'Setup profile' },
              { key: 'step3', label: 'Complete', description: 'Finish' },
            ]}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            orientation="horizontal"
          />
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button variant="secondary" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>Previous</Button>
            <Button variant="primary" onClick={() => setCurrentStep(Math.min(2, currentStep + 1))} disabled={currentStep === 2}>Next</Button>
          </div>
        </div>
      </ComponentPlayground>

      {/* Color & Date Pickers */}
      <ComponentPlayground
        title="Color & Date Pickers"
        description="Specialized inputs"
        code={`<ColorPicker value={color} onChange={setColor} />`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
          <Stack direction="column" gap="2rem">
            <div>
              <Text variant="h4" style={{ marginBottom: '1rem', color: '#00f6ff' }}>Color Picker</Text>
              <ColorPicker value={selectedColor} onChange={setSelectedColor} />
              <Text variant="body" style={{ marginTop: '1rem' }}>Selected: {selectedColor}</Text>
            </div>
            <div>
              <Text variant="h4" style={{ marginBottom: '1rem', color: '#00f6ff' }}>Date Picker</Text>
              <DatePicker value={selectedDate} onChange={setSelectedDate} />
              <Text variant="body" style={{ marginTop: '1rem' }}>Selected: {selectedDate?.toLocaleDateString() || 'None'}</Text>
            </div>
          </Stack>
        </div>
      </ComponentPlayground>

      {/* Utility Components */}
      <ComponentPlayground
        title="Utility Components"
        description="Tooltip, Popover, Dropdown"
        code={`<Tooltip content="Tooltip text"><Button>Hover</Button></Tooltip>`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
          <Stack direction="row" gap="1rem" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            <Tooltip content="This is a tooltip" position="top">
              <Button variant="secondary">Hover for Tooltip</Button>
            </Tooltip>
            <Popover content={<Text variant="body">Popover content</Text>} title="Popover" position="bottom">
              <Button variant="secondary">Click for Popover</Button>
            </Popover>
            <Dropdown
              items={[
                { key: 'item1', label: 'Profile', icon: '👤', onClick: () => notification.info('Profile') },
                { key: 'item2', label: 'Settings', icon: '⚙️', onClick: () => notification.info('Settings') },
                { key: 'divider1', label: '', divider: true },
                { key: 'item3', label: 'Logout', icon: '🚪', onClick: () => notification.info('Logout') },
              ]}
            >
              <Button variant="secondary">Open Menu</Button>
            </Dropdown>
          </Stack>
        </div>
      </ComponentPlayground>

      {/* Breadcrumb */}
      <ComponentPlayground
        title="Breadcrumb Component"
        description="Navigation breadcrumb"
        code={`<Breadcrumb items={items} />`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: 'Details', href: '/products/1' },
            ]}
          />
        </div>
      </ComponentPlayground>

      {/* Pagination */}
      <ComponentPlayground
        title="Pagination Component"
        description="Page navigation"
        code={`<Pagination total={100} perPage={10} currentPage={1} />`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
          <Pagination
            total={100}
            perPage={10}
            currentPage={1}
            onPageChange={(page) => notification.info(`Page ${page}`)}
          />
        </div>
      </ComponentPlayground>

      {/* Grid Layout */}
      <ComponentPlayground
        title="Grid Component"
        description="Responsive grid layout"
        code={`<Grid columns={3} gap="1rem">...</Grid>`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>
          <Grid columns={3} gap="1rem">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ padding: '2rem', background: 'rgba(0, 246, 255, 0.1)', borderRadius: '4px', textAlign: 'center' }}>
                <Text variant="body">Item {i}</Text>
              </div>
            ))}
          </Grid>
        </div>
      </ComponentPlayground>

      {/* CyberCard */}
      <ComponentPlayground
        title="CyberCard (HUD Style)"
        description="Futuristic card with glitch effects and animated borders"
        code={`<CyberCard title="PROFILE" footer="Social Links" />`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <CyberCard title="PROFILE" footer="Social Links" />
          <CyberCard title="CONTACT" footer="Connect" />
        </div>
      </ComponentPlayground>

      {/* GlitchProfileCard */}
      <ComponentPlayground
        title="GlitchProfileCard (GitHub Style)"
        description="GitHub-style profile card with glitch effects and hover animations"
        code={`<GlitchProfileCard
  username="octo_cat"
  title="UI DEVELOPER"
  repositories={128}
  followers="42k"
  githubUrl="https://github.com"
/>`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <GlitchProfileCard
            username="octo_cat"
            title="UI DEVELOPER"
            repositories={128}
            followers="42k"
            githubUrl="https://github.com"
          />
          <GlitchProfileCard
            username="cyber_dev"
            title="FULL STACK"
            repositories={256}
            followers="89k"
            githubUrl="https://github.com"
          />
        </div>
      </ComponentPlayground>

      {/* HudFrame */}
      <ComponentPlayground
        title="HudFrame (Complex Frame with Neon Lines)"
        description="Complex HUD frame with 18 decorative neon lines and title box"
        code={`<HudFrame
  header={{
    title: 'SYSTEM STATUS',
    description: 'Real-time monitoring',
    number: 1,
  }}
  color="#00f6ff"
>
  <div style={{ padding: '2rem' }}>
    Content here...
  </div>
</HudFrame>`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>
          <Stack direction="column" gap="2rem" style={{ alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '800px', height: '400px', position: 'relative' }}>
              <HudFrame
                header={{
                  title: 'SYSTEM STATUS',
                  description: 'Real-time system monitoring dashboard',
                  number: 1,
                }}
                color="#00f6ff"
              >
                <div style={{ padding: '2rem' }}>
                  <Text color="#00f6ff" variant="h3" style={{ marginBottom: '1rem' }}>
                    HUD FRAME DEMO
                  </Text>
                  <Text color="#ffffff" variant="body">
                    Complex HUD frame with 18 decorative neon lines around the edges.
                    Perfect for dashboards and monitoring interfaces.
                  </Text>
                </div>
              </HudFrame>
            </div>
            <div style={{ width: '100%', maxWidth: '800px', height: '400px', position: 'relative' }}>
              <HudFrame
                header={{
                  title: 'DATA ANALYSIS',
                  description: 'Analytics and metrics dashboard',
                  number: 2,
                }}
                color="#1BFD9C"
              >
                <div style={{ padding: '2rem' }}>
                  <Text color="#1BFD9C" variant="h3" style={{ marginBottom: '1rem' }}>
                    GREEN THEME
                  </Text>
                  <Text color="#ffffff" variant="body">
                    HudFrame supports custom colors for all neon lines and title box.
                    Includes animated glow effects.
                  </Text>
                </div>
              </HudFrame>
            </div>
          </Stack>
        </div>
      </ComponentPlayground>

      {/* HudBox */}
      <ComponentPlayground
        title="HudBox (Asymmetrical Container)"
        description="HUD-style box with 18 unique geometric shapes in different HUD colors"
        code={`<HudBox variant="octagon" color="#FF4500" animated={true}>Content</HudBox>
<HudBox variant="portrait-card" color="#7FFF00" animated={false}>Vertical</HudBox>
<HudBox variant="landscape-bar" color="#32CD32" animated={true}>Horizontal</HudBox>`}
      >
        <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <HudButton onClick={() => setHudBoxAnimated(!hudBoxAnimated)}>
              {hudBoxAnimated ? '⏸ Static Border' : '▶ Animated Border'}
            </HudButton>
            <Text color="#00f6ff">
              Mode: {hudBoxAnimated ? 'Animated' : 'Static'}
            </Text>
          </div>
          <Stack direction="column" gap="3rem">
            <div>
              <Text color="#00f6ff" style={{ marginBottom: '1rem' }}>Standard Variants:</Text>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <HudBox variant="compact" color="#00f6ff" animated={hudBoxAnimated}>
                  <Text color="#00f6ff">Compact</Text>
                </HudBox>
                <HudBox variant="default" color="#1BFD9C" animated={hudBoxAnimated}>
                  <Text color="#1BFD9C">Default</Text>
                </HudBox>
                <HudBox variant="wide" color="#FF6B9D" animated={hudBoxAnimated}>
                  <Text color="#FF6B9D">Wide</Text>
                </HudBox>
              </div>
            </div>
            
            <div>
              <Text color="#00f6ff" style={{ marginBottom: '1rem' }}>Geometric Variants:</Text>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <HudBox variant="hexagon" color="#FFD700" animated={hudBoxAnimated}>
                  <Text color="#FFD700">Hexagon</Text>
                </HudBox>
                <HudBox variant="octagon" color="#FF4500" animated={hudBoxAnimated}>
                  <Text color="#FF4500">Octagon</Text>
                </HudBox>
                <HudBox variant="diagonal" color="#9D00FF" animated={hudBoxAnimated}>
                  <Text color="#9D00FF">Diagonal</Text>
                </HudBox>
                <HudBox variant="corner-cut" color="#00FFFF" animated={hudBoxAnimated}>
                  <Text color="#00FFFF">Corner Cut</Text>
                </HudBox>
                <HudBox variant="tech-panel" color="#FF00FF" animated={hudBoxAnimated}>
                  <Text color="#FF00FF">Tech Panel</Text>
                </HudBox>
                <HudBox variant="arrow-right" color="#00FF00" animated={hudBoxAnimated}>
                  <Text color="#00FF00">Arrow →</Text>
                </HudBox>
                <HudBox variant="chevron" color="#FFA500" animated={hudBoxAnimated}>
                  <Text color="#FFA500">Chevron</Text>
                </HudBox>
              </div>
            </div>

            <div>
              <Text color="#00f6ff" style={{ marginBottom: '1rem' }}>Portrait Variants (Vertical):</Text>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <HudBox variant="portrait-tall" color="#00CED1" animated={hudBoxAnimated}>
                  <Text color="#00CED1" align="center">Portrait<br/>Tall<br/>400px</Text>
                </HudBox>
                <HudBox variant="portrait-slim" color="#FF1493" animated={hudBoxAnimated}>
                  <Text color="#FF1493" align="center">Portrait<br/>Slim<br/>350px</Text>
                </HudBox>
                <HudBox variant="portrait-card" color="#7FFF00" animated={hudBoxAnimated}>
                  <Text color="#7FFF00" align="center">Portrait<br/>Card<br/>380px</Text>
                </HudBox>
                <HudBox variant="portrait-banner" color="#FF69B4" animated={hudBoxAnimated}>
                  <Text color="#FF69B4" align="center">Portrait<br/>Banner<br/>320px</Text>
                </HudBox>
              </div>
            </div>

            <div>
              <Text color="#00f6ff" style={{ marginBottom: '1rem' }}>Landscape Variants (Horizontal):</Text>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', flexDirection: 'column', alignItems: 'center' }}>
                <HudBox variant="landscape-wide" color="#00BFFF" animated={hudBoxAnimated}>
                  <Text color="#00BFFF">Landscape Wide - 450px × 180px</Text>
                </HudBox>
                <HudBox variant="landscape-ultra" color="#FF6347" animated={hudBoxAnimated}>
                  <Text color="#FF6347">Landscape Ultra - 500px × 150px</Text>
                </HudBox>
                <HudBox variant="landscape-bar" color="#32CD32" animated={hudBoxAnimated}>
                  <Text color="#32CD32">Landscape Bar - 550px × 120px</Text>
                </HudBox>
                <HudBox variant="landscape-ribbon" color="#BA55D3" animated={hudBoxAnimated}>
                  <Text color="#BA55D3">Landscape Ribbon - 480px × 140px</Text>
                </HudBox>
              </div>
            </div>
          </Stack>
        </div>
      </ComponentPlayground>
    </Container>
  );
};

export const PlaygroundPage: React.FC = () => {
  return (
    <NotificationProvider>
      <PlaygroundContent />
    </NotificationProvider>
  );
};
