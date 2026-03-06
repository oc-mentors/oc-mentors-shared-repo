import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, BookOpen, Calendar, Hash, AlignLeft, ChevronDown, Check } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useCanvasCourses, type CanvasAssignment } from "../contexts/CanvasCoursesContext";
import { useAllCourseColors } from "../hooks/useCourseColor";
import { useScrollLock } from "../hooks/useScrollLock";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddAssignmentModal({ open, onClose }: Props) {
  const { colors, accentColor } = useTheme();
  const { courses, addAssignment } = useCanvasCourses();
  const courseColors = useAllCourseColors();
  useScrollLock(open);

  const [title, setTitle] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [dueDateStr, setDueDateStr] = useState(""); // "YYYY-MM-DD"
  const [dueTimeStr, setDueTimeStr] = useState("23:59");
  const [points, setPoints] = useState("");
  const [instructions, setInstructions] = useState("");
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  // Reset form when opening
  useEffect(() => {
    if (open) {
      setTitle("");
      setSelectedCourseId(null);
      setDueDateStr("");
      setDueTimeStr("23:59");
      setPoints("");
      setInstructions("");
      setErrors({});
      setSubmitted(false);
      setCourseDropdownOpen(false);
      setTimeout(() => titleRef.current?.focus(), 200);
    }
  }, [open]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCourseDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) ?? null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Assignment title is required";
    if (!selectedCourseId) errs.course = "Please select a course";
    if (!dueDateStr) errs.dueDate = "Due date is required";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const course = courses.find((c) => c.id === selectedCourseId)!;
    const [year, month, day] = dueDateStr.split("-").map(Number);
    const [hour, minute] = dueTimeStr.split(":").map(Number);
    const dueDate = new Date(year, month - 1, day, hour, minute);

    const courseColor = courseColors[course.id] || course.color;

    const newAssignment: CanvasAssignment = {
      id: Date.now(), // unique numeric id
      name: title.trim(),
      dueDate,
      courseId: course.id,
      courseName: course.code,
      courseFullName: course.name,
      courseColor,
      points: points ? Number(points) : undefined,
      instructions: instructions.trim() || undefined,
      submitted: false,
    };

    addAssignment(newAssignment);
    setSubmitted(true);

    // Dispatch so calendar syncs
    window.dispatchEvent(new CustomEvent("assignmentCompleted"));

    setTimeout(() => {
      onClose();
    }, 650);
  };

  // Time display helpers
  const formatTimeLabel = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const quickTimes = ["08:00", "12:00", "17:00", "23:59"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-0"
          style={{ backgroundColor: "rgba(0,0,0,0.72)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl overflow-hidden flex flex-col"
            style={{
              backgroundColor: colors.bgCard,
              maxHeight: "92vh",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.borderPrimary }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b"
              style={{ borderColor: colors.borderPrimary }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: accentColor.primary + "25" }}
                >
                  <BookOpen className="w-4 h-4" style={{ color: accentColor.primary }} />
                </div>
                <h2 className="text-[18px] font-bold" style={{ color: colors.textPrimary }}>
                  New Assignment
                </h2>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.bgTertiary }}
              >
                <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
              </motion.button>
            </div>

            {/* Scrollable form body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5 [&::-webkit-scrollbar]:hidden">

              {/* ── Title ── */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: colors.textSecondary }}>
                  Assignment Title *
                </label>
                <input
                  ref={titleRef}
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
                  placeholder="e.g. Problem Set 6: Integrals"
                  className="w-full px-4 py-3 rounded-2xl text-[15px] outline-none transition-all"
                  style={{
                    backgroundColor: colors.bgPrimary,
                    color: colors.textPrimary,
                    border: `1.5px solid ${errors.title ? "#ef4444" : colors.borderPrimary}`,
                  }}
                />
                {errors.title && (
                  <p className="text-xs text-[#ef4444] mt-1.5 pl-1">{errors.title}</p>
                )}
              </div>

              {/* ── Course ── */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: colors.textSecondary }}>
                  Course *
                </label>
                <div ref={dropdownRef} className="relative">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setCourseDropdownOpen((p) => !p); setErrors((p) => ({ ...p, course: "" })); }}
                    className="w-full px-4 py-3 rounded-2xl flex items-center justify-between text-[15px] transition-all"
                    style={{
                      backgroundColor: colors.bgPrimary,
                      border: `1.5px solid ${errors.course ? "#ef4444" : colors.borderPrimary}`,
                      color: selectedCourse ? colors.textPrimary : colors.textSecondary,
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {selectedCourse ? (
                        <>
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: courseColors[selectedCourse.id] || selectedCourse.color }}
                          />
                          <span className="truncate">{selectedCourse.name}</span>
                        </>
                      ) : (
                        <span>Select a course…</span>
                      )}
                    </div>
                    <ChevronDown
                      className="w-4 h-4 flex-shrink-0 transition-transform"
                      style={{
                        color: colors.textSecondary,
                        transform: courseDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {courseDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-2 rounded-2xl overflow-hidden z-20 shadow-xl"
                        style={{ backgroundColor: colors.bgCard, border: `1px solid ${colors.borderPrimary}` }}
                      >
                        {courses.map((course) => {
                          const color = courseColors[course.id] || course.color;
                          const isSelected = course.id === selectedCourseId;
                          return (
                            <motion.button
                              key={course.id}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setSelectedCourseId(course.id);
                                setCourseDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left"
                              style={{
                                backgroundColor: isSelected ? accentColor.primary + "18" : "transparent",
                              }}
                            >
                              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-medium truncate" style={{ color: colors.textPrimary }}>
                                  {course.name}
                                </p>
                                <p className="text-[12px]" style={{ color: colors.textSecondary }}>
                                  {course.code}
                                </p>
                              </div>
                              {isSelected && (
                                <Check className="w-4 h-4 flex-shrink-0" style={{ color: accentColor.primary }} />
                              )}
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {errors.course && (
                  <p className="text-xs text-[#ef4444] mt-1.5 pl-1">{errors.course}</p>
                )}
              </div>

              {/* ── Due Date ── */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: colors.textSecondary }}>
                  Due Date *
                </label>
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl"
                  style={{
                    backgroundColor: colors.bgPrimary,
                    border: `1.5px solid ${errors.dueDate ? "#ef4444" : colors.borderPrimary}`,
                  }}
                >
                  <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: accentColor.primary }} />
                  <input
                    type="date"
                    value={dueDateStr}
                    onChange={(e) => { setDueDateStr(e.target.value); setErrors((p) => ({ ...p, dueDate: "" })); }}
                    className="flex-1 bg-transparent text-[15px] outline-none"
                    style={{ color: dueDateStr ? colors.textPrimary : colors.textSecondary, colorScheme: "dark" }}
                  />
                </div>
                {errors.dueDate && (
                  <p className="text-xs text-[#ef4444] mt-1.5 pl-1">{errors.dueDate}</p>
                )}
              </div>

              {/* ── Due Time ── */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: colors.textSecondary }}>
                  Due Time
                </label>
                {/* Quick-pick chips */}
                <div className="flex gap-2 mb-3">
                  {quickTimes.map((t) => (
                    <motion.button
                      key={t}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDueTimeStr(t)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        backgroundColor: dueTimeStr === t ? accentColor.primary : colors.bgPrimary,
                        color: dueTimeStr === t ? "#fff" : colors.textSecondary,
                        border: `1.5px solid ${dueTimeStr === t ? accentColor.primary : colors.borderPrimary}`,
                      }}
                    >
                      {formatTimeLabel(t)}
                    </motion.button>
                  ))}
                </div>
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl"
                  style={{ backgroundColor: colors.bgPrimary, border: `1.5px solid ${colors.borderPrimary}` }}
                >
                  <input
                    type="time"
                    value={dueTimeStr}
                    onChange={(e) => setDueTimeStr(e.target.value)}
                    className="w-full bg-transparent text-[15px] outline-none"
                    style={{ color: colors.textPrimary, colorScheme: "dark" }}
                  />
                </div>
              </div>

              {/* ── Points ── */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: colors.textSecondary }}>
                  Points Possible
                </label>
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl"
                  style={{ backgroundColor: colors.bgPrimary, border: `1.5px solid ${colors.borderPrimary}` }}
                >
                  <Hash className="w-4 h-4 flex-shrink-0" style={{ color: accentColor.primary }} />
                  <input
                    type="number"
                    min="0"
                    max="9999"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    placeholder="e.g. 100"
                    className="flex-1 bg-transparent text-[15px] outline-none"
                    style={{ color: colors.textPrimary }}
                  />
                  {points && (
                    <span className="text-sm" style={{ color: colors.textSecondary }}>pts</span>
                  )}
                </div>
              </div>

              {/* ── Instructions ── */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: colors.textSecondary }}>
                  Instructions
                </label>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: colors.bgPrimary, border: `1.5px solid ${colors.borderPrimary}` }}
                >
                  <div className="flex items-start gap-2 px-4 pt-3.5 pb-1">
                    <AlignLeft className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accentColor.primary }} />
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Add assignment details, instructions, or notes…"
                      rows={4}
                      className="flex-1 bg-transparent text-[15px] outline-none resize-none leading-relaxed"
                      style={{ color: colors.textPrimary }}
                    />
                  </div>
                  <div className="px-4 pb-2 text-right">
                    <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                      {instructions.length} characters
                    </span>
                  </div>
                </div>
              </div>

              {/* bottom spacer */}
              <div className="h-2" />
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 flex gap-3 flex-shrink-0 border-t"
              style={{ borderColor: colors.borderPrimary, backgroundColor: colors.bgCard }}
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl text-[15px] font-semibold"
                style={{ backgroundColor: colors.bgTertiary, color: colors.textSecondary }}
              >
                Cancel
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="flex-[2] py-3.5 rounded-2xl text-[15px] font-semibold text-white flex items-center justify-center gap-2"
                style={{
                  background: submitted
                    ? "linear-gradient(135deg, #22c55e, #16a34a)"
                    : `linear-gradient(135deg, ${accentColor.primary}, ${accentColor.primary}cc)`,
                  boxShadow: `0 4px 20px ${accentColor.primary}40`,
                }}
              >
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="done"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" strokeWidth={3} />
                      Added!
                    </motion.div>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      Add Assignment
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}