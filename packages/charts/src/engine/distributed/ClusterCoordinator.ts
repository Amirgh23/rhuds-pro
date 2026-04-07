/**
 * Cluster Coordinator
 * هماهنگ کننده خوشه برای مدیریت چند گره
 *
 * Features:
 * - Node discovery and registration
 * - Health monitoring
 * - Leader election
 * - Consensus algorithms
 */

import { EventEmitter } from 'events';

export interface NodeInfo {
  id: string;
  address: string;
  port: number;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastHeartbeat: number;
  metadata: Record<string, any>;
}

export interface ClusterState {
  nodes: Map<string, NodeInfo>;
  leader: string | null;
  term: number;
  committed: number;
}

export interface ConsensusConfig {
  algorithm: 'raft' | 'paxos';
  heartbeatInterval: number;
  electionTimeout: number;
  quorumSize: number;
}

export interface HealthCheckConfig {
  interval: number;
  timeout: number;
  maxFailures: number;
}

export class ClusterCoordinator extends EventEmitter {
  private state: ClusterState;
  private consensusConfig: ConsensusConfig;
  private healthCheckConfig: HealthCheckConfig;
  private nodeId: string;
  private isLeader: boolean;
  private electionTimer: NodeJS.Timeout | null;
  private heartbeatTimer: NodeJS.Timeout | null;
  private healthCheckTimer: NodeJS.Timeout | null;
  private logs: Array<{ term: number; index: number; data: any }>;

  constructor(
    nodeId: string,
    consensusConfig: ConsensusConfig,
    healthCheckConfig: HealthCheckConfig
  ) {
    super();
    this.nodeId = nodeId;
    this.consensusConfig = consensusConfig;
    this.healthCheckConfig = healthCheckConfig;
    this.isLeader = false;
    this.electionTimer = null;
    this.heartbeatTimer = null;
    this.healthCheckTimer = null;
    this.logs = [];

    this.state = {
      nodes: new Map(),
      leader: null,
      term: 0,
      committed: 0,
    };

    this.initialize();
  }

  private initialize(): void {
    this.startHealthCheck();
    this.startElection();
    this.emit('initialized', { nodeId: this.nodeId });
  }

  /**
   * Register node in cluster
   */
  public registerNode(nodeInfo: NodeInfo): void {
    this.state.nodes.set(nodeInfo.id, {
      ...nodeInfo,
      status: 'healthy',
      lastHeartbeat: Date.now(),
    });

    this.emit('node-registered', nodeInfo);
  }

  /**
   * Deregister node from cluster
   */
  public deregisterNode(nodeId: string): void {
    this.state.nodes.delete(nodeId);
    this.emit('node-deregistered', { nodeId });

    // Trigger new election if leader is removed
    if (this.state.leader === nodeId) {
      this.startElection();
    }
  }

  /**
   * Start leader election
   */
  private startElection(): void {
    if (this.electionTimer) {
      clearTimeout(this.electionTimer);
    }

    const timeout =
      this.consensusConfig.electionTimeout + Math.random() * this.consensusConfig.electionTimeout;

    this.electionTimer = setTimeout(() => {
      this.conductElection();
    }, timeout);
  }

  /**
   * Conduct leader election
   */
  private conductElection(): void {
    this.state.term++;

    const votes = this.requestVotes();
    const quorumReached = votes >= this.consensusConfig.quorumSize;

    if (quorumReached) {
      this.becomeLeader();
    } else {
      this.startElection();
    }
  }

  /**
   * Request votes from other nodes
   */
  private requestVotes(): number {
    let votes = 1; // Vote for self

    for (const [nodeId, node] of this.state.nodes) {
      if (nodeId === this.nodeId) continue;

      if (node.status === 'healthy') {
        // Simulate vote request
        if (Math.random() > 0.1) {
          votes++;
        }
      }
    }

    return votes;
  }

