/**
 * Security Policy Enforcer
 * Enforces security policies and access controls
 */

/**
 * Security policy
 */
export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  rules: Array<{
    id: string;
    name: string;
    condition: (context: Record<string, unknown>) => boolean;
    action: 'allow' | 'deny' | 'challenge';
    severity: 'critical' | 'high' | 'medium' | 'low';
  }>;
  exceptions: Array<{
    id: string;
    ruleId: string;
    condition: (context: Record<string, unknown>) => boolean;
    expiresAt?: number;
  }>;
}

/**
 * Policy enforcement result
 */
export interface PolicyEnforcementResult {
  id: string;
  timestamp: number;
  policyId: string;
  ruleId: string;
  decision: 'allow' | 'deny' | 'challenge';
  reason: string;
  context: Record<string, unknown>;
  enforced: boolean;
}

/**
 * Security Policy Enforcer
 * Enforces security policies and access controls
 */
export class SecurityPolicyEnforcer {
  private policies: Map<string, SecurityPolicy> = new Map();
  private enforcementResults: Map<string, PolicyEnforcementResult> = new Map();
  private enforcementHistory: PolicyEnforcementResult[] = [];
  private violationCallbacks: Array<(result: PolicyEnforcementResult) => void> = [];

  /**
   * Create security policy
   */
  createPolicy(policy: Omit<SecurityPolicy, 'id'>): SecurityPolicy {
    const id = `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const securityPolicy: SecurityPolicy = { ...policy, id };
    this.policies.set(id, securityPolicy);
    return securityPolicy;
  }

  /**
   * Enforce policy
   */
  enforcePolicy(policyId: string, context: Record<string, unknown>): PolicyEnforcementResult {
    const policy = this.policies.get(policyId);
    if (!policy || !policy.enabled) {
      return {
        id: `result-${Date.now()}`,
        timestamp: Date.now(),
        policyId,
        ruleId: '',
        decision: 'allow',
        reason: 'Policy not found or disabled',
        context,
        enforced: false,
      };
    }

    // Sort rules by priority
    const sortedRules = [...policy.rules].sort((a, b) => {
      const severityMap: Record<string, number> = {
        critical: 1,
        high: 2,
        medium: 3,
        low: 4,
      };
      return severityMap[a.severity] - severityMap[b.severity];
    });

    for (const rule of sortedRules) {
      try {
        if (rule.condition(context)) {
          // Check exceptions
          let hasException = false;
          for (const exception of policy.exceptions) {
            if (exception.ruleId === rule.id) {
              if (!exception.expiresAt || exception.expiresAt > Date.now()) {
                if (exception.condition(context)) {
                  hasException = true;
                  break;
                }
              }
            }
          }

          if (hasException) {
            continue;
          }

          const result: PolicyEnforcementResult = {
            id: `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            policyId,
            ruleId: rule.id,
            decision: rule.action,
            reason: `Rule '${rule.name}' matched`,
            context,
            enforced: true,
          };

          this.enforcementResults.set(result.id, result);
          this.enforcementHistory.push(result);

          if (rule.action === 'deny') {
            this.notifyViolation(result);
          }

