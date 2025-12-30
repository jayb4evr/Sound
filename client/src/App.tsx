import { useState, useEffect, useRef } from 'react';
import { CircularEqualizer } from './components/CircularEqualizer';
import { TranscriptionDisplay } from './components/TranscriptionDisplay';
import { Controls } from './components/Controls';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import { useWebSocket } from './hooks/useWebSocket';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Custom hooks
  const { 
    frequencyData, 
    error: audioError, 
    stream 
  } = useAudioAnalyzer(isRecording);

  const {
    isConnected,
    transcription,
    sendAudioChunk,
    startTranscription,
    stopTranscription,
    clearTranscription,
    error: wsError
  } = useWebSocket(SERVER_URL);

  const error = audioError || wsError;

  /**
   * Start recording handler
   * 1. Start WebSocket transcription session
   * 2. Setup MediaRecorder for audio streaming
   * 3. Convert audio to 16-bit PCM 16kHz mono
   */
  const handleStart = async () => {
    if (!isConnected) {
      console.warn('WebSocket not connected, waiting...');
      // Wait for connection
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Start transcription session
    startTranscription();
    setIsRecording(true);
  };

  /**
   * Setup MediaRecorder when stream is available
   * Stream audio chunks to backend via Socket.IO
   */
  useEffect(() => {
    if (!stream || !isRecording) return;

    try {
      // Create MediaRecorder with optimal settings for Gemini API
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 16000
      });

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          // Convert audio blob to ArrayBuffer and send via Socket.IO
          const arrayBuffer = await event.data.arrayBuffer();
          
          // Convert to 16-bit PCM format (simplified - in production use Web Audio API)
          // For now, send raw chunks (backend will handle conversion if needed)
          sendAudioChunk(arrayBuffer);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
      };

      // Start recording with small chunks (~100ms) for real-time streaming
      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;

    } catch (err) {
      console.error('Failed to create MediaRecorder:', err);
    }

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [stream, isRecording, sendAudioChunk]);

  /**
   * Stop recording handler
   */
  const handleStop = () => {
    setIsRecording(false);
    stopTranscription();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Header */}
      <header className="pt-12 pb-6 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-3">
          🎵 Audio Visualizer & Transcription
        </h1>
        <p className="text-gray-400 text-lg">
          Real-time audio visualization with live AI transcription
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        {/* Circular Equalizer */}
        <CircularEqualizer 
          frequencyData={frequencyData} 
          isActive={isRecording} 
        />

        {/* Controls */}
        <Controls
          isRecording={isRecording}
          isConnected={isConnected}
          onStart={handleStart}
          onStop={handleStop}
          error={error}
        />

        {/* Transcription Display */}
        <TranscriptionDisplay
          transcription={transcription}
          onClear={clearTranscription}
        />
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>Built with React + TypeScript + Socket.IO + Google Gemini AI</p>
        <p className="mt-2">
          <a 
            href="https://github.com" 
            className="text-green-400 hover:text-green-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
