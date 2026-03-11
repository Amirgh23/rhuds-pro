import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroPageFuturistic.css';

export default function IntroPageFuturistic() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="intro-futuristic">
      {/* Animated Grid Background */}
      <div className="grid-background" />

      {/* Floating Particles */}
      <div className="particles-container">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Radial Glow Effect */}
      <div
        className="radial-glow"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(41, 242, 223, 0.15) 0%, transparent 50%)`,
        }}
      />

      {/* Hero Section */}
      <section className={`hero-section ${isLoaded ? 'loaded' : ''}`} ref={heroRef}>
        <div className="hero-content">
          {/* Holographic Logo */}
          <div className="logo-container">
            <div className="logo-glitch-layer logo-glitch-1">RHUDS</div>
            <div className="logo-glitch-layer logo-glitch-2">RHUDS</div>
            <h1 className="logo-main">RHUDS</h1>
            <div className="logo-scanline" />
          </div>

          {/* Subtitle */}
          <div className="subtitle-container">
            <div className="subtitle-line" />
            <h2 className="subtitle">NEXT-GEN HUD SYSTEM</h2>
            <div className="subtitle-line" />
          </div>

          {/* Description */}
          <p className="description">
            Experience the future of UI design with{' '}
            <span className="highlight">51+ premium components</span>, powered by cutting-edge
            animations and sci-fi aesthetics
          </p>

          {/* CTA Buttons */}
          <div className="cta-container">
            <button className="cta-button cta-primary" onClick={() => navigate('/playground')}>
              <span className="button-shine" />
              <span className="button-text">ENTER SYSTEM</span>
              <div className="button-corners">
                <div className="corner corner-tl" />
                <div className="corner corner-tr" />
                <div className="corner corner-bl" />
                <div className="corner corner-br" />
              </div>
            </button>

            <button className="cta-button cta-secondary" onClick={() => navigate('/docs')}>
              <span className="button-shine" />
              <span className="button-text">VIEW DOCS</span>
              <div className="button-corners">
                <div className="corner corner-tl" />
                <div className="corner corner-tr" />
                <div className="corner corner-bl" />
                <div className="corner corner-br" />
              </div>
            </button>
          </div>

          {/* Tech Stack */}
          <div className="tech-stack">
            {['React 18', 'TypeScript', 'WebGL', 'Canvas API', 'Animations'].map((tech, i) => (
              <div key={tech} className="tech-badge" style={{ animationDelay: `${2 + i * 0.1}s` }}>
                <div className="tech-badge-glow" />
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-line" />
          <div className="scroll-text">SCROLL</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="features-title">
          <span className="title-line" />
          EXPLORE THE SYSTEM
          <span className="title-line" />
        </h2>

        <div className="features-grid">
          {[
            {
              title: 'PLAYGROUND',
              subtitle: 'Interactive Sandbox',
              description: '51+ components ready to test and customize in real-time',
              icon: '⚡',
              color: '#29F2DF',
              route: '/playground',
            },
            {
              title: 'SHOWCASE',
              subtitle: 'Component Gallery',
              description: 'Browse the complete library with live examples',
              icon: '✨',
              color: '#EF3EF1',
              route: '/showcase',
            },
            {
              title: 'DOCS',
              subtitle: 'API Reference',
              description: 'Complete guides and integration examples',
              icon: '📚',
              color: '#1C7FA6',
              route: '/docs',
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="feature-card"
              style={
                {
                  animationDelay: `${i * 0.2}s`,
                  '--feature-color': feature.color,
                } as React.CSSProperties
              }
              onClick={() => navigate(feature.route)}
            >
              <div className="feature-border-top" />
              <div className="feature-glow" />

              <div className="feature-icon">{feature.icon}</div>

              <h3 className="feature-title">{feature.title}</h3>
              <div className="feature-subtitle">{feature.subtitle}</div>
              <p className="feature-description">{feature.description}</p>

              <div className="feature-cta">
                EXPLORE <span className="feature-arrow">→</span>
              </div>

              <div className="feature-corners">
                <div className="feature-corner feature-corner-tl" />
                <div className="feature-corner feature-corner-br" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        {[
          { value: '51+', label: 'Components', icon: '⚡' },
          { value: '100%', label: 'TypeScript', icon: '🔷' },
          { value: '∞', label: 'Possibilities', icon: '✨' },
        ].map((stat, i) => (
          <div key={stat.label} className="stat-card" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="stat-border-top" />
            <div className="stat-glow" />

            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-pulse" />

            <div className="stat-corners">
              <div className="stat-corner stat-corner-tl" />
              <div className="stat-corner stat-corner-br" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
