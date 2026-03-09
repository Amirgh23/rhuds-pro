'use client'

import { useState, useEffect } from 'react'

interface BootSequenceProps {
  onComplete: () => void
  duration?: number
}

const bootMessages = [
  'INITIALIZING QUANTUM CORE...',
  'LOADING SECURITY PROTOCOLS...',
  'ESTABLISHING SECURE CHANNEL...',
  'VERIFYING BIOMETRIC DATA...',
  'DECRYPTING ACCESS MATRIX...',
  'SYNCING TEMPORAL DATABASE...',
  'CALIBRATING NEURAL INTERFACE...',
  'SYSTEM READY',
]

export default function BootSequence({ onComplete, duration = 4000 }: BootSequenceProps) {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  // Generate session ID and date only on client - use lazy initialization
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return '------'
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  })
  const [currentDate] = useState(() => {
    if (typeof window === 'undefined') return '----/--/--'
    return new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const messageInterval = duration / bootMessages.length
    let messageIndex = 0

    const msgTimer = setInterval(() => {
      messageIndex++
      if (messageIndex < bootMessages.length) {
        setCurrentMessage(messageIndex)
      }
    }, messageInterval)

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          return 100
        }
        return prev + 2
      })
    }, duration / 50)

    const completeTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 500)
    }, duration)

    return () => {
      clearInterval(msgTimer)
      clearInterval(progressTimer)
      clearTimeout(completeTimer)
    }
  }, [duration, onComplete])

  if (!visible) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${progress >= 100 ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: 'radial-gradient(ellipse at center, #0d1a30 0%, #0A1225 100%)' }}
    >
      {/* Spinning Rings */}
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Outer ring */}
        <div 
          className="absolute inset-0 rounded-full border-2 border-[#29F2DF]/30 animate-ring-rotate"
          style={{
            boxShadow: '0 0 20px rgba(41, 242, 223, 0.2), inset 0 0 20px rgba(41, 242, 223, 0.1)',
          }}
        >
          {/* Ring segments */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: i % 2 === 0 ? '#29F2DF' : '#EF3EF1',
                boxShadow: `0 0 10px ${i % 2 === 0 ? '#29F2DF' : '#EF3EF1'}`,
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 45}deg) translateY(-160px) translateX(-50%)`,
              }}
            />
          ))}
        </div>

        {/* Second ring */}
        <div 
          className="absolute inset-8 rounded-full border border-[#1C7FA6]/40 animate-ring-rotate-reverse"
          style={{
            boxShadow: '0 0 15px rgba(28, 127, 166, 0.2)',
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-6"
              style={{
                background: 'linear-gradient(to bottom, #1C7FA6, transparent)',
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 60}deg) translateY(-130px) translateX(-50%)`,
              }}
            />
          ))}
        </div>

        {/* Third ring */}
        <div 
          className="absolute inset-16 rounded-full border border-[#EF3EF1]/30 animate-ring-rotate-slow"
          style={{
            boxShadow: '0 0 15px rgba(239, 62, 241, 0.15)',
          }}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#EF3EF1]"
              style={{
                boxShadow: '0 0 5px #EF3EF1',
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 30}deg) translateY(-95px) translateX(-50%)`,
              }}
            />
          ))}
        </div>

        {/* Inner ring */}
        <div 
          className="absolute inset-24 rounded-full border border-[#29F2DF]/50 animate-ring-rotate"
          style={{
            animationDuration: '2s',
            boxShadow: '0 0 20px rgba(41, 242, 223, 0.3)',
          }}
        />

        {/* Center core */}
        <div 
          className="absolute inset-32 rounded-full animate-boot-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(41, 242, 223, 0.3) 0%, rgba(41, 242, 223, 0.1) 50%, transparent 70%)',
            boxShadow: '0 0 30px rgba(41, 242, 223, 0.4)',
          }}
        />

        {/* Center hexagon */}
        <svg 
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          style={{ animation: 'ringRotate 10s linear infinite' }}
        >
          <polygon
            points="50,15 85,35 85,65 50,85 15,65 15,35"
            fill="none"
            stroke="#29F2DF"
            strokeWidth="0.5"
            strokeDasharray="3 2"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Boot text */}
      <div className="absolute bottom-32 left-0 right-0 text-center">
        <div className="font-orbitron text-sm text-[#29F2DF] mb-4 animate-pulse">
          {bootMessages[currentMessage]}
        </div>
        
        {/* Progress bar */}
        <div className="mx-auto w-64 h-1 bg-[#28125A] rounded overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#1C7FA6] via-[#29F2DF] to-[#EF3EF1] transition-all duration-100"
            style={{ 
              width: `${progress}%`,
              boxShadow: '0 0 10px rgba(41, 242, 223, 0.5)',
            }}
          />
        </div>
        <div className="font-rajdhani text-xs text-[#1C7FA6] mt-2">
          {progress.toFixed(0)}% COMPLETE
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 text-left">
        <div className="font-orbitron text-xs text-[#29F2DF] opacity-70">NEXUS TERMINAL v3.7.1</div>
        <div className="font-rajdhani text-xs text-[#1C7FA6]">SECURE BOOT MODE</div>
      </div>

      <div className="absolute top-8 right-8 text-right">
        <div className="font-orbitron text-xs text-[#29F2DF] opacity-70">
          {currentDate}
        </div>
        <div className="font-rajdhani text-xs text-[#1C7FA6]">SESSION: {sessionId}</div>
      </div>
    </div>
  )
}
