import { EventEmitter } from 'events';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface EncryptionKey {
  id: string;
  algorithm: 'AES-256' | 'RSA-2048' | 'ChaCha20';
  key: string;
  createdAt: Date;
  expiresAt?: Date;
  rotationSchedule?: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'rotated' | 'expired';
}

interface Certificate {
  id: string;
  subject: string;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  fingerprint: string;
  keySize: number;
  algorithm: string;
  status: 'valid' | 'expiring' | 'expired' | 'revoked';
}

interface SecurityPolicy {
  id: string;
  name: string;
  rules: SecurityRule[];
  priority: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SecurityRule {
  id: string;
  type: 'encryption' | 'access' | 'validation' | 'audit';
  condition: string;
  action: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface Vulnerability {
  id: string;
  cve: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedComponent: string;
  discoveredAt: Date;
  status: 'open' | 'mitigated' | 'resolved';
  remediation?: string;
}

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  details: Record<string, any>;
  source: string;
}

interface KeyRotationConfig {
  interval: number;
  algorithm: string;
  backupOldKeys: boolean;
  notifyBefore: number;
}

// ============================================================================
// Advanced Security Manager
// ============================================================================

export class AdvancedSecurityManager extends EventEmitter {
  private encryptionKeys: Map<string, EncryptionKey> = new Map();
  private certificates: Map<string, Certificate> = new Map();
  private securityPolicies: Map<string, SecurityPolicy> = new Map();
  private vulnerabilities: Map<string, Vulnerability> = new Map();
  private securityEvents: SecurityEvent[] = [];
  private keyRotationConfigs: Map<string, KeyRotationConfig> = new Map();
  private rotationIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    super();
    this.initializeDefaultPolicies();
  }

  // ========================================================================
  // Encryption Key Management
  // ========================================================================

  registerEncryptionKey(
    algorithm: 'AES-256' | 'RSA-2048' | 'ChaCha20',
    key: string,
    expiresAt?: Date,
    rotationSchedule?: 'daily' | 'weekly' | 'monthly'
  ): EncryptionKey {
    const id = `key-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const encryptionKey: EncryptionKey = {
      id,
      algorithm,
      key,
      createdAt: new Date(),
      expiresAt,
      rotationSchedule,
      status: 'active',
    };

    this.encryptionKeys.set(id, encryptionKey);
    this.emit('key-registered', { keyId: id, algorithm });
    return encryptionKey;
  }

  rotateEncryptionKey(keyId: string, newKey: string): EncryptionKey {
    const oldKey = this.encryptionKeys.get(keyId);
    if (!oldKey) throw new Error(`Key ${keyId} not found`);

    oldKey.status = 'rotated';
    const newKeyObj = this.registerEncryptionKey(
      oldKey.algorithm,
      newKey,
      oldKey.expiresAt,
      oldKey.rotationSchedule
    );

    this.emit('key-rotated', { oldKeyId: keyId, newKeyId: newKeyObj.id });
    return newKeyObj;
  }

  getEncryptionKey(keyId: string): EncryptionKey | undefined {
    return this.encryptionKeys.get(keyId);
  }

  listEncryptionKeys(status?: string): EncryptionKey[] {
    const keys = Array.from(this.encryptionKeys.values());
    return status ? keys.filter((k) => k.status === status) : keys;
  }

  scheduleKeyRotation(keyId: string, config: KeyRotationConfig): void {
    const key = this.encryptionKeys.get(keyId);
    if (!key) throw new Error(`Key ${keyId} not found`);

    this.keyRotationConfigs.set(keyId, config);

    const interval = setInterval(() => {
      const newKey = this.generateNewKey(key.algorithm);
      this.rotateEncryptionKey(keyId, newKey);

      if (config.notifyBefore > 0) {
        this.emit('key-rotation-scheduled', {
          keyId,
          rotationTime: new Date(Date.now() + config.notifyBefore),
        });
      }
    }, config.interval);

    this.rotationIntervals.set(keyId, interval);
  }

  private generateNewKey(algorithm: string): string {
    return `${algorithm}-key-${Date.now()}-${Math.random().toString(36).substr(2, 16)}`;
  }

  // ========================================================================
  // Certificate Management
  // ========================================================================

  registerCertificate(
    subject: string,
    issuer: string,
    validFrom: Date,
    validTo: Date,
    fingerprint: string,
    keySize: number,
    algorithm: string
  ): Certificate {
    const id = `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    let status: 'valid' | 'expiring' | 'expired' | 'revoked' = 'valid';

    if (validTo < now) {
      status = 'expired';
    } else if (validTo.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) {
      status = 'expiring';
    }

    const certificate: Certificate = {
      id,
      subject,
      issuer,
      validFrom,
      validTo,
      fingerprint,
      keySize,
      algorithm,
      status,
    };

    this.certificates.set(id, certificate);
    this.emit('certificate-registered', { certId: id, subject });
    return certificate;
  }

  getCertificate(certId: string): Certificate | undefined {
    return this.certificates.get(certId);
  }

  listCertificates(status?: string): Certificate[] {
    const certs = Array.from(this.certificates.values());
    return status ? certs.filter((c) => c.status === status) : certs;
  }

