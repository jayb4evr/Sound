import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import { useWebSocket } from './hooks/useWebSocket';
import { CircularEqualizer } from './components/CircularEqualizer';
import { TranscriptionDisplay } from './components/TranscriptionDisplay';
import { Controls } from './components/Controls';

function App() {
  const { isConnected, sendAudioChunk, transcript, clearTranscript, error: wsError } = useWebSocket();
  const { analyserNode, frequencyDataRef, isRecording, error: audioError, startRecording, stopRecording } = useAudioAnalyzer();

  const handleStart = async () => {
    try {
      await startRecording(sendAudioChunk);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const handleStop = () => {
    stopRecording();
  };

  const error = audioError || wsError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      {/* Header */}
      <header className="text-center pt-10 pb-8 px-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent mb-3">
          🎵 Audio Visualizer & Transcription
        </h1>
        <p className="text-text-secondary text-lg">
          Real-time audio visualization with live transcription
        </p>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center gap-8 px-4 pb-12">
        {/* Visualizer */}
        <CircularEqualizer analyserNode={analyserNode} frequencyDataRef={frequencyDataRef} isRecording={isRecording} />

        {/* Controls */}
        <Controls
          isRecording={isRecording}
          isConnected={isConnected}
          onStart={handleStart}
          onStop={handleStop}
        />

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl w-full px-6 py-4 bg-red-500/10 border border-red-500 rounded-xl text-red-400 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Transcription Display */}
        <TranscriptionDisplay transcript={transcript} onClear={clearTranscript} />
      </main>

      {/* Footer */}
      <footer className="text-center py-8 px-4 text-text-secondary text-sm">
        <p>Built with React + TypeScript + Socket.IO + Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;
