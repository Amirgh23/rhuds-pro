/**
 * Navbar Component
 * Responsive navigation bar
 */

import React, { useState, useMemo } from 'react';
import { useTheme } from '@rhuds/core';
import { NavbarProps } from './types';

/**
 * Navbar Component
 */
export const Navbar: React.FC<NavbarProps> = ({
  items,
  brand,
  position = 'sticky',
  collapsible = true,
  className,
  style,
}) => {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  // Safe theme access with fallback
  const primaryColor = theme?.currentMode?.tokens?.colors?.primary || '#29F2DF';
  const textColor = theme?.currentMode?.tokens?.colors?.text || '#ffffff';

  const navbarStyle = useMemo<React.CSSProperties>(() => {
    return {
      position: position as any,
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#0A1225',
      borderBottom: `2px solid ${primaryColor}`,
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 900,
      ...style,
    };
  }, [position, primaryColor, style]);

  const brandStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: primaryColor,
    cursor: 'pointer',
  };

  const navItemsStyle: React.CSSProperties = {
    display: collapsed ? 'none' : 'flex',
    gap: '2rem',
    alignItems: 'center',
  };

  const navItemStyle: React.CSSProperties = {
    color: textColor,
    cursor: 'pointer',
    transition: 'color 0.2s ease-in-out',
    textDecoration: 'none',
    fontSize: '1rem',
  };

  const toggleStyle: React.CSSProperties = {
    display: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    color: primaryColor,
    fontSize: '1.5rem',
    cursor: 'pointer',
  };

  return (
    <nav className={className} style={navbarStyle}>
      {brand && <div style={brandStyle}>{brand}</div>}

      <div style={navItemsStyle}>
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href || '#'}
            style={{
              ...navItemStyle,
              color: item.active ? primaryColor : textColor,
              opacity: item.disabled ? 0.5 : 1,
              cursor: item.disabled ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!item.disabled) {
                (e.currentTarget as HTMLElement).style.color = primaryColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!item.disabled) {
                (e.currentTarget as HTMLElement).style.color = item.active
                  ? primaryColor
                  : textColor;
              }
            }}
          >
            {item.label}
          </a>
        ))}
      </div>

      {collapsible && (
        <button
          style={toggleStyle}
          onClick={() => setCollapsed(!collapsed)}
        >
          ☰
        </button>
      )}
    </nav>
  );
};

Navbar.displayName = 'Navbar';

