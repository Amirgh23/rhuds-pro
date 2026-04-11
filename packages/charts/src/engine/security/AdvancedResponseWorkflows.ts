/**
 * Advanced Response Workflows
 * Manages complex, multi-stage response workflows with conditional branching
 * and dynamic decision making for threat response scenarios.
 */

interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  actions: WorkflowAction[];
  conditions?: WorkflowCondition[];
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

interface WorkflowAction {
  id: string;
  type: string;
  handler: (context: WorkflowContext) => Promise<ActionResult>;
  priority: number;
  parallel?: boolean;
}

interface WorkflowCondition {
  id: string;
  evaluate: (context: WorkflowContext) => boolean;
  nextStageId?: string;
  fallbackStageId?: string;
}

interface WorkflowContext {
  threatId: string;
  severity: number;
  metadata: Record<string, unknown>;
  previousResults: ActionResult[];
  timestamp: number;
}

interface ActionResult {
  actionId: string;
  success: boolean;
  data?: unknown;
  error?: string;
  duration: number;
}

interface RetryPolicy {
  maxAttempts: number;
  backoffMs: number;
  backoffMultiplier: number;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  threatId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  currentStageId: string;
  results: ActionResult[];
  startTime: number;
  endTime?: number;
  error?: string;
}

interface WorkflowStatistics {
  totalWorkflows: number;
  activeExecutions: number;
  completedExecutions: number;
  failedExecutions: number;
  averageDuration: number;
  successRate: number;
  stageMetrics: Record<string, StageMetrics>;
}

interface StageMetrics {
  executions: number;
  successes: number;
  failures: number;
  averageDuration: number;
}

/**
 * Advanced Response Workflows Engine
 * Orchestrates complex multi-stage response workflows with intelligent routing
 */
export class AdvancedResponseWorkflows {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private actionHandlers: Map<string, ActionHandler> = new Map();
  private stageMetrics: Map<string, StageMetrics> = new Map();

  interface WorkflowDefinition {
    id: string;
    name: string;
    description: string;
    stages: WorkflowStage[];
    initialStageId: string;
    threatTypes: string[];
    severityRange: [number, number];
  }

  interface ActionHandler {
    (context: WorkflowContext): Promise<ActionResult>;
  }

