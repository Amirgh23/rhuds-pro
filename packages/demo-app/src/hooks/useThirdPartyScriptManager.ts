/**
 * useThirdPartyScriptManager Hook
 * Manages third-party scripts in React components
 */

import { useEffect, useCallback, useState } from 'react';
import {
  thirdPartyScriptManager,
  ScriptConfig,
  ScriptMetrics,
} from '../utils/third-party-script-manager';

export interface UseThirdPartyScriptManagerOptions {
  enabled?: boolean;
  autoLoad?: boolean;
  loadByPriority?: boolean;
}

/**
 * Hook for third-party script management
 */
export function useThirdPartyScriptManager(options: UseThirdPartyScriptManagerOptions = {}) {
  const { enabled = true, autoLoad = false, loadByPriority = true } = options;

  const [metrics, setMetrics] = useState<ScriptMetrics>(thirdPartyScriptManager.getMetrics());
  const [loadingScripts, setLoadingScripts] = useState<Set<string>>(new Set());

  // Update metrics
  const updateMetrics = useCallback(() => {
    if (!enabled) return;
    setMetrics(thirdPartyScriptManager.getMetrics());
  }, [enabled]);

  // Subscribe to metrics updates
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = thirdPartyScriptManager.subscribe(() => {
      updateMetrics();
    });

    return unsubscribe;
  }, [enabled, updateMetrics]);

  // Auto-load scripts by priority
  useEffect(() => {
    if (!enabled || !autoLoad || !loadByPriority) return;

    thirdPartyScriptManager.loadScriptsByPriority();
  }, [enabled, autoLoad, loadByPriority]);

  // Register script
  const registerScript = useCallback(
    (config: ScriptConfig) => {
      if (!enabled) return;
      thirdPartyScriptManager.registerScript(config);
    },
    [enabled]
  );

  // Load script
  const loadScript = useCallback(
    async (id: string) => {
      if (!enabled) return false;

      setLoadingScripts((prev) => new Set([...prev, id]));

      try {
        const success = await thirdPartyScriptManager.loadScript(id);
        return success;
      } finally {
        setLoadingScripts((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [enabled]
  );

  // Load scripts in order
  const loadScriptsInOrder = useCallback(
    async (ids: string[]) => {
      if (!enabled) return false;

      ids.forEach((id) => setLoadingScripts((prev) => new Set([...prev, id])));

      try {
        const success = await thirdPartyScriptManager.loadScriptsInOrder(ids);
        return success;
      } finally {
        ids.forEach((id) =>
          setLoadingScripts((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          })
        );
      }
    },
    [enabled]
  );

  // Load scripts in parallel
  const loadScriptsInParallel = useCallback(
    async (ids: string[]) => {
      if (!enabled) return false;

      ids.forEach((id) => setLoadingScripts((prev) => new Set([...prev, id])));

      try {
        const success = await thirdPartyScriptManager.loadScriptsInParallel(ids);
        return success;
      } finally {
        ids.forEach((id) =>
          setLoadingScripts((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          })
        );
      }
    },
    [enabled]
  );

  // Unload script
  const unloadScript = useCallback(
    (id: string) => {
      if (!enabled) return;
      thirdPartyScriptManager.unloadScript(id);
      updateMetrics();
    },
    [enabled, updateMetrics]
  );

  // Get script status
  const getScriptStatus = useCallback((id: string) => {
    return thirdPartyScriptManager.getScriptStatus(id);
  }, []);

  // Get load time
  const getLoadTime = useCallback((id: string) => {
    return thirdPartyScriptManager.getLoadTime(id);
  }, []);

  // Get metrics
  const getMetrics = useCallback(() => {
    return thirdPartyScriptManager.getMetrics();
  }, []);

  return {
    // Metrics
    metrics,
    updateMetrics,
    loadingScripts,

    // Operations
    registerScript,
    loadScript,
    loadScriptsInOrder,
    loadScriptsInParallel,
    unloadScript,
    getScriptStatus,
    getLoadTime,
    getMetrics,

    // Config
    enabled,
  };
}

/**
 * Hook for script metrics
 */
export function useScriptMetrics() {
  const { metrics, updateMetrics } = useThirdPartyScriptManager({
    enabled: true,
  });

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return {
    metrics,
    totalScripts: metrics.totalScripts,
    loadedScripts: metrics.loadedScripts,
    failedScripts: metrics.failedScripts,
    averageLoadTime: metrics.averageLoadTime,
    errorRate: metrics.errorRate,
  };
}

export default useThirdPartyScriptManager;
