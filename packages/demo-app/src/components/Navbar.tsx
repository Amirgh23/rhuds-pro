import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavbarHudBackground } from './NavbarHudBackground';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Only show navigation on non-intro pages
  if (location.pathname === '/') {
    return null;
  }

  // Detect if we're in Cold War section
  const isColdWarSection =
    location.pathname.startsWith('/coldwar') || location.pathname.startsWith('/cold-war');

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleClick = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path);
  };

  const navButtonStyle = (
    isActiveButton: boolean,
    color: string = '#29F2DF'
  ): React.CSSProperties => {
    const isColdWarButton = color === '#FFB000';
    return {
      padding: '0.6rem 1.2rem',
      fontSize: '12px',
      fontWeight: '700',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      border: `1px solid ${isActiveButton ? color : `rgba(${isColdWarButton ? '255, 176, 0' : '41, 242, 223'}, 0.4)`}`,
      background: isActiveButton
        ? `rgba(${isColdWarButton ? '255, 176, 0' : '41, 242, 223'}, 0.15)`
        : isColdWarButton
          ? 'rgba(10, 10, 12, 0.6)'
          : 'rgba(10, 18, 37, 0.6)',
      color: isActiveButton ? color : isColdWarButton ? '#D4A574' : '#8EC8D8',
      cursor: 'pointer',
      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      textShadow: isActiveButton
        ? `0 0 8px rgba(${isColdWarButton ? '255, 176, 0' : '41, 242, 223'}, 0.6)`
        : 'none',
      boxShadow: isActiveButton
        ? `0 0 15px rgba(${isColdWarButton ? '255, 176, 0' : '41, 242, 223'}, 0.4), inset 0 0 10px rgba(${isColdWarButton ? '255, 176, 0' : '41, 242, 223'}, 0.1)`
        : 'none',
      clipPath: isColdWarButton
        ? 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
        : 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
      fontFamily: '"Share Tech Mono", monospace',
      position: 'relative',
      overflow: 'hidden',
    };
  };

  const createNavButton = (path: string, label: string, color: string = '#29F2DF') => {
    const isActiveButton = isActive(path);
    return (
      <button
        key={path}
        onClick={handleClick(path)}
        style={navButtonStyle(isActiveButton, color)}
        onMouseEnter={(e) => {
          const btn = e.currentTarget;
          btn.style.borderColor = color;
          btn.style.color = color;
          btn.style.background = `rgba(${color === '#FFB000' ? '255, 176, 0' : '41, 242, 223'}, 0.2)`;
          btn.style.boxShadow = `0 0 20px rgba(${color === '#FFB000' ? '255, 176, 0' : '41, 242, 223'}, 0.5), inset 0 0 15px rgba(${color === '#FFB000' ? '255, 176, 0' : '41, 242, 223'}, 0.15)`;
          btn.style.textShadow = `0 0 10px rgba(${color === '#FFB000' ? '255, 176, 0' : '41, 242, 223'}, 0.8)`;
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget;
          if (!isActiveButton) {
            btn.style.borderColor = `rgba(${color === '#FFB000' ? '255, 176, 0' : '41, 242, 223'}, 0.4)`;
            btn.style.color = '#8EC8D8';
            btn.style.background = 'rgba(10, 18, 37, 0.6)';
            btn.style.boxShadow = 'none';
            btn.style.textShadow = 'none';
          }
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      <NavbarHudBackground />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          background: isColdWarSection
            ? 'linear-gradient(180deg, rgba(10, 10, 12, 0.98) 0%, rgba(10, 10, 12, 0.95) 100%)'
            : 'linear-gradient(180deg, rgba(10, 18, 37, 0.98) 0%, rgba(10, 18, 37, 0.95) 100%)',
          backdropFilter: 'blur(12px)',
          borderBottom: isColdWarSection
            ? '2px solid rgba(255, 176, 0, 0.25)'
            : '2px solid rgba(41, 242, 223, 0.25)',
          boxShadow: isColdWarSection
            ? '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 176, 0, 0.1)'
            : '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(41, 242, 223, 0.1)',
          padding: '0.8rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
          overflowX: 'auto',
          fontFamily: '"Share Tech Mono", monospace',
        }}
      >
        {/* Logo */}
        <button
          onClick={handleClick('/')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.4rem 0.8rem',
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '0.1em',
            color: isColdWarSection ? '#FFB000' : '#29F2DF',
            textShadow: isColdWarSection
              ? '0 0 12px rgba(255, 176, 0, 0.6)'
              : '0 0 12px rgba(41, 242, 223, 0.6)',
            whiteSpace: 'nowrap',
            fontFamily: '"Share Tech Mono", monospace',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (isColdWarSection) {
              e.currentTarget.style.textShadow = '0 0 20px rgba(255, 176, 0, 0.9)';
              e.currentTarget.style.color = '#FFD700';
            } else {
              e.currentTarget.style.textShadow = '0 0 20px rgba(41, 242, 223, 0.9)';
              e.currentTarget.style.color = '#5FFFF5';
            }
          }}
          onMouseLeave={(e) => {
            if (isColdWarSection) {
              e.currentTarget.style.textShadow = '0 0 12px rgba(255, 176, 0, 0.6)';
              e.currentTarget.style.color = '#FFB000';
            } else {
              e.currentTarget.style.textShadow = '0 0 12px rgba(41, 242, 223, 0.6)';
              e.currentTarget.style.color = '#29F2DF';
            }
          }}
        >
          {isColdWarSection ? '▸ COLD WAR' : '⬢ RHUDS'}
        </button>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {isColdWarSection ? (
            <>
              {createNavButton('/coldwar-intro', 'Intro', '#FFB000')}
              {createNavButton('/coldwar-showcase', 'Showcase', '#FFB000')}
              {createNavButton('/coldwar-charts', 'Charts', '#FFB000')}
              {createNavButton('/coldwar-playground', 'Playground', '#FFB000')}
              {createNavButton('/coldwar-docs', 'Docs', '#FFB000')}
              {createNavButton('/coldwar-portfolio', 'Portfolio', '#FFB000')}
              <div
                style={{
                  width: '1px',
                  height: '24px',
                  background: 'rgba(255, 176, 0, 0.3)',
                  margin: '0 0.3rem',
                }}
              />
              {createNavButton('/intro', 'Switch to RHUDS', '#29F2DF')}
            </>
          ) : (
            <>
              {createNavButton('/intro', 'Intro')}
              {createNavButton('/showcase', 'Showcase')}
              {createNavButton('/charts', 'Charts')}
              {createNavButton('/playground', 'Playground')}
              {createNavButton('/docs', 'Docs')}
              {createNavButton('/portfolio', 'Portfolio', '#EF3EF1')}
              <div
                style={{
                  width: '1px',
                  height: '24px',
                  background: 'rgba(41, 242, 223, 0.3)',
                  margin: '0 0.3rem',
                }}
              />
              {createNavButton('/coldwar-charts', 'Cold War Charts', '#FFB000')}
            </>
          )}
        </div>
      </div>
    </>
  );
};
