/**
 * Cold War Pagination
 * Tactical pagination component with military aesthetic
 */

import React, { CSSProperties } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString } from '../utils/coldWarUtils';

export interface ColdWarPaginationProps {
  currentPage: number;
  totalPages: number;
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  glow?: boolean;
  onPageChange: (page: number) => void;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarPagination: React.FC<ColdWarPaginationProps> = ({
  currentPage,
  totalPages,
  theme = 'perseus',
  glow = true,
  onPageChange,
  className = '',
  style = {},
}) => {
  const themeColors = THEME_VARIANTS[theme];
  const primaryRgb = getRgbString(themeColors.primary);

  const containerStyles: CSSProperties = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    ...style,
  };

  const buttonStyles = (isActive: boolean, isDisabled: boolean): CSSProperties => ({
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    border: `1px solid ${isActive ? themeColors.primary : '#2a2a2e'}`,
    background: isActive ? `rgba(${primaryRgb}, 0.2)` : 'rgba(10, 10, 20, 0.9)',
    color: isActive ? themeColors.primary : themeColors.textSecondary,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
    opacity: isDisabled ? 0.4 : 1,
    minWidth: '36px',
    textAlign: 'center',
    boxShadow: isActive && glow ? `0 0 10px rgba(${primaryRgb}, 0.5)` : 'none',
  });

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

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
    <div className={className} style={containerStyles}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={buttonStyles(false, currentPage === 1)}
        aria-label="Previous page"
      >
        ◀
      </button>

      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              style={{
                padding: '8px 4px',
                color: themeColors.textSecondary,
                fontSize: '12px',
              }}
            >
              ...
            </span>
          );
        }

        const pageNum = page as number;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            style={buttonStyles(pageNum === currentPage, false)}
            aria-label={`Page ${pageNum}`}
            aria-current={pageNum === currentPage ? 'page' : undefined}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={buttonStyles(false, currentPage === totalPages)}
        aria-label="Next page"
      >
        ▶
      </button>
    </div>
  );
};

export default ColdWarPagination;
