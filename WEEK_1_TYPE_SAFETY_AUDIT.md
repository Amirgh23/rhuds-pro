# هفته 1: تدقیق ایمنی نوع (Type Safety Audit)

**تاریخ شروع**: 8 آپریل 2026  
**هدف**: شناسایی و ثبت تمام مشکلات Type Safety  
**مدت زمان**: 1-2 روز

---

## 📊 خلاصه یافته‌ها

### کل مشکلات شناسایی‌شده: 30+ مورد

| پکیج     | تعداد `any` | فایل‌های مشکل‌دار                                                                   | اولویت         |
| -------- | ----------- | ----------------------------------------------------------------------------------- | -------------- |
| webgl    | 1           | RHUDSWebGLRenderer.ts                                                               | 🔴 بالا        |
| hooks    | 5           | useThrottle.ts, useFormField.ts, useAsync.ts                                        | 🔴 بالا        |
| frames   | 12          | FrameVariantGenerator.ts                                                            | 🟡 متوسط       |
| demo-app | 4           | cache-worker.ts, edge-caching.ts, cache-invalidation.ts, ad-network-optimization.ts | 🟡 متوسط       |
| core     | 2           | state-management.unit.test.ts, advanced-audio.unit.test.ts                          | 🟢 کم (تست‌ها) |

---

## 🔴 مشکلات بحرانی

### 1. packages/webgl/src/RHUDSWebGLRenderer.ts

**خط 70**: `setupOrbitControls(config?: any): OrbitControls`

```typescript
// ❌ فعلی
setupOrbitControls(config?: any): OrbitControls {
  this.controls = new OrbitControls(this.camera, this.renderer.domElement, config);
  return this.controls;
}

// ✅ بهبود‌شده
interface OrbitControlsConfig {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableDamping?: boolean;
  dampingFactor?: number;
  enableZoom?: boolean;
  zoomSpeed?: number;
  enablePan?: boolean;
  panSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
}

setupOrbitControls(config?: OrbitControlsConfig): OrbitControls {
  this.controls = new OrbitControls(this.camera, this.renderer.domElement, config);
  return this.controls;
}
```

**اقدام**:

- [ ] ایجاد interface `OrbitControlsConfig`
- [ ] بروزرسانی method signature
- [ ] اضافه‌کردن JSDoc

---

### 2. packages/hooks/src/useFormField.ts

**مشکلات**:

- خط 5: `value?: any;` (FormValidationRule)
- خط 7: `validator?: (value: any) => boolean | Promise<boolean>;`
- خط 11: `value: any;` (UseFormFieldReturn)
- خط 15: `value: any;` (inputProps)
- خط 19: `setValue: (value: any) => void;`
- خط 26: `initialValue: any = ''`
- خط 34: `async (val: any) => {`

```typescript
// ❌ فعلی
export interface FormValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message?: string;
  validator?: (value: any) => boolean | Promise<boolean>;
}

export interface UseFormFieldReturn {
  value: any;
  error: string;
  touched: boolean;
  inputProps: {
    value: any;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
  setValue: (value: any) => void;
  setError: (error: string) => void;
  setTouched: (touched: boolean) => void;
}

// ✅ بهبود‌شده
export interface FormValidationRule<T = string> {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  value?: T;
  message?: string;
  validator?: (value: T) => boolean | Promise<boolean>;
}

export interface UseFormFieldReturn<T = string> {
  value: T;
  error: string;
  touched: boolean;
  inputProps: {
    value: T;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
  setValue: (value: T) => void;
  setError: (error: string) => void;
  setTouched: (touched: boolean) => void;
}

export function useFormField<T = string>(
  name: string,
  initialValue: T = '' as T,
  validationRules: FormValidationRule<T>[] = []
): UseFormFieldReturn<T> {
  const validate = useCallback(
    async (val: T) => {
      for (const rule of validationRules) {
        if (rule.type === 'required' && !val) {
          // ...
        }
      }
    },
    [validationRules]
  );
  // ...
}
```

**اقدام**:

- [ ] اضافه‌کردن Generic Type `<T>`
- [ ] بروزرسانی تمام references
- [ ] اضافه‌کردن JSDoc

---

### 3. packages/hooks/src/useThrottle.ts

**خط 3**: `export function useThrottle<T extends (...args: any[]) => void>`

```typescript
// ❌ فعلی
export function useThrottle<T extends (...args: any[]) => void>(callback: T, delay: number): T {
  // ...
}

// ✅ بهبود‌شده
export function useThrottle<T extends (...args: unknown[]) => void>(callback: T, delay: number): T {
  // ...
}
```

