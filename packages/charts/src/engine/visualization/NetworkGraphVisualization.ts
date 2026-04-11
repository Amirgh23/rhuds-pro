/**
 * Network Graph Visualization Engine
 * Renders network and relationship data with force-directed layout and clustering
 */

export interface NetworkNode<T = Record<string, unknown>> {
  id: string;
  label: string;
  value?: number;
  color?: string;
  size?: number;
  metadata?: T;
}

export interface NetworkEdge {
  source: string;
  target: string;
  weight?: number;
  label?: string;
  color?: string;
}

export interface NetworkData<T = Record<string, unknown>> {
  nodes: NetworkNode<T>[];
  edges: NetworkEdge[];
}

export interface ForceDirectedConfig {
  iterations: number;
  repulsion: number;
  attraction: number;
  damping: number;
  minDistance: number;
}

export interface NodePosition {
  id: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
}

export interface ClusterInfo {
  id: string;
  nodes: string[];
  centroid: [number, number];
  color: string;
}

/**
 * NetworkGraphVisualization - Advanced network graph rendering
 */
export class NetworkGraphVisualization<T = Record<string, unknown>> {
  private nodes: Map<string, NetworkNode<T>> = new Map();
  private edges: Map<string, NetworkEdge> = new Map();
  private positions: Map<string, NodePosition> = new Map();
  private clusters: Map<string, ClusterInfo> = new Map();
  private forceConfig: ForceDirectedConfig;

  constructor(forceConfig?: Partial<ForceDirectedConfig>) {
    this.forceConfig = {
      iterations: 100,
      repulsion: 100,
      attraction: 0.1,
      damping: 0.9,
      minDistance: 10,
      ...forceConfig,
    };
  }

  /**
   * Load network data
   */
  loadData(data: NetworkData<T>): void {
    this.nodes.clear();
    this.edges.clear();
    this.positions.clear();

    // Load nodes
    for (const node of data.nodes) {
      this.nodes.set(node.id, node);
      this.positions.set(node.id, {
        id: node.id,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: 0,
        vy: 0,
      });
    }

    // Load edges
    for (const edge of data.edges) {
      const key = `${edge.source}-${edge.target}`;
      this.edges.set(key, edge);
    }
  }

  /**
   * Apply force-directed layout
   */
  applyForceDirectedLayout(): Map<string, NodePosition> {
    for (let iter = 0; iter < this.forceConfig.iterations; iter++) {
      // Reset forces
      for (const pos of this.positions.values()) {
        pos.vx = 0;
        pos.vy = 0;
      }

      // Apply repulsion forces
      const posArray = Array.from(this.positions.values());
      for (let i = 0; i < posArray.length; i++) {
        for (let j = i + 1; j < posArray.length; j++) {
          const p1 = posArray[i];
          const p2 = posArray[j];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          const force = this.forceConfig.repulsion / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          p1.vx! -= fx;
          p1.vy! -= fy;
          p2.vx! += fx;
          p2.vy! += fy;
        }
      }

      // Apply attraction forces
      for (const edge of this.edges.values()) {
        const p1 = this.positions.get(edge.source);
        const p2 = this.positions.get(edge.target);

        if (!p1 || !p2) continue;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = dist * this.forceConfig.attraction;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        p1.vx! += fx;
        p1.vy! += fy;
        p2.vx! -= fx;
        p2.vy! -= fy;
      }

      // Update positions
      for (const pos of this.positions.values()) {
        pos.vx! *= this.forceConfig.damping;
        pos.vy! *= this.forceConfig.damping;
        pos.x += pos.vx!;
        pos.y += pos.vy!;
      }
    }

    return this.positions;
  }

  /**
   * Detect clusters using connected components
   */
  detectClusters(): Map<string, ClusterInfo> {
    this.clusters.clear();
    const visited = new Set<string>();
    let clusterCount = 0;

    for (const nodeId of this.nodes.keys()) {
      if (visited.has(nodeId)) continue;

      const cluster: string[] = [];
      const queue = [nodeId];

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current)) continue;

        visited.add(current);
        cluster.push(current);

        // Find connected nodes
        for (const edge of this.edges.values()) {
          if (edge.source === current && !visited.has(edge.target)) {
            queue.push(edge.target);
          } else if (edge.target === current && !visited.has(edge.source)) {
            queue.push(edge.source);
          }
        }
      }

      // Calculate centroid
      let cx = 0,
        cy = 0;
      for (const id of cluster) {
        const pos = this.positions.get(id);
        if (pos) {
          cx += pos.x;
          cy += pos.y;
        }
      }
      cx /= cluster.length;
      cy /= cluster.length;

      const clusterInfo: ClusterInfo = {
        id: `cluster-${clusterCount}`,
        nodes: cluster,
        centroid: [cx, cy],
        color: this.generateClusterColor(clusterCount),
      };

      this.clusters.set(clusterInfo.id, clusterInfo);
      clusterCount++;
    }

    return this.clusters;
  }

  /**
   * Generate cluster color
   */
  private generateClusterColor(index: number): string {
    const hue = (index * 137.5) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  }

  /**
   * Get node by ID
   */
  getNode(id: string): NetworkNode<T> | undefined {
    return this.nodes.get(id);
  }

  /**
   * Get edge between nodes
   */
  getEdge(source: string, target: string): NetworkEdge | undefined {
    return this.edges.get(`${source}-${target}`) || this.edges.get(`${target}-${source}`);
  }

  /**
   * Get node position
   */
  getNodePosition(id: string): NodePosition | undefined {
    return this.positions.get(id);
  }

  /**
   * Get all positions
   */
  getAllPositions(): Map<string, NodePosition> {
    return new Map(this.positions);
  }

  /**
   * Get neighbors of a node
   */
  getNeighbors(nodeId: string): string[] {
    const neighbors: string[] = [];

    for (const edge of this.edges.values()) {
      if (edge.source === nodeId) {
        neighbors.push(edge.target);
      } else if (edge.target === nodeId) {
        neighbors.push(edge.source);
      }
    }

    return neighbors;
  }

  /**
   * Get node degree
   */
  getNodeDegree(nodeId: string): number {
    return this.getNeighbors(nodeId).length;
  }

  /**
   * Calculate shortest path between nodes
   */
  shortestPath(source: string, target: string): string[] {
    const queue = [[source]];
    const visited = new Set<string>([source]);

    while (queue.length > 0) {
      const path = queue.shift()!;
      const current = path[path.length - 1];

      if (current === target) {
        return path;
      }

      for (const neighbor of this.getNeighbors(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    return [];
  }

  /**
   * Get network statistics
   */
  getStatistics(): Record<string, number | string> {
    const degrees = Array.from(this.nodes.keys()).map((id) => this.getNodeDegree(id));

    return {
      nodeCount: this.nodes.size,
      edgeCount: this.edges.size,
      clusterCount: this.clusters.size,
      avgDegree: degrees.length > 0 ? degrees.reduce((a, b) => a + b) / degrees.length : 0,
      maxDegree: Math.max(...degrees, 0),
      minDegree: Math.min(...degrees, 0),
      density:
        this.nodes.size > 1 ? (2 * this.edges.size) / (this.nodes.size * (this.nodes.size - 1)) : 0,
    };
  }

  /**
   * Export network data
   */
  exportData(): NetworkData<T> {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values()),
    };
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.nodes.clear();
    this.edges.clear();
    this.positions.clear();
    this.clusters.clear();
  }
}
