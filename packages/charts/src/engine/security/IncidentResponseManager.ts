/**
 * Incident Response Manager
 * Manages incident lifecycle and response workflows
 */

/**
 * Incident severity
 */
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';

/**
 * Incident status
 */
export type IncidentStatus =
  | 'reported'
  | 'acknowledged'
  | 'investigating'
  | 'contained'
  | 'remediated'
  | 'closed'
  | 'escalated';

/**
 * Response action
 */
export interface ResponseAction {
  id: string;
  timestamp: number;
  type: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignee?: string;
  result?: string;
}

/**
 * Incident
 */
export interface Incident {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  source: string;
  affectedSystems: string[];
  reportedBy: string;
  assignedTo?: string;
  actions: ResponseAction[];
  timeline: Array<{ timestamp: number; event: string }>;
  resolution?: { timestamp: number; description: string };
  metadata: Record<string, unknown>;
}

/**
 * Escalation policy
 */
export interface EscalationPolicy {
  id: string;
  name: string;
  enabled: boolean;
  triggers: Array<{
    condition: string;
    escalateTo: string;
    delayMinutes: number;
  }>;
}

/**
 * Incident Response Manager
 * Manages incident creation, tracking, and response workflows
 */
export class IncidentResponseManager {
  private incidents: Map<string, Incident> = new Map();
  private incidentHistory: Incident[] = [];
  private escalationPolicies: Map<string, EscalationPolicy> = new Map();
  private responseTemplates: Map<string, ResponseAction[]> = new Map();
  private escalationQueue: Array<{
    incidentId: string;
    timestamp: number;
    policy: EscalationPolicy;
  }> = [];

  /**
   * Create incident
   */
  createIncident(incident: Omit<Incident, 'id' | 'timestamp' | 'actions' | 'timeline'>): Incident {
    const id = `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newIncident: Incident = {
      ...incident,
      id,
      timestamp: Date.now(),
      actions: [],
      timeline: [
        {
          timestamp: Date.now(),
          event: `Incident created with severity ${incident.severity}`,
        },
      ],
    };

    this.incidents.set(id, newIncident);
    this.incidentHistory.push(newIncident);

    return newIncident;
  }

  /**
   * Add response action
   */
  addResponseAction(
    incidentId: string,
    action: Omit<ResponseAction, 'id' | 'timestamp'>
  ): ResponseAction | null {
    const incident = this.incidents.get(incidentId);
    if (!incident) return null;

    const id = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const responseAction: ResponseAction = {
      ...action,
      id,
      timestamp: Date.now(),
    };

    incident.actions.push(responseAction);
    incident.timeline.push({
      timestamp: Date.now(),
      event: `Action added: ${action.type}`,
    });

    return responseAction;
  }

  /**
   * Update incident status
   */
  updateIncidentStatus(incidentId: string, status: IncidentStatus): boolean {
    const incident = this.incidents.get(incidentId);
    if (!incident) return false;

    incident.status = status;
    incident.timeline.push({
      timestamp: Date.now(),
      event: `Status changed to ${status}`,
    });

    return true;
  }

  /**
   * Update action status
   */
  updateActionStatus(
    incidentId: string,
    actionId: string,
    status: ResponseAction['status'],
    result?: string
  ): boolean {
    const incident = this.incidents.get(incidentId);
    if (!incident) return false;

    const action = incident.actions.find((a) => a.id === actionId);
    if (!action) return false;

    action.status = status;
    if (result) action.result = result;

    incident.timeline.push({
      timestamp: Date.now(),
      event: `Action ${actionId} status changed to ${status}`,
    });

    return true;
  }

  /**
   * Assign incident
   */
  assignIncident(incidentId: string, assignee: string): boolean {
    const incident = this.incidents.get(incidentId);
    if (!incident) return false;

    incident.assignedTo = assignee;
    incident.timeline.push({
      timestamp: Date.now(),
      event: `Incident assigned to ${assignee}`,
    });

    return true;
  }

  /**
   * Escalate incident
   */
  escalateIncident(incidentId: string, reason: string): boolean {
    const incident = this.incidents.get(incidentId);
    if (!incident) return false;

    incident.status = 'escalated';
    incident.timeline.push({
      timestamp: Date.now(),
      event: `Incident escalated: ${reason}`,
    });

    return true;
  }

  /**
   * Resolve incident
   */
  resolveIncident(incidentId: string, resolution: string): boolean {
    const incident = this.incidents.get(incidentId);
    if (!incident) return false;

    incident.status = 'closed';
    incident.resolution = {
      timestamp: Date.now(),
      description: resolution,
    };
    incident.timeline.push({
      timestamp: Date.now(),
      event: `Incident resolved: ${resolution}`,
    });

    return true;
  }

  /**
   * Create escalation policy
   */
  createEscalationPolicy(policy: Omit<EscalationPolicy, 'id'>): EscalationPolicy {
    const id = `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const escalationPolicy: EscalationPolicy = { ...policy, id };
    this.escalationPolicies.set(id, escalationPolicy);
    return escalationPolicy;
  }

