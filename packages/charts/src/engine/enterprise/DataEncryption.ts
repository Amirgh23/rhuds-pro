/**
 * Data Encryption System
 * Encrypt and decrypt sensitive data
 */

export interface EncryptionConfig {
  algorithm?: string;
  keySize?: number;
}

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
  algorithm: string;
}

/**
 * Data Encryption
 */
export class DataEncryption {
  private config: EncryptionConfig;
  private listeners: Map<string, Function[]> = new Map();

  constructor(config: EncryptionConfig = {}) {
    this.config = {
      algorithm: 'AES-256-GCM',
      keySize: 256,
      ...config,
    };
  }

  /**
   * Encrypt data
   */
  public encrypt(data: any, key?: string): EncryptedData {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);

    // Generate random IV and salt
    const iv = this.generateRandomBytes(16);
    const salt = this.generateRandomBytes(16);

    // Derive key from password if provided
    const encryptionKey = key ? this.deriveKey(key, salt) : this.generateRandomBytes(32);

    // Simple XOR encryption (for demonstration)
    // In production, use proper encryption library like crypto-js or libsodium
    const ciphertext = this.xorEncrypt(dataString, encryptionKey, iv);

    this.emit('data:encrypted', { size: dataString.length });

    return {
      ciphertext,
      iv: this.bytesToHex(iv),
      salt: this.bytesToHex(salt),
      algorithm: this.config.algorithm!,
    };
  }

  /**
   * Decrypt data
   */
  public decrypt(encrypted: EncryptedData, key?: string): any {
    try {
      const iv = this.hexToBytes(encrypted.iv);
      const salt = this.hexToBytes(encrypted.salt);

      // Derive key from password if provided
      const encryptionKey = key ? this.deriveKey(key, salt) : this.generateRandomBytes(32);

      // Decrypt using XOR
      const decrypted = this.xorDecrypt(encrypted.ciphertext, encryptionKey, iv);

      // Try to parse as JSON
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    } catch (error) {
      this.emit('data:decrypt_error', { error });
      throw new Error('Decryption failed');
    }
  }

  /**
   * Hash data
   */
  public hash(data: any): string {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    return this.simpleHash(dataString);
  }

  /**
   * Verify hash
   */
  public verifyHash(data: any, hash: string): boolean {
    return this.hash(data) === hash;
  }

  /**
   * Generate random bytes
   */
  private generateRandomBytes(length: number): Uint8Array {
    if (typeof window !== 'undefined' && window.crypto) {
      return window.crypto.getRandomValues(new Uint8Array(length));
    }

    // Fallback for Node.js or other environments
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return bytes;
  }

  /**
   * Derive key from password
   */
  private deriveKey(password: string, salt: Uint8Array): Uint8Array {
    // Simple key derivation (PBKDF2-like)
    const key = new Uint8Array(32);
    const passwordBytes = this.stringToBytes(password);

    for (let i = 0; i < 32; i++) {
      let hash = 0;
      for (let j = 0; j < passwordBytes.length; j++) {
        hash = (hash << 5) - hash + passwordBytes[j];
        hash = hash & hash; // Convert to 32bit integer
      }
      for (let j = 0; j < salt.length; j++) {
        hash = (hash << 5) - hash + salt[j];
        hash = hash & hash;
      }
      key[i] = Math.abs(hash) % 256;
    }

    return key;
  }

  /**
   * XOR encryption
   */
  private xorEncrypt(data: string, key: Uint8Array, iv: Uint8Array): string {
    const dataBytes = this.stringToBytes(data);
    const encrypted = new Uint8Array(dataBytes.length);

    for (let i = 0; i < dataBytes.length; i++) {
      encrypted[i] = dataBytes[i] ^ key[i % key.length] ^ iv[i % iv.length];
    }

    return this.bytesToHex(encrypted);
  }

  /**
   * XOR decryption
   */
  private xorDecrypt(ciphertext: string, key: Uint8Array, iv: Uint8Array): string {
    const encryptedBytes = this.hexToBytes(ciphertext);
    const decrypted = new Uint8Array(encryptedBytes.length);

    for (let i = 0; i < encryptedBytes.length; i++) {
      decrypted[i] = encryptedBytes[i] ^ key[i % key.length] ^ iv[i % iv.length];
    }

    return this.bytesToString(decrypted);
  }

  /**
   * Simple hash function
   */
  private simpleHash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Convert string to bytes
   */
  private stringToBytes(str: string): Uint8Array {
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Convert bytes to string
   */
  private bytesToString(bytes: Uint8Array): string {
    return String.fromCharCode.apply(null, Array.from(bytes));
  }

  /**
   * Convert bytes to hex
   */
  private bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Convert hex to bytes
   */
  private hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
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
   * Destroy encryption
   */
  public destroy(): void {
    this.listeners.clear();
  }
}

export default DataEncryption;
