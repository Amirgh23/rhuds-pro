import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export function useContextMenu() {
  const [position, setPosition] = useState<ContextMenuPosition | null>(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleClick = () => {
      setVisible(false);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const closeMenu = () => setVisible(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMenu();
  };

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('npm install @rhuds/core @rhuds/components');
    closeMenu();
  };

  return {
    position,
    visible,
    closeMenu,
    handleNavigation,
    handleCopyInstall,
  };
}
