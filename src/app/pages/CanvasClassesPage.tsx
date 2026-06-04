import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";
import { useAllCourseColors } from "../hooks/useCourseColor";
import { useCanvasCourses } from "../contexts/CanvasCoursesContext";
import { useCanvasAuth } from "../contexts/CanvasAuthContext";
import { ChevronRight } from "../components/ChevronRight";
import { Link, useNavigate } from "react-router";
import { Bell, FileText, Settings, RefreshCw, ExternalLink, AlertCircle, EyeOff } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { CanvasLoginPromptModal } from "../components/CanvasLoginPromptModal";
import { CanvasLogoutButton } from "../components/CanvasLogoutButton";
import { useState, useRef } from "react";

export default function CanvasClassesPage() {
  const { colors, accentColor } = useTheme();
  const courseColors = useAllCourseColors();
  const { courses, refreshCourses, isRefreshing, lastRefreshed, isCourseIgnored } = useCanvasCourses();
  const { isCanvasConnected } = useCanvasAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showTopFade, setShowTopFade] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleContentScroll = () => {
    if (scrollContainerRef.current) {
      setShowTopFade(scrollContainerRef.current.scrollTop > 0);
    }
  };

  // Show ALL courses — ignored ones appear grayed out and sink to the bottom
  const sortedCourses = [...courses].sort((a, b) => {
    const aIgnored = isCourseIgnored(a.id) ? 1 : 0;
    const bIgnored = isCourseIgnored(b.id) ? 1 : 0;
    return aIgnored - bIgnored;
  });

  const handleRefresh = async () => {
    if (!isCanvasConnected) {
      setShowLoginPrompt(true);
      return;
    }
    await refreshCourses();
  };

  const handleCourseClick = (courseId: number) => {
    if (isCourseIgnored(courseId)) return; // ignored — only settings icon is actionable
    if (!isCanvasConnected) {
      setShowLoginPrompt(true);
      return;
    }
    console.log(`Opening Canvas course ${courseId}`);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-12 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-[28px] font-bold" style={{ color: colors.textPrimary }}>
                  Canvas
                </h1>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: colors.textTertiary }}>
                  Socratic OC
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: colors.bgTertiary }}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                  style={{ color: accentColor.primary }}
                />
              </motion.button>
            </div>
            <ProfileButton />
          </div>
        </div>

        {/* Scrollable Content */}
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
            ref={scrollContainerRef}
            onScroll={handleContentScroll}
            className="h-full overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            <div className="px-6 pt-4">
              {isCanvasConnected && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-2xl border"
                  style={{
                    backgroundColor: colors.bgCard,
                    borderColor: colors.borderPrimary,
                  }}
                >
                  <p className="text-[14px] font-medium mb-1" style={{ color: colors.textPrimary }}>
                    Canvas connected
                  </p>
                  {lastRefreshed && (
                    <p className="text-[12px] mb-3" style={{ color: colors.textSecondary }}>
                      Last updated:{" "}
                      {new Date(lastRefreshed).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                  <CanvasLogoutButton />
                </motion.div>
              )}

              {!isCanvasConnected && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-2xl border"
                  style={{ 
                    backgroundColor: "#e13f2b10",
                    borderColor: "#e13f2b30"
                  }}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#e13f2b" }} />
                    <div className="flex-1">
                      <p className="text-[14px] font-medium mb-1" style={{ color: "#e13f2b" }}>
                        Canvas Not Connected
                      </p>
                      <p className="text-[12px] mb-3" style={{ color: colors.textSecondary }}>
                        Sign in to view your courses, assignments, and announcements.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/canvas-login")}
                        className="px-4 py-2 rounded-lg text-[13px] font-medium text-white"
                        style={{ backgroundColor: "#e13f2b" }}
                      >
                        Connect Canvas
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Announcements Section */}
              <Link to="/announcements">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-2xl px-5 py-4 mb-3 border shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
                  style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accentColor.primary }}>
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-0.5" style={{ color: colors.textPrimary }}>
                        Announcements
                      </h3>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>View course updates and news</p>
                    </div>
                    <div style={{ color: colors.textSecondary }} className="opacity-50">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Assignments Section */}
              <Link to="/assignments">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-2xl px-5 py-4 mb-6 border shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
                  style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accentColor.primary }}>
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-0.5" style={{ color: colors.textPrimary }}>
                        Assignments
                      </h3>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>View upcoming assignments</p>
                    </div>
                    <div style={{ color: colors.textSecondary }} className="opacity-50">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>

            {/* Courses Section */}
            <div className="px-6">
              <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>My Classes</h2>
              <div className="space-y-3">
                {sortedCourses.length === 0 ? (
                  <p className="text-sm rounded-2xl p-5 border" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary, color: colors.textSecondary }}>
                    {isCanvasConnected
                      ? "No classes loaded yet. Tap refresh above after connecting Canvas."
                      : "Connect Canvas to import your courses."}
                  </p>
                ) : (
                sortedCourses.map((course, index) => {
                  const IconComponent = course.icon;
                  const ignored = isCourseIgnored(course.id);
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      whileHover={{ scale: ignored ? 1 : 1.01 }}
                      onClick={() => handleCourseClick(course.id)}
                      className="rounded-2xl p-5 border shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-300"
                      style={{ 
                        backgroundColor: ignored ? "rgba(239,68,68,0.06)" : colors.bgCard,
                        borderColor: ignored ? "rgba(239,68,68,0.35)" : colors.borderPrimary,
                        cursor: ignored ? "default" : "pointer",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Course icon — desaturated when ignored */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                          style={{
                            backgroundColor: ignored
                              ? "rgba(100,100,100,0.25)"
                              : courseColors[course.id] || course.color,
                            filter: ignored ? "grayscale(1)" : "none",
                          }}
                        >
                          <IconComponent
                            className="w-6 h-6"
                            style={{ color: ignored ? "rgba(180,180,180,0.7)" : "white" }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className="text-base font-semibold truncate transition-colors duration-300"
                              style={{ color: ignored ? "rgba(239,68,68,0.75)" : colors.textPrimary }}
                            >
                              {course.name}
                            </h3>
                          </div>
                          {ignored ? (
                            <div className="flex items-center gap-1.5">
                              <EyeOff className="w-3 h-3 flex-shrink-0" style={{ color: "#ef4444" }} />
                              <p className="text-[12px] font-medium" style={{ color: "#ef4444" }}>
                                Ignored — tap settings to restore
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm" style={{ color: colors.textSecondary }}>{course.code}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {isCanvasConnected && !ignored && (
                            <ExternalLink className="w-4 h-4" style={{ color: accentColor.primary }} />
                          )}
                          <Link to={`/course/${course.id}/notifications`}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg transition-colors"
                              style={{
                                backgroundColor: ignored
                                  ? "rgba(239,68,68,0.15)"
                                  : colors.bgTertiary,
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Settings
                                className="w-5 h-5"
                                style={{ color: ignored ? "#ef4444" : colors.textSecondary }}
                              />
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav currentPage="canvas" />
      <CanvasLoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
}