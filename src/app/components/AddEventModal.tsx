import { useState, useRef } from "react";
import { DateTimeWheelPicker, DateWheelPicker, TimeWheelPicker } from "./DeadlinePickers";
import { motion, AnimatePresence } from "motion/react";
import { X, Flag, Repeat, ChevronRight, AlertCircle, Check, Palette, BookOpen } from "lucide-react";
import { useTheme, accentColors } from "../contexts/ThemeContext";
import { useCanvasAuth } from "../contexts/CanvasAuthContext";
import { useCanvasCourses } from "../contexts/CanvasCoursesContext";
import { useAllCourseColors } from "../hooks/useCourseColor";
import { useScrollLock } from "../hooks/useScrollLock";
import { useCalendar } from "../contexts/CalendarContext";

export interface SavedEventData {
  title: string;
  type: "class" | "study" | "tutor" | "deadline";
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  recurring: boolean;
  recurringFrom?: Date;
  recurringUntil?: Date;
  deadlineColor?: string;
  courseId?: number;
  courseName?: string;
}

interface AddEventModalProps {
  date: Date;
  onClose: () => void;
  defaultStartTime?: string;
  onSave: (eventData: SavedEventData) => void;
}

function toInputDate(d: Date): string {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function fromInputDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function formatDate(d: Date) {
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const EASE = [0.4, 0, 0.2, 1] as const;
const DUR  = 0.3;

interface FormErrors {
  title?: string;
  location?: string;
  endTime?: string;
  recurringFrom?: string;
  recurringUntil?: string;
  overlap?: string;
}

const TYPE_LABEL: Record<string, string> = {
  class:    "class",
  study:    "study session",
  tutor:    "tutor session",
  deadline: "deadline",
};

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

/** Returns a time string shifted +60 minutes (capped at 11:59 PM). */
function addOneHour(t: string): string {
  const mins    = timeToMinutes(t);
  const newMins = Math.min(mins + 60, 23 * 60 + 59);
  const h       = Math.floor(newMins / 60);
  const m       = newMins % 60;
  const period  = h >= 12 ? "PM" : "AM";
  const h12     = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

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

const MIN_DATE = new Date(2026, 1, 13); // Feb 13 2026 — project fixed "today"

export function AddEventModal({ date, onClose, onSave, defaultStartTime }: AddEventModalProps) {
  const { colors, accentColor } = useTheme();
  const { isCanvasConnected }   = useCanvasAuth();
  const { courses, isCourseIgnored } = useCanvasCourses();
  const courseColors  = useAllCourseColors();
  const { calendarEvents } = useCalendar();
  useScrollLock(true);

  const [title, setTitle]       = useState("");
  const [type, setType]         = useState<"class" | "study" | "tutor" | "deadline">("class");
  const [location, setLocation] = useState("");

  // Non-deadline date — stored as Date for the wheel picker
  const [selectedDate, setSelectedDate] = useState<Date>(date);

  // Non-deadline time — wheels always carry a value; end defaults to start + 1 h
  const defaultStart = defaultStartTime || "9:00 AM";
  const [startTime, setStartTime] = useState(defaultStart);
  const [endTime,   setEndTime]   = useState(() => addOneHour(defaultStart));

  // Deadline-specific
  const [deadlineDate, setDeadlineDate] = useState<Date>(date);
  const [deadlineTime, setDeadlineTime] = useState(defaultStartTime || "11:59 PM");

  // Color + course link (shared by all types)
  const [deadlineColor, setDeadlineColor]     = useState<string>(accentColor.primary);
  const [linkedCourseId, setLinkedCourseId]   = useState<number | null>(null);
  const [linkedCourseName, setLinkedCourseName] = useState<string>("");

  // Recurring
  const [recurring, setRecurring]           = useState(false);
  const [recurringFrom, setRecurringFrom]   = useState(toInputDate(date));
  const [recurringUntil, setRecurringUntil] = useState("");

  const isDeadline = type === "deadline";

  const availableCourses = courses.filter((c) => !isCourseIgnored(c.id));

  const effectiveDeadlineColor = linkedCourseId
    ? (courseColors[linkedCourseId] || "#ef4444")
    : deadlineColor;

  const toggleCourse = (id: number, name: string) => {
    if (linkedCourseId === id) { setLinkedCourseId(null); setLinkedCourseName(""); }
    else                       { setLinkedCourseId(id);   setLinkedCourseName(name); }
  };

  // ── Field refs ──────────────────────────────────────────────────────────────
  const titleRef          = useRef<HTMLDivElement>(null);
  const locationRef       = useRef<HTMLDivElement>(null);
  const endTimeRef        = useRef<HTMLDivElement>(null);
  const recurringFromRef  = useRef<HTMLDivElement>(null);
  const recurringUntilRef = useRef<HTMLDivElement>(null);
  const overlapRef        = useRef<HTMLDivElement>(null);

  const FIELD_REFS: [keyof FormErrors, React.RefObject<HTMLDivElement>][] = [
    ["title",          titleRef],
    ["location",       locationRef],
    ["endTime",        endTimeRef],
    ["overlap",        overlapRef],
    ["recurringFrom",  recurringFromRef],
    ["recurringUntil", recurringUntilRef],
  ];

  const [errors, setErrors] = useState<FormErrors>({});
  const clearError = (key: keyof FormErrors) =>
    setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });

  const handleNonDeadlineDateChange = (d: Date) => {
    setSelectedDate(d);
    setRecurringFrom(toInputDate(d));
  };

  const handleDeadlineDateChange = (d: Date) => {
    setDeadlineDate(d);
    setRecurringFrom(toInputDate(d));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lbl  = TYPE_LABEL[type];
    const next: FormErrors = {};

    if (!title.trim()) next.title = `Please enter a title for your ${lbl}.`;

    if (!isDeadline) {
      if (type === "class" && !location)
        next.location = `Please select a location for your ${lbl}.`;
      if (type === "tutor" && !location)
        next.location = `Please choose where your ${lbl} will meet.`;
      // Wheels always have a value — only check end > start
      const sMin = timeToMinutes(startTime);
      const eMin = timeToMinutes(endTime);
      if (eMin <= sMin) next.endTime = "End time must be after start time.";
    }

    if (recurring) {
      if (!recurringFrom)  next.recurringFrom  = "Please set a start date for the recurring schedule.";
      if (!recurringUntil) next.recurringUntil = "Please set an end date for the recurring schedule.";
      else if (recurringFrom && fromInputDate(recurringUntil) <= fromInputDate(recurringFrom))
        next.recurringUntil = "The end date must be after the start date.";
    }

    // Overlap check
    if (!isDeadline && !next.endTime) {
      const newStart = timeToMinutes(startTime);
      const newEnd   = timeToMinutes(endTime);
      const datesToCheck: Date[] = [];
      if (recurring && recurringFrom && recurringUntil && !next.recurringFrom && !next.recurringUntil) {
        const cursor = new Date(fromInputDate(recurringFrom));
        const until  = fromInputDate(recurringUntil);
        while (cursor <= until) { datesToCheck.push(new Date(cursor)); cursor.setDate(cursor.getDate() + 7); }
      } else if (!recurring) {
        datesToCheck.push(selectedDate);
      }
      const conflicting = calendarEvents.find((ev) => {
        if (ev.type === "assignment") return false;
        const evStart = timeToMinutes(ev.startTime);
        const evEnd   = timeToMinutes(ev.endTime);
        return datesToCheck.some((d) =>
          ev.date.getDate()     === d.getDate()     &&
          ev.date.getMonth()    === d.getMonth()    &&
          ev.date.getFullYear() === d.getFullYear() &&
          newStart < evEnd && newEnd > evStart
        );
      });
      if (conflicting) {
        const conflictDate = datesToCheck.find((d) =>
          conflicting.date.getDate() === d.getDate() &&
          conflicting.date.getMonth() === d.getMonth() &&
          conflicting.date.getFullYear() === d.getFullYear()
        );
        const dateStr = conflictDate
          ? ` on ${MONTH_NAMES[conflictDate.getMonth()]} ${conflictDate.getDate()}` : "";
        next.overlap = `Conflicts with "${conflicting.title}"${dateStr} (${conflicting.startTime}–${conflicting.endTime}). Please choose a different time.`;
      }
    }

    if (Object.keys(next).length > 0) {
      setErrors(next);
      setTimeout(() => {
        const first = FIELD_REFS.find(([key]) => next[key]);
        if (first?.[1].current)
          first[1].current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 30);
      return;
    }

    setErrors({});
    onSave({
      title,
      type,
      location:  isDeadline ? "" : location,
      date:      isDeadline ? deadlineDate : selectedDate,
      startTime: isDeadline ? deadlineTime : startTime,
      endTime:   isDeadline ? deadlineTime : endTime,
      recurring,
      recurringFrom:  recurring ? fromInputDate(recurringFrom)  : undefined,
      recurringUntil: recurring ? fromInputDate(recurringUntil) : undefined,
      deadlineColor: !linkedCourseId ? deadlineColor : undefined,
      courseId:   linkedCourseId || undefined,
      courseName: linkedCourseId ? linkedCourseName : undefined,
    });
  };

  const typeOptions = [
    { value: "class",    label: "Class" },
    { value: "study",    label: "Study Session" },
    { value: "tutor",    label: "Tutor Session" },
    { value: "deadline", label: "Deadline" },
  ];

  const recurringBorder = recurring ? accentColor.primary + "60" : colors.borderPrimary;
  // For the "Will repeat every…" message, use whichever date is active
  const activeDate      = isDeadline ? deadlineDate : selectedDate;
  const selectedDayName = DAY_NAMES[activeDate.getDay()];

  return (
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
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between p-6 border-b flex-shrink-0"
          style={{ borderColor: colors.borderPrimary }}
        >
          <h2 className="text-[22px] font-bold" style={{ color: colors.textPrimary }}>
            Add Event
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.borderPrimary }}
          >
            <X className="w-5 h-5" style={{ color: colors.textPrimary }} />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-5 pt-4 pb-3">

            {/* ── Title ── */}
            <div ref={titleRef} className="mb-4">
              <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (e.target.value.trim()) clearError("title"); }}
                placeholder={isDeadline ? "Enter deadline title" : "Enter event title"}
                className="w-full px-4 py-3 rounded-xl border transition-colors"
                style={{
                  backgroundColor: colors.bgSecondary,
                  borderColor: errors.title ? "#ef4444" : colors.borderPrimary,
                  color: colors.textPrimary,
                }}
              />
              <FieldError msg={errors.title} />
            </div>

            {/* ── Type ── */}
            <div className="mb-4">
              <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {typeOptions.map((opt) => {
                  const active = type === opt.value;
                  const isDL   = opt.value === "deadline";
                  return (
                    <motion.button
                      key={opt.value}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setType(opt.value as typeof type); setErrors({}); }}
                      className="px-3 py-3 rounded-xl text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5"
                      style={{
                        backgroundColor: active ? (isDL ? "#ef4444" : accentColor.primary) : colors.bgSecondary,
                        color: active ? "white" : colors.textPrimary,
                        border: `2px solid ${active ? (isDL ? "#ef4444" : accentColor.primary) : colors.borderPrimary}`,
                      }}
                    >
                      {isDL && <Flag className="w-3.5 h-3.5 flex-shrink-0" />}
                      {opt.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* ── Location (non-deadline only) ── */}
            <AnimatePresence initial={false}>
              {!isDeadline && (
                <motion.div
                  key="location"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DUR, ease: EASE }}
                  style={{ overflow: "hidden" }}
                >
                  <div ref={locationRef} className="mb-4">
                    <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                      Location
                    </label>
                    <select
                      value={location}
                      onChange={(e) => { setLocation(e.target.value); if (e.target.value) clearError("location"); }}
                      className="w-full px-4 py-3 rounded-xl border transition-colors"
                      style={{
                        backgroundColor: colors.bgSecondary,
                        borderColor: errors.location ? "#ef4444" : colors.borderPrimary,
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
                    <FieldError msg={errors.location} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Date ── */}
            <div className="mb-4">
              <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                {isDeadline ? "Due Date & Time" : "Date"}
              </label>
              <AnimatePresence initial={false} mode="wait">
                {isDeadline ? (
                  <motion.div
                    key="deadline-dt-wheel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DateTimeWheelPicker
                      date={deadlineDate}
                      time={deadlineTime}
                      onDateChange={handleDeadlineDateChange}
                      onTimeChange={setDeadlineTime}
                      minDate={MIN_DATE}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="regular-date-wheel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DateWheelPicker
                      value={selectedDate}
                      onChange={handleNonDeadlineDateChange}
                      minDate={MIN_DATE}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Start Time / End Time wheels (non-deadline only) ── */}
            <AnimatePresence initial={false}>
              {!isDeadline && (
                <motion.div
                  key="time-wheels"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DUR, ease: EASE }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    {/* Start Time */}
                    <div>
                      <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                        Start Time
                      </label>
                      <TimeWheelPicker
                        time={startTime}
                        onChange={(t) => { setStartTime(t); clearError("endTime"); clearError("overlap"); }}
                      />
                    </div>
                    {/* End Time */}
                    <div ref={endTimeRef}>
                      <label className="block text-[14px] font-semibold mb-2" style={{ color: colors.textPrimary }}>
                        End Time
                      </label>
                      <TimeWheelPicker
                        time={endTime}
                        onChange={(t) => { setEndTime(t); clearError("endTime"); clearError("overlap"); }}
                      />
                      <FieldError msg={errors.endTime} />
                    </div>
                  </div>

                  {/* Overlap error */}
                  <div ref={overlapRef}>
                    <AnimatePresence>
                      {errors.overlap && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-start gap-2 px-4 py-3 rounded-xl mb-4"
                          style={{ backgroundColor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)" }}
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#ef4444" }} />
                          <span className="text-[13px] font-medium leading-snug" style={{ color: "#ef4444" }}>
                            {errors.overlap}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Color Picker (all types) — sits after time fields per design ── */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 flex-shrink-0" style={{ color: colors.textSecondary }} />
                <label className="text-[14px] font-semibold" style={{ color: colors.textPrimary }}>Color</label>
              </div>
              <div
                className="flex items-center justify-center gap-2.5 flex-wrap transition-opacity duration-200"
                style={{ opacity: linkedCourseId ? 0.28 : 1, pointerEvents: linkedCourseId ? "none" : "auto" }}
              >
                {accentColors.map((ac) => {
                  const isSelected = deadlineColor === ac.primary;
                  return (
                    <motion.button
                      key={ac.name}
                      type="button"
                      whileTap={{ scale: 0.88 }}
                      onClick={() => setDeadlineColor(ac.primary)}
                      className="w-8 h-8 rounded-full flex items-center justify-center shadow flex-shrink-0"
                      style={{
                        backgroundColor: ac.primary,
                        boxShadow: isSelected ? `0 0 0 3px ${colors.bgCard}, 0 0 0 5px ${ac.primary}` : undefined,
                      }}
                      title={ac.name}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                    </motion.button>
                  );
                })}
              </div>
              {/* Course colour label — opacity-only toggle so height stays stable */}
              <div
                className="flex items-center justify-center gap-1.5 mt-2.5 transition-opacity duration-200"
                style={{ opacity: linkedCourseId ? 1 : 0, height: 18 }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: effectiveDeadlineColor }} />
                <span className="text-[12px]" style={{ color: colors.textSecondary }}>
                  Using{" "}
                  <span style={{ color: colors.textPrimary, fontWeight: 600 }}>{linkedCourseName || "\u00a0"}</span>
                  {" "}color
                </span>
              </div>
            </div>

            {/* ── Assign to Course (Canvas, optional) ── */}
            <AnimatePresence initial={false}>
              {isCanvasConnected && availableCourses.length > 0 && (
                <motion.div
                  key="event-course"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DUR, ease: EASE }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="mb-4">
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
                        const isLinked    = linkedCourseId === course.id;
                        return (
                          <motion.button
                            key={course.id}
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleCourse(course.id, course.name)}
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Recurring toggle ── */}
            <div
              className="mb-4 rounded-2xl border overflow-hidden"
              style={{ borderColor: recurringBorder, transition: "border-color 0.3s" }}
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.99 }}
                onClick={() => setRecurring((r) => !r)}
                className="w-full flex items-center justify-between px-4 py-3.5 transition-colors"
                style={{ backgroundColor: recurring ? accentColor.primary + "15" : colors.bgSecondary }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: recurring ? accentColor.primary : colors.borderPrimary }}
                  >
                    <Repeat className="w-4 h-4" style={{ color: recurring ? "white" : colors.textSecondary }} />
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-semibold" style={{ color: colors.textPrimary }}>Recurring Event</p>
                    <p className="text-[12px]" style={{ color: colors.textSecondary }}>Repeats weekly on the same day</p>
                  </div>
                </div>
                <div
                  className="w-12 h-6 rounded-full flex items-center flex-shrink-0 ml-2"
                  style={{ backgroundColor: recurring ? accentColor.primary : colors.borderPrimary, padding: "2px", transition: "background-color 0.3s" }}
                >
                  <motion.div
                    animate={{ x: recurring ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-5 h-5 rounded-full bg-white shadow"
                  />
                </div>
              </motion.button>

              <AnimatePresence initial={false}>
                {recurring && (
                  <motion.div
                    key="recurring-options"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: DUR, ease: EASE }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="px-4 pb-4 pt-3 space-y-4" style={{ borderTop: `1px solid ${accentColor.primary}30` }}>
                      {selectedDayName && (
                        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ backgroundColor: accentColor.primary + "15" }}>
                          <Repeat className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor.primary }} />
                          <p className="text-[13px]" style={{ color: accentColor.primary }}>
                            Will repeat every <strong>{selectedDayName}</strong>
                            {!isDeadline && startTime && endTime ? ` from ${startTime} to ${endTime}` : ""}
                          </p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div ref={recurringFromRef}>
                          <label className="block text-[13px] font-semibold mb-2" style={{ color: colors.textSecondary }}>
                            Repeat From
                          </label>
                          <input
                            type="date"
                            value={recurringFrom}
                            onChange={(e) => { setRecurringFrom(e.target.value); if (e.target.value) clearError("recurringFrom"); }}
                            className="w-full px-3 py-2.5 rounded-xl border text-[13px] transition-colors"
                            style={{ backgroundColor: colors.bgSecondary, borderColor: errors.recurringFrom ? "#ef4444" : colors.borderPrimary, color: colors.textPrimary, colorScheme: "dark" }}
                          />
                          <FieldError msg={errors.recurringFrom} />
                        </div>
                        <div ref={recurringUntilRef}>
                          <label className="block text-[13px] font-semibold mb-2" style={{ color: colors.textSecondary }}>
                            Repeat Until
                          </label>
                          <input
                            type="date"
                            value={recurringUntil}
                            onChange={(e) => { setRecurringUntil(e.target.value); if (e.target.value) clearError("recurringUntil"); }}
                            className="w-full px-3 py-2.5 rounded-xl border text-[13px] transition-colors"
                            style={{ backgroundColor: colors.bgSecondary, borderColor: errors.recurringUntil ? "#ef4444" : colors.borderPrimary, color: colors.textPrimary, colorScheme: "dark" }}
                          />
                          <FieldError msg={errors.recurringUntil} />
                        </div>
                      </div>
                      {recurringFrom && recurringUntil && fromInputDate(recurringUntil) > fromInputDate(recurringFrom) && (() => {
                        const from  = fromInputDate(recurringFrom);
                        const until = fromInputDate(recurringUntil);
                        let count = 0;
                        const cursor = new Date(from);
                        while (cursor <= until) { count++; cursor.setDate(cursor.getDate() + 7); }
                        return (
                          <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ backgroundColor: colors.bgTertiary, border: `1px solid ${colors.borderPrimary}` }}>
                            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.textSecondary }} />
                            <p className="text-[13px]" style={{ color: colors.textSecondary }}>
                              {count} event{count !== 1 ? "s" : ""} will be created&nbsp;
                              <span style={{ color: colors.textPrimary }}>({formatDate(from)} → {formatDate(until)})</span>
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Deadline notice ── */}
            <AnimatePresence initial={false}>
              {isDeadline && (
                <motion.div
                  key="deadline-banner"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DUR, ease: EASE }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="mb-4 rounded-xl px-4 py-3 flex items-center gap-3"
                    style={{ backgroundColor: "#ef444420", border: "1px solid #ef444450" }}
                  >
                    <Flag className="w-4 h-4 flex-shrink-0" style={{ color: "#ef4444" }} />
                    <p className="text-[13px]" style={{ color: "#ef4444" }}>
                      Deadlines appear as a flag on the due date.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Save ── */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl text-white font-bold text-[16px] shadow-lg transition-colors"
              style={{ backgroundColor: isDeadline ? "#ef4444" : accentColor.primary }}
            >
              {isDeadline ? "Add Deadline" : recurring ? "Add Recurring Event" : "Save Event"}
            </motion.button>

          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}