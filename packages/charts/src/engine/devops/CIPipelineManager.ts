/**
 * CI/CD Pipeline Manager
 * Manages continuous integration and deployment pipelines
 */

export interface PipelineStage {
  id: string;
  name: string;
  type: 'build' | 'test' | 'deploy' | 'validate';
  command: string;
  timeout: number;
  retries: number;
  dependencies: string[];
}

export interface PipelineRun {
  id: string;
  pipelineId: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
  startTime: number;
  endTime?: number;
  stageResults: Map<string, StageResult>;
  artifacts: string[];
}

export interface StageResult {
  stageId: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  startTime: number;
  endTime?: number;
  duration: number;
  output: string;
  error?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  stages: PipelineStage[];
  triggers: string[];
  createdAt: number;
  updatedAt: number;
}

/**
 * CI/CD Pipeline Manager
 * Manages build, test, and deployment pipelines
 */
export class CIPipelineManager {
  private pipelines: Map<string, Pipeline> = new Map();
  private runs: Map<string, PipelineRun> = new Map();
  private stageExecutors: Map<string, (command: string) => Promise<string>> = new Map();

  /**
   * Create a new pipeline
   */
  public createPipeline(name: string, description: string, stages: PipelineStage[]): Pipeline {
    const pipeline: Pipeline = {
      id: `pipeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      stages,
      triggers: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.pipelines.set(pipeline.id, pipeline);
    return pipeline;
  }

  /**
   * Register stage executor
   */
  public registerStageExecutor(
    stageType: string,
    executor: (command: string) => Promise<string>
  ): void {
    this.stageExecutors.set(stageType, executor);
  }

  /**
   * Run pipeline
   */
  public async runPipeline(pipelineId: string): Promise<PipelineRun> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      throw new Error(`Pipeline not found: ${pipelineId}`);
    }

    const run: PipelineRun = {
      id: `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pipelineId,
      status: 'running',
      startTime: Date.now(),
      stageResults: new Map(),
      artifacts: [],
    };

    this.runs.set(run.id, run);

    try {
      // Execute stages in order
      for (const stage of pipeline.stages) {
        const result = await this.executeStage(stage);
        run.stageResults.set(stage.id, result);

        if (result.status === 'failed') {
          run.status = 'failed';
          run.endTime = Date.now();
          return run;
        }
      }

      run.status = 'success';
      run.endTime = Date.now();
    } catch (error) {
      run.status = 'failed';
      run.endTime = Date.now();
    }

    return run;
  }

  /**
   * Execute a single stage
   */
  private async executeStage(stage: PipelineStage): Promise<StageResult> {
    const result: StageResult = {
      stageId: stage.id,
      status: 'running',
      startTime: Date.now(),
      duration: 0,
      output: '',
    };

    try {
      const executor = this.stageExecutors.get(stage.type);
      if (!executor) {
        throw new Error(`No executor for stage type: ${stage.type}`);
      }

      // Execute with timeout and retries
      let lastError: Error | null = null;
      for (let attempt = 0; attempt <= stage.retries; attempt++) {
        try {
          const output = await Promise.race([
            executor(stage.command),
            new Promise<string>((_, reject) =>
              setTimeout(() => reject(new Error('Stage timeout')), stage.timeout)
            ),
          ]);

          result.output = output;
          result.status = 'success';
          result.endTime = Date.now();
          result.duration = result.endTime - result.startTime;
          return result;
        } catch (error) {
          lastError = error as Error;
          if (attempt < stage.retries) {
            // Wait before retry
            await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
          }
        }
      }

      result.status = 'failed';
      result.error = lastError?.message;
      result.endTime = Date.now();
      result.duration = result.endTime - result.startTime;
    } catch (error) {
      result.status = 'failed';
      result.error = (error as Error).message;
      result.endTime = Date.now();
      result.duration = result.endTime - result.startTime;
    }

    return result;
  }

  /**
   * Get pipeline run status
   */
  public getPipelineRun(runId: string): PipelineRun | undefined {
    return this.runs.get(runId);
  }

  /**
   * Get pipeline runs
   */
  public getPipelineRuns(pipelineId: string, limit: number = 10): PipelineRun[] {
    return Array.from(this.runs.values())
      .filter((run) => run.pipelineId === pipelineId)
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, limit);
  }

  /**
   * Cancel pipeline run
   */
  public cancelPipelineRun(runId: string): void {
    const run = this.runs.get(runId);
    if (run && run.status === 'running') {
      run.status = 'cancelled';
      run.endTime = Date.now();
    }
  }

  /**
   * Rollback to previous version
   */
  public async rollback(pipelineId: string, version: string): Promise<PipelineRun> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      throw new Error(`Pipeline not found: ${pipelineId}`);
    }

    // Create rollback stage
    const rollbackStage: PipelineStage = {
      id: `rollback-${Date.now()}`,
      name: 'Rollback',
      type: 'deploy',
      command: `rollback --version=${version}`,
      timeout: 300000,
      retries: 2,
      dependencies: [],
    };

    const run: PipelineRun = {
      id: `rollback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pipelineId,
      status: 'running',
      startTime: Date.now(),
      stageResults: new Map(),
      artifacts: [],
    };

    this.runs.set(run.id, run);

    const result = await this.executeStage(rollbackStage);
    run.stageResults.set(rollbackStage.id, result);
    run.status = result.status === 'success' ? 'success' : 'failed';
    run.endTime = Date.now();

    return run;
  }

  /**
   * Get pipeline statistics
   */
  public getStatistics(pipelineId: string): Record<string, unknown> {
    const runs = this.getPipelineRuns(pipelineId, 100);
    const successCount = runs.filter((r) => r.status === 'success').length;
    const failureCount = runs.filter((r) => r.status === 'failed').length;
    const totalDuration = runs.reduce((sum, r) => sum + ((r.endTime || 0) - r.startTime), 0);

    return {
      totalRuns: runs.length,
      successCount,
      failureCount,
      successRate: runs.length > 0 ? (successCount / runs.length) * 100 : 0,
      averageDuration: runs.length > 0 ? totalDuration / runs.length : 0,
      lastRun: runs[0] || null,
    };
  }

  /**
   * Get all pipelines
   */
  public getPipelines(): Pipeline[] {
    return Array.from(this.pipelines.values());
  }

  /**
   * Update pipeline
   */
  public updatePipeline(pipelineId: string, updates: Partial<Pipeline>): Pipeline {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      throw new Error(`Pipeline not found: ${pipelineId}`);
    }

    const updated = { ...pipeline, ...updates, updatedAt: Date.now() };
    this.pipelines.set(pipelineId, updated);
    return updated;
  }

  /**
   * Delete pipeline
   */
  public deletePipeline(pipelineId: string): void {
    this.pipelines.delete(pipelineId);
  }

  /**
   * Export pipeline configuration
   */
  public exportPipeline(pipelineId: string): Record<string, unknown> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      throw new Error(`Pipeline not found: ${pipelineId}`);
    }

    return {
      name: pipeline.name,
      description: pipeline.description,
      stages: pipeline.stages,
      triggers: pipeline.triggers,
    };
  }
}