  /**
   * Create a new workflow definition
   */
  createWorkflow(definition: WorkflowDefinition): string {
    const id = `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.workflows.set(id, { ...definition, id });
    return id;
  }

  /**
   * Register an action handler for a specific action type
   */
  registerActionHandler(actionType: string, handler: ActionHandler): void {
    this.actionHandlers.set(actionType, handler);
  }

  /**
   * Execute a workflow for a given threat
   */
  async executeWorkflow(
    workflowId: string,
    threatId: string,
    severity: number,
    metadata: Record<string, unknown> = {}
  ): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const execution: WorkflowExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      workflowId,
      threatId,
      status: 'running',
      currentStageId: workflow.initialStageId,
      results: [],
      startTime: Date.now(),
    };

    this.executions.set(execution.id, execution);

    try {
      await this.executeStages(execution, workflow, severity, metadata);
      execution.status = 'completed';
      execution.endTime = Date.now();
    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : String(error);
      execution.endTime = Date.now();
    }

    return execution;
  }

  /**
   * Execute workflow stages sequentially with conditional branching
   */
  private async executeStages(
    execution: WorkflowExecution,
    workflow: WorkflowDefinition,
    severity: number,
    metadata: Record<string, unknown>
  ): Promise<void> {
    const context: WorkflowContext = {
      threatId: execution.threatId,
      severity,
      metadata,
      previousResults: [],
      timestamp: Date.now(),
    };

    let currentStageId = workflow.initialStageId;

    while (currentStageId) {
      const stage = workflow.stages.find((s) => s.id === currentStageId);
      if (!stage) break;

      execution.currentStageId = currentStageId;
      const stageStartTime = Date.now();

      try {
        // Execute stage actions
        const stageResults = await this.executeStageActions(stage, context);
        execution.results.push(...stageResults);
        context.previousResults = stageResults;

        // Record stage metrics
        this.recordStageMetrics(stage.id, stageResults, Date.now() - stageStartTime);

        // Evaluate conditions for next stage
        currentStageId = this.evaluateConditions(stage, context) || undefined;
      } catch (error) {
        throw new Error(`Stage execution failed: ${stage.name} - ${error}`);
      }
    }
  }

  /**
   * Execute all actions in a stage
   */
  private async executeStageActions(
    stage: WorkflowStage,
    context: WorkflowContext
  ): Promise<ActionResult[]> {
    const results: ActionResult[] = [];

    if (stage.actions.length === 0) {
      return results;
    }

    // Separate parallel and sequential actions
    const parallelActions = stage.actions.filter((a) => a.parallel);
    const sequentialActions = stage.actions.filter((a) => !a.parallel);

    // Execute parallel actions
    if (parallelActions.length > 0) {
      const parallelResults = await Promise.all(
        parallelActions.map((action) => this.executeAction(action, context))
      );
      results.push(...parallelResults);
    }

    // Execute sequential actions
    for (const action of sequentialActions) {
      const result = await this.executeAction(action, context);
      results.push(result);
    }

    return results;
  }

  /**
   * Execute a single action with retry logic
   */
  private async executeAction(
    action: WorkflowAction,
    context: WorkflowContext
  ): Promise<ActionResult> {
    const startTime = Date.now();
    let lastError: Error | null = null;

    const handler = this.actionHandlers.get(action.type);
    if (!handler) {
      return {
        actionId: action.id,
        success: false,
        error: `No handler registered for action type: ${action.type}`,
        duration: Date.now() - startTime,
      };
    }

    // Execute with retry logic
    const maxAttempts = 3;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await handler(context);
        return {
          actionId: action.id,
          success: true,
          data: result,
          duration: Date.now() - startTime,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, attempt)));
        }
      }
    }

    return {
      actionId: action.id,
      success: false,
      error: lastError?.message || 'Action failed after retries',
      duration: Date.now() - startTime,
    };
  }

  /**
   * Evaluate conditions to determine next stage
   */
  private evaluateConditions(stage: WorkflowStage, context: WorkflowContext): string | null {
    if (!stage.conditions || stage.conditions.length === 0) {
      return null;
    }

    for (const condition of stage.conditions) {
      if (condition.evaluate(context)) {
        return condition.nextStageId || null;
      }
    }

    return stage.conditions[0]?.fallbackStageId || null;
  }

  /**
   * Pause a workflow execution
   */
  pauseExecution(executionId: string): void {
    const execution = this.executions.get(executionId);
    if (execution && execution.status === 'running') {
      execution.status = 'paused';
    }
  }

  /**
   * Resume a paused workflow execution
   */
  async resumeExecution(executionId: string): Promise<WorkflowExecution> {
    const execution = this.executions.get(executionId);
    if (!execution || execution.status !== 'paused') {
      throw new Error(`Cannot resume execution: ${executionId}`);
    }

    execution.status = 'running';
    return execution;
  }

  /**
   * Get workflow execution details
   */
  getExecution(executionId: string): WorkflowExecution | undefined {
    return this.executions.get(executionId);
  }

  /**
   * Get all executions for a threat
   */
  getExecutionsByThreat(threatId: string): WorkflowExecution[] {
    return Array.from(this.executions.values()).filter((e) => e.threatId === threatId);
  }

  /**
   * Record stage execution metrics
   */
  private recordStageMetrics(stageId: string, results: ActionResult[], duration: number): void {
    const metrics = this.stageMetrics.get(stageId) || {
      executions: 0,
      successes: 0,
      failures: 0,
      averageDuration: 0,
    };

    const successCount = results.filter((r) => r.success).length;
    metrics.executions += 1;
    metrics.successes += successCount;
    metrics.failures += results.length - successCount;
    metrics.averageDuration = (metrics.averageDuration * (metrics.executions - 1) + duration) / metrics.executions;

    this.stageMetrics.set(stageId, metrics);
  }

  /**
   * Get workflow statistics
   */
  getStatistics(): WorkflowStatistics {
    const executions = Array.from(this.executions.values());
    const completed = executions.filter((e) => e.status === 'completed');
    const failed = executions.filter((e) => e.status === 'failed');

    const totalDuration = completed.reduce((sum, e) => sum + ((e.endTime || 0) - e.startTime), 0);
    const averageDuration = completed.length > 0 ? totalDuration / completed.length : 0;

    return {
      totalWorkflows: this.workflows.size,
      activeExecutions: executions.filter((e) => e.status === 'running').length,
      completedExecutions: completed.length,
      failedExecutions: failed.length,
      averageDuration,
      successRate: executions.length > 0 ? completed.length / executions.length : 0,
      stageMetrics: Object.fromEntries(this.stageMetrics),
    };
  }

  /**
   * Export workflow execution report
   */
  exportWorkflowReport(executionId: string): Record<string, unknown> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new Error(`Execution not found: ${executionId}`);
    }

    return {
      executionId: execution.id,
      workflowId: execution.workflowId,
      threatId: execution.threatId,
      status: execution.status,
      duration: (execution.endTime || Date.now()) - execution.startTime,
      results: execution.results,
      error: execution.error,
      timestamp: execution.startTime,
    };
  }
}
