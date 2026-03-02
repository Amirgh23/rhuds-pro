/**
 * Data Display Components Types
 */

// ============================================================================
// Table Component Types
// ============================================================================

export interface TableColumn<T = any> {
  /** Column key/identifier */
  key: string;
  /** Column header label */
  label: string;
  /** Column width */
  width?: number | string;
  /** Is column sortable */
  sortable?: boolean;
  /** Is column filterable */
  filterable?: boolean;
  /** Custom cell renderer */
  render?: (value: any, row: T, index: number) => React.ReactNode;
  /** Align column content */
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  /** Table data rows */
  data: T[];
  /** Table columns */
  columns: TableColumn<T>[];
  /** Current sort column */
  sortColumn?: string;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  /** On sort change */
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  /** Filter values */
  filters?: Record<string, any>;
  /** On filter change */
  onFilter?: (filters: Record<string, any>) => void;
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

// ============================================================================
// DataGrid Component Types
// ============================================================================

export interface DataGridColumn<T = any> extends TableColumn<T> {
  /** Is column resizable */
  resizable?: boolean;
  /** Is column frozen */
  frozen?: boolean;
  /** Min width for resizing */
  minWidth?: number;
  /** Max width for resizing */
  maxWidth?: number;
  /** Is column editable */
  editable?: boolean;
  /** Editor component */
  editor?: React.ComponentType<any>;
}

export interface DataGridRowGroup {
  /** Group key */
  key: string;
  /** Group label */
  label: string;
  /** Group rows */
  rows: any[];
}

export interface DataGridProps<T = any> {
  /** Grid data rows */
  data: T[];
  /** Grid columns */
  columns: DataGridColumn<T>[];
  /** Row height for virtualization */
  rowHeight?: number;
  /** Visible rows count */
  visibleRows?: number;
  /** Current sort column */
  sortColumn?: string;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  /** On sort change */
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  /** Filter values */
  filters?: Record<string, any>;
  /** On filter change */
  onFilter?: (filters: Record<string, any>) => void;
  /** Selected rows */
  selectedRows?: (string | number)[];
  /** Selection mode */
  selectionMode?: 'single' | 'multiple' | 'none';
  /** On selection change */
  onSelectionChange?: (rows: (string | number)[]) => void;
  /** Row groups */
  groups?: DataGridRowGroup[];
  /** Frozen columns count */
  frozenColumns?: number;
  /** On cell edit */
  onCellEdit?: (rowIndex: number, columnKey: string, value: any) => void;
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

// ============================================================================
// Tree Component Types
// ============================================================================

export interface TreeNode<T = any> {
  /** Node key/identifier */
  key: string;
  /** Node label */
  label: string;
  /** Node data */
  data?: T;
  /** Child nodes */
  children?: TreeNode<T>[];
  /** Is node expandable */
  expandable?: boolean;
  /** Is node expanded */
  expanded?: boolean;
  /** Is node disabled */
  disabled?: boolean;
  /** Node icon */
  icon?: string | React.ReactNode;
  /** Custom node renderer */
  render?: (node: TreeNode<T>) => React.ReactNode;
  /** Lazy load children */
  lazyLoad?: () => Promise<TreeNode<T>[]>;
}

export interface TreeProps<T = any> {
  /** Tree nodes */
  nodes: TreeNode<T>[];
  /** Expanded nodes */
  expandedNodes?: string[];
  /** On node expand */
  onExpand?: (nodeKey: string) => void;
  /** On node collapse */
  onCollapse?: (nodeKey: string) => void;
  /** On node click */
  onNodeClick?: (node: TreeNode<T>) => void;
  /** Selected node */
  selectedNode?: string;
  /** On node select */
  onNodeSelect?: (nodeKey: string) => void;
  /** Animation duration */
  animationDuration?: number;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}
