import { Link, useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import svgPaths from "../../imports/svg-ncbm4ttepm";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronRight, TrendingUp, Target, Settings, HelpCircle, LogOut, Eye, Ear, BookOpen, Hand, RefreshCw } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useState, useEffect } from "react";
import { LogoutConfirmModal } from "../components/LogoutConfirmModal";
import { LogoutAnimation } from "../components/LogoutAnimation";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { colors, accentColor } = useTheme();
  const [learningStyle, setLearningStyle] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("learningStyleResult");
    setLearningStyle(saved);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    setIsLoggingOut(true);
    
    // Wait for animation to play
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">
        {/* Header with Back Button */}
        <div className="px-6 pt-3 pb-2">
          <Link to="/profile">
            <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: colors.bgCard }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
            </motion.button>
          </Link>
        </div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-8 pb-8 flex flex-col items-center"
        >
          {/* Profile Image with Edit Badge */}
          <div className="relative mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1729691031378-d63d7e81bb38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHlvdW5nJTIwd29tYW4lMjBzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwOTI5Mzk2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Nora Anderson"
                className="w-[130px] h-[130px] rounded-3xl object-cover shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
            {/* Edit Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute bottom-0 right-0 w-9 h-9 rounded-2xl shadow-[0px_4px_24px_0px_rgba(91,124,235,0.25)] flex items-center justify-center"
              style={{ 
                background: `linear-gradient(to bottom right, ${accentColor.primary}, ${accentColor.hover})` 
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 18 18">
                <path
                  d={svgPaths.p1252e600}
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.67"
                />
              </svg>
            </motion.div>
          </div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[30px] font-bold mb-2"
            style={{ color: colors.textPrimary }}
          >
            {user?.name || "Nora Anderson"}
          </motion.h1>

          {/* University or Role */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-[14px] mb-1"
            style={{ color: colors.textSecondary }}
          >
            {user?.role === "tutor" || user?.role === "admin"
              ? "Professional Tutor"
              : "University of California, Irvine"}
          </motion.p>

          {/* Major & Year or Subjects */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[13px] mb-4"
            style={{ color: colors.textSecondary }}
          >
            {user?.role === "tutor" || user?.role === "admin"
              ? "Chemistry • Math • Physics"
              : "Computer Science • 2nd Year"}
          </motion.p>

          {/* Member Since Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="px-4 py-[6px] rounded-full"
            style={{ backgroundColor: colors.bgTertiary }}
          >
            <p className="text-[11px]" style={{ color: colors.textSecondary }}>Member since September 2023</p>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 mb-6"
        >
          <div className="grid grid-cols-3 gap-3">
            {/* Lessons Taken / Sessions Taught */}
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: colors.bgCard }}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#51a2ff] to-[#155dfc] flex items-center justify-center mb-3">
                <span className="text-white text-[16px] font-bold">
                  {user?.role === "tutor" || user?.role === "admin" ? "69" : "16"}
                </span>
              </div>
              <p className="text-[11px] leading-tight text-center" style={{ color: colors.textSecondary }}>
                {user?.role === "tutor" || user?.role === "admin" ? "Sessions Taught" : "Lessons Taken"}
              </p>
            </motion.div>

            {/* Hours Studied / Hours Taught */}
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: colors.bgCard }}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c27aff] to-[#9810fa] flex items-center justify-center mb-3">
                <span className="text-white text-[16px] font-bold">
                  {user?.role === "tutor" || user?.role === "admin" ? "103" : "24"}
                </span>
              </div>
              <p className="text-[11px] leading-tight text-center" style={{ color: colors.textSecondary }}>
                {user?.role === "tutor" || user?.role === "admin" ? "Hours Taught" : "Hours Studied"}
              </p>
            </motion.div>

            {/* Current GPA / Rating */}
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: colors.bgCard }}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#fb64b6] to-[#e60076] flex items-center justify-center mb-3">
                <span className="text-white text-[16px] font-bold">
                  {user?.role === "tutor" || user?.role === "admin" ? "4.8" : "3.7"}
                </span>
              </div>
              <p className="text-[11px] leading-tight text-center" style={{ color: colors.textSecondary }}>
                {user?.role === "tutor" || user?.role === "admin" ? "Avg Rating" : "Current GPA"}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 flex flex-col gap-5"
        >
          {/* Track Progress */}
          <Link to="/progress">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
              style={{ backgroundColor: colors.bgCard }}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                  <TrendingUp className="w-5 h-5" style={{ color: accentColor.primary }} />
                </div>
                <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Track Progress</span>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
            </motion.div>
          </Link>

          {/* Take Learning Style Quiz / Learning Style Result */}
          {learningStyle ? (
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
              style={{ backgroundColor: colors.bgCard }}
            >
              <Link to="/learning-quiz" className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accentColor.primary}20` }}>
                  {learningStyle === "Visual" && <Eye className="w-5 h-5" style={{ color: accentColor.primary }} />}
                  {learningStyle === "Auditory" && <Ear className="w-5 h-5" style={{ color: accentColor.primary }} />}
                  {learningStyle === "Reading/Writing" && <BookOpen className="w-5 h-5" style={{ color: accentColor.primary }} />}
                  {learningStyle === "Kinesthetic" && <Hand className="w-5 h-5" style={{ color: accentColor.primary }} />}
                </div>
                <span className="text-[15px] font-medium truncate" style={{ color: colors.textPrimary }}>
                  {learningStyle} Learner
                </span>
              </Link>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to="/learning-quiz?retake=true">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.bgTertiary }}
                  >
                    <RefreshCw className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </motion.div>
                </Link>
                <Link to="/learning-quiz">
                  <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
                </Link>
              </div>
            </motion.div>
          ) : (
            <Link to="/learning-quiz">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
                style={{ backgroundColor: colors.bgCard }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                    <Target className="w-5 h-5 text-[#AD46FF]" />
                  </div>
                  <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>
                    Take Learning Style Quiz
                  </span>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
              </motion.div>
            </Link>
          )}

          {/* Settings */}
          <Link to="/settings">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between"
              style={{ backgroundColor: colors.bgCard }}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                  <Settings className="w-5 h-5" style={{ color: colors.textSecondary }} />
                </div>
                <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Settings</span>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
            </motion.div>
          </Link>

          {/* Help & Support */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between cursor-pointer"
            style={{ backgroundColor: colors.bgCard }}
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                <HelpCircle className="w-5 h-5 text-[#FF9500]" />
              </div>
              <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Help & Support</span>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
          </motion.div>

          {/* Logout */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogoutClick}
            className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] flex items-center justify-between cursor-pointer"
            style={{ backgroundColor: colors.bgCard }}
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.bgTertiary }}>
                <LogOut className="w-5 h-5 text-[#FF453A]" />
              </div>
              <span className="text-[15px] font-medium" style={{ color: colors.textPrimary }}>Logout</span>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: colors.textSecondary }} />
          </motion.div>
        </motion.div>
      </div>

      <BottomNav />
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
      <AnimatePresence>
        {isLoggingOut && <LogoutAnimation />}
      </AnimatePresence>
    </div>
  );
}