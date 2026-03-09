/**
 * HudTableBasic Component
 * Basic HUD-styled table with cyan borders and glow effects
 */

import React from 'react';

interface HudTableBasicProps {
  color?: string;
}

export const HudTableBasic: React.FC<HudTableBasicProps> = ({ color = '#29F2DF' }) => {
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

HudTableBasic.displayName = 'HudTableBasic';
