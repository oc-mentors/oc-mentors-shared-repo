export const CANVAS_CONNECTED_KEY = "canvasConnected";
export const CANVAS_COURSES_KEY = "canvas_courses_v1";
export const CANVAS_LAST_REFRESHED_KEY = "canvas_last_refreshed_v1";
export const CANVAS_ASSIGNMENTS_KEY = "canvas_assignments_v2";
export const CANVAS_IGNORED_COURSES_KEY = "ignored_courses_v1";

let onCanvasDataReset: (() => void) | null = null;

/** Lets CanvasCoursesProvider reset in-memory state when the user logs out. */
export function registerCanvasDataResetHandler(handler: () => void): () => void {
  onCanvasDataReset = handler;
  return () => {
    if (onCanvasDataReset === handler) onCanvasDataReset = null;
  };
}

export function clearCanvasLocalStorage(): void {
  localStorage.removeItem(CANVAS_CONNECTED_KEY);
  localStorage.removeItem(CANVAS_COURSES_KEY);
  localStorage.removeItem(CANVAS_LAST_REFRESHED_KEY);
  localStorage.removeItem(CANVAS_ASSIGNMENTS_KEY);
  localStorage.removeItem(CANVAS_IGNORED_COURSES_KEY);
}

/** Clears Canvas auth + cached sync data and resets course state in the app. */
export function disconnectCanvasSession(): void {
  clearCanvasLocalStorage();
  onCanvasDataReset?.();
}
