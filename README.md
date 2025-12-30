# Sound - MERN Audio Visualizer & Transcription System

🎵 **Real-time audio visualization with live transcription powered by React, Node.js, Socket.IO, and Google Gemini AI**

![Audio Visualizer UI](https://github.com/user-attachments/assets/59e070a2-7e3c-4ffe-b12e-a9bb0b8659f8)

## 🚀 Quick Start

**New MERN Stack Implementation** (Recommended)

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev
```

Open **http://localhost:5173** in your browser.

For detailed instructions, see **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)**

---

## 📁 Project Structure

### MERN Stack (Current Implementation)

- **client/** - React TypeScript frontend with Vite
- **server/** - Node.js/Express backend with Socket.IO
- **SETUP_INSTRUCTIONS.md** - Complete setup guide
- **README_MERN.md** - MERN stack documentation

### Legacy Spring Boot (Deprecated)

- **frontend/** - Original React frontend
- **backend/** - Spring Boot backend (being replaced)
- **RUN_INSTRUCTIONS.md** - Legacy setup guide

## ✨ Features

### MERN Stack Implementation

**Frontend (React + TypeScript):**
- ✅ **Circular Audio Equalizer**: 64 frequency bars in perfect circle using Canvas
- ✅ **60 FPS Animation**: Smooth visualizations with requestAnimationFrame
- ✅ **Web Audio API**: Real-time frequency analysis (16kHz, AnalyserNode)
- ✅ **TypeScript**: Full type safety throughout
- ✅ **Tailwind CSS**: Dark theme with neumorphic design
- ✅ **Socket.IO Client**: Real-time bidirectional communication
- ✅ **Custom Hooks**: useAudioAnalyzer, useWebSocket
- ✅ **Responsive Design**: Works on desktop and mobile

**Backend (Node.js + Express):**
- ✅ **Socket.IO Server**: Real-time WebSocket communication
- ✅ **Google Gemini Live API**: AI-powered transcription
- ✅ **No Buffering**: Immediate audio chunk forwarding
- ✅ **TypeScript**: Type-safe backend code
- ✅ **Multiple Concurrent Users**: Efficient session management
- ✅ **Security**: Helmet & CORS configured
- ✅ **Health Check**: /api/health endpoint

### Legacy Features (Spring Boot)
- 🎨 Beautiful circular audio visualizer (60 FPS)
- 🎤 Real-time microphone input processing
- 🌈 Dynamic color gradients based on frequency
- 📡 WebSocket streaming architecture
- 🤖 Gemini AI integration for transcription
- 📱 Responsive design (mobile + desktop)
- 🔒 Secure API key management

## 🛠️ Tech Stack

**MERN Stack (Current):**
- **Frontend**: React 18.3, TypeScript 5.6, Vite 5.4, Tailwind CSS 3.4, Socket.IO Client 4.8
- **Backend**: Node.js 20+, Express 4.19, Socket.IO 4.8, TypeScript 5.3, Google Generative AI 0.21
- **Security**: Helmet 7.1, CORS 2.8
- **Build Tools**: Vite, tsx, concurrently

**Legacy Stack:**
- **Frontend**: React 18, Vite, Web Audio API, Canvas 2D, WebSocket  
- **Backend**: Spring Boot 3.2.5, WebFlux, Reactive WebSocket, WebClient  
- **AI**: Google Gemini API (with simulated fallback)

## 📖 Documentation

### MERN Stack
- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Complete setup guide
- **[README_MERN.md](./README_MERN.md)** - MERN architecture documentation
- **[deploy.sh](./deploy.sh)** - Deployment script

### Legacy Documentation
- **[RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md)** - Spring Boot setup
- **[SUBMISSION.md](./SUBMISSION.md)** - Project summary
- **[UI_UX_AUDIT.md](./UI_UX_AUDIT.md)** - EdTech platform improvements
- **[DEMO_SCRIPT.md](./DEMO_SCRIPT.md)** - Video demonstration guide

---

## 🎮 Usage

1. **Click "Start Recording"** - Allow microphone access
2. **Watch the visualizer** - 64 frequency bars animate in real-time
3. **See transcription** - Live AI-powered text appears below
4. **Stop recording** - Click "Stop Recording" when done

## 🔑 Gemini API Setup

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create `server/.env`:
   ```bash
   GEMINI_API_KEY=your_key_here
   PORT=8080
   NODE_ENV=development
   ```
3. Restart backend: `npm run dev:server`

Without API key, the app runs in **simulated mode** with demo transcription.

## 🚀 Deployment

### Quick Deploy

```bash
./deploy.sh
```

### Manual Deploy

**Frontend (Vercel):**
```bash
cd client && npm run build && vercel --prod
```

**Backend (Render):**
- Build: `npm run build:server`
- Start: `npm run start:server`
- Add env vars: `GEMINI_API_KEY`, `PORT`, `CLIENT_URL`

See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for detailed deployment guide.

---

## 📊 Performance

- **Visualization**: 60 FPS with requestAnimationFrame
- **Audio Processing**: <10ms latency
- **WebSocket**: Real-time bidirectional streaming
- **Memory**: Efficient chunk processing (no buffering)

## 🐛 Troubleshooting

Common issues and solutions in [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md#-troubleshooting)

---

**Built with ❤️ using MERN Stack + Socket.IO + Google Gemini AI**