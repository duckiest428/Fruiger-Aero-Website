import { useEffect, useState, useRef } from 'react';

export function FishTankWidget() {
  const [fishPos, setFishPos] = useState({ x: 50, y: 50 });
  const [foodFlakes, setFoodFlakes] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isFacingLeft, setIsFacingLeft] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef({ x: 50, y: 50 });
  const foodFlakesRef = useRef<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mousePosRef.current = { x, y };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    foodFlakesRef.current = foodFlakes;
  }, [foodFlakes]);

  useEffect(() => {
    let animationFrameId: number;
    let currentFishPos = { x: 50, y: 50 };

    const updatePhysics = () => {
      // 1. Move food down
      if (foodFlakesRef.current.length > 0) {
        setFoodFlakes(prev => {
          const next = prev.map(f => ({ ...f, y: f.y + 0.3 })).filter(f => f.y < 110);
          
          // Check collision with fish
          const remaining = next.filter(f => {
            const dx = f.x - currentFishPos.x;
            const dy = f.y - currentFishPos.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            return dist > 10; // eat distance
          });
          return remaining;
        });
      }

      // 2. Move fish
      setFishPos(prev => {
        let targetX = mousePosRef.current.x;
        let targetY = mousePosRef.current.y;

        // If there's food, target the oldest food
        if (foodFlakesRef.current.length > 0) {
           const targetFood = foodFlakesRef.current[0];
           targetX = targetFood.x;
           targetY = targetFood.y;
        }

        const tx = Math.max(10, Math.min(90, targetX));
        const ty = Math.max(10, Math.min(90, targetY));
        
        const dx = tx - prev.x;
        const dy = ty - prev.y;
        
        const nextX = prev.x + dx * 0.05;
        const nextY = prev.y + dy * 0.05;
        
        if (nextX < prev.x) setIsFacingLeft(true);
        if (nextX > prev.x) setIsFacingLeft(false);

        currentFishPos = { x: nextX, y: nextY };
        return currentFishPos;
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };
    updatePhysics();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setFoodFlakes(prev => [...prev, { id: Date.now(), x, y: 0 }]);
  };

  return (
    <div 
      ref={containerRef} 
      onDoubleClick={handleDoubleClick}
      className="w-40 h-40 rounded-2xl aero-container relative overflow-hidden border-[4px] border-white/60 shadow-[0_15px_30px_rgba(0,0,0,0.4),inset_0_5px_15px_rgba(0,150,255,0.4)] cursor-pointer group hover:scale-105 transition-transform bg-cyan-400/30 animate-float"
      style={{ animationDelay: '1s' }}
    >
      {/* Water background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/40 via-blue-500/50 to-blue-800/70"></div>
      
      {/* Gloss overlay */}
      <div className="absolute inset-x-2 top-2 bg-gradient-to-br from-white/90 to-transparent h-[40%] pointer-events-none rounded-t-xl z-20"></div>

      {/* Fish */}
      <div 
        className="absolute w-10 h-8 flex items-center justify-center transition-transform duration-200 z-10"
        style={{ 
          left: `${fishPos.x}%`, 
          top: `${fishPos.y}%`,
          transform: `translate(-50%, -50%) scaleX(${isFacingLeft ? -1 : 1})`
        }}
      >
        <span className="text-4xl drop-shadow-[2px_4px_4px_rgba(0,0,0,0.6)]">🐠</span>
      </div>

      {/* Food Flakes */}
      {foodFlakes.map(f => (
        <div 
          key={f.id} 
          className="absolute w-2 h-2 bg-orange-400/90 rounded-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] z-10 animate-[spin_3s_linear_infinite]"
          style={{ left: `${f.x}%`, top: `${f.y}%`, transform: 'translate(-50%, -50%)' }}
        ></div>
      ))}

      {/* Bubbles in tank */}
      <div className="absolute bottom-0 left-4 w-2 h-2 bg-white/80 rounded-full animate-float shadow-[0_0_5px_white]" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-2 right-8 w-3 h-3 bg-white/80 rounded-full animate-float shadow-[0_0_5px_white]" style={{ animationDuration: '2.5s', animationDelay: '1s' }}></div>
      <div className="absolute bottom-4 left-10 w-1.5 h-1.5 bg-white/80 rounded-full animate-float shadow-[0_0_5px_white]" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
      
      {/* Hint */}
      <div className="absolute bottom-1 w-full text-center text-[10px] font-bold text-white/70 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none drop-shadow-md z-30">
        Double click to feed
      </div>
    </div>
  );
}
