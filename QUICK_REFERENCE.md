# Quick Reference - Sound Audio Visualizer

## 🚀 First Time Setup

```bash
# Automated setup (recommended)
./setup.sh          # Unix/Linux/macOS
setup.bat           # Windows

# Manual setup
cd backend && mvn clean install && cd ..
cd frontend && npm install && cd ..
```

## ▶️ Start Application

```bash
# Terminal 1: Backend
cd backend
mvn spring-boot:run

# Terminal 2: Frontend  
cd frontend
npm run dev

# Browser
http://localhost:5173
```

## 🛑 Stop Application

- Press `Ctrl+C` in each terminal

## 🔑 Enable Real Transcription

```bash
# macOS/Linux
export GEMINI_API_KEY="your_key_here"

# Windows (PowerShell)
$env:GEMINI_API_KEY="your_key_here"

# Windows (CMD)
set GEMINI_API_KEY=your_key_here
```

## 🔧 Common Commands

### Backend

```bash
cd backend

# Start server
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn clean package

# Clean build
mvn clean install
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process on port (macOS/Linux)
lsof -i :8080    # Backend
lsof -i :5173    # Frontend

# Kill process
kill -9 <PID>
```

### Clear Cache

```bash
# Maven
rm -rf ~/.m2/repository

# npm
npm cache clean --force
rm -rf node_modules
npm install
```

### Check Versions

```bash
node --version   # Need v18+
java -version    # Need 17+
mvn --version    # Need 3.6+
```

## 📁 Important Files

```
setup.sh                # Automated setup (Unix)
setup.bat               # Automated setup (Windows)
GETTING_STARTED.md      # Detailed setup guide
RUN_INSTRUCTIONS.md     # Complete running guide
README.md               # Project overview
```

## 🎮 Using the App

1. Open http://localhost:5173
2. Click "🎤 Start Recording"
3. Allow microphone access
4. Speak to see visualizer react
5. View transcription in text area
6. Click "Clear" to remove transcript
7. Click "⏹ Stop Recording" to stop

## 🔥 Quick Restart

```bash
# If something goes wrong, restart everything:
# 1. Stop both terminals (Ctrl+C)
# 2. Restart backend: cd backend && mvn spring-boot:run
# 3. Restart frontend: cd frontend && npm run dev
# 4. Refresh browser (Ctrl+R or F5)
```

## 🆘 Get Help

- **Browser Console**: F12 → Console tab
- **Backend Logs**: Check Terminal 1
- **Frontend Logs**: Check Terminal 2 & Browser Console
- **Documentation**: See GETTING_STARTED.md or RUN_INSTRUCTIONS.md

## 💡 Pro Tips

✅ Keep both terminals visible  
✅ Use headphones to prevent feedback  
✅ Grant microphone permissions  
✅ Start backend before frontend  
✅ Check browser console for errors  

---

**Need detailed help?** → [GETTING_STARTED.md](./GETTING_STARTED.md)  
**Troubleshooting?** → [RUN_INSTRUCTIONS.md](./RUN_INSTRUCTIONS.md)
