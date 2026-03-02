/**
 * Components Demo
 * Showcase of all basic and layout components
 */

import React, { useState } from 'react';
import { Text, Button, Icon, Input, Select, Grid, Container, Stack } from '../index';

export const ComponentsDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('option1');
  const [inputError, setInputError] = useState('');

  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    { label: 'Option 4', value: 'option4' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length < 3) {
      setInputError('Minimum 3 characters');
    } else {
      setInputError('');
    }
  };

  return (
    <Container maxWidth="1200px" padding="2rem" style={{ background: '#000' }}>
      <Text variant="h1" color="#00ffff" style={{ marginBottom: '2rem' }}>
        RHUDS Pro Components Demo
      </Text>

      {/* Text Component Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#00ffff" style={{ marginBottom: '1rem' }}>
          Text Component
        </Text>
        <Grid columns={2} gap="1rem">
          <div>
            <Text variant="h3" color="#ff00ff">
              Heading 3
            </Text>
            <Text variant="body" color="#ffffff">
              This is body text with default styling
            </Text>
            <Text variant="caption" color="#888888">
              This is caption text
            </Text>
          </div>
          <div>
            <Text variant="h4" weight="bold" color="#00ff00">
              Bold Heading
            </Text>
            <Text variant="body" align="center" color="#ffffff">
              Centered text
            </Text>
            <Text variant="code" color="#ffff00">
              const x = 42;
            </Text>
          </div>
        </Grid>
      </section>

      {/* Button Component Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#00ffff" style={{ marginBottom: '1rem' }}>
          Button Component
        </Text>
        <Stack direction="row" gap="1rem" align="center" style={{ flexWrap: 'wrap' }}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button variant="success">Success Button</Button>
          <Button variant="warning">Warning Button</Button>
          <Button disabled>Disabled Button</Button>
          <Button loading>Loading Button</Button>
        </Stack>

        <Stack direction="row" gap="1rem" align="center" style={{ flexWrap: 'wrap', marginTop: '1rem' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Stack>
      </section>

      {/* Icon Component Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#00ffff" style={{ marginBottom: '1rem' }}>
          Icon Component
        </Text>
        <Stack direction="row" gap="2rem" align="center">
          <div style={{ textAlign: 'center' }}>
            <Icon name="check" size={32} color="#00ff00" />
            <Text variant="caption" style={{ marginTop: '0.5rem' }}>
              Check
            </Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name="close" size={32} color="#ff0000" />
            <Text variant="caption" style={{ marginTop: '0.5rem' }}>
              Close
            </Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name="search" size={32} color="#00ffff" />
            <Text variant="caption" style={{ marginTop: '0.5rem' }}>
              Search
            </Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name="star" size={32} color="#ffff00" />
            <Text variant="caption" style={{ marginTop: '0.5rem' }}>
              Star
            </Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name="heart" size={32} color="#ff00ff" />
            <Text variant="caption" style={{ marginTop: '0.5rem' }}>
              Heart
            </Text>
          </div>
        </Stack>
      </section>

      {/* Input Component Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#00ffff" style={{ marginBottom: '1rem' }}>
          Input Component
        </Text>
        <Grid columns={2} gap="2rem">
          <Input
            label="Text Input"
            placeholder="Enter text..."
            value={inputValue}
            onChange={handleInputChange}
            error={inputError}
          />
          <Input
            label="Email Input"
            type="email"
            placeholder="Enter email..."
          />
          <Input
            label="Password Input"
            type="password"
            placeholder="Enter password..."
          />
          <Input
            label="Number Input"
            type="number"
            placeholder="Enter number..."
          />
        </Grid>
      </section>

      {/* Select Component Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#00ffff" style={{ marginBottom: '1rem' }}>
          Select Component
        </Text>
        <Grid columns={2} gap="2rem">
          <Select
            label="Basic Select"
            options={options}
            value={selectedValue}
            onChange={setSelectedValue}
            placeholder="Choose an option"
          />
          <Select
            label="Searchable Select"
            options={options}
            value={selectedValue}
            onChange={setSelectedValue}
            searchable={true}
            placeholder="Search options..."
          />
        </Grid>
      </section>

      {/* Layout Components Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#00ffff" style={{ marginBottom: '1rem' }}>
          Layout Components
        </Text>

        <Text variant="h4" color="#ff00ff" style={{ marginBottom: '1rem' }}>
          Grid Layout
        </Text>
        <Grid columns={3} gap="1rem" style={{ marginBottom: '2rem' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                padding: '1rem',
                border: '2px solid #00ffff',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              <Text color="#00ffff">Item {i}</Text>
            </div>
          ))}
        </Grid>

        <Text variant="h4" color="#ff00ff" style={{ marginBottom: '1rem' }}>
          Stack Layout (Row)
        </Text>
        <Stack direction="row" gap="1rem" style={{ marginBottom: '2rem' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                padding: '1rem',
                border: '2px solid #00ff00',
                borderRadius: '4px',
                flex: 1,
                textAlign: 'center',
              }}
            >
              <Text color="#00ff00">Item {i}</Text>
            </div>
          ))}
        </Stack>

        <Text variant="h4" color="#ff00ff" style={{ marginBottom: '1rem' }}>
          Stack Layout (Column)
        </Text>
        <Stack direction="column" gap="1rem">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                padding: '1rem',
                border: '2px solid #ff00ff',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              <Text color="#ff00ff">Item {i}</Text>
            </div>
          ))}
        </Stack>
      </section>

      {/* Combined Example */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#00ffff" style={{ marginBottom: '1rem' }}>
          Combined Example
        </Text>
        <div
          style={{
            border: '2px solid #00ffff',
            borderRadius: '8px',
            padding: '2rem',
            background: '#0a0a0a',
          }}
        >
          <Stack direction="column" gap="1.5rem">
            <Text variant="h3" color="#00ffff">
              User Registration Form
            </Text>

            <Grid columns={2} gap="1rem">
              <Input label="First Name" placeholder="Enter first name..." />
              <Input label="Last Name" placeholder="Enter last name..." />
            </Grid>

            <Input label="Email" type="email" placeholder="Enter email..." />

            <Input label="Password" type="password" placeholder="Enter password..." />

            <Select
              label="Country"
              options={[
                { label: 'United States', value: 'us' },
                { label: 'Canada', value: 'ca' },
                { label: 'United Kingdom', value: 'uk' },
              ]}
              placeholder="Select country..."
            />

            <Stack direction="row" gap="1rem" justify="flex-end">
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Register</Button>
            </Stack>
          </Stack>
        </div>
      </section>
    </Container>
  );
};

export default ComponentsDemo;
