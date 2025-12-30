# Getting Started with Sound - Audio Visualizer

This guide will help you initialize and run the Sound Audio Visualizer & Transcription System from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify installation: `node --version`
   - Should show v18.x.x or higher

2. **Java JDK** (17 or higher)
   - Download: https://adoptium.net/
   - Verify installation: `java -version`
   - Should show version 17 or higher

3. **Maven** (3.6 or higher)
   - Download: https://maven.apache.org/download.cgi
   - Verify installation: `mvn --version`
   - Should show Apache Maven 3.6.x or higher

4. **Modern Web Browser**
   - Chrome, Firefox, Edge, or Safari (latest version)
   - Must support Web Audio API and WebSocket

### Optional

- **Gemini API Key** - For real AI-powered transcription (works in simulated mode without it)

---

## 🚀 Quick Start (Automated Setup)

We provide automated setup scripts that will check your prerequisites and install all dependencies.

### Option 1: Unix/Linux/macOS

```bash
# Navigate to the project directory
cd Sound

# Run the setup script
./setup.sh
```

### Option 2: Windows

```batch
# Navigate to the project directory
cd Sound

# Run the setup script
setup.bat
```

The setup script will:
- ✅ Check all prerequisites are installed
- ✅ Install backend dependencies (Maven)
- ✅ Install frontend dependencies (npm)
- ✅ Verify everything is ready to run

---

## 🔧 Manual Setup (Alternative)

If you prefer to set up manually or the automated script doesn't work:

### Step 1: Clone the Repository

```bash
# If you haven't already
git clone https://github.com/jayb4evr/Sound.git
cd Sound
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies and compile
mvn clean install

# This will:
# - Download all required Java dependencies
# - Compile the Spring Boot application
# - Run tests (optional: add -DskipTests to skip)
```

Expected output:
```
[INFO] BUILD SUCCESS
[INFO] Total time: 30-60 seconds
```

### Step 3: Setup Frontend

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# This will:
# - Download all required npm packages
# - Setup React and Vite development environment
```

Expected output:
```
added 200+ packages in 30s
```

---

## ▶️ Running the Application

After setup is complete, you need to run both the backend and frontend simultaneously.

### Terminal 1: Start Backend

```bash
# From the backend directory
cd backend
mvn spring-boot:run
```

**Wait for this message:**
```
Started AudioVisualizerApplication in X seconds
```

The backend will be running at: **http://localhost:8080**

### Terminal 2: Start Frontend

```bash
# From the frontend directory
cd frontend
npm run dev
```

**Wait for this message:**
```
Local: http://localhost:5173/
```

The frontend will be running at: **http://localhost:5173**

### Access the Application

Open your web browser and navigate to:
```
http://localhost:5173
```

---

## 🎤 Using the Application

### First Time Setup

1. **Open the app** in your browser (http://localhost:5173)
2. **Click "🎤 Start Recording"** button
3. **Allow microphone access** when prompted by your browser
4. **Start speaking** to see the visualizer react!

### What You Should See

- ✅ **Status Indicator**: Changes from "Disconnected" to "Connected" (green)
- ✅ **Visualizer**: Circular animation with colored bars pulsing to your voice
- ✅ **Transcription**: Text appearing in the transcript area (simulated or real)

### Features to Try

1. **Speak at different volumes** - Watch the bars extend and contract
2. **Change your pitch** - Different frequencies light up different bars
3. **Click "Clear"** - Removes all transcript text
4. **Click "⏹ Stop Recording"** - Stops the audio capture

---

## 🔑 Optional: Enable Real Transcription

By default, the app runs in **simulated mode** with demo transcription. To enable real AI transcription:

### Get a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

### Set the API Key

**macOS/Linux:**
```bash
export GEMINI_API_KEY="your_actual_api_key_here"
```

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your_actual_api_key_here"
```

**Windows (CMD):**
```cmd
set GEMINI_API_KEY=your_actual_api_key_here
```

### Restart Backend

After setting the API key, restart the backend:
```bash
cd backend
mvn spring-boot:run
```

You should see in the logs:
```
INFO GeminiLiveClient - Gemini API configured
```

---

## 🐛 Troubleshooting

