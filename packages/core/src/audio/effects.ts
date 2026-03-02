/**
 * Audio Effects Pipeline
 * Reverb, delay, distortion, filter, compressor, and EQ effects
 */

import { AudioEffect, ReverbEffect, DelayEffect, FilterEffect, FilterType } from './types';

/**
 * Audio effects processor
 */
export class AudioEffectsProcessor {
  private audioContext: AudioContext;
  private inputNode: GainNode;
  private outputNode: GainNode;
  private effectNodes: Map<string, AudioNode> = new Map();

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.inputNode = audioContext.createGain();
    this.outputNode = audioContext.createGain();
    
    // Initially connect input directly to output
    this.inputNode.connect(this.outputNode);
  }

  /**
   * Get input node for connecting audio source
   */
  getInputNode(): GainNode {
    return this.inputNode;
  }

  /**
   * Get output node for connecting to destination
   */
  getOutputNode(): GainNode {
    return this.outputNode;
  }

  /**
   * Add reverb effect
   */
  addReverb(config: ReverbEffect): void {
    const convolver = this.audioContext.createConvolver();
    const decay = config.params.decay ?? 2;
    const preDelay = config.params.preDelay ?? 0;
    const wetDryMix = config.params.wetDryMix ?? 0.5;

    // Create impulse response
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * decay;
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }

    convolver.buffer = impulse;

    // Create wet/dry mix
    const dryGain = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();
    dryGain.gain.value = 1 - wetDryMix;
    wetGain.gain.value = wetDryMix;

    this.inputNode.connect(dryGain);
    this.inputNode.connect(convolver);
    convolver.connect(wetGain);
    dryGain.connect(this.outputNode);
    wetGain.connect(this.outputNode);

    this.effectNodes.set('reverb', convolver);
  }

  /**
   * Add delay effect
   */
  addDelay(config: DelayEffect): void {
    const delay = this.audioContext.createDelay(5);
    const feedback = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();
    const dryGain = this.audioContext.createGain();

    delay.delayTime.value = config.params.delayTime ?? 0.5;
    feedback.gain.value = config.params.feedback ?? 0.3;
    const wetDryMix = config.params.wetDryMix ?? 0.5;
    wetGain.gain.value = wetDryMix;
    dryGain.gain.value = 1 - wetDryMix;

    // Create feedback loop
    this.inputNode.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wetGain);
    this.inputNode.connect(dryGain);
    wetGain.connect(this.outputNode);
    dryGain.connect(this.outputNode);

    this.effectNodes.set('delay', delay);
  }

  /**
   * Add distortion effect
   */
  addDistortion(amount: number = 50): void {
    const distortion = this.audioContext.createWaveShaper();
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }

    distortion.curve = curve;
    distortion.oversample = '4x';

    this.inputNode.connect(distortion);
    distortion.connect(this.outputNode);

    this.effectNodes.set('distortion', distortion);
  }

  /**
   * Add filter effect
   */
  addFilter(config: FilterEffect): void {
    const filter = this.audioContext.createBiquadFilter();
    
    filter.type = config.params.filterType ?? 'lowpass';
    filter.frequency.value = config.params.frequency ?? 1000;
    filter.Q.value = config.params.Q ?? 1;
    
    if (config.params.gain !== undefined) {
      filter.gain.value = config.params.gain;
    }

    this.inputNode.connect(filter);
    filter.connect(this.outputNode);

    this.effectNodes.set('filter', filter);
  }

  /**
   * Add compressor effect
   */
  addCompressor(
    threshold: number = -24,
    knee: number = 30,
    ratio: number = 12,
    attack: number = 0.003,
    release: number = 0.25
  ): void {
    const compressor = this.audioContext.createDynamicsCompressor();
    
    compressor.threshold.value = threshold;
    compressor.knee.value = knee;
    compressor.ratio.value = ratio;
    compressor.attack.value = attack;
    compressor.release.value = release;

    this.inputNode.connect(compressor);
    compressor.connect(this.outputNode);

    this.effectNodes.set('compressor', compressor);
  }

  /**
   * Add EQ effect (3-band)
   */
  addEQ(
    lowGain: number = 0,
    midGain: number = 0,
    highGain: number = 0
  ): void {
    const lowShelf = this.audioContext.createBiquadFilter();
    const mid = this.audioContext.createBiquadFilter();
    const highShelf = this.audioContext.createBiquadFilter();

    lowShelf.type = 'lowshelf';
    lowShelf.frequency.value = 320;
    lowShelf.gain.value = lowGain;

    mid.type = 'peaking';
    mid.frequency.value = 1000;
    mid.Q.value = 0.5;
    mid.gain.value = midGain;

    highShelf.type = 'highshelf';
    highShelf.frequency.value = 3200;
    highShelf.gain.value = highGain;

    this.inputNode.connect(lowShelf);
    lowShelf.connect(mid);
    mid.connect(highShelf);
    highShelf.connect(this.outputNode);

    this.effectNodes.set('eq-low', lowShelf);
    this.effectNodes.set('eq-mid', mid);
    this.effectNodes.set('eq-high', highShelf);
  }

  /**
   * Remove an effect
   */
  removeEffect(name: string): void {
    const node = this.effectNodes.get(name);
    if (node) {
      node.disconnect();
      this.effectNodes.delete(name);
    }
  }

  /**
   * Remove all effects
   */
  removeAllEffects(): void {
    this.effectNodes.forEach((node) => node.disconnect());
    this.effectNodes.clear();
    this.inputNode.disconnect();
    this.inputNode.connect(this.outputNode);
  }

  /**
   * Get effect node
   */
  getEffect(name: string): AudioNode | undefined {
    return this.effectNodes.get(name);
  }
}

/**
 * Create audio effects processor
 */
export function createAudioEffects(audioContext: AudioContext): AudioEffectsProcessor {
  return new AudioEffectsProcessor(audioContext);
}
