import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, Folder, Image, Music, Power, Globe } from 'lucide-react';
import { useWindows } from '../contexts/WindowContext';

export function StartMenu({ isOpen, onClose, playSound }: { isOpen: boolean, onClose: () => void, playSound?: (type: 'click') => void }) {
  const { openWindow } = useWindows();

  const handleAction = () => {
    if (playSound) playSound('click');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-14 left-2 w-[400px] h-[500px] aero-container !rounded-xl z-50 flex overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/60 border-[1px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Column (Apps) */}
          <div className="flex-1 bg-white/70 backdrop-blur-xl p-4 flex flex-col gap-2 relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 to-transparent pointer-events-none"></div>
             
             <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-500/20 transition-colors w-full text-left relative overflow-hidden group" onClick={handleAction}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-10 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-md relative overflow-hidden border border-blue-300">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-1/2 pointer-events-none"></div>
                  <Globe size={20} className="drop-shadow-sm" />
                </div>
                <div className="z-10">
                  <div className="font-bold text-gray-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Internet Explorer</div>
                  <div className="text-xs text-gray-600">Browse the web</div>
                </div>
             </button>
             
             <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-500/20 transition-colors w-full text-left relative overflow-hidden group" onClick={handleAction}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-10 h-10 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white shadow-md relative overflow-hidden border border-orange-300">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-1/2 pointer-events-none"></div>
                  <span className="font-bold drop-shadow-sm">M</span>
                </div>
                <div className="z-10">
                  <div className="font-bold text-gray-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Mail</div>
                  <div className="text-xs text-gray-600">Check inbox</div>
                </div>
             </button>

             <div className="mt-auto pt-4 border-t border-gray-300/50 relative z-10">
               <button className="flex items-center gap-2 p-2 hover:bg-white/60 rounded-md text-gray-800 font-bold text-sm w-full drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" onClick={handleAction}>
                 All Programs
               </button>
             </div>
          </div>

          {/* Right Column (System) */}
          <div className="w-[140px] bg-gradient-to-b from-[#1a365d] to-[#0f172a] p-4 flex flex-col gap-4 text-white text-sm shadow-[inset_1px_0_0_rgba(255,255,255,0.2)] relative border-l border-white/20 z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            
            <div className="flex items-center gap-2 font-bold mb-4 relative z-10">
              <div className="w-10 h-10 bg-white/20 rounded-md border border-white/40 flex items-center justify-center backdrop-blur-sm overflow-hidden relative shadow-md">
                 <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-1/2"></div>
                 <User size={20} className="drop-shadow-md" />
              </div>
              <span className="drop-shadow-md">User</span>
            </div>

            <button className="flex items-center gap-2 hover:bg-white/20 p-1.5 rounded transition-colors text-left font-medium text-shadow-sm relative z-10" onClick={handleAction}><Folder size={16} className="text-blue-200" /> Documents</button>
            <button className="flex items-center gap-2 hover:bg-white/20 p-1.5 rounded transition-colors text-left font-medium text-shadow-sm relative z-10" onClick={handleAction}><Image size={16} className="text-blue-200" /> Pictures</button>
            <button className="flex items-center gap-2 hover:bg-white/20 p-1.5 rounded transition-colors text-left font-medium text-shadow-sm relative z-10" onClick={handleAction}><Music size={16} className="text-blue-200" /> Music</button>
            
            <div className="h-px bg-white/20 my-2 relative z-10"></div>
            
            <button className="flex items-center gap-2 hover:bg-white/20 p-1.5 rounded transition-colors text-left font-medium text-shadow-sm relative z-10" onClick={handleAction}><Settings size={16} className="text-gray-300" /> Control Panel</button>
            
            <div className="mt-auto flex justify-end relative z-10">
               <button className="flex items-center gap-1 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white px-3 py-1.5 rounded border border-red-400 shadow-[0_2px_5px_rgba(0,0,0,0.3)] transition-colors text-xs font-bold relative overflow-hidden group" onClick={handleAction}>
                 <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-1/2 pointer-events-none"></div>
                 <Power size={14} className="group-hover:scale-110 transition-transform" /> Shut Down
               </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
