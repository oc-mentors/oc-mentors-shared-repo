import { useEffect } from "react";

/**
 * Locks document body scroll while `active` is true.
 * Restores the previous overflow value on cleanup.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    // Measure scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [active]);
}
