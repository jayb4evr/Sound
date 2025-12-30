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

      // Create Analyser Node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 128; // 64 frequency bins (32-64 bars for circular visualizer)
      analyser.smoothingTimeConstant = 0.8; // Smooth animations

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Initialize frequency data array
      const bufferLength = analyser.frequencyBinCount;
      const frequencyData = new Uint8Array(bufferLength);

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
    if (audioData.audioContext) {
      audioData.audioContext.close();
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setAudioData({
      frequencyData: null,
      analyser: null,
      audioContext: null
    });
  }, [audioData.audioContext]);

  // Update frequency data at 60fps
  const updateFrequencyData = useCallback(() => {
    if (audioData.analyser && audioData.frequencyData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audioData.analyser.getByteFrequencyData(audioData.frequencyData as any);
      setAudioData(prev => ({
        ...prev,
        frequencyData: new Uint8Array(audioData.frequencyData!)
      }));
    }
    animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
  }, [audioData.analyser, audioData.frequencyData]);

  useEffect(() => {
    if (isActive && !audioData.audioContext) {
      startAnalyzer();
    } else if (!isActive && audioData.audioContext) {
      stopAnalyzer();
    }
  }, [isActive, audioData.audioContext, startAnalyzer, stopAnalyzer]);

  useEffect(() => {
    if (audioData.analyser && audioData.frequencyData) {
      updateFrequencyData();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioData.analyser, audioData.frequencyData, updateFrequencyData]);

  return { 
    ...audioData, 
    error,
    stream: streamRef.current 
  };
}
