import { useEffect, useState } from 'react';

export function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // using requestAnimationFrame for smoother sweeping hand
    let animationFrameId: number;
    const updateTime = () => {
      setTime(new Date());
      animationFrameId = requestAnimationFrame(updateTime);
    };
    animationFrameId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Use milliseconds for smooth sweeping
  const ms = time.getMilliseconds();
  const seconds = time.getSeconds() + ms / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() + minutes / 60;

  const secondsDegrees = (seconds / 60) * 360;
  const minsDegrees = (minutes / 60) * 360;
  const hourDegrees = (hours / 12) * 360;

  return (
    <div className="w-40 h-40 rounded-full aero-container border-[6px] border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_4px_10px_rgba(0,0,0,0.3)] relative flex items-center justify-center bg-white/20 backdrop-blur-2xl group hover:scale-105 transition-transform cursor-pointer animate-float">
       {/* 3D Glass Dome Highlight */}
       <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/10 to-transparent rounded-full h-[85%] w-[85%] mx-auto mt-2 pointer-events-none z-20"></div>
       <div className="absolute bottom-2 inset-x-4 h-1/3 bg-gradient-to-t from-white/40 to-transparent rounded-b-full pointer-events-none z-20 blur-sm"></div>
       
       {/* Clock face inner shadow */}
       <div className="absolute inset-2 rounded-full shadow-[inset_0_0_15px_rgba(0,0,0,0.2)] pointer-events-none"></div>

       {/* Clock face markings */}
       {[...Array(12)].map((_, i) => (
         <div 
           key={i} 
           className="absolute w-full h-full pointer-events-none z-0"
           style={{ transform: `rotate(${i * 30}deg)` }}
         >
           <div className={`w-1.5 mx-auto mt-2 rounded-full shadow-sm ${i % 3 === 0 ? 'h-4 bg-gray-800' : 'h-2 bg-gray-500'}`}></div>
         </div>
       ))}

       {/* Hands */}
       <div className="relative w-full h-full z-10 pointer-events-none">
         {/* Hour Hand */}
         <div 
           className="absolute top-1/2 left-1/2 w-[28%] h-2 bg-gradient-to-r from-gray-900 to-gray-700 rounded-full origin-left shadow-[2px_4px_6px_rgba(0,0,0,0.4)]"
           style={{ transform: `translateY(-50%) rotate(${hourDegrees - 90}deg)` }}
         ></div>
         {/* Minute Hand */}
         <div 
           className="absolute top-1/2 left-1/2 w-[40%] h-1.5 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full origin-left shadow-[2px_4px_6px_rgba(0,0,0,0.4)]"
           style={{ transform: `translateY(-50%) rotate(${minsDegrees - 90}deg)` }}
         ></div>
         {/* Second Hand (Glowing Red) */}
         <div 
           className="absolute top-1/2 left-1/2 w-[45%] h-[2px] bg-red-500 rounded-full origin-left shadow-[0_0_10px_rgba(255,0,0,0.8),_1px_3px_5px_rgba(0,0,0,0.3)]"
           style={{ transform: `translateY(-50%) rotate(${secondsDegrees - 90}deg)` }}
         ></div>
         
         {/* Center dot */}
         <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-gradient-to-br from-gray-300 to-gray-700 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-30">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full m-auto mt-[2px] shadow-[0_0_5px_rgba(255,0,0,1)]"></div>
         </div>
       </div>
    </div>
  );
}
