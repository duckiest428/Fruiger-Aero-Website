import { useWindows } from '../contexts/WindowContext';
import { Volume2, VolumeX, Wifi, Battery } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Taskbar({ startMenuOpen, toggleStartMenu, playSound }: { startMenuOpen: boolean, toggleStartMenu: () => void, playSound?: (type: 'startup' | 'click') => void }) {
  const { windows, focusWindow } = useWindows();
  const [time, setTime] = useState(new Date());
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playSound) playSound(startMenuOpen ? 'click' : 'startup');
    toggleStartMenu();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 flex items-center px-2 z-50 justify-between bg-black/40 backdrop-blur-[20px] saturate-[180%] shadow-[0_-2px_15px_rgba(0,0,0,0.5)]">
      
      {/* 1px glossy reflection strip on top edge */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white opacity-40 pointer-events-none" />

      <div className="flex items-center gap-2 h-full">
        {/* Start Button with Pulse and Glow */}
        <button 
          className="start-orb relative w-12 h-12 -mt-2 rounded-full flex items-center justify-center group"
          onClick={handleStartClick}
        >
           <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-transparent h-[45%] rounded-t-full pointer-events-none"></div>
           {/* Inner white glow pulse */}
           <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-[pulse_2s_ease-in-out_infinite] pointer-events-none"></div>
           <div className="w-5 h-5 bg-white rounded-[3px] rotate-45 shadow-[0_0_15px_white] z-10 transition-transform duration-300 group-hover:rotate-90 group-active:scale-75"></div>
           <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(0,255,255,0)] group-hover:shadow-[0_0_20px_rgba(0,255,255,0.8)] transition-shadow duration-300"></div>
        </button>

        {/* Open Windows with Glossy Tabs */}
        <div className="flex gap-1 h-full py-1 ml-2">
          {windows.map(win => {
            const isActive = !win.isMinimized && win.zIndex === Math.max(...windows.map(w=>w.zIndex));
            return (
              <button
                key={win.id}
                onClick={(e) => { e.stopPropagation(); focusWindow(win.id); if (playSound) playSound('click'); }}
                className={`group px-3 h-full rounded flex items-center gap-2 transition-all border relative overflow-hidden
                  ${isActive 
                    ? 'border-white/50 bg-gradient-to-b from-white/40 to-blue-300/30 shadow-[inset_0_0_10px_rgba(255,255,255,0.5),_0_2px_5px_rgba(0,0,0,0.4)]' 
                    : 'border-white/20 bg-black/20 hover:bg-white/20 hover:border-white/40'}`}
              >
                {/* Glossy top half for tabs */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                
                <div className="w-4 h-4 opacity-90 drop-shadow-md z-10">{win.icon}</div>
                <span className={`text-xs font-semibold truncate max-w-[120px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] z-10 text-white`}>
                  {win.title}
                </span>
                
                {/* Tooltip Preview */}
                <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-36 p-2 bg-white/20 backdrop-blur-[30px] saturate-200 border border-white/50 rounded shadow-[0_10px_30px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none before:content-[''] before:absolute before:bottom-[-6px] before:left-1/2 before:-translate-x-1/2 before:border-l-[6px] before:border-r-[6px] before:border-t-[6px] before:border-t-white/50 before:border-x-transparent">
                   <div className="text-xs font-bold text-center mb-1 text-white drop-shadow-md">{win.title}</div>
                   <div className="h-20 bg-black/40 rounded border border-white/20 flex items-center justify-center">
                     {win.icon}
                   </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-3 px-3 h-full bg-gradient-to-r from-transparent to-black/20">
        <div className="flex items-center gap-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          <button onClick={() => setMuted(!muted)} className="hover:opacity-100 transition-opacity">
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <Wifi size={14} className="cursor-default" />
          <Battery size={14} className="cursor-default" />
        </div>
        <div className="flex flex-col items-center justify-center text-[10px] leading-tight font-medium text-white cursor-default drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{time.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
