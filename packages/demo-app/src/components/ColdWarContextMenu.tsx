import { useNavigate } from 'react-router-dom';
import './ColdWarContextMenu.css';

interface ColdWarContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export function ColdWarContextMenu({ x, y, onClose }: ColdWarContextMenuProps) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    {
      label: 'COLDWAR INTRO',
      icon: '⚔️',
      action: () => handleNavigation('/coldwar-intro'),
      category: 'navigation',
    },
    {
      label: 'SHOWCASE',
      icon: '🎯',
      action: () => handleNavigation('/coldwar-showcase'),
      category: 'navigation',
    },
    {
      label: 'PLAYGROUND',
      icon: '🕹️',
      action: () => handleNavigation('/coldwar-playground'),
      category: 'navigation',
    },
    {
      label: 'DOCUMENTATION',
      icon: '📋',
      action: () => handleNavigation('/coldwar-docs'),
      category: 'navigation',
    },
    {
      label: 'DIVIDER',
      icon: '',
      action: () => {},
      category: 'divider',
    },
    {
      label: 'TACTICAL VIEW',
      icon: '🗺️',
      action: () => handleNavigation('/coldwar-showcase'),
      category: 'action',
    },
    {
      label: 'COMPONENT LIBRARY',
      icon: '📦',
      action: () => handleNavigation('/coldwar-playground'),
      category: 'action',
    },
  ];

  return (
    <div
      className="coldwar-context-menu"
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 10000,
      }}
    >
      <div className="coldwar-context-menu-container">
        <div className="coldwar-context-menu-header">
          <div className="coldwar-context-menu-title">TACTICAL MENU</div>
          <div className="coldwar-context-menu-scanline"></div>
        </div>

        <div className="coldwar-context-menu-content">
          {menuItems.map((item, index) => {
            if (item.category === 'divider') {
              return (
                <div key={index} className="coldwar-context-menu-divider">
                  <div className="divider-line"></div>
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`coldwar-context-menu-item ${item.category}`}
                onClick={item.action}
              >
                <span className="item-icon">{item.icon}</span>
                <span className="item-label">{item.label}</span>
                <span className="item-indicator"></span>
              </div>
            );
          })}
        </div>

        <div className="coldwar-context-menu-footer">
          <div className="footer-text">SIGNAL ACTIVE</div>
          <div className="footer-indicator"></div>
        </div>
      </div>

      {/* Glitch effect layers */}
      <div className="coldwar-context-menu-glitch"></div>
    </div>
  );
}
