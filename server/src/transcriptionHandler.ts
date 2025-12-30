import { Server as SocketIOServer, Socket } from 'socket.io';
import { GeminiClient } from './geminiClient.js';

export interface AudioChunkData {
  data: ArrayBuffer;
  timestamp: number;
}

/**
 * Setup transcription handler for Socket.IO /transcription namespace
 */
export function setupTranscriptionHandler(
  io: SocketIOServer,
  geminiClient: GeminiClient
): void {
  const transcriptionNamespace = io.of('/transcription');

  transcriptionNamespace.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected to /transcription: ${socket.id}`);

    // Create a new session for this socket
    geminiClient.resetSession();

    // Handle incoming audio chunks
    socket.on('audio-chunk', async (chunk: AudioChunkData) => {
      try {
        // Immediate forwarding - no buffering
        await geminiClient.sendAudioChunk(chunk.data);
      } catch (error: any) {
        console.error(`❌ Error processing audio chunk from ${socket.id}:`, error.message);
        socket.emit('error', { message: 'Failed to process audio chunk' });
      }
    });

    // Listen for partial transcriptions from Gemini
    const onPartialTranscription = (text: string) => {
      socket.emit('partial-transcription', {
        text,
        timestamp: Date.now()
      });
    };

    const onError = (error: Error) => {
      socket.emit('error', {
        message: error.message,
        timestamp: Date.now()
      });
    };

    // Attach listeners
    geminiClient.on('partial-transcription', onPartialTranscription);
    geminiClient.on('error', onError);

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`🔌 Client disconnected from /transcription: ${socket.id} (${reason})`);
      
      // Cleanup: remove listeners for this socket
      geminiClient.removeListener('partial-transcription', onPartialTranscription);
      geminiClient.removeListener('error', onError);
      geminiClient.resetSession();
    });

    // Handle client errors
    socket.on('error', (error) => {
      console.error(`❌ Socket error from ${socket.id}:`, error);
    });
  });

  console.log('✅ Transcription handler setup complete on /transcription namespace');
}
