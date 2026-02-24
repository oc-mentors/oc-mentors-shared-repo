import { Link } from "react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ArrowRight, BookOpen, Trophy } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";

const subjectProgress = [
  { 
    id: 1, 
    name: "Math 2A", 
    progress: 75, 
    lessons: 8, 
    color: "rgb(59, 130, 246)",
    bgColor: "rgba(59, 130, 246, 0.1)",
  },
  { 
    id: 2, 
    name: "Physics", 
    progress: 60, 
    lessons: 5, 
    color: "rgb(20, 184, 166)",
    bgColor: "rgba(20, 184, 166, 0.1)",
  },
  { 
    id: 3, 
    name: "Chemistry", 
    progress: 40, 
    lessons: 3, 
    color: "rgb(139, 92, 246)",
    bgColor: "rgba(139, 92, 246, 0.1)",
  },
];

const achievements = [
  {
    id: 1,
    title: "5 Lessons Complete",
    date: "Nov 8",
    icon: "trophy",
  },
  {
    id: 2,
    title: "Perfect Quiz Score",
    date: "Nov 5",
    icon: "star",
  },
];

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

  return (
    <div className="min-h-screen bg-[#2c3042] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-12 pb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 text-[#e8edf5]" />
              </motion.button>
            </Link>
            <ProfileButton />
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-bold text-[#e8edf5]">My Progress</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-semibold text-[#5b7ceb] flex items-center gap-1 cursor-pointer"
            >
              Take Quiz <ArrowRight className="w-4 h-4" />
            </motion.button>
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
              className="bg-gradient-to-br from-[#5b7ceb] to-[#4361d9] rounded-3xl p-6 shadow-lg cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Your Learning Journey</span>
              </div>
              <div className="flex items-center justify-around">
                <div>
                  <div className="text-[44px] font-bold text-white leading-tight">16</div>
                  <div className="text-sm text-white/80">Lessons Completed</div>
                </div>
                <div className="w-px h-16 bg-white/20" />
                <div>
                  <div className="text-[44px] font-bold text-white leading-tight">24hrs</div>
                  <div className="text-sm text-white/80">Total Study Time</div>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Subject Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-[#e8edf5] mb-4">Subject Progress</h2>
          <div className="space-y-3">
            {subjectProgress.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
                className="bg-[#353a52] rounded-2xl p-5 cursor-pointer border border-[rgba(255,255,255,0.05)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#e8edf5] mb-1">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-[#a8b3cf]">
                      {subject.lessons} lessons completed
                    </p>
                  </div>
                  <div className="text-xl font-bold" style={{ color: subject.color }}>
                    {subject.progress}%
                  </div>
                </div>
                <ProgressBar percentage={subject.progress} color={subject.color} />
                
                {/* Expanded Details */}
                <motion.div
                  initial={false}
                  animate={{ 
                    height: expandedSubject === subject.id ? "auto" : 0,
                    opacity: expandedSubject === subject.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.08)]">
                    <p className="text-sm text-[#a8b3cf] mb-2">Recent activities:</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#e8edf5]">Lesson {subject.lessons}</span>
                        <span className="text-[#5b7ceb]">Completed</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#e8edf5]">Quiz {subject.lessons - 1}</span>
                        <span className="text-[#5b7ceb]">95% Score</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-[#e8edf5] mb-4">Recent Achievements</h2>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="bg-[#353a52] rounded-2xl p-4 border border-[rgba(255,255,255,0.05)] cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-semibold text-[#e8edf5] mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-[#a8b3cf]">{achievement.date}</p>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#5b7ceb]" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav currentPage="progress" />
    </div>
  );
}