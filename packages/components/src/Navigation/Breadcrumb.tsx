/**
 * Breadcrumb Component
 * Navigation breadcrumb trail
 */

import React, { useMemo } from 'react';
import { useTheme } from '@rhuds/core';
import { BreadcrumbProps } from './types';

/**
 * Breadcrumb Component
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  className,
  style,
}) => {
  const theme = useTheme();

  const containerStyle = useMemo<React.CSSProperties>(() => {
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.95rem',
      ...style,
    };
  }, [style]);

  const itemStyle: React.CSSProperties = {
    color: theme.currentMode.tokens.colors.text,
    cursor: 'pointer',
    transition: 'color 0.2s ease-in-out',
    textDecoration: 'none',
  };

  const activeItemStyle: React.CSSProperties = {
    color: theme.currentMode.tokens.colors.primary,
    cursor: 'default',
  };

  const separatorStyle: React.CSSProperties = {
    color: '#666',
    margin: '0 0.25rem',
  };

  return (
    <nav className={className} style={containerStyle}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <a
            href={item.href || '#'}
            style={{
              ...itemStyle,
              ...(item.active ? activeItemStyle : {}),
            }}
            onMouseEnter={(e) => {
              if (!item.active) {
                (e.currentTarget as HTMLElement).style.color = theme.currentMode.tokens.colors.primary;
              }
            }}
            onMouseLeave={(e) => {
              if (!item.active) {
                (e.currentTarget as HTMLElement).style.color = theme.currentMode.tokens.colors.text;
              }
            }}
          >
            {item.label}
          </a>
          {index < items.length - 1 && (
            <span style={separatorStyle}>{separator}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';

