/**
 * Incident Management Workflow
 * Manages complete incident lifecycle with workflows
 */

/**
 * Incident workflow
 */
export interface IncidentWorkflow {
  id: string;
  incidentId: string;
  status: 'created' | 'assigned' | 'investigating' | 'contained' | 'resolved' | 'closed';
  severity: 'critical' | 'high' | 'medium' | 'low';
  createdAt: number;
  updatedAt: number;
  assignedTo?: string;
  timeline: Array<{
    timestamp: number;
    action: string;
    actor: string;
    details: Record<string, unknown>;
  }>;
  findings: string[];
  rootCause?: string;
  resolution?: string;
  lessons?: string[];
}

/**
 * Incident Management Workflow
 * Manages complete incident lifecycle with workflows
 */
export class IncidentManagementWorkflow {
  private workflows: Map<string, IncidentWorkflow> = new Map();
  private workflowHistory: IncidentWorkflow[] = [];
  private statusTransitions: Map<string, (workflow: IncidentWorkflow) => Promise<boolean>> =
    new Map();

  /**
   * Create incident workflow
   */
  createWorkflow(
    incidentId: string,
    severity: 'critical' | 'high' | 'medium' | 'low'
  ): IncidentWorkflow {
    const id = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const workflow: IncidentWorkflow = {
      id,
      incidentId,
      status: 'created',
      severity,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      timeline: [
        {
          timestamp: Date.now(),
          action: 'created',
          actor: 'system',
          details: { severity },
        },
      ],
      findings: [],
    };

    this.workflows.set(id, workflow);
    this.workflowHistory.push(workflow);

    return workflow;
  }

  /**
   * Register status transition handler
   */
  registerStatusTransition(
    fromStatus: string,
    handler: (workflow: IncidentWorkflow) => Promise<boolean>
  ): void {
    this.statusTransitions.set(fromStatus, handler);
  }

  /**
   * Transition workflow status
   */
  async transitionStatus(
    workflowId: string,
    newStatus: string,
    actor: string,
    details: Record<string, unknown> = {}
  ): Promise<boolean> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return false;

    const handler = this.statusTransitions.get(workflow.status);
    if (handler) {
      const canTransition = await handler(workflow);
      if (!canTransition) return false;
    }

    workflow.status = newStatus as IncidentWorkflow['status'];
    workflow.updatedAt = Date.now();
    workflow.timeline.push({
      timestamp: Date.now(),
      action: `status_changed_to_${newStatus}`,
      actor,
      details,
    });

    return true;
  }

  /**
   * Assign incident
   */
  assignIncident(workflowId: string, assignedTo: string, actor: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return false;

    workflow.assignedTo = assignedTo;
    workflow.timeline.push({
      timestamp: Date.now(),
      action: 'assigned',
      actor,
      details: { assignedTo },
    });

    return true;
  }

  /**
   * Add finding
   */
  addFinding(workflowId: string, finding: string, actor: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return false;

    workflow.findings.push(finding);
    workflow.timeline.push({
      timestamp: Date.now(),
      action: 'finding_added',
      actor,
      details: { finding },
    });

    return true;
  }

  /**
   * Set root cause
   */
  setRootCause(workflowId: string, rootCause: string, actor: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return false;

    workflow.rootCause = rootCause;
    workflow.timeline.push({
      timestamp: Date.now(),
      action: 'root_cause_identified',
      actor,
      details: { rootCause },
    });

    return true;
  }

  /**
   * Set resolution
   */
  setResolution(workflowId: string, resolution: string, actor: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return false;

    workflow.resolution = resolution;
    workflow.timeline.push({
      timestamp: Date.now(),
      action: 'resolution_applied',
      actor,
      details: { resolution },
    });

    return true;
  }

  /**
   * Add lesson learned
   */
  addLessonLearned(workflowId: string, lesson: string, actor: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return false;

    if (!workflow.lessons) {
      workflow.lessons = [];
    }

    workflow.lessons.push(lesson);
    workflow.timeline.push({
      timestamp: Date.now(),
      action: 'lesson_added',
      actor,
      details: { lesson },
    });

    return true;
  }

  /**
   * Get workflow
   */
  getWorkflow(workflowId: string): IncidentWorkflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get workflows by incident
   */
  getWorkflowsByIncident(incidentId: string): IncidentWorkflow[] {
    return this.workflowHistory
      .filter((w) => w.incidentId === incidentId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Get workflows by status
   */
  getWorkflowsByStatus(status: string): IncidentWorkflow[] {
    return this.workflowHistory
      .filter((w) => w.status === status)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 100);
  }

  /**
   * Get workflows by severity
   */
  getWorkflowsBySeverity(severity: string): IncidentWorkflow[] {
    return this.workflowHistory
      .filter((w) => w.severity === severity)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 100);
  }

  /**
   * Get workflows by assignee
   */
  getWorkflowsByAssignee(assignedTo: string): IncidentWorkflow[] {
    return this.workflowHistory
      .filter((w) => w.assignedTo === assignedTo)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 100);
  }

  /**
   * Get incident management statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalIncidents = this.workflowHistory.length;
    const resolvedIncidents = this.workflowHistory.filter(
      (w) => w.status === 'resolved' || w.status === 'closed'
    ).length;

    const statusDistribution: Record<string, number> = {
      created: 0,
      assigned: 0,
      investigating: 0,
      contained: 0,
      resolved: 0,
      closed: 0,
    };

    for (const workflow of this.workflowHistory) {
      statusDistribution[workflow.status]++;
    }

    const severityDistribution: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const workflow of this.workflowHistory) {
      severityDistribution[workflow.severity]++;
    }

    // Calculate average resolution time
    let totalResolutionTime = 0;
    let resolutionCount = 0;

    for (const workflow of this.workflowHistory) {
      if (workflow.status === 'resolved' || workflow.status === 'closed') {
        totalResolutionTime += workflow.updatedAt - workflow.createdAt;
        resolutionCount++;
      }
    }

    const avgResolutionTime = resolutionCount > 0 ? totalResolutionTime / resolutionCount : 0;

    const assigneeStats: Record<string, number> = {};
    for (const workflow of this.workflowHistory) {
      if (workflow.assignedTo) {
        assigneeStats[workflow.assignedTo] = (assigneeStats[workflow.assignedTo] || 0) + 1;
      }
    }

    return {
      totalIncidents,
      resolvedIncidents,
      resolutionRate: totalIncidents > 0 ? (resolvedIncidents / totalIncidents) * 100 : 0,
      avgResolutionTime,
      statusDistribution,
      severityDistribution,
      assigneeStats,
    };
  }

  /**
   * Get incident timeline
   */
  getIncidentTimeline(workflowId: string): IncidentWorkflow['timeline'] {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return [];

    return workflow.timeline.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Export incident report
   */
  exportIncidentReport(workflowId: string, format: 'json' | 'csv' = 'json'): string {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return '';

    if (format === 'json') {
      return JSON.stringify(workflow, null, 2);
    }

    // CSV format
    const headers = ['Timestamp', 'Action', 'Actor', 'Details'];
    const rows = workflow.timeline.map((t) => [
      t.timestamp,
      t.action,
      t.actor,
      JSON.stringify(t.details),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }

  /**
   * Close workflow
   */
  closeWorkflow(workflowId: string, actor: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return false;

    workflow.status = 'closed';
    workflow.updatedAt = Date.now();
    workflow.timeline.push({
      timestamp: Date.now(),
      action: 'closed',
      actor,
      details: {},
    });

    return true;
  }
}
