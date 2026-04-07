/**
 * Scheduled Tasks System
 * Task scheduling, cron support, and execution
 */

export interface ScheduledTask {
  id: string;
  name: string;
  description?: string;
  schedule: string; // Cron expression
  handler: string; // Handler name
  isActive: boolean;
  lastRun?: Date;
  nextRun: Date;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface TaskExecution {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

/**
 * Task Scheduler
 */
export class TaskScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private executions: Map<string, TaskExecution[]> = new Map();
  private handlers: Map<string, Function> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Register task handler
   */
  public registerHandler(name: string, handler: Function): void {
    this.handlers.set(name, handler);
    this.emit('handler:registered', { name });
  }

  /**
   * Create scheduled task
   */
  public createTask(
    name: string,
    schedule: string,
    handler: string,
    description?: string,
    metadata?: Record<string, any>
  ): ScheduledTask {
    const id = this.generateId();
    const now = new Date();

    const task: ScheduledTask = {
      id,
      name,
      description,
      schedule,
      handler,
      isActive: true,
      nextRun: this.calculateNextRun(schedule),
      createdAt: now,
      metadata,
    };

    this.tasks.set(id, task);
    this.executions.set(id, []);
    this.emit('task:created', { taskId: id, name });

    return task;
  }

  /**
   * Get task
   */
  public getTask(taskId: string): ScheduledTask | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * List tasks
   */
  public listTasks(filter?: { isActive?: boolean }): ScheduledTask[] {
    let tasks = Array.from(this.tasks.values());

    if (filter?.isActive !== undefined) {
      tasks = tasks.filter((t) => t.isActive === filter.isActive);
    }

    return tasks;
  }

  /**
   * Update task
   */
  public updateTask(
    taskId: string,
    updates: { schedule?: string; isActive?: boolean; metadata?: Record<string, any> }
  ): ScheduledTask | undefined {
    const task = this.tasks.get(taskId);
    if (!task) {
      return undefined;
    }

    if (updates.schedule) {
      task.schedule = updates.schedule;
      task.nextRun = this.calculateNextRun(updates.schedule);
    }

    if (updates.isActive !== undefined) task.isActive = updates.isActive;
    if (updates.metadata) task.metadata = updates.metadata;

    this.emit('task:updated', { taskId, updates });

    return task;
  }

  /**
   * Delete task
   */
  public deleteTask(taskId: string): boolean {
    const deleted = this.tasks.delete(taskId);
    if (deleted) {
      this.executions.delete(taskId);
      this.emit('task:deleted', { taskId });
    }
    return deleted;
  }

  /**
   * Execute task
   */
  public async executeTask(taskId: string): Promise<TaskExecution> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const executionId = this.generateId();
    const execution: TaskExecution = {
      id: executionId,
      taskId,
      startTime: new Date(),
      status: 'running',
    };

    const executions = this.executions.get(taskId) || [];
    executions.push(execution);
    this.executions.set(taskId, executions);

    this.emit('task:execution_started', { taskId, executionId });

    try {
      const handler = this.handlers.get(task.handler);
      if (!handler) {
        throw new Error(`Handler not found: ${task.handler}`);
      }

      const result = await handler(task.metadata);

      execution.status = 'completed';
      execution.result = result;
      execution.endTime = new Date();

      task.lastRun = new Date();
      task.nextRun = this.calculateNextRun(task.schedule);

      this.emit('task:execution_completed', { taskId, executionId, result });
    } catch (error) {
      execution.status = 'failed';
      execution.error = String(error);
      execution.endTime = new Date();

      this.emit('task:execution_failed', { taskId, executionId, error });
    }

    return execution;
  }

  /**
   * Get task executions
   */
  public getTaskExecutions(taskId: string, limit: number = 100): TaskExecution[] {
    const executions = this.executions.get(taskId) || [];
    return executions.slice(-limit);
  }

  /**
   * Get pending tasks
   */
  public getPendingTasks(): ScheduledTask[] {
    const now = new Date();
    return Array.from(this.tasks.values()).filter((t) => t.isActive && t.nextRun <= now);
  }

  /**
   * Calculate next run time
   */
  private calculateNextRun(cronExpression: string): Date {
    // Simplified cron parsing - in production use a library like cron-parser
    const now = new Date();

    // For demo purposes, calculate next run based on simple patterns
    if (cronExpression === '0 0 * * *') {
      // Daily at midnight
      const next = new Date(now);
      next.setDate(next.getDate() + 1);
      next.setHours(0, 0, 0, 0);
      return next;
    }

    if (cronExpression === '0 * * * *') {
      // Every hour
      const next = new Date(now);
      next.setHours(next.getHours() + 1);
      next.setMinutes(0, 0, 0);
      return next;
    }

    // Default: 1 hour from now
    return new Date(now.getTime() + 60 * 60 * 1000);
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    totalTasks: number;
    activeTasks: number;
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
  } {
    const tasks = Array.from(this.tasks.values());
    const activeTasks = tasks.filter((t) => t.isActive).length;

    let totalExecutions = 0;
    let successfulExecutions = 0;
    let failedExecutions = 0;

    this.executions.forEach((execs) => {
      totalExecutions += execs.length;
      successfulExecutions += execs.filter((e) => e.status === 'completed').length;
      failedExecutions += execs.filter((e) => e.status === 'failed').length;
    });

    return {
      totalTasks: tasks.length,
      activeTasks,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    this.tasks.clear();
    this.executions.clear();
    this.handlers.clear();
    this.listeners.clear();
  }
}

export default TaskScheduler;
