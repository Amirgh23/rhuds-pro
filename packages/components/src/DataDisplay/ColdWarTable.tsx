/**
 * Cold War Table Component
 * Tactical data table with sorting
 */

import React, { CSSProperties, useMemo, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarTableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

export interface ColdWarTableProps {
  data: any[];
  columns: ColdWarTableColumn[];
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: any, index: number) => void;
  theme?: ThemeVariant;
  color?: 'amber' | 'green' | 'blue' | 'red';
  glow?: boolean;
  scanlines?: boolean;
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: { primary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  satelliteView: { primary: '#00CCFF', background: '#3a3a3e', surface: '#2a2a2e' },
};

const COLOR_MAP = { amber: '#FFB000', green: '#33FF00', blue: '#00CCFF', red: '#FF3333' };

export const ColdWarTable: React.FC<ColdWarTableProps> = ({
  data,
  columns,
  sortColumn: controlledSortColumn,
  sortDirection: controlledSortDirection = 'asc',
  onSort,
  onRowClick,
  theme = 'perseus',
  color = 'amber',
  glow = true,
  scanlines = false,
  className = '',
  style = {},
}) => {
  const [internalSortColumn, setInternalSortColumn] = useState<string | undefined>(
    controlledSortColumn
  );
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>(
    controlledSortDirection
  );
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const themeColors = THEME_COLORS[theme];
  const tableColor = COLOR_MAP[color];
  const rgb = getRgbString(tableColor);
  const techCode = generateTechCode('TABLE');

  const sortColumn = controlledSortColumn !== undefined ? controlledSortColumn : internalSortColumn;
  const sortDirection =
    controlledSortDirection !== undefined ? controlledSortDirection : internalSortDirection;

  const handleSort = (columnKey: string) => {
    const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    setInternalSortColumn(columnKey);
    setInternalSortDirection(newDirection);
    onSort?.(columnKey, newDirection);
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    overflowX: 'auto',
    backgroundColor: themeColors.background,
    border: `2px solid ${tableColor}`,
    clipPath:
      'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
    overflow: 'hidden',
    ...style,
  };

  const tableStyle: CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'transparent',
    color: '#fff',
  };

  const headerStyle: CSSProperties = {
    backgroundColor: themeColors.surface,
    color: tableColor,
    padding: '12px',
    textAlign: 'left',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 150ms ease',
    borderBottom: `2px solid ${tableColor}`,
    borderRight: `1px solid rgba(${rgb}, 0.2)`,
    textShadow: glow ? `0 0 8px rgba(${rgb}, 0.6)` : 'none',
  };

  const rowStyle = (index: number): CSSProperties => ({
    borderBottom: `1px solid rgba(${rgb}, 0.2)`,
    backgroundColor: hoveredRow === index ? `rgba(${rgb}, 0.1)` : 'transparent',
    transition: 'all 150ms ease',
  });

  const cellStyle: CSSProperties = {
    padding: '12px',
    textAlign: 'left',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    borderRight: `1px solid rgba(${rgb}, 0.1)`,
  };

  const techCodeContainerStyle: CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '8px',
    color: tableColor,
    opacity: 0.5,
    zIndex: 15,
  };

  return (
    <div className={className} style={containerStyle}>
      {scanlines && <ScanlinesOverlay intensity="low" />}
      <span style={techCodeContainerStyle}>{techCode}</span>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  ...headerStyle,
                  width: column.width,
                  textAlign: column.align || 'left',
                  opacity: column.sortable ? 1 : 0.7,
                }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {column.label}
                  {column.sortable && sortColumn === column.key && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={rowStyle(rowIndex)}
              onClick={() => onRowClick?.(row, rowIndex)}
              onMouseEnter={() => setHoveredRow(rowIndex)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  style={{
                    ...cellStyle,
                    width: column.width,
                    textAlign: column.align || 'left',
                  }}
                >
                  {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ColdWarTable;
