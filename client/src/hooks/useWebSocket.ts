import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  transcription: string;
  sendAudioChunk: (chunk: ArrayBuffer) => void;
  startTranscription: () => void;
  stopTranscription: () => void;
  clearTranscription: () => void;
  error: string;
}

/**
 * Custom hook for Socket.IO WebSocket connection
 * Handles real-time bidirectional communication with backend
 */
export function useWebSocket(serverUrl: string): UseWebSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create Socket.IO connection to /transcription namespace
    const newSocket = io(`${serverUrl}/transcription`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection handlers
    newSocket.on('connect', () => {
      console.log('[WebSocket] Connected to server');
      setIsConnected(true);
      setError('');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('[WebSocket] Connection error:', err.message);
      setError(`Connection failed: ${err.message}`);
      setIsConnected(false);
    });

    // Transcription event handlers
    newSocket.on('transcription-started', (data) => {
      console.log('[WebSocket] Transcription started:', data.sessionId);
    });

    newSocket.on('partial-transcription', (data: { text: string; timestamp: number }) => {
      console.log('[WebSocket] Partial transcription:', data.text);
      setTranscription(prev => prev + data.text);
    });

    newSocket.on('transcription-stopped', () => {
      console.log('[WebSocket] Transcription stopped');
    });

    newSocket.on('transcription-error', (data: { error: string }) => {
      console.error('[WebSocket] Transcription error:', data.error);
      setError(data.error);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [serverUrl]);

  const sendAudioChunk = useCallback((chunk: ArrayBuffer) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('audio-chunk', {
        data: chunk,
        timestamp: Date.now()
      });
    }
  }, [isConnected]);

  const startTranscription = useCallback(() => {
    if (socketRef.current && isConnected) {
      console.log('[WebSocket] Starting transcription...');
      socketRef.current.emit('start-transcription');
    }
  }, [isConnected]);

  const stopTranscription = useCallback(() => {
    if (socketRef.current && isConnected) {
      console.log('[WebSocket] Stopping transcription...');
      socketRef.current.emit('stop-transcription');
    }
  }, [isConnected]);

  const clearTranscription = useCallback(() => {
    setTranscription('');
  }, []);

  return {
    socket,
    isConnected,
    transcription,
    sendAudioChunk,
    startTranscription,
    stopTranscription,
    clearTranscription,
    error
  };
}
