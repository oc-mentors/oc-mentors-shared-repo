import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Search, TrendingUp, Calendar, MessageSquare, Star } from "lucide-react";
import { BottomNav } from "../components/BottomNav";

export default function TutorStudentsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const students = [
    {
      id: 1,
      name: "Emily Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      subject: "Chemistry",
      sessionsCompleted: 8,
      upcomingSessions: 2,
      lastSession: "Feb 17, 2026",
      performance: 92,
    },
    {
      id: 2,
      name: "Marcus Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      subject: "Math",
      sessionsCompleted: 12,
      upcomingSessions: 1,
      lastSession: "Feb 18, 2026",
      performance: 88,
    },
    {
      id: 3,
      name: "Sarah Williams",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      subject: "Physics",
      sessionsCompleted: 6,
      upcomingSessions: 3,
      lastSession: "Feb 16, 2026",
      performance: 85,
    },
    {
      id: 4,
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      subject: "Biology",
      sessionsCompleted: 10,
      upcomingSessions: 1,
      lastSession: "Feb 19, 2026",
      performance: 95,
    },
    {
      id: 5,
      name: "Jessica Park",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      subject: "Chemistry",
      sessionsCompleted: 5,
      upcomingSessions: 2,
      lastSession: "Feb 15, 2026",
      performance: 78,
    },
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1a1d29] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-3">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-[#e8edf5]">My Students</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#a8b3cf]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students..."
              className="w-full bg-[#1e2139] rounded-2xl py-3 pl-12 pr-4 text-[#e8edf5] placeholder:text-[#a8b3cf] outline-none border-2 border-transparent focus:border-[#5b7ceb] transition-colors"
            />
          </div>
        </div>

        {/* Student Stats */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]">
              <p className="text-[#a8b3cf] text-sm mb-1">Total Students</p>
              <p className="text-3xl font-bold text-[#e8edf5]">{students.length}</p>
            </div>
            <div className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]">
              <p className="text-[#a8b3cf] text-sm mb-1">Avg Performance</p>
              <p className="text-3xl font-bold text-[#e8edf5]">
                {Math.round(students.reduce((acc, s) => acc + s.performance, 0) / students.length)}%
              </p>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="px-6">
          <div className="space-y-3">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-[#e8edf5]">
                          {student.name}
                        </h3>
                        <p className="text-sm text-[#a8b3cf]">{student.subject}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-[#2a2f45] px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24]" />
                        <span className="text-xs font-semibold text-[#e8edf5]">
                          {student.performance}%
                        </span>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-xs text-[#a8b3cf]">
                        <TrendingUp className="w-3 h-3" />
                        <span>{student.sessionsCompleted} completed</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#a8b3cf]">
                        <Calendar className="w-3 h-3" />
                        <span>{student.upcomingSessions} upcoming</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#a8b3cf] mb-3">
                      Last session: {student.lastSession}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link to="/schedule" className="flex-1">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-gradient-to-r from-[#4361d9] to-[#5b7ceb] text-white text-sm font-semibold py-2 rounded-xl"
                        >
                          Schedule
                        </motion.button>
                      </Link>
                      <Link to={`/chat/${student.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 bg-[#2a2f45] rounded-xl flex items-center justify-center"
                        >
                          <MessageSquare className="w-5 h-5 text-[#5b7ceb]" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#a8b3cf]">No students found</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav currentPage="tutors" />
    </div>
  );
}