/**
 * HudTableSmall Component
 * Compact HUD-styled table with reduced padding
 */

import React from 'react';

interface HudTableSmallProps {
  color?: string;
}

export const HudTableSmall: React.FC<HudTableSmallProps> = ({ color = '#29F2DF' }) => {
  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: `1px solid ${color}`,
    boxShadow: `0 0 10px ${color}33, inset 0 0 10px ${color}1a`,
    fontSize: '0.875rem',
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: `${color}1a`,
    color: color,
    padding: '0.4rem',
    textAlign: 'left',
    fontWeight: 600,
    borderBottom: `2px solid ${color}`,
    textShadow: `0 0 8px ${color}80`,
    backdropFilter: 'blur(10px)',
  };

  const cellStyle: React.CSSProperties = {
    padding: '0.4rem',
    textAlign: 'left',
    borderBottom: `1px solid ${color}33`,
    backdropFilter: 'blur(8px)',
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={headerStyle}>#</th>
          <th style={headerStyle}>First</th>
          <th style={headerStyle}>Last</th>
          <th style={headerStyle}>Handle</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={cellStyle}>1</td>
          <td style={cellStyle}>Mark</td>
          <td style={cellStyle}>Otto</td>
          <td style={cellStyle}>@mdo</td>
        </tr>
        <tr>
          <td style={cellStyle}>2</td>
          <td style={cellStyle}>Jacob</td>
          <td style={cellStyle}>Thornton</td>
          <td style={cellStyle}>@fat</td>
        </tr>
        <tr>
          <td style={cellStyle}>3</td>
          <td style={cellStyle}>Larry</td>
          <td style={cellStyle}>the Bird</td>
          <td style={cellStyle}>@twitter</td>
        </tr>
      </tbody>
    </table>
  );
};

HudTableSmall.displayName = 'HudTableSmall';
