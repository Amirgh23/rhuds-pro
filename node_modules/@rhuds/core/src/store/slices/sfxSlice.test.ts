import sfxReducer, {
  setEnabled,
  setVolume,
  toggleEnabled,
  loadSFXFromStorage,
  SFXState,
} from './sfxSlice'

describe('sfxSlice', () => {
  const initialState: SFXState = {
    enabled: true,
    volume: 1,
  }

  beforeEach(() => {
    localStorage.clear()
  })

  it('returns initial state', () => {
    expect(sfxReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('handles setEnabled', () => {
    const actual = sfxReducer(initialState, setEnabled(false))
    expect(actual.enabled).toEqual(false)
  })

  it('handles setVolume', () => {
    const actual = sfxReducer(initialState, setVolume(0.5))
    expect(actual.volume).toEqual(0.5)
  })

  it('clamps volume to 0-1 range', () => {
    let state = sfxReducer(initialState, setVolume(1.5))
    expect(state.volume).toEqual(1)

    state = sfxReducer(initialState, setVolume(-0.5))
    expect(state.volume).toEqual(0)
  })

  it('handles toggleEnabled', () => {
    let state = sfxReducer(initialState, toggleEnabled())
    expect(state.enabled).toEqual(false)

    state = sfxReducer(state, toggleEnabled())
    expect(state.enabled).toEqual(true)
  })

  it('handles loadSFXFromStorage', () => {
    localStorage.setItem('rhuds-sfx-enabled', 'false')
    localStorage.setItem('rhuds-sfx-volume', '0.7')

    const actual = sfxReducer(initialState, loadSFXFromStorage())
    expect(actual.enabled).toEqual(false)
    expect(actual.volume).toEqual(0.7)
  })

  it('ignores invalid volume from storage', () => {
    localStorage.setItem('rhuds-sfx-volume', '1.5')

    const actual = sfxReducer(initialState, loadSFXFromStorage())
    expect(actual.volume).toEqual(1)
  })

  it('persists enabled state to localStorage', () => {
    sfxReducer(initialState, setEnabled(false))
    expect(localStorage.getItem('rhuds-sfx-enabled')).toEqual('false')
  })

  it('persists volume to localStorage', () => {
    sfxReducer(initialState, setVolume(0.6))
    expect(localStorage.getItem('rhuds-sfx-volume')).toEqual('0.6')
  })
})
