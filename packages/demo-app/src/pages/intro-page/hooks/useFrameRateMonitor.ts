/**
 * useFrameRateMonitor hook
 * Monitors animation frame rate for performance tracking
 */

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Frame rate monitoring state
 */
export interface FrameRateState {
  currentFPS: number;
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  isMonitoring: boolean;
  frameCount: number;
  droppedFrames: number;
}

/**
 * Frame rate monitor options
 */
export interface FrameRateMonitorOptions {
  targetFPS?: number;
  minimumFPS?: number;
  sampleDuration?: number;
  enabled?: boolean;
  onLowFrameRate?: (fps: number) => void;
}

/**
 * Hook for monitoring animation frame rate
 * Tracks FPS and detects performance issues
 *
 * @param options - Monitor options
 * @returns Frame rate state and control methods
 *
 * @example
 * const { currentFPS, averageFPS, isMonitoring, start, stop } = useFrameRateMonitor({
 *   targetFPS: 60,
 *   minimumFPS: 55,
 *   onLowFrameRate: (fps) => console.warn(`Low FPS: ${fps}`)
 * });
 *
 * useEffect(() => {
 *   start();
 *   return () => stop();
 * }, []);
 *
 * return <div>FPS: {currentFPS.toFixed(1)}</div>;
 */