  /**
   * Check escalation policies
   */
  checkEscalationPolicies(): void {
    const now = Date.now();

    for (const incident of this.incidentHistory) {
      if (incident.status === 'closed' || incident.status === 'escalated') continue;

      for (const policy of this.escalationPolicies.values()) {
        if (!policy.enabled) continue;

        for (const trigger of policy.triggers) {
          if (this.evaluateTrigger(incident, trigger)) {
            const delayMs = trigger.delayMinutes * 60 * 1000;
            const lastAction = incident.actions[incident.actions.length - 1];
            const lastActionTime = lastAction?.timestamp || incident.timestamp;

            if (now - lastActionTime > delayMs) {
              this.escalationQueue.push({
                incidentId: incident.id,
                timestamp: now,
                policy,
              });
            }
          }
        }
      }
    }
  }

  /**
   * Evaluate escalation trigger
   */
  private evaluateTrigger(incident: Incident, trigger: EscalationPolicy['triggers'][0]): boolean {
    switch (trigger.condition) {
      case 'high_severity':
        return incident.severity === 'critical' || incident.severity === 'high';
      case 'no_progress':
        return incident.actions.filter((a) => a.status === 'completed').length === 0;
      case 'time_exceeded':
        return Date.now() - incident.timestamp > 3600000; // 1 hour
      default:
        return false;
    }
  }

  /**
   * Get incident
   */
  getIncident(incidentId: string): Incident | undefined {
    return this.incidents.get(incidentId);
  }

  /**
   * Get open incidents
   */
  getOpenIncidents(): Incident[] {
    return this.incidentHistory.filter((i) => i.status !== 'closed' && i.status !== 'resolved');
  }

  /**
   * Get critical incidents
   */
  getCriticalIncidents(): Incident[] {
    return this.incidentHistory.filter((i) => i.severity === 'critical');
  }

  /**
   * Get incidents by status
   */
  getIncidentsByStatus(status: IncidentStatus): Incident[] {
    return this.incidentHistory.filter((i) => i.status === status);
  }

  /**
   * Get incidents by severity
   */
  getIncidentsBySeverity(severity: IncidentSeverity): Incident[] {
    return this.incidentHistory.filter((i) => i.severity === severity);
  }

  /**
   * Get incidents in time range
   */
  getIncidentsInTimeRange(startTime: number, endTime: number): Incident[] {
    return this.incidentHistory.filter((i) => i.timestamp >= startTime && i.timestamp <= endTime);
  }

  /**
   * Get incident statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalIncidents = this.incidentHistory.length;
    const openIncidents = this.getOpenIncidents().length;
    const criticalIncidents = this.getCriticalIncidents().length;

    const incidentsBySeverity: Record<string, number> = {};
    for (const incident of this.incidentHistory) {
      incidentsBySeverity[incident.severity] = (incidentsBySeverity[incident.severity] || 0) + 1;
    }

    const incidentsByStatus: Record<string, number> = {};
    for (const incident of this.incidentHistory) {
      incidentsByStatus[incident.status] = (incidentsByStatus[incident.status] || 0) + 1;
    }

    const avgResolutionTime =
      this.incidentHistory
        .filter((i) => i.resolution)
        .reduce((sum, i) => sum + (i.resolution!.timestamp - i.timestamp), 0) /
        Math.max(this.incidentHistory.filter((i) => i.resolution).length, 1) || 0;

    return {
      totalIncidents,
      openIncidents,
      criticalIncidents,
      incidentsBySeverity,
      incidentsByStatus,
      avgResolutionTime,
      escalationQueueLength: this.escalationQueue.length,
    };
  }

  /**
   * Get escalation queue
   */
  getEscalationQueue(): Array<{ incidentId: string; timestamp: number; policy: EscalationPolicy }> {
    return [...this.escalationQueue];
  }

  /**
   * Process escalation queue
   */
  processEscalationQueue(): void {
    const processed: number[] = [];

    for (let i = 0; i < this.escalationQueue.length; i++) {
      const item = this.escalationQueue[i];
      const incident = this.incidents.get(item.incidentId);

      if (incident) {
        this.escalateIncident(item.incidentId, `Escalated by policy: ${item.policy.name}`);
        processed.push(i);
      }
    }

    // Remove processed items
    for (let i = processed.length - 1; i >= 0; i--) {
      this.escalationQueue.splice(processed[i], 1);
    }
  }

  /**
   * Create response template
   */
  createResponseTemplate(name: string, actions: ResponseAction[]): void {
    this.responseTemplates.set(name, actions);
  }

  /**
   * Apply response template
   */
  applyResponseTemplate(incidentId: string, templateName: string): boolean {
    const incident = this.incidents.get(incidentId);
    if (!incident) return false;

    const template = this.responseTemplates.get(templateName);
    if (!template) return false;

    for (const action of template) {
      this.addResponseAction(incidentId, {
        type: action.type,
        description: action.description,
        status: 'pending',
      });
    }

    return true;
  }

  /**
   * Export incident report
   */
  exportIncidentReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.incidentHistory, null, 2);
    }

    // CSV format
    const headers = ['ID', 'Timestamp', 'Title', 'Severity', 'Status', 'Assigned To', 'Actions'];
    const rows = this.incidentHistory.map((i) => [
      i.id,
      i.timestamp,
      i.title,
      i.severity,
      i.status,
      i.assignedTo || 'Unassigned',
      i.actions.length,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
