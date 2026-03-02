/**
 * Tooltip Component
 * Tooltip with configurable position
 */

import React, { useState, useRef, useMemo } from 'react';
import { useTheme } from '@rhuds/core';
import { TooltipProps } from './types';

/**
 * Tooltip Component
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  showDelay = 200,
  hideDelay = 100,
  animationDuration = 200,
  className,
  style,
}) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    showTimeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let top = 0;
        let left = 0;

        switch (position) {
          case 'top':
            top = rect.top - 40;
            left = rect.left + rect.width / 2 - 50;
            break;
          case 'bottom':
            top = rect.bottom + 10;
            left = rect.left + rect.width / 2 - 50;
            break;
          case 'left':
            top = rect.top + rect.height / 2 - 20;
            left = rect.left - 110;
            break;
          case 'right':
            top = rect.top + rect.height / 2 - 20;
            left = rect.right + 10;
            break;
        }

        setTooltipPos({ top: top + window.scrollY, left: left + window.scrollX });
        setIsVisible(true);
      }
    }, showDelay);
  };

  const handleMouseLeave = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  };

  const tooltipStyle = useMemo<React.CSSProperties>(() => {
    const tokens = (theme as any)?.currentMode?.tokens || theme;
    return {
      position: 'fixed',
      top: tooltipPos.top,
      left: tooltipPos.left,
      backgroundColor: tokens.colors?.primary || '#00f6ff',
      color: tokens.colors?.background || '#1a1a1a',
      padding: '0.5rem 0.75rem',
      borderRadius: '4px',
      fontSize: '0.85rem',
      whiteSpace: 'nowrap',
      zIndex: 1001,
      opacity: isVisible ? 1 : 0,
      pointerEvents: 'none',
      transition: `opacity ${animationDuration}ms ease-in-out`,
      ...style,
    };
  }, [tooltipPos, isVisible, animationDuration, theme, style]);

  return (
    <>
      <div
        ref={triggerRef}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>
      {isVisible && <div style={tooltipStyle}>{content}</div>}
    </>
  );
};

Tooltip.displayName = 'Tooltip';

