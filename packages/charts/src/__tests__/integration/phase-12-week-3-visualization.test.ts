/**
 * Phase 12 Week 3 - Advanced Visualization Integration Tests
 * Tests for 3D Terrain, Network Graph, Heatmap, Timeline, and Custom Chart Builder
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  Terrain3DVisualization,
  NetworkGraphVisualization,
  HeatmapEngine,
  TimelineVisualization,
  CustomChartBuilder,
  type TerrainData,
  type NetworkData,
  type HeatmapPoint,
  type TimelineEvent,
  type ChartType,
} from '../../engine/visualization';

describe('Phase 12 Week 3 - Advanced Visualization', () => {
  describe('Terrain3DVisualization', () => {
    let terrain: Terrain3DVisualization;

    beforeEach(() => {
      terrain = new Terrain3DVisualization({
        width: 100,
        height: 100,
        scale: 1,
        heightScale: 10,
      });
    });

    it('should generate mesh from elevation data', () => {
      const data: TerrainData = {
        elevations: [
          [0, 1, 2],
          [1, 2, 3],
          [2, 3, 4],
        ],
      };

      const mesh = terrain.generateMesh(data);

      expect(mesh.vertices).toBeDefined();
      expect(mesh.indices).toBeDefined();
      expect(mesh.normals).toBeDefined();
      expect(mesh.vertices.length).toBeGreaterThan(0);
      expect(mesh.indices.length).toBeGreaterThan(0);
      expect(mesh.normals.length).toBe(mesh.vertices.length);
    });

    it('should apply height mapping', () => {
      const data: TerrainData = {
        elevations: [[0, 0.5, 1]],
        colorMap: {
          0: '#0000ff',
          0.5: '#00ff00',
          1: '#ff0000',
        },
      };

      const colorMap = terrain.applyHeightMapping(data);

      expect(colorMap).toBeDefined();
      expect(colorMap[0]).toBe('#0000ff');
      expect(colorMap[0.5]).toBe('#00ff00');
      expect(colorMap[1]).toBe('#ff0000');
    });

    it('should configure lighting', () => {
      terrain.setLighting({
        ambientIntensity: 0.7,
        directionalIntensity: 0.9,
      });

      const lighting = terrain.getLighting();

      expect(lighting.ambientIntensity).toBe(0.7);
      expect(lighting.directionalIntensity).toBe(0.9);
    });

    it('should manage camera position', () => {
      terrain.setCameraPosition([10, 20, 30]);
      const camera = terrain.getCamera();

      expect(camera.position).toEqual([10, 20, 30]);
    });

    it('should rotate camera', () => {
      const initialCamera = terrain.getCamera();
      const initialRotation0 = initialCamera.rotation[0];
      const initialRotation1 = initialCamera.rotation[1];

      terrain.rotateCamera(0.1, 0.2);
      const rotatedCamera = terrain.getCamera();

      expect(rotatedCamera.rotation[0]).toBe(initialRotation0 + 0.1);
      expect(rotatedCamera.rotation[1]).toBe(initialRotation1 + 0.2);
    });

    it('should zoom camera', () => {
      const initialZoom = terrain.getCamera().zoom;
      terrain.zoomCamera(2);
      const zoomedCamera = terrain.getCamera();

      expect(zoomedCamera.zoom).toBe(initialZoom * 2);
    });

    it('should get mesh statistics', () => {
      const data: TerrainData = {
        elevations: [
          [0, 1],
          [1, 2],
        ],
      };

      terrain.generateMesh(data);
      const stats = terrain.getStatistics();

      expect(stats.vertices).toBeGreaterThan(0);
      expect(stats.indices).toBeGreaterThan(0);
      expect(stats.triangles).toBeGreaterThan(0);
    });

    it('should load and cache textures', async () => {
      // Mock fetch for testing
      global.fetch = async () =>
        ({
          blob: async () => new Blob(['test']),
        }) as Response;

      const texture = await terrain.loadTexture('test.png');
      expect(texture).toBeDefined();

      terrain.clearTextureCache();
    });
  });

  describe('NetworkGraphVisualization', () => {
    let network: NetworkGraphVisualization;

    beforeEach(() => {
      network = new NetworkGraphVisualization({
        iterations: 50,
        repulsion: 100,
        attraction: 0.1,
      });
    });

    it('should load network data', () => {
      const data: NetworkData = {
        nodes: [
          { id: 'a', label: 'Node A' },
          { id: 'b', label: 'Node B' },
          { id: 'c', label: 'Node C' },
        ],
        edges: [
          { source: 'a', target: 'b' },
          { source: 'b', target: 'c' },
        ],
      };

      network.loadData(data);

      expect(network.getNode('a')).toBeDefined();
      expect(network.getNode('b')).toBeDefined();
      expect(network.getNode('c')).toBeDefined();
    });

    it('should apply force-directed layout', () => {
      const data: NetworkData = {
        nodes: [
          { id: 'a', label: 'Node A' },
          { id: 'b', label: 'Node B' },
        ],
        edges: [{ source: 'a', target: 'b' }],
      };

      network.loadData(data);
      const positions = network.applyForceDirectedLayout();

      expect(positions.size).toBe(2);
      expect(positions.get('a')).toBeDefined();
      expect(positions.get('b')).toBeDefined();
    });

    it('should detect clusters', () => {
      const data: NetworkData = {
        nodes: [
          { id: 'a', label: 'Node A' },
          { id: 'b', label: 'Node B' },
          { id: 'c', label: 'Node C' },
          { id: 'd', label: 'Node D' },
        ],
        edges: [
          { source: 'a', target: 'b' },
          { source: 'c', target: 'd' },
        ],
      };

      network.loadData(data);
      network.applyForceDirectedLayout();
      const clusters = network.detectClusters();

      expect(clusters.size).toBeGreaterThan(0);
    });

    it('should get node neighbors', () => {
      const data: NetworkData = {
        nodes: [
          { id: 'a', label: 'Node A' },
          { id: 'b', label: 'Node B' },
          { id: 'c', label: 'Node C' },
        ],
        edges: [
          { source: 'a', target: 'b' },
          { source: 'a', target: 'c' },
        ],
      };

      network.loadData(data);
      const neighbors = network.getNeighbors('a');

      expect(neighbors).toContain('b');
      expect(neighbors).toContain('c');
      expect(neighbors.length).toBe(2);
    });

    it('should calculate node degree', () => {
      const data: NetworkData = {
        nodes: [
          { id: 'a', label: 'Node A' },
          { id: 'b', label: 'Node B' },
          { id: 'c', label: 'Node C' },
        ],
        edges: [
          { source: 'a', target: 'b' },
          { source: 'a', target: 'c' },
        ],
      };

      network.loadData(data);
      const degree = network.getNodeDegree('a');

      expect(degree).toBe(2);
    });

    it('should find shortest path', () => {
      const data: NetworkData = {
        nodes: [
          { id: 'a', label: 'Node A' },
          { id: 'b', label: 'Node B' },
          { id: 'c', label: 'Node C' },
        ],
        edges: [
          { source: 'a', target: 'b' },
          { source: 'b', target: 'c' },
        ],
      };

      network.loadData(data);
      const path = network.shortestPath('a', 'c');

      expect(path).toContain('a');
      expect(path).toContain('c');
      expect(path.length).toBe(3);
    });

    it('should get network statistics', () => {
      const data: NetworkData = {
        nodes: [
          { id: 'a', label: 'Node A' },
          { id: 'b', label: 'Node B' },
          { id: 'c', label: 'Node C' },
        ],
        edges: [
          { source: 'a', target: 'b' },
          { source: 'b', target: 'c' },
        ],
      };

      network.loadData(data);
      const stats = network.getStatistics();

      expect(stats.nodeCount).toBe(3);
      expect(stats.edgeCount).toBe(2);
      expect(stats.avgDegree).toBeGreaterThan(0);
    });
  });

  describe('HeatmapEngine', () => {
    let heatmap: HeatmapEngine;

    beforeEach(() => {
      heatmap = new HeatmapEngine({
        width: 100,
        height: 100,
        cellSize: 10,
        colorScheme: 'viridis',
      });
    });

    it('should add points', () => {
      const points: HeatmapPoint[] = [
        { x: 10, y: 10, value: 1 },
        { x: 20, y: 20, value: 2 },
        { x: 30, y: 30, value: 3 },
      ];

      heatmap.addPoints(points);
      const stats = heatmap.getStatistics();

      expect(stats.pointCount).toBe(3);
    });

    it('should generate heatmap', () => {
      const points: HeatmapPoint[] = [
        { x: 10, y: 10, value: 1 },
        { x: 20, y: 20, value: 2 },
      ];

      heatmap.addPoints(points);
      const data = heatmap.generateHeatmap();

      expect(data.cells).toBeDefined();
      expect(data.min).toBeDefined();
      expect(data.max).toBeDefined();
      expect(data.mean).toBeDefined();
    });

    it('should apply color scheme', () => {
      heatmap.setColorScheme('plasma');
      const colorMap = heatmap.getColorMap();

      expect(Object.keys(colorMap).length).toBeGreaterThan(0);
    });

    it('should get heatmap statistics', () => {
      const points: HeatmapPoint[] = [
        { x: 10, y: 10, value: 1 },
        { x: 20, y: 20, value: 5 },
        { x: 30, y: 30, value: 10 },
      ];

      heatmap.addPoints(points);
      const stats = heatmap.getStatistics();

      expect(stats.cellCount).toBeGreaterThan(0);
      expect(stats.min).toBeLessThanOrEqual(stats.max);
      expect(stats.mean).toBeGreaterThan(0);
    });

    it('should clear points', () => {
      const points: HeatmapPoint[] = [{ x: 10, y: 10, value: 1 }];

      heatmap.addPoints(points);
      heatmap.clearPoints();
      const stats = heatmap.getStatistics();

      expect(stats.pointCount).toBe(0);
    });
  });

  describe('TimelineVisualization', () => {
    let timeline: TimelineVisualization;

    beforeEach(() => {
      timeline = new TimelineVisualization({
        startTime: 0,
        endTime: 10000,
        height: 100,
      });
    });

    it('should add events', () => {
      const event: TimelineEvent = {
        id: 'event1',
        timestamp: 5000,
        label: 'Event 1',
      };

      timeline.addEvent(event);
      const retrieved = timeline.getEvent('event1');

      expect(retrieved).toBeDefined();
      expect(retrieved?.label).toBe('Event 1');
    });

    it('should get events in range', () => {
      const events: TimelineEvent[] = [
        { id: 'e1', timestamp: 2000, label: 'Event 1' },
        { id: 'e2', timestamp: 5000, label: 'Event 2' },
        { id: 'e3', timestamp: 8000, label: 'Event 3' },
      ];

      timeline.addEvents(events);
      const inRange = timeline.getEventsInRange(3000, 7000);

      expect(inRange.length).toBe(1);
      expect(inRange[0].id).toBe('e2');
    });

    it('should zoom in and out', () => {
      const initialRange = timeline.getCurrentRange();
      timeline.zoomIn(2);
      const zoomedRange = timeline.getCurrentRange();

      expect(zoomedRange.duration).toBeLessThan(initialRange.duration);

      timeline.zoomOut(2);
      const unzoomedRange = timeline.getCurrentRange();

      expect(unzoomedRange.duration).toBeCloseTo(initialRange.duration, 0);
    });

    it('should pan timeline', () => {
      timeline.zoomIn(2); // Zoom in first to allow panning
      const initialRange = timeline.getCurrentRange();
      const delta = 500;
      timeline.pan(delta);
      const panedRange = timeline.getCurrentRange();

      expect(panedRange.start).toBe(initialRange.start + delta);
      expect(panedRange.end).toBe(initialRange.end + delta);
    });

    it('should cluster events', () => {
      const events: TimelineEvent[] = [
        { id: 'e1', timestamp: 1000, label: 'Event 1' },
        { id: 'e2', timestamp: 1100, label: 'Event 2' },
        { id: 'e3', timestamp: 5000, label: 'Event 3' },
      ];

      timeline.addEvents(events);
      const clusters = timeline.clusterEvents(1000);

      expect(clusters.length).toBeGreaterThan(0);
    });

    it('should add annotations', () => {
      const event: TimelineEvent = {
        id: 'event1',
        timestamp: 5000,
        label: 'Event 1',
      };

      timeline.addEvent(event);
      timeline.addAnnotation({
        id: 'ann1',
        eventId: 'event1',
        text: 'Important event',
        position: 'top',
      });

      const annotations = timeline.getAnnotationsForEvent('event1');

      expect(annotations.length).toBe(1);
      expect(annotations[0].text).toBe('Important event');
    });

    it('should convert timestamp to pixel', () => {
      const pixel = timeline.timestampToPixel(5000, 100);

      expect(pixel).toBeGreaterThan(0);
      expect(pixel).toBeLessThan(100);
    });

    it('should get timeline statistics', () => {
      const events: TimelineEvent[] = [
        { id: 'e1', timestamp: 1000, label: 'Event 1' },
        { id: 'e2', timestamp: 5000, label: 'Event 2' },
      ];

      timeline.addEvents(events);
      const stats = timeline.getStatistics();

      expect(stats.eventCount).toBe(2);
      expect(stats.timeSpan).toBeGreaterThan(0);
    });
  });

  describe('CustomChartBuilder', () => {
    let builder: CustomChartBuilder;

    beforeEach(() => {
      builder = new CustomChartBuilder();
    });

    it('should get default templates', () => {
      const templates = builder.getAllTemplates();

      expect(templates.length).toBeGreaterThan(0);
      expect(templates.some((t) => t.type === 'line')).toBe(true);
      expect(templates.some((t) => t.type === 'bar')).toBe(true);
    });

    it('should create chart from template', () => {
      const data = [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
      ];

      const chart = builder.createFromTemplate('chart1', 'line-basic', data, {
        xAxis: 'x',
        yAxis: 'y',
      });

      expect(chart.id).toBe('chart1');
      expect(chart.type).toBe('line');
      expect(chart.data.length).toBe(2);
    });

    it('should create custom chart', () => {
      const data = [
        { category: 'A', value: 10 },
        { category: 'B', value: 20 },
      ];

      const chart = builder.createChart('chart1', 'bar', data, {
        xAxis: 'category',
        yAxis: 'value',
      });

      expect(chart.id).toBe('chart1');
      expect(chart.type).toBe('bar');
    });

    it('should update chart data', () => {
      const initialData = [{ x: 1, y: 10 }];
      const chart = builder.createChart('chart1', 'line', initialData, {
        xAxis: 'x',
        yAxis: 'y',
      });

      const newData = [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
      ];

      builder.updateChartData('chart1', newData);
      const updated = builder.getChart('chart1');

      expect(updated?.data.length).toBe(2);
    });

    it('should update data mapping', () => {
      const data = [{ x: 1, y: 10 }];
      builder.createChart('chart1', 'line', data, { xAxis: 'x' });

      builder.updateDataMapping('chart1', { yAxis: 'y' });
      const updated = builder.getChart('chart1');

      expect(updated?.mapping.yAxis).toBe('y');
    });

    it('should update chart style', () => {
      const data = [{ x: 1, y: 10 }];
      builder.createChart('chart1', 'line', data, { xAxis: 'x' });

      builder.updateChartStyle('chart1', { fontSize: 14 });
      const updated = builder.getChart('chart1');

      expect(updated?.style.fontSize).toBe(14);
    });

    it('should validate chart', () => {
      const data = [{ x: 1, y: 10 }];
      builder.createChart('chart1', 'line', data, { xAxis: 'x', yAxis: 'y' });

      const validation = builder.validateChart('chart1');

      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('should clone chart', () => {
      const data = [{ x: 1, y: 10 }];
      builder.createChart('chart1', 'line', data, { xAxis: 'x', yAxis: 'y' });

      const cloned = builder.cloneChart('chart1', 'chart2');

      expect(cloned).toBeDefined();
      expect(cloned?.id).toBe('chart2');
      expect(cloned?.type).toBe('line');
    });

    it('should export chart as JSON', () => {
      const data = [{ x: 1, y: 10 }];
      builder.createChart('chart1', 'line', data, { xAxis: 'x', yAxis: 'y' });

      const exported = builder.exportChart('chart1', 'json');

      expect(exported).toBeDefined();
      expect(exported?.format).toBe('json');
    });

    it('should export chart as CSV', () => {
      const data = [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
      ];

      builder.createChart('chart1', 'line', data, { xAxis: 'x', yAxis: 'y' });
      const exported = builder.exportChart('chart1', 'csv');

      expect(exported).toBeDefined();
      expect(exported?.format).toBe('csv');
      expect(typeof exported?.data).toBe('string');
    });

    it('should get chart statistics', () => {
      const data = [{ x: 1, y: 10 }];
      builder.createChart('chart1', 'line', data, { xAxis: 'x' });
      builder.createChart('chart2', 'bar', data, { xAxis: 'x' });

      const stats = builder.getStatistics();

      expect(stats.totalCharts).toBe(2);
      expect(stats.lineCharts).toBe(1);
      expect(stats.barCharts).toBe(1);
    });

    it('should delete chart', () => {
      const data = [{ x: 1, y: 10 }];
      builder.createChart('chart1', 'line', data, { xAxis: 'x' });

      const deleted = builder.deleteChart('chart1');
      const retrieved = builder.getChart('chart1');

      expect(deleted).toBe(true);
      expect(retrieved).toBeUndefined();
    });
  });

  describe('Integration Tests', () => {
    it('should work with all visualization engines together', () => {
      const terrain = new Terrain3DVisualization({
        width: 100,
        height: 100,
        scale: 1,
        heightScale: 10,
      });

      const network = new NetworkGraphVisualization();
      const heatmap = new HeatmapEngine({
        width: 100,
        height: 100,
        cellSize: 10,
      });

      const timeline = new TimelineVisualization({
        startTime: 0,
        endTime: 10000,
        height: 100,
      });

      const builder = new CustomChartBuilder();

      expect(terrain).toBeDefined();
      expect(network).toBeDefined();
      expect(heatmap).toBeDefined();
      expect(timeline).toBeDefined();
      expect(builder).toBeDefined();
    });

    it('should handle complex visualization scenarios', () => {
      // Create terrain
      const terrain = new Terrain3DVisualization({
        width: 100,
        height: 100,
        scale: 1,
        heightScale: 10,
      });

      const terrainData: TerrainData = {
        elevations: [
          [0, 1, 2],
          [1, 2, 3],
          [2, 3, 4],
        ],
      };

      terrain.generateMesh(terrainData);

      // Create network
      const network = new NetworkGraphVisualization();
      const networkData: NetworkData = {
        nodes: [
          { id: 'a', label: 'Node A' },
          { id: 'b', label: 'Node B' },
        ],
        edges: [{ source: 'a', target: 'b' }],
      };

      network.loadData(networkData);
      network.applyForceDirectedLayout();

      // Create heatmap
      const heatmap = new HeatmapEngine({
        width: 100,
        height: 100,
        cellSize: 10,
      });

      heatmap.addPoints([
        { x: 10, y: 10, value: 1 },
        { x: 20, y: 20, value: 2 },
      ]);

      // Create timeline
      const timeline = new TimelineVisualization({
        startTime: 0,
        endTime: 10000,
        height: 100,
      });

      timeline.addEvent({
        id: 'e1',
        timestamp: 5000,
        label: 'Event 1',
      });

      // Create custom chart
      const builder = new CustomChartBuilder();
      builder.createChart('chart1', 'line', [{ x: 1, y: 10 }], {
        xAxis: 'x',
        yAxis: 'y',
      });

      expect(terrain.getMesh()).toBeDefined();
      expect(network.getNode('a')).toBeDefined();
      expect(heatmap.getStatistics().pointCount).toBe(2);
      expect(timeline.getEvent('e1')).toBeDefined();
      expect(builder.getChart('chart1')).toBeDefined();
    });
  });
});
