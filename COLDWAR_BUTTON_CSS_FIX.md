# Cold War Button - CSS Shorthand/Non-Shorthand Fix

## Issue

React warning: "Removing a style property during rerender (borderColor) when a conflicting property is set (border) can lead to styling bugs."

**Root Cause**: The component was using both shorthand and non-shorthand CSS properties for borders:

- Base styles: `border: 1px dashed rgba(...)`
- Hover state: `baseStyles.borderColor = rgba(...)`

This creates a conflict because React can't properly reconcile updates to `borderColor` when the base `border` shorthand is set.

## Solution

Replaced the shorthand `border` property with its component parts:

**Before**:

```typescript
border: `1px dashed rgba(${colors.rgb}, 0.5)`,
```

**After**:

```typescript
borderWidth: '1px',
borderStyle: 'dashed',
borderColor: `rgba(${colors.rgb}, 0.5)`,
```

## Benefits

1. ✅ Eliminates React warning about mixed shorthand/non-shorthand properties
2. ✅ Allows clean updates to `borderColor` on hover without conflicts
3. ✅ Maintains exact same visual appearance
4. ✅ Better CSS property management for dynamic updates

## Files Modified

- `packages/components/src/Button/ColdWarButton.tsx` - Line 260-280

## Verification

✅ No TypeScript diagnostics
✅ No React console warnings
✅ Visual appearance unchanged
✅ Hover effects work correctly
