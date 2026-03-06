import { useEffect, useRef } from "react";
import { useCanvasAuth } from "../contexts/CanvasAuthContext";
import { useCanvasCourses } from "../contexts/CanvasCoursesContext";
import { useCalendar } from "../contexts/CalendarContext";

/**
 * Syncs Canvas assignments to the calendar automatically.
 * Always syncs on mount so the calendar and AssignmentsPage always show
 * identical assignment data, even when Canvas is not explicitly connected.
 * When Canvas is connected, subsequent syncs also run.
 */
export function CanvasSyncManager() {
  const { isCanvasConnected } = useCanvasAuth();
  const { getAllAssignments } = useCanvasCourses();
  const { syncCanvasAssignments } = useCalendar();
  const lastSyncedAssignmentIdsRef = useRef<string>("");

  useEffect(() => {
    // Always sync — Canvas connection state only gates live-refresh behaviour,
    // but we always want the canonical assignment list in the calendar.
    const allAssignments = getAllAssignments();

    // Create a stable identifier so we don't re-sync unnecessarily
    const currentAssignmentIds = allAssignments
      .map((a) => `${a.id}-${a.dueDate.getTime()}`)
      .sort()
      .join(",");

    if (currentAssignmentIds !== lastSyncedAssignmentIdsRef.current && allAssignments.length > 0) {
      syncCanvasAssignments(allAssignments);
      lastSyncedAssignmentIdsRef.current = currentAssignmentIds;
    }
  }, [isCanvasConnected, getAllAssignments, syncCanvasAssignments]);

  return null;
}