### Prerequisites Not Installed

**Error**: Command not found: `node`, `java`, or `mvn`

**Solution**: Install the missing prerequisite from the links in the Prerequisites section above.

---

### Port Already in Use

**Error**: `Port 8080 already in use` or `Port 5173 already in use`

**Solution**:
```bash
# Find what's using the port (macOS/Linux)
lsof -i :8080
lsof -i :5173

# Kill the process
kill -9 <PID>

# Windows: Use Task Manager to end the process
```

---

### Backend Build Fails

**Error**: Maven build fails

**Solutions**:
1. Check Java version: `java -version` (must be 17+)
2. Check Maven version: `mvn --version` (must be 3.6+)
3. Clear Maven cache: `rm -rf ~/.m2/repository`
4. Try again: `mvn clean install`

---

### Frontend Install Fails

**Error**: npm install fails

**Solutions**:
1. Check Node.js version: `node --version` (must be 18+)
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules: `rm -rf node_modules`
4. Try again: `npm install`

---

### Microphone Not Working

**Error**: "Microphone access denied" or no visualizer animation

**Solutions**:
1. **Check browser permissions**: 
   - Chrome: Settings → Privacy and Security → Site Settings → Microphone
   - Firefox: about:preferences#privacy → Permissions → Microphone
2. **Check system permissions**:
   - macOS: System Settings → Privacy & Security → Microphone
   - Windows: Settings → Privacy → Microphone
3. **Try HTTPS**: Some browsers require secure context
4. **Try different browser**: Test in Chrome or Firefox

---

### WebSocket Connection Error

**Error**: "WebSocket connection failed" or status shows "Disconnected"

**Check**:
1. ✅ Backend is running: Open http://localhost:8080 in browser
2. ✅ Check backend terminal for errors
3. ✅ Check browser console (F12) for error messages

**Solution**: Ensure backend started successfully before starting frontend

---

## 📁 Project Structure

Understanding the project layout:

```
Sound/
├── backend/                  # Spring Boot backend
│   ├── src/
│   │   ├── main/java/       # Java source code
│   │   └── resources/       # Configuration files
│   └── pom.xml              # Maven dependencies
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── App.jsx          # Main component
│   │   └── App.css          # Styles
│   ├── package.json         # npm dependencies
│   └── vite.config.js       # Vite configuration
├── setup.sh                  # Unix/Linux/macOS setup script
├── setup.bat                 # Windows setup script
├── GETTING_STARTED.md        # This file
├── RUN_INSTRUCTIONS.md       # Detailed running instructions
└── README.md                 # Project overview
```

---

## 📚 Next Steps

After getting the app running:

1. **Read [RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md)** for detailed usage instructions
2. **Review [SUBMISSION.md](./SUBMISSION.md)** for project details
3. **Check [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)** for demonstration guide
4. **Explore the code** to understand how it works

---

## 💡 Tips for Success

- ✅ **Keep both terminals open** to monitor backend and frontend logs
- ✅ **Use headphones** to prevent audio feedback loops
- ✅ **Grant microphone permissions** when prompted
- ✅ **Check the browser console** (F12) if something isn't working
- ✅ **Start backend first**, then frontend
- ✅ **Read error messages carefully** - they usually indicate the problem

---

## 🎯 Quick Reference

### Start Everything

```bash
# Terminal 1
cd backend && mvn spring-boot:run

# Terminal 2
cd frontend && npm run dev

# Browser
# Open http://localhost:5173
```

### Stop Everything

- Backend: Press `Ctrl+C` in Terminal 1
- Frontend: Press `Ctrl+C` in Terminal 2

### Restart After Code Changes

- Backend: Stop and restart `mvn spring-boot:run`
- Frontend: Vite auto-reloads, no restart needed

---

## 📞 Need Help?

If you encounter issues:

1. **Check this guide** for common solutions
2. **Review [RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md)** for detailed troubleshooting
3. **Check browser console** (F12) for error messages
4. **Check terminal logs** for backend errors
5. **Verify prerequisites** are correctly installed

---

**Happy Visualizing! 🎵✨**

*Last Updated: December 2025*  
*Version: 1.0.0*
