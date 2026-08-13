import { useState } from 'react';

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  const images = [
    { id: 1, title: 'Windows Aurora', color: 'from-green-400 to-blue-500', icon: '🌿' },
    { id: 2, title: 'Aero Glass', color: 'from-blue-200 to-cyan-400', icon: '🪟' },
    { id: 3, title: 'Tropical Fish', color: 'from-orange-400 to-blue-600', icon: '🐠' },
    { id: 4, title: 'Glossy Globe', color: 'from-blue-600 to-blue-900', icon: '🌍' },
    { id: 5, title: 'Blissful Field', color: 'from-green-500 to-yellow-300', icon: '🌱' },
    { id: 6, title: 'Sunburst', color: 'from-yellow-400 to-orange-500', icon: '☀️' },
    { id: 7, title: 'Water Drops', color: 'from-cyan-300 to-blue-500', icon: '💧' },
    { id: 8, title: 'Cloudscape', color: 'from-blue-100 to-blue-300', icon: '☁️' },
  ];

  return (
    <div className="h-full bg-[#f0f4f8] flex flex-col">
      {/* Toolbar */}
      <div className="bg-gradient-to-b from-white/90 to-gray-200/90 border-b border-gray-300 p-2.5 flex gap-2 shadow-[0_2px_5px_rgba(0,0,0,0.05)] relative z-10 backdrop-blur-md">
         <button className="px-4 py-1.5 aero-button rounded text-sm font-semibold text-gray-800 flex items-center gap-2">Organize</button>
         <button className="px-4 py-1.5 aero-button rounded text-sm font-semibold text-gray-800 flex items-center gap-2">Views</button>
         <button className="px-4 py-1.5 aero-button rounded text-sm font-semibold text-gray-800 flex items-center gap-2">Slide Show</button>
         <button className="px-4 py-1.5 aero-button rounded text-sm font-semibold text-gray-800 flex items-center gap-2 ml-auto text-blue-600">Print</button>
      </div>
      
      {/* Glass Pane Layout Container */}
      <div className="flex-1 p-6 overflow-auto bg-gradient-to-b from-[#e5eff8] to-[#d6e5f3] relative shadow-inner">
         {/* Folder Background Detail */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent)] pointer-events-none"></div>
         
         <div className="grid grid-cols-4 gap-6 relative z-10">
          {images.map(img => {
            const isSel = selected === img.id;
            return (
            <div 
              key={img.id} 
              onClick={() => setSelected(img.id)}
              className={`flex flex-col gap-2 items-center group cursor-pointer p-3 rounded-lg transition-all border ${isSel ? 'border-blue-400 bg-blue-200/50 shadow-[0_0_10px_rgba(0,150,255,0.3)]' : 'border-transparent hover:border-blue-300 hover:bg-white/40'}`}
            >
              <div className="w-full aspect-square rounded-xl p-1 bg-white/80 backdrop-blur-md border border-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all relative group-active:scale-95">
                 {/* Internal Glossy Bevel */}
                 <div className="absolute inset-0 rounded-xl border border-black/5 pointer-events-none z-20"></div>
                 <div className={`w-full h-full rounded-lg bg-gradient-to-br ${img.color} shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] relative overflow-hidden flex items-center justify-center text-5xl`}>
                   <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-10"></div>
                   <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10"></div>
                   <span className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)] scale-100 group-hover:scale-110 transition-transform duration-300 ease-out z-0">{img.icon}</span>
                 </div>
              </div>
              <span className={`text-sm font-semibold text-center w-full truncate px-1 rounded ${isSel ? 'text-white bg-blue-600' : 'text-gray-800 group-hover:text-blue-800'}`}>
                {img.title}
              </span>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}
