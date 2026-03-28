import { useState } from 'react';
import { ColdWarButton, ColdWarCard } from '@rhuds/components';
import { TacticalMotionBackground } from '../components/TacticalMotionBackground';
import '../styles/cold-war-theme.css';

export default function ColdWarPortfolioPage() {
  const [activeSection, setActiveSection] = useState<
    'about' | 'experience' | 'skills' | 'projects'
  >('about');

  const experiences = [
    {
      title: 'AI & Frontend Developer',
      company: 'Science and Technology Park',
      period: 'December 2025 - Present',
      description: 'Working on advanced AI and frontend development projects',
      tech: ['React', 'TypeScript', 'AI/ML', 'Python'],
    },
    {
      title: 'Senior Web Specialist',
      company: 'Marham Andishe Salamat (Zuiko Japan)',
      period: 'September 2024 - August 2025',
      description: 'Implemented WordPress and React.js/Three.js websites',
      tech: ['WordPress', 'React.js', 'Three.js'],
    },
    {
      title: 'Frontend & AI Developer',
      company: 'Aiandhealth.net (USA)',
      period: 'August 2023 - December 2023',
      description: 'AI-based medical application development',
      tech: ['React.js', 'Machine Learning', 'Python'],
    },
  ];

  const skills = {
    frontend: ['React.js', 'TypeScript', 'Three.js', 'WebGL', 'HTML/CSS', 'Tailwind', 'MUI'],
    ai: ['TensorFlow', 'PyTorch', 'Keras', 'OpenCV', 'YOLO', 'Computer Vision'],
    other: ['Git', 'Python', 'MATLAB', 'Quantum Computing', 'Robotics'],
  };

  const projects = [
    {
      name: 'RHUDS Pro',
      description: 'Comprehensive sci-fi HUD component library with 51+ premium components',
      tech: ['React 18', 'TypeScript', 'WebGL', 'Three.js', 'Framer Motion'],
      status: 'v0.1.0 - In Development',
    },
  ];

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: 'var(--cw-color-background)',
    color: 'var(--cw-color-text)',
    fontFamily: 'var(--cw-font-family)',
    padding: '48px 24px',
    position: 'relative',
    zIndex: 1,
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '48px',
    textAlign: 'center',
    padding: '32px',
    backgroundColor: 'var(--cw-color-surface)',
    border: '2px solid var(--cw-color-primary)',
    clipPath: 'var(--cw-chamfer-large)',
    position: 'relative',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 700,
    letterSpacing: 'var(--cw-letter-spacing-headers)',
    textTransform: 'uppercase',
    color: 'var(--cw-color-primary)',
    marginBottom: '12px',
    textShadow: '0 0 20px rgba(255, 176, 0, 0.5)',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '24px',
    color: 'var(--cw-color-primary)',
    fontWeight: 600,
    marginBottom: '8px',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '16px',
    color: 'var(--cw-color-text-secondary)',
    letterSpacing: 'var(--cw-letter-spacing-body)',
  };

  const navButtonsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '48px',
    flexWrap: 'wrap',
  };

  const contentBoxStyle: React.CSSProperties = {
    padding: '32px',
    backgroundColor: 'var(--cw-color-surface)',
    border: '2px solid var(--cw-color-primary)',
    clipPath: 'var(--cw-chamfer-large)',
    minHeight: '500px',
    position: 'relative',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    letterSpacing: 'var(--cw-letter-spacing-headers)',
    textTransform: 'uppercase',
    color: 'var(--cw-color-primary)',
    marginBottom: '24px',
    paddingBottom: '12px',
    borderBottom: '2px solid var(--cw-color-primary)',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '24px',
  };

  const cardStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: 'rgba(255, 176, 0, 0.05)',
    border: '1px solid var(--cw-color-primary)',
    clipPath: 'var(--cw-chamfer-small)',
  };

  const experienceCardStyle: React.CSSProperties = {
    padding: '24px',
    backgroundColor: 'rgba(255, 176, 0, 0.08)',
    border: '2px solid var(--cw-color-primary)',
    clipPath: 'var(--cw-chamfer-medium)',
    marginBottom: '20px',
  };

  const skillTagStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: 'rgba(255, 176, 0, 0.15)',
    border: '1px solid var(--cw-color-primary)',
    clipPath: 'var(--cw-chamfer-small)',
    fontSize: '13px',
    color: 'var(--cw-color-primary)',
    fontWeight: 600,
    marginRight: '8px',
    marginBottom: '8px',
  };

  const profilePhotoStyle: React.CSSProperties = {
    width: '240px',
    height: '300px',
    borderRadius: '0',
    overflow: 'hidden',
    border: '3px solid var(--cw-color-primary)',
    clipPath: 'var(--cw-chamfer-large)',
    boxShadow: '0 0 30px rgba(255, 176, 0, 0.3), inset 0 0 20px rgba(255, 176, 0, 0.1)',
    background: 'linear-gradient(135deg, rgba(255, 176, 0, 0.1) 0%, rgba(200, 100, 0, 0.1) 100%)',
    margin: '0 auto 24px',
  };

  const profileImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
    filter: 'brightness(1.08) contrast(1.15) saturate(1.1)',
    display: 'block',
  };

  return (
    <div style={pageStyle} data-theme="perseus">
      <TacticalMotionBackground variant="perimeter" />

      <div style={containerStyle}>
        {/* Header Section */}
        <div style={headerStyle}>
          <div style={profilePhotoStyle}>
            <img
              src="/amirreza-ghafarian.jpg"
              alt="Amirreza Ghaffarian Nakhodi"
              style={profileImageStyle}
            />
          </div>
          <h1 style={titleStyle}>Amirreza Ghaffarian Nakhodi</h1>
          <p style={subtitleStyle}>Frontend Developer & AI Engineer</p>
          <p style={descriptionStyle}>7 years programming • 5 years frontend • 3 years AI/ML</p>
        </div>

        {/* Navigation Tabs */}
        <div style={navButtonsStyle}>
          {(['about', 'experience', 'skills', 'projects'] as const).map((section) => (
            <ColdWarButton
              key={section}
              theme="perseus"
              variant={activeSection === section ? 'primary' : 'secondary'}
              size="md"
              onClick={() => setActiveSection(section)}
            >
              {section.toUpperCase()}
            </ColdWarButton>
          ))}
        </div>

        {/* Content Section */}
        <div style={contentBoxStyle}>
          {/* About Section */}
          {activeSection === 'about' && (
            <div>
              <h2 style={sectionTitleStyle}>About Me</h2>

              <div style={{ marginBottom: '32px' }}>
                <p style={{ marginBottom: '16px', lineHeight: '1.8' }}>
                  Passionate Frontend Developer and AI Engineer with 7 years of programming
                  experience, specializing in modern web technologies and artificial intelligence.
                </p>
                <p style={{ marginBottom: '16px', lineHeight: '1.8' }}>
                  Currently pursuing Master's degree in AI and Robotics at Islamic Azad University,
                  Mashhad, while working at Science and Technology Park on cutting-edge projects.
                </p>
                <p style={{ lineHeight: '1.8' }}>
                  Creator of RHUDS Pro - a comprehensive sci-fi HUD component library with 51+
                  premium components, built with React 18, TypeScript, WebGL, and advanced animation
                  systems.
                </p>
              </div>

              <div style={gridStyle}>
                <div style={cardStyle}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎓</div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'var(--cw-color-primary)',
                      fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    EDUCATION
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--cw-color-text-secondary)' }}>
                    Master's in AI & Robotics
                    <br />
                    Islamic Azad University
                  </div>
                </div>

                <div style={cardStyle}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>🌍</div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'var(--cw-color-primary)',
                      fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    LANGUAGES
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--cw-color-text-secondary)' }}>
                    English (IELTS 6)
                    <br />
                    German (Intermediate)
                    <br />
                    Persian (Native)
                  </div>
                </div>

                <div style={cardStyle}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>💼</div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'var(--cw-color-primary)',
                      fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    CURRENT ROLE
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--cw-color-text-secondary)' }}>
                    AI & Frontend Developer
                    <br />
                    Science and Technology Park
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Experience Section */}
          {activeSection === 'experience' && (
            <div>
              <h2 style={sectionTitleStyle}>Work Experience</h2>
              {experiences.map((exp, index) => (
                <div key={index} style={experienceCardStyle}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '12px',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '18px',
                          color: 'var(--cw-color-primary)',
                          fontWeight: 700,
                          marginBottom: '4px',
                        }}
                      >
                        {exp.title}
                      </h3>
                      <div
                        style={{
                          fontSize: '16px',
                          color: 'var(--cw-color-text-secondary)',
                          fontWeight: 600,
                        }}
                      >
                        {exp.company}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'rgba(255, 176, 0, 0.2)',
                        border: '1px solid var(--cw-color-primary)',
                        clipPath: 'var(--cw-chamfer-small)',
                        fontSize: '12px',
                        color: 'var(--cw-color-primary)',
                        fontWeight: 600,
                      }}
                    >
                      {exp.period}
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--cw-color-text-secondary)',
                      marginBottom: '12px',
                      lineHeight: '1.6',
                    }}
                  >
                    {exp.description}
                  </p>
                  <div>
                    {exp.tech.map((tech) => (
                      <span key={tech} style={skillTagStyle}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <div>
              <h2 style={sectionTitleStyle}>Technical Skills</h2>

              <div style={{ marginBottom: '32px' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    color: 'var(--cw-color-primary)',
                    fontWeight: 700,
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  Frontend Development
                </h3>
                <div>
                  {skills.frontend.map((skill) => (
                    <span key={skill} style={skillTagStyle}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    color: 'var(--cw-color-primary)',
                    fontWeight: 700,
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  AI & Machine Learning
                </h3>
                <div>
                  {skills.ai.map((skill) => (
                    <span key={skill} style={skillTagStyle}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3
                  style={{
                    fontSize: '18px',
                    color: 'var(--cw-color-primary)',
                    fontWeight: 700,
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  Other Technologies
                </h3>
                <div>
                  {skills.other.map((skill) => (
                    <span key={skill} style={skillTagStyle}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <div>
              <h2 style={sectionTitleStyle}>Featured Projects</h2>
              {projects.map((project, index) => (
                <div
                  key={index}
                  style={{
                    padding: '28px',
                    backgroundColor: 'rgba(255, 176, 0, 0.1)',
                    border: '2px solid var(--cw-color-primary)',
                    clipPath: 'var(--cw-chamfer-large)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '24px',
                      color: 'var(--cw-color-primary)',
                      fontWeight: 800,
                      marginBottom: '12px',
                    }}
                  >
                    {project.name}
                  </h3>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      backgroundColor: 'rgba(255, 176, 0, 0.2)',
                      border: '1px solid var(--cw-color-primary)',
                      clipPath: 'var(--cw-chamfer-small)',
                      fontSize: '12px',
                      color: 'var(--cw-color-primary)',
                      fontWeight: 700,
                      marginBottom: '16px',
                    }}
                  >
                    {project.status}
                  </div>
                  <p
                    style={{
                      fontSize: '16px',
                      color: 'var(--cw-color-text-secondary)',
                      marginBottom: '16px',
                      lineHeight: '1.7',
                    }}
                  >
                    {project.description}
                  </p>
                  <div>
                    {project.tech.map((tech) => (
                      <span key={tech} style={skillTagStyle}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scanlines {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(10px);
          }
        }

        [data-theme="perseus"] {
          --cw-color-background: #1a1410;
          --cw-color-surface: #2d2420;
          --cw-color-primary: #FFB000;
          --cw-color-text: #D4A574;
          --cw-color-text-secondary: #A0826D;
          --cw-font-family: 'Share Tech Mono', monospace;
          --cw-font-size-xl: 24px;
          --cw-font-size-lg: 18px;
          --cw-font-size-base: 16px;
          --cw-letter-spacing-headers: 0.15em;
          --cw-letter-spacing-body: 0.05em;
          --cw-chamfer-small: polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%);
          --cw-chamfer-medium: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
          --cw-chamfer-large: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
        }

        [data-theme="perseus"]::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 9999;
          animation: scanlines 8s linear infinite;
        }

        h1, h2, h3, p, span, div {
          position: relative;
        }

        h1::before, h2::before, h3::before, p::before, span::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1),
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 1;
        }

        h1, h2, h3, p, span {
          position: relative;
          z-index: 2;
        }
      `}</style>
    </div>
  );
}
