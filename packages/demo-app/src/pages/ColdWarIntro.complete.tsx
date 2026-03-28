import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColdWarButton, ColdWarCard, ColdWarInput } from '@rhuds/components';
import { TacticalMotionBackground } from '../components/TacticalMotionBackground';
import '../styles/cold-war-theme.css';

export const ColdWarIntro: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [terminalText, setTerminalText] = useState('');

  const featuresRef = useRef<HTMLDivElement>(null);
  const installRef = useRef<HTMLDivElement>(null);
  const componentsRef = useRef<HTMLDivElement>(null);
  const themesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);

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
          if (sectionIndex !== -1) {
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
  }, [sections]);

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
    >
      <TacticalMotionBackground variant="perimeter" />

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
        {/* Hero Section - Continued in next message due to length */}
        <section
          id="hero"
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
            style={{
              fontSize: 'clamp(3rem, 10vw, 6rem)',
              fontWeight: 700,
              color: 'var(--cw-color-primary)',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: 'var(--cw-letter-spacing-headers)',
              textShadow: '0 0 40px rgba(255, 176, 0, 0.8), 0 0 80px rgba(255, 176, 0, 0.4)',
            }}
          >
            COLD WAR HUD
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ height: '2px', width: '60px', background: 'var(--cw-color-primary)' }} />
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
            <div style={{ height: '2px', width: '60px', background: 'var(--cw-color-primary)' }} />
          </div>

          <p
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
          </div>

          {/* Tech Stack Badges */}
          <div
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
        </section>

        {/* Footer */}
        <footer
          style={{
            marginTop: 'auto',
            padding: '3rem 2rem 2rem',
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 176, 0, 0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '2rem',
            }}
          >
            <ColdWarButton
              theme="perseus"
              variant="secondary"
              size="sm"
              onClick={() => navigate('/')}
            >
              ← BACK TO SELECTOR
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
          <p
            style={{
              fontSize: 'var(--cw-font-size-xs)',
              color: 'var(--cw-color-text-tertiary)',
              letterSpacing: 'var(--cw-letter-spacing-body)',
            }}
          >
            COLD WAR HUD © 2026 | TACTICAL INTERFACE DESIGN SYSTEM
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ColdWarIntro;
