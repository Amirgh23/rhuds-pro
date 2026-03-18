import React, { useState } from 'react';
import './ComponentLibrary.css';

const COMPONENTS = [
  // Layout Components
  {
    name: 'HudBox',
    category: 'Layout',
    code: '<HudBox variant="tech-panel" color="#29F2DF" animated>\n  Content here\n</HudBox>',
  },
  {
    name: 'HudFrame',
    category: 'Layout',
    code: '<HudFrame header={{ title: "SYSTEM", number: 1 }} color="#29F2DF">\n  Content\n</HudFrame>',
  },
  {
    name: 'CyberCard',
    category: 'Layout',
    code: '<CyberCard title="Card Title" color="#29F2DF">\n  Card content\n</CyberCard>',
  },
  {
    name: 'GlitchProfileCard',
    category: 'Layout',
    code: '<GlitchProfileCard username="user" title="DEVELOPER" repositories={128} followers="42k" />',
  },

  // Button Components
  { name: 'Button', category: 'Button', code: '<Button variant="primary">Click me</Button>' },
  { name: 'HudButton', category: 'Button', code: '<HudButton>ACTIVATE</HudButton>' },
  { name: 'GlitchButton', category: 'Button', code: '<GlitchButton>// Execute</GlitchButton>' },
  {
    name: 'GridPatternButton',
    category: 'Button',
    code: '<GridPatternButton color="#00ffff" onClick={() => console.log("clicked")}>Start</GridPatternButton>',
  },
  {
    name: 'FingerprintButton',
    category: 'Button',
    code: '<FingerprintButton color="#00ff00" onClick={() => console.log("scanned")} />',
  },
  {
    name: 'GlitchHoverButton',
    category: 'Button',
    code: '<GlitchHoverButton onClick={() => console.log("clicked")}>HOVER ME</GlitchHoverButton>',
  },
  {
    name: 'SkewedSliderButton',
    category: 'Button',
    code: '<SkewedSliderButton onClick={() => console.log("downloaded")}>Download Now</SkewedSliderButton>',
  },
  {
    name: 'CyberSubscribeButton',
    category: 'Button',
    code: '<CyberSubscribeButton onClick={() => console.log("subscribed")}>Subscribe</CyberSubscribeButton>',
  },
  {
    name: 'NeonBorderButton',
    category: 'Button',
    code: '<NeonBorderButton color="#ff0000" onClick={() => console.log("clicked")}>Click Me</NeonBorderButton>',
  },

  // Input Components
  { name: 'Input', category: 'Input', code: '<Input placeholder="Enter text..." />' },
  {
    name: 'HackerInput',
    category: 'Input',
    code: '<HackerInput placeholder="Enter command..." />',
  },
  { name: 'AiHudInput', category: 'Input', code: '<AiHudInput placeholder="Ask AI..." />' },
  {
    name: 'HoloInput',
    category: 'Input',
    code: '<HoloInput placeholder="Holographic input..." />',
  },
  {
    name: 'BashInput',
    category: 'Input',
    code: '<BashInput placeholder="sudo uiverse or wot" onChange={(value) => console.log(value)} />',
  },
  {
    name: 'GradientSearchInput',
    category: 'Input',
    code: '<GradientSearchInput placeholder="Search" color="#00F260" onChange={(value) => console.log(value)} />',
  },
  {
    name: 'FloatingLabelInput',
    category: 'Input',
    code: '<FloatingLabelInput label="Email" type="email" color="#ac2eac" onChange={(value) => console.log(value)} />',
  },
  {
    name: 'AddFriendInput',
    category: 'Input',
    code: '<AddFriendInput title="Add Friend" primaryColor="rgb(169, 116, 255)" backgroundColor="rgb(36, 34, 39)" />',
  },
  {
    name: 'VerificationCodeInput',
    category: 'Input',
    code: '<VerificationCodeInput length={6} primaryColor="rgb(0, 255, 136)" backgroundColor="rgb(15, 15, 25)" />',
  },
  {
    name: 'AnimatedLoadingText',
    category: 'Loader',
    code: '<AnimatedLoadingText text="LOADING" primaryColor="rgb(41, 242, 223)" backgroundColor="rgb(15, 20, 30)" />',
  },
  {
    name: 'BinaryWaveLoader',
    category: 'Loader',
    code: '<BinaryWaveLoader primaryColor="rgb(0, 255, 136)" backgroundColor="rgb(200, 200, 200)" />',
  },

  // Form Components
  { name: 'Checkbox', category: 'Form', code: '<Checkbox label="Accept terms" />' },
  { name: 'HoloCheckbox', category: 'Form', code: '<HoloCheckbox label="HOLOGRAPHIC SYSTEM" />' },
  {
    name: 'CyberpunkCheckbox',
    category: 'Form',
    code: '<CyberpunkCheckbox color="#00ffff" label="SYSTEM CHECK" onChange={(checked) => console.log(checked)} />',
  },
  {
    name: 'BubbleCheckbox',
    category: 'Form',
    code: '<BubbleCheckbox label="Floating Bubble" onChange={(checked) => console.log(checked)} />',
  },
  {
    name: 'NeonCheckbox',
    category: 'Form',
    code: '<NeonCheckbox color="#00ffaa" label="NEON CHECK" onChange={(checked) => console.log(checked)} />',
  },
  {
    name: 'GlowingNeonCheckbox',
    category: 'Form',
    code: '<GlowingNeonCheckbox label="Glowing Neon" color="#00ff88" onChange={(checked) => console.log(checked)} />',
  },
  { name: 'Switch', category: 'Form', code: '<Switch label="Enable notifications" />' },
  { name: 'Radio', category: 'Form', code: '<Radio label="Option" />' },
  { name: 'GlitchRadio', category: 'Form', code: '<GlitchRadio label="Glitch Option" />' },
  {
    name: 'CyberpunkRadio',
    category: 'Form',
    code: '<CyberpunkRadio options={[{value: "1", label: "Helios Blue"}, {value: "2", label: "Cygnus Magenta"}, {value: "3", label: "Orion Lime"}]} color="#00a6ff" onChange={(value) => console.log(value)} />',
  },
  {
    name: 'ToggleSwitch',
    category: 'Form',
    code: '<ToggleSwitch label="Enable feature" color="#00ffff" onChange={(checked) => console.log(checked)} />',
  },
  {
    name: 'CyberpunkToggle',
    category: 'Form',
    code: '<CyberpunkToggle color="#00ffff" label="SYSTEM POWER" onChange={(checked) => console.log(checked)} />',
  },
  {
    name: 'LockSwitch',
    category: 'Form',
    code: '<LockSwitch checked={false} onColor="#00ff88" offColor="#ff0000" onChange={(checked) => console.log(checked)} />',
  },
  {
    name: 'NeonSlider',
    category: 'Form',
    code: '<NeonSlider value={50} min={0} max={100} color="#00ffff" onChange={(value) => console.log(value)} />',
  },
  { name: 'Slider', category: 'Form', code: '<Slider value={50} min={0} max={100} />' },
  {
    name: 'Select',
    category: 'Form',
    code: '<Select options={[{value: "1", label: "Option 1"}]} />',
  },

  // Data Display Components
  {
    name: 'RadarHud',
    category: 'Data Display',
    code: '<RadarHud coordinates="51° 30\' N; 0° 7\' W" depth="DEPT - 450" wind="WIND - 32.8" color="#29F2DF" size={240} />',
  },
  {
    name: 'Table',
    category: 'Data Display',
    code: '<Table data={[{id: 1, name: "Item 1", status: "Active"}, {id: 2, name: "Item 2", status: "Inactive"}]} columns={[{key: "id", label: "ID"}, {key: "name", label: "Name"}, {key: "status", label: "Status"}]} />',
  },
  {
    name: 'DataGrid',
    category: 'Data Display',
    code: '<DataGrid columns={3} gap="1rem">\n  <div style={{padding: "10px", background: "rgba(41,242,223,0.1)", borderRadius: "4px"}}>Item 1</div>\n  <div style={{padding: "10px", background: "rgba(41,242,223,0.1)", borderRadius: "4px"}}>Item 2</div>\n  <div style={{padding: "10px", background: "rgba(41,242,223,0.1)", borderRadius: "4px"}}>Item 3</div>\n</DataGrid>',
  },
  {
    name: 'Tree',
    category: 'Data Display',
    code: '<Tree data={{label: "Root", children: [{label: "Child 1"}, {label: "Child 2"}]}} />',
  },
  {
    name: 'ThermostatCard',
    category: 'Data Display',
    code: '<ThermostatCard temperature={70} color="#00f0ff" label="CURRENT" status="Comfort" onChange={(temp) => console.log(temp)} />',
  },
  {
    name: 'TerminalThemeSelector',
    category: 'Data Display',
    code: '<TerminalThemeSelector onThemeChange={(theme) => console.log(theme)} />',
  },
  {
    name: 'NotificationCard',
    category: 'Data Display',
    code: '<NotificationCard title="Clans of Clash" message="Xhattmahs is not attacking your base!" timestamp="12 min ago" />',
  },
  {
    name: 'HudNotificationCard',
    category: 'Data Display',
    code: '<HudNotificationCard title="SYSTEM ALERT" message="Threat detected in sector 7" color="#29F2DF" />',
  },
  {
    name: 'Win95MediaPlayer',
    category: 'Data Display',
    code: '<Win95MediaPlayer trackName="track_01.wav" currentTime="00:42" totalDuration="03:17" progress={21} volume={75} />',
  },
  {
    name: 'TubeAmplifier',
    category: 'Data Display',
    code: '<TubeAmplifier brandName="FIDELITY 900" isPowered={true} leftChannelLevel={65} rightChannelLevel={70} volume={75} tone={60} />',
  },

  // Loader Components
  {
    name: 'HackerLoader',
    category: 'Loader',
    code: '<HackerLoader text="LOADING" color="#29F2DF" />',
  },
  {
    name: 'AbstergoLoader',
    category: 'Loader',
    code: '<AbstergoLoader text="Loading" size={1} />',
  },
  {
    name: 'HeartRateLoader',
    category: 'Loader',
    code: '<HeartRateLoader color="#29F2DF" width={400} height={150} />',
  },
  {
    name: 'HackerLoaderBinary',
    category: 'Loader',
    code: '<HackerLoaderBinary color="#00ff00" size={100} />',
  },
  {
    name: 'ProgressLoader',
    category: 'Loader',
    code: '<ProgressLoader progress={65} color="#00f260" accentColor="#0575e6" showPercentage={true} showParticles={true} />',
  },
  {
    name: 'AIMatrixLoader',
    category: 'Loader',
    code: '<AIMatrixLoader color="#00ff88" size={120} />',
  },
  {
    name: 'ScrollingTextLoader',
    category: 'Loader',
    code: '<ScrollingTextLoader text="Loading" color="#00ffff" size={64} />',
  },

  // Feedback Components
  {
    name: 'Modal',
    category: 'Feedback',
    code: '<Modal isOpen={true} onClose={() => console.log("Close clicked")} title="Modal">\n  <div style={{padding: "20px", color: "#a8dadc"}}>Modal Content</div>\n</Modal>',
  },
  {
    name: 'Dialog',
    category: 'Feedback',
    code: '<Dialog isOpen={true} onClose={() => console.log("Close clicked")} title="Confirm">\n  <div style={{padding: "20px", color: "#a8dadc"}}>Dialog Content</div>\n</Dialog>',
  },
  {
    name: 'Notification',
    category: 'Feedback',
    code: '<Notification type="success" message="Success!" />',
  },
  {
    name: 'GradientAlert',
    category: 'Feedback',
    code: '<GradientAlert type="info" message="Alert message" />',
  },

  // Utility Components
  {
    name: 'Tooltip',
    category: 'Utility',
    code: '<Tooltip content="Tooltip text">\n  <span style={{cursor: "pointer", color: "#29F2DF"}}>Hover me</span>\n</Tooltip>',
  },
  {
    name: 'Popover',
    category: 'Utility',
    code: '<Popover content="Popover Content" title="Title">\n  <span style={{cursor: "pointer", color: "#29F2DF"}}>Trigger</span>\n</Popover>',
  },
  {
    name: 'Dropdown',
    category: 'Utility',
    code: '<Dropdown items={[{label: "Option 1", value: "1"}, {label: "Option 2", value: "2"}]} />',
  },
  {
    name: 'CyberSupportTooltip',
    category: 'Utility',
    code: '<CyberSupportTooltip title="Support" color="#00c1d5" />',
  },
  {
    name: 'Menu',
    category: 'Utility',
    code: '<Menu items={[{label: "Item 1", value: "1"}, {label: "Item 2", value: "2"}]} />',
  },

  // Navigation Components
  {
    name: 'Tabs',
    category: 'Navigation',
    code: '<Tabs items={[{label: "Tab 1", content: "Content 1"}, {label: "Tab 2", content: "Content 2"}]} />',
  },
  {
    name: 'Breadcrumb',
    category: 'Navigation',
    code: '<Breadcrumb items={[{label: "Home", href: "/"}, {label: "Products", href: "/products"}, {label: "Details"}]} />',
  },
  {
    name: 'Pagination',
    category: 'Navigation',
    code: '<Pagination total={100} perPage={10} currentPage={1} onChange={() => {}} />',
  },
  {
    name: 'Sidebar',
    category: 'Navigation',
    code: '<Sidebar items={[{label: "Dashboard", icon: "📊"}, {label: "Settings", icon: "⚙️"}, {label: "Profile", icon: "👤"}]} />',
  },

  // Advanced Components
  {
    name: 'Accordion',
    category: 'Advanced',
    code: '<Accordion items={[{key: "1", title: "Section 1", content: "Content 1"}, {key: "2", title: "Section 2", content: "Content 2"}]} />',
  },
  {
    name: 'Carousel',
    category: 'Advanced',
    code: '<Carousel items={[{id: 1, content: "Slide 1"}, {id: 2, content: "Slide 2"}, {id: 3, content: "Slide 3"}]} autoplay={true} />',
  },
  {
    name: 'Stepper',
    category: 'Advanced',
    code: '<Stepper steps={[{label: "Step 1"}, {label: "Step 2"}, {label: "Step 3"}]} currentStep={0} />',
  },
  {
    name: 'ColorPicker',
    category: 'Advanced',
    code: '<ColorPicker value="#29F2DF" onChange={() => {}} />',
  },
  {
    name: 'DatePicker',
    category: 'Advanced',
    code: '<DatePicker value={new Date()} onChange={() => {}} />',
  },
];

