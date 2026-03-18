import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Text,
  Stack,
  Button,
  HudButton,
  GlitchButton,
  Container,
  Input,
  Select,
  Checkbox,
  HoloCheckbox,
  Switch,
  Slider,
  Modal,
  Dialog,
  Tooltip,
  Popover,
  Dropdown,
  Table,
  Tabs,
  Accordion,
  Stepper,
  DatePicker,
  ColorPicker,
  Pagination,
  Grid,
  CyberCard,
  GlitchProfileCard,
  AbstergoLoader,
  HeartRateLoader,
  HudBox,
  HudFrame,
  useNotification,
  NotificationProvider,
  AddFriendInput,
  VerificationCodeInput,
  AnimatedLoadingText,
  BinaryWaveLoader,
  Radio,
  Breadcrumb,
  Win95MediaPlayer,
  TubeAmplifier,
} from '@rhuds/components';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ComponentPlayground } from '../components/ComponentPlayground';
import { useContextMenu } from '../hooks/useContextMenu';
import { GlassContextMenu } from '../components/GlassContextMenu';
import { GeometricWrapper } from '../components/GeometricWrapper';

const PlaygroundContent: React.FC = () => {
  const notification = useNotification();
  const { position, visible, closeMenu, handleNavigation, handleCopyInstall } = useContextMenu();

  // States
  const [buttonVariant, setButtonVariant] = useState<
    'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  >('primary');
  const [buttonText, setButtonText] = useState('Click Me');
  const [inputValue, setInputValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [holoCheckboxChecked, setHoloCheckboxChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#29F2DF');
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
    <div
      style={{
        padding: 0,
        background: '#0A1225',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'auto',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <AnimatedBackground />

      <Container
        maxWidth="1400px"
        style={{ padding: '3rem 2rem', position: 'relative', zIndex: 10, marginTop: '70px' }}
      >
        <Text variant="h1" style={{ color: '#29F2DF', marginBottom: '1rem' }}>
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
            {
              name: 'variant',
              type: "'primary' | 'secondary' | 'success' | 'danger' | 'warning'",
              default: "'primary'",
              description: 'Button style variant',
            },
          ]}
        >
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <GeometricWrapper
                variant="cut-corners"
                color="#29F2DF"
                glowIntensity="low"
                style={{
                  padding: '2rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button variant={buttonVariant} onClick={() => notification.success('Clicked!')}>
                  {buttonText}
                </Button>
              </GeometricWrapper>
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Stack direction="column" gap="1rem">
                <Select
                  label="Variant"
                  value={buttonVariant}
                  onChange={(v: string | number) => setButtonVariant(String(v) as any)}
                  options={[
                    { value: 'primary', label: 'Primary' },
                    { value: 'secondary', label: 'Secondary' },
                    { value: 'success', label: 'Success' },
                    { value: 'danger', label: 'Danger' },
                    { value: 'warning', label: 'Warning' },
                  ]}
                />
                <Input
                  label="Text"
                  value={buttonText}
                  onChange={(e: any) => setButtonText(e.target.value)}
                />
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
          <div
            style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <HudButton onClick={() => notification.success('HUD Button Clicked!')}>
              I'M READY
            </HudButton>
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
          <div
            style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <GlitchButton onClick={() => notification.success('Glitch Button Clicked!')}>
              // Hover me
            </GlitchButton>
            <GlitchButton onClick={() => notification.info('Executing...')}>
              // Execute
            </GlitchButton>
            <GlitchButton onClick={() => notification.success('Running code!')}>
              // Run code
            </GlitchButton>
            <GlitchButton disabled>// Disabled</GlitchButton>
          </div>
        </ComponentPlayground>

        {/* Input */}
        <ComponentPlayground
          title="Input Component"
          description="Text input with validation"
          code={`<Input label="Username" placeholder="Enter username" />`}
        >
          <GeometricWrapper
            variant="angled"
            color="#29F2DF"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <Input
              label="Username"
              placeholder="Enter your username"
              value={inputValue}
              onChange={(e: any) => setInputValue(e.target.value)}
            />
          </GeometricWrapper>
        </ComponentPlayground>

        {/* AddFriendInput */}
        <ComponentPlayground
          title="AddFriendInput Component"
          description="Friend code input with animated verification"
          code={`<AddFriendInput title="Add Friend" />`}
        >
          <GeometricWrapper
            variant="angled"
            color="#a974ff"
            style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <AddFriendInput
              title="Add Friend"
              primaryColor="rgb(169, 116, 255)"
              backgroundColor="rgb(36, 34, 39)"
            />
          </GeometricWrapper>
        </ComponentPlayground>

        {/* VerificationCodeInput */}
        <ComponentPlayground
          title="VerificationCodeInput Component"
          description="6-digit code verification with paste support"
          code={`<VerificationCodeInput length={6} />`}
        >
          <GeometricWrapper
            variant="angled"
            color="#00ff88"
            style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <VerificationCodeInput
              length={6}
              primaryColor="rgb(0, 255, 136)"
              backgroundColor="rgb(15, 15, 25)"
              title="Enter Code"
            />
          </GeometricWrapper>
        </ComponentPlayground>

        {/* Modal & Dialog */}
        <ComponentPlayground
          title="Modal & Dialog"
          description="Overlay components with Portal rendering"
          code={`<Modal isOpen={isOpen} onClose={handleClose} title="Modal">Content</Modal>`}
        >
          <GeometricWrapper
            variant="notched"
            color="#29F2DF"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <Stack direction="row" gap="1rem">
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Open Modal
              </Button>
              <Button variant="secondary" onClick={() => setDialogOpen(true)}>
                Open Dialog
              </Button>
            </Stack>
          </GeometricWrapper>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Modal Title">
            <Text variant="body">This is a modal with Portal rendering!</Text>
          </Modal>
          <Dialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            title="Confirm"
            actions={[
              { label: 'Cancel', onClick: () => setDialogOpen(false), variant: 'secondary' },
              {
                label: 'Confirm',
                onClick: () => {
                  setDialogOpen(false);
                  notification.success('Confirmed!');
                },
                variant: 'primary',
              },
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
          <GeometricWrapper
            variant="complex"
            color="#29F2DF"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <Slider value={sliderValue} onChange={setSliderValue} min={0} max={100} step={1} />
            <Text
              variant="body"
              style={{ marginTop: '1rem', textAlign: 'center', color: '#29F2DF' }}
            >
              Value: {sliderValue}
            </Text>
          </GeometricWrapper>
        </ComponentPlayground>

        {/* Checkbox & Switch */}
        <ComponentPlayground
          title="Checkbox & Switch"
          description="Toggle components"
          code={`<Checkbox checked={checked} onChange={setChecked} label="Accept" />`}
        >
          <GeometricWrapper
            variant="cut-corners"
            color="#EF3EF1"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <Stack direction="column" gap="1.5rem">
              <Checkbox
                checked={checkboxChecked}
                onChange={setCheckboxChecked}
                label="I accept terms"
              />
              <Switch
                checked={switchChecked}
                onChange={setSwitchChecked}
                label="Enable notifications"
              />
            </Stack>
          </GeometricWrapper>
        </ComponentPlayground>

        {/* HoloCheckbox */}
        <ComponentPlayground
          title="HoloCheckbox (3D Holographic)"
          description="Futuristic holographic checkbox with 3D effects"
          code={`<HoloCheckbox checked={checked} onChange={setChecked} label="SYSTEM" />`}
        >
          <GeometricWrapper
            variant="angled"
            color="#29F2DF"
            glowIntensity="medium"
            style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <HoloCheckbox
              checked={holoCheckboxChecked}
              onChange={setHoloCheckboxChecked}
              label="HOLOGRAPHIC SYSTEM"
            />
          </GeometricWrapper>
        </ComponentPlayground>

        {/* Radio */}
        <ComponentPlayground
          title="Radio Component"
          description="Radio button group"
          code={`<Radio options={options} onChange={setValue} />`}
        >
          <GeometricWrapper
            variant="notched"
            color="#4CC9F0"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <Radio
              defaultValue="option1"
              onChange={(v: string) => setRadioValue(v)}
              options={[
                { id: 'option1', label: 'Option 1' },
                { id: 'option2', label: 'Option 2' },
                { id: 'option3', label: 'Option 3' },
              ]}
            />
          </GeometricWrapper>
        </ComponentPlayground>

        {/* Tabs */}
        <ComponentPlayground
          title="Tabs Component"
          description="Tabbed content"
          code={`<Tabs items={items} activeIndex={0} />`}
        >
          <GeometricWrapper
            variant="complex"
            color="#29F2DF"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
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
          </GeometricWrapper>
        </ComponentPlayground>

        {/* Table */}
        <ComponentPlayground
          title="Table Component"
          description="Data table with sorting"
          code={`<Table data={data} columns={columns} />`}
        >
          <GeometricWrapper
            variant="angled"
            color="#EF3EF1"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <Table
              data={tableData}
              columns={[
                { key: 'name', label: 'Name', sortable: true },
                { key: 'email', label: 'Email', sortable: true },
                { key: 'role', label: 'Role' },
              ]}
              onRowClick={(row) => notification.info(`Clicked: ${row.name}`)}
            />
          </GeometricWrapper>
        </ComponentPlayground>

        {/* Accordion */}
        <ComponentPlayground
          title="Accordion Component"
          description="Expandable sections"
          code={`<Accordion items={items} expandedItems={expanded} />`}
        >
          <GeometricWrapper
            variant="cut-corners"
            color="#4CC9F0"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <Accordion
              items={[
                {
                  key: 'item1',
                  title: 'Section 1',
                  content: <Text variant="body">Content 1</Text>,
                },
                {
                  key: 'item2',
                  title: 'Section 2',
                  content: <Text variant="body">Content 2</Text>,
                },
                {
                  key: 'item3',
                  title: 'Section 3',
                  content: <Text variant="body">Content 3</Text>,
                },
              ]}
              expandedItems={expandedAccordion}
              onExpand={(key) => {
                if (expandedAccordion.includes(key)) {
                  setExpandedAccordion(expandedAccordion.filter((k) => k !== key));
                } else {
                  setExpandedAccordion([...expandedAccordion, key]);
                }
              }}
              allowMultiple
            />
          </GeometricWrapper>
        </ComponentPlayground>

        {/* Stepper */}
        <ComponentPlayground
          title="Stepper Component"
          description="Step-by-step progress"
          code={`<Stepper steps={steps} currentStep={0} />`}
        >
          <GeometricWrapper
            variant="notched"
            color="#4CC9F0"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
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
            <div
              style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}
            >
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(Math.min(2, currentStep + 1))}
                disabled={currentStep === 2}
              >
                Next
              </Button>
            </div>
          </GeometricWrapper>
        </ComponentPlayground>

        {/* Color & Date Pickers */}
        <ComponentPlayground
          title="Color & Date Pickers"
          description="Specialized inputs"
          code={`<ColorPicker value={color} onChange={setColor} />`}
        >
          <GeometricWrapper
            variant="complex"
            color="#EF3EF1"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <Stack direction="column" gap="2rem">
              <div>
                <Text variant="h4" style={{ marginBottom: '1rem', color: '#29F2DF' }}>
                  Color Picker
                </Text>
                <ColorPicker value={selectedColor} onChange={setSelectedColor} />
                <Text variant="body" style={{ marginTop: '1rem' }}>
                  Selected: {selectedColor}
                </Text>
              </div>
              <div>
                <Text variant="h4" style={{ marginBottom: '1rem', color: '#29F2DF' }}>
                  Date Picker
                </Text>
                <DatePicker value={selectedDate} onChange={setSelectedDate} />
                <Text variant="body" style={{ marginTop: '1rem' }}>
                  Selected: {selectedDate?.toLocaleDateString() || 'None'}
                </Text>
              </div>
            </Stack>
          </GeometricWrapper>
        </ComponentPlayground>

        {/* Utility Components */}
        <ComponentPlayground
          title="Utility Components"
          description="Tooltip, Popover, Dropdown"
          code={`<Tooltip content="Tooltip text"><Button>Hover</Button></Tooltip>`}
        >
          <GeometricWrapper
            variant="angled"
            color="#29F2DF"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <Stack
              direction="row"
              gap="1rem"
              style={{ justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Tooltip content="This is a tooltip" position="top">
                <Button variant="secondary">Hover for Tooltip</Button>
              </Tooltip>
              <Popover
                content={<Text variant="body">Popover content</Text>}
                title="Popover"
                position="bottom"
              >
                <Button variant="secondary">Click for Popover</Button>
              </Popover>
              <Dropdown
                items={[
                  {
                    key: 'item1',
                    label: 'Profile',
                    icon: '👤',
                    onClick: () => notification.info('Profile'),
                  },
                  {
                    key: 'item2',
                    label: 'Settings',
                    icon: '⚙️',
                    onClick: () => notification.info('Settings'),
                  },
                  { key: 'divider1', label: '', divider: true },
                  {
                    key: 'item3',
                    label: 'Logout',
                    icon: '🚪',
                    onClick: () => notification.info('Logout'),
                  },
                ]}
              >
                <Button variant="secondary">Open Menu</Button>
              </Dropdown>
            </Stack>
          </GeometricWrapper>
        </ComponentPlayground>

        {/* Breadcrumb */}
        <ComponentPlayground
          title="Breadcrumb Component"
          description="Navigation breadcrumb"
          code={`<Breadcrumb items={items} />`}
        >
          <GeometricWrapper
            variant="cut-corners"
            color="#4CC9F0"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'Details', href: '/products/1' },
              ]}
            />
          </GeometricWrapper>
        </ComponentPlayground>

        {/* Pagination */}
        <ComponentPlayground
          title="Pagination Component"
          description="Page navigation"
          code={`<Pagination total={100} perPage={10} currentPage={1} />`}
        >
          <GeometricWrapper
            variant="notched"
            color="#29F2DF"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <Pagination
              total={100}
              perPage={10}
              currentPage={1}
              onPageChange={(page) => notification.info(`Page ${page}`)}
            />
          </GeometricWrapper>
        </ComponentPlayground>

        {/* Grid Layout */}
        <ComponentPlayground
          title="Grid Component"
          description="Responsive grid layout"
          code={`<Grid columns={3} gap="1rem">...</Grid>`}
        >
          <GeometricWrapper
            variant="complex"
            color="#EF3EF1"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <Grid columns={3} gap="1rem">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    padding: '2rem',
                    background: 'rgba(41, 242, 223, 0.1)',
                    borderRadius: '4px',
                    textAlign: 'center',
                  }}
                >
                  <Text variant="body">Item {i}</Text>
                </div>
              ))}
            </Grid>
          </GeometricWrapper>
        </ComponentPlayground>

        {/* CyberCard */}
        <ComponentPlayground
          title="CyberCard (HUD Style)"
          description="Futuristic card with glitch effects and animated borders"
          code={`<CyberCard title="PROFILE" footer="Social Links" />`}
        >
          <div
            style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
            }}
          >
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
          <div
            style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
            }}
          >
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
  color="#29F2DF"
