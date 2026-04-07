/**
 * Network Graph Visualization
 * Visualize network and relationship data
 *
 * تصور نمودار شبکه
 * تصور داده های شبکه و روابط
 */

import { EventEmitter } from 'events';

export interface Node {
  id: string;
  label: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  weight?: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface NetworkData {
  id: string;
  nodes: Node[];
  edges: Edge[];
  metadata?: Record<string, any>;
}

export interface LayoutConfig {
  algorithm: 'force-directed' | 'circular' | 'hierarchical';
  iterations: number;
  temperature: number;
  damping: number;
  repulsion: number;
  attraction: number;
}

export interface ClusterConfig {
  algorithm: 'kmeans' | 'louvain' | 'connected-components';
  k?: number;
  resolution?: number;
}

export class NetworkGraphVisualization extends EventEmitter {
  private networks: Map<string, NetworkData> = new Map();
  private layouts: Map<string, Map<string, { x: number; y: number }>> = new Map();
  private clusters: Map<string, Map<string, number>> = new Map();
  private layoutConfig: LayoutConfig;
  private clusterConfig: ClusterConfig;

  constructor() {
    super();
    this.layoutConfig = {
      algorithm: 'force-directed',
      iterations: 100,
      temperature: 1,
      damping: 0.9,
      repulsion: 100,
      attraction: 0.1,
    };

    this.clusterConfig = {
      algorithm: 'connected-components',
    };
  }

  /**
   * Load network data
   */
  loadNetwork(networkData: NetworkData): void {
    this.networks.set(networkData.id, networkData);
    this.computeLayout(networkData.id);
    this.detectClusters(networkData.id);
    this.emit('network:loaded', { id: networkData.id });
  }

  /**
   * Compute layout using force-directed algorithm
   */
  private computeLayout(networkId: string): void {
    const network = this.networks.get(networkId);
    if (!network) return;

    const layout = new Map<string, { x: number; y: number }>();
    const velocities = new Map<string, { vx: number; vy: number }>();

    // Initialize positions
    network.nodes.forEach((node, index) => {
      const angle = (index / network.nodes.length) * Math.PI * 2;
      const radius = 100;
      layout.set(node.id, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });
      velocities.set(node.id, { vx: 0, vy: 0 });
    });

    // Force-directed simulation
    for (let iter = 0; iter < this.layoutConfig.iterations; iter++) {
      const forces = new Map<string, { fx: number; fy: number }>();

      // Initialize forces
      network.nodes.forEach((node) => {
        forces.set(node.id, { fx: 0, fy: 0 });
      });

      // Repulsive forces
      for (let i = 0; i < network.nodes.length; i++) {
        for (let j = i + 1; j < network.nodes.length; j++) {
          const node1 = network.nodes[i];
          const node2 = network.nodes[j];
          const pos1 = layout.get(node1.id)!;
          const pos2 = layout.get(node2.id)!;

          const dx = pos2.x - pos1.x;
          const dy = pos2.y - pos1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          const force = this.layoutConfig.repulsion / (dist * dist);
          const fx = (force * dx) / dist;
          const fy = (force * dy) / dist;

          const f1 = forces.get(node1.id)!;
          const f2 = forces.get(node2.id)!;

          f1.fx -= fx;
          f1.fy -= fy;
          f2.fx += fx;
          f2.fy += fy;
        }
      }

      // Attractive forces
      network.edges.forEach((edge) => {
        const pos1 = layout.get(edge.source)!;
        const pos2 = layout.get(edge.target)!;

        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = this.layoutConfig.attraction * dist;
        const fx = (force * dx) / dist;
        const fy = (force * dy) / dist;

        const f1 = forces.get(edge.source)!;
        const f2 = forces.get(edge.target)!;

        f1.fx += fx;
        f1.fy += fy;
        f2.fx -= fx;
        f2.fy -= fy;
      });

      // Update positions
      network.nodes.forEach((node) => {
        const force = forces.get(node.id)!;
        const vel = velocities.get(node.id)!;
        const pos = layout.get(node.id)!;

        vel.vx = (vel.vx + force.fx) * this.layoutConfig.damping;
        vel.vy = (vel.vy + force.fy) * this.layoutConfig.damping;

        pos.x += vel.vx;
        pos.y += vel.vy;
      });

      this.layoutConfig.temperature *= 0.95;
    }

    this.layouts.set(networkId, layout);
    this.emit('layout:computed', { id: networkId });
  }

  /**
   * Detect clusters in network
   */
  private detectClusters(networkId: string): void {
    const network = this.networks.get(networkId);
    if (!network) return;

    const clusters = new Map<string, number>();
    const visited = new Set<string>();
    let clusterId = 0;

    // Connected components algorithm
    network.nodes.forEach((node) => {
      if (!visited.has(node.id)) {
        this.dfs(node.id, clusterId, network, clusters, visited);
        clusterId++;
      }
    });

    this.clusters.set(networkId, clusters);
    this.emit('clusters:detected', { id: networkId, count: clusterId });
  }

  /**
   * DFS for cluster detection
   */
  private dfs(
    nodeId: string,
    clusterId: number,
    network: NetworkData,
    clusters: Map<string, number>,
    visited: Set<string>
  ): void {
    visited.add(nodeId);
    clusters.set(nodeId, clusterId);

    const neighbors = network.edges
      .filter((e) => e.source === nodeId || e.target === nodeId)
      .map((e) => (e.source === nodeId ? e.target : e.source));

    neighbors.forEach((neighborId) => {
      if (!visited.has(neighborId)) {
        this.dfs(neighborId, clusterId, network, clusters, visited);
      }
    });
  }

  /**
   * Get layout
   */
  getLayout(networkId: string): Map<string, { x: number; y: number }> | null {
    return this.layouts.get(networkId) || null;
  }

  /**
   * Get clusters
   */
  getClusters(networkId: string): Map<string, number> | null {
    return this.clusters.get(networkId) || null;
  }

  /**
   * Get network
   */
  getNetwork(networkId: string): NetworkData | null {
    return this.networks.get(networkId) || null;
  }

  /**
   * Set layout config
   */
  setLayoutConfig(config: Partial<LayoutConfig>): void {
    this.layoutConfig = { ...this.layoutConfig, ...config };
    this.emit('layout-config:updated', this.layoutConfig);
  }

  /**
   * Set cluster config
   */
  setClusterConfig(config: Partial<ClusterConfig>): void {
    this.clusterConfig = { ...this.clusterConfig, ...config };
    this.emit('cluster-config:updated', this.clusterConfig);
  }

  /**
   * Find shortest path
   */
  findShortestPath(networkId: string, source: string, target: string): string[] {
    const network = this.networks.get(networkId);
    if (!network) return [];

    const queue: string[] = [source];
    const visited = new Set<string>([source]);
    const parent = new Map<string, string>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === target) break;

      const neighbors = network.edges
        .filter((e) => e.source === current || e.target === current)
        .map((e) => (e.source === current ? e.target : e.source));

      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parent.set(neighbor, current);
          queue.push(neighbor);
        }
      });
    }

    const path: string[] = [];
    let current = target;
    while (current !== source && parent.has(current)) {
      path.unshift(current);
      current = parent.get(current)!;
    }
    path.unshift(source);

    return path;
  }

  /**
   * Remove network
   */
  removeNetwork(networkId: string): void {
    this.networks.delete(networkId);
    this.layouts.delete(networkId);
    this.clusters.delete(networkId);
    this.emit('network:removed', { id: networkId });
  }
}
