import { useEffect, useState, useRef } from 'react';

export function FishTankWidget() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [fishPos, setFishPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const moveFish = () => {
      setFishPos(prev => {
        // Keep fish somewhat inside the tank
        const targetX = Math.max(10, Math.min(90, mousePos.x));
        const targetY = Math.max(10, Math.min(90, mousePos.y));
        
        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        return {
          x: prev.x + dx * 0.03,
          y: prev.y + dy * 0.03,
        };
      });
      animationFrameId = requestAnimationFrame(moveFish);
    };
    moveFish();
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);

  const isFacingLeft = mousePos.x < fishPos.x;

  return (
    <div ref={containerRef} className="w-36 h-36 rounded-2xl aero-container relative overflow-hidden border border-blue-300/50 shadow-lg cursor-pointer group hover:scale-105 transition-transform bg-blue-400/20">
      {/* Water background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-200/40 to-blue-600/60"></div>
      
      {/* Gloss overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-transparent h-[45%] pointer-events-none rounded-t-2xl z-10"></div>

      {/* Fish */}
      <div 
        className="absolute w-8 h-6 flex items-center justify-center transition-transform duration-[300ms]"
        style={{ 
          left: `${fishPos.x}%`, 
          top: `${fishPos.y}%`,
          transform: `translate(-50%, -50%) scaleX(${isFacingLeft ? -1 : 1})`
        }}
      >
        <span className="text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">🐠</span>
      </div>

      {/* Bubbles in tank */}
      <div className="absolute bottom-0 left-4 w-1.5 h-1.5 bg-white/80 rounded-full animate-float shadow-[0_0_5px_white]" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-2 right-8 w-2 h-2 bg-white/80 rounded-full animate-float shadow-[0_0_5px_white]" style={{ animationDuration: '2.5s', animationDelay: '1s' }}></div>
      <div className="absolute bottom-4 left-10 w-1 h-1 bg-white/80 rounded-full animate-float shadow-[0_0_5px_white]" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
    </div>
  );
}
