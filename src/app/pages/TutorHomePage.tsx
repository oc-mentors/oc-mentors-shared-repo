import { Link } from "react-router";
import { motion } from "motion/react";
import { Calendar, Users, DollarSign, MessageSquare, TrendingUp } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { useAuth } from "../contexts/AuthContext";
import { useTutorRequests } from "../contexts/TutorRequestsContext";
import { useConnections } from "../contexts/ConnectionsContext";

export default function TutorHomePage() {
  const { user } = useAuth();
  const { incomingRequests } = useTutorRequests();
  const { connections } = useConnections();
  const uid = user?.id ?? "";
  const activeStudentCount = connections.filter(
    (c) => c.tutorUid === uid && c.status === "active" && c.conversationId
  ).length;

  return (
    <div className="min-h-screen bg-[#1a1d29] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#e8edf5]">
                Welcome back, {user?.firstName || user?.name?.split(" ")[0] || "Tutor"}!
              </h1>
              <p className="text-sm text-[#a8b3cf] mt-1">
                {new Date().toLocaleDateString("en-US", { 
                  weekday: "long", 
                  month: "long", 
                  day: "numeric" 
                })}
              </p>
            </div>
            <ProfileButton />
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Today's Sessions */}
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4361d9] to-[#5b7ceb] flex items-center justify-center mb-2">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-[#e8edf5]">0</span>
                <span className="text-xs text-[#a8b3cf] text-center">Today</span>
              </div>
            </motion.div>

            {/* Total Students */}
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-[#e8edf5]">{activeStudentCount}</span>
                <span className="text-xs text-[#a8b3cf] text-center">Students</span>
              </div>
            </motion.div>

            {/* This Week */}
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#4ade80] flex items-center justify-center mb-2">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-[#e8edf5]">$0</span>
                <span className="text-xs text-[#a8b3cf] text-center">This Week</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Pending Tutor Requests (real data) */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#e8edf5]">Requests from students</h2>
            <Link
              to="/tutor-requests"
              className="text-sm text-[#5b7ceb] font-semibold flex items-center gap-1"
            >
              View all
              {incomingRequests.length > 0 && (
                <span className="bg-[#5b7ceb] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {incomingRequests.length}
                </span>
              )}
            </Link>
          </div>
          {incomingRequests.length === 0 ? (
            <p className="text-sm text-[#a8b3cf]">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {incomingRequests.slice(0, 2).map((req) => (
                <Link key={req.id} to="/tutor-requests">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
                  >
                    <p className="text-base font-semibold text-[#e8edf5]">Student request</p>
                    {req.subject && <p className="text-sm text-[#a8b3cf]">{req.subject}</p>}
                    {req.initialMessage && (
                      <p className="text-sm text-[#a8b3cf] mt-1 line-clamp-1">"{req.initialMessage}"</p>
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Sessions */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#e8edf5]">Upcoming Sessions</h2>
            <span className="text-sm text-[#5b7ceb]/60 font-semibold cursor-not-allowed" title="Coming soon">
              View All
            </span>
          </div>
          <p className="text-sm text-[#a8b3cf] bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]">
            No upcoming sessions. When students book with you, they will appear here.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="px-6 mb-6">
          <h2 className="text-lg font-bold text-[#e8edf5] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/tutor-students">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              >
                <Users className="w-8 h-8 text-white mb-2" />
                <p className="text-white font-semibold">My Students</p>
              </motion.div>
            </Link>

            <Link to="/tutor-availability">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-[#22c55e] to-[#4ade80] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              >
                <Calendar className="w-8 h-8 text-white mb-2" />
                <p className="text-white font-semibold">Availability</p>
              </motion.div>
            </Link>

            <Link to="/tutor-analytics">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-[#f97316] to-[#fb923c] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              >
                <TrendingUp className="w-8 h-8 text-white mb-2" />
                <p className="text-white font-semibold">Analytics</p>
              </motion.div>
            </Link>

            <Link to="/chat">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-[#ec4899] to-[#f472b6] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              >
                <MessageSquare className="w-8 h-8 text-white mb-2" />
                <p className="text-white font-semibold">Messages</p>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      <BottomNav currentPage="home" />
    </div>
  );
}