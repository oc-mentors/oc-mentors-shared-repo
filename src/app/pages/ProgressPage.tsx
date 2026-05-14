import { Link, useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, TrendingUp, Award, Target, CheckCircle, BookOpen, ArrowRight, Trophy, RefreshCw, ExternalLink } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useCanvasCourses } from "../contexts/CanvasCoursesContext";
import { useCanvasAuth } from "../contexts/CanvasAuthContext";
import { useAllCourseColors } from "../hooks/useCourseColor";
import { CanvasLoginPromptModal } from "../components/CanvasLoginPromptModal";

const achievements: { id: number; title: string; date: string; icon: string }[] = [];

function ProgressBar({ percentage, color }: { percentage: number; color: string }) {
  return (
    <div className="w-full h-2 bg-[rgba(91,124,235,0.15)] rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      />
    </div>
  );
}

export default function ProgressPage() {
  const [expandedSubject, setExpandedSubject] = useState<number | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { colors, accentColor, mode } = useTheme();
  const navigate = useNavigate();
  const { courses, refreshCourses, isRefreshing, lastRefreshed } = useCanvasCourses();
  const { isCanvasConnected } = useCanvasAuth();
  const courseColors = useAllCourseColors();
  const { isCourseIgnored } = useCanvasCourses();

  const visibleCourses = courses.filter((c) => !isCourseIgnored(c.id));

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
    
    if (expandedSubject === courseId) {
      // Second click - navigate to Canvas classes page
      navigate("/canvas-classes");
    } else {
      // First click - expand details
      setExpandedSubject(courseId);
    }
  };

  const handleOpenInCanvas = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCanvasConnected) {
      setShowLoginPrompt(true);
      return;
    }
    navigate("/canvas-classes");
  };

  // Calculate total lessons
  const totalLessons = visibleCourses.reduce((sum, course) => sum + (course.lessonsCompleted || 0), 0);

  return (
    <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-12 pb-3"
        >
          <div className="flex items-center justify-between mb-2">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: colors.bgTertiary }}
            >
              <ArrowLeft className="w-6 h-6" style={{ color: colors.textPrimary }} />
            </motion.button>
            {/* ProfileButton removed — subpage */}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-bold" style={{ color: colors.textPrimary }}>
                Academic Info
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
              className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: colors.bgTertiary }}
            >
              <RefreshCw 
                className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
                style={{ color: accentColor.primary }} 
              />
            </motion.button>
          </div>
          
          {isCanvasConnected && lastRefreshed && (
            <p className="text-[12px] mt-1" style={{ color: colors.textSecondary }}>
              Last updated: {new Date(lastRefreshed).toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: '2-digit' 
              })}
            </p>
          )}
          
          {!isCanvasConnected && (
            <p className="text-[12px] mt-1" style={{ color: "#e13f2b" }}>
              Canvas not connected • Sign in to sync courses
            </p>
          )}
        </motion.div>

        {/* Learning Journey Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 mb-6"
        >
          <Link to="/learning-quiz">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-3xl p-6 shadow-lg cursor-pointer"
              style={{ background: `linear-gradient(to bottom right, ${accentColor.primary}, ${accentColor.icon})` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5" style={{ color: mode === "dark" ? "white" : "black" }} />
                <span className="font-semibold" style={{ color: mode === "dark" ? "white" : "black" }}>Your Learning Journey</span>
              </div>
              <div className="flex items-center justify-around">
                <div>
                  <div className="text-[44px] font-bold leading-tight" style={{ color: mode === "dark" ? "white" : "black" }}>{totalLessons}</div>
                  <div className="text-sm" style={{ color: mode === "dark" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)" }}>Lessons Completed</div>
                </div>
                <div className="w-px h-16" style={{ backgroundColor: mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)" }} />
                <div>
                  <div className="text-[44px] font-bold leading-tight" style={{ color: mode === "dark" ? "white" : "black" }}>0hrs</div>
                  <div className="text-sm" style={{ color: mode === "dark" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)" }}>Total Study Time</div>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Subject Progress from Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>My Courses</h2>
            {isCanvasConnected ? (
              <Link to="/canvas-classes">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1.5 rounded-lg text-[13px] font-medium"
                  style={{ 
                    backgroundColor: accentColor.background,
                    color: accentColor.primary
                  }}
                >
                  View All
                </motion.button>
              </Link>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLoginPrompt(true)}
                className="px-3 py-1.5 rounded-lg text-[13px] font-medium"
                style={{ 
                  backgroundColor: "#e13f2b20",
                  color: "#e13f2b"
                }}
              >
                Connect Canvas
              </motion.button>
            )}
          </div>
          <div className="space-y-3">
            {visibleCourses.length === 0 ? (
              <p className="text-sm rounded-2xl p-5 border" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary, color: colors.textSecondary }}>
                No courses yet. Connect Canvas and refresh to sync your classes.
              </p>
            ) : (
            visibleCourses.map((course, index) => {
              const IconComponent = course.icon;
              const courseColor = courseColors[course.id] || course.color;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleCourseClick(course.id)}
                  className="rounded-2xl p-5 cursor-pointer border"
                  style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: courseColor }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold mb-1 truncate" style={{ color: colors.textPrimary }}>
                        {course.code}
                      </h3>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        {course.lessonsCompleted || 0} lessons completed
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold" style={{ color: courseColor }}>
                        {course.progress || 0}%
                      </div>
                      {expandedSubject === course.id && (
                        <ExternalLink className="w-4 h-4" style={{ color: accentColor.primary }} />
                      )}
                    </div>
                  </div>
                  <ProgressBar percentage={course.progress || 0} color={courseColor} />
                  
                  {/* Expanded Details */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: expandedSubject === course.id ? "auto" : 0,
                      opacity: expandedSubject === course.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.borderPrimary }}>
                      <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>Recent activities:</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color: colors.textPrimary }}>Lesson {course.lessonsCompleted || 0}</span>
                          <span style={{ color: accentColor.primary }}>Completed</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color: colors.textPrimary }}>Quiz {(course.lessonsCompleted || 1) - 1}</span>
                          <span style={{ color: accentColor.primary }}>95% Score</span>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-3 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                        style={{ backgroundColor: accentColor.primary }}
                        onClick={handleOpenInCanvas}
                      >
                        <span className="text-sm font-medium text-white">
                          {isCanvasConnected ? "Open in Canvas" : "Connect Canvas"}
                        </span>
                        <ExternalLink className="w-4 h-4 text-white" />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })
            )}
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Recent Achievements</h2>
          <div className="space-y-3">
            {achievements.length === 0 ? (
              <p className="text-sm rounded-2xl p-5 border" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary, color: colors.textSecondary }}>
                Achievements will appear here as you complete lessons and quizzes.
              </p>
            ) : (
              achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="rounded-2xl p-4 border cursor-pointer"
                  style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[15px] font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        {achievement.title}
                      </h3>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>{achievement.date}</p>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor.primary }} />
                    </motion.div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <BottomNav currentPage="profile" />
      <CanvasLoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
}