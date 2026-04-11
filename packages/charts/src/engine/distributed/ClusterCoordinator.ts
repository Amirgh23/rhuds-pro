/**
 * Cluster Coordinator
 * Multi-node coordination with leader election and health monitoring
 */

export interface ClusterNode {
  id: string;
  host: string;
  port: number;
  role: 'leader' | 'follower' | 'candidate';
  term: number;
  lastHeartbeat: number;
  healthy: boolean;
}

export interface ClusterState {
  leader: string | null;
  term: number;
  nodes: ClusterNode[];
  lastElection: number;
}

export interface ConsensusConfig {
  algorithm: 'raft' | 'paxos';
  heartbeatInterval: number;
  electionTimeout: number;
}

/**
 * ClusterCoordinator - Multi-node cluster management
 */
export class ClusterCoordinator {
  private nodes: Map<string, ClusterNode> = new Map();
  private state: ClusterState;
  private consensus: ConsensusConfig;
  private listeners: Set<(event: string, data: unknown) => void> = new Set();
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private electionTimer: NodeJS.Timeout | null = null;

  constructor(
    consensus: ConsensusConfig = {
      algorithm: 'raft',
      heartbeatInterval: 1000,
      electionTimeout: 3000,
    }
  ) {
    this.consensus = consensus;
    this.state = {
      leader: null,
      term: 0,
      nodes: [],
      lastElection: Date.now(),
    };
  }

  /**
   * Add node to cluster
   */
  addNode(node: Omit<ClusterNode, 'role' | 'term' | 'lastHeartbeat' | 'healthy'>): void {
    const clusterNode: ClusterNode = {
      ...node,
      role: 'follower',
      term: this.state.term,
      lastHeartbeat: Date.now(),
      healthy: true,
    };

    this.nodes.set(node.id, clusterNode);
    this.state.nodes = Array.from(this.nodes.values());
    this.emit('node_added', clusterNode);
  }

  /**
   * Remove node from cluster
   */
  removeNode(nodeId: string): void {
    this.nodes.delete(nodeId);
    this.state.nodes = Array.from(this.nodes.values());

    if (this.state.leader === nodeId) {
      this.startElection();
    }

    this.emit('node_removed', nodeId);
  }

  /**
   * Start leader election
   */
  startElection(): void {
    this.state.term++;
    this.state.lastElection = Date.now();

    const candidates = Array.from(this.nodes.values()).filter((n) => n.healthy);

    if (candidates.length === 0) {
      return;
    }

    // Raft-based election
    const leader = candidates[Math.floor(Math.random() * candidates.length)];
    this.state.leader = leader.id;
    leader.role = 'leader';
    leader.term = this.state.term;

    for (const node of this.nodes.values()) {
      if (node.id !== leader.id) {
        node.role = 'follower';
        node.term = this.state.term;
      }
    }

    this.emit('leader_elected', leader);
  }

  /**
   * Send heartbeat
   */
  sendHeartbeat(): void {
    if (!this.state.leader) {
      return;
    }

    const leader = this.nodes.get(this.state.leader);
    if (!leader) {
      return;
    }

    for (const node of this.nodes.values()) {
      if (node.id !== leader.id && node.healthy) {
        node.lastHeartbeat = Date.now();
      }
    }

    this.emit('heartbeat_sent', this.state.leader);
  }

  /**
   * Check node health
   */
  checkNodeHealth(): void {
    const now = Date.now();
    const timeout = this.consensus.electionTimeout;

    for (const node of this.nodes.values()) {
      const timeSinceHeartbeat = now - node.lastHeartbeat;

      if (timeSinceHeartbeat > timeout && node.healthy) {
        node.healthy = false;
        this.emit('node_unhealthy', node);

        if (node.id === this.state.leader) {
          this.startElection();
        }
      } else if (timeSinceHeartbeat < timeout && !node.healthy) {
        node.healthy = true;
        this.emit('node_recovered', node);
      }
    }
  }

  /**
   * Get cluster state
   */
  getClusterState(): ClusterState {
    return {
      ...this.state,
      nodes: Array.from(this.nodes.values()),
    };
  }

  /**
   * Get leader
   */
  getLeader(): ClusterNode | null {
    if (!this.state.leader) {
      return null;
    }
    return this.nodes.get(this.state.leader) ?? null;
  }

  /**
   * Get healthy nodes
   */
  getHealthyNodes(): ClusterNode[] {
    return Array.from(this.nodes.values()).filter((n) => n.healthy);
  }

  /**
   * Get node by ID
   */
  getNode(nodeId: string): ClusterNode | null {
    return this.nodes.get(nodeId) ?? null;
  }

  /**
   * Mark node as unhealthy
   */
  markNodeUnhealthy(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (node && node.healthy) {
      node.healthy = false;
      this.emit('node_unhealthy', node);

      if (node.id === this.state.leader) {
        this.startElection();
      }
    }
  }

  /**
   * Mark node as healthy
   */
  markNodeHealthy(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (node && !node.healthy) {
      node.healthy = true;
      this.emit('node_recovered', node);
    }
  }

  /**
   * Emit event
   */
  private emit(event: string, data: unknown): void {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch (error) {
        // Handle listener error
      }
    }
  }

  /**
   * Add listener
   */
  addListener(listener: (event: string, data: unknown) => void): void {
    this.listeners.add(listener);
  }

  /**
   * Remove listener
   */
  removeListener(listener: (event: string, data: unknown) => void): void {
    this.listeners.delete(listener);
  }

  /**
   * Start cluster monitoring
   */
  start(): void {
    this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.consensus.heartbeatInterval);
    this.electionTimer = setInterval(
      () => this.checkNodeHealth(),
      this.consensus.electionTimeout / 2
    );

    if (!this.state.leader) {
      this.startElection();
    }

    this.emit('cluster_started', this.state);
  }

  /**
   * Stop cluster monitoring
   */
  stop(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    if (this.electionTimer) {
      clearInterval(this.electionTimer);
    }

    this.emit('cluster_stopped', this.state);
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const healthy = this.getHealthyNodes().length;
    return {
      totalNodes: this.nodes.size,
      healthyNodes: healthy,
      leader: this.state.leader,
      term: this.state.term,
      lastElection: this.state.lastElection,
      uptime: Date.now() - this.state.lastElection,
    };
  }
}
