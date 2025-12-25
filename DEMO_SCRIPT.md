# Demo Video Script - Audio Visualizer & Transcription System

## Video Overview
**Duration**: 2 minutes  
**Purpose**: Demonstrate the complete audio visualization and transcription system  
**Target Audience**: Technical reviewers, stakeholders, developers

---

## Script Outline

### Opening (0:00 - 0:15)
**[Screen: Show both frontend and backend terminal side by side]**

**Narration**:
> "Hello! Today I'm going to demonstrate our real-time audio visualizer and transcription system built with React and Spring Boot. This system captures audio from your microphone, creates stunning visualizations, and provides live transcription using the Gemini API."

**Actions**:
- Show project directory structure
- Highlight frontend and backend folders

---

### Part 1: Backend Setup (0:15 - 0:35)

**[Screen: Backend terminal]**

**Narration**:
> "Let's start with the backend. This is a Spring Boot application using WebFlux for reactive programming. It handles WebSocket connections, processes audio streams, and communicates with the Gemini API."

**Actions**:
1. Show backend structure:
   ```
   backend/
   ├── src/main/java/com/audiovisualizer/backend/
   │   ├── AudioVisualizerApplication.java
   │   ├── WebSocketConfig.java
   │   └── GeminiLiveClient.java
   └── pom.xml
   ```

2. Run the backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. Show console output:
   - "Started AudioVisualizerApplication"
   - "WebSocket endpoint mapped to /audio"
   - Server running on port 8080

**Narration**:
> "The backend is now running on port 8080 and ready to accept WebSocket connections at the /audio endpoint."

---

### Part 2: Frontend Setup (0:35 - 0:55)

**[Screen: Frontend terminal]**

**Narration**:
> "Now let's start the React frontend. This uses Vite for fast development and integrates the Web Audio API for real-time visualization."

**Actions**:
1. Show frontend structure:
   ```
   frontend/
   ├── src/
   │   ├── App.jsx
   │   ├── App.css
   │   └── main.jsx
   ├── package.json
   └── vite.config.js
   ```

2. Install dependencies and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Show console output:
   - "Local: http://localhost:5173"
   - Development server ready

**Narration**:
> "The frontend is now running on localhost:5173. Let's open it in a browser."

---

### Part 3: UI Demonstration (0:55 - 1:25)

**[Screen: Browser showing the application]**

**Narration**:
> "Here's our beautiful dark-themed interface. You can see the circular visualizer in the center, ready to react to audio input."

**Actions**:
1. **Show Initial State**:
   - Point to the circular canvas area
   - Highlight the "Start Recording" button
   - Show the empty transcript area
   - Point to the "Disconnected" status indicator

2. **Click "Start Recording"**:
   - Browser asks for microphone permission
   - Click "Allow"

3. **Show Connection**:
   - Status changes to "Connected" (green dot)
   - Backend console shows: "WebSocket connection established"

4. **Start Speaking**:
   - Speak clearly: "Hello, this is a demonstration of the audio visualizer."
   - Show the circular visualizer animating in real-time
   - Radial bars pulse and change colors based on frequency data
   - Point out the 60 FPS smooth animation

**Narration**:
> "Notice how the visualizer responds in real-time to my voice. Each radial bar represents different frequency bands, creating this beautiful circular pattern with smooth color gradients."

---

### Part 4: Transcription Feature (1:25 - 1:45)

**[Screen: Focus on transcript area]**

**Narration**:
> "While the visualizer is running, the system is also sending audio chunks to the backend via WebSocket. The backend processes these through the Gemini API and streams back the transcription."

**Actions**:
1. **Show Transcript Appearing**:
   - If Gemini API is configured: Show real transcription appearing word by word
   - If simulated mode: Show simulated text appearing:
     - "Hello this is a simulated transcription."
     - "The audio visualizer is working correctly."
     - "Configure GEMINI_API_KEY for real transcription."

