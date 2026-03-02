/**
 * Stepper Component
 * Step-by-step progress indicator
 */

import React, { useMemo } from 'react';
import { useTheme } from '@rhuds/core';
import { StepperProps } from './types';

/**
 * Stepper Component
 */
export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep: controlledCurrentStep = 0,
  onStepChange,
  orientation = 'horizontal',
  showContent = false,
  stepContent = [],
  animationDuration = 300,
  className,
  style,
}) => {
  const themeContext = useTheme();
  const theme = (themeContext as any).currentMode?.tokens || (themeContext as any);

  const currentStep = controlledCurrentStep !== undefined ? controlledCurrentStep : 0;

  const handleStepClick = (index: number) => {
    onStepChange?.(index);
  };

  const containerStyle = useMemo<React.CSSProperties>(() => {
    return {
      display: 'flex',
      flexDirection: orientation === 'vertical' ? 'column' : 'row',
      gap: '1rem',
      backgroundColor: theme.currentMode.tokens.colors.background,
      color: theme.currentMode.tokens.colors.text,
      ...style,
    };
  }, [orientation, theme, style]);

  const stepsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    gap: orientation === 'vertical' ? '0' : '0.5rem',
    flex: 1,
  };

  const stepItemStyle = (index: number): React.CSSProperties => {
    const isCompleted = index < currentStep;
    const isActive = index === currentStep;

    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      flex: orientation === 'horizontal' ? 1 : 'auto',
      cursor: 'pointer',
      position: 'relative',
    };
  };

  const stepCircleStyle = (index: number): React.CSSProperties => {
    const isCompleted = index < currentStep;
    const isActive = index === currentStep;

    return {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      backgroundColor: isCompleted || isActive ? theme.currentMode.tokens.colors.primary : theme.currentMode.tokens.colors.background,
      color: isCompleted || isActive ? theme.currentMode.tokens.colors.background : theme.currentMode.tokens.colors.text,
      border: `2px solid ${theme.currentMode.tokens.colors.primary}`,
      transition: `all ${animationDuration}ms ease-in-out`,
      flexShrink: 0,
    };
  };

  const stepLabelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    fontSize: '0.95rem',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    opacity: 0.7,
  };

  const connectorStyle = (index: number): React.CSSProperties => {
    const isCompleted = index < currentStep;

    if (orientation === 'vertical') {
      return {
        position: 'absolute',
        left: '19px',
        top: '40px',
        width: '2px',
        height: 'calc(100% - 40px)',
        backgroundColor: isCompleted ? theme.currentMode.tokens.colors.primary : theme.currentMode.tokens.colors.primary,
        opacity: isCompleted ? 1 : 0.3,
        transition: `opacity ${animationDuration}ms ease-in-out`,
      };
    } else {
      return {
        position: 'absolute',
        left: '40px',
        top: '19px',
        width: 'calc(100% - 40px)',
        height: '2px',
        backgroundColor: isCompleted ? theme.currentMode.tokens.colors.primary : theme.currentMode.tokens.colors.primary,
        opacity: isCompleted ? 1 : 0.3,
        transition: `opacity ${animationDuration}ms ease-in-out`,
      };
    }
  };

  const contentStyle: React.CSSProperties = {
    padding: '1rem',
    backgroundColor: theme.currentMode.tokens.colors.background,
    borderRadius: '4px',
    border: `1px solid ${theme.currentMode.tokens.colors.primary}`,
    opacity: 0,
    transition: `opacity ${animationDuration}ms ease-in-out`,
  };

  const activeContentStyle: React.CSSProperties = {
    ...contentStyle,
    opacity: 1,
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={stepsContainerStyle}>
        {steps.map((step, index) => (
          <div
            key={step.key}
            style={stepItemStyle(index)}
            onClick={() => handleStepClick(index)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '1';
            }}
          >
            {index < steps.length - 1 && <div style={connectorStyle(index)} />}
            <div style={stepCircleStyle(index)}>
              {index < currentStep ? '✓' : index + 1}
            </div>
            <div style={stepLabelStyle}>
              <div style={labelStyle}>{step.label}</div>
              {step.description && <div style={descriptionStyle}>{step.description}</div>}
            </div>
          </div>
        ))}
      </div>

      {showContent && stepContent.length > 0 && (
        <div style={currentStep < stepContent.length ? activeContentStyle : contentStyle}>
          {stepContent[currentStep]}
        </div>
      )}
    </div>
  );
};

Stepper.displayName = 'Stepper';


