import React from 'react';

interface GlassContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onCopyInstall: () => void;
}

export function GlassContextMenu({
  x,
  y,
  onClose,
  onNavigate,
  onCopyInstall,
}: GlassContextMenuProps) {
  const menuItems = [
    { icon: '⚡', label: 'Open Playground', action: () => onNavigate('/playground') },
    { icon: '✨', label: 'View Showcase', action: () => onNavigate('/showcase') },
    { icon: '📚', label: 'Documentation', action: () => onNavigate('/docs') },
    {
      icon: '👤',
      label: 'View Portfolio',
      action: () => onNavigate('/portfolio'),
      color: '#EF3EF1',
    },
    { divider: true },
    {
      icon: '🔗',
      label: 'GitHub Repository',
      action: () => window.open('https://github.com', '_blank'),
    },
    { icon: '📦', label: 'NPM Package', action: () => window.open('https://npmjs.com', '_blank') },
    { divider: true },
    { icon: '📋', label: 'Copy Install Command', action: onCopyInstall },
  ];

  return (
    <div
      className="glass-context-menu"
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        background:
          'linear-gradient(135deg, rgba(10, 18, 37, 0.25) 0%, rgba(20, 30, 48, 0.25) 100%)',
        border: '2px solid rgba(41, 242, 223, 0.2)',
        borderRadius: '0px',
        padding: '0.5rem 0',
        overflow: 'hidden',
        minWidth: '260px',
        zIndex: 10000,
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 80px rgba(41, 242, 223, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(40px) saturate(220%)',
        WebkitBackdropFilter: 'blur(40px) saturate(220%)',
        animation: 'hudGlitchPulse 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {menuItems.map((item, index) =>
        item.divider ? (
          <div
            key={`divider-${index}`}
            style={{
              height: '1px',
              background:
                'linear-gradient(90deg, transparent, rgba(41, 242, 223, 0.3), transparent)',
              margin: '0.5rem 0',
            }}
          />
        ) : (
          <div
            key={`item-${index}`}
            onClick={() => {
              item.action();
              onClose();
            }}
            style={{
              padding: '0.85rem 1.2rem',
              cursor: 'pointer',
              color: item.color || '#29F2DF',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '0px',
              margin: '0.25rem 0.5rem',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = `rgba(${item.color === '#EF3EF1' ? '239, 62, 241' : '41, 242, 223'}, 0.15)`;
              el.style.paddingLeft = '1.5rem';
              el.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = 'transparent';
              el.style.paddingLeft = '1.2rem';
              el.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: '16px', minWidth: '20px' }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
          </div>
        )
      )}

      <style>{`
        @keyframes hudGlitchPulse {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(-15px);
            box-shadow: 0 0 20px rgba(41, 242, 223, 0), 0 0 40px rgba(239, 62, 241, 0);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02) translateY(-2px);
            box-shadow: 0 0 30px rgba(41, 242, 223, 0.3), 0 0 60px rgba(239, 62, 241, 0.2);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 80px rgba(41, 242, 223, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }
        }
      `}</style>
    </div>
  );
}
