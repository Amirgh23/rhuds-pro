/**
 * Components Demo
 * Showcase of all basic and layout components
 */

import React, { useState } from 'react';
import { Text, Button, HudButton, GlitchButton, Icon, Input, HackerInput, Select, Grid, Container, Stack, HudBox, HudFrame, GlitchProfileCard } from '../index';

export const ComponentsDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('option1');
  const [inputError, setInputError] = useState('');
  const [hudBoxAnimated, setHudBoxAnimated] = useState(true);

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

        <Text variant="h4" color="#1BFD9C" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          HUD Button
        </Text>
        <Stack direction="row" gap="1rem" align="center" style={{ flexWrap: 'wrap' }}>
          <HudButton>I'M READY</HudButton>
          <HudButton>LAUNCH</HudButton>
          <HudButton>ACTIVATE</HudButton>
          <HudButton disabled>DISABLED</HudButton>
        </Stack>

        <Text variant="h4" color="#ffff00" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          Glitch Button
        </Text>
        <Stack direction="row" gap="1rem" align="center" style={{ flexWrap: 'wrap' }}>
          <GlitchButton>// Hover me</GlitchButton>
          <GlitchButton>// Click here</GlitchButton>
          <GlitchButton>// Execute</GlitchButton>
          <GlitchButton disabled>// Disabled</GlitchButton>
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
          <HackerInput
            label="Input Command"
            placeholder="Enter command..."
          />
          <HackerInput
            label="Access Code"
            type="password"
            placeholder="Enter access code..."
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

        <Text variant="h4" color="#ff00ff" style={{ marginBottom: '1rem', marginTop: '2rem' }}>
          HudBox (Asymmetrical Container) - 18 Variants with Different Colors
        </Text>
        
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <HudButton onClick={() => setHudBoxAnimated(!hudBoxAnimated)}>
            {hudBoxAnimated ? '⏸ Switch to Static Border' : '▶ Switch to Animated Border'}
          </HudButton>
          <Text color="#00f6ff">
            Current Mode: {hudBoxAnimated ? 'Animated' : 'Static'}
          </Text>
        </div>
        
        <Text variant="body" color="#00f6ff" style={{ marginBottom: '1rem' }}>
          Standard Variants:
        </Text>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
          <HudBox variant="compact" color="#00f6ff" animated={hudBoxAnimated}>
            <Text color="#00f6ff">Compact</Text>
          </HudBox>
          <HudBox variant="default" color="#1BFD9C" animated={hudBoxAnimated}>
            <Text color="#1BFD9C">Default</Text>
          </HudBox>
          <HudBox variant="wide" color="#FF6B9D" animated={hudBoxAnimated}>
            <Text color="#FF6B9D">Wide</Text>
          </HudBox>
        </div>

        <Text variant="body" color="#00f6ff" style={{ marginBottom: '1rem' }}>
          Geometric Variants:
        </Text>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
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
            <Text color="#00FF00">Arrow Right</Text>
          </HudBox>
          <HudBox variant="chevron" color="#FFA500" animated={hudBoxAnimated}>
            <Text color="#FFA500">Chevron</Text>
          </HudBox>
        </div>

        <Text variant="body" color="#00f6ff" style={{ marginBottom: '1rem' }}>
          Portrait Variants (Vertical):
        </Text>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
          <HudBox variant="portrait-tall" color="#00CED1" animated={hudBoxAnimated}>
            <Text color="#00CED1" align="center">Portrait<br/>Tall</Text>
          </HudBox>
          <HudBox variant="portrait-slim" color="#FF1493" animated={hudBoxAnimated}>
            <Text color="#FF1493" align="center">Portrait<br/>Slim</Text>
          </HudBox>
          <HudBox variant="portrait-card" color="#7FFF00" animated={hudBoxAnimated}>
            <Text color="#7FFF00" align="center">Portrait<br/>Card</Text>
          </HudBox>
          <HudBox variant="portrait-banner" color="#FF69B4" animated={hudBoxAnimated}>
            <Text color="#FF69B4" align="center">Portrait<br/>Banner</Text>
          </HudBox>
        </div>

        <Text variant="body" color="#00f6ff" style={{ marginBottom: '1rem' }}>
          Landscape Variants (Horizontal):
        </Text>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', flexDirection: 'column', alignItems: 'center' }}>
          <HudBox variant="landscape-wide" color="#00BFFF" animated={hudBoxAnimated}>
            <Text color="#00BFFF">Landscape Wide</Text>
          </HudBox>
          <HudBox variant="landscape-ultra" color="#FF6347" animated={hudBoxAnimated}>
            <Text color="#FF6347">Landscape Ultra</Text>
          </HudBox>
          <HudBox variant="landscape-bar" color="#32CD32" animated={hudBoxAnimated}>
            <Text color="#32CD32">Landscape Bar</Text>
          </HudBox>
          <HudBox variant="landscape-ribbon" color="#BA55D3" animated={hudBoxAnimated}>
            <Text color="#BA55D3">Landscape Ribbon</Text>
          </HudBox>
        </div>

        <Text variant="body" color="#00f6ff" style={{ marginBottom: '1rem' }}>
          Custom Size:
        </Text>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <HudBox width="350px" height="180px" color="#FFD700">
            <Text color="#FFD700">Custom Size</Text>
          </HudBox>
        </div>

        <Text variant="h4" color="#ff00ff" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          HudFrame (Complex Frame with Neon Lines)
        </Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '800px', height: '400px', position: 'relative' }}>
            <HudFrame
              header={{
                title: 'SYSTEM STATUS',
                description: 'Real-time system monitoring',
                number: 1,
              }}
              color="#00f6ff"
            >
              <div style={{ padding: '2rem' }}>
                <Text color="#00f6ff" variant="h3" style={{ marginBottom: '1rem' }}>
                  HUD FRAME DEMO
                </Text>
                <Text color="#ffffff" variant="body">
                  This is a complex HUD frame with decorative neon lines around the edges.
                  Perfect for dashboards and monitoring interfaces.
                </Text>
              </div>
            </HudFrame>
          </div>
          <div style={{ width: '100%', maxWidth: '800px', height: '400px', position: 'relative' }}>
            <HudFrame
              header={{
                title: 'DATA ANALYSIS',
                description: 'Analytics dashboard',
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
                </Text>
              </div>
            </HudFrame>
          </div>
        </div>
      </section>

      {/* GlitchProfileCard Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#00ffff" style={{ marginBottom: '1rem' }}>
          GlitchProfileCard Component
        </Text>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
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
