import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColdWarButton, ColdWarCard, ColdWarInput } from '@rhuds/components';
import { TacticalMotionBackground } from '../components/TacticalMotionBackground';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ColdWarContextMenu } from '../components/ColdWarContextMenu';
import { useColdWarContextMenu } from '../hooks/useColdWarContextMenu';
import '../styles/cold-war-theme.css';

// Add keyframes for animations
const styles = `
  html {
    scroll-behavior: smooth;
  }

  @keyframes glow {
    0%, 100% {
      text-shadow: 0 0 40px rgba(255, 176, 0, 0.8), 0 0 80px rgba(255, 176, 0, 0.4);
    }
    50% {
      text-shadow: 0 0 60px rgba(255, 176, 0, 1), 0 0 100px rgba(255, 176, 0, 0.6);
    }
  }

  @keyframes scroll {
    0% {
      transform: translateY(0);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateY(20px);
      opacity: 0;
    }
  }

  @keyframes blink {
    0%, 50% {
      opacity: 1;
    }
    51%, 100% {
      opacity: 0;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .scroll-animate {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  }

  .scroll-animate.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .scroll-animate-fast {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }

  .scroll-animate-fast.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .animate-title {
    animation: fadeInDown 1s ease-out 0.2s both;
  }

  .animate-subtitle {
    animation: fadeInUp 1s ease-out 0.4s both;
  }

  .animate-description {
    animation: fadeInUp 1s ease-out 0.6s both;
  }

  .animate-buttons {
    animation: fadeInUp 1s ease-out 0.8s both;
  }

  .animate-badges {
    animation: fadeInUp 1s ease-out 1s both;
  }

  .animate-scroll-indicator {
    animation: fadeIn 1s ease-out 1.2s both;
  }

  .animate-card {
    animation: scaleIn 0.6s ease-out both;
  }

  .animate-card:nth-child(1) { animation-delay: 0.1s; }
  .animate-card:nth-child(2) { animation-delay: 0.2s; }
  .animate-card:nth-child(3) { animation-delay: 0.3s; }
  .animate-card:nth-child(4) { animation-delay: 0.4s; }
  .animate-card:nth-child(5) { animation-delay: 0.5s; }
  .animate-card:nth-child(6) { animation-delay: 0.6s; }

  .animate-terminal {
    animation: slideInLeft 0.8s ease-out 0.2s both;
  }

  .animate-install-box {
    animation: slideInRight 0.8s ease-out 0.4s both;
  }

  .animate-component-demo {
    animation: scaleIn 0.6s ease-out both;
  }

  .animate-component-demo:nth-child(1) { animation-delay: 0.2s; }
  .animate-component-demo:nth-child(2) { animation-delay: 0.4s; }
  .animate-component-demo:nth-child(3) { animation-delay: 0.6s; }

  .animate-stat {
    animation: scaleIn 0.5s ease-out both;
  }

  .animate-stat:nth-child(1) { animation-delay: 0.1s; }
  .animate-stat:nth-child(2) { animation-delay: 0.2s; }
  .animate-stat:nth-child(3) { animation-delay: 0.3s; }
  .animate-stat:nth-child(4) { animation-delay: 0.4s; }

  .animate-roadmap-item {
    animation: slideInLeft 0.6s ease-out both;
  }

  .animate-roadmap-item:nth-child(1) { animation-delay: 0.1s; }
  .animate-roadmap-item:nth-child(2) { animation-delay: 0.2s; }
  .animate-roadmap-item:nth-child(3) { animation-delay: 0.3s; }
  .animate-roadmap-item:nth-child(4) { animation-delay: 0.4s; }
  .animate-roadmap-item:nth-child(5) { animation-delay: 0.5s; }

  /* Navigation Dots Animations */
  @keyframes liquidFlow {
    0% {
      transform: translateY(-100%) scaleY(1.5);
      opacity: 0;
      border-radius: 50% 50% 30% 30%;
    }
    30% {
      opacity: 1;
      border-radius: 50% 50% 40% 40%;
    }
    50% {
      transform: translateY(0) scaleY(1);
      border-radius: 50%;
    }
    70% {
      transform: translateY(10%) scaleY(0.9);
      border-radius: 50% 50% 55% 55%;
    }
    85% {
      transform: translateY(5%) scaleY(0.95);
    }
    100% {
      transform: translateY(0) scaleY(1);
      border-radius: 50%;
      opacity: 1;
    }
  }

  @keyframes morphDot {
    0%, 100% {
      border-radius: 50%;
    }
    25% {
      border-radius: 50% 50% 40% 40%;
    }
    50% {
      border-radius: 40% 40% 50% 50%;
    }
    75% {
      border-radius: 50% 50% 40% 40%;
    }
  }

  @keyframes ripple {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.8);
      opacity: 0;
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.5;
    }
  }

  .nav-dot {
    position: relative;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: visible;
  }

  .nav-dot::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 120%;
    border-radius: 50%;
    border: 2px solid var(--cw-color-primary);
    opacity: 0;
  }

  .nav-dot::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 140%;
    height: 140%;
    border-radius: 50%;
    background: var(--cw-color-primary);
    opacity: 0;
    z-index: -1;
  }

  .nav-dot.active {
    animation: liquidFlow 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), morphDot 4s ease-in-out infinite 0.8s;
  }

  .nav-dot.active::before {
    animation: ripple 2s ease-out infinite;
  }

  .nav-dot.active::after {
    animation: pulse 2.5s ease-in-out infinite;
  }

  .nav-dot:hover {
    transform: scale(1.4);
  }

  .nav-dot:hover::before {
    opacity: 0.6;
    animation: ripple 1.2s ease-out infinite;
  }

  .nav-dot:hover::after {
    animation: pulse 1.8s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    
    .scroll-animate,
    .scroll-animate-fast {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }

  /* Navbar Styles */
  .coldwar-navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: linear-gradient(180deg, rgba(10, 10, 12, 0.98) 0%, rgba(10, 10, 12, 0.95) 100%);
    backdrop-filter: blur(12px);
    border-bottom: 2px solid rgba(255, 176, 0, 0.25);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 176, 0, 0.1);
    padding: 0.8rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: fadeInDown 0.6s ease-out;
  }

  .navbar-logo {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--cw-color-primary);
    text-shadow: 0 0 12px rgba(255, 176, 0, 0.6);
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    background: none;
    border: none;
    padding: 0.4rem 0.8rem;
  }

  .navbar-logo:hover {
    color: #FFD700;
    text-shadow: 0 0 20px rgba(255, 176, 0, 0.9);
  }

  .navbar-center {
    display: flex;
    gap: 0.8rem;
    align-items: center;
  }

  .navbar-link {
    padding: 0.6rem 1.2rem;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border: 1px solid rgba(255, 176, 0, 0.4);
    background: rgba(10, 10, 12, 0.6);
    color: #D4A574;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    clip-path: polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px);
    font-family: 'Share Tech Mono', monospace;
  }

  .navbar-link:hover {
    border-color: var(--cw-color-primary);
    color: var(--cw-color-primary);
    background: rgba(255, 176, 0, 0.2);
    box-shadow: 0 0 20px rgba(255, 176, 0, 0.5), inset 0 0 15px rgba(255, 176, 0, 0.15);
    text-shadow: 0 0 10px rgba(255, 176, 0, 0.8);
  }

  .navbar-link.active {
    border-color: var(--cw-color-primary);
    background: rgba(255, 176, 0, 0.15);
    color: var(--cw-color-primary);
    text-shadow: 0 0 8px rgba(255, 176, 0, 0.6);
    box-shadow: 0 0 15px rgba(255, 176, 0, 0.4), inset 0 0 10px rgba(255, 176, 0, 0.1);
  }

  @media (max-width: 768px) {
    .coldwar-navbar {
      padding: 0.6rem 1rem;
      flex-wrap: wrap;
    }

    .navbar-center {
      order: 3;
      width: 100%;
      margin-top: 0.5rem;
      justify-content: center;
    }

    .navbar-link {
      padding: 0.5rem 0.8rem;
      font-size: 10px;
    }
  }
`;

