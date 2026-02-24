import { useEffect } from "react";
import { useLocation } from "react-router";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Always scroll to top on any navigation
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}