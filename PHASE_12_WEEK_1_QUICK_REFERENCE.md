# Phase 12 Week 1 - Quick Reference Guide

**راهنمای سریع فاز 12 هفته 1**

---

## 🚀 Quick Start

### Import All Features

```typescript
import { AIModelManager } from '@rhuds/charts/engine/ai/AIModelManager';
import { PredictiveAnalyticsEngine } from '@rhuds/charts/engine/ai/PredictiveAnalyticsEngine';
import { NLPIntegration } from '@rhuds/charts/engine/ai/NLPIntegration';
import { ComputerVisionIntegration } from '@rhuds/charts/engine/ai/ComputerVisionIntegration';
import { AnomalyDetectionSystem } from '@rhuds/charts/engine/ai/AnomalyDetectionSystem';
```

---

## 1️⃣ AI Model Management

### Create & Train Model

```typescript
const manager = new AIModelManager();

// Create model
const model = manager.createModel({
  name: 'My ML Model',
  type: 'classification',
  metadata: { version: '1.0' },
});

// Train model
const trained = await manager.trainModel(model.id, trainingData, {
  epochs: 100,
  batchSize: 32,
  learningRate: 0.01,
});

// Deploy model
manager.deployModel(model.id);
```

### A/B Testing

```typescript
// Setup A/B test
manager.setupABTest({
  modelAId: model1.id,
  modelBId: model2.id,
  trafficSplit: 50,
  duration: 3600,
  metrics: ['accuracy', 'latency'],
});

// Get results
const results = manager.getABTestResults(testId);
console.log(`Winner: ${results.winner}`);
```

### Model Versioning

```typescript
// Get versions
const versions = manager.getModelVersions(model.id);

// Rollback to previous version
manager.rollbackModel(model.id, '1.0.0');

// Archive old model
manager.archiveModel(oldModel.id);
```

---

## 2️⃣ Predictive Analytics

### Time Series Forecasting

```typescript
const engine = new PredictiveAnalyticsEngine();

// Add historical data
engine.addTimeSeriesData('sales', [
  { timestamp: Date.now() - 86400000, value: 100 },
  { timestamp: Date.now(), value: 120 },
]);

// Forecast next 30 days
const forecast = engine.forecastTimeSeries('sales', 30, {
  alpha: 0.3,
  beta: 0.1,
});

forecast.forEach((pred) => {
  console.log(`${pred.timestamp}: ${pred.predicted} ± ${pred.upper - pred.lower}`);
});
```

### Regression Analysis

```typescript
// Fit linear regression
const model = engine.fitRegression(
  'price-model',
  [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
    { x: 3, y: 30 },
  ],
  'linear'
);

console.log(`R² = ${model.rSquared}`);

// Make predictions
const price = engine.predictRegression('price-model', 5);
console.log(`Predicted price: ${price}`);
```

### Classification

```typescript
// Train classifier
engine.trainClassifier('iris-classifier', [
  { features: [5.1, 3.5, 1.4, 0.2], label: 'setosa' },
  { features: [7.0, 3.2, 4.7, 1.4], label: 'versicolor' },
]);

// Classify new data
const result = engine.classify('iris-classifier', [5.5, 3.0, 1.5, 0.2]);
console.log(`Class: ${result.class} (${result.probability})`);
```

### Ensemble Methods

```typescript
// Create ensemble
engine.createEnsemble('ensemble-1', {
  models: ['model-1', 'model-2', 'model-3'],
  weights: [0.5, 0.3, 0.2],
  aggregation: 'weighted',
});

// Predict with ensemble
const prediction = engine.predictEnsemble('ensemble-1', 10);
```

### Confidence Intervals

```typescript
const ci = engine.calculateConfidenceInterval('sales', 0.95);
console.log(`95% CI: [${ci.lower}, ${ci.upper}]`);
```

---

## 3️⃣ Natural Language Processing

### Sentiment Analysis

```typescript
const nlp = new NLPIntegration();

const sentiment = nlp.analyzeSentiment('This product is amazing!');
console.log(`Sentiment: ${sentiment.sentiment}`);
console.log(`Score: ${sentiment.score}`);
console.log(`Confidence: ${sentiment.confidence}`);
```

### Entity Extraction

```typescript
const entities = nlp.extractEntities('John Smith works at Google in New York');

entities.forEach((entity) => {
  console.log(`${entity.text} (${entity.type})`);
});
```

### Text Classification

```typescript
// Train classifier
nlp.trainClassifier('news-classifier', [
  { text: 'Stock market rises', category: 'business' },
  { text: 'New AI breakthrough', category: 'tech' },
]);

// Classify text
const result = nlp.classifyText('news-classifier', 'Tech company IPO');
console.log(`Category: ${result.category}`);
```

### Topic Extraction

