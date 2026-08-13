import { useWindows } from '../contexts/WindowContext';
import { Volume2, VolumeX, Wifi, Battery } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Taskbar({ startMenuOpen, toggleStartMenu }: { startMenuOpen: boolean, toggleStartMenu: () => void }) {
  const { windows, focusWindow } = useWindows();
  const [time, setTime] = useState(new Date());
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 aero-container !rounded-none !border-l-0 !border-r-0 !border-b-0 flex items-center px-2 z-50 justify-between bg-white/30 backdrop-blur-xl relative">
      
      {/* 1px glossy reflection strip on top edge */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white opacity-80 pointer-events-none" />

      <div className="flex items-center gap-2 h-full">
        {/* Start Button with Pulse and Glow */}
        <button 
          className="start-orb relative w-11 h-11 rounded-full flex items-center justify-center group"
          onClick={(e) => { e.stopPropagation(); toggleStartMenu(); }}
        >
           <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent h-[45%] rounded-t-full pointer-events-none"></div>
           {/* Inner white glow pulse */}
           <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-[pulse_2s_ease-in-out_infinite] pointer-events-none"></div>
           <div className="w-4 h-4 bg-white rounded-[3px] rotate-45 shadow-[0_0_15px_white] z-10 transition-transform duration-300 group-hover:rotate-90 group-active:scale-75"></div>
        </button>

        {/* Open Windows with Glossy Tabs */}
        <div className="flex gap-1 h-full py-1 ml-2">
          {windows.map(win => {
            const isActive = !win.isMinimized && win.zIndex === Math.max(...windows.map(w=>w.zIndex));
            return (
              <button
                key={win.id}
                onClick={(e) => { e.stopPropagation(); focusWindow(win.id); }}
                className={`group px-3 h-full rounded-md flex items-center gap-2 transition-all border relative overflow-hidden
                  ${isActive 
                    ? 'border-white/60 bg-gradient-to-b from-white/60 to-blue-200/30 shadow-[inset_0_0_10px_rgba(255,255,255,0.8),_0_2px_5px_rgba(0,0,0,0.2)]' 
                    : 'border-white/20 bg-white/10 hover:bg-white/30 hover:border-white/40'}`}
              >
                {/* Glossy top half for tabs */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>
                
                <div className="w-5 h-5 opacity-90 drop-shadow-md z-10">{win.icon}</div>
                <span className={`text-sm font-medium truncate max-w-[120px] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] z-10 ${isActive ? 'text-blue-900' : 'text-gray-800'}`}>
                  {win.title}
                </span>
                
                {/* Tooltip Preview (Simplified) */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-32 p-2 bg-white/80 backdrop-blur-xl border border-white/60 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                   <div className="text-xs font-bold text-center mb-1 text-gray-800">{win.title}</div>
                   <div className="h-16 bg-blue-100/50 rounded border border-white/50 flex items-center justify-center opacity-80">
                     {win.icon}
                   </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-4 px-2">
        <div className="flex items-center gap-2 text-[var(--text-primary)] opacity-80">
          <button onClick={() => setMuted(!muted)} className="hover:opacity-100 transition-opacity">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <Wifi size={16} className="cursor-default" />
          <Battery size={16} className="cursor-default" />
        </div>
        <div className="flex flex-col items-end text-xs font-semibold text-[var(--text-primary)] cursor-default drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{time.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
