/**
 * Pagination Component
 * Page navigation with size selector
 */

import React, { useMemo, useState } from 'react';
import { useTheme } from '@rhuds/core';
import { PaginationProps } from './types';

/**
 * Pagination Component
 */
export const Pagination: React.FC<PaginationProps> = ({
  total,
  perPage = 10,
  currentPage: controlledCurrentPage = 1,
  onPageChange,
  showPageSize = false,
  pageSizeOptions = [10, 20, 50, 100],
  className,
  style,
}) => {
  const themeContext = useTheme();
  const theme = (themeContext as any).currentMode?.tokens || (themeContext as any);
  const [internalCurrentPage, setInternalCurrentPage] = useState(controlledCurrentPage);
  const [internalPerPage, setInternalPerPage] = useState(perPage);

  const currentPage = controlledCurrentPage !== undefined ? controlledCurrentPage : internalCurrentPage;
  const pageSize = internalPerPage;

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setInternalCurrentPage(page);
      onPageChange?.(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setInternalPerPage(size);
    setInternalCurrentPage(1);
  };

  const containerStyle = useMemo<React.CSSProperties>(() => {
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      ...style,
    };
  }, [style]);

  const buttonStyle: React.CSSProperties = {
    padding: '0.5rem 0.75rem',
    backgroundColor: 'transparent',
    border: `2px solid ${theme.currentMode.tokens.colors.primary}`,
    color: theme.currentMode.tokens.colors.primary,
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease-in-out',
  };

  const activeButtonStyle: React.CSSProperties = {
    backgroundColor: theme.currentMode.tokens.colors.primary,
    color: theme.currentMode.tokens.colors.background,
  };

  const disabledButtonStyle: React.CSSProperties = {
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  const selectStyle: React.CSSProperties = {
    padding: '0.5rem',
    backgroundColor: theme.currentMode.tokens.colors.background,
    border: `2px solid ${theme.currentMode.tokens.colors.primary}`,
    color: theme.currentMode.tokens.colors.primary,
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  };

  const infoStyle: React.CSSProperties = {
    color: theme.currentMode.tokens.colors.text,
    fontSize: '0.95rem',
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={className} style={containerStyle}>
      {showPageSize && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={infoStyle}>Items per page:</label>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            style={selectStyle}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          style={{
            ...buttonStyle,
            ...(currentPage === 1 ? disabledButtonStyle : {}),
          }}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            style={{
              ...buttonStyle,
              ...(page === currentPage ? activeButtonStyle : {}),
              cursor: page === '...' ? 'default' : 'pointer',
              border: page === '...' ? 'none' : `2px solid ${theme.currentMode.tokens.colors.primary}`,
            }}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}

        <button
          style={{
            ...buttonStyle,
            ...(currentPage === totalPages ? disabledButtonStyle : {}),
          }}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>

      <div style={infoStyle}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

Pagination.displayName = 'Pagination';

