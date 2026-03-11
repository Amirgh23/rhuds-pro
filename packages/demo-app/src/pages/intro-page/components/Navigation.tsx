import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavigationLink {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
}

export const Navigation: React.FC = () => {
  const navigate = useNavigate();

  const links: NavigationLink[] = [
    { label: 'Components', href: '/showcase', icon: '⚡' },
    { label: 'Playground', href: '/playground', icon: '🎮' },
    { label: 'Documentation', href: '/docs', icon: '📚' },
    { label: 'GitHub', href: 'https://github.com', icon: '🔗', external: true },
  ];

  const handleClick = (href: string, external?: boolean) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(href);
    }
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background:
          'linear-gradient(180deg, rgba(10, 18, 37, 0.95) 0%, rgba(10, 18, 37, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '2px solid rgba(41, 242, 223, 0.3)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
        boxShadow: '0 8px 32px rgba(41, 242, 223, 0.15)',
      }}
    >
      {/* Logo/Brand */}
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
          textShadow: '0 0 20px rgba(41, 242, 223, 0.6)',
          transition: 'all 0.3s ease',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '2px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.textShadow = '0 0 30px rgba(41, 242, 223, 1)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textShadow = '0 0 20px rgba(41, 242, 223, 0.6)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        🎮 RHUDS
      </button>

      {/* Navigation Links */}
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
      >
        {links.map((link) => (
          <button
            key={link.label}
            onClick={handleClick(link.href, link.external)}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '1px',
              border: '2px solid rgba(41, 242, 223, 0.4)',
              borderRadius: '8px',
              background: 'rgba(41, 242, 223, 0.08)',
              color: '#29F2DF',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textShadow: '0 0 10px rgba(41, 242, 223, 0.3)',
              boxShadow: '0 0 15px rgba(41, 242, 223, 0.1)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              willChange: 'transform, box-shadow, border-color',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#29F2DF';
              e.currentTarget.style.background = 'rgba(41, 242, 223, 0.15)';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.boxShadow =
                '0 0 30px rgba(41, 242, 223, 0.6), 0 0 50px rgba(41, 242, 223, 0.3)';
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
              e.currentTarget.style.textShadow = '0 0 20px rgba(41, 242, 223, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(41, 242, 223, 0.4)';
              e.currentTarget.style.background = 'rgba(41, 242, 223, 0.08)';
              e.currentTarget.style.color = '#29F2DF';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(41, 242, 223, 0.1)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.textShadow = '0 0 10px rgba(41, 242, 223, 0.3)';
            }}
          >
            {link.icon && <span style={{ fontSize: '16px' }}>{link.icon}</span>}
            <span>{link.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

Navigation.displayName = 'Navigation';
