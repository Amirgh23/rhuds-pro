# Code Splitting Quick Reference

## Overview

JavaScript code splitting reduces initial bundle size by splitting code into smaller chunks that load on-demand.

## Key Files

| File                                  | Purpose                                     |
| ------------------------------------- | ------------------------------------------- |
| `src/config/code-splitting.config.ts` | Route and component splitting configuration |
| `src/utils/code-splitting.ts`         | Dynamic loading utilities                   |
| `src/hooks/useCodeSplitting.ts`       | React hooks for chunk management            |
| `src/utils/chunk-monitor.ts`          | Chunk size monitoring                       |
| `vite.config.ts`                      | Build configuration with manual chunks      |

## Quick Start

### 1. Prefetch a Route on Idle

```typescript
import { usePrefetchChunk } from './hooks/useCodeSplitting';

function MyComponent() {
  usePrefetchChunk('route-showcase', 'idle');
  return <div>Content</div>;
}
```

### 2. Prefetch on Route Hover

```typescript
import { usePrefetchOnHover } from './hooks/useCodeSplitting';

function Navigation() {
  const handleHover = usePrefetchOnHover(['route-showcase']);
  return <a href="/showcase" onMouseEnter={handleHover}>Showcase</a>;
}
```

### 3. Monitor Chunk Sizes

```typescript
import { monitorChunkSizes, logChunkSizeReport } from './utils/chunk-monitor';

async function checkSizes() {
  const report = await monitorChunkSizes();
  logChunkSizeReport(report);
}
```

### 4. Preload Critical Chunk

```typescript
import { usePreloadChunk } from './hooks/useCodeSplitting';

function CriticalComponent() {
  usePreloadChunk('vendor-react');
  return <div>Content</div>;
}
```

## Chunk Names

### Vendor Chunks

- `vendor-react` - React, React DOM, React Router
- `vendor-rhuds` - RHUDS core libraries
- `vendor-utils` - GSAP, Framer Motion

### Route Chunks

- `route-showcase` - Showcase page
- `route-playground` - Interactive playground
- `route-docs` - Documentation
- `route-coldwar` - Cold War showcase
- `route-charts` - Charts showcase

## Prefetch Strategies

### Idle Time (Default)

```typescript
usePrefetchChunk('route-showcase', 'idle');
// Prefetches when browser is idle (2s timeout)
```

### Immediate

```typescript
usePrefetchChunk('route-showcase', 'immediate');
// Prefetches immediately
```

### On Hover

```typescript
const handleHover = usePrefetchOnHover(['route-showcase']);
<a onMouseEnter={handleHover}>Link</a>
```

### On Fast Connection

```typescript
usePrefetchOnConnection(['route-charts', 'route-coldwar']);
// Only prefetches on 4G connections
```

## Size Limits

| Chunk Type | Limit  | Status               |
| ---------- | ------ | -------------------- |
| Main       | 100 KB | Critical if exceeded |
| Vendor     | 200 KB | Critical if exceeded |
| Route      | 50 KB  | Warning if exceeded  |
| Component  | 30 KB  | Warning if exceeded  |

## Performance Metrics

### Expected Improvements

- Initial Load: -100-150ms
- Initial Bundle: -30-40%
- TTI: -10-15%
- Route Load: -75%

### Monitoring

```typescript
// Automatic monitoring on page load
// Check console for chunk size report
// DevTools Network tab shows chunk loading
```

## Common Patterns

### Prefetch Popular Routes

```typescript
// In App.tsx
usePrefetchChunk('route-showcase', 'idle');
usePrefetchChunk('route-playground', 'idle');
```

### Prefetch on Fast Connection

```typescript
// In App.tsx
usePrefetchOnConnection(['route-coldwar', 'route-charts']);
```

### Monitor Bundle Size

```typescript
// Automatic on page load
// Manual check:
import { monitorChunkSizes } from './utils/chunk-monitor';
const report = await monitorChunkSizes();
```

## Troubleshooting

### Chunks Not Splitting

- Check `manualChunks` in vite.config.ts
- Verify routes are lazy-loaded
- Ensure chunk names are unique

### Large Chunks

- Review chunk size limits
- Consider further splitting
- Check for duplicate dependencies

### Prefetch Not Working

- Check browser console for errors
- Verify requestIdleCallback support
- Check Network tab for prefetch requests

## Build Commands

```bash
# Build with code splitting
npm run build

# Preview build
npm run preview

# Check chunk sizes
# Open DevTools Network tab after build
```

## DevTools Inspection

### Network Tab

1. Open DevTools → Network tab
2. Navigate between routes
3. Observe chunk loading times
4. Check chunk sizes

### Console

1. Open DevTools → Console
2. Check for chunk size report on page load
3. View optimization recommendations

## Advanced Usage

### Custom Chunk Strategy

```typescript
import { getChunkStrategy } from './utils/code-splitting';

const strategy = getChunkStrategy('route-showcase');
// Returns: 'preload' | 'prefetch' | 'lazy'
```

### Bundle Analysis

```typescript
import { analyzeBundleChunks, getChunkMetrics } from './utils/code-splitting';

const metrics = getChunkMetrics();
const analysis = analyzeBundleChunks(metrics);
console.log(analysis);
```

### Optimization Recommendations

```typescript
import { generateOptimizationRecommendations, monitorChunkSizes } from './utils/chunk-monitor';

const report = await monitorChunkSizes();
const recommendations = generateOptimizationRecommendations(report);
recommendations.forEach((rec) => console.log(rec));
```

## Best Practices

1. **Prefetch Popular Routes**: Use idle-time prefetch for frequently visited routes
2. **Monitor Chunk Sizes**: Regularly check chunk sizes against limits
3. **Use Preload Sparingly**: Only preload critical chunks
4. **Network-Aware Prefetch**: Prefetch heavy chunks only on fast connections
5. **Test Performance**: Use DevTools to verify improvements

## References

- [Vite Code Splitting](https://vitejs.dev/guide/features.html#code-splitting)
- [React.lazy](https://react.dev/reference/react/lazy)
- [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- [Resource Hints](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel)
