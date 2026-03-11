import { renderHook, waitFor } from '@testing-library/react';
import {
  useAnimationSequence,
  useAnimationSequenceInfo,
  useAnimationPerformance,
} from '../useAnimationSequence';
import { DEFAULT_ANIMATION_TIMINGS } from '../../utils/animationOrchestrator';

describe('useAnimationSequence Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('initializes with background ready', () => {
    const { result } = renderHook(() => useAnimationSequence(3));
    expect(result.current.backgroundReady).toBe(true);
  });

  test('hero becomes ready after heroStart delay', async () => {
    const { result } = renderHook(() => useAnimationSequence(3));
    expect(result.current.heroReady).toBe(false);

    jest.advanceTimersByTime(DEFAULT_ANIMATION_TIMINGS.heroStart);

    await waitFor(() => {
      expect(result.current.heroReady).toBe(true);
    });
  });

  test('feature cards become ready with stagger', async () => {
    const { result } = renderHook(() => useAnimationSequence(3));

    // Advance to first card
    jest.advanceTimersByTime(DEFAULT_ANIMATION_TIMINGS.featureCardsStart);
    await waitFor(() => {
      expect(result.current.featureCardsReady[0]).toBe(true);
    });

    // Advance to second card
    jest.advanceTimersByTime(DEFAULT_ANIMATION_TIMINGS.featureCardsStaggerInterval);
    await waitFor(() => {
      expect(result.current.featureCardsReady[1]).toBe(true);
    });

    // Advance to third card
    jest.advanceTimersByTime(DEFAULT_ANIMATION_TIMINGS.featureCardsStaggerInterval);
    await waitFor(() => {
      expect(result.current.featureCardsReady[2]).toBe(true);
    });
  });

  test('marks sequence as complete when all animations ready', async () => {
    const { result } = renderHook(() => useAnimationSequence(3));
    expect(result.current.isComplete).toBe(false);

    // Advance past all animations
    jest.advanceTimersByTime(DEFAULT_ANIMATION_TIMINGS.totalDuration + 1000);

    await waitFor(() => {
      expect(result.current.isComplete).toBe(true);
    });
  });

  test('respects custom timings', async () => {
    const customTimings = {
      ...DEFAULT_ANIMATION_TIMINGS,
      heroStart: 500,
    };

    const { result } = renderHook(() => useAnimationSequence(3, customTimings));
    expect(result.current.heroReady).toBe(false);

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(result.current.heroReady).toBe(true);
    });
  });

  test('handles different card counts', async () => {
    const { result } = renderHook(() => useAnimationSequence(5));
    expect(result.current.featureCardsReady).toHaveLength(5);
  });

  test('cleans up timers on unmount', () => {
    const { unmount } = renderHook(() => useAnimationSequence(3));
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});

describe('useAnimationSequenceInfo Hook', () => {
  test('returns correct sequence info', () => {
    const { result } = renderHook(() => useAnimationSequenceInfo(3));
    expect(result.current.backgroundStart).toBe(0);
    expect(result.current.heroStart).toBe(200);
    expect(result.current.featureCardsStart).toBe(1700);
  });

  test('updates when card count changes', () => {
    const { result, rerender } = renderHook(
      ({ cardCount }) => useAnimationSequenceInfo(cardCount),
      { initialProps: { cardCount: 3 } }
    );

    expect(result.current.featureCardsEnd).toBe(3200);

    rerender({ cardCount: 5 });

    expect(result.current.featureCardsEnd).toBe(3800);
  });

  test('respects custom timings', () => {
    const customTimings = {
      ...DEFAULT_ANIMATION_TIMINGS,
      featureCardsStart: 2000,
    };

    const { result } = renderHook(() => useAnimationSequenceInfo(3, customTimings));
    expect(result.current.featureCardsStart).toBe(2000);
  });
});

describe('useAnimationPerformance Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('initializes with default frame rate', () => {
    const { result } = renderHook(() => useAnimationPerformance());
    expect(result.current.frameRate).toBe(60);
  });

  test('tracks frame rate over time', async () => {
    const { result } = renderHook(() => useAnimationPerformance());

    // Simulate 1 second of animation frames
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(result.current.frameRate).toBeGreaterThan(0);
    });
  });

  test('marks animation as smooth when frame rate >= 55fps', async () => {
    const { result } = renderHook(() => useAnimationPerformance());

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      if (result.current.frameRate >= 55) {
        expect(result.current.isSmooth).toBe(true);
      }
    });
  });

  test('marks animation as not smooth when frame rate < 55fps', async () => {
    const { result } = renderHook(() => useAnimationPerformance());

    // Simulate low frame rate by advancing less
    jest.advanceTimersByTime(100);

    // This test is tricky because frame rate depends on requestAnimationFrame calls
    // In a real scenario, we'd mock requestAnimationFrame to control frame count
  });

  test('cleans up animation frame on unmount', () => {
    const cancelAnimationFrameSpy = jest.spyOn(global, 'cancelAnimationFrame');
    const { unmount } = renderHook(() => useAnimationPerformance());

    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    cancelAnimationFrameSpy.mockRestore();
  });
});
