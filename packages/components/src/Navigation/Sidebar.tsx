/**
 * Sidebar Component
 * Collapsible sidebar navigation
 */

import React, { useState, useMemo } from 'react';
import { useTheme } from '@rhuds/core';
import { SidebarProps } from './types';

/**
 * Sidebar Component
 */
export const Sidebar: React.FC<SidebarProps> = ({
  items,
  width = 250,
  collapsible = true,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  className,
  style,
}) => {
  const theme = useTheme();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleCollapsedChange = (newCollapsed: boolean) => {
    setInternalCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  const sidebarStyle = useMemo<React.CSSProperties>(() => {
    return {
      width: collapsed ? '60px' : typeof width === 'number' ? `${width}px` : width,
      backgroundColor: '#1a1a1a',
      borderRight: `2px solid ${theme.currentMode.tokens.colors.primary}`,
      padding: '1rem 0',
      transition: 'width 0.3s ease-in-out',
      height: '100vh',
      overflowY: 'auto',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 99,
      ...style,
    };
  }, [collapsed, width, theme, style]);

  const itemStyle: React.CSSProperties = {
    padding: '1rem',
    color: theme.currentMode.tokens.colors.text,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    borderLeft: `3px solid transparent`,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.95rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const toggleStyle: React.CSSProperties = {
    padding: '1rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.currentMode.tokens.colors.primary,
    fontSize: '1.2rem',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'center',
    borderBottom: `1px solid ${theme.currentMode.tokens.colors.primary}`,
  };

  return (
    <aside className={className} style={sidebarStyle}>
      {collapsible && (
        <button
          style={toggleStyle}
          onClick={() => handleCollapsedChange(!collapsed)}
        >
          {collapsed ? '→' : '←'}
        </button>
      )}

      <nav>
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href || '#'}
            style={{
              ...itemStyle,
              borderLeftColor: item.active ? theme.currentMode.tokens.colors.primary : 'transparent',
              backgroundColor: item.active ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
              opacity: item.disabled ? 0.5 : 1,
              cursor: item.disabled ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!item.disabled) {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0, 255, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!item.disabled) {
                (e.currentTarget as HTMLElement).style.backgroundColor = item.active
                  ? 'rgba(0, 255, 255, 0.1)'
                  : 'transparent';
              }
            }}
          >
            {item.icon && <span>{item.icon}</span>}
            {!collapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';