>
  <div style={{ padding: '2rem' }}>
    Content here...
  </div>
</HudFrame>`}
        >
          <GeometricWrapper
            variant="complex"
            color="#29F2DF"
            glowIntensity="medium"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.5)' }}
          >
            <Stack direction="column" gap="2rem" style={{ alignItems: 'center' }}>
              <div
                style={{ width: '100%', maxWidth: '800px', height: '400px', position: 'relative' }}
              >
                <HudFrame
                  header={{
                    title: 'SYSTEM STATUS',
                    description: 'Real-time system monitoring dashboard',
                    number: 1,
                  }}
                  color="#29F2DF"
                >
                  <div style={{ padding: '2rem' }}>
                    <Text color="#29F2DF" variant="h3" style={{ marginBottom: '1rem' }}>
                      HUD FRAME DEMO
                    </Text>
                    <Text color="#ffffff" variant="body">
                      Complex HUD frame with 18 decorative neon lines around the edges. Perfect for
                      dashboards and monitoring interfaces.
                    </Text>
                  </div>
                </HudFrame>
              </div>
              <div
                style={{ width: '100%', maxWidth: '800px', height: '400px', position: 'relative' }}
              >
                <HudFrame
                  header={{
                    title: 'DATA ANALYSIS',
                    description: 'Analytics and metrics dashboard',
                    number: 2,
                  }}
                  color="#29F2DF"
                >
                  <div style={{ padding: '2rem' }}>
                    <Text color="#29F2DF" variant="h3" style={{ marginBottom: '1rem' }}>
                      GREEN THEME
                    </Text>
                    <Text color="#ffffff" variant="body">
                      HudFrame supports custom colors for all neon lines and title box. Includes
                      animated glow effects.
                    </Text>
                  </div>
                </HudFrame>
              </div>
            </Stack>
          </GeometricWrapper>
        </ComponentPlayground>

        {/* Win95MediaPlayer */}
        <ComponentPlayground
          title="Win95MediaPlayer (Retro Media Player)"
          description="Nostalgic Windows 95-style media player UI"
          code={`<Win95MediaPlayer
  trackName="track_01.wav"
  currentTime="00:42"
  totalDuration="03:17"
  progress={21}
  volume={75}
  isPlaying={false}
