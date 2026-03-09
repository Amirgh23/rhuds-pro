'use client'

interface SecurityBracketProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  size?: number
  color?: string
}

export default function SecurityBracket({ 
  position, 
  size = 20, 
  color = '#29F2DF' 
}: SecurityBracketProps) {
  const getStyles = () => {
    switch (position) {
      case 'top-left':
        return {
          top: -1,
          left: -1,
          borderTop: `2px solid ${color}`,
          borderLeft: `2px solid ${color}`,
          borderTopLeftRadius: 4,
        }
      case 'top-right':
        return {
          top: -1,
          right: -1,
          borderTop: `2px solid ${color}`,
          borderRight: `2px solid ${color}`,
          borderTopRightRadius: 4,
        }
      case 'bottom-left':
        return {
          bottom: -1,
          left: -1,
          borderBottom: `2px solid ${color}`,
          borderLeft: `2px solid ${color}`,
          borderBottomLeftRadius: 4,
        }
      case 'bottom-right':
        return {
          bottom: -1,
          right: -1,
          borderBottom: `2px solid ${color}`,
          borderRight: `2px solid ${color}`,
          borderBottomRightRadius: 4,
        }
    }
  }

  return (
    <div
      className="absolute animate-corner-bracket"
      style={{
        width: size,
        height: size,
        ...getStyles(),
      }}
    />
  )
}
