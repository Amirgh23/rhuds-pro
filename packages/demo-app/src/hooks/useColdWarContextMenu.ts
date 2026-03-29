import { useState, useCallback, useEffect, MouseEvent as ReactMouseEvent } from 'react';

interface ContextMenuPosition {
  x: number;
  y: number;
}

export function useColdWarContextMenu() {
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);

  const handleContextMenu = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const x = e.clientX;
    const y = e.clientY;

    // Adjust position if menu would go off-screen
    const menuWidth = 280;
    const menuHeight = 300;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    if (x + menuWidth > viewportWidth) {
      adjustedX = viewportWidth - menuWidth - 10;
    }

    if (y + menuHeight > viewportHeight) {
      adjustedY = viewportHeight - menuHeight - 10;
    }

    setContextMenu({ x: adjustedX, y: adjustedY });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('scroll', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('scroll', handleClickOutside);
      };
    }
  }, [contextMenu]);

  return {
    contextMenu,
    handleContextMenu,
    handleCloseContextMenu,
  };
}
