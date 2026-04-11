/**
 * Incident Automation Workflow
 * Automated incident handling and lifecycle management
 */

/**
 * Workflow step
 */
export interface WorkflowStep {
  id: string;
  name: string;
  type: 'detection' | 'analysis' | 'response' | 'recovery' | 'review';
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'skipped';
  automationLevel: 'manual' | 'semi-auto' | 'full-auto';
  executedAt?: number;
  duration?: number;
  result?: unknown;
  error?: string;
}

/**
 * Automated incident workflow
 */
export interface AutomatedIncidentWorkflow {
  id: string;
  incidentId: string;
  createdAt: number;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'failed';
  steps: WorkflowStep[];
  currentStepIndex: number;
  automationScore: number;
  totalDuration: number;
  metadata: Record<string, unknown>;
}

/**
 * Incident Automation Workflow
 * Automated incident handling and lifecycle management
 */
export class IncidentAutomationWorkflow {
  private workflows: Map<string, AutomatedIncidentWorkflow> = new Map();
  private workflowHistory: AutomatedIncidentWorkflow[] = [];
  private stepHandlers: Map<
    string,
    (step: WorkflowStep, metadata: Record<string, unknown>) => Promise<unknown>
  > = new Map();

  /**
   * Register step handler
   */
  registerStepHandler(
    stepType: string,
    handler: (step: WorkflowStep, metadata: Record<string, unknown>) => Promise<unknown>
  ): void {
    this.stepHandlers.set(stepType, handler);
  }

  /**
   * Create workflow
   */
  createWorkflow(
    incidentId: string,
    steps: Omit<WorkflowStep, 'id' | 'status' | 'executedAt' | 'duration'>[]
  ): AutomatedIncidentWorkflow {
    const workflowId = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const workflow: AutomatedIncidentWorkflow = {
      id: workflowId,
      incidentId,
      createdAt: Date.now(),
      status: 'draft',
      currentStepIndex: 0,
      automationScore: 0,
      totalDuration: 0,
      metadata: {},
      steps: steps.map((s, idx) => ({
        id: `step-${workflowId}-${idx}`,
        status: 'pending',
        ...s,
      })),
    };

    this.workflows.set(workflowId, workflow);
    return workflow;
  }

