/**
 * Core Type System for Chart.js Equivalent System
 * Provides complete TypeScript type safety for all chart operations
 */

// ═══════════════════════════════════════════════════════════════════════════
// CHART VARIANT AND THEME TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chart variant determines visual style and theme
 */
export type ChartVariant = 'r-huds' | 'coldwar';

/**
 * Supported chart types
 */
export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'doughnut'
  | 'radar'
  | 'polarArea'
  | 'bubble'
  | 'scatter'
  | 'mixed';

/**
 * Update modes for chart refresh
 */
export type UpdateMode = 'default' | 'active' | 'resize' | 'reset' | 'none';

/**
 * Color types (scriptable or static)
 */
export type Color = string | CanvasGradient | CanvasPattern;

/**
 * Scriptable values can be functions or static values
 */
export type Scriptable<T> = T | ((ctx: ScriptableContext) => T);

/**
 * Indexable values can be arrays or single values
 */
export type Indexable<T> = T | T[];

// ═══════════════════════════════════════════════════════════════════════════
// CHART CONFIGURATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Base chart configuration
 */
export interface ChartConfiguration<
  TType extends ChartType = ChartType,
  TData = any,
  TOptions = any,
> {
  type: TType;
  data: ChartData<TData>;
  options?: ChartOptions<TOptions>;
  plugins?: Plugin[];
}

/**
 * Chart data structure
 */
export interface ChartData<TData = any> {
  labels?: string[];
  datasets: ChartDataset<TData>[];
}

/**
 * Dataset configuration
 */
export interface ChartDataset<TData = any> {
  label?: string;
  data: TData[];
  backgroundColor?: Scriptable<Indexable<Color>>;
  borderColor?: Scriptable<Indexable<Color>>;
  borderWidth?: Scriptable<Indexable<number>>;
  pointRadius?: Scriptable<Indexable<number>>;
  pointHoverRadius?: Scriptable<Indexable<number>>;
  fill?: boolean | string;
  tension?: number;
  type?: ChartType;
  hidden?: boolean;
  [key: string]: any;
}

/**
 * Chart options with full type safety
 */
export interface ChartOptions<TType = ChartType> {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  aspectRatio?: number;
  devicePixelRatio?: number;
  interaction?: InteractionOptions;
  plugins?: PluginOptions;
  scales?: ScalesOptions;
  elements?: ElementOptions;
  animation?: AnimationOptions;
  layout?: LayoutOptions;
  backgroundColor?: Color;
  [key: string]: any;
}

/**
 * Interaction options
 */
export interface InteractionOptions {
  mode?: 'point' | 'nearest' | 'index' | 'dataset' | 'x' | 'y';
  intersect?: boolean;
}

/**
 * Plugin options
 */
export interface PluginOptions {
  tooltip?: TooltipOptions;
  legend?: LegendOptions;
  title?: TitleOptions;
  filler?: FillerOptions;
  [key: string]: any;
}

/**
 * Tooltip options
 */
export interface TooltipOptions {
  enabled?: boolean;
  backgroundColor?: Color;
  titleColor?: Color;
  bodyColor?: Color;
  borderColor?: Color;
  borderWidth?: number;
  padding?: number;
  displayColors?: boolean;
  callbacks?: TooltipCallbacks;
}

/**
 * Tooltip callbacks
 */
export interface TooltipCallbacks {
  title?: (context: TooltipContext[]) => string;
  label?: (context: TooltipContext) => string;
  afterLabel?: (context: TooltipContext) => string;
}

/**
 * Tooltip context
 */
export interface TooltipContext {
  chart: Chart;
  dataIndex: number;
  dataset: ChartDataset;
  datasetIndex: number;
  label: string;
  parsed: any;
  raw: any;
  value: string;
}

/**
 * Legend options
 */
export interface LegendOptions {
  display?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  labels?: LegendLabelOptions;
}

/**
 * Legend label options
 */
export interface LegendLabelOptions {
  color?: Color;
  font?: FontOptions;
  padding?: number;
  usePointStyle?: boolean;
  pointStyle?: string;
}

/**
 * Title options
 */
export interface TitleOptions {
  display?: boolean;
  text?: string;
  color?: Color;
  font?: FontOptions;
  padding?: number;
}

/**
 * Filler options
 */
export interface FillerOptions {
  propagate?: boolean;
}

/**
 * Font options
 */
export interface FontOptions {
  family?: string;
  size?: number;
  weight?: string | number;
  lineHeight?: number;
}

