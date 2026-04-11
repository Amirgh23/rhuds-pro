/**
 * Security Automation Engine
 * Automated security response workflows and execution
 */

/**
 * Automation rule
 */
export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'alert' | 'metric' | 'schedule' | 'event';
    condition: Record<string, unknown>;
  };
  actions: Array<{
    type: string;
    params: Record<string, unknown>;
  }>;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * Automation execution
 */
export interface AutomationExecution {
  id: string;
  ruleId: string;
  timestamp: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  actions: Array<{
    type: string;
    status: 'pending' | 'completed' | 'failed';
    result?: unknown;
    error?: string;
  }>;
  duration: number;
}

/**
 * Security Automation Engine
 * Automated security response workflows and execution
 */
export class SecurityAutomationEngine {
  private rules: Map<string, AutomationRule> = new Map();
  private executions: Map<string, AutomationExecution> = new Map();
  private executionHistory: AutomationExecution[] = [];
  private actionHandlers: Map<string, (params: Record<string, unknown>) => Promise<unknown>> =
    new Map();
  private triggerHandlers: Map<string, (condition: Record<string, unknown>) => boolean> = new Map();

  /**
   * Register automation rule
   */
  registerRule(rule: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>): AutomationRule {
    const id = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const automationRule: AutomationRule = {
      ...rule,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.rules.set(id, automationRule);
    return automationRule;
  }

  /**
   * Register action handler
   */
  registerActionHandler(
    actionType: string,
    handler: (params: Record<string, unknown>) => Promise<unknown>
  ): void {
    this.actionHandlers.set(actionType, handler);
  }

  /**
   * Register trigger handler
   */
  registerTriggerHandler(
    triggerType: string,
    handler: (condition: Record<string, unknown>) => boolean
  ): void {
    this.triggerHandlers.set(triggerType, handler);
  }

  /**
   * Evaluate trigger
   */
  private evaluateTrigger(trigger: AutomationRule['trigger']): boolean {
    const handler = this.triggerHandlers.get(trigger.type);
    if (!handler) return false;

    try {
      return handler(trigger.condition);
    } catch {
      return false;
    }
  }

  /**
   * Execute automation rule
   */
  async executeRule(ruleId: string): Promise<AutomationExecution | null> {
    const rule = this.rules.get(ruleId);
    if (!rule || !rule.enabled) return null;

    if (!this.evaluateTrigger(rule.trigger)) {
      return null;
    }

    const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    const execution: AutomationExecution = {
      id: executionId,
      ruleId,
      timestamp: startTime,
      status: 'running',
      actions: rule.actions.map((a) => ({
        type: a.type,
        status: 'pending',
      })),
      duration: 0,
    };

    this.executions.set(executionId, execution);

    // Execute actions
    for (let i = 0; i < rule.actions.length; i++) {
      const action = rule.actions[i];
      const handler = this.actionHandlers.get(action.type);

      if (handler) {
        try {
          const result = await handler(action.params);
          execution.actions[i].status = 'completed';
          execution.actions[i].result = result;
        } catch (error) {
          execution.actions[i].status = 'failed';
          execution.actions[i].error = error instanceof Error ? error.message : String(error);
        }
      } else {
        execution.actions[i].status = 'failed';
        execution.actions[i].error = 'Handler not found';
      }
    }

    execution.status = execution.actions.every((a) => a.status === 'completed')
      ? 'completed'
      : 'failed';
    execution.duration = Date.now() - startTime;

    this.executionHistory.push(execution);
    return execution;
  }

  /**
   * Enable rule
   */
  enableRule(ruleId: string): boolean {
    const rule = this.rules.get(ruleId);
    if (!rule) return false;

    rule.enabled = true;
    rule.updatedAt = Date.now();
    return true;
  }

  /**
   * Disable rule
   */
  disableRule(ruleId: string): boolean {
    const rule = this.rules.get(ruleId);
    if (!rule) return false;

    rule.enabled = false;
    rule.updatedAt = Date.now();
    return true;
  }

  /**
   * Get rule
   */
  getRule(ruleId: string): AutomationRule | undefined {
    return this.rules.get(ruleId);
  }

  /**
   * Get all rules
   */
  getAllRules(): AutomationRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Get enabled rules
   */
  getEnabledRules(): AutomationRule[] {
    return Array.from(this.rules.values()).filter((r) => r.enabled);
  }

  /**
   * Get execution
   */
  getExecution(executionId: string): AutomationExecution | undefined {
    return this.executions.get(executionId);
  }

  /**
   * Get execution history
   */
  getExecutionHistory(ruleId?: string, limit = 100): AutomationExecution[] {
    let history = this.executionHistory;

    if (ruleId) {
      history = history.filter((e) => e.ruleId === ruleId);
    }

    return history.slice(-limit);
  }

  /**
   * Get automation statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalRules = this.rules.size;
    const enabledRules = Array.from(this.rules.values()).filter((r) => r.enabled).length;
    const totalExecutions = this.executionHistory.length;
    const successfulExecutions = this.executionHistory.filter(
      (e) => e.status === 'completed'
    ).length;
    const failedExecutions = this.executionHistory.filter((e) => e.status === 'failed').length;

    const avgDuration =
      totalExecutions > 0
        ? this.executionHistory.reduce((sum, e) => sum + e.duration, 0) / totalExecutions
        : 0;

    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;

    const executionsByType: Record<string, number> = {};
    for (const execution of this.executionHistory) {
      const rule = this.rules.get(execution.ruleId);
      if (rule) {
        executionsByType[rule.trigger.type] = (executionsByType[rule.trigger.type] || 0) + 1;
      }
    }

    return {
      totalRules,
      enabledRules,
      disabledRules: totalRules - enabledRules,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      successRate,
      avgDuration,
      executionsByType,
    };
  }

  /**
   * Export automation report
   */
  exportAutomationReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(
        {
          rules: Array.from(this.rules.values()),
          statistics: this.getStatistics(),
          recentExecutions: this.executionHistory.slice(-50),
        },
        null,
        2
      );
    }

    // CSV format
    const headers = ['RuleID', 'ExecutionID', 'Timestamp', 'Status', 'Duration'];
    const rows = this.executionHistory
      .slice(-100)
      .map((e) => [e.ruleId, e.id, e.timestamp, e.status, e.duration]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
