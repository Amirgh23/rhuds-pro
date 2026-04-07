# Phase 10 - Quick Reference Guide

## Advanced Charts & Data Systems

---

## 🎯 نمودارهای جدید

### 1. Waterfall Chart

```typescript
import { WaterfallController } from '@rhuds/charts';

const chart = new Chart(canvas, {
  type: 'waterfall',
  data: {
    labels: ['Start', 'Revenue', 'Costs', 'End'],
    datasets: [
      {
        data: [100, 50, -30, 120],
        backgroundColor: '#0ff',
      },
    ],
  },
});
```

### 2. Sankey Chart

```typescript
const chart = new Chart(canvas, {
  type: 'sankey',
  data: {
    nodes: [
      { id: 'A', label: 'Source' },
      { id: 'B', label: 'Middle' },
      { id: 'C', label: 'Target' },
    ],
    links: [
      { source: 'A', target: 'B', value: 100 },
      { source: 'B', target: 'C', value: 80 },
    ],
  },
});
```

### 3. Treemap Chart

```typescript
const chart = new Chart(canvas, {
  type: 'treemap',
  data: {
    label: 'Root',
    value: 100,
    children: [
      { label: 'A', value: 60, color: '#f00' },
      { label: 'B', value: 40, color: '#0f0' },
    ],
  },
});
```

### 4. Heatmap Chart

```typescript
const chart = new Chart(canvas, {
  type: 'heatmap',
  data: {
    x: ['A', 'B', 'C'],
    y: ['1', '2', '3'],
    values: [
      [10, 20, 30],
      [40, 50, 60],
      [70, 80, 90],
    ],
  },
});
```

### 5. Gauge Chart

```typescript
const chart = new Chart(canvas, {
  type: 'gauge',
  data: {
    value: 75,
    min: 0,
    max: 100,
    label: 'Performance',
  },
});
```

### 6. Funnel Chart

```typescript
const chart = new Chart(canvas, {
  type: 'funnel',
  data: [
    { label: 'Visitors', value: 1000 },
    { label: 'Leads', value: 500 },
    { label: 'Customers', value: 100 },
  ],
});
```

### 7. Sunburst Chart

```typescript
const chart = new Chart(canvas, {
  type: 'sunburst',
  data: {
    label: 'Root',
    value: 100,
    children: [
      {
        label: 'A',
        value: 60,
        children: [
          { label: 'A1', value: 30 },
          { label: 'A2', value: 30 },
        ],
      },
    ],
  },
});
```

### 8. Gantt Chart

```typescript
const chart = new Chart(canvas, {
  type: 'gantt',
  data: [
    { name: 'Task 1', start: '2026-06-13', end: '2026-06-15', progress: 0.5 },
    { name: 'Task 2', start: '2026-06-15', end: '2026-06-18', progress: 0.8 },
  ],
});
```

### 9. Speedometer Chart

```typescript
const chart = new Chart(canvas, {
  type: 'speedometer',
  data: {
    value: 75,
    min: 0,
    max: 100,
    label: 'Speed',
    zones: [
      { start: 0, end: 0.33, color: '#f00', label: 'Slow' },
      { start: 0.33, end: 0.66, color: '#ff0', label: 'Medium' },
      { start: 0.66, end: 1, color: '#0f0', label: 'Fast' },
    ],
  },
});
```

### 10. Network Chart

```typescript
const chart = new Chart(canvas, {
  type: 'network',
  data: {
    nodes: [
      { id: 'A', label: 'Node A', size: 10 },
      { id: 'B', label: 'Node B', size: 15 },
      { id: 'C', label: 'Node C', size: 12 },
    ],
    edges: [
      { source: 0, target: 1, weight: 2 },
      { source: 1, target: 2, weight: 1 },
    ],
  },
});
```

---

## 🔧 سیستم‌های داده

### Streaming Data

```typescript
import { StreamingDataManager } from '@rhuds/charts';

const manager = new StreamingDataManager();

// Subscribe
const unsubscribe = manager.subscribe('chart1', (data) => {
  chart.data.datasets[0].data.push(...data);
  chart.update();
});

// Push data
manager.push('chart1', { x: 1, y: 10 });
manager.push('chart1', { x: 2, y: 20 });

// Cleanup
unsubscribe();
```

