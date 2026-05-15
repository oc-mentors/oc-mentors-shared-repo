import { useState, useRef } from "react";
import { Link } from "react-router";
import { Clock, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SubjectIcon } from "../components/SubjectIcon";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLearningComfort } from "../contexts/LearningComfortContext";
import { BionicText } from "../components/BionicText";
import { useAllCourseColors } from "../hooks/useCourseColor";
import { useCanvasCourses } from "../contexts/CanvasCoursesContext";
import { subjects } from "../data/courses";
import TutorHomePage from "./TutorHomePage";
// Inline placeholder (no external request) to avoid ERR_NAME_NOT_RESOLVED
const imgPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect fill='%23e2e8f0' width='150' height='150'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='14'%3E%3F%3C/text%3E%3C/svg%3E";
const imgDebra = imgPlaceholder;
const imgAdam = imgPlaceholder;

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
  const { reduceDistractions } = useLearningComfort();
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
      <div className={`${reduceDistractions ? "max-w-lg" : "max-w-md"} mx-auto w-full h-full flex flex-col`}>
        {/* Fixed Header */}
        <div className="flex-shrink-0 px-6 pt-12 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-[1.95px] uppercase" style={{ color: colors.textSecondary }}>
              <BionicText text="OC MENTORS" />
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
                <h1 className={`font-bold leading-tight ${reduceDistractions ? "text-[52px]" : "text-[44px]"}`} style={{ color: colors.textPrimary }}>
                  <BionicText text={`Hi, ${user?.firstName || user?.name?.split(" ")[0] || "there"} 👋`} />
                </h1>
                {!reduceDistractions && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" style={{ color: colors.textSecondary }} />
                  <p className="text-base italic" style={{ color: colors.textSecondary }}>
                    <BionicText text="You have Chemistry with Dedra in 2 hours" />
                  </p>
                </div>
                )}
              </div>

              <Link to="/progress">
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full mt-6 py-4 rounded-2xl font-bold text-white transition-shadow cursor-pointer ${reduceDistractions ? "text-[19px]" : "text-[17px]"}`}
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
                  <BionicText text="Start Today's Learning Plan" className="text-white font-bold" />
                </motion.button>
              </Link>
            </motion.div>

            {!reduceDistractions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="px-6 mb-8"
            >
              <h3 className={`font-bold mb-4 ${reduceDistractions ? "text-xl" : "text-lg"}`} style={{ color: colors.textPrimary }}>
                <BionicText text="Today's Plan" />
              </h3>
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
                      <span className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                        <BionicText text="80%" />
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
                      <BionicText text="80% Complete" />
                    </h4>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                        <BionicText text="Next task:" />
                      </p>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>
                        <BionicText text="Finish Math Homework (2 min)" />
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="px-6 mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <h3 className={`font-bold ${reduceDistractions ? "text-xl" : "text-lg"}`} style={{ color: colors.textPrimary }}>
                  <BionicText text="Choose a subject" />
                </h3>
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
                      <BionicText
                        text={subject.name}
                        className="text-[11px] font-medium text-center block"
                        style={{ color: colors.textSecondary }}
                      />
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
                    <h4 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
                      <BionicText text="Create a subject" />
                    </h4>
                    <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                      <BionicText text="Enter a new subject to add to your list." />
                    </p>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                      <BionicText text="Subject name" />
                    </label>
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
                        <BionicText text="Cancel" />
                      </button>
                      <button
                        type="button"
                        onClick={handleAddSubject}
                        disabled={!newSubjectName.trim()}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50"
                        style={{ backgroundColor: accentColor.primary }}
                      >
                        <BionicText text="Create" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>

            {!reduceDistractions && (
            <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="px-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  <BionicText text="Upcoming Meeting" />
                </h3>
                <Link to="/schedule">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[13px] font-semibold"
                    style={{ color: accentColor.primary }}
                  >
                    <BionicText text="View All" />
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
                            <BionicText text={meeting.name} />
                          </h4>
                          <p className="text-[13px] mb-1" style={{ color: colors.textSecondary }}>
                            <BionicText text={meeting.subject} />
                          </p>
                          <p className="text-xs font-medium" style={{ color: accentColor.primary }}>
                            <BionicText text={meeting.time} />
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
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                <BionicText text="Recommended Resources" />
              </h3>
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
                      <p className="text-white text-sm font-semibold">
                        <BionicText text={resource.title} className="text-white text-sm font-semibold" />
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            </>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}