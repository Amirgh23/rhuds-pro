/**
 * Navigation Components Demo
 * Demonstrates all navigation components with interactive examples
 */

import React, { useState } from 'react';
import { Navbar, Sidebar, Breadcrumb, Tabs, Menu, Pagination } from '../index';
import { Text, Button } from '../index';

export const NavigationDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Services', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Navigation', href: '#' },
  ];

  const menuItems = [
    { label: 'Profile', onClick: () => console.log('Profile clicked') },
    { label: 'Settings', onClick: () => console.log('Settings clicked') },
    { label: 'Logout', onClick: () => console.log('Logout clicked') },
  ];

  const sidebarItems = [
    { label: 'Dashboard', icon: '📊', href: '#' },
    { label: 'Analytics', icon: '📈', href: '#' },
    { label: 'Reports', icon: '📄', href: '#' },
    { label: 'Settings', icon: '⚙️', href: '#' },
  ];

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0A1225', minHeight: '100vh', color: '#fff' }}>
      <Text variant="h1" style={{ marginBottom: '2rem' }}>
        Navigation Components Demo
      </Text>

      {/* Navbar Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Navbar Component
        </Text>
        <Navbar
          items={navItems}
          brand="RHUDS"
          collapsible={true}
        />
      </section>

      {/* Breadcrumb Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Breadcrumb Component
        </Text>
        <Breadcrumb
          items={breadcrumbItems}
          separator="/"
        />
      </section>

      {/* Tabs Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Tabs Component
        </Text>
        <Tabs
          items={[
            { label: 'Overview', content: 'Overview content' },
            { label: 'Details', content: 'Details content' },
            { label: 'Settings', content: 'Settings content' },
          ]}
          activeIndex={0}
          onChange={(index) => setActiveTab(String(index))}
          variant="line"
        />
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#0A1225', borderRadius: '4px' }}>
          <Text>Content for tab {activeTab}</Text>
        </div>
      </section>

      {/* Sidebar Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Sidebar Component
        </Text>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Sidebar
            items={sidebarItems}
            collapsible={true}
            collapsed={!sidebarOpen}
            onCollapsedChange={(collapsed) => setSidebarOpen(!collapsed)}
          />
          <div style={{ flex: 1 }}>
            <Button onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? 'Close' : 'Open'} Sidebar
            </Button>
          </div>
        </div>
      </section>

      {/* Menu Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Menu Component
        </Text>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? 'Close' : 'Open'} Menu
          </Button>
          {menuOpen && (
            <Menu
              items={menuItems}
              onItemClick={(item) => {
                console.log('Menu item clicked:', item);
                setMenuOpen(false);
              }}
            />
          )}
        </div>
      </section>

      {/* Pagination Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Pagination Component
        </Text>
        <Pagination
          total={250}
          perPage={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          showPageSize={true}
          pageSizeOptions={[10, 20, 50, 100]}
        />
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#0A1225', borderRadius: '4px' }}>
          <Text>
            Showing items {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, 250)} of 250
          </Text>
        </div>
      </section>
    </div>
  );
};

NavigationDemo.displayName = 'NavigationDemo';
