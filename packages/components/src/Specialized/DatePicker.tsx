import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@rhuds/core';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  placeholder?: string;
  format?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  placeholder = 'Select date',
  format = 'MM/DD/YYYY',
  className = '',
}: DatePickerProps) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', String(year));
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add empty days for alignment
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(new Date(year, month, -i));
    }

    // Add days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    if (disabled) return;
    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;

    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', display: 'inline-block' }}>
      <input
        type="text"
        value={selectedDate ? formatDate(selectedDate) : ''}
        placeholder={placeholder}
        readOnly
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          padding: '8px 12px',
          border: `1px solid ${theme.currentMode.tokens.colors.border}`,
          borderRadius: '4px',
          backgroundColor: disabled ? theme.currentMode.tokens.colors.surface : theme.currentMode.tokens.colors.background,
          color: theme.currentMode.tokens.colors.text,
          cursor: disabled ? 'not-allowed' : 'pointer',
          width: '200px',
        }}
      />

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            backgroundColor: theme.currentMode.tokens.colors.surface,
            border: `1px solid ${theme.currentMode.tokens.colors.border}`,
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            minWidth: '280px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button
              onClick={handlePrevMonth}
              style={{
                background: 'none',
                border: 'none',
                color: theme.currentMode.tokens.colors.primary,
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              ‹
            </button>
            <div style={{ fontWeight: 'bold', color: theme.currentMode.tokens.colors.text }}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button
              onClick={handleNextMonth}
              style={{
                background: 'none',
                border: 'none',
                color: theme.currentMode.tokens.colors.primary,
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              ›
            </button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: theme.currentMode.tokens.colors.text,
                  opacity: 0.6,
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {days.map((date, index) => {
              const isDisabled = isDateDisabled(date);
              const isSelected = isDateSelected(date);
              const isCurrent = isCurrentMonth(date);

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  disabled={isDisabled}
                  style={{
                    padding: '8px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: isSelected
                      ? theme.currentMode.tokens.colors.primary
                      : 'transparent',
                    color: isSelected
                      ? '#ffffff'
                      : isCurrent
                      ? theme.currentMode.tokens.colors.text
                      : theme.currentMode.tokens.colors.text,
                    opacity: isCurrent ? 1 : 0.3,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled && !isSelected) {
                      e.currentTarget.style.backgroundColor = theme.currentMode.tokens.colors.surface;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