  revokeCertificate(certId: string, reason: string): void {
    const cert = this.certificates.get(certId);
    if (!cert) throw new Error(`Certificate ${certId} not found`);

    cert.status = 'revoked';
    this.emit('certificate-revoked', { certId, reason });
  }

  validateCertificate(certId: string): boolean {
    const cert = this.certificates.get(certId);
    if (!cert) return false;

    const now = new Date();
    return cert.status === 'valid' && cert.validFrom <= now && cert.validTo >= now;
  }

  // ========================================================================
  // Security Policies
  // ========================================================================

  createSecurityPolicy(name: string, rules: SecurityRule[], priority: number = 0): SecurityPolicy {
    const id = `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const policy: SecurityPolicy = {
      id,
      name,
      rules,
      priority,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.securityPolicies.set(id, policy);
    this.emit('policy-created', { policyId: id, name });
    return policy;
  }

  getSecurityPolicy(policyId: string): SecurityPolicy | undefined {
    return this.securityPolicies.get(policyId);
  }

  listSecurityPolicies(): SecurityPolicy[] {
    return Array.from(this.securityPolicies.values()).sort((a, b) => b.priority - a.priority);
  }

  updateSecurityPolicy(policyId: string, updates: Partial<SecurityPolicy>): SecurityPolicy {
    const policy = this.securityPolicies.get(policyId);
    if (!policy) throw new Error(`Policy ${policyId} not found`);

    Object.assign(policy, updates, { updatedAt: new Date() });
    this.emit('policy-updated', { policyId });
    return policy;
  }

  deleteSecurityPolicy(policyId: string): void {
    this.securityPolicies.delete(policyId);
    this.emit('policy-deleted', { policyId });
  }

  // ========================================================================
  // Vulnerability Scanning
  // ========================================================================

  registerVulnerability(
    cve: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    affectedComponent: string,
    remediation?: string
  ): Vulnerability {
    const id = `vuln-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const vulnerability: Vulnerability = {
      id,
      cve,
      severity,
      description,
      affectedComponent,
      discoveredAt: new Date(),
      status: 'open',
      remediation,
    };

    this.vulnerabilities.set(id, vulnerability);
    this.emit('vulnerability-discovered', { vulnId: id, cve, severity });
    return vulnerability;
  }

  getVulnerability(vulnId: string): Vulnerability | undefined {
    return this.vulnerabilities.get(vulnId);
  }

  listVulnerabilities(status?: string, severity?: string): Vulnerability[] {
    let vulns = Array.from(this.vulnerabilities.values());

    if (status) {
      vulns = vulns.filter((v) => v.status === status);
    }
    if (severity) {
      vulns = vulns.filter((v) => v.severity === severity);
    }

    return vulns;
  }

  updateVulnerabilityStatus(
    vulnId: string,
    status: 'open' | 'mitigated' | 'resolved'
  ): Vulnerability {
    const vuln = this.vulnerabilities.get(vulnId);
    if (!vuln) throw new Error(`Vulnerability ${vulnId} not found`);

    vuln.status = status;
    this.emit('vulnerability-updated', { vulnId, status });
    return vuln;
  }

  scanForVulnerabilities(): Vulnerability[] {
    const criticalVulns = this.listVulnerabilities('open', 'critical');
    const highVulns = this.listVulnerabilities('open', 'high');

    this.emit('scan-completed', {
      critical: criticalVulns.length,
      high: highVulns.length,
    });

    return [...criticalVulns, ...highVulns];
  }

  // ========================================================================
  // Security Events
  // ========================================================================

  logSecurityEvent(
    type: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: Record<string, any>,
    source: string
  ): SecurityEvent {
    const id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const event: SecurityEvent = {
      id,
      type,
      severity,
      timestamp: new Date(),
      details,
      source,
    };

    this.securityEvents.push(event);
    this.emit('security-event', event);
    return event;
  }

  getSecurityEvents(limit: number = 100): SecurityEvent[] {
    return this.securityEvents.slice(-limit);
  }

  getSecurityEventsBySeverity(severity: string): SecurityEvent[] {
    return this.securityEvents.filter((e) => e.severity === severity);
  }

  // ========================================================================
  // Initialization
  // ========================================================================

  private initializeDefaultPolicies(): void {
    this.createSecurityPolicy(
      'Default Encryption Policy',
      [
        {
          id: 'rule-1',
          type: 'encryption',
          condition: 'data.sensitive === true',
          action: 'encrypt-aes-256',
          severity: 'high',
        },
      ],
      100
    );

    this.createSecurityPolicy(
      'Default Access Policy',
      [
        {
          id: 'rule-2',
          type: 'access',
          condition: 'user.role === "admin"',
          action: 'allow-all',
          severity: 'high',
        },
      ],
      90
    );
  }

  // ========================================================================
  // Cleanup
  // ========================================================================

  destroy(): void {
    this.rotationIntervals.forEach((interval) => clearInterval(interval));
    this.rotationIntervals.clear();
    this.removeAllListeners();
  }
}

export default AdvancedSecurityManager;
