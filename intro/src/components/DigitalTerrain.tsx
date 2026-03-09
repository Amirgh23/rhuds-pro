'use client'

import { useEffect, useRef } from 'react'

export default function DigitalTerrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let offset = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const horizonY = canvas.height * 0.35
      const gridLines = 30
      const gridSpacing = 40

      // Draw horizontal lines with perspective
      ctx.strokeStyle = 'rgba(41, 242, 223, 0.15)'
      ctx.lineWidth = 1

      for (let i = 0; i < gridLines; i++) {
        const progress = i / gridLines
        const y = horizonY + (canvas.height - horizonY) * Math.pow(progress, 1.5)
        const perspectiveScale = 1 - progress * 0.8
        
        ctx.globalAlpha = perspectiveScale * 0.5
        
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw vertical lines with perspective
      const centerX = canvas.width / 2
      const verticalLines = 40

      for (let i = -verticalLines; i <= verticalLines; i++) {
        const xOffset = (i * gridSpacing + offset) % (gridSpacing * 2) - gridSpacing
        const startX = centerX + xOffset * 0.1
        const endX = centerX + xOffset * 5

        ctx.globalAlpha = 0.2 - Math.abs(i) * 0.005
        
        ctx.beginPath()
        ctx.moveTo(startX, horizonY)
        ctx.lineTo(endX, canvas.height)
        ctx.stroke()
      }

      // Draw moving data points on grid
      ctx.globalAlpha = 1
      for (let i = 0; i < 15; i++) {
        const time = Date.now() * 0.001
        const progress = ((time * 0.1 + i * 0.2) % 1)
        const y = horizonY + (canvas.height - horizonY) * Math.pow(progress, 1.5)
        const x = centerX + Math.sin(i * 2.5 + time) * (100 + progress * 200)
        
        const size = 2 + progress * 2
        const alpha = (1 - progress) * 0.8

        ctx.fillStyle = `rgba(41, 242, 223, ${alpha})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()

        // Glow effect
        ctx.fillStyle = `rgba(41, 242, 223, ${alpha * 0.3})`
        ctx.beginPath()
        ctx.arc(x, y, size * 2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Horizon glow
      const gradient = ctx.createLinearGradient(0, horizonY - 50, 0, horizonY + 100)
      gradient.addColorStop(0, 'transparent')
      gradient.addColorStop(0.5, 'rgba(41, 242, 223, 0.05)')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fillRect(0, horizonY - 50, canvas.width, 150)

      offset = (offset + 0.5) % gridSpacing
      animationId = requestAnimationFrame(drawGrid)
    }

    drawGrid()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-5"
      style={{ opacity: 0.6 }}
    />
  )
}
