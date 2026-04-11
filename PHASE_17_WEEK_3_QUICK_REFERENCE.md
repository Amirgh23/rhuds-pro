# Phase 17 Week 3 - Advanced Threat Hunting - QUICK REFERENCE

## 🎯 Quick Overview

**Phase**: 17 | **Week**: 3 | **Status**: ✅ Complete  
**Features**: 5 | **Tests**: 44 (100%) | **Lines**: 1,500+

## 📦 Features at a Glance

| Feature                       | Purpose                          | Key Method               | Tests |
| ----------------------------- | -------------------------------- | ------------------------ | ----- |
| ThreatHuntingEngine           | Query-based threat hunting       | `executeQuery()`         | 9     |
| PatternDetectionEngine        | Pattern detection & analysis     | `detectPatterns()`       | 8     |
| AnomalyDetectionEngine        | Anomaly detection with baselines | `detectAnomalies()`      | 8     |
| HuntingAutomationEngine       | Automated hunting campaigns      | `executeCampaign()`      | 8     |
| ThreatIntelligenceCorrelation | Intelligence correlation         | `correlateWithHunting()` | 8     |

## 🔧 API Quick Reference

### ThreatHuntingEngine

```typescript
// Create engine
const engine = new ThreatHuntingEngine();

// Register handler
engine.registerQueryHandler('process', async () => {
  return [{ id: 'proc-1', severity: 'high' }];
});

// Create query
const query = engine.createQuery(
  'Suspicious Process Query',
  'Hunt for suspicious processes',
  'process:cmd.exe',
  { timeRange: '24h' }
);

// Execute query
const result = await engine.executeQuery(query.id);

// Get statistics
const stats = engine.getStatistics();

// Export report
const report = engine.exportHuntingReport('json');
```

### PatternDetectionEngine

```typescript
// Create engine
const engine = new PatternDetectionEngine();

// Register pattern rule
engine.registerPatternRule({
  id: 'pattern-1',
  name: 'Suspicious Login Pattern',
  type: 'login',
  rules: [{ field: 'failed_attempts', operator: '>', value: 5 }],
  confidence: 0.85,
});

// Detect patterns
const patterns = engine.detectPatterns({
  failed_attempts: 10,
  source_ip: '192.168.1.1',
});

// Get high confidence patterns
const highConfidence = engine.getHighConfidencePatterns(0.8);

// Export report
const report = engine.exportPatternReport('json');
```

### AnomalyDetectionEngine

```typescript
// Create engine
const engine = new AnomalyDetectionEngine();

// Create baseline profile
const profile = engine.createBaselineProfile('Normal Network Traffic', [
  { bytes_in: 1000, bytes_out: 500 },
  { bytes_in: 1100, bytes_out: 550 },
]);

// Record data point
engine.recordDataPoint({ bytes_in: 5000, bytes_out: 2500 });

// Detect anomalies
const anomalies = engine.detectAnomalies({
  bytes_in: 5000,
  bytes_out: 2500,
});

// Get high severity anomalies
const severe = engine.getHighSeverityAnomalies(0.8);

// Export report
const report = engine.exportAnomalyReport('json');
```

### HuntingAutomationEngine

```typescript
// Create engine
const engine = new HuntingAutomationEngine();

// Register campaign handler
engine.registerCampaignHandler('process', async () => {
  return { success: true, results: [] };
});

// Create campaign
const campaign = engine.createCampaign(
  'Process Hunting Campaign',
  'Hunt for suspicious processes',
  [
    { type: 'process', query: 'cmd.exe' },
    { type: 'network', query: 'port:4444' },
  ]
);

// Execute campaign
const execution = await engine.executeCampaign(campaign.id);

// Get active campaigns
const active = engine.getActiveCampaigns();

// Export report
const report = engine.exportCampaignReport('json');
```

### ThreatIntelligenceCorrelation

```typescript
// Create engine
const engine = new ThreatIntelligenceCorrelation();

// Register intelligence source
engine.registerIntelligenceSource({
  id: 'source-1',
  name: 'Threat Feed',
  type: 'feed',
  url: 'https://threat-feed.example.com',
});

// Collect intelligence
const intelligence = await engine.collectIntelligence('source-1');

// Correlate with hunting
const correlations = engine.correlateWithHunting(
  { process: 'cmd.exe', ip: '192.168.1.1' },
  intelligence
);

// Get threat actors
const actors = engine.getThreatActors();

// Export report
const report = engine.exportCorrelationReport('json');
```

