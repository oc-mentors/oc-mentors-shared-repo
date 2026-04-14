import React, { useState, useEffect, useRef } from "react";
import { X, Trash2, MapPin, Clock, Users, Calendar, BookOpen, Flag, Check, AlertCircle, Palette } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme, accentColors, ThemeColors } from "../contexts/ThemeContext";
import { useAllCourseColors } from "../hooks/useCourseColor";
import { getEventColors } from "../utils/eventColors";
import { DateTimeWheelPicker, DateWheelPicker, TimeWheelPicker } from "./DeadlinePickers";
import { useCanvasAuth } from "../contexts/CanvasAuthContext";
import { useCanvasCourses } from "../contexts/CanvasCoursesContext";
import { useScrollLock } from "../hooks/useScrollLock";

const COMPLETED_IDS_KEY = 'completedAssignmentIds';
const IGNORED_IDS_KEY   = 'ignoredAssignmentIds';

function toInputDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fromInputDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

interface CalendarEvent {
  id: number;
  type: "class" | "study" | "assignment" | "tutor";
  title: string;
  startTime: string;
  endTime: string;
  day: number;
  date: Date;
  tutor?: string;
  participants?: string[];
  color?: string;
  courseName?: string;
  courseId?: number;
  dueTime?: string;
  location?: string;
  completed?: boolean;
  /** True for events created by the user — prevents courseId being mistaken as a Canvas import. */
  isUserCreated?: boolean;
}

interface EventDetailsModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<CalendarEvent>) => void;
}

