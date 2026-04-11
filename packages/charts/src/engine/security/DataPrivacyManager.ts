/**
 * Data Privacy Manager
 * GDPR/CCPA compliance, data retention, and privacy controls
 */

export interface PrivacyPolicy {
  dataRetentionDays: number;
  allowDataSharing: boolean;
  allowProfiling: boolean;
  allowCookies: boolean;
  allowAnalytics: boolean;
  consentRequired: boolean;
}

export interface UserConsent {
  userId: string;
  timestamp: number;
  policies: Record<string, boolean>;
  ipAddress: string;
  userAgent: string;
}

export interface DataClassification {
  level: 'public' | 'internal' | 'confidential' | 'restricted';
  pii: boolean;
  sensitive: boolean;
  regulated: boolean;
}

export interface PrivacyEvent {
  id: string;
  userId: string;
  eventType: 'access' | 'modification' | 'deletion' | 'export' | 'consent';
  timestamp: number;
  dataType: string;
  details: Record<string, unknown>;
}

export interface DataSubject {
  id: string;
  email: string;
  createdAt: number;
  lastAccessedAt: number;
  dataCollected: string[];
  consentStatus: Record<string, boolean>;
}

/**
 * Data Privacy Manager
 * Manages GDPR/CCPA compliance, data retention, and privacy controls
 */
export class DataPrivacyManager {
  private policy: PrivacyPolicy;
  private consents: Map<string, UserConsent> = new Map();
  private dataSubjects: Map<string, DataSubject> = new Map();
  private privacyEvents: PrivacyEvent[] = [];
  private dataClassifications: Map<string, DataClassification> = new Map();
  private deletionRequests: Map<string, number> = new Map();

  constructor(policy: PrivacyPolicy) {
    this.policy = policy;
    this.initializeDataClassifications();
  }

  /**
   * Initialize data classifications
   */
  private initializeDataClassifications(): void {
    const classifications: Record<string, DataClassification> = {
      email: { level: 'confidential', pii: true, sensitive: false, regulated: false },
      phone: { level: 'confidential', pii: true, sensitive: false, regulated: false },
      ssn: { level: 'restricted', pii: true, sensitive: true, regulated: true },
      creditCard: { level: 'restricted', pii: false, sensitive: true, regulated: true },
      medicalRecord: { level: 'restricted', pii: true, sensitive: true, regulated: true },
      location: { level: 'confidential', pii: false, sensitive: true, regulated: false },
      browsing: { level: 'internal', pii: false, sensitive: false, regulated: false },
      preferences: { level: 'internal', pii: false, sensitive: false, regulated: false },
    };

    Object.entries(classifications).forEach(([key, value]) => {
      this.dataClassifications.set(key, value);
    });
  }

  /**
   * Record user consent
   */
  public recordConsent(
    userId: string,
    policies: Record<string, boolean>,
    ipAddress: string,
    userAgent: string
  ): UserConsent {
    const consent: UserConsent = {
      userId,
      timestamp: Date.now(),
      policies,
      ipAddress,
      userAgent,
    };

    this.consents.set(userId, consent);

    // Create or update data subject
    let subject = this.dataSubjects.get(userId);
    if (!subject) {
      subject = {
        id: userId,
        email: `user-${userId}@example.com`,
        createdAt: Date.now(),
        lastAccessedAt: Date.now(),
        dataCollected: [],
        consentStatus: policies,
      };
      this.dataSubjects.set(userId, subject);
    } else {
      subject.consentStatus = policies;
    }

    this.logPrivacyEvent(userId, 'consent', 'consent', { policies });

    return consent;
  }

  /**
   * Get user consent
   */
  public getUserConsent(userId: string): UserConsent | undefined {
    return this.consents.get(userId);
  }

  /**
   * Check if user consented to policy
   */
  public hasConsent(userId: string, policyKey: string): boolean {
    const consent = this.consents.get(userId);
    if (!consent) return false;

    return consent.policies[policyKey] === true;
  }

  /**
   * Withdraw consent
   */
  public withdrawConsent(userId: string, policyKey: string): boolean {
    const consent = this.consents.get(userId);
    if (!consent) return false;

    consent.policies[policyKey] = false;
    this.logPrivacyEvent(userId, 'consent', 'consent', { policyKey, action: 'withdraw' });

    return true;
  }

  /**
   * Get data classification
   */
  public getDataClassification(dataType: string): DataClassification | undefined {
    return this.dataClassifications.get(dataType);
  }

  /**
   * Check if data is PII
   */
  public isPII(dataType: string): boolean {
    const classification = this.dataClassifications.get(dataType);
    return classification?.pii || false;
  }

  /**
   * Check if data is sensitive
   */
  public isSensitive(dataType: string): boolean {
    const classification = this.dataClassifications.get(dataType);
    return classification?.sensitive || false;
  }

