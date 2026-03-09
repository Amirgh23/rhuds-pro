'use client'

import { useEffect, useState } from 'react'

export default function ScanningLines() {
  const [lines, setLines] = useState<{ id: number; y: number; opacity: number }[]>([])

  useEffect(() => {
    let lineId = 0
    
    const createLine = () => {
      const newLine = {
        id: lineId++,
        y: -5,
        opacity: 0.8,
      }
      setLines(prev => [...prev, newLine])

      // Animate the line
      let y = -5
      const animate = () => {
        y += 2
        if (y > 105) {
          setLines(prev => prev.filter(l => l.id !== newLine.id))
          return
        }
        
        const opacity = y < 50 ? y / 50 * 0.8 : (100 - y) / 50 * 0.8
        setLines(prev => prev.map(l => 
          l.id === newLine.id ? { ...l, y, opacity } : l
        ))
        requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }

    const interval = setInterval(createLine, 3000)
    createLine() // Create first line immediately

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {lines.map(line => (
        <div
          key={line.id}
          className="absolute left-0 right-0 h-px"
          style={{
            top: `${line.y}%`,
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(41, 242, 223, 0.1) 20%,
              rgba(41, 242, 223, ${line.opacity}) 50%,
              rgba(41, 242, 223, 0.1) 80%,
              transparent 100%
            )`,
            boxShadow: `0 0 20px rgba(41, 242, 223, ${line.opacity * 0.5})`,
          }}
        />
      ))}
    </div>
  )
}
