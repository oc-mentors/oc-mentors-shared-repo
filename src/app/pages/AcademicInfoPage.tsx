import { useNavigate, Link } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { WindowScrollFade } from "../components/WindowScrollFade";
import { AvatarWithInitials } from "../components/AvatarWithInitials";
import { motion } from "motion/react";
import {
  ArrowLeft, Lock, GraduationCap, BookOpen, Calendar,
  User, Building2, FlaskConical, Calculator, Atom, PenTool,
  Microscope, CircleCheckBig, ExternalLink,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useCanvasCourses } from "../contexts/CanvasCoursesContext";
import { useCanvasAuth } from "../contexts/CanvasAuthContext";
import { useAuth } from "../contexts/AuthContext";
import { useAllCourseColors } from "../hooks/useCourseColor";

// Mock previous courses (would come from Canvas historical data)
const previousCourses = [
  { id: 101, code: "MATH 1B", name: "Pre-Calculus", term: "Fall 2024", grade: "A", icon: Calculator, color: "rgb(59, 130, 246)" },
  { id: 102, code: "CHEM 1P", name: "Preparation for Chemistry", term: "Fall 2024", grade: "A-", icon: FlaskConical, color: "rgb(139, 92, 246)" },
  { id: 103, code: "WRITING 1", name: "Academic Writing", term: "Fall 2024", grade: "B+", icon: PenTool, color: "rgb(236, 72, 153)" },
  { id: 104, code: "BIO SCI 15", name: "Intro to Biology", term: "Winter 2025", grade: "A", icon: Microscope, color: "rgb(34, 197, 94)" },
  { id: 105, code: "PHYS 2", name: "Intro to Physics", term: "Winter 2025", grade: "B+", icon: Atom, color: "rgb(20, 184, 166)" },
];

function GradeChip({ grade }: { grade: string }) {
  const isA = grade.startsWith("A");
  const isB = grade.startsWith("B");
  const bg = isA ? "rgba(34,197,94,0.15)" : isB ? "rgba(59,130,246,0.15)" : "rgba(246,179,52,0.15)";
  const text = isA ? "rgb(34,197,94)" : isB ? "rgb(59,130,246)" : "rgb(246,179,52)";
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-lg" style={{ backgroundColor: bg, color: text }}>
      {grade}
    </span>
  );
}

function CanvasLockedOverlay({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-10"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}>
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <Lock className="w-5 h-5 text-white opacity-80" />
        <p className="text-white text-xs font-medium opacity-90">Connect Canvas to view</p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onConnect}
          className="mt-1 px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ backgroundColor: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)" }}
        >
          Connect Canvas
        </motion.button>
      </div>
    </div>
  );
}

export default function AcademicInfoPage() {
  const { colors, accentColor } = useTheme();
  const { user } = useAuth();
  const { courses, isCourseIgnored } = useCanvasCourses();
  const { isCanvasConnected } = useCanvasAuth();
  const courseColors = useAllCourseColors();
  const navigate = useNavigate();

  const visibleCourses = courses.filter((c) => !isCourseIgnored(c.id));

  const handleConnectCanvas = () => navigate("/canvas-login");

  const academicInfo = {
    age: 20,
    major: user?.major?.length ? user.major.join(", ") : "—",
    year: user?.year || "—",
    school: user?.university || "—",
    expectedGrad: "June 2027",
    gpa: "3.72",
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
          <div className="flex items-center gap-3 mb-2">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0"
              style={{ backgroundColor: colors.bgTertiary }}
            >
              <ArrowLeft className="w-6 h-6" style={{ color: colors.textPrimary }} />
            </motion.button>
            <h1 className="text-[28px] font-bold" style={{ color: colors.textPrimary }}>Academic Information</h1>
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

        {/* GPA — Canvas-dependent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="px-6 mb-5"
        >
          <h2 className="text-[13px] font-semibold uppercase tracking-wider mb-3" style={{ color: colors.textSecondary }}>
            GPA
          </h2>
          <div className="relative">
            <div
              className={`rounded-2xl p-5 border ${!isCanvasConnected ? "opacity-40 pointer-events-none select-none" : ""}`}
              style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[42px] font-bold leading-none" style={{ color: accentColor.primary }}>
                    {isCanvasConnected ? academicInfo.gpa : "—"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    Cumulative GPA • Spring 2026
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
            {!isCanvasConnected && <CanvasLockedOverlay onConnect={handleConnectCanvas} />}
          </div>
        </motion.div>

        {/* Current Courses — Canvas-dependent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 mb-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
              Current Courses
            </h2>
            {isCanvasConnected && (
              <Link to="/canvas-classes">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: accentColor.primary }}
                >
                  View All
                  <ExternalLink className="w-3 h-3" />
                </motion.button>
              </Link>
            )}
          </div>

          <div className="relative">
            <div className={`space-y-2 ${!isCanvasConnected ? "opacity-40 pointer-events-none select-none" : ""}`}>
              {(isCanvasConnected ? visibleCourses : courses.slice(0, 3)).map((course, index) => {
                const IconComponent = course.icon;
                const courseColor = isCanvasConnected ? (courseColors[course.id as number] || course.color) : course.color;
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.06 }}
                    className="rounded-2xl p-4 border flex items-center gap-3"
                    style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: courseColor }}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: colors.textPrimary }}>
                        {course.code}
                      </p>
                      <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
                        {course.name}
                      </p>
                    </div>
                    <div
                      className="text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${courseColor}20`, color: courseColor }}
                    >
                      {course.progress || 0}%
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {!isCanvasConnected && <CanvasLockedOverlay onConnect={handleConnectCanvas} />}
          </div>
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

          <div className="relative">
            <div className={`space-y-2 ${!isCanvasConnected ? "opacity-40 pointer-events-none select-none" : ""}`}>
              {previousCourses.map((course, index) => {
                const IconComponent = course.icon;
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.06 }}
                    className="rounded-2xl p-4 border flex items-center gap-3"
                    style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: course.color }}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: colors.textPrimary }}>
                        {course.code}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <CircleCheckBig className="w-3 h-3 flex-shrink-0" style={{ color: colors.textSecondary }} />
                        <p className="text-xs" style={{ color: colors.textSecondary }}>
                          {course.term}
                        </p>
                      </div>
                    </div>
                    <GradeChip grade={course.grade} />
                  </motion.div>
                );
              })}
            </div>
            {!isCanvasConnected && <CanvasLockedOverlay onConnect={handleConnectCanvas} />}
          </div>
        </motion.div>

      </div>

      <WindowScrollFade />
      <BottomNav currentPage="profile" />
    </div>
  );
}
