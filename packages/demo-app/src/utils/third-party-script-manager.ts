/**
 * Third-Party Script Manager
 * Manages and optimizes third-party scripts
 */

export interface ScriptConfig {
  id: string;
  src: string;
  async: boolean;
  defer: boolean;
  priority: 'critical' | 'high' | 'normal' | 'low';
  timeout: number;
  retries: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export interface ScriptMetrics {
  totalScripts: number;
  loadedScripts: number;
  failedScripts: number;
  averageLoadTime: number;
  totalLoadTime: number;
  errorRate: number;
}

/**
 * Third-Party Script Manager
 */
export class ThirdPartyScriptManager {
  private scripts: Map<string, ScriptConfig> = new Map();
  private loadedScripts: Set<string> = new Set();
  private failedScripts: Set<string> = new Set();
  private metrics: ScriptMetrics;
  private loadTimes: Map<string, number> = new Map();
  private subscribers: ((metrics: ScriptMetrics) => void)[] = [];
  private scriptElements: Map<string, HTMLScriptElement> = new Map();

  constructor() {
    this.metrics = {
      totalScripts: 0,
      loadedScripts: 0,
      failedScripts: 0,
      averageLoadTime: 0,
      totalLoadTime: 0,
      errorRate: 0,
    };
  }

  /**
   * Register script
   */
  registerScript(config: ScriptConfig): void {
    this.scripts.set(config.id, config);
    this.metrics.totalScripts++;
    this.notifySubscribers();
  }

  /**
   * Load script
   */
  async loadScript(id: string): Promise<boolean> {
    const config = this.scripts.get(id);
    if (!config) {
      console.error(`Script ${id} not registered`);
      return false;
    }

    if (this.loadedScripts.has(id)) {
      return true;
    }

    const startTime = performance.now();

    try {
      const script = document.createElement('script');
      script.src = config.src;
      script.async = config.async;
      script.defer = config.defer;
      script.id = id;

      // Setup error handling
      let timeoutId: NodeJS.Timeout | null = null;
      let resolved = false;

      const promise = new Promise<boolean>((resolve, reject) => {
        script.onload = () => {
          if (timeoutId) clearTimeout(timeoutId);
          resolved = true;
          this.loadedScripts.add(id);
          const loadTime = performance.now() - startTime;
          this.loadTimes.set(id, loadTime);
          this.metrics.loadedScripts++;
          this.metrics.totalLoadTime += loadTime;
          this.metrics.averageLoadTime = this.metrics.totalLoadTime / this.metrics.loadedScripts;
          this.metrics.errorRate = this.metrics.failedScripts / this.metrics.totalScripts;
          this.notifySubscribers();
          config.onLoad?.();
          resolve(true);
        };

        script.onerror = () => {
          if (timeoutId) clearTimeout(timeoutId);
          resolved = true;
          this.failedScripts.add(id);
          this.metrics.failedScripts++;
          this.metrics.errorRate = this.metrics.failedScripts / this.metrics.totalScripts;
          this.notifySubscribers();
          config.onError?.(new Error(`Failed to load script: ${config.src}`));
          reject(new Error(`Failed to load script: ${config.src}`));
        };

        // Setup timeout
        timeoutId = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            script.onerror?.({} as any);
          }
        }, config.timeout);
      });

      document.head.appendChild(script);
      this.scriptElements.set(id, script);

      return await promise;
    } catch (error) {
      this.failedScripts.add(id);
      this.metrics.failedScripts++;
      this.metrics.errorRate = this.metrics.failedScripts / this.metrics.totalScripts;
      this.notifySubscribers();
      config.onError?.(error as Error);
      return false;
    }
  }

  /**
   * Load scripts in order
   */
  async loadScriptsInOrder(ids: string[]): Promise<boolean> {
    for (const id of ids) {
      const success = await this.loadScript(id);
      if (!success) {
        return false;
      }
    }
    return true;
  }

  /**
   * Load scripts in parallel
   */
  async loadScriptsInParallel(ids: string[]): Promise<boolean> {
    const results = await Promise.all(ids.map((id) => this.loadScript(id)));
    return results.every((result) => result);
  }

  /**
   * Load scripts by priority
   */
  async loadScriptsByPriority(): Promise<void> {
    const priorities = ['critical', 'high', 'normal', 'low'];

    for (const priority of priorities) {
      const scripts = Array.from(this.scripts.values()).filter((s) => s.priority === priority);
      const ids = scripts.map((s) => s.id);
      await this.loadScriptsInParallel(ids);
    }
  }

  /**
   * Unload script
   */
  unloadScript(id: string): void {
    const script = this.scriptElements.get(id);
    if (script) {
      script.remove();
      this.scriptElements.delete(id);
    }
    this.loadedScripts.delete(id);
    this.failedScripts.delete(id);
  }

  /**
   * Get metrics
   */
  getMetrics(): ScriptMetrics {
    return { ...this.metrics };
  }

  /**
   * Get script status
   */
  getScriptStatus(id: string): 'pending' | 'loaded' | 'failed' {
    if (this.loadedScripts.has(id)) return 'loaded';
    if (this.failedScripts.has(id)) return 'failed';
    return 'pending';
  }

  /**
   * Get load time
   */
  getLoadTime(id: string): number | null {
    return this.loadTimes.get(id) || null;
  }

  /**
   * Subscribe to metrics updates
   */
  subscribe(callback: (metrics: ScriptMetrics) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  /**
   * Notify subscribers
   */
  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback(this.getMetrics()));
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      totalScripts: 0,
      loadedScripts: 0,
      failedScripts: 0,
      averageLoadTime: 0,
      totalLoadTime: 0,
      errorRate: 0,
    };
    this.loadTimes.clear();
  }

  /**
   * Destroy manager
   */
  destroy(): void {
    this.scriptElements.forEach((script) => script.remove());
    this.scriptElements.clear();
    this.scripts.clear();
    this.loadedScripts.clear();
    this.failedScripts.clear();
    this.subscribers = [];
  }
}

// Global instance
export const thirdPartyScriptManager = new ThirdPartyScriptManager();
