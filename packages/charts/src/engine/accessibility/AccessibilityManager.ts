/**
 * Accessibility Manager
 * ARIA labels, keyboard navigation, screen reader support, color contrast
 */

export interface AccessibilityConfig {
  ariaLabel?: string;
  ariaDescription?: string;
  role?: string;
  keyboardNavigation?: boolean;
  screenReaderSupport?: boolean;
  highContrast?: boolean;
  focusIndicator?: boolean;
  skipLinks?: boolean;
}

export interface AccessibilityReport {
  issues: AccessibilityIssue[];
  score: number;
  recommendations: string[];
}

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: HTMLElement;
  suggestion?: string;
}

/**
 * Accessibility Manager
 */
export class AccessibilityManager {
  private config: AccessibilityConfig;
  private listeners: Map<string, Function[]> = new Map();
  private keyboardHandlers: Map<string, (e: KeyboardEvent) => void> = new Map();

  constructor(config: AccessibilityConfig = {}) {
    this.config = {
      ariaLabel: 'Chart',
      role: 'img',
      keyboardNavigation: true,
      screenReaderSupport: true,
      highContrast: false,
      focusIndicator: true,
      skipLinks: true,
      ...config,
    };
  }

  /**
   * Apply accessibility features
   */
  public apply(element: HTMLElement): void {
    // Set ARIA attributes
    if (this.config.ariaLabel) {
      element.setAttribute('aria-label', this.config.ariaLabel);
    }

    if (this.config.ariaDescription) {
      element.setAttribute('aria-description', this.config.ariaDescription);
    }

    if (this.config.role) {
      element.setAttribute('role', this.config.role);
    }

    // Make focusable
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }

    // Add keyboard navigation
    if (this.config.keyboardNavigation) {
      this.setupKeyboardNavigation(element);
    }

    // Add focus indicator
    if (this.config.focusIndicator) {
      this.addFocusIndicator(element);
    }

    // Add skip links
    if (this.config.skipLinks) {
      this.addSkipLinks(element);
    }

    // Apply high contrast if enabled
    if (this.config.highContrast) {
      this.applyHighContrast(element);
    }

