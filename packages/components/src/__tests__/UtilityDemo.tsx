/**
 * Utility Components Demo
 * Demonstrates Tooltip, Popover, and Dropdown components
 */

import React, { useState } from 'react';
import { Tooltip, Popover, Dropdown } from '../index';
import { Text, Button } from '../index';

export const UtilityDemo: React.FC = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownItems: any[] = [
    { key: 'profile', label: 'Profile', icon: '👤' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
    { key: 'divider1', divider: true },
    { key: 'help', label: 'Help', icon: '❓' },
    { key: 'logout', label: 'Logout', icon: '🚪', onClick: () => console.log('Logout clicked') },
  ];

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <Text variant="h1" style={{ marginBottom: '2rem' }}>
        Utility Components Demo
      </Text>

      {/* Tooltip Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Tooltip Component
        </Text>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Tooltip content="This is a top tooltip" position="top">
            <Button>Hover (Top)</Button>
          </Tooltip>
          <Tooltip content="This is a bottom tooltip" position="bottom">
            <Button>Hover (Bottom)</Button>
          </Tooltip>
          <Tooltip content="This is a left tooltip" position="left">
            <Button>Hover (Left)</Button>
          </Tooltip>
          <Tooltip content="This is a right tooltip" position="right">
            <Button>Hover (Right)</Button>
          </Tooltip>
        </div>
      </section>

      {/* Popover Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Popover Component
        </Text>
        <Popover
          content={
            <div>
              <Text style={{ marginBottom: '0.5rem' }}>
                This is a popover with custom content.
              </Text>
              <Text style={{ fontSize: '0.9rem' }}>
                Click outside to close.
              </Text>
            </div>
          }
          title="Popover Title"
          position="bottom"
          isOpen={popoverOpen}
          onOpenChange={setPopoverOpen}
          closeOnOutsideClick={true}
        >
          <Button onClick={() => setPopoverOpen(!popoverOpen)}>
            {popoverOpen ? 'Close' : 'Open'} Popover
          </Button>
        </Popover>
      </section>

      {/* Dropdown Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Dropdown Component
        </Text>
        <Dropdown
          items={dropdownItems}
          position="bottom"
          isOpen={dropdownOpen}
          onOpenChange={setDropdownOpen}
          onItemClick={(item) => console.log('Item clicked:', item.label)}
          closeOnItemClick={true}
          closeOnOutsideClick={true}
        >
          <Button onClick={() => setDropdownOpen(!dropdownOpen)}>
            {dropdownOpen ? 'Close' : 'Open'} Menu
          </Button>
        </Dropdown>
      </section>

      {/* Features */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Features
        </Text>
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '4px', padding: '1rem' }}>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Tooltip with 4 positions</Text>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Popover with title and content</Text>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Dropdown with icons and dividers</Text>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Configurable animations</Text>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Outside click handling</Text>
          <Text style={{ marginBottom: '0.5rem' }}>✓ Theme integration</Text>
          <Text>✓ Smooth positioning and transitions</Text>
        </div>
      </section>

      {/* Positions Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Position Examples
        </Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div>
            <Text style={{ marginBottom: '0.5rem' }}>Top Position:</Text>
            <Tooltip content="Top tooltip" position="top">
              <Button>Hover</Button>
            </Tooltip>
          </div>
          <div>
            <Text style={{ marginBottom: '0.5rem' }}>Bottom Position:</Text>
            <Tooltip content="Bottom tooltip" position="bottom">
              <Button>Hover</Button>
            </Tooltip>
          </div>
          <div>
            <Text style={{ marginBottom: '0.5rem' }}>Left Position:</Text>
            <Tooltip content="Left tooltip" position="left">
              <Button>Hover</Button>
            </Tooltip>
          </div>
          <div>
            <Text style={{ marginBottom: '0.5rem' }}>Right Position:</Text>
            <Tooltip content="Right tooltip" position="right">
              <Button>Hover</Button>
            </Tooltip>
          </div>
        </div>
      </section>
    </div>
  );
};

UtilityDemo.displayName = 'UtilityDemo';
