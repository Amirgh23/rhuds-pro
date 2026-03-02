import React, { useState } from 'react';
import { Text, Stack, Button, Container, Input, Select, Checkbox, Switch, Slider } from '@rhuds/components';
import { ComponentPlayground } from '../components/ComponentPlayground';

export const PlaygroundPage: React.FC = () => {
  // Button states
  const [buttonVariant, setButtonVariant] = useState<'primary' | 'secondary' | 'success' | 'danger' | 'warning'>('primary');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('Click Me');

  // Input states
  const [inputValue, setInputValue] = useState('');
  const [inputPlaceholder, setInputPlaceholder] = useState('Enter text...');
  const [inputLabel, setInputLabel] = useState('Label');
  const [inputError, setInputError] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);

  // Select states
  const [selectValue, setSelectValue] = useState('');

  // Checkbox states
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [checkboxLabel, setCheckboxLabel] = useState('Checkbox Label');

  // Switch states
  const [switchChecked, setSwitchChecked] = useState(false);

  // Slider states
  const [sliderValue, setSliderValue] = useState(50);
  const [sliderMin, setSliderMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(100);
  const [sliderStep, setSliderStep] = useState(1);

  return (
    <Container maxWidth="1400px" style={{ padding: '3rem 2rem' }}>
      <Text variant="h1" style={{ color: '#00f6ff', marginBottom: '1rem' }}>
        Interactive Playground
      </Text>
      <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '3rem' }}>
        Test and customize components in real-time
      </Text>

      {/* Button Playground */}
      <ComponentPlayground
        title="Button Component"
        description="Customize button properties and see changes in real-time"
        code={`<Button 
  variant="${buttonVariant}"
  ${buttonDisabled ? 'disabled' : ''}
>
  ${buttonText}
</Button>`}
        props={[
          { name: 'variant', type: "'primary' | 'secondary' | 'success' | 'danger' | 'warning'", default: "'primary'", description: 'Button style variant' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
          { name: 'onClick', type: '() => void', description: 'Click handler' },
          { name: 'children', type: 'ReactNode', description: 'Button content' },
        ]}
      >
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Preview */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Text variant="h3" style={{ marginBottom: '1rem', color: '#00f6ff' }}>Preview</Text>
            <div style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Button
                variant={buttonVariant}
                disabled={buttonDisabled}
                onClick={() => alert('Button clicked!')}
              >
                {buttonText}
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Text variant="h3" style={{ marginBottom: '1rem', color: '#00f6ff' }}>Controls</Text>
            <Stack direction="column" gap="1rem">
              <div>
                <Text variant="caption" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Variant
                </Text>
                <Select
                  value={buttonVariant}
                  onChange={(value) => setButtonVariant(value as any)}
                  options={[
                    { value: 'primary', label: 'Primary' },
                    { value: 'secondary', label: 'Secondary' },
                    { value: 'success', label: 'Success' },
                    { value: 'danger', label: 'Danger' },
                    { value: 'warning', label: 'Warning' },
                  ]}
                />
              </div>

              <div>
                <Text variant="caption" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Text
                </Text>
                <Input
                  value={buttonText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setButtonText(e.target.value)}
                />
              </div>

              <Checkbox
                checked={buttonDisabled}
                onChange={setButtonDisabled}
                label="Disabled"
              />
            </Stack>
          </div>
        </div>
      </ComponentPlayground>

      {/* Input Playground */}
      <ComponentPlayground
        title="Input Component"
        description="Customize input field properties"
        code={`<Input
  value="${inputValue}"
  onChange={(e) => setValue(e.target.value)}
  placeholder="${inputPlaceholder}"
  label="${inputLabel}"
  ${inputError ? `error="${inputError}"` : ''}
  ${inputDisabled ? 'disabled' : ''}
/>`}
        props={[
          { name: 'value', type: 'string', description: 'Input value' },
          { name: 'onChange', type: '(e: ChangeEvent) => void', description: 'Change handler' },
          { name: 'placeholder', type: 'string', description: 'Placeholder text' },
          { name: 'label', type: 'string', description: 'Input label' },
          { name: 'error', type: 'string', description: 'Error message' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
        ]}
      >
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Preview */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Text variant="h3" style={{ marginBottom: '1rem', color: '#00f6ff' }}>Preview</Text>
            <div style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
            }}>
              <Input
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                placeholder={inputPlaceholder}
                label={inputLabel}
                error={inputError}
                disabled={inputDisabled}
              />
            </div>
          </div>

          {/* Controls */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Text variant="h3" style={{ marginBottom: '1rem', color: '#00f6ff' }}>Controls</Text>
            <Stack direction="column" gap="1rem">
              <Input
                label="Label"
                value={inputLabel}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputLabel(e.target.value)}
              />

              <Input
                label="Placeholder"
                value={inputPlaceholder}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputPlaceholder(e.target.value)}
              />

              <Input
                label="Error Message"
                value={inputError}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputError(e.target.value)}
              />

              <Checkbox
                checked={inputDisabled}
                onChange={setInputDisabled}
                label="Disabled"
              />
            </Stack>
          </div>
        </div>
      </ComponentPlayground>

      {/* Slider Playground */}
      <ComponentPlayground
        title="Slider Component"
        description="Customize slider properties"
        code={`<Slider
  value={${sliderValue}}
  onChange={setValue}
  min={${sliderMin}}
  max={${sliderMax}}
  step={${sliderStep}}
/>`}
        props={[
          { name: 'value', type: 'number', description: 'Current value' },
          { name: 'onChange', type: '(value: number) => void', description: 'Change handler' },
          { name: 'min', type: 'number', default: '0', description: 'Minimum value' },
          { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
          { name: 'step', type: 'number', default: '1', description: 'Step increment' },
        ]}
      >
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Preview */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Text variant="h3" style={{ marginBottom: '1rem', color: '#00f6ff' }}>Preview</Text>
            <div style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
            }}>
              <Slider
                value={sliderValue}
                onChange={setSliderValue}
                min={sliderMin}
                max={sliderMax}
                step={sliderStep}
              />
              <Text variant="body" style={{ marginTop: '1rem', textAlign: 'center' }}>
                Value: {sliderValue}
              </Text>
            </div>
          </div>

          {/* Controls */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Text variant="h3" style={{ marginBottom: '1rem', color: '#00f6ff' }}>Controls</Text>
            <Stack direction="column" gap="1rem">
              <Input
                label="Min"
                type="number"
                value={String(sliderMin)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSliderMin(Number(e.target.value))}
              />

              <Input
                label="Max"
                type="number"
                value={String(sliderMax)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSliderMax(Number(e.target.value))}
              />

              <Input
                label="Step"
                type="number"
                value={String(sliderStep)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSliderStep(Number(e.target.value))}
              />
            </Stack>
          </div>
        </div>
      </ComponentPlayground>

      {/* Checkbox & Switch Playground */}
      <ComponentPlayground
        title="Checkbox & Switch Components"
        description="Toggle components for boolean states"
        code={`<Checkbox
  checked={${checkboxChecked}}
  onChange={setChecked}
  label="${checkboxLabel}"
/>

<Switch
  checked={${switchChecked}}
  onChange={setChecked}
  label="Enable feature"
/>`}
        props={[
          { name: 'checked', type: 'boolean', default: 'false', description: 'Checked state' },
          { name: 'onChange', type: '(checked: boolean) => void', description: 'Change handler' },
          { name: 'label', type: 'string', description: 'Label text' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
        ]}
      >
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Preview */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Text variant="h3" style={{ marginBottom: '1rem', color: '#00f6ff' }}>Preview</Text>
            <div style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
            }}>
              <Stack direction="column" gap="1.5rem">
                <Checkbox
                  checked={checkboxChecked}
                  onChange={setCheckboxChecked}
                  label={checkboxLabel}
                />
                <Switch
                  checked={switchChecked}
                  onChange={setSwitchChecked}
                  label="Enable notifications"
                />
              </Stack>
            </div>
          </div>

          {/* Controls */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Text variant="h3" style={{ marginBottom: '1rem', color: '#00f6ff' }}>Controls</Text>
            <Stack direction="column" gap="1rem">
              <Input
                label="Checkbox Label"
                value={checkboxLabel}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckboxLabel(e.target.value)}
              />

              <div>
                <Text variant="caption" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  States
                </Text>
                <Text variant="body" style={{ fontSize: '0.9rem' }}>
                  Checkbox: {checkboxChecked ? 'Checked' : 'Unchecked'}
                </Text>
                <Text variant="body" style={{ fontSize: '0.9rem' }}>
                  Switch: {switchChecked ? 'On' : 'Off'}
                </Text>
              </div>
            </Stack>
          </div>
        </div>
      </ComponentPlayground>
    </Container>
  );
};