/>`}
        >
          <div
            style={{
              padding: '2rem',
              background: '#c0c0c0',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <Win95MediaPlayer
              trackName="track_01.wav"
              currentTime="00:42"
              totalDuration="03:17"
              progress={21}
              volume={75}
              isPlaying={false}
            />
            <Win95MediaPlayer
              trackName="synthwave.wav"
              currentTime="02:15"
              totalDuration="05:30"
              progress={42}
              volume={85}
              isPlaying={true}
            />
          </div>
        </ComponentPlayground>

        {/* TubeAmplifier */}
        <ComponentPlayground
          title="TubeAmplifier (Vintage Audio Equipment)"
          description="Realistic tube amplifier UI with animated vacuum tubes and VU meters"
          code={`<TubeAmplifier
  brandName="FIDELITY 900"
  isPowered={true}
  leftChannelLevel={65}
  rightChannelLevel={70}
  volume={75}
  tone={60}
/>`}
        >
          <div
            style={{
              padding: '2rem',
              background: '#050505',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <TubeAmplifier
              brandName="FIDELITY 900"
              isPowered={true}
              leftChannelLevel={65}
              rightChannelLevel={70}
              volume={75}
              tone={60}
            />
            <TubeAmplifier
              brandName="VINTAGE PRO"
              isPowered={false}
              leftChannelLevel={0}
              rightChannelLevel={0}
              volume={50}
              tone={50}
            />
          </div>
        </ComponentPlayground>

        {/* Loader Components */}
        <ComponentPlayground
          title="Loader Components"
          description="Animated loaders with different styles"
          code={`<AbstergoLoader text="Loading" size={1} />
