import { useCanvasCourses } from "../contexts/CanvasCoursesContext";
import { canvasCourses } from "../data/courses";
import { useScrollLock } from "../hooks/useScrollLock";
import { Link, useParams, useNavigate } from "react-router";
import { ArrowLeft, Bell, BellOff, Palette, Check, EyeOff, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BottomNav } from "../components/BottomNav";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { useTheme, accentColors } from "../contexts/ThemeContext";
import { useCourseColor } from "../hooks/useCourseColor";

interface NotificationSettings {
  announcements: boolean;
  assignmentDeadlines: boolean;
  assignmentSubmissions: boolean;
  gradeUpdates: boolean;
  quizReminders: boolean;
}

const defaultSettings: NotificationSettings = {
  announcements: true,
  assignmentDeadlines: true,
  assignmentSubmissions: true,
  gradeUpdates: true,
  quizReminders: true,
};

const notificationOptions = [
  {
    key: "announcements" as keyof NotificationSettings,
    title: "Class Announcements",
    description: "Get notified when instructors post announcements",
  },
  {
    key: "assignmentDeadlines" as keyof NotificationSettings,
    title: "Assignment Deadlines",
    description: "Reminders for upcoming assignment due dates",
  },
  {
    key: "assignmentSubmissions" as keyof NotificationSettings,
    title: "Submission Confirmations",
    description: "Confirmation when assignments are submitted",
  },
  {
    key: "gradeUpdates" as keyof NotificationSettings,
    title: "Grade Updates",
    description: "New grades and feedback on assignments",
  },
  {
    key: "quizReminders" as keyof NotificationSettings,
    title: "Quiz Reminders",
    description: "Reminders for upcoming quizzes and exams",
  },
];

