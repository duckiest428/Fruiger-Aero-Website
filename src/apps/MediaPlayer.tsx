import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export function MediaPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 1));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-gray-200">
      {/* Top area */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-6">
        {/* Fake visualizer */}
        <div className="w-[80%] h-32 aero-container bg-black/80 flex items-end justify-center gap-1.5 p-3 rounded-2xl border border-gray-500 shadow-inner overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none h-1/3"></div>
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i} 
                className="w-full bg-gradient-to-t from-green-400 via-yellow-400 to-blue-500 rounded-t-sm transition-all duration-[200ms] shadow-[0_0_8px_rgba(0,255,255,0.5)]"
                style={{ height: isPlaying ? `${Math.random() * 80 + 10}%` : '10%' }}
              ></div>
            ))}
        </div>
        <div className="mt-6 text-center">
           <h3 className="font-bold text-gray-800 text-xl drop-shadow-sm">Aero Symphony.mp3</h3>
           <p className="text-gray-500 text-sm font-medium">Frutiger Aero Soundscapes</p>
        </div>
      </div>

      {/* Controls */}
      <div className="h-28 bg-gradient-to-b from-gray-200 to-gray-300 border-t border-white shadow-inner flex flex-col p-2">
        {/* Progress bar */}
        <div className="h-2.5 bg-gray-400/80 rounded-full mx-6 mt-2 overflow-hidden shadow-inner border border-gray-500/50">
           <div className="h-full bg-gradient-to-r from-blue-400 to-blue-300 shadow-[0_0_5px_blue] transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="flex items-center justify-between px-10 flex-1 mt-2">
          <button className="w-10 h-10 rounded-full aero-button flex items-center justify-center text-gray-700 shadow-md hover:scale-105 transition-transform">
            <SkipBack size={18} fill="currentColor" />
          </button>
          
          <button 
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg border border-white/60 bg-gradient-to-b from-blue-400 to-blue-600 hover:brightness-110 active:scale-95 transition-all relative overflow-hidden"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-1/2 pointer-events-none"></div>
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          
          <button className="w-10 h-10 rounded-full aero-button flex items-center justify-center text-gray-700 shadow-md hover:scale-105 transition-transform">
            <SkipForward size={18} fill="currentColor" />
          </button>
          
          <div className="flex items-center gap-2 ml-6">
            <Volume2 size={18} className="text-gray-600 drop-shadow-sm" />
            <div className="w-24 h-2.5 bg-gray-400/80 rounded-full shadow-inner border border-gray-500/50 overflow-hidden cursor-pointer">
                <div className="h-full w-[70%] bg-gradient-to-r from-green-400 to-green-300 shadow-[0_0_5px_green]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
