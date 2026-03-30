/**
 * Cold War Data Grid Component
 * Advanced tactical data grid with filtering and pagination
 */

import React, { CSSProperties, useMemo, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarDataGridColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

export interface ColdWarDataGridProps {
  data: any[];
  columns: ColdWarDataGridColumn[];
  pageSize?: number;
  theme?: ThemeVariant;
  color?: 'amber' | 'green' | 'blue' | 'red';
  glow?: boolean;
  scanlines?: boolean;
  onRowClick?: (row: any, index: number) => void;
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: { primary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  satelliteView: { primary: '#00CCFF', background: '#3a3a3e', surface: '#2a2a2e' },
};

const COLOR_MAP = { amber: '#FFB000', green: '#33FF00', blue: '#00CCFF', red: '#FF3333' };

export const ColdWarDataGrid: React.FC<ColdWarDataGridProps> = ({
  data,
  columns,
  pageSize = 10,
  theme = 'perseus',
  color = 'amber',
  glow = true,
  scanlines = false,
  onRowClick,
  className = '',
  style = {},
}) => {
  const [sortColumn, setSortColumn] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const themeColors = THEME_COLORS[theme];
  const gridColor = COLOR_MAP[color];
  const rgb = getRgbString(gridColor);
  const techCode = generateTechCode('GRID');

  const handleSort = (columnKey: string) => {
    const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnKey);
    setSortDirection(newDirection);
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((row) =>
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    backgroundColor: themeColors.background,
    border: `2px solid ${gridColor}`,
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
    color: gridColor,
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
    borderBottom: `2px solid ${gridColor}`,
    borderRight: `1px solid rgba(${rgb}, 0.2)`,
    textShadow: glow ? `0 0 8px rgba(${rgb}, 0.6)` : 'none',
  };

  const paginationStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    borderTop: `1px solid rgba(${rgb}, 0.3)`,
  };

  const pageButtonStyle = (isActive: boolean): CSSProperties => ({
    padding: '6px 12px',
    fontSize: '11px',
    fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 600,
    textTransform: 'uppercase',
    color: isActive ? themeColors.background : gridColor,
    backgroundColor: isActive ? gridColor : 'transparent',
    border: `1px solid ${gridColor}`,
    clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  });

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '8px',
    color: gridColor,
    opacity: 0.5,
    zIndex: 15,
  };

  return (
    <div className={className} style={containerStyle}>
      {scanlines && <ScanlinesOverlay intensity="low" />}
      <span style={techCodeStyle}>{techCode}</span>
      <div style={{ overflowX: 'auto' }}>
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
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  borderBottom: `1px solid rgba(${rgb}, 0.2)`,
                  backgroundColor: hoveredRow === rowIndex ? `rgba(${rgb}, 0.1)` : 'transparent',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'all 150ms ease',
                }}
                onClick={() => onRowClick?.(row, rowIndex)}
                onMouseEnter={() => setHoveredRow(rowIndex)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.key}`}
                    style={{
                      padding: '12px',
                      textAlign: column.align || 'left',
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '11px',
                      borderRight: `1px solid rgba(${rgb}, 0.1)`,
                    }}
                  >
                    {column.render
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={paginationStyle}>
          <button
            style={pageButtonStyle(false)}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ◀
          </button>
          <span
            style={{
              fontSize: '11px',
              fontFamily: "'Share Tech Mono', monospace",
              color: gridColor,
            }}
          >
            {currentPage} / {totalPages}
          </span>
          <button
            style={pageButtonStyle(false)}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default ColdWarDataGrid;