**اقدام**:

- [ ] جایگزینی `any[]` با `unknown[]`

---

### 4. packages/hooks/src/useAsync.ts

**خط 12**: `dependencies: any[] = []`

```typescript
// ❌ فعلی
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
): UseAsyncReturn<T> {
  // ...
}

// ✅ بهبود‌شده
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: DependencyList = []
): UseAsyncReturn<T> {
  // ...
}
```

**اقدام**:

- [ ] استفاده از `DependencyList` از React

---

### 5. packages/frames/src/advanced/FrameVariantGenerator.ts

**مشکلات** (12 مورد):

- خط 13: `generateVariants(baseConfig: any): any[]`
- خط 14: `const variants: any[] = [];`
- خط 46: `private createSizeVariant(size: string, baseConfig: any): any`
- خط 47: `const sizeMap: any = {`
- خط 66: `private createStyleVariant(style: string, baseConfig: any): any`
- خط 67: `const styleMap: any = {`
- خط 87: `private createAnimationVariant(animation: string, baseConfig: any): any`
- خط 88: `const animationMap: any = {`
- خط 108: `private createCornerVariant(corner: string, baseConfig: any): any`
- خط 109: `const cornerMap: any = {`
- خط 129: `registerVariant(id: string, config: any): void`
- خط 136: `getVariant(id: string): any`
- خط 143: `getAllVariants(): any[]`
- خط 155: `createComposite(name: string, variants: string[]): any`

```typescript
// ❌ فعلی
generateVariants(baseConfig: any): any[] {
  const variants: any[] = [];
  // ...
}

// ✅ بهبود‌شده
interface FrameConfig {
  padding?: number;
  strokeWidth?: number;
  fontSize?: number;
  fill?: boolean;
  stroke?: boolean;
  opacity?: number;
  borderRadius?: number;
  cornerStyle?: 'sharp' | 'rounded' | 'beveled';
  duration?: number;
  keyframes?: string[];
}

interface FrameVariant extends FrameConfig {
  id: string;
  type: 'size' | 'style' | 'animation' | 'corner' | 'composite';
  name?: string;
}

generateVariants(baseConfig: FrameConfig): FrameVariant[] {
  const variants: FrameVariant[] = [];
  // ...
}

private createSizeVariant(size: string, baseConfig: FrameConfig): FrameVariant {
  const sizeMap: Record<string, Partial<FrameConfig>> = {
    small: { padding: 8, strokeWidth: 1, fontSize: 12 },
    medium: { padding: 16, strokeWidth: 2, fontSize: 14 },
    large: { padding: 24, strokeWidth: 3, fontSize: 16 },
  };
  // ...
}

getVariant(id: string): FrameVariant | undefined {
  return this.variants.get(id);
}

getAllVariants(): FrameVariant[] {
  const all: FrameVariant[] = [];
  this.variants.forEach((variant, id) => {
    all.push({ id, ...variant });
  });
  return all;
}
```

**اقدام**:

- [ ] ایجاد interfaces: `FrameConfig`, `FrameVariant`
- [ ] استفاده از `Record<string, T>` به جای `any`
- [ ] بروزرسانی تمام methods

---

### 6. packages/demo-app/src/workers/cache-worker.ts

**خط 151**: `async fetch(request: Request, env: any, ctx: any): Promise<Response>`

```typescript
// ❌ فعلی
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    // ...
  },
  async scheduled(event: any, env: any, ctx: any): Promise<void> {
    // ...
  },
};

// ✅ بهبود‌شده
interface CloudflareEnv {
  CACHE_BUCKET?: R2Bucket;
  CACHE_KV?: KVNamespace;
  CACHE_TTL?: string;
}

interface CloudflareContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

interface ScheduledEvent {
  cron: string;
  scheduledTime: number;
}

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: CloudflareContext): Promise<Response> {
    // ...
  },
  async scheduled(
    event: ScheduledEvent,
    env: CloudflareEnv,
    ctx: CloudflareContext
  ): Promise<void> {
    // ...
  },
};
```

**اقدام**:

- [ ] ایجاد interfaces برای Cloudflare types
- [ ] بروزرسانی method signatures

---

### 7. packages/demo-app/src/utils/edge-caching.ts

**خط 28**: `value: any;`

