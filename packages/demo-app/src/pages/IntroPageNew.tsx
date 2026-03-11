import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function IntroPageNew() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const glitchVariants = {
    initial: { x: 0, y: 0 },
    glitch: {
      x: [0, -5, 5, -5, 5, 0],
      y: [0, 5, -5, 5, -5, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0a0a1f 0%, #000000 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Grid Background */}
      <motion.div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(41, 242, 223, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(41, 242, 223, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          zIndex: 0,
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: i % 2 === 0 ? '#29F2DF' : '#EF3EF1',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            zIndex: 1,
            boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Hero Section */}
      <motion.section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
          padding: '20px',
          opacity,
          scale,
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
          style={{
            textAlign: 'center',
            maxWidth: '1200px',
          }}
        >
          {/* Holographic Logo */}
          <motion.div
            variants={glitchVariants}
            initial="initial"
            animate="glitch"
            style={{
              position: 'relative',
              marginBottom: '60px',
            }}
          >
            <motion.h1
              variants={itemVariants}
              style={{
                fontSize: 'clamp(60px, 15vw, 180px)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #29F2DF 0%, #EF3EF1 50%, #1C7FA6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 200%',
                letterSpacing: '0.1em',
                textShadow: '0 0 80px rgba(41, 242, 223, 0.5)',
                position: 'relative',
                margin: 0,
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              RHUDS
            </motion.h1>

            {/* Holographic Layers */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                fontSize: 'clamp(60px, 15vw, 180px)',
                fontWeight: 900,
                color: '#29F2DF',
                opacity: 0.3,
                filter: 'blur(2px)',
                zIndex: -1,
              }}
              animate={{
                x: [0, 2, -2, 2, 0],
                y: [0, -2, 2, -2, 0],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              RHUDS
            </motion.div>
          </motion.div>

          {/* Subtitle with Typing Effect */}
          <motion.div
            variants={itemVariants}
            style={{
              fontSize: 'clamp(20px, 4vw, 36px)',
              color: '#29F2DF',
              marginBottom: '40px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              Next-Gen HUD System
            </motion.span>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: 'clamp(16px, 2vw, 24px)',
              color: '#C8D8E8',
              maxWidth: '800px',
              margin: '0 auto 60px',
              lineHeight: 1.8,
            }}
          >
            Experience the future of UI design with 51+ premium components, powered by cutting-edge
            animations and sci-fi aesthetics
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex',
              gap: '30px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'Enter System', route: '/playground', primary: true },
              { label: 'View Docs', route: '/docs', primary: false },
            ].map((btn, i) => (
              <motion.button
                key={btn.label}
                onClick={() => navigate(btn.route)}
                style={{
                  padding: '20px 50px',
                  fontSize: '18px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  background: btn.primary
                    ? 'linear-gradient(135deg, #29F2DF 0%, #1C7FA6 100%)'
                    : 'transparent',
                  border: btn.primary ? 'none' : '2px solid #29F2DF',
                  color: btn.primary ? '#000' : '#29F2DF',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  textTransform: 'uppercase',
                  clipPath:
                    'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 30px ${btn.primary ? '#29F2DF' : '#EF3EF1'}`,
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + i * 0.2 }}
              >
                <motion.span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  }}
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
                <span style={{ position: 'relative', zIndex: 1 }}>{btn.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            variants={itemVariants}
            style={{
              marginTop: '80px',
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {['React 18', 'TypeScript', 'Framer Motion', 'WebGL', 'Canvas API'].map((tech, i) => (
              <motion.div
                key={tech}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(41, 242, 223, 0.1)',
                  border: '1px solid rgba(41, 242, 223, 0.3)',
                  color: '#29F2DF',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  clipPath:
                    'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
                }}
                whileHover={{
                  background: 'rgba(41, 242, 223, 0.2)',
                  borderColor: '#29F2DF',
                  scale: 1.05,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 + i * 0.1 }}
              >
                {tech}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          <div
            style={{
              width: '2px',
              height: '40px',
              background: 'linear-gradient(to bottom, transparent, #29F2DF, transparent)',
              margin: '0 auto',
            }}
          />
          <div
            style={{
              color: '#29F2DF',
              fontSize: '12px',
              marginTop: '10px',
              letterSpacing: '0.2em',
            }}
          >
            SCROLL
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
          padding: '100px 20px',
        }}
      >
        <div style={{ maxWidth: '1400px', width: '100%' }}>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'clamp(40px, 8vw, 80px)',
              fontWeight: 900,
              textAlign: 'center',
              marginBottom: '100px',
              background: 'linear-gradient(135deg, #29F2DF 0%, #EF3EF1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.05em',
            }}
          >
            EXPLORE THE SYSTEM
          </motion.h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '40px',
            }}
          >
            {[
              {
                title: 'PLAYGROUND',
                subtitle: 'Interactive Sandbox',
                description: '51+ components ready to test',
                icon: '⚡',
                color: '#29F2DF',
                route: '/playground',
              },
              {
                title: 'SHOWCASE',
                subtitle: 'Component Gallery',
                description: 'Browse the complete library',
                icon: '✨',
                color: '#EF3EF1',
                route: '/showcase',
              },
              {
                title: 'DOCS',
                subtitle: 'API Reference',
                description: 'Complete integration guides',
                icon: '📚',
                color: '#1C7FA6',
                route: '/docs',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => navigate(feature.route)}
                style={{
                  padding: '40px',
                  background: 'rgba(10, 10, 31, 0.8)',
                  border: `2px solid ${feature.color}40`,
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  clipPath:
                    'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                  }}
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />

                <div
                  style={{
                    fontSize: '60px',
                    marginBottom: '20px',
                    filter: `drop-shadow(0 0 20px ${feature.color})`,
                  }}
                >
                  {feature.icon}
                </div>

                <h3
                  style={{
                    fontSize: '32px',
                    fontWeight: 900,
                    color: feature.color,
                    marginBottom: '10px',
                    letterSpacing: '0.1em',
                  }}
                >
                  {feature.title}
                </h3>

                <div
                  style={{
                    fontSize: '14px',
                    color: '#8EC8D8',
                    marginBottom: '20px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {feature.subtitle}
                </div>

                <p
                  style={{
                    fontSize: '16px',
                    color: '#C8D8E8',
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </p>

                <motion.div
                  style={{
                    marginTop: '30px',
                    color: feature.color,
                    fontSize: '14px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                  whileHover={{ gap: '20px' }}
                >
                  EXPLORE <span>→</span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
