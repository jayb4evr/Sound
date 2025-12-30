interface TranscriptionDisplayProps {
  transcript: string;
  onClear: () => void;
}

/**
 * Component to display live transcription with clear functionality
 */
export function TranscriptionDisplay({ transcript, onClear }: TranscriptionDisplayProps) {
  return (
    <div className="w-full max-w-4xl bg-bg-secondary rounded-xl border-2 border-bg-tertiary overflow-hidden shadow-neumorphic">
      <div className="flex justify-between items-center px-6 py-4 bg-bg-tertiary border-b border-bg-secondary">
        <h2 className="text-2xl font-semibold text-text-primary">Live Transcript</h2>
        <button
          onClick={onClear}
          className="px-4 py-2 text-sm font-medium bg-bg-tertiary text-text-secondary rounded-lg hover:bg-bg-secondary hover:text-text-primary transition-all duration-300"
        >
          Clear
        </button>
      </div>
      <div className="px-6 py-5 min-h-[200px] max-h-[400px] overflow-y-auto">
        <p className="text-base leading-relaxed text-text-secondary whitespace-pre-wrap break-words">
          {transcript || 'Transcript will appear here...'}
        </p>
      </div>
    </div>
  );
}
