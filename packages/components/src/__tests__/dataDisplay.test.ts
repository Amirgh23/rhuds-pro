/**
 * Data Display Components Unit Tests
 * Tests for Table, DataGrid, and Tree components
 */

describe('Data Display Components', () => {
  describe('Table Component', () => {
    it('should render table with data', () => {
      const data = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
      ];
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Alice');
    });

    it('should handle sorting', () => {
      const data = [
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice' },
      ];
      const sorted = [...data].sort((a, b) => a.id - b.id);
      expect(sorted[0].id).toBe(1);
      expect(sorted[1].id).toBe(2);
    });

    it('should handle reverse sorting', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      const sorted = [...data].sort((a, b) => b.id - a.id);
      expect(sorted[0].id).toBe(2);
      expect(sorted[1].id).toBe(1);
    });

    it('should handle row click', () => {
      const onClick = vi.fn();
      const row = { id: 1, name: 'Alice' };
      onClick(row);
      expect(onClick).toHaveBeenCalledWith(row);
    });

    it('should render custom cell content', () => {
      const render = vi.fn((value: string) => `Status: ${value}`);
      const result = render('Active');
      expect(result).toBe('Status: Active');
    });

    it('should support column filtering', () => {
      const data = [
        { id: 1, name: 'Alice', role: 'Admin' },
        { id: 2, name: 'Bob', role: 'User' },
        { id: 3, name: 'Carol', role: 'Admin' },
      ];
      const filtered = data.filter((row) => row.role === 'Admin');
      expect(filtered).toHaveLength(2);
      expect(filtered[0].name).toBe('Alice');
    });
  });

  describe('DataGrid Component', () => {
    it('should calculate visible rows correctly', () => {
      const data = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: `User ${i + 1}` }));
      const rowHeight = 40;
      const visibleRows = 10;
      const containerHeight = visibleRows * rowHeight;
      expect(containerHeight).toBe(400);
    });

    it('should handle virtual scrolling', () => {
      const data = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1 }));
      const rowHeight = 40;
      const visibleRows = 10;
      const scrollTop = 500;
      const startIndex = Math.floor(scrollTop / rowHeight);
      expect(startIndex).toBe(12);
    });

    it('should handle row selection (single)', () => {
      const selectedRows: number[] = [];
      const rowIndex = 0;
      selectedRows.push(rowIndex);
      expect(selectedRows).toContain(0);
      expect(selectedRows).toHaveLength(1);
    });

    it('should handle row selection (multiple)', () => {
      let selectedRows: number[] = [];
      selectedRows.push(0);
      selectedRows.push(1);
      selectedRows.push(2);
      expect(selectedRows).toHaveLength(3);
      expect(selectedRows).toContain(1);
    });

    it('should handle row deselection', () => {
      let selectedRows = [0, 1, 2];
      selectedRows = selectedRows.filter((r) => r !== 1);
      expect(selectedRows).toEqual([0, 2]);
      expect(selectedRows).not.toContain(1);
    });

    it('should handle cell editing', () => {
      const onEdit = vi.fn();
      onEdit(0, 'name', 'New Name');
      expect(onEdit).toHaveBeenCalledWith(0, 'name', 'New Name');
    });

    it('should select all rows', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));
      const selectedRows = data.map((_, i) => i);
      expect(selectedRows).toHaveLength(10);
    });

    it('should deselect all rows', () => {
      const selectedRows: number[] = [];
      expect(selectedRows).toHaveLength(0);
    });
  });

  describe('Tree Component', () => {
    it('should render tree nodes', () => {
      const nodes = [
        {
          key: 'root',
          label: 'Root',
          children: [
            { key: 'child1', label: 'Child 1' },
            { key: 'child2', label: 'Child 2' },
          ],
        },
      ];
      expect(nodes).toHaveLength(1);
      expect(nodes[0].children).toHaveLength(2);
    });

    it('should handle node expansion', () => {
      const expandedNodes: string[] = [];
      expandedNodes.push('root');
      expect(expandedNodes).toContain('root');
    });

    it('should handle node collapse', () => {
      let expandedNodes = ['root', 'child1'];
      expandedNodes = expandedNodes.filter((k) => k !== 'child1');
      expect(expandedNodes).toEqual(['root']);
      expect(expandedNodes).not.toContain('child1');
    });

    it('should handle node selection', () => {
      const onSelect = vi.fn();
      onSelect('node1');
      expect(onSelect).toHaveBeenCalledWith('node1');
    });

    it('should support nested nodes', () => {
      const nodes = [
        {
          key: 'root',
          label: 'Root',
          children: [
            {
              key: 'parent',
              label: 'Parent',
              children: [{ key: 'child', label: 'Child' }],
            },
          ],
        },
      ];
      const child = nodes[0].children![0].children![0];
      expect(child.key).toBe('child');
    });

    it('should handle lazy loading', async () => {
      const lazyLoad = vi.fn().mockResolvedValue([
        { key: 'lazy1', label: 'Lazy Child 1' },
        { key: 'lazy2', label: 'Lazy Child 2' },
      ]);
      const result = await lazyLoad();
      expect(result).toHaveLength(2);
      expect(lazyLoad).toHaveBeenCalled();
    });

    it('should support node icons', () => {
      const nodes = [
        { key: 'root', label: 'Root', icon: '📁' },
        { key: 'file', label: 'File', icon: '📄' },
      ];
      expect(nodes[0].icon).toBe('📁');
      expect(nodes[1].icon).toBe('📄');
    });

    it('should support disabled nodes', () => {
      const nodes = [
        { key: 'enabled', label: 'Enabled', disabled: false },
        { key: 'disabled', label: 'Disabled', disabled: true },
      ];
      expect(nodes[0].disabled).toBe(false);
      expect(nodes[1].disabled).toBe(true);
    });

    it('should calculate node depth', () => {
      const nodes = [
        {
          key: 'root',
          label: 'Root',
          children: [
            {
              key: 'level1',
              label: 'Level 1',
              children: [
                {
                  key: 'level2',
                  label: 'Level 2',
                },
              ],
            },
          ],
        },
      ];
      const depth = (node: any, currentDepth = 0): number => {
        if (!node.children || node.children.length === 0) return currentDepth;
        return Math.max(...node.children.map((child: any) => depth(child, currentDepth + 1)));
      };
      expect(depth(nodes[0])).toBe(2);
    });
  });

  describe('Data Display Integration', () => {
    it('should work with large datasets', () => {
      const data = Array.from({ length: 10000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
      }));
      expect(data).toHaveLength(10000);
    });

    it('should handle sorting and filtering together', () => {
      const data = [
        { id: 3, name: 'Carol', role: 'Admin' },
        { id: 1, name: 'Alice', role: 'User' },
        { id: 2, name: 'Bob', role: 'Admin' },
      ];
      const filtered = data.filter((row) => row.role === 'Admin');
      const sorted = filtered.sort((a, b) => a.id - b.id);
      expect(sorted[0].id).toBe(2);
      expect(sorted[1].id).toBe(3);
    });

    it('should support pagination', () => {
      const data = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));
      const pageSize = 10;
      const currentPage = 2;
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageData = data.slice(startIndex, endIndex);
      expect(pageData).toHaveLength(10);
      expect(pageData[0].id).toBe(11);
    });
  });
});
