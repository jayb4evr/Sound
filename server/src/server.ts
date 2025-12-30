import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { GeminiClient } from './geminiClient.js';
import { setupTranscriptionHandler } from './transcriptionHandler.js';

// Load environment variables
dotenv.config();

// Configuration
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';

// Track server start time for uptime
const serverStartTime = Date.now();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow WebSocket connections
}));

// CORS configuration
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// JSON parsing
app.use(express.json());

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO with CORS
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
  // WebSocket transport settings
  transports: ['websocket', 'polling'],
});

// Initialize Gemini client
const geminiClient = new GeminiClient(GEMINI_API_KEY, GEMINI_MODEL);

// Setup transcription handler
setupTranscriptionHandler(io, geminiClient);

// Health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const uptime = Math.floor((Date.now() - serverStartTime) / 1000);
  const geminiStatus = geminiClient.getStatus();
  
  res.json({
    status: 'healthy',
    uptime: `${uptime}s`,
    timestamp: new Date().toISOString(),
    gemini: {
      configured: geminiStatus.configured,
      model: geminiStatus.model,
      mode: geminiStatus.configured ? 'live' : 'simulated'
    },
    server: {
      port: PORT,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Audio Visualizer Server',
    version: '1.0.0',
    description: 'Node.js/Express + Socket.IO backend for real-time audio streaming and transcription',
    endpoints: {
      health: '/api/health',
      socketIO: '/transcription (Socket.IO namespace)'
    }
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: any) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
httpServer.listen(PORT, () => {
  console.log('\n🎵 Audio Visualizer Server');
  console.log('━'.repeat(50));
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO namespace: /transcription`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 CORS enabled for: ${CLIENT_URL}`);
  console.log(`🤖 Gemini mode: ${geminiClient.isApiConfigured() ? 'LIVE' : 'SIMULATED'}`);
  console.log('━'.repeat(50));
  console.log('Ready to accept connections!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️ SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️ SIGINT received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
