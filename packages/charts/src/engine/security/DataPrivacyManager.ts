/**
 * Data Privacy Manager
 * مدیریت حریم خصوصی داده برای حفاظت از اطلاعات حساس
 *
 * Features:
 * - Data classification
 * - PII detection
 * - Anonymization
 * - Retention policies
 */

import { EventEmitter } from 'events';

export interface DataClassification {
  level: 'public' | 'internal' | 'confidential' | 'restricted';
  tags: string[];
  owner: string;
  createdAt: Date;
}

export interface PIIPattern {
  name: string;
  regex: RegExp;
  category: 'email' | 'phone' | 'ssn' | 'credit_card' | 'name' | 'address';
  severity: 'low' | 'medium' | 'high';
}

export interface AnonymizationRule {
  pattern: RegExp;
  replacement: string;
  category: string;
}

export interface RetentionPolicy {
  dataType: string;
  retentionDays: number;
  archiveAfterDays?: number;
  deleteAfterDays: number;
}

export class DataPrivacyManager extends EventEmitter {
  private classifications: Map<string, DataClassification>;
  private piiPatterns: PIIPattern[];
  private anonymizationRules: AnonymizationRule[];
  private retentionPolicies: Map<string, RetentionPolicy>;
  private stats: {
    dataClassified: number;
    piiDetected: number;
    dataAnonymized: number;
    policyViolations: number;
  };

  constructor() {
    super();
    this.classifications = new Map();
    this.piiPatterns = [];
    this.anonymizationRules = [];
    this.retentionPolicies = new Map();
    this.stats = {
      dataClassified: 0,
      piiDetected: 0,
      dataAnonymized: 0,
      policyViolations: 0,
    };

    this.initialize();
  }

  private initialize(): void {
    this.registerDefaultPIIPatterns();
    this.registerDefaultRetentionPolicies();
    this.emit('initialized', { timestamp: Date.now() });
  }

  /**
   * Register default PII patterns
   */
  private registerDefaultPIIPatterns(): void {
    this.piiPatterns.push(
      {
        name: 'Email',
        regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        category: 'email',
        severity: 'high',
      },
      {
        name: 'Phone',
        regex: /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
        category: 'phone',
        severity: 'high',
      },
      {
        name: 'SSN',
        regex: /\d{3}-\d{2}-\d{4}/g,
        category: 'ssn',
        severity: 'high',
      },
      {
        name: 'Credit Card',
        regex: /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/g,
        category: 'credit_card',
        severity: 'high',
      }
    );
  }

  /**
   * Register default retention policies
   */
  private registerDefaultRetentionPolicies(): void {
    this.retentionPolicies.set('user_data', {
      dataType: 'user_data',
      retentionDays: 365,
      archiveAfterDays: 180,
      deleteAfterDays: 730,
    });

    this.retentionPolicies.set('transaction_data', {
      dataType: 'transaction_data',
      retentionDays: 2555,
      deleteAfterDays: 2555,
    });

    this.retentionPolicies.set('log_data', {
      dataType: 'log_data',
      retentionDays: 90,
      deleteAfterDays: 90,
    });
  }

  /**
   * Classify data
   */
  public classifyData(
    dataId: string,
    level: DataClassification['level'],
    tags: string[],
    owner: string
  ): void {
    const classification: DataClassification = {
      level,
      tags,
      owner,
      createdAt: new Date(),
    };

    this.classifications.set(dataId, classification);
    this.stats.dataClassified++;

    this.emit('data-classified', { dataId, level, tags });
  }

  /**
   * Detect PII in data
   */
  public detectPII(data: string): Array<{ pattern: string; matches: string[]; severity: string }> {
    const results: Array<{ pattern: string; matches: string[]; severity: string }> = [];

    for (const pattern of this.piiPatterns) {
      const matches = data.match(pattern.regex);

      if (matches && matches.length > 0) {
        results.push({
          pattern: pattern.name,
          matches,
          severity: pattern.severity,
        });

        this.stats.piiDetected += matches.length;
      }
    }

    if (results.length > 0) {
      this.emit('pii-detected', { count: results.length, results });
    }

    return results;
  }

  /**
   * Anonymize data
   */
  public anonymizeData(data: string): string {
    let anonymized = data;

    for (const pattern of this.piiPatterns) {
      anonymized = anonymized.replace(pattern.regex, this.generateMask(pattern.category));
    }

    this.stats.dataAnonymized++;
    this.emit('data-anonymized', { original: data, anonymized });

    return anonymized;
  }

  /**
   * Generate mask for PII
   */
  private generateMask(category: string): string {
    switch (category) {
      case 'email':
        return '[EMAIL_REDACTED]';
      case 'phone':
        return '[PHONE_REDACTED]';
      case 'ssn':
        return '[SSN_REDACTED]';
      case 'credit_card':
        return '[CARD_REDACTED]';
      default:
        return '[REDACTED]';
    }
  }

  /**
   * Register anonymization rule
   */
  public registerAnonymizationRule(pattern: RegExp, replacement: string, category: string): void {
    this.anonymizationRules.push({ pattern, replacement, category });
    this.emit('rule-registered', { category });
  }

  /**
   * Check retention policy compliance
   */
  public checkRetentionCompliance(
    dataType: string,
    createdDate: Date
  ): { compliant: boolean; daysRemaining: number } {
    const policy = this.retentionPolicies.get(dataType);

    if (!policy) {
      return { compliant: true, daysRemaining: -1 };
    }

    const now = new Date();
    const ageInDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    const compliant = ageInDays <= policy.deleteAfterDays;
    const daysRemaining = policy.deleteAfterDays - ageInDays;

    if (!compliant) {
      this.stats.policyViolations++;
      this.emit('policy-violation', { dataType, ageInDays, policy });
    }

    return { compliant, daysRemaining };
  }

  /**
   * Get data classification
   */
  public getClassification(dataId: string): DataClassification | undefined {
    return this.classifications.get(dataId);
  }

  /**
   * Get retention policy
   */
  public getRetentionPolicy(dataType: string): RetentionPolicy | undefined {
    return this.retentionPolicies.get(dataType);
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      ...this.stats,
      classifiedDataCount: this.classifications.size,
      piiPatternsCount: this.piiPatterns.length,
      retentionPoliciesCount: this.retentionPolicies.size,
    };
  }
}
