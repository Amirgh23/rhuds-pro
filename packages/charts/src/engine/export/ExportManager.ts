/**
 * Export Manager
 * PDF, SVG, PNG, JSON export formats
 */

export interface ExportOptions {
  format: 'pdf' | 'svg' | 'png' | 'json';
  quality?: 'low' | 'medium' | 'high';
  width?: number;
  height?: number;
  includeMetadata?: boolean;
  filename?: string;
}

export interface ExportResult {
  format: string;
  size: number;
  duration: number;
  success: boolean;
  data?: Blob | string;
}

/**
 * Export Manager
 */
export class ExportManager {
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Export chart
   */
  public async export(
    canvas: HTMLCanvasElement,
    data: any,
    options: ExportOptions
  ): Promise<ExportResult> {
    const startTime = performance.now();

    try {
      let result: ExportResult;

      switch (options.format) {
        case 'pdf':
          result = await this.exportPDF(canvas, data, options);
          break;
        case 'svg':
          result = await this.exportSVG(canvas, data, options);
          break;
        case 'png':
          result = await this.exportPNG(canvas, options);
          break;
        case 'json':
          result = await this.exportJSON(data, options);
          break;
        default:
          throw new Error(`Unsupported format: ${options.format}`);
      }

      result.duration = performance.now() - startTime;
      this.emit('export:complete', result);

      return result;
    } catch (error) {
      this.emit('export:error', { error, format: options.format });
      throw error;
    }
  }

  /**
   * Export as PDF
   */
  private async exportPDF(
    canvas: HTMLCanvasElement,
    data: any,
    options: ExportOptions
  ): Promise<ExportResult> {
    // Create a simple PDF-like structure
    const width = options.width || canvas.width;
    const height = options.height || canvas.height;

    // Convert canvas to image
    const imageData = canvas.toDataURL('image/png');

    // Create PDF content (simplified)
    const pdfContent = this.createPDFContent(imageData, width, height, data, options);

    const blob = new Blob([pdfContent], { type: 'application/pdf' });

    if (options.filename) {
      this.downloadFile(blob, options.filename);
    }

    this.emit('export:pdf', { size: blob.size });

    return {
      format: 'pdf',
      size: blob.size,
      duration: 0,
      success: true,
      data: blob,
    };
  }

  /**
   * Export as SVG
   */
  private async exportSVG(
    canvas: HTMLCanvasElement,
    data: any,
    options: ExportOptions
  ): Promise<ExportResult> {
    const width = options.width || canvas.width;
    const height = options.height || canvas.height;

    // Create SVG
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;

    // Add metadata if requested
    if (options.includeMetadata) {
      svg += `<metadata><title>${data.title || 'Chart'}</title></metadata>`;
    }

    // Convert canvas to image and embed
    const imageData = canvas.toDataURL('image/png');
    svg += `<image href="${imageData}" width="${width}" height="${height}"/>`;

    svg += '</svg>';

    const blob = new Blob([svg], { type: 'image/svg+xml' });

    if (options.filename) {
      this.downloadFile(blob, options.filename);
    }

    this.emit('export:svg', { size: blob.size });

    return {
      format: 'svg',
      size: blob.size,
      duration: 0,
      success: true,
      data: blob,
    };
  }

  /**
   * Export as PNG
   */
  private async exportPNG(
    canvas: HTMLCanvasElement,
    options: ExportOptions
  ): Promise<ExportResult> {
    const quality = this.getQualityMultiplier(options.quality);
    const width = (options.width || canvas.width) * quality;
    const height = (options.height || canvas.height) * quality;

    // Create high-resolution canvas
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;

    const ctx = offscreenCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    ctx.scale(quality, quality);
    ctx.drawImage(canvas, 0, 0);

    // Convert to blob
    return new Promise((resolve) => {
      offscreenCanvas.toBlob((blob) => {
        if (!blob) {
          resolve({
            format: 'png',
            size: 0,
            duration: 0,
            success: false,
          });
          return;
        }

        if (options.filename) {
          this.downloadFile(blob, options.filename);
        }

        this.emit('export:png', { size: blob.size });

        resolve({
          format: 'png',
          size: blob.size,
          duration: 0,
          success: true,
          data: blob,
        });
      }, 'image/png');
    });
  }

  /**
   * Export as JSON
   */
  private async exportJSON(data: any, options: ExportOptions): Promise<ExportResult> {
    const exportData: any = {
      format: 'json',
      timestamp: new Date().toISOString(),
      data,
    };

    if (options.includeMetadata) {
      exportData.metadata = {
        title: data.title,
        description: data.description,
        version: '1.0.0',
      };
    }

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });

    if (options.filename) {
      this.downloadFile(blob, options.filename);
    }

    this.emit('export:json', { size: blob.size });

    return {
      format: 'json',
      size: blob.size,
      duration: 0,
      success: true,
      data: blob,
    };
  }

  /**
   * Create PDF content
   */
  private createPDFContent(
    imageData: string,
    width: number,
    height: number,
    data: any,
    options: ExportOptions
  ): string {
    // Simplified PDF structure
    let content = '%PDF-1.4\n';
    content += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
    content += '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
    content += `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Contents 4 0 R /Resources << /XObject << /Image 5 0 R >> >> >>\nendobj\n`;
    content += '4 0 obj\n<< /Length 44 >>\nstream\nBT\n/Image Do\nET\nendstream\nendobj\n';
    content +=
      'xref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000214 00000 n\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n308\n%%EOF\n';

    return content;
  }

  /**
   * Get quality multiplier
   */
  private getQualityMultiplier(quality?: string): number {
    switch (quality) {
      case 'low':
        return 1;
      case 'medium':
        return 1.5;
      case 'high':
        return 2;
      default:
        return 1;
    }
  }

  /**
   * Download file
   */
  private downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    this.listeners.clear();
  }
}

export default ExportManager;
