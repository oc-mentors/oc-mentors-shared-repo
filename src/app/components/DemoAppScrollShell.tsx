import { useEffect, type ReactNode } from "react";
import { useDemoModeOptional } from "../contexts/DemoModeContext";
import { useTheme } from "../contexts/ThemeContext";
import { DemoGuidePanel } from "./DemoGuidePanel";

/**
 * During Expo demo, one page scroll: app content first, guide card appended at the bottom.
 */
export function DemoAppScrollShell({ children }: { children: ReactNode }) {
  const demo = useDemoModeOptional();
  const { colors } = useTheme();
  const active = demo?.isDemoMode || demo?.isStarting;
  const pageBg = colors.bgPrimary;

  useEffect(() => {
    const root = document.documentElement;
    if (!active) {
      root.removeAttribute("data-demo-guide");
      root.style.removeProperty("--demo-page-bg");
      document.body.style.backgroundColor = "";
      const appRoot = document.getElementById("root");
      if (appRoot) appRoot.style.backgroundColor = "";
      return;
    }
    root.setAttribute("data-demo-guide", "true");
    root.style.setProperty("--demo-page-bg", pageBg);
    document.body.style.backgroundColor = pageBg;
    const appRoot = document.getElementById("root");
    if (appRoot) appRoot.style.backgroundColor = pageBg;
    return () => {
      root.removeAttribute("data-demo-guide");
      root.style.removeProperty("--demo-page-bg");
      document.body.style.backgroundColor = "";
      if (appRoot) appRoot.style.backgroundColor = "";
    };
  }, [active, pageBg]);

  if (!active) return <>{children}</>;

  return (
    <div
      data-demo-scroll-root
      className="h-[100dvh] w-full overflow-y-auto overflow-x-hidden overscroll-y-contain"
      style={{ backgroundColor: pageBg }}
    >
      <div
        className="demo-page-flow w-full min-h-min"
        style={{ backgroundColor: pageBg }}
      >
        {children}
      </div>
      <DemoGuidePanel />
    </div>
  );
}
