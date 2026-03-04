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
  position = 'fixed',
  collapsible = true,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  className,
  style,
}) => {
  const theme = useTheme();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Safe theme access with fallback
  const primaryColor = theme?.currentMode?.tokens?.colors?.primary || '#00f6ff';
  const textColor = theme?.currentMode?.tokens?.colors?.text || '#ffffff';

  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleCollapsedChange = (newCollapsed: boolean) => {
    setInternalCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  const sidebarStyle = useMemo<React.CSSProperties>(() => {
    const baseStyle: React.CSSProperties = {
      width: collapsed ? '60px' : typeof width === 'number' ? `${width}px` : width,
      backgroundColor: '#1a1a1a',
      borderRight: `2px solid ${primaryColor}`,
      padding: '1rem 0',
      transition: 'width 0.3s ease-in-out',
      overflowY: 'auto',
      ...style,
    };

    if (position === 'fixed') {
      baseStyle.position = 'fixed';
      baseStyle.height = '100vh';
      baseStyle.left = 0;
      baseStyle.top = 0;
      baseStyle.zIndex = 950;
    } else if (position === 'relative') {
      baseStyle.position = 'relative';
      baseStyle.height = '100%';
    } else {
      baseStyle.position = position as any;
    }

    return baseStyle;
  }, [collapsed, width, primaryColor, position, style]);

  const itemStyle: React.CSSProperties = {
    padding: '1rem',
    color: textColor,
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
    color: primaryColor,
    fontSize: '1.2rem',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'center',
    borderBottom: `1px solid ${primaryColor}`,
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
              borderLeftColor: item.active ? primaryColor : 'transparent',
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

