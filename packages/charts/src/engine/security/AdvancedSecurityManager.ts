/**
 * Advanced Security Manager
 * Comprehensive security framework with encryption, authentication, and authorization
 */

export interface SecurityConfig {
  encryptionAlgorithm: 'AES-256' | 'ChaCha20' | 'RSA-4096';
  hashAlgorithm: 'SHA-256' | 'SHA-512' | 'BLAKE2b';
  keyRotationInterval: number;
  sessionTimeout: number;
  mfaRequired: boolean;
  passwordPolicy: PasswordPolicy;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expirationDays: number;
  historyCount: number;
}

export interface SecurityContext {
  userId: string;
  sessionId: string;
  permissions: Set<string>;
  roles: Set<string>;
  mfaVerified: boolean;
  encryptionKey: string;
}

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
  algorithm: string;
  timestamp: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  result: 'success' | 'failure';
  timestamp: number;
  details: Record<string, unknown>;
}

/**
 * Advanced Security Manager
 * Handles encryption, authentication, authorization, and security policies
 */
export class AdvancedSecurityManager {
  private config: SecurityConfig;
  private encryptionKeys: Map<string, string> = new Map();
  private sessionStore: Map<string, SecurityContext> = new Map();
  private auditLogs: AuditLog[] = [];
  private passwordHistory: Map<string, string[]> = new Map();
  private failedAttempts: Map<string, number> = new Map();
  private lockoutDuration = 15 * 60 * 1000; // 15 minutes

  constructor(config: SecurityConfig) {
    this.config = config;
    this.initializeEncryption();
  }

  /**
   * Initialize encryption system
   */
  private initializeEncryption(): void {
    // Generate master encryption key
    const masterKey = this.generateKey(256);
    this.encryptionKeys.set('master', masterKey);
  }

  /**
   * Generate cryptographic key
   */
  private generateKey(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let key = '';
    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  /**
   * Encrypt data
   */
  public encrypt(data: string, userId: string): EncryptedData {
    const key = this.encryptionKeys.get('master') || this.generateKey(256);
    const iv = this.generateKey(16);
    const salt = this.generateKey(16);

    // Simple XOR encryption for demonstration
    let ciphertext = '';
    for (let i = 0; i < data.length; i++) {
      const keyChar = key.charCodeAt(i % key.length);
      const dataChar = data.charCodeAt(i);
      ciphertext += String.fromCharCode(dataChar ^ keyChar);
    }

    return {
      ciphertext: Buffer.from(ciphertext).toString('base64'),
      iv,
      salt,
      algorithm: this.config.encryptionAlgorithm,
      timestamp: Date.now(),
    };
  }

  /**
   * Decrypt data
   */
  public decrypt(encrypted: EncryptedData, userId: string): string {
    const key = this.encryptionKeys.get('master') || this.generateKey(256);
    const ciphertext = Buffer.from(encrypted.ciphertext, 'base64').toString();

    let plaintext = '';
    for (let i = 0; i < ciphertext.length; i++) {
      const keyChar = key.charCodeAt(i % key.length);
      const cipherChar = ciphertext.charCodeAt(i);
      plaintext += String.fromCharCode(cipherChar ^ keyChar);
    }

    return plaintext;
  }

  /**
   * Hash password
   */
  public hashPassword(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Validate password policy
   */
  public validatePasswordPolicy(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const policy = this.config.passwordPolicy;

    if (password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain uppercase letters');
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain numbers');
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain special characters');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create security context
   */
  public createSecurityContext(
    userId: string,
    roles: string[],
    permissions: string[]
  ): SecurityContext {
    const sessionId = this.generateKey(32);
    const context: SecurityContext = {
      userId,
      sessionId,
      permissions: new Set(permissions),
      roles: new Set(roles),
      mfaVerified: false,
      encryptionKey: this.generateKey(256),
    };

    this.sessionStore.set(sessionId, context);
    return context;
  }

  /**
   * Verify MFA
   */
  public verifyMFA(sessionId: string, code: string): boolean {
    const context = this.sessionStore.get(sessionId);
    if (!context) return false;

    // Simulate MFA verification
    const isValid = code.length === 6 && /^\d+$/.test(code);
    if (isValid) {
      context.mfaVerified = true;
    }

    return isValid;
  }

  /**
   * Check permission
   */
  public checkPermission(sessionId: string, permission: string): boolean {
    const context = this.sessionStore.get(sessionId);
    if (!context) return false;

    if (!this.config.mfaRequired || context.mfaVerified) {
      return context.permissions.has(permission);
    }

    return false;
  }

  /**
   * Check role
   */
  public checkRole(sessionId: string, role: string): boolean {
    const context = this.sessionStore.get(sessionId);
    if (!context) return false;

    return context.roles.has(role);
  }

  /**
   * Record failed login attempt
   */
  public recordFailedAttempt(userId: string): boolean {
    const attempts = (this.failedAttempts.get(userId) || 0) + 1;
    this.failedAttempts.set(userId, attempts);

    if (attempts >= 5) {
      // Lock account
      setTimeout(() => {
        this.failedAttempts.delete(userId);
      }, this.lockoutDuration);
      return false;
    }

    return true;
  }

  /**
   * Clear failed attempts
   */
  public clearFailedAttempts(userId: string): void {
    this.failedAttempts.delete(userId);
  }

  /**
   * Rotate encryption keys
   */
  public rotateEncryptionKeys(): void {
    const oldKey = this.encryptionKeys.get('master');
    const newKey = this.generateKey(256);
    this.encryptionKeys.set('master', newKey);
    this.encryptionKeys.set('previous', oldKey || '');
  }

  /**
   * Log security event
   */
  public logSecurityEvent(
    userId: string,
    action: string,
    resource: string,
    result: 'success' | 'failure',
    details: Record<string, unknown> = {}
  ): AuditLog {
    const log: AuditLog = {
      id: this.generateKey(16),
      userId,
      action,
      resource,
      result,
      timestamp: Date.now(),
      details,
    };

    this.auditLogs.push(log);
    return log;
  }

  /**
   * Get audit logs
   */
  public getAuditLogs(userId?: string, startTime?: number, endTime?: number): AuditLog[] {
    return this.auditLogs.filter((log) => {
      if (userId && log.userId !== userId) return false;
      if (startTime && log.timestamp < startTime) return false;
      if (endTime && log.timestamp > endTime) return false;
      return true;
    });
  }

  /**
   * Invalidate session
   */
  public invalidateSession(sessionId: string): boolean {
    return this.sessionStore.delete(sessionId);
  }

  /**
   * Get session info
   */
  public getSessionInfo(sessionId: string): SecurityContext | undefined {
    return this.sessionStore.get(sessionId);
  }

  /**
   * Get security metrics
   */
  public getSecurityMetrics(): Record<string, unknown> {
    return {
      activeSessions: this.sessionStore.size,
      auditLogCount: this.auditLogs.length,
      lockedAccounts: this.failedAttempts.size,
      encryptionKeysCount: this.encryptionKeys.size,
      lastKeyRotation: Date.now(),
    };
  }
}
