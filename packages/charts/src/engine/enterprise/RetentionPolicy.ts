/**
 * Data Retention Policies
 * Retention rules, auto-cleanup, and policy management
 */

export interface RetentionRule {
  id: string;
  name: string;
  dataType: string;
  retentionDays: number;
  action: 'delete' | 'archive';
  isActive: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface RetentionExecution {
  id: string;
  ruleId: string;
  executedAt: Date;
  itemsProcessed: number;
  itemsDeleted: number;
  itemsArchived: number;
  status: 'completed' | 'failed';
  error?: string;
}

/**
 * Retention Policy Manager
 */
export class RetentionPolicy {
  private rules: Map<string, RetentionRule> = new Map();
  private executions: Map<string, RetentionExecution[]> = new Map();
  private listeners: Map<string, Function[]> = new Map();
  private dataStore: Map<string, { createdAt: Date; data: any }> = new Map();

  /**
   * Create retention rule
   */
  public createRule(
    name: string,
    dataType: string,
    retentionDays: number,
    action: 'delete' | 'archive' = 'delete'
  ): RetentionRule {
    const id = this.generateId();

    const rule: RetentionRule = {
      id,
      name,
      dataType,
      retentionDays,
      action,
      isActive: true,
      createdAt: new Date(),
    };

    this.rules.set(id, rule);
    this.executions.set(id, []);
    this.emit('rule:created', { ruleId: id, name });

    return rule;
  }

  /**
   * Get rule
   */
  public getRule(ruleId: string): RetentionRule | undefined {
    return this.rules.get(ruleId);
  }

  /**
   * List rules
   */
  public listRules(filter?: { dataType?: string; isActive?: boolean }): RetentionRule[] {
    let rules = Array.from(this.rules.values());

    if (filter?.dataType) {
      rules = rules.filter((r) => r.dataType === filter.dataType);
    }

    if (filter?.isActive !== undefined) {
      rules = rules.filter((r) => r.isActive === filter.isActive);
    }

    return rules;
  }

  /**
   * Update rule
   */
  public updateRule(
    ruleId: string,
    updates: { retentionDays?: number; action?: 'delete' | 'archive'; isActive?: boolean }
  ): RetentionRule | undefined {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      return undefined;
    }

    if (updates.retentionDays !== undefined) rule.retentionDays = updates.retentionDays;
    if (updates.action !== undefined) rule.action = updates.action;
    if (updates.isActive !== undefined) rule.isActive = updates.isActive;

    this.emit('rule:updated', { ruleId, updates });

    return rule;
  }

  /**
   * Delete rule
   */
  public deleteRule(ruleId: string): boolean {
    const deleted = this.rules.delete(ruleId);
    if (deleted) {
      this.executions.delete(ruleId);
      this.emit('rule:deleted', { ruleId });
    }
    return deleted;
  }

  /**
   * Store data
   */
  public storeData(key: string, data: any, dataType: string): void {
    this.dataStore.set(key, { createdAt: new Date(), data });
    this.emit('data:stored', { key, dataType });
  }

  /**
   * Execute retention policy
   */
  public async executePolicy(ruleId: string): Promise<RetentionExecution> {
    const rule = this.rules.get(ruleId);
    if (!rule || !rule.isActive) {
      throw new Error('Rule not found or inactive');
    }

    const executionId = this.generateId();
    const execution: RetentionExecution = {
      id: executionId,
      ruleId,
      executedAt: new Date(),
      itemsProcessed: 0,
      itemsDeleted: 0,
      itemsArchived: 0,
      status: 'completed',
    };

    try {
      const cutoffDate = new Date(Date.now() - rule.retentionDays * 24 * 60 * 60 * 1000);
      const keysToProcess: string[] = [];

      // Find items matching the rule
      this.dataStore.forEach((value, key) => {
        if (value.createdAt < cutoffDate) {
          keysToProcess.push(key);
        }
      });

      execution.itemsProcessed = keysToProcess.length;

      // Process items
      keysToProcess.forEach((key) => {
        if (rule.action === 'delete') {
          this.dataStore.delete(key);
          execution.itemsDeleted++;
        } else if (rule.action === 'archive') {
          // In production, archive to cold storage
          execution.itemsArchived++;
        }
      });

      const executions = this.executions.get(ruleId) || [];
      executions.push(execution);
      this.executions.set(ruleId, executions);

      this.emit('policy:executed', {
        ruleId,
        executionId,
        itemsProcessed: execution.itemsProcessed,
        itemsDeleted: execution.itemsDeleted,
      });
    } catch (error) {
      execution.status = 'failed';
      execution.error = String(error);
      this.emit('policy:execution_failed', { ruleId, error });
    }

    return execution;
  }

  /**
   * Execute all active policies
   */
  public async executeAllPolicies(): Promise<RetentionExecution[]> {
    const results: RetentionExecution[] = [];
    const activeRules = Array.from(this.rules.values()).filter((r) => r.isActive);

    for (const rule of activeRules) {
      try {
        const execution = await this.executePolicy(rule.id);
        results.push(execution);
      } catch (error) {
        // Continue with next rule
      }
    }

    return results;
  }

  /**
   * Get rule executions
   */
  public getRuleExecutions(ruleId: string, limit: number = 100): RetentionExecution[] {
    const executions = this.executions.get(ruleId) || [];
    return executions.slice(-limit);
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    totalRules: number;
    activeRules: number;
    totalExecutions: number;
    totalItemsDeleted: number;
    totalItemsArchived: number;
  } {
    const rules = Array.from(this.rules.values());
    const activeRules = rules.filter((r) => r.isActive).length;

    let totalExecutions = 0;
    let totalItemsDeleted = 0;
    let totalItemsArchived = 0;

    this.executions.forEach((execs) => {
      totalExecutions += execs.length;
      execs.forEach((exec) => {
        totalItemsDeleted += exec.itemsDeleted;
        totalItemsArchived += exec.itemsArchived;
      });
    });

    return {
      totalRules: rules.length,
      activeRules,
      totalExecutions,
      totalItemsDeleted,
      totalItemsArchived,
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `retention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
   * Destroy manager
   */
  public destroy(): void {
    this.rules.clear();
    this.executions.clear();
    this.dataStore.clear();
    this.listeners.clear();
  }
}

export default RetentionPolicy;
