import { useEffect, useRef } from 'react';

interface CircularEqualizerProps {
  frequencyData: Uint8Array | null;
  isActive: boolean;
}

/**
 * Circular Audio Equalizer Component
 * Renders 64 frequency bars in a perfect circle using SVG
 * 60fps animations with requestAnimationFrame
 */
export function CircularEqualizer({ frequencyData, isActive }: CircularEqualizerProps) {
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
    const innerRadius = 100;
    const maxBarHeight = 180;

    const draw = () => {
      // Clear canvas with dark background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      if (!frequencyData || !isActive) {
        // Draw static circle when inactive
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      const barCount = frequencyData.length;

      // Draw frequency bars
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2; // Start from top
        const barHeight = (frequencyData[i] / 255) * maxBarHeight;

        // Calculate positions
        const x1 = centerX + Math.cos(angle) * innerRadius;
        const y1 = centerY + Math.sin(angle) * innerRadius;
        const x2 = centerX + Math.cos(angle) * (innerRadius + barHeight);
        const y2 = centerY + Math.sin(angle) * (innerRadius + barHeight);

        // Create gradient based on frequency
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        const hue = (i / barCount) * 360;
        const intensity = frequencyData[i] / 255;
        gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.8)`);
        gradient.addColorStop(1, `hsla(${hue + 60}, 100%, 70%, ${intensity})`);

        // Draw bar with glow effect
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Reset shadow
      ctx.shadowBlur = 0;

      // Draw center circle with neumorphic effect
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius - 10, 0, Math.PI * 2);
      ctx.fillStyle = '#141414';
      ctx.fill();
      
      // Inner glow
      const innerGlow = ctx.createRadialGradient(
        centerX, centerY, innerRadius - 20,
        centerX, centerY, innerRadius - 10
      );
      innerGlow.addColorStop(0, 'rgba(0, 255, 136, 0)');
      innerGlow.addColorStop(1, 'rgba(0, 255, 136, 0.3)');
      ctx.fillStyle = innerGlow;
      ctx.fill();

      // Outer ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius - 5, 0, Math.PI * 2);
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Request next frame
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    // Start animation loop
    draw();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [frequencyData, isActive]);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="rounded-full shadow-neumorphic"
        />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <p className="text-sm">Click Start to begin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
