/**
 * Audio Effects System
 * Implements reverb, delay, distortion, filter, compressor, and EQ effects
 */

export interface EffectConfig {
  enabled?: boolean;
  params?: Record<string, number>;
}

export interface ReverbConfig extends EffectConfig {
  decay?: number;
  preDelay?: number;
}

export interface DelayConfig extends EffectConfig {
  time?: number;
  feedback?: number;
  mix?: number;
}

export interface DistortionConfig extends EffectConfig {
  amount?: number;
  tone?: number;
}

export interface FilterConfig extends EffectConfig {
  type?: 'lowpass' | 'highpass' | 'bandpass' | 'notch';
  frequency?: number;
  q?: number;
}

export interface CompressorConfig extends EffectConfig {
  threshold?: number;
  ratio?: number;
  attack?: number;
  release?: number;
}

export interface EQConfig extends EffectConfig {
  bass?: number;
  mid?: number;
  treble?: number;
}

/**
 * Reverb Effect
 */
export class ReverbEffect {
  private enabled: boolean = true;
  private decay: number;
  private preDelay: number;

  constructor(config: ReverbConfig = {}) {
    this.enabled = config.enabled ?? true;
    this.decay = config.params?.decay ?? config.decay ?? 2;
    this.preDelay = config.params?.preDelay ?? config.preDelay ?? 0.03;
  }

  process(input: Float32Array): Float32Array {
    if (!this.enabled) return input;

    const output = new Float32Array(input.length);
    const delayTime = Math.floor(this.preDelay * 44100);

    for (let i = 0; i < input.length; i++) {
      let sample = input[i];

      if (i >= delayTime) {
        const delayedSample = input[i - delayTime];
        sample += delayedSample * (1 - this.decay);
      }

      output[i] = Math.max(-1, Math.min(1, sample));
    }

    return output;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setDecay(decay: number): void {
    this.decay = Math.max(0, Math.min(1, decay));
  }
}

/**
 * Delay Effect
 */
export class DelayEffect {
  private enabled: boolean = true;
  private time: number;
  private feedback: number;
  private mix: number;
  private buffer: Float32Array;
  private writeIndex: number = 0;

  constructor(config: DelayConfig = {}) {
    this.enabled = config.enabled ?? true;
    this.time = config.params?.time ?? config.time ?? 0.5;
    this.feedback = config.params?.feedback ?? config.feedback ?? 0.5;
    this.mix = config.params?.mix ?? config.mix ?? 0.5;

    const bufferSize = Math.floor(this.time * 44100);
    this.buffer = new Float32Array(bufferSize);
  }

  process(input: Float32Array): Float32Array {
    if (!this.enabled) return input;

    const output = new Float32Array(input.length);

    for (let i = 0; i < input.length; i++) {
      const delayedSample = this.buffer[this.writeIndex];
      const wet = delayedSample * this.mix;
      const dry = input[i] * (1 - this.mix);

      output[i] = Math.max(-1, Math.min(1, dry + wet));

      this.buffer[this.writeIndex] = input[i] + delayedSample * this.feedback;
      this.writeIndex = (this.writeIndex + 1) % this.buffer.length;
    }

    return output;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setTime(time: number): void {
    this.time = Math.max(0, Math.min(2, time));
  }

  setFeedback(feedback: number): void {
    this.feedback = Math.max(0, Math.min(0.9, feedback));
  }

  setMix(mix: number): void {
    this.mix = Math.max(0, Math.min(1, mix));
  }
}

/**
 * Distortion Effect
 */
export class DistortionEffect {
  private enabled: boolean = true;
  private amount: number;
  private tone: number;

  constructor(config: DistortionConfig = {}) {
    this.enabled = config.enabled ?? true;
    this.amount = config.params?.amount ?? config.amount ?? 0.5;
    this.tone = config.params?.tone ?? config.tone ?? 0.5;
  }

  process(input: Float32Array): Float32Array {
    if (!this.enabled) return input;

    const output = new Float32Array(input.length);
    const drive = this.amount * 100;

    for (let i = 0; i < input.length; i++) {
      let sample = input[i] * drive;

      // Soft clipping
      if (sample > 1) {
        sample = (2 / Math.PI) * Math.atan(sample);
      } else if (sample < -1) {
        sample = (2 / Math.PI) * Math.atan(sample);
      }

      output[i] = sample;
    }

    return output;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setAmount(amount: number): void {
    this.amount = Math.max(0, Math.min(1, amount));
  }

  setTone(tone: number): void {
    this.tone = Math.max(0, Math.min(1, tone));
  }
}

/**
 * Filter Effect
 */
export class FilterEffect {
  private enabled: boolean = true;
  private type: 'lowpass' | 'highpass' | 'bandpass' | 'notch';
  private frequency: number;
  private q: number;

