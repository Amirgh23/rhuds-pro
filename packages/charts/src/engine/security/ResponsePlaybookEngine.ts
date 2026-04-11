/**
 * Response Playbook Engine
 * Manages and executes response playbooks for different threat scenarios
 */

/**
 * Playbook step definition
 */
export interface PlaybookStep {
  id: string;
  order: number;
  action: string;
  parameters: Record<string, unknown>;
  condition?: Record<string, unknown>;
  retryCount: number;
  timeout: number;
}

/**
 * Response playbook definition
 */
export interface ResponsePlaybook {
  id: string;
  name: string;
  description: string;
  threatType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  steps: PlaybookStep[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Playbook execution
 */
export interface PlaybookExecution {
  id: string;
  playbookId: string;
  threatId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'paused';
  currentStep: number;
  executedSteps: string[];
  failedSteps: string[];
  result?: Record<string, unknown>;
}

/**
 * Playbook statistics
 */
export interface PlaybookStatistics {
  totalPlaybooks: number;
  enabledPlaybooks: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  mostUsedPlaybook?: string;
}

/**
 * Response Playbook Engine
 * Manages response playbooks for different threat scenarios
 */
export class ResponsePlaybookEngine {
  private playbooks: Map<string, ResponsePlaybook> = new Map();
  private executions: Map<string, PlaybookExecution> = new Map();
  private stepExecutors: Map<
    string,
    (params: Record<string, unknown>) => Promise<Record<string, unknown>>
  > = new Map();

  /**
   * Create playbook
   */
  createPlaybook(
    name: string,
    description: string,
    threatType: string,
    severity: string,
    steps: Omit<PlaybookStep, 'id'>[]
  ): ResponsePlaybook {
    const id = `playbook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const playbookSteps: PlaybookStep[] = steps.map((step, index) => ({
      ...step,
      id: `step-${id}-${index}`,
      order: index,
    }));

    const playbook: ResponsePlaybook = {
      id,
      name,
      description,
      threatType,
      severity: severity as 'critical' | 'high' | 'medium' | 'low',
      steps: playbookSteps,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    };

    this.playbooks.set(id, playbook);
    return playbook;
  }

  /**
   * Register step executor
   */
  registerStepExecutor(
    actionName: string,
    executor: (params: Record<string, unknown>) => Promise<Record<string, unknown>>
  ): void {
    this.stepExecutors.set(actionName, executor);
  }

  /**
   * Execute playbook
   */
  async executePlaybook(playbookId: string, threatId: string): Promise<PlaybookExecution> {
    const playbook = this.playbooks.get(playbookId);
    if (!playbook) {
      throw new Error(`Playbook ${playbookId} not found`);
    }

    if (!playbook.enabled) {
      throw new Error(`Playbook ${playbookId} is disabled`);
    }

    const executionId = `execution-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const execution: PlaybookExecution = {
      id: executionId,
      playbookId,
      threatId,
      startedAt: new Date(),
      status: 'executing',
      currentStep: 0,
      executedSteps: [],
      failedSteps: [],
    };

    this.executions.set(executionId, execution);

    try {
      for (let i = 0; i < playbook.steps.length; i++) {
        const step = playbook.steps[i];
        execution.currentStep = i;

        try {
          const executor = this.stepExecutors.get(step.action);
          if (!executor) {
            throw new Error(`No executor for action: ${step.action}`);
          }

          await executor(step.parameters);
          execution.executedSteps.push(step.id);
        } catch (error) {
          execution.failedSteps.push(step.id);

          if (step.retryCount > 0) {
            // Retry logic
            for (let retry = 0; retry < step.retryCount; retry++) {
              try {
                const executor = this.stepExecutors.get(step.action);
                if (executor) {
                  await executor(step.parameters);
                  execution.executedSteps.push(step.id);
                  execution.failedSteps.pop();
                  break;
                }
              } catch {
                // Continue to next retry
              }
            }
          }
        }
      }

      execution.status = execution.failedSteps.length === 0 ? 'completed' : 'failed';
      execution.completedAt = new Date();
      execution.result = {
        executedSteps: execution.executedSteps.length,
        failedSteps: execution.failedSteps.length,
        totalSteps: playbook.steps.length,
      };
    } catch (error) {
      execution.status = 'failed';
      execution.completedAt = new Date();
      execution.result = { error: String(error) };
    }

    return execution;
  }

  /**
   * Pause execution
   */
  pauseExecution(executionId: string): boolean {
    const execution = this.executions.get(executionId);
    if (!execution) return false;

    if (execution.status === 'executing') {
      execution.status = 'paused';
      return true;
    }

    return false;
  }

  /**
   * Resume execution
   */
  async resumeExecution(executionId: string): Promise<PlaybookExecution> {
    const execution = this.executions.get(executionId);
    if (!execution || execution.status !== 'paused') {
      throw new Error(`Cannot resume execution ${executionId}`);
    }

    const playbook = this.playbooks.get(execution.playbookId);
    if (!playbook) {
      throw new Error(`Playbook not found`);
    }

    execution.status = 'executing';

    try {
      for (let i = execution.currentStep; i < playbook.steps.length; i++) {
        const step = playbook.steps[i];
        execution.currentStep = i;

        const executor = this.stepExecutors.get(step.action);
        if (executor) {
          await executor(step.parameters);
          execution.executedSteps.push(step.id);
        }
      }

      execution.status = 'completed';
      execution.completedAt = new Date();
    } catch (error) {
      execution.status = 'failed';
      execution.completedAt = new Date();
    }

    return execution;
  }

  /**
   * Get playbook
   */
  getPlaybook(playbookId: string): ResponsePlaybook | undefined {
    return this.playbooks.get(playbookId);
  }

  /**
   * Get execution
   */
  getExecution(executionId: string): PlaybookExecution | undefined {
    return this.executions.get(executionId);
  }

  /**
   * Get playbooks by threat type
   */
  getPlaybooksByThreatType(threatType: string): ResponsePlaybook[] {
    return Array.from(this.playbooks.values()).filter((p) => p.threatType === threatType);
  }

  /**
   * Get playbooks by severity
   */
  getPlaybooksBySeverity(severity: string): ResponsePlaybook[] {
    return Array.from(this.playbooks.values()).filter((p) => p.severity === severity);
  }

  /**
   * Get executions by playbook
   */
  getExecutionsByPlaybook(playbookId: string): PlaybookExecution[] {
    return Array.from(this.executions.values()).filter((e) => e.playbookId === playbookId);
  }

  /**
   * Get executions by status
   */
  getExecutionsByStatus(status: string): PlaybookExecution[] {
    return Array.from(this.executions.values()).filter((e) => e.status === status);
  }

  /**
   * Update playbook
   */
  updatePlaybook(
    playbookId: string,
    updates: Partial<Omit<ResponsePlaybook, 'id' | 'createdAt'>>
  ): ResponsePlaybook | undefined {
    const playbook = this.playbooks.get(playbookId);
    if (!playbook) return undefined;

    Object.assign(playbook, updates, { updatedAt: new Date() });
    return playbook;
  }

  /**
   * Delete playbook
   */
  deletePlaybook(playbookId: string): boolean {
    return this.playbooks.delete(playbookId);
  }

  /**
   * Get all playbooks
   */
  getAllPlaybooks(): ResponsePlaybook[] {
    return Array.from(this.playbooks.values());
  }

  /**
   * Get statistics
   */
  getStatistics(): PlaybookStatistics {
    const allPlaybooks = Array.from(this.playbooks.values());
    const enabledPlaybooks = allPlaybooks.filter((p) => p.enabled);
    const allExecutions = Array.from(this.executions.values());
    const successfulExecutions = allExecutions.filter((e) => e.status === 'completed');
    const failedExecutions = allExecutions.filter((e) => e.status === 'failed');

    const avgExecutionTime =
      successfulExecutions.length > 0
        ? successfulExecutions.reduce((sum, e) => {
            const duration = (e.completedAt?.getTime() ?? 0) - e.startedAt.getTime();
            return sum + duration;
          }, 0) / successfulExecutions.length
        : 0;

    // Find most used playbook
    const playbookUsage = new Map<string, number>();
    allExecutions.forEach((e) => {
      playbookUsage.set(e.playbookId, (playbookUsage.get(e.playbookId) ?? 0) + 1);
    });

    let mostUsedPlaybook: string | undefined;
    let maxUsage = 0;
    playbookUsage.forEach((count, playbookId) => {
      if (count > maxUsage) {
        maxUsage = count;
        mostUsedPlaybook = playbookId;
      }
    });

    return {
      totalPlaybooks: allPlaybooks.length,
      enabledPlaybooks: enabledPlaybooks.length,
      totalExecutions: allExecutions.length,
      successfulExecutions: successfulExecutions.length,
      failedExecutions: failedExecutions.length,
      averageExecutionTime: avgExecutionTime,
      mostUsedPlaybook,
    };
  }

  /**
   * Export playbook report
   */
  exportPlaybookReport(format: 'json' | 'csv'): string {
    const stats = this.getStatistics();
    const playbooks = Array.from(this.playbooks.values());

    if (format === 'json') {
      return JSON.stringify({ statistics: stats, playbooks }, null, 2);
    }

    const rows = [
      ['Metric', 'Value'],
      ['Total Playbooks', stats.totalPlaybooks.toString()],
      ['Enabled Playbooks', stats.enabledPlaybooks.toString()],
      ['Total Executions', stats.totalExecutions.toString()],
      ['Successful Executions', stats.successfulExecutions.toString()],
      ['Failed Executions', stats.failedExecutions.toString()],
      ['Average Execution Time (ms)', stats.averageExecutionTime.toFixed(2)],
      ['Most Used Playbook', stats.mostUsedPlaybook ?? 'N/A'],
    ];

    return rows.map((row) => row.join(',')).join('\n');
  }
}
