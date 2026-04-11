/**
 * Auto Scaling Manager
 * Automatic resource scaling based on demand and performance metrics
 */

export interface ScalingPolicy {
  minInstances: number;
  maxInstances: number;
  targetCPU: number;
  targetMemory: number;
  scaleUpThreshold: number;
  scaleDownThreshold: number;
  cooldownPeriod: number;
}

export interface ResourceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  requestsPerSecond: number;
  responseTime: number;
  errorRate: number;
}

export interface ScalingEvent {
  id: string;
  timestamp: number;
  type: 'scale-up' | 'scale-down';
  fromInstances: number;
  toInstances: number;
  reason: string;
  metrics: ResourceMetrics;
}

/**
 * Auto Scaling Manager
 * Manages automatic scaling of resources based on metrics
 */
export class AutoScalingManager {
  private policy: ScalingPolicy;
  private currentInstances: number;
  private scalingEvents: ScalingEvent[] = [];
  private metricsHistory: ResourceMetrics[] = [];
  private lastScalingTime: number = 0;
  private predictedLoad: number = 0;

  constructor(policy: ScalingPolicy) {
    this.policy = policy;
    this.currentInstances = policy.minInstances;
  }

  /**
   * Evaluate metrics and determine if scaling is needed
   */
  public evaluateMetrics(metrics: ResourceMetrics): ScalingEvent | null {
    this.metricsHistory.push(metrics);

    // Keep only last 100 metrics
    if (this.metricsHistory.length > 100) {
      this.metricsHistory.shift();
    }

    // Check if in cooldown period
    if (Date.now() - this.lastScalingTime < this.policy.cooldownPeriod) {
      return null;
    }

    // Calculate average metrics
    const avgMetrics = this.calculateAverageMetrics();

    // Determine if scaling is needed
    const shouldScaleUp =
      avgMetrics.cpuUsage > this.policy.scaleUpThreshold ||
      avgMetrics.memoryUsage > this.policy.scaleUpThreshold ||
      avgMetrics.requestsPerSecond > this.policy.targetCPU;

    const shouldScaleDown =
      avgMetrics.cpuUsage < this.policy.scaleDownThreshold &&
      avgMetrics.memoryUsage < this.policy.scaleDownThreshold &&
      avgMetrics.requestsPerSecond < this.policy.targetCPU * 0.5;

    if (shouldScaleUp && this.currentInstances < this.policy.maxInstances) {
      return this.scaleUp(metrics, 'High resource utilization');
    }

    if (shouldScaleDown && this.currentInstances > this.policy.minInstances) {
      return this.scaleDown(metrics, 'Low resource utilization');
    }

    return null;
  }

  /**
   * Scale up instances
   */
  private scaleUp(metrics: ResourceMetrics, reason: string): ScalingEvent {
    const fromInstances = this.currentInstances;
    const toInstances = Math.min(this.currentInstances + 1, this.policy.maxInstances);

    this.currentInstances = toInstances;
    this.lastScalingTime = Date.now();

    const event: ScalingEvent = {
      id: `scale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type: 'scale-up',
      fromInstances,
      toInstances,
      reason,
      metrics,
    };

    this.scalingEvents.push(event);
    return event;
  }

  /**
   * Scale down instances
   */
  private scaleDown(metrics: ResourceMetrics, reason: string): ScalingEvent {
    const fromInstances = this.currentInstances;
    const toInstances = Math.max(this.currentInstances - 1, this.policy.minInstances);

    this.currentInstances = toInstances;
    this.lastScalingTime = Date.now();

    const event: ScalingEvent = {
      id: `scale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type: 'scale-down',
      fromInstances,
      toInstances,
      reason,
      metrics,
    };

    this.scalingEvents.push(event);
    return event;
  }

  /**
   * Calculate average metrics
   */
  private calculateAverageMetrics(): ResourceMetrics {
    if (this.metricsHistory.length === 0) {
      return {
        cpuUsage: 0,
        memoryUsage: 0,
        requestsPerSecond: 0,
        responseTime: 0,
        errorRate: 0,
      };
    }

    const sum = this.metricsHistory.reduce(
      (acc, m) => ({
        cpuUsage: acc.cpuUsage + m.cpuUsage,
        memoryUsage: acc.memoryUsage + m.memoryUsage,
        requestsPerSecond: acc.requestsPerSecond + m.requestsPerSecond,
        responseTime: acc.responseTime + m.responseTime,
        errorRate: acc.errorRate + m.errorRate,
      }),
      {
        cpuUsage: 0,
        memoryUsage: 0,
        requestsPerSecond: 0,
        responseTime: 0,
        errorRate: 0,
      }
    );

    const count = this.metricsHistory.length;
    return {
      cpuUsage: sum.cpuUsage / count,
      memoryUsage: sum.memoryUsage / count,
      requestsPerSecond: sum.requestsPerSecond / count,
      responseTime: sum.responseTime / count,
      errorRate: sum.errorRate / count,
    };
  }

  /**
   * Predict future load
   */
  public predictLoad(hoursAhead: number = 1): number {
    if (this.metricsHistory.length < 2) return this.currentInstances;

    // Simple linear regression for prediction
    const recent = this.metricsHistory.slice(-10);
    const avgRps = recent.reduce((sum, m) => sum + m.requestsPerSecond, 0) / recent.length;

    // Assume 10% growth per hour
    this.predictedLoad = avgRps * Math.pow(1.1, hoursAhead);
    return this.predictedLoad;
  }

  /**
   * Get current instances
   */
  public getCurrentInstances(): number {
    return this.currentInstances;
  }

  /**
   * Get scaling events
   */
  public getScalingEvents(limit: number = 100): ScalingEvent[] {
    return this.scalingEvents.slice(-limit);
  }

  /**
   * Get scaling statistics
   */
  public getStatistics(): Record<string, unknown> {
    const scaleUpCount = this.scalingEvents.filter((e) => e.type === 'scale-up').length;
    const scaleDownCount = this.scalingEvents.filter((e) => e.type === 'scale-down').length;

    return {
      currentInstances: this.currentInstances,
      minInstances: this.policy.minInstances,
      maxInstances: this.policy.maxInstances,
      totalScalingEvents: this.scalingEvents.length,
      scaleUpCount,
      scaleDownCount,
      predictedLoad: this.predictedLoad,
      averageMetrics: this.calculateAverageMetrics(),
    };
  }

  /**
   * Update scaling policy
   */
  public updatePolicy(policy: Partial<ScalingPolicy>): void {
    this.policy = { ...this.policy, ...policy };
  }
}