2. **Backend Console**:
   - Show logs: "Received audio chunk: 4096 bytes"
   - Show logs: "Sending transcript: Hello"

**Narration**:
> "Since we're running in demonstration mode without a Gemini API key, you're seeing simulated transcription. In production, this would show real-time speech-to-text transcription of everything I'm saying."

---

### Part 5: Technical Architecture (1:45 - 2:00)

**[Screen: Split view or diagram]**

**Narration**:
> "Let's quickly review the architecture. Audio flows from the browser's microphone through the MediaRecorder API, which sends binary chunks over WebSocket to our Spring Boot backend. The backend uses WebFlux for reactive, non-blocking processing, forwards audio to the Gemini API, and streams the transcript back to the browser—all in real-time."

**Actions**:
1. Show architecture diagram or code flow:
   ```
   Browser Mic 
   → MediaRecorder (100ms chunks)
   → WebSocket (binary)
   → Spring Boot WebSocketConfig
   → GeminiLiveClient
   → Gemini API
   → Transcript Stream
   → WebSocket (text)
   → Browser Display
   ```

2. **Stop Recording**:
   - Click "Stop Recording" button
   - Visualizer stops animating
   - WebSocket disconnects
   - Show final transcript

---

### Closing (2:00 - 2:10)

**[Screen: Show all deliverables]**

**Narration**:
> "And that's our complete audio visualizer and transcription system! Check out the documentation for setup instructions, UI/UX audit findings, and submission details. Thank you for watching!"

**Actions**:
1. Show file structure with deliverables:
   ```
   ✅ RUN_INSTRUCTIONS.md
   ✅ UI_UX_AUDIT.md
   ✅ DEMO_SCRIPT.md (this file)
   ✅ SUBMISSION.md
   ```

2. Show project running successfully

---

## Recording Tips

### Before Recording
1. ✅ Test microphone and audio levels
2. ✅ Close unnecessary applications
3. ✅ Clear browser cache
4. ✅ Prepare talking points
5. ✅ Have backend and frontend running

### During Recording
1. **Speak clearly** at a moderate pace
2. **Point with cursor** to highlight features
3. **Zoom in** on important details
4. **Pause briefly** between sections
5. **Show enthusiasm** in narration

### Technical Setup
- **Screen Recording**: OBS Studio or QuickTime
- **Resolution**: 1920x1080 at 30fps minimum
- **Audio**: Use good microphone (not built-in)
- **Lighting**: Ensure code is clearly visible
- **Editing**: Trim dead air, add transitions

### Alternative: Simulated Mode Demo

If Gemini API is not available, emphasize:

**Narration Addition**:
> "For this demonstration, I'm using simulated transcription mode. The system architecture is fully implemented and ready for production use with a real Gemini API key. You can see the audio is being captured, transmitted via WebSocket, and processed by the backend exactly as it would be with the real API."

**Show**:
- Code in GeminiLiveClient.java with `simulateTranscription()` method
- Environment variable placeholder: `GEMINI_API_KEY=your_key_here`
- Documentation explaining how to add the real API key

---

## Post-Production Checklist

- [ ] Add title card with project name
- [ ] Include background music (low volume)
- [ ] Add captions for key technical terms
- [ ] Highlight code sections with zoom/annotations
- [ ] Include timestamps in description
- [ ] Export at 1080p with good bitrate
- [ ] Test on different devices before sharing

---

## Video Timestamps (for description)

```
0:00 - Introduction
0:15 - Backend Setup (Spring Boot)
0:35 - Frontend Setup (React + Vite)
0:55 - User Interface Tour
1:10 - Live Visualization Demo
1:25 - Transcription Feature
1:45 - Architecture Overview
2:00 - Conclusion & Documentation
```

---

**Created by**: Audio Visualizer Team  
**Last Updated**: December 2025  
**Demo Environment**: Development (Simulated Transcription Mode)
