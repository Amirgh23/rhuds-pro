/**
 * Accordion Component
 * Expandable accordion with multiple items
 */

import React, { useState, useMemo } from 'react';
import { useTheme } from '@rhuds/core';
import { AccordionProps } from './types';

/**
 * Accordion Component
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  expandedItems: controlledExpandedItems = [],
  onExpand,
  onCollapse,
  allowMultiple = false,
  animationDuration = 300,
  className,
  style,
}) => {
  const themeContext = useTheme();
  const theme = (themeContext as any).currentMode?.tokens || (themeContext as any);
  const [internalExpandedItems, setInternalExpandedItems] = useState<string[]>(controlledExpandedItems);

  const expandedItems = controlledExpandedItems.length > 0 ? controlledExpandedItems : internalExpandedItems;

  const handleToggle = (key: string) => {
    let newExpandedItems: string[];

    if (expandedItems.includes(key)) {
      newExpandedItems = expandedItems.filter((k) => k !== key);
      onCollapse?.(key);
    } else {
      if (allowMultiple) {
        newExpandedItems = [...expandedItems, key];
      } else {
        newExpandedItems = [key];
      }
      onExpand?.(key);
    }

    setInternalExpandedItems(newExpandedItems);
  };

  const containerStyle = useMemo<React.CSSProperties>(() => {
    return {
      backgroundColor: theme.currentMode.tokens.colors.background,
      color: theme.currentMode.tokens.colors.text,
      borderRadius: '4px',
      overflow: 'hidden',
      border: `1px solid ${theme.currentMode.tokens.colors.primary}`,
      ...style,
    };
  }, [theme, style]);

  const itemStyle: React.CSSProperties = {
    borderBottom: `1px solid ${theme.currentMode.tokens.colors.primary}`,
  };

  const headerStyle: React.CSSProperties = {
    padding: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: theme.currentMode.tokens.colors.background,
    transition: 'background-color 0.2s ease-in-out',
    userSelect: 'none',
  };

  const contentStyle: React.CSSProperties = {
    padding: '1rem',
    backgroundColor: theme.currentMode.tokens.colors.background,
  };

  const contentWrapperStyle = (isExpanded: boolean): React.CSSProperties => ({
    maxHeight: isExpanded ? '1000px' : '0px',
    overflow: 'hidden',
    transition: `max-height ${animationDuration}ms ease-in-out`,
  });

  return (
    <div className={className} style={containerStyle}>
      {items.map((item, index) => {
        const isExpanded = expandedItems.includes(item.key);

        return (
          <div key={item.key} style={index < items.length - 1 ? itemStyle : {}}>
            <div
              style={headerStyle}
              onClick={() => !item.disabled && handleToggle(item.key)}
              onMouseEnter={(e) => {
                if (!item.disabled) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = theme.currentMode.tokens.colors.primary;
                  (e.currentTarget as HTMLElement).style.opacity = '0.1';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = theme.currentMode.tokens.colors.background;
              }}
            >
              <span
                style={{
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: `transform ${animationDuration}ms ease-in-out`,
                  display: 'inline-block',
                  opacity: item.disabled ? 0.5 : 1,
                }}
              >
                ▼
              </span>
              {item.icon && <span>{item.icon}</span>}
              <span style={{ flex: 1, fontWeight: 600, opacity: item.disabled ? 0.5 : 1 }}>
                {item.title}
              </span>
            </div>
            <div style={contentWrapperStyle(isExpanded)}>
              <div style={contentStyle}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

Accordion.displayName = 'Accordion';