```typescript
const topics = nlp.extractTopics(
  'model-1',
  [
    'Machine learning is powerful',
    'Deep learning uses neural networks',
    'AI is transforming technology',
  ],
  3
);

topics.forEach((topic) => {
  console.log(`Topic ${topic.id}: ${topic.keywords.join(', ')}`);
});
```

### Language Detection

```typescript
const lang = nlp.detectLanguage('سلام، این یک متن فارسی است');
console.log(`Language: ${lang.language}`);
console.log(`Confidence: ${lang.confidence}`);
```

### Text Similarity

```typescript
const similarity = nlp.calculateSimilarity('hello world', 'hello there');
console.log(`Similarity: ${similarity}`);
```

---

## 4️⃣ Computer Vision

### Image Classification

```typescript
const cv = new ComputerVisionIntegration();

const imageData = new Uint8Array(/* image bytes */);
const result = cv.classifyImage('default-classifier', imageData);

console.log(`Class: ${result.class}`);
console.log(`Confidence: ${result.confidence}`);
```

### Object Detection

```typescript
const objects = cv.detectObjects('default-detector', imageData);

objects.objects.forEach((obj) => {
  console.log(`${obj.class} at (${obj.bbox.x}, ${obj.bbox.y})`);
});
```

### Face Recognition

```typescript
const faces = cv.recognizeFaces('default-recognizer', imageData);

faces.faces.forEach((face) => {
  console.log(`Face detected with emotion: ${face.emotion}`);
});
```

### Scene Understanding

```typescript
const scene = cv.understandScene(imageData);

console.log(`Objects: ${scene.objects.join(', ')}`);
console.log(`Activities: ${scene.activities.join(', ')}`);
console.log(`Setting: ${scene.setting}`);
```

### Video Analysis

```typescript
const frames = [
  /* VideoFrame[] */
];
const analysis = cv.analyzeVideo('video-1', frames);

console.log(`Scenes: ${analysis.scenes.length}`);
console.log(`Objects: ${JSON.stringify(analysis.objects)}`);
```

### Image Comparison

```typescript
const similarity = cv.compareImages(image1, image2);
console.log(`Similarity: ${similarity}`);
```

---

## 5️⃣ Anomaly Detection

### Add Data Stream

```typescript
const ads = new AnomalyDetectionSystem();

// Add data points
for (let i = 0; i < 100; i++) {
  ads.addDataPoint('cpu-usage', 50 + Math.random() * 10);
}
```

### Detect Anomalies

```typescript
// Statistical method (Z-score)
const anomalies1 = ads.detectAnomaliesStatistical('cpu-usage', 3);

// Isolation Forest method
const anomalies2 = ads.detectAnomaliesIsolationForest('cpu-usage', 0.1);

// LSTM method
const anomalies3 = ads.detectAnomaliesLSTM('cpu-usage', 10, 0.7);
```

### Generate Alerts

```typescript
anomalies1.forEach((anomaly) => {
  if (anomaly.isAnomaly) {
    const alert = ads.generateAlert('cpu-usage', anomaly);
    console.log(`Alert: ${alert.message} (${alert.severity})`);
  }
});
```

### Root Cause Analysis

```typescript
const analysis = ads.analyzeRootCause('anomaly-1', 'cpu-usage');

analysis.possibleCauses.forEach((cause) => {
  console.log(`${cause.cause}: ${cause.probability}`);
});
```

### Pattern Detection

```typescript
const patterns = ads.detectPatterns('cpu-usage');

patterns.forEach((pattern) => {
  console.log(`${pattern.type} from ${pattern.startTime} to ${pattern.endTime}`);
});
```

### Statistics

```typescript
const stats = ads.getAnomalyStatistics('cpu-usage');

console.log(`Total points: ${stats.totalPoints}`);
console.log(`Anomalies: ${stats.anomalyCount}`);
console.log(`Rate: ${stats.anomalyRate}`);
console.log(`Avg score: ${stats.averageScore}`);
```

---

## 🎯 Common Patterns

### Pipeline: Data → Prediction → Anomaly Detection

```typescript
const engine = new PredictiveAnalyticsEngine();
const ads = new AnomalyDetectionSystem();

// Add historical data
engine.addTimeSeriesData('sales', historicalData);

// Make predictions
const forecast = engine.forecastTimeSeries('sales', 30);

// Monitor predictions for anomalies
forecast.forEach((pred) => {
  ads.addDataPoint('forecast-stream', pred.predicted);
});

// Detect anomalies in predictions
const anomalies = ads.detectAnomaliesStatistical('forecast-stream', 2);
```

### Pipeline: Text → Sentiment → Anomaly Detection

