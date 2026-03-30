/**
 * Defaults Manager Tests
 */

import { describe, it, expect } from 'vitest';
import { Registry } from '../../registry/Registry';
import { DefaultsManager } from '../DefaultsManager';

describe('DefaultsManager', () => {
  it('should register all default controllers', () => {
    const registry = new Registry();
    DefaultsManager.registerDefaults(registry);

    expect(registry.hasController('line')).toBe(true);
    expect(registry.hasController('bar')).toBe(true);
    expect(registry.hasController('pie')).toBe(true);
    expect(registry.hasController('doughnut')).toBe(true);
    expect(registry.hasController('radar')).toBe(true);
    expect(registry.hasController('polarArea')).toBe(true);
    expect(registry.hasController('bubble')).toBe(true);
    expect(registry.hasController('scatter')).toBe(true);
    expect(registry.hasController('mixed')).toBe(true);
  });

  it('should register all default elements', () => {
    const registry = new Registry();
    DefaultsManager.registerDefaults(registry);

    expect(registry.hasElement('point')).toBe(true);
    expect(registry.hasElement('line')).toBe(true);
    expect(registry.hasElement('arc')).toBe(true);
    expect(registry.hasElement('rectangle')).toBe(true);
    expect(registry.hasElement('bar')).toBe(true);
  });

  it('should register all default scales', () => {
    const registry = new Registry();
    DefaultsManager.registerDefaults(registry);

    expect(registry.hasScale('linear')).toBe(true);
    expect(registry.hasScale('category')).toBe(true);
    expect(registry.hasScale('time')).toBe(true);
    expect(registry.hasScale('logarithmic')).toBe(true);
  });

  it('should register correct total number of components', () => {
    const registry = new Registry();
    DefaultsManager.registerDefaults(registry);

    const stats = registry.getStats();
    expect(stats.totalControllers).toBe(9);
    expect(stats.totalElements).toBe(5);
    expect(stats.totalScales).toBe(4);
    expect(stats.total).toBe(18);
  });
});
