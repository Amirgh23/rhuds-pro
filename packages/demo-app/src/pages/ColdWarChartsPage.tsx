/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR CHARTS PAGE - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 * تمام چارت‌های سیستم با استایل Cold War
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useInterval } from '@rhuds/core';
import './ColdWarChartsPage.css';
import { isNearDataPoint } from './ColdWarChartsTooltipLogic';
import {
  drawLineChart,
  drawBarChart,
  drawPieChart,
  drawRadarChart,
  drawBubbleChart,
  drawAreaChart,
  drawDoughnutChart,
  drawScatterChart,
  drawComboChart,
  drawStackedBarChart,
  drawStackedLineChart,
  drawPolarChart,
  drawHorizontalBarChart,
  drawBarBorderRadius,
  drawFloatingBars,
  drawStackedGroupedBar,
  drawLineInterpolation,
  drawMultiAxisLine,
  drawPointStyling,
  drawSegmentStyling,
  drawSteppedLine,
  drawLineStyling,
  drawComboBarLine,
  drawMultiSeriesPie,
  drawPolarArea,
  drawPolarAreaCentered,
  drawRadarSkipPoints,
  drawScatterMultiAxis,
  drawStackedBarLine,
  drawLineBoundaries,
  drawLineMultipleDatasets,
  drawLineTimeAxis,
  drawStackedRadar,
  drawLinearScaleMinMax,
  drawLinearScaleSuggested,
  drawLinearScaleStepSize,
  drawLogScale,
  drawStackedLinearCategory,
  drawTimeScale,
  drawTimeScaleMaxSpan,
  drawTimeScaleCombo,
  drawScriptableBar,
  drawScriptableBubble,
  drawScriptableLine,
  drawScriptablePie,
  drawScriptablePolar,
  drawScriptableRadar,
  drawProgressiveLine,
  drawDelayedBar,
  drawLoopAnimation,
  drawDropAnimation,
  drawTensionAnimation,
  drawEasingShowcase,
  drawTooltipCallbacks,
  drawCustomTooltip,
  drawPointHitDetection,
  drawNearestPoint,
  drawAxisMode,
  drawDatasetMode,
  drawLegendPosition,
  drawLegendAlignment,
  drawLegendEvents,
  drawTitlePosition,
  drawTitleAlignment,
  drawSubtitle,
  drawGridConfiguration,
  drawGridStyling,
  drawAxesBorders,
  drawTickConfiguration,
  drawAxesStyling,
  drawMultipleYAxes,
  drawMixedChartTypes,
  drawFinancialChart,
  drawGanttChart,
  drawWaterfallChart,
  drawFunnelChart,
} from '../components/ColdWarChartRenderer';

type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'doughnut'
  | 'radar'
  | 'polar'
  | 'bubble'
  | 'scatter'
  | 'area'
  | 'combo'
  | 'stackedBar'
  | 'stackedLine'
  | 'horizontalBar'
  | 'barBorderRadius'
  | 'floatingBars'
  | 'stackedGroupedBar'
  | 'lineInterpolation'
  | 'multiAxisLine'
  | 'pointStyling'
  | 'segmentStyling'
  | 'steppedLine'
  | 'lineStyling'
  | 'comboBarLine'
  | 'multiSeriesPie'
  | 'polarArea'
  | 'polarAreaCentered'
  | 'radarSkipPoints'
  | 'scatterMultiAxis'
  | 'stackedBarLine'
  | 'lineBoundaries'
  | 'lineMultipleDatasets'
  | 'lineTimeAxis'
  | 'stackedRadar'
  | 'linearScaleMinMax'
  | 'linearScaleSuggested'
  | 'linearScaleStepSize'
  | 'logScale'
  | 'stackedLinearCategory'
  | 'timeScale'
  | 'timeScaleMaxSpan'
  | 'timeScaleCombo'
  | 'scriptableBar'
  | 'scriptableBubble'
  | 'scriptableLine'
  | 'scriptablePie'
  | 'scriptablePolar'
  | 'scriptableRadar'
  | 'progressiveLine'
  | 'delayedBar'
  | 'loopAnimation'
  | 'dropAnimation'
  | 'tensionAnimation'
  | 'easingShowcase'
  | 'tooltipCallbacks'
  | 'customTooltip'
  | 'pointHitDetection'
  | 'nearestPoint'
  | 'axisMode'
  | 'datasetMode'
  | 'legendPosition'
  | 'legendAlignment'
  | 'legendEvents'
  | 'titlePosition'
  | 'titleAlignment'
  | 'subtitle'
  | 'gridConfiguration'
  | 'gridStyling'
  | 'axesBorders'
  | 'tickConfiguration'
  | 'axesStyling'
  | 'multipleYAxes'
  | 'mixedChartTypes'
  | 'financialChart'
  | 'ganttChart'
  | 'waterfallChart'
  | 'funnelChart';

