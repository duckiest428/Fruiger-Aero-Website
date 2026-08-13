import { motion, useDragControls } from 'motion/react';
import { useWindows, WindowApp } from '../contexts/WindowContext';
import { X, Minus, Square } from 'lucide-react';
import { useRef, useState } from 'react';

export function Window({ app }: { app: WindowApp }) {
  const { closeWindow, minimizeWindow, focusWindow } = useWindows();
  const dragControls = useDragControls();
  const windowRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  if (app.isMinimized) return null;

  return (
    <motion.div
      ref={windowRef}
      className={`absolute aero-container overflow-hidden flex flex-col transition-shadow duration-300 ${isDragging ? 'shadow-[0_24px_60px_rgba(0,20,60,0.4),inset_0_1px_0_rgba(255,255,255,0.8)]' : 'shadow-[var(--window-shadow)]'}`}
      style={{ 
        width: app.width || 500, 
        height: app.height || 400,
        zIndex: app.zIndex,
        // center initially roughly
        top: '15%',
        left: '20%'
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.15 }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ scale: 1.02, rotate: 1 }}
      onMouseDown={() => focusWindow(app.id)}
    >
      {/* High-gloss window border reflection */}
      <div className="absolute inset-0 pointer-events-none border border-white/60 rounded-xl z-50"></div>
      
      {/* Window Header / Titlebar */}
      <div 
        className="h-10 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing border-b border-white/40 relative overflow-hidden"
        style={{ background: 'var(--window-header)' }}
        onPointerDown={(e) => dragControls.start(e)}
      >
        {/* Titlebar Glossy Top Half */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/60 to-white/10 pointer-events-none"></div>

        <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-sm z-10 relative">
          <div className="w-4 h-4 opacity-90 drop-shadow-sm">{app.icon}</div>
          {app.title}
        </div>
        <div className="flex gap-1 z-10 relative">
          {/* Windows 7 Style Buttons */}
          <button 
            className="w-8 h-5 rounded-[3px] bg-gradient-to-b from-white/40 to-black/5 hover:from-white/70 hover:to-blue-200/50 flex items-center justify-center border border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] relative overflow-hidden"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(app.id); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/40"></div>
            <Minus size={14} color="var(--text-primary)" className="drop-shadow-sm z-10 translate-y-1" />
          </button>
          
          <button 
            className="w-8 h-5 rounded-[3px] bg-gradient-to-b from-white/40 to-black/5 hover:from-white/70 hover:to-blue-200/50 flex items-center justify-center border border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] relative overflow-hidden"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/40"></div>
            <Square size={12} color="var(--text-primary)" className="drop-shadow-sm z-10" />
          </button>
          
          {/* Authentic Glowing Red Close Button */}
          <button 
            className="w-11 h-5 rounded-[3px] ml-1 bg-gradient-to-b from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 flex items-center justify-center border border-red-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),_0_0_8px_rgba(255,0,0,0.5)] transition-all relative overflow-hidden group"
            onClick={(e) => { e.stopPropagation(); closeWindow(app.id); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
             <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent"></div>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-red-300 rounded-t-full opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity"></div>
             <X size={16} color="white" className="z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] group-active:scale-90" strokeWidth={2.5} />
          </button>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="flex-1 bg-white/90 backdrop-blur-3xl overflow-auto relative rounded-b-xl">
        {app.component}
      </div>
    </motion.div>
  );
}
