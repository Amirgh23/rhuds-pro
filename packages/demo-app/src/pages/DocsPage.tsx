import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Text, Stack, Button, HudButton, GlitchButton, Input, HackerInput, Select, Checkbox, HoloCheckbox, Switch, Slider, Icon,
  Modal, Table, Tabs, Accordion, Radio, RadioGroup, Breadcrumb,
  Pagination, Grid, Container, Tooltip, Popover, Dropdown, Stepper,
  ColorPicker, DatePicker, Navbar, Sidebar, Menu, DataGrid, Tree, CyberCard, HudBox, HudFrame,
  Dialog, Notification, Carousel, FileUpload, Chart
} from '@rhuds/components';
import { ComponentPlayground } from '../components/ComponentPlayground';

// Notification Demo Component
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

// Chart Demo Component
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

// Modal Demo Component
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



const docs: Record<string, { title: string; category: string; content: string }> = {
  'getting-started': { title: 'Getting Started', category: 'Introduction', content: 'Welcome to RHUDS Pro with 40+ visual components.' },
  // Basic (5)
  'text': { title: 'Text', category: 'Basic', content: 'Typography component with variants.' },
  'button': { title: 'Button', category: 'Basic', content: 'Interactive button with variants.' },
  'hudbutton': { title: 'HudButton', category: 'Basic', content: 'Futuristic HUD-style button with glowing effects.' },
  'glitchbutton': { title: 'GlitchButton', category: 'Basic', content: 'Retro glitch-style button with VT323 monospace font.' },
  'icon': { title: 'Icon', category: 'Basic', content: 'Icon display component.' },
  'input': { title: 'Input', category: 'Basic', content: 'Text input with validation.' },
  'hackerinput': { title: 'HackerInput', category: 'Basic', content: 'Matrix-style hacker input with glowing effects.' },
  'select': { title: 'Select', category: 'Basic', content: 'Dropdown select with search.' },
  // Layout (4)
  'grid': { title: 'Grid', category: 'Layout', content: 'Responsive grid layout.' },
  'container': { title: 'Container', category: 'Layout', content: 'Container with max-width.' },
  'stack': { title: 'Stack', category: 'Layout', content: 'Flex layout component.' },
  'hudbox': { title: 'HudBox', category: 'Layout', content: 'Asymmetrical HUD-style container with animated borders.' },
  'hudframe': { title: 'HudFrame', category: 'Layout', content: 'Complex HUD frame with neon lines and title box.' },
  // Form (5)
  'checkbox': { title: 'Checkbox', category: 'Form', content: 'Checkbox for selections.' },
  'holocheckbox': { title: 'HoloCheckbox', category: 'Form', content: 'Holographic 3D checkbox with futuristic effects.' },
  'radio': { title: 'Radio', category: 'Form', content: 'Radio button group.' },
  'switch': { title: 'Switch', category: 'Form', content: 'Toggle switch.' },
  'useform': { title: 'useForm', category: 'Form', content: 'Form validation hook.' },
  // Navigation (6)
  'navbar': { title: 'Navbar', category: 'Navigation', content: 'Navigation bar.' },
  'sidebar': { title: 'Sidebar', category: 'Navigation', content: 'Side navigation.' },
  'breadcrumb': { title: 'Breadcrumb', category: 'Navigation', content: 'Breadcrumb trail.' },
  'tabs': { title: 'Tabs', category: 'Navigation', content: 'Tabbed content.' },
  'menu': { title: 'Menu', category: 'Navigation', content: 'Dropdown menu.' },
  'pagination': { title: 'Pagination', category: 'Navigation', content: 'Page navigation.' },
  // Data Display (3)
  'table': { title: 'Table', category: 'Data Display', content: 'Data table with sorting.' },
  'datagrid': { title: 'DataGrid', category: 'Data Display', content: 'Advanced data grid.' },
  'tree': { title: 'Tree', category: 'Data Display', content: 'Tree view component.' },
  'cybercard': { title: 'CyberCard', category: 'Data Display', content: 'Futuristic HUD-style card with glitch effects.' },
  // Feedback (4)
  'modal': { title: 'Modal', category: 'Feedback', content: 'Modal dialog with Portal.' },
  'dialog': { title: 'Dialog', category: 'Feedback', content: 'Dialog with actions.' },
  'notification': { title: 'Notification', category: 'Feedback', content: 'Toast notifications.' },
  'notificationprovider': { title: 'NotificationProvider', category: 'Feedback', content: 'Notification context provider.' },
  // Utility (4)
  'tooltip': { title: 'Tooltip', category: 'Utility', content: 'Tooltip with positioning.' },
  'popover': { title: 'Popover', category: 'Utility', content: 'Popover with content.' },
  'dropdown': { title: 'Dropdown', category: 'Utility', content: 'Dropdown menu.' },
  'portal': { title: 'Portal', category: 'Utility', content: 'Portal rendering component.' },
  // Advanced (5)
  'carousel': { title: 'Carousel', category: 'Advanced', content: 'Image carousel.' },
  'accordion': { title: 'Accordion', category: 'Advanced', content: 'Expandable sections.' },
  'stepper': { title: 'Stepper', category: 'Advanced', content: 'Step progress.' },
  'codeeditor': { title: 'Code Editor', category: 'Advanced', content: 'Code editing component.' },
  'richtexteditor': { title: 'Rich Text Editor', category: 'Advanced', content: 'WYSIWYG editor.' },
  // Specialized (4)
  'slider': { title: 'Slider', category: 'Specialized', content: 'Range slider component.' },
  'colorpicker': { title: 'Color Picker', category: 'Specialized', content: 'Color selection.' },
  'datepicker': { title: 'Date Picker', category: 'Specialized', content: 'Date selection.' },
  'fileupload': { title: 'File Upload', category: 'Specialized', content: 'File upload component.' },
  // Visualization (1)
  'chart': { title: 'Chart', category: 'Visualization', content: 'Data visualization charts.' },
};

