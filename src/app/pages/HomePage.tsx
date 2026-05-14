import { useState, useRef } from "react";
import { Link } from "react-router";
import { Clock, Plus, BookOpen, Users } from "lucide-react";
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
import { useCalendar } from "../contexts/CalendarContext";
import { subjects } from "../data/courses";
import TutorHomePage from "./TutorHomePage";
// Inline placeholder (no external request) to avoid ERR_NAME_NOT_RESOLVED
const imgPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect fill='%23e2e8f0' width='150' height='150'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='14'%3E%3F%3C/text%3E%3C/svg%3E";

/** Curated tiles; empty until you add real links/content. */
const resources: { id: number; image: string; title: string; url?: string }[] = [];

type SubjectItem = { name: string; courseId: number; defaultColor: string; icon: string };

export default function HomePage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);
  const [customSubjects, setCustomSubjects] = useState<SubjectItem[]>([]);
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { colors, accentColor } = useTheme();
  const courseColors = useAllCourseColors();
  const { isCourseIgnored } = useCanvasCourses();
  const { sessions, removedSessionIds } = useCalendar();
  const upcomingMeetings = sessions.filter(
    (s) => s.status === "upcoming" && !removedSessionIds.includes(s.id)
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowTopFade(scrollContainerRef.current.scrollTop > 0);
    }
  };

  const greetingName = (() => {
    const n = user?.firstName || user?.name?.split(" ")[0] || "there";
    return n && n !== "User" && n !== "user" ? n : "there";
  })();
  const visibleSubjects = subjects.filter((s) => !isCourseIgnored(s.courseId));
  const allDisplaySubjects: SubjectItem[] = [...visibleSubjects, ...customSubjects];

  const handleAddSubject = () => {
    const name = newSubjectName.trim();
    if (!name) return;
    const exists = allDisplaySubjects.some((s) => s.name.toLowerCase() === name.toLowerCase());
    if (exists) return;
    setCustomSubjects((prev) => [
      ...prev,
      { name, courseId: 1000 + prev.length, defaultColor: "rgb(100, 116, 139)", icon: "writing" },
    ]);
    setNewSubjectName("");
    setAddSubjectOpen(false);
  };

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
              Socratic OC
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
                  Hi, {greetingName} 👋
                </h1>
                <Link
                  to="/schedule"
                  className="inline-flex items-center gap-2 group cursor-pointer"
                  aria-label="Open your schedule"
                >
                  <Clock className="w-5 h-5 flex-shrink-0" style={{ color: colors.textSecondary }} />
                  <span
                    className="text-base italic underline underline-offset-[5px] decoration-1"
                    style={{ color: colors.textSecondary, textDecorationColor: "currentColor" }}
                  >
                    View your schedule
                  </span>
                </Link>
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

              <div className="grid grid-cols-2 gap-2 mt-5">
                <Link to="/notes">
                  <div
                    className="rounded-xl py-3 px-2 text-center text-xs font-semibold border"
                    style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary, color: colors.textPrimary }}
                  >
                    <BookOpen className="w-4 h-4 mx-auto mb-1" style={{ color: accentColor.primary }} />
                    Study hub
                  </div>
                </Link>
                <Link to="/community">
                  <div
                    className="rounded-xl py-3 px-2 text-center text-xs font-semibold border"
                    style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary, color: colors.textPrimary }}
                  >
                    <Users className="w-4 h-4 mx-auto mb-1" style={{ color: accentColor.primary }} />
                    Community
                  </div>
                </Link>
              </div>
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
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Choose a subject</h3>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAddSubjectOpen(true)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border-2"
                  style={{ backgroundColor: accentColor.primary, color: "white", borderColor: accentColor.primary, boxShadow: `0 2px 8px ${accentColor.primary}50` }}
                  aria-label="Create a subject"
                  title="Create a subject"
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                </motion.button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {allDisplaySubjects.map((subject, index) => (
                  <Link
                    key={subject.courseId >= 1000 ? `custom-${subject.name}` : subject.name}
                    to={subject.courseId >= 1000 ? "/tutors?subject=All" : `/tutors?subject=${encodeURIComponent(subject.name)}`}
                    className="flex-shrink-0"
                  >
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 cursor-pointer"
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
              {addSubjectOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  onClick={() => setAddSubjectOpen(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-2xl p-6 w-full max-w-sm shadow-xl"
                    style={{ backgroundColor: colors.bgCard }}
                  >
                    <h4 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>Create a subject</h4>
                    <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>Enter a new subject to add to your list.</p>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>Subject name</label>
                    <input
                      type="text"
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
                      placeholder="e.g. Spanish, Art, Music"
                      className="w-full rounded-xl px-4 py-3 mb-4 outline-none border-2 focus:border-[#5b7ceb]"
                      style={{ backgroundColor: colors.bgPrimary, color: colors.textPrimary, borderColor: colors.bgTertiary }}
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => { setAddSubjectOpen(false); setNewSubjectName(""); }}
                        className="flex-1 py-2.5 rounded-xl font-semibold"
                        style={{ backgroundColor: colors.bgTertiary, color: colors.textSecondary }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddSubject}
                        disabled={!newSubjectName.trim()}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50"
                        style={{ backgroundColor: accentColor.primary }}
                      >
                        Create
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="px-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Upcoming Meeting</h3>
                {upcomingMeetings.length > 0 && (
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
                )}
              </div>

              {upcomingMeetings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingMeetings.slice(0, 3).map((meeting, index) => (
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
                            <ImageWithFallback
                              src={meeting.tutorAvatar}
                              alt={meeting.tutor}
                              className="w-14 h-14 rounded-2xl object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-5 h-5 border-2 rounded-full" style={{ backgroundColor: accentColor.primary, borderColor: colors.bgPrimary }} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[15px] font-semibold mb-1" style={{ color: colors.textPrimary }}>
                              {meeting.tutor}
                            </h4>
                            <p className="text-[13px] mb-1" style={{ color: colors.textSecondary }}>
                              {meeting.subject}
                            </p>
                            <p className="text-xs font-medium" style={{ color: accentColor.primary }}>
                              {meeting.date} at {meeting.time}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <Link to="/book-session">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="rounded-2xl p-6 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer border-2 border-dashed text-center"
                    style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
                  >
                    <p className="text-[15px] font-medium mb-2" style={{ color: colors.textSecondary }}>
                      No upcoming meetings
                    </p>
                    <p className="text-[14px] font-semibold" style={{ color: accentColor.primary }}>
                      Schedule a session
                    </p>
                  </motion.div>
                </Link>
              )}
            </motion.div>

            {resources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="px-6"
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Recommended Resources</h3>
              <div className="grid grid-cols-2 gap-3">
                {resources.map((resource, index) => {
                  const href = "url" in resource && resource.url ? resource.url : `https://www.youtube.com/results?search_query=${encodeURIComponent(resource.title)}`;
                  return (
                    <a
                      key={resource.id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <motion.div
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
                    </a>
                  );
                })}
              </div>
            </motion.div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}