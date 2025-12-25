import { useEffect, useRef, useState } from 'react';

function App() {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const wsRef = useRef(null);
  const animationFrameRef = useRef(null);
  const dataArrayRef = useRef(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  // Initialize WebSocket connection
  const connectWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:8080/audio');
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError('');
      };
      
      ws.onmessage = (event) => {
        // Receive transcript from backend
        const message = event.data;
        setTranscript((prev) => prev + message);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
        setIsConnected(false);
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };
      
      wsRef.current = ws;
    } catch (err) {
      setError('Failed to connect to WebSocket: ' + err.message);
    }
  };

  // Initialize Audio Context and Analyser
  const initAudioContext = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create Audio Context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      // Create Analyser Node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Initialize data array for frequency data
      const bufferLength = analyser.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      // Setup MediaRecorder for sending audio data
      // Check for browser support and use appropriate MIME type
      let options = { mimeType: 'audio/webm;codecs=opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'audio/webm' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'audio/mp4' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = {};
      }
      const mediaRecorder = new MediaRecorder(stream, options);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          // Send binary audio chunks to backend
          event.data.arrayBuffer().then(buffer => {
            wsRef.current.send(buffer);
          });
        }
      };
      
      mediaRecorderRef.current = mediaRecorder;
      
      // Start recording with 100ms chunks
      mediaRecorder.start(100);
      setIsRecording(true);
      
      // Start visualization
      drawVisualizer();
      
    } catch (err) {
      setError('Microphone access denied: ' + err.message);
      console.error('Error accessing microphone:', err);
    }
  };

  // Draw circular visualizer with radial bars
  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    
    if (!analyser || !dataArray) return;
    
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const centerX = WIDTH / 2;
    const centerY = HEIGHT / 2;
    
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      
      // Get frequency data
      analyser.getByteFrequencyData(dataArray);
      
      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      
      // Draw circular visualizer
      const barCount = dataArray.length;
      const radius = 80; // Inner radius
      const maxBarHeight = 150; // Maximum bar length
      
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2;
        const barHeight = (dataArray[i] / 255) * maxBarHeight;
        
        // Calculate positions
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);
        
        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        const hue = (i / barCount) * 360;
        gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${hue + 60}, 100%, 70%)`);
        
        // Draw radial bar
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
      ctx.fill();
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    
    draw();
  };

  // Start recording handler
  const handleStart = () => {
    connectWebSocket();
    // Wait for WebSocket to connect before initializing audio
    const checkConnection = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        clearInterval(checkConnection);
        initAudioContext();
      }
    }, 100);
    
    // Fallback timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkConnection);
      if (wsRef.current && wsRef.current.readyState !== WebSocket.OPEN) {
        setError('WebSocket connection timeout. Starting without transcription.');
        initAudioContext();
      }
    }, 5000);
  };

  // Stop recording handler
  const handleStop = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  // Clear transcript
  const handleClearTranscript = () => {
    setTranscript('');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>🎵 Audio Visualizer & Transcription</h1>
        <p className="subtitle">Real-time audio visualization with live transcription</p>
      </header>

      <main className="main">
        <div className="visualizer-container">
          <canvas 
            ref={canvasRef} 
            width={500} 
            height={500}
            className="visualizer-canvas"
          />
          <div className="status-indicator">
            <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
            <span className="status-text">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="controls">
          {!isRecording ? (
            <button onClick={handleStart} className="btn btn-start">
              🎤 Start Recording
            </button>
          ) : (
            <button onClick={handleStop} className="btn btn-stop">
              ⏹ Stop Recording
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="transcript-container">
          <div className="transcript-header">
            <h2>Live Transcript</h2>
            <button onClick={handleClearTranscript} className="btn btn-clear">
              Clear
            </button>
          </div>
          <div className="transcript-content">
            {transcript || 'Transcript will appear here...'}
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Built with React + Web Audio API + WebSocket</p>
      </footer>
    </div>
  );
}

export default App;
