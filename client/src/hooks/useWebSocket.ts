import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

interface PartialTranscription {
  text: string;
  timestamp: number;
}

interface ErrorMessage {
  message: string;
  timestamp: number;
}

export interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  sendAudioChunk: (data: ArrayBuffer) => void;
  transcript: string;
  clearTranscript: () => void;
  error: string | null;
}

/**
 * Custom hook for Socket.IO connection to /transcription namespace
 */
export function useWebSocket(): UseWebSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const socket = io(`${SERVER_URL}/transcription`, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket.IO connected:', socket.id);
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket.IO disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket.IO connection error:', err.message);
      setError(`Connection error: ${err.message}`);
      setIsConnected(false);
    });

    // Transcription events
    socket.on('partial-transcription', (data: PartialTranscription) => {
      console.log('📝 Partial transcription:', data.text);
      setTranscript((prev) => prev + data.text);
    });

    // Error events
    socket.on('error', (data: ErrorMessage) => {
      console.error('❌ Server error:', data.message);
      setError(data.message);
    });

    // Cleanup on unmount
    return () => {
      console.log('🔌 Disconnecting Socket.IO');
      socket.disconnect();
    };
  }, []);

  const sendAudioChunk = (data: ArrayBuffer) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('audio-chunk', {
        data,
        timestamp: Date.now(),
      });
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  return {
    socket: socketRef.current,
    isConnected,
    sendAudioChunk,
    transcript,
    clearTranscript,
    error,
  };
}