/**
 * Scales options
 */
export interface ScalesOptions {
  [key: string]: ScaleOptions;
}

/**
 * Scale options
 */
export interface ScaleOptions {
  type?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  min?: number;
  max?: number;
  ticks?: TickOptions;
  grid?: GridOptions;
  title?: ScaleTitleOptions;
}

/**
 * Tick options
 */
export interface TickOptions {
  stepSize?: number;
  count?: number;
  precision?: number;
  callback?: (value: any, index: number, ticks: any[]) => string;
}

/**
 * Grid options
 */
export interface GridOptions {
  display?: boolean;
  color?: Color;
  lineWidth?: number;
  drawBorder?: boolean;
  drawOnChartArea?: boolean;
  drawTicks?: boolean;
}

/**
 * Scale title options
 */
export interface ScaleTitleOptions {
  display?: boolean;
  text?: string;
  color?: Color;
  font?: FontOptions;
  padding?: number;
}

/**
 * Elements options
 */
export interface ElementOptions {
  point?: PointOptions;
  line?: LineOptions;
  arc?: ArcOptions;
  rectangle?: RectangleOptions;
  bar?: BarOptions;
  backgroundColor?: Color | Scriptable<Indexable<Color>>;
  borderColor?: Color | Scriptable<Indexable<Color>>;
  borderWidth?: number | Scriptable<Indexable<number>>;
  [key: string]: any;
}

/**
 * Point element options
 */
export interface PointOptions {
  radius?: number;
  hoverRadius?: number;
  backgroundColor?: Color;
  borderColor?: Color;
  borderWidth?: number;
}

/**
 * Line element options
 */
export interface LineOptions {
  tension?: number;
  borderColor?: Color;
  borderWidth?: number;
  fill?: boolean;
}

/**
 * Arc element options
 */
export interface ArcOptions {
  backgroundColor?: Color;
  borderColor?: Color;
  borderWidth?: number;
}

/**
 * Rectangle element options
 */
export interface RectangleOptions {
  backgroundColor?: Color;
  borderColor?: Color;
  borderWidth?: number;
}

/**
 * Bar element options
 */
export interface BarOptions extends RectangleOptions {
  barPercentage?: number;
  categoryPercentage?: number;
}

/**
 * Animation options
 */
export interface AnimationOptions {
  duration?: number;
  easing?: EasingFunction | string;
  delay?: number;
  loop?: boolean;
  onProgress?: (animation: Animation) => void;
  onComplete?: (animation: Animation) => void;
}

/**
 * Layout options
 */
export interface LayoutOptions {
  padding?: number | { top?: number; bottom?: number; left?: number; right?: number };
}

// ═══════════════════════════════════════════════════════════════════════════
// THEME TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Theme configuration for chart variants
 */