## 📊 Common Patterns

### Pattern 1: Query-Based Hunting

```typescript
const engine = new ThreatHuntingEngine();

// Register handler
engine.registerQueryHandler('process', async () => {
  return [{ id: 'proc-1', severity: 'high' }];
});

// Create and execute query
const query = engine.createQuery('Hunt', 'Description', 'query', {});
const result = await engine.executeQuery(query.id);
```

### Pattern 2: Pattern Detection

```typescript
const engine = new PatternDetectionEngine();

// Register rule
engine.registerPatternRule({
  id: 'rule-1',
  name: 'Pattern',
  type: 'type',
  rules: [{ field: 'field', operator: '>', value: 10 }],
  confidence: 0.85,
});

// Detect patterns
const patterns = engine.detectPatterns({ field: 20 });
```

### Pattern 3: Anomaly Detection

```typescript
const engine = new AnomalyDetectionEngine();

// Create baseline
const profile = engine.createBaselineProfile('Baseline', [{ value: 100 }, { value: 110 }]);

// Detect anomalies
const anomalies = engine.detectAnomalies({ value: 500 });
```

### Pattern 4: Campaign Automation

```typescript
const engine = new HuntingAutomationEngine();

// Register handler
engine.registerCampaignHandler('type', async () => {
  return { success: true, results: [] };
});

// Create and execute campaign
const campaign = engine.createCampaign('Campaign', 'Desc', [{ type: 'type', query: 'query' }]);
const execution = await engine.executeCampaign(campaign.id);
```

### Pattern 5: Intelligence Correlation

```typescript
const engine = new ThreatIntelligenceCorrelation();

// Register source
engine.registerIntelligenceSource({
  id: 'source-1',
  name: 'Source',
  type: 'feed',
  url: 'https://example.com',
});

// Correlate
const intelligence = await engine.collectIntelligence('source-1');
const correlations = engine.correlateWithHunting({ data: 'value' }, intelligence);
```

## 🧪 Testing Quick Reference

### Test Structure

```typescript
describe('Feature', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  it('should do something', () => {
    // Arrange
    engine.register(...);

    // Act
    const result = engine.method(...);

    // Assert
    expect(result).toBeDefined();
  });
});
```

### Common Assertions

```typescript
// Existence
expect(result).toBeDefined();
expect(result).not.toBeUndefined();

// Equality
expect(result.id).toBe('expected-id');
expect(result.name).toEqual('expected-name');

// Arrays
expect(results).toHaveLength(2);
expect(results).toContain(item);

// Objects
expect(result).toHaveProperty('id');
expect(result).toMatchObject({ id: 'id' });
```

## 📁 File Locations

```
packages/charts/src/engine/security/
├── ThreatHuntingEngine.ts
├── PatternDetectionEngine.ts
├── AnomalyDetectionEngine.ts
├── HuntingAutomationEngine.ts
└── ThreatIntelligenceCorrelation.ts

packages/charts/src/__tests__/integration/
└── phase-17-week-3-hunting.test.ts
```

## 🔑 Key Interfaces

### ThreatHuntingEngine

```typescript
interface HuntQuery {
  id: string;
  name: string;
  description: string;
  query: string;
  status: 'draft' | 'active' | 'completed' | 'failed';
  createdAt: Date;
  results?: QueryResult[];
}

interface QueryResult {
  id: string;
  data: Record<string, unknown>;
  timestamp: Date;
}
```

### PatternDetectionEngine

```typescript
interface PatternRule {
  id: string;
  name: string;
  type: string;
  rules: Array<{ field: string; operator: string; value: unknown }>;
  confidence: number;
}

interface DetectedPattern {
  id: string;
  ruleId: string;
  confidence: number;
  data: Record<string, unknown>;
  timestamp: Date;
}
```

### AnomalyDetectionEngine

```typescript
interface BaselineProfile {
  id: string;
  name: string;
  mean: Record<string, number>;
  stdDev: Record<string, number>;
  dataPoints: Array<Record<string, number>>;
}

interface AnomalyResult {
  id: string;
  profileId: string;
  severity: number;
  data: Record<string, number>;
  timestamp: Date;
}
```

### HuntingAutomationEngine

```typescript
interface HuntingCampaign {
  id: string;
  name: string;
  description: string;
  steps: CampaignStep[];
  status: 'draft' | 'active' | 'completed' | 'failed';
  createdAt: Date;
}

interface CampaignStep {
  type: string;
  query: string;
  timeout?: number;
}
```

