import { useEffect, useRef } from 'react';

interface TranscriptionDisplayProps {
  transcription: string;
  onClear: () => void;
}

/**
 * Transcription Display Component
 * Shows real-time transcription updates from Gemini API
 */
export function TranscriptionDisplay({ transcription, onClear }: TranscriptionDisplayProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new transcription arrives
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [transcription]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-dark-800 rounded-2xl shadow-neumorphic p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Live Transcript
          </h2>
          <button
            onClick={onClear}
            className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors duration-200 shadow-neumorphic-inset flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        </div>
        
        <div
          ref={contentRef}
          className="bg-dark-900 rounded-xl p-6 min-h-[200px] max-h-[400px] overflow-y-auto shadow-neumorphic-inset"
        >
          {transcription ? (
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
              {transcription}
            </p>
          ) : (
            <div className="text-center text-gray-500 italic py-8">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Transcript will appear here...</p>
              <p className="text-xs mt-2">Start recording to see real-time transcription</p>
            </div>
          )}
        </div>

        {transcription && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
            <span>•</span>
            <span>{transcription.length} characters</span>
          </div>
        )}
      </div>
    </div>
  );
}