export const DocsPage: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const validSection = section && section in docs ? section : 'getting-started';
  const [selectedDoc, setSelectedDoc] = useState(validSection);
  const [hudBoxAnimated, setHudBoxAnimated] = useState(true);

  React.useEffect(() => {
    if (section && section in docs) {
      setSelectedDoc(section);
    }
  }, [section]);

  const currentDoc = docs[selectedDoc];

  const categories = {
    'Introduction': ['getting-started'],
    'Basic (8)': ['text', 'button', 'hudbutton', 'glitchbutton', 'icon', 'input', 'hackerinput', 'select'],
    'Layout (5)': ['grid', 'container', 'stack', 'hudbox', 'hudframe'],
    'Form (5)': ['checkbox', 'holocheckbox', 'radio', 'switch', 'useform'],
    'Navigation (6)': ['navbar', 'sidebar', 'breadcrumb', 'tabs', 'menu', 'pagination'],
    'Data Display (4)': ['table', 'datagrid', 'tree', 'cybercard'],
    'Feedback (4)': ['modal', 'dialog', 'notification', 'notificationprovider'],
    'Utility (4)': ['tooltip', 'popover', 'dropdown', 'portal'],
    'Advanced (5)': ['carousel', 'accordion', 'stepper', 'codeeditor', 'richtexteditor'],
    'Specialized (4)': ['slider', 'colorpicker', 'datepicker', 'fileupload'],
    'Visualization (1)': ['chart'],
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{
        width: '280px',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRight: '1px solid rgba(0, 246, 255, 0.3)',
        padding: '2rem 1rem',
        overflowY: 'auto',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        <Text variant="h3" style={{ color: '#00f6ff', marginBottom: '0.5rem', paddingLeft: '1rem' }}>
          Documentation
        </Text>
        <Text variant="caption" style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '1.5rem', paddingLeft: '1rem', display: 'block' }}>
          43 Components
        </Text>

        {Object.entries(categories).map(([category, items]) => (
          <div key={category} style={{ marginBottom: '1.5rem' }}>
            <Text variant="caption" style={{
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '0.5rem',
              paddingLeft: '1rem',
              display: 'block',
              textTransform: 'uppercase',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}>
              {category}
            </Text>
            {items.map((doc) => (
              <Link key={doc} to={`/docs/${doc}`} style={{ textDecoration: 'none' }}>
                <button
                  onClick={() => setSelectedDoc(doc)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.6rem 1rem',
                    background: selectedDoc === doc ? 'rgba(0, 246, 255, 0.2)' : 'transparent',
                    border: 'none',
                    color: selectedDoc === doc ? '#00f6ff' : 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    fontSize: '0.85rem',
                  }}
                >
                  {docs[doc].title}
                </button>
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: '#0a0e27' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h1 style={{ color: '#00f6ff', marginBottom: '0.5rem', fontSize: '2.5rem', fontWeight: 'bold' }}>
            {currentDoc.title}
          </h1>
          <Text variant="caption" style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '2rem', display: 'block' }}>
            {currentDoc.category}
          </Text>

          <div style={{
            fontSize: '1.05rem',
            lineHeight: '1.8',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '3rem',
          }}>
            {currentDoc.content}
          </div>

          {/* Examples for each component */}
          {selectedDoc === 'text' && (
            <ComponentPlayground title="Text Example" description="Typography variants"
              code={`<Text variant="h1">Heading 1</Text>`}
            >
              <Stack direction="column" gap="1rem">
                <Text variant="h1">Heading 1</Text>
                <Text variant="h2">Heading 2</Text>
                <Text variant="body">Body text</Text>
                <Text variant="caption">Caption text</Text>
              </Stack>
            </ComponentPlayground>
          )}

          {selectedDoc === 'button' && (
            <ComponentPlayground title="Button Examples" description="All variants"
              code={`<Button variant="primary">Primary</Button>`}
            >
              <Stack direction="row" gap="1rem" style={{ flexWrap: 'wrap' }}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="warning">Warning</Button>
              </Stack>
            </ComponentPlayground>
          )}

          {selectedDoc === 'hudbutton' && (
            <ComponentPlayground 
              title="HudButton Examples" 
              description="Futuristic HUD-style button with glowing effects"
              code={`<HudButton onClick={handleClick}>I'M READY</HudButton>`}
            >
              <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '2rem', borderRadius: '8px' }}>
                <Stack direction="column" gap="2rem">
                  <div>
                    <Text variant="h4" style={{ color: '#1BFD9C', marginBottom: '1rem' }}>
                      Basic Usage
                    </Text>
                    <Stack direction="row" gap="1rem" style={{ flexWrap: 'wrap' }}>
                      <HudButton onClick={() => alert('Clicked!')}>I'M READY</HudButton>
                      <HudButton onClick={() => alert('Launching...')}>LAUNCH</HudButton>
                      <HudButton onClick={() => alert('Activated!')}>ACTIVATE</HudButton>
                      <HudButton onClick={() => alert('Engaged!')}>ENGAGE</HudButton>
                    </Stack>
                  </div>
                  
                  <div>
                    <Text variant="h4" style={{ color: '#1BFD9C', marginBottom: '1rem' }}>
                      Disabled State
                    </Text>
                    <Stack direction="row" gap="1rem" style={{ flexWrap: 'wrap' }}>
                      <HudButton disabled>DISABLED</HudButton>
                      <HudButton disabled>OFFLINE</HudButton>
                    </Stack>
                  </div>

                  <div>
                    <Text variant="h4" style={{ color: '#1BFD9C', marginBottom: '1rem' }}>
                      Usage Code
                    </Text>
                    <pre style={{
                      background: '#000',
                      padding: '1rem',
                      borderRadius: '4px',
                      color: '#1BFD9C',
                      fontSize: '0.85rem',
                      overflow: 'auto',
                      border: '1px solid rgba(27, 253, 156, 0.3)',
                    }}>
{`import { HudButton } from '@rhuds/components';

function MyComponent() {
  const handleLaunch = () => {
    console.log('Launching...');
  };

  return (
    <>
      <HudButton onClick={handleLaunch}>
        LAUNCH SEQUENCE
      </HudButton>
      <HudButton disabled>
        OFFLINE
      </HudButton>
    </>
  );
}`}
                    </pre>
                  </div>

                  <div>
                    <Text variant="h4" style={{ color: '#1BFD9C', marginBottom: '1rem' }}>
                      Features
                    </Text>
                    <Stack direction="column" gap="0.5rem">
                      <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        • Neon green (#1BFD9C) HUD aesthetic
                      </Text>
                      <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        • Glowing border and shadow effects
                      </Text>
                      <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        • Light wave animation on hover
                      </Text>
                      <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        • Integrated with Bleeps audio system
                      </Text>
                      <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        • Perfect for cyberpunk/futuristic UIs
                      </Text>
                    </Stack>
                  </div>
                </Stack>
              </div>
            </ComponentPlayground>
          )}

          {selectedDoc === 'glitchbutton' && (
            <ComponentPlayground 
              title="GlitchButton Examples" 
              description="Retro glitch-style button with VT323 monospace font and glitch effects"
              code={`<GlitchButton onClick={handleClick}>// Hover me</GlitchButton>`}
            >
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2rem', borderRadius: '8px' }}>
                <Stack direction="column" gap="2rem">
                  <div>
                    <Text variant="h4" style={{ color: '#ffff00', marginBottom: '1rem' }}>
                      Basic Usage
                    </Text>
                    <Stack direction="row" gap="1rem" style={{ flexWrap: 'wrap' }}>
                      <GlitchButton onClick={() => alert('Clicked!')}>// Hover me</GlitchButton>
                      <GlitchButton onClick={() => alert('Executing...')}>// Execute</GlitchButton>
                      <GlitchButton onClick={() => alert('Running!')}>// Run code</GlitchButton>
                      <GlitchButton onClick={() => alert('Processing!')}>// Process</GlitchButton>
                    </Stack>
                  </div>
                  
                  <div>
                    <Text variant="h4" style={{ color: '#ffff00', marginBottom: '1rem' }}>
                      Disabled State
                    </Text>
                    <Stack direction="row" gap="1rem" style={{ flexWrap: 'wrap' }}>
                      <GlitchButton disabled>// Disabled</GlitchButton>
                      <GlitchButton disabled>// Offline</GlitchButton>
                    </Stack>
                  </div>

                  <div>
                    <Text variant="h4" style={{ color: '#ffff00', marginBottom: '1rem' }}>
                      Usage Code
                    </Text>
                    <pre style={{
                      background: '#000',
                      padding: '1rem',
                      borderRadius: '4px',
                      color: '#ffff00',
                      fontSize: '0.85rem',
                      overflow: 'auto',
                      border: '1px solid rgba(255, 255, 0, 0.3)',
                    }}>
{`import { GlitchButton } from '@rhuds/components';

function MyComponent() {
  const handleExecute = () => {
    console.log('Executing...');
  };

  return (
    <>
      <GlitchButton onClick={handleExecute}>
        // Execute command
      </GlitchButton>
      <GlitchButton disabled>
        // Disabled
      </GlitchButton>
    </>
  );
}`}
                    </pre>
                  </div>

                  <div>
                    <Text variant="h4" style={{ color: '#ffff00', marginBottom: '1rem' }}>
                      Features
                    </Text>
                    <Stack direction="column" gap="0.5rem">
                      <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        • VT323 monospace font for retro terminal look
                      </Text>
                      <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        • RGB glitch animation on hover (magenta, green, blue, cyan)
                      </Text>
                      <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        • HUD-style cyan color (#00f6ff) visible on any background
                      </Text>
                      <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        • Glowing border and shadow effects
                      </Text>
                      <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        • Blinking text decoration and arrow
                      </Text>
                      <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        • Integrated with Bleeps audio system
                      </Text>
                      <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        • Perfect for retro/terminal/hacker UIs
                      </Text>
                    </Stack>
                  </div>
                </Stack>
              </div>
            </ComponentPlayground>
          )}

          {selectedDoc === 'icon' && (
            <ComponentPlayground title="Icon Example" description="Icon component"
              code={`<Icon name="home" size={24} />`}
            >
              <Stack direction="row" gap="1rem">
                <Icon name="home" size={24} />
                <Icon name="settings" size={32} />
                <Icon name="user" size={40} />
              </Stack>
            </ComponentPlayground>
          )}

          {selectedDoc === 'input' && (
            <ComponentPlayground title="Input Example" description="Text input"
              code={`<Input label="Username" />`}
            >
              <Input label="Username" placeholder="Enter username" />
            </ComponentPlayground>
          )}

          {selectedDoc === 'hackerinput' && (
            <ComponentPlayground 
              title="HackerInput Examples" 
              description="Matrix-style hacker input with glowing effects and animations"
              code={`<HackerInput label="Input Command" placeholder="Type command..." />`}
            >
              <div style={{ background: 'rgba(0, 0, 0, 0.8)', padding: '2rem', borderRadius: '8px' }}>
                <Stack direction="column" gap="2rem">
                  <div>
                    <Text variant="h4" color="#00ff00" style={{ marginBottom: '1rem' }}>
                      Basic Usage
                    </Text>
                    <Stack direction="column" gap="1rem">
                      <HackerInput 
                        label="Input Command" 
                        placeholder="Type command..." 
                      />
                      <HackerInput 
                        label="Access Code" 
                        type="password"
                        placeholder="Enter access code..." 
                      />
                      <HackerInput 
                        label="System Query" 
                        placeholder="Query database..." 
                      />
                    </Stack>
                  </div>

                  <div>
                    <Text variant="h4" color="#00ff00" style={{ marginBottom: '1rem' }}>
                      Features
                    </Text>
                    <Stack direction="column" gap="0.5rem">
                      <Text variant="body" color="#00cc00">• Matrix green (#00ff00) color scheme</Text>
                      <Text variant="body" color="#00cc00">• Glowing border with enhanced glow on focus</Text>
                      <Text variant="body" color="#00cc00">• Scanline animation effect</Text>
                      <Text variant="body" color="#00cc00">• Blinking cursor indicator</Text>
                      <Text variant="body" color="#00cc00">• Glitch effect on hover</Text>
                      <Text variant="body" color="#00cc00">• Floating label animation</Text>
                      <Text variant="body" color="#00cc00">• Courier New monospace font</Text>
                    </Stack>
                  </div>

                  <div style={{
                    background: 'rgba(0, 255, 0, 0.05)',
                    padding: '1.5rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 255, 0, 0.3)',
                  }}>
                    <Text variant="code" color="#00ff00" style={{ whiteSpace: 'pre-wrap' }}>
{`import { HackerInput } from '@rhuds/components';

function MyComponent() {
  const [command, setCommand] = useState('');

  return (
    <HackerInput
      label="Input Command"
      placeholder="Type command..."
      value={command}
      onChange={(e) => setCommand(e.target.value)}
    />
  );
}`}
                    </Text>
                  </div>
                </Stack>
              </div>
            </ComponentPlayground>
          )}

          {selectedDoc === 'select' && (
            <ComponentPlayground title="Select Example" description="Dropdown"
              code={`<Select options={options} />`}
            >
              <Select
                options={[
                  { value: '1', label: 'React' },
                  { value: '2', label: 'Vue' },
                  { value: '3', label: 'Angular' },
                ]}
                placeholder="Select framework"
              />
            </ComponentPlayground>
          )}

          {selectedDoc === 'grid' && (
            <ComponentPlayground title="Grid Example" description="Responsive grid"
              code={`<Grid columns={3}>...</Grid>`}
            >
              <Grid columns={3} gap="1rem">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{ padding: '2rem', background: 'rgba(0, 246, 255, 0.1)', borderRadius: '4px', textAlign: 'center' }}>
                    Item {i}
                  </div>
                ))}
              </Grid>
            </ComponentPlayground>
          )}

          {selectedDoc === 'container' && (
            <ComponentPlayground title="Container Example" description="Max-width container"
              code={`<Container maxWidth="1200px">...</Container>`}
            >
              <Container maxWidth="800px" style={{ background: 'rgba(0, 246, 255, 0.1)', padding: '2rem', borderRadius: '4px' }}>
                <Text variant="body">Container content with max-width</Text>
              </Container>
            </ComponentPlayground>
          )}

          {selectedDoc === 'stack' && (
            <ComponentPlayground title="Stack Example" description="Flex layout"
              code={`<Stack direction="row" gap="1rem">...</Stack>`}
            >
              <Stack direction="row" gap="1rem">
                <div style={{ padding: '1rem', background: 'rgba(0, 246, 255, 0.1)', borderRadius: '4px' }}>Item 1</div>
                <div style={{ padding: '1rem', background: 'rgba(0, 246, 255, 0.1)', borderRadius: '4px' }}>Item 2</div>
                <div style={{ padding: '1rem', background: 'rgba(0, 246, 255, 0.1)', borderRadius: '4px' }}>Item 3</div>
              </Stack>
            </ComponentPlayground>
          )}

          {selectedDoc === 'hudbox' && (
            <ComponentPlayground 
              title="HudBox Examples" 
              description="Asymmetrical HUD-style container with 18 unique geometric shapes including Portrait (vertical) and Landscape (horizontal) variants"
              code={`<HudBox variant="octagon" color="#FF4500">Content</HudBox>
<HudBox variant="portrait-card" color="#7FFF00">Vertical</HudBox>
<HudBox variant="landscape-bar" color="#32CD32">Horizontal</HudBox>`}
            >
              <div style={{ background: 'rgba(0, 0, 0, 0.8)', padding: '2rem', borderRadius: '8px' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <HudButton onClick={() => setHudBoxAnimated(!hudBoxAnimated)}>
                    {hudBoxAnimated ? '⏸ Static Border' : '▶ Animated Border'}
                  </HudButton>
                  <Text color="#00f6ff">
                    Mode: {hudBoxAnimated ? 'Animated' : 'Static'}
                  </Text>
                </div>
                <Stack direction="column" gap="2rem">
                  <div>
                    <Text variant="body" color="#00f6ff" style={{ marginBottom: '1rem' }}>
                      Standard Variants:
                    </Text>
                    <Stack direction="row" gap="2rem" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                      <HudBox variant="compact" color="#00f6ff" animated={hudBoxAnimated}>
                        <Text color="#00f6ff">Compact</Text>
                      </HudBox>
                      <HudBox variant="default" color="#1BFD9C" animated={hudBoxAnimated}>
                        <Text color="#1BFD9C">Default</Text>
                      </HudBox>
                      <HudBox variant="wide" color="#FF6B9D" animated={hudBoxAnimated}>
                        <Text color="#FF6B9D">Wide</Text>
                      </HudBox>
                    </Stack>
                  </div>

                  <div>
                    <Text variant="body" color="#00f6ff" style={{ marginBottom: '1rem' }}>
                      Geometric Variants:
                    </Text>
                    <Stack direction="row" gap="2rem" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
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
                    </Stack>
                  </div>

                  <div>
                    <Text variant="body" color="#00f6ff" style={{ marginBottom: '1rem' }}>
                      Portrait Variants (Vertical - Height &gt; Width):
                    </Text>
                    <Stack direction="row" gap="2rem" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                      <HudBox variant="portrait-tall" color="#00CED1" animated={hudBoxAnimated}>
                        <Text color="#00CED1" align="center">Portrait<br/>Tall<br/>250×400</Text>
                      </HudBox>
                      <HudBox variant="portrait-slim" color="#FF1493" animated={hudBoxAnimated}>
                        <Text color="#FF1493" align="center">Portrait<br/>Slim<br/>200×350</Text>
                      </HudBox>
                      <HudBox variant="portrait-card" color="#7FFF00" animated={hudBoxAnimated}>
                        <Text color="#7FFF00" align="center">Portrait<br/>Card<br/>280×380</Text>
                      </HudBox>
                      <HudBox variant="portrait-banner" color="#FF69B4" animated={hudBoxAnimated}>
                        <Text color="#FF69B4" align="center">Portrait<br/>Banner<br/>220×320</Text>
                      </HudBox>
                    </Stack>
                  </div>

                  <div>
                    <Text variant="body" color="#00f6ff" style={{ marginBottom: '1rem' }}>
                      Landscape Variants (Horizontal - Width &gt; Height):
                    </Text>
                    <Stack direction="column" gap="2rem" style={{ alignItems: 'center' }}>
                      <HudBox variant="landscape-wide" color="#00BFFF" animated={hudBoxAnimated}>
                        <Text color="#00BFFF">Landscape Wide - 450×180</Text>
                      </HudBox>
                      <HudBox variant="landscape-ultra" color="#FF6347" animated={hudBoxAnimated}>
                        <Text color="#FF6347">Landscape Ultra - 500×150</Text>
                      </HudBox>
                      <HudBox variant="landscape-bar" color="#32CD32" animated={hudBoxAnimated}>
                        <Text color="#32CD32">Landscape Bar - 550×120</Text>
                      </HudBox>
                      <HudBox variant="landscape-ribbon" color="#BA55D3" animated={hudBoxAnimated}>
                        <Text color="#BA55D3">Landscape Ribbon - 480×140</Text>
                      </HudBox>
                    </Stack>
                  </div>
                </Stack>
                <div style={{ marginTop: '2rem' }}>
                  <Text variant="body" color="#00f6ff" style={{ marginBottom: '0.5rem' }}>
                    Features:
                  </Text>
                  <Text variant="code" color="#00ccff" style={{ whiteSpace: 'pre-wrap' }}>
{`• Asymmetrical geometric shape (clip-path)
• Animated rotating gradient borders
• Glitch scanline effects
• Blinking shadow animations
• HUD cyan color scheme
• Three size variants: compact, default, wide
• Customizable width and height
• Perfect for HUD interfaces and dashboards`}
                  </Text>
                </div>
              </div>
            </ComponentPlayground>
          )}

          {selectedDoc === 'hudframe' && (
            <ComponentPlayground 
              title="HudFrame Examples" 
              description="Complex HUD frame with 18 decorative neon lines, title box, and animated glow effects"
              code={`<HudFrame
  header={{
    title: 'SYSTEM STATUS',
    description: 'Real-time monitoring',
    number: 1,
  }}
  color="#00f6ff"
>
  <div style={{ padding: '2rem' }}>
    Your content here...
  </div>
</HudFrame>`}
            >
              <div style={{ background: 'rgba(0, 0, 0, 0.8)', padding: '2rem', borderRadius: '8px' }}>
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
                <div style={{ marginTop: '2rem' }}>
                  <Text variant="body" color="#00f6ff" style={{ marginBottom: '0.5rem' }}>
                    Features:
                  </Text>
                  <Text variant="code" color="#00ccff" style={{ whiteSpace: 'pre-wrap' }}>
{`• 18 decorative neon lines positioned around edges
• Integrated TitleBox with number badge and tooltip
• Animated gradient sweep on all lines
• Glowing border and shadow effects
• Scrollable content area with hidden scrollbar
• Customizable color scheme for all elements
• Backdrop blur for glass-morphism effect
• Perfect for HUD dashboards and monitoring UIs`}
                  </Text>
                </div>
              </div>
            </ComponentPlayground>
          )}

          {selectedDoc === 'checkbox' && (
            <ComponentPlayground title="Checkbox Example" description="Checkbox"
              code={`<Checkbox label="Accept" />`}
            >
              <Stack direction="column" gap="1rem">
                <Checkbox label="Option 1" />
                <Checkbox label="Option 2" />
              </Stack>
            </ComponentPlayground>
          )}

          {selectedDoc === 'holocheckbox' && (
            <ComponentPlayground 
              title="HoloCheckbox Examples" 
              description="Holographic 3D checkbox with futuristic space effects, particles, and animations"
              code={`<HoloCheckbox checked={checked} onChange={setChecked} label="SYSTEM" />`}
            >
              <div style={{ background: 'rgba(0, 0, 0, 0.9)', padding: '2rem', borderRadius: '8px' }}>
                <Stack direction="column" gap="2rem" style={{ alignItems: 'center' }}>
                  <div>
                    <Text variant="h4" color="#00f6ff" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                      Interactive Holographic Checkbox
                    </Text>
                    <HoloCheckbox label="HOLOGRAPHIC SYSTEM" />
                  </div>
                  <div style={{ maxWidth: '600px' }}>
                    <Text variant="body" color="#00ccff" style={{ marginBottom: '0.5rem' }}>
                      Features:
                    </Text>
                    <Text variant="code" color="#00ff88" style={{ whiteSpace: 'pre-wrap' }}>
{`• 3D holographic effects with cube rotation
• Animated star field background
• Grid plane with perspective
• Particle system on activation
• Frequency spectrum visualization
• Data chips with system information
• Activation rings animation
• Color transition (blue → green)
• Scan line effects
• Corner accents`}
                    </Text>
                  </div>
                </Stack>
              </div>
            </ComponentPlayground>
          )}

          {selectedDoc === 'radio' && (
            <ComponentPlayground title="Radio Example" description="Radio group"
              code={`<RadioGroup options={options} />`}
            >
              <RadioGroup
                value="option1"
                options={[
                  { label: 'Option 1', value: 'option1' },
                  { label: 'Option 2', value: 'option2' },
                ]}
              />
            </ComponentPlayground>
          )}

          {selectedDoc === 'switch' && (
            <ComponentPlayground title="Switch Example" description="Toggle"
              code={`<Switch label="Enable" />`}
            >
              <Switch label="Enable notifications" />
            </ComponentPlayground>
          )}

          {selectedDoc === 'slider' && (
            <ComponentPlayground title="Slider Example" description="Range slider"
              code={`<Slider value={50} />`}
            >
              <Slider value={50} min={0} max={100} />
            </ComponentPlayground>
          )}

          {selectedDoc === 'table' && (
            <ComponentPlayground title="Table Example" description="Data table"
              code={`<Table data={data} columns={columns} />`}
            >
              <Table
                data={[
                  { id: 1, name: 'John', email: 'john@example.com' },
                  { id: 2, name: 'Jane', email: 'jane@example.com' },
                ]}
                columns={[
                  { key: 'name', label: 'Name', sortable: true },
                  { key: 'email', label: 'Email', sortable: true },
                ]}
              />
            </ComponentPlayground>
          )}

          {selectedDoc === 'tabs' && (
            <ComponentPlayground title="Tabs Example" description="Tabbed content"
              code={`<Tabs items={items} />`}
            >
              <Tabs
                items={[
                  { label: 'Tab 1', content: <Text variant="body">Content 1</Text> },
                  { label: 'Tab 2', content: <Text variant="body">Content 2</Text> },
                ]}
                variant="line"
              />
            </ComponentPlayground>
          )}

          {selectedDoc === 'accordion' && (
            <ComponentPlayground title="Accordion Example" description="Expandable"
              code={`<Accordion items={items} />`}
            >
              <Accordion
                items={[
                  { key: 'item1', title: 'Section 1', content: <Text variant="body">Content 1</Text> },
                  { key: 'item2', title: 'Section 2', content: <Text variant="body">Content 2</Text> },
                ]}
                expandedItems={['item1']}
              />
            </ComponentPlayground>
          )}

          {selectedDoc === 'breadcrumb' && (
            <ComponentPlayground title="Breadcrumb Example" description="Navigation trail"
              code={`<Breadcrumb items={items} />`}
            >
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Products', href: '/products' },
                  { label: 'Details', href: '/products/1' },
                ]}
              />
            </ComponentPlayground>
          )}

          {selectedDoc === 'pagination' && (
            <ComponentPlayground title="Pagination Example" description="Page navigation"
              code={`<Pagination total={100} perPage={10} />`}
            >
              <Pagination total={100} perPage={10} currentPage={1} />
            </ComponentPlayground>
          )}

          {selectedDoc === 'modal' && (
            <ComponentPlayground title="Modal Example" description="Modal dialog"
              code={`<Modal isOpen={isOpen} onClose={handleClose} title="Modal Title">...</Modal>`}
            >
              <ModalDemo />
            </ComponentPlayground>
          )}

          {selectedDoc === 'notification' && (
            <ComponentPlayground title="Notification Example" description="Toast notifications"
              code={`<Notification message="Success!" type="success" />`}
            >
              <NotificationDemo />
            </ComponentPlayground>
          )}

          {selectedDoc === 'colorpicker' && (
            <ComponentPlayground title="Color Picker" description="Color selection"
              code={`<ColorPicker value="#00f6ff" />`}
            >
              <ColorPicker value="#00f6ff" />
            </ComponentPlayground>
          )}

          {selectedDoc === 'datepicker' && (
            <ComponentPlayground title="Date Picker" description="Date selection"
              code={`<DatePicker value={new Date()} />`}
            >
              <DatePicker value={new Date()} />
            </ComponentPlayground>
          )}

          {selectedDoc === 'stepper' && (
            <ComponentPlayground title="Stepper" description="Step progress"
              code={`<Stepper steps={steps} currentStep={0} />`}
            >
              <Stepper
                steps={[
                  { key: 'step1', label: 'Step 1', description: 'First' },
                  { key: 'step2', label: 'Step 2', description: 'Second' },
                  { key: 'step3', label: 'Step 3', description: 'Third' },
                ]}
                currentStep={0}
                orientation="horizontal"
              />
            </ComponentPlayground>
          )}

          {selectedDoc === 'navbar' && (
            <ComponentPlayground title="Navbar Example" description="Navigation bar"
              code={`<Navbar items={items} brand="RHUDS" />`}
            >
              <Navbar
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'About', href: '/about' },
                  { label: 'Contact', href: '/contact' },
                ]}
                brand="RHUDS Pro"
              />
            </ComponentPlayground>
          )}

          {selectedDoc === 'sidebar' && (
            <ComponentPlayground title="Sidebar Example" description="Side navigation"
              code={`<Sidebar items={items} />`}
            >
              <div style={{ height: '300px', position: 'relative' }}>
                <Sidebar
                  items={[
                    { label: 'Dashboard', icon: '📊', href: '/' },
                    { label: 'Settings', icon: '⚙️', href: '/settings' },
                    { label: 'Profile', icon: '👤', href: '/profile' },
                  ]}
                  width={200}
                />
              </div>
            </ComponentPlayground>
          )}

          {selectedDoc === 'menu' && (
            <ComponentPlayground title="Menu Example" description="Dropdown menu"
              code={`<Menu items={items} />`}
            >
              <Menu
                items={[
                  { label: 'Profile', href: '#profile', icon: '👤' },
                  { label: 'Settings', href: '#settings', icon: '⚙️' },
                  { label: 'Logout', href: '#logout', icon: '🚪' },
                ]}
                trigger={<Button>Open Menu</Button>}
                onItemClick={(item) => alert(`Clicked: ${item.label}`)}
              />
            </ComponentPlayground>
          )}

          {selectedDoc === 'datagrid' && (
            <ComponentPlayground title="DataGrid Example" description="Advanced grid"
              code={`<DataGrid data={data} columns={columns} />`}
            >
              <DataGrid
                data={[
                  { id: 1, name: 'John', age: 30, email: 'john@example.com' },
                  { id: 2, name: 'Jane', age: 25, email: 'jane@example.com' },
                  { id: 3, name: 'Bob', age: 35, email: 'bob@example.com' },
                ]}
                columns={[
                  { key: 'name', label: 'Name', width: 150 },
                  { key: 'age', label: 'Age', width: 80 },
                  { key: 'email', label: 'Email', width: 200 },
                ]}
                rowHeight={40}
                visibleRows={3}
              />
            </ComponentPlayground>
          )}

          {selectedDoc === 'tree' && (
            <ComponentPlayground title="Tree Example" description="Tree view"
              code={`<Tree nodes={nodes} />`}
            >
              <Tree
                nodes={[
                  {
                    key: 'root',
                    label: 'Root',
                    children: [
                      { key: 'child1', label: 'Child 1' },
                      {
                        key: 'child2',
                        label: 'Child 2',
                        children: [
                          { key: 'grandchild1', label: 'Grandchild 1' },
                        ],
                      },
                    ],
                  },
                ]}
                expandedNodes={['root']}
              />
            </ComponentPlayground>
          )}

          {selectedDoc === 'cybercard' && (
            <ComponentPlayground 
              title="CyberCard Examples" 
              description="Futuristic HUD-style card with glitch effects and animated borders"
              code={`<CyberCard title="PROFILE" footer="Social Links" />`}
            >
              <div style={{ background: 'rgba(0, 0, 0, 0.8)', padding: '2rem', borderRadius: '8px' }}>
                <Stack direction="row" gap="2rem" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                  <CyberCard 
                    title="PROFILE" 
                    footer="Social Links"
                  />
                  <CyberCard 
                    title="CONTACT" 
                    footer="Connect"
                  />
                </Stack>
              </div>
            </ComponentPlayground>
          )}

          {selectedDoc === 'dialog' && (
            <ComponentPlayground title="Dialog Example" description="Dialog with actions"
              code={`<Dialog isOpen={true} title="Confirm" />`}
            >
              <Button onClick={() => {
                const dialog = document.createElement('div');
                document.body.appendChild(dialog);
              }}>
                Open Dialog
              </Button>
            </ComponentPlayground>
          )}

          {selectedDoc === 'notificationprovider' && (
            <ComponentPlayground title="NotificationProvider" description="Notification system"
              code={`<NotificationProvider>...</NotificationProvider>`}
            >
              <Stack direction="column" gap="1rem">
                <Text variant="body">Wrap your app with NotificationProvider:</Text>
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '1rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.85rem',
                }}>
{`import { NotificationProvider, useNotification } from '@rhuds/components';

function App() {
  return (
    <NotificationProvider>
      <YourApp />
    </NotificationProvider>
  );
}

function YourComponent() {
  const { success, error } = useNotification();
  
  return (
    <button onClick={() => success('Success!')}>
      Show Notification
    </button>
  );
}`}
                </pre>
              </Stack>
            </ComponentPlayground>
          )}

          {selectedDoc === 'tooltip' && (
            <ComponentPlayground title="Tooltip Example" description="Hover tooltip"
              code={`<Tooltip content="Tooltip text">...</Tooltip>`}
            >
              <Stack direction="row" gap="1rem">
                <Tooltip content="Top tooltip" position="top">
                  <Button>Hover Top</Button>
                </Tooltip>
                <Tooltip content="Bottom tooltip" position="bottom">
                  <Button>Hover Bottom</Button>
                </Tooltip>
                <Tooltip content="Left tooltip" position="left">
                  <Button>Hover Left</Button>
                </Tooltip>
                <Tooltip content="Right tooltip" position="right">
                  <Button>Hover Right</Button>
                </Tooltip>
              </Stack>
            </ComponentPlayground>
          )}

          {selectedDoc === 'popover' && (
            <ComponentPlayground title="Popover Example" description="Click popover"
              code={`<Popover content="Content" title="Title">...</Popover>`}
            >
              <Popover
                content={<Text variant="body">This is popover content with more details.</Text>}
                title="Popover Title"
                position="bottom"
              >
                <Button>Click for Popover</Button>
              </Popover>
            </ComponentPlayground>
          )}

          {selectedDoc === 'dropdown' && (
            <ComponentPlayground title="Dropdown Example" description="Dropdown menu"
              code={`<Dropdown items={items}>...</Dropdown>`}
            >
              <Dropdown
                items={[
                  { key: 'item1', label: 'Item 1', icon: '📁' },
                  { key: 'item2', label: 'Item 2', icon: '📄' },
                  { key: 'item3', label: 'Item 3', icon: '📝' },
                ]}
              >
                <Button>Open Dropdown</Button>
              </Dropdown>
            </ComponentPlayground>
          )}

          {selectedDoc === 'portal' && (
            <ComponentPlayground title="Portal Example" description="Portal rendering"
              code={`<Portal>...</Portal>`}
            >
              <Stack direction="column" gap="1rem">
                <Text variant="body">Portal renders content outside the DOM hierarchy:</Text>
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '1rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                }}>
{`import { Portal } from '@rhuds/components';

<Portal>
  <div>This renders at document.body</div>
</Portal>`}
                </pre>
              </Stack>
            </ComponentPlayground>
          )}

          {selectedDoc === 'carousel' && (
            <ComponentPlayground title="Carousel Example" description="Image carousel"
              code={`<Carousel items={items} />`}
            >
              <Carousel
                items={[
                  { key: 'slide1', content: <div style={{ padding: '3rem', background: 'rgba(0, 246, 255, 0.1)', textAlign: 'center' }}>Slide 1</div> },
                  { key: 'slide2', content: <div style={{ padding: '3rem', background: 'rgba(255, 0, 246, 0.1)', textAlign: 'center' }}>Slide 2</div> },
                  { key: 'slide3', content: <div style={{ padding: '3rem', background: 'rgba(246, 255, 0, 0.1)', textAlign: 'center' }}>Slide 3</div> },
                ]}
                showDots
                showArrows
              />
            </ComponentPlayground>
          )}

          {selectedDoc === 'codeeditor' && (
            <ComponentPlayground title="Code Editor" description="Code editing"
              code={`<CodeEditor value={code} language="javascript" />`}
            >
              <Stack direction="column" gap="1rem">
                <Text variant="body">Code editor with syntax highlighting:</Text>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '1rem',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}>
                  {`const greeting = "Hello, World!";\nconsole.log(greeting);`}
                </div>
              </Stack>
            </ComponentPlayground>
          )}

          {selectedDoc === 'richtexteditor' && (
            <ComponentPlayground title="Rich Text Editor" description="WYSIWYG editor"
              code={`<RichTextEditor value={content} />`}
            >
              <Stack direction="column" gap="1rem">
                <Text variant="body">Rich text editor with formatting toolbar:</Text>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '1rem',
                  borderRadius: '4px',
                  minHeight: '150px',
                }}>
                  <Text variant="body">Editor content area...</Text>
                </div>
              </Stack>
            </ComponentPlayground>
          )}

          {selectedDoc === 'fileupload' && (
            <ComponentPlayground title="File Upload" description="File upload with drag & drop"
              code={`<FileUpload onUpload={handleUpload} />`}
            >
              <FileUpload
                onUpload={(files) => alert(`Uploaded ${files.length} file(s)`)}
                accept="image/*"
                multiple
              />
            </ComponentPlayground>
          )}

          {selectedDoc === 'chart' && (
            <ComponentPlayground title="Chart Example" description="Data visualization"
              code={`<Chart type="line" data={data} />`}
            >
              <ChartDemo />
            </ComponentPlayground>
          )}

          {selectedDoc === 'useform' && (
            <ComponentPlayground title="useForm Hook" description="Form validation"
              code={`const { values, errors, handleChange } = useForm({...})`}
            >
              <Stack direction="column" gap="1rem">
                <Text variant="body">Form validation hook example:</Text>
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '1rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.85rem',
                }}>
{`import { useForm } from '@rhuds/components';

const { values, errors, handleChange, handleSubmit } = useForm({
  initialValues: { email: '', password: '' },
  onSubmit: (values) => console.log(values),
  validate: {
    email: [{ type: 'email' }],
    password: [{ type: 'required' }],
  },
});

return (
  <form onSubmit={handleSubmit}>
    <input name="email" value={values.email} onChange={handleChange} />
    {errors.email && <span>{errors.email}</span>}
  </form>
);`}
                </pre>
              </Stack>
            </ComponentPlayground>
          )}
        </div>
      </div>
    </div>
  );
};

