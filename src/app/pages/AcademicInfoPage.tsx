import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { WindowScrollFade } from "../components/WindowScrollFade";
import { AvatarWithInitials } from "../components/AvatarWithInitials";
import { motion } from "motion/react";
import {
  ArrowLeft, GraduationCap, BookOpen, Calendar,
  User, Building2,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export default function AcademicInfoPage() {
  const { colors, accentColor } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const academicInfo = {
    age: 20,
    major: user?.major?.length ? user.major.join(", ") : "—",
    year: user?.year || "—",
    school: user?.university || "—",
    expectedGrad: "June 2027",
    gpa: "—",
  };

  return (
    <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-12 pb-3"
        >
            <div className="flex items-start gap-3 mb-2">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0"
              style={{ backgroundColor: colors.bgTertiary }}
            >
              <ArrowLeft className="w-6 h-6" style={{ color: colors.textPrimary }} />
            </motion.button>
            <div>
              <h1 className="text-[28px] font-bold" style={{ color: colors.textPrimary }}>
                Academic Information
              </h1>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: colors.textTertiary }}>
                Socratic OC
              </p>
            </div>
          </div>
        </motion.div>

        {/* Student Identity Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="px-6 mb-5"
        >
          <div
            className="rounded-2xl p-5 border shadow-[0px_4px_16px_0px_rgba(0,0,0,0.4)]"
            style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
          >
            <div className="flex items-center gap-4">
              <AvatarWithInitials
                src={user?.avatar}
                firstName={user?.firstName}
                lastName={user?.lastName}
                name={user?.name}
                className="w-16 h-16 rounded-2xl object-cover text-[22px] flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold truncate" style={{ color: colors.textPrimary }}>
                  {user?.name || "Nora Anderson"}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.textSecondary }} />
                  <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
                    {academicInfo.school}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.textSecondary }} />
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    {user?.email || "nora@uci.edu"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Academic Details Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 mb-5"
        >
          <h2 className="text-[13px] font-semibold uppercase tracking-wider mb-3" style={{ color: colors.textSecondary }}>
            Academic Details
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-2xl p-4 border"
              style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4" style={{ color: accentColor.primary }} />
                <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary }}>Major</span>
              </div>
              <p className="text-sm font-semibold leading-tight" style={{ color: colors.textPrimary }}>
                {academicInfo.major}
              </p>
            </div>
            <div
              className="rounded-2xl p-4 border"
              style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
            >
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4" style={{ color: accentColor.primary }} />
                <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary }}>Year</span>
              </div>
              <p className="text-sm font-semibold leading-tight" style={{ color: colors.textPrimary }}>
                {academicInfo.year}
              </p>
            </div>
            <div
              className="rounded-2xl p-4 border"
              style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
            >
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" style={{ color: accentColor.primary }} />
                <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary }}>Age</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                {academicInfo.age} years old
              </p>
            </div>
            <div
              className="rounded-2xl p-4 border"
              style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" style={{ color: accentColor.primary }} />
                <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary }}>Grad Date</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                {academicInfo.expectedGrad}
              </p>
            </div>
          </div>
        </motion.div>

        {/* GPA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="px-6 mb-5"
        >
          <h2 className="text-[13px] font-semibold uppercase tracking-wider mb-3" style={{ color: colors.textSecondary }}>
            GPA
          </h2>
          <div
            className="rounded-2xl p-5 border"
            style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[42px] font-bold leading-none" style={{ color: accentColor.primary }}>
                  {academicInfo.gpa}
                </p>
                <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                  Cumulative GPA
                </p>
              </div>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${accentColor.primary}18` }}
              >
                <GraduationCap className="w-8 h-8" style={{ color: accentColor.primary }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Current Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 mb-5"
        >
          <h2 className="text-[13px] font-semibold uppercase tracking-wider mb-3" style={{ color: colors.textSecondary }}>
            Current Courses
          </h2>
          <p className="text-sm rounded-2xl p-5 border" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary, color: colors.textSecondary }}>
            No courses to display yet.
          </p>
        </motion.div>

        {/* Previous Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="px-6 mb-6"
        >
          <h2 className="text-[13px] font-semibold uppercase tracking-wider mb-3" style={{ color: colors.textSecondary }}>
            Previous Courses
          </h2>
          <p className="text-sm rounded-2xl p-5 border" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary, color: colors.textSecondary }}>
            No previous courses to display yet.
          </p>
        </motion.div>

      </div>

      <WindowScrollFade />
      <BottomNav currentPage="profile" />
    </div>
  );
}
