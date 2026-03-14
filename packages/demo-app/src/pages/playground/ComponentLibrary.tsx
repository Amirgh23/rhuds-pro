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

  // Form Components
  { name: 'Checkbox', category: 'Form', code: '<Checkbox label="Accept terms" />' },
  { name: 'HoloCheckbox', category: 'Form', code: '<HoloCheckbox label="HOLOGRAPHIC SYSTEM" />' },
  { name: 'Switch', category: 'Form', code: '<Switch label="Enable notifications" />' },
  { name: 'Radio', category: 'Form', code: '<Radio label="Option" />' },
  { name: 'GlitchRadio', category: 'Form', code: '<GlitchRadio label="Glitch Option" />' },
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
