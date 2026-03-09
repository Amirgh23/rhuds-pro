'use client'

import { useEffect, useRef, useState } from 'react'

export default function AudioWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    canvas.width = 300
    canvas.height = 40

    const bars = 32
    const barWidth = canvas.width / bars - 2
    const data = new Array(bars).fill(0)
    const targetData = new Array(bars).fill(0)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Generate new target values
      if (isActive) {
        for (let i = 0; i < bars; i++) {
          targetData[i] = Math.random() * 0.8 + 0.1
        }
      }

      // Smooth animation towards target
      for (let i = 0; i < bars; i++) {
        data[i] += (targetData[i] - data[i]) * 0.15
      }

      // Draw bars
      for (let i = 0; i < bars; i++) {
        const x = i * (barWidth + 2)
        const height = data[i] * canvas.height
        const hue = 180 + (i / bars) * 60 // Cyan to blue gradient

        // Bar gradient
        const gradient = ctx.createLinearGradient(x, canvas.height, x, canvas.height - height)
        gradient.addColorStop(0, `hsla(${hue}, 80%, 50%, 0.3)`)
        gradient.addColorStop(1, `hsla(${hue}, 80%, 60%, 0.8)`)

        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - height, barWidth, height)

        // Glow effect on high bars
        if (data[i] > 0.6) {
          ctx.shadowColor = `hsla(${hue}, 80%, 60%, 0.5)`
          ctx.shadowBlur = 10
          ctx.fillRect(x, canvas.height - height, barWidth, height)
          ctx.shadowBlur = 0
        }

        // Center line
        ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${data[i]})`
        ctx.fillRect(x, canvas.height / 2 - 1, barWidth, 2)
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isActive])

  return (
    <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 glass-effect px-4 py-2 rounded pointer-events-auto z-20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#29F2DF] animate-pulse' : 'bg-[#28125A]'}`} 
                style={{ boxShadow: isActive ? '0 0 5px #29F2DF' : 'none' }} />
          <span className="font-orbitron text-xs text-[#29F2DF] opacity-70">AUDIO SYNC</span>
        </div>
        <canvas ref={canvasRef} className="opacity-80" />
        <button 
          onClick={() => setIsActive(!isActive)}
          className="font-rajdhani text-xs text-[#1C7FA6] hover:text-[#29F2DF] transition-colors"
        >
          {isActive ? 'MUTE' : 'UNMUTE'}
        </button>
      </div>
    </div>
  )
}
