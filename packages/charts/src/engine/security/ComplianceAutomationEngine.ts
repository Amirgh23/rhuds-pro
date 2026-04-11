/**
 * Compliance Automation Engine
 * Automates compliance checks, audits, and reporting
 */

/**
 * Compliance framework
 */
export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  requirements: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    automatable: boolean;
  }>;
  automationRules: Array<{
    id: string;
    requirementId: string;
    checkType: string;
    parameters: Record<string, unknown>;
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  }>;
}

/**
 * Compliance check result
 */
export interface ComplianceCheckResult {
  id: string;
  timestamp: number;
  frameworkId: string;
  requirementId: string;
  status: 'compliant' | 'non_compliant' | 'unknown';
  evidence: string[];
  remediationSteps?: string[];
  nextCheckTime?: number;
}

/**
 * Compliance Automation Engine
 * Automates compliance checks, audits, and reporting
 */
export class ComplianceAutomationEngine {
  private frameworks: Map<string, ComplianceFramework> = new Map();
  private checkResults: Map<string, ComplianceCheckResult> = new Map();
  private checkHistory: ComplianceCheckResult[] = [];
  private automationSchedules: Map<string, NodeJS.Timeout> = new Map();
  private checkHandlers: Map<
    string,
    (params: Record<string, unknown>) => Promise<{
      compliant: boolean;
      evidence: string[];
      remediation?: string[];
    }>
  > = new Map();

