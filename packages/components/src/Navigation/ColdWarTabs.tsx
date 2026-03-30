/**
 * Cold War Tabs
 * Tactical tab navigation with military aesthetic
 */

import React, { ReactNode, CSSProperties, useState } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString } from '../utils/coldWarUtils';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

export interface ColdWarTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  glow?: boolean;
  className?: string;
  style?: CSSProperties;
  onTabChange?: (tabId: string) => void;
}

export const ColdWarTabs: React.FC<ColdWarTabsProps> = ({
  tabs,
  defaultTab,
  theme = 'perseus',
  glow = true,
  className = '',
  style = {},
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const themeColors = THEME_VARIANTS[theme];
  const primaryRgb = getRgbString(themeColors.primary);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const containerStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    ...style,
  };

  const tabListStyles: CSSProperties = {
    display: 'flex',
    gap: '4px',
    borderBottom: `2px solid ${themeColors.primary}`,
    marginBottom: '16px',
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={className} style={containerStyles}>
      <div style={tabListStyles}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          const tabStyles: CSSProperties = {
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            border: `2px solid ${isActive ? themeColors.primary : '#2a2a2e'}`,
            borderBottom: 'none',
            background: isActive ? `rgba(${primaryRgb}, 0.2)` : 'rgba(10, 10, 20, 0.8)',
            color: isActive ? themeColors.primary : themeColors.textSecondary,
            cursor: 'pointer',
            transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
            clipPath: 'polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          };

          if (glow && isActive) {
            tabStyles.boxShadow = `0 0 10px rgba(${primaryRgb}, 0.5)`;
            tabStyles.textShadow = `0 0 8px ${themeColors.primary}`;
          }

          return (
            <button key={tab.id} onClick={() => handleTabClick(tab.id)} style={tabStyles}>
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          padding: '16px',
          background: 'rgba(10, 10, 20, 0.5)',
          border: `1px solid ${themeColors.primary}`,
          clipPath:
            'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          minHeight: '200px',
        }}
      >
        {activeTabContent}
      </div>
    </div>
  );
};

export default ColdWarTabs;