<HeartRateLoader color="#29F2DF" width={400} height={150} />`}
        >
          <GeometricWrapper
            variant="angled"
            color="#EF3EF1"
            glowIntensity="medium"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.5)' }}
          >
            <Stack direction="column" gap="3rem">
              <div>
                <Text variant="h4" style={{ marginBottom: '1rem', color: '#29F2DF' }}>
                  AbstergoLoader (Triangular Animation)
                </Text>
                <div
                  style={{
                    display: 'flex',
                    gap: '3rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    padding: '2rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                  }}
                >
                  <AbstergoLoader text="Loading" size={0.8} />
                  <AbstergoLoader text="Synchronization" size={1} />
                  <AbstergoLoader text="Processing" size={1.2} />
                </div>
              </div>
              <div>
                <Text variant="h4" style={{ marginBottom: '1rem', color: '#29F2DF' }}>
                  HeartRateLoader (ECG Animation)
                </Text>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    alignItems: 'center',
                    padding: '2rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                  }}
                >
                  <HeartRateLoader color="#EF3EF1" width={550} height={210} />
                  <HeartRateLoader color="#29F2DF" width={400} height={150} />
                  <HeartRateLoader color="#29F2DF" width={300} height={120} />
                </div>
              </div>
            </Stack>
          </GeometricWrapper>
        </ComponentPlayground>

        {/* HudBox */}
        <ComponentPlayground
          title="HudBox (Asymmetrical Container)"
          description="HUD-style box with 18 unique geometric shapes in different HUD colors"
          code={`<HudBox variant="octagon" color="#EF3EF1" animated={true}>Content</HudBox>
