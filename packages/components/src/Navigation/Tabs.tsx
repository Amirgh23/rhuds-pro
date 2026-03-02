/**
 * Tabs Component
 * Tabbed content navigation
 */

import React, { useState, useMemo } from 'react';
import { useTheme } from '@rhuds/core';
import { TabsProps } from './types';

/**
 * Tabs Component
 */
export const Tabs: React.FC<TabsProps> = ({
  items,
  activeIndex: controlledActiveIndex = 0,
  onChange,
  variant = 'line',
  className,
  style,
}) => {
  const theme = useTheme();
  const [internalActiveIndex, setInternalActiveIndex] = useState(controlledActiveIndex);

  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;

  const handleTabChange = (index: number) => {
    setInternalActiveIndex(index);
    onChange?.(index);
  };

  const containerStyle = useMemo<React.CSSProperties>(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      ...style,
    };
  }, [style]);

  const tabsHeaderStyle: React.CSSProperties = {
    display: 'flex',
    borderBottom: variant === 'line' ? `2px solid ${theme.currentMode.tokens.colors.primary}` : 'none',
    backgroundColor: variant === 'card' ? '#0a0a0a' : 'transparent',
    gap: variant === 'button' ? '0.5rem' : 0,
    padding: variant === 'button' ? '0.5rem' : 0,
  };

  const getTabStyle = (isActive: boolean): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      color: isActive && variant !== 'button' ? theme.currentMode.tokens.colors.primary : theme.currentMode.tokens.colors.text,
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: variant === 'card' ? '4px 4px 0 0' : 0,
      fontSize: '1rem',
      fontWeight: 500,
    };

    if (variant === 'line') {
      baseStyle.borderBottom = isActive 
        ? `3px solid ${theme.currentMode.tokens.colors.primary}` 
        : '3px solid transparent';
    }

    if (isActive) {
      if (variant === 'card') {
        baseStyle.backgroundColor = '#1a1a1a';
      } else if (variant === 'button') {
        baseStyle.backgroundColor = theme.currentMode.tokens.colors.primary;
        baseStyle.color = '#000';
      }
    }

    return baseStyle;
  };

  const contentStyle: React.CSSProperties = {
    padding: '1.5rem',
    backgroundColor: variant === 'card' ? '#1a1a1a' : 'transparent',
    borderRadius: variant === 'card' ? '0 0 4px 4px' : 0,
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={tabsHeaderStyle}>
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={index}
              style={getTabStyle(isActive)}
              onClick={() => !item.disabled && handleTabChange(index)}
              disabled={item.disabled}
              onMouseEnter={(e) => {
                if (!item.disabled && !isActive) {
                  (e.currentTarget as HTMLElement).style.color = theme.currentMode.tokens.colors.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (!item.disabled && !isActive) {
                  (e.currentTarget as HTMLElement).style.color = theme.currentMode.tokens.colors.text;
                }
              }}
            >
              {item.icon && <span>{item.icon} </span>}
              {item.label}
            </button>
          );
        })}
      </div>

      <div style={contentStyle}>
        {items[activeIndex]?.content}
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';
