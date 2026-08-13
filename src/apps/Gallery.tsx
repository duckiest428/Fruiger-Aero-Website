import { useState } from 'react';

export function Gallery() {
  const images = [
    { id: 1, title: 'Vista Default', color: 'from-green-400 to-blue-500', icon: '🌿' },
    { id: 2, title: 'Aero Glass', color: 'from-blue-200 to-cyan-400', icon: '🪟' },
    { id: 3, title: 'Tropical Fish', color: 'from-orange-400 to-blue-600', icon: '🐠' },
    { id: 4, title: 'Glossy Globe', color: 'from-blue-600 to-blue-900', icon: '🌍' },
    { id: 5, title: 'Green Field', color: 'from-green-500 to-yellow-300', icon: '🌱' },
    { id: 6, title: 'Sunburst', color: 'from-yellow-400 to-orange-500', icon: '☀️' },
    { id: 7, title: 'Water Drops', color: 'from-cyan-300 to-blue-500', icon: '💧' },
    { id: 8, title: 'Cloudscape', color: 'from-blue-100 to-blue-300', icon: '☁️' },
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Toolbar */}
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 border-b border-gray-300 p-2.5 flex gap-2 shadow-sm relative z-10">
         <button className="px-4 py-1.5 aero-button rounded text-sm font-medium text-gray-800 flex items-center gap-2">Organize</button>
         <button className="px-4 py-1.5 aero-button rounded text-sm font-medium text-gray-800 flex items-center gap-2">Views</button>
         <button className="px-4 py-1.5 aero-button rounded text-sm font-medium text-gray-800 flex items-center gap-2">Slide Show</button>
      </div>
      
      {/* Grid */}
      <div className="flex-1 p-6 grid grid-cols-4 gap-6 overflow-auto bg-gray-50">
        {images.map(img => (
          <div key={img.id} className="flex flex-col gap-2 items-center group cursor-pointer p-2 rounded hover:bg-blue-100/50 transition-colors border border-transparent hover:border-blue-200">
            <div className="w-full aspect-square rounded-xl p-1 bg-white border border-gray-200 shadow-md group-hover:shadow-lg transition-shadow relative">
               <div className={`w-full h-full rounded-lg bg-gradient-to-br ${img.color} shadow-inner relative overflow-hidden flex items-center justify-center text-4xl`}>
                 <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-[45%]"></div>
                 <span className="drop-shadow-lg scale-100 group-hover:scale-110 transition-transform">{img.icon}</span>
               </div>
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center truncate w-full group-hover:text-blue-700">{img.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
