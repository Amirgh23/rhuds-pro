'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
  life: number
  maxLife: number
}

export default function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const particleIdRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = ['#29F2DF', '#1C7FA6', '#EF3EF1', '#28125A']

    const createParticle = (): Particle => {
      const side = Math.random() > 0.5
      return {
        id: particleIdRef.current++,
        x: side ? (Math.random() > 0.5 ? -10 : canvas.width + 10) : Math.random() * canvas.width,
        y: side ? Math.random() * canvas.height : (Math.random() > 0.5 ? -10 : canvas.height + 10),
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
        life: 0,
        maxLife: Math.random() * 200 + 100,
      }
    }

    const updateParticles = () => {
      // Add new particles
      if (particlesRef.current.length < 50 && Math.random() > 0.9) {
        particlesRef.current.push(createParticle())
      }

      // Update existing particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.speedX
        p.y += p.speedY
        p.life++

        // Fade in/out
        const lifeRatio = p.life / p.maxLife
        if (lifeRatio < 0.1) {
          p.opacity = lifeRatio * 5
        } else if (lifeRatio > 0.8) {
          p.opacity = (1 - lifeRatio) * 5
        }

        return p.life < p.maxLife && 
               p.x > -20 && p.x < canvas.width + 20 &&
               p.y > -20 && p.y < canvas.height + 20
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach(p => {
        // Draw particle glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        gradient.addColorStop(0, p.color)
        gradient.addColorStop(1, 'transparent')
        
        ctx.globalAlpha = p.opacity * 0.3
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Draw particle core
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw particle trail
        ctx.globalAlpha = p.opacity * 0.5
        ctx.strokeStyle = p.color
        ctx.lineWidth = p.size * 0.5
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x - p.speedX * 5, p.y - p.speedY * 5)
        ctx.stroke()
      })

      ctx.globalAlpha = 1
      updateParticles()
      animationId = requestAnimationFrame(draw)
    }

    // Initialize some particles
    for (let i = 0; i < 20; i++) {
      const p = createParticle()
      p.x = Math.random() * canvas.width
      p.y = Math.random() * canvas.height
      particlesRef.current.push(p)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-15"
    />
  )
}
