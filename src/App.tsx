import { useState, useEffect, useRef } from 'react';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { Desktop } from './components/Desktop';
import { Window } from './components/Window';
import { WindowContext, WindowApp } from './contexts/WindowContext';

export default function App() {
  const [windows, setWindows] = useState<WindowApp[]>([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [theme, setTheme] = useState('theme-aero');
  
  // Audio contexts
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Audio synthesis for system sounds
  const playSound = (type: 'click' | 'pop' | 'swoosh' | 'error') => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
      gainNode.gain.setValueAtTime(0.5, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'swoosh') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.3);
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  };

  // Konami code easter egg
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A standard toggle
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setTheme(prev => {
          if (prev === 'theme-aero') return 'theme-metro';
          if (prev === 'theme-metro') return 'theme-y2k';
          return 'theme-aero';
        });
      }

      // Konami code check
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setTheme('theme-y2k');
          konamiIndex = 0;
          playSound('error'); // fun retro sound
        }
      } else {
        konamiIndex = 0;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openWindow = (app: Omit<WindowApp, 'isOpen' | 'isMinimized' | 'zIndex'>) => {
    playSound('click');
    setWindows(prev => {
      const existing = prev.find(w => w.id === app.id);
      if (existing) {
        return prev.map(w => w.id === app.id ? { ...w, isMinimized: false, zIndex: Math.max(...prev.map(p => p.zIndex), 0) + 1 } : w);
      }
      return [...prev, { ...app, isOpen: true, isMinimized: false, zIndex: Math.max(...prev.map(p => p.zIndex), 0) + 1 }];
    });
  };

  const closeWindow = (id: string) => {
    playSound('swoosh');
    setWindows(prev => prev.filter(w => w.id !== id));
  };
  
  const minimizeWindow = (id: string) => {
    playSound('swoosh');
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };
  
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
    
    setTimeout(() => {
      ripple.remove();
    }, 800);
  };

  return (
    <WindowContext.Provider value={{ windows, openWindow, closeWindow, minimizeWindow, focusWindow }}>
      <div 
        className="h-screen w-screen overflow-hidden relative transition-colors duration-1000"
        style={{ background: 'var(--bg-gradient)' }}
        onClick={handleBackgroundClick}
      >
        <Desktop playSound={playSound} />
        
        {windows.map(win => (
          <Window key={win.id} app={win} />
        ))}

        <StartMenu isOpen={startMenuOpen} onClose={() => setStartMenuOpen(false)} playSound={playSound} />
        <Taskbar 
          startMenuOpen={startMenuOpen} 
          toggleStartMenu={() => {
            playSound('click');
            setStartMenuOpen(!startMenuOpen);
          }} 
        />
      </div>
    </WindowContext.Provider>
  );
}
