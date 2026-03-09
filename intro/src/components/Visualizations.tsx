'use client'

import { useEffect, useState, useRef } from 'react'

// Network Traffic Graph
export function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [data, setData] = useState<number[]>(Array(50).fill(0))

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newValue = Math.random() * 100
        return [...prev.slice(1), newValue]
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 200
    canvas.height = 60

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = 'rgba(41, 242, 223, 0.1)'
    ctx.lineWidth = 0.5
    for (let i = 0; i < 5; i++) {
      const y = (canvas.height / 4) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw data line
    ctx.strokeStyle = '#29F2DF'
    ctx.lineWidth = 1.5
    ctx.beginPath()

    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * canvas.width
      const y = canvas.height - (value / 100) * canvas.height

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Glow effect
    ctx.shadowColor = '#29F2DF'
    ctx.shadowBlur = 10
    ctx.stroke()
    ctx.shadowBlur = 0

    // Fill under line
    ctx.lineTo(canvas.width, canvas.height)
    ctx.lineTo(0, canvas.height)
    ctx.closePath()
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, 'rgba(41, 242, 223, 0.3)')
    gradient.addColorStop(1, 'rgba(41, 242, 223, 0)')
    ctx.fillStyle = gradient
    ctx.fill()
  }, [data])

  return (
    <div className="absolute bottom-4 left-4 glass-effect p-3 rounded" style={{ width: 220 }}>
      <div className="font-orbitron text-xs text-[#29F2DF] mb-2 opacity-70">NETWORK TRAFFIC</div>
      <canvas ref={canvasRef} className="w-full" />
      <div className="flex justify-between font-rajdhani text-xs text-[#1C7FA6] mt-1">
        <span>IN: {(Math.random() * 100).toFixed(1)} Mb/s</span>
        <span>OUT: {(Math.random() * 50).toFixed(1)} Mb/s</span>
      </div>
    </div>
  )
}

// CPU Load Bars
export function CPULoadBars() {
  const [loads, setLoads] = useState([45, 62, 38, 71, 55, 48, 80, 33])

  useEffect(() => {
    const interval = setInterval(() => {
      setLoads(loads.map(() => Math.floor(Math.random() * 100)))
    }, 500)

    return () => clearInterval(interval)
  }, [loads])

  return (
    <div className="absolute top-4 right-4 glass-effect p-3 rounded" style={{ width: 180 }}>
      <div className="font-orbitron text-xs text-[#29F2DF] mb-2 opacity-70">CPU CORES</div>
      <div className="grid grid-cols-4 gap-1">
        {loads.map((load, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-full h-16 bg-[#28125A]/30 rounded relative overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-300"
                style={{
                  height: `${load}%`,
                  background: load > 80 
                    ? 'linear-gradient(to top, #EF3EF1, #EF3EF180)' 
                    : 'linear-gradient(to top, #29F2DF, #29F2DF80)',
                  boxShadow: load > 80 
                    ? '0 0 10px #EF3EF1' 
                    : '0 0 10px #29F2DF',
                }}
              />
            </div>
            <span className="font-rajdhani text-xs text-[#1C7FA6] mt-1">{load}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Signal Strength Meter
export function SignalMeter() {
  const [strength, setStrength] = useState(85)

  useEffect(() => {
    const interval = setInterval(() => {
      setStrength(70 + Math.random() * 30)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute top-4 left-4 glass-effect p-3 rounded">
      <div className="font-orbitron text-xs text-[#29F2DF] mb-2 opacity-70">SIGNAL</div>
      <div className="flex items-end gap-1 h-8">
        {[20, 40, 60, 80, 100].map((threshold) => (
          <div
            key={threshold}
            className="w-2 transition-all duration-300"
            style={{
              height: `${threshold / 3}%`,
              backgroundColor: strength >= threshold ? '#29F2DF' : '#28125A',
              boxShadow: strength >= threshold ? '0 0 5px #29F2DF' : 'none',
            }}
          />
        ))}
      </div>
      <div className="font-rajdhani text-sm text-[#1C7FA6] mt-1">{strength.toFixed(0)}%</div>
    </div>
  )
}

// Data Throughput Indicator
export function DataThroughput() {
  const [throughput, setThroughput] = useState({ up: 0, down: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setThroughput({
        up: Math.random() * 500,
        down: Math.random() * 1000,
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute bottom-4 right-4 glass-effect p-3 rounded">
      <div className="font-orbitron text-xs text-[#29F2DF] mb-2 opacity-70">THROUGHPUT</div>
      <div className="flex gap-4">
        <div className="text-center">
          <div className="font-rajdhani text-lg text-[#29F2DF]">↑ {throughput.up.toFixed(0)}</div>
          <div className="font-rajdhani text-xs text-[#1C7FA6]">KB/s UP</div>
        </div>
        <div className="text-center">
          <div className="font-rajdhani text-lg text-[#EF3EF1]">↓ {throughput.down.toFixed(0)}</div>
          <div className="font-rajdhani text-xs text-[#1C7FA6]">KB/s DOWN</div>
        </div>
      </div>
    </div>
  )
}

// System Status Display
export function SystemStatus() {
  const [status, setStatus] = useState<string[]>([
    'KERNEL: ONLINE',
    'SECURITY: ACTIVE',
    'NETWORK: CONNECTED',
    'SHIELD: ENABLED',
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = [
        'KERNEL: ONLINE',
        'SECURITY: ACTIVE', 
        'NETWORK: CONNECTED',
        'SHIELD: ENABLED',
        'MEMORY: OPTIMAL',
        'PROTOCOL: SECURE',
      ]
      setStatus([
        statuses[Math.floor(Math.random() * statuses.length)],
        statuses[Math.floor(Math.random() * statuses.length)],
        statuses[Math.floor(Math.random() * statuses.length)],
        statuses[Math.floor(Math.random() * statuses.length)],
      ])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 glass-effect p-3 rounded">
      <div className="font-orbitron text-xs text-[#29F2DF] mb-2 opacity-70">SYSTEM</div>
      <div className="space-y-1">
        {status.map((s, i) => (
          <div key={i} className="font-rajdhani text-xs text-[#1C7FA6] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#29F2DF] animate-pulse" />
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}

// All visualizations combined
export default function Visualizations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      <div className="pointer-events-auto">
        <NetworkGraph />
        <CPULoadBars />
        <SignalMeter />
        <DataThroughput />
        <SystemStatus />
      </div>
    </div>
  )
}