interface ChartConfig {
  id: ChartType;
  title: string;
  description: string;
  category:
    | 'basic'
    | 'advanced'
    | 'specialized'
    | 'scales'
    | 'scriptable'
    | 'animation'
    | 'interaction'
    | 'legend'
    | 'grid'
    | 'special';
}

const CHART_CONFIGS: ChartConfig[] = [
  // ═══════════════════════════════════════════════════════════════
  // BASIC CHARTS (8)
  // ═══════════════════════════════════════════════════════════════
  { id: 'line', title: 'Line Chart', description: 'خط‌نمودار پایه', category: 'basic' },
  { id: 'bar', title: 'Bar Chart', description: 'نمودار میله‌ای', category: 'basic' },
  { id: 'pie', title: 'Pie Chart', description: 'نمودار دایره‌ای', category: 'basic' },
  { id: 'doughnut', title: 'Doughnut Chart', description: 'نمودار حلقه‌ای', category: 'basic' },
  { id: 'radar', title: 'Radar Chart', description: 'نمودار رادار', category: 'basic' },
  { id: 'polar', title: 'Polar Chart', description: 'نمودار قطبی', category: 'basic' },
  { id: 'bubble', title: 'Bubble Chart', description: 'نمودار حبابی', category: 'basic' },
  { id: 'scatter', title: 'Scatter Chart', description: 'نمودار پراکندگی', category: 'basic' },

  // ═══════════════════════════════════════════════════════════════
  // ADVANCED BAR CHARTS (5)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'barBorderRadius',
    title: 'Bar Border Radius',
    description: 'میله با گوشه گرد',
    category: 'advanced',
  },
  {
    id: 'floatingBars',
    title: 'Floating Bars',
    description: 'میله‌های شناور',
    category: 'advanced',
  },
  { id: 'horizontalBar', title: 'Horizontal Bar', description: 'میله افقی', category: 'advanced' },
  { id: 'stackedBar', title: 'Stacked Bar', description: 'میله انباشتی', category: 'advanced' },
  {
    id: 'stackedGroupedBar',
    title: 'Stacked Grouped Bar',
    description: 'میله انباشتی گروهی',
    category: 'advanced',
  },

  // ═══════════════════════════════════════════════════════════════
  // ADVANCED LINE CHARTS (6)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'lineInterpolation',
    title: 'Line Interpolation',
    description: 'خط با درون‌یابی',
    category: 'advanced',
  },
  {
    id: 'multiAxisLine',
    title: 'Multi Axis Line',
    description: 'خط چند محوره',
    category: 'advanced',
  },
  { id: 'pointStyling', title: 'Point Styling', description: 'استایل نقاط', category: 'advanced' },
  {
    id: 'segmentStyling',
    title: 'Segment Styling',
    description: 'استایل بخش‌ها',
    category: 'advanced',
  },
  { id: 'steppedLine', title: 'Stepped Line', description: 'خط پله‌ای', category: 'advanced' },
  { id: 'lineStyling', title: 'Line Styling', description: 'استایل خط', category: 'advanced' },

  // ═══════════════════════════════════════════════════════════════
  // COMBO CHARTS (7)
  // ═══════════════════════════════════════════════════════════════
  { id: 'combo', title: 'Combo Chart', description: 'نمودار ترکیبی', category: 'specialized' },
  {
    id: 'comboBarLine',
    title: 'Combo Bar/Line',
    description: 'ترکیب میله و خط',
    category: 'specialized',
  },
  {
    id: 'multiSeriesPie',
    title: 'Multi Series Pie',
    description: 'دایره چند سری',
    category: 'specialized',
  },
  { id: 'polarArea', title: 'Polar Area', description: 'ناحیه قطبی', category: 'specialized' },
  {
    id: 'polarAreaCentered',
    title: 'Polar Area Centered',
    description: 'ناحیه قطبی مرکزی',
    category: 'specialized',
  },
  {
    id: 'radarSkipPoints',
    title: 'Radar Skip Points',
    description: 'رادار با نقاط پرشی',
    category: 'specialized',
  },
  {
    id: 'scatterMultiAxis',
    title: 'Scatter Multi Axis',
    description: 'پراکندگی چند محوره',
    category: 'specialized',
  },

  // ═══════════════════════════════════════════════════════════════
  // AREA CHARTS (6)
  // ═══════════════════════════════════════════════════════════════
  { id: 'area', title: 'Area Chart', description: 'نمودار ناحیه‌ای', category: 'specialized' },
  {
    id: 'lineBoundaries',
    title: 'Line Boundaries',
    description: 'خط با مرزها',
    category: 'specialized',
  },
  {
    id: 'lineMultipleDatasets',
    title: 'Line Multiple Datasets',
    description: 'خط چند مجموعه',
    category: 'specialized',
  },
  {
    id: 'lineTimeAxis',
    title: 'Line Time Axis',
    description: 'خط با محور زمانی',
    category: 'specialized',
  },
  { id: 'stackedLine', title: 'Stacked Line', description: 'خط انباشتی', category: 'specialized' },
  {
    id: 'stackedRadar',
    title: 'Stacked Radar',
    description: 'رادار انباشتی',
    category: 'specialized',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCALE CHARTS (8)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'linearScaleMinMax',
    title: 'Linear Scale Min-Max',
    description: 'مقیاس خطی حداقل-حداکثر',
    category: 'scales',
  },
  {
    id: 'linearScaleSuggested',
    title: 'Linear Scale Suggested',
    description: 'مقیاس خطی پیشنهادی',
    category: 'scales',
  },
  {
    id: 'linearScaleStepSize',
    title: 'Linear Scale Step',
    description: 'مقیاس خطی با گام',
    category: 'scales',
  },
  { id: 'logScale', title: 'Log Scale', description: 'مقیاس لگاریتمی', category: 'scales' },
  {
    id: 'stackedLinearCategory',
    title: 'Stacked Linear/Category',
    description: 'مقیاس انباشتی',
    category: 'scales',
  },
  { id: 'timeScale', title: 'Time Scale', description: 'مقیاس زمانی', category: 'scales' },
  {
    id: 'timeScaleMaxSpan',
    title: 'Time Scale Max Span',
    description: 'مقیاس زمانی با بازه',
    category: 'scales',
  },
  {
    id: 'timeScaleCombo',
    title: 'Time Scale Combo',
    description: 'مقیاس زمانی ترکیبی',
    category: 'scales',
  },

  // ═══════════════════════════════════════════════════════════════
  // SCRIPTABLE CHARTS (6)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'scriptableBar',
    title: 'Scriptable Bar',
    description: 'میله با اسکریپت',
    category: 'scriptable',
  },
  {
    id: 'scriptableBubble',
    title: 'Scriptable Bubble',
    description: 'حباب با اسکریپت',
    category: 'scriptable',
  },
  {
    id: 'scriptableLine',
    title: 'Scriptable Line',
    description: 'خط با اسکریپت',
    category: 'scriptable',
  },
  {
    id: 'scriptablePie',
    title: 'Scriptable Pie',
    description: 'دایره با اسکریپت',
    category: 'scriptable',
  },
  {
    id: 'scriptablePolar',
    title: 'Scriptable Polar',
    description: 'قطبی با اسکریپت',
    category: 'scriptable',
  },
  {
    id: 'scriptableRadar',
    title: 'Scriptable Radar',
    description: 'رادار با اسکریپت',
    category: 'scriptable',
  },

  // ═══════════════════════════════════════════════════════════════
  // ANIMATION CHARTS (6)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'progressiveLine',
    title: 'Progressive Line',
    description: 'خط پیشرونده',
    category: 'animation',
  },
  { id: 'delayedBar', title: 'Delayed Bar', description: 'میله با تاخیر', category: 'animation' },
  {
    id: 'loopAnimation',
    title: 'Loop Animation',
    description: 'انیمیشن حلقه‌ای',
    category: 'animation',
  },
  {
    id: 'dropAnimation',
    title: 'Drop Animation',
    description: 'انیمیشن سقوط',
    category: 'animation',
  },
  {
    id: 'tensionAnimation',
    title: 'Tension Animation',
    description: 'انیمیشن کشش',
    category: 'animation',
  },
  {
    id: 'easingShowcase',
    title: 'Easing Showcase',
    description: 'نمایش easing',
    category: 'animation',
  },

  // ═══════════════════════════════════════════════════════════════
  // INTERACTION CHARTS (6)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'tooltipCallbacks',
    title: 'Tooltip Callbacks',
    description: 'tooltip با callback',
    category: 'interaction',
  },
  {
    id: 'customTooltip',
    title: 'Custom Tooltip',
    description: 'tooltip سفارشی',
    category: 'interaction',
  },
  {
    id: 'pointHitDetection',
    title: 'Point Hit Detection',
    description: 'تشخیص کلیک نقطه',
    category: 'interaction',
  },
  {
    id: 'nearestPoint',
    title: 'Nearest Point',
    description: 'نزدیک‌ترین نقطه',
    category: 'interaction',
  },
  { id: 'axisMode', title: 'Axis Mode', description: 'حالت محور', category: 'interaction' },
  {
    id: 'datasetMode',
    title: 'Dataset Mode',
    description: 'حالت مجموعه داده',
    category: 'interaction',
  },

  // ═══════════════════════════════════════════════════════════════
  // LEGEND & TITLE CHARTS (6)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'legendPosition',
    title: 'Legend Position',
    description: 'موقعیت راهنما',
    category: 'legend',
  },
  {
    id: 'legendAlignment',
    title: 'Legend Alignment',
    description: 'تراز راهنما',
    category: 'legend',
  },
  {
    id: 'legendEvents',
    title: 'Legend Events',
    description: 'رویدادهای راهنما',
    category: 'legend',
  },
  { id: 'titlePosition', title: 'Title Position', description: 'موقعیت عنوان', category: 'legend' },
  { id: 'titleAlignment', title: 'Title Alignment', description: 'تراز عنوان', category: 'legend' },
  { id: 'subtitle', title: 'Subtitle', description: 'زیرعنوان', category: 'legend' },

  // ═══════════════════════════════════════════════════════════════
  // GRID & AXES CHARTS (6)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'gridConfiguration',
    title: 'Grid Configuration',
    description: 'پیکربندی شبکه',
    category: 'grid',
  },
  { id: 'gridStyling', title: 'Grid Styling', description: 'استایل شبکه', category: 'grid' },
  { id: 'axesBorders', title: 'Axes Borders', description: 'مرزهای محورها', category: 'grid' },
  {
    id: 'tickConfiguration',
    title: 'Tick Configuration',
    description: 'پیکربندی تیک‌ها',
    category: 'grid',
  },
  { id: 'axesStyling', title: 'Axes Styling', description: 'استایل محورها', category: 'grid' },
  {
    id: 'multipleYAxes',
    title: 'Multiple Y Axes',
    description: 'محورهای Y چندگانه',
    category: 'grid',
  },

  // ═══════════════════════════════════════════════════════════════
  // SPECIAL CHARTS (5)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'mixedChartTypes',
    title: 'Mixed Chart Types',
    description: 'انواع ترکیبی',
    category: 'special',
  },
  {
    id: 'financialChart',
    title: 'Financial Chart',
    description: 'نمودار مالی',
    category: 'special',
  },
  { id: 'ganttChart', title: 'Gantt Chart', description: 'نمودار گانت', category: 'special' },
  {
    id: 'waterfallChart',
    title: 'Waterfall Chart',
    description: 'نمودار آبشاری',
    category: 'special',
  },
  { id: 'funnelChart', title: 'Funnel Chart', description: 'نمودار قیفی', category: 'special' },
];

