import { ChartController } from './ChartController';

/**
 * Sankey Chart Controller
 * نمودار Sankey برای نمایش جریان داده بین گره‌ها
 */
export class SankeyController extends ChartController {
  id = 'sankey';
  type = 'sankey';

  /**
   * Parse sankey data
   * داده‌های Sankey را پردازش می‌کند
   * Format: { nodes: [...], links: [...] }
   */
  parse(data: any) {
    const { nodes = [], links = [] } = data;

    // Calculate node positions
    const nodePositions = this.calculateNodePositions(nodes, links);

    // Calculate link paths
    const linkPaths = links.map((link: any) => ({
      source: link.source,
      target: link.target,
      value: link.value,
      path: this.calculateLinkPath(
        nodePositions[link.source],
        nodePositions[link.target],
        link.value
      ),
    }));

    return { nodes: nodePositions, links: linkPaths };
  }

  /**
   * Calculate node positions using force-directed layout
   */
  private calculateNodePositions(nodes: any[], links: any[]) {
    const width = this.chart.width;
    const height = this.chart.height;
    const padding = 40;

    // Simple layout: arrange nodes in columns
    const columns = this.getNodeColumns(nodes, links);
    const positions: any = {};

    columns.forEach((column, colIndex) => {
      const x = padding + (colIndex * (width - 2 * padding)) / (columns.length - 1);
      const columnHeight = height - 2 * padding;

      column.forEach((nodeId: string, nodeIndex: number) => {
        const y = padding + (nodeIndex * columnHeight) / (column.length - 1);
        positions[nodeId] = { x, y, id: nodeId };
      });
    });

    return positions;
  }

  /**
   * Get node columns for layout
   */
  private getNodeColumns(nodes: any[], links: any[]): string[][] {
    const columns: string[][] = [[], []];
    const visited = new Set<string>();

    // First pass: identify source and target nodes
    const sources = new Set<string>();
    const targets = new Set<string>();

    links.forEach((link: any) => {
      sources.add(link.source);
      targets.add(link.target);
    });

    // Assign nodes to columns
    nodes.forEach((node: any) => {
      if (sources.has(node.id) && !targets.has(node.id)) {
        columns[0].push(node.id);
      } else {
        columns[1].push(node.id);
      }
    });

    return columns;
  }

  /**
   * Calculate link path (Bezier curve)
   */
  private calculateLinkPath(source: any, target: any, value: number) {
    const controlX1 = source.x + (target.x - source.x) * 0.25;
    const controlX2 = source.x + (target.x - source.x) * 0.75;

    return {
      x1: source.x,
      y1: source.y,
      x2: target.x,
      y2: target.y,
      cx1: controlX1,
      cy1: source.y,
      cx2: controlX2,
      cy2: target.y,
    };
  }

  /**
   * Update sankey chart
   */
  update(mode: string) {
    const dataset = this.chart.data.datasets[0];
    const meta = this.getMeta();

    // Render nodes
    const parsed = this.parse(dataset.data);
    meta.data = parsed.nodes;

    super.update(mode);
  }

  /**
   * Draw sankey chart
   */
  draw() {
    const ctx = this.chart.ctx;
    const dataset = this.chart.data.datasets[0];
    const parsed = this.parse(dataset.data);

    // Draw links
    parsed.links.forEach((link: any) => {
      ctx.strokeStyle = dataset.borderColor || '#999';
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = Math.max(link.value / 10, 1);

      ctx.beginPath();
      ctx.moveTo(link.path.x1, link.path.y1);
      ctx.bezierCurveTo(
        link.path.cx1,
        link.path.cy1,
        link.path.cx2,
        link.path.cy2,
        link.path.x2,
        link.path.y2
      );
      ctx.stroke();
    });

    ctx.globalAlpha = 1;

    // Draw nodes
    parsed.nodes.forEach((node: any) => {
      ctx.fillStyle = dataset.backgroundColor || '#0ff';
      ctx.fillRect(node.x - 10, node.y - 10, 20, 20);
    });
  }
}
