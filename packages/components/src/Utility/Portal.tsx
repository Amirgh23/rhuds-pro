/**
 * Portal Component
 * Renders children in a portal at document.body level
 */

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: ReactNode;
  containerId?: string;
}

/**
 * Portal Component
 * Renders children outside the parent component hierarchy
 */
export const Portal: React.FC<PortalProps> = ({ children, containerId = 'portal-root' }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(containerId);
    
    if (!element) {
      element = document.createElement('div');
      element.id = containerId;
      document.body.appendChild(element);
    }

    setContainer(element);

    return () => {
      // Clean up only if the container is empty
      if (element && element.childNodes.length === 0 && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [containerId]);

  if (!container) {
    return null;
  }

  return createPortal(children, container);
};

Portal.displayName = 'Portal';
