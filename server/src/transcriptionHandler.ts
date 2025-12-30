import { Socket } from 'socket.io';
import { GeminiLiveClient } from './geminiLiveClient.js';

interface AudioChunk {
  data: ArrayBuffer;
  timestamp: number;
}

/**
 * Handles Socket.IO connection for real-time audio transcription
 * Flow:
 * 1. Client emits 'start-transcription' → Server creates Gemini Live session
 * 2. Client streams audio chunks → Server forwards to Gemini via sendRealtimeInput()
 * 3. Gemini partial responses → Server emits 'partial-transcription' to client
 * 4. Client disconnect → Cleanup session
 */
export function handleTranscriptionConnection(socket: Socket): void {
  let geminiClient: GeminiLiveClient | null = null;
  let isTranscribing = false;

  // Start transcription session
  socket.on('start-transcription', async () => {
    try {
      console.log(`[Transcription] Starting session for ${socket.id}`);
      
      // Create Gemini Live client
      geminiClient = new GeminiLiveClient();
      await geminiClient.initialize();
      
      // Listen for partial transcriptions from Gemini
      geminiClient.on('partial-transcription', (text: string) => {
        socket.emit('partial-transcription', { text, timestamp: Date.now() });
      });

      geminiClient.on('error', (error: Error) => {
        console.error(`[Transcription] Gemini error for ${socket.id}:`, error.message);
        socket.emit('transcription-error', { error: error.message });
      });

      isTranscribing = true;
      socket.emit('transcription-started', { sessionId: socket.id });
      
    } catch (error) {
      console.error(`[Transcription] Failed to start session for ${socket.id}:`, error);
      socket.emit('transcription-error', { 
        error: error instanceof Error ? error.message : 'Failed to start transcription' 
      });
    }
  });

  // Receive audio chunks and forward to Gemini
  socket.on('audio-chunk', async (chunk: AudioChunk) => {
    if (!isTranscribing || !geminiClient) {
      console.warn(`[Transcription] Received audio chunk but not transcribing: ${socket.id}`);
      return;
    }

    try {
      // Forward audio chunk to Gemini Live API immediately (no buffering)
      await geminiClient.sendAudioChunk(chunk.data);
    } catch (error) {
      console.error(`[Transcription] Error processing audio chunk for ${socket.id}:`, error);
      socket.emit('transcription-error', { 
        error: error instanceof Error ? error.message : 'Error processing audio' 
      });
    }
  });

  // Stop transcription
  socket.on('stop-transcription', async () => {
    console.log(`[Transcription] Stopping session for ${socket.id}`);
    await cleanup();
    socket.emit('transcription-stopped');
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log(`[Transcription] Client disconnected: ${socket.id}`);
    await cleanup();
  });

  // Cleanup function
  async function cleanup(): Promise<void> {
    isTranscribing = false;
    if (geminiClient) {
      try {
        await geminiClient.close();
      } catch (error) {
        console.error(`[Transcription] Error closing Gemini client:`, error);
      }
      geminiClient = null;
    }
  }
}
