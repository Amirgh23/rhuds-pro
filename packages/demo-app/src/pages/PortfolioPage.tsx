import { useState, useEffect, useRef } from 'react';
import { useContextMenu } from '../hooks/useContextMenu';
import { GlassContextMenu } from '../components/GlassContextMenu';
import { GeometricWrapper } from '../components/GeometricWrapper';
import { ColdWarButton, ColdWarInput, ColdWarCard } from '@rhuds/components';
import '../styles/cold-war-theme.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState<
    'about' | 'experience' | 'skills' | 'projects'
  >('about');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { position, visible, closeMenu, handleNavigation, handleCopyInstall } = useContextMenu();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.fillStyle = `rgba(41, 242, 223, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0f 50%, #000000 100%)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '80px',
      }}
    >
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
        }}
      />

      {/* Gradient Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%, rgba(41, 242, 223, 0.08) 0%, transparent 60%),
            radial-gradient(circle at ${50 - mousePosition.x * 15}% ${50 - mousePosition.y * 15}%, rgba(239, 62, 241, 0.06) 0%, transparent 60%)
          `,
        }}
      />

      {/* Main Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 20px',
        }}
      >
        {/* Header Section with Profile Image */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '60px',
            animation: 'fadeInUp 1s ease-out',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '40px',
            }}
          >
            {/* Professional Profile Photo */}
            <div
              style={{
                position: 'relative',
                width: '240px',
                height: '300px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '3px solid rgba(41, 242, 223, 0.7)',
                boxShadow: `
                  0 0 50px rgba(41, 242, 223, 0.5),
                  inset 0 0 30px rgba(41, 242, 223, 0.15),
                  0 0 100px rgba(239, 62, 241, 0.25)
                `,
                background:
                  'linear-gradient(135deg, rgba(41, 242, 223, 0.1) 0%, rgba(239, 62, 241, 0.1) 100%)',
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.boxShadow = `
                  0 0 70px rgba(41, 242, 223, 0.7),
                  inset 0 0 30px rgba(41, 242, 223, 0.2),
                  0 0 120px rgba(239, 62, 241, 0.4)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = `
                  0 0 50px rgba(41, 242, 223, 0.5),
                  inset 0 0 30px rgba(41, 242, 223, 0.15),
                  0 0 100px rgba(239, 62, 241, 0.25)
                `;
              }}
            >
              <img
                src="/amirreza-ghafarian.jpg"
                alt="Amirreza Ghaffarian Nakhodi - Professional Photo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  filter: 'brightness(1.08) contrast(1.15) saturate(1.1)',
                  display: 'block',
                }}
              />

              {/* HUD Corner Accents */}
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '25px',
                  height: '25px',
                  border: '2px solid #29F2DF',
                  borderRight: 'none',
                  borderBottom: 'none',
                  borderRadius: '3px 0 0 0',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  width: '25px',
                  height: '25px',
                  border: '2px solid #29F2DF',
                  borderLeft: 'none',
                  borderBottom: 'none',
                  borderRadius: '0 3px 0 0',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '25px',
                  height: '25px',
                  border: '2px solid #EF3EF1',
                  borderRight: 'none',
                  borderTop: 'none',
                  borderRadius: '0 0 0 3px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '25px',
                  height: '25px',
                  border: '2px solid #EF3EF1',
                  borderLeft: 'none',
                  borderTop: 'none',
                  borderRadius: '0 0 3px 0',
                }}
              />
            </div>

            {/* Text Content */}
            <GeometricWrapper
              variant="complex"
              color="#29F2DF"
              glowIntensity="high"
              style={{
                display: 'inline-block',
                padding: '40px 60px',
                background:
                  'linear-gradient(135deg, rgba(41, 242, 223, 0.15) 0%, rgba(239, 62, 241, 0.15) 100%)',
                backdropFilter: 'blur(40px)',
                border: '2px solid rgba(41, 242, 223, 0.5)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(41, 242, 223, 0.3)',
              }}
            >
              <h1
                style={{
                  fontSize: '64px',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #29F2DF 0%, #EF3EF1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '16px',
                  letterSpacing: '2px',
                }}
              >
                Amirreza Ghaffarian Nakhodi
              </h1>
              <p
                style={{
                  fontSize: '24px',
                  color: '#29F2DF',
                  fontWeight: '600',
                  marginBottom: '12px',
                  textShadow: '0 0 20px rgba(41, 242, 223, 0.6)',
                }}
              >
                Frontend Developer & AI Engineer
              </p>
              <p
                style={{
                  fontSize: '18px',
                  color: '#C8D8E8',
                  maxWidth: '600px',
                  margin: '0 auto',
                }}
              >
                7 years programming • 5 years frontend • 3 years AI/ML
              </p>
            </GeometricWrapper>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '60px',
            flexWrap: 'wrap',
          }}
        >
          {(['about', 'experience', 'skills', 'projects'] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              style={{
                padding: '16px 40px',
                background:
                  activeSection === section
                    ? 'linear-gradient(135deg, rgba(41, 242, 223, 0.3) 0%, rgba(239, 62, 241, 0.3) 100%)'
                    : 'rgba(41, 242, 223, 0.1)',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${activeSection === section ? '#29F2DF' : 'rgba(41, 242, 223, 0.3)'}`,
                borderRadius: '15px',
                color: activeSection === section ? '#29F2DF' : '#C8D8E8',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow:
                  activeSection === section
                    ? '0 0 30px rgba(41, 242, 223, 0.4)'
                    : '0 0 10px rgba(41, 242, 223, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(41, 242, 223, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  activeSection === section
                    ? '0 0 30px rgba(41, 242, 223, 0.4)'
                    : '0 0 10px rgba(41, 242, 223, 0.1)';
              }}
            >
              {section}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <GeometricWrapper
          variant="complex"
          color="#29F2DF"
          glowIntensity="medium"
          style={{
            padding: '40px',
            background:
              'linear-gradient(135deg, rgba(41, 242, 223, 0.08) 0%, rgba(239, 62, 241, 0.08) 100%)',
            backdropFilter: 'blur(40px)',
            border: '2px solid rgba(41, 242, 223, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            minHeight: '500px',
          }}
        >
          {/* About Section */}
          {activeSection === 'about' && (
            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <h2
                style={{
                  fontSize: '36px',
                  color: '#29F2DF',
                  marginBottom: '30px',
                  fontWeight: '800',
                  textShadow: '0 0 20px rgba(41, 242, 223, 0.5)',
                }}
              >
                About Me
              </h2>

              {/* Profile Section with Photo */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '40px',
                  alignItems: 'start',
                  marginBottom: '40px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Professional Photo */}
                <div
                  style={{
                    position: 'relative',
                    width: '280px',
                    height: '350px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '3px solid rgba(41, 242, 223, 0.6)',
                    boxShadow: `
                      0 0 40px rgba(41, 242, 223, 0.4),
                      inset 0 0 40px rgba(41, 242, 223, 0.1),
                      0 0 80px rgba(239, 62, 241, 0.2)
                    `,
                    background:
                      'linear-gradient(135deg, rgba(41, 242, 223, 0.1) 0%, rgba(239, 62, 241, 0.1) 100%)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02) rotateY(5deg)';
                    e.currentTarget.style.boxShadow = `
                      0 0 60px rgba(41, 242, 223, 0.6),
                      inset 0 0 40px rgba(41, 242, 223, 0.2),
                      0 0 100px rgba(239, 62, 241, 0.3)
                    `;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) rotateY(0deg)';
                    e.currentTarget.style.boxShadow = `
                      0 0 40px rgba(41, 242, 223, 0.4),
                      inset 0 0 40px rgba(41, 242, 223, 0.1),
                      0 0 80px rgba(239, 62, 241, 0.2)
                    `;
                  }}
                >
                  <img
                    src="/amirreza-ghafarian.jpg"
                    alt="Amirreza Ghaffarian Nakhodi"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      filter: 'brightness(1.05) contrast(1.1)',
                    }}
                  />

                  {/* HUD Corner Accents */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '30px',
                      height: '30px',
                      border: '2px solid #29F2DF',
                      borderRight: 'none',
                      borderBottom: 'none',
                      borderRadius: '4px 0 0 0',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      width: '30px',
                      height: '30px',
                      border: '2px solid #29F2DF',
                      borderLeft: 'none',
                      borderBottom: 'none',
                      borderRadius: '0 4px 0 0',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      width: '30px',
                      height: '30px',
                      border: '2px solid #EF3EF1',
                      borderRight: 'none',
                      borderTop: 'none',
                      borderRadius: '0 0 0 4px',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '30px',
                      height: '30px',
                      border: '2px solid #EF3EF1',
                      borderLeft: 'none',
                      borderTop: 'none',
                      borderRadius: '0 0 4px 0',
                    }}
                  />
                </div>

                {/* Bio Text */}
                <div
                  style={{
                    fontSize: '18px',
                    color: '#C8D8E8',
                    lineHeight: '1.8',
                  }}
                >
                  <p style={{ marginBottom: '20px' }}>
                    Passionate Frontend Developer and AI Engineer with 7 years of programming
                    experience, specializing in modern web technologies and artificial intelligence.
                  </p>
                  <p style={{ marginBottom: '20px' }}>
                    Currently pursuing Master's degree in AI and Robotics at Islamic Azad
                    University, Mashhad, while working at Science and Technology Park on
                    cutting-edge projects.
                  </p>
                  <p>
                    Creator of RHUDS Pro - a comprehensive sci-fi HUD component library with 51+
                    premium components, built with React 18, TypeScript, WebGL, and advanced
                    animation systems.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                  marginTop: '40px',
                }}
              >
                <div
                  style={{
                    padding: '24px',
                    background: 'rgba(41, 242, 223, 0.1)',
                    border: '1px solid rgba(41, 242, 223, 0.3)',
                    borderRadius: '15px',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎓</div>
                  <div
                    style={{
                      fontSize: '16px',
                      color: '#29F2DF',
                      fontWeight: '700',
                      marginBottom: '8px',
                    }}
                  >
                    Education
                  </div>
                  <div style={{ fontSize: '14px', color: '#C8D8E8' }}>
                    Master's in AI & Robotics
                    <br />
                    Islamic Azad University
                  </div>
                </div>

                <div
                  style={{
                    padding: '24px',
                    background: 'rgba(239, 62, 241, 0.1)',
                    border: '1px solid rgba(239, 62, 241, 0.3)',
                    borderRadius: '15px',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌍</div>
                  <div
                    style={{
                      fontSize: '16px',
                      color: '#EF3EF1',
                      fontWeight: '700',
                      marginBottom: '8px',
                    }}
                  >
                    Languages
                  </div>
                  <div style={{ fontSize: '14px', color: '#C8D8E8' }}>
                    English (IELTS 6)
                    <br />
                    German (Intermediate)
                    <br />
                    Persian (Native)
                  </div>
                </div>

                <div
                  style={{
                    padding: '24px',
                    background: 'rgba(76, 201, 240, 0.1)',
                    border: '1px solid rgba(76, 201, 240, 0.3)',
                    borderRadius: '15px',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>💼</div>
                  <div
                    style={{
                      fontSize: '16px',
                      color: '#4CC9F0',
                      fontWeight: '700',
                      marginBottom: '8px',
                    }}
                  >
                    Current Role
                  </div>
                  <div style={{ fontSize: '14px', color: '#C8D8E8' }}>
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
            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <h2
                style={{
                  fontSize: '36px',
                  color: '#29F2DF',
                  marginBottom: '30px',
                  fontWeight: '800',
                  textShadow: '0 0 20px rgba(41, 242, 223, 0.5)',
                }}
              >
                Work Experience
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {experiences.map((exp, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '30px',
                      background:
                        'linear-gradient(135deg, rgba(41, 242, 223, 0.1) 0%, rgba(239, 62, 241, 0.1) 100%)',
                      border: '2px solid rgba(41, 242, 223, 0.3)',
                      borderRadius: '20px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(10px)';
                      e.currentTarget.style.borderColor = '#29F2DF';
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(41, 242, 223, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.borderColor = 'rgba(41, 242, 223, 0.3)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: '24px',
                            color: '#29F2DF',
                            fontWeight: '700',
                            marginBottom: '8px',
                          }}
                        >
                          {exp.title}
                        </h3>
                        <div style={{ fontSize: '18px', color: '#EF3EF1', fontWeight: '600' }}>
                          {exp.company}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(41, 242, 223, 0.2)',
                          border: '1px solid rgba(41, 242, 223, 0.4)',
                          borderRadius: '10px',
                          fontSize: '14px',
                          color: '#29F2DF',
                          fontWeight: '600',
                        }}
                      >
                        {exp.period}
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: '16px',
                        color: '#C8D8E8',
                        marginBottom: '20px',
                        lineHeight: '1.6',
                      }}
                    >
                      {exp.description}
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {exp.tech.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            padding: '6px 14px',
                            background: 'rgba(239, 62, 241, 0.2)',
                            border: '1px solid rgba(239, 62, 241, 0.4)',
                            borderRadius: '8px',
                            fontSize: '13px',
                            color: '#EF3EF1',
                            fontWeight: '600',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <h2
                style={{
                  fontSize: '36px',
                  color: '#29F2DF',
                  marginBottom: '30px',
                  fontWeight: '800',
                  textShadow: '0 0 20px rgba(41, 242, 223, 0.5)',
                }}
              >
                Technical Skills
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '30px',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '24px',
                      color: '#29F2DF',
                      marginBottom: '20px',
                      fontWeight: '700',
                    }}
                  >
                    Frontend Development
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {skills.frontend.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          padding: '10px 20px',
                          background: 'rgba(41, 242, 223, 0.2)',
                          border: '2px solid rgba(41, 242, 223, 0.4)',
                          borderRadius: '12px',
                          fontSize: '15px',
                          color: '#29F2DF',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(41, 242, 223, 0.3)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(41, 242, 223, 0.2)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '24px',
                      color: '#EF3EF1',
                      marginBottom: '20px',
                      fontWeight: '700',
                    }}
                  >
                    AI & Machine Learning
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {skills.ai.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          padding: '10px 20px',
                          background: 'rgba(239, 62, 241, 0.2)',
                          border: '2px solid rgba(239, 62, 241, 0.4)',
                          borderRadius: '12px',
                          fontSize: '15px',
                          color: '#EF3EF1',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 62, 241, 0.3)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 62, 241, 0.2)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '24px',
                      color: '#4CC9F0',
                      marginBottom: '20px',
                      fontWeight: '700',
                    }}
                  >
                    Other Technologies
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {skills.other.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          padding: '10px 20px',
                          background: 'rgba(76, 201, 240, 0.2)',
                          border: '2px solid rgba(76, 201, 240, 0.4)',
                          borderRadius: '12px',
                          fontSize: '15px',
                          color: '#4CC9F0',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(76, 201, 240, 0.3)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(76, 201, 240, 0.2)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <h2
                style={{
                  fontSize: '36px',
                  color: '#29F2DF',
                  marginBottom: '30px',
                  fontWeight: '800',
                  textShadow: '0 0 20px rgba(41, 242, 223, 0.5)',
                }}
              >
                Featured Projects
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {projects.map((project, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '40px',
                      background:
                        'linear-gradient(135deg, rgba(41, 242, 223, 0.15) 0%, rgba(239, 62, 241, 0.15) 100%)',
                      border: '3px solid rgba(41, 242, 223, 0.5)',
                      borderRadius: '25px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 0 50px rgba(41, 242, 223, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '32px',
                        color: '#29F2DF',
                        fontWeight: '800',
                        marginBottom: '16px',
                      }}
                    >
                      {project.name}
                    </h3>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        background: 'rgba(239, 62, 241, 0.3)',
                        border: '1px solid rgba(239, 62, 241, 0.5)',
                        borderRadius: '10px',
                        fontSize: '14px',
                        color: '#EF3EF1',
                        fontWeight: '700',
                        marginBottom: '20px',
                      }}
                    >
                      {project.status}
                    </div>
                    <p
                      style={{
                        fontSize: '18px',
                        color: '#C8D8E8',
                        marginBottom: '24px',
                        lineHeight: '1.7',
                      }}
                    >
                      {project.description}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            padding: '10px 20px',
                            background: 'rgba(41, 242, 223, 0.2)',
                            border: '2px solid rgba(41, 242, 223, 0.4)',
                            borderRadius: '12px',
                            fontSize: '15px',
                            color: '#29F2DF',
                            fontWeight: '600',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GeometricWrapper>
      </div>

      <style>{`
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {visible && position && (
        <GlassContextMenu
          x={position.x}
          y={position.y}
          onClose={closeMenu}
          onNavigate={handleNavigation}
          onCopyInstall={handleCopyInstall}
        />
      )}
    </div>
  );
}