### Data Cache

```typescript
import { DataCache } from '@rhuds/charts';

const cache = new DataCache(5 * 60 * 1000, 100);

// Set
cache.set('data1', largeDataset);

// Get
const data = cache.get('data1');

// Check
if (cache.has('data1')) {
  // Use cached data
}

// Stats
console.log(cache.getStats());
```

### Data Normalization

```typescript
import { DataNormalizer } from '@rhuds/charts';

const data = [10, 20, 30, 40, 50];

// Min-Max normalization
const normalized = DataNormalizer.normalize(data);

// Z-score normalization
const zScored = DataNormalizer.zScoreNormalize(data);

// Log normalization
const logged = DataNormalizer.logNormalize(data);

// Percentile normalization
const percentile = DataNormalizer.percentileNormalize(data);

// Smooth data
const smoothed = DataNormalizer.smooth(data, 3);

// Remove outliers
const clean = DataNormalizer.removeOutliers(data);

// Fill missing values
const filled = DataNormalizer.fillMissing(data, 'mean');
```

---

## 📊 مقایسه سریع

| نمودار      | استفاده               | پیچیدگی |
| ----------- | --------------------- | ------- |
| Waterfall   | تغییرات تجمعی         | ⭐⭐    |
| Sankey      | جریان داده            | ⭐⭐⭐  |
| Treemap     | سلسله‌مراتبی          | ⭐⭐⭐  |
| Heatmap     | داده‌های 2D           | ⭐⭐    |
| Gauge       | یک مقدار              | ⭐      |
| Funnel      | مراحل تبدیل           | ⭐⭐    |
| Sunburst    | سلسله‌مراتبی دایره‌ای | ⭐⭐⭐  |
| Gantt       | نمودار زمانی          | ⭐⭐⭐  |
| Speedometer | سرعت/کارایی           | ⭐⭐    |
| Network     | ارتباطات              | ⭐⭐⭐  |

---

## 🎨 تم‌ها

تمام نمودارها از تم‌های RHUDS و ColdWar پشتیبانی می‌کنند:

```typescript
// RHUDS Theme
const chart = new Chart(canvas, {
  type: 'waterfall',
  data: { ... },
  options: {
    theme: 'rhuds'
  }
});

// ColdWar Theme
const chart = new Chart(canvas, {
  type: 'waterfall',
  data: { ... },
  options: {
    theme: 'coldwar'
  }
});
```

---

## 📈 Performance Tips

1. **استفاده از Caching**

   ```typescript
   const cache = new DataCache();
   cache.set('large-dataset', data);
   ```

2. **Streaming برای داده‌های زنده**

   ```typescript
   const manager = new StreamingDataManager();
   manager.setBatchConfig(10, 100); // 10 items per 100ms
   ```

3. **نرمال‌سازی داده‌ها**

   ```typescript
   const normalized = DataNormalizer.normalize(data);
   ```

4. **حذف نقاط پرت**
   ```typescript
   const clean = DataNormalizer.removeOutliers(data);
   ```

---

## 🐛 Troubleshooting

### نمودار نمایش داده نمی‌شود

- بررسی کنید که canvas element موجود است
- بررسی کنید که data format صحیح است
- بررسی کنید که controller ثبت شده است

### عملکرد کند است

- استفاده کنید از DataCache
- استفاده کنید از Streaming برای داده‌های بزرگ
- نرمال‌سازی داده‌ها

### خطاهای TypeScript

- import کنید از `@rhuds/charts`
- بررسی کنید types صحیح هستند
- استفاده کنید از type guards

---

## 📚 منابع

- `PHASE_10_WEEK_1_IMPLEMENTATION_SUMMARY.md` - جزئیات پیاده‌سازی
- `packages/charts/CHARTS_API.md` - API کامل
- `packages/demo-app/src/pages/ChartsShowcase.tsx` - مثال‌ها

---

**آخرین آپدیت**: 13 ژوئن 2026
