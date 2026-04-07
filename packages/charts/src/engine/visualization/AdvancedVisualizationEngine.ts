/**
 * Advanced Visualization Engine
 * Custom visualizations, themes, and rendering options
 */

export interface VisualizationTheme {
  id: string;
  name: string;
  colors: string[];
  fonts: Record<string, string>;
  spacing: Record<string, number>;
  metadata?: Record<string, any>;
}

export interface CustomVisualization {
  id: string;
  name: string;
  type: string;
  renderer: Function;
  config: Record<string, any>;
  createdAt: Date;
}

export interface VisualizationPreset {
  id: string;
  name: string;
  theme: VisualizationTheme;
  visualizations: CustomVisualization[];
  description?: string;
}

/**
 * Advanced Visualization Engine
 */
export class AdvancedVisualizationEngine {
  private themes: Map<string, VisualizationTheme> = new Map();
  private visualizations: Map<string, CustomVisualization> = new Map();
  private presets: Map<string, VisualizationPreset> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeDefaultThemes();
  }

  /**
   * Initialize default themes
   */
  private initializeDefaultThemes(): void {
    const darkTheme: VisualizationTheme = {
      id: 'dark',
      name: 'Dark Theme',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
      fonts: { primary: 'Arial', secondary: 'Courier' },
      spacing: { small: 8, medium: 16, large: 24 },
    };

    const lightTheme: VisualizationTheme = {
      id: 'light',
      name: 'Light Theme',
      colors: ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6'],
      fonts: { primary: 'Helvetica', secondary: 'Courier' },
      spacing: { small: 8, medium: 16, large: 24 },
    };

    this.themes.set('dark', darkTheme);
    this.themes.set('light', lightTheme);
  }

  /**
   * Create theme
   */
  public createTheme(
    name: string,
    colors: string[],
    fonts: Record<string, string>,
    spacing: Record<string, number>
  ): VisualizationTheme {
    const id = this.generateId();

    const theme: VisualizationTheme = {
      id,
      name,
      colors,
      fonts,
      spacing,
    };

    this.themes.set(id, theme);
    this.emit('theme:created', { themeId: id, name });

    return theme;
  }

  /**
   * Get theme
   */
  public getTheme(themeId: string): VisualizationTheme | undefined {
    return this.themes.get(themeId);
  }

  /**
   * List themes
   */
  public listThemes(): VisualizationTheme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Register visualization
   */
  public registerVisualization(
    name: string,
    type: string,
    renderer: Function,
    config: Record<string, any>
  ): CustomVisualization {
    const id = this.generateId();

    const visualization: CustomVisualization = {
      id,
      name,
      type,
      renderer,
      config,
      createdAt: new Date(),
    };

    this.visualizations.set(id, visualization);
    this.emit('visualization:registered', { vizId: id, name, type });

    return visualization;
  }

  /**
   * Get visualization
   */
  public getVisualization(vizId: string): CustomVisualization | undefined {
    return this.visualizations.get(vizId);
  }

  /**
   * List visualizations
   */
  public listVisualizations(type?: string): CustomVisualization[] {
    let visualizations = Array.from(this.visualizations.values());

    if (type) {
      visualizations = visualizations.filter((v) => v.type === type);
    }

    return visualizations;
  }

  /**
   * Render visualization
   */
  public renderVisualization(vizId: string, data: any[], options?: Record<string, any>): any {
    const visualization = this.visualizations.get(vizId);
    if (!visualization) {
      throw new Error('Visualization not found');
    }

    try {
      const result = visualization.renderer(data, { ...visualization.config, ...options });
      this.emit('visualization:rendered', { vizId });
      return result;
    } catch (error) {
      this.emit('visualization:error', { vizId, error });
      throw error;
    }
  }

  /**
   * Create preset
   */
  public createPreset(
    name: string,
    themeId: string,
    visualizationIds: string[],
    description?: string
  ): VisualizationPreset {
    const id = this.generateId();
    const theme = this.themes.get(themeId);

    if (!theme) {
      throw new Error('Theme not found');
    }

    const visualizations = visualizationIds
      .map((vizId) => this.visualizations.get(vizId))
      .filter((v) => v !== undefined) as CustomVisualization[];

    const preset: VisualizationPreset = {
      id,
      name,
      theme,
      visualizations,
      description,
    };

    this.presets.set(id, preset);
    this.emit('preset:created', { presetId: id, name });

    return preset;
  }

  /**
   * Get preset
   */
  public getPreset(presetId: string): VisualizationPreset | undefined {
    return this.presets.get(presetId);
  }

  /**
   * List presets
   */
  public listPresets(): VisualizationPreset[] {
    return Array.from(this.presets.values());
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    totalThemes: number;
    totalVisualizations: number;
    totalPresets: number;
    vizByType: Record<string, number>;
  } {
    const vizByType: Record<string, number> = {};
    this.visualizations.forEach((viz) => {
      vizByType[viz.type] = (vizByType[viz.type] || 0) + 1;
    });

    return {
      totalThemes: this.themes.size,
      totalVisualizations: this.visualizations.size,
      totalPresets: this.presets.size,
      vizByType,
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `viz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    this.themes.clear();
    this.visualizations.clear();
    this.presets.clear();
    this.listeners.clear();
  }
}

export default AdvancedVisualizationEngine;
