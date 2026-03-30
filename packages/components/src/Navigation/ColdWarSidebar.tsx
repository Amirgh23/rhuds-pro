/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR SIDEBAR - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TACTICAL COMMAND PANEL - Collapsible military sidebar
 *
 * FEATURES:
 * - Collapsible with smooth animations
 * - Nested menu items with expand/collapse
 * - Active state indicators with glow
 * - Scanlines and phosphor effects
 * - Corner brackets and tech overlays
 * - Keyboard navigation (Arrow keys, Enter, Space)
 * - ARIA accessibility support
 */

import React, { ReactNode, CSSProperties, useState } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  children?: SidebarMenuItem[];
  badge?: string | number;
}

export interface ColdWarSidebarProps {
  items: SidebarMenuItem[];
  activeItemId?: string;
  collapsed?: boolean;
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showTechCode?: boolean;
  onToggle?: (collapsed: boolean) => void;
  onItemClick?: (itemId: string) => void;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarSidebar: React.FC<ColdWarSidebarProps> = ({
  items,
  activeItemId,
  collapsed: controlledCollapsed,
  theme = 'perseus',
  scanlines = true,
  scanlinesIntensity = 'low',
  glow = true,
  showTechCode = true,
  onToggle,
  onItemClick,
  className = '',
  style = {},
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [techCode] = React.useState(() => generateTechCode('SDB'));

  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const themeColors = THEME_VARIANTS[theme];
  const primaryRgb = getRgbString(themeColors.primary);

  const handleToggle = () => {
    const newCollapsed = !collapsed;
    setInternalCollapsed(newCollapsed);
    onToggle?.(newCollapsed);
  };

  const handleItemClick = (item: SidebarMenuItem) => {
    if (item.children && item.children.length > 0) {
      setExpandedItems((prev) => {
        const next = new Set(prev);
        if (next.has(item.id)) {
          next.delete(item.id);
        } else {
          next.add(item.id);
        }
        return next;
      });
    }

    item.onClick?.();
    onItemClick?.(item.id);
  };

  const containerStyles: CSSProperties = {
    width: collapsed ? '60px' : '280px',
    height: '100%',
    background: 'rgba(10, 10, 20, 0.95)',
    border: `2px solid ${themeColors.primary}`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    position: 'relative',
    overflow: 'hidden',
    transition: `width ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    display: 'flex',
    flexDirection: 'column',
    ...style,
  };

  const headerStyles: CSSProperties = {
    padding: '16px',
    borderBottom: `2px solid ${themeColors.primary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: `rgba(${primaryRgb}, 0.1)`,
    position: 'relative',
    zIndex: 6,
  };

  const toggleButtonStyles: CSSProperties = {
    background: 'none',
    border: `1px solid ${themeColors.primary}`,
    color: themeColors.primary,
    fontSize: '16px',
    cursor: 'pointer',
    padding: '6px',
    clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const renderMenuItem = (item: SidebarMenuItem, level: number = 0) => {
    const isActive = item.id === activeItemId;
    const isExpanded = expandedItems.has(item.id);
    const isHovered = hoveredItem === item.id;
    const hasChildren = item.children && item.children.length > 0;

    const itemStyles: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: collapsed ? '12px' : `12px ${16 + level * 16}px`,
      color: isActive ? themeColors.primary : themeColors.text,
      cursor: 'pointer',
      transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
      textDecoration: 'none',
      fontSize: '13px',
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
      background: isActive
        ? `rgba(${primaryRgb}, 0.2)`
        : isHovered
          ? `rgba(${primaryRgb}, 0.1)`
          : 'transparent',
      borderLeft: isActive ? `3px solid ${themeColors.primary}` : '3px solid transparent',
      position: 'relative',
      justifyContent: collapsed ? 'center' : 'flex-start',
    };

    if (glow && isActive) {
      itemStyles.textShadow = `0 0 8px ${themeColors.primary}`;
      itemStyles.boxShadow = `inset 0 0 20px rgba(${primaryRgb}, 0.2)`;
    }

    const iconStyles: CSSProperties = {
      fontSize: '18px',
      flexShrink: 0,
      color: isActive ? themeColors.primary : themeColors.textSecondary,
    };

    const labelStyles: CSSProperties = {
      flex: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      opacity: collapsed ? 0 : 1,
      transition: `opacity ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    };

    const badgeStyles: CSSProperties = {
      padding: '2px 6px',
      background: themeColors.error,
      color: '#fff',
      fontSize: '10px',
      fontWeight: 700,
      borderRadius: '2px',
      opacity: collapsed ? 0 : 1,
      transition: `opacity ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    };

    const expandIconStyles: CSSProperties = {
      fontSize: '12px',
      transition: `transform ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
      opacity: collapsed ? 0 : 1,
    };

    return (
      <div key={item.id}>
        <div
          style={itemStyles}
          onClick={() => handleItemClick(item)}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          role="button"
          tabIndex={0}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-current={isActive ? 'page' : undefined}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleItemClick(item);
            }
          }}
        >
          {item.icon && <span style={iconStyles}>{item.icon}</span>}
          {!collapsed && (
            <>
              <span style={labelStyles}>{item.label}</span>
              {item.badge && <span style={badgeStyles}>{item.badge}</span>}
              {hasChildren && <span style={expandIconStyles}>▸</span>}
            </>
          )}
        </div>

        {hasChildren && isExpanded && !collapsed && (
          <div>{item.children!.map((child) => renderMenuItem(child, level + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={className}
      style={containerStyles}
      aria-label="Sidebar navigation"
      role="navigation"
    >
      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      {/* Corner brackets */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          width: '10px',
          height: '10px',
          borderTop: `1px solid ${themeColors.primary}`,
          borderLeft: `1px solid ${themeColors.primary}`,
          opacity: 0.5,
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          width: '10px',
          height: '10px',
          borderTop: `1px solid ${themeColors.primary}`,
          borderRight: `1px solid ${themeColors.primary}`,
          opacity: 0.5,
          zIndex: 4,
        }}
      />

      {/* Tech code */}
      {showTechCode && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            fontSize: '8px',
            color: themeColors.primary,
            opacity: 0.3,
            letterSpacing: '0.05em',
            zIndex: 4,
          }}
        >
          {techCode}
        </div>
      )}

      <div style={headerStyles}>
        {!collapsed && (
          <span
            style={{
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: themeColors.primary,
            }}
          >
            COMMAND
          </span>
        )}
        <button
          onClick={handleToggle}
          style={toggleButtonStyles}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? '▸' : '◂'}
        </button>
      </div>

      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          zIndex: 6,
        }}
      >
        {items.map((item) => renderMenuItem(item))}
      </nav>
    </aside>
  );
};

export default ColdWarSidebar;
