import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, TrendingUp, Users, Clock, DollarSign, Star } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useAuth } from "../contexts/AuthContext";
import { useTutors } from "../contexts/TutorsContext";
import { useCalendar } from "../contexts/CalendarContext";
import { useConnections } from "../contexts/ConnectionsContext";

export default function TutorAnalyticsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tutors, isLoading } = useTutors();
  const { sessions, removedSessionIds } = useCalendar();
  const { connections } = useConnections();

  const me = tutors.find((t) => t.id === user?.id);
  const tutorName = (user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "").trim();

  const mySessions = sessions.filter((s) => {
    if (removedSessionIds.includes(s.id)) return false;
    if (!tutorName) return true;
    return (
      s.tutor.toLowerCase() === tutorName.toLowerCase() ||
      (!!user?.firstName && s.tutor.toLowerCase().includes(user.firstName.toLowerCase()))
    );
  });

  const totalSessions = mySessions.length;
  const completedSessions = mySessions.filter((s) => s.status === "completed").length;
  const activeStudents = connections.filter(
    (c) => c.tutorUid === user?.id && c.status === "active"
  ).length;

  const ratingValue = me?.rating && me.rating > 0 ? me.rating : null;
  const avgRating = ratingValue != null ? ratingValue.toFixed(1) : "—";

  return (
    <div className="min-h-screen bg-[#1a1d29] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-3">
          <div className="flex items-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-[#a8b3cf] hover:text-[#e8edf5] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-[#e8edf5]">Analytics</h1>
          </div>
        </div>

        {/* Overview Stats — real / zero, never seeded */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#4ade80] flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#e8edf5] mb-1">$0</p>
              <p className="text-xs text-[#a8b3cf]">This Month</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4361d9] to-[#5b7ceb] flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#e8edf5] mb-1">{totalSessions}</p>
              <p className="text-xs text-[#a8b3cf]">Total Sessions</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#e8edf5] mb-1">{completedSessions}</p>
              <p className="text-xs text-[#a8b3cf]">Completed</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fbbf24] to-[#fcd34d] flex items-center justify-center mb-3">
                <Star className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#e8edf5] mb-1">
                {isLoading ? "…" : avgRating}
              </p>
              <p className="text-xs text-[#a8b3cf]">Avg Rating</p>
            </motion.div>
          </div>
        </div>

        {/* Earnings — empty until real payouts exist */}
        <div className="px-6 mb-6">
          <div className="bg-[#1e2139] rounded-2xl p-5 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#e8edf5]">Monthly Earnings</h2>
              <TrendingUp className="w-5 h-5 text-[#a8b3cf] opacity-50" />
            </div>
            <div className="py-10 text-center">
              <p className="text-sm text-[#a8b3cf]">No earnings data yet</p>
              <p className="text-xs text-[#a8b3cf] mt-1">
                Charts will appear after you complete paid sessions.
              </p>
            </div>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="px-6 mb-6">
          <h2 className="text-lg font-bold text-[#e8edf5] mb-4">Subject Breakdown</h2>
          {me?.subjects && me.subjects.length > 0 ? (
            <div className="space-y-3">
              {me.subjects.map((subject, index) => {
                const subjectSessions = mySessions.filter((s) =>
                  s.subject.toLowerCase().includes(subject.toLowerCase())
                );
                return (
                  <motion.div
                    key={subject}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-[#e8edf5]">{subject}</h3>
                      {ratingValue != null && (
                        <div className="flex items-center gap-1 bg-[#2a2f45] px-2 py-1 rounded-lg">
                          <Star className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24]" />
                          <span className="text-xs font-semibold text-[#e8edf5]">{avgRating}</span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#a8b3cf] mb-1">Sessions</p>
                        <p className="text-lg font-bold text-[#e8edf5]">{subjectSessions.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#a8b3cf] mb-1">Active students</p>
                        <p className="text-lg font-bold text-[#e8edf5]">{activeStudents}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#1e2139] rounded-2xl p-5 border border-dashed border-[#2a2f45] text-center">
              <p className="text-sm text-[#a8b3cf]">No subject stats yet</p>
              <p className="text-xs text-[#a8b3cf] mt-1">
                Finish onboarding and start tutoring to see a breakdown here.
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav currentPage="home" />
    </div>
  );
}
