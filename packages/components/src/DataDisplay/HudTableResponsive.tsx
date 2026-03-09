/**
 * HudTableResponsive Component
 * HUD-styled responsive table with horizontal scroll
 */

import React from 'react';

interface HudTableResponsiveProps {
  color?: string;
}

export const HudTableResponsive: React.FC<HudTableResponsiveProps> = ({ color = '#29F2DF' }) => {
  const containerStyle: React.CSSProperties = {
    overflowX: 'auto',
    border: `1px solid ${color}`,
    borderRadius: '4px',
    boxShadow: `0 0 10px ${color}33, inset 0 0 10px ${color}1a`,
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'transparent',
    color: '#ffffff',
    minWidth: '600px',
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

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle}>#</th>
            <th style={headerStyle}>Heading</th>
            <th style={headerStyle}>Heading</th>
            <th style={headerStyle}>Heading</th>
            <th style={headerStyle}>Heading</th>
            <th style={headerStyle}>Heading</th>
            <th style={headerStyle}>Heading</th>
            <th style={headerStyle}>Heading</th>
            <th style={headerStyle}>Heading</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}>1</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
          </tr>
          <tr>
            <td style={cellStyle}>2</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
          </tr>
          <tr>
            <td style={cellStyle}>3</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
            <td style={cellStyle}>Cell</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

HudTableResponsive.displayName = 'HudTableResponsive';
