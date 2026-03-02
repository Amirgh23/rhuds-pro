/**
 * Form Components Demo
 */

import React, { useState } from 'react';
import { Checkbox, Radio, RadioGroup, Switch, useForm, Input, Button, Text, Stack, Container, Grid } from '../index';

export const FormDemo: React.FC = () => {
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
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
      <Text variant="h1" color="#00ffff" style={{ marginBottom: '2rem' }}>
        Form Components Demo
      </Text>

      {/* Checkbox Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#00ffff" style={{ marginBottom: '1rem' }}>
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

      {/* Radio Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#00ffff" style={{ marginBottom: '1rem' }}>
          Radio Component
        </Text>
        <Grid columns={2} gap="2rem">
          <div>
            <Text variant="h4" color="#ff00ff" style={{ marginBottom: '1rem' }}>
              Individual Radios
            </Text>
            <Stack direction="column" gap="1rem">
              <Radio
                label="Option 1"
                value="opt1"
                checked={radioValue === 'opt1'}
                onChange={setRadioValue}
              />
              <Radio
                label="Option 2"
                value="opt2"
                checked={radioValue === 'opt2'}
                onChange={setRadioValue}
              />
              <Radio
                label="Option 3"
                value="opt3"
                checked={radioValue === 'opt3'}
                onChange={setRadioValue}
              />
            </Stack>
          </div>

          <div>
            <Text variant="h4" color="#ff00ff" style={{ marginBottom: '1rem' }}>
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
              onChange={setRadioValue}
            />
          </div>
        </Grid>
      </section>

      {/* Switch Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#00ffff" style={{ marginBottom: '1rem' }}>
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
        <Text variant="h2" color="#00ffff" style={{ marginBottom: '1rem' }}>
          Form with Validation
        </Text>
        <div
          style={{
            border: '2px solid #00ffff',
            borderRadius: '8px',
            padding: '2rem',
            background: '#0a0a0a',
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
                <Text color="#ff0000" variant="caption">
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
        <Text variant="h2" color="#00ffff" style={{ marginBottom: '1rem' }}>
          Form State
        </Text>
        <div
          style={{
            border: '2px solid #00ff00',
            borderRadius: '8px',
            padding: '1rem',
            background: '#0a0a0a',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: '#00ff00',
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
