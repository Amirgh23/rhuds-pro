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

  // Safe theme access with fallback
  const primaryColor = theme?.currentMode?.tokens?.colors?.primary || '#29F2DF';
  const textColor = theme?.currentMode?.tokens?.colors?.text || '#ffffff';

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
    borderBottom: variant === 'line' ? `2px solid ${primaryColor}` : 'none',
    backgroundColor: variant === 'card' ? '#0a0a0a' : 'transparent',
    gap: variant === 'button' ? '0.5rem' : 0,
    padding: variant === 'button' ? '0.5rem' : 0,
    flexWrap: 'wrap',
    maxWidth: '100%',
    boxSizing: 'border-box',
  };

  const getTabStyle = (isActive: boolean): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem)',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      color: isActive && variant !== 'button' ? primaryColor : textColor,
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: variant === 'card' ? '4px 4px 0 0' : 0,
      fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
      fontWeight: 500,
      whiteSpace: 'nowrap',
      flex: '1 1 auto',
      minWidth: 'fit-content',
      textAlign: 'center',
    };

    if (variant === 'line') {
      baseStyle.borderBottom = isActive 
        ? `3px solid ${primaryColor}` 
        : '3px solid transparent';
    }

    if (isActive) {
      if (variant === 'card') {
        baseStyle.backgroundColor = '#1a1a1a';
      } else if (variant === 'button') {
        baseStyle.backgroundColor = primaryColor;
        baseStyle.color = '#000';
      }
    }

    return baseStyle;
  };

  const contentStyle: React.CSSProperties = {
    padding: 'clamp(1rem, 3vw, 1.5rem)',
    backgroundColor: variant === 'card' ? '#1a1a1a' : 'transparent',
    borderRadius: variant === 'card' ? '0 0 4px 4px' : 0,
    maxWidth: '100%',
    overflowX: 'hidden',
    boxSizing: 'border-box',
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
                  (e.currentTarget as HTMLElement).style.color = primaryColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!item.disabled && !isActive) {
                  (e.currentTarget as HTMLElement).style.color = textColor;
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
