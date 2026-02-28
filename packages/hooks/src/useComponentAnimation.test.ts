import { renderHook, act } from '@testing-library/react'
import { useComponentAnimation } from './useComponentAnimation'

describe('useComponentAnimation Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('returns ref, isAnimating, and animate function', () => {
    const { result } = renderHook(() => useComponentAnimation())

    expect(result.current.ref).toBeDefined()
    expect(result.current.isAnimating).toBe(false)
    expect(typeof result.current.animate).toBe('function')
  })

  it('triggers animation on mount', () => {
    const { result } = renderHook(() => useComponentAnimation('mount', 300))

    expect(result.current.isAnimating).toBe(true)

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current.isAnimating).toBe(false)
  })

  it('does not trigger animation on mount when disabled', () => {
    const { result } = renderHook(() =>
      useComponentAnimation('mount', 300, true)
    )

    expect(result.current.isAnimating).toBe(false)
  })

  it('respects prefers-reduced-motion', () => {
    const mediaQueryList = {
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }

    window.matchMedia = jest.fn(() => mediaQueryList as any)

    const { result } = renderHook(() => useComponentAnimation('mount', 300))

    expect(result.current.isAnimating).toBe(false)
  })

  it('allows manual animation trigger', () => {
    const { result } = renderHook(() => useComponentAnimation('click', 300))

    expect(result.current.isAnimating).toBe(false)

    act(() => {
      result.current.animate()
    })

    expect(result.current.isAnimating).toBe(true)

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current.isAnimating).toBe(false)
  })

  it('uses custom duration', () => {
    const { result } = renderHook(() => useComponentAnimation('mount', 500))

    expect(result.current.isAnimating).toBe(true)

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current.isAnimating).toBe(true)

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(result.current.isAnimating).toBe(false)
  })

  it('supports different trigger types', () => {
    const triggers: Array<'mount' | 'hover' | 'click' | 'focus'> = [
      'mount',
      'hover',
      'click',
      'focus',
    ]

    triggers.forEach((trigger) => {
      const { result } = renderHook(() => useComponentAnimation(trigger, 300))

      expect(result.current.ref).toBeDefined()
      expect(typeof result.current.animate).toBe('function')
    })
  })

  it('clears timeout on unmount', () => {
    const { unmount } = renderHook(() => useComponentAnimation('mount', 300))

    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()

    clearTimeoutSpy.mockRestore()
  })

  it('does not animate when disabled', () => {
    const { result } = renderHook(() =>
      useComponentAnimation('click', 300, true)
    )

    act(() => {
      result.current.animate()
    })

    expect(result.current.isAnimating).toBe(false)
  })
})
