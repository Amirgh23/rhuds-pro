'use client'

import { useState, useEffect } from 'react'
import SecurityBracket from './SecurityBracket'

interface AccessCardProps {
  title: string
  hexCode: string
  description: string
  icon: React.ReactNode
  delay: number
  accentColor?: 'cyan' | 'magenta' | 'blue'
}

export default function AccessCard({ 
  title, 
  hexCode, 
  description, 
  icon, 
  delay,
  accentColor = 'cyan' 
}: AccessCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [scanPosition, setScanPosition] = useState(-100)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isVisible) return

    const scanInterval = setInterval(() => {
      setScanPosition(prev => {
        if (prev > 110) return -10
        return prev + 0.5
      })
    }, 16)

    return () => clearInterval(scanInterval)
  }, [isVisible])

  const colorMap = {
    cyan: {
      primary: '#29F2DF',
      secondary: '#1C7FA6',
      glow: 'rgba(41, 242, 223, 0.3)',
    },
    magenta: {
      primary: '#EF3EF1',
      secondary: '#8B1F8C',
      glow: 'rgba(239, 62, 241, 0.3)',
    },
    blue: {
      primary: '#1C7FA6',
      secondary: '#0D4A6A',
      glow: 'rgba(28, 127, 166, 0.3)',
    },
  }

  const colors = colorMap[accentColor]

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative overflow-hidden rounded-lg p-5 md:p-6 cursor-pointer transition-all duration-300 min-h-[220px] md:min-h-[260px]"
        style={{
          background: `linear-gradient(135deg, 
            rgba(40, 18, 90, ${isHovered ? 0.5 : 0.3}) 0%, 
            rgba(10, 18, 37, 0.7) 50%,
            rgba(40, 18, 90, ${isHovered ? 0.4 : 0.2}) 100%
          )`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `2px solid ${isHovered ? colors.primary : `${colors.primary}60`}`,
          boxShadow: isHovered
            ? `0 0 30px ${colors.glow}, 0 0 60px ${colors.glow}, inset 0 0 30px ${colors.glow}`
            : `0 0 15px ${colors.glow}, inset 0 0 10px ${colors.glow}`,
        }}
      >
        {/* Security brackets */}
        <SecurityBracket position="top-left" color={colors.primary} />
        <SecurityBracket position="top-right" color={colors.primary} />
        <SecurityBracket position="bottom-left" color={colors.primary} />
        <SecurityBracket position="bottom-right" color={colors.primary} />

        {/* Scanning line */}
        {isVisible && (
          <div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{
              top: `${scanPosition}%`,
              background: `linear-gradient(90deg, 
                transparent 0%, 
                ${colors.primary}40 20%,
                ${colors.primary} 50%,
                ${colors.primary}40 80%,
                transparent 100%
              )`,
              boxShadow: `0 0 10px ${colors.primary}`,
            }}
          />
        )}

        {/* Corner hex codes */}
        <div 
          className="absolute top-3 right-3 font-orbitron text-xs"
          style={{ color: colors.secondary, opacity: 0.6 }}
        >
          {hexCode}
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div 
            className="mb-3 md:mb-4 transition-transform duration-300"
            style={{ 
              color: colors.primary,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              filter: isHovered ? `drop-shadow(0 0 10px ${colors.primary})` : 'none',
            }}
          >
            {icon}
          </div>

          {/* Title */}
          <h3 
            className="font-orbitron text-lg md:text-xl lg:text-2xl mb-2 tracking-widest"
            style={{ 
              color: colors.primary,
              textShadow: isHovered ? `0 0 20px ${colors.glow}` : 'none',
            }}
          >
            {title}
          </h3>

          {/* Description */}
          <p 
            className="font-rajdhani text-sm md:text-base opacity-80 line-clamp-2"
            style={{ color: colors.secondary }}
          >
            {description}
          </p>

          {/* Status bar */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ 
                    backgroundColor: colors.primary,
                    boxShadow: `0 0 5px ${colors.primary}`,
                  }}
                />
                <span 
                  className="font-rajdhani text-xs uppercase tracking-wider"
                  style={{ color: colors.secondary }}
                >
                  STATUS: ACTIVE
                </span>
              </div>
              <div 
                className="font-orbitron text-xs"
                style={{ color: colors.primary }}
              >
                ACCESS →
              </div>
            </div>
          </div>
        </div>

        {/* Hover overlay effect */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`,
            opacity: isHovered ? 0.4 : 0,
          }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(${colors.primary}20 1px, transparent 1px),
              linear-gradient(90deg, ${colors.primary}20 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>
    </div>
  )
}