  /**
   * Become leader
   */
  private becomeLeader(): void {
    this.isLeader = true;
    this.state.leader = this.nodeId;

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeats();
    }, this.consensusConfig.heartbeatInterval);

    this.emit('leader-elected', {
      leaderId: this.nodeId,
      term: this.state.term,
    });
  }

  /**
   * Send heartbeats to followers
   */
  private sendHeartbeats(): void {
    for (const [nodeId, node] of this.state.nodes) {
      if (nodeId === this.nodeId) continue;

      this.sendHeartbeat(node).catch((err) => {
        this.emit('heartbeat-failed', { nodeId, error: err.message });
      });
    }
  }

  /**
   * Send heartbeat to node
   */
  private async sendHeartbeat(node: NodeInfo): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Heartbeat timeout'));
      }, this.healthCheckConfig.timeout);

      // Simulate heartbeat
      setTimeout(() => {
        clearTimeout(timeout);
        resolve();
      }, Math.random() * 50);
    });
  }

  /**
   * Start health check
   */
  private startHealthCheck(): void {
    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.healthCheckConfig.interval);
  }

  /**
   * Perform health check on all nodes
   */
  private performHealthCheck(): void {
    for (const [nodeId, node] of this.state.nodes) {
      this.checkNodeHealth(node).catch((err) => {
        this.handleNodeFailure(nodeId, node);
      });
    }
  }

  /**
   * Check node health
   */
  private async checkNodeHealth(node: NodeInfo): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Health check timeout'));
      }, this.healthCheckConfig.timeout);

      // Simulate health check
      setTimeout(() => {
        clearTimeout(timeout);
        resolve();
      }, Math.random() * 100);
    });
  }

  /**
   * Handle node failure
   */
  private handleNodeFailure(nodeId: string, node: NodeInfo): void {
    const failureCount = (node as any).failureCount || 0;

    if (failureCount >= this.healthCheckConfig.maxFailures) {
      node.status = 'unhealthy';
      this.emit('node-unhealthy', { nodeId, node });

      if (this.isLeader && this.state.leader === nodeId) {
        this.startElection();
      }
    } else {
      node.status = 'degraded';
      (node as any).failureCount = failureCount + 1;
      this.emit('node-degraded', { nodeId, node });
    }
  }

  /**
   * Append log entry
   */
  public appendLog(data: any): number {
    const index = this.logs.length;
    this.logs.push({
      term: this.state.term,
      index,
      data,
    });

    if (this.isLeader) {
      this.replicateLog(index);
    }

    return index;
  }

  /**
   * Replicate log to followers
   */
  private replicateLog(index: number): void {
    const entry = this.logs[index];

    for (const [nodeId, node] of this.state.nodes) {
      if (nodeId === this.nodeId) continue;

      this.sendLogEntry(node, entry).catch((err) => {
        this.emit('log-replication-failed', { nodeId, error: err.message });
      });
    }
  }

  /**
   * Send log entry to node
   */
  private async sendLogEntry(node: NodeInfo, entry: any): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, Math.random() * 100);
    });
  }

  /**
   * Commit log entries
   */
  public commitLog(index: number): void {
    if (index > this.state.committed) {
      this.state.committed = index;
      this.emit('log-committed', { index });
    }
  }

  /**
   * Get cluster status
   */
  public getClusterStatus() {
    const healthyNodes = Array.from(this.state.nodes.values()).filter(
      (n) => n.status === 'healthy'
    ).length;

    return {
      nodeId: this.nodeId,
      isLeader: this.isLeader,
      leader: this.state.leader,
      term: this.state.term,
      totalNodes: this.state.nodes.size,
      healthyNodes,
      committed: this.state.committed,
      logSize: this.logs.length,
    };
  }

  /**
   * Get node info
   */
  public getNodeInfo(nodeId: string): NodeInfo | undefined {
    return this.state.nodes.get(nodeId);
  }

  /**
   * Get all nodes
   */
  public getAllNodes(): NodeInfo[] {
    return Array.from(this.state.nodes.values());
  }

  /**
   * Shutdown coordinator
   */
  public shutdown(): void {
    if (this.electionTimer) clearTimeout(this.electionTimer);
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.healthCheckTimer) clearInterval(this.healthCheckTimer);

    this.emit('shutdown', { nodeId: this.nodeId });
  }
}
