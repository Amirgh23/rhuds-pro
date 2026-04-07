/**
 * Custom Rendering Pipeline
 * Preprocessing, rendering, and postprocessing stages
 */

export interface PipelineStage {
  name: string;
  execute: (data: any, context: any) => Promise<any>;
  enabled?: boolean;
}

export interface PipelineConfig {
  enableCaching?: boolean;
  enableParallel?: boolean;
  timeout?: number;
}

export interface PipelineContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | WebGLRenderingContext;
  data: any;
  metadata: Record<string, any>;
}

/**
 * Rendering Pipeline
 */
export class RenderingPipeline {
  private stages: Map<string, PipelineStage> = new Map();
  private stageOrder: string[] = [];
  private cache: Map<string, any> = new Map();
  private config: PipelineConfig;
  private listeners: Map<string, Function[]> = new Map();

  constructor(config: PipelineConfig = {}) {
    this.config = {
      enableCaching: true,
      enableParallel: false,
      timeout: 5000,
      ...config,
    };
  }

  /**
   * Add pipeline stage
   */
  public addStage(name: string, execute: (data: any, context: any) => Promise<any>): void {
    this.stages.set(name, {
      name,
      execute,
      enabled: true,
    });
    this.stageOrder.push(name);
    this.emit('stage:added', { name });
  }

  /**
   * Remove stage
   */
  public removeStage(name: string): void {
    this.stages.delete(name);
    this.stageOrder = this.stageOrder.filter((s) => s !== name);
    this.emit('stage:removed', { name });
  }

  /**
   * Enable stage
   */
  public enableStage(name: string): void {
    const stage = this.stages.get(name);
    if (stage) {
      stage.enabled = true;
      this.emit('stage:enabled', { name });
    }
  }

  /**
   * Disable stage
   */
  public disableStage(name: string): void {
    const stage = this.stages.get(name);
    if (stage) {
      stage.enabled = false;
      this.emit('stage:disabled', { name });
    }
  }

  /**
   * Execute pipeline
   */
  public async execute(data: any, context: PipelineContext): Promise<any> {
    const startTime = performance.now();
    let result = data;

    try {
      if (this.config.enableParallel) {
        result = await this.executeParallel(result, context);
      } else {
        result = await this.executeSequential(result, context);
      }

      const duration = performance.now() - startTime;
      this.emit('pipeline:complete', { duration, stageCount: this.stageOrder.length });

      return result;
    } catch (error) {
      this.emit('pipeline:error', { error, duration: performance.now() - startTime });
      throw error;
    }
  }

  /**
   * Execute stages sequentially
   */
  private async executeSequential(data: any, context: PipelineContext): Promise<any> {
    let result = data;

    for (const stageName of this.stageOrder) {
      const stage = this.stages.get(stageName);
      if (!stage || !stage.enabled) continue;

      const cacheKey = this.getCacheKey(stageName, result);
      if (this.config.enableCaching && this.cache.has(cacheKey)) {
        result = this.cache.get(cacheKey);
        this.emit('stage:cached', { name: stageName });
        continue;
      }

      const stageStartTime = performance.now();

      try {
        result = await this.executeWithTimeout(stage.execute(result, context), this.config.timeout);
        const stageDuration = performance.now() - stageStartTime;

        if (this.config.enableCaching) {
          this.cache.set(cacheKey, result);
        }

        this.emit('stage:complete', { name: stageName, duration: stageDuration });
      } catch (error) {
        this.emit('stage:error', { name: stageName, error });
        throw error;
      }
    }

    return result;
  }

  /**
   * Execute stages in parallel
   */
  private async executeParallel(data: any, context: PipelineContext): Promise<any> {
    const promises = this.stageOrder
      .map((stageName) => {
        const stage = this.stages.get(stageName);
        if (!stage || !stage.enabled) return Promise.resolve(data);

        const cacheKey = this.getCacheKey(stageName, data);
        if (this.config.enableCaching && this.cache.has(cacheKey)) {
          this.emit('stage:cached', { name: stageName });
          return Promise.resolve(this.cache.get(cacheKey));
        }

        const stageStartTime = performance.now();

        return this.executeWithTimeout(stage.execute(data, context), this.config.timeout)
          .then((result) => {
            const stageDuration = performance.now() - stageStartTime;

            if (this.config.enableCaching) {
              this.cache.set(cacheKey, result);
            }

            this.emit('stage:complete', { name: stageName, duration: stageDuration });
            return result;
          })
          .catch((error) => {
            this.emit('stage:error', { name: stageName, error });
            throw error;
          });
      })
      .filter((p) => p !== Promise.resolve(data));

    await Promise.all(promises);
    return data;
  }

  /**
   * Execute with timeout
   */
  private executeWithTimeout(promise: Promise<any>, timeout: number): Promise<any> {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Pipeline stage timeout')), timeout)
      ),
    ]);
  }

  /**
   * Get cache key
   */
  private getCacheKey(stageName: string, data: any): string {
    const hash = JSON.stringify(data)
      .split('')
      .reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);
    return `${stageName}:${hash}`;
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear();
    this.emit('cache:cleared', {});
  }

  /**
   * Get stage info
   */
  public getStageInfo(name: string): PipelineStage | undefined {
    return this.stages.get(name);
  }

  /**
   * Get all stages
   */
  public getAllStages(): PipelineStage[] {
    return this.stageOrder.map((name) => this.stages.get(name)!);
  }

  /**
   * Listen to events
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  /**
   * Destroy pipeline
   */
  public destroy(): void {
    this.stages.clear();
    this.stageOrder = [];
    this.cache.clear();
    this.listeners.clear();
  }
}

export default RenderingPipeline;
