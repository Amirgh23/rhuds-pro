/**
 * Threat Mitigation Engine
 * Executes threat mitigation strategies and tracks effectiveness
 */

/**
 * Mitigation strategy definition
 */
export interface MitigationStrategy {
  id: string;
  threatId: string;
  threatType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  tactics: string[];
  estimatedImpact: number;
  estimatedDuration: number;
  status: 'planned' | 'executing' | 'completed' | 'failed';
  createdAt: Date;
}

/**
 * Mitigation action
 */
export interface MitigationAction {
  id: string;
  strategyId: string;
  tactic: string;
  action: string;
  parameters: Record<string, unknown>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  executedAt?: Date;
  result?: Record<string, unknown>;
}

/**
 * Mitigation effectiveness
 */
export interface MitigationEffectiveness {
  strategyId: string;
  threatId: string;
  riskReduction: number;
  timeToMitigation: number;
  actionsExecuted: number;
  successRate: number;
  residualRisk: number;
}

/**
 * Mitigation statistics
 */
export interface MitigationStatistics {
  totalStrategies: number;
  completedStrategies: number;
  failedStrategies: number;
  totalActions: number;
  successfulActions: number;
  failedActions: number;
  averageRiskReduction: number;
  averageTimeToMitigation: number;
}

/**
 * Threat Mitigation Engine
 * Executes and tracks threat mitigation strategies
 */
export class ThreatMitigationEngine {
  private strategies: Map<string, MitigationStrategy> = new Map();
  private actions: Map<string, MitigationAction> = new Map();
  private effectiveness: Map<string, MitigationEffectiveness> = new Map();
  private actionExecutors: Map<
    string,
    (params: Record<string, unknown>) => Promise<Record<string, unknown>>
  > = new Map();

  /**
   * Register action executor
   */
  registerActionExecutor(
    tactic: string,
    executor: (params: Record<string, unknown>) => Promise<Record<string, unknown>>
  ): void {
    this.actionExecutors.set(tactic, executor);
  }

