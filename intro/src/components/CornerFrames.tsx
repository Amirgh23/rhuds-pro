'use client'

import { useEffect, useState } from 'react'

export default function CornerFrames() {
  const [time, setTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now())
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const flicker = Math.sin(time * 0.01) * 0.3 + 0.7

  return (
    <>
      {/* Top Left Frame */}
      <div className="fixed top-0 left-0 w-48 h-48 pointer-events-none z-30">
        <div 
          className="absolute top-4 left-4 w-32 h-32"
          style={{ opacity: flicker }}
        >
          {/* Horizontal line */}
          <div 
            className="absolute top-0 left-0 h-px bg-gradient-to-r from-[#29F2DF] to-transparent"
            style={{ width: '100%', boxShadow: '0 0 10px #29F2DF' }}
          />
          {/* Vertical line */}
          <div 
            className="absolute top-0 left-0 w-px bg-gradient-to-b from-[#29F2DF] to-transparent"
            style={{ height: '100%', boxShadow: '0 0 10px #29F2DF' }}
          />
          {/* Corner accent */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#29F2DF]" />
          {/* Inner frame */}
          <div className="absolute top-2 left-2 w-20 h-20 border border-[#29F2DF]/30 rounded-sm" />
          {/* Animated corner data */}
          <div className="absolute top-6 left-6 font-orbitron text-xs text-[#29F2DF]/60">
            <div>SYS.VER: 3.7.1</div>
            <div className="text-[#1C7FA6]/60 text-[10px] mt-1">BUILD: {Math.floor(time / 1000) % 10000}</div>
          </div>
        </div>
      </div>

      {/* Top Right Frame */}
      <div className="fixed top-0 right-0 w-48 h-48 pointer-events-none z-30">
        <div 
          className="absolute top-4 right-4 w-32 h-32"
          style={{ opacity: flicker }}
        >
          {/* Horizontal line */}
          <div 
            className="absolute top-0 right-0 h-px bg-gradient-to-l from-[#EF3EF1] to-transparent"
            style={{ width: '100%', boxShadow: '0 0 10px #EF3EF1' }}
          />
          {/* Vertical line */}
          <div 
            className="absolute top-0 right-0 w-px bg-gradient-to-b from-[#EF3EF1] to-transparent"
            style={{ height: '100%', boxShadow: '0 0 10px #EF3EF1' }}
          />
          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#EF3EF1]" />
          {/* Inner frame */}
          <div className="absolute top-2 right-2 w-20 h-20 border border-[#EF3EF1]/30 rounded-sm" />
          {/* Animated data */}
          <div className="absolute top-6 right-6 font-orbitron text-xs text-[#EF3EF1]/60 text-right">
            <div>NODE: ACTIVE</div>
            <div className="text-[#8B1F8C]/60 text-[10px] mt-1">LAT: {(Math.sin(time * 0.001) * 0.5 + 0.5).toFixed(3)}ms</div>
          </div>
        </div>
      </div>

      {/* Bottom Left Frame */}
      <div className="fixed bottom-0 left-0 w-48 h-48 pointer-events-none z-30">
        <div 
          className="absolute bottom-4 left-4 w-32 h-32"
          style={{ opacity: flicker }}
        >
          {/* Horizontal line */}
          <div 
            className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-[#1C7FA6] to-transparent"
            style={{ width: '100%', boxShadow: '0 0 10px #1C7FA6' }}
          />
          {/* Vertical line */}
          <div 
            className="absolute bottom-0 left-0 w-px bg-gradient-to-t from-[#1C7FA6] to-transparent"
            style={{ height: '100%', boxShadow: '0 0 10px #1C7FA6' }}
          />
          {/* Corner accent */}
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#1C7FA6]" />
          {/* Inner frame */}
          <div className="absolute bottom-2 left-2 w-20 h-20 border border-[#1C7FA6]/30 rounded-sm" />
          {/* Data display */}
          <div className="absolute bottom-6 left-6 font-orbitron text-xs text-[#1C7FA6]/60">
            <div>MEM: {Math.floor(60 + Math.sin(time * 0.002) * 20)}%</div>
            <div className="text-[#0D4A6A]/60 text-[10px] mt-1">4.2GB / 8GB</div>
          </div>
        </div>
      </div>

      {/* Bottom Right Frame */}
      <div className="fixed bottom-0 right-0 w-48 h-48 pointer-events-none z-30">
        <div 
          className="absolute bottom-4 right-4 w-32 h-32"
          style={{ opacity: flicker }}
        >
          {/* Horizontal line */}
          <div 
            className="absolute bottom-0 right-0 h-px bg-gradient-to-l from-[#29F2DF] to-transparent"
            style={{ width: '100%', boxShadow: '0 0 10px #29F2DF' }}
          />
          {/* Vertical line */}
          <div 
            className="absolute bottom-0 right-0 w-px bg-gradient-to-t from-[#29F2DF] to-transparent"
            style={{ height: '100%', boxShadow: '0 0 10px #29F2DF' }}
          />
          {/* Corner accent */}
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#29F2DF]" />
          {/* Inner frame */}
          <div className="absolute bottom-2 right-2 w-20 h-20 border border-[#29F2DF]/30 rounded-sm" />
          {/* Animated data */}
          <div className="absolute bottom-6 right-6 font-orbitron text-xs text-[#29F2DF]/60 text-right">
            <div>ENCRYPT: AES</div>
            <div className="text-[#1C7FA6]/60 text-[10px] mt-1">256-BIT</div>
          </div>
        </div>
      </div>

      {/* Connecting lines between corners */}
      <div className="fixed inset-0 pointer-events-none z-30">
        {/* Top connecting line */}
        <div 
          className="absolute top-4 left-52 right-52 h-px"
          style={{
            background: 'linear-gradient(90deg, #29F2DF 0%, transparent 20%, transparent 80%, #EF3EF1 100%)',
            opacity: 0.2,
          }}
        />
        {/* Bottom connecting line */}
        <div 
          className="absolute bottom-4 left-52 right-52 h-px"
          style={{
            background: 'linear-gradient(90deg, #1C7FA6 0%, transparent 20%, transparent 80%, #29F2DF 100%)',
            opacity: 0.2,
          }}
        />
      </div>
    </>
  )
}
