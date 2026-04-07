import { ChartController } from './ChartController';

/**
 * Network Chart Controller
 * نمودار شبکه برای نمایش ارتباطات بین گره‌ها
 */
export class NetworkController extends ChartController {
  id = 'network';
  type = 'network';

  /**
   * Parse network data
   * داده‌های Network را پردازش می‌کند
   * Format: { nodes: [...], edges: [...] }
   */
  parse(data: any) {
    const { nodes = [], edges = [] } = data;
    const width = this.chart.width;
    const height = this.chart.height;
    const padding = 40;

    // Calculate node positions using force-directed layout
    const positions = this.forceDirectedLayout(
      nodes,
      edges,
      width - 2 * padding,
      height - 2 * padding
    );

    return {
      nodes: nodes.map((node: any, index: number) => ({
        ...node,
        x: padding + positions[index].x,
        y: padding + positions[index].y,
        radius: node.size || 10,
      })),
      edges: edges.map((edge: any) => ({
        ...edge,
        source: positions[edge.source],
        target: positions[edge.target],
      })),
    };
  }

  /**
   * Force-directed layout algorithm
   */
  private forceDirectedLayout(nodes: any[], edges: any[], width: number, height: number) {
    const positions = nodes.map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
    }));

    const iterations = 50;
    const k = Math.sqrt((width * height) / nodes.length);
    const c = 0.1;
    const maxDisplace = Math.sqrt(width * width + height * height) / 10;

    for (let iter = 0; iter < iterations; iter++) {
      // Reset forces
      positions.forEach((pos) => {
        pos.vx = 0;
        pos.vy = 0;
      });

      // Repulsive forces
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = positions[j].x - positions[i].x;
          const dy = positions[j].y - positions[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;

          const force = (k * k) / distance;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;

          positions[i].vx -= fx;
          positions[i].vy -= fy;
          positions[j].vx += fx;
          positions[j].vy += fy;
        }
      }

      // Attractive forces
      edges.forEach((edge: any) => {
        const i = edge.source;
        const j = edge.target;
        const dx = positions[j].x - positions[i].x;
        const dy = positions[j].y - positions[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;

        const force = (distance * distance) / k;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        positions[i].vx += fx;
        positions[i].vy += fy;
        positions[j].vx -= fx;
        positions[j].vy -= fy;
      });

      // Update positions
      positions.forEach((pos) => {
        const distance = Math.sqrt(pos.vx * pos.vx + pos.vy * pos.vy);
        if (distance > 0) {
          const displacement = Math.min(distance, maxDisplace);
          pos.x += (pos.vx / distance) * displacement * c;
          pos.y += (pos.vy / distance) * displacement * c;

          // Keep within bounds
          pos.x = Math.max(0, Math.min(width, pos.x));
          pos.y = Math.max(0, Math.min(height, pos.y));
        }
      });
    }

    return positions;
  }

  /**
   * Update network chart
   */
  update(mode: string) {
    const dataset = this.chart.data.datasets[0];
    const meta = this.getMeta();

    const network = this.parse(dataset.data);
    meta.data = network;

    super.update(mode);
  }

  /**
   * Draw network chart
   */
  draw() {
    const ctx = this.chart.ctx;
    const dataset = this.chart.data.datasets[0];
    const network = this.parse(this.chart.data.datasets[0].data);

    // Draw edges
    network.edges.forEach((edge: any) => {
      const sourceNode = network.nodes[edge.source];
      const targetNode = network.nodes[edge.target];

      ctx.strokeStyle = dataset.borderColor || '#666';
      ctx.lineWidth = edge.weight || 1;
      ctx.globalAlpha = 0.5;

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      ctx.stroke();
    });

    ctx.globalAlpha = 1;

    // Draw nodes
    network.nodes.forEach((node: any) => {
      ctx.fillStyle = dataset.backgroundColor || '#0ff';
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = dataset.borderColor || '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      if (node.label) {
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
      }
    });
  }
}
