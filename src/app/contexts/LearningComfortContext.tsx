import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "oc_learning_comfort_v1";

export type LearningComfortState = {
  /** OpenDyslexic-style font + relaxed typography */
  dyslexiaFriendlyFont: boolean;
  /** Bold first characters of words in supported reading areas */
  readingAssistEnabled: boolean;
  /** Hide non-essential home content + larger, calmer typography (ADHD-friendly) */
  reduceDistractions: boolean;
};

const defaultState: LearningComfortState = {
  dyslexiaFriendlyFont: false,
  readingAssistEnabled: false,
  reduceDistractions: false,
};

function loadState(): LearningComfortState {
  if (typeof localStorage === "undefined") return { ...defaultState };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw) as Partial<LearningComfortState & { anxietyToolsEnabled?: boolean }>;
    return {
      dyslexiaFriendlyFont: !!parsed.dyslexiaFriendlyFont,
      readingAssistEnabled: !!parsed.readingAssistEnabled,
      reduceDistractions: !!parsed.reduceDistractions,
    };
  } catch {
    return { ...defaultState };
  }
}

type LearningComfortContextValue = LearningComfortState & {
  setDyslexiaFriendlyFont: (v: boolean) => void;
  setReadingAssistEnabled: (v: boolean) => void;
  setReduceDistractions: (v: boolean) => void;
};

const LearningComfortContext = createContext<LearningComfortContextValue | null>(null);

export function LearningComfortProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearningComfortState>(() => loadState());

  const patch = useCallback((partial: Partial<LearningComfortState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore quota */
      }
      return next;
    });
  }, []);

  const setDyslexiaFriendlyFont = useCallback(
    (dyslexiaFriendlyFont: boolean) => patch({ dyslexiaFriendlyFont }),
    [patch]
  );
  const setReadingAssistEnabled = useCallback(
    (readingAssistEnabled: boolean) => patch({ readingAssistEnabled }),
    [patch]
  );
  const setReduceDistractions = useCallback(
    (reduceDistractions: boolean) => patch({ reduceDistractions }),
    [patch]
  );

  useEffect(() => {
    const root = document.documentElement;
    if (state.dyslexiaFriendlyFont) root.classList.add("oc-dyslexia-font");
    else root.classList.remove("oc-dyslexia-font");
    if (state.readingAssistEnabled) root.dataset.readingAssist = "on";
    else delete root.dataset.readingAssist;
    if (state.reduceDistractions) root.dataset.reduceDistractions = "on";
    else delete root.dataset.reduceDistractions;
    return () => {
      root.classList.remove("oc-dyslexia-font");
      delete root.dataset.readingAssist;
      delete root.dataset.reduceDistractions;
    };
  }, [state.dyslexiaFriendlyFont, state.readingAssistEnabled, state.reduceDistractions]);

  const value = useMemo<LearningComfortContextValue>(
    () => ({
      ...state,
      setDyslexiaFriendlyFont,
      setReadingAssistEnabled,
      setReduceDistractions,
    }),
    [state, setDyslexiaFriendlyFont, setReadingAssistEnabled, setReduceDistractions]
  );

  return <LearningComfortContext.Provider value={value}>{children}</LearningComfortContext.Provider>;
}

export function useLearningComfort() {
  const ctx = useContext(LearningComfortContext);
  if (!ctx) throw new Error("useLearningComfort must be used within LearningComfortProvider");
  return ctx;
}
