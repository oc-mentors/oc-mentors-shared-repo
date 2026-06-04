import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  CANVAS_CONNECTED_KEY,
  disconnectCanvasSession,
} from "../lib/canvasStorage";

interface CanvasAuthContextType {
  isCanvasConnected: boolean;
  connectCanvas: () => void;
  disconnectCanvas: () => void;
}

const CanvasAuthContext = createContext<CanvasAuthContextType | null>(null);

export function CanvasAuthProvider({ children }: { children: ReactNode }) {
  const [isCanvasConnected, setIsCanvasConnected] = useState(() => {
    return localStorage.getItem(CANVAS_CONNECTED_KEY) === "true";
  });

  const connectCanvas = () => {
    localStorage.setItem(CANVAS_CONNECTED_KEY, "true");
    setIsCanvasConnected(true);
  };

  const disconnectCanvas = () => {
    disconnectCanvasSession();
    setIsCanvasConnected(false);
  };

  // Listen for storage changes (in case user logs in from another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsCanvasConnected(localStorage.getItem(CANVAS_CONNECTED_KEY) === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <CanvasAuthContext.Provider
      value={{
        isCanvasConnected,
        connectCanvas,
        disconnectCanvas,
      }}
    >
      {children}
    </CanvasAuthContext.Provider>
  );
}

export function useCanvasAuth() {
  const context = useContext(CanvasAuthContext);
  if (!context) {
    throw new Error("useCanvasAuth must be used within a CanvasAuthProvider");
  }
  return context;
}
