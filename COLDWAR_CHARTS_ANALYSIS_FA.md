# تحلیل چارت‌های Cold War - مشکل تکراری بودن

## خلاصه مشکل

در صفحه `ColdWarChartsPage.tsx` تعداد 75 چارت تعریف شده است، اما در واقعیت فقط 16 تابع رندر واقعی پیاده‌سازی شده و 59 چارت دیگر به توابع تکراری اشاره می‌کنند.

## چارت‌های واقعی پیاده‌سازی شده (16 عدد)

### Basic Charts (8)

1. ✅ `drawLineChart` - Line Chart
2. ✅ `drawBarChart` - Bar Chart
3. ✅ `drawPieChart` - Pie Chart
4. ✅ `drawDoughnutChart` - Doughnut Chart
5. ✅ `drawRadarChart` - Radar Chart
6. ✅ `drawPolarChart` - Polar Chart
7. ✅ `drawBubbleChart` - Bubble Chart
8. ✅ `drawScatterChart` - Scatter Chart

### Advanced Charts (8)

9. ✅ `drawAreaChart` - Area Chart
10. ✅ `drawComboChart` - Combo Chart
11. ✅ `drawStackedBarChart` - Stacked Bar Chart
12. ✅ `drawStackedLineChart` - Stacked Line Chart
13. ✅ `drawHorizontalBarChart` - Horizontal Bar Chart
14. ✅ `drawBarBorderRadius` - Bar with Border Radius
15. ✅ `drawFloatingBars` - Floating Bars
16. ✅ `drawStackedGroupedBar` - Stacked Grouped Bar

## چارت‌های تکراری (59 عدد)

### Advanced Line Charts (6 - همه تکراری)

- ❌ `lineInterpolation` → استفاده از `drawLineChart`
- ❌ `multiAxisLine` → استفاده از `drawLineChart`
- ❌ `pointStyling` → استفاده از `drawLineChart`
- ❌ `segmentStyling` → استفاده از `drawLineChart`
- ❌ `steppedLine` → استفاده از `drawLineChart`
- ❌ `lineStyling` → استفاده از `drawLineChart`

### Combo Charts (7 - همه تکراری)

- ❌ `comboBarLine` → استفاده از `drawComboChart`
- ❌ `multiSeriesPie` → استفاده از `drawPieChart`
- ❌ `polarArea` → استفاده از `drawPolarChart`
- ❌ `polarAreaCentered` → استفاده از `drawPolarChart`
- ❌ `radarSkipPoints` → استفاده از `drawRadarChart`
- ❌ `scatterMultiAxis` → استفاده از `drawScatterChart`
- ❌ `stackedBarLine` → نیاز به پیاده‌سازی جدید

### Area Charts (5 - همه تکراری)

- ❌ `lineBoundaries` → استفاده از `drawAreaChart`
- ❌ `lineMultipleDatasets` → استفاده از `drawLineChart`
- ❌ `lineTimeAxis` → استفاده از `drawLineChart`
- ❌ `stackedRadar` → استفاده از `drawRadarChart`

### Scale Charts (8 - همه تکراری)

- ❌ `linearScaleMinMax` → استفاده از `drawBarChart`
- ❌ `linearScaleSuggested` → استفاده از `drawBarChart`
- ❌ `linearScaleStepSize` → استفاده از `drawBarChart`
- ❌ `logScale` → استفاده از `drawBarChart`
- ❌ `stackedLinearCategory` → استفاده از `drawStackedBarChart`
- ❌ `timeScale` → استفاده از `drawLineChart`
- ❌ `timeScaleMaxSpan` → استفاده از `drawLineChart`
- ❌ `timeScaleCombo` → استفاده از `drawComboChart`

### Scriptable Charts (6 - همه تکراری)

- ❌ `scriptableBar` → استفاده از `drawBarChart`
- ❌ `scriptableBubble` → استفاده از `drawBubbleChart`
- ❌ `scriptableLine` → استفاده از `drawLineChart`
- ❌ `scriptablePie` → استفاده از `drawPieChart`
- ❌ `scriptablePolar` → استفاده از `drawPolarChart`
- ❌ `scriptableRadar` → استفاده از `drawRadarChart`

### Animation Charts (6 - همه تکراری)

- ❌ `progressiveLine` → استفاده از `drawLineChart`
- ❌ `delayedBar` → استفاده از `drawBarChart`
- ❌ `loopAnimation` → استفاده از `drawLineChart`
- ❌ `dropAnimation` → استفاده از `drawBarChart`
- ❌ `tensionAnimation` → استفاده از `drawLineChart`
- ❌ `easingShowcase` → استفاده از `drawLineChart`

### Interaction Charts (6 - همه تکراری)

- ❌ `tooltipCallbacks` → استفاده از `drawLineChart`
- ❌ `customTooltip` → استفاده از `drawLineChart`
- ❌ `pointHitDetection` → استفاده از `drawScatterChart`
- ❌ `nearestPoint` → استفاده از `drawScatterChart`
- ❌ `axisMode` → استفاده از `drawLineChart`
- ❌ `datasetMode` → استفاده از `drawLineChart`

### Legend & Title Charts (6 - همه تکراری)

- ❌ `legendPosition` → استفاده از `drawBarChart`
- ❌ `legendAlignment` → استفاده از `drawBarChart`
- ❌ `legendEvents` → استفاده از `drawBarChart`
- ❌ `titlePosition` → استفاده از `drawLineChart`
- ❌ `titleAlignment` → استفاده از `drawLineChart`
- ❌ `subtitle` → استفاده از `drawLineChart`

### Grid & Axes Charts (6 - همه تکراری)

- ❌ `gridConfiguration` → استفاده از `drawBarChart`
- ❌ `gridStyling` → استفاده از `drawBarChart`
- ❌ `axesBorders` → استفاده از `drawLineChart`
- ❌ `tickConfiguration` → استفاده از `drawLineChart`
- ❌ `axesStyling` → استفاده از `drawLineChart`
- ❌ `multipleYAxes` → استفاده از `drawLineChart`

### Special Charts (5 - همه تکراری)

- ❌ `mixedChartTypes` → استفاده از `drawComboChart`
- ❌ `financialChart` → استفاده از `drawLineChart`
- ❌ `ganttChart` → استفاده از `drawBarChart`
- ❌ `waterfallChart` → استفاده از `drawBarChart`
- ❌ `funnelChart` → استفاده از `drawPieChart`

## آمار نهایی

- ✅ چارت‌های واقعی: 16 عدد (21%)
- ❌ چارت‌های تکراری: 59 عدد (79%)
- 📊 مجموع: 75 عدد

## راه‌حل پیشنهادی

برای رفع این مشکل، باید 59 تابع جدید با ویژگی‌های منحصر به فرد پیاده‌سازی شوند که هر کدام تفاوت‌های بصری و عملکردی خاص خود را داشته باشند.

آیا می‌خواهید که این 59 چارت را به صورت کامل و یکتا پیاده‌سازی کنم؟
