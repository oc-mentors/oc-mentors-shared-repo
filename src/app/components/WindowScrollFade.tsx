import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";

interface WindowScrollFadeProps {
  /** Distance from the bottom of the viewport. Use '52px' when a fixed BottomNav is present, '0px' otherwise. */
  bottom?: string;
  /** Override the fade background color (for pages with hardcoded bg colors). Falls back to colors.bgPrimary. */
  bgColor?: string;
}

/**
 * Renders a fixed bottom-fade overlay that tracks window-level scrolling.
 * Use this on pages whose root element is `min-h-screen overflow-auto`
 * (i.e. the window, not a div, is the actual scroll container).
 */
export function WindowScrollFade({ bottom = "52px", bgColor }: WindowScrollFadeProps) {
  const { colors } = useTheme();
  const [showFade, setShowFade] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      const el = document.documentElement;
      const atBottom = el.scrollTop + window.innerHeight >= el.scrollHeight - 4;
      setShowFade(!atBottom);
    };

    checkScroll();

    window.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const fadeColor = bgColor ?? colors.bgPrimary;

  return (
    <AnimatePresence>
      {showFade && (
        <motion.div
          key="window-bottom-fade"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed left-0 right-0 h-16 z-40 pointer-events-none"
          style={{
            bottom,
            background: `linear-gradient(to top, ${fadeColor} 0%, transparent 100%)`,
          }}
        />
      )}
    </AnimatePresence>
  );
}
