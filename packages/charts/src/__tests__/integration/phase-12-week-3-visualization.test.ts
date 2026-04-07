/**
 * Phase 12 Week 3 - Advanced Visualization Tests
 * Test suite for all visualization features
 *
 * تست های تصور پیشرفته
 * مجموعه تست برای تمام ویژگی های تصور
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Terrain3DVisualization } from '../../engine/visualization/Terrain3DVisualization';
import { NetworkGraphVisualization } from '../../engine/visualization/NetworkGraphVisualization';
import { HeatmapEngine } from '../../engine/visualization/HeatmapEngine';
import { TimelineVisualization } from '../../engine/visualization/TimelineVisualization';
import { CustomChartBuilder } from '../../engine/visualization/CustomChartBuilder';

describe('Phase 12 Week 3 - Advanced Visualization', () => {
  describe('Terrain3DVisualization', () => {
    let terrain: Terrain3DVisualization;

    beforeEach(() => {
      terrain = new Terrain3DVisualization();
    });

    it('should load terrain data', () => {
      const heightMap = Array(10)
        .fill(null)
        .map(() => Array(10).fill(Math.random() * 100));

      const terrainData = {
        id: 'terrain-1',
        width: 10,
        height: 10,
        heightMap,
      };

      terrain.loadTerrain(terrainData);
      const loaded = terrain.getTerrain('terrain-1');

      expect(loaded).toBeDefined();
      expect(loaded?.id).toBe('terrain-1');
    });

    it('should generate mesh from height map', () => {
      const heightMap = Array(5)
        .fill(null)
        .map(() => Array(5).fill(50));

      terrain.loadTerrain({
        id: 'terrain-2',
        width: 5,
        height: 5,
        heightMap,
      });

      const mesh = terrain.getMesh('terrain-2');

      expect(mesh).toBeDefined();
      expect(mesh?.vertices).toBeDefined();
      expect(mesh?.indices).toBeDefined();
      expect(mesh?.normals).toBeDefined();
    });

    it('should calculate normals correctly', () => {
      const heightMap = Array(3)
        .fill(null)
        .map(() => Array(3).fill(0));

      terrain.loadTerrain({
        id: 'terrain-3',
        width: 3,
        height: 3,
        heightMap,
      });

      const mesh = terrain.getMesh('terrain-3');
      expect(mesh?.normals.length).toBeGreaterThan(0);
    });

    it('should update lighting configuration', () => {
      terrain.setLighting({
        ambientLight: { r: 0.8, g: 0.8, b: 0.8 },
      });

      const lighting = terrain.getLighting();
      expect(lighting.ambientLight.r).toBe(0.8);
    });

    it('should update camera configuration', () => {
      terrain.setCamera({
        position: { x: 10, y: 20, z: 30 },
      });

      const camera = terrain.getCamera();
      expect(camera.position.x).toBe(10);
    });

    it('should remove terrain', () => {
      terrain.loadTerrain({
        id: 'terrain-4',
        width: 5,
        height: 5,
        heightMap: Array(5)
          .fill(null)
          .map(() => Array(5).fill(0)),
      });

      terrain.removeTerrain('terrain-4');
      expect(terrain.getTerrain('terrain-4')).toBeNull();
    });
  });

  describe('NetworkGraphVisualization', () => {
    let network: NetworkGraphVisualization;

    beforeEach(() => {
      network = new NetworkGraphVisualization();
    });

    it('should load network data', () => {
      const networkData = {
        id: 'network-1',
        nodes: [
          { id: 'n1', label: 'Node 1' },
          { id: 'n2', label: 'Node 2' },
        ],
        edges: [{ id: 'e1', source: 'n1', target: 'n2' }],
      };

      network.loadNetwork(networkData);
      const loaded = network.getNetwork('network-1');

      expect(loaded).toBeDefined();
      expect(loaded?.nodes.length).toBe(2);
    });

    it('should compute force-directed layout', () => {
      const networkData = {
        id: 'network-2',
        nodes: [
          { id: 'n1', label: 'Node 1' },
          { id: 'n2', label: 'Node 2' },
          { id: 'n3', label: 'Node 3' },
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2' },
          { id: 'e2', source: 'n2', target: 'n3' },
        ],
      };

      network.loadNetwork(networkData);
      const layout = network.getLayout('network-2');

      expect(layout).toBeDefined();
      expect(layout?.size).toBe(3);
    });

    it('should detect clusters', () => {
      const networkData = {
        id: 'network-3',
        nodes: [
          { id: 'n1', label: 'Node 1' },
          { id: 'n2', label: 'Node 2' },
          { id: 'n3', label: 'Node 3' },
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2' },
          { id: 'e2', source: 'n2', target: 'n3' },
        ],
      };

      network.loadNetwork(networkData);
      const clusters = network.getClusters('network-3');

      expect(clusters).toBeDefined();
      expect(clusters?.size).toBeGreaterThan(0);
    });

    it('should find shortest path', () => {
      const networkData = {
        id: 'network-4',
        nodes: [
          { id: 'n1', label: 'Node 1' },
          { id: 'n2', label: 'Node 2' },
          { id: 'n3', label: 'Node 3' },
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2' },
          { id: 'e2', source: 'n2', target: 'n3' },
        ],
      };

      network.loadNetwork(networkData);
      const path = network.findShortestPath('network-4', 'n1', 'n3');

      expect(path).toBeDefined();
      expect(path[0]).toBe('n1');
      expect(path[path.length - 1]).toBe('n3');
    });

    it('should remove network', () => {
      const networkData = {
        id: 'network-5',
        nodes: [{ id: 'n1', label: 'Node 1' }],
        edges: [],
      };

      network.loadNetwork(networkData);
      network.removeNetwork('network-5');

      expect(network.getNetwork('network-5')).toBeNull();
    });
  });

  describe('HeatmapEngine', () => {
    let heatmap: HeatmapEngine;

    beforeEach(() => {
      heatmap = new HeatmapEngine();
    });

    it('should load heatmap data', () => {
      const heatmapData = {
        id: 'heatmap-1',
        points: [
          { x: 10, y: 10, value: 50 },
          { x: 20, y: 20, value: 75 },
        ],
        width: 100,
        height: 100,
      };

      heatmap.loadHeatmap(heatmapData);
      const loaded = heatmap.getHeatmap('heatmap-1');

      expect(loaded).toBeDefined();
      expect(loaded?.points.length).toBe(2);
    });

    it('should generate density grid', () => {
      const heatmapData = {
        id: 'heatmap-2',
        points: [
          { x: 10, y: 10, value: 50 },
          { x: 20, y: 20, value: 75 },
        ],
        width: 50,
        height: 50,
      };

      heatmap.loadHeatmap(heatmapData);
      const grid = heatmap.getGrid('heatmap-2');

      expect(grid).toBeDefined();
      expect(grid?.length).toBe(50);
    });

    it('should generate color map', () => {
      const heatmapData = {
        id: 'heatmap-3',
        points: [{ x: 10, y: 10, value: 50 }],
        width: 30,
        height: 30,
      };

      heatmap.loadHeatmap(heatmapData);
      const colorMap = heatmap.getColorMap('heatmap-3');

      expect(colorMap).toBeDefined();
      expect(colorMap?.length).toBe(30 * 30 * 4);
    });

    it('should apply Gaussian smoothing', () => {
      heatmap.setSmoothing('gaussian');

      const heatmapData = {
        id: 'heatmap-4',
        points: [{ x: 50, y: 50, value: 100 }],
        width: 100,
        height: 100,
      };

      heatmap.loadHeatmap(heatmapData);
      const grid = heatmap.getGrid('heatmap-4');

      expect(grid).toBeDefined();
    });

    it('should generate legend', () => {
      const heatmapData = {
        id: 'heatmap-5',
        points: [{ x: 10, y: 10, value: 50 }],
        width: 50,
        height: 50,
      };

      heatmap.loadHeatmap(heatmapData);
      const legend = heatmap.generateLegend('heatmap-5', 5);

      expect(legend.length).toBe(6);
      expect(legend[0].value).toBe(0);
      expect(legend[5].value).toBe(1);
    });

    it('should remove heatmap', () => {
      const heatmapData = {
        id: 'heatmap-6',
        points: [{ x: 10, y: 10, value: 50 }],
        width: 50,
        height: 50,
      };

      heatmap.loadHeatmap(heatmapData);
      heatmap.removeHeatmap('heatmap-6');

      expect(heatmap.getHeatmap('heatmap-6')).toBeNull();
    });
  });

  describe('TimelineVisualization', () => {
    let timeline: TimelineVisualization;

    beforeEach(() => {
      timeline = new TimelineVisualization();
    });

    it('should load timeline data', () => {
      const timelineData = {
        id: 'timeline-1',
        events: [
          { id: 'e1', timestamp: 1000, title: 'Event 1' },
          { id: 'e2', timestamp: 2000, title: 'Event 2' },
        ],
        startTime: 0,
        endTime: 3000,
      };

      timeline.loadTimeline(timelineData);
      const loaded = timeline.getTimeline('timeline-1');

      expect(loaded).toBeDefined();
      expect(loaded?.events.length).toBe(2);
    });

    it('should sort events by timestamp', () => {
      const timelineData = {
        id: 'timeline-2',
        events: [
          { id: 'e1', timestamp: 3000, title: 'Event 3' },
          { id: 'e2', timestamp: 1000, title: 'Event 1' },
          { id: 'e3', timestamp: 2000, title: 'Event 2' },
        ],
        startTime: 0,
        endTime: 4000,
      };

      timeline.loadTimeline(timelineData);
      const events = timeline.getFilteredEvents('timeline-2');

      expect(events[0].timestamp).toBe(1000);
      expect(events[1].timestamp).toBe(2000);
      expect(events[2].timestamp).toBe(3000);
    });

    it('should apply filter by time range', () => {
      const timelineData = {
        id: 'timeline-3',
        events: [
          { id: 'e1', timestamp: 1000, title: 'Event 1' },
          { id: 'e2', timestamp: 2000, title: 'Event 2' },
          { id: 'e3', timestamp: 3000, title: 'Event 3' },
        ],
        startTime: 0,
        endTime: 4000,
      };

      timeline.loadTimeline(timelineData);
      timeline.applyFilter('timeline-3', { startTime: 1500, endTime: 2500 });

      const filtered = timeline.getFilteredEvents('timeline-3');
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('e2');
    });

    it('should apply filter by category', () => {
      const timelineData = {
        id: 'timeline-4',
        events: [
          { id: 'e1', timestamp: 1000, title: 'Event 1', category: 'work' },
          { id: 'e2', timestamp: 2000, title: 'Event 2', category: 'personal' },
        ],
        startTime: 0,
        endTime: 3000,
      };

      timeline.loadTimeline(timelineData);
      timeline.applyFilter('timeline-4', { categories: ['work'] });

      const filtered = timeline.getFilteredEvents('timeline-4');
      expect(filtered.length).toBe(1);
      expect(filtered[0].category).toBe('work');
    });

    it('should add and retrieve annotations', () => {
      const timelineData = {
        id: 'timeline-5',
        events: [{ id: 'e1', timestamp: 1000, title: 'Event 1' }],
        startTime: 0,
        endTime: 2000,
      };

      timeline.loadTimeline(timelineData);
      timeline.addAnnotation('timeline-5', 'e1', 'Important event');

      const annotation = timeline.getAnnotation('timeline-5', 'e1');
      expect(annotation).toBe('Important event');
    });

    it('should calculate event positions', () => {
      const timelineData = {
        id: 'timeline-6',
        events: [
          { id: 'e1', timestamp: 1000, title: 'Event 1' },
          { id: 'e2', timestamp: 2000, title: 'Event 2' },
        ],
        startTime: 0,
        endTime: 3000,
      };

      timeline.loadTimeline(timelineData);
      const positions = timeline.calculatePositions('timeline-6');

      expect(positions.size).toBe(2);
      expect(positions.has('e1')).toBe(true);
      expect(positions.has('e2')).toBe(true);
    });

    it('should export timeline as JSON', () => {
      const timelineData = {
        id: 'timeline-7',
        events: [{ id: 'e1', timestamp: 1000, title: 'Event 1' }],
        startTime: 0,
        endTime: 2000,
      };

      timeline.loadTimeline(timelineData);
      const exported = timeline.exportTimeline('timeline-7', 'json');

      expect(typeof exported).toBe('string');
      const parsed = JSON.parse(exported);
      expect(parsed.id).toBe('timeline-7');
    });

    it('should remove timeline', () => {
      const timelineData = {
        id: 'timeline-8',
        events: [{ id: 'e1', timestamp: 1000, title: 'Event 1' }],
        startTime: 0,
        endTime: 2000,
      };

      timeline.loadTimeline(timelineData);
      timeline.removeTimeline('timeline-8');

      expect(timeline.getTimeline('timeline-8')).toBeNull();
    });
  });

  describe('CustomChartBuilder', () => {
    let builder: CustomChartBuilder;

    beforeEach(() => {
      builder = new CustomChartBuilder();
    });

    it('should create chart from template', () => {
      const chart = builder.createFromTemplate('chart-1', 'bar-chart', { data: [1, 2, 3] });

      expect(chart).toBeDefined();
      expect(chart.type).toBe('bar');
      expect(chart.template).toBe('bar-chart');
    });

    it('should create blank chart', () => {
      const chart = builder.createBlankChart('chart-2', 'custom', { data: [1, 2, 3] });

      expect(chart).toBeDefined();
      expect(chart.type).toBe('custom');
    });

    it('should add data mapping', () => {
      const chart = builder.createBlankChart('chart-3', 'bar', { values: [1, 2, 3] });

      builder.addMapping('chart-3', {
        source: 'values',
        target: 'data',
        transform: (v) => v.map((x: number) => x * 2),
      });

      const updated = builder.getChart('chart-3');
      expect(updated?.mappings.length).toBe(1);
    });

    it('should apply style preset', () => {
      const chart = builder.createBlankChart('chart-4', 'bar', {});

      builder.applyStylePreset('chart-4', 'dark');

      const updated = builder.getChart('chart-4');
      expect(updated?.style.backgroundColor).toBe('#1a1a1a');
    });

    it('should update style', () => {
      const chart = builder.createBlankChart('chart-5', 'bar', {});

      builder.updateStyle('chart-5', { borderRadius: 8 });

      const updated = builder.getChart('chart-5');
      expect(updated?.style.borderRadius).toBe(8);
    });

    it('should apply mappings to data', () => {
      const chart = builder.createBlankChart('chart-6', 'bar', { values: [1, 2, 3] });

      builder.addMapping('chart-6', {
        source: 'values',
        target: 'data',
        transform: (v) => v.map((x: number) => x * 2),
      });

      const mapped = builder.applyMappings('chart-6');
      expect(mapped.data).toEqual([2, 4, 6]);
    });

    it('should get all templates', () => {
      const templates = builder.getAllTemplates();

      expect(templates.length).toBeGreaterThan(0);
      expect(templates.some((t) => t.id === 'bar-chart')).toBe(true);
    });

    it('should get all style presets', () => {
      const presets = builder.getAllPresets();

      expect(presets.length).toBeGreaterThan(0);
      expect(presets.includes('default')).toBe(true);
    });

    it('should duplicate chart', () => {
      const original = builder.createBlankChart('chart-7', 'bar', { data: [1, 2, 3] });

      const duplicate = builder.duplicateChart('chart-7', 'chart-7-copy');

      expect(duplicate).toBeDefined();
      expect(duplicate?.name).toContain('Copy');
      expect(duplicate?.type).toBe(original.type);
    });

    it('should export chart as JSON', () => {
      builder.createBlankChart('chart-8', 'bar', { data: [1, 2, 3] });

      const exported = builder.exportChart('chart-8', 'json');

      expect(typeof exported).toBe('string');
      const parsed = JSON.parse(exported as string);
      expect(parsed.id).toBe('chart-8');
    });

    it('should remove chart', () => {
      builder.createBlankChart('chart-9', 'bar', {});

      builder.removeChart('chart-9');

      expect(builder.getChart('chart-9')).toBeNull();
    });
  });

  describe('Integration Tests', () => {
    it('should handle multiple visualization types simultaneously', () => {
      const terrain = new Terrain3DVisualization();
      const network = new NetworkGraphVisualization();
      const heatmap = new HeatmapEngine();
      const timeline = new TimelineVisualization();
      const builder = new CustomChartBuilder();

      // Load data into each
      terrain.loadTerrain({
        id: 't1',
        width: 5,
        height: 5,
        heightMap: Array(5)
          .fill(null)
          .map(() => Array(5).fill(0)),
      });

      network.loadNetwork({
        id: 'n1',
        nodes: [{ id: 'n1', label: 'Node 1' }],
        edges: [],
      });

      heatmap.loadHeatmap({
        id: 'h1',
        points: [{ x: 10, y: 10, value: 50 }],
        width: 50,
        height: 50,
      });

      timeline.loadTimeline({
        id: 'tl1',
        events: [{ id: 'e1', timestamp: 1000, title: 'Event 1' }],
        startTime: 0,
        endTime: 2000,
      });

      builder.createBlankChart('c1', 'bar', {});

      // Verify all loaded
      expect(terrain.getTerrain('t1')).toBeDefined();
      expect(network.getNetwork('n1')).toBeDefined();
      expect(heatmap.getHeatmap('h1')).toBeDefined();
      expect(timeline.getTimeline('tl1')).toBeDefined();
      expect(builder.getChart('c1')).toBeDefined();
    });

    it('should emit events correctly', (done) => {
      const terrain = new Terrain3DVisualization();
      let eventFired = false;

      terrain.on('terrain:loaded', () => {
        eventFired = true;
      });

      terrain.loadTerrain({
        id: 't1',
        width: 5,
        height: 5,
        heightMap: Array(5)
          .fill(null)
          .map(() => Array(5).fill(0)),
      });

      setTimeout(() => {
        expect(eventFired).toBe(true);
        done();
      }, 100);
    });
  });
});
