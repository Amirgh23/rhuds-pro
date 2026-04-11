/**
 * Compliance Checker
 * Validates compliance with various regulations
 */

/**
 * Compliance check result
 */
export interface ComplianceCheckResult {
  id: string;
  timestamp: number;
  framework: 'GDPR' | 'HIPAA' | 'SOC2' | 'PCI-DSS';
  passed: boolean;
  score: number;
  violations: ComplianceViolation[];
  recommendations: string[];
}

/**
 * Compliance violation
 */
export interface ComplianceViolation {
  id: string;
  rule: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  affectedAreas: string[];
  remediation: string;
}

/**
 * Compliance framework
 */
export interface ComplianceFramework {
  id: string;
  name: 'GDPR' | 'HIPAA' | 'SOC2' | 'PCI-DSS';
  rules: ComplianceRule[];
  enabled: boolean;
}

/**
 * Compliance rule
 */
export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  checkFunction: (data: Record<string, unknown>) => boolean;
}

/**
 * Compliance Checker
 * Validates compliance with regulations
 */
export class ComplianceChecker {
  private frameworks: Map<string, ComplianceFramework> = new Map();
  private checkResults: Map<string, ComplianceCheckResult> = new Map();
  private checkHistory: ComplianceCheckResult[] = [];

  constructor() {
    this.initializeFrameworks();
  }

  /**
   * Initialize default frameworks
   */
  private initializeFrameworks(): void {
    // GDPR Framework
    this.frameworks.set('GDPR', {
      id: 'gdpr',
      name: 'GDPR',
      enabled: true,
      rules: [
        {
          id: 'gdpr-1',
          name: 'Data Minimization',
          description: 'Only collect necessary personal data',
          severity: 'high',
          checkFunction: (data) => data.dataMinimization === true,
        },
        {
          id: 'gdpr-2',
          name: 'Consent Management',
          description: 'Obtain explicit consent for data processing',
          severity: 'critical',
          checkFunction: (data) => data.consentManagement === true,
        },
        {
          id: 'gdpr-3',
          name: 'Data Retention',
          description: 'Delete data after retention period',
          severity: 'high',
          checkFunction: (data) => data.dataRetention === true,
        },
      ],
    });

    // HIPAA Framework
    this.frameworks.set('HIPAA', {
      id: 'hipaa',
      name: 'HIPAA',
      enabled: true,
      rules: [
        {
          id: 'hipaa-1',
          name: 'Access Controls',
          description: 'Implement access controls for PHI',
          severity: 'critical',
          checkFunction: (data) => data.accessControls === true,
        },
        {
          id: 'hipaa-2',
          name: 'Encryption',
          description: 'Encrypt PHI at rest and in transit',
          severity: 'critical',
          checkFunction: (data) => data.encryption === true,
        },
        {
          id: 'hipaa-3',
          name: 'Audit Controls',
          description: 'Maintain audit logs for PHI access',
          severity: 'high',
          checkFunction: (data) => data.auditControls === true,
        },
      ],
    });

    // SOC 2 Framework
    this.frameworks.set('SOC2', {
      id: 'soc2',
      name: 'SOC2',
      enabled: true,
      rules: [
        {
          id: 'soc2-1',
          name: 'Security',
          description: 'Implement security controls',
          severity: 'critical',
          checkFunction: (data) => data.securityControls === true,
        },
        {
          id: 'soc2-2',
          name: 'Availability',
          description: 'Ensure system availability',
          severity: 'high',
          checkFunction: (data) => data.availability === true,
        },
        {
          id: 'soc2-3',
          name: 'Integrity',
          description: 'Maintain data integrity',
          severity: 'high',
          checkFunction: (data) => data.integrity === true,
        },
      ],
    });

    // PCI-DSS Framework
    this.frameworks.set('PCI-DSS', {
      id: 'pci-dss',
      name: 'PCI-DSS',
      enabled: true,
      rules: [
        {
          id: 'pci-1',
          name: 'Firewall Configuration',
          description: 'Maintain firewall configuration',
          severity: 'critical',
          checkFunction: (data) => data.firewallConfig === true,
        },
        {
          id: 'pci-2',
          name: 'Default Passwords',
          description: 'Change default passwords',
          severity: 'critical',
          checkFunction: (data) => data.defaultPasswords === false,
        },
        {
          id: 'pci-3',
          name: 'Encryption',
          description: 'Encrypt cardholder data',
          severity: 'critical',
          checkFunction: (data) => data.encryption === true,
        },
      ],
    });
  }

