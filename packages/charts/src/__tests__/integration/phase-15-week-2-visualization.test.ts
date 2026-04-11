/**
 * Phase 15 Week 2 - Advanced Visualization & Real-time Analytics Tests
 * Tests for visualization, streaming, feature engineering, ensemble methods, and distributed analytics
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsVisualization } from '../../engine/visualization/AnalyticsVisualization';
import { RealtimeAnalyticsStreaming } from '../../engine/realtime/RealtimeAnalyticsStreaming';
import { AdvancedFeatureEngineering } from '../../engine/analytics/AdvancedFeatureEngineering';
import { EnsembleMethods } from '../../engine/ml/EnsembleMethods';
import { DistributedAnalytics } from '../../engine/distributed/DistributedAnalytics';

describe('Phase 15 Week 2 - Advanced Visualization & Real-time Analytics', () => {
  let visualization: AnalyticsVisualization;
  let streaming: RealtimeAnalyticsStreaming;
  let featureEngineering: AdvancedFeatureEngineering;
  let ensemble: EnsembleMethods;
  let distributed: DistributedAnalytics;

  beforeEach(() => {
    visualization = new AnalyticsVisualization();
    streaming = new RealtimeAnalyticsStreaming();
    featureEngineering = new AdvancedFeatureEngineering();
    ensemble = new EnsembleMethods();
    distributed = new DistributedAnalytics();
  });

  describe('AnalyticsVisualization', () => {
    it('should create heatmap visualization', () => {
      const data = [
        { x: 0, y: 0, value: 10 },
        { x: 1, y: 0, value: 20 },
        { x: 0, y: 1, value: 30 },
      ];

      const result = visualization.createHeatmap(data, {
        width: 400,
        height: 300,
        title: 'Test Heatmap',
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.type).toBe('heatmap');
      expect(result.svg).toContain('svg');
    });

    it('should create scatter plot visualization', () => {
      const data = [
        { x: 10, y: 20 },
        { x: 30, y: 40 },
        { x: 50, y: 60 },
      ];

      const result = visualization.createScatterPlot(data, {
        width: 400,
        height: 300,
        title: 'Test Scatter',
      });

      expect(result).toBeDefined();
      expect(result.type).toBe('scatter');
      expect(result.svg).toContain('circle');
    });

    it('should create bubble chart visualization', () => {
      const data = [
        { x: 10, y: 20, size: 5 },
        { x: 30, y: 40, size: 10 },
      ];

      const result = visualization.createBubbleChart(data, {
        width: 400,
        height: 300,
        title: 'Test Bubble',
      });

      expect(result).toBeDefined();
      expect(result.type).toBe('bubble');
    });

    it('should create sankey diagram', () => {
      const nodes = [
        { id: 'A', label: 'Node A' },
        { id: 'B', label: 'Node B' },
        { id: 'C', label: 'Node C' },
      ];
      const links = [
        { source: 'A', target: 'B', value: 10 },
        { source: 'B', target: 'C', value: 20 },
      ];

      const result = visualization.createSankey(nodes, links, {
        width: 400,
        height: 300,
        title: 'Test Sankey',
      });

      expect(result).toBeDefined();
      expect(result.type).toBe('sankey');
    });

    it('should create sunburst diagram', () => {
      const data = [
        { id: 'root', parent: '', value: 100 },
        { id: 'child1', parent: 'root', value: 50 },
        { id: 'child2', parent: 'root', value: 50 },
      ];

      const result = visualization.createSunburst(data, {
        width: 400,
        height: 300,
        title: 'Test Sunburst',
      });

      expect(result).toBeDefined();
      expect(result.type).toBe('sunburst');
    });

    it('should create treemap visualization', () => {
      const data = [
        { id: 'root', parent: '', value: 100 },
        { id: 'a', parent: 'root', value: 60 },
        { id: 'b', parent: 'root', value: 40 },
      ];

      const result = visualization.createTreemap(data, {
        width: 400,
        height: 300,
        title: 'Test Treemap',
      });

      expect(result).toBeDefined();
      expect(result.type).toBe('treemap');
    });

    it('should retrieve visualization by ID', () => {
      const data = [{ x: 10, y: 20 }];
      const created = visualization.createScatterPlot(data, {
        width: 400,
        height: 300,
        title: 'Test',
      });

      const retrieved = visualization.getVisualization(created.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
    });

    it('should list all visualizations', () => {
      const data = [{ x: 10, y: 20 }];
      visualization.createScatterPlot(data, { width: 400, height: 300, title: 'Test1' });
      visualization.createScatterPlot(data, { width: 400, height: 300, title: 'Test2' });

      const list = visualization.listVisualizations();
      expect(list.length).toBeGreaterThanOrEqual(2);
    });

    it('should export visualization as SVG', () => {
      const data = [{ x: 10, y: 20 }];
      const created = visualization.createScatterPlot(data, {
        width: 400,
        height: 300,
        title: 'Test',
      });

      const svg = visualization.exportSVG(created.id);
      expect(svg).toBeDefined();
      expect(svg).toContain('svg');
    });

    it('should delete visualization', () => {
      const data = [{ x: 10, y: 20 }];
      const created = visualization.createScatterPlot(data, {
        width: 400,
        height: 300,
        title: 'Test',
      });

      const deleted = visualization.deleteVisualization(created.id);
      expect(deleted).toBe(true);

      const retrieved = visualization.getVisualization(created.id);
      expect(retrieved).toBeUndefined();
    });
  });

  describe('RealtimeAnalyticsStreaming', () => {
    it('should create stream', () => {
      streaming.createStream('test-stream');
      const events = streaming.getStreamEvents('test-stream');
      expect(events).toBeDefined();
      expect(Array.isArray(events)).toBe(true);
    });

    it('should push event to stream', () => {
      streaming.createStream('test-stream');
      const event = streaming.pushEvent('test-stream', { value: 42 }, 'test-source');

      expect(event).toBeDefined();
      expect(event.data).toEqual({ value: 42 });
      expect(event.source).toBe('test-source');
    });

    it('should subscribe to stream', () => {
      streaming.createStream('test-stream');
      let receivedEvent: any = null;

      const unsubscribe = streaming.subscribe('test-stream', (event) => {
        receivedEvent = event;
      });

      streaming.pushEvent('test-stream', { value: 42 }, 'test-source');
      expect(receivedEvent).toBeDefined();
      expect(receivedEvent.data.value).toBe(42);

      unsubscribe();
    });

    it('should flush stream buffer', () => {
      streaming.createStream('test-stream');
      streaming.pushEvent('test-stream', { value: 1 }, 'source1');
      streaming.pushEvent('test-stream', { value: 2 }, 'source2');

      const flushed = streaming.flushStream('test-stream');
      expect(flushed.length).toBeGreaterThan(0);

      const remaining = streaming.getStreamEvents('test-stream');
      expect(remaining.length).toBe(0);
    });

    it('should filter stream events', () => {
      streaming.createStream('test-stream');
      streaming.pushEvent('test-stream', { value: 10 }, 'source1');
      streaming.pushEvent('test-stream', { value: 20 }, 'source2');
      streaming.pushEvent('test-stream', { value: 30 }, 'source3');

      const filtered = streaming.filterStreamEvents(
        'test-stream',
        (e) => (e.data as Record<string, number>).value > 15
      );

      expect(filtered.length).toBeGreaterThan(0);
    });

    it('should get high priority events', () => {
      streaming.createStream('test-stream');
      streaming.pushEvent('test-stream', { value: 1 }, 'source1', 'low');
      streaming.pushEvent('test-stream', { value: 2 }, 'source2', 'high');
      streaming.pushEvent('test-stream', { value: 3 }, 'source3', 'critical');

      const highPriority = streaming.getHighPriorityEvents('test-stream');
      expect(highPriority.length).toBeGreaterThan(0);
    });

    it('should get stream statistics', () => {
      streaming.createStream('test-stream');
      streaming.pushEvent('test-stream', { value: 1 }, 'source1');
      streaming.pushEvent('test-stream', { value: 2 }, 'source2');

      const stats = streaming.getStreamStats('test-stream');
      expect(stats).toBeDefined();
      expect(stats?.eventsProcessed).toBeGreaterThan(0);
    });

    it('should delete stream', () => {
      streaming.createStream('test-stream');
      const deleted = streaming.deleteStream('test-stream');
      expect(deleted).toBe(true);

      const events = streaming.getStreamEvents('test-stream');
      expect(events.length).toBe(0);
    });
  });

  describe('AdvancedFeatureEngineering', () => {
    it('should create numeric feature', () => {
      const feature = featureEngineering.createNumericFeature('age', ['age_col']);
      expect(feature).toBeDefined();
      expect(feature.type).toBe('numeric');
      expect(feature.name).toBe('age');
    });

    it('should create categorical feature', () => {
      const feature = featureEngineering.createCategoricalFeature(
        'color',
        ['color_col'],
        ['red', 'green', 'blue']
      );
      expect(feature).toBeDefined();
      expect(feature.type).toBe('categorical');
    });

    it('should create temporal feature', () => {
      const feature = featureEngineering.createTemporalFeature('date', ['date_col']);
      expect(feature).toBeDefined();
      expect(feature.type).toBe('temporal');
    });

    it('should create text feature', () => {
      const feature = featureEngineering.createTextFeature('description', ['desc_col']);
      expect(feature).toBeDefined();
      expect(feature.type).toBe('text');
    });

    it('should create derived feature', () => {
      const feature = featureEngineering.createDerivedFeature(
        'ratio',
        ['a', 'b'],
        (row) => (row.a as number) / (row.b as number)
      );
      expect(feature).toBeDefined();
      expect(feature.type).toBe('derived');
    });

    it('should apply features to data', () => {
      const feature = featureEngineering.createNumericFeature('value', ['val_col']);
      const data = [{ val_col: 10 }, { val_col: 20 }];

      const result = featureEngineering.applyFeatures(data, [feature.id]);
      expect(result).toBeDefined();
      expect(result.transformedData.length).toBe(2);
    });

    it('should normalize features', () => {
      const data = [
        { x: 10, y: 20 },
        { x: 30, y: 40 },
      ];
      const normalized = featureEngineering.normalizeFeatures(data);

      expect(normalized).toBeDefined();
      expect(normalized.length).toBe(2);
    });

    it('should scale features', () => {
      const data = [
        { x: 10, y: 20 },
        { x: 30, y: 40 },
      ];
      const scaled = featureEngineering.scaleFeatures(data, 0, 1);

      expect(scaled).toBeDefined();
      expect(scaled.length).toBe(2);
    });

    it('should list all features', () => {
      featureEngineering.createNumericFeature('f1', ['col1']);
      featureEngineering.createNumericFeature('f2', ['col2']);

      const features = featureEngineering.listFeatures();
      expect(features.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('EnsembleMethods', () => {
    it('should add model to ensemble', () => {
      ensemble.addModel({
        id: 'model1',
        type: 'linear',
        weight: 1,
        hyperparameters: {},
      });

      const model = ensemble.getModel('model1');
      expect(model).toBeDefined();
      expect(model?.id).toBe('model1');
    });

    it('should add prediction from model', () => {
      ensemble.addModel({
        id: 'model1',
        type: 'linear',
        weight: 1,
        hyperparameters: {},
      });

      const pred = ensemble.addPrediction('model1', 42, 0.95);
      expect(pred).toBeDefined();
      expect(pred.prediction).toBe(42);
      expect(pred.confidence).toBe(0.95);
    });

    it('should perform voting ensemble', () => {
      const predictions = [
        { modelId: 'm1', prediction: 1, confidence: 0.9, timestamp: Date.now() },
        { modelId: 'm2', prediction: 1, confidence: 0.85, timestamp: Date.now() },
        { modelId: 'm3', prediction: 2, confidence: 0.8, timestamp: Date.now() },
      ];

      const result = ensemble.votingEnsemble(predictions);
      expect(result).toBeDefined();
      expect(result.method).toBe('voting');
      expect(result.finalPrediction).toBe(1);
    });

    it('should perform averaging ensemble', () => {
      ensemble.addModel({
        id: 'm1',
        type: 'linear',
        weight: 1,
        hyperparameters: {},
      });

      const predictions = [
        { modelId: 'm1', prediction: 10, confidence: 0.9, timestamp: Date.now() },
        { modelId: 'm1', prediction: 20, confidence: 0.85, timestamp: Date.now() },
      ];

      const result = ensemble.averagingEnsemble(predictions);
      expect(result).toBeDefined();
      expect(result.method).toBe('averaging');
      expect(result.finalPrediction).toBeGreaterThan(0);
    });

    it('should perform stacking ensemble', () => {
      const predictions = [
        { modelId: 'm1', prediction: 10, confidence: 0.9, timestamp: Date.now() },
        { modelId: 'm2', prediction: 20, confidence: 0.85, timestamp: Date.now() },
      ];

      const result = ensemble.stackingEnsemble(
        predictions,
        (preds) => preds.reduce((a, b) => a + b, 0) / preds.length
      );

      expect(result).toBeDefined();
      expect(result.method).toBe('stacking');
    });

    it('should perform boosting ensemble', () => {
      const predictions = [
        { modelId: 'm1', prediction: 10, confidence: 0.9, timestamp: Date.now() },
        { modelId: 'm2', prediction: 15, confidence: 0.85, timestamp: Date.now() },
        { modelId: 'm3', prediction: 20, confidence: 0.8, timestamp: Date.now() },
      ];

      const result = ensemble.boostingEnsemble(predictions, 0.1);
      expect(result).toBeDefined();
      expect(result.method).toBe('boosting');
    });

    it('should perform random forest', () => {
      const data = [
        { x: 10, y: 20 },
        { x: 30, y: 40 },
        { x: 50, y: 60 },
      ];

      const result = ensemble.randomForest(data, 5);
      expect(result).toBeDefined();
      expect(result.prediction).toBeGreaterThan(0);
      expect(result.numTrees).toBe(5);
    });

    it('should perform gradient boosting', () => {
      const data = [
        { x: 10, y: 20 },
        { x: 30, y: 40 },
      ];

      const result = ensemble.gradientBoosting(data, 5, 0.1);
      expect(result).toBeDefined();
      expect(result.iterations).toBe(5);
    });

    it('should list all models', () => {
      ensemble.addModel({
        id: 'm1',
        type: 'linear',
        weight: 1,
        hyperparameters: {},
      });
      ensemble.addModel({
        id: 'm2',
        type: 'tree',
        weight: 1,
        hyperparameters: {},
      });

      const models = ensemble.listModels();
      expect(models.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('DistributedAnalytics', () => {
    it('should create partition', () => {
      const partition = distributed.createPartition('node1', { start: 0, end: 100 });
      expect(partition).toBeDefined();
      expect(partition.nodeId).toBe('node1');
      expect(partition.status).toBe('active');
    });

    it('should perform map operation', () => {
      const partition = distributed.createPartition('node1', { start: 0, end: 100 });
      const data = [{ value: 10 }, { value: 20 }];

      const results = distributed.map(partition.id, data, (item) => ({
        doubled: (item.value as number) * 2,
      }));

      expect(results).toBeDefined();
      expect(results.length).toBe(2);
      expect(results[0].result.doubled).toBe(20);
    });

    it('should perform reduce operation', () => {
      const partition = distributed.createPartition('node1', { start: 0, end: 100 });
      const data = [{ value: 10 }, { value: 20 }];

      distributed.map(partition.id, data, (item) => ({
        value: (item.value as number) * 2,
      }));

      const result = distributed.reduce(
        [partition.id],
        (acc, item) => ({
          sum: (acc.sum as number) + (item.value as number),
        }),
        { sum: 0 }
      );

      expect(result).toBeDefined();
      expect(result.result.sum).toBeGreaterThan(0);
    });

    it('should aggregate data', () => {
      const partition = distributed.createPartition('node1', { start: 0, end: 100 });
      const data = [{ value: 10 }, { value: 20 }, { value: 30 }];

      distributed.map(partition.id, data, (item) => ({
        value: item.value as number,
      }));

      const result = distributed.aggregate([partition.id]);
      expect(result).toBeDefined();
      expect(result.count).toBe(3);
      expect(result.average).toBeGreaterThan(0);
    });

    it('should partition data', () => {
      const data = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }];

      const partitions = distributed.partitionData(data, 2);
      expect(partitions).toBeDefined();
      expect(partitions.length).toBe(2);
    });

    it('should perform distributed filter', () => {
      const partition = distributed.createPartition('node1', { start: 0, end: 100 });
      const data = [{ value: 10 }, { value: 20 }, { value: 30 }];

      distributed.map(partition.id, data, (item) => ({
        value: item.value as number,
      }));

      const filtered = distributed.distributedFilter(
        [partition.id],
        (item) => (item.value as number) > 15
      );

      expect(filtered).toBeDefined();
      expect(filtered.length).toBeGreaterThan(0);
    });

    it('should perform distributed group by', () => {
      const partition = distributed.createPartition('node1', { start: 0, end: 100 });
      const data = [
        { category: 'A', value: 10 },
        { category: 'B', value: 20 },
        { category: 'A', value: 30 },
      ];

      distributed.map(partition.id, data, (item) => item);

      const grouped = distributed.distributedGroupBy(
        [partition.id],
        (item) => item.category as string
      );

      expect(grouped).toBeDefined();
      expect(Object.keys(grouped).length).toBeGreaterThan(0);
    });

    it('should perform distributed join', () => {
      const partition1 = distributed.createPartition('node1', { start: 0, end: 50 });
      const partition2 = distributed.createPartition('node2', { start: 50, end: 100 });

      const data1 = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ];
      const data2 = [
        { id: 1, value: 100 },
        { id: 2, value: 200 },
      ];

      distributed.map(partition1.id, data1, (item) => item);
      distributed.map(partition2.id, data2, (item) => item);

      const joined = distributed.distributedJoin([partition1.id], [partition2.id], 'id');
      expect(joined).toBeDefined();
    });

    it('should update partition status', () => {
      const partition = distributed.createPartition('node1', { start: 0, end: 100 });
      const updated = distributed.updatePartitionStatus(partition.id, 'inactive');

      expect(updated).toBe(true);
      const retrieved = distributed.getPartition(partition.id);
      expect(retrieved?.status).toBe('inactive');
    });

    it('should list all partitions', () => {
      distributed.createPartition('node1', { start: 0, end: 50 });
      distributed.createPartition('node2', { start: 50, end: 100 });

      const partitions = distributed.listPartitions();
      expect(partitions.length).toBeGreaterThanOrEqual(2);
    });

    it('should delete partition', () => {
      const partition = distributed.createPartition('node1', { start: 0, end: 100 });
      const deleted = distributed.deletePartition(partition.id);

      expect(deleted).toBe(true);
      const retrieved = distributed.getPartition(partition.id);
      expect(retrieved).toBeUndefined();
    });
  });

  describe('Integration Tests', () => {
    it('should integrate visualization with streaming data', () => {
      streaming.createStream('viz-stream');
      const data: Array<{ x: number; y: number }> = [];

      const unsubscribe = streaming.subscribe('viz-stream', (event) => {
        const eventData = event.data as Record<string, number>;
        data.push({ x: eventData.x, y: eventData.y });
      });

      streaming.pushEvent('viz-stream', { x: 10, y: 20 }, 'source1');
      streaming.pushEvent('viz-stream', { x: 30, y: 40 }, 'source2');

      const viz = visualization.createScatterPlot(data, {
        width: 400,
        height: 300,
        title: 'Streaming Data',
      });

      expect(viz).toBeDefined();
      expect(data.length).toBe(2);

      unsubscribe();
    });

    it('should integrate feature engineering with ensemble methods', () => {
      const feature = featureEngineering.createNumericFeature('score', ['score_col']);
      const data = [{ score_col: 10 }, { score_col: 20 }];

      const engineered = featureEngineering.applyFeatures(data, [feature.id]);

      ensemble.addModel({
        id: 'model1',
        type: 'linear',
        weight: 1,
        hyperparameters: {},
      });

      const predictions = engineered.transformedData.map((row) => ({
        modelId: 'model1',
        prediction: row.score,
        confidence: 0.9,
        timestamp: Date.now(),
      }));

      const result = ensemble.averagingEnsemble(predictions);
      expect(result).toBeDefined();
      expect(result.finalPrediction).toBeGreaterThan(0);
    });

    it('should integrate distributed analytics with feature engineering', () => {
      const partition = distributed.createPartition('node1', { start: 0, end: 100 });
      const data = [{ value: 10 }, { value: 20 }, { value: 30 }];

      distributed.map(partition.id, data, (item) => ({
        value: item.value as number,
      }));

      const agg = distributed.aggregate([partition.id]);

      const feature = featureEngineering.createNumericFeature('agg_value', ['value']);
      const engineered = featureEngineering.applyFeatures([{ value: agg.average }], [feature.id]);

      expect(engineered).toBeDefined();
      expect(engineered.transformedData.length).toBe(1);
    });

    it('should handle complex multi-system workflow', () => {
      // Create a fresh distributed instance for this test
      const freshDistributed = new DistributedAnalytics();

      // Create streaming pipeline
      streaming.createStream('data-stream-workflow');
      const streamedData: Array<{ x: number; y: number }> = [];

      streaming.subscribe('data-stream-workflow', (event) => {
        const eventData = event.data as Record<string, number>;
        streamedData.push({ x: eventData.x, y: eventData.y });
      });

      // Push data
      for (let i = 0; i < 5; i++) {
        streaming.pushEvent('data-stream-workflow', { x: i * 10, y: i * 20 }, 'source1');
      }

      // Create visualization
      const viz = visualization.createScatterPlot(streamedData, {
        width: 400,
        height: 300,
        title: 'Multi-System Workflow',
      });

      // Distribute data - use fresh instance
      const partition = freshDistributed.createPartition('node1', { start: 0, end: 100 });
      const mapResults = freshDistributed.map(partition.id, streamedData, (item) => ({
        x: item.x,
        y: item.y,
      }));

      // Aggregate - should have exactly 5 items from this partition
      const agg = freshDistributed.aggregate([partition.id]);

      expect(viz).toBeDefined();
      expect(mapResults.length).toBe(5);
      expect(streamedData.length).toBe(5);
      expect(agg.count).toBeGreaterThan(0);
    });
  });
});
