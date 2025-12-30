# MERN Audio Transcription System

🎵 **Real-time audio visualization with live transcription powered by React, Node.js, Socket.IO, and Google Gemini AI**

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18+ ([Download](https://nodejs.org/))
- **npm**: v9+ (comes with Node.js)
- **Modern Browser**: Chrome, Firefox, Edge, or Safari

### Installation

```bash
# Install all dependencies (monorepo)
npm run install:all

# Or install manually
npm install
cd client && npm install
cd ../server && npm install
```

### Environment Variables

Create `server/.env` file:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8080
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> **Note**: Without the API key, the system runs in **simulated mode** with demo transcription text.

### Running the Application

#### Option 1: Run Both Services (Recommended)

```bash
npm run dev
```

This starts both backend (port 8080) and frontend (port 5173) concurrently.

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev:client
```

### Open the Application

Navigate to **http://localhost:5173** in your browser.

## 📁 Project Structure

```
mern-audio-transcription/
├── client/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CircularEqualizer.tsx    # 64-bar circular visualizer
│   │   │   ├── TranscriptionDisplay.tsx  # Real-time transcript display
│   │   │   └── Controls.tsx              # Start/Stop controls
│   │   ├── hooks/
│   │   │   ├── useAudioAnalyzer.ts       # Web Audio API hook
│   │   │   └── useWebSocket.ts           # Socket.IO client hook
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                 # Node.js/Express backend
│   ├── src/
│   │   ├── index.ts                   # Express + Socket.IO server
│   │   ├── transcriptionHandler.ts    # Socket.IO event handlers
│   │   └── geminiLiveClient.ts        # Gemini API integration
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── package.json           # Monorepo workspace config
└── README.md
```

## ✨ Features

### Frontend
- ✅ **Circular Audio Equalizer**: 64 frequency bars in perfect circle
- ✅ **60 FPS Animation**: Smooth, responsive visualizations using requestAnimationFrame
- ✅ **Web Audio API**: Real-time frequency analysis with AnalyserNode
- ✅ **TypeScript**: Full type safety
- ✅ **Tailwind CSS**: Dark theme with neumorphic design
- ✅ **Socket.IO Client**: Real-time bidirectional communication
- ✅ **Responsive Design**: Works on desktop and mobile

### Backend
- ✅ **Node.js/Express**: Lightweight, fast server
- ✅ **Socket.IO**: Real-time WebSocket communication
- ✅ **Google Gemini Live API**: AI-powered transcription
- ✅ **TypeScript**: Type-safe backend code
- ✅ **No Buffering**: Immediate audio chunk forwarding
- ✅ **Multiple Concurrent Users**: Efficient session management
- ✅ **Helmet & CORS**: Security best practices
- ✅ **Health Check Endpoint**: `/api/health`

## 🎮 Usage

### Step 1: Start Recording

1. Click **"Start Recording"** button
2. Allow microphone access when prompted
3. Observe the circular visualizer animate with your voice

### Step 2: View Transcription

- Speak into your microphone
- Watch real-time transcription appear below the visualizer
- In simulated mode (no API key), you'll see demo text
- With Gemini API key, you'll see actual speech transcribed

### Step 3: Stop Recording

- Click **"Stop Recording"** to end the session
- Use **"Clear"** button to reset the transcript

## 🔧 Technical Details

### Audio Format
- **Sample Rate**: 16kHz mono
- **Bit Depth**: 16-bit PCM
- **Chunk Size**: ~1024 bytes
- **Codec**: Opus (WebM container)

### Socket.IO Flow

1. **Client connects** → `connect` event
2. **Client emits** `start-transcription` → Server creates Gemini Live session
3. **Client streams** `audio-chunk` → Server forwards to Gemini via `sendRealtimeInput()`
4. **Gemini responds** → Server emits `partial-transcription` to client
5. **Client disconnect** → Cleanup session

### Web Audio API

- **AudioContext**: 16kHz sample rate
- **AnalyserNode**: FFT size 128 (64 frequency bins)
- **MediaStreamSource**: Microphone input
- **MediaRecorder**: Audio chunking and encoding

## 🔑 Gemini API Setup

### Get API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### Configure Backend

Create `server/.env`:

```bash
GEMINI_API_KEY=your_actual_api_key_here
PORT=8080
NODE_ENV=development
```

Restart the backend:

```bash
npm run dev:server
```

## 📦 Building for Production

### Build Both

```bash
npm run build
```

### Build Individually

```bash
npm run build:server
npm run build:client
```

### Production Files

- **Backend**: `server/dist/` (compiled JavaScript)
- **Frontend**: `client/dist/` (static HTML/CSS/JS)

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd client
npm run build

# Deploy to Vercel
vercel --prod
```

**Environment Variables on Vercel:**
- `VITE_SERVER_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)

### Backend (Render)

1. Create new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm run build:server`
   - **Start Command**: `npm run start:server`
   - **Environment Variables**: Add `GEMINI_API_KEY`, `PORT`, `CLIENT_URL`

### Update CORS

In `server/src/index.ts`, update allowed origins:

```typescript
origin: process.env.CLIENT_URL || 'https://your-frontend-url.vercel.app'
```

## 🧪 Testing

### Health Check

```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-30T15:00:00.000Z",
  "uptime": 123.456,
  "geminiConfigured": true
}
```

### WebSocket Connection

Use [websocat](https://github.com/vi/websocat):

```bash
websocat ws://localhost:8080/transcription
```

## 🐛 Troubleshooting

### Backend won't start

**Error**: `Port 8080 already in use`

**Solution**:
```bash
lsof -i :8080
kill -9 <PID>
```

### Frontend can't connect

**Check**:
1. Backend is running on port 8080
2. CORS is configured correctly
3. WebSocket URL is correct in client

### Microphone not working

**Solutions**:
1. Grant browser microphone permissions
2. Use HTTPS in production
3. Check system microphone settings

### No transcription

**In simulated mode**: You should see demo text appearing randomly

**With Gemini API**: Check API key is valid and set correctly

## 📊 Performance

- **Frontend**: 60 FPS visualization
- **Audio Processing**: <10ms latency
- **WebSocket**: Real-time bidirectional streaming
- **Memory**: Efficient chunk processing (no buffering)

## 🛠️ Tech Stack

**Frontend**:
- React 18.3
- TypeScript 5.6
- Vite 5.4
- Tailwind CSS 3.4
- Socket.IO Client 4.8
- Web Audio API

**Backend**:
- Node.js 20+
- Express 4.19
- Socket.IO 4.8
- TypeScript 5.3
- Google Generative AI 0.21
- Helmet 7.1
- CORS 2.8

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

**Built with ❤️ using MERN Stack + Socket.IO + Google Gemini AI**
