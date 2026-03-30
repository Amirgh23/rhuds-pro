/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR STEPPER - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TACTICAL STEP INDICATOR - $1M IMPLEMENTATION
 *
 * FEATURES:
 * - Step-by-step progress tracking
 * - Active, completed, and pending states
 * - Connecting lines between steps
 * - Cold War tactical styling
 * - Scanlines and glow effects
 */

import React, { CSSProperties } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';

export interface ColdWarStepperStep {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface ColdWarStepperProps {
  /** Theme variant */
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  /** Steps */
  steps: ColdWarStepperStep[];
  /** Current active step index */
  currentStep: number;
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Apply glow effect */
  glow?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
}

/**
 * Cold War Stepper Component
 */
export const ColdWarStepper: React.FC<ColdWarStepperProps> = ({
  theme = 'perseus',
  steps,
  currentStep,
  orientation = 'horizontal',
  glow = true,
  className = '',
  style = {},
}) => {
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const containerStyles: CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
    gap: orientation === 'horizontal' ? '0' : '16px',
    ...style,
  };

  const getStepStatus = (index: number): 'completed' | 'active' | 'pending' => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className={className} style={containerStyles}>
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isLast = index === steps.length - 1;
        const techCode = generateTechCode('STP');

        const stepContainerStyles: CSSProperties = {
          display: 'flex',
          flexDirection: orientation === 'horizontal' ? 'column' : 'row',
          alignItems: 'center',
          gap: '8px',
          flex: orientation === 'horizontal' ? 1 : 'none',
          position: 'relative',
        };

        const circleStyles: CSSProperties = {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
          fontSize: '14px',
          fontWeight: 600,
          color: status === 'pending' ? `rgba(${rgb}, 0.5)` : themeColors.primary,
          background:
            status === 'completed'
              ? `rgba(${rgb}, 0.3)`
              : status === 'active'
                ? `rgba(${rgb}, 0.2)`
                : 'transparent',
          border: `2px solid ${status === 'pending' ? `rgba(${rgb}, 0.3)` : themeColors.primary}`,
          boxShadow:
            status === 'active' && glow
              ? `
              0 0 15px rgba(${rgb}, 0.5),
              0 0 30px rgba(${rgb}, 0.3),
              inset 0 0 10px rgba(${rgb}, 0.2)
            `
              : status === 'completed' && glow
                ? `0 0 10px rgba(${rgb}, 0.3)`
                : 'none',
          transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
          position: 'relative',
          zIndex: 2,
        };

        const labelContainerStyles: CSSProperties = {
          display: 'flex',
          flexDirection: 'column',
          alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
          gap: '4px',
          maxWidth: orientation === 'horizontal' ? '120px' : 'none',
        };

        const labelStyles: CSSProperties = {
          fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: status === 'pending' ? `rgba(${rgb}, 0.5)` : themeColors.primary,
          textAlign: orientation === 'horizontal' ? 'center' : 'left',
          textShadow: status === 'active' && glow ? `0 0 4px ${themeColors.primary}` : 'none',
        };

        const descriptionStyles: CSSProperties = {
          fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
          fontSize: '10px',
          color: themeColors.textSecondary,
          textAlign: orientation === 'horizontal' ? 'center' : 'left',
          opacity: 0.7,
        };

        const lineStyles: CSSProperties = {
          position: 'absolute',
          background:
            status === 'completed'
              ? themeColors.primary
              : `linear-gradient(${
                  orientation === 'horizontal' ? '90deg' : '180deg'
                }, ${themeColors.primary} 0%, rgba(${rgb}, 0.3) 100%)`,
          transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
          zIndex: 1,
          ...(orientation === 'horizontal'
            ? {
                top: '20px',
                left: '50%',
                width: '100%',
                height: '2px',
              }
            : {
                top: '50px',
                left: '20px',
                width: '2px',
                height: '100%',
              }),
        };

        return (
          <div key={step.id} style={stepContainerStyles}>
            {/* Circle */}
            <div style={circleStyles}>
              {status === 'completed' ? (
                <span>✓</span>
              ) : step.icon ? (
                <span>{step.icon}</span>
              ) : (
                <span>{index + 1}</span>
              )}
              {status === 'active' && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: themeColors.primary,
                    boxShadow: `0 0 8px ${themeColors.primary}`,
                    animation: 'led-pulse 1s ease-in-out infinite',
                  }}
                />
              )}
            </div>

            {/* Label */}
            <div style={labelContainerStyles}>
              <div style={labelStyles}>{step.label}</div>
              {step.description && <div style={descriptionStyles}>{step.description}</div>}
              <div style={{ fontSize: '8px', opacity: 0.5, color: themeColors.primary }}>
                {techCode}
              </div>
            </div>

            {/* Connecting Line */}
            {!isLast && <div style={lineStyles} />}
          </div>
        );
      })}

      {/* Animations */}
      <style>
        {`
          @keyframes led-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ColdWarStepper;
