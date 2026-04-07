import React, { useMemo } from 'react';
import { useVirtualScroll } from '../hooks/useLazyLoad';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
}

/**
 * VirtualList Component
 * Renders only visible items in a scrollable container
 * Improves performance for large lists
 */
export const VirtualList = React.memo(function VirtualListComponent<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 3,
}: VirtualListProps<T>) {
  const { containerRef, handleScroll, visibleItems, offsetY, totalHeight, startIndex } =
    useVirtualScroll(items, {
      itemHeight,
      containerHeight,
      overscan,
    });

  // Memoize visible items to prevent unnecessary re-renders
  const renderedItems = useMemo(
    () =>
      visibleItems.map((item, index) => (
        <div
          key={startIndex + index}
          style={{
            height: itemHeight,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {renderItem(item, startIndex + index)}
        </div>
      )),
    [visibleItems, startIndex, itemHeight, renderItem]
  );

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`virtual-list ${className}`}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {renderedItems}
        </div>
      </div>
    </div>
  );
});

VirtualList.displayName = 'VirtualList';
