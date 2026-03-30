/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR DATE PICKER - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarDatePickerProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showCorners?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarDatePicker: React.FC<ColdWarDatePickerProps> = ({
  theme = 'perseus',
  value,
  onChange,
  minDate,
  maxDate,
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showCorners = true,
  className = '',
  style = {},
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [techCode] = useState(() => generateTechCode('DATE'));
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    onChange?.(newDate);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const containerStyles: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    ...style,
  };

  const inputStyles: CSSProperties = {
    padding: '10px 12px',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: themeColors.primary,
    background: `rgba(${rgb}, 0.1)`,
    border: `1px solid rgba(${rgb}, 0.3)`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('input'),
    cursor: 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    textShadow: glow ? `0 0 4px ${themeColors.primary}` : 'none',
  };

  const calendarStyles: CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '8px',
    minWidth: '280px',
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    background: `linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(10, 10, 20, 0.95) 100())`,
    border: `1px solid rgba(${rgb}, 0.5)`,
    boxShadow: `inset 0 0 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(${rgb}, 0.4), 0 8px 16px rgba(0, 0, 0, 0.5)`,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
    transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    zIndex: 1000,
    overflow: 'hidden',
  };

  const headerStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderBottom: `1px solid rgba(${rgb}, 0.3)`,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: themeColors.primary,
    background: `rgba(${rgb}, 0.1)`,
  };

  const dayStyles = (isSelected: boolean, isToday: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '12px',
    fontWeight: isSelected ? 600 : 400,
    color: isSelected ? themeColors.background : themeColors.primary,
    background: isSelected ? themeColors.primary : isToday ? `rgba(${rgb}, 0.2)` : 'transparent',
    border: isToday && !isSelected ? `1px solid ${themeColors.primary}` : 'none',
    cursor: 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
  });

  return (
    <div className={className} style={containerStyles}>
      <div
        style={inputStyles}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `rgba(${rgb}, 0.2)`;
          e.currentTarget.style.boxShadow = `0 0 10px rgba(${rgb}, 0.3)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `rgba(${rgb}, 0.1)`;
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {selectedDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
      </div>

      <div style={calendarStyles}>
        {/* Header */}
        <div style={headerStyles}>
          <button
            onClick={handlePrevMonth}
            style={{
              background: 'transparent',
              border: 'none',
              color: themeColors.primary,
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ‹
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{monthName}</span>
            <span style={{ fontSize: '8px', opacity: 0.5 }}>{techCode}</span>
          </div>
          <button
            onClick={handleNextMonth}
            style={{
              background: 'transparent',
              border: 'none',
              color: themeColors.primary,
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ›
          </button>
        </div>

        {/* Weekday Headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            padding: '8px',
            gap: '4px',
          }}
        >
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
                fontSize: '10px',
                fontWeight: 600,
                color: `rgba(${rgb}, 0.6)`,
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            padding: '8px',
            gap: '4px',
          }}
        >
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isSelected =
              selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth();
            const isToday =
              new Date().getDate() === day && new Date().getMonth() === currentMonth.getMonth();
            return (
              <div
                key={day}
                style={dayStyles(isSelected, isToday)}
                onClick={() => handleDateSelect(day)}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = `rgba(${rgb}, 0.2)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = isToday
                      ? `rgba(${rgb}, 0.2)`
                      : 'transparent';
                  }
                }}
              >
                {day}
              </div>
            );
          })}
        </div>

        {showCorners && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                width: '8px',
                height: '8px',
                borderTop: `1px solid ${themeColors.primary}`,
                borderLeft: `1px solid ${themeColors.primary}`,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderTop: `1px solid ${themeColors.primary}`,
                borderRight: `1px solid ${themeColors.primary}`,
                opacity: 0.5,
              }}
            />
          </>
        )}
        {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
        {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}
      </div>

      {isOpen && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ColdWarDatePicker;
