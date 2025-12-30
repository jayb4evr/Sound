import { useEffect, useRef } from 'react';

interface CircularEqualizerProps {
  frequencyData: Uint8Array | null;
  isRecording: boolean;
}

/**
 * Circular equalizer rendering 64 frequency bars on Canvas at 60 FPS
 * Optimized rendering using refs to avoid unnecessary re-renders
 */
export function CircularEqualizer({ frequencyData, isRecording }: CircularEqualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const centerX = WIDTH / 2;
    const centerY = HEIGHT / 2;
    const barCount = 64; // 64 frequency bars
    const radius = 80; // Inner radius
    const maxBarHeight = 150; // Maximum bar length

    const draw = () => {
      // Clear canvas with dark background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      if (frequencyData && isRecording) {
        // Draw circular visualizer
        for (let i = 0; i < barCount; i++) {
          const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2; // Start from top
          
          // Get frequency data for this bar (map 64 bars to available frequency bins)
          const dataIndex = Math.floor((i / barCount) * frequencyData.length);
          const barHeight = (frequencyData[dataIndex] / 255) * maxBarHeight;

          // Calculate positions
          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle) * (radius + barHeight);
          const y2 = centerY + Math.sin(angle) * (radius + barHeight);

          // Create gradient for each bar
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
          const hue = (i / barCount) * 360;
          gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
          gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 100%, 70%)`);

          // Draw radial bar
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
      
      // Neumorphic center
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius - 5);
      gradient.addColorStop(0, '#1a1a1a');
      gradient.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Border
      ctx.strokeStyle = isRecording ? '#00ff88' : '#555555';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Recording indicator in center
      if (isRecording) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff88';
        ctx.fill();
        
        // Pulse effect
        const time = Date.now() / 1000;
        const pulseRadius = 8 + Math.sin(time * 3) * 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [frequencyData, isRecording]);

  return (
    <div className="flex flex-col items-center gap-6">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="rounded-xl bg-bg-secondary shadow-neumorphic border-2 border-bg-tertiary transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,255,136,0.2)]"
      />
    </div>
  );
}
