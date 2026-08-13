import { createContext, useContext, ReactNode } from 'react';

export type WindowApp = {
  id: string;
  title: string;
  icon: ReactNode;
  component: ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  width?: number;
  height?: number;
};

interface WindowContextType {
  windows: WindowApp[];
  openWindow: (app: Omit<WindowApp, 'isOpen' | 'isMinimized' | 'zIndex'>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

export const WindowContext = createContext<WindowContextType | null>(null);

export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context) throw new Error("useWindows must be used within WindowProvider");
  return context;
};
