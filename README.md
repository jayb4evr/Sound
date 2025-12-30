# Sound - Audio Visualizer & Transcription System

🎵 **Real-time audio visualization with live transcription powered by React, Node.js, and Gemini AI**

## 🚀 Quick Start

See [RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md) for detailed setup instructions.

```bash
# Install dependencies
npm install

# Start both client and server
npm run dev
```

Open http://localhost:5173 in your browser.

## 📁 Project Structure

- **client/** - React + TypeScript application with circular visualizer
- **server/** - Node.js/Express + Socket.IO backend
- **RUN_INSTRUCTIONS.md** - Complete setup guide
- **SUBMISSION.md** - Project summary and deliverables
- **UI_UX_AUDIT.md** - EdTech platform audit report
- **DEMO_SCRIPT.md** - Video demonstration guide

## ✨ Features

- 🎨 Beautiful circular audio visualizer (64 bars at 60 FPS)
- 🎤 Real-time microphone input processing (16kHz mono)
- 🌈 Dynamic color gradients based on frequency
- 📡 Socket.IO bidirectional streaming architecture
- 🤖 Gemini AI integration for transcription
- 📱 Responsive design (mobile + desktop)
- 🔒 Secure API key management
- ⚡ TypeScript throughout for type safety
- 🎨 Tailwind CSS with dark neumorphic theme

## 🛠️ Tech Stack

**Frontend**: React 18, TypeScript, Tailwind CSS, Socket.IO Client, Web Audio API, Canvas 2D  
**Backend**: Node.js, Express, Socket.IO, Helmet, CORS, Google Gemini API  
**Build Tools**: Vite, npm workspaces, ESLint

## 📖 Documentation

- [RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md) - How to run the application
- [SUBMISSION.md](./SUBMISSION.md) - Complete project summary
- [UI_UX_AUDIT.md](./UI_UX_AUDIT.md) - EdTech platform improvements
- [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) - Video demonstration guide