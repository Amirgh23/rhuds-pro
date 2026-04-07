/**
 * Cost Tracking System
 * Usage tracking, cost calculation, and invoice generation
 */

export interface UsageRecord {
  id: string;
  tenantId: string;
  metric: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  timestamp: Date;
}

export interface Invoice {
  id: string;
  tenantId: string;
  period: { start: Date; end: Date };
  items: UsageRecord[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid';
  createdAt: Date;
  dueDate: Date;
}

export interface CostSummary {
  tenantId: string;
  period: { start: Date; end: Date };
  totalUsage: Record<string, number>;
  totalCost: number;
  breakdown: Record<string, number>;
}

/**
 * Cost Tracker
 */
export class CostTracker {
  private usageRecords: Map<string, UsageRecord[]> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private listeners: Map<string, Function[]> = new Map();
  private taxRate: number = 0.1; // 10%
  private pricing: Map<string, number> = new Map();

  constructor() {
    // Default pricing
    this.pricing.set('api_calls', 0.0001); // $0.0001 per call
    this.pricing.set('storage_gb', 0.1); // $0.1 per GB
    this.pricing.set('exports', 0.5); // $0.5 per export
    this.pricing.set('users', 10); // $10 per user
  }

  /**
   * Record usage
   */
  public recordUsage(tenantId: string, metric: string, quantity: number): UsageRecord {
    const id = this.generateId();
    const unitCost = this.pricing.get(metric) || 0;
    const totalCost = quantity * unitCost;

    const record: UsageRecord = {
      id,
      tenantId,
      metric,
      quantity,
      unitCost,
      totalCost,
      timestamp: new Date(),
    };

    if (!this.usageRecords.has(tenantId)) {
      this.usageRecords.set(tenantId, []);
    }

    this.usageRecords.get(tenantId)!.push(record);
    this.emit('usage:recorded', { tenantId, metric, quantity, cost: totalCost });

    return record;
  }

  /**
   * Get usage records
   */
  public getUsageRecords(tenantId: string, metric?: string): UsageRecord[] {
    let records = this.usageRecords.get(tenantId) || [];

    if (metric) {
      records = records.filter((r) => r.metric === metric);
    }

    return records;
  }

  /**
   * Set pricing
   */
  public setPricing(metric: string, unitCost: number): void {
    this.pricing.set(metric, unitCost);
    this.emit('pricing:updated', { metric, unitCost });
  }

  /**
   * Get pricing
   */
  public getPricing(metric: string): number {
    return this.pricing.get(metric) || 0;
  }

  /**
   * Calculate cost for period
   */
  public calculateCostForPeriod(tenantId: string, startDate: Date, endDate: Date): number {
    const records = this.usageRecords.get(tenantId) || [];
    return records
      .filter((r) => r.timestamp >= startDate && r.timestamp <= endDate)
      .reduce((sum, r) => sum + r.totalCost, 0);
  }

  /**
   * Generate invoice
   */
  public generateInvoice(tenantId: string, startDate: Date, endDate: Date): Invoice {
    const id = this.generateId();
    const records = (this.usageRecords.get(tenantId) || []).filter(
      (r) => r.timestamp >= startDate && r.timestamp <= endDate
    );

    const subtotal = records.reduce((sum, r) => sum + r.totalCost, 0);
    const tax = subtotal * this.taxRate;
    const total = subtotal + tax;

    const invoice: Invoice = {
      id,
      tenantId,
      period: { start: startDate, end: endDate },
      items: records,
      subtotal,
      tax,
      total,
      status: 'draft',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    this.invoices.set(id, invoice);
    this.emit('invoice:generated', { invoiceId: id, tenantId, total });

    return invoice;
  }

  /**
   * Get invoice
   */
  public getInvoice(invoiceId: string): Invoice | undefined {
    return this.invoices.get(invoiceId);
  }

  /**
   * List invoices for tenant
   */
  public listInvoices(tenantId: string, status?: string): Invoice[] {
    let invoices = Array.from(this.invoices.values()).filter((i) => i.tenantId === tenantId);

    if (status) {
      invoices = invoices.filter((i) => i.status === status);
    }

    return invoices.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Update invoice status
   */
  public updateInvoiceStatus(
    invoiceId: string,
    status: 'draft' | 'sent' | 'paid'
  ): Invoice | undefined {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) {
      return undefined;
    }

    invoice.status = status;
    this.emit('invoice:status_updated', { invoiceId, status });

    return invoice;
  }

  /**
   * Get cost summary
   */
  public getCostSummary(tenantId: string, startDate: Date, endDate: Date): CostSummary {
    const records = (this.usageRecords.get(tenantId) || []).filter(
      (r) => r.timestamp >= startDate && r.timestamp <= endDate
    );

    const totalUsage: Record<string, number> = {};
    const breakdown: Record<string, number> = {};

    records.forEach((r) => {
      totalUsage[r.metric] = (totalUsage[r.metric] || 0) + r.quantity;
      breakdown[r.metric] = (breakdown[r.metric] || 0) + r.totalCost;
    });

    const totalCost = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);

    return {
      tenantId,
      period: { start: startDate, end: endDate },
      totalUsage,
      totalCost,
      breakdown,
    };
  }

  /**
   * Set tax rate
   */
  public setTaxRate(rate: number): void {
    this.taxRate = rate;
    this.emit('tax_rate:updated', { rate });
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    totalInvoices: number;
    totalRevenue: number;
    averageInvoiceValue: number;
    paidInvoices: number;
  } {
    const invoices = Array.from(this.invoices.values());
    const totalRevenue = invoices.reduce((sum, i) => sum + i.total, 0);
    const paidInvoices = invoices.filter((i) => i.status === 'paid').length;

    return {
      totalInvoices: invoices.length,
      totalRevenue,
      averageInvoiceValue: invoices.length > 0 ? totalRevenue / invoices.length : 0,
      paidInvoices,
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `cost_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    this.usageRecords.clear();
    this.invoices.clear();
    this.pricing.clear();
    this.listeners.clear();
  }
}

export default CostTracker;
