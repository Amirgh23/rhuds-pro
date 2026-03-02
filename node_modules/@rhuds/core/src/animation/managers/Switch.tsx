/**
 * Switch Manager
 * Conditionally switches between animated components
 */

import React, { cloneElement, isValidElement } from 'react';
import { SwitchProps } from '../types';

/**
 * Switch component for conditional animations
 * 
 * Switches between two child components based on a condition,
 * animating the transition between them.
 */
export const Switch: React.FC<SwitchProps> = ({
  condition,
  children,
}) => {
  if (!Array.isArray(children) || children.length !== 2) {
    console.warn('Switch component requires exactly 2 children');
    return null;
  }

  const [trueChild, falseChild] = children;

  // Render both children with appropriate activation
  return (
    <>
      {isValidElement(trueChild) &&
        cloneElement(trueChild, {
          ...trueChild.props,
          activate: condition,
          unmountOnExited: true,
          key: 'true-child',
        } as any)}
      {isValidElement(falseChild) &&
        cloneElement(falseChild, {
          ...falseChild.props,
          activate: !condition,
          unmountOnExited: true,
          key: 'false-child',
        } as any)}
    </>
  );
};

Switch.displayName = 'Switch';
