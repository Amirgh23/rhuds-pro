/**
 * Hunting Automation Engine
 * Automated threat hunting workflows
 */

/**
 * Hunting campaign
 */
export interface HuntingCampaign {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  queries: string[];
  patterns: string[];
  automationLevel: 'manual' | 'semi-auto' | 'full-auto';
  schedule?: {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    nextRun: number;
  };
}

/**
 * Campaign execution
 */
export interface CampaignExecution {
  id: string;
  campaignId: string;
  timestamp: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  queriesExecuted: number;
  patternsAnalyzed: number;
  matchesFound: number;
  duration: number;
  results: Array<{
    type: 'query' | 'pattern';
    id: string;
    matchCount: number;
  }>;
}

/**
 * Hunting Automation Engine
 * Automated threat hunting workflows
 */
export class HuntingAutomationEngine {
  private campaigns: Map<string, HuntingCampaign> = new Map();
  private executions: Map<string, CampaignExecution> = new Map();
  private executionHistory: CampaignExecution[] = [];
  private campaignHandlers: Map<
    string,
    (campaign: HuntingCampaign) => Promise<Array<{ type: string; id: string; matchCount: number }>>
  > = new Map();

  /**
   * Register campaign handler
   */
  registerCampaignHandler(
    campaignType: string,
    handler: (
      campaign: HuntingCampaign
    ) => Promise<Array<{ type: string; id: string; matchCount: number }>>
  ): void {
    this.campaignHandlers.set(campaignType, handler);
  }

  /**
   * Create hunting campaign
   */
  createCampaign(
    name: string,
    description: string,
    queries: string[],
    patterns: string[],
    automationLevel: string = 'semi-auto'
  ): HuntingCampaign {
    const id = `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const campaign: HuntingCampaign = {
      id,
      name,
      description,
      createdAt: Date.now(),
      status: 'draft',
      queries,
      patterns,
      automationLevel: automationLevel as HuntingCampaign['automationLevel'],
    };

    this.campaigns.set(id, campaign);
    return campaign;
  }

  /**
   * Start campaign
   */
  async startCampaign(campaignId: string): Promise<CampaignExecution | null> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign || campaign.status === 'active') return null;

    const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    const execution: CampaignExecution = {
      id: executionId,
      campaignId,
      timestamp: startTime,
      status: 'running',
      queriesExecuted: 0,
      patternsAnalyzed: 0,
      matchesFound: 0,
      duration: 0,
      results: [],
    };

    this.executions.set(executionId, execution);

    try {
      // Execute campaign
      const handler = this.campaignHandlers.get('default');
      if (handler) {
        const results = await handler(campaign);
        execution.results = results;
        execution.queriesExecuted = campaign.queries.length;
        execution.patternsAnalyzed = campaign.patterns.length;
        execution.matchesFound = results.reduce((sum, r) => sum + r.matchCount, 0);
        execution.status = 'completed';
      } else {
        execution.status = 'failed';
      }
    } catch (error) {
      execution.status = 'failed';
    }

    execution.duration = Date.now() - startTime;
    campaign.status = 'active';

    this.executionHistory.push(execution);
    return execution;
  }

  /**
   * Pause campaign
   */
  pauseCampaign(campaignId: string): boolean {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign || campaign.status !== 'active') return false;

    campaign.status = 'paused';
    return true;
  }

  /**
   * Resume campaign
   */
  resumeCampaign(campaignId: string): boolean {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign || campaign.status !== 'paused') return false;

    campaign.status = 'active';
    return true;
  }

  /**
   * Complete campaign
   */
  completeCampaign(campaignId: string): boolean {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return false;

    campaign.status = 'completed';
    return true;
  }

  /**
   * Get campaign
   */
  getCampaign(campaignId: string): HuntingCampaign | undefined {
    return this.campaigns.get(campaignId);
  }

  /**
   * Get all campaigns
   */
  getAllCampaigns(): HuntingCampaign[] {
    return Array.from(this.campaigns.values());
  }

  /**
   * Get active campaigns
   */
  getActiveCampaigns(): HuntingCampaign[] {
    return Array.from(this.campaigns.values()).filter((c) => c.status === 'active');
  }

  /**
   * Get execution
   */
  getExecution(executionId: string): CampaignExecution | undefined {
    return this.executions.get(executionId);
  }

  /**
   * Get executions by campaign
   */
  getExecutionsByCampaign(campaignId: string, limit = 100): CampaignExecution[] {
    return this.executionHistory.filter((e) => e.campaignId === campaignId).slice(-limit);
  }

  /**
   * Get execution history
   */
  getExecutionHistory(limit = 100): CampaignExecution[] {
    return this.executionHistory.slice(-limit);
  }

  /**
   * Get hunting statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalCampaigns = this.campaigns.size;
    const activeCampaigns = Array.from(this.campaigns.values()).filter(
      (c) => c.status === 'active'
    ).length;
    const completedCampaigns = Array.from(this.campaigns.values()).filter(
      (c) => c.status === 'completed'
    ).length;

    const totalExecutions = this.executionHistory.length;
    const successfulExecutions = this.executionHistory.filter(
      (e) => e.status === 'completed'
    ).length;
    const failedExecutions = this.executionHistory.filter((e) => e.status === 'failed').length;

    const totalMatches = this.executionHistory.reduce((sum, e) => sum + e.matchesFound, 0);
    const avgMatchesPerExecution = totalExecutions > 0 ? totalMatches / totalExecutions : 0;

    const avgExecutionTime =
      totalExecutions > 0
        ? this.executionHistory.reduce((sum, e) => sum + e.duration, 0) / totalExecutions
        : 0;

    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;

    return {
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      successRate,
      totalMatches,
      avgMatchesPerExecution,
      avgExecutionTime,
    };
  }

  /**
   * Export hunting report
   */
  exportHuntingReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(
        {
          campaigns: Array.from(this.campaigns.values()),
          statistics: this.getStatistics(),
          recentExecutions: this.executionHistory.slice(-50),
        },
        null,
        2
      );
    }

    // CSV format
    const headers = ['CampaignID', 'ExecutionID', 'Status', 'MatchesFound', 'Duration'];
    const rows = this.executionHistory
      .slice(-100)
      .map((e) => [e.campaignId, e.id, e.status, e.matchesFound, e.duration]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