  /**
   * Create compliance framework
   */
  createFramework(framework: Omit<ComplianceFramework, 'id'>): ComplianceFramework {
    const id = `framework-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const complianceFramework: ComplianceFramework = { ...framework, id };
    this.frameworks.set(id, complianceFramework);
    return complianceFramework;
  }

  /**
   * Register compliance check handler
   */
  registerCheckHandler(
    checkType: string,
    handler: (params: Record<string, unknown>) => Promise<{
      compliant: boolean;
      evidence: string[];
      remediation?: string[];
    }>
  ): void {
    this.checkHandlers.set(checkType, handler);
  }

  /**
   * Execute compliance check
   */
  async executeCheck(
    frameworkId: string,
    requirementId: string,
    checkType: string,
    parameters: Record<string, unknown>
  ): Promise<ComplianceCheckResult | null> {
    const handler = this.checkHandlers.get(checkType);
    if (!handler) return null;

    const id = `check-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      const result = await handler(parameters);

      const checkResult: ComplianceCheckResult = {
        id,
        timestamp: Date.now(),
        frameworkId,
        requirementId,
        status: result.compliant ? 'compliant' : 'non_compliant',
        evidence: result.evidence,
        remediationSteps: result.remediation,
        nextCheckTime: Date.now() + 24 * 60 * 60 * 1000,
      };

      this.checkResults.set(id, checkResult);
      this.checkHistory.push(checkResult);

      return checkResult;
    } catch {
      const checkResult: ComplianceCheckResult = {
        id,
        timestamp: Date.now(),
        frameworkId,
        requirementId,
        status: 'unknown',
        evidence: ['Check execution failed'],
      };

      this.checkResults.set(id, checkResult);
      this.checkHistory.push(checkResult);

      return checkResult;
    }
  }

  /**
   * Schedule automated checks
   */
  scheduleAutomatedChecks(frameworkId: string): void {
    const framework = this.frameworks.get(frameworkId);
    if (!framework || !framework.enabled) return;

    for (const rule of framework.automationRules) {
      const scheduleKey = `${frameworkId}-${rule.id}`;

      // Clear existing schedule
      const existingSchedule = this.automationSchedules.get(scheduleKey);
      if (existingSchedule) {
        clearInterval(existingSchedule);
      }

      // Calculate interval
      let intervalMs = 24 * 60 * 60 * 1000; // default daily
      if (rule.frequency === 'hourly') intervalMs = 60 * 60 * 1000;
      else if (rule.frequency === 'weekly') intervalMs = 7 * 24 * 60 * 60 * 1000;
      else if (rule.frequency === 'monthly') intervalMs = 30 * 24 * 60 * 60 * 1000;

      // Schedule check
      const schedule = setInterval(() => {
        this.executeCheck(frameworkId, rule.requirementId, rule.checkType, rule.parameters);
      }, intervalMs);

      this.automationSchedules.set(scheduleKey, schedule);
    }
  }

  /**
   * Get compliance status
   */
  getComplianceStatus(frameworkId: string): Record<string, unknown> {
    const framework = this.frameworks.get(frameworkId);
    if (!framework) return {};

    const results = this.checkHistory.filter((r) => r.frameworkId === frameworkId);
    const latestResults = new Map<string, ComplianceCheckResult>();

    for (const result of results) {
      const existing = latestResults.get(result.requirementId);
      if (!existing || result.timestamp > existing.timestamp) {
        latestResults.set(result.requirementId, result);
      }
    }

    const compliant = Array.from(latestResults.values()).filter(
      (r) => r.status === 'compliant'
    ).length;
    const nonCompliant = Array.from(latestResults.values()).filter(
      (r) => r.status === 'non_compliant'
    ).length;
    const unknown = Array.from(latestResults.values()).filter((r) => r.status === 'unknown').length;

    return {
      frameworkId,
      frameworkName: framework.name,
      totalRequirements: framework.requirements.length,
      compliant,
      nonCompliant,
      unknown,
      compliancePercentage:
        latestResults.size > 0 ? (compliant / (compliant + nonCompliant)) * 100 : 0,
      lastCheckTime: results.length > 0 ? results[results.length - 1].timestamp : 0,
    };
  }

  /**
   * Get non-compliant requirements
   */
  getNonCompliantRequirements(frameworkId: string): ComplianceCheckResult[] {
    return this.checkHistory
      .filter((r) => r.frameworkId === frameworkId && r.status === 'non_compliant')
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100);
  }

  /**
   * Get remediation plan
   */
  getRemediationPlan(frameworkId: string): Array<{
    requirementId: string;
    remediationSteps: string[];
    priority: number;
  }> {
    const nonCompliant = this.getNonCompliantRequirements(frameworkId);
    const framework = this.frameworks.get(frameworkId);
    if (!framework) return [];

    const plan: Array<{
      requirementId: string;
      remediationSteps: string[];
      priority: number;
    }> = [];

    for (const result of nonCompliant) {
      const requirement = framework.requirements.find((r) => r.id === result.requirementId);
      if (requirement && result.remediationSteps) {
        const severityMap: Record<string, number> = {
          critical: 1,
          high: 2,
          medium: 3,
          low: 4,
        };

        plan.push({
          requirementId: result.requirementId,
          remediationSteps: result.remediationSteps,
          priority: severityMap[requirement.severity] || 4,
        });
      }
    }

    return plan.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get framework
   */
  getFramework(frameworkId: string): ComplianceFramework | undefined {
    return this.frameworks.get(frameworkId);
  }

  /**
   * Get all frameworks
   */
  getAllFrameworks(): ComplianceFramework[] {
    return Array.from(this.frameworks.values());
  }

  /**
   * Get check result
   */
  getCheckResult(checkId: string): ComplianceCheckResult | undefined {
    return this.checkResults.get(checkId);
  }

  /**
   * Get check history
   */
  getCheckHistory(frameworkId: string, limit = 100): ComplianceCheckResult[] {
    return this.checkHistory
      .filter((r) => r.frameworkId === frameworkId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get compliance statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalFrameworks = this.frameworks.size;
    const totalChecks = this.checkHistory.length;
    const compliantChecks = this.checkHistory.filter((r) => r.status === 'compliant').length;
    const nonCompliantChecks = this.checkHistory.filter((r) => r.status === 'non_compliant').length;

    const frameworkStats: Record<string, Record<string, unknown>> = {};
    for (const framework of this.frameworks.values()) {
      frameworkStats[framework.id] = this.getComplianceStatus(framework.id);
    }

    return {
      totalFrameworks,
      totalChecks,
      compliantChecks,
      nonCompliantChecks,
      unknownChecks: totalChecks - compliantChecks - nonCompliantChecks,
      overallCompliancePercentage:
        totalChecks > 0 ? (compliantChecks / (compliantChecks + nonCompliantChecks)) * 100 : 0,
      frameworkStats,
    };
  }

  /**
   * Update framework
   */
  updateFramework(id: string, updates: Partial<ComplianceFramework>): boolean {
    const framework = this.frameworks.get(id);
    if (!framework) return false;

    Object.assign(framework, updates);
    return true;
  }

  /**
   * Delete framework
   */
  deleteFramework(id: string): boolean {
    const scheduleKey = `${id}-*`;
    for (const [key, schedule] of this.automationSchedules.entries()) {
      if (key.startsWith(id)) {
        clearInterval(schedule);
        this.automationSchedules.delete(key);
      }
    }
    return this.frameworks.delete(id);
  }

  /**
   * Export compliance report
   */
  exportComplianceReport(frameworkId: string, format: 'json' | 'csv' = 'json'): string {
    const results = this.checkHistory.filter((r) => r.frameworkId === frameworkId);

    if (format === 'json') {
      return JSON.stringify(
        {
          frameworkId,
          status: this.getComplianceStatus(frameworkId),
          results,
        },
        null,
        2
      );
    }

    // CSV format
    const headers = ['Timestamp', 'Requirement ID', 'Status', 'Evidence Count'];
    const rows = results.map((r) => [r.timestamp, r.requirementId, r.status, r.evidence.length]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
