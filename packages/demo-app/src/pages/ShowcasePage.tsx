import React, { useState, useRef, useEffect } from 'react';
import { useTheme, useTimeout } from '@rhuds/core';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { useContextMenu } from '../hooks/useContextMenu';
import { GlassContextMenu } from '../components/GlassContextMenu';
import { ColdWarButton, ColdWarInput, ColdWarCard } from '@rhuds/components';
import { RhudsBubbleChartStyled } from '../../../components/src/Visualization';
import '../styles/cold-war-theme.css';
import {
  Text,
  Button,
  HudButton,
  GlitchButton,
  NeonHoverButton,
  GridPatternButton,
  FingerprintButton,
  GlitchHoverButton,
  SkewedSliderButton,
  CyberSubscribeButton,
  NeonBorderButton,
  Icon,
  Input,
  HackerInput,
  AiHudInput,
  HoloGlitchInput,
  HoloInput,
  FuturisticInput,
  BashInput,
  GradientSearchInput,
  FloatingLabelInput,
  AddFriendInput,
  VerificationCodeInput,
  AnimatedLoadingText,
  BinaryWaveLoader,
  Select,
  Grid,
  Stack,
  HudBox,
  HudFrame,
  GlitchFrame,
  Checkbox,
  HoloCheckbox,
  CyberpunkCheckbox,
  BubbleCheckbox,
  NeonCheckbox,
  GlowingNeonCheckbox,
  Radio,
  Switch,
  Tabs,
  Pagination,
  Table,
  Modal,
  Dialog,
  Notification,
  GradientAlert,
  useHudToast,
  Tooltip,
  Popover,
  Dropdown,
  CyberSupportTooltip,
  Accordion,
  Stepper,
  Carousel,
  Slider,
  DatePicker,
  ColorPicker,
  FileUpload,
  Chart,
  DataGrid,
  Tree,
  CyberCard,
  GlassCard,
  ThermostatCard,
  GlitchProfileCard,
  TerminalThemeSelector,
  NotificationCard,
  HudNotificationCard,
  Win95MediaPlayer,
  RadarHud,
  PipBoy,
  AbstergoLoader,
  HeartRateLoader,
  HackerLoader,
  BinaryLoader,
  Cube3DLoader,
  InteractiveProgressLoader,
  HackerLoaderBinary,
  ProgressLoader,
  AIMatrixLoader,
  ScrollingTextLoader,
  CyberpunkAccessInput,
  GlitchRadio,
  CyberpunkRadio,
  Sidebar,
  Breadcrumb,
  Menu,
  CodeEditor,
  RichTextEditor,
  GlitchLoginForm,
  CyberLoginForm,
  NeonRadio,
  ToggleSwitch,
  CyberpunkToggle,
  LockSwitch,
  NeonSlider,
  HudTableBasic,
  HudTableBorderless,
  HudTableHoverable,
  HudTableStriped,
  HudTableDark,
  HudTableBordered,
  HudTableContextual,
  HudTableCaption,
  HudTableSmall,
  HudTableResponsive,
  HudInput,
  HudTextarea,
  HudSelect,
  HudRange,
  HudCheckbox,
  HudRadio,
  HudSwitch,
  HudFile,
  HudFormGrid,
  HudFormHelpText,
  HudInputGroup,
  HudFormFeedback,
  HudInputValidated,
  HudSelectValidated,
  HudTextareaValidated,
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
  RainPattern,
  CircuitPattern,
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
  const { showToast } = useHudToast();
  const { position, visible, closeMenu, handleNavigation, handleCopyInstall } = useContextMenu();
  const [activeTab, setActiveTab] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);

  // Use scroll to top hook
  useScrollToTop();

  // Ensure scroll to top on mount and when tab changes
  const [shouldScroll, setShouldScroll] = useState(true);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  useTimeout(
    () => {
      scrollToTop();
    },
    shouldScroll ? 50 : null
  );

  useTimeout(
    () => {
      scrollToTop();
    },
    shouldScroll ? 150 : null
  );

  useTimeout(
    () => {
      scrollToTop();
      setShouldScroll(false);
    },
    shouldScroll ? 300 : null
  );

  useEffect(() => {
    setShouldScroll(true);
  }, [activeTab]);

  // Additional effect to ensure scroll to top on component mount
  const [shouldScrollOnMount, setShouldScrollOnMount] = useState(true);

  useTimeout(
    () => {
      scrollToTop();
    },
    shouldScrollOnMount ? 50 : null
  );

  useTimeout(
    () => {
      scrollToTop();
    },
    shouldScrollOnMount ? 150 : null
  );

  useTimeout(
    () => {
      scrollToTop();
      setShouldScrollOnMount(false);
    },
    shouldScrollOnMount ? 300 : null
  );

  // Prevent auto-focus from causing scroll
  const [shouldBlur, setShouldBlur] = useState(true);

  const blurFocused = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  useTimeout(
    () => {
      blurFocused();
    },
    shouldBlur ? 50 : null
  );

  useTimeout(
    () => {
      blurFocused();
      setShouldBlur(false);
    },
    shouldBlur ? 150 : null
  );

  useEffect(() => {
    blurFocused();
    setShouldBlur(true);
  }, [activeTab]);

  // Force scroll to top and prevent any scrolling for first 1 second
  useEffect(() => {
    const startTime = Date.now();

    const forceScrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Prevent scroll events
    const preventScroll = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) {
        forceScrollToTop();
      }
    };

    forceScrollToTop();
    window.addEventListener('scroll', preventScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', preventScroll);
    };
  }, [activeTab]);

  // Form states
  const [inputValue, setInputValue] = useState('');
  const [bashInputValue, setBashInputValue] = useState('');
  const [gradientSearchValue, setGradientSearchValue] = useState('');
  const [floatingLabelValue, setFloatingLabelValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [holoCheckboxValue, setHoloCheckboxValue] = useState(false);
  const [cyberpunkCheckboxValue, setCyberpunkCheckboxValue] = useState(false);
  const [bubbleCheckboxValue, setBubbleCheckboxValue] = useState(false);
  const [neonCheckboxValue, setNeonCheckboxValue] = useState(false);
  const [glowingNeonCheckboxValue, setGlowingNeonCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [glitchRadioValue, setGlitchRadioValue] = useState('tcp');
  const [cyberpunkRadioValue, setCyberpunkRadioValue] = useState('1');
  const [switchValue, setSwitchValue] = useState(false);
  const [toggleSwitchValue, setToggleSwitchValue] = useState(false);
  const [cyberpunkToggleValue, setCyberpunkToggleValue] = useState(false);
  const [lockSwitchValue, setLockSwitchValue] = useState(false);
  const [neonSliderValue, setNeonSliderValue] = useState(50);
  const [sliderValue, setSliderValue] = useState(50);
  const [colorValue, setColorValue] = useState('#29F2DF');
  const [dateValue, setDateValue] = useState(new Date());
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [thermostatTemp, setThermostatTemp] = useState(70);
  const [terminalTheme, setTerminalTheme] = useState('green');
  const [hudBoxAnimated, setHudBoxAnimated] = useState(true);

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
        {
          key: '1-2',
          id: '1-2',
          label: 'Child 2',
          children: [{ key: '1-2-1', id: '1-2-1', label: 'Grandchild' }],
        },
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
      label: 'Buttons & Text',
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
            <Stack direction="row" gap="1rem" style={{ flexWrap: 'wrap' }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
            </Stack>
            <div style={{ marginTop: '1rem' }}>
              <Text
                variant="caption"
                style={{ display: 'block', marginBottom: '0.5rem', color: '#29F2DF' }}
              >
                HUD Button Style:
              </Text>
              <Stack direction="row" gap="1rem" style={{ flexWrap: 'wrap' }}>
                <HudButton>I'M READY</HudButton>
                <HudButton>LAUNCH</HudButton>
                <HudButton>ACTIVATE</HudButton>
              </Stack>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Text
                variant="caption"
                style={{ display: 'block', marginBottom: '0.5rem', color: '#29F2DF' }}
              >
                Glitch Button Style:
              </Text>
              <Stack direction="row" gap="1rem" style={{ flexWrap: 'wrap' }}>
                <GlitchButton>// Hover me</GlitchButton>
                <GlitchButton>// Execute</GlitchButton>
                <GlitchButton>// Run code</GlitchButton>
              </Stack>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Text
                variant="caption"
                style={{ display: 'block', marginBottom: '0.5rem', color: '#29F2DF' }}
              >
                Neon Hover Button Style:
              </Text>
              <Stack direction="row" gap="2rem" style={{ flexWrap: 'wrap' }}>
                <NeonHoverButton text="Hover Me" animationColor="#37FF8B" />
                <NeonHoverButton text="Click Me" animationColor="#00D9FF" />
                <NeonHoverButton text="Neon" animationColor="#FF00FF" />
              </Stack>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Text
                variant="caption"
                style={{ display: 'block', marginBottom: '0.5rem', color: '#29F2DF' }}
              >
                Grid Pattern Button Style:
              </Text>
              <Stack direction="row" gap="1rem" style={{ flexWrap: 'wrap' }}>
                <GridPatternButton color="#00ffff">Cyan</GridPatternButton>
                <GridPatternButton color="#ff00ff">Magenta</GridPatternButton>
                <GridPatternButton color="#00ff88">Green</GridPatternButton>
                <GridPatternButton color="#ffff00" hueRotate={45}>
                  Yellow
                </GridPatternButton>
              </Stack>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Text
                variant="caption"
                style={{ display: 'block', marginBottom: '0.5rem', color: '#29F2DF' }}
              >
                Fingerprint Button Style:
              </Text>
              <Stack direction="row" gap="2rem" style={{ flexWrap: 'wrap' }}>
                <FingerprintButton color="#00ff00" onClick={() => console.log('Green scanned')} />
                <FingerprintButton color="#00ffff" onClick={() => console.log('Cyan scanned')} />
                <FingerprintButton color="#ff00ff" onClick={() => console.log('Magenta scanned')} />
                <FingerprintButton color="#ffff00" onClick={() => console.log('Yellow scanned')} />
              </Stack>
            </div>
          </ComponentSection>
          <ComponentSection title="3c. GlitchHoverButton (Glitch Effect)">
            <Stack direction="column" gap="2rem" style={{ alignItems: 'center' }}>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#ff013c' }}
                >
                  Glitch Hover Effect:
                </Text>
                <GlitchHoverButton onClick={() => console.log('Glitch button clicked')}>
                  HOVER ME
                </GlitchHoverButton>
              </div>
            </Stack>
          </ComponentSection>
          <ComponentSection title="3d. SkewedSliderButton (Skewed Slider)">
            <Stack direction="column" gap="2rem" style={{ alignItems: 'center' }}>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#ff4655' }}
                >
                  Red Slider:
                </Text>
                <SkewedSliderButton onClick={() => console.log('Download clicked')}>
                  Download Now
                </SkewedSliderButton>
              </div>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#00ffff' }}
                >
                  Cyan Slider:
                </Text>
                <SkewedSliderButton
                  sliderColor="#00ffff"
                  onClick={() => console.log('Download clicked')}
                >
                  Download Now
                </SkewedSliderButton>
              </div>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#00ff88' }}
                >
                  Green Slider:
                </Text>
                <SkewedSliderButton
                  sliderColor="#00ff88"
                  onClick={() => console.log('Download clicked')}
                >
                  Download Now
                </SkewedSliderButton>
              </div>
            </Stack>
          </ComponentSection>
          <ComponentSection title="3e. CyberSubscribeButton (Cyber Subscribe)">
            <Stack
              direction="row"
              gap="2rem"
              style={{ flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <CyberSubscribeButton onClick={() => console.log('Subscribed')}>
                Subscribe
              </CyberSubscribeButton>
              <CyberSubscribeButton color="#00ffff" onClick={() => console.log('Subscribed')}>
                Subscribe
              </CyberSubscribeButton>
              <CyberSubscribeButton color="#00ff88" onClick={() => console.log('Subscribed')}>
                Subscribe
              </CyberSubscribeButton>
              <CyberSubscribeButton color="#ffff00" onClick={() => console.log('Subscribed')}>
                Subscribe
              </CyberSubscribeButton>
            </Stack>
          </ComponentSection>

          <ComponentSection title="3f. NeonBorderButton (Animated Neon Borders)">
            <Stack
              direction="row"
              gap="2rem"
              style={{ flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <NeonBorderButton color="#ff0000" onClick={() => console.log('Red clicked')}>
                Red
              </NeonBorderButton>
              <NeonBorderButton color="#00ffff" onClick={() => console.log('Cyan clicked')}>
                Cyan
              </NeonBorderButton>
              <NeonBorderButton color="#00ff88" onClick={() => console.log('Green clicked')}>
                Green
              </NeonBorderButton>
              <NeonBorderButton color="#ffff00" onClick={() => console.log('Yellow clicked')}>
                Yellow
              </NeonBorderButton>
            </Stack>
          </ComponentSection>

          <ComponentSection title="4. Icon">
            <Stack direction="row" gap="1rem">
              <Icon name="check" size={24} color={theme.currentMode.tokens.colors.success} />
              <Icon name="close" size={24} color={theme.currentMode.tokens.colors.error} />
            </Stack>
          </ComponentSection>
          <ComponentSection title="5. Input">
            <Stack direction="column" gap="2rem" style={{ alignItems: 'flex-start' }}>
              <div style={{ width: '100%', maxWidth: '500px' }}>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '0.5rem', color: '#ffffff' }}
                >
                  Standard Input:
                </Text>
                <Input
                  placeholder="Enter text..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              <div style={{ width: '100%', maxWidth: '500px' }}>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '0.5rem', color: '#29F2DF' }}
                >
                  Hacker Input (terminal style):
                </Text>
                <HackerInput label="Input Command" placeholder="Enter command..." />
              </div>

              <div style={{ width: '100%', maxWidth: '500px' }}>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '0.5rem', color: '#1C7FA6' }}
                >
                  AI HUD Input (with animated grid):
                </Text>
                <AiHudInput
                  placeholder="Ask AI anything..."
                  color="#1C7FA6"
                  onSubmit={(value) => console.log('Submitted:', value)}
                />
              </div>

              <div style={{ marginTop: '3rem', width: '100%', maxWidth: '500px' }}>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '2rem', color: '#29F2DF' }}
                >
                  Holo Glitch Input (holographic with glitch effects):
                </Text>
                <HoloGlitchInput label="ACCESS_CODE" color="#29F2DF" secondaryColor="#EF3EF1" />
              </div>

              <div style={{ marginTop: '3rem', width: '100%', maxWidth: '500px' }}>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '2rem', color: '#29F2DF' }}
                >
                  HoloInput (advanced holographic interface with HUD colors):
                </Text>
                <HoloInput label="First Name" placeholder="John" status="Ready for input" />
              </div>

              <div style={{ marginTop: '3rem', width: '100%', maxWidth: '500px' }}>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '2rem', color: '#29F2DF' }}
                >
                  FuturisticInput (geometric HUD design with animated borders):
                </Text>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <FuturisticInput enterLabel="ENTER" nameLabel="DATA" placeholder="" />
                </div>
              </div>

              <div style={{ marginTop: '3rem', width: '100%', maxWidth: '500px' }}>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '2rem', color: '#29F2DF' }}
                >
                  BashInput (terminal-style bash prompt):
                </Text>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <BashInput
                    value={bashInputValue}
                    onChange={setBashInputValue}
                    placeholder="sudo uiverse or wot"
                  />
                </div>
              </div>

              <div style={{ marginTop: '3rem', width: '100%', maxWidth: '500px' }}>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '2rem', color: '#29F2DF' }}
                >
                  GradientSearchInput (search with gradient border):
                </Text>
                <Stack
                  direction="row"
                  gap="1rem"
                  style={{ flexWrap: 'wrap', justifyContent: 'center' }}
                >
                  <GradientSearchInput
                    value={gradientSearchValue}
                    onChange={setGradientSearchValue}
                    placeholder="Search"
                    color="#00F260"
                  />
                  <GradientSearchInput
                    value={gradientSearchValue}
                    onChange={setGradientSearchValue}
                    placeholder="Search"
                    color="#0575E6"
                  />
                  <GradientSearchInput
                    value={gradientSearchValue}
                    onChange={setGradientSearchValue}
                    placeholder="Search"
                    color="#FF006E"
                  />
                </Stack>
              </div>

              <div style={{ marginTop: '3rem', width: '100%', maxWidth: '500px' }}>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '2rem', color: '#29F2DF' }}
                >
                  FloatingLabelInput (animated floating label with decorative lines):
                </Text>
                <Stack
                  direction="row"
                  gap="2rem"
                  style={{ flexWrap: 'wrap', justifyContent: 'center' }}
                >
                  <FloatingLabelInput
                    label="Email"
                    type="email"
                    value={floatingLabelValue}
                    onChange={setFloatingLabelValue}
                    color="#ac2eac"
                  />
                  <FloatingLabelInput
                    label="Username"
                    type="text"
                    value={floatingLabelValue}
                    onChange={setFloatingLabelValue}
                    color="#00ffff"
                  />
                  <FloatingLabelInput
                    label="Password"
                    type="password"
                    value={floatingLabelValue}
                    onChange={setFloatingLabelValue}
                    color="#00ff88"
                  />
                </Stack>
              </div>

              <div style={{ marginTop: '3rem', width: '100%', maxWidth: '500px' }}>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '2rem', color: '#22c55e' }}
                >
                  CyberpunkAccessInput (admin access with corner brackets):
                </Text>
                <CyberpunkAccessInput
                  label="ADMIN_ACCESS"
                  placeholder="➤ ENTER CREDENTIALS"
                  primaryColor="#22c55e"
                  warningText="Unauthorized access will be reported"
                />
              </div>

              <div style={{ marginTop: '3rem', width: '100%', maxWidth: '500px' }}>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '2rem', color: '#a974ff' }}
                >
                  AddFriendInput (friend code with animated verification):
                </Text>
                <Stack
                  direction="row"
                  gap="2rem"
                  style={{ flexWrap: 'wrap', justifyContent: 'center' }}
                >
                  <AddFriendInput
                    title="Add Friend"
                    primaryColor="rgb(169, 116, 255)"
                    backgroundColor="rgb(36, 34, 39)"
                  />
                </Stack>
              </div>

              <div style={{ marginTop: '3rem', width: '100%', maxWidth: '500px' }}>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '2rem', color: '#00ff88' }}
                >
                  VerificationCodeInput (6-digit code verification):
                </Text>
                <Stack
                  direction="row"
                  gap="2rem"
                  style={{ flexWrap: 'wrap', justifyContent: 'center' }}
                >
                  <VerificationCodeInput
                    length={6}
                    primaryColor="rgb(0, 255, 136)"
                    backgroundColor="rgb(15, 15, 25)"
                    title="Enter Code"
                    autoFocus={false}
                  />
                </Stack>
              </div>
            </Stack>
          </ComponentSection>
          <ComponentSection title="6. Select">
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
      label: 'Layout & Frames',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="7. Grid">
            <Grid columns={3} gap={1}>
              <div style={{ padding: '1rem', background: 'rgba(41, 242, 223, 0.2)' }}>1</div>
              <div style={{ padding: '1rem', background: 'rgba(41, 242, 223, 0.2)' }}>2</div>
              <div style={{ padding: '1rem', background: 'rgba(41, 242, 223, 0.2)' }}>3</div>
            </Grid>
          </ComponentSection>
          <ComponentSection title="8. Container">
            <div
              style={{
                maxWidth: '600px',
                margin: '0 auto',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <Text>Content in container</Text>
            </div>
          </ComponentSection>
          <ComponentSection title="9. Stack">
            <Stack direction="row" gap="1rem">
              <Button>A</Button>
              <Button>B</Button>
              <Button>C</Button>
            </Stack>
          </ComponentSection>
          <ComponentSection title="9b. HudBox (Asymmetrical) - 18 Variants with Colors">
            <Stack direction="column" gap="2rem">
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}
              >
                <HudButton onClick={() => setHudBoxAnimated(!hudBoxAnimated)}>
                  {hudBoxAnimated ? '⏸ Static Border' : '▶ Animated Border'}
                </HudButton>
                <Text color="#29F2DF">Mode: {hudBoxAnimated ? 'Animated' : 'Static'}</Text>
              </div>
              <div>
                <Text color="#29F2DF" style={{ marginBottom: '1rem' }}>
                  Standard & Geometric:
                </Text>
                <div
                  style={{
                    display: 'flex',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <HudBox variant="compact" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF">Compact</Text>
                  </HudBox>
                  <HudBox variant="default" color="#EF3EF1" animated={hudBoxAnimated}>
                    <Text color="#EF3EF1">Default</Text>
                  </HudBox>
                  <HudBox variant="wide" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF">Wide</Text>
                  </HudBox>
                  <HudBox variant="hexagon" color="#EF3EF1" animated={hudBoxAnimated}>
                    <Text color="#EF3EF1">Hexagon</Text>
                  </HudBox>
                  <HudBox variant="octagon" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF">Octagon</Text>
                  </HudBox>
                  <HudBox variant="diagonal" color="#EF3EF1" animated={hudBoxAnimated}>
                    <Text color="#EF3EF1">Diagonal</Text>
                  </HudBox>
                  <HudBox variant="corner-cut" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF">Corner Cut</Text>
                  </HudBox>
                  <HudBox variant="tech-panel" color="#EF3EF1" animated={hudBoxAnimated}>
                    <Text color="#EF3EF1">Tech Panel</Text>
                  </HudBox>
                  <HudBox variant="arrow-right" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF">Arrow →</Text>
                  </HudBox>
                  <HudBox variant="chevron" color="#EF3EF1" animated={hudBoxAnimated}>
                    <Text color="#EF3EF1">Chevron</Text>
                  </HudBox>
                </div>
              </div>
              <div>
                <Text color="#29F2DF" style={{ marginBottom: '1rem' }}>
                  Portrait (Vertical):
                </Text>
                <div
                  style={{
                    display: 'flex',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                >
                  <HudBox variant="portrait-tall" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF" align="center">
                      Portrait
                      <br />
                      Tall
                    </Text>
                  </HudBox>
                  <HudBox variant="portrait-slim" color="#EF3EF1" animated={hudBoxAnimated}>
                    <Text color="#EF3EF1" align="center">
                      Portrait
                      <br />
                      Slim
                    </Text>
                  </HudBox>
                  <HudBox variant="portrait-card" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF" align="center">
                      Portrait
                      <br />
                      Card
                    </Text>
                  </HudBox>
                  <HudBox variant="portrait-banner" color="#EF3EF1" animated={hudBoxAnimated}>
                    <Text color="#EF3EF1" align="center">
                      Portrait
                      <br />
                      Banner
                    </Text>
                  </HudBox>
                </div>
              </div>
              <div>
                <Text color="#29F2DF" style={{ marginBottom: '1rem' }}>
                  Landscape (Horizontal):
                </Text>
                <div
                  style={{
                    display: 'flex',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <HudBox variant="landscape-wide" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF">Landscape Wide</Text>
                  </HudBox>
                  <HudBox variant="landscape-ultra" color="#EF3EF1" animated={hudBoxAnimated}>
                    <Text color="#EF3EF1">Landscape Ultra</Text>
                  </HudBox>
                  <HudBox variant="landscape-bar" color="#29F2DF" animated={hudBoxAnimated}>
                    <Text color="#29F2DF">Landscape Bar</Text>
                  </HudBox>
                  <HudBox variant="landscape-ribbon" color="#EF3EF1" animated={hudBoxAnimated}>
                    <Text color="#EF3EF1">Landscape Ribbon</Text>
                  </HudBox>
                </div>
              </div>
            </Stack>
          </ComponentSection>
          <ComponentSection title="8c. HudFrame (Complex Frame with Neon Lines)">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                alignItems: 'center',
              }}
            >
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
                  color="#EF3EF1"
                >
                  <div style={{ padding: '2rem' }}>
                    <Text color="#EF3EF1" variant="h3" style={{ marginBottom: '1rem' }}>
                      MAGENTA THEME
                    </Text>
                    <Text color="#ffffff" variant="body">
                      HudFrame supports custom colors for all neon lines and title box. Includes
                      animated glow effects.
                    </Text>
                  </div>
                </HudFrame>
              </div>
            </div>
          </ComponentSection>
          <ComponentSection title="8d. GlitchFrame (Glitch Style Frame)">
            <div
              style={{
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'center',
              }}
            >
              <HudButton onClick={() => setHudBoxAnimated(!hudBoxAnimated)}>
                {hudBoxAnimated ? '⏸ Static Frame' : '▶ Animated Frame'}
              </HudButton>
              <Text color="#29F2DF">Mode: {hudBoxAnimated ? 'Animated' : 'Static'}</Text>
            </div>

            <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
              Large Size (600px):
            </Text>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                alignItems: 'center',
                marginBottom: '3rem',
              }}
            >
              <div style={{ width: '100%', maxWidth: '600px', minHeight: '300px' }}>
                <GlitchFrame animated={hudBoxAnimated}>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <Text color="#29F2DF" variant="h3" style={{ marginBottom: '1rem' }}>
                      GLITCH FRAME
                    </Text>
                    <Text color="#ffffff" variant="body" style={{ marginBottom: '1rem' }}>
                      Asymmetrical frame with glitch effects and animated shadows. Perfect for login
                      forms and authentication interfaces.
                    </Text>
                    <Text color="#29F2DF" variant="body">
                      Toggle animation on/off with the button above.
                    </Text>
                  </div>
                </GlitchFrame>
              </div>
            </div>

            <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
              Medium Size (450px):
            </Text>
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '3rem',
              }}
            >
              <div style={{ width: '100%', maxWidth: '450px', minHeight: '250px' }}>
                <GlitchFrame animated={hudBoxAnimated} width="450px" height="250px">
                  <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <Text color="#29F2DF" variant="h4" style={{ marginBottom: '0.5rem' }}>
                      SYSTEM ACCESS
                    </Text>
                    <Text color="#29F2DF" variant="body">
                      Medium sized frame
                    </Text>
                  </div>
                </GlitchFrame>
              </div>
              <div style={{ width: '100%', maxWidth: '450px', minHeight: '250px' }}>
                <GlitchFrame animated={hudBoxAnimated} width="450px" height="250px">
                  <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <Text color="#29F2DF" variant="h4" style={{ marginBottom: '0.5rem' }}>
                      DATA TERMINAL
                    </Text>
                    <Text color="#29F2DF" variant="body">
                      Futuristic design
                    </Text>
                  </div>
                </GlitchFrame>
              </div>
            </div>

            <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
              Small Size (300px):
            </Text>
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '3rem',
              }}
            >
              <div style={{ width: '100%', maxWidth: '300px', minHeight: '200px' }}>
                <GlitchFrame animated={hudBoxAnimated} width="300px" height="200px">
                  <div style={{ padding: '1rem', textAlign: 'center' }}>
                    <Text color="#29F2DF" variant="h5" style={{ marginBottom: '0.5rem' }}>
                      COMPACT
                    </Text>
                    <Text color="#ffffff" variant="caption">
                      Small frame
                    </Text>
                  </div>
                </GlitchFrame>
              </div>
              <div style={{ width: '100%', maxWidth: '300px', minHeight: '200px' }}>
                <GlitchFrame animated={hudBoxAnimated} width="300px" height="200px">
                  <div style={{ padding: '1rem', textAlign: 'center' }}>
                    <Text color="#29F2DF" variant="h5" style={{ marginBottom: '0.5rem' }}>
                      STATUS
                    </Text>
                    <Text color="#29F2DF" variant="caption">
                      Mini panel
                    </Text>
                  </div>
                </GlitchFrame>
              </div>
              <div style={{ width: '100%', maxWidth: '300px', minHeight: '200px' }}>
                <GlitchFrame animated={hudBoxAnimated} width="300px" height="200px">
                  <div style={{ padding: '1rem', textAlign: 'center' }}>
                    <Text color="#ffffff" variant="h5" style={{ marginBottom: '0.5rem' }}>
                      ALERT
                    </Text>
                    <Text color="#29F2DF" variant="caption">
                      Info box
                    </Text>
                  </div>
                </GlitchFrame>
              </div>
            </div>

            <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
              Tall/Portrait Layout (300px × 500px):
            </Text>
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '3rem',
              }}
            >
              <div style={{ width: '100%', maxWidth: '300px', minHeight: '500px' }}>
                <GlitchFrame animated={hudBoxAnimated} width="300px" height="500px">
                  <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <Text color="#29F2DF" variant="h4" style={{ marginBottom: '0.5rem' }}>
                      TALL PANEL
                    </Text>
                    <Text color="#ffffff" variant="body">
                      Vertical layout for side panels and navigation menus
                    </Text>
                  </div>
                </GlitchFrame>
              </div>
              <div style={{ width: '100%', maxWidth: '350px', minHeight: '600px' }}>
                <GlitchFrame animated={hudBoxAnimated} width="350px" height="600px">
                  <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <Text color="#29F2DF" variant="h4" style={{ marginBottom: '0.5rem' }}>
                      EXTRA TALL
                    </Text>
                    <Text color="#29F2DF" variant="body">
                      Extended vertical space for detailed content and forms
                    </Text>
                  </div>
                </GlitchFrame>
              </div>
            </div>

            <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
              Wide Layout (800px):
            </Text>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '100%', maxWidth: '800px', minHeight: '200px' }}>
                <GlitchFrame animated={hudBoxAnimated} width="800px" height="200px">
                  <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <Text color="#29F2DF" variant="h4" style={{ marginBottom: '0.5rem' }}>
                      WIDE PANEL LAYOUT
                    </Text>
                    <Text color="#ffffff" variant="body">
                      Perfect for dashboard headers and status bars
                    </Text>
                  </div>
                </GlitchFrame>
              </div>
            </div>
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Form Controls',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="HUD Form Elements - 14 Sections from Reference Site">
            <Stack
              direction="column"
              gap="2.5rem"
              style={{ minHeight: '3500px', overflow: 'visible', maxHeight: 'none' }}
            >
              {/* 1. Form Controls */}
              <div>
                <Text
                  color="#29F2DF"
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  1. FORM CONTROLS
                </Text>
                <Stack direction="column" gap="1rem">
                  <HudInput placeholder="Default input" />
                  <HudTextarea placeholder="Textarea" rows={3} />
                  <HudSelect />
                </Stack>
              </div>

              {/* 2. Sizing */}
              <div>
                <Text
                  color="#29F2DF"
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  2. SIZING
                </Text>
                <Stack direction="column" gap="1rem">
                  <HudInput placeholder="Large input" size="lg" />
                  <HudInput placeholder="Default input" size="default" />
                  <HudInput placeholder="Small input" size="sm" />
                </Stack>
              </div>

              {/* 3. Readonly */}
              <div>
                <Text
                  color="#29F2DF"
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  3. READONLY
                </Text>
                <HudInput
                  placeholder="Readonly input here..."
                  readonly
                  value="Readonly input here..."
                />
              </div>

              {/* 4. Readonly Plain Text */}
              <div>
                <Text
                  color="#29F2DF"
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  4. READONLY PLAIN TEXT
                </Text>
                <HudInput plaintext readonly value="email@example.com" />
              </div>

              {/* 5. Range Inputs */}
              <div>
                <Text
                  color="#29F2DF"
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  5. RANGE INPUTS
                </Text>
                <HudRange min={0} max={100} value={50} />
              </div>

              {/* 6. Checkboxes */}
              <div>
                <Text
                  color="#29F2DF"
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  6. CHECKBOXES
                </Text>
                <Stack direction="column" gap="0.5rem">
                  <HudCheckbox label="Default checkbox" checked={false} />
                  <HudCheckbox label="Checked checkbox" checked={true} />
                  <HudCheckbox label="Disabled checkbox" checked={false} disabled={true} />
                </Stack>
              </div>

              {/* 7. Radios */}
              <div>
                <Text
                  color="#29F2DF"
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  7. RADIOS
                </Text>
                <Stack direction="column" gap="0.5rem">
                  <HudRadio label="Default radio button" name="radio1" checked={false} />
                  <HudRadio label="Checked radio button" name="radio1" checked={true} />
                  <HudRadio
                    label="Disabled radio button"
                    name="radio1"
                    checked={false}
                    disabled={true}
                  />
                </Stack>
              </div>

              {/* 8. Switches */}
              <div>
                <Text
                  color="#29F2DF"
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  8. SWITCHES
                </Text>
                <Stack direction="column" gap="0.5rem">
                  <HudSwitch label="Toggle this switch element" checked={false} />
                  <HudSwitch label="Checked switch element" checked={true} />
                  <HudSwitch label="Disabled switch element" checked={false} disabled={true} />
                </Stack>
              </div>

              {/* 9. File Browser */}
              <div>
                <Text
                  color="#29F2DF"
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  9. FILE BROWSER
                </Text>
                <Stack direction="column" gap="1rem">
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Default file input
                    </Text>
                    <HudFile />
                  </div>
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Multiple files input
                    </Text>
                    <HudFile multiple />
                  </div>
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Disabled file input
                    </Text>
                    <HudFile disabled />
                  </div>
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Small file input
                    </Text>
                    <HudFile size="sm" />
                  </div>
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Large file input
                    </Text>
                    <HudFile size="lg" />
                  </div>
                </Stack>
              </div>

              {/* 10. Form Grid */}
              <div>
                <Text
                  color="#29F2DF"
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  10. FORM GRID
                </Text>
                <HudFormGrid>
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      First Name
                    </Text>
                    <HudInput placeholder="First name" />
                  </div>
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Last Name
                    </Text>
                    <HudInput placeholder="Last name" />
                  </div>
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Email
                    </Text>
                    <HudInput type="email" placeholder="Email" />
                  </div>
                </HudFormGrid>
              </div>

              {/* 11. Help Text */}
              <div>
                <Text
                  color="#29F2DF"
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  11. HELP TEXT
                </Text>
                <div>
                  <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    Password
                  </Text>
                  <HudInput type="password" placeholder="Password" />
                  <HudFormHelpText>
                    Your password must be 8-20 characters long, contain letters and numbers, and
                    must not contain spaces, special characters, or emoji.
                  </HudFormHelpText>
                </div>
              </div>

              {/* 12. Input Group */}
              <div>
                <Text
                  color="#29F2DF"
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  12. INPUT GROUP
                </Text>
                <Stack direction="column" gap="1rem">
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Username
                    </Text>
                    <HudInputGroup prepend="@">
                      <HudInput placeholder="Username" />
                    </HudInputGroup>
                  </div>
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Website
                    </Text>
                    <HudInputGroup append=".com">
                      <HudInput placeholder="Website" />
                    </HudInputGroup>
                  </div>
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Price
                    </Text>
                    <HudInputGroup prepend="$" append=".00">
                      <HudInput placeholder="0" type="number" />
                    </HudInputGroup>
                  </div>
                </Stack>
              </div>

              {/* 13. Validation */}
              <div>
                <Text
                  color="#29F2DF"
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  13. VALIDATION
                </Text>
                <Stack direction="column" gap="1rem">
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Invalid Input
                    </Text>
                    <HudInputValidated
                      placeholder="Enter name"
                      isInvalid={true}
                      feedback="Please provide a name"
                    />
                  </div>
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Valid Input
                    </Text>
                    <HudInputValidated
                      placeholder="Username"
                      value="john_doe"
                      isValid={true}
                      feedback="Looks good!"
                    />
                  </div>
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Invalid Select
                    </Text>
                    <HudSelectValidated isInvalid={true} feedback="Please select a valid state" />
                  </div>
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Invalid Textarea
                    </Text>
                    <HudTextareaValidated
                      placeholder="Enter message"
                      isInvalid={true}
                      feedback="Please enter a message in the textarea"
                      rows={3}
                    />
                  </div>
                </Stack>
              </div>

              {/* 14. Validation with Tooltips */}
              <div>
                <Text
                  color="#29F2DF"
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                  }}
                >
                  14. VALIDATION (TOOLTIP)
                </Text>
                <Stack direction="column" gap="2rem">
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Tooltip Valid
                    </Text>
                    <HudInputValidated
                      placeholder="Username"
                      value="valid_user"
                      isValid={true}
                      feedback="Looks good!"
                      feedbackTooltip={true}
                    />
                  </div>
                  <div>
                    <Text color="#fff" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      Tooltip Invalid
                    </Text>
                    <HudSelectValidated
                      isInvalid={true}
                      feedback="Please select a valid state"
                      feedbackTooltip={true}
                    />
                  </div>
                </Stack>
              </div>
            </Stack>
          </ComponentSection>
          <ComponentSection title="9. Checkbox">
            <Checkbox checked={checkboxValue} onChange={setCheckboxValue} label="Accept" />
          </ComponentSection>
          <ComponentSection title="9b. HoloCheckbox (3D)">
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
              }}
            >
              <HoloCheckbox
                checked={holoCheckboxValue}
                onChange={setHoloCheckboxValue}
                label="HOLOGRAPHIC"
              />
            </div>
          </ComponentSection>
          <ComponentSection title="9c. CyberpunkCheckbox (Glitch)">
            <Stack
              direction="row"
              gap="2rem"
              style={{ flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <CyberpunkCheckbox
                checked={cyberpunkCheckboxValue}
                onChange={setCyberpunkCheckboxValue}
                color="#00ffff"
                label="CYAN"
              />
              <CyberpunkCheckbox
                checked={cyberpunkCheckboxValue}
                onChange={setCyberpunkCheckboxValue}
                color="#ff00ff"
                label="MAGENTA"
              />
              <CyberpunkCheckbox
                checked={cyberpunkCheckboxValue}
                onChange={setCyberpunkCheckboxValue}
                color="#00ff88"
                label="GREEN"
              />
              <CyberpunkCheckbox
                checked={cyberpunkCheckboxValue}
                onChange={setCyberpunkCheckboxValue}
                color="#ffff00"
                label="YELLOW"
              />
            </Stack>
          </ComponentSection>
          <ComponentSection title="9d. BubbleCheckbox (Floating Bubble)">
            <Stack
              direction="row"
              gap="2rem"
              style={{ flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <BubbleCheckbox
                checked={bubbleCheckboxValue}
                onChange={setBubbleCheckboxValue}
                label="Floating Bubble"
              />
              <BubbleCheckbox
                checked={bubbleCheckboxValue}
                onChange={setBubbleCheckboxValue}
                label="Bubble Checked"
              />
              <BubbleCheckbox
                checked={bubbleCheckboxValue}
                onChange={setBubbleCheckboxValue}
                label="Disabled"
                disabled={true}
              />
            </Stack>
          </ComponentSection>
          <ComponentSection title="9e. NeonCheckbox (Neon Effects)">
            <Stack
              direction="row"
              gap="2rem"
              style={{ flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <NeonCheckbox
                checked={neonCheckboxValue}
                onChange={setNeonCheckboxValue}
                label="CYAN"
                color="#00ffaa"
              />
              <NeonCheckbox
                checked={neonCheckboxValue}
                onChange={setNeonCheckboxValue}
                label="MAGENTA"
                color="#ff00ff"
              />
              <NeonCheckbox
                checked={neonCheckboxValue}
                onChange={setNeonCheckboxValue}
                label="BLUE"
                color="#00ffff"
              />
              <NeonCheckbox
                checked={neonCheckboxValue}
                onChange={setNeonCheckboxValue}
                label="YELLOW"
                color="#ffff00"
              />
            </Stack>
          </ComponentSection>
          <ComponentSection title="9f. GlowingNeonCheckbox (Glowing Neon Effects)">
            <Stack
              direction="row"
              gap="2rem"
              style={{ flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <GlowingNeonCheckbox
                checked={glowingNeonCheckboxValue}
                onChange={setGlowingNeonCheckboxValue}
                label="GREEN"
                color="#00ff88"
              />
              <GlowingNeonCheckbox
                checked={glowingNeonCheckboxValue}
                onChange={setGlowingNeonCheckboxValue}
                label="CYAN"
                color="#00ffff"
              />
              <GlowingNeonCheckbox
                checked={glowingNeonCheckboxValue}
                onChange={setGlowingNeonCheckboxValue}
                label="MAGENTA"
                color="#ff00ff"
              />
              <GlowingNeonCheckbox
                checked={glowingNeonCheckboxValue}
                onChange={setGlowingNeonCheckboxValue}
                label="YELLOW"
                color="#ffff00"
              />
            </Stack>
          </ComponentSection>
          <ComponentSection title="10. Radio">
            <Radio
              options={[
                { id: 'opt1', label: 'Option 1' },
                { id: 'opt2', label: 'Option 2' },
              ]}
              defaultValue="opt1"
              onChange={(v) => setRadioValue(v)}
              color="#29F2DF"
            />
          </ComponentSection>
          <ComponentSection title="10b. GlitchRadio (Glitch Style)">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GlitchRadio
                name="protocol"
                value={glitchRadioValue}
                onChange={setGlitchRadioValue}
                options={[
                  { value: 'tcp', label: 'PROTOCOL_TCP' },
                  { value: 'udp', label: 'PROTOCOL_UDP' },
                  { value: 'legacy', label: '[LEGACY_SYSTEM]', disabled: true },
                ]}
              />
            </div>
          </ComponentSection>
          <ComponentSection title="10c. CyberpunkRadio (Orbital Animation)">
            <Stack direction="column" gap="2rem" style={{ alignItems: 'center' }}>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#00a6ff' }}
                >
                  Blue Theme:
                </Text>
                <CyberpunkRadio
                  options={[
                    { value: '1', label: 'Helios Blue' },
                    { value: '2', label: 'Cygnus Magenta' },
                    { value: '3', label: 'Orion Lime' },
                  ]}
                  value={cyberpunkRadioValue}
                  onChange={setCyberpunkRadioValue}
                  color="#00a6ff"
                />
              </div>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#e900ff' }}
                >
                  Magenta Theme:
                </Text>
                <CyberpunkRadio
                  options={[
                    { value: '1', label: 'Helios Blue' },
                    { value: '2', label: 'Cygnus Magenta' },
                    { value: '3', label: 'Orion Lime' },
                  ]}
                  value={cyberpunkRadioValue}
                  onChange={setCyberpunkRadioValue}
                  color="#e900ff"
                />
              </div>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#00ffc2' }}
                >
                  Cyan Theme:
                </Text>
                <CyberpunkRadio
                  options={[
                    { value: '1', label: 'Helios Blue' },
                    { value: '2', label: 'Cygnus Magenta' },
                    { value: '3', label: 'Orion Lime' },
                  ]}
                  value={cyberpunkRadioValue}
                  onChange={setCyberpunkRadioValue}
                  color="#00ffc2"
                />
              </div>
            </Stack>
          </ComponentSection>
          <ComponentSection title="11. Switch">
            <Switch checked={switchValue} onChange={setSwitchValue} label="Enable" />
          </ComponentSection>
          <ComponentSection title="11b. ToggleSwitch (Animated)">
            <Stack direction="column" gap="2rem">
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#00ffff' }}
                >
                  Cyan Theme:
                </Text>
                <ToggleSwitch
                  checked={toggleSwitchValue}
                  onChange={setToggleSwitchValue}
                  label="Enable Feature"
                  color="#00ffff"
                  colorOpacity="#00ffff1c"
                  size="medium"
                />
              </div>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#ff00ff' }}
                >
                  Magenta Theme:
                </Text>
                <ToggleSwitch
                  checked={false}
                  onChange={() => {}}
                  label="Magenta Toggle"
                  color="#ff00ff"
                  colorOpacity="#ff00ff1c"
                  size="medium"
                />
              </div>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#00ff88' }}
                >
                  Green Theme (Small):
                </Text>
                <ToggleSwitch
                  checked={false}
                  onChange={() => {}}
                  label="Small Toggle"
                  color="#00ff88"
                  colorOpacity="#00ff881c"
                  size="small"
                />
              </div>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#ffff00' }}
                >
                  Yellow Theme (Large):
                </Text>
                <ToggleSwitch
                  checked={true}
                  onChange={() => {}}
                  label="Large Toggle"
                  color="#ffff00"
                  colorOpacity="#ffff001c"
                  size="large"
                />
              </div>
            </Stack>
          </ComponentSection>
          <ComponentSection title="11c. CyberpunkToggle (Particle Animation)">
            <Stack direction="column" gap="2rem" style={{ alignItems: 'center' }}>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#00ffff' }}
                >
                  Cyan Theme:
                </Text>
                <CyberpunkToggle
                  checked={cyberpunkToggleValue}
                  onChange={setCyberpunkToggleValue}
                  color="#00ffff"
                  label="SYSTEM POWER"
                />
              </div>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#ff00ff' }}
                >
                  Magenta Theme:
                </Text>
                <CyberpunkToggle
                  checked={false}
                  onChange={() => {}}
                  color="#ff00ff"
                  label="MAGENTA MODE"
                />
              </div>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#00ff88' }}
                >
                  Green Theme:
                </Text>
                <CyberpunkToggle
                  checked={false}
                  onChange={() => {}}
                  color="#00ff88"
                  label="GREEN SIGNAL"
                />
              </div>
            </Stack>
          </ComponentSection>

          <ComponentSection title="11d. LockSwitch (Lock/Unlock Toggle)">
            <Stack
              direction="row"
              gap="2rem"
              style={{ flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <Text variant="caption" style={{ color: '#ff0000' }}>
                  Locked (Red)
                </Text>
                <LockSwitch
                  checked={lockSwitchValue}
                  onChange={setLockSwitchValue}
                  offColor="#ff0000"
                  onColor="#00ff88"
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <Text variant="caption" style={{ color: '#00ffff' }}>
                  Unlocked (Cyan)
                </Text>
                <LockSwitch
                  checked={true}
                  onChange={() => {}}
                  offColor="#ff0000"
                  onColor="#00ffff"
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <Text variant="caption" style={{ color: '#ffff00' }}>
                  Unlocked (Yellow)
                </Text>
                <LockSwitch
                  checked={true}
                  onChange={() => {}}
                  offColor="#ff0000"
                  onColor="#ffff00"
                />
              </div>
            </Stack>
          </ComponentSection>

          <ComponentSection title="13. Slider">
            <Slider value={sliderValue} onChange={setSliderValue} min={0} max={100} />
            <Text>Value: {sliderValue}</Text>
          </ComponentSection>
          <ComponentSection title="13b. NeonSlider (Animated Neon)">
            <Stack direction="column" gap="2rem">
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#00ffff' }}
                >
                  Cyan Neon Slider:
                </Text>
                <NeonSlider
                  value={neonSliderValue}
                  onChange={setNeonSliderValue}
                  min={0}
                  max={100}
                  color="#00ffff"
                  colorOpacity="#00ffff1c"
                  label="Volume"
                  showValue={true}
                />
              </div>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#ff00ff' }}
                >
                  Magenta Neon Slider:
                </Text>
                <NeonSlider
                  value={60}
                  onChange={() => {}}
                  min={0}
                  max={100}
                  color="#ff00ff"
                  colorOpacity="#ff00ff1c"
                  label="Brightness"
                  showValue={true}
                />
              </div>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#00ff88' }}
                >
                  Green Neon Slider:
                </Text>
                <NeonSlider
                  value={75}
                  onChange={() => {}}
                  min={0}
                  max={100}
                  color="#00ff88"
                  colorOpacity="#00ff881c"
                  label="Intensity"
                  showValue={true}
                />
              </div>
            </Stack>
          </ComponentSection>
          <ComponentSection title="14. DatePicker">
            <DatePicker value={dateValue} onChange={setDateValue} />
          </ComponentSection>
          <ComponentSection title="15. ColorPicker">
            <ColorPicker value={colorValue} onChange={setColorValue} />
          </ComponentSection>
          <ComponentSection title="16. FileUpload">
            <FileUpload onUpload={setUploadedFiles} accept=".jpg,.png" />
          </ComponentSection>
          <ComponentSection title="17. GlitchLoginForm (HUD Style)">
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                padding: '2rem',
                borderRadius: '8px',
                minHeight: '400px',
              }}
            >
              <GlitchLoginForm
                onSubmit={(username, password) => {
                  console.log('Login:', { username, password });
                  showToast({
                    type: 'success',
                    message: 'Login Attempt',
                    description: `User: ${username}`,
                    duration: 3000,
                  });
                }}
                userPlaceholder="Username"
                passwordPlaceholder="Password"
                submitText="ACCESS SYSTEM"
              />
            </div>
          </ComponentSection>
          <ComponentSection title="16b. CyberLoginForm (Cyberpunk Style)">
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                padding: '2rem',
                borderRadius: '8px',
                minHeight: '400px',
              }}
            >
              <CyberLoginForm
                onSubmit={(data) => {
                  console.log('Login:', data);
                  showToast({
                    type: 'success',
                    message: 'Login Attempt',
                    description: `User: ${data.username}`,
                    duration: 3000,
                  });
                }}
                usernamePlaceholder="نام کاربری"
                passwordPlaceholder="رمز عبور"
                buttonText="ورود"
                primaryColor="#4090b5"
                secondaryColor="#9e30a9"
              />
            </div>
          </ComponentSection>
          <ComponentSection title="18. NeonRadio (HUD Style with Neon Effects)">
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                padding: '3rem',
                borderRadius: '8px',
              }}
            >
              <NeonRadio
                options={[
                  { value: 'option1', label: 'OPTION 1' },
                  { value: 'option2', label: 'OPTION 2' },
                  { value: 'option3', label: 'OPTION 3' },
                ]}
                value={radioValue}
                onChange={(v) => setRadioValue(v)}
                name="neon-radio-showcase"
              />
            </div>
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Navigation',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="19. Sidebar">
            <div
              style={{
                height: '300px',
                position: 'relative',
                border: '1px solid rgba(41, 242, 223, 0.3)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <Sidebar items={navItems} position="relative" />
            </div>
          </ComponentSection>
          <ComponentSection title="20. Breadcrumb">
            <Breadcrumb items={breadcrumbItems} />
          </ComponentSection>
          <ComponentSection title="21. Tabs">
            <Text>Tabs component (you're using it now!)</Text>
          </ComponentSection>
          <ComponentSection title="22. Menu">
            <div
              style={{
                position: 'relative',
                minHeight: '200px',
                padding: '1rem',
                border: '1px solid rgba(41, 242, 223, 0.3)',
                borderRadius: '4px',
              }}
            >
              <Menu items={navItems} />
            </div>
          </ComponentSection>
          <ComponentSection title="23. Pagination">
            <Pagination
              total={100}
              perPage={10}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Data Display',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="24. Table">
            <Table
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'category', label: 'Category' },
              ]}
              data={tableData}
            />
          </ComponentSection>
          <ComponentSection title="24b. HUD Table Variants (10 Types)">
            <Stack direction="column" gap="2rem">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                  gap: '2rem',
                }}
              >
                <div>
                  <Text
                    color="#29F2DF"
                    style={{
                      marginBottom: '1rem',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    1. Basic Table
                  </Text>
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(41, 242, 223, 0.05)',
                      borderRadius: '4px',
                      border: '1px solid rgba(41, 242, 223, 0.2)',
                    }}
                  >
                    <HudTableBasic color="#29F2DF" />
                  </div>
                </div>
                <div>
                  <Text
                    color="#29F2DF"
                    style={{
                      marginBottom: '1rem',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    2. Dark Table
                  </Text>
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(41, 242, 223, 0.05)',
                      borderRadius: '4px',
                      border: '1px solid rgba(41, 242, 223, 0.2)',
                    }}
                  >
                    <HudTableDark color="#29F2DF" />
                  </div>
                </div>
                <div>
                  <Text
                    color="#29F2DF"
                    style={{
                      marginBottom: '1rem',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    3. Bordered Table
                  </Text>
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(41, 242, 223, 0.05)',
                      borderRadius: '4px',
                      border: '1px solid rgba(41, 242, 223, 0.2)',
                    }}
                  >
                    <HudTableBordered color="#29F2DF" />
                  </div>
                </div>
                <div>
                  <Text
                    color="#29F2DF"
                    style={{
                      marginBottom: '1rem',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    4. Borderless Table
                  </Text>
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(41, 242, 223, 0.05)',
                      borderRadius: '4px',
                      border: '1px solid rgba(41, 242, 223, 0.2)',
                    }}
                  >
                    <HudTableBorderless color="#29F2DF" />
                  </div>
                </div>
                <div>
                  <Text
                    color="#29F2DF"
                    style={{
                      marginBottom: '1rem',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    5. Striped Table
                  </Text>
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(41, 242, 223, 0.05)',
                      borderRadius: '4px',
                      border: '1px solid rgba(41, 242, 223, 0.2)',
                    }}
                  >
                    <HudTableStriped color="#29F2DF" />
                  </div>
                </div>
                <div>
                  <Text
                    color="#29F2DF"
                    style={{
                      marginBottom: '1rem',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    6. Hoverable Table
                  </Text>
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(41, 242, 223, 0.05)',
                      borderRadius: '4px',
                      border: '1px solid rgba(41, 242, 223, 0.2)',
                    }}
                  >
                    <HudTableHoverable color="#29F2DF" />
                  </div>
                </div>
                <div>
                  <Text
                    color="#29F2DF"
                    style={{
                      marginBottom: '1rem',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    7. Small Table
                  </Text>
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(41, 242, 223, 0.05)',
                      borderRadius: '4px',
                      border: '1px solid rgba(41, 242, 223, 0.2)',
                    }}
                  >
                    <HudTableSmall color="#29F2DF" />
                  </div>
                </div>
                <div>
                  <Text
                    color="#29F2DF"
                    style={{
                      marginBottom: '1rem',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    8. Contextual Table
                  </Text>
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(41, 242, 223, 0.05)',
                      borderRadius: '4px',
                      border: '1px solid rgba(41, 242, 223, 0.2)',
                    }}
                  >
                    <HudTableContextual color="#29F2DF" />
                  </div>
                </div>
                <div>
                  <Text
                    color="#29F2DF"
                    style={{
                      marginBottom: '1rem',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    9. Table with Caption
                  </Text>
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(41, 242, 223, 0.05)',
                      borderRadius: '4px',
                      border: '1px solid rgba(41, 242, 223, 0.2)',
                    }}
                  >
                    <HudTableCaption color="#29F2DF" />
                  </div>
                </div>
                <div>
                  <Text
                    color="#29F2DF"
                    style={{
                      marginBottom: '1rem',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    10. Responsive Table
                  </Text>
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(41, 242, 223, 0.05)',
                      borderRadius: '4px',
                      border: '1px solid rgba(41, 242, 223, 0.2)',
                    }}
                  >
                    <HudTableResponsive color="#29F2DF" />
                  </div>
                </div>
              </div>
            </Stack>
          </ComponentSection>
          <ComponentSection title="25. DataGrid">
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
          <ComponentSection title="26. Tree">
            <Tree nodes={treeData} onNodeClick={(node) => console.log(node)} />
          </ComponentSection>
          <ComponentSection title="26b. CyberCard (HUD Style)">
            <div
              style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <CyberCard title="PROFILE" footer="Social Links" />
              <CyberCard title="CONTACT" footer="Connect" />
            </div>
          </ComponentSection>
          <ComponentSection title="26c. GlassCard (3D Glass Effect)">
            <div
              style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <GlassCard
                title="Confirm"
                body="Are you sure you want to proceed?"
                primaryButtonText="Yes"
                secondaryButtonText="No"
              />
              <GlassCard
                title="Action"
                body="Please confirm your choice"
                primaryButtonText="Accept"
                secondaryButtonText="Decline"
                primaryColor="#00D9FF"
                secondaryColor="#FF00FF"
              />
              <GlassCard
                title="Delete?"
                body="This cannot be undone"
                primaryButtonText="Delete"
                secondaryButtonText="Cancel"
                primaryColor="#FF006E"
                secondaryColor="#FF00FF"
              />
            </div>
          </ComponentSection>
          <ComponentSection title="26d. ThermostatCard (Interactive Thermostat)">
            <Stack
              direction="row"
              gap="2rem"
              style={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}
            >
              <ThermostatCard
                temperature={thermostatTemp}
                color="#00f0ff"
                label="CURRENT"
                status="Comfort"
                onChange={setThermostatTemp}
              />
              <ThermostatCard
                temperature={thermostatTemp}
                color="#ff00ff"
                label="SYSTEM"
                status="Active"
                onChange={setThermostatTemp}
              />
              <ThermostatCard
                temperature={thermostatTemp}
                color="#00ff88"
                label="TARGET"
                status="Optimal"
                onChange={setThermostatTemp}
              />
            </Stack>
          </ComponentSection>
          <ComponentSection title="26e. TerminalThemeSelector (Theme Switcher)">
            <Stack direction="column" gap="2rem" style={{ alignItems: 'center' }}>
              <TerminalThemeSelector onThemeChange={setTerminalTheme} />
              <Text variant="caption" style={{ color: '#00ffff' }}>
                Current Theme: {terminalTheme.toUpperCase()}
              </Text>
            </Stack>
          </ComponentSection>
          <ComponentSection title="26g. NotificationCard (Classic Style)">
            <Stack direction="column" gap="2rem" style={{ alignItems: 'center' }}>
              <NotificationCard
                title="Clans of Clash"
                message="Xhattmahs is not attacking your base!"
                timestamp="12 min ago"
              />
            </Stack>
          </ComponentSection>
          <ComponentSection title="26h. HudNotificationCard (HUD Style)">
            <Stack direction="column" gap="2rem" style={{ alignItems: 'center' }}>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#00ffff' }}
                >
                  Cyan Theme:
                </Text>
                <HudNotificationCard
                  title="SYSTEM ALERT"
                  message="Threat detected in sector 7"
                  color="#00ffff"
                />
              </div>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#ff00ff' }}
                >
                  Magenta Theme:
                </Text>
                <HudNotificationCard
                  title="WARNING"
                  message="Unauthorized access attempt"
                  color="#ff00ff"
                />
              </div>
              <div>
                <Text
                  variant="caption"
                  style={{ display: 'block', marginBottom: '1rem', color: '#00ff88' }}
                >
                  Green Theme:
                </Text>
                <HudNotificationCard
                  title="SYSTEM OK"
                  message="All systems operational"
                  color="#00ff88"
                />
              </div>
            </Stack>
          </ComponentSection>
          <ComponentSection title="26f. GlitchProfileCard (GitHub Style)">
            <div
              style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}
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
          </ComponentSection>
          <ComponentSection title="26e. RadarHud (Military Radar Display)">
            <Text
              variant="body"
              style={{ marginBottom: '1.5rem', color: '#EF3EF1', textAlign: 'center' }}
            >
              Military-style radar with rotating scanner, target dots, and coordinate display
            </Text>
            <div
              style={{
                display: 'flex',
                gap: '3rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                padding: '2rem',
                background: 'rgba(41, 242, 223, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(41, 242, 223, 0.2)',
              }}
            >
              <RadarHud
                coordinates={`34° 36' 30" S; 58° 22' 16" O`}
                depth="DEPT - 600"
                wind="WIND - 54.3"
                color="#EF3EF1"
                size={280}
              />
              <RadarHud
                coordinates={`51° 30' 26" N; 0° 7' 39" W`}
                depth="DEPT - 1200"
                wind="WIND - 32.8"
                color="#29F2DF"
                size={280}
              />
            </div>
          </ComponentSection>
          <ComponentSection title="26f. PipBoy (Fallout Style Terminal)">
            <Text
              variant="body"
              style={{ marginBottom: '1.5rem', color: '#29F2DF', textAlign: 'center' }}
            >
              Pip-Boy inspired terminal with CRT effects, tabs (STAT/INV/DATA), and retro-futuristic
              design. All data is controlled via the data prop object.
            </Text>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '2rem',
                background: 'rgba(41, 242, 223, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(41, 242, 223, 0.2)',
              }}
            >
              <PipBoy
                color="#29F2DF"
                data={{
                  hp: { current: 420, max: 500 },
                  ap: { current: 85, max: 100 },
                  time: '14:23',
                  date: '03.05.2026',
                  rads: 15,
                  inventory: [
                    { name: 'Med-X', weight: 0.3, quantity: 8 },
                    { name: 'Laser Rifle', weight: 5.5 },
                    { name: 'Fusion Cell', weight: 0.1, quantity: 120 },
                    { name: 'Stealth Boy', weight: 1.0, quantity: 2 },
                    { name: 'Nuka-Cola', weight: 1.0, quantity: 5 },
                  ],
                  radarStatus: 'SIGNAL DETECTED',
                  targets: 3,
                }}
              />
            </div>
          </ComponentSection>
          <ComponentSection title="26g. Loader Components">
            <Text variant="h4" color="#29F2DF" style={{ marginBottom: '1rem' }}>
              AbstergoLoader (Triangular Animation)
            </Text>
            <div
              style={{
                display: 'flex',
                gap: '3rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                padding: '3rem',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                borderRadius: '8px',
                marginBottom: '2rem',
              }}
            >
              <AbstergoLoader text="Loading" size={0.8} />
              <AbstergoLoader text="Synchronization" size={1} />
              <AbstergoLoader text="Processing" size={1.2} />
            </div>
            <Text variant="h4" color="#29F2DF" style={{ marginBottom: '1rem' }}>
              HeartRateLoader (ECG Animation)
            </Text>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                alignItems: 'center',
                padding: '3rem',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                borderRadius: '8px',
                marginBottom: '2rem',
              }}
            >
              <HeartRateLoader color="#EF3EF1" width={550} height={210} />
              <HeartRateLoader color="#29F2DF" width={400} height={150} />
              <HeartRateLoader color="#29F2DF" width={300} height={120} />
            </div>
            <Text variant="h4" color="#29F2DF" style={{ marginBottom: '1rem' }}>
              HackerLoader (Progress Bar with Glitch)
            </Text>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                alignItems: 'center',
                padding: '3rem',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                borderRadius: '8px',
              }}
            >
              <HackerLoader text="LOADING" color="#29F2DF" />
              <HackerLoader text="HACKING" color="#29F2DF" />
              <HackerLoader text="PROCESSING" color="#29F2DF" />
              <div style={{ marginTop: '1rem' }}>
                <Text
                  variant="caption"
                  style={{ color: '#29F2DF', marginBottom: '0.5rem', display: 'block' }}
                >
                  Static Progress (50%):
                </Text>
                <HackerLoader text="UPLOADING" color="#29F2DF" progress={50} />
              </div>
            </div>
            <Text variant="h4" color="#29F2DF" style={{ marginBottom: '1rem', marginTop: '2rem' }}>
              BinaryLoader (Binary Digits with Glitch)
            </Text>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '3rem',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                borderRadius: '8px',
              }}
            >
              <BinaryLoader />
            </div>
            <Text variant="h4" color="#29F2DF" style={{ marginBottom: '1rem', marginTop: '2rem' }}>
              Cube3DLoader (3D Cube with Neon Glow)
            </Text>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '3rem',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                borderRadius: '8px',
              }}
            >
              <Cube3DLoader />
            </div>
            <Text variant="h4" color="#29F2DF" style={{ marginBottom: '1rem', marginTop: '2rem' }}>
              InteractiveProgressLoader (3D Interactive with Hover Control)
            </Text>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '3rem',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                borderRadius: '8px',
                minHeight: '500px',
              }}
            >
              <InteractiveProgressLoader primaryColor="#29F2DF" />
            </div>
            <Text variant="h4" color="#29F2DF" style={{ marginBottom: '1rem', marginTop: '2rem' }}>
              HackerLoaderBinary (Binary Ring with Glitch)
            </Text>
            <Stack
              direction="row"
              gap="2rem"
              style={{ flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <HackerLoaderBinary color="#00ff00" size={100} />
              <HackerLoaderBinary color="#00ffff" size={100} />
              <HackerLoaderBinary color="#ff00ff" size={100} />
              <HackerLoaderBinary color="#ffff00" size={100} />
            </Stack>
            <Text variant="h4" color="#29F2DF" style={{ marginBottom: '1rem', marginTop: '2rem' }}>
              ProgressLoader (Animated Progress Bar with Particles)
            </Text>
            <Stack
              direction="row"
              gap="2rem"
              style={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}
            >
              <ProgressLoader
                progress={25}
                color="#00f260"
                accentColor="#0575e6"
                showPercentage={true}
                showParticles={true}
              />
              <ProgressLoader
                progress={50}
                color="#00ffff"
                accentColor="#ff00ff"
                showPercentage={true}
                showParticles={true}
              />
              <ProgressLoader
                progress={75}
                color="#ffff00"
                accentColor="#ff6600"
                showPercentage={true}
                showParticles={true}
              />
            </Stack>
            <Text variant="h4" color="#29F2DF" style={{ marginBottom: '1rem', marginTop: '2rem' }}>
              AIMatrixLoader (Matrix Digital Animation)
            </Text>
            <Stack
              direction="row"
              gap="2rem"
              style={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}
            >
              <AIMatrixLoader color="#00ff88" size={120} />
              <AIMatrixLoader color="#00ffff" size={120} />
              <AIMatrixLoader color="#ff00ff" size={120} />
              <AIMatrixLoader color="#ffff00" size={120} />
            </Stack>
          </ComponentSection>
          <ComponentSection title="24. ScrollingTextLoader (Scrolling Text Animation)">
            <Stack
              direction="row"
              gap="2rem"
              style={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}
            >
              <ScrollingTextLoader text="Loading" color="#00ffff" size={64} />
              <ScrollingTextLoader text="Loading" color="#ff00ff" size={64} />
              <ScrollingTextLoader text="Loading" color="#00ff88" size={64} />
              <ScrollingTextLoader text="Loading" color="#ffff00" size={64} />
            </Stack>
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Feedback & Alerts',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="27. Modal">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Modal">
              <Text>Modal content</Text>
            </Modal>
          </ComponentSection>
          <ComponentSection title="28. Dialog">
            <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
            <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} title="Dialog">
              <Text>Dialog content</Text>
            </Dialog>
          </ComponentSection>
          <ComponentSection title="29. Notification">
            <Notification type="success" message="Success notification!" />
          </ComponentSection>
          <ComponentSection title="29b. GradientAlert (All Types)">
            <Stack direction="column" gap="1.5rem" style={{ alignItems: 'center' }}>
              <GradientAlert
                type="success"
                message="Success!"
                description="Your operation completed successfully. All systems are operational."
              />
              <GradientAlert
                type="warning"
                message="Warning!"
                description="Please review your settings before proceeding with this action."
              />
              <GradientAlert
                type="error"
                message="Error!"
                description="An error occurred while processing your request. Please try again."
              />
              <GradientAlert
                type="danger"
                message="Danger!"
                description="Critical system error detected. Immediate action required."
              />
              <GradientAlert
                type="info"
                message="Information"
                description="This is an informational message to keep you updated on system status."
              />
            </Stack>
          </ComponentSection>
          <ComponentSection title="29c. HUD Toast Notifications">
            <Text
              variant="body"
              style={{ marginBottom: '1rem', color: '#29F2DF', textAlign: 'center' }}
            >
              Click buttons to trigger toast notifications at bottom-left with HUD effects
            </Text>
            <Stack
              direction="row"
              gap="1rem"
              style={{ flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <HudButton
                onClick={() =>
                  showToast({
                    type: 'success',
                    message: 'Operation Successful',
                    description: 'Your request has been processed successfully.',
                    duration: 4000,
                  })
                }
              >
                SUCCESS TOAST
              </HudButton>
              <HudButton
                onClick={() =>
                  showToast({
                    type: 'warning',
                    message: 'Warning Alert',
                    description: 'Please review your settings before continuing.',
                    duration: 4000,
                  })
                }
              >
                WARNING TOAST
              </HudButton>
              <HudButton
                onClick={() =>
                  showToast({
                    type: 'error',
                    message: 'Error Occurred',
                    description: 'An error was detected during processing.',
                    duration: 4000,
                  })
                }
              >
                ERROR TOAST
              </HudButton>
              <HudButton
                onClick={() =>
                  showToast({
                    type: 'danger',
                    message: 'Critical Alert',
                    description: 'Immediate action required to prevent system failure.',
                    duration: 4000,
                  })
                }
              >
                DANGER TOAST
              </HudButton>
              <HudButton
                onClick={() =>
                  showToast({
                    type: 'info',
                    message: 'System Information',
                    description: 'New updates are available for your system.',
                    duration: 4000,
                  })
                }
              >
                INFO TOAST
              </HudButton>
              <HudButton
                onClick={() =>
                  showToast({
                    type: 'success',
                    message: 'Persistent Toast',
                    description: 'This toast will not auto-dismiss. Click X to close.',
                    duration: 0,
                  })
                }
              >
                PERSISTENT TOAST
              </HudButton>
            </Stack>
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Utility & Tooltips',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="30. Tooltip">
            <Tooltip content="Helpful tip!">
              <Button>Hover me</Button>
            </Tooltip>
          </ComponentSection>
          <ComponentSection title="31. Popover">
            <Popover content={<Text>Popover content</Text>} title="Info">
              <Button>Click me</Button>
            </Popover>
          </ComponentSection>
          <ComponentSection title="32. Dropdown">
            <Dropdown
              items={[
                { key: '1', label: 'Action 1', onClick: () => {} },
                { key: '2', label: 'Action 2', onClick: () => {} },
              ]}
            >
              <Button>Menu</Button>
            </Dropdown>
          </ComponentSection>
          <ComponentSection title="32b. CyberSupportTooltip (Support Dropdown)">
            <Stack
              direction="row"
              gap="2rem"
              style={{ flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <CyberSupportTooltip
                title="Support"
                color="#00c1d5"
                links={[
                  { icon: '📞', label: '000-000-1111', href: 'tel:000-000-1111' },
                  { icon: '🕐', label: '8:30AM - 5PM PST', href: '#' },
                  { icon: '✉️', label: 'uiverse.io', href: 'mailto:support@uiverse.io' },
                ]}
              />
              <CyberSupportTooltip
                title="Help"
                color="#00ff88"
                links={[
                  { icon: '❓', label: 'FAQ', href: '#' },
                  { icon: '📚', label: 'Documentation', href: '#' },
                  { icon: '💬', label: 'Chat Support', href: '#' },
                ]}
              />
              <CyberSupportTooltip
                title="Contact"
                color="#ff00ff"
                links={[
                  { icon: '📧', label: 'Email Us', href: 'mailto:contact@example.com' },
                  { icon: '🔗', label: 'Website', href: '#' },
                  { icon: '🐦', label: 'Twitter', href: '#' },
                ]}
              />
            </Stack>
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Advanced Components',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="33. Accordion">
            <Accordion
              items={[
                { key: '1', title: 'Section 1', content: 'Content 1' },
                { key: '2', title: 'Section 2', content: 'Content 2' },
              ]}
            />
          </ComponentSection>
          <ComponentSection title="34. Stepper">
            <Stepper
              steps={[
                { key: '1', label: 'Step 1' },
                { key: '2', label: 'Step 2' },
                { key: '3', label: 'Step 3' },
              ]}
              currentStep={1}
            />
          </ComponentSection>
          <ComponentSection title="35. Carousel">
            <Carousel
              items={[
                {
                  key: '1',
                  content: (
                    <div style={{ padding: '2rem', background: 'rgba(41, 242, 223, 0.1)' }}>
                      Slide 1
                    </div>
                  ),
                },
                {
                  key: '2',
                  content: (
                    <div style={{ padding: '2rem', background: 'rgba(239, 62, 241, 0.1)' }}>
                      Slide 2
                    </div>
                  ),
                },
              ]}
              currentIndex={carouselIndex}
              onIndexChange={setCarouselIndex}
            />
          </ComponentSection>
          <ComponentSection title="36. CodeEditor">
            <CodeEditor value={codeValue} onChange={setCodeValue} language="javascript" />
          </ComponentSection>
          <ComponentSection title="36. RichTextEditor">
            <RichTextEditor value="<p>Rich text</p>" onChange={() => {}} />
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Charts & Visualization',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="37. Chart">
            <Chart data={chartData} type="bar" width={600} height={300} />
          </ComponentSection>
          <ComponentSection title="38. Bubble Chart">
            <Stack direction="column" gap="1rem">
              <Text variant="body" style={{ color: '#29F2DF' }}>
                RHUDS Theme:
              </Text>
              <RhudsBubbleChartStyled
                data={[
                  { x: 20, y: 30, r: 15, label: 'Q1', color: '#29F2DF' },
                  { x: 35, y: 50, r: 20, label: 'Q2', color: '#1C7FA6' },
                  { x: 50, y: 65, r: 25, label: 'Q3', color: '#EF3EF1' },
                  { x: 65, y: 75, r: 30, label: 'Q4', color: '#29F2DF' },
                ]}
                width={600}
                height={400}
                xLabel="Market Share (%)"
                yLabel="Revenue Growth (%)"
              />
            </Stack>
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'Animated Backgrounds',
      content: (
        <Stack direction="column" gap="2rem">
          <ComponentSection title="38. GridLines">
            <div
              style={{
                position: 'relative',
                height: '200px',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                borderRadius: '8px',
              }}
            >
              <GridLines width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="39. Dots">
            <div
              style={{
                position: 'relative',
                height: '200px',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                borderRadius: '8px',
              }}
            >
              <Dots width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="40. Puffs">
            <div
              style={{
                position: 'relative',
                height: '200px',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                borderRadius: '8px',
              }}
            >
              <Puffs width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="41. MovingLines">
            <div
              style={{
                position: 'relative',
                height: '200px',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                borderRadius: '8px',
              }}
            >
              <MovingLines width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="42. Nebula">
            <div
              style={{
                position: 'relative',
                height: '200px',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                borderRadius: '8px',
              }}
            >
              <Nebula width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="43. StarField">
            <div
              style={{
                position: 'relative',
                height: '200px',
                background: 'rgba(41, 242, 223, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                borderRadius: '8px',
              }}
            >
              <StarField width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="44. AnimatedGradient">
            <div style={{ position: 'relative', height: '200px' }}>
              <AnimatedGradient width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="45. Plasma">
            <div style={{ position: 'relative', height: '200px' }}>
              <Plasma width={600} height={200} />
            </div>
          </ComponentSection>
          <ComponentSection title="44b. RainPattern (Matrix Rain)">
            <div
              style={{
                position: 'relative',
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <RainPattern width={600} height={400} color="#09f" speed={150} />
            </div>
          </ComponentSection>
          <ComponentSection title="44c. CircuitPattern (Circuit Board)">
            <div
              style={{
                position: 'relative',
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircuitPattern
                width={600}
                height={400}
                color="rgba(34, 197, 94, 0.15)"
                opacity={1}
              />
            </div>
            <Text
              variant="caption"
              style={{ marginTop: '1rem', color: '#22c55e', textAlign: 'center' }}
            >
              Dark circuit board pattern with grid lines and connection dots
            </Text>
          </ComponentSection>
        </Stack>
      ),
    },
    {
      label: 'HUD Frames',
      content: <FramesTabContent />,
    },
  ];

  return (
    <div
      ref={pageRef}
      style={{
        padding: 0,
        background: '#0A1225',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <AnimatedBackground />

      <div
        style={{
          padding: 'clamp(1rem, 3vw, 2rem) clamp(0.5rem, 2vw, 1rem)',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 1,
          marginTop: '70px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <Text
            variant="h1"
            style={{
              color: '#29F2DF',
              marginBottom: '1rem',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              fontWeight: 800,
              textShadow: '0 0 20px rgba(41, 242, 223, 0.6), 0 0 40px rgba(41, 242, 223, 0.3)',
            }}
          >
            🎮 COMPONENT SHOWCASE
          </Text>
          <Text
            variant="body"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              opacity: 0.9,
              color: '#29F2DF',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            51 Production-Ready Components
          </Text>
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* Category Menu */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              padding: '1rem',
              background: 'rgba(41, 242, 223, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(41, 242, 223, 0.2)',
              marginBottom: '2rem',
            }}
          >
            {tabItems.map((item, index) => (
              <Button
                key={index}
                onClick={() => setActiveTab(index)}
                style={{
                  background: activeTab === index ? '#29F2DF' : 'transparent',
                  color: activeTab === index ? '#000' : '#29F2DF',
                  border: `1px solid #29F2DF`,
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: activeTab === index ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '4px',
                  boxShadow: activeTab === index ? '0 0 15px rgba(41, 242, 223, 0.5)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Content */}
          <div
            style={{
              padding: 'clamp(1rem, 3vw, 2rem)',
              background: 'rgba(41, 242, 223, 0.03)',
              borderRadius: '8px',
              border: '1px solid rgba(41, 242, 223, 0.2)',
              maxWidth: '100%',
              boxSizing: 'border-box',
              overflowX: 'hidden',
            }}
          >
            {activeTab === 0 && <div>{tabItems[0].content}</div>}
            {activeTab === 1 && <div>{tabItems[1].content}</div>}
            {activeTab === 2 && <div>{tabItems[2].content}</div>}
            {activeTab === 3 && <div>{tabItems[3].content}</div>}
            {activeTab === 4 && <div>{tabItems[4].content}</div>}
            {activeTab === 5 && <div>{tabItems[5].content}</div>}
            {activeTab === 6 && <div>{tabItems[6].content}</div>}
            {activeTab === 7 && <div>{tabItems[7].content}</div>}
            {activeTab === 8 && <div>{tabItems[8].content}</div>}
            {activeTab === 9 && <div>{tabItems[9].content}</div>}
            {activeTab === 10 && <div>{tabItems[10].content}</div>}
          </div>
        </div>

        <div
          style={{
            marginTop: 'clamp(2rem, 4vw, 3rem)',
            padding: 'clamp(1rem, 3vw, 2rem)',
            background: 'rgba(41, 242, 223, 0.05)',
            borderRadius: '8px',
            border: `2px solid rgba(41, 242, 223, 0.3)`,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(41, 242, 223, 0.2)',
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflowX: 'hidden',
          }}
        >
          <Text
            variant="h2"
            style={{
              color: '#29F2DF',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textShadow: '0 0 15px rgba(41, 242, 223, 0.6)',
            }}
          >
            📦 COMPLETE COMPONENT LIBRARY
          </Text>
          <Grid
            columns={4}
            gap={2}
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100px, 100%), 1fr))',
              maxWidth: '100%',
              width: '100%',
            }}
          >
            <StatCard title="5" subtitle="Basic" color={theme.currentMode.tokens.colors.primary} />
            <StatCard title="3" subtitle="Layout" color={theme.currentMode.tokens.colors.success} />
            <StatCard title="7" subtitle="Form" color={theme.currentMode.tokens.colors.secondary} />
            <StatCard
              title="6"
              subtitle="Navigation"
              color={theme.currentMode.tokens.colors.warning}
            />
            <StatCard
              title="3"
              subtitle="Data Display"
              color={theme.currentMode.tokens.colors.error}
            />
            <StatCard title="4" subtitle="Feedback" color={theme.currentMode.tokens.colors.info} />
            <StatCard
              title="3"
              subtitle="Utility"
              color={theme.currentMode.tokens.colors.primary}
            />
            <StatCard
              title="5"
              subtitle="Advanced"
              color={theme.currentMode.tokens.colors.success}
            />
            <StatCard
              title="2"
              subtitle="Visualization"
              color={theme.currentMode.tokens.colors.secondary}
            />
            <StatCard
              title="9"
              subtitle="Backgrounds"
              color={theme.currentMode.tokens.colors.warning}
            />
            <StatCard title="7" subtitle="Frames" color="#29F2DF" />
          </Grid>
          <Text
            variant="h1"
            style={{
              color: '#29F2DF',
              marginTop: '2rem',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              fontWeight: 900,
              textShadow: '0 0 20px rgba(41, 242, 223, 0.8)',
            }}
          >
            51 COMPONENTS
          </Text>
        </div>
      </div>
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
        border: `1px solid rgba(41, 242, 223, 0.2)`,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(41, 242, 223, 0.1)',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <Text
        variant="h3"
        style={{
          marginBottom: '1.5rem',
          color: '#29F2DF',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontSize: '1.1rem',
          fontWeight: 700,
          textShadow: '0 0 10px rgba(41, 242, 223, 0.5)',
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
  <div
    style={{
      padding: 'clamp(0.75rem, 2vw, 1.5rem)',
      background: `linear-gradient(135deg, ${color}15, ${color}05)`,
      border: `1px solid ${color}40`,
      borderRadius: '4px',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      boxShadow: `0 4px 20px ${color}20`,
      transition: 'all 0.3s ease',
    }}
  >
    <Text
      variant="h3"
      style={{
        color,
        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
        fontWeight: 800,
        marginBottom: '0.5rem',
        textShadow: `0 0 15px ${color}80`,
      }}
    >
      {title}
    </Text>
    <Text
      variant="body"
      style={{
        color: color,
        opacity: 0.9,
        fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: 600,
      }}
    >
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
    <div
      style={{
        background: 'rgba(0, 10, 20, 0.6)',
        border: `1px solid ${color}33`,
        borderRadius: '4px',
        padding: 'clamp(0.75rem, 2vw, 1rem)',
        backdropFilter: 'blur(10px)',
        boxShadow: `0 4px 20px ${color}15`,
      }}
    >
      <Text
        variant="caption"
        style={{
          marginBottom: '10px',
          display: 'block',
          color: color,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
          fontWeight: 600,
        }}
      >
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
    <Stack
      direction="column"
      gap="2rem"
      style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}
    >
      {/* ClipPath Examples */}
      <ComponentSection title="CSS ClipPath Frames">
        <Text
          variant="body"
          style={{
            marginBottom: '1rem',
            opacity: 0.8,
            color: '#29F2DF',
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          }}
        >
          Using CSS clip-path for lightweight frame shapes (faster rendering)
        </Text>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))',
            gap: 'clamp(10px, 2vw, 20px)',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div>
            <Text
              variant="caption"
              style={{
                marginBottom: '10px',
                display: 'block',
                color: '#29F2DF',
                textTransform: 'uppercase',
                fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
              }}
            >
              Octagon (All Corners)
            </Text>
            <div
              style={{
                width: '100%',
                height: 'clamp(80px, 15vw, 100px)',
                clipPath: createFrameOctagonClip({ squareSize: 16 }),
                background:
                  'linear-gradient(135deg, rgba(41, 242, 223, 0.2), rgba(41, 242, 223, 0.05))',
                border: '1px solid rgba(41, 242, 223, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#29F2DF',
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
            <Text
              variant="caption"
              style={{
                marginBottom: '10px',
                display: 'block',
                color: '#e91e63',
                textTransform: 'uppercase',
                fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
              }}
            >
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
                background:
                  'linear-gradient(135deg, rgba(233, 30, 99, 0.2), rgba(233, 30, 99, 0.05))',
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
            <Text
              variant="caption"
              style={{
                marginBottom: '10px',
                display: 'block',
                color: '#ffeb3b',
                textTransform: 'uppercase',
                fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
              }}
            >
              Kranox
            </Text>
            <div
              style={{
                width: '100%',
                height: 'clamp(80px, 15vw, 100px)',
                clipPath: createFrameKranoxClip({ squareSize: 16 }),
                background:
                  'linear-gradient(135deg, rgba(255, 235, 59, 0.2), rgba(255, 235, 59, 0.05))',
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
      <ComponentSection title="46. HUD Frame Generator">
        <Text
          variant="body"
          style={{
            marginBottom: '1rem',
            opacity: 0.8,
            color: '#29F2DF',
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          }}
        >
          Procedural HUD frame with randomized sci-fi borders
        </Text>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 'min(500px, 100%)',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '100%',
                margin: '0 auto',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '384px',
                  transform: 'scale(1)',
                  transformOrigin: 'center',
                }}
              >
                <HudFrameWithControls
                  width={384}
                  height={150}
                  showControls={true}
                  showSeedInput={true}
                >
                  <div
                    style={{
                      fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
                      lineHeight: '1.4',
                      color: '#29F2DF',
                    }}
                  ></div>
                </HudFrameWithControls>
              </div>
            </div>
          </div>
        </div>
      </ComponentSection>

      {/* Animated Frames */}
      <ComponentSection title="SVG Frames with Assembling Animation">
        <Text
          variant="body"
          style={{
            marginBottom: '1rem',
            opacity: 0.8,
            color: '#29F2DF',
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          }}
        >
          All frames feature stroke-dasharray animation - lines appear gradually
        </Text>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
            gap: 'clamp(10px, 2vw, 20px)',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
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
        <div
          style={{
            background: 'rgba(41, 242, 223, 0.05)',
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            borderRadius: '4px',
            border: '1px solid rgba(41, 242, 223, 0.2)',
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflowX: 'auto',
          }}
        >
          <Text
            variant="h4"
            style={{
              marginBottom: '1rem',
              color: '#29F2DF',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            }}
          >
            Frame with Animation:
          </Text>
          <pre
            style={{
              background: 'rgba(41, 242, 223, 0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(41, 242, 223, 0.3)',
              padding: 'clamp(10px, 2vw, 15px)',
              borderRadius: '4px',
              overflowX: 'auto',
              fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
              color: '#29F2DF',
              lineHeight: '1.6',
              maxWidth: '100%',
              boxSizing: 'border-box',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
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
          fill: rgba(41, 242, 223, 0.08); 
          filter: drop-shadow(0 0 8px rgba(41, 242, 223, 0.4));
        }
        [data-name=line] { 
          stroke: #29F2DF; 
          filter: drop-shadow(0 0 8px rgba(41, 242, 223, 0.8));
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
    setKey((prev) => prev + 1);
  }, []);

  return (
    <FrameCard
      title="46. FrameSVGOctagon"
      color="#29F2DF"
      onReplay={() => setKey((prev) => prev + 1)}
    >
      <div
        key={key}
        style={{ position: 'relative', width: '100%', height: 'clamp(150px, 30vw, 200px)' }}
      >
        <style>
          {`
            .frame-octagon-animated svg [data-name=bg] {
              fill: rgba(41, 242, 223, 0.08) !important;
              filter: drop-shadow(0 0 8px rgba(41, 242, 223, 0.4)) !important;
            }
            .frame-octagon-animated svg [data-name=line] {
              stroke: #29F2DF !important;
              fill: none !important;
              stroke-width: 1.5 !important;
              filter: drop-shadow(0 0 8px rgba(41, 242, 223, 0.8)) !important;
            }
          `}
        </style>
        <div className="frame-octagon-animated">
          <FrameSVGOctagon elementRef={svgRef} onRender={onRender} padding={4} squareSize={16} />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 'clamp(20px, 5vw, 30px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <Text
            variant="body"
            style={{
              color: '#29F2DF',
              marginBottom: '5px',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(41, 242, 223, 0.8)',
              textTransform: 'uppercase',
              letterSpacing: 'clamp(1px, 0.3vw, 2px)',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            }}
          >
            OCTAGON
          </Text>
          <Text
            variant="caption"
            style={{
              opacity: 0.8,
              color: '#29F2DF',
              fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
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
    setKey((prev) => prev + 1);
  }, []);

  return (
    <FrameCard
      title="47. FrameSVGKranox"
      color="#ffeb3b"
      onReplay={() => setKey((prev) => prev + 1)}
    >
      <div
        key={key}
        style={{ position: 'relative', width: '100%', height: 'clamp(150px, 30vw, 200px)' }}
      >
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
        <div
          style={{
            position: 'absolute',
            inset: 'clamp(20px, 5vw, 30px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <Text
            variant="body"
            style={{
              color: '#ffeb3b',
              marginBottom: '5px',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(255, 235, 59, 0.8)',
              textTransform: 'uppercase',
              letterSpacing: 'clamp(1px, 0.3vw, 2px)',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            }}
          >
            KRANOX
          </Text>
          <Text
            variant="caption"
            style={{
              opacity: 0.8,
              color: '#ffeb3b',
              fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
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
    setKey((prev) => prev + 1);
  }, []);

  return (
    <FrameCard
      title="48. FrameSVGCorners"
      color="#4caf50"
      onReplay={() => setKey((prev) => prev + 1)}
    >
      <div
        key={key}
        style={{ position: 'relative', width: '100%', height: 'clamp(150px, 30vw, 200px)' }}
      >
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
        <div
          style={{
            position: 'absolute',
            inset: 'clamp(20px, 5vw, 30px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <Text
            variant="body"
            style={{
              color: '#4caf50',
              marginBottom: '5px',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(76, 175, 80, 0.8)',
              textTransform: 'uppercase',
              letterSpacing: 'clamp(1px, 0.3vw, 2px)',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            }}
          >
            CORNERS
          </Text>
          <Text
            variant="caption"
            style={{
              opacity: 0.8,
              color: '#4caf50',
              fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
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
    setKey((prev) => prev + 1);
  }, []);

  return (
    <FrameCard
      title="49. FrameSVGLines"
      color="#e91e63"
      onReplay={() => setKey((prev) => prev + 1)}
    >
      <div
        key={key}
        style={{ position: 'relative', width: '100%', height: 'clamp(150px, 30vw, 200px)' }}
      >
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
        <div
          style={{
            position: 'absolute',
            inset: 'clamp(20px, 5vw, 30px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <Text
            variant="body"
            style={{
              color: '#e91e63',
              marginBottom: '5px',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(233, 30, 99, 0.8)',
              textTransform: 'uppercase',
              letterSpacing: 'clamp(1px, 0.3vw, 2px)',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            }}
          >
            LINES
          </Text>
          <Text
            variant="caption"
            style={{
              opacity: 0.8,
              color: '#e91e63',
              fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
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
    setKey((prev) => prev + 1);
  }, []);

  return (
    <FrameCard
      title="50. FrameSVGUnderline"
      color="#ff9800"
      onReplay={() => setKey((prev) => prev + 1)}
    >
      <div
        key={key}
        style={{ position: 'relative', width: '100%', height: 'clamp(150px, 30vw, 200px)' }}
      >
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
        <div
          style={{
            position: 'absolute',
            inset: 'clamp(20px, 5vw, 30px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <Text
            variant="body"
            style={{
              color: '#ff9800',
              marginBottom: '5px',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(255, 152, 0, 0.8)',
              textTransform: 'uppercase',
              letterSpacing: 'clamp(1px, 0.3vw, 2px)',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            }}
          >
            UNDERLINE
          </Text>
          <Text
            variant="caption"
            style={{
              opacity: 0.8,
              color: '#ff9800',
              fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
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
    setKey((prev) => prev + 1);
  }, []);

  return (
    <FrameCard
      title="51. FrameSVGNefrex"
      color="#03a9f4"
      onReplay={() => setKey((prev) => prev + 1)}
    >
      <div
        key={key}
        style={{ position: 'relative', width: '100%', height: 'clamp(150px, 30vw, 200px)' }}
      >
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
        <div
          style={{
            position: 'absolute',
            inset: 'clamp(30px, 8vw, 50px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <Text
            variant="body"
            style={{
              color: '#03a9f4',
              marginBottom: '5px',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(3, 169, 244, 0.8)',
              textTransform: 'uppercase',
              letterSpacing: 'clamp(1px, 0.3vw, 2px)',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            }}
          >
            NEFREX
          </Text>
          <Text
            variant="caption"
            style={{
              opacity: 0.8,
              color: '#03a9f4',
              fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Complex Style
          </Text>
        </div>
      </div>
    </FrameCard>
  );
};