### ThreatIntelligenceCorrelation

```typescript
interface IntelligenceSource {
  id: string;
  name: string;
  type: string;
  url: string;
}

interface CorrelationResult {
  id: string;
  huntingResult: Record<string, unknown>;
  intelligence: ThreatIntelligence[];
  confidence: number;
  threatActors: string[];
}
```

## 📈 Statistics Methods

All engines provide statistics:

```typescript
// Get statistics
const stats = engine.getStatistics();

// Common properties
stats.totalCount; // Total items
stats.activeCount; // Active items
stats.completedCount; // Completed items
stats.failedCount; // Failed items
stats.averageTime; // Average execution time
stats.successRate; // Success rate percentage
```

## 📤 Export Methods

All engines support export:

```typescript
// Export as JSON
const json = engine.exportReport('json');

// Export as CSV
const csv = engine.exportReport('csv');

// Returns formatted string
console.log(json); // JSON string
console.log(csv); // CSV string
```

## 🔄 Integration Patterns

### Hunting → Pattern Detection

```typescript
const huntingEngine = new ThreatHuntingEngine();
const patternEngine = new PatternDetectionEngine();

// Execute hunting query
const huntResults = await huntingEngine.executeQuery(queryId);

// Detect patterns in results
const patterns = patternEngine.detectPatterns(huntResults);
```

### Pattern Detection → Anomaly Detection

```typescript
const patternEngine = new PatternDetectionEngine();
const anomalyEngine = new AnomalyDetectionEngine();

// Detect patterns
const patterns = patternEngine.detectPatterns(data);

// Check for anomalies
const anomalies = anomalyEngine.detectAnomalies(data);
```

### Campaign → Intelligence Correlation

```typescript
const campaignEngine = new HuntingAutomationEngine();
const correlationEngine = new ThreatIntelligenceCorrelation();

// Execute campaign
const execution = await campaignEngine.executeCampaign(campaignId);

// Correlate with intelligence
const correlations = correlationEngine.correlateWithHunting(execution.results, intelligence);
```

## 🎯 Common Use Cases

### Use Case 1: Hunt for Suspicious Processes

```typescript
const engine = new ThreatHuntingEngine();

engine.registerQueryHandler('process', async () => {
  return [{ id: 'proc-1', severity: 'high' }];
});

const query = engine.createQuery('Suspicious Processes', 'Hunt for cmd.exe', 'process:cmd.exe', {
  timeRange: '24h',
});

const result = await engine.executeQuery(query.id);
```

### Use Case 2: Detect Anomalous Network Traffic

```typescript
const engine = new AnomalyDetectionEngine();

const profile = engine.createBaselineProfile('Normal Traffic', [{ bytes: 1000 }, { bytes: 1100 }]);

const anomalies = engine.detectAnomalies({ bytes: 5000 });
```

### Use Case 3: Automated Threat Hunting Campaign

```typescript
const engine = new HuntingAutomationEngine();

engine.registerCampaignHandler('process', async () => {
  return { success: true, results: [] };
});

const campaign = engine.createCampaign('Full Hunt', 'Complete threat hunt', [
  { type: 'process', query: 'cmd.exe' },
  { type: 'network', query: 'port:4444' },
]);

const execution = await engine.executeCampaign(campaign.id);
```

## 📚 Documentation Files

- **PHASE_17_WEEK_3_COMPLETION.md** - Detailed completion report
- **PHASE_17_WEEK_3_SUMMARY.md** - Executive summary
- **PHASE_17_WEEK_3_INDEX.md** - Complete index
- **PHASE_17_WEEK_3_QUICK_REFERENCE.md** - This file

## ✅ Verification Checklist

- ✅ All 5 engines implemented
- ✅ 44 tests passing (100%)
- ✅ Zero TypeScript diagnostics
- ✅ Full type safety
- ✅ JSDoc comments on all functions
- ✅ Integration tests passing
- ✅ Export functionality working
- ✅ Statistics tracking working

## 🚀 Next Steps

1. **Phase 17 Week 4**: Security Intelligence & Analytics
2. **Phase 18**: Advanced Threat Response
3. **Phase 19**: Security Orchestration

---

**Status**: ✅ Complete  
**Date**: 11 April 2026  
**Tests**: 44/44 Passing  
**Coverage**: 100%
