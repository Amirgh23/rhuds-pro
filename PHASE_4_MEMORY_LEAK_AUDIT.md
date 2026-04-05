# Phase 4 - Comprehensive Memory Leak Audit & Remaining Fixes

## Overview

Conducted full codebase scan for remaining manual timer management (setInterval/setTimeout) that could cause memory leaks. Found 5 additional components requiring cleanup hook conversion.

## Components Identified for Cleanup

### 1. IntroPageFuturistic.tsx ⚠️

**File**: `packages/demo-app/src/pages/IntroPageFuturistic.tsx`
**Issues Found**:

- Line 185-197: `setInterval` for loading progress animation (20ms interval)
- Line 293-300: `setInterval` for terminal typing animation (50ms interval)

**Timers**:

- Loading progress: 20ms interval, runs until progress >= 100
- Terminal typing: 50ms interval, runs until text fully typed

**Fix Strategy**: Replace both with `useInterval` hooks

### 2. IntroPage.tsx ⚠️

**File**: `packages/demo-app/src/pages/IntroPage.tsx`
**Issues Found**:

- Line 64-66: `setTimeout` for initial load (100ms)
- Line 76-95: `setInterval` for typing effect with variable speed (60-100ms interval)
- Line 107-110: `setInterval` for glitch effect (2000-4000ms interval)
- Line 141-147: `setInterval` for stats animation (stepDuration variable)

**Timers**:

- Initial load: 100ms timeout
- Typing effect: Complex nested intervals with variable timing
- Glitch effect: 2000-4000ms interval
- Stats animation: 60 steps over 2000ms

**Fix Strategy**: Replace all with `useInterval` and `useTimeout` hooks

### 3. ColdWarIntro.tsx ⚠️

**File**: `packages/demo-app/src/pages/ColdWarIntro.tsx`
**Issues Found**:

- Line 498-505: `setInterval` for terminal typing animation (50ms interval)

**Timers**:

- Terminal typing: 50ms interval, runs until text fully typed

**Fix Strategy**: Replace with `useInterval` hook

### 4. ShowcasePage.tsx ⚠️

**File**: `packages/demo-app/src/pages/ShowcasePage.tsx`
**Issues Found**:

- Line 185-190: Multiple `clearTimeout` calls (3 timeouts)
- Line 206-211: Multiple `clearTimeout` calls (3 timeouts)
- Line 227-230: Multiple `clearTimeout` calls (2 timeouts)

**Timers**:

- Multiple timeouts for tab switching animations

**Fix Strategy**: Replace with `useTimeout` hooks

### 5. useComponentAnimation.ts ⚠️

**File**: `packages/hooks/src/useComponentAnimation.ts`
**Issues Found**:

- Line 60: `clearTimeout` in useEffect return

**Timers**:

- Animation timeout

**Fix Strategy**: Already has cleanup, but verify it's using proper hook pattern

### 6. useDebounce.ts ⚠️

**File**: `packages/hooks/src/useDebounce.ts`
**Issues Found**:

- Line 12: `clearTimeout` in useEffect return

**Timers**:

- Debounce timeout

**Fix Strategy**: Already has cleanup, but verify it's using proper hook pattern

### 7. useIntersectionObserver.ts ⚠️

**File**: `packages/demo-app/src/pages/intro-page/hooks/useIntersectionObserver.ts`
**Issues Found**:

- Line 289-291: `clearTimeout` in conditional
- Line 297-299: `clearTimeout` in cleanup

**Timers**:

- Intersection observer timeout

**Fix Strategy**: Already has cleanup, verify pattern

### 8. useAnimationSequence.ts ⚠️

**File**: `packages/demo-app/src/pages/intro-page/hooks/useAnimationSequence.ts`
**Issues Found**:

- Line 46-49: `clearTimeout` in useEffect return
- Line 70-72: Multiple `clearTimeout` calls in cleanup

**Timers**:

- Animation sequence timeouts

**Fix Strategy**: Already has cleanup, verify pattern

### 9. useScrollToTop.ts ⚠️

**File**: `packages/demo-app/src/hooks/useScrollToTop.ts`
**Issues Found**:

- Line 53-56: Multiple `clearTimeout` calls in cleanup

**Timers**:

- Scroll animation timeouts

**Fix Strategy**: Already has cleanup, verify pattern

### 10. animation.ts ⚠️

**File**: `packages/demo-app/src/pages/intro-page/utils/animation.ts`
**Issues Found**:

- Line 241-243: `clearTimeout` in cancel function

**Timers**:

- Animation timeout

**Fix Strategy**: Already has cleanup, verify pattern

## Priority Ranking

### CRITICAL (Active Memory Leaks)

1. **IntroPageFuturistic.tsx** - 2 active intervals
2. **IntroPage.tsx** - 4 active intervals/timeouts
3. **ColdWarIntro.tsx** - 1 active interval

### HIGH (Potential Issues)

4. **ShowcasePage.tsx** - Multiple timeouts

### MEDIUM (Already Has Cleanup)

5. useComponentAnimation.ts
6. useDebounce.ts
7. useIntersectionObserver.ts
8. useAnimationSequence.ts
9. useScrollToTop.ts
10. animation.ts

## Cleanup Utilities Available

From `packages/core/src/utils/useCleanup.ts`:

- `useInterval(callback, delay)` - Automatic interval cleanup
- `useTimeout(callback, delay)` - Automatic timeout cleanup
- `useAnimationFrame(callback, enabled)` - Automatic animation frame cleanup
- `useEventListener(eventName, handler, element, options)` - Automatic event listener cleanup

## Implementation Plan

### Phase 4A: Fix Critical Components (3 files)

1. IntroPageFuturistic.tsx - Replace 2 intervals
2. IntroPage.tsx - Replace 4 intervals/timeouts
3. ColdWarIntro.tsx - Replace 1 interval

### Phase 4B: Fix High Priority (1 file)

4. ShowcasePage.tsx - Replace multiple timeouts

### Phase 4C: Verify Medium Priority (6 files)

5-10. Verify existing cleanup patterns are correct

## Expected Outcomes

- **Before**: 10+ active timer leaks across 10 files
- **After**: 0 manual timer management, all using automatic cleanup hooks
- **Code Quality**: Improved (less error-prone)
- **Maintainability**: Improved (clearer intent)
- **Performance**: Maintained (same behavior, better cleanup)

## Next Steps

1. Fix IntroPageFuturistic.tsx
2. Fix IntroPage.tsx
3. Fix ColdWarIntro.tsx
4. Fix ShowcasePage.tsx
5. Verify medium priority files
6. Run format, lint, type-check, tests
7. Build and verify
8. Create comprehensive PR

## Files to Modify

- packages/demo-app/src/pages/IntroPageFuturistic.tsx
- packages/demo-app/src/pages/IntroPage.tsx
- packages/demo-app/src/pages/ColdWarIntro.tsx
- packages/demo-app/src/pages/ShowcasePage.tsx
- packages/hooks/src/useComponentAnimation.ts (verify)
- packages/hooks/src/useDebounce.ts (verify)
- packages/demo-app/src/pages/intro-page/hooks/useIntersectionObserver.ts (verify)
- packages/demo-app/src/pages/intro-page/hooks/useAnimationSequence.ts (verify)
- packages/demo-app/src/hooks/useScrollToTop.ts (verify)
- packages/demo-app/src/pages/intro-page/utils/animation.ts (verify)
