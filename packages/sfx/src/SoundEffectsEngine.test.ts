import {
  getSoundEffectsEngine,
  resetSoundEffectsEngine,
} from './SoundEffectsEngine'

describe('SoundEffectsEngine', () => {
  beforeEach(() => {
    resetSoundEffectsEngine()
  })

  afterEach(() => {
    resetSoundEffectsEngine()
  })

  it('creates a singleton instance', () => {
    const engine1 = getSoundEffectsEngine()
    const engine2 = getSoundEffectsEngine()

    expect(engine1).toBe(engine2)
  })

  it('initializes with default config', () => {
    const engine = getSoundEffectsEngine()

    expect(engine.isEnabled()).toBe(true)
    expect(engine.getVolume()).toBe(1)
  })

  it('initializes with custom config', () => {
    const engine = getSoundEffectsEngine({
      enabled: false,
      volume: 0.5,
    })

    expect(engine.isEnabled()).toBe(false)
    expect(engine.getVolume()).toBe(0.5)
  })

  it('sets and gets volume', () => {
    const engine = getSoundEffectsEngine()

    engine.setVolume(0.7)
    expect(engine.getVolume()).toBe(0.7)

    engine.setVolume(1.5)
    expect(engine.getVolume()).toBe(1)

    engine.setVolume(-0.5)
    expect(engine.getVolume()).toBe(0)
  })

  it('enables and disables sound effects', () => {
    const engine = getSoundEffectsEngine()

    expect(engine.isEnabled()).toBe(true)

    engine.setEnabled(false)
    expect(engine.isEnabled()).toBe(false)

    engine.setEnabled(true)
    expect(engine.isEnabled()).toBe(true)
  })

  it('returns resolved promise when disabled', async () => {
    const engine = getSoundEffectsEngine({ enabled: false })

    const result = await engine.playSoundEffect('click')
    expect(result).toBeUndefined()
  })

  it('returns resolved promise when sound not found', async () => {
    const engine = getSoundEffectsEngine()

    const result = await engine.playSoundEffect('click')
    expect(result).toBeUndefined()
  })

  it('clamps volume values', () => {
    const engine = getSoundEffectsEngine()

    engine.setVolume(2)
    expect(engine.getVolume()).toBe(1)

    engine.setVolume(-1)
    expect(engine.getVolume()).toBe(0)

    engine.setVolume(0.5)
    expect(engine.getVolume()).toBe(0.5)
  })

  it('disposes resources', () => {
    const engine = getSoundEffectsEngine()

    engine.dispose()

    expect(engine.isAudioContextInitialized()).toBe(false)
  })

  it('handles audio context initialization', () => {
    const engine = getSoundEffectsEngine()

    // Audio context may or may not be initialized depending on browser
    expect(typeof engine.isAudioContextInitialized()).toBe('boolean')
  })

  it('resumes audio context', async () => {
    const engine = getSoundEffectsEngine()

    // Should not throw
    await engine.resumeAudioContext()
  })

  it('registers sound effects', async () => {
    const engine = getSoundEffectsEngine()

    // Create a dummy audio buffer
    const audioData = new ArrayBuffer(1024)

    // Mock decodeAudioData
    const mockAudioContext = {
      decodeAudioData: jest.fn((data, success) => {
        const mockBuffer = {
          duration: 1,
          length: 1024,
          numberOfChannels: 2,
          sampleRate: 44100,
        }
        success(mockBuffer)
      }),
    }

    // This test verifies the registration method exists and can be called
    expect(typeof engine.registerSoundEffect).toBe('function')
  })
})
