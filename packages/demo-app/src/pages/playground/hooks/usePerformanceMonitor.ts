import { useEffect, useRef, useCallback } from 'react';

export interface PerformanceMetrics {
  renderTime: number;
  fps: number;
  memoryUsage?: number;
  componentCount: number;
}

export function usePerformanceMonitor() {
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    fps: 60,
    componentCount: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number>();

  const measureRenderTime = useCallback((fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    metricsRef.current.renderTime = end - start;
    return metricsRef.current.renderTime;
  }, []);

  const calculateFPS = useCallback(() => {
    frameCountRef.current++;
    const now = Date.now();
    const elapsed = now - lastTimeRef.current;

    if (elapsed >= 1000) {
      metricsRef.current.fps = frameCountRef.current;
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    animationFrameRef.current = requestAnimationFrame(calculateFPS);
  }, []);

  const getMemoryUsage = useCallback(() => {
    if ((performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize / 1048576; // Convert to MB
    }
    return undefined;
  }, []);

  const getMetrics = useCallback((): PerformanceMetrics => {
    return {
      ...metricsRef.current,
      memoryUsage: getMemoryUsage(),
    };
  }, [getMemoryUsage]);

  const startMonitoring = useCallback(() => {
    calculateFPS();
  }, [calculateFPS]);

  const stopMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  useEffect(() => {
    startMonitoring();
    return () => {
      stopMonitoring();
    };
  }, [startMonitoring, stopMonitoring]);

  return {
    measureRenderTime,
    getMetrics,
    startMonitoring,
    stopMonitoring,
  };
}
