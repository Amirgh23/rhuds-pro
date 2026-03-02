/**
 * Menu Component
 * Dropdown menu with nested items
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTheme } from '@rhuds/core';
import { MenuProps } from './types';

/**
 * Menu Component
 */
export const Menu: React.FC<MenuProps> = ({
  items,
  trigger,
  onItemClick,
  className,
  style,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const containerStyle = useMemo<React.CSSProperties>(() => {
    return {
      position: 'relative',
      display: 'inline-block',
      ...style,
    };
  }, [style]);

  const menuListStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#1a1a1a',
    border: `2px solid ${theme.currentMode.tokens.colors.primary}`,
    borderRadius: '4px',
    minWidth: '200px',
    zIndex: 1000,
    marginTop: '0.5rem',
    display: open ? 'block' : 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  };

  const itemStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    color: theme.currentMode.tokens.colors.text,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'block',
    width: '100%',
    textAlign: 'left',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '1rem',
  };

  const dividerStyle: React.CSSProperties = {
    height: '1px',
    backgroundColor: '#333',
    margin: '0.5rem 0',
  };

  const renderMenuItems = (menuItems: typeof items) => {
    return menuItems.map((item, index) => (
      <React.Fragment key={index}>
        {item.divider ? (
          <div style={dividerStyle} />
        ) : (
          <a
            href={item.href || '#'}
            style={{
              ...itemStyle,
              opacity: item.disabled ? 0.5 : 1,
              cursor: item.disabled ? 'not-allowed' : 'pointer',
            }}
            onClick={(e) => {
              if (!item.disabled) {
                e.preventDefault();
                onItemClick?.(item);
                setOpen(false);
              }
            }}
            onMouseEnter={(e) => {
              if (!item.disabled) {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0, 255, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            {item.icon && <span>{item.icon} </span>}
            {item.label}
          </a>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div ref={menuRef} style={containerStyle} className={className}>
      <button
        style={{
          backgroundColor: 'transparent',
          border: `2px solid ${theme.currentMode.tokens.colors.primary}`,
          color: theme.currentMode.tokens.colors.primary,
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          borderRadius: '4px',
          fontSize: '1rem',
          transition: 'all 0.2s ease-in-out',
        }}
        onClick={() => setOpen(!open)}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
        }}
      >
        {trigger || '☰ Menu'}
      </button>

      <div style={menuListStyle}>
        {renderMenuItems(items)}
      </div>
    </div>
  );
};

Menu.displayName = 'Menu';

