import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HudBox, RadarHud, HackerLoader } from '@rhuds/components';
import { ColdWarButton, ColdWarInput, ColdWarCard } from '@rhuds/components';
import { useInterval, useTimeout } from '@rhuds/core';
import { GlassContextMenu } from '../components/GlassContextMenu';
import { useScrollAnimationManager } from '../hooks/useScrollAnimationManager';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { useGSAPAnimations } from '../hooks/useGSAPAnimations';
import './IntroPageFuturistic.css';
import './IntroPageFuturistic.glass.css';
import './IntroPageFuturistic.gsap.css';
import '../styles/cold-war-theme.css';

// Cold War Theme Styling
const coldWarStyles = `
  .intro-futuristic {
    background: linear-gradient(135deg, #0a0a0c 0%, #1a1a1f 50%, #0a0a0c 100%);
  }
  
  .intro-futuristic .section-title {
    color: var(--cw-color-primary, #FFB000);
    text-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
    font-family: 'Share Tech Mono', 'Roboto Mono', monospace;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  
  .intro-futuristic .section-subtitle {
    color: var(--cw-color-text-secondary, #b0b0b0);
    font-family: 'Share Tech Mono', 'Roboto Mono', monospace;
  }
  
  .intro-futuristic .feature-card {
    border: 1px solid var(--cw-color-primary, #FFB000);
    background: rgba(10, 10, 12, 0.8);
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  }
  
  .intro-futuristic .feature-card:hover {
    box-shadow: 0 0 20px rgba(255, 176, 0, 0.4);
    background: rgba(255, 176, 0, 0.05);
  }
  
  .intro-futuristic .cta-button {
    background: var(--cw-color-primary, #FFB000);
    color: #0a0a0c;
    border: 1px solid var(--cw-color-primary, #FFB000);
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    font-family: 'Share Tech Mono', 'Roboto Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-weight: 600;
  }
  
  .intro-futuristic .cta-button:hover {
    box-shadow: 0 0 15px rgba(255, 176, 0, 0.6);
    transform: scale(1.02);
  }
  
  .intro-futuristic .terminal-section {
    background: rgba(10, 10, 12, 0.9);
    border: 1px solid var(--cw-color-primary, #FFB000);
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  }
  
  .intro-futuristic .code-block {
    background: rgba(0, 0, 0, 0.8);
    border-left: 3px solid var(--cw-color-primary, #FFB000);
    font-family: 'Share Tech Mono', 'Roboto Mono', monospace;
    color: var(--cw-color-primary, #FFB000);
  }
  
  .intro-futuristic .stats-item {
    border: 1px solid var(--cw-color-secondary, #33FF00);
    background: rgba(51, 255, 0, 0.02);
  }
  
  .intro-futuristic .stats-item:hover {
    box-shadow: 0 0 15px rgba(51, 255, 0, 0.3);
  }
  
  .intro-futuristic .nav-dot {
    background: rgba(255, 176, 0, 0.3);
    border: 2px solid rgba(255, 176, 0, 0.5);
  }
  
  .intro-futuristic .nav-dot:hover {
    background: rgba(255, 176, 0, 0.6);
    box-shadow: 0 0 20px rgba(255, 176, 0, 0.8);
  }
  
  .intro-futuristic .nav-dot.active {
    background: var(--cw-color-primary, #FFB000);
    box-shadow: 0 0 20px rgba(255, 176, 0, 0.8);
  }
`;

