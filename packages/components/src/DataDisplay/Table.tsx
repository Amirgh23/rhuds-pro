/**
 * Table Component
 * Data table with sorting and filtering
 */

import React, { useMemo, useState } from 'react';
import { useTheme } from '@rhuds/core';
import { TableProps, TableColumn } from './types';

/**
 * Table Component
 */
export const Table: React.FC<TableProps> = ({
  data,
  columns,
  sortColumn: controlledSortColumn,
  sortDirection: controlledSortDirection = 'asc',
  onSort,
  filters = {},
  onFilter,
  onRowClick,
  className,
  style,
}) => {
  const themeContext = useTheme();
  
  // Safe theme access with fallback
  const primaryColor = themeContext?.currentMode?.tokens?.colors?.primary || '#29F2DF';
  const textColor = themeContext?.currentMode?.tokens?.colors?.text || '#ffffff';
  const backgroundColor = themeContext?.currentMode?.tokens?.colors?.background || '#0a0a0a';
  
  const [internalSortColumn, setInternalSortColumn] = useState<string | undefined>(controlledSortColumn);
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>(controlledSortDirection);

  const sortColumn = controlledSortColumn !== undefined ? controlledSortColumn : internalSortColumn;
  const sortDirection = controlledSortDirection !== undefined ? controlledSortDirection : internalSortDirection;

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

  const containerStyle = useMemo<React.CSSProperties>(() => {
    return {
      width: '100%',
      overflowX: 'auto',
      ...style,
    };
  }, [style]);

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'transparent',
    color: textColor,
    border: `1px solid ${primaryColor}`,
    boxShadow: `0 0 10px ${primaryColor}33, inset 0 0 10px ${primaryColor}1a`,
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: `${primaryColor}1a`,
    color: primaryColor,
    padding: '0.75rem',
    textAlign: 'left',
    fontWeight: 600,
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.2s ease-in-out',
    borderBottom: `2px solid ${primaryColor}`,
    borderRight: `1px solid ${primaryColor}33`,
    textShadow: `0 0 8px ${primaryColor}80`,
  };

  const rowStyle: React.CSSProperties = {
    borderBottom: `1px solid ${primaryColor}33`,
  };

  const cellStyle: React.CSSProperties = {
    padding: '0.75rem',
    textAlign: 'left',
    borderRight: `1px solid ${primaryColor}33`,
  };

  return (
    <div className={className} style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr style={rowStyle}>
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
                onMouseEnter={(e) => {
                  if (column.sortable) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = `${primaryColor}33`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${primaryColor}66`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (column.sortable) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = `${primaryColor}1a`;
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              style={{
                ...rowStyle,
                cursor: onRowClick ? 'pointer' : 'default',
              }}
              onClick={() => onRowClick?.(row, rowIndex)}
              onMouseEnter={(e) => {
                if (onRowClick) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = `${primaryColor}1a`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${primaryColor}66`;
                }
              }}
              onMouseLeave={(e) => {
                if (onRowClick) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }
              }}
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

Table.displayName = 'Table';

