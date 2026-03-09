'use client'

import { useEffect, useState } from 'react'

interface HexStreamProps {
  side: 'left' | 'right'
}

const generateHexCodes = (count: number): string[] => {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const hex = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0')
    codes.push(`0x${hex}`)
  }
  return codes
}

export default function HexDataStream({ side }: HexStreamProps) {
  const [hexCodes, setHexCodes] = useState<string[]>(() => generateHexCodes(100))

  useEffect(() => {
    const interval = setInterval(() => {
      setHexCodes(prev => {
        const newCode = `0x${Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0')}`
        return [...prev.slice(1), newCode]
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const positionClass = side === 'left' ? 'left-4' : 'right-4'
  const textAlign = side === 'left' ? 'text-left' : 'text-right'

  return (
    <div 
      className={`fixed top-0 bottom-0 ${positionClass} w-24 md:w-32 overflow-hidden pointer-events-none z-20`}
      style={{ opacity: 0.4 }}
    >
      <div 
        className="animate-hex-scroll flex flex-col gap-1 py-4"
        style={{
          animationDuration: '30s',
        }}
      >
        {[...hexCodes, ...hexCodes].map((code, index) => (
          <div
            key={`${code}-${index}`}
            className={`font-orbitron text-xs md:text-sm tracking-wider ${textAlign}`}
            style={{
              color: index % 5 === 0 ? '#29F2DF' : index % 7 === 0 ? '#EF3EF1' : '#1C7FA6',
              textShadow: index % 5 === 0 ? '0 0 5px #29F2DF' : 'none',
            }}
          >
            {code}
          </div>
        ))}
      </div>
    </div>
  )
}
