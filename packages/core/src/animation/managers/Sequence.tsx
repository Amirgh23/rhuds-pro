/**
 * Sequence Manager
 * Runs animations in sequence
 */

import React, { Children, useState, useEffect, cloneElement, isValidElement } from 'react';

/**
 * Sequence component for running animations sequentially
 *
 * Activates child Animator components one after another,
 * waiting for each to complete before starting the next.
 */
export const Sequence: React.FC<{ children: React.ReactNode; onComplete?: () => void }> = ({
  children,
  onComplete,
}) => {
  const childArray = React.Children.toArray(children);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [completedIndices, setCompletedIndices] = React.useState<Set<number>>(new Set());

  // Handle animation completion
  const handleAnimationComplete = (index: number) => {
    setCompletedIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });

    // Move to next animation
    if (index < childArray.length - 1) {
      setActiveIndex(index + 1);
    } else {
      // All animations complete
      onComplete?.();
    }
  };

  // Reset when children change
  React.useEffect(() => {
    setActiveIndex(0);
    setCompletedIndices(new Set());
  }, [children]);

  return (
    <>
      {childArray.map((child, index) => {
        if (!isValidElement(child)) {
          return child;
        }

        // Determine if this animation should be active
        const isActive = index <= activeIndex;
        const isCompleted = completedIndices.has(index);

        // Clone child and inject activation state
        return cloneElement(child, {
          ...child.props,
          activate: isActive,
          onAnimateEntered: () => {
            (child.props as any).onAnimateEntered?.();
            if (!isCompleted) {
              handleAnimationComplete(index);
            }
          },
          key: child.key || index,
        } as any);
      })}
    </>
  );
};

Sequence.displayName = 'Sequence';
