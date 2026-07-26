import { Link } from "react-router";
import { motion } from "motion/react";
import { Calendar, Users, DollarSign, MessageSquare, TrendingUp, Video, Clock } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ProfileButton } from "../components/ProfileButton";
import { AvatarWithInitials } from "../components/AvatarWithInitials";
import { useAuth } from "../contexts/AuthContext";
import { useConnections } from "../contexts/ConnectionsContext";
import { useTutorRequests } from "../contexts/TutorRequestsContext";
import { useCalendar, isSessionUpcomingByDate } from "../contexts/CalendarContext";
import { isSessionDateToday } from "../lib/learningPlan";

export default function TutorHomePage() {
  const { user } = useAuth();
  const { connections } = useConnections();
  const { incomingRequests } = useTutorRequests();
  const { sessions, removedSessionIds } = useCalendar();

  const tutorUid = user?.id ?? "";
  const tutorName = (user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "").trim();

  const activeStudentUids = new Set(
    connections
      .filter((c) => c.tutorUid === tutorUid && c.status === "active")
      .map((c) => c.studentUid)
  );
  const studentCount = activeStudentUids.size;

  const mySessions = sessions.filter((s) => {
    if (removedSessionIds.includes(s.id)) return false;
    if (s.status !== "upcoming") return false;
    if (!isSessionUpcomingByDate(s.date)) return false;
    if (!tutorName) return true;
    return s.tutor.toLowerCase() === tutorName.toLowerCase() || s.tutor.toLowerCase().includes((user?.firstName || "").toLowerCase());
  });

  const sessionsToday = mySessions.filter((s) => isSessionDateToday(s.date)).length;
  const upcomingSessions = mySessions.slice(0, 5);

  return (
    <div
      className="min-h-screen bg-[#1a1d29] overflow-auto pb-20"
      data-testid="tutor-home-screen"
      id="tutor-home-screen"
      aria-label="Tutor home"
    >
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
                  day: "numeric",
                })}
              </p>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#a8b3cf] mt-2">Socratic OC</p>
            </div>
            <ProfileButton />
          </div>

          {/* Stats Overview — real counts only */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4361d9] to-[#5b7ceb] flex items-center justify-center mb-2">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-[#e8edf5]">{sessionsToday}</span>
                <span className="text-xs text-[#a8b3cf] text-center">Today</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-[#e8edf5]">{studentCount}</span>
                <span className="text-xs text-[#a8b3cf] text-center" aria-hidden="true">
                  Students
                </span>
              </div>
            </motion.div>

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

        {/* Pending Tutor Requests */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#e8edf5]">Requests from students</h2>
            <Link
              to="/tutor-requests"
              className="text-sm text-[#5b7ceb] font-semibold flex items-center gap-1"
              data-testid="tutor-home-view-all-requests"
              id="tutor-home-view-all-requests"
              aria-label="View all requests"
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
            <Link to="/schedule" className="text-sm text-[#5b7ceb] font-semibold">
              View All
            </Link>
          </div>
          {upcomingSessions.length === 0 ? (
            <div className="bg-[#1e2139] rounded-2xl p-5 border border-dashed border-[#2a2f45] text-center">
              <p className="text-sm text-[#a8b3cf] mb-1">No upcoming sessions yet</p>
              <p className="text-xs text-[#a8b3cf]">
                When students book with you, they’ll show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session, index) => (
                <Link key={session.id} to="/schedule">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#1e2139] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
                  >
                    <div className="flex items-center gap-4">
                      <AvatarWithInitials
                        src={session.studentAvatar}
                        name={session.student || session.subject}
                        className="w-14 h-14 rounded-xl object-cover text-base"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-[#e8edf5] truncate">
                          {session.student || session.subject}
                        </h3>
                        <p className="text-sm text-[#a8b3cf] truncate">{session.subject}</p>
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
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: "rgba(67, 97, 217, 0.5)" }}
                      >
                        <Video className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-6 mb-6">
          <h2 className="text-lg font-bold text-[#e8edf5] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/tutor-students"
              data-testid="tutor-home-my-students"
              id="tutor-home-my-students"
              aria-label="My Students"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              >
                <Users className="w-8 h-8 text-white mb-2" />
                <p className="text-white font-semibold">My Students</p>
              </motion.div>
            </Link>

            <Link
              to="/tutor-availability"
              data-testid="tutor-home-availability"
              id="tutor-home-availability"
              aria-label="Availability"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-[#22c55e] to-[#4ade80] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              >
                <Calendar className="w-8 h-8 text-white mb-2" />
                <p className="text-white font-semibold">Availability</p>
              </motion.div>
            </Link>

            <Link
              to="/tutor-analytics"
              data-testid="tutor-home-analytics"
              id="tutor-home-analytics"
              aria-label="Analytics"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-[#f97316] to-[#fb923c] rounded-2xl p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]"
              >
                <TrendingUp className="w-8 h-8 text-white mb-2" />
                <p className="text-white font-semibold">Analytics</p>
              </motion.div>
            </Link>

            <Link
              to="/chat"
              data-testid="tutor-home-messages"
              id="tutor-home-messages"
              aria-label="Messages"
            >
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