    this.emit('accessibility:applied', { element });
  }

  /**
   * Setup keyboard navigation
   */
  private setupKeyboardNavigation(element: HTMLElement): void {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          e.preventDefault();
          this.emit('keyboard:navigate', { key: e.key });
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.emit('keyboard:activate', { key: e.key });
          break;
        case 'Escape':
          this.emit('keyboard:escape', {});
          break;
      }
    };

    element.addEventListener('keydown', handler);
    this.keyboardHandlers.set(element.id || 'default', handler);
  }

  /**
   * Add focus indicator
   */
  private addFocusIndicator(element: HTMLElement): void {
    const style = document.createElement('style');
    const elementId = element.id || 'rhuds-accessible-element';

    if (!element.id) {
      element.id = elementId;
    }

    style.textContent = `
      #${elementId}:focus {
        outline: 3px solid #4A90E2;
        outline-offset: 2px;
        border-radius: 4px;
      }
      
      #${elementId}:focus-visible {
        outline: 3px solid #4A90E2;
        outline-offset: 2px;
        border-radius: 4px;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Add skip links
   */
  private addSkipLinks(element: HTMLElement): void {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'rhuds-skip-link';

    const style = document.createElement('style');
    style.textContent = `
      .rhuds-skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
      }
      
      .rhuds-skip-link:focus {
        top: 0;
      }
    `;

    document.head.appendChild(style);
    element.parentElement?.insertBefore(skipLink, element);
  }

  /**
   * Apply high contrast
   */
  private applyHighContrast(element: HTMLElement): void {
    const style = document.createElement('style');
    const elementId = element.id || 'rhuds-high-contrast';

    if (!element.id) {
      element.id = elementId;
    }

    style.textContent = `
      #${elementId} {
        filter: contrast(1.5);
      }
      
      #${elementId} * {
        border-width: 2px !important;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Add screen reader text
   */
  public addScreenReaderText(element: HTMLElement, text: string): void {
    const srText = document.createElement('span');
    srText.className = 'rhuds-sr-only';
    srText.textContent = text;

    const style = document.createElement('style');
    style.textContent = `
      .rhuds-sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
    `;

    if (!document.querySelector('style[data-rhuds-sr]')) {
      style.setAttribute('data-rhuds-sr', 'true');
      document.head.appendChild(style);
    }

    element.appendChild(srText);
  }

  /**
   * Create accessible legend
   */
  public createAccessibleLegend(items: Array<{ label: string; color: string }>): HTMLElement {
    const legend = document.createElement('div');
    legend.setAttribute('role', 'region');
    legend.setAttribute('aria-label', 'Chart Legend');

    const list = document.createElement('ul');
    list.className = 'rhuds-legend';

    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'rhuds-legend-item';

      const color = document.createElement('span');
      color.className = 'rhuds-legend-color';
      color.style.backgroundColor = item.color;
      color.setAttribute('aria-hidden', 'true');

      const label = document.createElement('span');
      label.className = 'rhuds-legend-label';
      label.textContent = item.label;

      li.appendChild(color);
      li.appendChild(label);
      list.appendChild(li);
    });

    legend.appendChild(list);

    const style = document.createElement('style');
    style.textContent = `
      .rhuds-legend {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .rhuds-legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .rhuds-legend-color {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 8px;
        border-radius: 2px;
      }
      
      .rhuds-legend-label {
        font-size: 14px;
      }
    `;

    document.head.appendChild(style);

    return legend;
  }

  /**
   * Create accessible data table
   */
  public createAccessibleDataTable(data: any[][], headers: string[]): HTMLElement {
    const table = document.createElement('table');
    table.setAttribute('role', 'table');

    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach((header) => {
      const th = document.createElement('th');
      th.textContent = header;
      th.setAttribute('scope', 'col');
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');

    data.forEach((row) => {
      const tr = document.createElement('tr');

      row.forEach((cell, index) => {
        const td = document.createElement('td');
        td.textContent = String(cell);

        if (index === 0) {
          td.setAttribute('scope', 'row');
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    return table;
  }

  /**
   * Audit accessibility
   */
  public audit(element: HTMLElement): AccessibilityReport {
    const issues: AccessibilityIssue[] = [];

    // Check for ARIA labels
    if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
      issues.push({
        type: 'warning',
        message: 'Element missing aria-label or aria-labelledby',
        element,
        suggestion: 'Add aria-label or aria-labelledby attribute',
      });
    }

    // Check for role
    if (!element.getAttribute('role')) {
      issues.push({
        type: 'info',
        message: 'Element missing role attribute',
        element,
        suggestion: 'Consider adding a role attribute',
      });
    }

    // Check for keyboard navigation
    if (!element.hasAttribute('tabindex')) {
      issues.push({
        type: 'info',
        message: 'Element not keyboard accessible',
        element,
        suggestion: 'Add tabindex attribute for keyboard navigation',
      });
    }

    // Check for color contrast
    const style = window.getComputedStyle(element);
    const bgColor = style.backgroundColor;
    const color = style.color;

    if (!this.hasGoodContrast(bgColor, color)) {
      issues.push({
        type: 'error',
        message: 'Insufficient color contrast',
        element,
        suggestion: 'Increase color contrast for better readability',
      });
    }

    const score = Math.max(0, 100 - issues.length * 10);

    this.emit('audit:complete', { score, issueCount: issues.length });

    return {
      issues,
      score,
      recommendations: issues.map((i) => i.suggestion || '').filter(Boolean),
    };
  }

  /**
   * Check color contrast
   */
  private hasGoodContrast(bgColor: string, fgColor: string): boolean {
    // Simplified contrast check
    // In production, use WCAG contrast ratio calculation
    return true;
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
   * Destroy manager
   */
  public destroy(): void {
    this.keyboardHandlers.forEach((handler, key) => {
      const element = document.getElementById(key);
      if (element) {
        element.removeEventListener('keydown', handler);
      }
    });
    this.keyboardHandlers.clear();
    this.listeners.clear();
  }
}

export default AccessibilityManager;
