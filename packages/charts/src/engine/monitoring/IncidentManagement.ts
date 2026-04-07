/**
 * Incident Management
 * مدیریت حوادث برای تشخیص و پاسخ به مشکلات
 *
 * Features:
 * - Incident detection
 * - Incident response
 * - Incident tracking
 * - Post-mortem analysis
 */

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  createdAt: number;
  resolvedAt?: number;
  duration?: number;
  affectedServices: string[];
  rootCause?: string;
  resolution?: string;
  timeline: IncidentEvent[];
}

export interface IncidentEvent {
  timestamp: number;
  type: 'created' | 'updated' | 'escalated' | 'resolved' | 'closed';
  message: string;
  author?: string;
}

export interface PostMortem {
  id: string;
  incidentId: string;
  createdAt: number;
  summary: string;
  rootCause: string;
  timeline: string;
  actionItems: ActionItem[];
  lessons: string[];
}

export interface ActionItem {
  id: string;
  description: string;
  owner?: string;
  dueDate?: number;
  completed: boolean;
}

export class IncidentManagement {
  private incidents: Map<string, Incident>;
  private postMortems: Map<string, PostMortem>;
  private stats: {
    incidentsCreated: number;
    incidentsResolved: number;
    averageResolutionTime: number;
    postMortemsCreated: number;
  };

  constructor() {
    this.incidents = new Map();
    this.postMortems = new Map();
    this.stats = {
      incidentsCreated: 0,
      incidentsResolved: 0,
      averageResolutionTime: 0,
      postMortemsCreated: 0,
    };
  }

  /**
   * Create incident
   */
  public createIncident(
    title: string,
    description: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    affectedServices: string[]
  ): string {
    const incidentId = `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const incident: Incident = {
      id: incidentId,
      title,
      description,
      severity,
      status: 'open',
      createdAt: Date.now(),
      affectedServices,
      timeline: [
        {
          timestamp: Date.now(),
          type: 'created',
          message: `Incident created: ${title}`,
        },
      ],
    };

    this.incidents.set(incidentId, incident);
    this.stats.incidentsCreated++;

    return incidentId;
  }

  /**
   * Update incident status
   */
  public updateIncidentStatus(
    incidentId: string,
    status: 'open' | 'investigating' | 'resolved' | 'closed'
  ): boolean {
    const incident = this.incidents.get(incidentId);
    if (!incident) return false;

    incident.status = status;
    incident.timeline.push({
      timestamp: Date.now(),
      type: status === 'resolved' ? 'resolved' : 'updated',
      message: `Status changed to ${status}`,
    });

    if (status === 'resolved') {
      incident.resolvedAt = Date.now();
      incident.duration = incident.resolvedAt - incident.createdAt;
      this.stats.incidentsResolved++;

      // Update average resolution time
      const totalResolved = this.stats.incidentsResolved;
      this.stats.averageResolutionTime =
        (this.stats.averageResolutionTime * (totalResolved - 1) + incident.duration) /
        totalResolved;
    }

    return true;
  }

  /**
   * Add incident event
   */
  public addIncidentEvent(
    incidentId: string,
    type: IncidentEvent['type'],
    message: string,
    author?: string
  ): boolean {
    const incident = this.incidents.get(incidentId);
    if (!incident) return false;

    incident.timeline.push({
      timestamp: Date.now(),
      type,
      message,
      author,
    });

    return true;
  }

  /**
   * Set root cause
   */
  public setRootCause(incidentId: string, rootCause: string): boolean {
    const incident = this.incidents.get(incidentId);
    if (!incident) return false;

    incident.rootCause = rootCause;
    return true;
  }

  /**
   * Set resolution
   */
  public setResolution(incidentId: string, resolution: string): boolean {
    const incident = this.incidents.get(incidentId);
    if (!incident) return false;

    incident.resolution = resolution;
    return true;
  }

  /**
   * Create post-mortem
   */
  public createPostMortem(
    incidentId: string,
    summary: string,
    rootCause: string,
    timeline: string,
    lessons: string[]
  ): string {
    const postMortemId = `postmortem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const postMortem: PostMortem = {
      id: postMortemId,
      incidentId,
      createdAt: Date.now(),
      summary,
      rootCause,
      timeline,
      actionItems: [],
      lessons,
    };

    this.postMortems.set(postMortemId, postMortem);
    this.stats.postMortemsCreated++;

    return postMortemId;
  }

  /**
   * Add action item
   */
  public addActionItem(
    postMortemId: string,
    description: string,
    owner?: string,
    dueDate?: number
  ): string {
    const postMortem = this.postMortems.get(postMortemId);
    if (!postMortem) return '';

    const actionItemId = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const actionItem: ActionItem = {
      id: actionItemId,
      description,
      owner,
      dueDate,
      completed: false,
    };

    postMortem.actionItems.push(actionItem);
    return actionItemId;
  }

  /**
   * Complete action item
   */
  public completeActionItem(postMortemId: string, actionItemId: string): boolean {
    const postMortem = this.postMortems.get(postMortemId);
    if (!postMortem) return false;

    const actionItem = postMortem.actionItems.find((a) => a.id === actionItemId);
    if (!actionItem) return false;

    actionItem.completed = true;
    return true;
  }

  /**
   * Get incident
   */
  public getIncident(incidentId: string): Incident | undefined {
    return this.incidents.get(incidentId);
  }

  /**
   * Get post-mortem
   */
  public getPostMortem(postMortemId: string): PostMortem | undefined {
    return this.postMortems.get(postMortemId);
  }

  /**
   * Get incidents by severity
   */
  public getIncidentsBySeverity(severity: string): Incident[] {
    return Array.from(this.incidents.values()).filter((i) => i.severity === severity);
  }

  /**
   * Get open incidents
   */
  public getOpenIncidents(): Incident[] {
    return Array.from(this.incidents.values()).filter((i) => i.status !== 'closed');
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      ...this.stats,
      totalIncidents: this.incidents.size,
      openIncidents: Array.from(this.incidents.values()).filter((i) => i.status !== 'closed')
        .length,
      totalPostMortems: this.postMortems.size,
    };
  }
}
