/**
 * Print Optimization System
 * Print-friendly layouts, quality settings, metadata inclusion
 */

export interface PrintOptions {
  layout?: 'portrait' | 'landscape';
  quality?: 'draft' | 'normal' | 'high';
  includeTitle?: boolean;
  includeFooter?: boolean;
  includePageNumbers?: boolean;
  margin?: { top: number; right: number; bottom: number; left: number };
  paperSize?: 'A4' | 'Letter' | 'Legal';
  scale?: number;
}

export interface PrintPreview {
  html: string;
  width: number;
  height: number;
  pages: number;
}

/**
 * Print Optimizer
 */
export class PrintOptimizer {
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Prepare for printing
   */
  public preparePrint(
    canvas: HTMLCanvasElement,
    data: any,
    options: PrintOptions = {}
  ): PrintPreview {
    const defaults: PrintOptions = {
      layout: 'portrait',
      quality: 'normal',
      includeTitle: true,
      includeFooter: true,
      includePageNumbers: true,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      paperSize: 'A4',
      scale: 1,
      ...options,
    };

    const dimensions = this.getPaperDimensions(defaults.paperSize!);
    const printWidth = dimensions.width - (defaults.margin!.left + defaults.margin!.right);
    const printHeight = dimensions.height - (defaults.margin!.top + defaults.margin!.bottom);

    // Create print HTML
    let html = this.createPrintHTML(canvas, data, defaults, printWidth, printHeight);

    // Calculate pages
    const pages = Math.ceil(printHeight / (canvas.height * defaults.scale!));

    this.emit('print:prepared', { pages, layout: defaults.layout });

    return {
      html,
      width: printWidth,
      height: printHeight,
      pages,
    };
  }

  /**
   * Create print HTML
   */
  private createPrintHTML(
    canvas: HTMLCanvasElement,
    data: any,
    options: PrintOptions,
    width: number,
    height: number
  ): string {
    const margin = options.margin!;
    const scale = options.scale || 1;

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${data.title || 'Chart'}</title>
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            .print-page { 
              page-break-after: always;
              margin: ${margin!.top}mm ${margin!.right}mm ${margin!.bottom}mm ${margin!.left}mm;
              width: ${width}px;
              height: ${height}px;
            }
            .print-header { margin-bottom: 20px; }
            .print-footer { margin-top: 20px; text-align: center; font-size: 12px; }
            .print-page-number { text-align: right; font-size: 10px; }
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .print-page {
            page-break-after: always;
            margin: ${margin!.top}mm ${margin!.right}mm ${margin!.bottom}mm ${margin!.left}mm;
            width: ${width}px;
            height: ${height}px;
            display: flex;
            flex-direction: column;
          }
          .print-header {
            margin-bottom: 20px;
          }
          .print-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .print-description {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
          }
          .print-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .print-content img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          .print-footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          .print-page-number {
            text-align: right;
            font-size: 10px;
            color: #999;
          }
        </style>
      </head>
      <body>
    `;

    // Add header
    if (options.includeTitle) {
      html += `
        <div class="print-page">
          <div class="print-header">
            <div class="print-title">${data.title || 'Chart'}</div>
            ${data.description ? `<div class="print-description">${data.description}</div>` : ''}
          </div>
      `;
    } else {
      html += '<div class="print-page">';
    }

    // Add chart image
    const imageData = canvas.toDataURL('image/png');
    html += `
      <div class="print-content">
        <img src="${imageData}" style="transform: scale(${scale});">
      </div>
    `;

    // Add footer
    if (options.includeFooter) {
      html += `
        <div class="print-footer">
          <div>Generated on ${new Date().toLocaleString()}</div>
      `;

      if (options.includePageNumbers) {
        html += '<div class="print-page-number">Page 1</div>';
      }

      html += '</div>';
    }

    html += `
        </div>
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Get paper dimensions
   */
  private getPaperDimensions(paperSize: string): { width: number; height: number } {
    const dimensions: Record<string, { width: number; height: number }> = {
      A4: { width: 210, height: 297 }, // mm
      Letter: { width: 216, height: 279 }, // mm
      Legal: { width: 216, height: 356 }, // mm
    };

    return dimensions[paperSize] || dimensions.A4;
  }

  /**
   * Print chart
   */
  public print(canvas: HTMLCanvasElement, data: any, options: PrintOptions = {}): void {
    const preview = this.preparePrint(canvas, data, options);

    // Create print window
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      this.emit('print:error', { error: 'Failed to open print window' });
      return;
    }

    printWindow.document.write(preview.html);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      this.emit('print:started', { pages: preview.pages });
    };
  }

  /**
   * Generate print preview
   */
  public generatePreview(
    canvas: HTMLCanvasElement,
    data: any,
    options: PrintOptions = {}
  ): HTMLElement {
    const preview = this.preparePrint(canvas, data, options);

    const container = document.createElement('div');
    container.innerHTML = preview.html;

    this.emit('preview:generated', { pages: preview.pages });

    return container;
  }

  /**
   * Optimize for print quality
   */
  public optimizeQuality(
    canvas: HTMLCanvasElement,
    quality: 'draft' | 'normal' | 'high' = 'normal'
  ): HTMLCanvasElement {
    const scale = this.getQualityScale(quality);

    const optimizedCanvas = document.createElement('canvas');
    optimizedCanvas.width = canvas.width * scale;
    optimizedCanvas.height = canvas.height * scale;

    const ctx = optimizedCanvas.getContext('2d');
    if (!ctx) {
      return canvas;
    }

    ctx.scale(scale, scale);
    ctx.drawImage(canvas, 0, 0);

    this.emit('quality:optimized', { quality, scale });

    return optimizedCanvas;
  }

  /**
   * Get quality scale
   */
  private getQualityScale(quality: string): number {
    switch (quality) {
      case 'draft':
        return 1;
      case 'normal':
        return 1.5;
      case 'high':
        return 2;
      default:
        return 1;
    }
  }

  /**
   * Create print stylesheet
   */
  public createPrintStylesheet(): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        .no-print {
          display: none !important;
        }
        .print-only {
          display: block !important;
        }
        img {
          max-width: 100%;
          page-break-inside: avoid;
        }
        table {
          page-break-inside: avoid;
        }
        tr {
          page-break-inside: avoid;
        }
      }
    `;

    document.head.appendChild(style);
    return style;
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
   * Destroy optimizer
   */
  public destroy(): void {
    this.listeners.clear();
  }
}

export default PrintOptimizer;
