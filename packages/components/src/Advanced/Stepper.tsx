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
  
  // Safe theme access with fallback
  const primaryColor = themeContext?.currentMode?.tokens?.colors?.primary || '#00f6ff';
  const textColor = themeContext?.currentMode?.tokens?.colors?.text || '#ffffff';
  const backgroundColor = themeContext?.currentMode?.tokens?.colors?.background || '#0a0a0a';

  const currentStep = controlledCurrentStep !== undefined ? controlledCurrentStep : 0;

  const handleStepClick = (index: number) => {
    onStepChange?.(index);
  };

  const containerStyle = useMemo<React.CSSProperties>(() => {
    return {
      display: 'flex',
      flexDirection: orientation === 'vertical' ? 'column' : 'row',
      gap: '1rem',
      backgroundColor: backgroundColor,
      color: textColor,
      ...style,
    };
  }, [orientation, backgroundColor, textColor, style]);

  const stepsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    alignItems: orientation === 'vertical' ? 'flex-start' : 'center',
    gap: '0',
    flex: 1,
  };

  const stepItemStyle = (index: number): React.CSSProperties => {
    const isCompleted = index < currentStep;
    const isActive = index === currentStep;

    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      flex: orientation === 'horizontal' ? 'none' : 'auto',
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
      backgroundColor: isCompleted || isActive ? primaryColor : backgroundColor,
      color: isCompleted || isActive ? backgroundColor : textColor,
      border: `2px solid ${primaryColor}`,
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
        width: '2px',
        height: '40px',
        backgroundColor: primaryColor,
        opacity: isCompleted ? 1 : 0.3,
        transition: `opacity ${animationDuration}ms ease-in-out`,
        flexShrink: 0,
        marginLeft: '19px',
      };
    } else {
      return {
        width: '60px',
        height: '2px',
        backgroundColor: primaryColor,
        opacity: isCompleted ? 1 : 0.3,
        transition: `opacity ${animationDuration}ms ease-in-out`,
        flexShrink: 0,
      };
    }
  };

  const contentStyle: React.CSSProperties = {
    padding: '1rem',
    backgroundColor: backgroundColor,
    borderRadius: '4px',
    border: `1px solid ${primaryColor}`,
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
          <React.Fragment key={step.key}>
            <div
              style={stepItemStyle(index)}
              onClick={() => handleStepClick(index)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '1';
              }}
            >
              <div style={stepCircleStyle(index)}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <div style={stepLabelStyle}>
                <div style={labelStyle}>{step.label}</div>
                {step.description && <div style={descriptionStyle}>{step.description}</div>}
              </div>
            </div>
            {index < steps.length - 1 && <div style={connectorStyle(index)} />}
          </React.Fragment>
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


