/**
 * Encryption Manager
 * Handles data encryption and key management
 */

/**
 * Encryption key
 */
export interface EncryptionKey {
  id: string;
  algorithm: 'AES-256' | 'RSA-2048' | 'AES-128';
  key: string;
  createdAt: number;
  expiresAt?: number;
  active: boolean;
}

/**
 * Encrypted data
 */
export interface EncryptedData {
  id: string;
  ciphertext: string;
  keyId: string;
  algorithm: string;
  iv?: string;
  timestamp: number;
}

/**
 * Encryption policy
 */
export interface EncryptionPolicy {
  id: string;
  name: string;
  algorithm: 'AES-256' | 'RSA-2048' | 'AES-128';
  dataTypes: string[];
  enabled: boolean;
  keyRotationDays: number;
}

/**
 * Encryption Manager
 * Manages encryption, decryption, and key lifecycle
 */
export class EncryptionManager {
  private keys: Map<string, EncryptionKey> = new Map();
  private policies: Map<string, EncryptionPolicy> = new Map();
  private encryptedData: Map<string, EncryptedData> = new Map();
  private keyRotationLog: Array<{ keyId: string; timestamp: number; reason: string }> = [];

  /**
   * Generate encryption key
   */
  generateKey(
    algorithm: 'AES-256' | 'RSA-2048' | 'AES-128',
    expiresInDays?: number
  ): EncryptionKey {
    const id = `key-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const key = this.generateRandomKey(algorithm);

    const encryptionKey: EncryptionKey = {
      id,
      algorithm,
      key,
      createdAt: Date.now(),
      expiresAt: expiresInDays ? Date.now() + expiresInDays * 24 * 60 * 60 * 1000 : undefined,
      active: true,
    };

    this.keys.set(id, encryptionKey);
    return encryptionKey;
  }

  /**
   * Generate random key
   */
  private generateRandomKey(algorithm: string): string {
    const length = algorithm === 'AES-256' ? 32 : algorithm === 'AES-128' ? 16 : 256;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  /**
   * Encrypt data
   */
  encryptData(data: string, keyId: string): EncryptedData {
    const key = this.keys.get(keyId);
    if (!key || !key.active) {
      throw new Error(`Invalid or inactive key: ${keyId}`);
    }

    const id = `encrypted-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const iv = this.generateRandomKey('AES-128');

    // Simulate encryption (in production, use actual crypto library)
    const ciphertext = Buffer.from(data).toString('base64');

    const encrypted: EncryptedData = {
      id,
      ciphertext,
      keyId,
      algorithm: key.algorithm,
      iv,
      timestamp: Date.now(),
    };

    this.encryptedData.set(id, encrypted);
    return encrypted;
  }

  /**
   * Decrypt data
   */
  decryptData(encryptedId: string): string | null {
    const encrypted = this.encryptedData.get(encryptedId);
    if (!encrypted) return null;

    const key = this.keys.get(encrypted.keyId);
    if (!key) return null;

    // Simulate decryption (in production, use actual crypto library)
    try {
      const decrypted = Buffer.from(encrypted.ciphertext, 'base64').toString('utf-8');
      return decrypted;
    } catch {
      return null;
    }
  }

  /**
   * Create encryption policy
   */
  createPolicy(policy: Omit<EncryptionPolicy, 'id'>): EncryptionPolicy {
    const id = `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const encryptionPolicy: EncryptionPolicy = { ...policy, id };
    this.policies.set(id, encryptionPolicy);
    return encryptionPolicy;
  }

  /**
   * Rotate key
   */
  rotateKey(keyId: string, reason: string = 'scheduled'): EncryptionKey {
    const oldKey = this.keys.get(keyId);
    if (!oldKey) {
      throw new Error(`Key not found: ${keyId}`);
    }

    // Deactivate old key
    oldKey.active = false;

    // Generate new key
    const newKey = this.generateKey(oldKey.algorithm);

    // Log rotation
    this.keyRotationLog.push({
      keyId,
      timestamp: Date.now(),
      reason,
    });

    return newKey;
  }

  /**
   * Get key
   */
  getKey(keyId: string): EncryptionKey | undefined {
    return this.keys.get(keyId);
  }

  /**
   * Get active keys
   */
  getActiveKeys(): EncryptionKey[] {
    return Array.from(this.keys.values()).filter((k) => k.active);
  }

  /**
   * Get expired keys
   */
  getExpiredKeys(): EncryptionKey[] {
    const now = Date.now();
    return Array.from(this.keys.values()).filter((k) => k.expiresAt && k.expiresAt < now);
  }

  /**
   * Check key expiration
   */
  checkKeyExpiration(): EncryptionKey[] {
    const expiredKeys = this.getExpiredKeys();
    for (const key of expiredKeys) {
      key.active = false;
    }
    return expiredKeys;
  }

  /**
   * Get encryption policy
   */
  getPolicy(policyId: string): EncryptionPolicy | undefined {
    return this.policies.get(policyId);
  }

  /**
   * Get policies for data type
   */
  getPoliciesForDataType(dataType: string): EncryptionPolicy[] {
    return Array.from(this.policies.values()).filter(
      (p) => p.enabled && p.dataTypes.includes(dataType)
    );
  }

  /**
   * Update policy
   */
  updatePolicy(policyId: string, updates: Partial<EncryptionPolicy>): boolean {
    const policy = this.policies.get(policyId);
    if (!policy) return false;

    Object.assign(policy, updates);
    return true;
  }

  /**
   * Get encryption statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalKeys = this.keys.size;
    const activeKeys = this.getActiveKeys().length;
    const expiredKeys = this.getExpiredKeys().length;
    const totalEncrypted = this.encryptedData.size;
    const algorithmUsage: Record<string, number> = {};

    for (const key of this.keys.values()) {
      algorithmUsage[key.algorithm] = (algorithmUsage[key.algorithm] || 0) + 1;
    }

    return {
      totalKeys,
      activeKeys,
      expiredKeys,
      totalEncrypted,
      algorithmUsage,
      keyRotations: this.keyRotationLog.length,
    };
  }

  /**
   * Get key rotation history
   */
  getKeyRotationHistory(
    limit?: number
  ): Array<{ keyId: string; timestamp: number; reason: string }> {
    if (limit) {
      return this.keyRotationLog.slice(-limit);
    }
    return [...this.keyRotationLog];
  }

  /**
   * Delete encrypted data
   */
  deleteEncryptedData(encryptedId: string): boolean {
    return this.encryptedData.delete(encryptedId);
  }

  /**
   * Get encrypted data info
   */
  getEncryptedDataInfo(encryptedId: string): EncryptedData | undefined {
    return this.encryptedData.get(encryptedId);
  }

  /**
   * Validate encryption policy compliance
   */
  validatePolicyCompliance(dataType: string, keyId: string): boolean {
    const policies = this.getPoliciesForDataType(dataType);
    if (policies.length === 0) return true;

    const key = this.keys.get(keyId);
    if (!key || !key.active) return false;

    return policies.some((p) => p.algorithm === key.algorithm);
  }
}
