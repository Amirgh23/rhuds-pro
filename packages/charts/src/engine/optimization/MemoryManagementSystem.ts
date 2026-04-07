/**
 * Memory Management System
 * سیستم مدیریت حافظه برای بهینه‌سازی استفاده از منابع
 *
 * Features:
 * - Memory pooling
 * - Garbage collection
 * - Leak detection
 * - Resource tracking
 */

export interface MemoryBlock {
  id: string;
  size: number;
  allocated: boolean;
  timestamp: number;
  data?: any;
}

export interface MemoryStats {
  totalMemory: number;
  usedMemory: number;
  freeMemory: number;
  fragmentationRatio: number;
  gcCount: number;
  leaksDetected: number;
}

export interface ResourceAllocation {
  id: string;
  type: string;
  size: number;
  timestamp: number;
  released: boolean;
}

export class MemoryManagementSystem {
  private memoryPool: Map<string, MemoryBlock>;
  private resourceAllocations: Map<string, ResourceAllocation>;
  private stats: {
    totalAllocations: number;
    totalDeallocations: number;
    gcRuns: number;
    leaksFound: number;
  };
  private poolSize: number;

  constructor(poolSize: number = 100 * 1024 * 1024) {
    this.memoryPool = new Map();
    this.resourceAllocations = new Map();
    this.poolSize = poolSize;
    this.stats = {
      totalAllocations: 0,
      totalDeallocations: 0,
      gcRuns: 0,
      leaksFound: 0,
    };

    this.initializePool();
  }

  /**
   * Initialize memory pool
   */
  private initializePool(): void {
    const blockSize = 1024 * 1024; // 1MB blocks
    const blockCount = Math.floor(this.poolSize / blockSize);

    for (let i = 0; i < blockCount; i++) {
      const blockId = `block-${i}`;
      this.memoryPool.set(blockId, {
        id: blockId,
        size: blockSize,
        allocated: false,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Allocate memory
   */
  public allocate(size: number, type: string = 'general'): string {
    const blockId = this.findFreeBlock(size);
    if (!blockId) {
      this.runGarbageCollection();
      return this.allocate(size, type);
    }

    const block = this.memoryPool.get(blockId);
    if (block) {
      block.allocated = true;
      block.timestamp = Date.now();
    }

    const allocationId = `alloc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.resourceAllocations.set(allocationId, {
      id: allocationId,
      type,
      size,
      timestamp: Date.now(),
      released: false,
    });

    this.stats.totalAllocations++;

    return allocationId;
  }

  /**
   * Find free memory block
   */
  private findFreeBlock(size: number): string | null {
    for (const [blockId, block] of this.memoryPool) {
      if (!block.allocated && block.size >= size) {
        return blockId;
      }
    }
    return null;
  }

  /**
   * Deallocate memory
   */
  public deallocate(allocationId: string): boolean {
    const allocation = this.resourceAllocations.get(allocationId);
    if (!allocation) return false;

    allocation.released = true;
    this.stats.totalDeallocations++;

    return true;
  }

  /**
   * Run garbage collection
   */
  public runGarbageCollection(): void {
    const now = Date.now();
    const timeout = 60000; // 1 minute

    for (const [allocationId, allocation] of this.resourceAllocations) {
      if (allocation.released && now - allocation.timestamp > timeout) {
        this.resourceAllocations.delete(allocationId);
      }
    }

    // Mark released blocks as free
    for (const [blockId, block] of this.memoryPool) {
      if (block.allocated && now - block.timestamp > timeout) {
        block.allocated = false;
      }
    }

    this.stats.gcRuns++;
  }

  /**
   * Detect memory leaks
   */
  public detectLeaks(): ResourceAllocation[] {
    const leaks: ResourceAllocation[] = [];
    const now = Date.now();
    const leakThreshold = 300000; // 5 minutes

    for (const allocation of this.resourceAllocations.values()) {
      if (!allocation.released && now - allocation.timestamp > leakThreshold) {
        leaks.push(allocation);
      }
    }

    this.stats.leaksFound += leaks.length;

    return leaks;
  }

  /**
   * Get memory statistics
   */
  public getMemoryStats(): MemoryStats {
    let usedMemory = 0;
    let allocatedBlocks = 0;

    for (const block of this.memoryPool.values()) {
      if (block.allocated) {
        usedMemory += block.size;
        allocatedBlocks++;
      }
    }

    const freeMemory = this.poolSize - usedMemory;
    const fragmentationRatio =
      allocatedBlocks > 0 ? (this.memoryPool.size - allocatedBlocks) / this.memoryPool.size : 0;

    return {
      totalMemory: this.poolSize,
      usedMemory,
      freeMemory,
      fragmentationRatio,
      gcCount: this.stats.gcRuns,
      leaksDetected: this.stats.leaksFound,
    };
  }

  /**
   * Compact memory
   */
  public compactMemory(): void {
    const allocatedBlocks: MemoryBlock[] = [];
    const freeBlocks: MemoryBlock[] = [];

    for (const block of this.memoryPool.values()) {
      if (block.allocated) {
        allocatedBlocks.push(block);
      } else {
        freeBlocks.push(block);
      }
    }

    // Reorganize pool
    this.memoryPool.clear();
    let index = 0;

    for (const block of allocatedBlocks) {
      block.id = `block-${index}`;
      this.memoryPool.set(block.id, block);
      index++;
    }

    for (const block of freeBlocks) {
      block.id = `block-${index}`;
      this.memoryPool.set(block.id, block);
      index++;
    }
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      ...this.stats,
      activeAllocations: this.resourceAllocations.size,
      poolBlocks: this.memoryPool.size,
    };
  }
}
