/**
 * Automated Response System
 * Executes automated security responses
 */

/**
 * Response action type
 */
export type ResponseActionType =
  | 'block_ip'
  | 'isolate_system'
  | 'kill_process'
  | 'revoke_credentials'
  | 'alert_admin'
  | 'quarantine_file'
  | 'disable_account'
  | 'enable_mfa'
  | 'custom';

/**
 * Response status
 */
export type ResponseStatus = 'pending' | 'executing' | 'completed' | 'failed' | 'rolled_back';

/**
 * Automated response rule
 */
export interface AutomatedResponseRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: {
    eventType: string;
    severity: string;
    condition: (data: Record<string, unknown>) => boolean;
  };
  actions: ResponseAction[];
  priority: number;
  cooldown: number; // milliseconds
  maxExecutions: number;
}

/**
 * Response action
 */
export interface ResponseAction {
  id: string;
  type: ResponseActionType;
  parameters: Record<string, unknown>;
  timeout: number;
  rollbackable: boolean;
}

/**
 * Response execution
 */
export interface ResponseExecution {
  id: string;
  timestamp: number;
  ruleId: string;
  eventId: string;
  actions: Array<{
    actionId: string;
    status: ResponseStatus;
    startTime: number;
    endTime?: number;
    result?: Record<string, unknown>;
    error?: string;
  }>;
  overallStatus: ResponseStatus;
  rollbackExecuted: boolean;
}

/**
 * Automated Response System
 * Executes automated responses to security events
 */
export class AutomatedResponseSystem {
  private rules: Map<string, AutomatedResponseRule> = new Map();
  private executions: Map<string, ResponseExecution> = new Map();
  private executionHistory: ResponseExecution[] = [];
  private lastExecutionTime: Map<string, number> = new Map();
  private executionCount: Map<string, number> = new Map();
  private responseHandlers: Map<
    ResponseActionType,
    (params: Record<string, unknown>) => Promise<Record<string, unknown>>
  > = new Map();

  constructor() {
    this.initializeDefaultHandlers();
  }

  /**
   * Initialize default response handlers
   */
  private initializeDefaultHandlers(): void {
    this.responseHandlers.set('block_ip', async (params) => ({
      blocked: true,
      ip: params.ip,
      timestamp: Date.now(),
    }));

    this.responseHandlers.set('isolate_system', async (params) => ({
      isolated: true,
      system: params.system,
      timestamp: Date.now(),
    }));

    this.responseHandlers.set('kill_process', async (params) => ({
      killed: true,
      process: params.process,
      timestamp: Date.now(),
    }));

    this.responseHandlers.set('revoke_credentials', async (params) => ({
      revoked: true,
      user: params.user,
      timestamp: Date.now(),
    }));

    this.responseHandlers.set('alert_admin', async (params) => ({
      alerted: true,
      admin: params.admin,
      message: params.message,
      timestamp: Date.now(),
    }));

    this.responseHandlers.set('quarantine_file', async (params) => ({
      quarantined: true,
      file: params.file,
      timestamp: Date.now(),
    }));

    this.responseHandlers.set('disable_account', async (params) => ({
      disabled: true,
      account: params.account,
      timestamp: Date.now(),
    }));

    this.responseHandlers.set('enable_mfa', async (params) => ({
      enabled: true,
      account: params.account,
      timestamp: Date.now(),
    }));
  }

  /**
   * Create response rule
   */
  createRule(rule: Omit<AutomatedResponseRule, 'id'>): AutomatedResponseRule {
    const id = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const responseRule: AutomatedResponseRule = { ...rule, id };
    this.rules.set(id, responseRule);
    return responseRule;
  }

  /**
   * Register response handler
   */
  registerResponseHandler(
    type: ResponseActionType,
    handler: (params: Record<string, unknown>) => Promise<Record<string, unknown>>
  ): void {
    this.responseHandlers.set(type, handler);
  }

