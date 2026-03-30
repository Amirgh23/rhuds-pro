/**
 * Registry System Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Registry } from '../Registry';

describe('Registry', () => {
  let registry: Registry;

  beforeEach(() => {
    registry = new Registry();
  });

  describe('Controller Registration', () => {
    it('should register a controller', () => {
      const controller = class TestController {};
      registry.registerController('test', controller);
      expect(registry.hasController('test')).toBe(true);
    });

    it('should retrieve a registered controller', () => {
      const controller = class TestController {};
      registry.registerController('test', controller);
      expect(registry.getController('test')).toBe(controller);
    });

    it('should throw error on duplicate controller registration', () => {
      const controller = class TestController {};
      registry.registerController('test', controller);
      expect(() => {
        registry.registerController('test', controller);
      }).toThrow("Controller with id 'test' is already registered");
    });

    it('should return undefined for non-existent controller', () => {
      expect(registry.getController('nonexistent')).toBeUndefined();
    });
  });

  describe('Element Registration', () => {
    it('should register an element', () => {
      const element = class TestElement {};
      registry.registerElement('test', element);
      expect(registry.hasElement('test')).toBe(true);
    });

    it('should retrieve a registered element', () => {
      const element = class TestElement {};
      registry.registerElement('test', element);
      expect(registry.getElement('test')).toBe(element);
    });

    it('should throw error on duplicate element registration', () => {
      const element = class TestElement {};
      registry.registerElement('test', element);
      expect(() => {
        registry.registerElement('test', element);
      }).toThrow("Element with id 'test' is already registered");
    });
  });

  describe('Scale Registration', () => {
    it('should register a scale', () => {
      const scale = class TestScale {};
      registry.registerScale('test', scale);
      expect(registry.hasScale('test')).toBe(true);
    });

    it('should retrieve a registered scale', () => {
      const scale = class TestScale {};
      registry.registerScale('test', scale);
      expect(registry.getScale('test')).toBe(scale);
    });

    it('should throw error on duplicate scale registration', () => {
      const scale = class TestScale {};
      registry.registerScale('test', scale);
      expect(() => {
        registry.registerScale('test', scale);
      }).toThrow("Scale with id 'test' is already registered");
    });
  });

  describe('Plugin Registration', () => {
    it('should register a plugin', () => {
      const plugin = { id: 'test' };
      registry.registerPlugin('test', plugin);
      expect(registry.hasPlugin('test')).toBe(true);
    });

    it('should retrieve a registered plugin', () => {
      const plugin = { id: 'test' };
      registry.registerPlugin('test', plugin);
      expect(registry.getPlugin('test')).toBe(plugin);
    });

    it('should throw error on duplicate plugin registration', () => {
      const plugin = { id: 'test' };
      registry.registerPlugin('test', plugin);
      expect(() => {
        registry.registerPlugin('test', plugin);
      }).toThrow("Plugin with id 'test' is already registered");
    });
  });

  describe('Registry Statistics', () => {
    it('should return correct statistics', () => {
      registry.registerController('line', class {});
      registry.registerElement('point', class {});
      registry.registerScale('linear', class {});
      registry.registerPlugin('tooltip', { id: 'tooltip' });

      const stats = registry.getStats();
      expect(stats.totalControllers).toBe(1);
      expect(stats.totalElements).toBe(1);
      expect(stats.totalScales).toBe(1);
      expect(stats.totalPlugins).toBe(1);
      expect(stats.total).toBe(4);
    });
  });

  describe('Registry Clear', () => {
    it('should clear all components', () => {
      registry.registerController('line', class {});
      registry.registerElement('point', class {});
      registry.registerScale('linear', class {});
      registry.registerPlugin('tooltip', { id: 'tooltip' });

      registry.clear();

      expect(registry.hasController('line')).toBe(false);
      expect(registry.hasElement('point')).toBe(false);
      expect(registry.hasScale('linear')).toBe(false);
      expect(registry.hasPlugin('tooltip')).toBe(false);
    });
  });

  describe('Get All Components', () => {
    it('should return all controllers', () => {
      const controller1 = class {};
      const controller2 = class {};
      registry.registerController('line', controller1);
      registry.registerController('bar', controller2);

      const controllers = registry.getControllers();
      expect(controllers.size).toBe(2);
      expect(controllers.get('line')).toBe(controller1);
      expect(controllers.get('bar')).toBe(controller2);
    });

    it('should return all elements', () => {
      const element1 = class {};
      const element2 = class {};
      registry.registerElement('point', element1);
      registry.registerElement('line', element2);

      const elements = registry.getElements();
      expect(elements.size).toBe(2);
      expect(elements.get('point')).toBe(element1);
      expect(elements.get('line')).toBe(element2);
    });

    it('should return all scales', () => {
      const scale1 = class {};
      const scale2 = class {};
      registry.registerScale('linear', scale1);
      registry.registerScale('category', scale2);

      const scales = registry.getScales();
      expect(scales.size).toBe(2);
      expect(scales.get('linear')).toBe(scale1);
      expect(scales.get('category')).toBe(scale2);
    });

    it('should return all plugins', () => {
      const plugin1 = { id: 'tooltip' };
      const plugin2 = { id: 'legend' };
      registry.registerPlugin('tooltip', plugin1);
      registry.registerPlugin('legend', plugin2);

      const plugins = registry.getPlugins();
      expect(plugins.size).toBe(2);
      expect(plugins.get('tooltip')).toBe(plugin1);
      expect(plugins.get('legend')).toBe(plugin2);
    });
  });
});