export default function CourseNotificationSettingsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { accentColor } = useTheme();
  const course = canvasCourses.find((c) => c.id === Number(courseId));
  const [courseColor, setCourseColorValue] = useCourseColor(Number(courseId) || 1);
  const { isCourseIgnored, ignoreCourse, unignoreCourse } = useCanvasCourses();
  const courseIdNum = Number(courseId) || 1;
  const ignored = isCourseIgnored(courseIdNum);
  const [showIgnoreConfirm, setShowIgnoreConfirm] = useState(false);

  useScrollLock(showIgnoreConfirm);

  const handleIgnoreToggle = () => {
    if (!ignored) {
      setShowIgnoreConfirm(true);
    } else {
      unignoreCourse(courseIdNum);
    }
  };

  const confirmIgnore = () => {
    ignoreCourse(courseIdNum);
    setShowIgnoreConfirm(false);
  };

  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [allEnabled, setAllEnabled] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (courseId) {
      const saved = localStorage.getItem(`courseNotifications_${courseId}`);
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings(parsedSettings);
        setAllEnabled(Object.values(parsedSettings).every((val) => val === true));
      } else {
        setAllEnabled(Object.values(defaultSettings).every((val) => val === true));
      }
    }
  }, [courseId]);

  // Save settings to localStorage
  const saveSettings = (newSettings: NotificationSettings) => {
    if (courseId) {
      localStorage.setItem(`courseNotifications_${courseId}`, JSON.stringify(newSettings));
      setSettings(newSettings);
      setAllEnabled(Object.values(newSettings).every((val) => val === true));
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const toggleAll = () => {
    const newState = !allEnabled;
    const newSettings: NotificationSettings = {
      announcements: newState,
      assignmentDeadlines: newState,
      assignmentSubmissions: newState,
      gradeUpdates: newState,
      quizReminders: newState,
    };
    saveSettings(newSettings);
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-[#1a1d29] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-[#e8edf5] mb-4">Course not found</h2>
          <Link to="/canvas-classes" className="text-[#5b7ceb]">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d29] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-3">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-[#e8edf5]">Notifications</h1>
          </div>

          {/* Course Info */}
          <div className="bg-[#1e2139] rounded-2xl p-5 mb-6 border border-[rgba(255,255,255,0.12)]">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                style={{ backgroundColor: courseColor }}
              >
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-[#e8edf5] mb-1">
                  {course.name}
                </h2>
                <p className="text-sm text-[#a8b3cf]">{course.code}</p>
              </div>
            </div>
          </div>

          {/* Course Visibility */}
          <h3 className="text-sm font-semibold text-[#a8b3cf] mb-3 uppercase tracking-wider">
            Course Visibility
          </h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border overflow-hidden mb-6"
            style={{
              backgroundColor: ignored ? "rgba(239,68,68,0.08)" : "#1e2139",
              borderColor: ignored ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.12)",
            }}
          >
            <div className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                    style={{ backgroundColor: ignored ? "rgba(239,68,68,0.15)" : "#2a2f45" }}
                  >
                    {ignored
                      ? <EyeOff className="w-5 h-5" style={{ color: "#ef4444" }} />
                      : <Eye className="w-5 h-5 text-[#a8b3cf]" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-[#e8edf5]">
                      Ignore Course
                    </p>
                    <p className="text-[12px] mt-0.5 text-[#a8b3cf]">
                      {ignored
                        ? "Hidden from classes, assignments & home"
                        : "Hide this course everywhere in the app"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleIgnoreToggle}
                  className="relative w-[51px] h-[31px] rounded-full transition-colors flex-shrink-0"
                  style={{ backgroundColor: ignored ? "#ef4444" : "#2a2f45" }}
                >
                  <motion.div
                    animate={{ x: ignored ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-[3px] top-[3px] w-[25px] h-[25px] bg-white rounded-full shadow-md"
                  />
                </button>
              </div>

              {ignored && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-[rgba(239,68,68,0.2)]"
                >
                  <p className="text-[12px] text-[#ef4444] leading-relaxed">
                    This course is currently hidden. It won't appear in My Classes, Assignments, Announcements, or the subject picker on Home. Toggle off to restore it.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Settings sections — greyed out when course is ignored */}
          <div
            className="transition-opacity duration-300"
            style={{ opacity: ignored ? 0.35 : 1, pointerEvents: ignored ? "none" : "auto" }}
          >
          {/* Enable All Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#5b7ceb]/10 to-[#14b8a6]/10 rounded-2xl p-5 mb-6 border border-[rgba(91,124,235,0.2)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {allEnabled ? (
                  <Bell className="w-5 h-5 text-[#5b7ceb]" />
                ) : (
                  <BellOff className="w-5 h-5 text-[#a8b3cf]" />
                )}
                <div>
                  <h3 className="text-base font-semibold text-[#e8edf5]">
                    {allEnabled ? "All Notifications On" : "Enable All"}
                  </h3>
                  <p className="text-sm text-[#a8b3cf]">
                    {allEnabled
                      ? "You'll receive all notifications"
                      : "Turn on all notification types"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleAll}
                className="relative w-14 h-8 rounded-full transition-colors"
                style={{
                  backgroundColor: allEnabled ? "#5b7ceb" : "#2a2f45",
                }}
              >
                <motion.div
                  className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{
                    x: allEnabled ? 24 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <h3 className="text-sm font-semibold text-[#a8b3cf] mb-3 uppercase tracking-wider">
            Notification Types
          </h3>
          <div className="space-y-3">
            {notificationOptions.map((option, index) => (
              <motion.div
                key={option.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-[#1e2139] rounded-2xl p-4 border border-[rgba(255,255,255,0.12)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <h4 className="text-base font-semibold text-[#e8edf5] mb-1">
                      {option.title}
                    </h4>
                    <p className="text-sm text-[#a8b3cf]">{option.description}</p>
                  </div>
                  <button
                    onClick={() => toggleSetting(option.key)}
                    className="relative w-12 h-7 rounded-full transition-colors flex-shrink-0"
                    style={{
                      backgroundColor: settings[option.key] ? "#5b7ceb" : "#2a2f45",
                    }}
                  >
                    <motion.div
                      className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                      animate={{
                        x: settings[option.key] ? 20 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Course Color */}
          <h3 className="text-sm font-semibold text-[#a8b3cf] mb-3 mt-6 uppercase tracking-wider">
            Course Color
          </h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1e2139] rounded-2xl p-5 border border-[rgba(255,255,255,0.12)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-[#a8b3cf]" />
              <p className="text-sm text-[#a8b3cf]">Choose a color for this course</p>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {accentColors.map((ac) => {
                const isSelected = courseColor === ac.primary;
                return (
                  <motion.button
                    key={ac.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCourseColorValue(ac.primary)}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        backgroundColor: ac.primary,
                        boxShadow: isSelected ? `0 0 0 3px #1e2139, 0 0 0 5px ${ac.primary}` : "none",
                      }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-[10px] text-[#a8b3cf]">{ac.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Info Note */}
          <div className="mt-6 bg-[#1e2139] rounded-xl p-4 border border-[rgba(255,255,255,0.08)]">
            <p className="text-xs text-[#a8b3cf] leading-relaxed">
              <span className="font-semibold text-[#e8edf5]">Note:</span> These settings only
              apply to {course.code}. You can customize settings for each course
              individually.
            </p>
          </div>
          </div>

          {/* Confirm Ignore Modal */}
          <AnimatePresence>
            {showIgnoreConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8"
                style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                onClick={() => setShowIgnoreConfirm(false)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 60 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-md rounded-3xl p-6"
                  style={{ backgroundColor: "#1e2139", border: "1px solid rgba(239,68,68,0.3)" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(239,68,68,0.15)" }}>
                      <EyeOff className="w-5 h-5" style={{ color: "#ef4444" }} />
                    </div>
                    <h3 className="text-[16px] font-bold text-[#e8edf5]">Ignore {course?.code}?</h3>
                  </div>
                  <p className="text-[13px] text-[#a8b3cf] mb-6 leading-relaxed">
                    This course will be hidden from My Classes, Assignments, Announcements, and the subject picker on the Home screen. You can restore it anytime from these settings.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowIgnoreConfirm(false)}
                      className="flex-1 py-3 rounded-2xl text-[14px] font-semibold text-[#a8b3cf]"
                      style={{ backgroundColor: "#2a2f45" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmIgnore}
                      className="flex-1 py-3 rounded-2xl text-[14px] font-semibold text-white"
                      style={{ backgroundColor: "#ef4444" }}
                    >
                      Ignore Course
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BottomNav currentPage="canvas" />
    </div>
  );
}