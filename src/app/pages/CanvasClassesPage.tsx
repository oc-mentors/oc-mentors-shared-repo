import { Link } from "react-router";
import { motion } from "motion/react";
import { Bell, FileText, BookOpen } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";

const canvasCourses = [
  { id: 1, name: "CHEM 1A: General Chemistry", code: "CHEM 1A", color: "rgb(139, 92, 246)" },
  { id: 2, name: "MATH 2A: Calculus I", code: "MATH 2A", color: "rgb(59, 130, 246)" },
  { id: 3, name: "PHYS 7C: Classical Mechanics", code: "PHYS 7C", color: "rgb(20, 184, 166)" },
  { id: 4, name: "WRIT 39B: Critical Reading", code: "WRIT 39B", color: "rgb(236, 72, 153)" },
  { id: 5, name: "BIO SCI 93: DNA to Organisms", code: "BIO SCI 93", color: "rgb(34, 197, 94)" },
];

export default function CanvasClassesPage() {
  return (
    <div className="min-h-screen bg-[#1a1d29] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-[#e8edf5]">Canvas</h1>
            <ProfileButton />
          </div>

          {/* Announcements Section */}
          <Link to="/announcements">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1e2139] rounded-2xl px-5 py-4 mb-3 border border-[rgba(255,255,255,0.12)] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5b7ceb] flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[#e8edf5] mb-0.5">
                    Announcements
                  </h3>
                  <p className="text-sm text-[#a8b3cf]">View course updates and news</p>
                </div>
                <div className="text-[#a8b3cf] opacity-50">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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
              className="bg-[#1e2139] rounded-2xl px-5 py-4 mb-6 border border-[rgba(255,255,255,0.12)] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#14b8a6] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[#e8edf5] mb-0.5">
                    Assignments
                  </h3>
                  <p className="text-sm text-[#a8b3cf]">View upcoming assignments</p>
                </div>
                <div className="text-[#a8b3cf] opacity-50">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Courses Section */}
        <div className="px-6">
          <h2 className="text-lg font-bold text-[#e8edf5] mb-4">My Classes</h2>
          <div className="space-y-3">
            {canvasCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#1e2139] rounded-2xl p-5 border border-[rgba(255,255,255,0.12)] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: course.color }}
                  >
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-[#e8edf5] mb-1 truncate">
                      {course.name}
                    </h3>
                    <p className="text-sm text-[#a8b3cf]">{course.code}</p>
                  </div>
                  <div className="text-[#a8b3cf] opacity-50">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav currentPage="canvas" />
    </div>
  );
}