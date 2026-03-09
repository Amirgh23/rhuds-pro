/**
 * HudTableContextual Component
 * HUD-styled table with contextual row colors
 */

import React from 'react';

interface HudTableContextualProps {
  color?: string;
}

export const HudTableContextual: React.FC<HudTableContextualProps> = ({ color = '#29F2DF' }) => {
  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: `1px solid ${color}`,
    boxShadow: `0 0 10px ${color}33, inset 0 0 10px ${color}1a`,
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: `${color}1a`,
    color: color,
    padding: '0.75rem',
    textAlign: 'left',
    fontWeight: 600,
    borderBottom: `2px solid ${color}`,
    textShadow: `0 0 8px ${color}80`,
    backdropFilter: 'blur(10px)',
  };

  const cellStyle: React.CSSProperties = {
    padding: '0.75rem',
    textAlign: 'left',
    borderBottom: `1px solid ${color}33`,
  };

  const contextualRowStyle = (contextColor: string, textColor?: string): React.CSSProperties => ({
    backgroundColor: `${contextColor}25`,
    color: textColor || '#ffffff',
    fontWeight: 500,
    backdropFilter: 'blur(15px)',
    boxShadow: `inset 0 0 20px ${contextColor}15`,
  });

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={headerStyle}>Class</th>
          <th style={headerStyle}>Heading</th>
          <th style={headerStyle}>Heading</th>
        </tr>
      </thead>
      <tbody>
        <tr style={contextualRowStyle('#29F2DF', '#29F2DF')}>
          <td style={cellStyle}>Active</td>
          <td style={cellStyle}>Cell</td>
          <td style={cellStyle}>Cell</td>
        </tr>
        <tr style={contextualRowStyle('#22C55E', '#22C55E')}>
          <td style={cellStyle}>Success</td>
          <td style={cellStyle}>Cell</td>
          <td style={cellStyle}>Cell</td>
        </tr>
        <tr style={contextualRowStyle('#EF3EF1', '#EF3EF1')}>
          <td style={cellStyle}>Warning</td>
          <td style={cellStyle}>Cell</td>
          <td style={cellStyle}>Cell</td>
        </tr>
        <tr style={contextualRowStyle('#FF6B6B', '#FF6B6B')}>
          <td style={cellStyle}>Danger</td>
          <td style={cellStyle}>Cell</td>
          <td style={cellStyle}>Cell</td>
        </tr>
      </tbody>
    </table>
  );
};

HudTableContextual.displayName = 'HudTableContextual';
