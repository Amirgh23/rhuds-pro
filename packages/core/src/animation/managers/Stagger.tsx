import React from 'react';
/**
 * Stagger Manager
 * Staggers child animations with configurable delays
 */

import React, { Children, cloneElement, isValidElement } from 'react';
import { StaggerProps } from '../types';

/**
 * Stagger component for staggering child animations
 * 
 * Adds incremental delays to child Animator components
 * to create a cascading animation effect.
 */
export const Stagger: React.FC<StaggerProps> = ({
  stagger = 50,
  direction = 'forward',
  children,
}) => {
  const childArray = Children.toArray(children);
  const count = childArray.length;

  // Calculate stagger delay
  const getStaggerDelay = (index: number): number => {
    if (stagger === 'auto') {
      // Auto stagger: distribute evenly over 300ms
      return (300 / count) * index;
    }

    // Apply direction
    const effectiveIndex = direction === 'reverse' ? count - 1 - index : index;
    return stagger * effectiveIndex;
  };

  return (
    <>
      {childArray.map((child, index) => {
        if (!isValidElement(child)) {
          return child;
        }

        // Clone child and inject stagger delay
        const staggerDelay = getStaggerDelay(index);
        const existingDuration = (child.props as any).duration || {};
        const existingDelay = existingDuration.delay || 0;

        return cloneElement(child, {
          ...child.props,
          duration: {
            ...existingDuration,
            delay: existingDelay + staggerDelay,
          },
          key: child.key || index,
        } as any);
      })}
    </>
  );
};

Stagger.displayName = 'Stagger';

