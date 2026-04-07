/**
 * Notification System
 * Email, Slack, and webhook notifications
 */

export interface Notification {
  id: string;
  userId: string;
  type: 'email' | 'slack' | 'webhook';
  subject: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: Date;
  sentAt?: Date;
  error?: string;
}

export interface NotificationPreference {
  userId: string;
  emailEnabled: boolean;
  slackEnabled: boolean;
  webhookEnabled: boolean;
  webhookUrl?: string;
  slackChannel?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

/**
 * Notification Manager
 */
export class NotificationManager {
  private notifications: Map<string, Notification> = new Map();
  private preferences: Map<string, NotificationPreference> = new Map();
  private templates: Map<string, NotificationTemplate> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Send notification
   */
  public async sendNotification(
    userId: string,
    type: 'email' | 'slack' | 'webhook',
    subject: string,
    message: string
  ): Promise<Notification> {
    const id = this.generateId();

    const notification: Notification = {
      id,
      userId,
      type,
      subject,
      message,
      status: 'pending',
      createdAt: new Date(),
    };

    this.notifications.set(id, notification);
    this.emit('notification:created', { notificationId: id, userId, type });

    // Simulate sending
    setTimeout(() => {
      notification.status = 'sent';
      notification.sentAt = new Date();
      this.emit('notification:sent', { notificationId: id });
    }, 500);

    return notification;
  }

  /**
   * Send email notification
   */
  public async sendEmail(userId: string, subject: string, message: string): Promise<Notification> {
    return this.sendNotification(userId, 'email', subject, message);
  }

  /**
   * Send Slack notification
   */
  public async sendSlack(userId: string, subject: string, message: string): Promise<Notification> {
    return this.sendNotification(userId, 'slack', subject, message);
  }

  /**
   * Send webhook notification
   */
  public async sendWebhook(
    userId: string,
    subject: string,
    message: string
  ): Promise<Notification> {
    return this.sendNotification(userId, 'webhook', subject, message);
  }

  /**
   * Get notification
   */
  public getNotification(notificationId: string): Notification | undefined {
    return this.notifications.get(notificationId);
  }

  /**
   * List notifications for user
   */
  public listNotifications(userId: string, type?: string): Notification[] {
    let notifications = Array.from(this.notifications.values()).filter((n) => n.userId === userId);

    if (type) {
      notifications = notifications.filter((n) => n.type === type);
    }

    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Set notification preference
   */
  public setPreference(
    userId: string,
    preference: Partial<NotificationPreference>
  ): NotificationPreference {
    let prefs = this.preferences.get(userId);

    if (!prefs) {
      prefs = {
        userId,
        emailEnabled: true,
        slackEnabled: false,
        webhookEnabled: false,
      };
    }

    if (preference.emailEnabled !== undefined) prefs.emailEnabled = preference.emailEnabled;
    if (preference.slackEnabled !== undefined) prefs.slackEnabled = preference.slackEnabled;
    if (preference.webhookEnabled !== undefined) prefs.webhookEnabled = preference.webhookEnabled;
    if (preference.webhookUrl !== undefined) prefs.webhookUrl = preference.webhookUrl;
    if (preference.slackChannel !== undefined) prefs.slackChannel = preference.slackChannel;

    this.preferences.set(userId, prefs);
    this.emit('preference:updated', { userId });

    return prefs;
  }

  /**
   * Get preference
   */
  public getPreference(userId: string): NotificationPreference | undefined {
    return this.preferences.get(userId);
  }

  /**
   * Create template
   */
  public createTemplate(
    name: string,
    subject: string,
    body: string,
    variables: string[]
  ): NotificationTemplate {
    const id = this.generateId();

    const template: NotificationTemplate = {
      id,
      name,
      subject,
      body,
      variables,
    };

    this.templates.set(id, template);
    this.emit('template:created', { templateId: id, name });

    return template;
  }

  /**
   * Get template
   */
  public getTemplate(templateId: string): NotificationTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * List templates
   */
  public listTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Send from template
   */
  public async sendFromTemplate(
    userId: string,
    type: 'email' | 'slack' | 'webhook',
    templateId: string,
    variables: Record<string, string>
  ): Promise<Notification> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    let subject = template.subject;
    let body = template.body;

    // Replace variables
    template.variables.forEach((variable) => {
      const value = variables[variable] || '';
      subject = subject.replace(`{{${variable}}}`, value);
      body = body.replace(`{{${variable}}}`, value);
    });

    return this.sendNotification(userId, type, subject, body);
  }

  /**
   * Get notification statistics
   */
  public getStatistics(): {
    totalNotifications: number;
    sentNotifications: number;
    failedNotifications: number;
    byType: Record<string, number>;
  } {
    const notifications = Array.from(this.notifications.values());
    const sent = notifications.filter((n) => n.status === 'sent').length;
    const failed = notifications.filter((n) => n.status === 'failed').length;

    const byType: Record<string, number> = { email: 0, slack: 0, webhook: 0 };
    notifications.forEach((n) => {
      byType[n.type]++;
    });

    return {
      totalNotifications: notifications.length,
      sentNotifications: sent,
      failedNotifications: failed,
      byType,
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    this.notifications.clear();
    this.preferences.clear();
    this.templates.clear();
    this.listeners.clear();
  }
}

export default NotificationManager;
