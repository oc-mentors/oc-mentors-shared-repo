import { Link } from "react-router";
import { motion } from "motion/react";
import { Calendar, Users, DollarSign, Clock, MessageSquare, TrendingUp, Bell, Video } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { useAuth } from "../contexts/AuthContext";

export default function TutorHomePage() {
  const { user } = useAuth();

  const upcomingSessions = [
    {
      id: 1,
      studentName: "Emily Johnson",
      subject: "Chemistry",
      time: "10:00 AM",
      date: "Feb 19",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    },
    {
      id: 2,
      studentName: "Marcus Chen",
      subject: "Math",
      time: "2:30 PM",
      date: "Feb 19",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    },
    {
      id: 3,
      studentName: "Sarah Williams",
      subject: "Physics",
      time: "4:00 PM",
      date: "Feb 20",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    },
  ];

  const pendingRequests = [
    {
      id: 1,
      studentName: "Alex Rivera",
      subject: "Biology",
      requestedTime: "Feb 21, 3:00 PM",
      message: "Need help with cellular respiration concepts",
    },
    {
      id: 2,
      studentName: "Jessica Park",
      subject: "Chemistry",
      requestedTime: "Feb 22, 1:00 PM",
      message: "Struggling with organic chemistry reactions",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1d29] overflow-auto pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#e8edf5]">
                Welcome back, {user?.name || "Tutor"}!
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
                <span className="text-2xl font-bold text-[#e8edf5]">2</span>
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
                <span className="text-2xl font-bold text-[#e8edf5]">24</span>
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
                <span className="text-2xl font-bold text-[#e8edf5]">$480</span>
                <span className="text-xs text-[#a8b3cf] text-center">This Week</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Pending Session Requests */}
        {pendingRequests.length > 0 && (
          <div className="px-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#e8edf5]">Pending Requests</h2>
              <div className="bg-[#5b7ceb] text-white text-xs font-semibold px-2 py-1 rounded-full">
                {pendingRequests.length}
              </div>
            </div>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-[#e8edf5]">
                        {request.studentName}
                      </h3>
                      <p className="text-sm text-[#a8b3cf]">{request.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#a8b3cf]">{request.requestedTime}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#a8b3cf] mb-4">{request.message}</p>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gradient-to-r from-[#4361d9] to-[#5b7ceb] text-white text-sm font-semibold py-2 rounded-xl"
                    >
                      Accept
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-[#2a2f45] text-[#a8b3cf] text-sm font-semibold py-2 rounded-xl"
                    >
                      Decline
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Sessions */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#e8edf5]">Upcoming Sessions</h2>
            <Link to="/schedule" className="text-sm text-[#5b7ceb] font-semibold">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={session.avatar}
                    alt={session.studentName}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-[#e8edf5]">
                      {session.studentName}
                    </h3>
                    <p className="text-sm text-[#a8b3cf]">{session.subject}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-xs text-[#a8b3cf]">
                        <Calendar className="w-3 h-3" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#a8b3cf]">
                        <Clock className="w-3 h-3" />
                        <span>{session.time}</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/video-session">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-gradient-to-br from-[#4361d9] to-[#5b7ceb] rounded-xl flex items-center justify-center"
                    >
                      <Video className="w-5 h-5 text-white" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
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
