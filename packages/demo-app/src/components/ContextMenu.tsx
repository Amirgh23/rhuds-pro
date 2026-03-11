import { useNavigate } from 'react-router-dom';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export function ContextMenu({ x, y, onClose }: ContextMenuProps) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('npm install @rhuds/core @rhuds/components');
    onClose();
  };

  return (
    <div
      className="context-menu"
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        background: 'linear-gradient(135deg, rgba(10, 18, 37, 0.7) 0%, rgba(20, 30, 48, 0.7) 100%)',
        border: '2px solid rgba(41, 242, 223, 0.5)',
        borderRadius: '16px',
        padding: '0.5rem 0',
        minWidth: '240px',
        zIndex: 10000,
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 60px rgba(41, 242, 223, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(30px) saturate(200%)',
        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
      }}
    >
      <div
        className="context-menu-item"
        onClick={() => handleNavigation('/playground')}
        style={{
          padding: '0.75rem 1rem',
          cursor: 'pointer',
          color: '#29F2DF',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(41, 242, 223, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <span className="context-menu-icon">⚡</span>
        Open Playground
      </div>
      <div
        className="context-menu-item"
        onClick={() => handleNavigation('/showcase')}
        style={{
          padding: '0.75rem 1rem',
          cursor: 'pointer',
          color: '#29F2DF',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(41, 242, 223, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <span className="context-menu-icon">✨</span>
        View Showcase
      </div>
      <div
        className="context-menu-item"
        onClick={() => handleNavigation('/docs')}
        style={{
          padding: '0.75rem 1rem',
          cursor: 'pointer',
          color: '#29F2DF',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(41, 242, 223, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <span className="context-menu-icon">📚</span>
        Documentation
      </div>
      <div
        className="context-menu-item"
        onClick={() => handleNavigation('/portfolio')}
        style={{
          padding: '0.75rem 1rem',
          cursor: 'pointer',
          color: '#EF3EF1',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(239, 62, 241, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <span className="context-menu-icon">👤</span>
        View Portfolio
      </div>
      <div
        className="context-menu-divider"
        style={{
          height: '1px',
          background: 'rgba(41, 242, 223, 0.3)',
          margin: '0.5rem 0',
        }}
      />
      <div
        className="context-menu-item"
        onClick={() => window.open('https://github.com', '_blank')}
        style={{
          padding: '0.75rem 1rem',
          cursor: 'pointer',
          color: '#29F2DF',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(41, 242, 223, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <span className="context-menu-icon">🔗</span>
        GitHub Repository
      </div>
      <div
        className="context-menu-item"
        onClick={() => window.open('https://npmjs.com', '_blank')}
        style={{
          padding: '0.75rem 1rem',
          cursor: 'pointer',
          color: '#29F2DF',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(41, 242, 223, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <span className="context-menu-icon">📦</span>
        NPM Package
      </div>
      <div
        className="context-menu-divider"
        style={{
          height: '1px',
          background: 'rgba(41, 242, 223, 0.3)',
          margin: '0.5rem 0',
        }}
      />
      <div
        className="context-menu-item"
        onClick={handleCopyInstall}
        style={{
          padding: '0.75rem 1rem',
          cursor: 'pointer',
          color: '#29F2DF',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(41, 242, 223, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <span className="context-menu-icon">📋</span>
        Copy Install Command
      </div>
    </div>
  );
}
