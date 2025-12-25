# Run Instructions - Audio Visualizer & Transcription System

## 🎯 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js**: v18+ ([Download](https://nodejs.org/))
- **Java JDK**: 17+ ([Download](https://adoptium.net/))
- **Maven**: 3.6+ ([Download](https://maven.apache.org/download.cgi))
- **Modern Browser**: Chrome, Firefox, Edge, or Safari

### Environment Variables (Optional)

For real transcription (not required for demo):
```bash
export GEMINI_API_KEY="your_gemini_api_key_here"
```

> **Note**: Without the API key, the system runs in **simulated mode** with demo transcription text.

---

## 🚀 Running the Application

### Option 1: Run Both Services (Recommended)

Open **two terminal windows** side by side.

#### Terminal 1: Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

**Expected Output**:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.5)

INFO  AudioVisualizerApplication - Started AudioVisualizerApplication in 3.2 seconds
INFO  WebSocketConfig - WebSocket endpoint mapped to /audio
```

✅ Backend is running on **http://localhost:8080**

---

#### Terminal 2: Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

**First Time Only**: `npm install` will download dependencies (~30 seconds)

**Expected Output**:
```
  VITE v5.0.8  ready in 432 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

✅ Frontend is running on **http://localhost:5173**

---

### Option 2: Quick Test (No Installation)

If you just want to verify the code structure:

```bash
# Check backend compiles
cd backend
mvn clean compile

# Check frontend has correct dependencies
cd ../frontend
cat package.json
```

---

## 🎮 Using the Application

### Step 1: Open the Application

1. Open your browser and navigate to: **http://localhost:5173**
2. You should see the dark-themed audio visualizer interface

### Step 2: Allow Microphone Access

1. Click the **"🎤 Start Recording"** button
2. Browser will prompt: "Allow localhost to use your microphone?"
3. Click **"Allow"**

### Step 3: Observe the System

**Frontend**:
- ✅ Status indicator changes to "Connected" (green)
- ✅ Circular visualizer starts animating
- ✅ Radial bars pulse with your voice (60 FPS)
- ✅ Color gradients shift based on frequency

**Backend Console**:
```
DEBUG WebSocketConfig - WebSocket connection established: a1b2c3d4
DEBUG WebSocketConfig - Received audio chunk: 4096 bytes
DEBUG GeminiLiveClient - Returning simulated transcription
DEBUG WebSocketConfig - Sending transcript: Hello this is
```

**Transcript Area**:
- Text appears gradually: "Hello this is a simulated transcription..."
- In simulated mode, you'll see demo phrases
- With Gemini API key, you'll see your actual speech transcribed

### Step 4: Test Features

#### Visualizer
- **Speak normally**: See bars react to your voice
- **Speak louder**: Bars extend further from center
- **Different pitches**: Different frequencies light up different bars
- **Silence**: Bars shrink back to center

#### Transcript
- **Click "Clear"**: Removes all transcript text
- **Continuous speaking**: Text accumulates in the display area
- **Scroll**: Auto-scrolls as more text appears

#### Stop Recording
- **Click "⏹ Stop Recording"**: Stops audio capture
- WebSocket disconnects gracefully
- Visualizer animation stops

---

## 🔧 Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Change server port (default: 8080)
server.port=8080

# Update CORS for different frontend URL
spring.webflux.cors.allowed-origins=http://localhost:5173

# Adjust logging levels
logging.level.com.audiovisualizer=DEBUG  # Change to INFO for production
```

### Frontend Configuration

Edit `frontend/vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 5173,  // Change frontend port
    host: true   // Expose to network
  }
})
```

Update WebSocket URL in `frontend/src/App.jsx` if backend port changes:
```javascript
const ws = new WebSocket('ws://localhost:8080/audio');  // Update port here
```

---

## 🧪 Testing

### Test Backend Only

```bash
cd backend
mvn test
```

### Test WebSocket Connection

```bash
# Install websocat (WebSocket CLI)
# macOS: brew install websocat
# Linux: cargo install websocat

# Connect to backend
websocat ws://localhost:8080/audio

# You should see connection established in backend logs
```

### Test Frontend Only (Without Backend)

The frontend will show "Disconnected" status but visualizer still works:
```bash
cd frontend
npm run dev
```
- Click "Start Recording"
- Visualizer will animate based on microphone input
- Transcription won't work (WebSocket error expected)

---

## 📦 Building for Production

### Backend JAR

```bash
cd backend
mvn clean package

# Creates: target/audio-visualizer-backend-1.0.0.jar

