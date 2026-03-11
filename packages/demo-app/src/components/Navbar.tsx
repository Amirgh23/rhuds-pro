import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Only show navigation on non-intro pages
  if (location.pathname === '/') {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  const handleClick = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Navigating to:', path);
    navigate(path);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: 'rgba(10, 18, 37, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(41, 242, 223, 0.3)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <button
        onClick={handleClick('/')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#29F2DF',
          textShadow: '0 0 15px rgba(41, 242, 223, 0.4)',
        }}
      >
        🎮 RHUDS Pro
      </button>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={handleClick('/showcase')}
          style={{
            padding: '0.5rem 1.5rem',
            fontSize: '14px',
            fontWeight: '600',
            border: isActive('/showcase')
              ? '2px solid #29F2DF'
              : '2px solid rgba(41, 242, 223, 0.3)',
            borderRadius: '4px',
            background: isActive('/showcase') ? 'rgba(41, 242, 223, 0.1)' : 'transparent',
            color: isActive('/showcase') ? '#29F2DF' : '#8EC8D8',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textShadow: isActive('/showcase') ? '0 0 10px rgba(41, 242, 223, 0.5)' : 'none',
            boxShadow: isActive('/showcase') ? '0 0 20px rgba(41, 242, 223, 0.3)' : 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#29F2DF';
            e.currentTarget.style.color = '#29F2DF';
            e.currentTarget.style.background = 'rgba(41, 242, 223, 0.1)';
          }}
          onMouseLeave={(e) => {
            if (!isActive('/showcase')) {
              e.currentTarget.style.borderColor = 'rgba(41, 242, 223, 0.3)';
              e.currentTarget.style.color = '#8EC8D8';
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          Showcase
        </button>

        <button
          onClick={handleClick('/playground')}
          style={{
            padding: '0.5rem 1.5rem',
            fontSize: '14px',
            fontWeight: '600',
            border: isActive('/playground')
              ? '2px solid #29F2DF'
              : '2px solid rgba(41, 242, 223, 0.3)',
            borderRadius: '4px',
            background: isActive('/playground') ? 'rgba(41, 242, 223, 0.1)' : 'transparent',
            color: isActive('/playground') ? '#29F2DF' : '#8EC8D8',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textShadow: isActive('/playground') ? '0 0 10px rgba(41, 242, 223, 0.5)' : 'none',
            boxShadow: isActive('/playground') ? '0 0 20px rgba(41, 242, 223, 0.3)' : 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#29F2DF';
            e.currentTarget.style.color = '#29F2DF';
            e.currentTarget.style.background = 'rgba(41, 242, 223, 0.1)';
          }}
          onMouseLeave={(e) => {
            if (!isActive('/playground')) {
              e.currentTarget.style.borderColor = 'rgba(41, 242, 223, 0.3)';
              e.currentTarget.style.color = '#8EC8D8';
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          Playground
        </button>

        <button
          onClick={handleClick('/docs')}
          style={{
            padding: '0.5rem 1.5rem',
            fontSize: '14px',
            fontWeight: '600',
            border: isActive('/docs') ? '2px solid #29F2DF' : '2px solid rgba(41, 242, 223, 0.3)',
            borderRadius: '4px',
            background: isActive('/docs') ? 'rgba(41, 242, 223, 0.1)' : 'transparent',
            color: isActive('/docs') ? '#29F2DF' : '#8EC8D8',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textShadow: isActive('/docs') ? '0 0 10px rgba(41, 242, 223, 0.5)' : 'none',
            boxShadow: isActive('/docs') ? '0 0 20px rgba(41, 242, 223, 0.3)' : 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#29F2DF';
            e.currentTarget.style.color = '#29F2DF';
            e.currentTarget.style.background = 'rgba(41, 242, 223, 0.1)';
          }}
          onMouseLeave={(e) => {
            if (!isActive('/docs')) {
              e.currentTarget.style.borderColor = 'rgba(41, 242, 223, 0.3)';
              e.currentTarget.style.color = '#8EC8D8';
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          Documentation
        </button>

        <button
          onClick={handleClick('/portfolio')}
          style={{
            padding: '0.5rem 1.5rem',
            fontSize: '14px',
            fontWeight: '600',
            border: isActive('/portfolio')
              ? '2px solid #EF3EF1'
              : '2px solid rgba(239, 62, 241, 0.3)',
            borderRadius: '4px',
            background: isActive('/portfolio') ? 'rgba(239, 62, 241, 0.1)' : 'transparent',
            color: isActive('/portfolio') ? '#EF3EF1' : '#8EC8D8',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textShadow: isActive('/portfolio') ? '0 0 10px rgba(239, 62, 241, 0.5)' : 'none',
            boxShadow: isActive('/portfolio') ? '0 0 20px rgba(239, 62, 241, 0.3)' : 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#EF3EF1';
            e.currentTarget.style.color = '#EF3EF1';
            e.currentTarget.style.background = 'rgba(239, 62, 241, 0.1)';
          }}
          onMouseLeave={(e) => {
            if (!isActive('/portfolio')) {
              e.currentTarget.style.borderColor = 'rgba(239, 62, 241, 0.3)';
              e.currentTarget.style.color = '#8EC8D8';
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          👤 Portfolio
        </button>
      </div>
    </div>
  );
};
