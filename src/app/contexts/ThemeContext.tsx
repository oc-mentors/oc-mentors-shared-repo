import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeMode = "light" | "dark";

export interface AccentColor {
  name: string;
  primary: string;
  gradient: string;
  icon: string;
}

export const accentColors: AccentColor[] = [
  {
    name: "Blue",
    primary: "#5b7ceb",
    gradient: "from-[#4361d9] to-[#5b7ceb]",
    icon: "#5b7ceb",
  },
  {
    name: "Purple",
    primary: "#8b5cf6",
    gradient: "from-[#7c3aed] to-[#8b5cf6]",
    icon: "#8b5cf6",
  },
  {
    name: "Pink",
    primary: "#ec4899",
    gradient: "from-[#db2777] to-[#ec4899]",
    icon: "#ec4899",
  },
  {
    name: "Teal",
    primary: "#14b8a6",
    gradient: "from-[#0d9488] to-[#14b8a6]",
    icon: "#14b8a6",
  },
  {
    name: "Orange",
    primary: "#f97316",
    gradient: "from-[#ea580c] to-[#f97316]",
    icon: "#f97316",
  },
  {
    name: "Green",
    primary: "#22c55e",
    gradient: "from-[#16a34a] to-[#22c55e]",
    icon: "#22c55e",
  },
  {
    name: "Red",
    primary: "#ef4444",
    gradient: "from-[#dc2626] to-[#ef4444]",
    icon: "#ef4444",
  },
  {
    name: "Yellow",
    primary: "#eab308",
    gradient: "from-[#ca8a04] to-[#eab308]",
    icon: "#eab308",
  },
  {
    name: "Grey",
    primary: "#6b7280",
    gradient: "from-[#4b5563] to-[#6b7280]",
    icon: "#6b7280",
  },
];

interface ThemeColors {
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgCard: string;
  bgCardHover: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  
  // Borders
  borderPrimary: string;
  borderSecondary: string;
  
  // Accent (dynamic based on selected color)
  accent: string;
  accentGradient: string;
  accentLight: string;
  accentDark: string;
}

interface ThemeContextType {
  mode: ThemeMode;
  accentColor: AccentColor;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getThemeColors(mode: ThemeMode, accent: AccentColor): ThemeColors {
  if (mode === "light") {
    return {
      bgPrimary: "#f5f7fa",
      bgSecondary: "#ffffff",
      bgTertiary: "#e8ecf1",
      bgCard: "#ffffff",
      bgCardHover: "#f8f9fb",
      
      textPrimary: "#1a1d29",
      textSecondary: "#4a5568",
      textTertiary: "#718096",
      
      borderPrimary: "rgba(0,0,0,0.08)",
      borderSecondary: "rgba(0,0,0,0.12)",
      
      accent: accent.primary,
      accentGradient: accent.gradient,
      accentLight: accent.primary + "20",
      accentDark: accent.primary,
    };
  } else {
    return {
      bgPrimary: "#1a1d29",
      bgSecondary: "#1e2139",
      bgTertiary: "#2a2f45",
      bgCard: "#1e2139",
      bgCardHover: "#252837",
      
      textPrimary: "#e8edf5",
      textSecondary: "#a8b3cf",
      textTertiary: "#6b7694",
      
      borderPrimary: "rgba(255,255,255,0.08)",
      borderSecondary: "rgba(255,255,255,0.12)",
      
      accent: accent.primary,
      accentGradient: accent.gradient,
      accentLight: accent.primary + "20",
      accentDark: accent.primary,
    };
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("themeMode");
    return (saved as ThemeMode) || "dark";
  });

  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    const saved = localStorage.getItem("accentColor");
    if (saved) {
      return JSON.parse(saved);
    }
    return accentColors[0]; // Default to Blue
  });

  const colors = getThemeColors(mode, accentColor);

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("accentColor", JSON.stringify(accentColor));
  }, [accentColor]);

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        accentColor,
        colors,
        setMode,
        setAccentColor,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}