  /**
   * Log data access
   */
  public logDataAccess(
    userId: string,
    dataType: string,
    details: Record<string, unknown> = {}
  ): void {
    this.logPrivacyEvent(userId, 'access', dataType, details);
  }

  /**
   * Log data modification
   */
  public logDataModification(
    userId: string,
    dataType: string,
    details: Record<string, unknown> = {}
  ): void {
    this.logPrivacyEvent(userId, 'modification', dataType, details);
  }

  /**
   * Request data export
   */
  public requestDataExport(userId: string): PrivacyEvent {
    const event = this.logPrivacyEvent(userId, 'export', 'all', { status: 'requested' });
    return event;
  }

  /**
   * Request data deletion (Right to be forgotten)
   */
  public requestDataDeletion(userId: string): boolean {
    this.deletionRequests.set(userId, Date.now());
    this.logPrivacyEvent(userId, 'deletion', 'all', { status: 'requested' });
    return true;
  }

  /**
   * Get deletion requests
   */
  public getDeletionRequests(): Map<string, number> {
    return new Map(this.deletionRequests);
  }

  /**
   * Process deletion request
   */
  public processDeletionRequest(userId: string): boolean {
    if (!this.deletionRequests.has(userId)) return false;

    // Remove user data
    this.dataSubjects.delete(userId);
    this.consents.delete(userId);
    this.deletionRequests.delete(userId);

    this.logPrivacyEvent(userId, 'deletion', 'all', { status: 'completed' });

    return true;
  }

  /**
   * Log privacy event
   */
  private logPrivacyEvent(
    userId: string,
    eventType: 'access' | 'modification' | 'deletion' | 'export' | 'consent',
    dataType: string,
    details: Record<string, unknown>
  ): PrivacyEvent {
    const event: PrivacyEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      eventType,
      timestamp: Date.now(),
      dataType,
      details,
    };

    this.privacyEvents.push(event);

    // Update last accessed time
    const subject = this.dataSubjects.get(userId);
    if (subject) {
      subject.lastAccessedAt = Date.now();
    }

    return event;
  }

  /**
   * Get privacy events
   */
  public getPrivacyEvents(userId?: string, startTime?: number, endTime?: number): PrivacyEvent[] {
    return this.privacyEvents.filter((event) => {
      if (userId && event.userId !== userId) return false;
      if (startTime && event.timestamp < startTime) return false;
      if (endTime && event.timestamp > endTime) return false;
      return true;
    });
  }

  /**
   * Check data retention compliance
   */
  public checkRetentionCompliance(): Record<string, unknown> {
    const cutoffTime = Date.now() - this.policy.dataRetentionDays * 24 * 60 * 60 * 1000;
    const expiredSubjects: string[] = [];

    for (const [userId, subject] of this.dataSubjects) {
      if (subject.lastAccessedAt < cutoffTime) {
        expiredSubjects.push(userId);
      }
    }

    return {
      retentionDays: this.policy.dataRetentionDays,
      expiredSubjects,
      expiredCount: expiredSubjects.length,
      totalSubjects: this.dataSubjects.size,
    };
  }

  /**
   * Get privacy compliance report
   */
  public getPrivacyComplianceReport(): Record<string, unknown> {
    const totalUsers = this.dataSubjects.size;
    const consentedUsers = Array.from(this.consents.values()).filter((c) =>
      Object.values(c.policies).some((v) => v === true)
    ).length;

    const piiAccessEvents = this.privacyEvents.filter((e) => {
      const classification = this.dataClassifications.get(e.dataType);
      return classification?.pii && e.eventType === 'access';
    });

    return {
      totalUsers,
      consentedUsers,
      consentRate: totalUsers > 0 ? (consentedUsers / totalUsers) * 100 : 0,
      totalPrivacyEvents: this.privacyEvents.length,
      piiAccessEvents: piiAccessEvents.length,
      deletionRequests: this.deletionRequests.size,
      dataRetentionCompliance: this.checkRetentionCompliance(),
      policy: this.policy,
    };
  }

  /**
   * Get data subject info
   */
  public getDataSubjectInfo(userId: string): DataSubject | undefined {
    return this.dataSubjects.get(userId);
  }

  /**
   * Update privacy policy
   */
  public updatePrivacyPolicy(policy: Partial<PrivacyPolicy>): void {
    this.policy = { ...this.policy, ...policy };
  }

  /**
   * Anonymize user data
   */
  public anonymizeUserData(userId: string): boolean {
    const subject = this.dataSubjects.get(userId);
    if (!subject) return false;

    // Replace identifying information
    subject.email = `anonymous-${Math.random().toString(36).substr(2, 9)}@example.com`;
    subject.id = `anon-${Math.random().toString(36).substr(2, 9)}`;

    this.logPrivacyEvent(userId, 'modification', 'all', { action: 'anonymized' });

    return true;
  }
}
