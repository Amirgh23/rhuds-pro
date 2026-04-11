/**
 * Incident Escalation Manager
 * Manages incident escalation workflows and procedures
 */

/**
 * Escalation level
 */
export type EscalationLevel = 'level1' | 'level2' | 'level3' | 'level4' | 'executive';

/**
 * Escalation trigger
 */
export interface EscalationTrigger {
  id: string;
  name: string;
  enabled: boolean;
  condition: (incident: Record<string, unknown>) => boolean;
  targetLevel: EscalationLevel;
  delayMinutes: number;
  notifyUsers: string[];
}

/**
 * Escalation history
 */
export interface EscalationHistory {
  id: string;
  timestamp: number;
  incidentId: string;
  fromLevel: EscalationLevel;
  toLevel: EscalationLevel;
  reason: string;
  triggeredBy: string;
  notifiedUsers: string[];
}

/**
 * Escalation workflow
 */
export interface EscalationWorkflow {
  id: string;
  name: string;
  enabled: boolean;
  levels: Array<{
    level: EscalationLevel;
    timeoutMinutes: number;
    assignees: string[];
    actions: string[];
  }>;
  maxLevel: EscalationLevel;
}

/**
 * Incident Escalation Manager
 * Manages incident escalation workflows and procedures
 */
export class IncidentEscalationManager {
  private triggers: Map<string, EscalationTrigger> = new Map();
  private workflows: Map<string, EscalationWorkflow> = new Map();
  private history: EscalationHistory[] = [];
  private activeEscalations: Map<string, { level: EscalationLevel; timestamp: number }> = new Map();

  /**
   * Create escalation trigger
   */
  createTrigger(trigger: Omit<EscalationTrigger, 'id'>): EscalationTrigger {
    const id = `trigger-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const escalationTrigger: EscalationTrigger = { ...trigger, id };
    this.triggers.set(id, escalationTrigger);
    return escalationTrigger;
  }

  /**
   * Create escalation workflow
   */
  createWorkflow(workflow: Omit<EscalationWorkflow, 'id'>): EscalationWorkflow {
    const id = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const escalationWorkflow: EscalationWorkflow = { ...workflow, id };
    this.workflows.set(id, escalationWorkflow);
    return escalationWorkflow;
  }

  /**
   * Evaluate escalation triggers
   */
  evaluateTriggers(
    incidentId: string,
    incidentData: Record<string, unknown>
  ): EscalationLevel | null {
    let highestLevel: EscalationLevel | null = null;
    const levelOrder: EscalationLevel[] = ['level1', 'level2', 'level3', 'level4', 'executive'];

    for (const trigger of this.triggers.values()) {
      if (!trigger.enabled) continue;

      try {
        if (trigger.condition(incidentData)) {
          if (
            !highestLevel ||
            levelOrder.indexOf(trigger.targetLevel) > levelOrder.indexOf(highestLevel)
          ) {
            highestLevel = trigger.targetLevel;
          }
        }
      } catch {
        // Ignore errors in condition evaluation
      }
    }

    return highestLevel;
  }

  /**
   * Escalate incident
   */
  escalateIncident(
    incidentId: string,
    fromLevel: EscalationLevel,
    toLevel: EscalationLevel,
    reason: string,
    triggeredBy: string
  ): EscalationHistory | null {
    const workflow = Array.from(this.workflows.values()).find((w) => w.enabled);
    if (!workflow) return null;

    const levelConfig = workflow.levels.find((l) => l.level === toLevel);
    if (!levelConfig) return null;

    const id = `escalation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const escalation: EscalationHistory = {
      id,
      timestamp: Date.now(),
      incidentId,
      fromLevel,
      toLevel,
      reason,
      triggeredBy,
      notifiedUsers: levelConfig.assignees,
    };

    this.history.push(escalation);
    this.activeEscalations.set(incidentId, { level: toLevel, timestamp: Date.now() });

    return escalation;
  }

  /**
   * De-escalate incident
   */
  deEscalateIncident(incidentId: string, reason: string, triggeredBy: string): boolean {
    const current = this.activeEscalations.get(incidentId);
    if (!current) return false;

    const levelOrder: EscalationLevel[] = ['level1', 'level2', 'level3', 'level4', 'executive'];
    const currentIndex = levelOrder.indexOf(current.level);

    if (currentIndex <= 0) return false;

    const previousLevel = levelOrder[currentIndex - 1];

    this.escalateIncident(incidentId, current.level, previousLevel, reason, triggeredBy);
    return true;
  }

  /**
   * Get escalation level for incident
   */
  getEscalationLevel(incidentId: string): EscalationLevel | null {
    const escalation = this.activeEscalations.get(incidentId);
    return escalation?.level || null;
  }

  /**
   * Get escalation history for incident
   */
  getEscalationHistory(incidentId: string): EscalationHistory[] {
    return this.history.filter((e) => e.incidentId === incidentId);
  }

  /**
   * Get escalations by level
   */
  getEscalationsByLevel(level: EscalationLevel): EscalationHistory[] {
    return this.history.filter((e) => e.toLevel === level);
  }

  /**
   * Get active escalations
   */
  getActiveEscalations(): Array<{ incidentId: string; level: EscalationLevel; timestamp: number }> {
    return Array.from(this.activeEscalations.entries()).map(([incidentId, data]) => ({
      incidentId,
      ...data,
    }));
  }

  /**
   * Get escalation statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalEscalations = this.history.length;
    const activeCount = this.activeEscalations.size;

    const escalationsByLevel: Record<string, number> = {};
    for (const escalation of this.history) {
      escalationsByLevel[escalation.toLevel] = (escalationsByLevel[escalation.toLevel] || 0) + 1;
    }

    const avgTimeToEscalate =
      totalEscalations > 0
        ? this.history.reduce((sum, e) => sum + (e.timestamp - Date.now()), 0) / totalEscalations
        : 0;

    return {
      totalEscalations,
      activeEscalations: activeCount,
      escalationsByLevel,
      avgTimeToEscalate,
      triggerCount: this.triggers.size,
      workflowCount: this.workflows.size,
    };
  }

  /**
   * Update trigger
   */
  updateTrigger(id: string, updates: Partial<EscalationTrigger>): boolean {
    const trigger = this.triggers.get(id);
    if (!trigger) return false;

    Object.assign(trigger, updates);
    return true;
  }

  /**
   * Delete trigger
   */
  deleteTrigger(id: string): boolean {
    return this.triggers.delete(id);
  }

  /**
   * Get all triggers
   */
  getTriggers(): EscalationTrigger[] {
    return Array.from(this.triggers.values());
  }

  /**
   * Get all workflows
   */
  getWorkflows(): EscalationWorkflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Export escalation report
   */
  exportEscalationReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.history, null, 2);
    }

    // CSV format
    const headers = [
      'ID',
      'Timestamp',
      'Incident ID',
      'From Level',
      'To Level',
      'Reason',
      'Triggered By',
    ];
    const rows = this.history.map((e) => [
      e.id,
      e.timestamp,
      e.incidentId,
      e.fromLevel,
      e.toLevel,
      e.reason,
      e.triggeredBy,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
