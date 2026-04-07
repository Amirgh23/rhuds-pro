/**
 * Analytics Engine
 * موتور تحلیل برای ردیابی رویدادها و رفتار کاربر
 *
 * Features:
 * - User analytics
 * - Event tracking
 * - Funnel analysis
 * - Cohort analysis
 */

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  eventType: string;
  userId: string;
  sessionId: string;
  properties: Record<string, any>;
  value?: number;
}

export interface UserSession {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  events: AnalyticsEvent[];
  properties: Record<string, any>;
}

export interface FunnelStep {
  name: string;
  eventType: string;
  userCount: number;
  conversionRate: number;
}

export interface Cohort {
  id: string;
  name: string;
  createdAt: number;
  userIds: Set<string>;
  properties: Record<string, any>;
}

export class AnalyticsEngine {
  private events: AnalyticsEvent[];
  private sessions: Map<string, UserSession>;
  private users: Map<string, { firstSeen: number; lastSeen: number; eventCount: number }>;
  private cohorts: Map<string, Cohort>;
  private stats: {
    eventsTracked: number;
    sessionsCreated: number;
    usersTracked: number;
    cohortsCreated: number;
  };

  constructor() {
    this.events = [];
    this.sessions = new Map();
    this.users = new Map();
    this.cohorts = new Map();
    this.stats = {
      eventsTracked: 0,
      sessionsCreated: 0,
      usersTracked: 0,
      cohortsCreated: 0,
    };
  }

  /**
   * Track event
   */
  public trackEvent(
    eventType: string,
    userId: string,
    sessionId: string,
    properties: Record<string, any> = {},
    value?: number
  ): string {
    const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const event: AnalyticsEvent = {
      id: eventId,
      timestamp: Date.now(),
      eventType,
      userId,
      sessionId,
      properties,
      value,
    };

    this.events.push(event);
    this.stats.eventsTracked++;

    // Update session
    const session = this.sessions.get(sessionId);
    if (session) {
      session.events.push(event);
    }

    // Update user
    if (!this.users.has(userId)) {
      this.users.set(userId, { firstSeen: Date.now(), lastSeen: Date.now(), eventCount: 0 });
      this.stats.usersTracked++;
    }

    const user = this.users.get(userId)!;
    user.lastSeen = Date.now();
    user.eventCount++;

    return eventId;
  }

  /**
   * Start session
   */
  public startSession(userId: string, properties: Record<string, any> = {}): string {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const session: UserSession = {
      id: sessionId,
      userId,
      startTime: Date.now(),
      events: [],
      properties,
    };

    this.sessions.set(sessionId, session);
    this.stats.sessionsCreated++;

    return sessionId;
  }

  /**
   * End session
   */
  public endSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.endTime = Date.now();
    session.duration = session.endTime - session.startTime;
  }

  /**
   * Analyze funnel
   */
  public analyzeFunnel(eventTypes: string[]): FunnelStep[] {
    const steps: FunnelStep[] = [];
    let previousUserCount = 0;

    for (let i = 0; i < eventTypes.length; i++) {
      const eventType = eventTypes[i];
      const usersWithEvent = new Set<string>();

      for (const event of this.events) {
        if (event.eventType === eventType) {
          usersWithEvent.add(event.userId);
        }
      }

      const userCount = usersWithEvent.size;
      const conversionRate = previousUserCount > 0 ? (userCount / previousUserCount) * 100 : 100;

      steps.push({
        name: `Step ${i + 1}: ${eventType}`,
        eventType,
        userCount,
        conversionRate,
      });

      previousUserCount = userCount;
    }

    return steps;
  }

  /**
   * Create cohort
   */
  public createCohort(name: string, filter: (user: any) => boolean): string {
    const cohortId = `cohort-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const userIds = new Set<string>();

    for (const [userId, user] of this.users) {
      if (filter(user)) {
        userIds.add(userId);
      }
    }

    const cohort: Cohort = {
      id: cohortId,
      name,
      createdAt: Date.now(),
      userIds,
      properties: {},
    };

    this.cohorts.set(cohortId, cohort);
    this.stats.cohortsCreated++;

    return cohortId;
  }

  /**
   * Get cohort
   */
  public getCohort(cohortId: string): Cohort | undefined {
    return this.cohorts.get(cohortId);
  }

  /**
   * Get user analytics
   */
  public getUserAnalytics(userId: string) {
    const user = this.users.get(userId);
    if (!user) return null;

    const userEvents = this.events.filter((e) => e.userId === userId);
    const eventTypes = [...new Set(userEvents.map((e) => e.eventType))];

    return {
      userId,
      firstSeen: new Date(user.firstSeen),
      lastSeen: new Date(user.lastSeen),
      eventCount: user.eventCount,
      eventTypes,
      totalValue: userEvents.reduce((sum, e) => sum + (e.value || 0), 0),
    };
  }

  /**
   * Get session analytics
   */
  public getSessionAnalytics(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    return {
      sessionId,
      userId: session.userId,
      duration: session.duration || 0,
      eventCount: session.events.length,
      eventTypes: [...new Set(session.events.map((e) => e.eventType))],
    };
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      ...this.stats,
      totalEvents: this.events.length,
      totalSessions: this.sessions.size,
      totalUsers: this.users.size,
      totalCohorts: this.cohorts.size,
    };
  }
}
