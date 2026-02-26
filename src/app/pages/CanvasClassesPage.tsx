import { useTheme } from "../contexts/ThemeContext";
import { useAllCourseColors } from "../hooks/useCourseColor";
import { useCanvasCourses } from "../contexts/CanvasCoursesContext";
import { useCanvasAuth } from "../contexts/CanvasAuthContext";
import { ChevronRight } from "../components/ChevronRight";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Bell, FileText, Settings, RefreshCw, ExternalLink, AlertCircle } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { CanvasLoginPromptModal } from "../components/CanvasLoginPromptModal";
import { useState } from "react";

export default function CanvasClassesPage() {
  const { colors, accentColor } = useTheme();
  const courseColors = useAllCourseColors();
  const { courses, refreshCourses, isRefreshing, lastRefreshed } = useCanvasCourses();
  const { isCanvasConnected } = useCanvasAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleRefresh = async () => {
    if (!isCanvasConnected) {
      setShowLoginPrompt(true);
      return;
    }
    await refreshCourses();
  };

  const handleCourseClick = (courseId: number) => {
    if (!isCanvasConnected) {
      setShowLoginPrompt(true);
      return;
    }
    // Navigate to course detail or open external Canvas link
    // For now, we'll show a message that it would open the course
    console.log(`Opening Canvas course ${courseId}`);
  };

  return (
    <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Canvas</h1>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: colors.bgTertiary }}
              >
                <RefreshCw 
                  className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
                  style={{ color: accentColor.primary }} 
                />
              </motion.button>
              <ProfileButton />
            </div>
          </div>
          
          {isCanvasConnected && lastRefreshed && (
            <p className="text-[12px] mb-6" style={{ color: colors.textSecondary }}>
              Last updated: {new Date(lastRefreshed).toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: '2-digit' 
              })}
            </p>
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
            {courses.map((course, index) => {
              const IconComponent = course.icon;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleCourseClick(course.id)}
                  className="rounded-2xl p-5 border shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
                  style={{ 
                    backgroundColor: colors.bgCard, 
                    borderColor: colors.borderPrimary,
                    opacity: !isCanvasConnected ? 0.6 : 1
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: courseColors[course.id] || course.color }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold mb-1 truncate" style={{ color: colors.textPrimary }}>
                        {course.name}
                      </h3>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>{course.code}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCanvasConnected && (
                        <ExternalLink className="w-4 h-4" style={{ color: accentColor.primary }} />
                      )}
                      <Link to={`/course/${course.id}/notifications`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg transition-colors"
                          style={{ backgroundColor: colors.bgTertiary }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Settings className="w-5 h-5" style={{ color: colors.textSecondary }} />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav currentPage="canvas" />
      <CanvasLoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
}