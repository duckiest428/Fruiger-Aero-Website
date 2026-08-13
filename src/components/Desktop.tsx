import { useWindows } from '../contexts/WindowContext';
import { PlayCircle, Image, Settings as SettingsIcon } from 'lucide-react';
import { MediaPlayer } from '../apps/MediaPlayer';
import { Gallery } from '../apps/Gallery';
import { ClockWidget } from '../widgets/ClockWidget';
import { FishTankWidget } from '../widgets/FishTankWidget';
import { useEffect, useState } from 'react';
import { WeatherWidget } from '../widgets/WeatherWidget';

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
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 40%)',
        opacity: 0.8
      }} />

      {/* Tropical Grass / Flora overlay */}
      <div className="absolute bottom-10 left-0 right-0 h-32 pointer-events-none opacity-40 flex justify-around items-end" style={{ filter: 'blur(2px)' }}>
         <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
           <path d="M10 100 Q 20 50 15 0 Q 30 50 20 100 Z" fill="rgba(100, 200, 150, 0.3)" />
           <path d="M30 100 Q 40 40 45 10 Q 50 60 40 100 Z" fill="rgba(50, 180, 120, 0.4)" />
           <path d="M60 100 Q 75 30 80 5 Q 90 40 70 100 Z" fill="rgba(80, 220, 160, 0.3)" />
           <path d="M85 100 Q 95 60 90 20 Q 98 70 95 100 Z" fill="rgba(100, 200, 150, 0.4)" />
         </svg>
      </div>

      {/* Background Bubbles */}
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
      <div className="flex flex-col gap-6 z-10 w-24">
        {apps.map(app => (
          <button 
            key={app.id} 
            className="flex flex-col items-center gap-2 group hover:bg-white/20 p-2 rounded-xl transition-all"
            onClick={(e) => { e.stopPropagation(); openWindow(app); }}
          >
            <div className="w-16 h-16 rounded-2xl aero-container flex items-center justify-center group-hover:scale-110 transition-transform relative overflow-hidden border-white/50 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>
                {app.icon}
            </div>
            <span className="text-white drop-shadow-md font-medium text-sm text-center px-1 rounded shadow-black">{app.title}</span>
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
