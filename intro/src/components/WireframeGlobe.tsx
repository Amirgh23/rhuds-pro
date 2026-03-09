'use client'

import { useEffect, useRef } from 'react'

export default function WireframeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let rotation = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const drawGlobe = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) * 0.35

      // Draw multiple wireframe spheres
      for (let layer = 0; layer < 3; layer++) {
        const layerRadius = radius * (0.8 + layer * 0.15)
        const layerRotation = rotation * (1 - layer * 0.2)
        const opacity = 0.15 - layer * 0.03

        // Latitude lines
        ctx.strokeStyle = `rgba(41, 242, 223, ${opacity})`
        ctx.lineWidth = 0.5

        for (let lat = -80; lat <= 80; lat += 20) {
          const latRad = (lat * Math.PI) / 180
          const y = centerY + layerRadius * Math.sin(latRad) * 0.5
          const r = layerRadius * Math.cos(latRad)

          ctx.beginPath()
          for (let lng = 0; lng <= 360; lng += 5) {
            const lngRad = ((lng + layerRotation) * Math.PI) / 180
            const x = centerX + r * Math.sin(lngRad)
            const z = r * Math.cos(lngRad)

            if (lng === 0) {
              ctx.moveTo(x, y + z * 0.3)
            } else {
              ctx.lineTo(x, y + z * 0.3)
            }
          }
          ctx.closePath()
          ctx.stroke()
        }

        // Longitude lines
        for (let lng = 0; lng < 360; lng += 30) {
          const lngRad = ((lng + layerRotation) * Math.PI) / 180

          ctx.beginPath()
          for (let lat = -90; lat <= 90; lat += 5) {
            const latRad = (lat * Math.PI) / 180
            const x = centerX + layerRadius * Math.cos(latRad) * Math.sin(lngRad)
            const y = centerY + layerRadius * Math.sin(latRad) * 0.5
            const z = layerRadius * Math.cos(latRad) * Math.cos(lngRad)

            if (lat === -90) {
              ctx.moveTo(x, y + z * 0.3)
            } else {
              ctx.lineTo(x, y + z * 0.3)
            }
          }
          ctx.stroke()
        }
      }

      // Draw grid nodes (points)
      for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2 + rotation * 0.5
        const dist = radius * (0.5 + Math.random() * 0.5)
        const x = centerX + Math.cos(angle) * dist
        const y = centerY + Math.sin(angle) * dist * 0.5

        ctx.fillStyle = `rgba(41, 242, 223, ${0.3 + Math.random() * 0.3})`
        ctx.beginPath()
        ctx.arc(x, y, 1 + Math.random(), 0, Math.PI * 2)
        ctx.fill()
      }

      // Central glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      gradient.addColorStop(0, 'rgba(41, 242, 223, 0.05)')
      gradient.addColorStop(0.5, 'rgba(28, 127, 166, 0.02)')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      rotation += 0.3
      animationId = requestAnimationFrame(drawGlobe)
    }

    drawGlobe()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
