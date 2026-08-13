import { useState, useEffect } from 'react';
import { CloudRain, Sun, Cloud } from 'lucide-react';

export function WeatherWidget() {
  const [weather, setWeather] = useState<'sunny' | 'cloudy' | 'rainy'>('sunny');

  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => prev === 'sunny' ? 'cloudy' : prev === 'cloudy' ? 'rainy' : 'sunny');
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="aero-container w-48 h-48 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer animate-float">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none z-10 rounded-3xl" />
      <div className="absolute inset-0 shadow-[inset_0_4px_15px_rgba(255,255,255,0.8)] rounded-3xl pointer-events-none z-10" />
      
      {weather === 'sunny' && (
        <div className="relative">
          <Sun size={80} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-40 mix-blend-screen" />
        </div>
      )}
      
      {weather === 'cloudy' && (
        <div className="relative animate-bounce">
          <Cloud size={80} className="text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)]" />
          <Cloud size={60} className="text-gray-200 absolute -bottom-2 -right-4 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]" />
        </div>
      )}

      {weather === 'rainy' && (
        <div className="relative flex flex-col items-center">
          <CloudRain size={80} className="text-gray-300 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]" />
          <div className="absolute top-[60px] flex gap-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className="w-1 h-3 bg-blue-300/80 rounded-full animate-[rain_1s_linear_infinite]" 
                style={{ animationDelay: `${i * 0.3}s` }} 
              />
            ))}
          </div>
          <style>{`
            @keyframes rain {
              0% { transform: translateY(0) scaleY(1); opacity: 1; }
              70% { transform: translateY(40px) scaleY(1.5); opacity: 0.8; }
              100% { transform: translateY(50px) scaleY(1); opacity: 0; }
            }
          `}</style>
        </div>
      )}
      
      <div className="mt-4 text-white font-bold text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-20">
        {weather === 'sunny' ? '72°' : weather === 'cloudy' ? '65°' : '58°'}
      </div>
      <div className="text-white/80 font-medium text-sm drop-shadow-md capitalize z-20">
        {weather}
      </div>
    </div>
  );
}