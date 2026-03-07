/**
 * GradientAlert Component
 * Alert/Notification with gradient background and icon
 */

import React from 'react';
import styled from 'styled-components';

export type AlertType = 'success' | 'warning' | 'error' | 'danger' | 'info';

export interface GradientAlertProps {
  type?: AlertType;
  message: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

const alertConfig = {
  success: {
    color: '#10b981',
    icon: (
      <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
    ),
  },
  warning: {
    color: '#f59e0b',
    icon: (
      <path d="m569.517 440.013c18.458 31.994-4.711 71.987-41.577 71.987h-479.886c-36.937 0-59.999-40.055-41.577-71.987l239.946-416.028c18.467-32.009 64.72-31.951 83.154 0zm-281.517-86.013c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346 7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" />
    ),
  },
  error: {
    color: '#ef4444',
    icon: (
      <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
    ),
  },
  danger: {
    color: '#dc2626',
    icon: (
      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z" />
    ),
  },
  info: {
    color: '#3b82f6',
    icon: (
      <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z" />
    ),
  },
};

const AlertContainer = styled.div<{ $color: string }>`
  width: 400px;
  padding-right: 10px;
  height: fit-content;
  padding-bottom: 12px;
  background: lightgrey;
  border-left-style: solid;
  border-left-color: ${props => props.$color};
  border-left-width: 5px;
  border-radius: 15px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  background: linear-gradient(
    to right,
    ${props => props.$color}56,
    ${props => props.$color}25 50%,
    ${props => props.$color}38
  );
  position: relative;
`;

const AlertContent = styled.span`
  display: flex;
  align-items: flex-start;
`;

const IconWrapper = styled.svg<{ $color: string }>`
  height: 40px;
  min-width: 40px;
  padding-left: 10px;
  padding-top: 12px;
  fill: ${props => props.$color};
  flex-shrink: 0;
`;

const TextWrapper = styled.div`
  flex: 1;
  padding-top: 13px;
  padding-left: 10px;
  padding-right: 10px;
`;

const Message = styled.p`
  color: white;
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  margin-bottom: 4px;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  margin: 0;
  line-height: 1.4;
`;

const CloseButton = styled.button<{ $color: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: ${props => props.$color};
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  padding: 4px 8px;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export function GradientAlert({
  type = 'info',
  message,
  description,
  onClose,
  className = '',
}: GradientAlertProps) {
  const config = alertConfig[type];

  return (
    <AlertContainer $color={config.color} className={className}>
      <AlertContent>
        <IconWrapper
          $color={config.color}
          viewBox="0 0 576 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          {config.icon}
        </IconWrapper>
        <TextWrapper>
          <Message>{message}</Message>
          {description && <Description>{description}</Description>}
        </TextWrapper>
      </AlertContent>
      {onClose && (
        <CloseButton $color={config.color} onClick={onClose} aria-label="Close">
          ×
        </CloseButton>
      )}
    </AlertContainer>
  );
}

export default GradientAlert;