export const ColdWarChartsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    | 'all'
    | 'basic'
    | 'advanced'
    | 'specialized'
    | 'scales'
    | 'scriptable'
    | 'animation'
    | 'interaction'
    | 'legend'
    | 'grid'
    | 'special'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});

  // Animation state - per chart
  const [chartAnimations, setChartAnimations] = useState<{ [key: string]: number }>({});
  const animationTimers = useRef<{ [key: string]: number }>({});

  // Store chart data for tooltips
  const chartDataRef = useRef<{ [key: string]: any }>({});

  // Tooltip state with actual chart data
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    label: string;
    value: string | number;
    color: string;
    chartId: string;
  } | null>(null);

  // Replay animation for a specific chart
  const replayChartAnimation = useCallback((chartId: string) => {
    // Clear existing timer if any
    if (animationTimers.current[chartId]) {
      clearInterval(animationTimers.current[chartId]);
    }

    // Reset progress to 0
    setChartAnimations((prev) => ({ ...prev, [chartId]: 0 }));

    // Animate from 0 to 1 over 2 seconds
    const startTime = Date.now();
    const duration = 2000;

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setChartAnimations((prev) => ({ ...prev, [chartId]: progress }));

      if (progress >= 1) {
        clearInterval(timer);
        delete animationTimers.current[chartId];
      }
    }, 16); // ~60fps

    animationTimers.current[chartId] = timer;
  }, []);

  // Generate tooltip content based on chart type and cursor position
  const getTooltipContent = (chartId: string, x: number, y: number): string => {
    const canvas = canvasRefs.current[chartId];
    if (!canvas) return 'No data';

    const rect = canvas.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;

    // Normalize to 0-1 range
    const normalizedX = relX / canvas.width;
    const normalizedY = 1 - relY / canvas.height;

    // Format based on chart type with proper units
    const tooltips: { [key: string]: string } = {
      // Basic Charts
      line: `Y: ${(normalizedY * 100).toFixed(1)}%`,
      bar: `Value: ${(normalizedY * 100).toFixed(1)}`,
      pie: `Percentage: ${(normalizedY * 100).toFixed(1)}%`,
      doughnut: `Segment: ${(normalizedY * 100).toFixed(1)}%`,
      radar: `Radius: ${(normalizedY * 100).toFixed(1)}%`,
      polar: `Angle: ${(normalizedX * 360).toFixed(1)}°`,
      bubble: `Size: ${(normalizedY * 100).toFixed(1)}px`,
      scatter: `X: ${(normalizedX * 100).toFixed(1)}, Y: ${(normalizedY * 100).toFixed(1)}`,

      // Advanced Bar Charts
      barBorderRadius: `Height: ${(normalizedY * 100).toFixed(1)}`,
      floatingBars: `Range: ${(normalizedY * 100).toFixed(1)}%`,
      horizontalBar: `Width: ${(normalizedY * 100).toFixed(1)}%`,
      stackedBar: `Stack: ${(normalizedY * 100).toFixed(1)}%`,
      stackedGroupedBar: `Group: ${(normalizedY * 100).toFixed(1)}%`,

      // Advanced Line Charts
      lineInterpolation: `Curve: ${(normalizedY * 100).toFixed(1)}%`,
      multiAxisLine: `Value: ${(normalizedY * 100).toFixed(1)}`,
      pointStyling: `Point: ${(normalizedY * 100).toFixed(1)}`,
      segmentStyling: `Segment: ${(normalizedY * 100).toFixed(1)}%`,
      steppedLine: `Step: ${(normalizedY * 100).toFixed(1)}%`,
      lineStyling: `Style: ${(normalizedY * 100).toFixed(1)}%`,

      // Combo Charts
      combo: `Data: ${(normalizedY * 100).toFixed(1)}%`,
      comboBarLine: `Mixed: ${(normalizedY * 100).toFixed(1)}%`,
      multiSeriesPie: `Series: ${(normalizedY * 100).toFixed(1)}%`,
      polarArea: `Area: ${(normalizedY * 100).toFixed(1)}%`,
      polarAreaCentered: `Center: ${(normalizedY * 100).toFixed(1)}%`,
      radarSkipPoints: `Point: ${(normalizedY * 100).toFixed(1)}`,
      scatterMultiAxis: `X: ${(normalizedX * 100).toFixed(1)}, Y: ${(normalizedY * 100).toFixed(1)}`,

      // Area Charts
      area: `Area: ${(normalizedY * 100).toFixed(1)}%`,
      lineBoundaries: `Bound: ${(normalizedY * 100).toFixed(1)}%`,
      lineMultipleDatasets: `Dataset: ${(normalizedY * 100).toFixed(1)}%`,
      lineTimeAxis: `Time: ${(normalizedX * 1000).toFixed(0)}ms`,
      stackedLine: `Stack: ${(normalizedY * 100).toFixed(1)}%`,
      stackedRadar: `Radar: ${(normalizedY * 100).toFixed(1)}%`,

      // Scale Charts
      linearScaleMinMax: `Range: ${(normalizedY * 100).toFixed(1)}`,
      linearScaleSuggested: `Suggested: ${(normalizedY * 100).toFixed(1)}`,
      linearScaleStepSize: `Step: ${(normalizedY * 10).toFixed(1)}`,
      logScale: `Log: ${Math.log(normalizedY * 100 + 1).toFixed(2)}`,
      stackedLinearCategory: `Category: ${(normalizedY * 100).toFixed(1)}%`,
      timeScale: `Time: ${(normalizedX * 1000).toFixed(0)}ms`,
      timeScaleMaxSpan: `Span: ${(normalizedX * 500).toFixed(0)}ms`,
      timeScaleCombo: `Combo: ${(normalizedX * 1000).toFixed(0)}ms`,

      // Scriptable Charts
      scriptableBar: `Script: ${(normalizedY * 100).toFixed(1)}%`,
      scriptableBubble: `Bubble: ${(normalizedY * 100).toFixed(1)}px`,
      scriptableLine: `Line: ${(normalizedY * 100).toFixed(1)}%`,
      scriptablePie: `Pie: ${(normalizedY * 100).toFixed(1)}%`,
      scriptablePolar: `Polar: ${(normalizedY * 100).toFixed(1)}%`,
      scriptableRadar: `Radar: ${(normalizedY * 100).toFixed(1)}%`,

      // Animation Charts
      progressiveLine: `Progress: ${(normalizedY * 100).toFixed(1)}%`,
      delayedBar: `Delay: ${(normalizedX * 1000).toFixed(0)}ms`,
      loopAnimation: `Loop: ${(normalizedY * 100).toFixed(1)}%`,
      dropAnimation: `Drop: ${(normalizedY * 100).toFixed(1)}px`,
      tensionAnimation: `Tension: ${normalizedY.toFixed(2)}`,
      easingShowcase: `Easing: ${(normalizedY * 100).toFixed(1)}%`,

      // Interaction Charts
      tooltipCallbacks: `Callback: ${(normalizedY * 100).toFixed(1)}`,
      customTooltip: `Custom: ${(normalizedY * 100).toFixed(1)}%`,
      pointHitDetection: `Hit: ${(normalizedY * 100).toFixed(1)}px`,
      nearestPoint: `Distance: ${(normalizedY * 100).toFixed(1)}px`,
      axisMode: `Axis: ${(normalizedY * 100).toFixed(1)}`,
      datasetMode: `Dataset: ${(normalizedY * 100).toFixed(1)}`,

      // Legend & Title Charts
      legendPosition: `Legend: ${(normalizedY * 100).toFixed(1)}%`,
      legendAlignment: `Align: ${(normalizedY * 100).toFixed(1)}%`,
      legendEvents: `Event: ${(normalizedY * 100).toFixed(1)}`,
      titlePosition: `Title: ${(normalizedY * 100).toFixed(1)}%`,
      titleAlignment: `Align: ${(normalizedY * 100).toFixed(1)}%`,
      subtitle: `Subtitle: ${(normalizedY * 100).toFixed(1)}%`,

      // Grid & Axes Charts
      gridConfiguration: `Grid: ${(normalizedY * 100).toFixed(1)}%`,
      gridStyling: `Style: ${(normalizedY * 100).toFixed(1)}%`,
      axesBorders: `Border: ${(normalizedY * 100).toFixed(1)}px`,
      tickConfiguration: `Tick: ${(normalizedY * 100).toFixed(1)}`,
      axesStyling: `Axes: ${(normalizedY * 100).toFixed(1)}%`,
      multipleYAxes: `Y-Axis: ${(normalizedY * 100).toFixed(1)}`,

      // Special Charts
      mixedChartTypes: `Mixed: ${(normalizedY * 100).toFixed(1)}%`,
      financialChart: `Price: $${(normalizedY * 1000).toFixed(2)}`,
      ganttChart: `Duration: ${(normalizedY * 100).toFixed(1)}h`,
      waterfallChart: `Flow: ${(normalizedY * 100).toFixed(1)}%`,
      funnelChart: `Funnel: ${(normalizedY * 100).toFixed(1)}%`,
    };

    return tooltips[chartId] || `Value: ${(normalizedY * 100).toFixed(1)}%`;
  };

  // Handle mouse move on canvas for tooltip - STRICT point detection
  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>, chartId: string) => {
      const canvas = e.currentTarget;
      const x = e.clientX;
      const y = e.clientY;

      // Get chart type from id
      const chartType = chartId as ChartType;

      // Check if mouse is near a data point (STRICT detection)
      const dataPoint = isNearDataPoint(chartId, chartType, x, y, canvas);

      if (dataPoint) {
        setTooltip({
          visible: true,
          x,
          y,
          label: dataPoint.label,
          value: dataPoint.value,
          color: dataPoint.color,
          chartId,
        });
      } else {
        setTooltip(null);
      }
    },
    []
  );

  const handleCanvasMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // Initialize all charts with progress 1 (completed state)
  useEffect(() => {
    const initialAnimations: { [key: string]: number } = {};
    CHART_CONFIGS.forEach((chart) => {
      initialAnimations[chart.id] = 1;
    });
    setChartAnimations(initialAnimations);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(animationTimers.current).forEach((timer) => {
        clearInterval(timer);
      });
    };
  }, []);

  // Animation loop - REMOVED
  // Draw charts with individual progress
  useEffect(() => {
    const chartDrawers: { [key: string]: (canvas: HTMLCanvasElement, progress: number) => void } = {
      line: drawLineChart,
      bar: drawBarChart,
      pie: drawPieChart,
      doughnut: drawDoughnutChart,
      radar: drawRadarChart,
      polar: drawPolarChart,
      bubble: drawBubbleChart,
      scatter: drawScatterChart,
      area: drawAreaChart,
      combo: drawComboChart,
      stackedBar: drawStackedBarChart,
      stackedLine: drawStackedLineChart,
      horizontalBar: drawHorizontalBarChart,
      barBorderRadius: drawBarBorderRadius,
      floatingBars: drawFloatingBars,
      stackedGroupedBar: drawStackedGroupedBar,
      lineInterpolation: drawLineInterpolation,
      multiAxisLine: drawMultiAxisLine,
      pointStyling: drawPointStyling,
      segmentStyling: drawSegmentStyling,
      steppedLine: drawSteppedLine,
      lineStyling: drawLineStyling,
      comboBarLine: drawComboBarLine,
      multiSeriesPie: drawMultiSeriesPie,
      polarArea: drawPolarArea,
      polarAreaCentered: drawPolarAreaCentered,
      radarSkipPoints: drawRadarSkipPoints,
      scatterMultiAxis: drawScatterMultiAxis,
      stackedBarLine: drawStackedBarLine,
      lineBoundaries: drawLineBoundaries,
      lineMultipleDatasets: drawLineMultipleDatasets,
      lineTimeAxis: drawLineTimeAxis,
      stackedRadar: drawStackedRadar,
      linearScaleMinMax: drawLinearScaleMinMax,
      linearScaleSuggested: drawLinearScaleSuggested,
      linearScaleStepSize: drawLinearScaleStepSize,
      logScale: drawLogScale,
      stackedLinearCategory: drawStackedLinearCategory,
      timeScale: drawTimeScale,
      timeScaleMaxSpan: drawTimeScaleMaxSpan,
      timeScaleCombo: drawTimeScaleCombo,
      scriptableBar: drawScriptableBar,
      scriptableBubble: drawScriptableBubble,
      scriptableLine: drawScriptableLine,
      scriptablePie: drawScriptablePie,
      scriptablePolar: drawScriptablePolar,
      scriptableRadar: drawScriptableRadar,
      progressiveLine: drawProgressiveLine,
      delayedBar: drawDelayedBar,
      loopAnimation: drawLoopAnimation,
      dropAnimation: drawDropAnimation,
      tensionAnimation: drawTensionAnimation,
      easingShowcase: drawEasingShowcase,
      tooltipCallbacks: drawTooltipCallbacks,
      customTooltip: drawCustomTooltip,
      pointHitDetection: drawPointHitDetection,
      nearestPoint: drawNearestPoint,
      axisMode: drawAxisMode,
      datasetMode: drawDatasetMode,
      legendPosition: drawLegendPosition,
      legendAlignment: drawLegendAlignment,
      legendEvents: drawLegendEvents,
      titlePosition: drawTitlePosition,
      titleAlignment: drawTitleAlignment,
      subtitle: drawSubtitle,
      gridConfiguration: drawGridConfiguration,
      gridStyling: drawGridStyling,
      axesBorders: drawAxesBorders,
      tickConfiguration: drawTickConfiguration,
      axesStyling: drawAxesStyling,
      multipleYAxes: drawMultipleYAxes,
      mixedChartTypes: drawMixedChartTypes,
      financialChart: drawFinancialChart,
      ganttChart: drawGanttChart,
      waterfallChart: drawWaterfallChart,
      funnelChart: drawFunnelChart,
    };

    try {
      Object.entries(canvasRefs.current).forEach(([chartId, canvas]) => {
        if (canvas && chartDrawers[chartId]) {
          try {
            const progress = chartAnimations[chartId] ?? 1;
            chartDrawers[chartId](canvas, progress);
          } catch (err) {
            console.error(`Error drawing chart ${chartId}:`, err);
          }
        }
      });
    } catch (err) {
      console.error('Error in chart drawing loop:', err);
    }
  }, [chartAnimations]);

  const filteredCharts = CHART_CONFIGS.filter((chart) => {
    const matchesCategory = selectedCategory === 'all' || chart.category === selectedCategory;
    const matchesSearch =
      chart.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chart.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Charts', count: CHART_CONFIGS.length },
    {
      id: 'basic',
      label: 'Basic',
      count: CHART_CONFIGS.filter((c) => c.category === 'basic').length,
    },
    {
      id: 'advanced',
      label: 'Advanced',
      count: CHART_CONFIGS.filter((c) => c.category === 'advanced').length,
    },
    {
      id: 'specialized',
      label: 'Specialized',
      count: CHART_CONFIGS.filter((c) => c.category === 'specialized').length,
    },
    {
      id: 'scales',
      label: 'Scales',
      count: CHART_CONFIGS.filter((c) => c.category === 'scales').length,
    },
    {
      id: 'scriptable',
      label: 'Scriptable',
      count: CHART_CONFIGS.filter((c) => c.category === 'scriptable').length,
    },
    {
      id: 'animation',
      label: 'Animation',
      count: CHART_CONFIGS.filter((c) => c.category === 'animation').length,
    },
    {
      id: 'interaction',
      label: 'Interaction',
      count: CHART_CONFIGS.filter((c) => c.category === 'interaction').length,
    },
    {
      id: 'legend',
      label: 'Legend',
      count: CHART_CONFIGS.filter((c) => c.category === 'legend').length,
    },
    { id: 'grid', label: 'Grid', count: CHART_CONFIGS.filter((c) => c.category === 'grid').length },
    {
      id: 'special',
      label: 'Special',
      count: CHART_CONFIGS.filter((c) => c.category === 'special').length,
    },
  ];

  return (
    <div className="coldwar-charts-page">
      {/* Header */}
      <div className="charts-header">
        <div className="header-content">
          <div className="header-title-section">
            <div className="status-indicator">
              <div className="led-pulse" />
              <span>SYSTEM ACTIVE</span>
            </div>
            <h1 className="page-title">TACTICAL DATA VISUALIZATION</h1>
            <p className="page-subtitle">
              {CHART_CONFIGS.length} Chart Types • Cold War HUD Style • Real-time Rendering
            </p>
          </div>

          {/* Search */}
          <div className="header-search">
            <input
              type="text"
              placeholder="SEARCH CHARTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`tab-button ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id as any)}
          >
            <span className="tab-label">{cat.label}</span>
            <span className="tab-count">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {filteredCharts && filteredCharts.length > 0 ? (
          filteredCharts.map((chart) => (
            <div key={chart.id} className="chart-card">
              <div className="chart-card-header">
                <h3 className="chart-title">{chart.title}</h3>
                <div className="chart-header-actions">
                  <button
                    className="chart-replay-btn"
                    onClick={() => replayChartAnimation(chart.id)}
                    title="Replay Animation"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C10.3 2 12.3 3.2 13.4 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M13 2V5H10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>REPLAY</span>
                  </button>
                  <span className="chart-tech-code">CH-{chart.id.toUpperCase()}</span>
                </div>
              </div>
              <div className="chart-container">
                <canvas
                  ref={(el) => {
                    if (el) {
                      canvasRefs.current[chart.id] = el;
                    }
                  }}
                  width={400}
                  height={300}
                  className="chart-canvas"
                  onMouseMove={(e) => handleCanvasMouseMove(e, chart.id)}
                  onMouseLeave={handleCanvasMouseLeave}
                  style={{ cursor: 'crosshair' }}
                />
                <p className="chart-description">{chart.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="charts-empty">
            <div className="empty-icon">⚠</div>
            <div className="empty-text">No charts found</div>
            <div className="empty-subtext">Try adjusting your search or category filters</div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="charts-footer">
        <div className="footer-stat">
          <span className="stat-label">Total Charts</span>
          <span className="stat-value">{CHART_CONFIGS.length}</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Displayed</span>
          <span className="stat-value">{filteredCharts.length}</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">Categories</span>
          <span className="stat-value">{categories.length - 1}</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && tooltip.visible && (
        <div
          className="chart-tooltip"
          style={{
            position: 'fixed',
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y - 30}px`,
            pointerEvents: 'none',
            zIndex: 10000,
          }}
        >
          <div className="tooltip-label">{tooltip.label}</div>
          <div className="tooltip-value" style={{ color: tooltip.color }}>
            {tooltip.value}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColdWarChartsPage;
