/**
 * Navigation Components Types
 */

export interface NavItem {
  label: string;
  href?: string;
  icon?: string;
  children?: NavItem[];
  active?: boolean;
  disabled?: boolean;
}

export interface NavbarProps {
  /** Navigation items */
  items: NavItem[];

  /** Brand/logo text */
  brand?: string;

  /** Navbar position */
  position?: 'static' | 'sticky' | 'fixed';

  /** Collapse on mobile */
  collapsible?: boolean;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}

export interface SidebarProps {
  /** Navigation items */
  items: NavItem[];

  /** Sidebar width */
  width?: number | string;

  /** Collapsible */
  collapsible?: boolean;

  /** Collapsed state */
  collapsed?: boolean;

  /** On collapse change */
  onCollapsedChange?: (collapsed: boolean) => void;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbProps {
  /** Breadcrumb items */
  items: BreadcrumbItem[];

  /** Separator character */
  separator?: string;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}

export interface TabItem {
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: string;
}

export interface TabsProps {
  /** Tab items */
  items: TabItem[];

  /** Active tab index */
  activeIndex?: number;

  /** On tab change */
  onChange?: (index: number) => void;

  /** Tab variant */
  variant?: 'line' | 'card' | 'button';

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}

export interface MenuItem {
  label: string;
  href?: string;
  icon?: string;
  children?: MenuItem[];
  divider?: boolean;
  disabled?: boolean;
}

export interface MenuProps {
  /** Menu items */
  items: MenuItem[];

  /** Menu trigger element */
  trigger?: React.ReactNode;

  /** On item click */
  onItemClick?: (item: MenuItem) => void;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}

export interface PaginationProps {
  /** Total items */
  total: number;

  /** Items per page */
  perPage?: number;

  /** Current page */
  currentPage?: number;

  /** On page change */
  onPageChange?: (page: number) => void;

  /** Show page size selector */
  showPageSize?: boolean;

  /** Page size options */
  pageSizeOptions?: number[];

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}
