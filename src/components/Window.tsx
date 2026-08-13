import { motion, useDragControls } from 'motion/react';
import { useWindows, WindowApp } from '../contexts/WindowContext';
import { X, Minus, Square } from 'lucide-react';
import { useRef } from 'react';

export function Window({ app }: { app: WindowApp }) {
  const { closeWindow, minimizeWindow, focusWindow } = useWindows();
  const dragControls = useDragControls();
  const windowRef = useRef(null);

  if (app.isMinimized) return null;

  return (
    <motion.div
      ref={windowRef}
      className="absolute aero-container overflow-hidden flex flex-col shadow-2xl"
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
      onMouseDown={() => focusWindow(app.id)}
    >
      {/* Window Header / Titlebar */}
      <div 
        className="h-9 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing border-b border-white/40"
        style={{ background: 'var(--window-header)' }}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)] drop-shadow-sm text-sm">
          <div className="w-4 h-4 opacity-80">{app.icon}</div>
          {app.title}
        </div>
        <div className="flex gap-1.5">
          <button 
            className="w-7 h-5 rounded-sm bg-white/30 hover:bg-blue-300 flex items-center justify-center transition-colors border border-white/40 shadow-sm"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(app.id); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Minus size={14} color="var(--text-primary)" />
          </button>
          <button 
            className="w-7 h-5 rounded-sm bg-white/30 hover:bg-blue-300 flex items-center justify-center transition-colors border border-white/40 shadow-sm"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Square size={12} color="var(--text-primary)" />
          </button>
          <button 
            className="w-10 h-5 rounded-sm bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors border border-red-400 shadow-inner group overflow-hidden relative"
            onClick={(e) => { e.stopPropagation(); closeWindow(app.id); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
             <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-1/2 pointer-events-none"></div>
             <X size={14} color="white" className="group-hover:drop-shadow-md" />
          </button>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="flex-1 bg-white/80 backdrop-blur-3xl overflow-auto relative rounded-b-xl border-t border-white/50">
        {app.component}
      </div>
    </motion.div>
  );
}
