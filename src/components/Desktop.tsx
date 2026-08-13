import { useWindows } from '../contexts/WindowContext';
import { PlayCircle, Image, Settings as SettingsIcon } from 'lucide-react';
import { MediaPlayer } from '../apps/MediaPlayer';
import { Gallery } from '../apps/Gallery';
import { ClockWidget } from '../widgets/ClockWidget';
import { FishTankWidget } from '../widgets/FishTankWidget';
import { useEffect, useState } from 'react';
import { WeatherWidget } from '../widgets/WeatherWidget';
import { WaterRippleCanvas } from './WaterRippleCanvas';

export function Desktop({ playSound }: { playSound?: (type: 'pop') => void }) {
  const { openWindow } = useWindows();
  const [bubbles, setBubbles] = useState<{ id: number, left: string, size: string, delay: string, duration: string, popped: boolean }[]>([]);

  useEffect(() => {
    // Generate random bubbles
    const newBubbles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 40 + 10}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 5}s`,
      popped: false
    }));
    setBubbles(newBubbles);
  }, []);

  const handleBubbleClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (playSound) playSound('pop');
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    
    setTimeout(() => {
      setBubbles(prev => prev.map(b => b.id === id ? { 
        ...b, 
        popped: false,
        left: `${Math.random() * 100}%`,
        delay: '0s'
      } : b));
    }, 200);
  };

  const apps = [
    { id: 'media', title: 'Media Player', icon: <PlayCircle size={32} color="#fff" />, component: <MediaPlayer />, width: 400, height: 400 },
    { id: 'gallery', title: 'Aero Gallery', icon: <Image size={32} color="#fff" />, component: <Gallery />, width: 600, height: 450 },
  ];

  return (
    <div className="absolute inset-0 p-4 flex flex-col gap-4 overflow-hidden z-0">
      
      {/* Sunburst & Lens Flare overlay */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse at 10% 10%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 220, 0.4) 20%, transparent 60%)',
        opacity: 0.9
      }}>
        {/* Light shafts */}
        <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] pointer-events-none" style={{
          background: 'conic-gradient(from 120deg at 10% 10%, transparent 0deg, rgba(255,255,255,0.2) 20deg, transparent 40deg, rgba(255,255,255,0.15) 60deg, transparent 80deg)'
        }}></div>
      </div>

      {/* Aurora Borealis light rays */}
      <div className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none z-0 overflow-hidden">
         <div className="absolute bottom-[-20%] left-[-10%] w-[120%] h-full" style={{
           background: 'linear-gradient(to top, rgba(100, 250, 150, 0.4) 0%, transparent 100%)',
           transform: 'rotate(-15deg)',
           filter: 'blur(20px)'
         }}></div>
         <div className="absolute bottom-[-10%] left-[20%] w-[80%] h-full" style={{
           background: 'linear-gradient(to top, rgba(50, 200, 255, 0.3) 0%, transparent 100%)',
           transform: 'rotate(10deg)',
           filter: 'blur(30px)'
         }}></div>
      </div>

      {/* Tropical Grass / Flora overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none opacity-50 flex justify-around items-end z-0" style={{ filter: 'blur(1px)' }}>
         <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" preserveAspectRatio="none">
           {/* Glossy grass blades */}
           <path d="M5 100 Q 15 40 10 0 Q 25 50 15 100 Z" fill="url(#grassGrad1)" />
           <path d="M25 100 Q 35 30 40 10 Q 45 50 35 100 Z" fill="url(#grassGrad2)" />
           <path d="M55 100 Q 70 20 75 5 Q 85 30 65 100 Z" fill="url(#grassGrad1)" />
           <path d="M80 100 Q 90 50 85 20 Q 95 60 90 100 Z" fill="url(#grassGrad2)" />
           <defs>
             <linearGradient id="grassGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
               <stop offset="30%" stopColor="rgba(100, 250, 150, 0.5)" />
               <stop offset="100%" stopColor="rgba(20, 100, 50, 0.8)" />
             </linearGradient>
             <linearGradient id="grassGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stopColor="rgba(200,255,200,0.6)" />
               <stop offset="40%" stopColor="rgba(50, 200, 120, 0.5)" />
               <stop offset="100%" stopColor="rgba(10, 80, 40, 0.8)" />
             </linearGradient>
           </defs>
         </svg>
      </div>

      {/* Background Bubbles */}
      <WaterRippleCanvas />
      
      <div className="absolute inset-0 pointer-events-none">
        {bubbles.map(b => (
          <div 
            key={b.id} 
            className={`bubble ${b.popped ? 'popped' : ''} pointer-events-auto`}
            onClick={(e) => handleBubbleClick(e, b.id)}
            style={{ 
              left: b.left, 
              width: b.size, 
              height: b.size, 
              animationDelay: b.delay,
              animationDuration: b.duration 
            }} 
          />
        ))}
      </div>

      {/* Desktop Icons */}
      <div className="flex flex-col gap-6 z-10 w-28 mt-4 ml-2">
        {apps.map(app => (
          <button 
            key={app.id} 
            className="flex flex-col items-center gap-2 group p-2 rounded-xl transition-all relative border border-transparent hover:border-white/40 hover:bg-white/20 hover:backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); openWindow(app); }}
          >
            <div className="w-16 h-16 rounded-full aero-container flex items-center justify-center group-hover:scale-105 transition-transform relative overflow-hidden border-white/60 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent h-1/2 pointer-events-none"></div>
                {app.icon}
            </div>
            <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] font-semibold text-sm text-center px-1 rounded">{app.title}</span>
          </button>
        ))}
      </div>

      {/* Widgets on the right side */}
      <div className="absolute right-8 top-8 flex flex-col gap-8 z-10">
        <ClockWidget />
        <WeatherWidget />
        <FishTankWidget />
      </div>
    </div>
  );
}
