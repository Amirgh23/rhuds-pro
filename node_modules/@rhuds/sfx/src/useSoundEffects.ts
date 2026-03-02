import React from 'react'
import { getSoundEffectsEngine, SoundEffectName, SoundEffectOptions } from './SoundEffectsEngine'

export interface UseSoundEffectsReturn {
  play: (effectName: SoundEffectName, options?: SoundEffectOptions) => Promise<void>
  setVolume: (volume: number) => void
  getVolume: () => number
  setEnabled: (enabled: boolean) => void
  isEnabled: () => boolean
}

/**
 * React hook for playing sound effects
 * 
 * @returns Object with play function and volume control methods
 * 
 * @example
 * const { play, setVolume } = useSoundEffects()
 * 
 * const handleClick = async () => {
 *   await play('click')
 * }
 */
export function useSoundEffects(): UseSoundEffectsReturn {
  const engineRef = React.useRef(getSoundEffectsEngine())

  const play = React.useCallback(
    async (effectName: SoundEffectName, options?: SoundEffectOptions) => {
      return engineRef.current.playSoundEffect(effectName, options)
    },
    []
  )

  const setVolume = React.useCallback((volume: number) => {
    engineRef.current.setVolume(volume)
  }, [])

  const getVolume = React.useCallback(() => {
    return engineRef.current.getVolume()
  }, [])

  const setEnabled = React.useCallback((enabled: boolean) => {
    engineRef.current.setEnabled(enabled)
  }, [])

  const isEnabled = React.useCallback(() => {
    return engineRef.current.isEnabled()
  }, [])

  return {
    play,
    setVolume,
    getVolume,
    setEnabled,
    isEnabled,
  }
}
