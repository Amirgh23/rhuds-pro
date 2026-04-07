/**
 * Advanced Filtering System
 * Multi-condition filtering with range, category, and custom predicates
 */

export type FilterOperator =
  | '='
  | '!='
  | '>'
  | '<'
  | '>='
  | '<='
  | 'in'
  | 'not-in'
  | 'contains'
  | 'regex';

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
  caseSensitive?: boolean;
}

export interface FilterGroup {
  conditions: FilterCondition[];
  logic: 'AND' | 'OR';
}

export interface FilterConfig {
  enableCaching?: boolean;
  maxCacheSize?: number;
}

/**
 * Advanced Filter
 */
export class AdvancedFilter {
  private conditions: FilterCondition[] = [];
  private groups: FilterGroup[] = [];
  private customPredicates: Map<string, (item: any) => boolean> = new Map();
  private cache: Map<string, any[]> = new Map();
  private config: FilterConfig;
  private listeners: Map<string, Function[]> = new Map();

  constructor(config: FilterConfig = {}) {
    this.config = {
      enableCaching: true,
      maxCacheSize: 100,
      ...config,
    };
  }

  /**
   * Add filter condition
   */
  public addCondition(field: string, operator: FilterOperator, value: any): void {
    this.conditions.push({
      field,
      operator,
      value,
      caseSensitive: false,
    });
    this.clearCache();
    this.emit('condition:added', { field, operator, value });
  }

  /**
   * Remove condition
   */
  public removeCondition(index: number): void {
    if (index >= 0 && index < this.conditions.length) {
      const removed = this.conditions.splice(index, 1)[0];
      this.clearCache();
      this.emit('condition:removed', { field: removed.field });
    }
  }

  /**
   * Clear all conditions
   */
  public clearConditions(): void {
    this.conditions = [];
    this.groups = [];
    this.clearCache();
    this.emit('conditions:cleared', {});
  }

  /**
   * Add range filter
   */
  public addRangeFilter(field: string, min: number, max: number): void {
    this.addCondition(field, '>=', min);
    this.addCondition(field, '<=', max);
    this.emit('range:added', { field, min, max });
  }

  /**
   * Add category filter
   */
  public addCategoryFilter(field: string, categories: any[]): void {
    this.addCondition(field, 'in', categories);
    this.emit('category:added', { field, categories });
  }

  /**
   * Add custom predicate
   */
  public addPredicate(name: string, predicate: (item: any) => boolean): void {
    this.customPredicates.set(name, predicate);
    this.clearCache();
    this.emit('predicate:added', { name });
  }

  /**
   * Remove predicate
   */
  public removePredicate(name: string): void {
    this.customPredicates.delete(name);
    this.clearCache();
    this.emit('predicate:removed', { name });
  }

  /**
   * Create filter group
   */
  public createGroup(conditions: FilterCondition[], logic: 'AND' | 'OR' = 'AND'): void {
    this.groups.push({
      conditions,
      logic,
    });
    this.clearCache();
    this.emit('group:created', { logic, conditionCount: conditions.length });
  }

  /**
   * Apply filters
   */
  public apply(data: any[]): any[] {
    if (!Array.isArray(data)) {
      return [];
    }

    const cacheKey = this.getCacheKey();
    if (this.config.enableCaching && this.cache.has(cacheKey)) {
      this.emit('filter:cached', {});
      return this.cache.get(cacheKey)!;
    }

    let result = data;

    // Apply conditions
    if (this.conditions.length > 0) {
      result = result.filter((item) => this.matchesConditions(item));
    }

    // Apply groups
    if (this.groups.length > 0) {
      result = result.filter((item) => this.matchesGroups(item));
    }

    // Apply custom predicates
    if (this.customPredicates.size > 0) {
      result = result.filter((item) => this.matchesPredicates(item));
    }

    if (this.config.enableCaching) {
      if (this.cache.size >= (this.config.maxCacheSize || 100)) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      this.cache.set(cacheKey, result);
    }

    this.emit('filter:applied', { inputCount: data.length, outputCount: result.length });

    return result;
  }

  /**
   * Check if item matches conditions
   */
  private matchesConditions(item: any): boolean {
    return this.conditions.every((condition) => this.matchesCondition(item, condition));
  }

  /**
   * Check if item matches a single condition
   */
  private matchesCondition(item: any, condition: FilterCondition): boolean {
    const value = this.getNestedValue(item, condition.field);

    switch (condition.operator) {
      case '=':
        return this.compareEqual(value, condition.value, condition.caseSensitive);
      case '!=':
        return !this.compareEqual(value, condition.value, condition.caseSensitive);
      case '>':
        return value > condition.value;
      case '<':
        return value < condition.value;
      case '>=':
        return value >= condition.value;
      case '<=':
        return value <= condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value);
      case 'not-in':
        return !Array.isArray(condition.value) || !condition.value.includes(value);
      case 'contains':
        return String(value).includes(String(condition.value));
      case 'regex':
        return new RegExp(condition.value).test(String(value));
      default:
        return true;
    }
  }

  /**
   * Check if item matches groups
   */
  private matchesGroups(item: any): boolean {
    return this.groups.every((group) => {
      if (group.logic === 'AND') {
        return group.conditions.every((condition) => this.matchesCondition(item, condition));
      } else {
        return group.conditions.some((condition) => this.matchesCondition(item, condition));
      }
    });
  }

  /**
   * Check if item matches predicates
   */
  private matchesPredicates(item: any): boolean {
    for (const predicate of this.customPredicates.values()) {
      if (!predicate(item)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  /**
   * Compare values
   */
  private compareEqual(a: any, b: any, caseSensitive: boolean = false): boolean {
    if (caseSensitive) {
      return a === b;
    }

    if (typeof a === 'string' && typeof b === 'string') {
      return a.toLowerCase() === b.toLowerCase();
    }

    return a === b;
  }

  /**
   * Get cache key
   */
  private getCacheKey(): string {
    const conditionStr = JSON.stringify(this.conditions);
    const groupStr = JSON.stringify(this.groups);
    return `${conditionStr}:${groupStr}`;
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get filter stats
   */
  public getStats(): {
    conditionCount: number;
    groupCount: number;
    predicateCount: number;
    cacheSize: number;
  } {
    return {
      conditionCount: this.conditions.length,
      groupCount: this.groups.length,
      predicateCount: this.customPredicates.size,
      cacheSize: this.cache.size,
    };
  }

  /**
   * Listen to events
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  /**
   * Destroy filter
   */
  public destroy(): void {
    this.conditions = [];
    this.groups = [];
    this.customPredicates.clear();
    this.cache.clear();
    this.listeners.clear();
  }
}

export default AdvancedFilter;
