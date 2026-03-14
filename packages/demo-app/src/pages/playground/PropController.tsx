import React from 'react';
import './PropController.css';

interface PropControllerProps {
  component: string;
  props: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

const COMPONENT_PROPS: Record<
  string,
  Array<{ name: string; type: string; default: any; options?: string[] }>
> = {
  // Layout Components
  HudBox: [
    {
      name: 'variant',
      type: 'select',
      default: 'tech-panel',
      options: ['tech-panel', 'neon', 'glass', 'dark'],
    },
    { name: 'color', type: 'color', default: '#29F2DF' },
    { name: 'animated', type: 'boolean', default: true },
    { name: 'width', type: 'text', default: '300px' },
    { name: 'height', type: 'text', default: '200px' },
  ],
  HudFrame: [
    { name: 'color', type: 'color', default: '#29F2DF' },
    { name: 'title', type: 'text', default: 'SYSTEM STATUS' },
    { name: 'animated', type: 'boolean', default: true },
  ],
  CyberCard: [
    { name: 'title', type: 'text', default: 'PROFILE' },
    { name: 'footer', type: 'text', default: 'Social Links' },
    { name: 'color', type: 'color', default: '#29F2DF' },
  ],
  GlitchProfileCard: [
    { name: 'username', type: 'text', default: 'octo_cat' },
    { name: 'title', type: 'text', default: 'UI DEVELOPER' },
    { name: 'repositories', type: 'number', default: 128 },
  ],

  // Button Components
  Button: [
    {
      name: 'variant',
      type: 'select',
      default: 'primary',
      options: ['primary', 'secondary', 'success', 'danger', 'warning'],
    },
    { name: 'size', type: 'select', default: 'medium', options: ['small', 'medium', 'large'] },
    { name: 'disabled', type: 'boolean', default: false },
  ],
  HudButton: [
    { name: 'disabled', type: 'boolean', default: false },
    { name: 'color', type: 'color', default: '#29F2DF' },
  ],
  GlitchButton: [
    { name: 'disabled', type: 'boolean', default: false },
    { name: 'color', type: 'color', default: '#00FF00' },
  ],

  // Input Components
  Input: [
    { name: 'placeholder', type: 'text', default: 'Enter text...' },
    { name: 'disabled', type: 'boolean', default: false },
    {
      name: 'type',
      type: 'select',
      default: 'text',
      options: ['text', 'email', 'password', 'number'],
    },
  ],
  HackerInput: [
    { name: 'placeholder', type: 'text', default: 'Enter command...' },
    { name: 'color', type: 'color', default: '#00FF00' },
  ],
  AiHudInput: [
    { name: 'placeholder', type: 'text', default: 'Ask AI...' },
    { name: 'color', type: 'color', default: '#29F2DF' },
  ],
  HoloInput: [
    { name: 'placeholder', type: 'text', default: 'Holographic input...' },
    { name: 'color', type: 'color', default: '#29F2DF' },
  ],

  // Form Components
  Checkbox: [
    { name: 'checked', type: 'boolean', default: false },
    { name: 'disabled', type: 'boolean', default: false },
    { name: 'label', type: 'text', default: 'Accept terms' },
  ],
  HoloCheckbox: [
    { name: 'checked', type: 'boolean', default: false },
    { name: 'label', type: 'text', default: 'HOLOGRAPHIC SYSTEM' },
    { name: 'color', type: 'color', default: '#29F2DF' },
  ],
  Switch: [
    { name: 'checked', type: 'boolean', default: false },
    { name: 'disabled', type: 'boolean', default: false },
    { name: 'label', type: 'text', default: 'Enable notifications' },
  ],
  Radio: [
    { name: 'checked', type: 'boolean', default: false },
    { name: 'disabled', type: 'boolean', default: false },
    { name: 'label', type: 'text', default: 'Option' },
  ],
  GlitchRadio: [
    { name: 'checked', type: 'boolean', default: false },
    { name: 'label', type: 'text', default: 'Glitch Option' },
    { name: 'color', type: 'color', default: '#00FF00' },
  ],
  Slider: [
    { name: 'value', type: 'number', default: 50 },
    { name: 'min', type: 'number', default: 0 },
    { name: 'max', type: 'number', default: 100 },
    { name: 'step', type: 'number', default: 1 },
  ],

  // Data Display Components
  RadarHud: [
    { name: 'color', type: 'color', default: '#29F2DF' },
    { name: 'size', type: 'number', default: 240 },
  ],
  Table: [
    { name: 'striped', type: 'boolean', default: false },
    { name: 'bordered', type: 'boolean', default: true },
    { name: 'hoverable', type: 'boolean', default: true },
  ],
  DataGrid: [
    { name: 'columns', type: 'number', default: 3 },
    { name: 'gap', type: 'text', default: '1rem' },
  ],

  // Loader Components
  HackerLoader: [
    { name: 'color', type: 'color', default: '#29F2DF' },
    { name: 'text', type: 'text', default: 'LOADING' },
    { name: 'size', type: 'number', default: 1 },
  ],
  AbstergoLoader: [
    { name: 'text', type: 'text', default: 'Loading' },
    { name: 'size', type: 'number', default: 1 },
    { name: 'color', type: 'color', default: '#29F2DF' },
  ],

  // Utility Components
  Tooltip: [
    { name: 'content', type: 'text', default: 'Tooltip text' },
    {
      name: 'position',
      type: 'select',
      default: 'top',
      options: ['top', 'bottom', 'left', 'right'],
    },
  ],
  Dropdown: [
    { name: 'disabled', type: 'boolean', default: false },
    { name: 'color', type: 'color', default: '#29F2DF' },
  ],
  Modal: [
    { name: 'title', type: 'text', default: 'Modal Title' },
    { name: 'isOpen', type: 'boolean', default: false },
  ],
  Dialog: [
    { name: 'title', type: 'text', default: 'Confirm' },
    { name: 'isOpen', type: 'boolean', default: false },
  ],

  // Navigation Components
  Tabs: [
    { name: 'variant', type: 'select', default: 'line', options: ['line', 'pill', 'underline'] },
    { name: 'activeIndex', type: 'number', default: 0 },
  ],
  Breadcrumb: [{ name: 'separator', type: 'text', default: '/' }],
  Pagination: [
    { name: 'total', type: 'number', default: 100 },
    { name: 'perPage', type: 'number', default: 10 },
    { name: 'currentPage', type: 'number', default: 1 },
  ],
  Stepper: [
    { name: 'currentStep', type: 'number', default: 0 },
    {
      name: 'orientation',
      type: 'select',
      default: 'horizontal',
      options: ['horizontal', 'vertical'],
    },
  ],

  // Advanced Components
  Accordion: [
    { name: 'allowMultiple', type: 'boolean', default: false },
    { name: 'color', type: 'color', default: '#29F2DF' },
  ],
  Carousel: [
    { name: 'autoplay', type: 'boolean', default: true },
    { name: 'interval', type: 'number', default: 5000 },
  ],
  ColorPicker: [{ name: 'value', type: 'color', default: '#29F2DF' }],
  DatePicker: [{ name: 'format', type: 'text', default: 'MM/DD/YYYY' }],
};

export function PropController({ component, props, onChange }: PropControllerProps) {
  const componentProps = COMPONENT_PROPS[component] || [];

  if (componentProps.length === 0) {
    return (
      <div className="prop-controller">
        <div className="props-header">
          <span className="props-title">{component} Props</span>
        </div>
        <div className="props-empty">No props available</div>
      </div>
    );
  }

  return (
    <div className="prop-controller">
      <div className="props-header">
        <span className="props-title">{component} Props</span>
      </div>
      <div className="props-list">
        {componentProps.map((prop) => (
          <div key={prop.name} className="prop-item">
            <label className="prop-label">{prop.name}</label>
            {prop.type === 'select' ? (
              <select
                className="prop-input"
                value={props[prop.name] || prop.default}
                onChange={(e) => onChange(prop.name, e.target.value)}
              >
                {prop.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : prop.type === 'boolean' ? (
              <input
                type="checkbox"
                className="prop-checkbox"
                checked={props[prop.name] ?? prop.default}
                onChange={(e) => onChange(prop.name, e.target.checked)}
              />
            ) : prop.type === 'color' ? (
              <input
                type="color"
                className="prop-input"
                value={props[prop.name] || prop.default}
                onChange={(e) => onChange(prop.name, e.target.value)}
              />
            ) : prop.type === 'number' ? (
              <input
                type="number"
                className="prop-input"
                value={props[prop.name] || prop.default}
                onChange={(e) => onChange(prop.name, parseInt(e.target.value))}
              />
            ) : (
              <input
                type="text"
                className="prop-input"
                value={props[prop.name] || prop.default}
                onChange={(e) => onChange(prop.name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
