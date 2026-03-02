import { useState, useEffect, useRef } from 'react';

export interface UseAudioVisualizationReturn {
  frequencies: number[];
  waveform: number[];
  beat: boolean;
  energy: number;
}

export function useAudioVisualization(
  audioContext?: AudioContext,
  source?: AudioNode
): UseAudioVisualizationReturn {
  const [frequencies, setFrequencies] = useState<number[]>([]);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [beat, setBeat] = useState(false);
  const [energy, setEnergy] = useState(0);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioContext || !source) return;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    analyserRef.current = analyser;

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const waveformData = new Uint8Array(analyser.fftSize);

    const analyze = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(frequencyData);
      analyserRef.current.getByteTimeDomainData(waveformData);

      setFrequencies(Array.from(frequencyData));
      setWaveform(Array.from(waveformData));

      const avgEnergy = frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;
      setEnergy(avgEnergy / 255);
      setBeat(avgEnergy > 200);

      animationRef.current = requestAnimationFrame(analyze);
    };

    analyze();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
    };
  }, [audioContext, source]);

  return { frequencies, waveform, beat, energy };
}