  /**
   * Execute response for event
   */
  async executeResponse(
    eventId: string,
    eventData: Record<string, unknown>
  ): Promise<ResponseExecution | null> {
    const applicableRules = this.findApplicableRules(eventData);

    if (applicableRules.length === 0) return null;

    // Sort by priority
    applicableRules.sort((a, b) => b.priority - a.priority);

    const rule = applicableRules[0];

    // Check cooldown
    if (!this.canExecuteRule(rule)) {
      return null;
    }

    // Check max executions
    const execCount = this.executionCount.get(rule.id) || 0;
    if (execCount >= rule.maxExecutions) {
      return null;
    }

    // Create execution
    const id = `execution-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const execution: ResponseExecution = {
      id,
      timestamp: Date.now(),
      ruleId: rule.id,
      eventId,
      actions: [],
      overallStatus: 'pending',
      rollbackExecuted: false,
    };

    // Execute actions
    for (const action of rule.actions) {
      const actionExecution = await this.executeAction(action, eventData);
      execution.actions.push(actionExecution);
    }

    // Determine overall status
    const failedActions = execution.actions.filter((a) => a.status === 'failed');
    execution.overallStatus = failedActions.length > 0 ? 'failed' : 'completed';

    // Update tracking
    this.lastExecutionTime.set(rule.id, Date.now());
    this.executionCount.set(rule.id, execCount + 1);

    this.executions.set(id, execution);
    this.executionHistory.push(execution);

    return execution;
  }

  /**
   * Find applicable rules
   */
  private findApplicableRules(eventData: Record<string, unknown>): AutomatedResponseRule[] {
    const applicable: AutomatedResponseRule[] = [];

    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;

      try {
        if (rule.trigger.condition(eventData)) {
          applicable.push(rule);
        }
      } catch {
        // Ignore errors in condition evaluation
      }
    }

    return applicable;
  }

  /**
   * Check if rule can be executed
   */
  private canExecuteRule(rule: AutomatedResponseRule): boolean {
    const lastExecution = this.lastExecutionTime.get(rule.id);
    if (!lastExecution) return true;

    const timeSinceLastExecution = Date.now() - lastExecution;
    return timeSinceLastExecution >= rule.cooldown;
  }

  /**
   * Execute single action
   */
  private async executeAction(
    action: ResponseAction,
    eventData: Record<string, unknown>
  ): Promise<{
    actionId: string;
    status: ResponseStatus;
    startTime: number;
    endTime?: number;
    result?: Record<string, unknown>;
    error?: string;
  }> {
    const startTime = Date.now();
    const handler = this.responseHandlers.get(action.type);

    if (!handler) {
      return {
        actionId: action.id,
        status: 'failed',
        startTime,
        endTime: Date.now(),
        error: `No handler for action type: ${action.type}`,
      };
    }

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Action timeout')), action.timeout)
      );

      const result = await Promise.race([handler(action.parameters), timeoutPromise]);

      return {
        actionId: action.id,
        status: 'completed',
        startTime,
        endTime: Date.now(),
        result,
      };
    } catch (error) {
      return {
        actionId: action.id,
        status: 'failed',
        startTime,
        endTime: Date.now(),
        error: String(error),
      };
    }
  }

  /**
   * Rollback response
   */
  async rollbackResponse(executionId: string): Promise<boolean> {
    const execution = this.executions.get(executionId);
    if (!execution || execution.rollbackExecuted) return false;

    // Rollback actions in reverse order
    for (let i = execution.actions.length - 1; i >= 0; i--) {
      const actionExecution = execution.actions[i];
      const rule = this.rules.get(execution.ruleId);
      if (!rule) continue;

      const action = rule.actions.find((a) => a.id === actionExecution.actionId);
      if (!action || !action.rollbackable) continue;

      // Execute rollback (simplified)
      actionExecution.status = 'rolled_back';
    }

    execution.rollbackExecuted = true;
    return true;
  }

  /**
   * Get execution
   */
  getExecution(executionId: string): ResponseExecution | undefined {
    return this.executions.get(executionId);
  }

  /**
   * Get executions by rule
   */
  getExecutionsByRule(ruleId: string): ResponseExecution[] {
    return this.executionHistory.filter((e) => e.ruleId === ruleId);
  }

  /**
   * Get failed executions
   */
  getFailedExecutions(): ResponseExecution[] {
    return this.executionHistory.filter((e) => e.overallStatus === 'failed');
  }

  /**
   * Get executions in time range
   */
  getExecutionsInTimeRange(startTime: number, endTime: number): ResponseExecution[] {
    return this.executionHistory.filter((e) => e.timestamp >= startTime && e.timestamp <= endTime);
  }

  /**
   * Get response statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalExecutions = this.executionHistory.length;
    const successfulExecutions = this.executionHistory.filter(
      (e) => e.overallStatus === 'completed'
    ).length;
    const failedExecutions = this.executionHistory.filter(
      (e) => e.overallStatus === 'failed'
    ).length;
    const rolledBackExecutions = this.executionHistory.filter((e) => e.rollbackExecuted).length;

    const executionsByRule: Record<string, number> = {};
    for (const execution of this.executionHistory) {
      executionsByRule[execution.ruleId] = (executionsByRule[execution.ruleId] || 0) + 1;
    }

    const avgExecutionTime =
      totalExecutions > 0
        ? this.executionHistory.reduce((sum, e) => {
            const actionTimes = e.actions.map((a) => (a.endTime || 0) - a.startTime);
            return sum + Math.max(...actionTimes, 0);
          }, 0) / totalExecutions
        : 0;

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      rolledBackExecutions,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0,
      executionsByRule,
      avgExecutionTime,
      ruleCount: this.rules.size,
    };
  }

  /**
   * Update rule
   */
  updateRule(id: string, updates: Partial<AutomatedResponseRule>): boolean {
    const rule = this.rules.get(id);
    if (!rule) return false;

    Object.assign(rule, updates);
    return true;
  }

  /**
   * Delete rule
   */
  deleteRule(id: string): boolean {
    return this.rules.delete(id);
  }

  /**
   * Get all rules
   */
  getRules(): AutomatedResponseRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Export response report
   */
  exportResponseReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.executionHistory, null, 2);
    }

    // CSV format
    const headers = ['ID', 'Timestamp', 'Rule ID', 'Event ID', 'Status', 'Rolled Back'];
    const rows = this.executionHistory.map((e) => [
      e.id,
      e.timestamp,
      e.ruleId,
      e.eventId,
      e.overallStatus,
      e.rollbackExecuted,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