```typescript
// ❌ فعلی
export interface CacheEntry {
  key: string;
  value: any;
  timestamp: number;
  ttl: number;
}

get(key: string): any | null {
  // ...
}

set(key: string, value: any, ttl: number = 3600): void {
  // ...
}

// ✅ بهبود‌شده
export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
}

export class EdgeCache<T = unknown> {
  get(key: string): T | null {
    // ...
  }

  set(key: string, value: T, ttl: number = 3600): void {
    // ...
  }
}
```

**اقدام**:

- [ ] اضافه‌کردن Generic Type
- [ ] بروزرسانی class definition

---

### 8. packages/demo-app/src/utils/cache-invalidation.ts

**خط 313**: `private eventHandlers: Map<string, Set<(data?: any) => void>>`

```typescript
// ❌ فعلی
export class EventBasedInvalidation {
  private eventHandlers: Map<string, Set<(data?: any) => void>> = new Map();

  on(event: string, handler: (data?: any) => void): () => void {
    // ...
  }

  emit(event: string, data?: any): void {
    // ...
  }

  off(event: string, handler: (data?: any) => void): void {
    // ...
  }
}

// ✅ بهبود‌شده
export class EventBasedInvalidation<T = unknown> {
  private eventHandlers: Map<string, Set<(data?: T) => void>> = new Map();

  on(event: string, handler: (data?: T) => void): () => void {
    // ...
  }

  emit(event: string, data?: T): void {
    // ...
  }

  off(event: string, handler: (data?: T) => void): void {
    // ...
  }
}
```

**اقدام**:

- [ ] اضافه‌کردن Generic Type
- [ ] بروزرسانی تمام methods

---

### 9. packages/demo-app/src/utils/ad-network-optimization.ts

**خط 236**: `data.ads.forEach((ad: any, index: number) => {`

```typescript
// ❌ فعلی
data.ads.forEach((ad: any, index: number) => {
  // ...
});

// ✅ بهبود‌شده
interface AdData {
  id: string;
  title: string;
  url: string;
  impressions?: number;
  clicks?: number;
  ctr?: number;
}

interface AdResponse {
  ads: AdData[];
  timestamp: number;
  status: 'success' | 'error';
}

data.ads.forEach((ad: AdData, index: number) => {
  // ...
});
```

**اقدام**:

- [ ] ایجاد interfaces: `AdData`, `AdResponse`
- [ ] بروزرسانی loop

---

## 🟡 مشکلات تست‌ها (کم اولویت)

### packages/core/src/**tests**/state-management.unit.test.ts

**خط 15**: `let store: any;`

```typescript
// ❌ فعلی
let store: any;

// ✅ بهبود‌شده
import type { Store } from '@reduxjs/toolkit';
import type { RootState } from '../store';

let store: Store<RootState>;
```

**اقدام**:

- [ ] استفاده از proper Redux types

---

### packages/core/src/**tests**/advanced-audio.unit.test.ts

**خط 236**: `let analyser: any;`

```typescript
// ❌ فعلی
let analyser: any;

// ✅ بهبود‌شده
let analyser: AnalyserNode;
```

**اقدام**:

- [ ] استفاده از Web Audio API types

---

## 📋 برنامه اجرایی

### روز 1: تشخیص و ثبت ✅

- [x] شناسایی تمام `any` types
- [x] دسته‌بندی بر اساس اولویت
- [x] ایجاد این گزارش

### روز 2: فعال‌کردن Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### روز 3-5: جایگزینی `any`

**ترتیب اولویت**:

1. packages/webgl (1 مورد) - 1 ساعت
2. packages/hooks (5 مورد) - 2 ساعت
3. packages/frames (12 مورد) - 4 ساعت
4. packages/demo-app (4 مورد) - 2 ساعت
5. packages/core tests (2 مورد) - 1 ساعت

### روز 6: اضافه‌کردن ESLint Rules

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error"
  }
}
```

---

## ✅ معیارهای موفقیت

- [ ] 0% `any` types در production code
- [ ] TypeScript Strict Mode فعال
- [ ] ESLint rules اضافه‌شده
- [ ] تمام tests pass می‌شوند
- [ ] بدون runtime errors

---

## 📝 یادداشت‌های مهم

1. **Generic Types**: استفاده از `<T>` برای flexibility
2. **Record vs any**: `Record<string, T>` بهتر از `any` است
3. **DependencyList**: از React types استفاده کنید
4. **Interfaces**: برای هر object type یک interface بسازید
5. **JSDoc**: هر function باید JSDoc داشته باشد

---

**وضعیت**: 🟡 در حال انجام  
**آخرین بروزرسانی**: 8 آپریل 2026