  /**
   * Run compliance check
   */
  runComplianceCheck(
    framework: 'GDPR' | 'HIPAA' | 'SOC2' | 'PCI-DSS',
    data: Record<string, unknown>
  ): ComplianceCheckResult {
    const fw = this.frameworks.get(framework);
    if (!fw || !fw.enabled) {
      throw new Error(`Framework not found or disabled: ${framework}`);
    }

    const violations: ComplianceViolation[] = [];
    let passedRules = 0;

    for (const rule of fw.rules) {
      try {
        const passed = rule.checkFunction(data);
        if (!passed) {
          violations.push({
            id: `violation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            rule: rule.name,
            severity: rule.severity,
            description: rule.description,
            affectedAreas: [],
            remediation: `Implement ${rule.name} controls`,
          });
        } else {
          passedRules++;
        }
      } catch (error) {
        violations.push({
          id: `violation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          rule: rule.name,
          severity: 'high',
          description: `Error checking rule: ${rule.description}`,
          affectedAreas: [],
          remediation: `Review and fix ${rule.name} implementation`,
        });
      }
    }

    const score = fw.rules.length > 0 ? (passedRules / fw.rules.length) * 100 : 0;
    const passed = violations.filter((v) => v.severity === 'critical').length === 0;

    const result: ComplianceCheckResult = {
      id: `check-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      framework,
      passed,
      score,
      violations,
      recommendations: this.generateRecommendations(violations),
    };

    this.checkResults.set(result.id, result);
    this.checkHistory.push(result);

    return result;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(violations: ComplianceViolation[]): string[] {
    const recommendations: string[] = [];

    for (const violation of violations) {
      if (violation.severity === 'critical') {
        recommendations.push(`CRITICAL: ${violation.remediation}`);
      } else if (violation.severity === 'high') {
        recommendations.push(`HIGH: ${violation.remediation}`);
      }
    }

    return recommendations;
  }

  /**
   * Get compliance check result
   */
  getCheckResult(resultId: string): ComplianceCheckResult | undefined {
    return this.checkResults.get(resultId);
  }

  /**
   * Get compliance history
   */
  getComplianceHistory(
    framework?: 'GDPR' | 'HIPAA' | 'SOC2' | 'PCI-DSS',
    limit?: number
  ): ComplianceCheckResult[] {
    let history = this.checkHistory;

    if (framework) {
      history = history.filter((h) => h.framework === framework);
    }

    if (limit) {
      return history.slice(-limit);
    }

    return history;
  }

  /**
   * Get compliance score
   */
  getComplianceScore(framework: 'GDPR' | 'HIPAA' | 'SOC2' | 'PCI-DSS'): number {
    const results = this.checkHistory.filter((r) => r.framework === framework);
    if (results.length === 0) return 0;

    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    return avgScore;
  }

  /**
   * Get all violations
   */
  getAllViolations(severity?: 'critical' | 'high' | 'medium' | 'low'): ComplianceViolation[] {
    let violations: ComplianceViolation[] = [];

    for (const result of this.checkHistory) {
      violations = violations.concat(result.violations);
    }

    if (severity) {
      violations = violations.filter((v) => v.severity === severity);
    }

    return violations;
  }

  /**
   * Get critical violations
   */
  getCriticalViolations(): ComplianceViolation[] {
    return this.getAllViolations('critical');
  }

  /**
   * Enable framework
   */
  enableFramework(framework: 'GDPR' | 'HIPAA' | 'SOC2' | 'PCI-DSS'): boolean {
    const fw = this.frameworks.get(framework);
    if (!fw) return false;

    fw.enabled = true;
    return true;
  }

  /**
   * Disable framework
   */
  disableFramework(framework: 'GDPR' | 'HIPAA' | 'SOC2' | 'PCI-DSS'): boolean {
    const fw = this.frameworks.get(framework);
    if (!fw) return false;

    fw.enabled = false;
    return true;
  }

  /**
   * Get compliance summary
   */
  getComplianceSummary(): Record<string, unknown> {
    const frameworks = Array.from(this.frameworks.keys());
    const summary: Record<string, unknown> = {};

    for (const framework of frameworks) {
      const score = this.getComplianceScore(framework as any);
      const violations = this.checkHistory
        .filter((r) => r.framework === framework)
        .flatMap((r) => r.violations);

      summary[framework] = {
        score,
        violations: violations.length,
        critical: violations.filter((v) => v.severity === 'critical').length,
        high: violations.filter((v) => v.severity === 'high').length,
      };
    }

    return summary;
  }

  /**
   * Export compliance report
   */
  exportComplianceReport(framework: 'GDPR' | 'HIPAA' | 'SOC2' | 'PCI-DSS'): string {
    const results = this.checkHistory.filter((r) => r.framework === framework);
    const report = {
      framework,
      timestamp: Date.now(),
      totalChecks: results.length,
      averageScore:
        results.length > 0 ? results.reduce((sum, r) => sum + r.score, 0) / results.length : 0,
      results,
    };

    return JSON.stringify(report, null, 2);
  }
}
