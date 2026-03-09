/**
 * HudTableHoverable Component
 * HUD-styled table with hover effects on rows
 */

import React, { useState } from 'react';

interface HudTableHoverableProps {
  color?: string;
}

export const HudTableHoverable: React.FC<HudTableHoverableProps> = ({ color = '#29F2DF' }) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

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
  };

  const cellStyle: React.CSSProperties = {
    padding: '0.75rem',
    textAlign: 'left',
    borderBottom: `1px solid ${color}33`,
  };

  const getRowStyle = (index: number): React.CSSProperties => ({
    ...cellStyle,
    backgroundColor: hoveredRow === index ? `${color}1a` : 'transparent',
    boxShadow: hoveredRow === index ? `0 0 15px ${color}66, inset 0 0 15px ${color}20` : 'none',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    backdropFilter: hoveredRow === index ? 'blur(12px)' : 'blur(5px)',
  });

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
        <tr
          onMouseEnter={() => setHoveredRow(0)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          <td style={getRowStyle(0)}>1</td>
          <td style={getRowStyle(0)}>Mark</td>
          <td style={getRowStyle(0)}>Otto</td>
          <td style={getRowStyle(0)}>@mdo</td>
        </tr>
        <tr
          onMouseEnter={() => setHoveredRow(1)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          <td style={getRowStyle(1)}>2</td>
          <td style={getRowStyle(1)}>Jacob</td>
          <td style={getRowStyle(1)}>Thornton</td>
          <td style={getRowStyle(1)}>@fat</td>
        </tr>
        <tr
          onMouseEnter={() => setHoveredRow(2)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          <td style={getRowStyle(2)}>3</td>
          <td style={getRowStyle(2)}>Larry</td>
          <td style={getRowStyle(2)}>the Bird</td>
          <td style={getRowStyle(2)}>@twitter</td>
        </tr>
      </tbody>
    </table>
  );
};

HudTableHoverable.displayName = 'HudTableHoverable';