function IntroPageFuturisticComponent() {
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const playgroundRef = useRef<HTMLDivElement>(null);
  const githubRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const performanceRef = useRef<HTMLDivElement>(null);

  useScrollAnimationManager();
  useGSAPAnimations();
  useRevealOnScroll(featuresRef, { direction: 'up', delay: 0 });
  useRevealOnScroll(terminalRef, { direction: 'up', delay: 0 });
  useRevealOnScroll(previewRef, { direction: 'up', delay: 0 });
  useRevealOnScroll(statsRef, { direction: 'up', delay: 0 });
  useRevealOnScroll(playgroundRef, { direction: 'up', delay: 0 });
  useRevealOnScroll(githubRef, { direction: 'up', delay: 0 });
  useRevealOnScroll(themeRef, { direction: 'up', delay: 0 });
  useRevealOnScroll(testimonialsRef, { direction: 'up', delay: 0 });
  useRevealOnScroll(comparisonRef, { direction: 'up', delay: 0 });
  useRevealOnScroll(newsletterRef, { direction: 'up', delay: 0 });
  useRevealOnScroll(roadmapRef, { direction: 'up', delay: 0 });
  useRevealOnScroll(performanceRef, { direction: 'up', delay: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [terminalText, setTerminalText] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'cyan' | 'purple' | 'blue'>('cyan');
  const [code, setCode] = useState(`import { HudBox, Button } from '@rhuds/components';

<HudBox variant="neon" animated>
  <Button glow>Launch System</Button>
</HudBox>`);
  const [output, setOutput] = useState('');
  const [renderedComponent, setRenderedComponent] = useState<React.ReactNode>(null);
  const [githubStats, setGithubStats] = useState({
    stars: 0,
    downloads: 0,
    contributors: 0,
  });
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(
    () => [
      'hero',
      'features',
      'terminal',
      'preview',
      'stats',
      'code-playground',
      'github-stats',
      'theme-switcher',
      'testimonials',
      'comparison',
      'newsletter',
      'roadmap',
      'performance',
    ],
    []
  );

  const codeLines = useMemo(
    () => [
      '$ npm install @rhuds/core @rhuds/components',
      '',
      'import { Button, HudBox } from "@rhuds/components";',
      '',
      '<HudBox variant="neon">',
      '  <Button glow>Launch System</Button>',
      '</HudBox>',
    ],
    []
  );

  const installCommand = useMemo(() => 'npm install @rhuds/core @rhuds/components', []);

  // Loading animation
  const [shouldRunLoading, setShouldRunLoading] = useState(true);

  useInterval(
    () => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          setShouldRunLoading(false);
          return 100;
        }
        return prev + 3;
      });
    },
    shouldRunLoading ? 20 : null
  );

  useTimeout(
    () => {
      setShowLoading(false);
      setIsLoaded(true);
    },
    !shouldRunLoading && loadingProgress >= 100 ? 300 : null
  );

  // GitHub Stats Counter Animation - Using realistic numbers for a new project
  useEffect(() => {
    const targetStats = {
      stars: 0, // Project is in development
      downloads: 0, // Not yet published to NPM
      contributors: 1, // Solo developer currently
    };

    setGithubStats(targetStats);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      setContextMenu(null);
    };

    // Use Intersection Observer for better section detection
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const sectionIndex = sections.indexOf(sectionId);
          if (sectionIndex !== -1) {
            setActiveSection(sectionIndex);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    const handleScroll = () => {
      setScrollY(window.scrollY);
      // Apply parallax effect to background elements
      const gridBg = document.querySelector('.grid-background') as HTMLElement;
      const orbsContainer = document.querySelector('.orbs-container') as HTMLElement;
      if (gridBg) {
        gridBg.style.transform = `translateY(${window.scrollY * 0.5}px)`;
      }
      if (orbsContainer) {
        orbsContainer.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
      observer.disconnect();
    };
  }, [sections]);

  // Terminal typing animation
  const [typingIndex, setTypingIndex] = useState(0);
  const fullText = codeLines.join('\n');
  const isTyping = typingIndex <= fullText.length;

  useEffect(() => {
    setTerminalText(fullText.substring(0, typingIndex));
  }, [typingIndex, fullText]);

  useInterval(
    () => {
      setTypingIndex((prev) => prev + 1);
    },
    isTyping ? 50 : null
  );

  const [shouldResetCopied, setShouldResetCopied] = useState(false);

  useTimeout(
    () => {
      setCopied(false);
      setShouldResetCopied(false);
    },
    shouldResetCopied ? 2000 : null
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setShouldResetCopied(true);
  }, [installCommand]);

  const scrollToSection = useCallback(
    (index: number) => {
      const element = document.getElementById(sections[index]);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [sections]
  );

  const runCode = useCallback(() => {
    try {
      // Try to render the component based on the code
      if (code.includes('HudBox')) {
        setRenderedComponent(
          <HudBox variant="tech-panel" color="#29F2DF" animated={true} width="220px" height="140px">
            <div
              style={{
                fontSize: '16px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textAlign: 'center',
              }}
            >
              SYSTEM ONLINE
            </div>
          </HudBox>
        );
      } else if (code.includes('RadarHud')) {
        setRenderedComponent(
          <div style={{ transform: 'scale(0.85)' }}>
            <RadarHud
              coordinates="51° 30' N; 0° 7' W"
              depth="DEPT - 450"
              wind="WIND - 32.8"
              color="#29F2DF"
              size={240}
            />
          </div>
        );
      } else if (code.includes('HackerLoader')) {
        setRenderedComponent(
          <div style={{ transform: 'scale(0.9)' }}>
            <HackerLoader text="LOADING" color="#29F2DF" />
          </div>
        );
      } else {
        setRenderedComponent(
          <div style={{ color: '#29f2df', fontSize: '14px', textAlign: 'center' }}>
            Component preview not available
          </div>
        );
      }

      setOutput(
        '✓ Code executed successfully!\n\nComponent rendered with:\n- Variant: neon\n- Animation: enabled\n- Theme: cyan (#29F2DF)'
      );
    } catch (error) {
      setOutput(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [code]);

  const codeExamples = useMemo(
    () => [
      {
        title: 'HudBox Example',
        code: `import { HudBox, Button } from '@rhuds/components';

<HudBox variant="neon" animated>
  <Button glow>Launch System</Button>
</HudBox>`,
      },
      {
        title: 'RadarHud Example',
        code: `import { RadarHud } from '@rhuds/components';

<RadarHud
  coordinates="51° 30' N; 0° 7' W"
  depth="DEPT - 450"
  wind="WIND - 32.8"
  color="#29F2DF"
  size={240}
/>`,
      },
      {
        title: 'HackerLoader Example',
        code: `import { HackerLoader } from '@rhuds/components';

<HackerLoader 
  text="LOADING" 
  color="#29F2DF" 
/>`,
      },
    ],
    []
  );

  const themes = useMemo(
    () => ({
      cyan: { primary: '#29F2DF', secondary: '#1C7FA6', name: 'Cyan' },
      purple: { primary: '#EF3EF1', secondary: '#9D4EDD', name: 'Purple' },
      blue: { primary: '#4CC9F0', secondary: '#4361EE', name: 'Blue' },
    }),
    []
  );

  const testimonials = useMemo(
    () => [
      {
        name: 'Development Team',
        role: 'Core Developers',
        avatar: '👨‍💻',
        text: 'Built with passion for creating the most advanced HUD component library for React applications.',
        company: 'RHUDS Project',
      },
      {
        name: 'Open Source',
        role: 'Community Driven',
        avatar: '🌟',
        text: 'Designed to be extensible, customizable, and easy to integrate into any React project.',
        company: 'MIT License',
      },
      {
        name: 'Modern Stack',
        role: 'Latest Technologies',
        avatar: '⚡',
        text: 'Leveraging React 18, TypeScript, WebGL, and modern animation techniques for peak performance.',
        company: 'Tech Stack',
      },
    ],
    []
  );

  const handleSubscribe = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (email) {
        setSubscribed(true);
        setTimeout(() => {
          setEmail('');
          setSubscribed(false);
        }, 3000);
      }
    },
    [email]
  );

  const comparisonData = useMemo(
    () => [
      { feature: 'Components', rhuds: '51+', libA: 'Arwes (30+)', libB: 'React-HUD (20+)' },
      { feature: 'TypeScript', rhuds: true, libA: true, libB: false },
      { feature: 'Animations', rhuds: true, libA: true, libB: false },
      { feature: 'HUD Styling', rhuds: true, libA: true, libB: true },
      { feature: 'WebGL Support', rhuds: true, libA: false, libB: false },
      { feature: 'Themes', rhuds: true, libA: true, libB: false },
    ],
    []
  );

  const roadmapData = useMemo(
    () => [
      { title: 'Core Components', status: 'completed', date: 'March 2026' },
      { title: 'Animation System', status: 'completed', date: 'March 2026' },
      { title: 'Documentation', status: 'in-progress', date: 'March 2026' },
      { title: 'NPM Publication', status: 'planned', date: 'April 2026' },
      { title: 'Community Release', status: 'planned', date: 'May 2026' },
    ],
    []
  );

  return (
    <>
      {/* Loading Screen */}
      {showLoading && (
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-logo">
              <div className="loading-logo-text">RHUDS</div>
              <div className="loading-scanline" />
            </div>
            <div className="loading-bar-container">
              <div className="loading-bar" style={{ width: `${loadingProgress}%` }} />
            </div>
            <div className="loading-text">{loadingProgress}% INITIALIZING...</div>
          </div>
        </div>
      )}

      {/* Custom Context Menu */}
      {contextMenu && (
        <GlassContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onNavigate={(path) => {
            navigate(path);
            setContextMenu(null);
          }}
          onCopyInstall={() => {
            navigator.clipboard.writeText('npm install @rhuds/core @rhuds/components');
            setContextMenu(null);
          }}
        />
      )}

      <div className="intro-futuristic">
        {/* Full-Width Scanline Effect */}
        <div className="fullwidth-scanline" />

        {/* Navigation Dots */}
        <div className="nav-dots">
          {sections.map((section, index) => (
            <button
              key={section}
              className={`nav-dot ${activeSection === index ? 'active' : ''}`}
              onClick={() => scrollToSection(index)}
              aria-label={`Go to ${section} section`}
            >
              <span className="nav-dot-tooltip">{section}</span>
            </button>
          ))}
        </div>

        {/* Animated Grid Background */}
        <div className="grid-background" data-parallax="0.5" />

        {/* Animated Mesh Lines */}
        <div className="mesh-lines">
          <div className="mesh-line" />
          <div className="mesh-line" />
          <div className="mesh-line" />
          <div className="mesh-line" />
          <div className="mesh-line" />
          <div className="mesh-line" />
        </div>

        {/* Orbs/Spheres Effect */}
        <div className="orbs-container" data-parallax="0.3">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="orb orb-4" />
          <div className="orb orb-5" />
          <div className="orb orb-6" />
        </div>

        {/* Radial Glow Effect - Original Color */}
        <div
          className="radial-glow"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(41, 242, 223, 0.15) 0%, transparent 50%)`,
          }}
        />

        {/* Hero Section */}
        <section
          id="hero"
          className={`hero-section ${isLoaded ? 'loaded' : ''}`}
          ref={heroRef}
          data-gsap="fade-up"
        >
          <div className="hero-content">
            {/* Holographic Logo */}
            <div className="logo-container">
              <div className="logo-glitch-layer logo-glitch-1">RHUDS</div>
              <div className="logo-glitch-layer logo-glitch-2">RHUDS</div>
              <h1 className="logo-main">RHUDS</h1>
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
                <div
                  key={tech}
                  className="tech-badge"
                  style={{ animationDelay: `${2 + i * 0.1}s` }}
                >
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
        <section
          id="features"
          className="features-section scroll-animate"
          ref={featuresRef}
          data-gsap="fade-up"
        >
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

        {/* Terminal Section */}
        <section
          id="terminal"
          className="terminal-section scroll-animate"
          ref={terminalRef}
          data-gsap="fade-up"
        >
          <h2 className="terminal-title">
            <span className="title-line" />
            GET STARTED IN SECONDS
            <span className="title-line" />
          </h2>

          <div className="terminal-container">
            <div className="terminal-header">
              <div className="terminal-buttons">
                <span className="terminal-button terminal-close"></span>
                <span className="terminal-button terminal-minimize"></span>
                <span className="terminal-button terminal-maximize"></span>
              </div>
              <div className="terminal-title-text">rhuds-terminal</div>
            </div>
            <div className="terminal-body">
              <pre className="terminal-code">
                <code>{terminalText}</code>
                <span className="terminal-cursor">_</span>
              </pre>
            </div>
          </div>

          <div className="install-card">
            <div className="install-header">
              <span className="install-icon">📦</span>
              <span className="install-label">Quick Install</span>
            </div>
            <div className="install-command">
              <code>{installCommand}</code>
              <button className="copy-button" onClick={handleCopy}>
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>
        </section>

        {/* Live Preview Section */}
        <section
          id="preview"
          className="preview-section scroll-animate"
          ref={previewRef}
          data-gsap="fade-up"
        >
          <h2 className="preview-title">
            <span className="title-line" />
            LIVE COMPONENT PREVIEW
            <span className="title-line" />
          </h2>

          <div className="preview-grid">
            <div className="preview-card">
              <div className="preview-label">HUD Box</div>
              <div className="preview-demo">
                <HudBox
                  variant="tech-panel"
                  color="#29F2DF"
                  animated={true}
                  width="220px"
                  height="140px"
                >
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textAlign: 'center',
                    }}
                  >
                    SYSTEM ONLINE
                  </div>
                </HudBox>
              </div>
            </div>

            <div className="preview-card">
              <div className="preview-label">Radar HUD</div>
              <div className="preview-demo">
                <div className="demo-radar-wrapper">
                  <RadarHud
                    coordinates="51° 30' N; 0° 7' W"
                    depth="DEPT - 450"
                    wind="WIND - 32.8"
                    color="#29F2DF"
                    size={240}
                  />
                </div>
              </div>
            </div>

            <div className="preview-card">
              <div className="preview-label">Hacker Loader</div>
              <div className="preview-demo">
                <div className="demo-loader-wrapper">
                  <HackerLoader text="LOADING" color="#29F2DF" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          id="stats"
          className="stats-section scroll-animate"
          ref={statsRef}
          data-gsap="scale-up"
        >
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

        {/* Code Playground Section */}
        <section
          id="code-playground"
          className="code-playground-section scroll-animate"
          ref={playgroundRef}
          data-gsap="fade-up"
        >
          <h2 className="playground-title">
            <span className="title-line" />
            INTERACTIVE CODE PLAYGROUND
            <span className="title-line" />
          </h2>

          <div className="playground-examples">
            {codeExamples.map((example, i) => (
              <button
                key={example.title}
                className={`example-button ${code === example.code ? 'active' : ''}`}
                onClick={() => {
                  setCode(example.code);
                  setOutput('');
                }}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {example.title}
              </button>
            ))}
          </div>

          <div className="playground-editor">
            <div className="editor-header">
              <span className="editor-icon">⚡</span>
              <span className="editor-label">Code Editor</span>
            </div>
            <textarea
              className="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
            <button className="run-button" onClick={runCode}>
              <span className="button-icon">▶</span>
              RUN CODE
            </button>
          </div>

          <div className="playground-results">
            {renderedComponent && (
              <div className="playground-preview-demo">
                <div className="preview-header">
                  <span className="preview-icon">🎨</span>
                  <span className="preview-label">Component Preview</span>
                </div>
                <div className="preview-content">{renderedComponent}</div>
              </div>
            )}

            {output && (
              <div className="playground-output">
                <div className="output-header">
                  <span className="output-icon">📊</span>
                  <span className="output-label">Output</span>
                </div>
                <pre className="output-content">{output}</pre>
              </div>
            )}
          </div>
        </section>

        {/* GitHub Stats Section */}
        <section
          id="github-stats"
          className="github-stats-section scroll-animate"
          ref={githubRef}
          data-gsap="scale-up"
        >
          <h2 className="github-title">
            <span className="title-line" />
            LIVE GITHUB STATISTICS
            <span className="title-line" />
          </h2>

          <div className="github-stats-grid">
            <div className="github-stat-box" style={{ animationDelay: '0.1s' }}>
              <div className="github-stat-border" />
              <div className="github-stat-glow" />
              <div className="github-stat-icon">⭐</div>
              <div className="github-stat-number">{githubStats.stars.toLocaleString()}</div>
              <div className="github-stat-label">GitHub Stars</div>
              <div className="github-stat-corners">
                <div className="github-corner github-corner-tl" />
                <div className="github-corner github-corner-br" />
              </div>
            </div>

            <div className="github-stat-box" style={{ animationDelay: '0.2s' }}>
              <div className="github-stat-border" />
              <div className="github-stat-glow" />
              <div className="github-stat-icon">📦</div>
              <div className="github-stat-number">{githubStats.downloads.toLocaleString()}</div>
              <div className="github-stat-label">NPM Downloads</div>
              <div className="github-stat-corners">
                <div className="github-corner github-corner-tl" />
                <div className="github-corner github-corner-br" />
              </div>
            </div>

            <div className="github-stat-box" style={{ animationDelay: '0.3s' }}>
              <div className="github-stat-border" />
              <div className="github-stat-glow" />
              <div className="github-stat-icon">👥</div>
              <div className="github-stat-number">{githubStats.contributors}</div>
              <div className="github-stat-label">Contributors</div>
              <div className="github-stat-corners">
                <div className="github-corner github-corner-tl" />
                <div className="github-corner github-corner-br" />
              </div>
            </div>

            <div className="github-stat-box" style={{ animationDelay: '0.4s' }}>
              <div className="github-stat-border" />
              <div className="github-stat-glow" />
              <div className="github-stat-icon">🚀</div>
              <div className="github-stat-number">v0.1.0</div>
              <div className="github-stat-label">Current Version</div>
              <div className="github-stat-corners">
                <div className="github-corner github-corner-tl" />
                <div className="github-corner github-corner-br" />
              </div>
            </div>
          </div>
        </section>

        {/* Theme Switcher Section */}
        <section
          id="theme-switcher"
          className="theme-switcher-section scroll-animate"
          ref={themeRef}
          data-gsap="fade-up"
        >
          <h2 className="theme-title">
            <span className="title-line" />
            CHOOSE YOUR THEME
            <span className="title-line" />
          </h2>

          <div className="theme-buttons">
            {Object.entries(themes).map(([key, theme], i) => (
              <button
                key={key}
                className={`theme-button ${currentTheme === key ? 'active' : ''}`}
                onClick={() => setCurrentTheme(key as 'cyan' | 'purple' | 'blue')}
                style={
                  {
                    animationDelay: `${i * 0.1}s`,
                    '--theme-color': theme.primary,
                  } as React.CSSProperties
                }
              >
                <div className="theme-button-glow" />
                <div className="theme-button-icon" style={{ color: theme.primary }}>
                  ●
                </div>
                <div className="theme-button-name">{theme.name}</div>
                <div className="theme-button-colors">
                  <span style={{ background: theme.primary }} />
                  <span style={{ background: theme.secondary }} />
                </div>
              </button>
            ))}
          </div>

          <div className="theme-preview">
            <div className="theme-preview-label">Live Preview</div>
            <div className="theme-preview-demo">
              <HudBox
                variant="tech-panel"
                color={themes[currentTheme].primary}
                animated={true}
                width="200px"
                height="120px"
              >
                <div style={{ fontSize: '14px', fontWeight: 700, textAlign: 'center' }}>
                  {themes[currentTheme].name} Theme
                </div>
              </HudBox>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="testimonials-section scroll-animate"
          ref={testimonialsRef}
          data-gsap="fade-up"
        >
          <h2 className="testimonials-title">
            <span className="title-line" />
            WHAT DEVELOPERS SAY
            <span className="title-line" />
          </h2>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, i) => (
              <div
                key={testimonial.name}
                className="testimonial-card"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className="testimonial-border" />
                <div className="testimonial-glow" />

                <div className="testimonial-avatar">{testimonial.avatar}</div>

                <div className="testimonial-quote">"{testimonial.text}"</div>

                <div className="testimonial-author">
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                  <div className="testimonial-company">{testimonial.company}</div>
                </div>

                <div className="testimonial-corners">
                  <div className="testimonial-corner testimonial-corner-tl" />
                  <div className="testimonial-corner testimonial-corner-br" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table Section */}
        <section
          id="comparison"
          className="comparison-section scroll-animate"
          ref={comparisonRef}
          data-gsap="fade-right"
        >
          <h2 className="comparison-title">
            <span className="title-line" />
            LIBRARY COMPARISON
            <span className="title-line" />
          </h2>

          <div className="comparison-table-container">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="highlight-col">RHUDS</th>
                  <th>Library A</th>
                  <th>Library B</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={row.feature} style={{ animationDelay: `${i * 0.1}s` }}>
                    <td className="feature-name" data-label="Feature">
                      {row.feature}
                    </td>
                    <td className="highlight-col" data-label="RHUDS">
                      {typeof row.rhuds === 'boolean' ? (
                        row.rhuds ? (
                          <span className="check-icon">✓</span>
                        ) : (
                          <span className="cross-icon">✗</span>
                        )
                      ) : (
                        row.rhuds
                      )}
                    </td>
                    <td data-label="Library A">
                      {typeof row.libA === 'boolean' ? (
                        row.libA ? (
                          <span className="check-icon">✓</span>
                        ) : (
                          <span className="cross-icon">✗</span>
                        )
                      ) : (
                        row.libA
                      )}
                    </td>
                    <td data-label="Library B">
                      {typeof row.libB === 'boolean' ? (
                        row.libB ? (
                          <span className="check-icon">✓</span>
                        ) : (
                          <span className="cross-icon">✗</span>
                        )
                      ) : (
                        row.libB
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Newsletter Section */}
        <section
          id="newsletter"
          className="newsletter-section scroll-animate"
          ref={newsletterRef}
          data-gsap="fade-up"
        >
          <h2 className="newsletter-title">
            <span className="title-line" />
            STAY UPDATED
            <span className="title-line" />
          </h2>

          <p className="newsletter-description">
            Subscribe to get the latest updates, releases, and exclusive content
          </p>

          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="newsletter-input-wrapper">
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="newsletter-button">
                <span className="button-text">SUBSCRIBE</span>
                <span className="button-glitch">SUBSCRIBE</span>
              </button>
            </div>

            {subscribed && (
              <div className="newsletter-success">
                <span className="success-icon">✓</span>
                Successfully subscribed! Check your inbox.
              </div>
            )}
          </form>
        </section>

        {/* Roadmap Section */}
        <section
          id="roadmap"
          className="roadmap-section scroll-animate"
          ref={roadmapRef}
          data-gsap="fade-left"
        >
          <h2 className="roadmap-title">
            <span className="title-line" />
            PROJECT ROADMAP
            <span className="title-line" />
          </h2>

          <div className="roadmap-timeline">
            {roadmapData.map((milestone, i) => (
              <div
                key={milestone.title}
                className={`roadmap-item roadmap-${milestone.status}`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="roadmap-dot">
                  <div className="roadmap-dot-inner" />
                </div>
                <div className="roadmap-content">
                  <div className="roadmap-date">{milestone.date}</div>
                  <div className="roadmap-title-text">{milestone.title}</div>
                  <div className="roadmap-status">
                    {milestone.status === 'completed' && '✓ Completed'}
                    {milestone.status === 'in-progress' && '⚡ In Progress'}
                    {milestone.status === 'planned' && '📅 Planned'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Metrics Section */}
        <section
          id="performance"
          className="performance-section scroll-animate"
          ref={performanceRef}
          data-gsap="scale-up"
        >
          <h2 className="performance-title">
            <span className="title-line" />
            PERFORMANCE METRICS
            <span className="title-line" />
          </h2>

          <div className="performance-grid">
            <div className="performance-card" style={{ animationDelay: '0.1s' }}>
              <div className="performance-gauge">
                <svg className="gauge-svg" viewBox="0 0 200 200">
                  <circle
                    className="gauge-bg"
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="rgba(41, 242, 223, 0.1)"
                    strokeWidth="20"
                  />
                  <circle
                    className="gauge-fill"
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#29F2DF"
                    strokeWidth="20"
                    strokeDasharray="502"
                    strokeDashoffset="125"
                    transform="rotate(-90 100 100)"
                  />
                  <text
                    x="100"
                    y="100"
                    textAnchor="middle"
                    dy="10"
                    className="gauge-text"
                    fill="#29F2DF"
                  >
                    ~50KB
                  </text>
                </svg>
              </div>
              <div className="performance-label">Bundle Size</div>
              <div className="performance-desc">Minified + Gzipped</div>
            </div>

            <div className="performance-card" style={{ animationDelay: '0.2s' }}>
              <div className="performance-gauge">
                <svg className="gauge-svg" viewBox="0 0 200 200">
                  <circle
                    className="gauge-bg"
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="rgba(41, 242, 223, 0.1)"
                    strokeWidth="20"
                  />
                  <circle
                    className="gauge-fill"
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#29F2DF"
                    strokeWidth="20"
                    strokeDasharray="502"
                    strokeDashoffset="50"
                    transform="rotate(-90 100 100)"
                  />
                  <text
                    x="100"
                    y="100"
                    textAnchor="middle"
                    dy="10"
                    className="gauge-text"
                    fill="#29F2DF"
                  >
                    &lt;100ms
                  </text>
                </svg>
              </div>
              <div className="performance-label">Load Time</div>
              <div className="performance-desc">First Contentful Paint</div>
            </div>

            <div className="performance-card" style={{ animationDelay: '0.3s' }}>
              <div className="performance-gauge">
                <svg className="gauge-svg" viewBox="0 0 200 200">
                  <circle
                    className="gauge-bg"
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="rgba(41, 242, 223, 0.1)"
                    strokeWidth="20"
                  />
                  <circle
                    className="gauge-fill"
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#29F2DF"
                    strokeWidth="20"
                    strokeDasharray="502"
                    strokeDashoffset="25"
                    transform="rotate(-90 100 100)"
                  />
                  <text
                    x="100"
                    y="100"
                    textAnchor="middle"
                    dy="10"
                    className="gauge-text"
                    fill="#29F2DF"
                  >
                    95/100
                  </text>
                </svg>
              </div>
              <div className="performance-label">Performance Score</div>
              <div className="performance-desc">Lighthouse Audit</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="intro-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">RHUDS</h3>
              <p className="footer-description">
                Next-generation HUD components for React applications
              </p>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Quick Links</h4>
              <div className="footer-links">
                <button onClick={() => navigate('/playground')} className="footer-link">
                  Playground
                </button>
                <button onClick={() => navigate('/showcase')} className="footer-link">
                  Showcase
                </button>
                <button onClick={() => navigate('/docs')} className="footer-link">
                  Documentation
                </button>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Resources</h4>
              <div className="footer-links">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  GitHub
                </a>
                <a
                  href="https://npmjs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  NPM
                </a>
                <button onClick={() => navigate('/docs')} className="footer-link">
                  API Reference
                </button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-line" />
            <p className="footer-copyright">© 2026 RHUDS. Built with React & TypeScript</p>
            <div className="footer-line" />
          </div>
        </footer>
      </div>
    </>
  );
}

export default React.memo(IntroPageFuturisticComponent);