          return result;
        }
      } catch {
        // Ignore errors in rule evaluation
      }
    }

    // Default allow
    const result: PolicyEnforcementResult = {
      id: `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      policyId,
      ruleId: '',
      decision: 'allow',
      reason: 'No rules matched',
      context,
      enforced: false,
    };

    this.enforcementResults.set(result.id, result);
    this.enforcementHistory.push(result);

    return result;
  }

  /**
   * Register violation callback
   */
  onViolation(callback: (result: PolicyEnforcementResult) => void): void {
    this.violationCallbacks.push(callback);
  }

  /**
   * Notify violation
   */
  private notifyViolation(result: PolicyEnforcementResult): void {
    for (const callback of this.violationCallbacks) {
      try {
        callback(result);
      } catch {
        // Ignore callback errors
      }
    }
  }

  /**
   * Add exception to policy
   */
  addException(
    policyId: string,
    ruleId: string,
    condition: (context: Record<string, unknown>) => boolean,
    expiresAt?: number
  ): boolean {
    const policy = this.policies.get(policyId);
    if (!policy) return false;

    const exception = {
      id: `exception-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ruleId,
      condition,
      expiresAt,
    };

    policy.exceptions.push(exception);
    return true;
  }

  /**
   * Remove exception
   */
  removeException(policyId: string, exceptionId: string): boolean {
    const policy = this.policies.get(policyId);
    if (!policy) return false;

    const index = policy.exceptions.findIndex((e) => e.id === exceptionId);
    if (index === -1) return false;

    policy.exceptions.splice(index, 1);
    return true;
  }

  /**
   * Get policy violations
   */
  getPolicyViolations(policyId: string, limit = 100): PolicyEnforcementResult[] {
    return this.enforcementHistory
      .filter((r) => r.policyId === policyId && r.decision === 'deny')
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get enforcement statistics
   */
  getEnforcementStatistics(policyId?: string): Record<string, unknown> {
    const results = policyId
      ? this.enforcementHistory.filter((r) => r.policyId === policyId)
      : this.enforcementHistory;

    const allowed = results.filter((r) => r.decision === 'allow').length;
    const denied = results.filter((r) => r.decision === 'deny').length;
    const challenged = results.filter((r) => r.decision === 'challenge').length;

    const policyStats: Record<string, Record<string, unknown>> = {};
    for (const policy of this.policies.values()) {
      const policyResults = this.enforcementHistory.filter((r) => r.policyId === policy.id);
      policyStats[policy.id] = {
        policyName: policy.name,
        totalEnforcements: policyResults.length,
        allowed: policyResults.filter((r) => r.decision === 'allow').length,
        denied: policyResults.filter((r) => r.decision === 'deny').length,
        challenged: policyResults.filter((r) => r.decision === 'challenge').length,
      };
    }

    return {
      totalEnforcements: results.length,
      allowed,
      denied,
      challenged,
      denyRate: results.length > 0 ? (denied / results.length) * 100 : 0,
      policyStats,
    };
  }

  /**
   * Get policy
   */
  getPolicy(policyId: string): SecurityPolicy | undefined {
    return this.policies.get(policyId);
  }

  /**
   * Get all policies
   */
  getAllPolicies(): SecurityPolicy[] {
    return Array.from(this.policies.values()).sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get enforcement result
   */
  getEnforcementResult(resultId: string): PolicyEnforcementResult | undefined {
    return this.enforcementResults.get(resultId);
  }

  /**
   * Get enforcement history
   */
  getEnforcementHistory(policyId: string, limit = 100): PolicyEnforcementResult[] {
    return this.enforcementHistory
      .filter((r) => r.policyId === policyId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Update policy
   */
  updatePolicy(id: string, updates: Partial<SecurityPolicy>): boolean {
    const policy = this.policies.get(id);
    if (!policy) return false;

    Object.assign(policy, updates);
    return true;
  }

  /**
   * Delete policy
   */
  deletePolicy(id: string): boolean {
    return this.policies.delete(id);
  }

  /**
   * Export enforcement report
   */
  exportEnforcementReport(policyId: string, format: 'json' | 'csv' = 'json'): string {
    const results = this.enforcementHistory.filter((r) => r.policyId === policyId);

    if (format === 'json') {
      return JSON.stringify(
        {
          policyId,
          statistics: this.getEnforcementStatistics(policyId),
          results,
        },
        null,
        2
      );
    }

    // CSV format
    const headers = ['Timestamp', 'Rule ID', 'Decision', 'Reason'];
    const rows = results.map((r) => [r.timestamp, r.ruleId, r.decision, r.reason]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
