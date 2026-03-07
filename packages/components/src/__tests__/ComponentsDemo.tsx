/**
 * Components Demo
 * Showcase of all basic and layout components
 */

import React, { useState } from 'react';
import { Text, Button, HudButton, GlitchButton, Icon, Input, HackerInput, Select, Grid, Container, Stack, HudBox, HudFrame, GlitchFrame, GlitchProfileCard, AbstergoLoader, HeartRateLoader, HoloInput, FuturisticInput } from '../index';
import { GlitchLoginForm } from '../Form/GlitchLoginForm';

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
    <Container maxWidth="1200px" padding="2rem" style={{ background: '#0A1225' }}>
      <Text variant="h1" color="#29F2DF" style={{ marginBottom: '2rem' }}>
        RHUDS Pro Components Demo
      </Text>

      {/* Text Component Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
          Text Component
        </Text>
        <Grid columns={2} gap="1rem">
          <div>
            <Text variant="h3" color="#29F2DF">
              Heading 3
            </Text>
            <Text variant="body" color="#ffffff">
              This is body text with default styling
            </Text>
            <Text variant="caption" color="#29F2DF">
              This is caption text
            </Text>
          </div>
          <div>
            <Text variant="h4" weight="bold" color="#29F2DF">
              Bold Heading
            </Text>
            <Text variant="body" align="center" color="#ffffff">
              Centered text
            </Text>
            <Text variant="code" color="#29F2DF">
              const x = 42;
            </Text>
          </div>
        </Grid>
      </section>

      {/* Button Component Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
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

        <Text variant="h4" color="#1C7FA6" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          HUD Button
        </Text>
        <Stack direction="row" gap="1rem" align="center" style={{ flexWrap: 'wrap' }}>
          <HudButton>I'M READY</HudButton>
          <HudButton>LAUNCH</HudButton>
          <HudButton>ACTIVATE</HudButton>
          <HudButton disabled>DISABLED</HudButton>
        </Stack>

        <Text variant="h4" color="#1C7FA6" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
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
        <Text variant="h2" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
          Icon Component
        </Text>
        <Stack direction="row" gap="2rem" align="center">
          <div style={{ textAlign: 'center' }}>
            <Icon name="check" size={32} color="#29F2DF" />
            <Text variant="caption" style={{ marginTop: '0.5rem' }}>
              Check
            </Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name="close" size={32} color="#EF3EF1" />
            <Text variant="caption" style={{ marginTop: '0.5rem' }}>
              Close
            </Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name="search" size={32} color="#1C7FA6" />
            <Text variant="caption" style={{ marginTop: '0.5rem' }}>
              Search
            </Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name="star" size={32} color="#29F2DF" />
            <Text variant="caption" style={{ marginTop: '0.5rem' }}>
              Star
            </Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name="heart" size={32} color="#EF3EF1" />
            <Text variant="caption" style={{ marginTop: '0.5rem' }}>
              Heart
            </Text>
          </div>
        </Stack>
      </section>

      {/* Input Component Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#29F2DF" style={{ marginBottom: '1rem' }}>
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

        <Text variant="h4" color="#29F2DF" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          HoloInput (Holographic Interface)
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
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
        </div>

        <Text variant="h4" color="#29F2DF" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          FuturisticInput (Geometric HUD Design)
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <FuturisticInput
            enterLabel="ENTER"
            nameLabel="NAME"
            placeholder=""
          />
          <FuturisticInput
            enterLabel="INPUT"
            nameLabel="DATA"
            placeholder=""
          />
        </div>
      </section>

      {/* GlitchLoginForm Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#29F2DF" style={{ marginBottom: '1rem' }}>
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

      {/* Select Component Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#29F2DF" style={{ marginBottom: '1rem' }}>
          Select Component
        </Text>
        <Grid columns={2} gap="2rem">
          <Select
            label="Basic Select"
            options={options}
            value={selectedValue}
            onChange={(v) => setSelectedValue(String(v))}
            placeholder="Choose an option"
          />
          <Select
            label="Searchable Select"
            options={options}
            value={selectedValue}
            onChange={(v) => setSelectedValue(String(v))}
            searchable={true}
            placeholder="Search options..."
          />
        </Grid>
      </section>

      {/* Layout Components Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#29F2DF" style={{ marginBottom: '1rem' }}>
          Layout Components
        </Text>

        <Text variant="h4" color="#EF3EF1" style={{ marginBottom: '1rem' }}>
          Grid Layout
        </Text>
        <Grid columns={3} gap="1rem" style={{ marginBottom: '2rem' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                padding: '1rem',
                border: '2px solid #1C7FA6',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              <Text color="#1C7FA6">Item {i}</Text>
            </div>
          ))}
        </Grid>

        <Text variant="h4" color="#EF3EF1" style={{ marginBottom: '1rem' }}>
          Stack Layout (Row)
        </Text>
        <Stack direction="row" gap="1rem" style={{ marginBottom: '2rem' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                padding: '1rem',
                border: '2px solid #29F2DF',
                borderRadius: '4px',
                flex: 1,
                textAlign: 'center',
              }}
            >
              <Text color="#29F2DF">Item {i}</Text>
            </div>
          ))}
        </Stack>

        <Text variant="h4" color="#EF3EF1" style={{ marginBottom: '1rem' }}>
          Stack Layout (Column)
        </Text>
        <Stack direction="column" gap="1rem">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                padding: '1rem',
                border: '2px solid #EF3EF1',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              <Text color="#EF3EF1">Item {i}</Text>
            </div>
          ))}
        </Stack>

        <Text variant="h4" color="#EF3EF1" style={{ marginBottom: '1rem', marginTop: '2rem' }}>
          HudBox (Asymmetrical Container) - 18 Variants with Different Colors
        </Text>
        
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <HudButton onClick={() => setHudBoxAnimated(!hudBoxAnimated)}>
            {hudBoxAnimated ? '? Switch to Static Border' : '? Switch to Animated Border'}
          </HudButton>
          <Text color="#29F2DF">
            Current Mode: {hudBoxAnimated ? 'Animated' : 'Static'}
          </Text>
        </div>
        
        <Text variant="body" color="#29F2DF" style={{ marginBottom: '1rem' }}>
          Standard Variants:
        </Text>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
          <HudBox variant="compact" color="#29F2DF" animated={hudBoxAnimated}>
            <Text color="#29F2DF">Compact</Text>
          </HudBox>
          <HudBox variant="default" color="#29F2DF" animated={hudBoxAnimated}>
            <Text color="#29F2DF">Default</Text>
          </HudBox>
          <HudBox variant="wide" color="#EF3EF1" animated={hudBoxAnimated}>
            <Text color="#EF3EF1">Wide</Text>
          </HudBox>
        </div>

        <Text variant="body" color="#29F2DF" style={{ marginBottom: '1rem' }}>
          Geometric Variants:
        </Text>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
          <HudBox variant="hexagon" color="#1C7FA6" animated={hudBoxAnimated}>
            <Text color="#1C7FA6">Hexagon</Text>
          </HudBox>
          <HudBox variant="octagon" color="#EF3EF1" animated={hudBoxAnimated}>
            <Text color="#EF3EF1">Octagon</Text>
          </HudBox>
          <HudBox variant="diagonal" color="#29F2DF" animated={hudBoxAnimated}>
            <Text color="#29F2DF">Diagonal</Text>
          </HudBox>
          <HudBox variant="corner-cut" color="#1C7FA6" animated={hudBoxAnimated}>
            <Text color="#1C7FA6">Corner Cut</Text>
          </HudBox>
          <HudBox variant="tech-panel" color="#EF3EF1" animated={hudBoxAnimated}>
            <Text color="#EF3EF1">Tech Panel</Text>
          </HudBox>
          <HudBox variant="arrow-right" color="#29F2DF" animated={hudBoxAnimated}>
            <Text color="#29F2DF">Arrow Right</Text>
          </HudBox>
          <HudBox variant="chevron" color="#1C7FA6" animated={hudBoxAnimated}>
            <Text color="#1C7FA6">Chevron</Text>
          </HudBox>
        </div>

        <Text variant="body" color="#29F2DF" style={{ marginBottom: '1rem' }}>
          Portrait Variants (Vertical):
        </Text>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
          <HudBox variant="portrait-tall" color="#29F2DF" animated={hudBoxAnimated}>
            <Text color="#29F2DF" align="center">Portrait<br/>Tall</Text>
          </HudBox>
          <HudBox variant="portrait-slim" color="#EF3EF1" animated={hudBoxAnimated}>
            <Text color="#EF3EF1" align="center">Portrait<br/>Slim</Text>
          </HudBox>
          <HudBox variant="portrait-card" color="#1C7FA6" animated={hudBoxAnimated}>
            <Text color="#1C7FA6" align="center">Portrait<br/>Card</Text>
          </HudBox>
          <HudBox variant="portrait-banner" color="#EF3EF1" animated={hudBoxAnimated}>
            <Text color="#EF3EF1" align="center">Portrait<br/>Banner</Text>
          </HudBox>
        </div>

        <Text variant="body" color="#29F2DF" style={{ marginBottom: '1rem' }}>
          Landscape Variants (Horizontal):
        </Text>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', flexDirection: 'column', alignItems: 'center' }}>
          <HudBox variant="landscape-wide" color="#29F2DF" animated={hudBoxAnimated}>
            <Text color="#29F2DF">Landscape Wide</Text>
          </HudBox>
          <HudBox variant="landscape-ultra" color="#EF3EF1" animated={hudBoxAnimated}>
            <Text color="#EF3EF1">Landscape Ultra</Text>
          </HudBox>
          <HudBox variant="landscape-bar" color="#1C7FA6" animated={hudBoxAnimated}>
            <Text color="#1C7FA6">Landscape Bar</Text>
          </HudBox>
          <HudBox variant="landscape-ribbon" color="#EF3EF1" animated={hudBoxAnimated}>
            <Text color="#EF3EF1">Landscape Ribbon</Text>
          </HudBox>
        </div>

        <Text variant="body" color="#29F2DF" style={{ marginBottom: '1rem' }}>
          Custom Size:
        </Text>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <HudBox width="350px" height="180px" color="#29F2DF">
            <Text color="#29F2DF">Custom Size</Text>
          </HudBox>
        </div>

        <Text variant="h4" color="#EF3EF1" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
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
              color="#29F2DF"
            >
              <div style={{ padding: '2rem' }}>
                <Text color="#29F2DF" variant="h3" style={{ marginBottom: '1rem' }}>
                  HUD FRAME DEMO
                </Text>
                <Text color="#29F2DF" variant="body">
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
              color="#29F2DF"
            >
              <div style={{ padding: '2rem' }}>
                <Text color="#29F2DF" variant="h3" style={{ marginBottom: '1rem' }}>
                  GREEN THEME
                </Text>
                <Text color="#29F2DF" variant="body">
                  HudFrame supports custom colors for all neon lines and title box.
                </Text>
              </div>
            </HudFrame>
          </div>
        </div>

        <Text variant="h4" color="#EF3EF1" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          GlitchFrame (Glitch Style Frame)
        </Text>
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
          <HudButton onClick={() => setHudBoxAnimated(!hudBoxAnimated)}>
            {hudBoxAnimated ? '? Static Frame' : '? Animated Frame'}
          </HudButton>
          <Text color="#29F2DF">
            Mode: {hudBoxAnimated ? 'Animated' : 'Static'}
          </Text>
        </div>
        
        <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Large Size:
        </Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '100%', maxWidth: '600px', minHeight: '300px' }}>
            <GlitchFrame animated={hudBoxAnimated}>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <Text color="#29F2DF" variant="h3" style={{ marginBottom: '1rem' }}>
                  GLITCH FRAME
                </Text>
                <Text color="#29F2DF" variant="body" style={{ marginBottom: '1rem' }}>
                  Asymmetrical frame with glitch effects and animated shadows.
                </Text>
                <Text color="#29F2DF" variant="body">
                  Toggle animation on/off with the button above.
                </Text>
              </div>
            </GlitchFrame>
          </div>
        </div>

        <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Medium & Small Sizes:
        </Text>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div style={{ width: '100%', maxWidth: '400px', minHeight: '220px' }}>
            <GlitchFrame animated={hudBoxAnimated} width="400px" height="220px">
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <Text color="#29F2DF" variant="h4" style={{ marginBottom: '0.5rem' }}>
                  MEDIUM
                </Text>
                <Text color="#29F2DF" variant="body">
                  400px frame
                </Text>
              </div>
            </GlitchFrame>
          </div>
          <div style={{ width: '100%', maxWidth: '300px', minHeight: '200px' }}>
            <GlitchFrame animated={hudBoxAnimated} width="300px" height="200px">
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <Text color="#29F2DF" variant="h5" style={{ marginBottom: '0.5rem' }}>
                  SMALL
                </Text>
                <Text color="#29F2DF" variant="caption">
                  300px frame
                </Text>
              </div>
            </GlitchFrame>
          </div>
        </div>

        <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Tall/Portrait Layout:
        </Text>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div style={{ width: '100%', maxWidth: '300px', minHeight: '500px' }}>
            <GlitchFrame animated={hudBoxAnimated} width="300px" height="500px">
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <Text color="#29F2DF" variant="h4" style={{ marginBottom: '0.5rem' }}>
                  TALL PANEL
                </Text>
                <Text color="#29F2DF" variant="body">
                  Vertical layout for side panels
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
                  Extended vertical space
                </Text>
              </div>
            </GlitchFrame>
          </div>
        </div>

        <Text color="#29F2DF" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Wide Layout:
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '700px', minHeight: '180px' }}>
            <GlitchFrame animated={hudBoxAnimated} width="700px" height="180px">
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <Text color="#29F2DF" variant="h4" style={{ marginBottom: '0.5rem' }}>
                  WIDE PANEL
                </Text>
                <Text color="#29F2DF" variant="body">
                  Perfect for dashboard headers
                </Text>
              </div>
            </GlitchFrame>
          </div>
        </div>
      </section>

      {/* GlitchProfileCard Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#29F2DF" style={{ marginBottom: '1rem' }}>
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

      {/* AbstergoLoader Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#29F2DF" style={{ marginBottom: '1rem' }}>
          Loader Components
        </Text>
        
        <Text variant="h4" color="#29F2DF" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          AbstergoLoader (Triangular Animation)
        </Text>
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', padding: '3rem', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>
          <AbstergoLoader text="Loading" size={0.8} />
          <AbstergoLoader text="Synchronization" size={1} />
          <AbstergoLoader text="Processing" size={1.2} />
        </div>

        <Text variant="h4" color="#FF6B9D" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          HeartRateLoader (ECG Animation)
        </Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', padding: '3rem', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>
          <HeartRateLoader color="#EF3EF1" width={550} height={210} />
          <HeartRateLoader color="#29F2DF" width={400} height={150} />
          <HeartRateLoader color="#29F2DF" width={300} height={120} />
        </div>
      </section>

      {/* Combined Example */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#29F2DF" style={{ marginBottom: '1rem' }}>
          Combined Example
        </Text>
        <div
          style={{
            border: '2px solid #1C7FA6',
            borderRadius: '8px',
            padding: '2rem',
            background: '#0A1225',
          }}
        >
          <Stack direction="column" gap="1.5rem">
            <Text variant="h3" color="#29F2DF">
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
