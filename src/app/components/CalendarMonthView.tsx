import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ChevronDown, X, Flag, BookOpen, GraduationCap, Clock, MapPin, Users, Check, Trash2 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useCalendar } from "../contexts/CalendarContext";
import { useAllCourseColors } from "../hooks/useCourseColor";
import { getEventColors } from "../utils/eventColors";
import { AddEventModal } from "./AddEventModal";
import { EventDetailsModal } from "./EventDetailsModal";

const COMPLETED_IDS_KEY = 'completedAssignmentIds';
const IGNORED_IDS_KEY   = 'ignoredAssignmentIds';

interface CalendarMonthViewProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

const LONG_PRESS_MS = 380;

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayNamesFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 9999;
  const parts = timeStr.trim().split(" ");
  const period = parts[1];
  const [hStr, mStr] = parts[0].split(":");
  let h = parseInt(hStr, 10);
  const m = mStr ? parseInt(mStr, 10) : 0;
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

/**
 * All measurements that drive the dot-indicator layout inside a day tile.
 *
 * ≤ 4  → single row, 10 px dots, left-aligned
 *   5  → single row, 10 px dots, centered
 * 6 +  → two rows (ceil/floor split), 10 px dots, both rows centered;
 *         row 2 slides 4 px under row 1 so they visually overlap
 */
const DOT_SIZE   = 10; // circle diameter (px)
const DOT_OFFSET = 7;  // fan offset between circles (px)
const DOT_MAX    = 4;  // max circles shown before a "+" label appears