interface ComponentLibraryProps {
  selectedComponent: string | null;
  onSelectComponent: (name: string) => void;
  onInsertComponent: (code: string) => void;
}

export function ComponentLibrary({
  selectedComponent,
  onSelectComponent,
  onInsertComponent,
}: ComponentLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(COMPONENTS.map((c) => c.category)));
  const filteredComponents = COMPONENTS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="component-library">
      <div className="library-header">
        <h3>Components</h3>
        <span className="component-count">{COMPONENTS.length}</span>
      </div>

      <input
        type="text"
        className="library-search"
        placeholder="Search components..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="library-list">
        {categories.map((category) => {
          const categoryComponents = filteredComponents.filter((c) => c.category === category);
          if (categoryComponents.length === 0) return null;

          return (
            <div key={category} className="library-category">
              <button
                className="category-header"
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
              >
                <span className="category-icon">{expandedCategory === category ? '▼' : '▶'}</span>
                <span className="category-name">{category}</span>
                <span className="category-count">{categoryComponents.length}</span>
              </button>

              {expandedCategory === category && (
                <div className="category-items">
                  {categoryComponents.map((component) => (
                    <div
                      key={component.name}
                      className={`component-item ${
                        selectedComponent === component.name ? 'active' : ''
                      }`}
                      onClick={() => onSelectComponent(component.name)}
                    >
                      <div className="component-name">{component.name}</div>
                      <button
                        className="insert-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInsertComponent(component.code);
                        }}
                        title="Insert component"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
