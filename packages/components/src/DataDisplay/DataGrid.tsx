/**
 * DataGrid Component
 * Advanced data grid with virtualization, sorting, filtering, and editing
 */

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useTheme } from '@rhuds/core';
import { DataGridProps, DataGridColumn } from './types';

/**
 * DataGrid Component with Virtual Scrolling
 */
export const DataGrid: React.FC<DataGridProps> = ({
  data,
  columns,
  rowHeight = 40,
  visibleRows = 10,
  sortColumn: controlledSortColumn,
  sortDirection: controlledSortDirection = 'asc',
  onSort,
  filters = {},
  onFilter,
  selectedRows: controlledSelectedRows = [],
  selectionMode = 'none',
  onSelectionChange,
  groups,
  frozenColumns = 0,
  onCellEdit,
  onRowClick,
  className,
  style,
}) => {
  const themeContext = useTheme();
  
  // Safe theme access with fallback
  const primaryColor = themeContext?.currentMode?.tokens?.colors?.primary || '#29F2DF';
  const textColor = themeContext?.currentMode?.tokens?.colors?.text || '#ffffff';
  const backgroundColor = themeContext?.currentMode?.tokens?.colors?.background || '#0A1225';
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [internalSortColumn, setInternalSortColumn] = useState<string | undefined>(controlledSortColumn);
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>(controlledSortDirection);
  const [internalSelectedRows, setInternalSelectedRows] = useState<(string | number)[]>(controlledSelectedRows);
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);

  const sortColumn = controlledSortColumn !== undefined ? controlledSortColumn : internalSortColumn;
  const sortDirection = controlledSortDirection !== undefined ? controlledSortDirection : internalSortDirection;
  const selectedRows = controlledSelectedRows.length > 0 ? controlledSelectedRows : internalSelectedRows;

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

  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(startIndex + visibleRows + 1, sortedData.length);
  const visibleData = sortedData.slice(startIndex, endIndex);
  const offsetY = startIndex * rowHeight;

  const handleRowSelect = (rowIndex: number) => {
    let newSelected: (string | number)[];

    if (selectionMode === 'single') {
      newSelected = [rowIndex];
    } else if (selectionMode === 'multiple') {
      newSelected = selectedRows.includes(rowIndex)
        ? selectedRows.filter((r) => r !== rowIndex)
        : [...selectedRows, rowIndex];
    } else {
      return;
    }

    setInternalSelectedRows(newSelected);
    onSelectionChange?.(newSelected);
  };

  const containerStyle = useMemo<React.CSSProperties>(() => {
    return {
      width: '100%',
      height: visibleRows * rowHeight,
      overflowY: 'auto',
      overflowX: 'auto',
      backgroundColor: backgroundColor,
      ...style,
    };
  }, [visibleRows, rowHeight, backgroundColor, style]);

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    color: textColor,
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: primaryColor,
    color: backgroundColor,
    padding: '0.5rem',
    textAlign: 'left',
    fontWeight: 600,
    cursor: 'pointer',
    userSelect: 'none',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  };

  const cellStyle: React.CSSProperties = {
    padding: '0.5rem',
    textAlign: 'left',
    borderBottom: `1px solid ${primaryColor}`,
  };

  return (
    <div
      className={className}
      ref={scrollRef}
      style={containerStyle}
      onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
    >
      <table style={tableStyle}>
        <thead>
          <tr>
            {selectionMode !== 'none' && (
              <th style={{ ...headerStyle, width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedRows.length === sortedData.length && sortedData.length > 0}
                  onChange={(e) => {
                    const newSelected = e.target.checked ? sortedData.map((_, i) => i) : [];
                    setInternalSelectedRows(newSelected);
                    onSelectionChange?.(newSelected);
                  }}
                />
              </th>
            )}
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
          <tr style={{ height: offsetY }} />
          {visibleData.map((row, visibleIndex) => {
            const actualIndex = startIndex + visibleIndex;
            const isSelected = selectedRows.includes(actualIndex);

            return (
              <tr
                key={actualIndex}
                style={{
                  backgroundColor: isSelected ? primaryColor : 'transparent',
                  opacity: isSelected ? 0.2 : 1,
                  cursor: onRowClick ? 'pointer' : 'default',
                }}
                onClick={() => onRowClick?.(row, actualIndex)}
              >
                {selectionMode !== 'none' && (
                  <td style={{ ...cellStyle, width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleRowSelect(actualIndex)}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={`${actualIndex}-${column.key}`}
                    style={{
                      ...cellStyle,
                      width: column.width,
                      textAlign: column.align || 'left',
                    }}
                    onDoubleClick={() => column.editable && setEditingCell({ row: actualIndex, col: column.key })}
                  >
                    {editingCell?.row === actualIndex && editingCell?.col === column.key ? (
                      <input
                        type="text"
                        defaultValue={row[column.key]}
                        onBlur={(e) => {
                          onCellEdit?.(actualIndex, column.key, e.target.value);
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onCellEdit?.(actualIndex, column.key, e.currentTarget.value);
                            setEditingCell(null);
                          }
                        }}
                        autoFocus
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: `1px solid ${primaryColor}`,
                          backgroundColor: backgroundColor,
                          color: textColor,
                        }}
                      />
                    ) : column.render ? (
                      column.render(row[column.key], row, actualIndex)
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

DataGrid.displayName = 'DataGrid';

