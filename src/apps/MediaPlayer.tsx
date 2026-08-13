import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export function MediaPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [visualizerData, setVisualizerData] = useState<number[]>(Array(24).fill(10));
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRefs = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const requestRef = useRef<number>();

  const startAudio = () => {
    if (!audioCtxRef.current) {
       audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Create a lush ambient chord pad
    const frequencies = [261.63, 329.63, 392.00, 523.25]; // C Maj 7 approx
    
    if (!gainNodeRef.current) {
      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.connect(ctx.destination);
    }
    
    // Fade in
    gainNodeRef.current.gain.setValueAtTime(0, ctx.currentTime);
    gainNodeRef.current.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 2);

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      // Slow LFO for phasing effect
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1 + (i * 0.05);
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 5;
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      osc.connect(gainNodeRef.current!);
      osc.start();
      lfo.start();
      
      oscRefs.current.push(osc, lfo);
    });
  };

  const stopAudio = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      // Fade out
      const ctx = audioCtxRef.current;
      gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => {
        oscRefs.current.forEach(osc => osc.stop());
        oscRefs.current = [];
      }, 1000);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startAudio();
    } else {
      stopAudio();
    }
    return () => {
      if (oscRefs.current.length > 0) {
        oscRefs.current.forEach(osc => {
          try { osc.stop(); } catch(e) {}
        });
        oscRefs.current = [];
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
       gainNodeRef.current.gain.setTargetAtTime(volume * 0.3, audioCtxRef.current.currentTime, 0.1);
    }
  }, [volume]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.5));
      }, 300);
      
      const updateVisualizer = () => {
        // Create wave-like visualization
        const time = Date.now() / 500;
        setVisualizerData(Array.from({ length: 24 }).map((_, i) => {
           return Math.max(10, (Math.sin(time + i * 0.5) * 40) + (Math.random() * 30) + 20);
        }));
        
        setTimeout(() => {
          requestRef.current = requestAnimationFrame(updateVisualizer);
        }, 100);
      };
      requestRef.current = requestAnimationFrame(updateVisualizer);
      
    } else {
      setVisualizerData(Array(24).fill(10));
    }
    
    return () => {
      clearInterval(interval);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying]);

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVol = Math.max(0, Math.min(1, x / rect.width));
    setVolume(newVol);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setProgress((x / rect.width) * 100);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-gray-200">
      {/* Top area */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-6">
        {/* Fake visualizer */}
        <div className="w-[80%] h-32 aero-container bg-black/90 flex items-end justify-center gap-1.5 p-3 rounded-2xl border border-gray-600 shadow-[inset_0_0_20px_rgba(0,0,0,1)] overflow-hidden relative group">
            {/* Gloss reflection on screen */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none h-1/2 z-10 rounded-t-2xl"></div>
            
            {visualizerData.map((val, i) => (
              <div 
                key={i} 
                className="w-full bg-gradient-to-t from-green-400 via-yellow-400 to-blue-400 rounded-t-sm transition-all duration-75"
                style={{ 
                  height: `${val}%`,
                  boxShadow: isPlaying ? '0 0 10px rgba(0,255,255,0.6)' : 'none',
                  opacity: isPlaying ? 0.9 : 0.4
                }}
              ></div>
            ))}
        </div>
        <div className="mt-6 text-center">
           <h3 className="font-bold text-gray-800 text-xl drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Aero Symphony.mp3</h3>
           <p className="text-gray-500 text-sm font-medium">Frutiger Aero Soundscapes</p>
        </div>
      </div>

      {/* Controls */}
      <div className="h-28 bg-gradient-to-b from-gray-200 to-gray-300 border-t border-white shadow-inner flex flex-col p-2 relative">
        {/* Progress bar */}
        <div 
          className="h-3 bg-gray-400/80 rounded-full mx-6 mt-2 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border border-gray-500/50 cursor-pointer relative"
          onClick={handleProgressClick}
        >
           <div 
             className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-blue-500 to-cyan-300 shadow-[0_0_8px_cyan] transition-all duration-100 ease-linear rounded-full border-r border-white/50" 
             style={{ width: `${progress}%` }}
           >
              {/* Gloss inside progress */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-white/40"></div>
           </div>
        </div>
        
        <div className="flex items-center justify-between px-8 flex-1 mt-2">
          <button className="w-10 h-10 rounded-full aero-button flex items-center justify-center text-gray-700 shadow-md hover:scale-105 transition-transform active:scale-95">
            <SkipBack size={18} fill="currentColor" />
          </button>
          
          <button 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-[0_4px_10px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/60 bg-gradient-to-b from-blue-400 to-blue-600 hover:brightness-110 active:scale-95 transition-all relative overflow-hidden group ml-8"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none"></div>
            {isPlaying ? <Pause size={28} fill="currentColor" className="drop-shadow-md z-10" /> : <Play size={28} fill="currentColor" className="ml-1 drop-shadow-md z-10" />}
          </button>
          
          <button className="w-10 h-10 rounded-full aero-button flex items-center justify-center text-gray-700 shadow-md hover:scale-105 transition-transform active:scale-95 ml-8">
            <SkipForward size={18} fill="currentColor" />
          </button>
          
          <div className="flex items-center gap-2 ml-auto">
            <Volume2 size={18} className="text-gray-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" />
            <div 
              className="w-24 h-3 bg-gray-400/80 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border border-gray-500/50 overflow-hidden cursor-pointer relative"
              onClick={handleVolumeClick}
            >
                <div 
                  className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-green-500 to-green-300 shadow-[0_0_5px_green] rounded-full border-r border-white/50 transition-all duration-100"
                  style={{ width: `${volume * 100}%` }}
                >
                   <div className="absolute inset-x-0 top-0 h-1/2 bg-white/40"></div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
