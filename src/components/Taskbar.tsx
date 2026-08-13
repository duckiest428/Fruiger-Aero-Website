import { useWindows } from '../contexts/WindowContext';
import { Volume2, Wifi, Battery } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Taskbar({ startMenuOpen, toggleStartMenu }: { startMenuOpen: boolean, toggleStartMenu: () => void }) {
  const { windows, focusWindow } = useWindows();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 aero-container !rounded-none !border-l-0 !border-r-0 !border-b-0 flex items-center px-2 z-50 justify-between bg-white/30 backdrop-blur-xl">
      
      <div className="flex items-center gap-2 h-full">
        {/* Start Button */}
        <button 
          className="relative w-10 h-10 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 border-2 border-white/50 shadow-[0_0_15px_rgba(0,150,255,0.6)] flex items-center justify-center hover:brightness-110 active:scale-95 transition-all group overflow-hidden"
          onClick={(e) => { e.stopPropagation(); toggleStartMenu(); }}
        >
           <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent h-[45%] rounded-t-full pointer-events-none"></div>
           <div className="w-4 h-4 bg-white rounded-sm rotate-45 shadow-[0_0_10px_white] z-10 group-hover:animate-pulse"></div>
        </button>

        {/* Open Windows */}
        <div className="flex gap-1 h-full py-1 ml-2">
          {windows.map(win => (
            <button
              key={win.id}
              onClick={(e) => { e.stopPropagation(); focusWindow(win.id); }}
              className={`px-3 h-full rounded-md flex items-center gap-2 transition-all border border-white/30 hover:bg-white/40 
                ${!win.isMinimized && win.zIndex === Math.max(...windows.map(w=>w.zIndex)) ? 'bg-white/60 shadow-inner' : 'bg-white/20'}`}
            >
              <div className="w-5 h-5 opacity-90">{win.icon}</div>
              <span className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[120px] drop-shadow-sm">{win.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-4 px-2">
        <div className="flex items-center gap-2 text-[var(--text-primary)] opacity-80">
          <Volume2 size={16} className="cursor-pointer hover:opacity-100" />
          <Wifi size={16} className="cursor-pointer hover:opacity-100" />
          <Battery size={16} className="cursor-pointer hover:opacity-100" />
        </div>
        <div className="flex flex-col items-end text-xs font-semibold text-[var(--text-primary)] cursor-default drop-shadow-sm">
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{time.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
