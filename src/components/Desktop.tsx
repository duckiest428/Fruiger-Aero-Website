import { useWindows } from '../contexts/WindowContext';
import { PlayCircle, Image, Settings as SettingsIcon } from 'lucide-react';
import { MediaPlayer } from '../apps/MediaPlayer';
import { Gallery } from '../apps/Gallery';
import { ClockWidget } from '../widgets/ClockWidget';
import { FishTankWidget } from '../widgets/FishTankWidget';
import { useEffect, useState } from 'react';

export function Desktop() {
  const { openWindow } = useWindows();
  const [bubbles, setBubbles] = useState<{ id: number, left: string, size: string, delay: string, duration: string }[]>([]);

  useEffect(() => {
    // Generate random bubbles
    const newBubbles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 40 + 10}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 5}s`
    }));
    setBubbles(newBubbles);
  }, []);

  const apps = [
    { id: 'media', title: 'Media Player', icon: <PlayCircle size={32} color="#fff" />, component: <MediaPlayer />, width: 400, height: 400 },
    { id: 'gallery', title: 'Aero Gallery', icon: <Image size={32} color="#fff" />, component: <Gallery />, width: 600, height: 450 },
  ];

  return (
    <div className="absolute inset-0 p-4 flex flex-col gap-4 overflow-hidden z-0">
      {/* Background Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {bubbles.map(b => (
          <div 
            key={b.id} 
            className="bubble" 
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
        <FishTankWidget />
      </div>
    </div>
  );
}
