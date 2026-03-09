'use client'

import { useEffect, useState } from 'react'

export default function GlitchEffect() {
  const [glitchActive, setGlitchActive] = useState(false)
  const [glitchStyle, setGlitchStyle] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const triggerGlitch = () => {
      const shouldGlitch = Math.random() > 0.7
      if (shouldGlitch) {
        setGlitchActive(true)
        setGlitchStyle({
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 5,
        })

        setTimeout(() => {
          setGlitchActive(false)
        }, 50 + Math.random() * 100)
      }
    }

    const interval = setInterval(triggerGlitch, 3000 + Math.random() * 4000)

    return () => clearInterval(interval)
  }, [])

  if (!glitchActive) return null

  return (
    <>
      {/* RGB Split overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: `
            linear-gradient(90deg, 
              rgba(41, 242, 223, 0.1) 0%, 
              transparent 50%, 
              rgba(239, 62, 241, 0.1) 100%
            )
          `,
          transform: `translate(${glitchStyle.x}px, ${glitchStyle.y}px)`,
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Scanline distortion */}
      <div 
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(0, 0, 0, 0.3) 2px,
            rgba(0, 0, 0, 0.3) 4px
          )`,
          transform: `translateY(${glitchStyle.y * 2}px)`,
        }}
      />

      {/* Horizontal glitch bar */}
      <div 
        className="fixed left-0 right-0 h-8 pointer-events-none z-20"
        style={{
          top: `${Math.random() * 100}%`,
          background: 'rgba(41, 242, 223, 0.1)',
          transform: `translateX(${glitchStyle.x * 3}px)`,
        }}
      />
    </>
  )
}
