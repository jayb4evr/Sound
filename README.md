# Sound - Audio Visualizer & Transcription System

🎵 **Real-time audio visualization with live transcription powered by React, Spring Boot, and Gemini AI**

## 🚀 Quick Start

See [RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md) for detailed setup instructions.

```bash
# Terminal 1: Start Backend
cd backend
mvn spring-boot:run

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## 📁 Project Structure

- **frontend/** - React application with circular visualizer
- **backend/** - Spring Boot WebSocket server
- **RUN_INSTRUCTIONS.md** - Complete setup guide
- **SUBMISSION.md** - Project summary and deliverables
- **UI_UX_AUDIT.md** - EdTech platform audit report
- **DEMO_SCRIPT.md** - Video demonstration guide

## ✨ Features

- 🎨 Beautiful circular audio visualizer (60 FPS)
- 🎤 Real-time microphone input processing
- 🌈 Dynamic color gradients based on frequency
- 📡 WebSocket streaming architecture
- 🤖 Gemini AI integration for transcription
- 📱 Responsive design (mobile + desktop)
- 🔒 Secure API key management

## 🛠️ Tech Stack

**Frontend**: React 18, Vite, Web Audio API, Canvas 2D, WebSocket  
**Backend**: Spring Boot 3.2.5, WebFlux, Reactive WebSocket, WebClient  
**AI**: Google Gemini API (with simulated fallback)

## 📖 Documentation

- [RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md) - How to run the application
- [SUBMISSION.md](./SUBMISSION.md) - Complete project summary
- [UI_UX_AUDIT.md](./UI_UX_AUDIT.md) - EdTech platform improvements
- [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) - Video demonstration guide