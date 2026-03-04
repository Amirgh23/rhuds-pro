/**
 * Select Component
 * Dropdown select with search support
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTheme } from '@rhuds/core';
import { Portal } from '../Utility/Portal';
import { SelectProps } from './types';

/**
 * Select Component
 */
export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  error,
  disabled = false,
  required = false,
  searchable = false,
  className,
  style,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchable || !search) return options;
    return options.filter(opt =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search, searchable]);

  const selectedOption = useMemo(() => {
    return options.find(opt => opt.value === value);
  }, [options, value]);

  const handleSelect = (optionValue: string | number) => {
    onChange?.(optionValue);
    setOpen(false);
    setSearch('');
  };

  const updatePosition = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      const handleClickOutside = (e: MouseEvent) => {
        if (
          selectRef.current &&
          dropdownRef.current &&
          !selectRef.current.contains(e.target as Node) &&
          !dropdownRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [open]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    ...style,
  };

  const selectStyle: React.CSSProperties = {
    padding: '0.75rem',
    fontSize: '1rem',
    border: `2px solid ${error ? '#ff0000' : open ? theme.currentMode.tokens.colors.primary : '#666'}`,
    borderRadius: '4px',
    backgroundColor: disabled ? '#333' : '#1a1a1a',
    color: theme.currentMode.tokens.colors.text,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'fixed',
    top: dropdownPos.top,
    left: dropdownPos.left,
    width: dropdownPos.width,
    backgroundColor: '#1a1a1a',
    border: `2px solid ${theme.currentMode.tokens.colors.primary}`,
    borderRadius: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 1001,
  };

  const optionStyle: React.CSSProperties = {
    padding: '0.75rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  };

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: theme.currentMode.tokens.colors.text }}>
          {label}
          {required && <span style={{ color: '#ff0000' }}>*</span>}
        </label>
      )}

      <div ref={selectRef} style={{ position: 'relative' }}>
        <button
          style={selectStyle}
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
        >
          {selectedOption?.label || placeholder}
        </button>

        {open && (
          <Portal containerId="select-root">
            <div ref={dropdownRef} style={dropdownStyle}>
              {searchable && (
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: 'none',
                    borderBottom: `1px solid ${theme.currentMode.tokens.colors.primary}`,
                    backgroundColor: '#1a1a1a',
                    color: theme.currentMode.tokens.colors.text,
                    outline: 'none',
                  }}
                />
              )}

              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  style={{
                    ...optionStyle,
                    backgroundColor: value === option.value ? theme.currentMode.tokens.colors.primary : 'transparent',
                    opacity: option.disabled ? 0.5 : 1,
                    cursor: option.disabled ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  onMouseEnter={(e) => {
                    if (!option.disabled) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = theme.currentMode.tokens.colors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== option.value) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </Portal>
        )}
      </div>

      {error && (
        <span style={{ fontSize: '0.75rem', color: '#ff0000' }}>
          {error}
        </span>
      )}
    </div>
  );
};

Select.displayName = 'Select';