<HudBox variant="portrait-card" color="#1C7FA6" animated={false}>Vertical</HudBox>
<HudBox variant="landscape-bar" color="#1C7FA6" animated={true}>Horizontal</HudBox>`}
        >
          <div style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>
            <div
              style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <HudButton onClick={() => setHudBoxAnimated(!hudBoxAnimated)}>
                {hudBoxAnimated ? '⏸ Static Border' : '▶ Animated Border'}
              </HudButton>
              <Text color="#29F2DF">Mode: {hudBoxAnimated ? 'Animated' : 'Static'}</Text>
            </div>
            <Stack direction="column" gap="3rem">
              <div>
                <Text color="#29F2DF" style={{ marginBottom: '1rem' }}>
                  Standard Variants:
                </Text>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <HudBox variant="compact" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF">Compact</Text>
                  </HudBox>
                  <HudBox variant="default" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF">Default</Text>
                  </HudBox>
                  <HudBox variant="wide" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF">Wide</Text>
                  </HudBox>
                </div>
              </div>

              <div>
                <Text color="#29F2DF" style={{ marginBottom: '1rem' }}>
                  Geometric Variants:
                </Text>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <HudBox variant="hexagon" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF">Hexagon</Text>
                  </HudBox>
                  <HudBox variant="octagon" color="#EF3EF1" animated={hudBoxAnimated}>
                    <Text color="#EF3EF1">Octagon</Text>
                  </HudBox>
                  <HudBox variant="diagonal" color="#1C7FA6" animated={hudBoxAnimated}>
                    <Text color="#1C7FA6">Diagonal</Text>
                  </HudBox>
                  <HudBox variant="corner-cut" color="#28125A" animated={hudBoxAnimated}>
                    <Text color="#28125A">Corner Cut</Text>
                  </HudBox>
                  <HudBox variant="tech-panel" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF">Tech Panel</Text>
                  </HudBox>
                  <HudBox variant="arrow-right" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF">Arrow →</Text>
                  </HudBox>
                  <HudBox variant="chevron" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF">Chevron</Text>
                  </HudBox>
                </div>
              </div>

              <div>
                <Text color="#29F2DF" style={{ marginBottom: '1rem' }}>
                  Portrait Variants (Vertical):
                </Text>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <HudBox variant="portrait-tall" color="#28125A" animated={hudBoxAnimated}>
                    <Text color="#28125A" align="center">
                      Portrait
                      <br />
                      Tall
                      <br />
                      400px
                    </Text>
                  </HudBox>
                  <HudBox variant="portrait-slim" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF" align="center">
                      Portrait
                      <br />
                      Slim
                      <br />
                      350px
                    </Text>
                  </HudBox>
                  <HudBox variant="portrait-card" color="#1C7FA6" animated={hudBoxAnimated}>
                    <Text color="#1C7FA6" align="center">
                      Portrait
                      <br />
                      Card
                      <br />
                      380px
                    </Text>
                  </HudBox>
                  <HudBox variant="portrait-banner" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF" align="center">
                      Portrait
                      <br />
                      Banner
                      <br />
                      320px
                    </Text>
                  </HudBox>
                </div>
              </div>

              <div>
                <Text color="#29F2DF" style={{ marginBottom: '1rem' }}>
                  Landscape Variants (Horizontal):
                </Text>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <HudBox variant="landscape-wide" color="#28125A" animated={hudBoxAnimated}>
                    <Text color="#28125A">Landscape Wide - 450px × 180px</Text>
                  </HudBox>
                  <HudBox variant="landscape-ultra" color="#EF3EF1" animated={hudBoxAnimated}>
                    <Text color="#EF3EF1">Landscape Ultra - 500px × 150px</Text>
                  </HudBox>
                  <HudBox variant="landscape-bar" color="#1C7FA6" animated={hudBoxAnimated}>
                    <Text color="#1C7FA6">Landscape Bar - 550px × 120px</Text>
                  </HudBox>
                  <HudBox variant="landscape-ribbon" color="#1C7FA6" animated={hudBoxAnimated}>
                    <Text color="#1C7FA6">Landscape Ribbon - 480px × 140px</Text>
                  </HudBox>
                </div>
              </div>
            </Stack>
          </div>
        </ComponentPlayground>
      </Container>
      {visible && position && (
        <GlassContextMenu
          x={position.x}
          y={position.y}
          onClose={closeMenu}
          onNavigate={handleNavigation}
          onCopyInstall={handleCopyInstall}
        />
      )}
    </div>
  );
};

export const PlaygroundPage: React.FC = () => {
  return (
    <NotificationProvider>
      <PlaygroundContent />
    </NotificationProvider>
  );
};
