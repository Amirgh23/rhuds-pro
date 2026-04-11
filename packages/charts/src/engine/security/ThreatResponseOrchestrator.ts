/**
 * Threat Response Orchestrator
 * Orchestrates coordinated threat response across multiple systems
 */

/**
 * Response action definition
 */
export interface ResponseAction {
  id: string;
  type: 'isolate' | 'block' | 'quarantine' | 'alert' | 'investigate' | 'remediate';
  targetId: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'executing' | 'completed' | 'failed';
  executedAt?: Date;
  result?: Record<string, unknown>;
}

/**
 * Response workflow definition
 */
export interface ResponseWorkflow {
  id: string;
  threatId: string;
  actions: ResponseAction[];
  status: 'pending' | 'executing' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  successRate: number;
}

/**
 * Response orchestration result
 */
export interface OrchestrationResult {
  workflowId: string;
  threatId: string;
  actionsExecuted: number;
  actionsSucceeded: number;
  actionsFailed: number;
  totalDuration: number;
  successRate: number;
  details: Record<string, unknown>;
}

/**
 * Response statistics
 */
export interface ResponseStatistics {
  totalWorkflows: number;
  completedWorkflows: number;
  failedWorkflows: number;
  totalActions: number;
  successfulActions: number;
  failedActions: number;
  averageResponseTime: number;
  averageSuccessRate: number;
}

/**
 * Threat Response Orchestrator
 * Coordinates threat response actions across systems
 */
export class ThreatResponseOrchestrator {
  private workflows: Map<string, ResponseWorkflow> = new Map();
  private actions: Map<string, ResponseAction> = new Map();
  private actionHandlers: Map<
    string,
    (action: ResponseAction) => Promise<Record<string, unknown>>
  > = new Map();
  private results: Map<string, OrchestrationResult> = new Map();

  /**
   * Register action handler
   */
  registerActionHandler(
    actionType: string,
    handler: (action: ResponseAction) => Promise<Record<string, unknown>>
  ): void {
    this.actionHandlers.set(actionType, handler);
  }

  /**
   * Create response workflow
   */
  createWorkflow(
    threatId: string,
    actions: Omit<ResponseAction, 'id' | 'status' | 'executedAt' | 'result'>[]
  ): ResponseWorkflow {
    const workflowId = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const workflowActions: ResponseAction[] = actions.map((action, index) => ({
      ...action,
      id: `action-${workflowId}-${index}`,
      status: 'pending' as const,
    }));

    const workflow: ResponseWorkflow = {
      id: workflowId,
      threatId,
      actions: workflowActions,
      status: 'pending',
      successRate: 0,
    };

    this.workflows.set(workflowId, workflow);
    workflowActions.forEach((action) => {
      this.actions.set(action.id, action);
    });

    return workflow;
  }

  /**
   * Execute response workflow
   */
  async executeWorkflow(workflowId: string): Promise<OrchestrationResult> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    workflow.status = 'executing';
    workflow.startedAt = new Date();

    let successCount = 0;
    let failureCount = 0;
    const startTime = Date.now();

    for (const action of workflow.actions) {
      try {
        action.status = 'executing';
        const handler = this.actionHandlers.get(action.type);

        if (handler) {
          action.result = await handler(action);
          action.status = 'completed';
          successCount++;
        } else {
          action.status = 'failed';
          action.result = { error: `No handler for action type: ${action.type}` };
          failureCount++;
        }
      } catch (error) {
        action.status = 'failed';
        action.result = { error: String(error) };
        failureCount++;
      }
      action.executedAt = new Date();
    }

    const totalDuration = Date.now() - startTime;
    const successRate = workflow.actions.length > 0 ? successCount / workflow.actions.length : 0;

    workflow.status = successRate === 1 ? 'completed' : failureCount > 0 ? 'failed' : 'completed';
    workflow.completedAt = new Date();
    workflow.successRate = successRate;

