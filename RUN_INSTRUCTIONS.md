# Run Instructions - Audio Visualizer & Transcription System

## 🎯 Quick Start

### Prerequisites

- **Node.js**: v18+ ([Download](https://nodejs.org/))
- **npm**: v9+ (comes with Node.js)
- **Modern Browser**: Chrome, Firefox, Edge, or Safari

### Environment Variables (Optional)

Create `server/.env` for real transcription:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
PORT=3000
CLIENT_URL=http://localhost:5173
```

> **Note**: Without the API key, the system runs in **simulated mode**.

---

## 🚀 Running the Application

```bash
# Install dependencies (first time only)
npm install

# Start both client and server
npm run dev
```

Open http://localhost:5173 in your browser.

---

## 🎮 Using the Application

1. Click **"🎤 Start Recording"**
2. Allow microphone access
3. Speak and watch the visualizer react (64 bars at 60 FPS)
4. See live transcription appear below

---

## 📦 Building for Production

```bash
npm run build
```

---

**Version**: 2.0.0 | **Node.js 18+** | **React 18** | **TypeScript 5**
