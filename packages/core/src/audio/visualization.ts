/**
 * Audio Visualization System
 * Provides frequency analysis, waveform analysis, and beat detection
 */

export interface AudioFeatures {
  volume: number;
  bass: number;
  mid: number;
  treble: number;
  peak: number;
  rms: number;
}

/**
 * Frequency Analyzer
 */
export class FrequencyAnalyzer {
  private analyser: AnalyserNode;
  private frequencies: Uint8Array;
  private waveform: Uint8Array;

  constructor(analyser: AnalyserNode) {
    this.analyser = analyser;
    this.analyser.fftSize = 2048;
    this.frequencies = new Uint8Array(this.analyser.frequencyBinCount);
    this.waveform = new Uint8Array(this.analyser.frequencyBinCount);
  }

  /**
   * Get frequency data
   */
  getFrequencies(): Uint8Array {
    this.analyser.getByteFrequencyData(this.frequencies);
    return this.frequencies;
  }

  /**
   * Get waveform data
   */
  getWaveform(): Uint8Array {
    this.analyser.getByteTimeDomainData(this.waveform);
    return this.waveform;
  }

  /**
   * Extract audio features
   */
  extractFeatures(): AudioFeatures {
    const frequencies = this.getFrequencies();
    const waveform = this.getWaveform();

    // Calculate volume (RMS of waveform)
    let sum = 0;
    for (let i = 0; i < waveform.length; i++) {
      const normalized = (waveform[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / waveform.length);
    const volume = Math.min(1, rms);

    // Calculate frequency bands
    const bandSize = Math.floor(frequencies.length / 3);
    let bass = 0,
      mid = 0,
      treble = 0;

    for (let i = 0; i < bandSize; i++) {
      bass += frequencies[i];
    }
    for (let i = bandSize; i < bandSize * 2; i++) {
      mid += frequencies[i];
    }
    for (let i = bandSize * 2; i < frequencies.length; i++) {
      treble += frequencies[i];
    }

    bass /= bandSize * 255;
    mid /= bandSize * 255;
    treble /= (frequencies.length - bandSize * 2) * 255;

    // Find peak frequency
    let peak = 0;
    let maxValue = 0;
    for (let i = 0; i < frequencies.length; i++) {
      if (frequencies[i] > maxValue) {
        maxValue = frequencies[i];
        peak = i / frequencies.length;
      }
    }

    return {
      volume,
      bass,
      mid,
      treble,
      peak,
      rms,
    };
  }
}

/**
 * Beat Detector
 */
export class BeatDetector {
  private history: number[] = [];
  private threshold: number = 0.3;
  private maxHistory: number = 43;

  /**
   * Detect beat
   */
  detectBeat(frequencies: Uint8Array): boolean {
    // Calculate energy in bass frequencies
    const bassEnergy = this.calculateBassEnergy(frequencies);

    // Add to history
    this.history.push(bassEnergy);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    // Calculate average
    const average = this.history.reduce((a, b) => a + b, 0) / this.history.length;

    // Detect beat if current energy is significantly higher than average
    return bassEnergy > average * (1 + this.threshold);
  }

  /**
   * Calculate bass energy
   */
  private calculateBassEnergy(frequencies: Uint8Array): number {
    const bassRange = Math.floor(frequencies.length * 0.1); // First 10% of spectrum
    let energy = 0;

    for (let i = 0; i < bassRange; i++) {
      energy += frequencies[i];
    }

    return energy / (bassRange * 255);
  }

  /**
   * Set detection threshold
   */
  setThreshold(threshold: number): void {
    this.threshold = Math.max(0, Math.min(1, threshold));
  }

  /**
   * Reset history
   */
  reset(): void {
    this.history = [];
  }
}

/**
 * Spectrum Analyzer
 */
export class SpectrumAnalyzer {
  private analyser: AnalyserNode;
  private frequencies: Uint8Array;
  private smoothing: number = 0.8;

  constructor(analyser: AnalyserNode) {
    this.analyser = analyser;
    this.analyser.fftSize = 256;
    this.frequencies = new Uint8Array(this.analyser.frequencyBinCount);
  }

  /**
   * Get smoothed spectrum
   */
  getSpectrum(): Uint8Array {
    const current = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(current);

    // Apply smoothing
    for (let i = 0; i < current.length; i++) {
      this.frequencies[i] =
        this.frequencies[i] * this.smoothing + current[i] * (1 - this.smoothing);
    }

    return this.frequencies;
  }

  /**
   * Get normalized spectrum (0-1)
   */
  getNormalizedSpectrum(): number[] {
    const spectrum = this.getSpectrum();
    const normalized: number[] = [];

    for (let i = 0; i < spectrum.length; i++) {
      normalized.push(spectrum[i] / 255);
    }

    return normalized;
  }

  /**
   * Set smoothing factor
   */
  setSmoothing(smoothing: number): void {
    this.smoothing = Math.max(0, Math.min(1, smoothing));
  }
}

/**
 * Waveform Analyzer
 */
export class WaveformAnalyzer {
  private analyser: AnalyserNode;
  private waveform: Uint8Array;

  constructor(analyser: AnalyserNode) {
    this.analyser = analyser;
    this.analyser.fftSize = 2048;
    this.waveform = new Uint8Array(this.analyser.frequencyBinCount);
  }

  /**
   * Get waveform data
   */
  getWaveform(): Uint8Array {
    this.analyser.getByteTimeDomainData(this.waveform);
    return this.waveform;
  }

  /**
   * Get normalized waveform (-1 to 1)
   */
  getNormalizedWaveform(): number[] {
    const waveform = this.getWaveform();
    const normalized: number[] = [];

    for (let i = 0; i < waveform.length; i++) {
      normalized.push((waveform[i] - 128) / 128);
    }

    return normalized;
  }

  /**
   * Calculate peak amplitude
   */
  getPeakAmplitude(): number {
    const waveform = this.getWaveform();
    let peak = 0;

    for (let i = 0; i < waveform.length; i++) {
      const amplitude = Math.abs((waveform[i] - 128) / 128);
      if (amplitude > peak) {
        peak = amplitude;
      }
    }

    return peak;
  }

  /**
   * Calculate RMS (Root Mean Square)
   */
  getRMS(): number {
    const waveform = this.getWaveform();
    let sum = 0;

    for (let i = 0; i < waveform.length; i++) {
      const normalized = (waveform[i] - 128) / 128;
      sum += normalized * normalized;
    }

    return Math.sqrt(sum / waveform.length);
  }
}

export default {
  FrequencyAnalyzer,
  BeatDetector,
  SpectrumAnalyzer,
  WaveformAnalyzer,
};