export const ColdWarIntro: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [previousSection, setPreviousSection] = useState(0);
  const [terminalText, setTerminalText] = useState('');
  const { contextMenu, handleContextMenu, handleCloseContextMenu } = useColdWarContextMenu();

  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const installRef = useRef<HTMLDivElement>(null);
  const componentsRef = useRef<HTMLDivElement>(null);
  const themesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);

  // Apply scroll animations to sections
  useScrollAnimation(heroRef, { threshold: 0.2, triggerOnce: true });
  useScrollAnimation(featuresRef, { threshold: 0.1, triggerOnce: true });
  useScrollAnimation(installRef, { threshold: 0.1, triggerOnce: true });
  useScrollAnimation(componentsRef, { threshold: 0.1, triggerOnce: true });
  useScrollAnimation(themesRef, { threshold: 0.1, triggerOnce: true });
  useScrollAnimation(statsRef, { threshold: 0.1, triggerOnce: true });
  useScrollAnimation(roadmapRef, { threshold: 0.1, triggerOnce: true });
  useScrollAnimation(newsletterRef, { threshold: 0.1, triggerOnce: true });

  const sections = [
    'hero',
    'features',
    'install',
    'components',
    'themes',
    'stats',
    'roadmap',
    'newsletter',
  ];

  const installCommand = 'npm install @rhuds/core @rhuds/components';

  const codeLines = [
    '$ npm install @rhuds/core @rhuds/components',
    '',
    'import { ColdWarButton, ColdWarCard } from "@rhuds/components";',
    '',
    '<div data-theme="perseus">',
    '  <ColdWarButton theme="perseus" variant="primary">',
    '    TACTICAL BUTTON',
    '  </ColdWarButton>',
    '</div>',
  ];

  // Terminal typing animation
  useEffect(() => {
    const fullText = codeLines.join('\n');
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTerminalText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Section observer
  useEffect(() => {
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
          if (sectionIndex !== -1 && sectionIndex !== activeSection) {
            setPreviousSection(activeSection);
            setActiveSection(sectionIndex);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  const scrollToSection = (index: number) => {
    const element = document.getElementById(sections[index]);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const roadmapData = [
    { title: 'Core Components', status: 'completed', date: 'March 2026' },
    { title: 'Theme System', status: 'completed', date: 'March 2026' },
    { title: 'Documentation', status: 'in-progress', date: 'March 2026' },
    { title: 'NPM Publication', status: 'planned', date: 'April 2026' },
    { title: 'Community Release', status: 'planned', date: 'May 2026' },
  ];

  return (
    <>
      <style>{styles}</style>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--cw-color-background)',
          color: 'var(--cw-color-text)',
          fontFamily: 'var(--cw-font-family)',
          position: 'relative',
          overflow: 'hidden',
        }}
        data-theme="perseus"
        onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => {
          e.preventDefault();
          handleContextMenu(e);
        }}
      >
        <TacticalMotionBackground variant="perimeter" />
        {contextMenu && (
          <ColdWarContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={handleCloseContextMenu}
          />
        )}

        {/* Navigation Dots */}
        <div
          style={{
            position: 'fixed',
            right: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {sections.map((section, index) => (
            <button
              key={section}
              onClick={() => scrollToSection(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: `2px solid ${activeSection === index ? 'var(--cw-color-primary)' : 'rgba(255, 176, 0, 0.3)'}`,
                background: activeSection === index ? 'var(--cw-color-primary)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeSection === index ? '0 0 10px var(--cw-color-primary)' : 'none',
              }}
              aria-label={`Go to ${section} section`}
            />
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header - Hero Section */}
          <section
            id="hero"
            ref={heroRef}
            className="scroll-animate"
            style={{
              textAlign: 'center',
              padding: '6rem 2rem 4rem',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h1
              className="animate-title"
              style={{
                fontSize: 'clamp(3rem, 10vw, 6rem)',
                fontWeight: 700,
                color: 'var(--cw-color-primary)',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: 'var(--cw-letter-spacing-headers)',
                textShadow: '0 0 40px rgba(255, 176, 0, 0.8), 0 0 80px rgba(255, 176, 0, 0.4)',
                animation: 'glow 2s ease-in-out infinite alternate',
              }}
            >
              COLD WAR HUD
            </h1>
            <div
              className="animate-subtitle"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{ height: '2px', width: '60px', background: 'var(--cw-color-primary)' }}
              />
              <p
                style={{
                  fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                  color: 'var(--cw-color-text-secondary)',
                  letterSpacing: 'var(--cw-letter-spacing-body)',
                  textTransform: 'uppercase',
                }}
              >
                TACTICAL MILITARY INTERFACE DESIGN SYSTEM
              </p>
              <div
                style={{ height: '2px', width: '60px', background: 'var(--cw-color-primary)' }}
              />
            </div>

            <p
              className="animate-description"
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: 'var(--cw-color-text-tertiary)',
                marginBottom: '3rem',
                maxWidth: '800px',
                lineHeight: 1.8,
              }}
            >
              Experience authentic military command interface aesthetics with{' '}
              <span style={{ color: 'var(--cw-color-primary)', fontWeight: 700 }}>
                chamfered corners
              </span>
              ,{' '}
              <span style={{ color: 'var(--cw-color-secondary)', fontWeight: 700 }}>
                tactical colors
              </span>
              , and{' '}
              <span style={{ color: 'var(--cw-color-accent)', fontWeight: 700 }}>HUD elements</span>
            </p>

            <div
              className="animate-buttons"
              style={{
                display: 'flex',
                gap: '1.5rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '3rem',
              }}
            >
              <ColdWarButton
                theme="perseus"
                variant="primary"
                size="lg"
                onClick={() => navigate('/coldwar-showcase')}
                glow
              >
                VIEW SHOWCASE
              </ColdWarButton>
              <ColdWarButton
                theme="perseus"
                variant="secondary"
                size="lg"
                onClick={() => navigate('/coldwar-playground')}
              >
                PLAYGROUND
              </ColdWarButton>
              <ColdWarButton
                theme="perseus"
                variant="tactical"
                size="lg"
                onClick={() => navigate('/coldwar-docs')}
              >
                DOCUMENTATION
              </ColdWarButton>
              <ColdWarButton
                theme="perseus"
                variant="primary"
                size="lg"
                onClick={() => navigate('/coldwar-portfolio')}
              >
                PORTFOLIO
              </ColdWarButton>
            </div>

            {/* Tech Stack Badges */}
            <div
              className="animate-badges"
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {['React 18', 'TypeScript', 'Military HUD', 'Tactical UI', '3 Themes'].map((tech) => (
                <div
                  key={tech}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 176, 0, 0.1)',
                    border: '1px solid rgba(255, 176, 0, 0.3)',
                    clipPath:
                      'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
                    fontSize: 'var(--cw-font-size-xs)',
                    color: 'var(--cw-color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div
              className="animate-scroll-indicator"
              style={{
                marginTop: 'auto',
                paddingTop: '4rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: 0.6,
              }}
            >
              <div
                style={{
                  width: '2px',
                  height: '40px',
                  background: 'linear-gradient(to bottom, transparent, var(--cw-color-primary))',
                  animation: 'scroll 2s ease-in-out infinite',
                }}
              />
              <span style={{ fontSize: 'var(--cw-font-size-xs)', letterSpacing: '0.1em' }}>
                SCROLL
              </span>
            </div>
          </section>

          {/* Features Grid */}
          <section
            id="features"
            ref={featuresRef}
            className="scroll-animate"
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              width: '100%',
              padding: '6rem 2rem',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '4rem',
              }}
            >
              <div
                style={{ height: '2px', width: '80px', background: 'var(--cw-color-primary)' }}
              />
              <h2
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 700,
                  color: 'var(--cw-color-primary)',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--cw-letter-spacing-headers)',
                  margin: 0,
                }}
              >
                TACTICAL FEATURES
              </h2>
              <div
                style={{ height: '2px', width: '80px', background: 'var(--cw-color-primary)' }}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
              }}
            >
              <ColdWarCard
                className="animate-card"
                theme="perseus"
                variant="tactical"
                color="amber"
                header="MILITARY AESTHETICS"
                glow
                scanlines
              >
                <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)', lineHeight: 1.8 }}>
                  Inspired by military command interfaces with chamfered corners, tactical colors,
                  and authentic HUD elements for maximum operational efficiency.
                </p>
              </ColdWarCard>

              <ColdWarCard
                className="animate-card"
                theme="perseus"
                variant="tactical"
                color="green"
                header="THREE TACTICAL THEMES"
                glow
                scanlines
              >
                <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)', lineHeight: 1.8 }}>
                  Perseus (Amber), Green Terminal, and Satellite View themes designed for different
                  tactical scenarios and mission requirements.
                </p>
              </ColdWarCard>

              <ColdWarCard
                className="animate-card"
                theme="perseus"
                variant="tactical"
                color="blue"
                header="TACTICAL COMPONENTS"
                glow
                scanlines
              >
                <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)', lineHeight: 1.8 }}>
                  Buttons, inputs, cards with military-grade styling, scanlines, glow effects, and
                  chamfered corners for authentic HUD experience.
                </p>
              </ColdWarCard>

              <ColdWarCard
                className="animate-card"
                theme="perseus"
                variant="glass"
                color="amber"
                header="MOTION BACKGROUNDS"
                glow
              >
                <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)', lineHeight: 1.8 }}>
                  Animated tactical backgrounds with grid patterns, data streams, satellite imagery,
                  and perimeter security visualizations.
                </p>
              </ColdWarCard>

              <ColdWarCard
                className="animate-card"
                theme="perseus"
                variant="glass"
                color="green"
                header="MONOSPACE TYPOGRAPHY"
                glow
              >
                <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)', lineHeight: 1.8 }}>
                  Share Tech Mono font for authentic military terminal aesthetics with proper letter
                  spacing and tactical readability.
                </p>
              </ColdWarCard>

              <ColdWarCard
                className="animate-card"
                theme="perseus"
                variant="glass"
                color="blue"
                header="RESPONSIVE DESIGN"
                glow
              >
                <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)', lineHeight: 1.8 }}>
                  Fully responsive components that work seamlessly across all device sizes,
                  orientations, and tactical deployment scenarios.
                </p>
              </ColdWarCard>
            </div>
          </section>

          {/* Installation / Terminal Section */}
          <section
            id="install"
            ref={installRef}
            className="scroll-animate"
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%',
              padding: '6rem 2rem',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '4rem',
              }}
            >
              <div
                style={{ height: '2px', width: '80px', background: 'var(--cw-color-primary)' }}
              />
              <h2
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 700,
                  color: 'var(--cw-color-primary)',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--cw-letter-spacing-headers)',
                  margin: 0,
                }}
              >
                DEPLOY IN SECONDS
              </h2>
              <div
                style={{ height: '2px', width: '80px', background: 'var(--cw-color-primary)' }}
              />
            </div>

            {/* Terminal */}
            <div
              className="animate-terminal"
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid var(--cw-color-primary)',
                clipPath: 'var(--cw-chamfer-medium)',
                marginBottom: '2rem',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '0.8rem 1.5rem',
                  background: 'rgba(255, 176, 0, 0.1)',
                  borderBottom: '1px solid var(--cw-color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#ff5f56',
                    }}
                  />
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#ffbd2e',
                    }}
                  />
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#27c93f',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 'var(--cw-font-size-sm)',
                    color: 'var(--cw-color-text-secondary)',
                    marginLeft: 'auto',
                  }}
                >
                  tactical-terminal
                </span>
              </div>
              <div style={{ padding: '2rem' }}>
                <pre
                  style={{
                    margin: 0,
                    fontFamily: 'var(--cw-font-family)',
                    fontSize: 'var(--cw-font-size-sm)',
                    color: 'var(--cw-color-primary)',
                    lineHeight: 1.8,
                  }}
                >
                  <code>{terminalText}</code>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '16px',
                      background: 'var(--cw-color-primary)',
                      marginLeft: '4px',
                      animation: 'blink 1s step-end infinite',
                    }}
                  />
                </pre>
              </div>
            </div>

            {/* Install Command */}
            <div
              className="animate-install-box"
              style={{
                padding: '2rem',
                background: 'var(--cw-color-surface)',
                border: '1px solid var(--cw-color-secondary)',
                clipPath: 'var(--cw-chamfer-small)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <span style={{ fontSize: '1.5rem' }}>📦</span>
                <code
                  style={{
                    fontFamily: 'var(--cw-font-family)',
                    fontSize: 'var(--cw-font-size-sm)',
                    color: 'var(--cw-color-primary)',
                  }}
                >
                  {installCommand}
                </code>
              </div>
              <ColdWarButton theme="perseus" variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? '✓ COPIED!' : '📋 COPY'}
              </ColdWarButton>
            </div>
          </section>

          {/* Components Preview Section */}
          <section
            id="components"
            ref={componentsRef}
            className="scroll-animate"
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              width: '100%',
              padding: '6rem 2rem',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '4rem',
              }}
            >
              <div
                style={{ height: '2px', width: '80px', background: 'var(--cw-color-primary)' }}
              />
              <h2
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 700,
                  color: 'var(--cw-color-primary)',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--cw-letter-spacing-headers)',
                  margin: 0,
                }}
              >
                COMPONENT ARSENAL
              </h2>
              <div
                style={{ height: '2px', width: '80px', background: 'var(--cw-color-primary)' }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem',
              }}
            >
              {/* Button Demo */}
              <div
                className="animate-component-demo"
                style={{
                  padding: '2rem',
                  background: 'rgba(255, 176, 0, 0.05)',
                  border: '1px solid rgba(255, 176, 0, 0.3)',
                  clipPath: 'var(--cw-chamfer-medium)',
                }}
              >
                <h3
                  style={{
                    fontSize: 'var(--cw-font-size-lg)',
                    color: 'var(--cw-color-primary)',
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  ▸ TACTICAL BUTTONS
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <ColdWarButton theme="perseus" variant="primary" glow>
                    PRIMARY MISSION
                  </ColdWarButton>
                  <ColdWarButton theme="perseus" variant="secondary">
                    SECONDARY OBJECTIVE
                  </ColdWarButton>
                  <ColdWarButton theme="perseus" variant="tactical">
                    TACTICAL OPERATION
                  </ColdWarButton>
                </div>
              </div>

              {/* Input Demo */}
              <div
                className="animate-component-demo"
                style={{
                  padding: '2rem',
                  background: 'rgba(51, 255, 0, 0.05)',
                  border: '1px solid rgba(51, 255, 0, 0.3)',
                  clipPath: 'var(--cw-chamfer-medium)',
                }}
              >
                <h3
                  style={{
                    fontSize: 'var(--cw-font-size-lg)',
                    color: 'var(--cw-color-secondary)',
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  ▸ TACTICAL INPUTS
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <ColdWarInput theme="perseus" placeholder="ENTER COORDINATES" glow />
                  <ColdWarInput theme="perseus" placeholder="MISSION CODE" type="password" />
                </div>
              </div>

              {/* Card Demo */}
              <div
                className="animate-component-demo"
                style={{
                  padding: '2rem',
                  background: 'rgba(0, 174, 255, 0.05)',
                  border: '1px solid rgba(0, 174, 255, 0.3)',
                  clipPath: 'var(--cw-chamfer-medium)',
                }}
              >
                <h3
                  style={{
                    fontSize: 'var(--cw-font-size-lg)',
                    color: 'var(--cw-color-accent)',
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  ▸ TACTICAL CARDS
                </h3>
                <ColdWarCard
                  theme="perseus"
                  variant="tactical"
                  color="blue"
                  header="MISSION STATUS"
                  glow
                  scanlines
                >
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    All systems operational. Ready for deployment.
                  </p>
                </ColdWarCard>
              </div>
            </div>
          </section>

          {/* Themes Section */}
          <section
            id="themes"
            ref={themesRef}
            className="scroll-animate"
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%',
              padding: '6rem 2rem',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '4rem',
              }}
            >
              <div
                style={{ height: '2px', width: '80px', background: 'var(--cw-color-primary)' }}
              />
              <h2
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 700,
                  color: 'var(--cw-color-primary)',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--cw-letter-spacing-headers)',
                  margin: 0,
                }}
              >
                THREE TACTICAL THEMES
              </h2>
              <div
                style={{ height: '2px', width: '80px', background: 'var(--cw-color-primary)' }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              }}
            >
              <ColdWarCard
                theme="perseus"
                variant="tactical"
                color="amber"
                header="PERSEUS (AMBER)"
                glow
                scanlines
              >
                <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)', lineHeight: 1.8 }}>
                  Classic military HUD with amber displays. Perfect for command centers and tactical
                  operations.
                </p>
              </ColdWarCard>

              <ColdWarCard
                theme="perseus"
                variant="tactical"
                color="green"
                header="GREEN TERMINAL"
                glow
                scanlines
              >
                <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)', lineHeight: 1.8 }}>
                  Retro terminal aesthetic with green phosphor displays. Ideal for data analysis and
                  monitoring.
                </p>
              </ColdWarCard>

              <ColdWarCard
                theme="perseus"
                variant="tactical"
                color="blue"
                header="SATELLITE VIEW"
                glow
                scanlines
              >
                <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)', lineHeight: 1.8 }}>
                  Modern satellite interface with blue accents. Designed for reconnaissance and
                  surveillance.
                </p>
              </ColdWarCard>
            </div>
          </section>

          {/* Stats Section */}
          <section
            id="stats"
            ref={statsRef}
            className="scroll-animate"
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%',
              padding: '6rem 2rem',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem',
              }}
            >
              {[
                { value: '15+', label: 'Components', icon: '⚡' },
                { value: '3', label: 'Themes', icon: '🎨' },
                { value: '100%', label: 'TypeScript', icon: '🔷' },
                { value: '∞', label: 'Tactical Ops', icon: '🎯' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="animate-stat"
                  style={{
                    padding: '2rem',
                    background: 'rgba(255, 176, 0, 0.05)',
                    border: '1px solid rgba(255, 176, 0, 0.3)',
                    clipPath: 'var(--cw-chamfer-medium)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      fontSize: '3rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(2rem, 4vw, 3rem)',
                      fontWeight: 700,
                      color: 'var(--cw-color-primary)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--cw-font-size-sm)',
                      color: 'var(--cw-color-text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Roadmap Section */}
          <section
            id="roadmap"
            ref={roadmapRef}
            className="scroll-animate"
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              width: '100%',
              padding: '6rem 2rem',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '4rem',
              }}
            >
              <div
                style={{ height: '2px', width: '80px', background: 'var(--cw-color-primary)' }}
              />
              <h2
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 700,
                  color: 'var(--cw-color-primary)',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--cw-letter-spacing-headers)',
                  margin: 0,
                }}
              >
                MISSION ROADMAP
              </h2>
              <div
                style={{ height: '2px', width: '80px', background: 'var(--cw-color-primary)' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              {/* Timeline Line */}
              <div
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  background: 'rgba(255, 176, 0, 0.3)',
                }}
              />

              {roadmapData.map((milestone, index) => (
                <div
                  key={milestone.title}
                  className="animate-roadmap-item"
                  style={{
                    position: 'relative',
                    paddingLeft: '60px',
                    marginBottom: '3rem',
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '8px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background:
                        milestone.status === 'completed'
                          ? 'var(--cw-color-secondary)'
                          : milestone.status === 'in-progress'
                            ? 'var(--cw-color-primary)'
                            : 'rgba(255, 176, 0, 0.3)',
                      border: '2px solid var(--cw-color-background)',
                      boxShadow:
                        milestone.status !== 'planned'
                          ? `0 0 10px ${milestone.status === 'completed' ? 'var(--cw-color-secondary)' : 'var(--cw-color-primary)'}`
                          : 'none',
                    }}
                  />

                  {/* Content */}
                  <div
                    style={{
                      padding: '1.5rem',
                      background: 'rgba(255, 176, 0, 0.05)',
                      border: '1px solid rgba(255, 176, 0, 0.3)',
                      clipPath: 'var(--cw-chamfer-small)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 'var(--cw-font-size-xs)',
                        color: 'var(--cw-color-text-tertiary)',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {milestone.date}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--cw-font-size-lg)',
                        color: 'var(--cw-color-primary)',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      {milestone.title}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--cw-font-size-sm)',
                        color:
                          milestone.status === 'completed'
                            ? 'var(--cw-color-secondary)'
                            : milestone.status === 'in-progress'
                              ? 'var(--cw-color-primary)'
                              : 'var(--cw-color-text-tertiary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {milestone.status === 'completed' && '✓ COMPLETED'}
                      {milestone.status === 'in-progress' && '⚡ IN PROGRESS'}
                      {milestone.status === 'planned' && '📅 PLANNED'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Newsletter Section */}
          <section
            id="newsletter"
            ref={newsletterRef}
            className="scroll-animate"
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              width: '100%',
              padding: '6rem 2rem',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{ height: '2px', width: '80px', background: 'var(--cw-color-primary)' }}
              />
              <h2
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 700,
                  color: 'var(--cw-color-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--cw-letter-spacing-headers)',
                  margin: 0,
                }}
              >
                STAY OPERATIONAL
              </h2>
              <div
                style={{ height: '2px', width: '80px', background: 'var(--cw-color-primary)' }}
              />
            </div>

            <p
              style={{
                fontSize: 'var(--cw-font-size-base)',
                color: 'var(--cw-color-text-secondary)',
                marginBottom: '3rem',
                lineHeight: 1.8,
              }}
            >
              Subscribe for tactical updates, new component releases, and exclusive military-grade
              content
            </p>

            <form
              onSubmit={handleSubscribe}
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <ColdWarInput
                theme="perseus"
                type="email"
                placeholder="ENTER EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ flex: '1 1 300px' }}
              />
              <ColdWarButton theme="perseus" variant="primary" type="submit" glow>
                SUBSCRIBE
              </ColdWarButton>
            </form>

            {subscribed && (
              <div
                style={{
                  marginTop: '2rem',
                  padding: '1rem',
                  background: 'rgba(51, 255, 0, 0.1)',
                  border: '1px solid var(--cw-color-secondary)',
                  clipPath: 'var(--cw-chamfer-small)',
                  color: 'var(--cw-color-secondary)',
                  fontSize: 'var(--cw-font-size-sm)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                ✓ SUBSCRIPTION CONFIRMED. CHECK YOUR INBOX.
              </div>
            )}
          </section>

          {/* Footer */}
          <footer
            style={{
              marginTop: 'auto',
              padding: '4rem 2rem 2rem',
              borderTop: '1px solid rgba(255, 176, 0, 0.2)',
              background: 'rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                maxWidth: '1400px',
                margin: '0 auto',
              }}
            >
              {/* Footer Content Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '3rem',
                  marginBottom: '3rem',
                }}
              >
                {/* Brand Section */}
                <div>
                  <h3
                    style={{
                      fontSize: 'var(--cw-font-size-xl)',
                      color: 'var(--cw-color-primary)',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontWeight: 700,
                    }}
                  >
                    COLD WAR HUD
                  </h3>
                  <p
                    style={{
                      fontSize: 'var(--cw-font-size-sm)',
                      color: 'var(--cw-color-text-secondary)',
                      lineHeight: 1.8,
                      marginBottom: '1.5rem',
                    }}
                  >
                    Tactical military interface design system for React applications. Built with
                    precision and authenticity.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['React 18', 'TypeScript', 'Military HUD'].map((badge) => (
                      <div
                        key={badge}
                        style={{
                          padding: '0.3rem 0.8rem',
                          background: 'rgba(255, 176, 0, 0.1)',
                          border: '1px solid rgba(255, 176, 0, 0.3)',
                          clipPath:
                            'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)',
                          fontSize: 'var(--cw-font-size-xs)',
                          color: 'var(--cw-color-primary)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h4
                    style={{
                      fontSize: 'var(--cw-font-size-base)',
                      color: 'var(--cw-color-primary)',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontWeight: 700,
                    }}
                  >
                    ▸ QUICK LINKS
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {[
                      { label: 'Showcase', path: '/coldwar-showcase' },
                      { label: 'Playground', path: '/coldwar-playground' },
                      { label: 'Documentation', path: '/coldwar-docs' },
                      { label: 'Theme Selector', path: '/' },
                    ].map((link) => (
                      <button
                        key={link.label}
                        onClick={() => navigate(link.path)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--cw-color-text-secondary)',
                          fontSize: 'var(--cw-font-size-sm)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          padding: '0.3rem 0',
                          transition: 'all 0.3s ease',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--cw-color-primary)';
                          e.currentTarget.style.paddingLeft = '0.5rem';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--cw-color-text-secondary)';
                          e.currentTarget.style.paddingLeft = '0';
                        }}
                      >
                        → {link.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h4
                    style={{
                      fontSize: 'var(--cw-font-size-base)',
                      color: 'var(--cw-color-primary)',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontWeight: 700,
                    }}
                  >
                    ▸ RESOURCES
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {[
                      { label: 'GitHub Repository', external: true },
                      { label: 'NPM Package', external: true },
                      { label: 'API Reference', path: '/coldwar-docs' },
                      { label: 'RHUDS Pro', path: '/intro' },
                    ].map((link) => (
                      <button
                        key={link.label}
                        onClick={() => link.path && navigate(link.path)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--cw-color-text-secondary)',
                          fontSize: 'var(--cw-font-size-sm)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          padding: '0.3rem 0',
                          transition: 'all 0.3s ease',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--cw-color-primary)';
                          e.currentTarget.style.paddingLeft = '0.5rem';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--cw-color-text-secondary)';
                          e.currentTarget.style.paddingLeft = '0';
                        }}
                      >
                        → {link.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Themes */}
                <div>
                  <h4
                    style={{
                      fontSize: 'var(--cw-font-size-base)',
                      color: 'var(--cw-color-primary)',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontWeight: 700,
                    }}
                  >
                    ▸ AVAILABLE THEMES
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {[
                      { name: 'Perseus (Amber)', color: '#FFB000' },
                      { name: 'Green Terminal', color: '#33FF00' },
                      { name: 'Satellite View', color: '#00AEFF' },
                    ].map((theme) => (
                      <div
                        key={theme.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.8rem',
                          fontSize: 'var(--cw-font-size-sm)',
                          color: 'var(--cw-color-text-secondary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            background: theme.color,
                            boxShadow: `0 0 8px ${theme.color}`,
                            clipPath:
                              'polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)',
                          }}
                        />
                        {theme.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Bottom */}
              <div
                style={{
                  paddingTop: '2rem',
                  borderTop: '1px solid rgba(255, 176, 0, 0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <p
                  style={{
                    fontSize: 'var(--cw-font-size-xs)',
                    color: 'var(--cw-color-text-tertiary)',
                    letterSpacing: 'var(--cw-letter-spacing-body)',
                    margin: 0,
                  }}
                >
                  COLD WAR HUD © 2026 | TACTICAL INTERFACE DESIGN SYSTEM
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <ColdWarButton
                    theme="perseus"
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/')}
                  >
                    ← THEME SELECTOR
                  </ColdWarButton>
                  <ColdWarButton
                    theme="perseus"
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/intro')}
                  >
                    VIEW RHUDS PRO
                  </ColdWarButton>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};
