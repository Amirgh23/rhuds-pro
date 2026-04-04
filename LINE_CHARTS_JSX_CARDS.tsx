// JSX CARDS FOR LINE CHART VARIANTS
// این کدها باید در بخش charts grid اضافه شوند

{
  /* Line Chart Variants Section */
}
<div className="charts-section">
  <h2 className="section-title">Line Chart Variants</h2>
  <div className="charts-grid">
    {/* 1. Line Interpolation */}
    <div className="chart-card">
      <div className="chart-header">
        <h3>Line Interpolation</h3>
        <div className="chart-actions">
          <button
            onClick={() => exportToPNG(lineInterpolationRef, 'line-interpolation')}
            className="action-btn"
            aria-label="Export Line Interpolation chart to PNG"
          >
            📥 PNG
          </button>
          <button
            onClick={() => copyToClipboard(lineInterpolationRef)}
            className="action-btn"
            aria-label="Copy Line Interpolation chart to clipboard"
          >
            📋 Copy
          </button>
        </div>
      </div>
      <canvas
        ref={lineInterpolationRef}
        width={600}
        height={400}
        className="chart-canvas"
        aria-label="Line Interpolation chart showing Linear, Smooth, and Step modes"
      />
      <p className="chart-description">
        Three interpolation modes: Linear, Smooth (Bezier), and Step
      </p>
    </div>

    {/* 2. Multi Axis Line */}
    <div className="chart-card">
      <div className="chart-header">
        <h3>Multi Axis Line Chart</h3>
        <div className="chart-actions">
          <button
            onClick={() => exportToPNG(multiAxisLineRef, 'multi-axis-line')}
            className="action-btn"
            aria-label="Export Multi Axis Line chart to PNG"
          >
            📥 PNG
          </button>
          <button
            onClick={() => copyToClipboard(multiAxisLineRef)}
            className="action-btn"
            aria-label="Copy Multi Axis Line chart to clipboard"
          >
            📋 Copy
          </button>
        </div>
      </div>
      <canvas
        ref={multiAxisLineRef}
        width={600}
        height={400}
        className="chart-canvas"
        aria-label="Multi Axis Line chart with two Y axes"
      />
      <p className="chart-description">
        Two Y axes with different scales (left: 0-100, right: 0-400)
      </p>
    </div>

    {/* 3. Point Styling */}
    <div className="chart-card">
      <div className="chart-header">
        <h3>Point Styling</h3>
        <div className="chart-actions">
          <button
            onClick={() => exportToPNG(pointStylingRef, 'point-styling')}
            className="action-btn"
            aria-label="Export Point Styling chart to PNG"
          >
            📥 PNG
          </button>
          <button
            onClick={() => copyToClipboard(pointStylingRef)}
            className="action-btn"
            aria-label="Copy Point Styling chart to clipboard"
          >
            📋 Copy
          </button>
        </div>
      </div>
      <canvas
        ref={pointStylingRef}
        width={600}
        height={400}
        className="chart-canvas"
        aria-label="Point Styling chart with different point shapes"
      />
      <p className="chart-description">
        Different point shapes: Circle, Square, Triangle, Star, Diamond, Cross, Plus
      </p>
    </div>

    {/* 4. Segment Styling */}
    <div className="chart-card">
      <div className="chart-header">
        <h3>Segment Styling</h3>
        <div className="chart-actions">
          <button
            onClick={() => exportToPNG(segmentStylingRef, 'segment-styling')}
            className="action-btn"
            aria-label="Export Segment Styling chart to PNG"
          >
            📥 PNG
          </button>
          <button
            onClick={() => copyToClipboard(segmentStylingRef)}
            className="action-btn"
            aria-label="Copy Segment Styling chart to clipboard"
          >
            📋 Copy
          </button>
        </div>
      </div>
      <canvas
        ref={segmentStylingRef}
        width={600}
        height={400}
        className="chart-canvas"
        aria-label="Segment Styling chart with different colors per segment"
      />
      <p className="chart-description">Different colors for each line segment</p>
    </div>

    {/* 5. Stepped Line */}
    <div className="chart-card">
      <div className="chart-header">
        <h3>Stepped Line Chart</h3>
        <div className="chart-actions">
          <button
            onClick={() => exportToPNG(steppedLineRef, 'stepped-line')}
            className="action-btn"
            aria-label="Export Stepped Line chart to PNG"
          >
            📥 PNG
          </button>
          <button
            onClick={() => copyToClipboard(steppedLineRef)}
            className="action-btn"
            aria-label="Copy Stepped Line chart to clipboard"
          >
            📋 Copy
          </button>
        </div>
      </div>
      <canvas
        ref={steppedLineRef}
        width={600}
        height={400}
        className="chart-canvas"
        aria-label="Stepped Line chart showing Step-before, Step-after, and Step-middle modes"
      />
      <p className="chart-description">Three step modes: Step-before, Step-after, Step-middle</p>
    </div>

    {/* 6. Line Styling */}
    <div className="chart-card">
      <div className="chart-header">
        <h3>Line Styling</h3>
        <div className="chart-actions">
          <button
            onClick={() => exportToPNG(lineStylingRef, 'line-styling')}
            className="action-btn"
            aria-label="Export Line Styling chart to PNG"
          >
            📥 PNG
          </button>
          <button
            onClick={() => copyToClipboard(lineStylingRef)}
            className="action-btn"
            aria-label="Copy Line Styling chart to clipboard"
          >
            📋 Copy
          </button>
        </div>
      </div>
      <canvas
        ref={lineStylingRef}
        width={600}
        height={400}
        className="chart-canvas"
        aria-label="Line Styling chart with Solid, Dashed, and Dotted lines"
      />
      <p className="chart-description">Three line patterns: Solid, Dashed, Dotted</p>
    </div>
  </div>
</div>;
