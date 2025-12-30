import { useEffect, useRef, useState, useCallback } from 'react';

interface AudioAnalyzerData {
  frequencyData: Uint8Array | null;
  analyser: AnalyserNode | null;
  audioContext: AudioContext | null;
}

/**
 * Custom hook for Web Audio API analysis
 * Provides real-time frequency data for visualization
 */
export function useAudioAnalyzer(isActive: boolean) {
  const [audioData, setAudioData] = useState<AudioAnalyzerData>({
    frequencyData: null,
    analyser: null,
    audioContext: null
  });
  const [error, setError] = useState<string>('');
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const frequencyDataRef = useRef<Uint8Array | null>(null);

  const startAnalyzer = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000 // 16kHz for Gemini API
        } 
      });
      streamRef.current = stream;

      // Create Audio Context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });
      audioContextRef.current = audioContext;

      // Create Analyser Node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 128; // 64 frequency bins (32-64 bars for circular visualizer)
      analyser.smoothingTimeConstant = 0.8; // Smooth animations
      analyserRef.current = analyser;

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Initialize frequency data array
      const bufferLength = analyser.frequencyBinCount;
      const frequencyData = new Uint8Array(bufferLength);
      frequencyDataRef.current = frequencyData;

      setAudioData({
        frequencyData,
        analyser,
        audioContext
      });

      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to access microphone');
      console.error('Microphone access error:', err);
    }
  }, []);

  const stopAnalyzer = useCallback(() => {
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    analyserRef.current = null;
    frequencyDataRef.current = null;

    setAudioData({
      frequencyData: null,
      analyser: null,
      audioContext: null
    });
  }, []);

  // Update frequency data at 60fps
  const updateFrequencyData = useCallback(() => {
    if (analyserRef.current && frequencyDataRef.current) {
      // Type assertion needed due to TypeScript library definitions
      analyserRef.current.getByteFrequencyData(frequencyDataRef.current as Uint8Array<ArrayBuffer>);
      // Trigger re-render by creating new Uint8Array reference only when needed
      setAudioData(prev => ({
        ...prev,
        frequencyData: frequencyDataRef.current
      }));
    }
    animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
  }, []);

  useEffect(() => {
    if (isActive && !audioContextRef.current) {
      startAnalyzer();
    } else if (!isActive && audioContextRef.current) {
      stopAnalyzer();
    }
  }, [isActive, startAnalyzer, stopAnalyzer]);

  useEffect(() => {
    if (analyserRef.current && frequencyDataRef.current) {
      updateFrequencyData();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateFrequencyData]);

  return { 
    ...audioData, 
    error,
    stream: streamRef.current 
  };
}