```typescript
const nlp = new NLPIntegration();
const ads = new AnomalyDetectionSystem();

// Analyze sentiment of reviews
const reviews = ['Great product!', 'Terrible experience', 'Amazing!'];
const sentiments = reviews.map((r) => nlp.analyzeSentiment(r));

// Monitor sentiment scores
sentiments.forEach((s) => {
  ads.addDataPoint('sentiment-stream', s.score);
});

// Detect unusual sentiment patterns
const anomalies = ads.detectAnomaliesStatistical('sentiment-stream', 2);
```

### Pipeline: Image → Classification → Anomaly Detection

```typescript
const cv = new ComputerVisionIntegration();
const ads = new AnomalyDetectionSystem();

// Classify images
const images = [
  /* image data */
];
const results = images.map((img) => cv.classifyImage('classifier', img));

// Monitor confidence scores
results.forEach((r) => {
  ads.addDataPoint('confidence-stream', r.confidence);
});

// Detect anomalies in confidence
const anomalies = ads.detectAnomaliesStatistical('confidence-stream', 2);
```

---

## 📊 Event Handling

### Listen to Events

```typescript
const manager = new AIModelManager();

manager.on('model:created', (model) => {
  console.log(`Model created: ${model.name}`);
});

manager.on('model:training:completed', ({ modelId, accuracy }) => {
  console.log(`Training complete: ${accuracy}`);
});

manager.on('model:deployed', (model) => {
  console.log(`Model deployed: ${model.id}`);
});
```

### Anomaly Detection Events

```typescript
const ads = new AnomalyDetectionSystem();

ads.on('anomalies:detected', ({ streamId, count }) => {
  console.log(`${count} anomalies detected in ${streamId}`);
});

ads.on('alert:generated', ({ alertId, severity }) => {
  console.log(`Alert ${alertId}: ${severity}`);
});

ads.on('root-cause:analyzed', ({ anomalyId, topCause }) => {
  console.log(`Top cause: ${topCause}`);
});
```

---

## ⚡ Performance Tips

### 1. Batch Operations

```typescript
// Good: Batch add data
const data = generateData(1000);
engine.addTimeSeriesData('series', data);

// Avoid: Adding one by one
for (const point of data) {
  engine.addTimeSeriesData('series', [point]);
}
```

### 2. Reuse Models

```typescript
// Good: Train once, use many times
engine.trainClassifier('classifier', trainingData);
for (const item of items) {
  engine.classify('classifier', item.features);
}

// Avoid: Retraining for each prediction
for (const item of items) {
  engine.trainClassifier('classifier', trainingData);
  engine.classify('classifier', item.features);
}
```

### 3. Limit Data Retention

```typescript
// Clean old data periodically
setInterval(() => {
  ads.clearOldData('stream-1', 86400000); // Keep 1 day
}, 3600000); // Every hour
```

### 4. Use Appropriate Thresholds

```typescript
// Adjust thresholds based on your data
ads.setThreshold('stream-1', 2.5); // Z-score threshold
const anomalies = ads.detectAnomaliesStatistical('stream-1', 2.5);
```

---

## 🔍 Debugging

### Enable Logging

```typescript
const manager = new AIModelManager();

manager.on('*', (event, data) => {
  console.log(`Event: ${event}`, data);
});
```

### Check Model Performance

```typescript
const performance = manager.getModelPerformance(model.id);
console.log(JSON.stringify(performance, null, 2));
```

### Verify Predictions

```typescript
const forecast = engine.forecastTimeSeries('series', 10);
forecast.forEach((pred, i) => {
  console.log(`Period ${i}: ${pred.predicted} [${pred.lower}, ${pred.upper}]`);
});
```

---

## 📚 Resources

### Documentation Files

- `PHASE_12_WEEK_1_PROGRESS.md` - Progress tracking
- `PHASE_12_WEEK_1_COMPLETION_REPORT.md` - Detailed report
- `PHASE_12_PLANNING.md` - Phase 12 roadmap

### Test Files

- `packages/charts/src/__tests__/integration/phase-12-week-1-ai-ml.test.ts` - 100+ examples

### Source Files

- `packages/charts/src/engine/ai/AIModelManager.ts`
- `packages/charts/src/engine/ai/PredictiveAnalyticsEngine.ts`
- `packages/charts/src/engine/ai/NLPIntegration.ts`
- `packages/charts/src/engine/ai/ComputerVisionIntegration.ts`
- `packages/charts/src/engine/ai/AnomalyDetectionSystem.ts`

---

## 🎓 Best Practices

1. **Always validate input data**
2. **Use appropriate algorithms for your use case**
3. **Monitor performance metrics**
4. **Handle errors gracefully**
5. **Clean up old data periodically**
6. **Use events for decoupling**
7. **Test with realistic data**
8. **Document your models**

---

**تاریخ**: 7 آپریل 2026  
**نسخه**: 1.0.0