  /**
   * Create mitigation strategy
   */
  createStrategy(
    threatId: string,
    threatType: string,
    severity: string,
    tactics: string[]
  ): MitigationStrategy {
    const id = `strategy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const strategy: MitigationStrategy = {
      id,
      threatId,
      threatType,
      severity: severity as 'critical' | 'high' | 'medium' | 'low',
      tactics,
      estimatedImpact: 0.8,
      estimatedDuration: tactics.length * 1000,
      status: 'planned',
      createdAt: new Date(),
    };

    this.strategies.set(id, strategy);
    return strategy;
  }

  /**
   * Execute mitigation strategy
   */
  async executeMitigationStrategy(strategyId: string): Promise<MitigationEffectiveness> {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) {
      throw new Error(`Strategy ${strategyId} not found`);
    }

    strategy.status = 'executing';
    const startTime = Date.now();
    let successCount = 0;
    let failureCount = 0;
    let totalRiskReduction = 0;

    for (const tactic of strategy.tactics) {
      const actionId = `action-${strategyId}-${tactic}`;
      const action: MitigationAction = {
        id: actionId,
        strategyId,
        tactic,
        action: tactic,
        parameters: { threatId: strategy.threatId },
        status: 'executing',
      };

      this.actions.set(actionId, action);

      try {
        const executor = this.actionExecutors.get(tactic);
        if (executor) {
          action.result = await executor(action.parameters);
          action.status = 'completed';
          successCount++;
          totalRiskReduction += 0.2; // Each tactic reduces risk by 20%
        } else {
          action.status = 'failed';
          action.result = { error: `No executor for tactic: ${tactic}` };
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
    const successRate = strategy.tactics.length > 0 ? successCount / strategy.tactics.length : 0;
    const residualRisk = Math.max(0, 1 - totalRiskReduction);

    strategy.status = successRate === 1 ? 'completed' : failureCount > 0 ? 'failed' : 'completed';

    const effectiveness: MitigationEffectiveness = {
      strategyId,
      threatId: strategy.threatId,
      riskReduction: totalRiskReduction,
      timeToMitigation: totalDuration,
      actionsExecuted: strategy.tactics.length,
      successRate,
      residualRisk,
    };

    this.effectiveness.set(strategyId, effectiveness);
    return effectiveness;
  }

  /**
   * Get strategy
   */
  getStrategy(strategyId: string): MitigationStrategy | undefined {
    return this.strategies.get(strategyId);
  }

  /**
   * Get action
   */
  getAction(actionId: string): MitigationAction | undefined {
    return this.actions.get(actionId);
  }

  /**
   * Get effectiveness
   */
  getEffectiveness(strategyId: string): MitigationEffectiveness | undefined {
    return this.effectiveness.get(strategyId);
  }

  /**
   * Get strategies by threat
   */
  getStrategiesByThreat(threatId: string): MitigationStrategy[] {
    return Array.from(this.strategies.values()).filter((s) => s.threatId === threatId);
  }

  /**
   * Get strategies by status
   */
  getStrategiesByStatus(status: string): MitigationStrategy[] {
    return Array.from(this.strategies.values()).filter((s) => s.status === status);
  }

  /**
   * Get strategies by severity
   */
  getStrategiesBySeverity(severity: string): MitigationStrategy[] {
    return Array.from(this.strategies.values()).filter((s) => s.severity === severity);
  }

  /**
   * Get actions by strategy
   */
  getActionsByStrategy(strategyId: string): MitigationAction[] {
    return Array.from(this.actions.values()).filter((a) => a.strategyId === strategyId);
  }

  /**
   * Get failed actions
   */
  getFailedActions(): MitigationAction[] {
    return Array.from(this.actions.values()).filter((a) => a.status === 'failed');
  }

  /**
   * Retry failed strategy
   */
  async retryStrategy(strategyId: string): Promise<MitigationEffectiveness> {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) {
      throw new Error(`Strategy ${strategyId} not found`);
    }

    // Reset failed actions
    const strategyActions = this.getActionsByStrategy(strategyId);
    strategyActions.forEach((action) => {
      if (action.status === 'failed') {
        action.status = 'pending';
        action.executedAt = undefined;
        action.result = undefined;
      }
    });

    return this.executeMitigationStrategy(strategyId);
  }

  /**
   * Get statistics
   */
  getStatistics(): MitigationStatistics {
    const allStrategies = Array.from(this.strategies.values());
    const completedStrategies = allStrategies.filter((s) => s.status === 'completed');
    const failedStrategies = allStrategies.filter((s) => s.status === 'failed');
    const allActions = Array.from(this.actions.values());
    const successfulActions = allActions.filter((a) => a.status === 'completed');
    const failedActions = allActions.filter((a) => a.status === 'failed');
    const allEffectiveness = Array.from(this.effectiveness.values());

    const avgRiskReduction =
      allEffectiveness.length > 0
        ? allEffectiveness.reduce((sum, e) => sum + e.riskReduction, 0) / allEffectiveness.length
        : 0;

    const avgTimeToMitigation =
      allEffectiveness.length > 0
        ? allEffectiveness.reduce((sum, e) => sum + e.timeToMitigation, 0) / allEffectiveness.length
        : 0;

    return {
      totalStrategies: allStrategies.length,
      completedStrategies: completedStrategies.length,
      failedStrategies: failedStrategies.length,
      totalActions: allActions.length,
      successfulActions: successfulActions.length,
      failedActions: failedActions.length,
      averageRiskReduction: avgRiskReduction,
      averageTimeToMitigation: avgTimeToMitigation,
    };
  }

  /**
   * Export mitigation report
   */
  exportMitigationReport(format: 'json' | 'csv'): string {
    const stats = this.getStatistics();
    const strategies = Array.from(this.strategies.values());

    if (format === 'json') {
      return JSON.stringify({ statistics: stats, strategies }, null, 2);
    }

    const rows = [
      ['Metric', 'Value'],
      ['Total Strategies', stats.totalStrategies.toString()],
      ['Completed Strategies', stats.completedStrategies.toString()],
      ['Failed Strategies', stats.failedStrategies.toString()],
      ['Total Actions', stats.totalActions.toString()],
      ['Successful Actions', stats.successfulActions.toString()],
      ['Failed Actions', stats.failedActions.toString()],
      ['Average Risk Reduction', stats.averageRiskReduction.toFixed(2)],
      ['Average Time to Mitigation (ms)', stats.averageTimeToMitigation.toFixed(2)],
    ];

    return rows.map((row) => row.join(',')).join('\n');
  }
}
