/**
 * Dropdown Component
 * Dropdown menu with items
 */

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useTheme } from '@rhuds/core';
import { Portal } from './Portal';
import { DropdownProps } from './types';

/**
 * Dropdown Component
 */
export const Dropdown: React.FC<DropdownProps> = ({
  items,
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
  onItemClick,
  position = 'bottom',
  closeOnItemClick = true,
  closeOnOutsideClick = true,
  animationDuration = 200,
  className,
  style,
}) => {
  const theme = useTheme();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setInternalIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  const updatePosition = () => {
    if (triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = triggerRect.top - dropdownRect.height - 10;
          left = triggerRect.left;
          break;
        case 'bottom':
          top = triggerRect.bottom + 10;
          left = triggerRect.left;
          break;
        case 'left':
          top = triggerRect.top;
          left = triggerRect.left - dropdownRect.width - 10;
          break;
        case 'right':
          top = triggerRect.top;
          left = triggerRect.right + 10;
          break;
      }

      setDropdownPos({ top: top + window.scrollY, left: left + window.scrollX });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      if (closeOnOutsideClick) {
        const handleClickOutside = (e: MouseEvent) => {
          if (
            triggerRef.current &&
            dropdownRef.current &&
            !triggerRef.current.contains(e.target as Node) &&
            !dropdownRef.current.contains(e.target as Node)
          ) {
            setInternalIsOpen(false);
            onOpenChange?.(false);
          }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
          document.removeEventListener('click', handleClickOutside);
          window.removeEventListener('scroll', updatePosition);
          window.removeEventListener('resize', updatePosition);
        };
      }
    }
  }, [isOpen, closeOnOutsideClick, onOpenChange]);

  const handleItemClick = (item: any) => {
    onItemClick?.(item);
    item.onClick?.();

    if (closeOnItemClick) {
      setInternalIsOpen(false);
      onOpenChange?.(false);
    }
  };

  const dropdownStyle = useMemo<React.CSSProperties>(() => {
    const tokens = (theme as any)?.currentMode?.tokens || theme;
    return {
      position: 'fixed',
      top: dropdownPos.top,
      left: dropdownPos.left,
      backgroundColor: tokens.colors?.background || '#1a1a1a',
      color: tokens.colors?.text || '#ffffff',
      border: `1px solid ${tokens.colors?.primary || '#00f6ff'}`,
      borderRadius: '4px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      minWidth: '200px',
      zIndex: 1001,
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? 'auto' : 'none',
      transition: `opacity ${animationDuration}ms ease-in-out`,
      ...style,
    };
  }, [dropdownPos, isOpen, animationDuration, theme, style]);

  const itemStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s ease-in-out',
  };

  const dividerStyle: React.CSSProperties = useMemo(() => {
    const tokens = (theme as any)?.currentMode?.tokens || theme;
    return {
      height: '1px',
      backgroundColor: tokens.colors?.primary || '#00f6ff',
      margin: '0.25rem 0',
    };
  }, [theme]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleToggle}
        style={{ display: 'inline-block', cursor: 'pointer' }}
      >
        {children}
      </div>
      {isOpen && (
        <Portal containerId="dropdown-root">
          <div ref={dropdownRef} style={dropdownStyle} className={className}>
            {items.map((item, index) => (
              item.divider ? (
                <div key={index} style={dividerStyle} />
              ) : (
                <div
                  key={item.key}
                  style={{
                    ...itemStyle,
                    opacity: item.disabled ? 0.5 : 1,
                    cursor: item.disabled ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => !item.disabled && handleItemClick(item)}
                  onMouseEnter={(e) => {
                    if (!item.disabled) {
                      const tokens = (theme as any)?.currentMode?.tokens || theme;
                      (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colors?.primary || '#00f6ff';
                      (e.currentTarget as HTMLElement).style.opacity = '0.1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
              )
            ))}
          </div>
        </Portal>
      )}
    </>
  );
};

Dropdown.displayName = 'Dropdown';

