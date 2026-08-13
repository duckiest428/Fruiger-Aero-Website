import React, { useRef, useEffect } from 'react';

export function WaterRippleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ripples: { x: number, y: number, radius: number, alpha: number }[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        
        // Skeuomorphic glass/water ripple shading
        ctx.lineWidth = 3;
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.8})`;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius - 8, 0, Math.PI * 2);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = `rgba(0, 150, 255, ${r.alpha * 0.4})`;
        ctx.stroke();
        
        r.radius += 4;
        r.alpha -= 0.015;

        if (r.alpha <= 0) {
          ripples.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        alpha: 1
      });
    };

    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousedown', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0" 
    />
  );
}
