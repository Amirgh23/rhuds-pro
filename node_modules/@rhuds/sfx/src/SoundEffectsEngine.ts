/**
 * Sound Effects Engine
 * Manages Web Audio API for playing sound effects with volume control
 */

export type SoundEffectName = 'click' | 'hover' | 'success' | 'error' | 'open' | 'close'

export interface SoundEffectOptions {
  volume?: number
  delay?: number
}

export interface SoundEffectsEngineConfig {
  enabled?: boolean
  volume?: number
}

class SoundEffectsEngine {
  private audioContext: AudioContext | null = null
  private audioBuffers: Map<SoundEffectName, AudioBuffer> = new Map()
  private enabled: boolean = true
  private globalVolume: number = 1
  private isInitialized: boolean = false

  constructor(config?: SoundEffectsEngineConfig) {
    this.enabled = config?.enabled ?? true
    this.globalVolume = Math.max(0, Math.min(1, config?.volume ?? 1))
  }

  /**
   * Initialize the audio context
   */
  private initializeAudioContext(): void {
    if (this.audioContext) return

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      this.audioContext = new AudioContextClass()
      this.isInitialized = true
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
      this.isInitialized = false
    }
  }

  /**
   * Get or create audio context
   */
  private getAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      this.initializeAudioContext()
    }
    return this.audioContext
  }

  /**
   * Register a sound effect from audio data
   */
  registerSoundEffect(
    name: SoundEffectName,
    audioData: ArrayBuffer
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const audioContext = this.getAudioContext()
      if (!audioContext) {
        reject(new Error('Audio context not available'))
        return
      }

      audioContext.decodeAudioData(
        audioData,
        (buffer) => {
          this.audioBuffers.set(name, buffer)
          resolve()
        },
        (error) => {
          console.error(`Failed to decode audio for ${name}:`, error)
          reject(error)
        }
      )
    })
  }

  /**
   * Play a sound effect
   */
  async playSoundEffect(
    effectName: SoundEffectName,
    options?: SoundEffectOptions
  ): Promise<void> {
    if (!this.enabled) {
      return Promise.resolve()
    }

    const audioContext = this.getAudioContext()
    if (!audioContext) {
      return Promise.resolve()
    }

    const audioBuffer = this.audioBuffers.get(effectName)
    if (!audioBuffer) {
      console.warn(`Sound effect not found: ${effectName}`)
      return Promise.resolve()
    }

    const userVolume = Math.max(0, Math.min(1, options?.volume ?? 1))
    const effectiveVolume = userVolume * this.globalVolume
    const delay = Math.max(0, options?.delay ?? 0)

    return new Promise((resolve) => {
      const playSound = () => {
        try {
          const source = audioContext.createBufferSource()
          const gainNode = audioContext.createGain()

          source.buffer = audioBuffer
          gainNode.gain.value = effectiveVolume
          source.connect(gainNode)
          gainNode.connect(audioContext.destination)

          source.start(0)

          const duration = audioBuffer.duration * 1000
          setTimeout(resolve, duration)
        } catch (error) {
          console.error(`Failed to play sound effect ${effectName}:`, error)
          resolve()
        }
      }

      if (delay > 0) {
        setTimeout(playSound, delay)
      } else {
        playSound()
      }
    })
  }

  /**
   * Set global volume
   */
  setVolume(volume: number): void {
    this.globalVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Get global volume
   */
  getVolume(): number {
    return this.globalVolume
  }

  /**
   * Enable/disable sound effects
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * Check if sound effects are enabled
   */
  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Check if audio context is initialized
   */
  isAudioContextInitialized(): boolean {
    return this.isInitialized && this.audioContext !== null
  }

  /**
   * Resume audio context if suspended
   */
  async resumeAudioContext(): Promise<void> {
    const audioContext = this.getAudioContext()
    if (audioContext && audioContext.state === 'suspended') {
      try {
        await audioContext.resume()
      } catch (error) {
        console.warn('Failed to resume audio context:', error)
      }
    }
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.audioBuffers.clear()
    this.isInitialized = false
  }
}

// Create singleton instance
let instance: SoundEffectsEngine | null = null

/**
 * Get or create the sound effects engine instance
 */
export function getSoundEffectsEngine(
  config?: SoundEffectsEngineConfig
): SoundEffectsEngine {
  if (!instance) {
    instance = new SoundEffectsEngine(config)
  }
  return instance
}

/**
 * Reset the sound effects engine (mainly for testing)
 */
export function resetSoundEffectsEngine(): void {
  if (instance) {
    instance.dispose()
    instance = null
  }
}

export default SoundEffectsEngine
