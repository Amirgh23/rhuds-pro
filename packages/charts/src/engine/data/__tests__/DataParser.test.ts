/**
 * Unit tests for DataParser
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataParser, type ParsedDataPoint } from '../DataParser';

describe('DataParser', () => {
  let parser: DataParser;

  beforeEach(() => {
    parser = new DataParser({ logWarnings: false });
  });

  describe('parseDataPoint - numeric values', () => {
    it('should parse simple numeric values', () => {
      const result = parser['parseDataPoint'](42, 0);

      expect(result.y).toBe(42);
      expect(result.x).toBe(0);
      expect(result.valid).toBe(true);
      expect(result.raw).toBe(42);
      expect(result.index).toBe(0);
    });

    it('should parse zero', () => {
      const result = parser['parseDataPoint'](0, 0);

      expect(result.y).toBe(0);
      expect(result.valid).toBe(true);
    });

    it('should parse negative numbers', () => {
      const result = parser['parseDataPoint'](-15, 0);

      expect(result.y).toBe(-15);
      expect(result.valid).toBe(true);
    });

    it('should parse floating point numbers', () => {
      const result = parser['parseDataPoint'](3.14159, 0);

      expect(result.y).toBe(3.14159);
      expect(result.valid).toBe(true);
    });

    it('should handle null values', () => {
      const result = parser['parseDataPoint'](null, 0);

      expect(result.y).toBeNull();
      expect(result.x).toBeNull();
      expect(result.valid).toBe(false);
    });

    it('should handle undefined values', () => {
      const result = parser['parseDataPoint'](undefined, 0);

      expect(result.y).toBeNull();
      expect(result.x).toBeNull();
      expect(result.valid).toBe(false);
    });

    it('should handle NaN values', () => {
      const result = parser['parseDataPoint'](NaN, 0);

      expect(result.y).toBeNull();
      expect(result.valid).toBe(false);
    });

    it('should handle Infinity values', () => {
      const result = parser['parseDataPoint'](Infinity, 0);

      expect(result.y).toBeNull();
      expect(result.valid).toBe(false);
    });
  });

  describe('parseDataPoint - string values', () => {
    it('should parse numeric strings', () => {
      const result = parser['parseDataPoint']('42', 0);

      expect(result.y).toBe(42);
      expect(result.valid).toBe(true);
    });

    it('should parse floating point strings', () => {
      const result = parser['parseDataPoint']('3.14', 0);

      expect(result.y).toBe(3.14);
      expect(result.valid).toBe(true);
    });

    it('should handle non-numeric strings', () => {
      const result = parser['parseDataPoint']('not a number', 0);

      expect(result.y).toBeNull();
      expect(result.valid).toBe(false);
    });

    it('should handle empty strings', () => {
      const result = parser['parseDataPoint']('', 0);

      expect(result.y).toBeNull();
      expect(result.valid).toBe(false);
    });
  });

  describe('parseDataPoint - object values', () => {
    it('should parse object with x and y properties', () => {
      const result = parser['parseDataPoint']({ x: 10, y: 20 }, 0);

      expect(result.x).toBe(10);
      expect(result.y).toBe(20);
      expect(result.valid).toBe(true);
    });

    it('should parse object with x, y, and r properties', () => {
      const result = parser['parseDataPoint']({ x: 10, y: 20, r: 5 }, 0);

      expect(result.x).toBe(10);
      expect(result.y).toBe(20);
      expect(result.r).toBe(5);
      expect(result.valid).toBe(true);
    });

    it('should parse object with value property', () => {
      const result = parser['parseDataPoint']({ value: 42 }, 0);

      expect(result.y).toBe(42);
      expect(result.valid).toBe(true);
    });

    it('should handle object with only x property', () => {
      const result = parser['parseDataPoint']({ x: 10 }, 0);

      expect(result.x).toBe(10);
      expect(result.y).toBeNull();
      expect(result.valid).toBe(true);
    });

    it('should handle object with only y property', () => {
      const result = parser['parseDataPoint']({ y: 20 }, 0);

      expect(result.y).toBe(20);
      expect(result.valid).toBe(true);
    });

    it('should handle object with invalid properties', () => {
      const result = parser['parseDataPoint']({ a: 'invalid', b: 'data' }, 0);

      // Objects without x or y are still considered valid if they have an index
      // The parser sets x to the index by default
      expect(result.x).toBe(0);
      expect(result.y).toBeNull();
      expect(result.valid).toBe(true);
    });

    it('should handle object with null x and y', () => {
      const result = parser['parseDataPoint']({ x: null, y: null }, 0);

      expect(result.x).toBeNull();
      expect(result.y).toBeNull();
      expect(result.valid).toBe(false);
    });

    it('should parse object with string numeric values', () => {
      const result = parser['parseDataPoint']({ x: '10', y: '20' }, 0);

      expect(result.x).toBe(10);
      expect(result.y).toBe(20);
      expect(result.valid).toBe(true);
    });
  });

  describe('parseDataset', () => {
    it('should parse array of numeric values', () => {
      const dataset = { data: [10, 20, 30, 40] };
      const result = parser.parseDataset(dataset);

      expect(result).toHaveLength(4);
      expect(result[0].y).toBe(10);
      expect(result[1].y).toBe(20);
      expect(result[2].y).toBe(30);
      expect(result[3].y).toBe(40);
      expect(result.every((p) => p.valid)).toBe(true);
    });

    it('should parse array with mixed valid and invalid values', () => {
      const dataset = { data: [10, null, 30, undefined, 50] };
      const result = parser.parseDataset(dataset);

      expect(result).toHaveLength(5);
      expect(result[0].valid).toBe(true);
      expect(result[1].valid).toBe(false);
      expect(result[2].valid).toBe(true);
      expect(result[3].valid).toBe(false);
      expect(result[4].valid).toBe(true);
    });

    it('should parse array of objects', () => {
      const dataset = {
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 },
        ],
      };
      const result = parser.parseDataset(dataset);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(expect.objectContaining({ x: 1, y: 10, valid: true }));
      expect(result[1]).toEqual(expect.objectContaining({ x: 2, y: 20, valid: true }));
      expect(result[2]).toEqual(expect.objectContaining({ x: 3, y: 30, valid: true }));
    });

    it('should use labels for x values when provided', () => {
      const dataset = { data: [10, 20, 30] };
      const labels = ['Jan', 'Feb', 'Mar'];
      const result = parser.parseDataset(dataset, labels);

      expect(result[0].x).toBe(0);
      expect(result[1].x).toBe(1);
      expect(result[2].x).toBe(2);
    });

    it('should handle empty dataset', () => {
      const dataset = { data: [] };
      const result = parser.parseDataset(dataset);

      expect(result).toHaveLength(0);
    });

    it('should handle non-array data', () => {
      const dataset = { data: 'not an array' as any };
      const result = parser.parseDataset(dataset);

      expect(result).toHaveLength(0);
    });
  });

  describe('parseChartData', () => {
    it('should parse multiple datasets', () => {
      const data = {
        labels: ['A', 'B', 'C'],
        datasets: [{ data: [10, 20, 30] }, { data: [40, 50, 60] }],
      };
      const result = parser.parseChartData(data);

      expect(result.size).toBe(2);
      expect(result.get(0)).toHaveLength(3);
      expect(result.get(1)).toHaveLength(3);
    });

    it('should handle empty datasets', () => {
      const data = { datasets: [] };
      const result = parser.parseChartData(data);

      expect(result.size).toBe(0);
    });

    it('should handle missing datasets', () => {
      const data = {} as any;
      const result = parser.parseChartData(data);

      expect(result.size).toBe(0);
    });
  });

  describe('validateParsedData', () => {
    it('should count valid and invalid points', () => {
      const parsed: ParsedDataPoint[] = [
        { x: 1, y: 10, raw: 10, index: 0, valid: true },
        { x: 2, y: null, raw: null, index: 1, valid: false },
        { x: 3, y: 30, raw: 30, index: 2, valid: true },
      ];
      const result = parser.validateParsedData(parsed);

      expect(result.valid).toBe(2);
      expect(result.invalid).toBe(1);
      expect(result.total).toBe(3);
    });

    it('should handle all valid data', () => {
      const parsed: ParsedDataPoint[] = [
        { x: 1, y: 10, raw: 10, index: 0, valid: true },
        { x: 2, y: 20, raw: 20, index: 1, valid: true },
      ];
      const result = parser.validateParsedData(parsed);

      expect(result.valid).toBe(2);
      expect(result.invalid).toBe(0);
      expect(result.total).toBe(2);
    });

    it('should handle all invalid data', () => {
      const parsed: ParsedDataPoint[] = [
        { x: null, y: null, raw: null, index: 0, valid: false },
        { x: null, y: null, raw: null, index: 1, valid: false },
      ];
      const result = parser.validateParsedData(parsed);

      expect(result.valid).toBe(0);
      expect(result.invalid).toBe(2);
      expect(result.total).toBe(2);
    });
  });

  describe('filterValidData', () => {
    it('should filter out invalid points', () => {
      const parsed: ParsedDataPoint[] = [
        { x: 1, y: 10, raw: 10, index: 0, valid: true },
        { x: 2, y: null, raw: null, index: 1, valid: false },
        { x: 3, y: 30, raw: 30, index: 2, valid: true },
      ];
      const result = parser.filterValidData(parsed);

      expect(result).toHaveLength(2);
      expect(result[0].valid).toBe(true);
      expect(result[1].valid).toBe(true);
    });

    it('should return empty array if all invalid', () => {
      const parsed: ParsedDataPoint[] = [
        { x: null, y: null, raw: null, index: 0, valid: false },
        { x: null, y: null, raw: null, index: 1, valid: false },
      ];
      const result = parser.filterValidData(parsed);

      expect(result).toHaveLength(0);
    });
  });

  describe('getDataStatistics', () => {
    it('should calculate statistics for valid data', () => {
      const parsed: ParsedDataPoint[] = [
        { x: 1, y: 10, raw: 10, index: 0, valid: true },
        { x: 2, y: 20, raw: 20, index: 1, valid: true },
        { x: 3, y: 30, raw: 30, index: 2, valid: true },
      ];
      const result = parser.getDataStatistics(parsed);

      expect(result.xMin).toBe(1);
      expect(result.xMax).toBe(3);
      expect(result.yMin).toBe(10);
      expect(result.yMax).toBe(30);
      expect(result.validCount).toBe(3);
      expect(result.count).toBe(3);
    });

    it('should calculate statistics with bubble data', () => {
      const parsed: ParsedDataPoint[] = [
        { x: 1, y: 10, r: 5, raw: { x: 1, y: 10, r: 5 }, index: 0, valid: true },
        { x: 2, y: 20, r: 10, raw: { x: 2, y: 20, r: 10 }, index: 1, valid: true },
        { x: 3, y: 30, r: 3, raw: { x: 3, y: 30, r: 3 }, index: 2, valid: true },
      ];
      const result = parser.getDataStatistics(parsed);

      expect(result.rMin).toBe(3);
      expect(result.rMax).toBe(10);
    });

    it('should skip invalid data in statistics', () => {
      const parsed: ParsedDataPoint[] = [
        { x: 1, y: 10, raw: 10, index: 0, valid: true },
        { x: null, y: null, raw: null, index: 1, valid: false },
        { x: 3, y: 30, raw: 30, index: 2, valid: true },
      ];
      const result = parser.getDataStatistics(parsed);

      expect(result.xMin).toBe(1);
      expect(result.xMax).toBe(3);
      expect(result.yMin).toBe(10);
      expect(result.yMax).toBe(30);
      expect(result.validCount).toBe(2);
      expect(result.count).toBe(3);
    });

    it('should handle empty data', () => {
      const parsed: ParsedDataPoint[] = [];
      const result = parser.getDataStatistics(parsed);

      expect(result.xMin).toBeNull();
      expect(result.xMax).toBeNull();
      expect(result.yMin).toBeNull();
      expect(result.yMax).toBeNull();
      expect(result.validCount).toBe(0);
      expect(result.count).toBe(0);
    });

    it('should handle all invalid data', () => {
      const parsed: ParsedDataPoint[] = [
        { x: null, y: null, raw: null, index: 0, valid: false },
        { x: null, y: null, raw: null, index: 1, valid: false },
      ];
      const result = parser.getDataStatistics(parsed);

      expect(result.xMin).toBeNull();
      expect(result.xMax).toBeNull();
      expect(result.yMin).toBeNull();
      expect(result.yMax).toBeNull();
      expect(result.validCount).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should preserve raw value', () => {
      const rawValue = { custom: 'data', value: 42 };
      const result = parser['parseDataPoint'](rawValue, 0);

      expect(result.raw).toBe(rawValue);
    });

    it('should preserve index', () => {
      const result = parser['parseDataPoint'](42, 5);

      expect(result.index).toBe(5);
    });

    it('should handle very large numbers', () => {
      const result = parser['parseDataPoint'](1e10, 0);

      expect(result.y).toBe(1e10);
      expect(result.valid).toBe(true);
    });

    it('should handle very small numbers', () => {
      const result = parser['parseDataPoint'](1e-10, 0);

      expect(result.y).toBe(1e-10);
      expect(result.valid).toBe(true);
    });

    it('should handle negative zero', () => {
      const result = parser['parseDataPoint'](-0, 0);

      // JavaScript treats -0 and 0 as equal in most contexts
      expect(Object.is(result.y, 0) || Object.is(result.y, -0)).toBe(true);
      expect(result.valid).toBe(true);
    });
  });

  describe('warning logging', () => {
    it('should log warnings when enabled', () => {
      const parserWithWarnings = new DataParser({ logWarnings: true });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      parserWithWarnings['parseDataPoint']('not a number', 0);

      expect(warnSpy).toHaveBeenCalled();

      warnSpy.mockRestore();
    });

    it('should not log warnings when disabled', () => {
      const parserNoWarnings = new DataParser({ logWarnings: false });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      parserNoWarnings['parseDataPoint']('not a number', 0);

      expect(warnSpy).not.toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });
});
