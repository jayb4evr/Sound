interface ControlsProps {
  isRecording: boolean;
  isConnected: boolean;
  onStart: () => void;
  onStop: () => void;
}

/**
 * Control buttons for starting/stopping recording
 */
export function Controls({ isRecording, isConnected, onStart, onStop }: ControlsProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Status Indicator */}
      <div className="flex items-center gap-3 px-5 py-3 bg-bg-secondary rounded-full border border-bg-tertiary">
        <div
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            isConnected
              ? 'bg-accent-primary shadow-[0_0_10px_rgba(0,255,136,0.8)] animate-pulse'
              : 'bg-red-500'
          }`}
        />
        <span className="text-sm text-text-secondary font-medium">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        {!isRecording ? (
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-10 py-4 text-lg font-semibold bg-gradient-to-br from-accent-primary to-accent-secondary text-bg-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
          >
            <span className="text-2xl">🎤</span>
            Start Recording
          </button>
        ) : (
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-10 py-4 text-lg font-semibold bg-gradient-to-br from-red-600 to-red-800 text-text-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
          >
            <span className="text-2xl">⏹</span>
            Stop Recording
          </button>
        )}
      </div>
    </div>
  );
}
