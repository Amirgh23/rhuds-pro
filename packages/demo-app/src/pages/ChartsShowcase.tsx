/**
 * Charts Showcase Page
 * Demonstrates all chart types with RHUDS and ColdWar themes
 * Full Chart.js equivalent implementation
 */

import React, { useState, useRef, useEffect } from 'react';
import { Chart } from '@rhuds/charts';
import type { ChartConfiguration } from '@rhuds/charts';
import './ChartsShowcase.css';

type ChartVariant = 'r-huds' | 'coldwar';

const ChartsShowcase: React.FC = () => {
  const [variant, setVariant] = useState<ChartVariant>('r-huds');

  // Chart refs
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const doughnutChartRef = useRef<HTMLCanvasElement>(null);
  const radarChartRef = useRef<HTMLCanvasElement>(null);
  const polarChartRef = useRef<HTMLCanvasElement>(null);
  const bubbleChartRef = useRef<HTMLCanvasElement>(null);
  const scatterChartRef = useRef<HTMLCanvasElement>(null);

  // Chart instances
  const chartInstances = useRef<Chart[]>([]);

  // Theme colors
  const colors =
    variant === 'r-huds'
      ? {
          primary: '#29F2DF',
          secondary: '#FF006E',
          tertiary: '#8338EC',
          quaternary: '#FFBE0B',
          quinary: '#FB5607',
        }
      : {
          primary: '#00FF00',
          secondary: '#FFFF00',
          tertiary: '#FF0000',
          quaternary: '#00FFFF',
          quinary: '#FF00FF',
        };

  useEffect(() => {
    // Destroy existing charts
    chartInstances.current.forEach((chart) => chart.destroy());
    chartInstances.current = [];

    // Line Chart
    if (lineChartRef.current) {
      const lineChart = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Revenue',
              data: [65, 59, 80, 81, 56, 55],
              borderColor: colors.primary,
              backgroundColor: `${colors.primary}33`,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
      chartInstances.current.push(lineChart);
    }

    // Bar Chart
    if (barChartRef.current) {
      const barChart = new Chart(barChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [
            {
              label: 'Sales',
              data: [12, 19, 3, 5],
              backgroundColor: [
                colors.primary,
                colors.secondary,
                colors.tertiary,
                colors.quaternary,
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
      chartInstances.current.push(barChart);
    }

    // Pie Chart
    if (pieChartRef.current) {
      const pieChart = new Chart(pieChartRef.current, {
        type: 'pie',
        data: {
          labels: ['Red', 'Blue', 'Yellow'],
          datasets: [
            {
              data: [300, 50, 100],
              backgroundColor: [colors.primary, colors.secondary, colors.tertiary],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
      chartInstances.current.push(pieChart);
    }

    // Doughnut Chart
    if (doughnutChartRef.current) {
      const doughnutChart = new Chart(doughnutChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Desktop', 'Mobile', 'Tablet'],
          datasets: [
            {
              data: [55, 30, 15],
              backgroundColor: [colors.primary, colors.secondary, colors.tertiary],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
      chartInstances.current.push(doughnutChart);
    }

    // Radar Chart
    if (radarChartRef.current) {
      const radarChart = new Chart(radarChartRef.current, {
        type: 'radar',
        data: {
          labels: ['Speed', 'Power', 'Defense', 'Agility', 'Intelligence'],
          datasets: [
            {
              label: 'Player Stats',
              data: [80, 90, 70, 85, 75],
              borderColor: colors.primary,
              backgroundColor: `${colors.primary}33`,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
      chartInstances.current.push(radarChart);
    }

    // Polar Area Chart
    if (polarChartRef.current) {
      const polarChart = new Chart(polarChartRef.current, {
        type: 'polarArea',
        data: {
          labels: ['A', 'B', 'C', 'D', 'E'],
          datasets: [
            {
              data: [11, 16, 7, 3, 14],
              backgroundColor: [
                colors.primary,
                colors.secondary,
                colors.tertiary,
                colors.quaternary,
                colors.quinary,
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
      chartInstances.current.push(polarChart);
    }

    // Bubble Chart
    if (bubbleChartRef.current) {
      const bubbleChart = new Chart(bubbleChartRef.current, {
        type: 'bubble',
        data: {
          datasets: [
            {
              label: 'Dataset 1',
              data: [
                { x: 20, y: 30, r: 15 },
                { x: 40, y: 10, r: 10 },
                { x: 30, y: 20, r: 20 },
              ],
              backgroundColor: colors.primary,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
      chartInstances.current.push(bubbleChart);
    }

    // Scatter Chart
    if (scatterChartRef.current) {
      const scatterChart = new Chart(scatterChartRef.current, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Scatter Dataset',
              data: [
                { x: -10, y: 0 },
                { x: 0, y: 10 },
                { x: 10, y: 5 },
                { x: 0.5, y: 5.5 },
              ],
              backgroundColor: colors.primary,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
      chartInstances.current.push(scatterChart);
    }

    return () => {
      chartInstances.current.forEach((chart) => chart.destroy());
    };
  }, [variant]);

  return (
    <div className={`charts-showcase ${variant}`}>
      <div className="showcase-header">
        <h1>Charts Showcase</h1>
        <p>Complete Chart.js equivalent implementation with RHUDS & ColdWar themes</p>

        <div className="theme-switcher">
          <button
            className={variant === 'r-huds' ? 'active' : ''}
            onClick={() => setVariant('r-huds')}
          >
            RHUDS Theme
          </button>
          <button
            className={variant === 'coldwar' ? 'active' : ''}
            onClick={() => setVariant('coldwar')}
          >
            ColdWar Theme
          </button>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Line Chart</h3>
          <div className="chart-container">
            <canvas ref={lineChartRef}></canvas>
          </div>
          <p>Perfect for showing trends over time</p>
        </div>

        <div className="chart-card">
          <h3>Bar Chart</h3>
          <div className="chart-container">
            <canvas ref={barChartRef}></canvas>
          </div>
          <p>Compare values across categories</p>
        </div>

        <div className="chart-card">
          <h3>Pie Chart</h3>
          <div className="chart-container">
            <canvas ref={pieChartRef}></canvas>
          </div>
          <p>Show proportions of a whole</p>
        </div>

        <div className="chart-card">
          <h3>Doughnut Chart</h3>
          <div className="chart-container">
            <canvas ref={doughnutChartRef}></canvas>
          </div>
          <p>Like pie chart with center cutout</p>
        </div>

        <div className="chart-card">
          <h3>Radar Chart</h3>
          <div className="chart-container">
            <canvas ref={radarChartRef}></canvas>
          </div>
          <p>Compare multiple variables</p>
        </div>

        <div className="chart-card">
          <h3>Polar Area Chart</h3>
          <div className="chart-container">
            <canvas ref={polarChartRef}></canvas>
          </div>
          <p>Similar to pie but with variable radius</p>
        </div>

        <div className="chart-card">
          <h3>Bubble Chart</h3>
          <div className="chart-container">
            <canvas ref={bubbleChartRef}></canvas>
          </div>
          <p>Three-dimensional data visualization</p>
        </div>

        <div className="chart-card">
          <h3>Scatter Chart</h3>
          <div className="chart-container">
            <canvas ref={scatterChartRef}></canvas>
          </div>
          <p>Show correlation between variables</p>
        </div>
      </div>

      <div className="features-section">
        <h2>Chart.js Equivalent Features</h2>
        <div className="features-grid">
          <div className="feature">
            <h4>✓ All Chart Types</h4>
            <p>Line, Bar, Pie, Doughnut, Radar, Polar Area, Bubble, Scatter</p>
          </div>
          <div className="feature">
            <h4>✓ Responsive Design</h4>
            <p>Charts automatically resize with container</p>
          </div>
          <div className="feature">
            <h4>✓ Theme Support</h4>
            <p>RHUDS neon theme & ColdWar tactical theme</p>
          </div>
          <div className="feature">
            <h4>✓ Animations</h4>
            <p>Smooth transitions and updates</p>
          </div>
          <div className="feature">
            <h4>✓ Tooltips</h4>
            <p>Interactive hover information</p>
          </div>
          <div className="feature">
            <h4>✓ Legends</h4>
            <p>Automatic legend generation</p>
          </div>
          <div className="feature">
            <h4>✓ Scales</h4>
            <p>Linear, Category, Time, Logarithmic</p>
          </div>
          <div className="feature">
            <h4>✓ Plugins</h4>
            <p>Extensible plugin system</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsShowcase;