export function EventDetailsModal({ event, onClose, onDelete, onUpdate }: EventDetailsModalProps) {
  const { colors, accentColor } = useTheme();
  const courseColors = useAllCourseColors();
  const { isCanvasConnected } = useCanvasAuth();
  const { courses, isCourseIgnored } = useCanvasCourses();
  // Lock background scroll while the modal is open
  useScrollLock(!!event);

  const [isEditing, setIsEditing] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("11:59 PM");
  const [deadlineDate, setDeadlineDate] = useState<Date>(new Date());
  // Regular-event edit wheels
  const [editDate, setEditDate]           = useState<Date>(new Date());
  const [editStartTime, setEditStartTime] = useState("9:00 AM");
  const [editEndTime, setEditEndTime]     = useState("10:00 AM");
  const [formData, setFormData] = useState({
    title: "",
    type: "class" as "class" | "study" | "tutor" | "assignment",
    location: "",
    startTime: "",
    endTime: "",
  });

  // Edit-mode color & course state
  const [editColor, setEditColor] = useState<string>(accentColor.primary);
  const [editLinkedCourseId, setEditLinkedCourseId] = useState<number | null>(null);
  const [editLinkedCourseName, setEditLinkedCourseName] = useState<string>("");

  const availableCourses = courses.filter((c) => !isCourseIgnored(c.id));

  const effectiveEditColor = editLinkedCourseId
    ? (courseColors[editLinkedCourseId] || accentColor.primary)
    : editColor;

  const toggleEditCourse = (id: number, name: string) => {
    if (editLinkedCourseId === id) {
      setEditLinkedCourseId(null);
      setEditLinkedCourseName("");
    } else {
      setEditLinkedCourseId(id);
      setEditLinkedCourseName(name);
    }
  };

  const [editErrors, setEditErrors] = useState<{
    title?: string; location?: string; startTime?: string; endTime?: string;
  }>({});

  const editTitleRef    = useRef<HTMLDivElement>(null);
  const editLocationRef = useRef<HTMLDivElement>(null);
  const editStartRef    = useRef<HTMLDivElement>(null);
  const editEndRef      = useRef<HTMLDivElement>(null);

  const slideDir = useRef<1 | -1>(1);
  const enterEdit = () => { slideDir.current = 1;  setEditErrors({}); setIsEditing(true); };
  const exitEdit  = () => { slideDir.current = -1; setIsEditing(false); };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const MIN_DATE = new Date(); // today

  // Convert "H:MM AM/PM" → total minutes since midnight
  function timeToMinutes(t: string): number {
    if (!t) return -1;
    const [time, period] = t.trim().split(" ");
    const [hStr, mStr]   = time.split(":");
    let h = parseInt(hStr, 10);
    const m = mStr ? parseInt(mStr, 10) : 0;
    if (period?.toUpperCase() === "PM" && h !== 12) h += 12;
    if (period?.toUpperCase() === "AM" && h === 12) h = 0;
    return h * 60 + m;
  }

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        type: event.type as "class" | "study" | "tutor" | "assignment",
        location: event.location || "",
        startTime: event.startTime,
        endTime: event.endTime,
      });
      setSelectedDate(toInputDate(event.date));
      setDeadlineDate(event.date);
      setEditDate(event.date);
      setEditStartTime(event.startTime || "9:00 AM");
      setEditEndTime(event.endTime   || "10:00 AM");
      const isUserDL = event.type === "assignment" && (event.courseId === undefined || !!event.isUserCreated);
      if (isUserDL) {
        setDeadlineTime(event.startTime || "11:59 PM");
      }
      // Init edit color/course from stored event values
      setEditColor(event.color?.startsWith("#") ? event.color : accentColor.primary);
      setEditLinkedCourseId(event.courseId != null ? event.courseId : null);
      // Prefer the stored courseName; if missing, resolve it live from the courses list
      const resolvedCourseName =
        event.courseName ||
        (event.courseId != null
          ? (courses.find((c) => c.id === event.courseId)?.name ?? "")
          : "");
      setEditLinkedCourseName(resolvedCourseName);
    }
  }, [event]);

  if (!event) return null;

  const { gradient, solid } = getEventColors(event, courseColors);

  const formatDate = (date: Date) => {
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setEditErrors((prev) => { const n = { ...prev }; delete n[field as keyof typeof n]; return n; });
  };

  const handleSave = () => {
    const isUserDeadlineEdit = event.type === "assignment" && (event.courseId === undefined || !!event.isUserCreated);
    const next: typeof editErrors = {};

    if (!formData.title.trim()) {
      next.title = isUserDeadlineEdit
        ? "Please enter a title for your deadline."
        : "Please enter a title for your event.";
    }

    if (!isUserDeadlineEdit) {
      if ((formData.type === "class" || formData.type === "tutor") && !formData.location) {
        next.location = formData.type === "class"
          ? "Please select a location for your class."
          : "Please choose where your tutor session will meet.";
      }
      // Wheel pickers always carry a value — only validate end > start
      const sMin = timeToMinutes(editStartTime);
      const eMin = timeToMinutes(editEndTime);
      if (eMin <= sMin) next.endTime = "End time must be after start time.";
    }

    if (Object.keys(next).length > 0) {
      setEditErrors(next);
      const orderedRefs: [keyof typeof next, React.RefObject<HTMLDivElement>][] = [
        ["title",     editTitleRef],
        ["location",  editLocationRef],
        ["startTime", editStartRef],
        ["endTime",   editEndRef],
      ];
      setTimeout(() => {
        const first = orderedRefs.find(([key]) => next[key]);
        if (first?.[1].current) {
          first[1].current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 30);
      return;
    }

    setEditErrors({});
    onUpdate(event.id, {
      title: formData.title,
      ...(isUserDeadlineEdit
        ? { date: deadlineDate, day: deadlineDate.getDay(), startTime: deadlineTime, endTime: deadlineTime }
        : {
            date: editDate,
            day: editDate.getDay(),
            location: formData.location,
            startTime: editStartTime,
            endTime: editEndTime,
          }),
      color: editLinkedCourseId != null ? "" : editColor,
      courseId: editLinkedCourseId != null ? editLinkedCourseId : undefined,
      courseName: editLinkedCourseId != null ? editLinkedCourseName : undefined,
    });
    exitEdit();
    onClose();
  };

  const handleDelete = () => {
    onDelete(event.id);
    onClose();
  };

  const isCanvasAssignment = event.type === "assignment" && event.courseId !== undefined && !event.isUserCreated;
  const isUserDeadline     = event.type === "assignment" && (event.courseId === undefined || !!event.isUserCreated);

  const handleToggleComplete = () => {
    const nowCompleted = !event.completed;
    onUpdate(event.id, { completed: nowCompleted });
    const stored = localStorage.getItem(COMPLETED_IDS_KEY);
    const ids: string[] = stored ? JSON.parse(stored) : [];
    const eventKey = String(event.id);
    const next = nowCompleted
      ? [...new Set([...ids, eventKey])]
      : ids.filter((id) => id !== eventKey);
    localStorage.setItem(COMPLETED_IDS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('assignmentCompleted'));
  };

  const handleIgnore = () => {
    const stored = localStorage.getItem(IGNORED_IDS_KEY);
    const ids: string[] = stored ? JSON.parse(stored) : [];
    const updated = [...new Set([...ids, String(event.id)])];
    localStorage.setItem(IGNORED_IDS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('assignmentIgnored'));
    onDelete(event.id);
    onClose();
  };

  const typeLabel = (t: string) => {
    if (t === "tutor")      return "Tutor Session";
    if (t === "study")      return "Study Session";
    if (t === "assignment") return "Deadline";
    return "Class";
  };

  const MarkCompleteButton = () => (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={handleToggleComplete}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[16px] transition-colors"
      style={{
        backgroundColor: event.completed ? "rgba(34,197,94,0.15)" : colors.bgSecondary,
        border: `2px solid ${event.completed ? "#22c55e" : colors.borderPrimary}`,
        color: event.completed ? "#22c55e" : colors.textSecondary,
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
      {event.completed ? "Completed" : "Mark as Complete"}
    </motion.button>
  );

  const CanvasRemoveButton = () => (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => setShowRemoveConfirm(true)}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[15px] transition-colors"
      style={{
        backgroundColor: "rgba(239,68,68,0.12)",
        border: "2px solid rgba(239,68,68,0.4)",
        color: "#ef4444",
      }}
    >
      <Trash2 className="w-4 h-4" />
      Remove Assignment
    </motion.button>
  );

  function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18 }}
        className="flex items-center gap-1.5 mt-1.5"
      >
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#ef4444" }} />
        <span className="text-[12px] font-medium" style={{ color: "#ef4444" }}>{msg}</span>
      </motion.div>
    );
  }

  function ColorCoursePicker({
    colors,
    editColor,
    setEditColor,
    editLinkedCourseId,
    editLinkedCourseName,
    effectiveEditColor,
    availableCourses,
    courseColors,
    isCanvasConnected,
    toggleEditCourse,
    cardBg,
  }: {
    colors: ThemeColors;
    editColor: string;
    setEditColor: (c: string) => void;
    editLinkedCourseId: number | null;
    editLinkedCourseName: string;
    effectiveEditColor: string;
    availableCourses: { id: number; name: string }[];
    courseColors: Record<number, string>;
    isCanvasConnected: boolean;
    toggleEditCourse: (id: number, name: string) => void;
    cardBg: string;
  }) {
    return (
      <div className="space-y-4">
        {/* ── Color row ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 flex-shrink-0" style={{ color: colors.textSecondary }} />
            <label className="text-[14px] font-semibold" style={{ color: colors.textPrimary }}>Color</label>
          </div>

          {/* Accent circles — always rendered; dimmed when a course color is active */}
          <div
            className="flex items-center justify-center gap-2.5 flex-wrap transition-opacity duration-200"
            style={{ opacity: editLinkedCourseId != null ? 0.28 : 1, pointerEvents: editLinkedCourseId != null ? "none" : "auto" }}
          >
            {accentColors.map((ac) => {
              const isSelected = editColor === ac.primary;
              return (
                <motion.button
                  key={ac.name}
                  type="button"
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setEditColor(ac.primary)}
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow flex-shrink-0"
                  style={{
                    backgroundColor: ac.primary,
                    boxShadow: isSelected ? `0 0 0 3px ${cardBg}, 0 0 0 5px ${ac.primary}` : undefined,
                  }}
                  title={ac.name}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </motion.button>
              );
            })}
          </div>

          {/* Course color label — always in DOM, opacity-only so height never changes */}
          <div
            className="flex items-center justify-center gap-1.5 mt-2.5 transition-opacity duration-200"
            style={{ opacity: editLinkedCourseId != null ? 1 : 0, height: 18 }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: effectiveEditColor }}
            />
            <span className="text-[12px]" style={{ color: colors.textSecondary }}>
              Using{" "}
              <span style={{ color: colors.textPrimary, fontWeight: 600 }}>
                {editLinkedCourseName || "\u00a0"}
              </span>{" "}
              color
            </span>
          </div>
        </div>

        {/* ── Course assignment (Canvas connected only) ── */}
        {isCanvasConnected && availableCourses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 flex-shrink-0" style={{ color: colors.textSecondary }} />
              <label className="text-[14px] font-semibold" style={{ color: colors.textPrimary }}>
                Assign to Course
              </label>
              <span className="text-[12px] px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.bgSecondary, color: colors.textSecondary }}>
                Optional
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {availableCourses.map((course) => {
                const courseColor = courseColors[course.id] || "#5b7ceb";
                const isLinked = editLinkedCourseId === course.id;
                return (
                  <motion.button
                    key={course.id}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleEditCourse(course.id, course.name)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                    style={{
                      backgroundColor: isLinked ? courseColor + "18" : colors.bgSecondary,
                      border: `2px solid ${isLinked ? courseColor : colors.borderPrimary}`,
                    }}
                  >
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: courseColor }} />
                    <span className="text-[14px] font-semibold flex-1 truncate" style={{ color: colors.textPrimary }}>
                      {course.name}
                    </span>
                    {isLinked && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: courseColor }}>
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", paddingBottom: "68px" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-md mx-auto rounded-3xl shadow-2xl flex flex-col"
        style={{ backgroundColor: colors.bgCard, maxHeight: "calc(100vh - 88px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0" style={{ borderColor: colors.borderPrimary }}>
          <h2 className="text-[22px] font-bold" style={{ color: colors.textPrimary }}>
            {isCanvasAssignment
              ? "Assignment Details"
              : isEditing
              ? (isUserDeadline ? "Edit Deadline" : "Edit Event")
              : isUserDeadline
              ? "Deadline Details"
              : "Event Details"}
          </h2>
          <div className="flex items-center gap-2">
            {/* Trash: always visible for regular events (view + edit), and for user deadlines in view + edit mode */}
            {!isCanvasAssignment && !isUserDeadline && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: "#ef444433" }}
              >
                <Trash2 className="w-5 h-5 text-[#ef4444]" />
              </motion.button>
            )}
            {isUserDeadline && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowRemoveConfirm(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: "#ef444433" }}
              >
                <Trash2 className="w-5 h-5 text-[#ef4444]" />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: colors.borderPrimary }}
            >
              <X className="w-5 h-5" style={{ color: colors.textPrimary }} />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isEditing ? "edit" : "view"}
              initial={{ opacity: 0, x: slideDir.current * 40, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: slideDir.current * -40, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 340, damping: 32, mass: 0.75 }}
              className="p-6 space-y-5 pb-8"
            >
              {/* ── Canvas assignment view ── */}
              {isCanvasAssignment ? (
                <>
                  <div className="rounded-xl p-4" style={{ background: gradient }}>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Flag className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-[20px] font-bold mb-1">{event.title}</h3>
                        {event.courseName && (
                          <div className="flex items-center gap-2 text-white/90 text-[14px]">
                            <BookOpen className="w-4 h-4" />
                            <span>{event.courseName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-white/90 text-[14px] space-y-1 mt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {formatDate(event.date)}</span>
                      </div>
                      {event.dueTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.dueTime}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <span
                      className="inline-block px-4 py-2 rounded-full text-[13px] font-semibold"
                      style={{ backgroundColor: solid + "22", color: solid }}
                    >
                      Canvas Assignment
                    </span>
                  </div>

                  <div className="rounded-xl p-4" style={{ backgroundColor: colors.bgSecondary }}>
                    <p className="text-[14px]" style={{ color: colors.textSecondary }}>
                      This assignment was imported from Canvas. View it in Canvas to submit or see more details.
                    </p>
                  </div>

                  <MarkCompleteButton />
                  <CanvasRemoveButton />
                </>

              ) : isEditing && isUserDeadline ? (
                /* ── Deadline edit form ── */
                <>
                  <div ref={editTitleRef}>
                    <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Enter deadline title"
                      className="w-full px-4 py-3 rounded-xl border transition-colors"
                      style={{
                        backgroundColor: colors.bgSecondary,
                        borderColor: editErrors.title ? "#ef4444" : colors.borderPrimary,
                        color: colors.textPrimary,
                      }}
                    />
                    <FieldError msg={editErrors.title} />
                  </div>

                  <div>
                    <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Due Date & Time
                    </label>
                    <DateTimeWheelPicker
                      date={deadlineDate}
                      time={deadlineTime}
                      onDateChange={setDeadlineDate}
                      onTimeChange={setDeadlineTime}
                    />
                  </div>

                  {/* Color + Course pickers */}
                  <ColorCoursePicker
                    colors={colors}
                    editColor={editColor}
                    setEditColor={setEditColor}
                    editLinkedCourseId={editLinkedCourseId}
                    editLinkedCourseName={editLinkedCourseName}
                    effectiveEditColor={effectiveEditColor}
                    availableCourses={availableCourses}
                    courseColors={courseColors}
                    isCanvasConnected={isCanvasConnected}
                    toggleEditCourse={toggleEditCourse}
                    cardBg={colors.bgCard}
                  />

                  <div
                    className="rounded-xl px-4 py-3 flex items-center gap-3"
                    style={{ backgroundColor: "#ef444420", border: "1px solid #ef444450" }}
                  >
                    <Flag className="w-4 h-4 flex-shrink-0" style={{ color: "#ef4444" }} />
                    <p className="text-[13px]" style={{ color: "#ef4444" }}>
                      Deadlines appear as a flag on the due date.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={exitEdit}
                      className="flex-1 py-4 rounded-xl font-bold text-[16px]"
                      style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="flex-1 py-4 rounded-xl text-white font-bold text-[16px] shadow-lg"
                      style={{ backgroundColor: "#ef4444" }}
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </>

              ) : isEditing ? (
                /* ── Regular event edit form (no Type selector) ── */
                <>
                  <div ref={editTitleRef}>
                    <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Enter title"
                      className="w-full px-4 py-3 rounded-xl border transition-colors"
                      style={{
                        backgroundColor: colors.bgSecondary,
                        borderColor: editErrors.title ? "#ef4444" : colors.borderPrimary,
                        color: colors.textPrimary,
                      }}
                    />
                    <FieldError msg={editErrors.title} />
                  </div>

                  <div ref={editLocationRef}>
                    <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Location
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border transition-colors"
                      style={{
                        backgroundColor: colors.bgSecondary,
                        borderColor: editErrors.location ? "#ef4444" : colors.borderPrimary,
                        color: colors.textPrimary,
                      }}
                    >
                      <option value="">Select location</option>
                      <option value="Online">Online</option>
                      <option value="UCI">UCI</option>
                      <option value="Irvine High School">Irvine High School</option>
                      <option value="University High School">University High School</option>
                      <option value="Northwood High School">Northwood High School</option>
                      <option value="Woodbridge High School">Woodbridge High School</option>
                    </select>
                    <FieldError msg={editErrors.location} />
                  </div>

                  {/* ── Date wheel ── */}
                  <div>
                    <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Date
                    </label>
                    <DateWheelPicker
                      value={editDate}
                      onChange={setEditDate}
                      minDate={MIN_DATE}
                    />
                  </div>

                  {/* ── Start / End time wheels ── */}
                  <div className="grid grid-cols-2 gap-4">
                    <div ref={editStartRef}>
                      <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                        Start Time
                      </label>
                      <TimeWheelPicker
                        time={editStartTime}
                        onChange={(t) => {
                          setEditStartTime(t);
                          setEditErrors((prev) => { const n = { ...prev }; delete n.startTime; delete n.endTime; return n; });
                        }}
                      />
                    </div>
                    <div ref={editEndRef}>
                      <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                        End Time
                      </label>
                      <TimeWheelPicker
                        time={editEndTime}
                        onChange={(t) => {
                          setEditEndTime(t);
                          setEditErrors((prev) => { const n = { ...prev }; delete n.endTime; return n; });
                        }}
                      />
                      <FieldError msg={editErrors.endTime} />
                    </div>
                  </div>

                  {/* Color + Course pickers */}
                  <ColorCoursePicker
                    colors={colors}
                    editColor={editColor}
                    setEditColor={setEditColor}
                    editLinkedCourseId={editLinkedCourseId}
                    editLinkedCourseName={editLinkedCourseName}
                    effectiveEditColor={effectiveEditColor}
                    availableCourses={availableCourses}
                    courseColors={courseColors}
                    isCanvasConnected={isCanvasConnected}
                    toggleEditCourse={toggleEditCourse}
                    cardBg={colors.bgCard}
                  />

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={exitEdit}
                      className="flex-1 py-4 rounded-xl font-bold text-[16px]"
                      style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="flex-1 py-4 rounded-xl text-white font-bold text-[16px] shadow-lg"
                      style={{ backgroundColor: accentColor.primary }}
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </>

              ) : (
                /* ── View mode ── */
                <>
                  <div className="rounded-xl p-4" style={{ background: gradient }}>
                    <h3 className="text-white text-[20px] font-bold mb-2">{event.title}</h3>
                    <div className="text-white/90 text-[14px] space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {isUserDeadline
                            ? `Due: ${event.startTime}`
                            : `${event.startTime} – ${event.endTime}`}
                        </span>
                      </div>
                      {isUserDeadline && event.courseName && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{event.courseName}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.tutor && (
                        <div className="flex items-center gap-2">
                          <span>👤</span>
                          <span>with {event.tutor}</span>
                        </div>
                      )}
                      {event.participants && event.participants.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.participants.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <span
                      className="inline-block px-4 py-2 rounded-full text-[13px] font-semibold"
                      style={{ backgroundColor: solid + "22", color: solid }}
                    >
                      {typeLabel(event.type)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold mb-1" style={{ color: colors.textSecondary }}>
                      DATE
                    </label>
                    <p className="text-[16px] font-medium" style={{ color: colors.textPrimary }}>
                      {formatDate(event.date)}
                    </p>
                  </div>

                  {isUserDeadline && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={enterEdit}
                        className="w-full py-4 rounded-xl text-white font-bold text-[16px] shadow-lg"
                        style={{ backgroundColor: accentColor.primary }}
                      >
                        Edit Deadline
                      </motion.button>
                      <MarkCompleteButton />
                    </>
                  )}

                  {!isUserDeadline && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={enterEdit}
                      className="w-full py-4 rounded-xl text-white font-bold text-[16px] shadow-lg"
                      style={{ backgroundColor: accentColor.primary }}
                    >
                      Edit Event
                    </motion.button>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>

    {/* ── Remove Confirmation ── */}
    <AnimatePresence>
      {showRemoveConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-8"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setShowRemoveConfirm(false)}
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
              <h3 className="text-[17px] font-bold" style={{ color: colors.textPrimary }}>
                {isUserDeadline ? "Remove Deadline?" : "Remove Assignment?"}
              </h3>
            </div>
            <p className="text-[13px] leading-relaxed mb-6" style={{ color: colors.textSecondary }}>
              <span className="font-semibold" style={{ color: colors.textPrimary }}>"{event?.title}"</span> will be permanently removed. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowRemoveConfirm(false)}
                className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold"
                style={{ backgroundColor: colors.bgSecondary, color: colors.textPrimary }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setShowRemoveConfirm(false); handleIgnore(); }}
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
    </>
  );
}