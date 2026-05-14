import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Filter, AlertCircle, Calendar, Check, Trash2, Plus } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useCanvasCourses, type CanvasAssignment } from "../contexts/CanvasCoursesContext";
import { useAllCourseColors } from "../hooks/useCourseColor";
import { AddAssignmentModal } from "../components/AddAssignmentModal";

const COMPLETED_IDS_KEY = "completedAssignmentIds";
const IGNORED_IDS_KEY   = "ignoredAssignmentIds";

const TODAY = new Date();

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getDaysUntilDue(dueDate: Date): number {
  return Math.ceil((dueDate.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}

function deriveStatus(a: CanvasAssignment): "completed" | "missing" | "urgent" | "upcoming" {
  if (a.submitted) return "completed";
  const days = getDaysUntilDue(a.dueDate);
  if (days < 0) return "missing";
  if (days <= 1) return "urgent";
  return "upcoming";
}

function formatShortDate(date: Date): string {
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatFullDate(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  const displayM = m === 0 ? "" : `:${m.toString().padStart(2, "0")}`;
  return `${DAYS_FULL[date.getDay()]}, ${MONTHS_FULL[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${displayH}${displayM} ${period}`;
}

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const { getAllAssignments, isCourseIgnored } = useCanvasCourses();
  const { colors, accentColor } = useTheme();
  const courseColors = useAllCourseColors();

  // All canvas assignments (already filtered by ignored courses in the context)
  const allCanvasAssignments = getAllAssignments();

  // Unique course short-codes for the filter panel
  const availableCourses = [...new Set(allCanvasAssignments.map((a) => a.courseName))];

  const [selectedCourses, setSelectedCourses] = useState<string[]>(() => availableCourses);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [pendingRemoveAssignment, setPendingRemoveAssignment] = useState<CanvasAssignment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Top-fade scroll state
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const handleListScroll = () => {
    if (listContainerRef.current) {
      setShowTopFade(listContainerRef.current.scrollTop > 0);
    }
  };

  // Assignment IDs individually ignored by the user from this page
  const [ignoredIds, setIgnoredIds] = useState<number[]>(() => {
    const stored = localStorage.getItem("ignoredAssignments");
    return stored ? JSON.parse(stored) : [];
  });

  // IDs marked complete via the calendar or this page (key = String(10000 + a.id))
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(COMPLETED_IDS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  // Keep completedIds in sync when any view marks one complete
  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem(COMPLETED_IDS_KEY);
      setCompletedIds(stored ? new Set(JSON.parse(stored)) : new Set());
    };
    window.addEventListener("assignmentCompleted", handler);
    return () => window.removeEventListener("assignmentCompleted", handler);
  }, []);

  // Keep selectedCourses in sync if available courses change (e.g. Canvas sync adds a new course)
  useEffect(() => {
    setSelectedCourses((prev) => {
      const next = availableCourses.filter((c) => prev.includes(c));
      // If nothing was previously selected for a new course, add it automatically
      const newCourses = availableCourses.filter((c) => !prev.includes(c));
      return [...next, ...newCourses];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableCourses.join(",")]);

  const statuses = ["All", "Upcoming", "Urgent", "Missing"];

  const toggleCourse = (course: string) => {
    setSelectedCourses((prev) =>
      prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]
    );
  };

  const selectAllCourses = () => setSelectedCourses([...availableCourses]);
  const deselectAllCourses = () => setSelectedCourses([]);

  // ── Filtering ────────────────────────────────────────────────────────────
  const filteredAssignments = allCanvasAssignments
    // Hide assignments the user explicitly ignored
    .filter((a) => !ignoredIds.includes(a.id))
    // Hide Canvas-graded completed assignments (submitted=true)
    .filter((a) => !a.submitted)
    // Hide assignments marked complete via the calendar — they're done, not "left to turn in"
    .filter((a) => !completedIds.has(String(10000 + a.id)))
    // Course filter
    .filter((a) => selectedCourses.includes(a.courseName))
    // Status filter
    .filter((a) => {
      if (selectedStatus === "All") return true;
      return deriveStatus(a) === selectedStatus.toLowerCase();
    })
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const handleIgnoreAssignment = (a: CanvasAssignment) => {
    // Store ID so calendar views can remove this assignment completely
    const stored = localStorage.getItem(IGNORED_IDS_KEY);
    const ids: string[] = stored ? JSON.parse(stored) : [];
    const updated = [...new Set([...ids, String(10000 + a.id)])];
    localStorage.setItem(IGNORED_IDS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("assignmentIgnored"));

    // Store ID so this page continues to hide it
    setIgnoredIds((prev) => {
      const next = [...prev, a.id];
      localStorage.setItem("ignoredAssignments", JSON.stringify(next));
      return next;
    });
  };

  const handleMarkComplete = (a: CanvasAssignment) => {
    const stored = localStorage.getItem(COMPLETED_IDS_KEY);
    const ids: string[] = stored ? JSON.parse(stored) : [];
    const key = String(10000 + a.id);
    const isAlreadyComplete = completedIds.has(key);
    const updated = isAlreadyComplete
      ? ids.filter((id) => id !== key)
      : [...new Set([...ids, key])];
    localStorage.setItem(COMPLETED_IDS_KEY, JSON.stringify(updated));
    setCompletedIds(new Set(updated));
    window.dispatchEvent(new CustomEvent("assignmentCompleted"));
  };

  // ── Status badge ─────────────────────────────────────────────────────────
  const getStatusBadge = (a: CanvasAssignment) => {
    const status = deriveStatus(a);
    if (status === "missing") {
      return (
        <div className="flex items-center gap-1 bg-[rgba(239,68,68,0.2)] text-[#ef4444] px-2.5 py-1 rounded-full">
          <AlertCircle className="w-3 h-3" />
          <span className="text-xs font-medium">Missing</span>
        </div>
      );
    }
    if (status === "urgent") {
      return (
        <div className="flex items-center gap-1 bg-[rgba(245,158,11,0.2)] text-[#f59e0b] px-2.5 py-1 rounded-full">
          <AlertCircle className="w-3 h-3" />
          <span className="text-xs font-medium">Due Soon</span>
        </div>
      );
    }
    return (
      <div
        className="px-2.5 py-1 rounded-full"
        style={{ backgroundColor: accentColor.primary + "33", color: accentColor.primary }}
      >
        <span className="text-xs font-medium">Upcoming</span>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto w-full flex flex-col flex-1 overflow-hidden">
        {/* ── Header (sticky, never scrolls) ── */}
        <div className="px-6 pt-12 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: colors.bgCard }}
              >
                <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  Assignments
                </h1>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: colors.textTertiary }}>
                  Socratic OC
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Add Assignment button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.bgCard }}
              >
                <Plus className="w-5 h-5" style={{ color: accentColor.primary }} />
              </motion.button>

              {/* Filter button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilter(!showFilter)}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: accentColor.primary }}
              >
                <Filter className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 rounded-xl p-4 border"
              style={{ backgroundColor: colors.bgCard, borderColor: colors.borderSecondary }}
            >
              {/* Course Filter */}
              <div className="mb-4">
                <p className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
                  Filter by Course
                </p>
                <div className="space-y-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={selectAllCourses}
                    className="w-full text-left px-4 py-2 rounded-lg transition-colors"
                    style={
                      selectedCourses.length === availableCourses.length
                        ? { backgroundColor: accentColor.primary, color: "white" }
                        : { backgroundColor: colors.bgPrimary, color: colors.textSecondary }
                    }
                  >
                    <span className="text-sm font-medium">Select All</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={deselectAllCourses}
                    className="w-full text-left px-4 py-2 rounded-lg transition-colors"
                    style={
                      selectedCourses.length === 0
                        ? { backgroundColor: accentColor.primary, color: "white" }
                        : { backgroundColor: colors.bgPrimary, color: colors.textSecondary }
                    }
                  >
                    <span className="text-sm font-medium">Deselect All</span>
                  </motion.button>
                  {availableCourses.map((course) => (
                    <motion.button
                      key={course}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleCourse(course)}
                      className="w-full text-left px-4 py-2 rounded-lg transition-colors"
                      style={
                        selectedCourses.includes(course)
                          ? { backgroundColor: accentColor.primary, color: "white" }
                          : { backgroundColor: colors.bgPrimary, color: colors.textSecondary }
                      }
                    >
                      <span className="text-sm font-medium">{course}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
                  Filter by Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <motion.button
                      key={status}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedStatus(status)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      style={
                        selectedStatus === status
                          ? { backgroundColor: accentColor.primary, color: "white" }
                          : { backgroundColor: colors.bgPrimary, color: colors.textSecondary }
                      }
                    >
                      {status}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Filters */}
          {(selectedCourses.length < availableCourses.length || selectedStatus !== "All") && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2 mb-4"
            >
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                Active filters:
              </span>
              {selectedCourses.length < availableCourses.length && (
                <div
                  className="px-3 py-1 rounded-full flex items-center gap-2"
                  style={{ backgroundColor: accentColor.primary }}
                >
                  <span className="text-xs font-medium text-white">
                    {selectedCourses.length} {selectedCourses.length === 1 ? "course" : "courses"}
                  </span>
                  <button onClick={selectAllCourses} className="text-white hover:text-gray-200">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
              {selectedStatus !== "All" && (
                <div
                  className="px-3 py-1 rounded-full flex items-center gap-2"
                  style={{ backgroundColor: accentColor.primary }}
                >
                  <span className="text-xs font-medium text-white">{selectedStatus}</span>
                  <button
                    onClick={() => setSelectedStatus("All")}
                    className="text-white hover:text-gray-200"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* ── Scrollable list with top fade ── */}
        <div className="relative flex-1 overflow-hidden">
          {/* Top fade overlay */}
          <AnimatePresence>
            {showTopFade && (
              <motion.div
                key="top-fade"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 left-0 right-0 h-12 z-10 pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, ${colors.bgPrimary} 0%, transparent 100%)`,
                }}
              />
            )}
          </AnimatePresence>

          <div
            ref={listContainerRef}
            onScroll={handleListScroll}
            className="h-full overflow-y-auto px-6 pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment, index) => {
                    const courseColor =
                      courseColors[assignment.courseId] || assignment.courseColor;
                    const status = deriveStatus(assignment);

                    return (
                      <motion.div
                        key={assignment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -300, transition: { duration: 0.25 } }}
                        layout
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        className="rounded-2xl p-5 border shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
                        style={{
                          backgroundColor: colors.bgCard,
                          borderColor: colors.borderSecondary,
                        }}
                      >
                        {/* Header: course dot + name + status badge */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: courseColor }}
                            />
                            <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                              {assignment.courseFullName ?? assignment.courseName}
                            </span>
                          </div>
                          {getStatusBadge(assignment)}
                        </div>

                        {/* Title */}
                        <h3
                          className="text-base font-semibold mb-3"
                          style={{ color: colors.textPrimary }}
                        >
                          {assignment.name}
                        </h3>

                        {/* Due Date */}
                        <div className="flex items-center gap-2 mb-3 text-sm">
                          <Calendar className="w-4 h-4" style={{ color: accentColor.primary }} />
                          <div>
                            <span className="font-medium" style={{ color: colors.textPrimary }}>
                              Due:{" "}
                            </span>
                            <span style={{ color: colors.textSecondary }}>
                              {formatFullDate(assignment.dueDate)}
                            </span>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="mb-3">
                          <span className="text-sm" style={{ color: colors.textSecondary }}>
                            {assignment.submitted && assignment.score != null
                              ? `${assignment.score}/${assignment.points} points`
                              : `${assignment.points ?? "—"} points possible`}
                          </span>
                        </div>

                        {/* Instructions */}
                        {assignment.instructions && (
                          <div
                            className="rounded-lg p-3 border mb-3"
                            style={{
                              backgroundColor: colors.bgPrimary,
                              borderColor: colors.borderPrimary,
                            }}
                          >
                            <p className="text-xs font-semibold mb-1" style={{ color: colors.textPrimary }}>
                              Instructions:
                            </p>
                            <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                              {assignment.instructions}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          {/* Mark as Complete */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleMarkComplete(assignment)}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors"
                            style={{
                              backgroundColor: completedIds.has(String(10000 + assignment.id))
                                ? "rgba(34,197,94,0.15)"
                                : colors.bgPrimary,
                              border: `2px solid ${completedIds.has(String(10000 + assignment.id)) ? "#22c55e" : colors.borderPrimary}`,
                              color: completedIds.has(String(10000 + assignment.id)) ? "#22c55e" : colors.textSecondary,
                            }}
                          >
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                              style={{
                                backgroundColor: completedIds.has(String(10000 + assignment.id)) ? "#22c55e" : "transparent",
                                border: completedIds.has(String(10000 + assignment.id))
                                  ? "2px solid #22c55e"
                                  : `2px solid ${colors.textSecondary}`,
                              }}
                            >
                              {completedIds.has(String(10000 + assignment.id)) && (
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                              )}
                            </div>
                            {completedIds.has(String(10000 + assignment.id)) ? "Completed" : "Mark as Complete"}
                          </motion.button>

                          {/* Start + Ignore row */}
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex-1 bg-gradient-to-r ${accentColor.gradient} text-white py-3 rounded-xl font-semibold`}
                            >
                              {status === "missing" ? "Submit Late" : "Start Assignment"}
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setPendingRemoveAssignment(assignment)}
                              className="flex items-center gap-1.5 px-4 py-3 rounded-xl font-semibold border transition-colors"
                              style={{
                                backgroundColor: "rgba(239,68,68,0.12)",
                                color: "#ef4444",
                                borderColor: "rgba(239,68,68,0.4)",
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl p-8 border text-center"
                    style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                  >
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      No assignments found with the selected filters
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />

      {/* Add Assignment Modal */}
      <AddAssignmentModal open={showAddModal} onClose={() => setShowAddModal(false)} />

      {/* ── Remove Confirmation Popup ── */}
      <AnimatePresence>
        {pendingRemoveAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            onClick={() => setPendingRemoveAssignment(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl p-6"
              style={{ backgroundColor: colors.bgCard, border: "1px solid rgba(239,68,68,0.35)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
                >
                  <Trash2 className="w-5 h-5 text-[#ef4444]" />
                </div>
                <h3 className="text-[17px] font-bold" style={{ color: colors.textPrimary }}>
                  Remove Assignment?
                </h3>
              </div>
              <p className="text-[13px] leading-relaxed mb-6" style={{ color: colors.textSecondary }}>
                <span className="font-semibold" style={{ color: colors.textPrimary }}>
                  "{pendingRemoveAssignment.name}"
                </span>{" "}
                will be permanently removed from your assignments list and calendar. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPendingRemoveAssignment(null)}
                  className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold"
                  style={{ backgroundColor: colors.bgSecondary, color: colors.textPrimary }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    handleIgnoreAssignment(pendingRemoveAssignment);
                    setPendingRemoveAssignment(null);
                  }}
                  className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold text-white"
                  style={{ backgroundColor: "#ef4444" }}
                >
                  Remove
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}