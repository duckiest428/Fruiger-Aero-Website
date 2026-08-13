import { useEffect, useState } from 'react';

export function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const secondsDegrees = (time.getSeconds() / 60) * 360 + 90;
  const minsDegrees = (time.getMinutes() / 60) * 360 + ((time.getSeconds()/60)*6) + 90;
  const hourDegrees = (time.getHours() / 12) * 360 + ((time.getMinutes()/60)*30) + 90;

  return (
    <div className="w-36 h-36 rounded-full aero-container border-4 border-gray-300/80 shadow-[0_10px_25px_rgba(0,0,0,0.4),inset_0_0_20px_rgba(255,255,255,1)] relative flex items-center justify-center bg-black/10 backdrop-blur-xl group hover:scale-105 transition-transform cursor-pointer">
       <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-transparent rounded-full h-[90%] w-[90%] m-auto pointer-events-none"></div>
       
       {/* Clock face markings */}
       {[...Array(12)].map((_, i) => (
         <div 
           key={i} 
           className="absolute w-full h-full"
           style={{ transform: `rotate(${i * 30}deg)` }}
         >
           <div className={`w-1 mx-auto mt-2 rounded-full ${i % 3 === 0 ? 'h-3 bg-gray-800' : 'h-1.5 bg-gray-500'}`}></div>
         </div>
       ))}

       {/* Hands */}
       <div className="relative w-full h-full">
         <div 
           className="absolute top-1/2 left-1/2 w-[25%] h-1.5 bg-gray-800 rounded-full origin-left shadow-md transition-transform duration-75"
           style={{ transform: `translateY(-50%) rotate(${hourDegrees - 90}deg)` }}
         ></div>
         <div 
           className="absolute top-1/2 left-1/2 w-[35%] h-1 bg-gray-600 rounded-full origin-left shadow-md transition-transform duration-75"
           style={{ transform: `translateY(-50%) rotate(${minsDegrees - 90}deg)` }}
         ></div>
         <div 
           className="absolute top-1/2 left-1/2 w-[40%] h-[2px] bg-red-500 rounded-full origin-left shadow-md transition-transform duration-75"
           style={{ transform: `translateY(-50%) rotate(${secondsDegrees - 90}deg)` }}
         ></div>
         {/* Center dot */}
         <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-sm z-10">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full m-auto mt-[1px]"></div>
         </div>
       </div>
    </div>
  );
}