  /**
   * Start workflow
   */
  async startWorkflow(workflowId: string): Promise<AutomatedIncidentWorkflow | null> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || workflow.status !== 'draft') return null;

    workflow.status = 'active';
    const startTime = Date.now();

    // Execute steps sequentially
    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      workflow.currentStepIndex = i;

      step.status = 'executing';
      const stepStartTime = Date.now();

      const handler = this.stepHandlers.get(step.type);
      if (handler) {
        try {
          const result = await handler(step, workflow.metadata);
          step.status = 'completed';
          step.result = result;
        } catch (error) {
          step.status = 'failed';
          step.error = error instanceof Error ? error.message : String(error);

          // Check if we should continue on error
          if (step.automationLevel === 'full-auto') {
            workflow.status = 'failed';
            break;
          }
        }
      } else {
        step.status = 'failed';
        step.error = 'Handler not found';

        if (step.automationLevel === 'full-auto') {
          workflow.status = 'failed';
          break;
        }
      }

      step.executedAt = Date.now();
      step.duration = step.executedAt - stepStartTime;
    }

    if (workflow.status === 'active') {
      workflow.status = 'completed';
    }

    workflow.totalDuration = Date.now() - startTime;

    // Calculate automation score
    const autoSteps = workflow.steps.filter((s) => s.automationLevel === 'full-auto').length;
    workflow.automationScore = (autoSteps / workflow.steps.length) * 100;

    this.workflowHistory.push(workflow);
    return workflow;
  }

  /**
   * Pause workflow
   */
  pauseWorkflow(workflowId: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || workflow.status !== 'active') return false;

    workflow.status = 'paused';
    return true;
  }

  /**
   * Resume workflow
   */
  async resumeWorkflow(workflowId: string): Promise<AutomatedIncidentWorkflow | null> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || workflow.status !== 'paused') return null;

    workflow.status = 'active';

    // Continue from current step
    for (let i = workflow.currentStepIndex; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];

      if (step.status === 'pending' || step.status === 'failed') {
        step.status = 'executing';
        const stepStartTime = Date.now();

        const handler = this.stepHandlers.get(step.type);
        if (handler) {
          try {
            const result = await handler(step, workflow.metadata);
            step.status = 'completed';
            step.result = result;
          } catch (error) {
            step.status = 'failed';
            step.error = error instanceof Error ? error.message : String(error);
          }
        }

        step.executedAt = Date.now();
        step.duration = step.executedAt - stepStartTime;
      }

      workflow.currentStepIndex = i;
    }

    workflow.status = 'completed';
    return workflow;
  }

  /**
   * Get workflow
   */
  getWorkflow(workflowId: string): AutomatedIncidentWorkflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get workflows by incident
   */
  getWorkflowsByIncident(incidentId: string): AutomatedIncidentWorkflow[] {
    return Array.from(this.workflows.values()).filter((w) => w.incidentId === incidentId);
  }

  /**
   * Get active workflows
   */
  getActiveWorkflows(): AutomatedIncidentWorkflow[] {
    return Array.from(this.workflows.values()).filter((w) => w.status === 'active');
  }

  /**
   * Get completed workflows
   */
  getCompletedWorkflows(): AutomatedIncidentWorkflow[] {
    return Array.from(this.workflows.values()).filter((w) => w.status === 'completed');
  }

  /**
   * Get workflow history
   */
  getWorkflowHistory(limit = 100): AutomatedIncidentWorkflow[] {
    return this.workflowHistory.slice(-limit);
  }

  /**
   * Get workflow statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalWorkflows = this.workflows.size;
    const activeWorkflows = Array.from(this.workflows.values()).filter(
      (w) => w.status === 'active'
    ).length;
    const completedWorkflows = Array.from(this.workflows.values()).filter(
      (w) => w.status === 'completed'
    ).length;
    const failedWorkflows = Array.from(this.workflows.values()).filter(
      (w) => w.status === 'failed'
    ).length;

    const avgAutomationScore =
      completedWorkflows > 0
        ? Array.from(this.workflows.values())
            .filter((w) => w.status === 'completed')
            .reduce((sum, w) => sum + w.automationScore, 0) / completedWorkflows
        : 0;

    const avgDuration =
      completedWorkflows > 0
        ? Array.from(this.workflows.values())
            .filter((w) => w.status === 'completed')
            .reduce((sum, w) => sum + w.totalDuration, 0) / completedWorkflows
        : 0;

    const stepTypeDistribution: Record<string, number> = {};
    for (const workflow of this.workflowHistory) {
      for (const step of workflow.steps) {
        stepTypeDistribution[step.type] = (stepTypeDistribution[step.type] || 0) + 1;
      }
    }

    const successRate = totalWorkflows > 0 ? (completedWorkflows / totalWorkflows) * 100 : 0;

    return {
      totalWorkflows,
      activeWorkflows,
      completedWorkflows,
      failedWorkflows,
      successRate,
      avgAutomationScore,
      avgDuration,
      stepTypeDistribution,
    };
  }

  /**
   * Export workflow report
   */
  exportWorkflowReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(
        {
          workflows: Array.from(this.workflows.values()),
          statistics: this.getStatistics(),
          recentWorkflows: this.workflowHistory.slice(-50),
        },
        null,
        2
      );
    }

    // CSV format
    const headers = ['WorkflowID', 'IncidentID', 'Status', 'AutomationScore', 'Duration'];
    const rows = this.workflowHistory
      .slice(-100)
      .map((w) => [w.id, w.incidentId, w.status, w.automationScore, w.totalDuration]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