export function CalendarMonthView({ onDateSelect, selectedDate }: CalendarMonthViewProps) {
  const { colors, accentColor } = useTheme();
  const { calendarEvents, addCalendarEvent, removeCalendarEvent, updateCalendarEvent } = useCalendar();
  const courseColors = useAllCourseColors();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedDateInternal, setSelectedDateInternal] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Track completed assignment titles for cross-page sync
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(COMPLETED_IDS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  // Track ignored assignment titles — these are completely hidden from calendar
  const [ignoredIds, setIgnoredIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(IGNORED_IDS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  // Listen for assignmentCompleted events (from any view)
  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem(COMPLETED_IDS_KEY);
      setCompletedIds(stored ? new Set(JSON.parse(stored)) : new Set());
    };
    window.addEventListener('assignmentCompleted', handler);
    return () => window.removeEventListener('assignmentCompleted', handler);
  }, []);

  // Listen for assignmentIgnored events — refresh ignored titles
  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem(IGNORED_IDS_KEY);
      setIgnoredIds(stored ? new Set(JSON.parse(stored)) : new Set());
    };
    window.addEventListener('assignmentIgnored', handler);
    return () => window.removeEventListener('assignmentIgnored', handler);
  }, []);

  const toggleAssignmentComplete = (event: any) => {
    const isNowCompleted = !event.completed;
    updateCalendarEvent(event.id, { completed: isNowCompleted });

    // Eagerly build the new set from current state (not a lazy functional
    // updater) and write to localStorage BEFORE dispatching. If we used a
    // functional updater, React wouldn't run it until the commit phase — after
    // this handler returns — so the synchronous dispatchEvent below would fire
    // while localStorage still held the old data. The listener would then call
    // setCompletedIds with stale data, overriding our correct update and
    // leaving the fade locked on even after unmarking.
    const next = new Set(completedIds);
    const eventKey = String(event.id);
    if (isNowCompleted) next.add(eventKey);
    else next.delete(eventKey);
    localStorage.setItem(COMPLETED_IDS_KEY, JSON.stringify([...next]));
    setCompletedIds(next);

    // localStorage is now up-to-date — all listeners will read correct data.
    window.dispatchEvent(new CustomEvent('assignmentCompleted'));
  };

  const ignoreAssignment = (event: any) => {
    // Persist ignored id so all views hide it
    const stored = localStorage.getItem(IGNORED_IDS_KEY);
    const ids: string[] = stored ? JSON.parse(stored) : [];
    const updated = [...new Set([...ids, String(event.id)])];
    localStorage.setItem(IGNORED_IDS_KEY, JSON.stringify(updated));
    setIgnoredIds(new Set(updated));
    window.dispatchEvent(new CustomEvent('assignmentIgnored'));
    // Remove the calendar event
    removeCalendarEvent(event.id);
    // Close popup if no more events remain
    setShowDayEventsModal(false);
  };

  // Long-press state
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPressRef = useRef(false);
  const [pressingDate, setPressingDate] = useState<Date | null>(null);
  const [showDayEventsModal, setShowDayEventsModal] = useState(false);
  const [dayEventsModalDate, setDayEventsModalDate] = useState<Date | null>(null);
  const [pendingRemoveEvent, setPendingRemoveEvent] = useState<any>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Sync displayed month when selectedDate crosses month boundary
  useEffect(() => {
    if (!selectedDate) return;
    if (
      selectedDate.getMonth() !== currentDate.getMonth() ||
      selectedDate.getFullYear() !== currentDate.getFullYear()
    ) {
      setCurrentDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const prevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(d);
  };

  const nextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(d);
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return calendarEvents
      .filter(
        (e) =>
          e.date.getDate() === date.getDate() &&
          e.date.getMonth() === date.getMonth() &&
          e.date.getFullYear() === date.getFullYear()
      )
      // Completely hide ignored assignments from all calendar views
      .filter(e => !(e.type === "assignment" && ignoredIds.has(String(e.id))))
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  };

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    if (onDateSelect) {
      onDateSelect(date);
    } else {
      setSelectedDateInternal(date);
      setShowAddEventModal(true);
    }
  };

  // Long-press handlers
  const handlePointerDown = (date: Date | null) => {
    if (!date) return;
    didLongPressRef.current = false;
    setPressingDate(date);
    pressTimerRef.current = setTimeout(() => {
      didLongPressRef.current = true;
      setPressingDate(null);
      const events = getEventsForDate(date);
      if (events.length === 0) return;
      // Always show the same centered panel regardless of event count
      setDayEventsModalDate(date);
      setShowDayEventsModal(true);
    }, LONG_PRESS_MS);
  };

  const handlePointerUp = (date: Date | null) => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setPressingDate(null);
    if (!didLongPressRef.current) {
      handleDateClick(date);
    }
  };

  const cancelPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setPressingDate(null);
    didLongPressRef.current = false;
  };

  const days = getDaysInMonth(currentDate);

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isPressing = (date: Date | null) => {
    if (!date || !pressingDate) return false;
    return (
      date.getDate() === pressingDate.getDate() &&
      date.getMonth() === pressingDate.getMonth() &&
      date.getFullYear() === pressingDate.getFullYear()
    );
  };

  const getEventTypeLabel = (event: any) => {
    switch (event.type) {
      case "assignment": return { label: "Deadline", Icon: Flag };
      case "study":      return { label: "Study",    Icon: BookOpen };
      case "tutor":      return { label: "Tutor",    Icon: GraduationCap };
      default:           return { label: "Class",    Icon: Clock };
    }
  };

  const dayEventsModalEvents = dayEventsModalDate ? getEventsForDate(dayEventsModalDate) : [];

  return (
    <div
      className="rounded-2xl p-5 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] border"
      style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[20px] font-bold" style={{ color: colors.textPrimary }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.borderPrimary, color: colors.textPrimary }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.borderPrimary, color: colors.textPrimary }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-[12px] font-semibold py-2"
            style={{ color: colors.textSecondary }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const events = getEventsForDate(date);
          const isCurrentDay = isToday(date);
          const isSelectedDay = isSelected(date);
          const isBeingPressed = isPressing(date);

          // Completed events are hidden from the circle indicators but still
          // appear (dimmed) in the long-press day modal.
          const dotEvents = events.filter(
            (e) => !(e.completed || completedIds.has(String(e.id)))
          );

          // At most DOT_MAX circles; a "+" label appears when there are more.
          const visibleDots = dotEvents.slice(0, DOT_MAX);
          const hasMore     = dotEvents.length > DOT_MAX;
          // When hasMore, expand the container to include the 5th slot so "+"
          // lands exactly where the 5th circle would have been.
          const dotContainerW = hasMore
            ? DOT_SIZE + DOT_MAX * DOT_OFFSET
            : DOT_SIZE + Math.max(0, visibleDots.length - 1) * DOT_OFFSET;

          return (
            <motion.div
              key={index}
              animate={isBeingPressed ? { scale: 0.88, opacity: 0.65 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.12 }}
              onPointerDown={() => handlePointerDown(date)}
              onPointerUp={() => handlePointerUp(date)}
              onPointerLeave={cancelPress}
              onPointerCancel={cancelPress}
              className={`aspect-square rounded-lg p-1 transition-colors select-none ${date ? "cursor-pointer" : ""}`}
              style={{
                backgroundColor: date
                  ? isCurrentDay
                    ? accentColor.primary + "20"
                    : colors.bgSecondary
                  : "transparent",
                border: isCurrentDay
                  ? `2px solid ${accentColor.primary}`
                  : isSelectedDay
                  ? `2px solid ${accentColor.primary}80`
                  : "2px solid transparent",
                boxShadow: isSelectedDay && !isCurrentDay ? `0 0 0 1px ${accentColor.primary}40` : undefined,
              }}
            >
              {date && (
                <div className="h-full flex flex-col">
                  <div
                    className="text-[13px] font-semibold text-center mb-0.5"
                    style={{ color: isCurrentDay || isSelectedDay ? accentColor.primary : colors.textPrimary }}
                  >
                    {date.getDate()}
                  </div>
                  {events.length > 0 && (
                    <div className="flex-1 flex items-center justify-center overflow-visible">
                      {/* Overlapping dot stack — centered, max 4 circles */}
                      <div
                        className="relative pointer-events-none flex-shrink-0"
                        style={{ width: dotContainerW, height: DOT_SIZE }}
                      >
                        {visibleDots.map((event, i) => {
                          const { solid } = getEventColors(event, courseColors);
                          return (
                            <div
                              key={event.id}
                              style={{
                                position: "absolute",
                                left: i * DOT_OFFSET,
                                top: 0,
                                width: DOT_SIZE,
                                height: DOT_SIZE,
                                borderRadius: "50%",
                                backgroundColor: solid,
                                zIndex: i + 1,
                                boxShadow: i > 0 ? "-2px 0 3px rgba(0,0,0,0.5)" : undefined,
                              }}
                            />
                          );
                        })}
                        {/* "+" at the exact position the 5th circle would occupy */}
                        {hasMore && (
                          <div
                            style={{
                              position: "absolute",
                              left: DOT_MAX * DOT_OFFSET,
                              top: 0,
                              width: DOT_SIZE,
                              height: DOT_SIZE,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 20,
                            }}
                          >
                            <div style={{ position: "relative", width: 8, height: 8 }}>
                              {/* Horizontal bar */}
                              <div style={{
                                position: "absolute",
                                top: "50%", left: 0, right: 0,
                                height: 2,
                                transform: "translateY(-50%)",
                                backgroundColor: colors.textSecondary,
                                borderRadius: 1,
                              }} />
                              {/* Vertical bar */}
                              <div style={{
                                position: "absolute",
                                left: "50%", top: 0, bottom: 0,
                                width: 2,
                                transform: "translateX(-50%)",
                                backgroundColor: colors.textSecondary,
                                borderRadius: 1,
                              }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Day Events Modal (centered, calendar-width) — shows full details inline ── */}
      <AnimatePresence>
        {showDayEventsModal && dayEventsModalDate && (
          <>
            {/* Backdrop */}
            <motion.div
              key="day-events-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => { setShowDayEventsModal(false); setExpandedEventId(null); }}
            />

            {/* Centered panel — same width as calendar card */}
            <motion.div
              key="day-events-panel"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", damping: 26, stiffness: 340 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div
                className="w-[calc(100vw-48px)] max-w-sm rounded-2xl overflow-hidden shadow-[0px_16px_48px_rgba(0,0,0,0.7)] pointer-events-auto max-h-[75vh] flex flex-col"
                style={{ backgroundColor: colors.bgCard, border: `1px solid ${colors.borderPrimary}` }}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0"
                  style={{ borderBottom: `1px solid ${colors.borderPrimary}` }}
                >
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: colors.textSecondary }}>
                      {dayNamesFull[dayEventsModalDate.getDay()]}
                    </p>
                    <h3 className="text-[17px] font-bold" style={{ color: colors.textPrimary }}>
                      {monthNames[dayEventsModalDate.getMonth()]} {dayEventsModalDate.getDate()}
                    </h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setShowDayEventsModal(false); setExpandedEventId(null); }}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.bgSecondary, color: colors.textSecondary }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Event Detail Cards — scrollable */}
                <div className="overflow-y-auto flex-1 p-3 space-y-3 [&::-webkit-scrollbar]:hidden">
                  {dayEventsModalEvents.map((event, i) => {
                    const { gradient, solid } = getEventColors(event, courseColors);
                    const { label, Icon } = getEventTypeLabel(event);
                    const isAssignment = event.type === "assignment";

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: isAssignment && (event.completed || completedIds.has(String(event.id))) ? 0.45 : 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-xl overflow-hidden"
                        style={{ border: `1px solid ${colors.borderPrimary}` }}
                      >
                        {/* Colored banner — tap to expand/collapse action buttons for assignments */}
                        <div
                          className={`p-3${isAssignment ? " cursor-pointer select-none" : ""}`}
                          style={{ background: gradient }}
                          onClick={isAssignment ? () => setExpandedEventId(prev => prev === String(event.id) ? null : String(event.id)) : undefined}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Icon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-bold text-white leading-tight">
                                {event.title}
                              </p>
                            </div>
                            {/* Type badge — top right */}
                            <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white">
                              {isAssignment
                                ? "Deadline"
                                : event.type === "tutor"
                                ? "Tutor"
                                : event.type === "study"
                                ? "Study"
                                : "Class"}
                            </span>
                          </div>

                          {/* Time */}
                          {isAssignment ? (
                            <div className="flex items-center gap-1.5 text-white/90 text-[12px]">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span>Due: {event.startTime || "11:59 PM"}</span>
                            </div>
                          ) : event.startTime ? (
                            <div className="flex items-center gap-1.5 text-white/90 text-[12px]">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span>{event.startTime}{event.endTime ? ` – ${event.endTime}` : ""}</span>
                            </div>
                          ) : null}

                          {/* Location */}
                          {event.location && (
                            <div className="flex items-center gap-1.5 text-white/90 text-[12px] mt-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span>{event.location}</span>
                            </div>
                          )}

                          {/* Tutor */}
                          {event.tutor && (
                            <div className="flex items-center gap-1.5 text-white/90 text-[12px] mt-1">
                              <GraduationCap className="w-3 h-3 flex-shrink-0" />
                              <span>with {event.tutor}</span>
                            </div>
                          )}

                          {/* Participants */}
                          {event.participants && event.participants.length > 0 && (
                            <div className="flex items-center gap-1.5 text-white/90 text-[12px] mt-1">
                              <Users className="w-3 h-3 flex-shrink-0" />
                              <span>{event.participants.join(", ")}</span>
                            </div>
                          )}

                          {/* Course name for assignments */}
                          {isAssignment && event.courseName && (
                            <div className="flex items-center gap-1.5 text-white/90 text-[12px] mt-1">
                              <BookOpen className="w-3 h-3 flex-shrink-0" />
                              <span>{event.courseName}</span>
                            </div>
                          )}

                          {/* Chevron indicator — assignments only */}
                          {isAssignment && (
                            <div className="flex justify-center mt-2">
                              <motion.div
                                animate={{ rotate: expandedEventId === String(event.id) ? 180 : 0 }}
                                transition={{ duration: 0.22, ease: "easeInOut" }}
                              >
                                <ChevronDown className="w-4 h-4 text-white/70" />
                              </motion.div>
                            </div>
                          )}
                        </div>

                        {/* Action buttons — only visible when the banner is tapped */}
                        <AnimatePresence initial={false}>
                          {isAssignment && expandedEventId === String(event.id) && (
                            <motion.div
                              key="actions"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: "easeInOut" }}
                              style={{ overflow: "hidden" }}
                            >
                              {/* Complete button */}
                              <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={() => toggleAssignmentComplete(event)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 transition-colors"
                                style={{
                                  backgroundColor: event.completed
                                    ? "rgba(34,197,94,0.15)"
                                    : colors.bgSecondary,
                                  borderTop: `1px solid ${colors.borderPrimary}`,
                                }}
                              >
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                                  style={{
                                    backgroundColor: event.completed ? "#22c55e" : "transparent",
                                    border: event.completed ? "2px solid #22c55e" : `2px solid ${colors.textSecondary}`,
                                  }}
                                >
                                  {event.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                </div>
                                <span
                                  className="text-[13px] font-semibold"
                                  style={{ color: event.completed ? "#22c55e" : colors.textSecondary }}
                                >
                                  {event.completed ? "Completed" : "Mark as complete"}
                                </span>
                              </motion.button>
                              {/* Remove button */}
                              <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setPendingRemoveEvent(event)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 transition-colors"
                                style={{
                                  backgroundColor: "rgba(239,68,68,0.1)",
                                  borderTop: `1px solid ${colors.borderPrimary}`,
                                  color: "#ef4444",
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="text-[13px] font-semibold">Remove</span>
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Event Modal (standalone mode only) */}
      <AnimatePresence>
        {showAddEventModal && selectedDateInternal && (
          <AddEventModal
            date={selectedDateInternal}
            onClose={() => {
              setShowAddEventModal(false);
              setSelectedDateInternal(null);
            }}
            onSave={(eventData) => {
              const newId = Math.max(...calendarEvents.map(e => e.id), 0) + 1;
              let color = "from-[#5b7ceb] to-[#7c3aed]";
              if (eventData.type === "study") color = "from-[#14b8a6] to-[#06b6d4]";
              else if (eventData.type === "tutor") color = "from-[#f59e0b] to-[#d97706]";
              addCalendarEvent({
                id: newId,
                type: eventData.type,
                title: eventData.title,
                startTime: eventData.startTime,
                endTime: eventData.endTime,
                day: eventData.date.getDay(),
                date: eventData.date,
                location: eventData.location,
                color,
              });
              setShowAddEventModal(false);
              setSelectedDateInternal(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Event Details Modal */}
      <AnimatePresence>
        {showEventDetailsModal && selectedEvent && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={() => {
              setShowEventDetailsModal(false);
              setSelectedEvent(null);
            }}
            onDelete={removeCalendarEvent}
            onUpdate={updateCalendarEvent}
          />
        )}
      </AnimatePresence>

      {/* ── Remove Confirmation Popup ── */}
      <AnimatePresence>
        {pendingRemoveEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-8"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            onClick={() => setPendingRemoveEvent(null)}
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
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(239,68,68,0.15)" }}>
                  <Trash2 className="w-5 h-5 text-[#ef4444]" />
                </div>
                <h3 className="text-[17px] font-bold" style={{ color: colors.textPrimary }}>Remove Assignment?</h3>
              </div>
              <p className="text-[13px] leading-relaxed mb-6" style={{ color: colors.textSecondary }}>
                <span className="font-semibold" style={{ color: colors.textPrimary }}>"{pendingRemoveEvent?.title}"</span> will be permanently removed from your calendar and assignments list. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPendingRemoveEvent(null)}
                  className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold"
                  style={{ backgroundColor: colors.bgSecondary, color: colors.textPrimary }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { ignoreAssignment(pendingRemoveEvent); setPendingRemoveEvent(null); }}
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