# Run the JAR
java -jar target/audio-visualizer-backend-1.0.0.jar
```

### Frontend Static Files

```bash
cd frontend
npm run build

# Creates: dist/ folder with optimized files

# Preview production build
npm run preview
```

### Deploy Both

1. **Backend**: Deploy JAR to cloud server (AWS, Google Cloud, Azure)
2. **Frontend**: Deploy dist/ folder to static hosting (Vercel, Netlify, S3)
3. **Update CORS**: Change `allowed-origins` to production frontend URL
4. **Update WebSocket URL**: Change to production backend URL

---

## 🐛 Troubleshooting

### Issue: Backend won't start

**Error**: `Port 8080 already in use`

**Solution**:
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in application.properties
server.port=8081
```

---

### Issue: Frontend can't connect to WebSocket

**Error**: `WebSocket connection error`

**Check**:
1. ✅ Backend is running: `curl http://localhost:8080`
2. ✅ No firewall blocking port 8080
3. ✅ CORS settings allow localhost:5173

**Solution**: Check browser console for exact error, verify backend logs

---

### Issue: Microphone not working

**Error**: `Microphone access denied`

**Solutions**:
1. **Check browser permissions**: Settings → Privacy → Microphone
2. **Use HTTPS**: Some browsers require secure context
3. **Try different browser**: Test in Chrome/Firefox
4. **Check system permissions**: macOS System Settings → Privacy → Microphone

---

### Issue: No transcription appearing

**Expected Behavior**: In simulated mode, you should see demo text

**Check**:
1. ✅ Backend logs show "Received audio chunk"
2. ✅ Backend logs show "Sending transcript"
3. ✅ Frontend shows "Connected" status

**Debug**:
```bash
# Backend: Check console for errors
# Frontend: Open browser DevTools → Console → Network → WS tab
# Look for WebSocket messages
```

---

### Issue: Visualizer not animating

**Possible Causes**:
1. No microphone input (check system settings)
2. Browser doesn't support Web Audio API (update browser)
3. Canvas not rendering (check browser console)

**Solution**:
- Speak into microphone while app is running
- Grant microphone permissions
- Try different browser

---

## 📊 System Requirements

### Minimum
- **CPU**: Dual-core 2.0 GHz
- **RAM**: 4 GB
- **Browser**: Chrome 90+, Firefox 88+, Edge 90+
- **Network**: Not required (localhost only)

### Recommended
- **CPU**: Quad-core 2.5 GHz+
- **RAM**: 8 GB+
- **Browser**: Latest version
- **Microphone**: Built-in or external

---

## 🔑 Gemini API Setup (Optional)

To enable **real transcription**:

### 1. Get API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### 2. Set Environment Variable

**macOS/Linux**:
```bash
export GEMINI_API_KEY="your_actual_api_key_here"
cd backend
mvn spring-boot:run
```

**Windows (PowerShell)**:
```powershell
$env:GEMINI_API_KEY="your_actual_api_key_here"
cd backend
mvn spring-boot:run
```

**Windows (CMD)**:
```cmd
set GEMINI_API_KEY=your_actual_api_key_here
cd backend
mvn spring-boot:run
```

### 3. Verify

Backend logs should show:
```
INFO GeminiLiveClient - Gemini API configured
```

Instead of:
```
WARN GeminiLiveClient - Gemini API key not configured. Using simulated mode.
```

---

## 📁 Project Structure

```
Sound/
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── App.css          # Styles
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/main/
│   │   ├── java/com/audiovisualizer/backend/
│   │   │   ├── AudioVisualizerApplication.java
│   │   │   ├── WebSocketConfig.java
│   │   │   └── GeminiLiveClient.java
│   │   └── resources/
│   │       └── application.properties
│   └── pom.xml
├── RUN_INSTRUCTIONS.md      # This file
├── SUBMISSION.md
├── UI_UX_AUDIT.md
└── DEMO_SCRIPT.md
```

---

## 💡 Tips

- **Development**: Keep both terminals visible to monitor logs
- **Performance**: Chrome DevTools → Performance tab to verify 60 FPS
- **Debugging**: Enable DEBUG logging in application.properties
- **Testing**: Use headphones to prevent audio feedback
- **Network**: Both services run locally, no internet needed (except Gemini API)

---

## 📞 Support

If you encounter issues:

1. **Check logs** in both frontend (browser console) and backend (terminal)
2. **Verify prerequisites** are installed correctly
3. **Review troubleshooting** section above
4. **Test incrementally**: Backend first, then frontend, then integration

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Compatible**: Spring Boot 3.2.5, React 18, Node 18+, Java 17+