  constructor(config: FilterConfig = {}) {
    this.enabled = config.enabled ?? true;
    this.type = config.type ?? 'lowpass';
    this.frequency = config.params?.frequency ?? config.frequency ?? 1000;
    this.q = config.params?.q ?? config.q ?? 1;
  }

  process(input: Float32Array): Float32Array {
    if (!this.enabled) return input;

    // Simplified filter implementation
    const output = new Float32Array(input.length);
    let lastSample = 0;

    for (let i = 0; i < input.length; i++) {
      const alpha = 0.1; // Simple smoothing factor

      switch (this.type) {
        case 'lowpass':
          output[i] = lastSample + alpha * (input[i] - lastSample);
          break;
        case 'highpass':
          output[i] = alpha * (lastSample + input[i] - input[Math.max(0, i - 1)]);
          break;
        default:
          output[i] = input[i];
      }

      lastSample = output[i];
    }

    return output;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setFrequency(frequency: number): void {
    this.frequency = Math.max(20, Math.min(20000, frequency));
  }

  setQ(q: number): void {
    this.q = Math.max(0.1, Math.min(10, q));
  }
}

/**
 * Compressor Effect
 */
export class CompressorEffect {
  private enabled: boolean = true;
  private threshold: number;
  private ratio: number;
  private attack: number;
  private release: number;

  constructor(config: CompressorConfig = {}) {
    this.enabled = config.enabled ?? true;
    this.threshold = config.params?.threshold ?? config.threshold ?? -24;
    this.ratio = config.params?.ratio ?? config.ratio ?? 4;
    this.attack = config.params?.attack ?? config.attack ?? 0.003;
    this.release = config.params?.release ?? config.release ?? 0.25;
  }

  process(input: Float32Array): Float32Array {
    if (!this.enabled) return input;

    const output = new Float32Array(input.length);
    let gain = 1;

    for (let i = 0; i < input.length; i++) {
      const level = Math.abs(input[i]);
      const levelDb = 20 * Math.log10(Math.max(0.00001, level));

      if (levelDb > this.threshold) {
        const gainReduction = (levelDb - this.threshold) * (1 - 1 / this.ratio);
        const targetGain = Math.pow(10, -gainReduction / 20);

        const envelope = levelDb > this.threshold ? this.attack : this.release;
        gain += (targetGain - gain) * envelope;
      } else {
        gain += (1 - gain) * this.release;
      }

      output[i] = input[i] * gain;
    }

    return output;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setThreshold(threshold: number): void {
    this.threshold = Math.max(-100, Math.min(0, threshold));
  }

  setRatio(ratio: number): void {
    this.ratio = Math.max(1, Math.min(20, ratio));
  }
}

/**
 * EQ Effect
 */
export class EQEffect {
  private enabled: boolean = true;
  private bass: number;
  private mid: number;
  private treble: number;

  constructor(config: EQConfig = {}) {
    this.enabled = config.enabled ?? true;
    this.bass = config.params?.bass ?? config.bass ?? 0;
    this.mid = config.params?.mid ?? config.mid ?? 0;
    this.treble = config.params?.treble ?? config.treble ?? 0;
  }

  process(input: Float32Array): Float32Array {
    if (!this.enabled) return input;

    const output = new Float32Array(input.length);
    const bassGain = Math.pow(10, this.bass / 20);
    const midGain = Math.pow(10, this.mid / 20);
    const trebleGain = Math.pow(10, this.treble / 20);

    for (let i = 0; i < input.length; i++) {
      let sample = input[i];

      // Apply gains
      sample *= (bassGain + midGain + trebleGain) / 3;

      output[i] = Math.max(-1, Math.min(1, sample));
    }

    return output;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setBass(bass: number): void {
    this.bass = Math.max(-12, Math.min(12, bass));
  }

  setMid(mid: number): void {
    this.mid = Math.max(-12, Math.min(12, mid));
  }

  setTreble(treble: number): void {
    this.treble = Math.max(-12, Math.min(12, treble));
  }
}

export default {
  ReverbEffect,
  DelayEffect,
  DistortionEffect,
  FilterEffect,
  CompressorEffect,
  EQEffect,
};
