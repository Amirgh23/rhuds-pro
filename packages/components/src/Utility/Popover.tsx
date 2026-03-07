/**
 * Popover Component
 * Popover with configurable position
 */

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useTheme } from '@rhuds/core';
import { Portal } from './Portal';
import { PopoverProps } from './types';

/**
 * Popover Component
 */
export const Popover: React.FC<PopoverProps> = ({
  content,
  title,
  position = 'bottom',
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
  closeOnOutsideClick = true,
  animationDuration = 200,
  className,
  style,
}) => {
  const theme = useTheme();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setInternalIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  const updatePosition = () => {
    if (triggerRef.current && popoverRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = triggerRect.top - popoverRect.height - 10;
          left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + 10;
          left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
          break;
        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
          left = triggerRect.left - popoverRect.width - 10;
          break;
        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
          left = triggerRect.right + 10;
          break;
      }

      setPopoverPos({ top: top + window.scrollY, left: left + window.scrollX });
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
            popoverRef.current &&
            !triggerRef.current.contains(e.target as Node) &&
            !popoverRef.current.contains(e.target as Node)
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

  const popoverStyle = useMemo<React.CSSProperties>(() => {
    const tokens = (theme as any)?.currentMode?.tokens || theme;
    return {
      position: 'fixed',
      top: popoverPos.top,
      left: popoverPos.left,
      backgroundColor: tokens.colors?.background || '#0A1225',
      color: tokens.colors?.text || '#ffffff',
      border: `1px solid ${tokens.colors?.primary || '#29F2DF'}`,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1001,
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? 'auto' : 'none',
      transition: `opacity ${animationDuration}ms ease-in-out`,
      ...style,
    };
  }, [popoverPos, isOpen, animationDuration, theme, style]);

  const headerStyle: React.CSSProperties = useMemo(() => {
    const tokens = (theme as any)?.currentMode?.tokens || theme;
    return {
      padding: '0.75rem 1rem',
      borderBottom: `1px solid ${tokens.colors?.primary || '#29F2DF'}`,
      fontWeight: 600,
    };
  }, [theme]);

  const contentStyle: React.CSSProperties = {
    padding: '1rem',
  };

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
        <Portal containerId="popover-root">
          <div ref={popoverRef} style={popoverStyle} className={className}>
            {title && <div style={headerStyle}>{title}</div>}
            <div style={contentStyle}>{content}</div>
          </div>
        </Portal>
      )}
    </>
  );
};

Popover.displayName = 'Popover';