export interface ChartTheme {
  variant: ChartVariant;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    grid: string;
    border: string;
  };
  effects: {
    glow: boolean;
    glowIntensity: number;
    neonPulse: boolean;
    scanlines: boolean;
    scanlinesIntensity: 'low' | 'medium' | 'high';
    lightTrail: boolean;
    phosphorBurn: boolean;
    radarSweep: boolean;
  };
  fonts: {
    family: string;
    size: number;
    weight: number;
    lineHeight: number;
  };
  animation: {
    duration: number;
    easing: string;
    delay: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chart registry for managing components
 */
export interface ChartRegistry {
  controllers: Map<string, any>;
  elements: Map<string, any>;
  scales: Map<string, any>;
  plugins: Map<string, Plugin>;
}

// ═══════════════════════════════════════════════════════════════════════════
// DATASET CONTROLLER TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Dataset controller interface
 */
export interface IDatasetController {
  chart: Chart;
  index: number;
  type: string;

  initialize(): void;
  parse(start: number, count: number): void;
  update(mode: UpdateMode): void;
  draw(): void;
  destroy(): void;

  getDataset(): ChartDataset;
  getMeta(): ChartMeta;
  getStyle(index: number, active: boolean): ElementStyle;
}

/**
 * Chart metadata
 */
export interface ChartMeta {
  type: string;
  index: number;
  data: ChartElement[];
  parsed: any[];
  updated: boolean;
  hidden: boolean;
}

/**
 * Element style
 */
export interface ElementStyle {
  backgroundColor?: Color | Scriptable<Indexable<Color>>;
  borderColor?: Color | Scriptable<Indexable<Color>>;
  borderWidth?: number | Scriptable<Indexable<number>>;
  radius?: number | Scriptable<Indexable<number>>;
  [key: string]: any;
}

// ═══════════════════════════════════════════════════════════════════════════
// CHART ELEMENT TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chart element interface
 */
export interface IChartElement {
  x: number;
  y: number;
  options: ElementOptions;

  inRange(mouseX: number, mouseY: number): boolean;
  inXRange(mouseX: number): boolean;
  inYRange(mouseY: number): boolean;
  getCenterPoint(): Point;
  tooltipPosition(): Point;
  draw(ctx: CanvasRenderingContext2D): void;
}

/**
 * Point in 2D space
 */
export interface Point {
  x: number;
  y: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// SCALE TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Scale interface
 */
export interface IScale {
  id: string;
  type: string;
  options: ScaleOptions;
  ctx: CanvasRenderingContext2D;
  chart: Chart;

  min: number;
  max: number;
  ticks: Tick[];

  parse(value: any): number;
  getPixelForValue(value: number): number;
  getValueForPixel(pixel: number): number;
  getPixelForTick(index: number): number;
  getLabelForValue(value: number): string;

  update(maxWidth: number, maxHeight: number): void;
  draw(chartArea: ChartArea): void;
}

/**
 * Tick on a scale
 */
export interface Tick {
  value: number;
  label: string;
  major: boolean;
}

/**
 * Chart area bounds
 */
export interface ChartArea {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// PLUGIN TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Plugin interface
 */
export interface Plugin<TOptions = any> {
  id: string;

  beforeInit?(chart: Chart, args: any, options: TOptions): void;
  afterInit?(chart: Chart, args: any, options: TOptions): void;
  beforeUpdate?(chart: Chart, args: any, options: TOptions): void;
  afterUpdate?(chart: Chart, args: any, options: TOptions): void;
  beforeDraw?(chart: Chart, args: any, options: TOptions): void;
  afterDraw?(chart: Chart, args: any, options: TOptions): void;
  beforeEvent?(chart: Chart, args: any, options: TOptions): void;
  afterEvent?(chart: Chart, args: any, options: TOptions): void;
  destroy?(chart: Chart): void;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Easing function type
 */
export type EasingFunction = (t: number) => number;

/**
 * Animation instance
 */
export interface Animation {
  duration: number;
  easing: EasingFunction;
  delay: number;
  properties: AnimationProperty[];
  complete: boolean;
  onProgress?: (animation: Animation) => void;
  onComplete?: (animation: Animation) => void;
}

/**
 * Animation property
 */
export interface AnimationProperty {
  path: string;
  from: number;
  to: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENT TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chart event
 */
export interface ChartEvent {
  type: string;
  native: Event | null;
  x: number;
  y: number;
  chart: Chart;
}

/**
 * Event handler
 */
export type EventHandler = (event: ChartEvent, elements: ChartElement[]) => void;

// ═══════════════════════════════════════════════════════════════════════════
// SCRIPTABLE CONTEXT TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Context for scriptable values
 */
export interface ScriptableContext {
  chart: Chart;
  dataIndex: number;
  dataset: ChartDataset;
  datasetIndex: number;
  parsed: any;
  raw: any;
}

// ═══════════════════════════════════════════════════════════════════════════
// CHART INSTANCE TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chart instance (forward declaration, implemented in Chart class)
 */
export interface Chart {
  type: ChartType;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  config: ChartConfiguration;
  data: ChartData;
  options: ChartOptions;
  theme: ChartTheme;
  registry: ChartRegistry;
  controllers: IDatasetController[];
  scales: Map<string, IScale>;
  plugins: Plugin[];
  chartArea: ChartArea;
  initialized: boolean;
  rendered: boolean;

  initialize(): void;
  update(mode?: UpdateMode): void;
  render(mode?: UpdateMode): void;
  destroy(): void;
  resize(width: number, height: number): void;
  on(event: string, handler: EventHandler): void;
  off(event: string, handler: EventHandler): void;
  emit(event: ChartEvent): void;
  getContext(): CanvasRenderingContext2D;
  getWidth(): number;
  getHeight(): number;
}

/**
 * Dataset controller (forward declaration, implemented in DatasetController class)
 */
export interface DatasetController extends IDatasetController {}

/**
 * Chart element (forward declaration, implemented in ChartElement class)
 */
export interface ChartElement extends IChartElement {}

/**
 * Scale (forward declaration, implemented in Scale class)
 */
export interface Scale extends IScale {}
