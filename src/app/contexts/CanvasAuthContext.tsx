import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CanvasAuthContextType {
  isCanvasConnected: boolean;
  connectCanvas: () => void;
  disconnectCanvas: () => void;
}

const CanvasAuthContext = createContext<CanvasAuthContextType | null>(null);

const CANVAS_CONNECTED_KEY = "canvasConnected";

export function CanvasAuthProvider({ children }: { children: ReactNode }) {
  const [isCanvasConnected, setIsCanvasConnected] = useState(() => {
    return localStorage.getItem(CANVAS_CONNECTED_KEY) === "true";
  });

  const connectCanvas = () => {
    localStorage.setItem(CANVAS_CONNECTED_KEY, "true");
    setIsCanvasConnected(true);
  };

  const disconnectCanvas = () => {
    localStorage.removeItem(CANVAS_CONNECTED_KEY);
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
