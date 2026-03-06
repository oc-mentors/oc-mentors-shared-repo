import { useState, useRef } from "react";
import { Link } from "react-router";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SubjectIcon } from "../components/SubjectIcon";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useAllCourseColors } from "../hooks/useCourseColor";
import { useCanvasCourses } from "../contexts/CanvasCoursesContext";
import { subjects } from "../data/courses";
import TutorHomePage from "./TutorHomePage";
const imgDebra = "https://via.placeholder.com/150";
const imgAdam = "https://via.placeholder.com/150";

const meetings = [
  {
    id: 1,
    name: "Debra Peterson",
    subject: "Math 2A • Visual Learning",
    time: "Today at 6:30  PM",
    image: imgDebra,
    isActive: true,
  },
  {
    id: 2,
    name: "Adam Smith",
    subject: "Chemistry 1A • Hands-on Practice",
    time: "Tomorrow at 5:30 PM",
    image: imgAdam,
    isActive: true,
  },
];

const resources = [
  { id: 1, image: "https://images.unsplash.com/photo-1758685734312-5134968399a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxjdWx1cyUyMG1hdGhlbWF0aWNzJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc3MDkzMTk2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", title: "Calculus Basics" },
  { id: 2, image: "https://images.unsplash.com/photo-1761095596584-34731de3e568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBsYWIlMjBiZWFrZXJzfGVufDF8fHx8MTc3MDkzMTk2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", title: "Chemistry 101" },
  { id: 3, image: "https://images.unsplash.com/photo-1756829007483-414057ed33cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwc2NpZW5jZSUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NzA4MjM1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", title: "Physics Guide" },
];

export default function HomePage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { colors, accentColor } = useTheme();
  const courseColors = useAllCourseColors();
  const { isCourseIgnored } = useCanvasCourses();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowTopFade(scrollContainerRef.current.scrollTop > 0);
    }
  };

  const visibleSubjects = subjects.filter((s) => !isCourseIgnored(s.courseId));

  if (user && (user.role === "tutor" || user.role === "admin")) {
    return <TutorHomePage />;
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto w-full h-full flex flex-col">
        {/* Fixed Header */}
        <div className="flex-shrink-0 px-6 pt-12 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-[1.95px] uppercase" style={{ color: colors.textSecondary }}>
              OC MENTORS
            </h2>
            <ProfileButton />
          </div>
        </div>

        {/* Scrollable Content with top fade */}
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
            onScroll={handleScroll}
            className="h-full overflow-auto pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            {/* Greeting + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="px-6 pt-1 pb-8"
            >
              <div className="space-y-3">
                <h1 className="text-[44px] font-bold leading-tight" style={{ color: colors.textPrimary }}>
                  Hi, {user?.firstName || user?.name?.split(" ")[0] || "there"} 👋
                </h1>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" style={{ color: colors.textSecondary }} />
                  <p className="text-base italic" style={{ color: colors.textSecondary }}>
                    You have Chemistry with Dedra in 2 hours
                  </p>
                </div>
              </div>

              <Link to="/progress">
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-4 rounded-2xl font-bold text-white text-[17px] transition-shadow cursor-pointer"
                  style={{
                    backgroundColor: accentColor.primary,
                    boxShadow: `0px 4px 24px 0px ${accentColor.primary}40`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0px 6px 32px 0px ${accentColor.primary}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0px 4px 24px 0px ${accentColor.primary}40`;
                  }}
                >
                  Start Today's Learning Plan
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="px-6 mb-8"
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Today's Plan</h3>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="rounded-3xl p-6 border shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
                style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
              >
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24">
                    <svg className="transform -rotate-90 w-24 h-24">
                      <circle cx="48" cy="48" r="44" stroke={`${accentColor.primary}30`} strokeWidth="8" fill="none" />
                      <motion.circle
                        cx="48" cy="48" r="44"
                        stroke={accentColor.primary}
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 44}
                        initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 44 - (80 / 100) * 2 * Math.PI * 44 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold" style={{ color: colors.textPrimary }}>80%</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
                      80% Complete
                    </h4>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>Next task:</p>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>
                        Finish Math Homework<br />(2 min)
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="px-6 mb-8"
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Choose a subject</h3>
              <div className="flex justify-center gap-3 flex-wrap py-2">
                {visibleSubjects.map((subject, index) => (
                  <Link key={subject.name} to="/tutors">
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
                    >
                      <div
                        className="w-[70px] h-[70px] rounded-2xl flex items-center justify-center transition-all duration-300"
                        style={{ 
                          background: courseColors[subject.courseId] || subject.defaultColor,
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        <SubjectIcon type={subject.icon} />
                      </div>
                      <span className="text-[11px] font-medium" style={{ color: colors.textSecondary }}>
                        {subject.name}
                      </span>
                    </motion.button>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="px-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Upcoming Meeting</h3>
                <Link to="/schedule">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[13px] font-semibold"
                    style={{ color: accentColor.primary }}
                  >
                    View All
                  </motion.button>
                </Link>
              </div>

              <div className="space-y-3">
                {meetings.map((meeting, index) => (
                  <Link key={meeting.id} to="/schedule">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
                      style={{ backgroundColor: colors.bgCard }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={meeting.image}
                            alt={meeting.name}
                            className="w-14 h-14 rounded-2xl object-cover"
                          />
                          {meeting.isActive && (
                            <div className="absolute bottom-0 right-0 w-5 h-5 border-2 rounded-full" style={{ backgroundColor: accentColor.primary, borderColor: colors.bgPrimary }} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[15px] font-semibold mb-1" style={{ color: colors.textPrimary }}>
                            {meeting.name}
                          </h4>
                          <p className="text-[13px] mb-1" style={{ color: colors.textSecondary }}>
                            {meeting.subject}
                          </p>
                          <p className="text-xs font-medium" style={{ color: accentColor.primary }}>
                            {meeting.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="px-6"
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Recommended Resources</h3>
              <div className="grid grid-cols-2 gap-3">
                {resources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative rounded-2xl overflow-hidden shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer group"
                  >
                    <ImageWithFallback
                      src={resource.image}
                      alt={resource.title}
                      className="w-full h-32 object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-semibold">{resource.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}