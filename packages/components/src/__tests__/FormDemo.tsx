/**
 * Form Components Demo
 */

import React, { useState } from 'react';
import { Checkbox, HoloCheckbox, Radio, RadioGroup, Switch, useForm, Input, Button, Text, Stack, Container, Grid, GlitchFrame, HudButton, HoloInput, NeonRadio } from '../index';
import { GlitchLoginForm } from '../Form/GlitchLoginForm';

export const FormDemo: React.FC = () => {
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [holoCheckboxValue, setHoloCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [neonRadioValue, setNeonRadioValue] = useState('option1');
  const [switchValue, setSwitchValue] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, reset } = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      agree: false,
    },
    validationRules: {
      name: [
        { type: 'required', message: 'Name is required' },
        { type: 'minLength', minLength: 3, message: 'Name must be at least 3 characters' },
      ],
      email: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' },
      ],
      password: [
        { type: 'required', message: 'Password is required' },
        { type: 'minLength', minLength: 8, message: 'Password must be at least 8 characters' },
      ],
      agree: [
        { type: 'custom', validate: (v) => v === true, message: 'You must agree to terms' },
      ],
    },
    onSubmit: async (values) => {
      console.log('Form submitted:', values);
      alert('Form submitted successfully!');
    },
  });

  return (
    <Container maxWidth="1200px" padding="2rem" style={{ background: '#000' }}>
      <Text variant="h1" color="#29F2DF" style={{ marginBottom: '2rem' }}>
        Form Components Demo
      </Text>

      {/* Checkbox Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
          Checkbox Component
        </Text>
        <Stack direction="column" gap="1rem">
          <Checkbox
            label="Accept terms and conditions"
            checked={checkboxValue}
            onChange={setCheckboxValue}
          />
          <Checkbox
            label="Subscribe to newsletter"
            checked={false}
            onChange={() => {}}
          />
          <Checkbox
            label="Disabled checkbox"
            checked={false}
            disabled={true}
          />
        </Stack>
      </section>

      {/* HoloCheckbox Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
          HoloCheckbox Component (Holographic 3D)
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.8)', padding: '2rem', borderRadius: '8px' }}>
          <HoloCheckbox
            checked={holoCheckboxValue}
            onChange={setHoloCheckboxValue}
            label="HOLOGRAPHIC SYSTEM"
          />
        </div>
      </section>

      {/* GlitchLoginForm Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
          GlitchLoginForm Component (HUD Style)
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center', background: '#0a0e27', padding: '2rem', borderRadius: '8px', minHeight: '400px' }}>
          <GlitchLoginForm
            onSubmit={(username, password) => {
              console.log('Login:', { username, password });
              alert(`Login attempt: ${username}`);
            }}
            userPlaceholder="Username"
            passwordPlaceholder="Password"
            submitText="ACCESS SYSTEM"
          />
        </div>
      </section>

      {/* HoloInput Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
          HoloInput Component (Holographic Interface)
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', background: 'rgba(0, 0, 0, 0.8)', padding: '3rem', borderRadius: '8px' }}>
          <HoloInput
            label="First Name"
            placeholder="John"
            status="Ready for input"
          />
          <HoloInput
            label="Email Address"
            type="email"
            placeholder="user@example.com"
            status="Awaiting data"
          />
          <HoloInput
            label="Access Code"
            type="password"
            placeholder="Enter code..."
            status="Secure input"
          />
        </div>
      </section>

      {/* GlitchFrame Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
          GlitchFrame Component (Glitch Style Frame)
        </Text>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
          <HudButton onClick={() => setSwitchValue(!switchValue)}>
            {switchValue ? '⏸ Static Frame' : '▶ Animated Frame'}
          </HudButton>
          <Text color="#29F2DF">
            Mode: {switchValue ? 'Animated' : 'Static'}
          </Text>
        </div>

        <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Large Size (600px × 300px):
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <GlitchFrame animated={switchValue} width="600px" height="300px">
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <Text color="#29F2DF" variant="h3" style={{ marginBottom: '1rem' }}>
                GLITCH FRAME
              </Text>
              <Text color="#ffffff" variant="body">
                Asymmetrical frame with glitch effects and animated shadows.
              </Text>
            </div>
          </GlitchFrame>
        </div>

        <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Medium Sizes:
        </Text>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <GlitchFrame animated={switchValue} width="400px" height="250px">
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <Text color="#29F2DF" variant="h4" style={{ marginBottom: '0.5rem' }}>
                MEDIUM
              </Text>
              <Text color="#29F2DF" variant="body">
                400px × 250px
              </Text>
            </div>
          </GlitchFrame>
          <GlitchFrame animated={switchValue} width="350px" height="220px">
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <Text color="#29F2DF" variant="h4" style={{ marginBottom: '0.5rem' }}>
                COMPACT
              </Text>
              <Text color="#29F2DF" variant="body">
                350px × 220px
              </Text>
            </div>
          </GlitchFrame>
        </div>

        <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Small Sizes:
        </Text>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <GlitchFrame animated={switchValue} width="280px" height="180px">
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <Text color="#29F2DF" variant="h5" style={{ marginBottom: '0.5rem' }}>
                SMALL
              </Text>
              <Text color="#ffffff" variant="caption">
                280px × 180px
              </Text>
            </div>
          </GlitchFrame>
          <GlitchFrame animated={switchValue} width="250px" height="160px">
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <Text color="#29F2DF" variant="h5" style={{ marginBottom: '0.5rem' }}>
                MINI
              </Text>
              <Text color="#29F2DF" variant="caption">
                250px × 160px
              </Text>
            </div>
          </GlitchFrame>
          <GlitchFrame animated={switchValue} width="280px" height="180px">
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <Text color="#ffffff" variant="h5" style={{ marginBottom: '0.5rem' }}>
                TINY
              </Text>
              <Text color="#29F2DF" variant="caption">
                280px × 180px
              </Text>
            </div>
          </GlitchFrame>
        </div>

        <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Wide Layout (700px × 200px):
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GlitchFrame animated={switchValue} width="700px" height="200px">
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <Text color="#29F2DF" variant="h4" style={{ marginBottom: '0.5rem' }}>
                WIDE PANEL
              </Text>
              <Text color="#ffffff" variant="body">
                Perfect for dashboard headers and status bars
              </Text>
            </div>
          </GlitchFrame>
        </div>
      </section>

      {/* Tall/Portrait Layout Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Tall/Portrait Layout (300px × 500px):
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <GlitchFrame animated={switchValue} width="300px" height="500px">
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

        <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Extra Tall Layout (350px × 600px):
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GlitchFrame animated={switchValue} width="350px" height="600px">
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <Text color="#29F2DF" variant="h4" style={{ marginBottom: '0.5rem' }}>
                EXTRA TALL PANEL
              </Text>
              <Text color="#ffffff" variant="body">
                Extended vertical space for detailed content and forms
              </Text>
            </div>
          </GlitchFrame>
        </div>
      </section>

      {/* Radio Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
          Radio Component
        </Text>
        <Grid columns={2} gap="2rem">
          <div>
            <Text variant="h4" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
              Individual Radios
            </Text>
            <Stack direction="column" gap="1rem">
              <Radio
                label="Option 1"
                value="opt1"
                checked={radioValue === 'opt1'}
                onChange={(v) => setRadioValue(String(v))}
              />
              <Radio
                label="Option 2"
                value="opt2"
                checked={radioValue === 'opt2'}
                onChange={(v) => setRadioValue(String(v))}
              />
              <Radio
                label="Option 3"
                value="opt3"
                checked={radioValue === 'opt3'}
                onChange={(v) => setRadioValue(String(v))}
              />
            </Stack>
          </div>

          <div>
            <Text variant="h4" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
              Radio Group
            </Text>
            <RadioGroup
              label="Choose an option"
              options={[
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
                { label: 'Option C', value: 'c' },
              ]}
              value={radioValue}
              onChange={(v) => setRadioValue(String(v))}
            />
          </div>
        </Grid>
      </section>

      {/* NeonRadio Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
          NeonRadio Component (HUD Style with Neon Effects)
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.9)', padding: '3rem', borderRadius: '8px' }}>
          <NeonRadio
            options={[
              { value: 'option1', label: 'OPTION 1' },
              { value: 'option2', label: 'OPTION 2' },
              { value: 'option3', label: 'OPTION 3' },
            ]}
            value={neonRadioValue}
            onChange={setNeonRadioValue}
            name="neon-radio-demo"
          />
        </div>
      </section>

      {/* Switch Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
          Switch Component
        </Text>
        <Stack direction="column" gap="1rem">
          <Switch
            label="Enable notifications"
            checked={switchValue}
            onChange={setSwitchValue}
          />
          <Switch
            label="Dark mode"
            checked={false}
            onChange={() => {}}
          />
          <Switch
            label="Disabled switch"
            checked={false}
            disabled={true}
          />
        </Stack>
      </section>

      {/* Form Example */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
          Form with Validation
        </Text>
        <div
          style={{
            border: '2px solid #29F2DF',
            borderRadius: '8px',
            padding: '2rem',
            background: '#0A1225',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack direction="column" gap="1.5rem">
              <Input
                label="Name"
                placeholder="Enter your name..."
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                error={touched.name && errors.name ? errors.name[0] : ''}
              />

              <Input
                label="Email"
                type="email"
                placeholder="Enter your email..."
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={touched.email && errors.email ? errors.email[0] : ''}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password..."
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                error={touched.password && errors.password ? errors.password[0] : ''}
              />

              <Checkbox
                label="I agree to the terms and conditions"
                checked={values.agree}
                onChange={(checked) => handleChange('agree', checked)}
              />
              {touched.agree && errors.agree && (
                <Text color="#EF3EF1" variant="caption">
                  {errors.agree[0]}
                </Text>
              )}

              <Stack direction="row" gap="1rem" justify="flex-end">
                <Button variant="secondary" onClick={reset}>
                  Reset
                </Button>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Stack>
            </Stack>
          </form>
        </div>
      </section>

      {/* Form State Display */}
      <section>
        <Text variant="h2" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
          Form State
        </Text>
        <div
          style={{
            border: '2px solid #29F2DF',
            borderRadius: '8px',
            padding: '1rem',
            background: '#0A1225',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: '#29F2DF',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {JSON.stringify(
            {
              values,
              errors,
              touched,
              isValid: Object.keys(errors).length === 0,
            },
            null,
            2
          )}
        </div>
      </section>
    </Container>
  );
};

export default FormDemo;
