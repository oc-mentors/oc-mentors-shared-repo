import { Link } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Filter, AlertCircle, BookOpen, Calendar, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const announcements = [
  {
    id: 1,
    courseName: "CHEM 1A: General Chemistry",
    courseColor: "rgb(139, 92, 246)",
    title: "Lab Safety Quiz Due Friday",
    content: "Please complete the lab safety quiz before this Friday's lab session. It's available in the Assignments section.",
    timestamp: "2 hours ago",
    date: "Feb 13, 2026",
  },
  {
    id: 2,
    courseName: "MATH 2A: Calculus I",
    courseColor: "rgb(59, 130, 246)",
    title: "Midterm Review Session",
    content: "There will be a review session for the upcoming midterm on Thursday at 4 PM in the Student Center.",
    timestamp: "5 hours ago",
    date: "Feb 13, 2026",
  },
  {
    id: 3,
    courseName: "PHYS 7C: Classical Mechanics",
    courseColor: "rgb(20, 184, 166)",
    title: "Problem Set 3 Posted",
    content: "Problem Set 3 has been posted and is due next Wednesday. Make sure to review Chapter 5 before starting.",
    timestamp: "1 day ago",
    date: "Feb 12, 2026",
  },
  {
    id: 4,
    courseName: "WRIT 39B: Critical Reading",
    courseColor: "rgb(236, 72, 153)",
    title: "Essay Feedback Available",
    content: "Feedback for Essay 2 is now available. Please review the comments before our next class meeting.",
    timestamp: "1 day ago",
    date: "Feb 12, 2026",
  },
  {
    id: 5,
    courseName: "BIO SCI 93: DNA to Organisms",
    courseColor: "rgb(34, 197, 94)",
    title: "Guest Lecture Next Week",
    content: "Dr. Sarah Chen will be giving a guest lecture on gene expression next Tuesday. This material will be on the final.",
    timestamp: "2 days ago",
    date: "Feb 11, 2026",
  },
  {
    id: 6,
    courseName: "CHEM 1A: General Chemistry",
    courseColor: "rgb(139, 92, 246)",
    title: "Office Hours Change",
    content: "Office hours for this week have been moved to Thursday 2-4 PM instead of Wednesday.",
    timestamp: "2 days ago",
    date: "Feb 11, 2026",
  },
  {
    id: 7,
    courseName: "MATH 2A: Calculus I",
    courseColor: "rgb(59, 130, 246)",
    title: "Homework Extension Granted",
    content: "Due to technical issues with the online submission system, Homework 4 deadline has been extended to Sunday.",
    timestamp: "3 days ago",
    date: "Feb 10, 2026",
  },
];

export default function AnnouncementsPage() {
  const [selectedCourses, setSelectedCourses] = useState<string[]>(["CHEM 1A", "MATH 2A", "PHYS 7C", "WRIT 39B", "BIO SCI 93"]);
  const [showFilter, setShowFilter] = useState(false);
  const [removedAnnouncementIds, setRemovedAnnouncementIds] = useState<number[]>(() => {
    const stored = localStorage.getItem('removedAnnouncementIds');
    return stored ? JSON.parse(stored) : [];
  });
  const { colors, accentColor } = useTheme();

  const courses = ["CHEM 1A", "MATH 2A", "PHYS 7C", "WRIT 39B", "BIO SCI 93"];

  const toggleCourse = (course: string) => {
    setSelectedCourses(prev => {
      if (prev.includes(course)) {
        return prev.filter(c => c !== course);
      } else {
        return [...prev, course];
      }
    });
  };

  const selectAllCourses = () => {
    setSelectedCourses([...courses]);
  };

  const deselectAllCourses = () => {
    setSelectedCourses([]);
  };

  const filteredAnnouncements = selectedCourses.length === 0
    ? []
    : announcements.filter(a => selectedCourses.some(course => a.courseName.startsWith(course)));

  return (
    <div className="min-h-screen overflow-auto pb-20" style={{ backgroundColor: colors.bgPrimary }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link to="/canvas-classes">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.bgCard }}
                >
                  <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
                </motion.button>
              </Link>
              <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Announcements</h1>
            </div>

            {/* Filter Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilter(!showFilter)}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: accentColor.primary }}
            >
              <Filter className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* Course Filter */}
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 rounded-xl p-4 border"
              style={{ backgroundColor: colors.bgCard, borderColor: colors.borderSecondary }}
            >
              <p className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>Filter by Course</p>
              <div className="space-y-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={selectAllCourses}
                  className="w-full text-left px-4 py-2 rounded-lg transition-colors"
                  style={selectedCourses.length === courses.length
                    ? { backgroundColor: accentColor.primary, color: "white" }
                    : { backgroundColor: colors.bgPrimary, color: colors.textSecondary }
                  }
                >
                  <span className="text-sm font-medium">Select All</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={deselectAllCourses}
                  className="w-full text-left px-4 py-2 rounded-lg transition-colors"
                  style={selectedCourses.length === 0
                    ? { backgroundColor: accentColor.primary, color: "white" }
                    : { backgroundColor: colors.bgPrimary, color: colors.textSecondary }
                  }
                >
                  <span className="text-sm font-medium">Deselect All</span>
                </motion.button>
                {courses.map((course) => (
                  <motion.button
                    key={course}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleCourse(course)}
                    className="w-full text-left px-4 py-2 rounded-lg transition-colors"
                    style={selectedCourses.includes(course)
                      ? { backgroundColor: accentColor.primary, color: "white" }
                      : { backgroundColor: colors.bgPrimary, color: colors.textSecondary }
                    }
                  >
                    <span className="text-sm font-medium">{course}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Active Filter Badge */}
          {selectedCourses.length > 0 && selectedCourses.length < courses.length && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="text-sm" style={{ color: colors.textSecondary }}>Active filters:</span>
              <div className="px-3 py-1 rounded-full flex items-center gap-2" style={{ backgroundColor: accentColor.primary }}>
                <span className="text-xs font-medium text-white">{selectedCourses.length} {selectedCourses.length === 1 ? 'course' : 'courses'}</span>
                <button
                  onClick={selectAllCourses}
                  className="text-white hover:text-gray-200"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Announcements List */}
        <div className="px-6 space-y-4">
          <AnimatePresence>
            {filteredAnnouncements
              .filter((announcement) => !removedAnnouncementIds.includes(announcement.id))
              .length > 0 ? (
              filteredAnnouncements
                .filter((announcement) => !removedAnnouncementIds.includes(announcement.id))
                .map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ 
                    opacity: 0, 
                    x: -300,
                    transition: { duration: 0.25 }
                  }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.2
                  }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl p-5 border shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] relative overflow-hidden"
                  style={{ backgroundColor: colors.bgCard, borderColor: colors.borderSecondary }}
                >
                  {/* Ignore Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setRemovedAnnouncementIds([...removedAnnouncementIds, announcement.id]);
                      localStorage.setItem('removedAnnouncementIds', JSON.stringify([...removedAnnouncementIds, announcement.id]));
                    }}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: colors.borderPrimary }}
                  >
                    <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </motion.button>

                  {/* Course Badge */}
                  <div className="flex items-center gap-2 mb-3 pr-8">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: announcement.courseColor }}
                    />
                    <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                      {announcement.courseName}
                    </span>
                    <span className="text-xs ml-auto" style={{ color: colors.textTertiary }}>
                      {announcement.timestamp}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    {announcement.title}
                  </h3>

                  {/* Content */}
                  <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                    {announcement.content}
                  </p>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl p-8 border text-center"
                style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
              >
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  No announcements found for this course
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}