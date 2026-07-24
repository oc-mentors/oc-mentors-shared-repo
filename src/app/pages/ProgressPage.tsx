import { Link, useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Trophy } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const achievements: { id: number; title: string; date: string; icon: string }[] = [];

export default function ProgressPage() {
  const { colors, accentColor, mode } = useTheme();
  const navigate = useNavigate();

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
          </div>

          <div>
            <h1 className="text-[28px] font-bold" style={{ color: colors.textPrimary }}>
              Progress
            </h1>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: colors.textTertiary }}>
              Socratic OC
            </p>
          </div>
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
                  <div className="text-[44px] font-bold leading-tight" style={{ color: mode === "dark" ? "white" : "black" }}>0</div>
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

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
                  transition={{ delay: 0.2 + index * 0.1 }}
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

      <BottomNav currentPage="progress" />
    </div>
  );
}
