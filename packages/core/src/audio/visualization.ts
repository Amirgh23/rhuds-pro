/**
 * Audio Visualization System
 * Frequency analysis, waveform, and beat detection
 */

import {
  AudioVisualizationData,
  AudioAnalyzerConfig,
  BeatDetectionConfig,
} from './types';

/**
 * Audio analyzer for visualization
 */
export class AudioAnalyzer {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private frequencyData: Uint8Array;
  private timeDomainData: Uint8Array;
  private beatDetector: BeatDetector | null = null;

  constructor(audioContext: AudioContext, config?: AudioAnalyzerConfig) {
    this.audioContext = audioContext;
    this.analyser = audioContext.createAnalyser();

    // Configure analyser
    this.analyser.fftSize = config?.fftSize ?? 2048;
    this.analyser.smoothingTimeConstant = config?.smoothingTimeConstant ?? 0.8;
    this.analyser.minDecibels = config?.minDecibels ?? -90;
    this.analyser.maxDecibels = config?.maxDecibels ?? -10;

    // Create data arrays
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.timeDomainData = new Uint8Array(this.analyser.fftSize);
  }

  /**
   * Get analyser node for connecting audio source
   */
  getAnalyserNode(): AnalyserNode {
    return this.analyser;
  }

  /**
   * Get current visualization data
   */
  getVisualizationData(): AudioVisualizationData {
    // Update data arrays
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.timeDomainData);

    // Calculate volume (RMS)
    let sum = 0;
    for (let i = 0; i < this.timeDomainData.length; i++) {
      const normalized = (this.timeDomainData[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const volume = Math.sqrt(sum / this.timeDomainData.length);

    // Calculate frequency bands
    const bass = this.getFrequencyBandAverage(0, 100);
    const mid = this.getFrequencyBandAverage(100, 1000);
    const treble = this.getFrequencyBandAverage(1000, 20000);

    return {
      frequencyData: this.frequencyData,
      timeDomainData: this.timeDomainData,
      volume,
      bass,
      mid,
      treble,
    };
  }

  /**
   * Get average value for a frequency band
   */
  private getFrequencyBandAverage(minFreq: number, maxFreq: number): number {
    const nyquist = this.audioContext.sampleRate / 2;
    const minIndex = Math.floor((minFreq / nyquist) * this.frequencyData.length);
    const maxIndex = Math.ceil((maxFreq / nyquist) * this.frequencyData.length);

    let sum = 0;
    let count = 0;

    for (let i = minIndex; i < maxIndex && i < this.frequencyData.length; i++) {
      sum += this.frequencyData[i];
      count++;
    }

    return count > 0 ? sum / count / 255 : 0;
  }

  /**
   * Get frequency at a specific index
   */
  getFrequency(index: number): number {
    const nyquist = this.audioContext.sampleRate / 2;
    return (index / this.frequencyData.length) * nyquist;
  }

  /**
   * Enable beat detection
   */
  enableBeatDetection(config?: BeatDetectionConfig): void {
    this.beatDetector = new BeatDetector(this, config);
  }

  /**
   * Disable beat detection
   */
  disableBeatDetection(): void {
    this.beatDetector?.stop();
    this.beatDetector = null;
  }

  /**
   * Update beat detection (call in animation loop)
   */
  updateBeatDetection(): void {
    this.beatDetector?.update();
  }
}

/**
 * Beat detector
 */
class BeatDetector {
  private analyzer: AudioAnalyzer;
  private config: Required<BeatDetectionConfig>;
  private lastBeatTime: number = 0;
  private energyHistory: number[] = [];
  private historySize: number = 43; // ~1 second at 60fps

  constructor(analyzer: AudioAnalyzer, config?: BeatDetectionConfig) {
    this.analyzer = analyzer;
    this.config = {
      threshold: config?.threshold ?? 1.3,
      minInterval: config?.minInterval ?? 200,
      onBeat: config?.onBeat ?? (() => {}),
    };
  }

  /**
   * Update beat detection
   */
  update(): void {
    const data = this.analyzer.getVisualizationData();
    const energy = data.bass; // Use bass frequency for beat detection

    // Add to history
    this.energyHistory.push(energy);
    if (this.energyHistory.length > this.historySize) {
      this.energyHistory.shift();
    }

    // Calculate average energy
    const avgEnergy =
      this.energyHistory.reduce((sum, e) => sum + e, 0) / this.energyHistory.length;

    // Detect beat
    const now = Date.now();
    const timeSinceLastBeat = now - this.lastBeatTime;

    if (
      energy > avgEnergy * this.config.threshold &&
      timeSinceLastBeat > this.config.minInterval
    ) {
      this.lastBeatTime = now;
      this.config.onBeat();
    }
  }

  /**
   * Stop beat detection
   */
  stop(): void {
    this.energyHistory = [];
  }
}

/**
 * Create audio analyzer
 */
export function createAudioAnalyzer(
  audioContext: AudioContext,
  config?: AudioAnalyzerConfig
): AudioAnalyzer {
  return new AudioAnalyzer(audioContext, config);
}

/**
 * Audio visualizer helper for canvas rendering
 */
export class AudioVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private analyzer: AudioAnalyzer;
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement, analyzer: AudioAnalyzer) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    this.ctx = ctx;
    this.analyzer = analyzer;
  }

  /**
   * Start visualization
   */
  start(): void {
    if (this.animationId !== null) return;

    const render = () => {
      this.render();
      this.animationId = requestAnimationFrame(render);
    };

    render();
  }

  /**
   * Stop visualization
   */
  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Render visualization
   */
  private render(): void {
    const data = this.analyzer.getVisualizationData();
    const { width, height } = this.canvas;

    // Clear canvas
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, width, height);

    // Draw frequency bars
    const barWidth = width / data.frequencyData.length;
    const barGap = 1;

    for (let i = 0; i < data.frequencyData.length; i++) {
      const barHeight = (data.frequencyData[i] / 255) * height;
      const x = i * barWidth;
      const y = height - barHeight;

      // Color based on frequency
      const hue = (i / data.frequencyData.length) * 360;
      this.ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      this.ctx.fillRect(x, y, barWidth - barGap, barHeight);
    }
  }

  /**
   * Render waveform
   */
  renderWaveform(): void {
    const data = this.analyzer.getVisualizationData();
    const { width, height } = this.canvas;

    // Clear canvas
    this.ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.fillRect(0, 0, width, height);

    // Draw waveform
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'rgb(0, 255, 255)';
    this.ctx.beginPath();

    const sliceWidth = width / data.timeDomainData.length;
    let x = 0;

    for (let i = 0; i < data.timeDomainData.length; i++) {
      const v = data.timeDomainData[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.ctx.lineTo(width, height / 2);
    this.ctx.stroke();
  }
}
