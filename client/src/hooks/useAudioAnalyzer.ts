import { useEffect, useRef, useState } from 'react';

export interface UseAudioAnalyzerReturn {
  analyserNode: AnalyserNode | null;
  frequencyDataRef: React.RefObject<Uint8Array | null>;
  isRecording: boolean;
  error: string | null;
  startRecording: (onAudioChunk: (data: ArrayBuffer) => void) => Promise<void>;
  stopRecording: () => void;
}

/**
 * Custom hook for Web Audio API analysis with 16kHz sampling
 * Provides 64 frequency bins for circular visualizer
 */
export function useAudioAnalyzer(): UseAudioAnalyzerReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const frequencyDataRef = useRef<Uint8Array | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startRecording = async (onAudioChunk: (data: ArrayBuffer) => void) => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000, // 16kHz sampling
          channelCount: 1,   // Mono
        }
      });

      mediaStreamRef.current = stream;

      // Create Audio Context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      audioContextRef.current = audioContext;

      // Create Analyser Node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 128; // 64 frequency bins (128/2)
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Initialize frequency data array (reused to avoid GC pressure)
      const bufferLength = analyser.frequencyBinCount;
      frequencyDataRef.current = new Uint8Array(bufferLength);

      // Setup MediaRecorder for sending audio data
      let options: MediaRecorderOptions = { mimeType: 'audio/webm;codecs=opus' };
      if (options.mimeType && !MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'audio/webm' };
      }
      if (options.mimeType && !MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'audio/mp4' };
      }
      if (options.mimeType && !MediaRecorder.isTypeSupported(options.mimeType)) {
        options = {};
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          event.data.arrayBuffer().then((buffer) => {
            onAudioChunk(buffer);
          });
        }
      };

      // Start recording with 100ms chunks
      mediaRecorder.start(100);
      setIsRecording(true);
      setError(null);

      console.log('🎤 Audio recording started with 16kHz mono sampling');
    } catch (err: any) {
      const errorMsg = `Microphone access denied: ${err.message}`;
      setError(errorMsg);
      console.error('❌', errorMsg);
      throw err;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    console.log('⏹ Audio recording stopped');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return {
    analyserNode: analyserRef.current,
    frequencyDataRef,
    isRecording,
    error,
    startRecording,
    stopRecording,
  };
}