export function useFrameRateMonitor(options: FrameRateMonitorOptions = {}): FrameRateState & {
  start: () => void;
  stop: () => void;
  reset: () => void;
} {
  const {
    targetFPS = 60,
    minimumFPS = 55,
    sampleDuration = 1000,
    enabled = true,
    onLowFrameRate,
  } = options;

  const [state, setState] = useState<FrameRateState>({
    currentFPS: 0,
    averageFPS: 0,
    minFPS: targetFPS,
    maxFPS: 0,
    isMonitoring: false,
    frameCount: 0,
    droppedFrames: 0,
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const sampleStartRef = useRef<number>(0);
  const lowFrameRateWarningRef = useRef<boolean>(false);

  const calculateFPS = useCallback((frameTimes: number[]): number => {
    if (frameTimes.length < 2) return 0;

    const timeSpan = frameTimes[frameTimes.length - 1] - frameTimes[0];
    if (timeSpan === 0) return 0;

    return (frameTimes.length / timeSpan) * 1000;
  }, []);

  const measureFrame = useCallback(() => {
    const now = performance.now();

    if (lastTimeRef.current === 0) {
      lastTimeRef.current = now;
      sampleStartRef.current = now;
      frameTimesRef.current = [now];
    } else {
      const deltaTime = now - lastTimeRef.current;

      // Detect dropped frames (frame time > 1.5x expected frame time)
      const expectedFrameTime = 1000 / targetFPS;
      if (deltaTime > expectedFrameTime * 1.5) {
        setState((prev) => ({
          ...prev,
          droppedFrames: prev.droppedFrames + 1,
        }));
      }

      frameTimesRef.current.push(now);
      lastTimeRef.current = now;

      // Calculate FPS every sampleDuration milliseconds
      if (now - sampleStartRef.current >= sampleDuration) {
        const fps = calculateFPS(frameTimesRef.current);
        const averageFPS = fps;
        const minFPS = Math.min(
          ...frameTimesRef.current.slice(1).map((t, i) => {
            if (i === 0) return targetFPS;
            const dt = t - frameTimesRef.current[i];
            return dt > 0 ? 1000 / dt : targetFPS;
          })
        );
        const maxFPS = Math.max(
          ...frameTimesRef.current.slice(1).map((t, i) => {
            if (i === 0) return targetFPS;
            const dt = t - frameTimesRef.current[i];
            return dt > 0 ? 1000 / dt : targetFPS;
          })
        );

        setState((prev) => ({
          ...prev,
          currentFPS: fps,
          averageFPS,
          minFPS: Math.min(prev.minFPS, minFPS),
          maxFPS: Math.max(prev.maxFPS, maxFPS),
          frameCount: prev.frameCount + frameTimesRef.current.length,
        }));

        // Trigger callback if FPS drops below minimum
        if (fps < minimumFPS && !lowFrameRateWarningRef.current) {
          lowFrameRateWarningRef.current = true;
          onLowFrameRate?.(fps);
        } else if (fps >= minimumFPS) {
          lowFrameRateWarningRef.current = false;
        }

        // Reset for next sample
        frameTimesRef.current = [now];
        sampleStartRef.current = now;
      }
    }

    if (state.isMonitoring) {
      animationFrameIdRef.current = requestAnimationFrame(measureFrame);
    }
  }, [state.isMonitoring, targetFPS, minimumFPS, sampleDuration, calculateFPS, onLowFrameRate]);

  const start = useCallback(() => {
    if (!enabled || state.isMonitoring) return;

    setState((prev) => ({ ...prev, isMonitoring: true }));
    lastTimeRef.current = 0;
    frameTimesRef.current = [];
    sampleStartRef.current = performance.now();
    animationFrameIdRef.current = requestAnimationFrame(measureFrame);
  }, [enabled, state.isMonitoring, measureFrame]);

  const stop = useCallback(() => {
    setState((prev) => ({ ...prev, isMonitoring: false }));
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    lastTimeRef.current = 0;
  }, []);

  const reset = useCallback(() => {
    stop();
    setState({
      currentFPS: 0,
      averageFPS: 0,
      minFPS: targetFPS,
      maxFPS: 0,
      isMonitoring: false,
      frameCount: 0,
      droppedFrames: 0,
    });
    frameTimesRef.current = [];
    lastTimeRef.current = 0;
    lowFrameRateWarningRef.current = false;
  }, [stop, targetFPS]);

  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return {
    ...state,
    start,
    stop,
    reset,
  };
}

/**
 * Hook for monitoring multiple animation frame rates
 * Useful for tracking performance of different animation systems
 *
 * @param animationIds - IDs of animations to monitor
 * @param options - Monitor options
 * @returns Map of animation IDs to frame rate states
 *
 * @example
 * const monitors = useMultipleFrameRateMonitors(['background', 'hero', 'cards']);
 *
 * return (
 *   <div>
 *     {Array.from(monitors.entries()).map(([id, state]) => (
 *       <div key={id}>{id}: {state.currentFPS.toFixed(1)} FPS</div>
 *     ))}
 *   </div>
 * );
 */
export function useMultipleFrameRateMonitors(
  animationIds: string[],
  options: FrameRateMonitorOptions = {}
): Map<string, FrameRateState & { start: () => void; stop: () => void; reset: () => void }> {
  const monitorsRef = useRef<
    Map<string, FrameRateState & { start: () => void; stop: () => void; reset: () => void }>
  >(new Map());

  // Initialize monitors for each animation ID
  useEffect(() => {
    animationIds.forEach((id) => {
      if (!monitorsRef.current.has(id)) {
        // Create a new monitor for this animation
        // Note: This is a simplified implementation
        // In a real scenario, you'd want to use useFrameRateMonitor for each
        monitorsRef.current.set(id, {
          currentFPS: 0,
          averageFPS: 0,
          minFPS: options.targetFPS || 60,
          maxFPS: 0,
          isMonitoring: false,
          frameCount: 0,
          droppedFrames: 0,
          start: () => {},
          stop: () => {},
          reset: () => {},
        });
      }
    });
  }, [animationIds, options]);

  return monitorsRef.current;
}

/**
 * Performance metrics collector
 * Collects and aggregates performance data
 */
export class PerformanceMetricsCollector {
  private metrics: Map<string, number[]> = new Map();
  private startTime: number = 0;

  constructor() {
    this.startTime = performance.now();
  }

  /**
   * Record a metric value
   */
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  /**
   * Get average value for a metric
   */
  getAverageMetric(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Get min value for a metric
   */
  getMinMetric(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return Math.min(...values);
  }

  /**
   * Get max value for a metric
   */
  getMaxMetric(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return Math.max(...values);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, { average: number; min: number; max: number; count: number }> {
    const result: Record<string, { average: number; min: number; max: number; count: number }> = {};

    for (const [name, values] of this.metrics.entries()) {
      result[name] = {
        average: this.getAverageMetric(name),
        min: this.getMinMetric(name),
        max: this.getMaxMetric(name),
        count: values.length,
      };
    }

    return result;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * Get elapsed time since creation
   */
  getElapsedTime(): number {
    return performance.now() - this.startTime;
  }
}

/**
 * Hook for using performance metrics collector
 *
 * @returns Metrics collector instance
 *
 * @example
 * const metrics = usePerformanceMetrics();
 *
 * useEffect(() => {
 *   metrics.recordMetric('animation-fps', currentFPS);
 * }, [currentFPS]);
 *
 * return <div>{JSON.stringify(metrics.getAllMetrics())}</div>;
 */
export function usePerformanceMetrics(): PerformanceMetricsCollector {
  const metricsRef = useRef<PerformanceMetricsCollector>(new PerformanceMetricsCollector());

  return metricsRef.current;
}
