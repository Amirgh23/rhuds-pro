/**
 * Multi-Tenancy Manager
 * Tenant isolation, data segregation, and tenant management
 */

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  owner: string;
  plan: 'starter' | 'professional' | 'enterprise';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface TenantCreateRequest {
  name: string;
  domain: string;
  owner: string;
  plan?: 'starter' | 'professional' | 'enterprise';
}

export interface TenantUpdateRequest {
  name?: string;
  plan?: 'starter' | 'professional' | 'enterprise';
  isActive?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Tenant Manager
 */
export class TenantManager {
  private tenants: Map<string, Tenant> = new Map();
  private tenantUsers: Map<string, Set<string>> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Create tenant
   */
  public createTenant(request: TenantCreateRequest): Tenant {
    const id = this.generateId();
    const now = new Date();

    const tenant: Tenant = {
      id,
      name: request.name,
      domain: request.domain,
      owner: request.owner,
      plan: request.plan || 'starter',
      createdAt: now,
      updatedAt: now,
      isActive: true,
    };

    this.tenants.set(id, tenant);
    this.tenantUsers.set(id, new Set([request.owner]));
    this.emit('tenant:created', { tenantId: id, name: request.name });

    return tenant;
  }

  /**
   * Get tenant by ID
   */
  public getTenant(tenantId: string): Tenant | undefined {
    return this.tenants.get(tenantId);
  }

  /**
   * Get tenant by domain
   */
  public getTenantByDomain(domain: string): Tenant | undefined {
    for (const tenant of this.tenants.values()) {
      if (tenant.domain === domain) {
        return tenant;
      }
    }
    return undefined;
  }

  /**
   * Update tenant
   */
  public updateTenant(tenantId: string, request: TenantUpdateRequest): Tenant | undefined {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      return undefined;
    }

    if (request.name !== undefined) tenant.name = request.name;
    if (request.plan !== undefined) tenant.plan = request.plan;
    if (request.isActive !== undefined) tenant.isActive = request.isActive;
    if (request.metadata !== undefined) tenant.metadata = request.metadata;

    tenant.updatedAt = new Date();

    this.emit('tenant:updated', { tenantId, changes: request });

    return tenant;
  }

  /**
   * Delete tenant
   */
  public deleteTenant(tenantId: string): boolean {
    const deleted = this.tenants.delete(tenantId);
    if (deleted) {
      this.tenantUsers.delete(tenantId);
      this.emit('tenant:deleted', { tenantId });
    }
    return deleted;
  }

  /**
   * Add user to tenant
   */
  public addUserToTenant(tenantId: string, userId: string): boolean {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      return false;
    }

    const users = this.tenantUsers.get(tenantId);
    if (users) {
      users.add(userId);
      this.emit('tenant:user_added', { tenantId, userId });
      return true;
    }

    return false;
  }

  /**
   * Remove user from tenant
   */
  public removeUserFromTenant(tenantId: string, userId: string): boolean {
    const users = this.tenantUsers.get(tenantId);
    if (!users) {
      return false;
    }

    const deleted = users.delete(userId);
    if (deleted) {
      this.emit('tenant:user_removed', { tenantId, userId });
    }

    return deleted;
  }

  /**
   * Get tenant users
   */
  public getTenantUsers(tenantId: string): string[] {
    const users = this.tenantUsers.get(tenantId);
    return users ? Array.from(users) : [];
  }

  /**
   * Get user tenants
   */
  public getUserTenants(userId: string): Tenant[] {
    const tenants: Tenant[] = [];

    this.tenantUsers.forEach((users, tenantId) => {
      if (users.has(userId)) {
        const tenant = this.tenants.get(tenantId);
        if (tenant) {
          tenants.push(tenant);
        }
      }
    });

    return tenants;
  }

  /**
   * List all tenants
   */
  public listTenants(filter?: { plan?: string; isActive?: boolean }): Tenant[] {
    let tenants = Array.from(this.tenants.values());

    if (filter?.plan) {
      tenants = tenants.filter((t) => t.plan === filter.plan);
    }

    if (filter?.isActive !== undefined) {
      tenants = tenants.filter((t) => t.isActive === filter.isActive);
    }

    return tenants;
  }

  /**
   * Get tenant count
   */
  public getTenantCount(): number {
    return this.tenants.size;
  }

  /**
   * Get active tenant count
   */
  public getActiveTenantCount(): number {
    return Array.from(this.tenants.values()).filter((t) => t.isActive).length;
  }

  /**
   * Get tenant statistics
   */
  public getStatistics(): {
    totalTenants: number;
    activeTenants: number;
    byPlan: Record<string, number>;
    totalUsers: number;
  } {
    const stats = {
      totalTenants: this.tenants.size,
      activeTenants: 0,
      byPlan: { starter: 0, professional: 0, enterprise: 0 },
      totalUsers: 0,
    };

    this.tenants.forEach((tenant) => {
      if (tenant.isActive) stats.activeTenants++;
      stats.byPlan[tenant.plan]++;
    });

    this.tenantUsers.forEach((users) => {
      stats.totalUsers += users.size;
    });

    return stats;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
   * Destroy manager
   */
  public destroy(): void {
    this.tenants.clear();
    this.tenantUsers.clear();
    this.listeners.clear();
  }
}

export default TenantManager;
