import React from 'react';
import { ColdWarContextMenu } from './ColdWarContextMenu';
import { useColdWarContextMenu } from '../hooks/useColdWarContextMenu';
import '../styles/cold-war-theme.css';

/**
 * Cold War Context Menu Demo
 *
 * نمایش عملی منوی کلیک راست Cold War
 *
 * استفاده:
 * 1. کلیک راست کنید تا منو ظاهر شود
 * 2. بر روی آیتم‌ها hover کنید تا انیمیشن‌ها را ببینید
 * 3. بر روی یک آیتم کلیک کنید
 */

export const ColdWarContextMenuDemo: React.FC = () => {
  const { contextMenu, handleContextMenu, handleCloseContextMenu } = useColdWarContextMenu();
  const [lastAction, setLastAction] = React.useState<string>('');

  const handleMenuAction = (action: string) => {
    setLastAction(action);
    handleCloseContextMenu();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--cw-color-background)',
        color: 'var(--cw-color-text)',
        fontFamily: 'var(--cw-font-family)',
        padding: '48px',
        position: 'relative',
        zIndex: 1,
      }}
      data-theme="perseus"
      onContextMenu={handleContextMenu}
    >
      {/* Header */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--cw-color-primary)',
            marginBottom: '16px',
            textShadow: '0 0 20px rgba(29, 237, 195, 0.5)',
          }}
        >
          CONTEXT MENU DEMO
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            color: 'var(--cw-color-text-secondary)',
            letterSpacing: '0.05em',
          }}
        >
          کلیک راست کنید تا منوی تاکتیکی ظاهر شود
        </p>
      </div>

      {/* Instructions */}
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto 48px',
          padding: '24px',
          backgroundColor: 'rgba(29, 237, 195, 0.1)',
          border: '2px solid var(--cw-color-primary)',
          clipPath:
            'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            color: 'var(--cw-color-primary)',
            marginTop: 0,
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          راهنمای استفاده
        </h2>
        <ul
          style={{
            margin: 0,
            paddingLeft: '24px',
            lineHeight: 1.8,
          }}
        >
          <li>کلیک راست در هر جای صفحه تا منو ظاهر شود</li>
          <li>بر روی آیتم‌ها hover کنید تا انیمیشن‌های تاکتیکی را ببینید</li>
          <li>بر روی یک آیتم کلیک کنید تا عمل انجام شود</li>
          <li>کلیک بیرون منو یا scroll برای بستن</li>
          <li>منو به صورت خودکار اگر از صفحه خارج شود، تنظیم می‌شود</li>
        </ul>
      </div>

      {/* Features Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '48px',
        }}
      >
        <div
          style={{
            padding: '24px',
            backgroundColor: 'rgba(29, 237, 195, 0.1)',
            border: '1px solid var(--cw-color-primary)',
            clipPath:
              'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
          }}
        >
          <h3
            style={{
              color: 'var(--cw-color-primary)',
              marginTop: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            ✓ ظاهر تاکتیکی
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>رنگ‌های Cold War و افکت‌های CRT</p>
        </div>

        <div
          style={{
            padding: '24px',
            backgroundColor: 'rgba(240, 160, 0, 0.1)',
            border: '1px solid var(--cw-color-secondary)',
            clipPath:
              'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
          }}
        >
          <h3
            style={{
              color: 'var(--cw-color-secondary)',
              marginTop: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            ✓ انیمیشن‌های سریع
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>hover effects و pulse animations</p>
        </div>

        <div
          style={{
            padding: '24px',
            backgroundColor: 'rgba(224, 50, 50, 0.1)',
            border: '1px solid var(--cw-color-accent)',
            clipPath:
              'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
          }}
        >
          <h3
            style={{
              color: 'var(--cw-color-accent)',
              marginTop: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            ✓ قابل دسترسی
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>WCAG AAA و prefers-reduced-motion</p>
        </div>
      </div>

      {/* Last Action Display */}
      {lastAction && (
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto 48px',
            padding: '24px',
            backgroundColor: 'rgba(51, 255, 0, 0.1)',
            border: '2px solid var(--cw-color-success)',
            clipPath:
              'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '1.1rem',
              color: 'var(--cw-color-success)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            آخرین عمل: <strong>{lastAction}</strong>
          </p>
        </div>
      )}

      {/* Menu Items Reference */}
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '24px',
          backgroundColor: 'rgba(10, 18, 37, 0.8)',
          border: '1px solid var(--cw-color-primary)',
          clipPath:
            'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            color: 'var(--cw-color-primary)',
            marginTop: 0,
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          آیتم‌های منو
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          {[
            { icon: '⚔️', label: 'COLDWAR INTRO', color: 'var(--cw-color-primary)' },
            { icon: '🎯', label: 'SHOWCASE', color: 'var(--cw-color-primary)' },
            { icon: '🕹️', label: 'PLAYGROUND', color: 'var(--cw-color-primary)' },
            { icon: '📋', label: 'DOCUMENTATION', color: 'var(--cw-color-primary)' },
            { icon: '🗺️', label: 'TACTICAL VIEW', color: 'var(--cw-color-secondary)' },
            { icon: '📦', label: 'COMPONENT LIBRARY', color: 'var(--cw-color-secondary)' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: '12px',
                backgroundColor: 'rgba(29, 237, 195, 0.05)',
                border: `1px solid ${item.color}`,
                borderRadius: '2px',
                fontSize: '0.9rem',
                color: item.color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <span style={{ marginRight: '8px' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ColdWarContextMenu x={contextMenu.x} y={contextMenu.y} onClose={handleCloseContextMenu} />
      )}
    </div>
  );
};

export default ColdWarContextMenuDemo;