    const result: OrchestrationResult = {
      workflowId,
      threatId: workflow.threatId,
      actionsExecuted: workflow.actions.length,
      actionsSucceeded: successCount,
      actionsFailed: failureCount,
      totalDuration,
      successRate,
      details: {
        actions: workflow.actions.map((a) => ({
          id: a.id,
          type: a.type,
          status: a.status,
          result: a.result,
        })),
      },
    };

    this.results.set(workflowId, result);
    return result;
  }

  /**
   * Get workflow
   */
  getWorkflow(workflowId: string): ResponseWorkflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get action
   */
  getAction(actionId: string): ResponseAction | undefined {
    return this.actions.get(actionId);
  }

  /**
   * Get orchestration result
   */
  getOrchestrationResult(workflowId: string): OrchestrationResult | undefined {
    return this.results.get(workflowId);
  }

  /**
   * Get workflows by threat
   */
  getWorkflowsByThreat(threatId: string): ResponseWorkflow[] {
    return Array.from(this.workflows.values()).filter((w) => w.threatId === threatId);
  }

  /**
   * Get workflows by status
   */
  getWorkflowsByStatus(status: string): ResponseWorkflow[] {
    return Array.from(this.workflows.values()).filter((w) => w.status === status);
  }

  /**
   * Get failed actions
   */
  getFailedActions(): ResponseAction[] {
    return Array.from(this.actions.values()).filter((a) => a.status === 'failed');
  }

  /**
   * Retry failed workflow
   */
  async retryWorkflow(workflowId: string): Promise<OrchestrationResult> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    // Reset failed actions
    workflow.actions.forEach((action) => {
      if (action.status === 'failed') {
        action.status = 'pending';
        action.executedAt = undefined;
        action.result = undefined;
      }
    });

    return this.executeWorkflow(workflowId);
  }

  /**
   * Get statistics
   */
  getStatistics(): ResponseStatistics {
    const allWorkflows = Array.from(this.workflows.values());
    const completedWorkflows = allWorkflows.filter((w) => w.status === 'completed');
    const failedWorkflows = allWorkflows.filter((w) => w.status === 'failed');
    const allActions = Array.from(this.actions.values());
    const successfulActions = allActions.filter((a) => a.status === 'completed');
    const failedActions = allActions.filter((a) => a.status === 'failed');

    const avgResponseTime =
      completedWorkflows.length > 0
        ? completedWorkflows.reduce((sum, w) => {
            const duration = (w.completedAt?.getTime() ?? 0) - (w.startedAt?.getTime() ?? 0);
            return sum + duration;
          }, 0) / completedWorkflows.length
        : 0;

    const avgSuccessRate =
      allWorkflows.length > 0
        ? allWorkflows.reduce((sum, w) => sum + w.successRate, 0) / allWorkflows.length
        : 0;

    return {
      totalWorkflows: allWorkflows.length,
      completedWorkflows: completedWorkflows.length,
      failedWorkflows: failedWorkflows.length,
      totalActions: allActions.length,
      successfulActions: successfulActions.length,
      failedActions: failedActions.length,
      averageResponseTime: avgResponseTime,
      averageSuccessRate: avgSuccessRate,
    };
  }

  /**
   * Export orchestration report
   */
  exportOrchestrationReport(format: 'json' | 'csv'): string {
    const stats = this.getStatistics();
    const workflows = Array.from(this.workflows.values());

    if (format === 'json') {
      return JSON.stringify({ statistics: stats, workflows }, null, 2);
    }

    const rows = [
      ['Metric', 'Value'],
      ['Total Workflows', stats.totalWorkflows.toString()],
      ['Completed Workflows', stats.completedWorkflows.toString()],
      ['Failed Workflows', stats.failedWorkflows.toString()],
      ['Total Actions', stats.totalActions.toString()],
      ['Successful Actions', stats.successfulActions.toString()],
      ['Failed Actions', stats.failedActions.toString()],
      ['Average Response Time (ms)', stats.averageResponseTime.toFixed(2)],
      ['Average Success Rate', stats.averageSuccessRate.toFixed(2)],
    ];

    return rows.map((row) => row.join(',')).join('\n');
  }
}
