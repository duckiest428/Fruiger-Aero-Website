import { useState, useEffect } from 'react';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { Desktop } from './components/Desktop';
import { Window } from './components/Window';
import { WindowContext, WindowApp } from './contexts/WindowContext';

export default function App() {
  const [windows, setWindows] = useState<WindowApp[]>([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [theme, setTheme] = useState('theme-aero');
  
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Keybind for easter egg
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setTheme(prev => {
          if (prev === 'theme-aero') return 'theme-metro';
          if (prev === 'theme-metro') return 'theme-y2k';
          return 'theme-aero';
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openWindow = (app: Omit<WindowApp, 'isOpen' | 'isMinimized' | 'zIndex'>) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === app.id);
      if (existing) {
        return prev.map(w => w.id === app.id ? { ...w, isMinimized: false, zIndex: Math.max(...prev.map(p => p.zIndex), 0) + 1 } : w);
      }
      return [...prev, { ...app, isOpen: true, isMinimized: false, zIndex: Math.max(...prev.map(p => p.zIndex), 0) + 1 }];
    });
  };

  const closeWindow = (id: string) => setWindows(prev => prev.filter(w => w.id !== id));
  
  const minimizeWindow = (id: string) => setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  
  const focusWindow = (id: string) => {
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(p => p.zIndex), 0);
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w);
    });
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    setStartMenuOpen(false);
    
    // Water Ripple Easter Egg
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX - 20}px`;
    ripple.style.top = `${e.clientY - 20}px`;
    ripple.style.width = '40px';
    ripple.style.height = '40px';
    document.body.appendChild(ripple);
    
    // Play subtle sound if desired here
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <WindowContext.Provider value={{ windows, openWindow, closeWindow, minimizeWindow, focusWindow }}>
      <div 
        className="h-screen w-screen overflow-hidden relative transition-colors duration-1000"
        style={{ background: 'var(--bg-gradient)' }}
        onClick={handleBackgroundClick}
      >
        <Desktop />
        
        {windows.map(win => (
          <Window key={win.id} app={win} />
        ))}

        <StartMenu isOpen={startMenuOpen} onClose={() => setStartMenuOpen(false)} />
        <Taskbar 
          startMenuOpen={startMenuOpen} 
          toggleStartMenu={() => setStartMenuOpen(!startMenuOpen)} 
        />
      </div>
    </WindowContext.Provider>
  );
}
